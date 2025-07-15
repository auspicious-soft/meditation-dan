"use client";
import React, { useState, useEffect, useRef } from "react";
import TextEditor from "./Editor";
import { toast } from "sonner";
import { postTermsSettings, getTermsSettings } from "@/services/admin-services";
import useSWR from "swr";

const TermsPage = ({ name }: { name: string }) => {
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { data, mutate, isLoading } = useSWR(`/admin/settings?type=${name}`, getTermsSettings);
  const actualData = data?.data?.data;
  console.log('actualData:', actualData);
  const prevNameRef = useRef(name);
  const isFirstLoadRef = useRef(true);

  // Load data when component mounts or name changes
  useEffect(() => {
    if (actualData) {
      if (isFirstLoadRef.current || name !== prevNameRef.current) {
        // If actualData is a string, use it directly
        // If actualData is an object, try to get the property by name
        const content = typeof actualData === 'string' 
          ? actualData 
          : actualData[name] || "";
        
        setDescription(content);
        prevNameRef.current = name;
        isFirstLoadRef.current = false;
      }
    }
  }, [actualData, name]);

  const handleDescriptionChange = (content: string) => {
    console.log("Description changed:", content);
    setDescription(content);
  };

  const handleSave = async () => {
    console.log("Saving description:", description);
    setIsSaving(true);
    try {
      const payload = { [name]: description };
      console.log('payload:', payload);
      const response = await postTermsSettings("admin/settings", payload);
      
      if (response?.status === 200 || response?.status === 201) {
        toast.success(`${name === "privacyPolicy" ? "Privacy Policy" :"Terms and Conditions"} updated successfully`, {
                      duration: Infinity,
                      position: "top-center",
                      action: {
                        label: "OK",
                        onClick: (toastId : any) => toast.dismiss(toastId),
                      },
                      closeButton: false,
                    });
        mutate();
      } else {
        throw new Error(response?.data?.message || "Failed to update settings");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error((error as any).message || "Something went wrong while saving", {
                    duration: Infinity,
                    position: "top-center",
                    action: {
                      label: "OK",
                      onClick: (toastId : any) => toast.dismiss(toastId),
                    },
                    closeButton: false,
                  });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="px-[30px] py-[30px] bg-[#1A3F70] rounded-[20px]">
      <TextEditor
        key={`editor-${name}`}
        value={description}
        setDescription={handleDescriptionChange}
      />
      <button
        onClick={handleSave}
        disabled={isSaving}
        className={`mt-4 px-4 py-2 rounded-3xl text-white text-sm font-medium w-full ${
          isSaving ? "bg-gray-400 cursor-not-allowed" : "bg-[#1A3F70] hover:bg-[#1A3F70]"
        }`}
      >
        {isSaving ? "Saving..." : "Save"}
      </button>
    </div>
  );
};

export default TermsPage;