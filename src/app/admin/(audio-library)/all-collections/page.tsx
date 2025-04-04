"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { getAllCollectionStats } from "@/services/admin-services"; // Adjust service imports as needed
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { Loader2, ChevronDown, X, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "use-debounce";

interface Collection {
  _id: string;
  name: string;
  imageUrl: string;
  levels: { _id: string; name: string }[];
  bestFor: { _id: string; name: string }[];
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
    collections: Collection[];
    pagination: Pagination;
  };
}

const AllCollection: React.FC = () => {
  const router = useRouter();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
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
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
  const limit = 12;

  // Fetch levels and best for options on mount
  useEffect(() => {
    const fetchLevels = async () => {
      setIsLoadingLevels(true);
      setLevelsError(null);
      try {
        const response = await getAllCollectionStats("/level", {}); // Adjust endpoint/service
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
        const response = await getAllCollectionStats("/bestfor", {}); // Adjust endpoint/service
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

  // Fetch collections with filters
  useEffect(() => {
    const fetchCollections = async () => {
      setLoading(true);
      setError(null);
      try {
        const filters: any = {
          page: currentPage,
          limit,
        };
        
        // Only add filters if they have values
        if (selectedLevels.length > 0) {
          filters.levels = selectedLevels.join(",");
        }
        
        if (selectedBestFor.length > 0) {
          filters.bestFor = selectedBestFor.join(",");
        }
        
        if (debouncedSearchQuery) {
          filters.search = debouncedSearchQuery;
        }
        
        const response = await getAllCollectionStats("/collection", filters);
        const data: ApiResponse = response.data;

        if (data.success) {
          setCollections(data.data.collections);
          setTotalPages(data.data.pagination.totalPages);
        } else {
          throw new Error(data.message || "Failed to fetch collections");
        }
      } catch (err: any) {
        setError("Failed to fetch collections.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, [currentPage, selectedLevels, selectedBestFor, debouncedSearchQuery]);

  // Filter management functions
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

  const getS3Url = (subPath: string) => {
    return `${process.env.NEXT_PUBLIC_AWS_BUCKET_PATH}${subPath}`;
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
 
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="grid grid-cols-12 gap-4 w-full">
      <div className="col-span-12 space-y-6 bg-[#1b2236] rounded-[12px] md:rounded-[20px] py-4 px-4 md:py-8 md:px-9">
        <div className="flex items-center justify-between flex-wrap mb-2">
          <h2 className="text-white text-[20px] md:text-2xl font-bold mb-3">
            Collection
          </h2>
          <Button
            className="w-44 h-8 px-12 py-2 !bg-[#1a3f70] rounded inline-flex justify-center items-center hover:cursor-pointer text-white text-sm !font-normal !leading-tight !tracking-tight"
            onClick={() => router.push("/admin/all-collections/add-new-collection")}
          >
            + Add New Collection
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 items-center md:gap-4 mb-2">
          <div className="">
            <Popover open={isLevelsOpen} onOpenChange={setIsLevelsOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="my-2 w-full bg-[#0B132B] hover:bg-[#0B132B] min-h-12 border-none text-white justify-between"
                >
                  <div className="flex overflow-auto flex-wrap gap-2 items-center">
                    {isLoadingLevels ? (
                      <Loader2 size={24} className="animate-spin text-white" />
                    ) : selectedLevels.length > 0 ? (
                      selectedLevels.map((levelId) => {
                        const level = levelOptions.find((l) => l.id === levelId);
                        return (
                          <span
                            key={levelId}
                            className="bg-[#1B2236] p-1 rounded-md text-white flex items-center"
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

          <div className="">
            <Popover open={isBestForOpen} onOpenChange={setIsBestForOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="my-2 w-full bg-[#0B132B] hover:bg-[#0B132B] min-h-12 border-none text-white justify-between"
                >
                  <div className="flex flex-wrap gap-2 items-center">
                    {isLoadingBestFor ? (
                      <Loader2 size={24} className="animate-spin text-white" />
                    ) : selectedBestFor.length > 0 ? (
                      selectedBestFor.map((bestForId) => {
                        const bestFor = bestForOptions.find((b) => b.id === bestForId);
                        return (
                          <span
                            key={bestForId}
                            className="bg-[#1B2236] p-1 rounded-md text-white flex items-center"
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

        {/* Collections Grid */}
        {!loading ? (
          collections.length > 0 ? (
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 justify-center gap-4">
              {collections.map((collection) => (
                <Card
                  key={collection._id}
                  className="bg-transparent w-full border-none p-0 overflow-hidden items-center hover:cursor-pointer duration-300 shadow-none"
                  onClick={() => router.push(`/admin/all-collections/edit-collection/${collection._id}`)}
                >
                  <CardContent className="p-0">
                    <Image
                      src={collection?.imageUrl ? getS3Url(collection?.imageUrl) : "/default-placeholder.png"}
                      alt={collection?.name}
                      width={200}
                      height={200}
                      className="w-60 h-48 object-cover rounded-xl"
                    />
                  </CardContent>
                  <div className="text-white text-center bg-transparent p-2 text-sm font-medium">
                    {collection?.name}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-white text-center py-8">
              No collections found. Try adjusting your filters.
            </div>
          )
        ) : (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {Array(12)
              .fill(null)
              .map((_, index) => (
                <SkeletonTheme key={index} baseColor="#ebebeb" highlightColor="#1b2236" borderRadius={10}>
                  <Skeleton height={250} width={240} />
                </SkeletonTheme>
              ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-end items-center gap-2 mt-4">
            <Button
              className="bg-[#0B132B] hover:bg-[#1A3F70] hover:cursor-pointer"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-white text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              className="bg-[#0B132B] hover:bg-[#1A3F70] hover:cursor-pointer"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllCollection;