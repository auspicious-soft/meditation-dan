"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Clock, Trash2, Play, Pause, MoreVertical, Pencil, AlertCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getAllAudiosStats } from "@/services/admin-services";
import { deleteAudio } from "@/services/admin-services";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Audio {
  _id: string;
  songName: string;
  duration: string;
  collectionType: {
    name: string;
  };
  imageUrl: string;
  audioUrl: string;
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

const AudioList = () => {
  const router = useRouter();
  const [audios, setAudios] = useState<Audio[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [audioToDelete, setAudioToDelete] = useState<string | null>(null);
  const limit = 10;

  const audioRef = useRef<HTMLAudioElement | null>(null);

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
          setAudios(data.data.audios);
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

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [currentPage]);

  const getS3Url = (subPath: string) => {
    return `${process.env.NEXT_PUBLIC_AWS_BUCKET_PATH}${subPath}`;
  };

  const handlePlayPause = async (audio: Audio) => {
    if (!audio.audioUrl) return;

    const audioUrl = getS3Url(audio.audioUrl);

    if (playingAudioId === audio._id) {
      if (audioRef.current) {
        audioRef.current.pause();
        setPlayingAudioId(null);
        audioRef.current = null;
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      const newAudio = new Audio(audioUrl);
      audioRef.current = newAudio;

      try {
        await newAudio.play();
        setPlayingAudioId(audio._id);
        newAudio.onended = () => {
          setPlayingAudioId(null);
          audioRef.current = null;
        };
      } catch (err) {
        console.error("Playback failed:", err);
        setPlayingAudioId(null);
        audioRef.current = null;
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await deleteAudio(`/admin/delete-audio/${id}`);

      if (response?.data?.success) {
        toast.success("Audio deleted successfully");
        window.location.reload();
      } else {
        throw new Error(response?.data?.message || "Failed to delete audio");
      }
    } catch (err) {
      console.error("Error deleting audio:", err);
      toast.error("Failed to delete audio");
    } finally {
      setAudioToDelete(null);
      setIsDialogOpen(false);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/audio-files/edit-audio/${id}`);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
    }
  };

  const openDeleteDialog = (id: string) => {
    setAudioToDelete(id);
    setIsDialogOpen(true);
  };

  const cancelDelete = () => {
    setAudioToDelete(null);
    setIsDialogOpen(false);
  };

  if (loading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {audios.map((audio) => (
          <div
            key={audio._id}
            className="flex flex-col md:flex-row items-center justify-between w-full min-h-[100px] relative bg-slate-900 p-4 rounded"
          >
            <div className="rounded bg-slate-800 overflow-hidden flex-shrink-0">
              <Image
                src={audio?.imageUrl ? getS3Url(audio?.imageUrl) : "/default-placeholder.png"}
                alt={audio?.songName}
                className="object-cover"
                width={60}
                height={40}
                style={{ height: "auto" }}
              />
            </div>

            <div className="flex-1 min-w-0 mx-3">
              <div className="text-sm text-center text-slate-400">Music Name:</div>
              <div className="text-white text-center font-medium truncate">{audio?.songName}</div>
            </div>

            <div className="text-center flex-1 min-w-0 mx-3">
              <div className="text-sm text-center text-slate-400">Duration</div>
              <div className="flex text-center items-center justify-center text-white">
                <Clock size={14} className="mr-1" />
                <span>{audio?.duration}</span>
              </div>
            </div>

            <div className="text-center flex-1 min-w-0 mx-3">
              <div className="text-sm text-center text-slate-400">Collection</div>
              <div className="text-white text-center border-0 truncate">{audio?.collectionType?.name || "Unknown Collection"}</div>
            </div>

            <div>
              <button
                className="text-slate-400 hover:cursor-pointer rounded-md bg-[#1B2236] p-2 hover:text-white"
                onClick={() => handlePlayPause(audio)}
                disabled={!audio?.audioUrl}
              >
                {playingAudioId === audio._id ? <Pause size={25} /> : <Play size={24} color="white" fill="white" />}
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-slate-400 hover:cursor-pointer rounded-md p-1 hover:text-white">
                    <MoreVertical size={25} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#1B2236] text-white border border-[#334155]">
                  <DropdownMenuItem
                    className="hover:bg-[#1B2236] cursor-pointer"
                    onClick={() => handleEdit(audio._id)}
                  >
                    <Pencil size={16} className="mr-2 hover:text-black" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="hover:bg-[#1B2236] cursor-pointer"
                    onClick={() => openDeleteDialog(audio._id)}
                  >
                    <Trash2 size={16} className="mr-2 hover:text-black" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#1B2236] text-center w-96 flex flex-col justify-center items-center text-white border border-[#334155]">
          <DialogHeader className="flex flex-col items-center">
            <div className="mb-4">
              <AlertCircle size={40} className="text-red-500" />
            </div>
            <DialogTitle className="text-xl font-semibold">
              Delete Audio?
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-center">
              Are you sure you want to delete this audio? <br />
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex  items-center justify-center gap-4">
            <Button
              className="bg-[#1A3F70] text-white hover:bg-#1A3F70] w-42"
              onClick={cancelDelete}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#FF4747] hover:bg-[#FF4747] w-42"
              onClick={() => audioToDelete && handleDelete(audioToDelete)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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