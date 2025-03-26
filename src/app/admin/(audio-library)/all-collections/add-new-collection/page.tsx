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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, ChevronDown, Upload } from "lucide-react";
import Image from "next/image";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { generateSignedUrlForCollectionImage } from "@/actions";
import { getBestForStats, getlevelsStats, uploadCollectionStats } from "@/services/admin-services";
import { toast } from "sonner";

// Validation Schema
const schema = yup.object({
  collectionName: yup.string().required("Collection name is required"),
  description: yup.string().required("Description is required"),
  levels: yup
    .array()
    .of(yup.string().required("Each level must be a valid string"))
    .min(1, "At least one level is required")
    .required("Levels field is required"),
  bestFor: yup.string().required("Best for is required"),
  imageFile: yup
    .mixed<File>()
    .test("fileType", "Invalid file type", (value) => value instanceof File)
    .required("Image is required"),
}).required();

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
  const [popoverWidth, setPopoverWidth] = useState("auto");
  const [isLoadingLevels, setIsLoadingLevels] = useState(false);
  const [levelsError, setLevelsError] = useState<string | null>(null);
  const [isLoadingBestFor, setIsLoadingBestFor] = useState(false);
  const [bestForError, setBestForError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      collectionName: "",
      description: "",
      levels: [] as string[],
      bestFor: "",
      imageFile: new File([], ""),
    },
  });

  const selectedLevels = watch("levels") || [];
  const selectedBestFor = watch("bestFor") || "";

  useEffect(() => {
    const fetchLevels = async () => {
      setIsLoadingLevels(true);
      setLevelsError(null);
      try {
        const response = await getlevelsStats("/level", {});
        console.log("getlevelsStats response:", response);

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
        console.log("getBestForStats response:", response);

        if (response?.data?.success && Array.isArray(response?.data?.data)) {
          const transformedOptions = response.data.data
            .filter((option: any) => option.isActive)
            .map((option: any) => ({
              id: option._id,
              name: option.name,
            }));
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

    fetchLevels();
    fetchBestForOptions();
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setValue("imageFile", file);
    }
  };

  // Debounce function to limit how often updateWidth is called
  const debounce = (func: (...args: unknown[]) => void, delay: number): ((...args: unknown[]) => void) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: Parameters<typeof func>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Function to update the popover width
  const updateWidth = () => {
    if (triggerRef.current) {
      const width = triggerRef.current.getBoundingClientRect().width;
      setPopoverWidth(`${width}px`);
    }
  };

  // Debounced version of updateWidth
  const debouncedUpdateWidth = debounce(updateWidth, 0); // 100ms delay

  useEffect(() => {
    updateWidth(); // Set the initial width

    // Add resize event listener with debouncing
    window.addEventListener("resize", debouncedUpdateWidth);

    // Cleanup
    return () => window.removeEventListener("resize", debouncedUpdateWidth);
  }, []);

  const handleRemoveImage = () => {
    setImagePreview(null);
    setValue("imageFile", new File([], ""));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  interface FormData {
    collectionName: string;
    description: string;
    levels: string[];
    bestFor: string;
    imageFile: File;
  }

  const onSubmit = async (data: FormData) => {
    try {
      let imageKey = '';
      const imageFile = data.imageFile as File;

      // Upload image using signed URL
      if (data.imageFile) {
        const image = data.imageFile;
        const bestForName = bestForOptions.find(option => option.id === data.bestFor)?.name.toLowerCase() || "";
        const collectionName = data.collectionName;
        const imageFileName = `${imageFile.name}`;

        const { signedUrl, key } = await generateSignedUrlForCollectionImage(
          bestForName,
          collectionName,
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

      // Format data for backend
      const collectionData = {
        name: data.collectionName,
        imageUrl: imageKey, // Using the S3 key as imageUrl
        levels: data.levels,
        bestFor: data.bestFor,
        description: data.description,
      };

      console.log("collectionData: ", collectionData);

      const response = await uploadCollectionStats('/admin/upload-collection', collectionData);

      if (response?.status === 201) {
        toast.success("Collection added successfully");
        // Reset form state on success
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        window.location.href = "/admin/audio-files";
      } else {
        toast.error(response?.data?.message || "Failed to add collection");
      }
    } catch (error) {
      console.log("error while uploading collection:", error);
      toast.error("An error occurred while adding collection");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 bg-[#1B2236] text-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add New Collection</h2>

      <Label className="text-gray-300 mb-3 block">Collection Name</Label>
      <Input
        {...register("collectionName")}
        placeholder="Enter Collection Name"
        className="mb-4 bg-[#0B132B] border-none h-12 text-white"
      />
      {errors.collectionName && <p className="text-red-500 text-sm">{errors.collectionName.message}</p>}

      <Label className="text-gray-300 mb-3 block">Level</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            ref={triggerRef}
            variant="outline"
            className="w-full justify-between text-left h-12 text-gray-300 hover:bg-[#0B132B] hover:text-white border-none mb-4"
          >
            {isLoadingLevels ? (
              <span>Loading levels...</span>
            ) : selectedLevels.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {selectedLevels.map((levelId) => {
                  const level = levelOptions.find((l) => l.id === levelId);
                  return (
                    <span key={levelId} className="bg-[#1B2236] p-1 rounded-md text-white">
                      {level?.name || levelId}
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
            <div className="p-2 text-gray-500">Loading levels...</div>
          ) : levelsError ? (
            <div className="p-2 text-red-500">{levelsError}</div>
          ) : levelOptions.length === 0 ? (
            <div className="p-2 text-gray-500">No levels available</div>
          ) : (
            levelOptions.map((level) => (
              <div
                key={level.id}
                className={`space-x-2 p-2 text-white ${selectedLevels.includes(level.id) ? "bg-[#1B2236]" : ""}`}
                onClick={() => {
                  const newLevels = selectedLevels.includes(level.id)
                    ? selectedLevels.filter((l) => l !== level.id)
                    : [...selectedLevels, level.id];
                  setValue("levels", newLevels);
                }}
              >
                {level.name}
              </div>
            ))
          )}
        </PopoverContent>
      </Popover>
      {errors.levels && <p className="text-red-500 text-sm">{errors.levels.message}</p>}

      <Label className="text-gray-300 mb-3 block">Best for</Label>
      <Select onValueChange={(value) => setValue("bestFor", value)} value={selectedBestFor}>
        <SelectTrigger className="mb-4 w-full bg-[#0B132B] h-12 border-none text-white">
          <SelectValue placeholder={isLoadingBestFor ? "Loading best for options..." : "Select BestFor"} />
        </SelectTrigger>
        <SelectContent className="bg-[#0B132B] border-gray-700 text-white">
          {isLoadingBestFor ? (
            <div className="p-2 text-gray-500">Loading best for options...</div>
          ) : bestForError ? (
            <div className="p-2 text-red-500">{bestForError}</div>
          ) : bestForOptions.length === 0 ? (
            <div className="p-2 text-gray-500">No best for options available</div>
          ) : (
            bestForOptions.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
      {errors.bestFor && <p className="text-red-500 text-sm">{errors.bestFor.message}</p>}

      <Label className="text-gray-300 mb-3 block">Description</Label>
      <Textarea
        {...register("description")}
        placeholder=""
        className="mb-4 bg-[#0B132B] border-none text-white"
      />
      {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}

      <Label className="text-gray-300 mb-3 block">Upload Collection Image</Label>
      <div className="flex flex-wrap items-end gap-4 mb-4">
        <Card className="w-64 min-h-44 flex items-center justify-center bg-[#0B132B] border-none rounded-lg relative">
          {imagePreview ? (
            <>
              <Image
                src={imagePreview}
                alt="Preview"
                width={300}
                height={300}
                className="rounded-lg object-contain"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-0 right-0 hover:bg-[#373f57] text-zinc-500"
                onClick={handleRemoveImage}
              >
                <Trash2 size={16} className="text-white " />
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
            <div className="top-183 rounded-sm border p-1 px-4 border-white text-gray-300">
              Choose Image
            </div>
          </label>
        </div>
      </div>
      {errors.imageFile && <p className="text-red-500 text-sm">{errors.imageFile.message}</p>}

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