"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Clock, Trash2 } from "lucide-react";
import Image from "next/image";
import audioimage from "../../../../../public/images/auth-image.png";
import { useRouter } from "next/navigation";

const AudioList = () => {
  const router = useRouter();
  const [audios, setAudios] = useState([
    {
      id: 1,
      name: "Gentle Rain",
      duration: "25 min",
      collection: "Deep Sleep",
      image: "/audio-thumbnail.jpg",
    },
    {
      id: 2,
      name: "Gentle Rain",
      duration: "25 min",
      collection: "Deep Sleep",
      image: "/audio-thumbnail.jpg",
    },
    {
      id: 3,
      name: "Gentle Rain",
      duration: "25 min",
      collection: "Deep Sleep",
      image: "/audio-thumbnail.jpg",
    },
    {
      id: 4,
      name: "Gentle Rain",
      duration: "25 min",
      collection: "Deep Sleep",
      image: "/audio-thumbnail.jpg",
    },
    {
      id: 5,
      name: "Gentle Rain",
      duration: "25 min",
      collection: "Deep Sleep",
      image: "/audio-thumbnail.jpg",
    },
    {
      id: 6,
      name: "Gentle Rain",
      duration: "25 min",
      collection: "Deep Sleep",
      image: "/audio-thumbnail.jpg",
    },
  ]);

  console.log(setAudios);
  // Handle delete
  const handleDelete = (id: number) => {
    setAudios(audios.filter((audio) => audio.id !== id));
  };

  return (
    <div className="p-6 bg-[#1B2236] flex flex-col  text-white rounded-lg shadow-md">
      <div className="flex justify-between items-center flex-wrap mb-4">
        <h2 className="text-xl font-semibold">All Audios</h2>
        <Button
          className="w-44 h-8 px-12 py-2 !bg-[#1a3f70] rounded inline-flex justify-center items-center hover:cursor-pointer text-white text-sm !font-normal !leading-tight !tracking-tight"
          onClick={() => router.push("/admin/audio-files/add-new-audio")}
        >
          + Add New Audio
        </Button>
      </div>

      {/* Audio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {audios.map((audio) => (
          <div
            key={audio.id}
            className="flex flex-col md:flex-row items-center justify-between w-full min-h-[100px] relative bg-slate-900 p-4 rounded"
          >
            {/* Image */}
            <div className="rounded bg-slate-800 overflow-hidden flex-shrink-0">
              <Image
                src={audioimage}
                alt={audio.name}
                className="object-cover"
                width={60}
                height={60}
              />
            </div>

            {/* Music Name */}
            <div className="flex-1 min-w-0 mx-3">
              <div className="text-sm text-slate-400">Music Name:</div>
              <div className="text-white font-medium truncate">{audio.name}</div>
            </div>

            {/* Duration */}
            <div className="text-center flex-1 min-w-0 mx-3">
              <div className="text-sm text-slate-400">Duration</div>
              <div className="flex items-center justify-center text-white">
                <Clock size={14} className="mr-1" />
                <span>{audio.duration}</span>
              </div>
            </div>

            {/* Collection */}
            <div className="text-center flex-1 min-w-0 mx-3">
              <div className="text-sm text-slate-400">Collection</div>
              <div className="text-white border-0 truncate">{audio.collection}</div>
            </div>

            {/* Delete Button */}
            <button
              className="text-slate-400 absolute top-2 right-2 hover:cursor-pointer rounded-md bg-[#1B2236] p-1 hover:text-white"
              onClick={() => handleDelete(audio.id)}
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AudioList;
