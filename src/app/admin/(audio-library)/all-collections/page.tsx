"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { getAllCollectionStats } from "@/services/admin-services";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

interface Collection {
  _id: string;
  name: string;
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
  const limit = 12;

  // Fetch collections with pagination
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await getAllCollectionStats("/collection", {
          page: currentPage,
          limit,
        });

        const data: ApiResponse = response.data;
        console.log('data:', data);

        if (data.success) {
          setCollections(data.data.collections);
          setTotalPages(data.data.pagination.totalPages);
        } else {
          throw new Error(data.message || "Failed to fetch collections");
        }
      } catch (err) {
        setError("Failed to fetch collections.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, [currentPage]);

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
        {/* <div className="flex items-center justify-between flex-wrap mb-2">
          <h2 className="text-white text-[20px] md:text-2xl font-bold mb-3">
            Collection
          </h2>
          <Button
            className="w-44 h-8 px-12 py-2 !bg-[#1a3f70] rounded inline-flex justify-center items-center hover:cursor-pointer text-white text-sm !font-normal !leading-tight !tracking-tight"
            onClick={() => router.push("/admin/all-collections/add-new-collection")}
          >
            + Add New Collection
          </Button>
        </div> */}
        {!loading ?
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 justify-center gap-4">
            {
              collections.map((collection) => (
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
              ))
            }
          </div>
          :
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {Array(12).fill(null).map((_, index) => (
              <SkeletonTheme key={index} baseColor="#ebebeb" highlightColor="#1b2236"  borderRadius={10}>
              <Skeleton height={250} width={240} />
              </SkeletonTheme>
            ))}
            </div>
        }

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