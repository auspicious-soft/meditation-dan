"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Clock, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getAllAudiosStats } from "@/services/admin-services"; // Adjust import path
import { getImageUrlOfS3 } from "@/actions"; // Adjust import path

interface Audio {
  _id: string;
  songName: string;
  duration: string;
  collectionType: {
    name: string;
  };
  imageUrl: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    audios: Audio[];
    pagination: Pagination;
  };
}

// Enhanced Audio type with resolved image URL
interface EnhancedAudio extends Audio {
  resolvedImageUrl: string;
}

const AudioList = () => {
  const router = useRouter();
  const [audios, setAudios] = useState<EnhancedAudio[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const limit = 10;

  // Fetch audios with pagination
  useEffect(() => {
    const fetchAudios = async () => {
      try {
        setLoading(true);
        const response = await getAllAudiosStats("/audio", {
          page: currentPage,
          limit,
        });

        const data: ApiResponse = response.data;

        if (data.success) {
          // Resolve image URLs for each audio
          const enhancedAudios = await Promise.all(
            data.data.audios.map(async (audio) => ({
              ...audio,
              resolvedImageUrl: audio.imageUrl
                ? await getImageUrlOfS3(audio.imageUrl)
                : "/default-placeholder.png",
            }))
          );
          setAudios(enhancedAudios);
          setTotalPages(data.data.pagination.totalPages);
        } else {
          throw new Error(data.message || "Failed to fetch audios");
        }
      } catch (err) {
        setError("Failed to fetch audios.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAudios();
  }, [currentPage]);

  // Handle delete (client-side only for now)
  const handleDelete = (id: string) => {
    setAudios(audios.filter((audio) => audio._id !== id));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 bg-[#1B2236] flex flex-col text-white rounded-lg shadow-md">
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
            key={audio._id}
            className="flex flex-col md:flex-row items-center justify-between w-full min-h-[100px] relative bg-slate-900 p-4 rounded"
          >
            {/* Image */}
            <div className="rounded bg-slate-800 overflow-hidden flex-shrink-0">
              <Image
                src={audio.resolvedImageUrl}
                alt={audio.songName}
                className="object-cover"
                width={60}
                height={60}
                onError={(e) => {
                  e.currentTarget.src = "/default-placeholder.png";
                }}
              />
            </div>

            {/* Music Name */}
            <div className="flex-1 min-w-0 mx-3">
              <div className="text-sm text-slate-400">Music Name:</div>
              <div className="text-white font-medium truncate">{audio.songName}</div>
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
              <div className="text-white border-0 truncate">{audio.collectionType.name}</div>
            </div>

            {/* Delete Button */}
            <button
              className="text-slate-400 absolute top-2 right-2 hover:cursor-pointer rounded-md bg-[#1B2236] p-1 hover:text-white"
              onClick={() => handleDelete(audio._id)}
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-end items-center gap-2 mt-4">
          <Button
            className="bg-[#0B132B] hover:bg-[#1A3F70]"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-white text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            className="bg-[#0B132B] hover:bg-[#1A3F70]"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default AudioList;