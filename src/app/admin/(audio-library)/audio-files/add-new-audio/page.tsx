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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import {
  generateSignedUrlForAudioImage,
  generateSignedUrlForAudios,
} from "@/actions";
import { uploadAudioStats } from "@/services/admin-services";

// Assuming these functions exist

const addNewAudio = async (endpoint: string, payload: any) => {
  console.log("payload:", payload);
  // Replace with your actual API call
  return { status: 201 };
};

// Define FormValues type
type FormValues = {
  collectionType: string;
  songName: string;
  description: string;
  audioFile: FileList;
  imageFile: FileList;
};

// Define schema
const schema = yup.object().shape({
  collectionType: yup.string().required("Collection type is required"),
  songName: yup.string().required("Song name is required"),
  description: yup.string().required("Description is required"),
  audioFile: yup
    .mixed<FileList>()
    .nullable()
    .required("Audio file is required"),
  imageFile: yup
    .mixed<FileList>()
    .nullable()
    .required("Image file is required"),
});

const AddNewAudio = () => {
  const [bestForOptions, setBestForOptions] = useState<string[]>([]);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const audioInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      collectionType: "",
      songName: "",
      description: "",
    },
  });

  const getAudioDuration = async (file: File) => {
    const audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    return audioBuffer.duration;
  };
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600); // Calculate hours (3600 seconds = 1 hour)
    const minutes = Math.floor((seconds % 3600) / 60); // Calculate minutes from remaining seconds
    const secs = Math.floor(seconds % 60); // Calculate seconds
    const formattedHours = String(hours).padStart(2, "0"); // Ensure 2 digits (e.g., "00")
    const formattedMinutes = String(minutes).padStart(2, "0"); // Ensure 2 digits (e.g., "05")
    const formattedSeconds = String(secs).padStart(2, "0"); // Ensure 2 digits (e.g., "30")
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`; // Return "HH:MM:SS"
  };
  // Watch file inputs for preview updates
  const audioFile = watch("audioFile");
  const imageFile = watch("imageFile");

  // Set up collection options
  useEffect(() => {
    setTimeout(() => {
      setBestForOptions(["Nature", "Meditation", "Sleep", "Focus"]);
    }, 500);
  }, []);

  // Update audio preview
  useEffect(() => {
    if (audioFile && audioFile.length > 0) {
      const audioUrl = URL.createObjectURL(audioFile[0]);
      setAudioPreview(audioUrl);
      return () => URL.revokeObjectURL(audioUrl);
    } else {
      setAudioPreview(null);
    }
  }, [audioFile]);

  // Update image preview
  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const imageUrl = URL.createObjectURL(imageFile[0]);
      setImagePreview(imageUrl);
      return () => URL.revokeObjectURL(imageUrl);
    } else {
      setImagePreview(null);
    }
  }, [imageFile]);

  // Remove handlers
  const handleRemoveAudio = () => {
    if (audioInputRef.current) {
      audioInputRef.current.value = "";
    }
    setAudioPreview(null);
    setValue("audioFile", new DataTransfer().files); // Clear form state
  };

  const handleRemoveImage = () => {
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
    setImagePreview(null);
    setValue("imageFile", new DataTransfer().files); // Clear form state
  };

  // Form submission handler
  const onSubmit = async (data: FormValues) => {
    try {
      let audioKey = null;
      let imageKey = null;
      let formattedDuration = null;
      // Upload audio to S3
      if (data.audioFile && data.audioFile.length > 0) {
        const audio = data.audioFile[0];
        const duration = await getAudioDuration(audio); // Returns a number, e.g., 330
        console.log("duration:", duration);

        // Convert to "HH:MM:SS" format
        formattedDuration = formatDuration(duration);
        console.log("formattedDuration:", formattedDuration);
        const collectionType = data.collectionType.toLowerCase();
        const songName = data.songName.toLowerCase();
        const audioFileName = `${audio.name}`;
        const { signedUrl, key } = await generateSignedUrlForAudios(
          collectionType,
          songName,
          audioFileName,
          audio.type
        );
        const audioUploadResponse = await fetch(signedUrl, {
          method: "PUT",
          body: audio,
          headers: { "Content-Type": audio.type },
        });

        if (!audioUploadResponse.ok) {
          throw new Error("Failed to upload audio to S3");
        }
        audioKey = key;
      }

      // Upload image to S3
      if (data.imageFile && data.imageFile.length > 0) {
        const image = data.imageFile[0];
        const collectionType = data.collectionType.toLowerCase();
        const songName = data.songName.toLowerCase();
        const imageFileName = `${image.name}`;
        const { signedUrl, key } = await generateSignedUrlForAudioImage(
          collectionType,
          songName,
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

      console.log("imageKey:", imageKey);
      // Prepare payload for backend
      const payload = {
        songName: data.songName,
        collectionType: "67d280b13c17e710f42726c2",
        description: data.description || "",
        audioUrl: audioKey,
        imageUrl: imageKey,
        duration: formattedDuration,
      };

      
      // Send to backend
      const response = await uploadAudioStats("/admin/upload-audio",payload);

      if (response?.status === 201) {
        toast.success("Audio added successfully");
        window.location.href = "/admin/audio-files";
      } else {
        toast.error(response?.data?.message ||"Failed to add audio");
      }
      
    } catch (error) {
      console.log("error while uploading audio:", error);
      toast.error("An error occurred while adding audio");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-6 bg-[#1B2236] text-white rounded-lg shadow-md"
    >
      <h2 className="text-xl font-semibold mb-4">Add New Audio</h2>

      {/* Collection Type */}
      <Label className="text-gray-300 mb-3 block">Collection Type</Label>
      <Controller
        name="collectionType"
        control={control}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger className="mb-4 w-full bg-[#0B132B] h-12 border-none text-white">
              <SelectValue placeholder="Select Collection Type" />
            </SelectTrigger>
            <SelectContent className="bg-[#0B132B] border-gray-700 text-white">
              {bestForOptions.length > 0 ? (
                bestForOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="loading">Loading collection...</SelectItem>
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

      {/* Song Name */}
      <Label className="text-gray-300 mb-3 block">Song Name</Label>
      <Input
        {...register("songName")}
        placeholder="Enter Collection Name"
        className="mb-4 bg-[#0B132B] border-none h-12 text-white"
      />
      {errors.songName && (
        <p className="text-red-500 text-xs mb-4">{errors.songName.message}</p>
      )}

      {/* Description */}
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

      {/* File Upload Section */}
      <div className="flex flex-wrap items-center space-x-16">
        {/* Upload Audio */}
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
                    className="absolute top-0 right-0 text-zinc-500"
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
                    const file = e.target.files?.[0] || null;
                    setValue("audioFile", e.target.files as FileList); // Manually update form state
                    if (file) {
                      setAudioPreview(URL.createObjectURL(file));
                    }
                  }}
                  ref={audioInputRef}
                />
                <div className="border p-1 px-4 rounded-sm border-white text-gray-300 cursor-pointer">
                  Choose Audio File
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

        {/* Upload Image */}
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
                    className="absolute top-0 right-0 text-zinc-500"
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
                    const file = e.target.files?.[0] || null;
                    setValue("imageFile", e.target.files as FileList); // Manually update form state
                    if (file) {
                      setImagePreview(URL.createObjectURL(file));
                    }
                  }}
                  ref={imageInputRef}
                />
                <div className="border p-1 px-4 rounded-sm border-white text-gray-300 cursor-pointer">
                  Choose Image
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

      {/* Submit Button */}
      <Button
        type="submit"
        className="bg-[#1A3F70] hover:bg-[#1A3F70] max-w-52"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Uploading..." : "Upload"}
      </Button>
    </form>
  );
};

export default AddNewAudio;
