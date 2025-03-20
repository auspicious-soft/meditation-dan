"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

import { Clock, MoreVertical} from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

const AudioList = () => {
  const [audios, setAudios] = useState([
    { id: 1, name: "Gentle Rain", duration: "25 min", collection: "Deep Sleep", image: "/audio-thumbnail.jpg" },
    { id: 2, name: "Gentle Rain", duration: "25 min", collection: "Deep Sleep", image: "/audio-thumbnail.jpg" },
    { id: 3, name: "Gentle Rain", duration: "25 min", collection: "Deep Sleep", image: "/audio-thumbnail.jpg" },
    { id: 4, name: "Gentle Rain", duration: "25 min", collection: "Deep Sleep", image: "/audio-thumbnail.jpg" },
    { id: 5, name: "Gentle Rain", duration: "25 min", collection: "Deep Sleep", image: "/audio-thumbnail.jpg" },
    { id: 6, name: "Gentle Rain", duration: "25 min", collection: "Deep Sleep", image: "/audio-thumbnail.jpg" },
  ]);

  // Handle delete
  const handleDelete = (id: number) => {
    setAudios(audios.filter((audio) => audio.id !== id));
  };

  return (
    <div className="p-6 bg-[#1B2236] text-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">All Audios</h2>
        <Button className="w-44 h-8 px-12 py-2 !bg-[#1a3f70] rounded inline-flex justify-center items-center hover:cursor-pointer text-white text-sm !font-normal !leading-tight !tracking-tight"
            >
          
         + Add New Audio
        </Button>
      </div>

      {/* Audio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {audios.map((audio) => (
    <div key={audio.id} className="flex items-center justify-around w-full bg-slate-900 p-3 rounded">
      <div className="flex items-center justify-around gap-3">
        <div className="h-10 w-10 rounded bg-slate-800 overflow-hidden">
          <Image 
            src={audio.image} 
            alt={audio.name} 
            className="h-full w-full object-cover"
            width={40}
            height={40}
          />
        </div>
        
        <div>
          <div className="text-sm text-slate-400">Music Name:</div>
          <div className="text-white font-medium">{audio.name}</div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="text-center">
          <div className="text-sm text-slate-400">Duration</div>
          <div className="flex items-center text-white">
            <Clock size={14} className="mr-1" />
            <span>{audio.duration}</span>
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-sm text-slate-400">Collection</div>
          <Badge variant="secondary" className="bg-blue-900 text-blue-200 hover:bg-blue-800 border-0">
            {audio.collection}
          </Badge>
        </div>
        
        <button className="text-slate-400 hover:text-white">
          <MoreVertical size={18} />
        </button>
      </div>
    </div>
  ))}
</div>
    </div>
  );
};

export default AudioList;
