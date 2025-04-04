/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ChevronDown, Loader2, Trash2, Upload, X } from "lucide-react";
import Image from "next/image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { generateSignedUrlForCollectionImage } from "@/actions";
import {
  getBestForStats,
  getlevelsStats,
  uploadCollectionStats,
} from "@/services/admin-services";
import { toast } from "sonner";
import { timeStamp } from "console";

// Validation Schema
const schema = yup.object({
  collectionName: yup.string().required("Collection name is required"),
  description: yup.string().required("Description is required"),
  levels: yup
    .array()
    .of(yup.string().required("Each level must be a valid string"))
    .min(1, "At least one level is required")
    .required("Levels field is required"),
  bestFor: yup
    .array()
    .of(yup.string().required("Each best for must be a valid string"))
    .min(1, "At least one best for is required")
    .required("Best for field is required"),
  imageFile: yup
    .mixed<File>()
    .nullable()
    .nullable()
    .test("fileRequired", "Image file is required", (value) => {
      return value instanceof File && value.size > 0;
    }),
});

interface LevelOption {
  id: string;
  name: string;
}

interface BestForOption {
  id: string;
  name: string;
}

const AddCollectionForm = () => {
  const [levelOptions, setLevelOptions] = useState<LevelOption[]>([]);
  const [bestForOptions, setBestForOptions] = useState<BestForOption[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoadingLevels, setIsLoadingLevels] = useState(false);
  const [levelsError, setLevelsError] = useState<string | null>(null);
  const [isLoadingBestFor, setIsLoadingBestFor] = useState(false);
  const [bestForError, setBestForError] = useState<string | null>(null);
  const [isLevelsOpen, setIsLevelsOpen] = useState(false);
  const [isBestForOpen, setIsBestForOpen] = useState(false);
  const [levelsPopoverWidth, setLevelsPopoverWidth] = useState("auto");
  const [bestForPopoverWidth, setBestForPopoverWidth] = useState("auto");
  const levelsTriggerRef = useRef<HTMLButtonElement>(null);
  const bestForTriggerRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "onChange", // Enable real-time validation
    defaultValues: {
      collectionName: "",
      description: "",
      levels: [] as string[],
      bestFor: [] as string[],
      imageFile: null, // Explicitly set to null
    },
  });

  const selectedLevels = watch("levels") || [];
  const selectedBestFor = watch("bestFor") || [];
  const imageFile = watch("imageFile");

  useEffect(() => {
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
  }, []);

  // Debounce function to limit how often width updates are called
  const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Update popover widths
  const updateLevelsWidth = () => {
    if (levelsTriggerRef.current) {
      const width = levelsTriggerRef.current.getBoundingClientRect().width;
      setLevelsPopoverWidth(`${width}px`);
    }
  };

  const updateBestForWidth = () => {
    if (bestForTriggerRef.current) {
      const width = bestForTriggerRef.current.getBoundingClientRect().width;
      setBestForPopoverWidth(`${width}px`);
    }
  };

  const debouncedUpdateLevelsWidth = debounce(updateLevelsWidth, 100);
  const debouncedUpdateBestForWidth = debounce(updateBestForWidth, 100);

  useEffect(() => {
    updateLevelsWidth();
    updateBestForWidth();
    window.addEventListener("resize", debouncedUpdateLevelsWidth);
    window.addEventListener("resize", debouncedUpdateBestForWidth);
    return () => {
      window.removeEventListener("resize", debouncedUpdateLevelsWidth);
      window.removeEventListener("resize", debouncedUpdateBestForWidth);
    };
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setValue("imageFile", file, { shouldValidate: true }); // Trigger validation
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setValue("imageFile", null, { shouldValidate: true }); // Trigger validation
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeLevel = (levelId: string) => {
    const newLevels = selectedLevels.filter((id) => id !== levelId);
    setValue("levels", newLevels, { shouldValidate: true }); // Trigger validation
  };

  const removeBestFor = (bestForId: string) => {
    const newBestFor = selectedBestFor.filter((id) => id !== bestForId);
    setValue("bestFor", newBestFor, { shouldValidate: true }); // Trigger validation
  };

  const addLevel = (levelId: string) => {
    if (!selectedLevels.includes(levelId)) {
      setValue("levels", [...selectedLevels, levelId], { shouldValidate: true }); // Trigger validation
    }
    setIsLevelsOpen(false);
  };

  const addBestFor = (bestForId: string) => {
    if (!selectedBestFor.includes(bestForId)) {
      setValue("bestFor", [...selectedBestFor, bestForId], { shouldValidate: true }); // Trigger validation
    }
    setIsBestForOpen(false);
  };

  interface FormData {
    collectionName: string;
    description: string;
    levels: string[];
    bestFor: string[];
    imageFile?: File | null; // Allow undefined
  }

  const onSubmit = async (data: FormData) => {
    try {
      let imageKey = "";
      const imageFile = data.imageFile as File;

      if (!data.imageFile) {
        setError("imageFile", {
          type: "manual",
          message: "Please upload an image file",
        });
        return;
      }

      if (data.imageFile) {
        const image = data.imageFile;
        const bestForNames = data.bestFor
          .map(
            (id) =>
              bestForOptions.find((option) => option.id === id)?.name.toLowerCase() || ""
          )
          .join("-");
        const collectionName = data.collectionName;
        const imageFileName = `${imageFile.name}`;

        const { signedUrl, key } = await generateSignedUrlForCollectionImage(
          collectionName,
          new Date().toISOString(),
          imageFileName,
          image.type
        );

        const imageUploadResponse = await fetch(signedUrl, {
          method: "PUT",
          body: image,
          headers: {
            "Content-Type": image.type,
          },
        });

        if (!imageUploadResponse.ok) {
          throw new Error("Failed to upload image to S3");
        }
        imageKey = key;
      }

      const collectionData = {
        name: data.collectionName,
        imageUrl: imageKey,
        levels: data.levels,
        bestFor: data.bestFor,
        description: data.description,
      };
      console.log('collectionData:', collectionData);

      const response = await uploadCollectionStats(
        "/admin/upload-collection",
        collectionData
      );

      if (response?.status === 201) {
        toast.success("Collection added successfully");
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        window.location.href = "/admin/all-collections";
      } else {
        toast.error(response?.data?.message || "Failed to add collection");
      }
    } catch (error) {
      console.log("error while uploading collection:", error);
      toast.error("An error occurred while adding collection");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-6 bg-[#1B2236] text-white rounded-lg shadow-md"
    >
      <h2 className="text-xl font-semibold mb-4">Add New Collection</h2>

      <Label className="text-gray-300 mb-3 block">Collection Name</Label>
      <Input
        {...register("collectionName")}
        placeholder="Enter Collection Name"
        className="mb-2 bg-[#0B132B] border-none h-12 text-white "
      />
      {errors.collectionName && (
        <p className="text-red-500 text-sm mt-[-7px]">{errors.collectionName.message}</p>
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
                <span><Loader2 size={24} className="animate-spin text-white" /></span>
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
            <div className="p-2 text-gray-500"><Loader2 size={24} className="animate-spin text-white" /></div>
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
        <p className="text-red-500 text-sm mt-[-7px]">{errors.levels.message}</p>
      )}

      <Label className="text-gray-300 mb-3 block">Best for</Label>
      <Popover open={isBestForOpen} onOpenChange={setIsBestForOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={bestForTriggerRef}
            variant="outline"
            className="mb-2 w-full bg-[#0B132B] hover:bg-[#0B132B] hover:cursor-pointer h-12 border-none text-white justify-between"
          >
            <div className="flex flex-wrap gap-2 items-center">
              {isLoadingBestFor ? (
                <span><Loader2 size={24} className="animate-spin text-white" /></span>
              ) : selectedBestFor.length > 0 ? (
                selectedBestFor.map((bestForId) => {
                  const bestFor = bestForOptions.find((b) => b.id === bestForId);
                  return (
                    <span
                      key={bestForId}
                      className="bg-[#1B2236] p-1 rounded-md text-white flex items-center"
                    >
                      {bestFor?.name || bestForId}
                      <span
                        className="h-4 w-4 ml-1 flex items-center justify-center cursor-pointer text-gray-400 hover:text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeBestFor(bestForId);
                        }}
                      >
                        <X size={12} />
                      </span>
                    </span>
                  );
                })
              ) : (
                <span className="text-gray-400">Select Best For</span>
              )}
            </div>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="bg-[#0B132B] border-gray-700 text-white p-0"
          style={{ width: bestForPopoverWidth }}
        >
          {isLoadingBestFor ? (
            <div className="p-2 text-gray-500"><Loader2 size={24} className="animate-spin text-white" /></div>
          ) : bestForError ? (
            <div className="p-2 text-red-500">{bestForError}</div>
          ) : bestForOptions.length === 0 ? (
            <div className="p-2 text-gray-500">No best for options available</div>
          ) : (
            bestForOptions.map((option) => (
              <div
                key={option.id}
                className={`p-2 hover:bg-[#1B2236] cursor-pointer ${
                  selectedBestFor.includes(option.id) ? "bg-[#1B2236]" : ""
                }`}
                onClick={() => addBestFor(option.id)}
              >
                {option.name}
              </div>
            ))
          )}
        </PopoverContent>
      </Popover>
      {errors.bestFor && (
        <p className="text-red-500 text-sm mt-[-7px]">{errors.bestFor.message}</p>
      )}

      <Label className="text-gray-300 mb-3 block">Description</Label>
      <Textarea
        {...register("description")}
        placeholder=""
        className="mb-2 bg-[#0B132B] border-none text-white"
      />
      {errors.description && (
        <p className="text-red-500 text-sm mt-[-7px]">{errors.description.message}</p>
      )}

      <Label className="text-gray-300 mb-3 block">Upload Collection Image</Label>
      <div className="flex flex-wrap items-end gap-4 mb-2">
        <Card className="w-64 min-h-40 flex items-center py-0 justify-center bg-[#0B132B] border-none rounded-lg relative">
          {imagePreview ? (
            <>
              <Image
                src={imagePreview}
                alt="Preview"
                width={300}
                height={300}
                className=" object-cover"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-0 right-0 hover:bg-[#373f57] hover:cursor-pointer text-zinc-500"
                onClick={handleRemoveImage}
              >
                <Trash2 size={16} className="text-white" />
              </Button>
            </>
          ) : (
            <Upload size={32} className="text-gray-400" />
          )}
        </Card>
        <div className="md:">
          <label htmlFor="file-upload">
            <input
              type="file"
              className="hidden"
              id="file-upload"
              accept="image/*"
              onChange={handleImageUpload}
              ref={fileInputRef}
            />
            <div className="top-183 rounded-sm border p-1 px-4 hover:cursor-pointer border-white text-gray-300">
              {imagePreview ? "Change Image" : "Choose Image"}
            </div>
          </label>
        </div>
      </div>
      {errors.imageFile && (
        <p className="text-red-500 text-sm mt-[-7px]">{errors.imageFile.message}</p>
      )}

      <p className="text-xs text-gray-500 mb-4">
        Image Dimension: 250×200, 327×192, 172×101 Pixels
      </p>

      <Button
        type="submit"
        className="bg-[#1A3F70] w-52 hover:cursor-pointer hover:bg-[#1A3F70]"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Uploading..." : "Upload"}
      </Button>
    </form>
  );
};

export default AddCollectionForm;