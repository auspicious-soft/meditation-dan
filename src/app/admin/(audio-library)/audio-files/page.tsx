"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Trash2,
  Play,
  Pause,
  MoreVertical,
  Pencil,
  AlertCircle,
  Loader2,
  ChevronDown,
  X,
  Search,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getAllAudiosStats, deleteAudio } from "@/services/admin-services";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useDebounce } from "use-debounce";

interface Audio {
  _id: string;
  songName: string;
  duration: string;
  collectionType: {
    name: string;
  };
  imageUrl: string;
  audioUrl: string;
  levels?: { _id: string; name: string }[];
  bestFor?: { _id: string; name: string }[];
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
  const [loadingAudioId, setLoadingAudioId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [audioToDelete, setAudioToDelete] = useState<string | null>(null);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedBestFor, setSelectedBestFor] = useState<string[]>([]);
  const [levelOptions, setLevelOptions] = useState<{ id: string; name: string }[]>([]);
  const [bestForOptions, setBestForOptions] = useState<{ id: string; name: string }[]>([]);
  const [isLoadingLevels, setIsLoadingLevels] = useState<boolean>(false);
  const [isLoadingBestFor, setIsLoadingBestFor] = useState<boolean>(false);
  const [levelsError, setLevelsError] = useState<string | null>(null);
  const [bestForError, setBestForError] = useState<string | null>(null);
  const [isLevelsOpen, setIsLevelsOpen] = useState<boolean>(false);
  const [isBestForOpen, setIsBestForOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery] = useDebounce(searchQuery.trim(), 500);
  const limit = 10;

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch levels and best for options on mount
  useEffect(() => {
    const fetchLevels = async () => {
      setIsLoadingLevels(true);
      setLevelsError(null);
      try {
        const response = await getAllAudiosStats("/level", {}); // Adjust endpoint if needed
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
        const response = await getAllAudiosStats("/bestfor", {}); // Adjust endpoint if needed
        if (response?.data?.success && Array.isArray(response?.data?.data)) {
          const transformedOptions = response.data.data
            .filter((option: any) => option.isActive)
            .map((option: any) => ({
              id: option._id,
              name: option.name,
            }));
          setBestForOptions(transformedOptions);
        } else {
          setBestForError(response?.data?.message || "Failed to load best for options");
        }
      } catch (error) {
        console.error("Error fetching best for options:", error);
        setBestForError("An error occurred while fetching best for options");
      } finally {
        setIsLoadingBestFor(false);
      }
    };

    fetchLevels();
    fetchBestForOptions();
  }, []);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedLevels, selectedBestFor, debouncedSearchQuery]);

  // Fetch audios with filters
  useEffect(() => {
    const fetchAudios = async () => {
      setLoading(true);
      setError(null);
      try {
        const filters: any = {
          page: currentPage,
          limit,
        };

        if (selectedLevels.length > 0) {
          filters.levels = selectedLevels.join(",");
        }

        if (selectedBestFor.length > 0) {
          filters.bestFor = selectedBestFor.join(",");
        }

        if (debouncedSearchQuery) {
          filters.search = debouncedSearchQuery;
        }

        const response = await getAllAudiosStats("/audio", filters);
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
      stopCurrentAudio();
    };
  }, [currentPage, selectedLevels, selectedBestFor, debouncedSearchQuery]);

  const stopCurrentAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
      setPlayingAudioId(null);
    }
  };

  const getS3Url = (subPath: string) => {
    return `${process.env.NEXT_PUBLIC_AWS_BUCKET_PATH}${subPath}`;
  };

  const handlePlayPause = async (audio: Audio) => {
    if (!audio.audioUrl) return;

    const audioUrl = getS3Url(audio.audioUrl);

    if (playingAudioId === audio._id) {
      stopCurrentAudio();
      return;
    }

    stopCurrentAudio();

    setLoadingAudioId(audio._id);

    try {
      const newAudio = new Audio(audioUrl);
      audioRef.current = newAudio;

      newAudio.onended = () => {
        setPlayingAudioId(null);
        audioRef.current = null;
      };

      newAudio.onerror = (e) => {
        console.error("Audio playback error:", e);
        setPlayingAudioId(null);
        setLoadingAudioId(null);
        audioRef.current = null;
        toast.error("Failed to play audio");
      };

      await newAudio.play();
      setPlayingAudioId(audio._id);
    } catch (err) {
      console.error("Playback failed:", err);
      toast.error("Failed to play audio");
    } finally {
      setLoadingAudioId(null);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await deleteAudio(`/admin/delete-audio/${id}`);

      if (response?.data?.success) {
        toast.success("Audio deleted successfully");
        setAudios((prev) => prev.filter((audio) => audio._id !== id));
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
      stopCurrentAudio();
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

  const addLevel = (levelId: string) => {
    if (!selectedLevels.includes(levelId)) {
      setSelectedLevels((prev) => [...prev, levelId]);
    }
  };

  const removeLevel = (levelId: string) => {
    setSelectedLevels((prev) => prev.filter((id) => id !== levelId));
  };

  const addBestFor = (bestForId: string) => {
    if (!selectedBestFor.includes(bestForId)) {
      setSelectedBestFor((prev) => [...prev, bestForId]);
    }
  };

  const removeBestFor = (bestForId: string) => {
    setSelectedBestFor((prev) => prev.filter((id) => id !== bestForId));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="px-4 py-5 lg:p-6 bg-[#1B2236] flex flex-col text-white rounded-lg shadow-md">
      <div className="flex justify-between items-center flex-wrap mb-4">
        <h2 className="text-xl font-semibold">All Audios</h2>
        <Button
          className="w-44 h-8 px-12 py-2 !bg-[#1a3f70] rounded inline-flex justify-center items-center hover:cursor-pointer text-white text-sm !font-normal !leading-tight !tracking-tight"
          onClick={() => router.push("/admin/audio-files/add-new-audio")}
        >
          + Add New Audio
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 items-center md:gap-4 mb-2">
        <div>
          <Popover open={isLevelsOpen} onOpenChange={setIsLevelsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="my-2 w-full bg-[#0B132B] hover:bg-[#0B132B] min-h-12 border-none text-white justify-between"
              >
                <div className="flex items-center w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 p-1" style={{ maxHeight: '40px' }}>
                  {isLoadingLevels ? (
                    <Loader2 size={24} className="animate-spin text-white" />
                  ) : selectedLevels.length > 0 ? (
                    selectedLevels.map((levelId) => {
                      const level = levelOptions.find((l) => l.id === levelId);
                      return (
                        <span
                          key={levelId}
                          className="bg-[#1B2236] text-white px-2 py-1 rounded-md flex items-center mr-2 whitespace-nowrap"
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
            <PopoverContent className="bg-[#0B132B] border-gray-700 text-white p-0">
              {isLoadingLevels ? (
                <div className="p-2">
                  <Loader2 size={24} className="animate-spin text-white" />
                </div>
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
        </div>

        <div>
          <Popover open={isBestForOpen} onOpenChange={setIsBestForOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="my-2 w-full bg-[#0B132B] hover:bg-[#0B132B] min-h-12 border-none text-white justify-between"
              >
                <div className="flex items-center w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 p-1" style={{ maxHeight: '40px' }}>
                  {isLoadingBestFor ? (
                    <Loader2 size={24} className="animate-spin text-white" />
                  ) : selectedBestFor.length > 0 ? (
                    selectedBestFor.map((bestForId) => {
                      const bestFor = bestForOptions.find((b) => b.id === bestForId);
                      return (
                        <span
                          key={bestForId}
                          className="bg-[#1B2236] text-white px-2 py-1 rounded-md flex items-center mr-2 whitespace-nowrap"
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
            <PopoverContent className="bg-[#0B132B] border-gray-700 text-white p-0">
              {isLoadingBestFor ? (
                <div className="p-2">
                  <Loader2 size={24} className="animate-spin text-white" />
                </div>
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
        </div>

        <div className="relative my-2 flex justify-between items-center bg-[#0b132b] h-12 !rounded-lg">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-white" />
          <Input
            type="text"
            placeholder="Search..."
            className="pl-8 placeholder-white bg-transparent dm-sans border-0 !rounded-lg !text-sm font-normal !text-white"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>

      {!loading ? (
        <div className="grid grid-cols-2 gap-4">
          {audios.length > 0 ? (
            audios.map((audio) => (
              <div
                key={audio._id}
                className="flex flex-col lg:flex-row items-center space-y-2 justify-between w-full min-h-[100px] relative bg-slate-900 p-4 rounded"
              >
                <div className="rounded bg-slate-800 overflow-hidden flex-shrink-0">
                  <Image
                    src={
                      audio?.imageUrl
                        ? getS3Url(audio?.imageUrl)
                        : "/default-placeholder.png"
                    }
                    alt={audio?.songName}
                    className="object-cover"
                    width={60}
                    height={40}
                    style={{ height: "auto" }}
                  />
                </div>

                <div className="flex-1 min-w-0 mx-3">
                  <div className="text-sm text-center text-slate-400">
                    Music Name:
                  </div>
                  <div className="text-white text-center text-sm font-medium truncate">
                    {audio?.songName}
                  </div>
                </div>

                <div className="text-center flex-1 min-w-0 mx-3">
                  <div className="text-sm text-center text-slate-400">
                    Duration
                  </div>
                  <div className="flex text-center items-center text-sm justify-center text-white">
                    <Clock size={14} className="mr-1" />
                    <span>{audio?.duration}</span>
                  </div>
                </div>

                <div className="text-center flex-1 min-w-0 mx-3">
                  <div className="text-sm text-center text-slate-400">
                    Collection
                  </div>
                  <div className="text-white text-sm text-center border-0 truncate">
                    {audio?.collectionType?.name || "Unknown Collection"}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className="text-slate-400 hover:cursor-pointer rounded-md bg-[#1B2236] p-2 hover:text-white relative"
                    onClick={() => handlePlayPause(audio)}
                    disabled={!audio?.audioUrl || loadingAudioId === audio._id}
                  >
                    {loadingAudioId === audio._id ? (
                      <Loader2 size={24} className="animate-spin text-white" />
                    ) : playingAudioId === audio._id ? (
                      <Pause size={25} />
                    ) : (
                      <Play size={24} color="white" fill="white" />
                    )}
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
                        <Trash2
                          size={16}
                          className="mr-2 h-4 w-4 hover:text-black"
                        />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          ) : (
            <div className="text-white text-center py-8 col-span-2">
              No audios found. Try adjusting your filters.
            </div>
          )}
        </div>
      ) : (
        <div>
          <SkeletonTheme
            baseColor="#ebebeb"
            highlightColor="#1b2236"
            borderRadius={10}
          >
            <Skeleton count={5} height={100} />
          </SkeletonTheme>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#1B2236] text-center w-96 flex flex-col justify-center items-center text-white border border-[#334155]">
          <DialogHeader className="flex flex-col items-center">
            <div className="mb-4 p-3 bg-[#FEF3F2] rounded-full">
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
          <DialogFooter className="flex items-center justify-center gap-4">
            <Button
              className="bg-[#1A3F70] border-none hover:cursor-pointer text-white hover:bg-[#1A3F70] w-42"
              onClick={cancelDelete}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#FF4747] border-none hover:cursor-pointer hover:bg-[#FF4747] w-42"
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