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
import { ChevronDown, Trash2, Upload, X, AlertCircle, ChevronLeft, Loader2 } from "lucide-react";
import Image from "next/image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { deleteFileFromS3, generateSignedUrlForCollectionImage, getImageUrlOfS3 } from "@/actions";
import {
  getBestForStats,
  getlevelsStats,
  getCollectionById,
  deleteCollectionByID,
  updateCollectionStats,
} from "@/services/admin-services";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";
import { uploadCompressedCollectionImage } from "@/actions/uploadCollectionImage";

// Updated Validation Schema with imagePreview included
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
    .test("image-required", "An image is required", function (value) {
      return value !== undefined || this.parent.imagePreview !== null;
    }),
  imagePreview: yup.string().nullable().defined(),
}).required();

interface LevelOption {
  id: string;
  name: string;
}

interface BestForOption {
  id: string;
  name: string;
}

const EditCollectionForm = () => {
  const [levelOptions, setLevelOptions] = useState<LevelOption[]>([]);
  const [bestForOptions, setBestForOptions] = useState<BestForOption[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [originalImageKey, setOriginalImageKey] = useState<string | null>(null); // New state for original image key
  const [isLoadingLevels, setIsLoadingLevels] = useState(false);
  const [levelsError, setLevelsError] = useState<string | null>(null);
  const [isLoadingBestFor, setIsLoadingBestFor] = useState(false);
  const [bestForError, setBestForError] = useState<string | null>(null);
  const [isLevelsOpen, setIsLevelsOpen] = useState(false);
  const [isBestForOpen, setIsBestForOpen] = useState(false);
  const [levelsPopoverWidth, setLevelsPopoverWidth] = useState("auto");
  const [bestForPopoverWidth, setBestForPopoverWidth] = useState("auto");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const levelsTriggerRef = useRef<HTMLButtonElement>(null);
  const bestForTriggerRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const params = useParams();
  const collectionId = params.id as string;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<{
    collectionName: string;
    description: string;
    levels: string[];
    bestFor: string[];
    imageFile?: File;
    imagePreview: string | null;
  }>({
    resolver: yupResolver(schema),
    defaultValues: {
      collectionName: "",
      description: "",
      levels: [] as string[],
      bestFor: [] as string[],
      imageFile: undefined,
      imagePreview: null as string | null,
    },
  });

  const selectedLevels = watch("levels") || [];
  const selectedBestFor = watch("bestFor") || [];

  // Fetch collection data by ID
  useEffect(() => {
    const fetchCollection = async () => {
      if (!collectionId) return;
      try {
        const response = await getCollectionById(`/collection/${collectionId}`);
        if (response?.data?.success) {
          const collection = response.data.data;
          setValue("collectionName", collection.name);
          setValue("description", collection.description);
          setValue("levels", collection.levels.map((l: any) => l._id));
          setValue("bestFor", collection.bestFor.map((b: any) => b._id));
          const imageUrl = await getImageUrlOfS3(collection.imageUrl);
          setImagePreview(imageUrl);
          setValue("imagePreview", imageUrl);
          setOriginalImageKey(collection.imageUrl); // Store the original image key
        } else {
          toast.error("Failed to load collection data");
        }
      } catch (error) {
        console.error("Error fetching collection:", error);
        toast.error("An error occurred while fetching collection data");
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

    fetchCollection();
    fetchLevels();
    fetchBestForOptions();
  }, [collectionId, setValue]);

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
      setValue("imageFile", file);
      setValue("imagePreview", imageUrl);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setValue("imageFile", undefined);
    setValue("imagePreview", null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeLevel = (levelId: string) => {
    const newLevels = selectedLevels.filter((id) => id !== levelId);
    setValue("levels", newLevels);
  };

  const removeBestFor = (bestForId: string) => {
    const newBestFor = selectedBestFor.filter((id) => id !== bestForId);
    setValue("bestFor", newBestFor);
  };

  const addLevel = (levelId: string) => {
    if (!selectedLevels.includes(levelId)) {
      setValue("levels", [...selectedLevels, levelId]);
    }
    setIsLevelsOpen(false);
  };

  const addBestFor = (bestForId: string) => {
    if (!selectedBestFor.includes(bestForId)) {
      setValue("bestFor", [...selectedBestFor, bestForId]);
    }
    setIsBestForOpen(false);
  };

  const handleDeleteClick = () => {
    setIsDialogOpen(true);
  };

  const cancelDelete = () => {
    setIsDialogOpen(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true); // Start deletion process
    try {
      let filesDeleted = true;

      // Delete the image file from S3 if it exists
      if (originalImageKey) {
        try {
          await deleteFileFromS3(originalImageKey);
        } catch (error) {
          console.error("Error deleting image file from S3:", error);
          filesDeleted = false;
        }
      }

      // Delete the collection record from the database
      const response = await deleteCollectionByID(`/admin/delete-collection/${collectionId}`);

      if (response?.status === 200) {
        if (!filesDeleted) {
          toast.warning("Collection deleted but the S3 image may remain");
        } else {
          toast.success("Collection and associated image deleted successfully");
        }
        setIsDialogOpen(false);
        setTimeout(() => {
          router.push("/admin/all-collections");
        }, 1000);
      } else {
        toast.error(response?.data?.message || "Failed to delete collection");
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error("Error deleting collection:", error);
      if ((error as any)?.response?.data?.message) {
        toast.error((error as any)?.response?.data?.message);
      } else {
        toast.error("An unexpected error occurred while deleting the collection");
      }
      setIsDialogOpen(false);
    } finally {
      setIsDeleting(false); // End deletion process
    }
  };

  interface FormData {
    collectionName: string;
    description: string;
    levels: string[];
    bestFor: string[];
    imageFile?: File;
    imagePreview?: string | null;
  }

  const onSubmit = async (data: FormData) => {
    try {
      let imageKey = originalImageKey; // Default to the original image key

      // Validate all fields before proceeding
      if (!data.collectionName) {
        setError("collectionName", { type: "manual", message: "Collection name is required" });
        toast.error("Collection name is required");
        return;
      }
      if (!data.description) {
        setError("description", { type: "manual", message: "Description is required" });
        toast.error("Description is required");
        return;
      }
      if (!data.levels || data.levels.length === 0) {
        setError("levels", { type: "manual", message: "At least one level is required" });
        toast.error("At least one level is required");
        return;
      }
      if (!data.bestFor || data.bestFor.length === 0) {
        setError("bestFor", { type: "manual", message: "At least one best for is required" });
        toast.error("At least one best for is required");
        return;
      }

      if (data.imageFile) {
        // If a new image is uploaded, upload the compressed version
        const formData = new FormData();
        formData.append("image", data.imageFile);
        formData.append("collectionName", data.collectionName);
        const { key } = await uploadCompressedCollectionImage(formData);
        imageKey = key; // Update with the new compressed image key

        // Delete the original image from S3 if it exists and is different
        if (originalImageKey && originalImageKey !== imageKey) {
          try {
            await deleteFileFromS3(originalImageKey);
          } catch (error) {
            console.error("Error deleting original image from S3:", error);
            toast.warning("Updated successfully, but failed to delete old image from S3");
          }
        }
      } else if (!imageKey) {
        // If no new image is uploaded and no original key exists, throw an error
        setError("imageFile", { type: "manual", message: "An image is required" });
        toast.error("An image is required");
        return;
      }

      const payload = {
        name: data.collectionName,
        imageUrl: imageKey, // Use the determined imageKey
        levels: data.levels,
        bestFor: data.bestFor,
        description: data.description,
      };
      console.log("collectionData:", payload);
      const id = collectionId;
      const response = await updateCollectionStats(`/admin/update/collection/${id}`, payload);

      if (response?.status === 200) {
        toast.success("Collection updated successfully");
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        setTimeout(() => {
          router.push("/admin/all-collections");
        }, 1000);
      } else {
        toast.error(response?.data?.message || "Failed to update collection");
      }
    } catch (error) {
      console.log("error while updating collection:", error);
      toast.error("An error occurred while updating collection");
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
        <h2 className="text-xl font-semibold">Edit Collection</h2>
      </div>
      <Label className="text-gray-300 mb-3 block">Collection Name</Label>
      <Input
        {...register("collectionName")}
        placeholder="Enter Collection Name"
        className="mb-2 bg-[#0B132B] border-none h-12 text-white"
      />
      {errors.collectionName && (
        <p className="text-red-500 text-sm">{errors.collectionName.message}</p>
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
      <Popover open={isBestForOpen} onOpenChange={setIsBestForOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={bestForTriggerRef}
            variant="outline"
            className="mb-2 w-full bg-[#0B132B] hover:bg-[#0B132B] hover:cursor-pointer h-12 border-none text-white justify-between"
          >
            <div className="flex flex-wrap gap-2 items-center">
              {isLoadingBestFor ? (
                <span>Loading best for options...</span>
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
            <div className="p-2 text-gray-500">Loading best for options...</div>
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
        <p className="text-red-500 text-sm">{errors.bestFor.message}</p>
      )}

      <Label className="text-gray-300 mb-3 block">Description</Label>
      <Textarea
        {...register("description")}
        placeholder=""
        className="mb-2 bg-[#0B132B] border-none text-white"
      />
      {errors.description && (
        <p className="text-red-500 text-sm">{errors.description.message}</p>
      )}

      <Label className="text-gray-300 mb-3 block">Upload Collection Image</Label>
      <div className="flex flex-wrap items-end gap-4 mb-2">
        <Card className="w-64 min-w-44 flex items-center justify-center py-0 bg-[#0B132B] border-none rounded-lg relative">
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
                className="absolute top-0 right-0 hover:cursor-pointer hover:bg-[#373f57] text-zinc-500"
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
        <p className="text-red-500 text-sm">{errors.imageFile.message}</p>
      )}

      <p className="text-xs text-gray-500 mb-4">
        Image Dimension: 250×200, 327×192, 172×101 Pixels
      </p>

      <div className="flex justify-start flex-wrap gap-2">
        <Button
          type="submit"
          className="bg-[#1A3F70] w-52 hover:cursor-pointer hover:bg-[#1A3F70]"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
        <Button
          type="button"
          className="bg-[#FF4747] w-52 hover:cursor-pointer hover:bg-[#FF4747]"
          onClick={handleDeleteClick}
        >
          Delete
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#1B2236] text-center w-96 flex flex-col justify-center items-center text-white border border-[#334155]">
          <DialogHeader className="flex flex-col items-center">
            <div className="mb-4">
              <AlertCircle size={40} className="text-red-500" />
            </div>
            <DialogTitle className="text-xl font-semibold">
              Delete Collection?
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-center">
              Are you sure you want to delete this collection? <br />
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex items-center justify-center gap-4">
            <Button
              className="bg-[#1A3F70] text-white hover:cursor-pointer hover:bg-[#1A3F70] w-42"
              onClick={cancelDelete}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#FF4747] hover:cursor-pointer hover:bg-[#FF4747] w-42"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 size={20} className="animate-spin text-white" />
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  );
};

export default EditCollectionForm;