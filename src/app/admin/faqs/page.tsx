"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";



const faqData = [
  {
    id: 1,
    question: "How do I start my first meditation session?",
    answer:
      "Simply open the app, choose a guided session from the beginner category, and follow the instructions to relax and focus.",
  },
  {
    id: 2,
    question: "How do I start my first meditation session?",
    answer:
      "Simply open the app, choose a guided session from the beginner category, and follow the instructions to relax and focus.",
  },
  {
    id: 3,
    question: "How do I start my first meditation session?",
    answer:
      "Simply open the app, choose a guided session from the beginner category, and follow the instructions to relax and focus.",
  },
  {
    id: 4,
    question: "How do I start my first meditation session?",
    answer:
      "Simply open the app, choose a guided session from the beginner category, and follow the instructions to relax and focus.",
  },
  {
    id: 5,
    question: "How do I start my first meditation session?",
    answer:
      "Simply open the app, choose a guided session from the beginner category, and follow the instructions to relax and focus.",
  },
  {
    id: 6,
    question: "How do I start my first meditation session?",
    answer:
      "Simply open the app, choose a guided session from the beginner category, and follow the instructions to relax and focus.",
  },
  {
    id: 7,
    question: "How do I start my first meditation session?",
    answer:
      "Simply open the app, choose a guided session from the beginner category, and follow the instructions to relax and focus.",
  },
];

export default function Page() {
  const router = useRouter();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const handleDeleteAccount = () => {
    console.log("Delete account requested");
    setIsDeleteOpen(false); // Close dialog after action
  };

  const handleDeclineAccount = () => {
    console.log("Decline account requested");
    setIsEditOpen(false); // Close dialog after action
  };

    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");

    function handleSaveFaq(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        event.preventDefault();
        if (!question.trim() || !answer.trim()) {
            console.error("Both question and answer are required.");
            return;
        }

        console.log("FAQ saved:", { question, answer });
        setIsEditOpen(false); // Close the dialog after saving
        setQuestion(""); // Reset the question input
        setAnswer(""); // Reset the answer input
    }

  return (
    <>
      <div className="mb-[20px] bg-[#1A3F70] rounded py-[8px] px-[18px] inline-flex justify-center items-center gap-2.5 cursor-pointer ml-auto w-fit">
          <div  onClick={() => setIsAddOpen(true)} className="text-white text-sm font-normal"> + Add New </div>
      </div>

      <div className="flex flex-col gap-4">
        {faqData.map((faq) => (

<div
  key={faq.id}
  className="flex items-center p-[20px] bg-[#1b2236] rounded-lg gap-4"
>
  <div className="text-white text-sm font-bold">{faq.id}.</div>
  <div className="flex-1">
    <div className="text-white text-sm font-bold">{faq.question}</div>
    <div className="mt-1 text-white text-sm font-normal">{faq.answer}</div>
  </div>

  <div className="flex gap-4 ml-auto items-center">
    <Image
      onClick={() => setIsEditOpen(true)}
      src="/Edit.svg"
      alt="edit"
      height={24}
      width={24}
    />
    <Image
      onClick={() => setIsDeleteOpen(true)}
      src="/Delete.svg"
      alt="delete"
      height={24}
      width={24}
    />
  </div>
</div>

        ))}


{/* Add dialog box */}

<Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
  <DialogContent className=" bg-[#1b2236]  border-[#1F2937] w-[450px] p-6 flex flex-col items-center text-white rounded-lg">
    <DialogHeader className="text-center">
      <DialogTitle>
        <VisuallyHidden>Add/Edit FAQ</VisuallyHidden>
      </DialogTitle>
      <div className="self-stretch text-center justify-start text-white text-base font-semibold">
        Add/Edit FAQ
      </div>
    </DialogHeader>

    <div className="self-stretch inline-flex flex-col justify-start items-start gap-3.5 ">
      <label className="self-stretch opacity-80 text-white text-base font-normal">
        Question
      </label>
      <input
        type="text"
        className="self-stretch h-12 px-4 py-3.5 bg-[#0B132B] rounded-lg text-neutral-400 text-base font-normal focus:outline-none "
        placeholder="Type question here"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
    </div>

    <div className="self-stretch inline-flex flex-col justify-start items-start gap-3.5 ">
      <label className="self-stretch opacity-80 text-white text-base font-normal">
        Answer
      </label>
      <textarea
        className="self-stretch h-24 px-4 py-3.5 bg-[#0B132B] rounded-lg text-neutral-400 text-base font-normal focus:outline-none "
        placeholder="Type answer here"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
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
        onClick={handleSaveFaq}
      >
        Update
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>;


{/* Edit dialog box */}

<Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
  <DialogContent className=" bg-[#1b2236]  border-[#1F2937] w-[450px] p-6 flex flex-col items-center text-white rounded-lg">
    <DialogHeader className="text-center">
      <DialogTitle>
        <VisuallyHidden>Add/Edit FAQ</VisuallyHidden>
      </DialogTitle>
      <div className="self-stretch text-center justify-start text-white text-base font-semibold">
        Add/Edit FAQ
      </div>
    </DialogHeader>

    <div className="self-stretch inline-flex flex-col justify-start items-start gap-3.5 ">
      <label className="self-stretch opacity-80 text-white text-base font-normal">
        Question
      </label>
      <input
        type="text"
        className="self-stretch h-12 px-4 py-3.5 bg-[#0B132B] rounded-lg text-neutral-400 text-base font-normal focus:outline-none "
        placeholder="Type question here"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
    </div>

    <div className="self-stretch inline-flex flex-col justify-start items-start gap-3.5 ">
      <label className="self-stretch opacity-80 text-white text-base font-normal">
        Answer
      </label>
      <textarea
        className="self-stretch h-24 px-4 py-3.5 bg-[#0B132B] rounded-lg text-neutral-400 text-base font-normal focus:outline-none "
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
        onClick={handleSaveFaq}
      >
        Update
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>;



{/* Delete dialog box */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent className="bg-[#141B2D] border-[#1F2937] w-[450px] p-6 flex flex-col items-center text-white rounded-lg">
            <DialogHeader className="text-center">
              <DialogTitle className="text-lg font-semibold text-center">
              Delete
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-400 text-center">
                Are you sure you want to Delete?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-center gap-4 mt-4">
          
              <Button
                variant="destructive"
                className="bg-[#FF4747] hover:bg-[#FF4747] hover:cursor-pointer w-44 h-11"
                onClick={handleDeleteAccount}
              >
                Yes
              </Button>
              <Button
                variant="outline"
                className="bg-[#1A3F70] border-[#0c4a6e] hover:bg-[#1A3F70] hover:text-white hover:cursor-pointer w-44 h-11"
                onClick={() => setIsDeleteOpen(false)}
              >
                No
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>




      </div>
    </>
  );
}