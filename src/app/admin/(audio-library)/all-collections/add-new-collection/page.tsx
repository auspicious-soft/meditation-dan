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


// Validation Schema
const schema = yup.object({
  collectionName: yup.string().required("Collection name is required"),
  description: yup.string().required("Description is required"),
  levels: yup.array().of(yup.string().required("Each level must be a valid string"))
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
  const [popoverWidth, setPopoverWidth] = useState("auto")
  const fileInputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { 
    register, 
    handleSubmit, 
    setValue, 
    watch,
    formState: { errors, isSubmitting } 
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      collectionName: "",
      description: "",
      levels: [] as string[],
      bestFor: "",
      imageFile: new File([], ""),
    }
  });

  const selectedLevels = watch("levels") || [];
  const selectedBestFor = watch("bestFor") || "";

  useEffect(() => {
    setTimeout(() => {
      setLevelOptions([
        { id: "67d7bea1654d1c1109a0c4b2", name: "Beginner" },
        { id: "67d7bea1654d1c1109a0c4b3", name: "Intermediate" },
        { id: "67d7bea1654d1c1109a0c4b4", name: "Advanced" },
      ]);
      setBestForOptions([
        { id: "67d275b220b9e6e2401c97fc", name: "Nature" },
        { id: "67d275b220b9e6e2401c97fd", name: "Meditation" },
        { id: "67d275b220b9e6e2401c97fe", name: "Sleep" },
        { id: "67d275b220b9e6e2401c97ff", name: "Focus" },
      ]);
    }, 500);
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
const debounce = (func: (...args: unknown[]) => void, delay: number): (...args: unknown[]) => void => {
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
  const debouncedUpdateWidth = debounce(updateWidth, 100); // 100ms delay

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
    imageFile: File ;
  }

  const onSubmit = async (data: FormData) => {
    try {
      let imageKey = '';
      const imageFile = data.imageFile as File;

      // Upload image using signed URL
      if (data.imageFile) {
        const image = data.imageFile;
        const bestForName = bestForOptions.find(option => option.id === data.bestFor)?.name.toLowerCase() || "";; 
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

      console.log("collectionData: " , collectionData);

      // API call to save to database
      // const response = await fetch('/api/collections', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(collectionData),
      // });

      // if (!response.ok) throw new Error('Failed to save collection');
      
      // // Reset form
      // setImagePreview(null);
      // if (fileInputRef.current) fileInputRef.current.value = "";
      
    } catch (error) {
      console.error('Error submitting form:', error);
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
          ref={triggerRef} // Attach the ref to the button
          variant="outline"
          className="w-full justify-between text-left h-12 text-gray-300 hover:bg-[#0B132B] hover:text-white border-none mb-4"
        >
          {selectedLevels.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selectedLevels.map((levelId) => {
                const level = levelOptions.find((l) => l.id === levelId);
                return (
                  <span
                    key={levelId}
                    className="bg-[#1B2236] p-1 rounded-md text-white"
                  >
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
        style={{ width: popoverWidth }} // Apply the dynamic width
      >
        {levelOptions.map((level) => (
          <div
            key={level.id}
            className={`space-x-2 p-2 text-white ${
              selectedLevels.includes(level.id) ? "bg-[#1B2236]" : ""
            }`}
            onClick={() => {
              const newLevels = selectedLevels.includes(level.id)
                ? selectedLevels.filter((l) => l !== level.id)
                : [...selectedLevels, level.id];
              setValue("levels", newLevels);
            }}
          >
            {level.name}
          </div>
        ))}
      </PopoverContent>
    </Popover>
      {errors.levels && <p className="text-red-500 text-sm">{errors.levels.message}</p>}

      <Label className="text-gray-300 mb-3 block">Best for</Label>
      <Select onValueChange={(value) => setValue("bestFor", value)} value={selectedBestFor}>
        <SelectTrigger className="mb-4 w-full bg-[#0B132B] h-12 border-none text-white">
          <SelectValue placeholder="Select BestFor" />
        </SelectTrigger>
        <SelectContent className="bg-[#0B132B] border-gray-700 text-white">
          {bestForOptions.map((option) => (
            <SelectItem key={option.id} value={option.id}>
              {option.name}
            </SelectItem>
          ))}
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
                className="absolute top-0 right-0 text-zinc-500"
                onClick={handleRemoveImage}
              >
                <Trash2 size={16} className="text-red-600" />
              </Button>
            </>
          ) : (
            <Upload size={32} className="text-gray-400" />
          )}
        </Card>
        <div className="md:" >
          <label htmlFor="file-upload">
            <input
              type="file"
              className=" hidden"
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