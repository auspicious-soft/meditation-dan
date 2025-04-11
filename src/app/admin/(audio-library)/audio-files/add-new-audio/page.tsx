/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, ChevronLeft, Loader2, Trash2, Upload, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import {
  generateSignedUrlForAudioImage,
  generateSignedUrlForAudios,
} from "@/actions";
import { getAllCollectionStats, getBestForStats, getlevelsStats, uploadAudioStats } from "@/services/admin-services";
import { AxiosError } from "axios";// Import the server action
import { uploadCompressedImage } from "@/actions/uploadImage";

// Interface for the collection data from the backend
interface Collection {
  _id: string;
  name: string;
  imageUrl: string;
  levels: { _id: string; name: string; isActive: boolean; createdAt: string; updatedAt: string }[];
  bestFor: { _id: string; name: string; isActive: boolean; createdAt: string; updatedAt: string };
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
interface CollectionsResponse {
  success: boolean;
  message: string;
  data: {
    collections: Collection[];
  };
}
// Define FormValues type
type FormValues = {
  collectionType: string;
  songName: string;
  description: string;
  levels: string[];
  bestFor: string;
  audioFile?: FileList;
  imageFile?: FileList;
};

// Define schema
const schema = yup.object().shape({
  collectionType: yup.string().required("Collection type is required"),
  songName: yup.string().required("Song name is required"),
  description: yup.string().required("Description is required"),
  levels: yup
    .array()
    .of(yup.string().required("Each level must be a valid string"))
    .min(1, "At least one level is required")
    .required("Levels field is required"),
  bestFor: yup.string().required("Best for is required"),
  audioFile: yup
    .mixed<FileList>()
    .test("fileList", "Audio file is required", (value) => value instanceof FileList && value.length > 0),
  imageFile: yup
    .mixed<FileList>()
    .test("fileList", "Image file is required", (value) => value instanceof FileList && value.length > 0),
});

interface LevelOption {
  id: string;
  name: string;
}

interface BestForOption {
  id: string;
  name: string;
}

const AddNewAudio = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loadingCollections, setLoadingCollections] = useState<boolean>(true);
  const [isLoadingLevels, setIsLoadingLevels] = useState(false);
  const [levelsError, setLevelsError] = useState<string | null>(null);
  const [levelOptions, setLevelOptions] = useState<LevelOption[]>([]);
  const [bestForOptions, setBestForOptions] = useState<BestForOption[]>([]);
  const [isLoadingBestFor, setIsLoadingBestFor] = useState(false);
  const [bestForError, setBestForError] = useState<string | null>(null);
  const [popoverWidth, setPopoverWidth] = useState("auto");
  const audioInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      collectionType: "",
      songName: "",
      description: "",
      audioFile: undefined,
      imageFile: undefined,
      levels: [] as string[],
      bestFor: "",
    },
  });

  const selectedLevels = watch("levels") || [];
  const selectedBestFor = watch("bestFor") || "";
  const audioFile = watch("audioFile");
  const imageFile = watch("imageFile");

  const getAudioDuration = async (file: File) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    return audioBuffer.duration;
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(secs).padStart(2, "0");
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoadingCollections(true);
        const response = await getAllCollectionStats("/collection");
        const data: CollectionsResponse = await response.data;

        if (data.success) {
          setCollections(data.data.collections);
        } else {
          throw new Error(data.message || "Failed to fetch collections");
        }
      } catch (error) {
        console.error("Error fetching collections:", error);
        toast.error("Failed to load collections");
      } finally {
        setLoadingCollections(false);
      }
    };

    const fetchLevels = async () => {
      setIsLoadingLevels(true);
      setLevelsError(null);
      try {
        const response = await getlevelsStats("/level", {});
        if (response?.data?.success && Array.isArray(response?.data?.data)) {
          const transformedLevels = response.data.data
            .filter((level: any) => level.isActive)
            .map((level: any) => ({
              id: level._id,
              name: level.name,
            }));
          setLevelOptions(transformedLevels);
        } else {
          setLevelsError(response?.data?.message || "Failed to load levels");
        }
      } catch (error) {
        console.error("Error fetching levels:", error);
        setLevelsError("An error occurred while fetching levels");
      } finally {
        setIsLoadingLevels(false);
      }
    };

    const fetchBestForOptions = async () => {
      setIsLoadingBestFor(true);
      setBestForError(null);
      try {
        const response = await getBestForStats("/bestfor", {});
        if (response?.data?.success && Array.isArray(response?.data?.data)) {
          const transformedOptions = response.data.data
            .filter((option: any) => option.isActive)
            .map((option: any) => ({
              id: option._id,
              name: option.name,
            }));
          setBestForOptions(transformedOptions);
        } else {
          setBestForError(
            response?.data?.message || "Failed to load best for options"
          );
        }
      } catch (error) {
        console.error("Error fetching best for options:", error);
        setBestForError("An error occurred while fetching best for options");
      } finally {
        setIsLoadingBestFor(false);
      }
    };

    fetchLevels();
    fetchBestForOptions();
    fetchCollections();
  }, []);

  useEffect(() => {
    if (audioFile && audioFile.length > 0) {
      const audioUrl = URL.createObjectURL(audioFile[0]);
      setAudioPreview(audioUrl);
      clearErrors("audioFile");
      return () => URL.revokeObjectURL(audioUrl);
    } else {
      setAudioPreview(null);
    }
  }, [audioFile, clearErrors]);

  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const imageUrl = URL.createObjectURL(imageFile[0]);
      setImagePreview(imageUrl);
      clearErrors("imageFile");
      return () => URL.revokeObjectURL(imageUrl);
    } else {
      setImagePreview(null);
    }
  }, [imageFile, clearErrors]);

  const handleRemoveAudio = () => {
    if (audioInputRef.current) {
      audioInputRef.current.value = "";
    }
    setAudioPreview(null);
    setValue("audioFile", undefined);
    setError("audioFile", { type: "manual", message: "Audio file is required" });
  };

  const handleRemoveImage = () => {
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
    setImagePreview(null);
    setValue("imageFile", undefined);
    setError("imageFile", { type: "manual", message: "Image file is required" });
  };

  const debounce = (
    func: (...args: unknown[]) => void,
    delay: number
  ): ((...args: unknown[]) => void) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: Parameters<typeof func>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const updateWidth = () => {
    if (triggerRef.current) {
      const width = triggerRef.current.getBoundingClientRect().width;
      setPopoverWidth(`${width}px`);
    }
  };

  const debouncedUpdateWidth = debounce(updateWidth, 0);

  useEffect(() => {
    updateWidth();
    window.addEventListener("resize", debouncedUpdateWidth);
    return () => window.removeEventListener("resize", debouncedUpdateWidth);
  }, []);

  const removeLevel = (levelId: string) => {
    const newLevels = selectedLevels.filter((id) => id !== levelId);
    setValue("levels", newLevels, { shouldValidate: true });
  };

  const onSubmit = async (data: FormValues) => {
    try {
      let audioKey = null;
      let imageKey = null;
      let formattedDuration = null;

      if (!data.audioFile || data.audioFile.length === 0) {
        setError("audioFile", { type: "manual", message: "Please upload audio file" });
        return;
      }
      if (!data.imageFile || data.imageFile.length === 0) {
        setError("imageFile", { type: "manual", message: "Please upload an image file" });
        return;
      }

      if (data.audioFile && data.audioFile.length > 0) {
        const audio = data.audioFile[0];
        const duration = await getAudioDuration(audio);
        console.log("duration:", duration);

        const selectedCollection = collections.find((col) => col._id === data.collectionType);
        if (!selectedCollection) {
          toast.error("Selected collection not found");
          return;
        }
        const collectionNameForAWS = selectedCollection.name.toLowerCase();
        const songName = data.songName.toLowerCase();

        formattedDuration = formatDuration(duration);
        console.log("formattedDuration:", formattedDuration);

        const audioFileName = `${audio.name}`;
        const { signedUrl, key } = await generateSignedUrlForAudios(
          songName,
          new Date().toISOString(),
          audioFileName,
          audio.type
        );
        const audioUploadResponse = await fetch(signedUrl, {
          method: "PUT",
          body: audio,
          headers: { "Content-Type": audio.type },
        });

        if (!audioUploadResponse.ok) {
          const errorText = await audioUploadResponse.text();
          console.error("Upload failed:", {
            status: audioUploadResponse.status,
            statusText: audioUploadResponse.statusText,
            body: errorText,
          });
          throw new Error(`Failed to upload audio: ${errorText}`);
        }
        audioKey = key;
      }

      if (data.imageFile && data.imageFile.length > 0) {
        const image = data.imageFile[0];
        const formData = new FormData();
        formData.append("image", image);
        formData.append("songName", data.songName.toLowerCase());
        const { key } = await uploadCompressedImage(formData);
        imageKey = key;
        
      }

      console.log("imageKey:", imageKey);
      const payload = {
        songName: data.songName,
        collectionType: data.collectionType,
        description: data.description || "",
        audioUrl: audioKey,
        imageUrl: imageKey,
        duration: formattedDuration,
        levels: data.levels,
        bestFor: data.bestFor,
      };
      console.log("payload:", payload);

      const response = await uploadAudioStats("/admin/upload-audio", payload);

      if (response?.status === 201) {
        toast.success("Audio added successfully");
        setTimeout(() => {
          window.location.href = "/admin/audio-files";
        }, 1000);
      } else {
        toast.error(response?.data?.message || "Failed to add audio");
      }
    } catch (error) {
      console.log("Error while uploading audio:", error);
      if (error instanceof AxiosError && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error instanceof Error ? error.message : "An error occurred while adding audio");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-6 bg-[#1B2236] text-white rounded-lg shadow-md"
    >
      <div className="flex items-center mb-4 gap-2">
        <Button
          variant="destructive"
          className="bg-[#0B132B] hover:bg-[#0B132B] p-0 h-7 w-7 hover:cursor-pointer"
          onClick={() => (window.location.href = "/admin/all-collections")}
        >
          <ChevronLeft />
        </Button>
        <h2 className="text-xl font-semibold">Add New Audio</h2>
      </div>
      <Label className="text-gray-300 mb-3 block">Collection Type</Label>
      <Controller
        name="collectionType"
        control={control}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger className="mb-4 w-full bg-[#0B132B] h-12 border-none text-white">
              <SelectValue
                placeholder={
                  loadingCollections
                    ? <Loader2 size={24} className="animate-spin text-white" />
                    : "Select Collection Type"
                }
              />
            </SelectTrigger>
            <SelectContent className="bg-[#0B132B] border-gray-700 text-white">
              {loadingCollections ? (
                <SelectItem value="loading"><Loader2 size={24} className="animate-spin text-black" /></SelectItem>
              ) : collections.length > 0 ? (
                collections.map((collection) => (
                  <SelectItem key={collection._id} value={collection._id}>
                    {collection.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-collections">No collections available</SelectItem>
              )}
            </SelectContent>
          </Select>
        )}
      />
      {errors.collectionType && (
        <p className="text-red-500 text-xs mb-4">
          {errors.collectionType.message}
        </p>
      )}

      <Label className="text-gray-300 mb-3 block">Song Name</Label>
      <Input
        {...register("songName")}
        placeholder="Enter Song Name"
        className="mb-4 bg-[#0B132B] border-none h-12 placeholder:text-white text-white "
      />
      {errors.songName && (
        <p className="text-red-500 text-xs mb-4">{errors.songName.message}</p>
      )}

      <Label className="text-gray-300 mb-3 block">Level</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            ref={triggerRef}
            variant="outline"
            className="w-full justify-between text-left h-12 text-gray-300 hover:bg-[#0B132B] hover:text-white border-none mb-2"
          >
            {isLoadingLevels ? (
              <span><Loader2 size={24} className="animate-spin text-white" /></span>
            ) : selectedLevels.length > 0 ? (
              <div className="flex flex-wrap gap-2 items-center">
                {selectedLevels.map((levelId) => {
                  const level = levelOptions.find((l) => l.id === levelId);
                  return (
                    <span
                      key={levelId}
                      className="bg-[#334155] py-1 px-2 rounded-md text-white flex items-center"
                    >
                      {level?.name || levelId}
                      <span
                        className="ml-1 h-4 w-4 flex items-center justify-center cursor-pointer text-gray-400 hover:text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeLevel(levelId);
                        }}
                      >
                        <X size={12} />
                      </span>
                    </span>
                  );
                })}
              </div>
            ) : (
              <span>Select levels</span>
            )}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0 bg-[#0B132B] border-gray-700"
          style={{ width: popoverWidth }}
        >
          {isLoadingLevels ? (
            <div className="p-2 text-gray-500"><Loader2 size={24} className="animate-spin text-white" /></div>
          ) : levelsError ? (
            <div className="p-2 text-red-500">{levelsError}</div>
          ) : levelOptions.length === 0 ? (
            <div className="p-2 text-gray-500">No levels available</div>
          ) : (
            levelOptions.map((level) => (
              <div
                key={level.id}
                className={`space-x-2 p-2 text-white ${
                  selectedLevels.includes(level.id) ? "bg-[#1B2236]" : ""
                }`}
                onClick={() => {
                  const newLevels = selectedLevels.includes(level.id)
                    ? selectedLevels.filter((l) => l !== level.id)
                    : [...selectedLevels, level.id];
                  setValue("levels", newLevels, { shouldValidate: true });
                }}
              >
                {level.name}
              </div>
            ))
          )}
        </PopoverContent>
      </Popover>
      {errors.levels && (
        <p className="text-red-500 text-sm">{errors.levels.message}</p>
      )}

      <Label className="text-gray-300 mb-3 block">Best for</Label>
      <Select
        onValueChange={(value) => setValue("bestFor", value, { shouldValidate: true })}
        value={selectedBestFor}
      >
        <SelectTrigger className="mb-2 w-full bg-[#0B132B] h-12 border-none text-white">
          <SelectValue
            placeholder={
              isLoadingBestFor
                ? <Loader2 size={24} className="animate-spin text-white" />
                : "Select Best For"
            }
          />
        </SelectTrigger>
        <SelectContent className="bg-[#0B132B] border-gray-700 text-white">
          {isLoadingBestFor ? (
            <div className="p-2 text-gray-500"><Loader2 size={24} className="animate-spin text-white" /></div>
          ) : bestForError ? (
            <div className="p-2 text-red-500">{bestForError}</div>
          ) : bestForOptions.length === 0 ? (
            <div className="p-2 text-gray-500">
              No best for options available
            </div>
          ) : (
            bestForOptions.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
      {errors.bestFor && (
        <p className="text-red-500 text-sm">{errors.bestFor.message}</p>
      )}

      <Label className="text-gray-300 mb-3 block">Description</Label>
      <Textarea
        {...register("description")}
        placeholder="Enter Description"
        className="mb-4 bg-[#0B132B] border-none text-white"
      />
      {errors.description && (
        <p className="text-red-500 text-xs mb-4">
          {errors.description.message}
        </p>
      )}

      <div className="flex flex-wrap items-center space-x-16">
        <div>
          <Label className="text-gray-300 mb-3 block">Upload Song</Label>
          <div className="flex flex-wrap items-end gap-4 mb-4">
            <Card className="w-44 h-44 flex items-center justify-center bg-[#0B132B] border-none rounded-lg relative">
              {audioPreview ? (
                <>
                  <audio
                    src={audioPreview}
                    controls
                    className="w-full h-full object-contain"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-0 hover:bg-[#373f57] right-0 text-zinc-500"
                    onClick={handleRemoveAudio}
                  >
                    <Trash2
                      size={16}
                      className="text-white hover:cursor-pointer"
                    />
                  </Button>
                </>
              ) : (
                <Upload size={32} className="text-gray-400" />
              )}
            </Card>
            <div>
              <label htmlFor="audio-upload">
                <input
                  type="file"
                  className="hidden"
                  id="audio-upload"
                  accept=".mp3,.aac,.ogg,.wav"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files) {
                      setValue("audioFile", files, { shouldValidate: true });
                      setAudioPreview(URL.createObjectURL(files[0]));
                    }
                  }}
                  ref={audioInputRef}
                />
                <div className="border p-1 px-4 rounded-sm border-white text-gray-300 cursor-pointer">
                  {audioPreview ? "Change Audio File" : "Choose Audio File"}
                </div>
              </label>
            </div>
          </div>
          <p className="text-xs text-gray-500 mb-4">Max size: 30 MB</p>
          {errors.audioFile && (
            <p className="text-red-500 text-xs mb-4">
              {errors.audioFile.message}
            </p>
          )}
        </div>

        <div>
          <Label className="text-gray-300 mb-3 block">Upload Audio Image</Label>
          <div className="flex flex-wrap items-end gap-4 mb-4">
            <Card className="w-44 h-44 flex items-center justify-center bg-[#0B132B] border-none rounded-lg relative">
              {imagePreview ? (
                <>
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={170}
                    height={220}
                    className="rounded-lg w-full h-full object-cover"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-0 hover:bg-[#373f57] right-0 text-zinc-500"
                    onClick={handleRemoveImage}
                  >
                    <Trash2
                      size={16}
                      className="text-white hover:cursor-pointer"
                    />
                  </Button>
                </>
              ) : (
                <Upload size={32} className="text-gray-400" />
              )}
            </Card>
            <div>
              <label htmlFor="image-upload">
                <input
                  type="file"
                  className="hidden"
                  id="image-upload"
                  accept="image/jpeg,image/png"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files) {
                      setValue("imageFile", files, { shouldValidate: true });
                      setImagePreview(URL.createObjectURL(files[0]));
                    }
                  }}
                  ref={imageInputRef}
                />
                <div className="border p-1 px-4 rounded-sm border-white text-gray-300 cursor-pointer">
                  {imagePreview ? "Change Image" : "Choose Image"}
                </div>
              </label>
            </div>
          </div>
          <p className="text-xs text-gray-500 mb-4">Size: 170x170 pixels</p>
          {errors.imageFile && (
            <p className="text-red-500 text-xs mb-4">
              {errors.imageFile.message}
            </p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        className="bg-[#1A3F70] hover:cursor-pointer hover:bg-[#1A3F70] max-w-52"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Uploading..." : "Upload"}
      </Button>
    </form>
  );
};

export default AddNewAudio;