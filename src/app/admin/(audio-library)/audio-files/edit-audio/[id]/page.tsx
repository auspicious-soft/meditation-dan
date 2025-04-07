/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState, useRef, ChangeEvent } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"; // Added Dialog components
import { AlertCircle, ChevronDown, ChevronLeft, Trash2, Upload, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import {
  generateSignedUrlForAudioImage,
  generateSignedUrlForAudios,
} from "@/actions";
import {
  getAllCollectionStats,
  getBestForStats,
  getlevelsStats,
  deleteAudio,
  getAudioDataById,
  updateAudioStats,
} from "@/services/admin-services";
import { AxiosError } from "axios";

// Interfaces for type safety
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
  data: { collections: Collection[] };
}

interface Audio {
  _id: string;
  songName: string;
  description: string;
  collectionType: { _id: string; name: string };
  levels: { _id: string; name: string }[];
  bestFor: { _id: string; name: string }[];
  audioUrl: string;
  imageUrl: string;
  duration: string;
}

interface AudioResponse {
  success: boolean;
  message: string;
  data: Audio;
}

type FormValues = {
  collectionType: string;
  collectionName?: string;
  songName: string;
  description: string;
  levels: string[];
  bestFor: string;
  audioFile?: FileList | null;
  imageFile?: FileList | null;
  audioUrl?: string;
  imageUrl?: string;
};

// Validation schema using Yup
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
  audioFile: yup.mixed<FileList>().nullable(),
  imageFile: yup.mixed<FileList>().nullable(),
});

interface LevelOption {
  id: string;
  name: string;
}

interface BestForOption {
  id: string;
  name: string;
}

const GetAudio = () => {
  const { id } = useParams();
  const [audioId, setAudioId] = useState<string | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingAudioUrl, setExistingAudioUrl] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [existingDuration, setExistingDuration] = useState<string | null>(null);
  const [loadingCollections, setLoadingCollections] = useState<boolean>(true);
  const [isLoadingLevels, setIsLoadingLevels] = useState(false);
  const [levelsError, setLevelsError] = useState<string | null>(null);
  const [levelOptions, setLevelOptions] = useState<LevelOption[]>([]);
  const [isLoadingBestFor, setIsLoadingBestFor] = useState(false);
  const [bestForError, setBestForError] = useState<string | null>(null);
  const [bestForOptions, setBestForOptions] = useState<BestForOption[]>([]);
  const [isLevelsOpen, setIsLevelsOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State for dialog
  const audioInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const levelsTriggerRef = useRef<HTMLButtonElement>(null);
  const [levelsPopoverWidth, setLevelsPopoverWidth] = useState("auto");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    setError,
    formState: { errors, isSubmitting },
    clearErrors,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      collectionType: "",
      songName: "",
      description: "",
      audioFile: null,
      imageFile: null,
      levels: [],
      bestFor: "",
    },
  });

  // Helper function to construct S3 URL
  const getS3Url = (subPath: string) => {
    return `${process.env.NEXT_PUBLIC_AWS_BUCKET_PATH}${subPath}`;
  };

  const selectedLevels = watch("levels") || [];
  const selectedBestFor = watch("bestFor") || "";
  const selectedCollectionType = watch("collectionType") || "";
  const audioFile = watch("audioFile");
  const imageFile = watch("imageFile");

  // Fetch initial data
  useEffect(() => {
    const fetchAudioData = async () => {
      const audioIdParam = Array.isArray(id) ? id[0] : id;
      if (!audioIdParam) return;

      setAudioId(audioIdParam);
      try {
        const response = await getAudioDataById(`/audio/${audioIdParam}`);
        const data: AudioResponse = await response.data;
        if (data.success) {
          const audioData = data.data;
          reset({
            collectionType: audioData.collectionType._id,
            collectionName: audioData.collectionType.name,
            songName: audioData.songName,
            description: audioData.description,
            levels: audioData.levels.map((level) => level._id),
            bestFor: audioData.bestFor[0]?._id || "",
            audioFile: null,
            imageFile: null,
            audioUrl: audioData.audioUrl,
            imageUrl: audioData.imageUrl,
          });

          if (audioData.audioUrl) {
            const audioUrl = getS3Url(audioData.audioUrl);
            setExistingAudioUrl(audioData.audioUrl);
            setAudioPreview(audioUrl);
          }
          if (audioData.imageUrl) {
            const imageUrl = getS3Url(audioData.imageUrl);
            setExistingImageUrl(audioData.imageUrl);
            setImagePreview(imageUrl);
          }
          setExistingDuration(audioData.duration);
        } else {
          throw new Error(data.message || "Failed to fetch audio data");
        }
      } catch (error) {
        console.error("Error fetching audio data:", error);
        toast.error("Failed to load audio data");
      }
    };

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
            .map((level: any) => ({ id: level._id, name: level.name }));
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
            .map((option: any) => ({ id: option._id, name: option.name }));
          setBestForOptions(transformedOptions);
        } else {
          setBestForError(response?.data?.message || "Failed to load best for options");
        }
      } catch (error) {
        console.error("Error fetching best for options:", error);
        setBestForError("An error occurred while fetching best for options");
      } finally {
        setIsLoadingBestFor(false);
      }
    };

    fetchAudioData();
    fetchLevels();
    fetchBestForOptions();
    fetchCollections();
  }, [id, reset]);

  // Update audio preview when file changes
  useEffect(() => {
    if (audioFile && audioFile.length > 0) {
      const audioUrl = URL.createObjectURL(audioFile[0]);
      setAudioPreview(audioUrl);
      setExistingAudioUrl(null);
      return () => URL.revokeObjectURL(audioUrl);
    } else if (existingAudioUrl) {
      setAudioPreview(getS3Url(existingAudioUrl));
    } else {
      setAudioPreview(null);
    }
  }, [audioFile, existingAudioUrl]);

  // Update image preview when file changes
  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const imageUrl = URL.createObjectURL(imageFile[0]);
      setImagePreview(imageUrl);
      setExistingImageUrl(null);
      return () => URL.revokeObjectURL(imageUrl);
    } else if (existingImageUrl) {
      setImagePreview(getS3Url(existingImageUrl));
    } else {
      setImagePreview(null);
    }
  }, [imageFile, existingImageUrl]);

  // Handler functions
  const handleRemoveAudio = () => {
    if (audioInputRef.current) audioInputRef.current.value = "";
    setAudioPreview(null);
    setExistingAudioUrl(null);
    setValue("audioFile", null); // Clear the form value
    setError("audioFile", { type: "manual", message: "Audio file is required" }); // Show validation error
  };
  
  const handleRemoveImage = () => {
    if (imageInputRef.current) imageInputRef.current.value = "";
    setImagePreview(null);
    setExistingImageUrl(null);
    setValue("imageFile", null); // Clear the form value
    setError("imageFile", { type: "manual", message: "Image file is required" }); // Show validation error
  };

  const removeLevel = (levelId: string) => {
    const newLevels = selectedLevels.filter((id) => id !== levelId);
    setValue("levels", newLevels);
  };

  const addLevel = (levelId: string) => {
    if (!selectedLevels.includes(levelId)) {
      setValue("levels", [...selectedLevels, levelId]);
    }
    setIsLevelsOpen(false);
  };

  // Debounce function for resize handling
  const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const updateLevelsWidth = () => {
    if (levelsTriggerRef.current) {
      const width = levelsTriggerRef.current.getBoundingClientRect().width;
      setLevelsPopoverWidth(`${width}px`);
    }
  };

  const debouncedUpdateLevelsWidth = debounce(updateLevelsWidth, 100);

  useEffect(() => {
    updateLevelsWidth();
    window.addEventListener("resize", debouncedUpdateLevelsWidth);
    return () => {
      window.removeEventListener("resize", debouncedUpdateLevelsWidth);
    };
  }, []);

  // Form submission handler
  const onSubmit = async (data: FormValues) => {
    if (!audioId) return;

    try {
      let audioKey = existingAudioUrl || null;
      let imageKey = existingImageUrl || null;
      let formattedDuration = null;

      // Handle audio file
      if (!data.audioFile || data.audioFile.length === 0) {
        if (!existingAudioUrl) {
          setError("audioFile", { type: "manual", message: "Please upload audio file" });
          return;
        }
      } else {
        const audio = data.audioFile[0];
        const duration = await getAudioDuration(audio);

        const selectedCollection = collections.find(
          (col) => col._id === data.collectionType
        );
        if (!selectedCollection) {
          toast.error("Selected collection not found");
          return;
        }
        const songName = data.songName.toLowerCase();

        formattedDuration = formatDuration(duration);

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
          throw new Error(`Failed to upload audio: ${errorText}`);
        }
        audioKey = key;
      }

      // Handle image file
      if (!data.imageFile || data.imageFile.length === 0) {
        if (!existingImageUrl) {
          setError("imageFile", { type: "manual", message: "Please upload Image file" });
          return;
        }
      } else {
        const image = data.imageFile[0];
        const selectedCollection = collections.find(
          (col) => col._id === data.collectionType
        );
        if (!selectedCollection) {
          toast.error("Selected collection not found");
          return;
        }
        const songName = data.songName.toLowerCase();
        const imageFileName = `${image.name}`;
        const { signedUrl, key } = await generateSignedUrlForAudioImage(
          songName,
          new Date().toISOString(),
          imageFileName,
          image.type
        );
        const imageUploadResponse = await fetch(signedUrl, {
          method: "PUT",
          body: image,
          headers: { "Content-Type": image.type },
        });

        if (!imageUploadResponse.ok) {
          throw new Error("Failed to upload image to S3");
        }
        imageKey = key;
      }

      // Prepare payload with bestFor as an array of strings
      const payload = {
        songName: data.songName,
        collectionType: data.collectionType,
        description: data.description || "",
        audioUrl: audioKey,
        imageUrl: imageKey,
        duration: formattedDuration || existingDuration,
        levels: data.levels,
        bestFor: [data.bestFor], // Send bestFor as an array
      };

      const response = await updateAudioStats(`/admin/update/audio/${audioId}`, payload);

      if (response?.status === 200) {
        toast.success("Collection updated successfully");
        setImagePreview(null);
        setExistingAudioUrl(null);
        setTimeout(() => {
          window.location.href = "/admin/audio-files";
        }, 1000);
      } else {
        toast.error(response?.data?.message || "Failed to update collection");
      }
    } catch (error) {
      console.log("error while updating collection:", error);
      toast.error("An error occurred while updating collection");
    }
  };

  // Delete audio handler with confirmation
  const handleDelete = async () => {
    if (!audioId) return;

    try {
      const response = await deleteAudio(`/admin/delete-audio/${id}`);
      if (response?.data?.success) {
        toast.success("Audio deleted successfully");
        setIsDialogOpen(false); // Close dialog on success
        setTimeout(() => {
          window.location.href = "/admin/audio-files";
        }, 1000);
      } else {
        throw new Error(response?.data?.message || "Failed to delete audio");
      }
    } catch (error) {
      console.error("Error deleting audio:", error);
      toast.error("Failed to delete audio");
      setIsDialogOpen(false); // Close dialog on error
    }
  };

  // Utility functions
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

  // JSX Form
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-6 bg-[#1B2236] text-white rounded-lg shadow-md"
    >
      <div className="flex gap-2 items-center mb-4">
      <Button
            variant="destructive"
            className="bg-[#0B132B] hover:bg-[#0B132B] p-0 h-7 w-7 hover:cursor-pointer"
            onClick={() => (window.location.href = "/admin/all-collections")}
          >
            <ChevronLeft  />
          </Button>
        <h2 className="text-xl font-semibold">Edit Audio</h2>
      </div>

      <Label className="text-gray-300 mb-3 block">Collection Type</Label>
      <Select
        onValueChange={(value) => {
          if (!loadingCollections) {
            setValue("collectionType", value);
          }
        }}
        value={selectedCollectionType}
      >
        <SelectTrigger className="mb-4 w-full bg-[#0B132B] h-12 border-none text-white">
          <SelectValue placeholder="Select Collection Type" />
        </SelectTrigger>
        <SelectContent className="bg-[#0B132B] border-gray-700 text-white">
          {loadingCollections ? (
            <SelectItem value="loading" disabled>
              Loading collections...
            </SelectItem>
          ) : collections.length > 0 ? (
            collections.map((collection) => (
              <SelectItem key={collection._id} value={collection._id}>
                {collection.name}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="no-collections" disabled>
              No collections available
            </SelectItem>
          )}
        </SelectContent>
      </Select>
      {errors.collectionType && (
        <p className="text-red-500 text-xs mb-4">{errors.collectionType.message}</p>
      )}

      <Label className="text-gray-300 mb-3 block">Song Name</Label>
      <Input
        {...register("songName")}
        placeholder="Enter Song Name"
        className="mb-4 bg-[#0B132B] border-none h-12 placeholder:text-white text-white"
      />
      {errors.songName && (
        <p className="text-red-500 text-xs mb-4">{errors.songName.message}</p>
      )}

      <Label className="text-gray-300 mb-3 block">Level</Label>
      <Popover open={isLevelsOpen} onOpenChange={setIsLevelsOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={levelsTriggerRef}
            variant="outline"
            className="mb-2 w-full bg-[#0B132B] hover:bg-[#0B132B] hover:cursor-pointer h-12 border-none text-white justify-between"
          >
            <div className="flex flex-wrap gap-2 items-center">
              {isLoadingLevels ? (
                <span>Loading levels...</span>
              ) : selectedLevels.length > 0 ? (
                selectedLevels.map((levelId) => {
                  const level = levelOptions.find((l) => l.id === levelId);
                  return (
                    <span
                      key={levelId}
                      className="bg-[#1B2236] p-1 rounded-md text-white flex items-center"
                    >
                      {level?.name || levelId}
                      <span
                        className="h-4 w-4 ml-1 flex items-center justify-center cursor-pointer text-gray-400 hover:text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeLevel(levelId);
                        }}
                      >
                        <X size={12} />
                      </span>
                    </span>
                  );
                })
              ) : (
                <span className="text-gray-400">Select Levels</span>
              )}
            </div>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="bg-[#0B132B] border-gray-700 text-white p-0"
          style={{ width: levelsPopoverWidth }}
        >
          {isLoadingLevels ? (
            <div className="p-2 text-gray-500">Loading levels...</div>
          ) : levelsError ? (
            <div className="p-2 text-red-500">{levelsError}</div>
          ) : levelOptions.length === 0 ? (
            <div className="p-2 text-gray-500">No levels available</div>
          ) : (
            levelOptions.map((level) => (
              <div
                key={level.id}
                className={`p-2 hover:bg-[#1B2236] cursor-pointer ${
                  selectedLevels.includes(level.id) ? "bg-[#1B2236]" : ""
                }`}
                onClick={() => addLevel(level.id)}
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
        onValueChange={(value) => {
          console.log("Best for onValueChange triggered with value:", value);
          if (!isLoadingBestFor) {
            setValue("bestFor", value);
          }
        }}
        value={selectedBestFor}
      >
        <SelectTrigger className="mb-4 w-full bg-[#0B132B] h-12 border-none text-white">
          <SelectValue placeholder="Select Best For" />
        </SelectTrigger>
        <SelectContent className="bg-[#0B132B] border-gray-700 text-white">
          {isLoadingBestFor ? (
            <SelectItem value="loading" disabled>
              Loading best for options...
            </SelectItem>
          ) : bestForOptions.length > 0 ? (
            bestForOptions.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.name}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="no-options" disabled>
              No best for options available
            </SelectItem>
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
        <p className="text-red-500 text-xs mb-4">{errors.description.message}</p>
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
                    className="absolute top-0 right-0 hover:cursor-pointer hover:bg-[#373f57] text-zinc-500"
                    onClick={handleRemoveAudio}
                  >
                    <Trash2 size={16} className="text-white hover:cursor-pointer" />
                  </Button>
                </>
              ) : (
                <Upload size={32} className="text-gray-400" />
              )}
            </Card>
            <label htmlFor="audio-upload">
  <input
    type="file"
    className="hidden"
    id="audio-upload"
    accept=".mp3,.aac,.ogg,.wav"
    onChange={(e: ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files) {
        setValue("audioFile", files); // Update the form value
        const audioUrl = URL.createObjectURL(files[0]);
        setAudioPreview(audioUrl); // Update the preview
        clearErrors("audioFile"); // Clear validation error
      }
    }}
    ref={audioInputRef}
  />
  <div className="border p-1 px-4 rounded-sm border-white text-gray-300 cursor-pointer">
    {audioPreview ? "Change Audio File" : "Choose Audio File"}
  </div>
</label>
          </div>
          <p className="text-xs text-gray-500 mb-4">Max size: 30 MB</p>
          {errors.audioFile && (
            <p className="text-red-500 text-xs mb-4">{errors.audioFile.message}</p>
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
                    className="absolute top-0 right-0 hover:cursor-pointer hover:bg-[#373f57] text-zinc-500"
                    onClick={handleRemoveImage}
                  >
                    <Trash2 size={16} className="text-white hover:cursor-pointer" />
                  </Button>
                </>
              ) : (
                <Upload size={32} className="text-gray-400" />
              )}
            </Card>
            <label htmlFor="image-upload">
  <input
    type="file"
    className="hidden"
    id="image-upload"
    accept="image/jpeg,image/png"
    onChange={(e: ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files) {
        setValue("imageFile", files); // Update the form value
        const imageUrl = URL.createObjectURL(files[0]);
        setImagePreview(imageUrl); // Update the preview
        clearErrors("imageFile"); // Clear validation error
      }
    }}
    ref={imageInputRef}
  />
  <div className="border p-1 px-4 rounded-sm border-white text-gray-300 cursor-pointer">
    {imagePreview ? "Change Image" : "Choose Image"}
  </div>
</label>
          </div>
          <p className="text-xs text-gray-500 mb-4">Size: 170x170 pixels</p>
          {errors.imageFile && (
            <p className="text-red-500 text-xs mb-4">{errors.imageFile.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap justify-start items-center gap-2">
        <Button
          type="submit"
          className="bg-[#1A3F70] hover:cursor-pointer hover:bg-[#1A3F70] w-52"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="destructive"
              className="bg-[#FF4747] hover:cursor-pointer hover:bg-[#FF4747] w-52"
            >
              Delete Audio
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1B2236] text-center w-96 flex flex-col justify-center items-center text-white border border-[#334155]">
          <DialogHeader className="flex flex-col items-center">
            <div className="mb-4 p-3 bg-[#FEF3F2] rounded-full">
              <AlertCircle size={40} className="text-red-500" />
            </div>
            <DialogTitle className="text-xl font-semibold">
              Delete Audio?
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-center">
              Are you sure you want to delete this audio? <br />
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
            <DialogFooter className="flex  items-center justify-center gap-4">
              <Button
                variant="outline"
                className="bg-[#1A3F70] border-none hover:cursor-pointer hover:text-white hover:bg-#1A3F70] w-42"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="bg-[#FF4747] border-none hover:cursor-pointer hover:bg-[#FF4747] w-42"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </form>
  );
};

export default GetAudio;