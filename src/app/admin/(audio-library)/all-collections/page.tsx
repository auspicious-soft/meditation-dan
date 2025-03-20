"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import pexels from "../../../../../public/images/auth-image.png";

const categories = [
  { title: "Deep Sleep", image: "/public/images/pexels.webp" },
  { title: "Fall Asleep Fast", image: "/images/sleep-2.jpg" },
  { title: "Sounds Of Nature", image: "/images/sleep-3.jpg" },
  { title: "Relax", image: "/images/sleep-4.jpg" },
  { title: "Deep Sleep", image: "/images/sleep-1.jpg" },
  { title: "Fall Asleep Fast", image: "/images/sleep-2.jpg" },
  { title: "Sounds Of Nature", image: "/images/sleep-3.jpg" },
  { title: "Relax", image: "/images/sleep-4.jpg" },
];

const AllCollection: React.FC = () => {
  const router = useRouter();

  return (
    <div className="grid grid-cols-12 gap-4 w-full">
      <div className="col-span-12  space-y-6 bg-[#1b2236] rounded-[12px] md:rounded-[20px] py-4 px-4 md:py-8 md:px-9">
        <div className="flex items-center justify-between flex-wrap mb-0">
          <h2 className="text-white text-[20px] md:text-2xl font-bold mb-3">
            Categories
          </h2>
          <Button
            className="w-44 h-8 px-12 py-2 !bg-[#1a3f70] rounded inline-flex justify-center items-center hover:cursor-pointer text-white text-sm !font-normal !leading-tight !tracking-tight"
            onClick={() => router.push("/admin/all-collections/add-new-collection")}
          >
            + Add New Collection
          </Button>
        </div>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 justify-center gap-4 i ">
          {categories.map((category, index) => (
            <Card
              key={index}
              className="bg-transparent border-none overflow-hidden items-center hover:cursor-pointer duration-300 shadow-none"

            >
              <CardContent className="p-0">
                <Image
                  src={pexels}
                  alt={category.title}
                  width={200}
                  height={200}
                  className="w-60 h-48  object-cover rounded-xl"
                />
              </CardContent>
              <div className="text-white text-center bg-transparent p-2  text-sm font-medium">
                {category.title}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllCollection;
