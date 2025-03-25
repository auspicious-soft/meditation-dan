"use client";
import { useEffect, useState, useRef } from "react"; // Updated import
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, ChevronDown, Upload } from "lucide-react";
import Image from "next/image";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const AddCollectionForm = () => {
  const [levels, setLevels] = useState<string[]>([]);
  const [bestForOptions, setBestForOptions] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  console.log('selectedLevels:', selectedLevels);
  const [selectedBestFor, setSelectedBestFor] = useState<string | null>(null);
  console.log('selectedBestFor:', selectedBestFor);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  console.log('imageFile:', imageFile);
  
  // Add the ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simulating backend API call
  useEffect(() => {
    setTimeout(() => {
      setLevels(["Beginner", "Intermediate", "Advanced"]);
      setBestForOptions(["Nature", "Meditation", "Sleep", "Focus"]);
    }, 500);
  }, []);

  const handleBestForChange = (value: string) => {
    setSelectedBestFor(value);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setImageFile(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the file input
    }
  };

  return (
    <div className="p-6 bg-[#1B2236] text-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add New Collection</h2>

      {/* Collection Name */}
      <Label className="text-gray-300 mb-3 block">Collection Name</Label>
      <Input
        placeholder="Enter Collection Name"
        className="mb-4 bg-[#0B132B] border-none h-12 text-white"
      />

      {/* Level Selection - Multi-Select Dropdown */}
      <Label className="text-gray-300 mb-3 block">Level</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between text-left h-12 text-gray-300 hover:bg-[#0B132B] hover:text-white border-none mb-4"
          >
            {selectedLevels.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {selectedLevels.map((level) => (
                  <span key={level} className="bg-[#1B2236] p-1 rounded-md text-white">
                    {level}
                  </span>
                ))}
              </div>
            ) : (
              <span>Select levels</span>
            )}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 bg-[#0B132B] border-gray-700">
          <div className="w-[72vw]">
            {levels.map((level) => (
              <div
                key={level}
                className={`space-x-2 p-2 text-white ${
                  selectedLevels.includes(level) ? "bg-[#1B2236]" : ""
                }`}
                onClick={() => {
                  setSelectedLevels((prev) =>
                    prev.includes(level)
                      ? prev.filter((l) => l !== level)
                      : [...prev, level]
                  );
                }}
              >
                {level}
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Best For Dropdown */}
      <Label className="text-gray-300 mb-3 block">Best for</Label>
      <Select onValueChange={handleBestForChange}>
        <SelectTrigger className="mb-4 w-full bg-[#0B132B] h-12 border-none text-white">
          <SelectValue placeholder="Select BestFor" />
        </SelectTrigger>
        <SelectContent className="bg-[#0B132B] border-gray-700 text-white">
          {bestForOptions.length > 0 ? (
            bestForOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="loading">Loading categories...</SelectItem>
          )}
        </SelectContent>
      </Select>

      {/* Description */}
      <Label className="text-gray-300 mb-3 block">Description</Label>
      <Textarea
        placeholder=""
        className="mb-4 bg-[#0B132B] border-none text-white"
      />

      {/* File Upload */}
      <Label className="text-gray-300 mb-3 block">Upload Collection Image</Label>
      <div className="flex items-end gap-4 mb-4">
        <Card className="w-64 h-44 flex items-center justify-center bg-[#0B132B] border-none rounded-lg relative">
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
                <Trash2 size={16} />
              </Button>
            </>
          ) : (
            <Upload size={32} className="text-gray-400" />
          )}
        </Card>
        <div className="border border-[#1B2236]">
          <label htmlFor="file-upload">
          <input
            type="file"
            className="relative hidden"
            id="file-upload"
            accept="image/*"
            onChange={handleImageUpload}
            ref={fileInputRef} // Attach the ref
          />
            <div  className="absolute top-183 text-gray-300 ">
              Choose Image
            </div>
          </label>
        </div>
      </div>
      <p className="text-xs text-gray-500 mb-4">
        Image Dimension: 250×200, 327×192, 172×101 Pixels
      </p>

      {/* Submit Button */}
      <Button className="bg-[#1A3F70] w-52 hover:bg-[#1A3F70] ">Upload</Button>
    </div>
  );
};

export default AddCollectionForm;