/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { toast } from "sonner";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { addFaq, deleteFaq, getAllFaq, updateFaq } from "@/services/admin-services";

interface FAQ {
  _id: string;
  question: string;
  answer: string;
}

const PAGE_SIZE = 10;

export default function Page() {
  const router = useRouter();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<FAQ | null>(null);
  const [question, setQuestion] = useState(""); // For Edit dialog
  const [answer, setAnswer] = useState(""); // For Edit dialog
  const [newQuestion, setNewQuestion] = useState(""); // For Add New dialog
  const [newAnswer, setNewAnswer] = useState(""); // For Add New dialog
  const [isLoading, setIsLoading] = useState(true);

  // Fetch FAQs on mount and when page changes
  useEffect(() => {
    fetchFaqs();
  }, [currentPage]);

  const fetchFaqs = async () => {
    setIsLoading(true);
    try {
      const response = await getAllFaq(`/admin/FAQs?page=${currentPage}&limit=${PAGE_SIZE}`);
      if (response.data.success) {
        setFaqs(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
      } else {
        toast.error("Failed to fetch FAQs", {
                duration: Infinity,
                position: "top-center",
                action: {
                  label: "OK",
                  onClick: (toastId : any) => toast.dismiss(toastId),
                },
                closeButton: false,
              });
      }
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      toast.error("Failed to fetch FAQs", {
              duration: Infinity,
              position: "top-center",
              action: {
                label: "OK",
                onClick: (toastId : any) => toast.dismiss(toastId),
              },
              closeButton: false,
            });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle add new FAQ
  const handleAddFaq = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) {
      toast.error("Both question and answer are required.", {
              duration: Infinity,
              position: "top-center",
              action: {
                label: "OK",
                onClick: (toastId : any) => toast.dismiss(toastId),
              },
              closeButton: false,
            });
      return;
    }
    try {
      const payload = {
        question: newQuestion.trim(),
        answer: newAnswer.trim(),
      };
      console.log("payload:", payload);
      const response = await addFaq("/admin/FAQs", payload);
      if (response.data.success) {
        toast.success("FAQ added successfully", {
        duration: Infinity,
        position: "top-center",
        action: {
          label: "OK",
          onClick: (toastId : any) => toast.dismiss(toastId),
        },
        closeButton: false,
      });
        setIsAddOpen(false);
        setNewQuestion("");
        setNewAnswer("");
        await fetchFaqs();
      } else {
        toast.error("Failed to add FAQ", {
                duration: Infinity,
                position: "top-center",
                action: {
                  label: "OK",
                  onClick: (toastId : any) => toast.dismiss(toastId),
                },
                closeButton: false,
              });
      }
    } catch (error) {
      console.error("Error adding FAQ:", error);
      toast.error("Failed to add FAQ", {
              duration: Infinity,
              position: "top-center",
              action: {
                label: "OK",
                onClick: (toastId : any) => toast.dismiss(toastId),
              },
              closeButton: false,
            });
    }
  };

  // Handle edit FAQ
  const handleEditFaq = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!selectedFaq || !question.trim() || !answer.trim()) {
      toast.error("Both question and answer are required.", {
              duration: Infinity,
              position: "top-center",
              action: {
                label: "OK",
                onClick: (toastId : any) => toast.dismiss(toastId),
              },
              closeButton: false,
            });
      return;
    }
    try {
      const payload = { question, answer };
      const response = await updateFaq(`/admin/FAQs/${selectedFaq._id}`, payload);
      if (response.data.success) {
        toast.success("FAQ updated successfully", {
        duration: Infinity,
        position: "top-center",
        action: {
          label: "OK",
          onClick: (toastId : any) => toast.dismiss(toastId),
        },
        closeButton: false,
      });
        setIsEditOpen(false);
        setSelectedFaq(null);
        setQuestion("");
        setAnswer("");
        await fetchFaqs();
      } else {
        toast.error("Failed to update FAQ", {
                duration: Infinity,
                position: "top-center",
                action: {
                  label: "OK",
                  onClick: (toastId : any) => toast.dismiss(toastId),
                },
                closeButton: false,
              });
      }
    } catch (error) {
      console.error("Error updating FAQ:", error);
      toast.error("Failed to update FAQ", {
              duration: Infinity,
              position: "top-center",
              action: {
                label: "OK",
                onClick: (toastId : any) => toast.dismiss(toastId),
              },
              closeButton: false,
            });
    }
  };

  // Handle delete FAQ
  const handleDeleteFaq = async () => {
    if (!selectedFaq) return;
    try {
      const response = await deleteFaq(`/admin/FAQs/${selectedFaq._id}`);
      if (response.data.success) {
        toast.success("FAQ deleted successfully", {
        duration: Infinity,
        position: "top-center",
        action: {
          label: "OK",
          onClick: (toastId : any) => toast.dismiss(toastId),
        },
        closeButton: false,
      });
        setIsDeleteOpen(false);
        setSelectedFaq(null);
        await fetchFaqs();
      } else {
        toast.error("Failed to delete FAQ", {
                duration: Infinity,
                position: "top-center",
                action: {
                  label: "OK",
                  onClick: (toastId : any) => toast.dismiss(toastId),
                },
                closeButton: false,
              });
      }
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      toast.error("Failed to delete FAQ", {
              duration: Infinity,
              position: "top-center",
              action: {
                label: "OK",
                onClick: (toastId : any) => toast.dismiss(toastId),
              },
              closeButton: false,
            });
    }
  };

  // Open edit dialog with selected FAQ data
  const openEditDialog = (faq: FAQ) => {
    setSelectedFaq(faq);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setIsEditOpen(true);
  };

  // Open delete dialog with selected FAQ
  const openDeleteDialog = (faq: FAQ) => {
    setSelectedFaq(faq);
    setIsDeleteOpen(true);
  };

  // Loading state with skeleton
  if (isLoading) {
    return (
      <SkeletonTheme baseColor="#0B132B" highlightColor="#1B2236" borderRadius="0.5rem">
        <div className="mb-[20px] bg-[#1A3F70] rounded py-[8px] px-[18px] inline-flex justify-center items-center gap-2.5 cursor-pointer ml-auto w-fit">
          <div className="text-white text-sm font-normal">+ Add New</div>
        </div>
        <div className="flex flex-col gap-4">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="flex items-center p-[20px] bg-[#1b2236] rounded-lg gap-4"
            >
              <Skeleton width={20} height={20} />
              <div className="flex-1">
                <Skeleton width={200} height={16} />
                <Skeleton width={300} height={14} style={{ marginTop: "4px" }} />
              </div>
              <div className="flex gap-4 ml-auto items-center">
                <Skeleton width={24} height={24} />
                <Skeleton width={24} height={24} />
              </div>
            </div>
          ))}
        </div>
      </SkeletonTheme>
    );
  }

  return (
    <SkeletonTheme baseColor="#0B132B" highlightColor="#1B2236" borderRadius="0.5rem">
      <div className="mb-[20px] bg-[#1A3F70] rounded py-[8px] px-[18px] inline-flex justify-center items-center gap-2.5 cursor-pointer ml-auto w-fit">
        <div onClick={() => setIsAddOpen(true)} className="text-white text-sm font-normal">
          + Add New
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {faqs.map((faq, index) => (
          <div
            key={faq._id}
            className="flex items-center p-[20px] bg-[#1b2236] rounded-lg gap-4"
          >
            <div className="text-white text-sm font-bold">
              {(currentPage - 1) * PAGE_SIZE + index + 1}.
            </div>
            <div className="flex-1">
              <div className="text-white text-sm font-normal">{faq.question}</div>
              <div className="mt-1 text-white text-sm font-normal">{faq.answer}</div>
            </div>
            <div className="flex gap-4 ml-auto items-center">
              <Image
                onClick={() => openEditDialog(faq)}
                src="/Edit.svg"
                alt="edit"
                className="hover:cursor-pointer"
                height={24}
                width={24}
              />
              <Image
                onClick={() => openDeleteDialog(faq)}
                src="/Delete.svg"
                alt="delete"
                className="hover:cursor-pointer"
                height={24}
                width={24}
              />
            </div>
          </div>
        ))}

        {/* Pagination Controls */}
        <div className="flex justify-end items-center gap-2 mt-4">
          <Button
            className="bg-[#0B132B]"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-white text-sm">Page {currentPage} of {totalPages}</span>
          <Button
            className="bg-[#0B132B]"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>

        {/* Add Dialog */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogContent className="bg-[#1b2236] border-[#1F2937] w-[450px] p-6 flex flex-col items-center text-white rounded-lg">
            <DialogHeader className="text-center">
              <DialogTitle className="self-stretch text-center justify-start text-white text-base font-semibold">
                Add New FAQ
              </DialogTitle>
            </DialogHeader>
            <div className="self-stretch inline-flex flex-col justify-start items-start gap-3.5">
              <label className="self-stretch opacity-80 text-white text-base font-normal">
                Question
              </label>
              <input
                type="text"
                className="self-stretch h-12 px-4 py-3.5 bg-[#0B132B] rounded-lg text-neutral-400 text-base font-normal focus:outline-none"
                placeholder="Type question here"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
              />
            </div>
            <div className="self-stretch inline-flex flex-col justify-start items-start gap-3.5">
              <label className="self-stretch opacity-80 text-white text-base font-normal">
                Answer
              </label>
              <textarea
                className="self-stretch h-24 px-4 py-3.5 bg-[#0B132B] rounded-lg text-neutral-400 text-base font-normal focus:outline-none"
                placeholder="Type answer here"
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
              />
            </div>
            <DialogFooter className="flex justify-end gap-[12px] mt-6">
              <Button
                variant="outline"
                className="bg-[#1A3F70] border-[#0c4a6e] hover:bg-[#1A3F70] hover:text-white hover:cursor-pointer w-44 h-11"
                onClick={() => setIsAddOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="bg-[#14AB00] hover:bg-[#14AB00] hover:cursor-pointer w-44 h-11"
                onClick={handleAddFaq}
              >
                Add New FAQ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="bg-[#1b2236] border-[#1F2937] w-[450px] p-6 flex flex-col items-center text-white rounded-lg">
            <DialogHeader className="text-center">
              <DialogTitle className="self-stretch text-center justify-start text-white text-base font-semibold">
                Edit FAQ
              </DialogTitle>
            </DialogHeader>
            <div className="self-stretch inline-flex flex-col justify-start items-start gap-3.5">
              <label className="self-stretch opacity-80 text-white text-base font-normal">
                Question
              </label>
              <input
                type="text"
                className="self-stretch h-12 px-4 py-3.5 bg-[#0B132B] rounded-lg text-neutral-400 text-base font-normal focus:outline-none"
                placeholder="Type question here"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </div>
            <div className="self-stretch inline-flex flex-col justify-start items-start gap-3.5">
              <label className="self-stretch opacity-80 text-white text-base font-normal">
                Answer
              </label>
              <textarea
                className="self-stretch h-24 px-4 py-3.5 bg-[#0B132B] rounded-lg text-neutral-400 text-base font-normal focus:outline-none"
                placeholder="Type answer here"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
            </div>
            <DialogFooter className="flex justify-end gap-[12px] mt-6">
              <Button
                variant="outline"
                className="bg-[#1A3F70] border-[#0c4a6e] hover:bg-[#1A3F70] hover:text-white hover:cursor-pointer w-44 h-11"
                onClick={() => setIsEditOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="bg-[#14AB00] hover:bg-[#14AB00] hover:cursor-pointer w-44 h-11"
                onClick={handleEditFaq}
              >
                Update FAQ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent className="bg-[#141B2D] border-[#1F2937] w-[450px] p-6 flex flex-col items-center text-white rounded-lg">
            <DialogHeader className="text-center">
              <DialogTitle className="text-lg font-semibold text-center">
                Delete FAQ
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-400 text-center">
                Are you sure you want to delete this FAQ? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-center gap-4 mt-4">
              <Button
                variant="outline"
                className="bg-[#1A3F70] border-[#0c4a6e] hover:bg-[#1A3F70] hover:text-white hover:cursor-pointer w-44 h-11"
                onClick={() => setIsDeleteOpen(false)}
              >
                No
              </Button>
              <Button
                variant="destructive"
                className="bg-[#FF4747] hover:bg-[#FF4747] hover:cursor-pointer w-44 h-11"
                onClick={handleDeleteFaq}
              >
                Yes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </SkeletonTheme>
  );
}