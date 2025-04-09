"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { getStripeDetail } from "@/services/admin-services"; // Import the API function
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload, Trash2 } from "lucide-react"; // Added for consistency (though not used here)
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const Page = () => {
  interface Plan {
    name: string;
    price: string;
    features: string[];
    description: string;
  }
  
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch Stripe product details on mount
  useEffect(() => {
    const fetchPlans = async () => {
      setIsLoading(true);
      try {
        const response = await getStripeDetail("admin/products", { status: "active" });
        if (response.data.success) {
          interface Product {
            name: string;
            description?: string;
            prices: { active: boolean; unit_amount: number }[];
          }

          const fetchedPlans = response.data.products.map((product: Product) => {
            // Find the active price and convert unit_amount (cents) to dollars
            const activePrice = product.prices.find((price) => price.active);
            const priceInDollars = activePrice ? `$${(activePrice.unit_amount / 100).toFixed(2)}/user` : "$0.00/user";

            return {
              name: product.name,
              price: priceInDollars,
              features: [
                "Limited Access",
                "Limited Access",
                "Limited Access",
                "Limited Access",
              ], // Replace with actual features if available from API
              description: product.description || "No description available",
            };
          });
          setPlans(fetchedPlans);
        } else {
          toast.error("Failed to load plans");
        }
      } catch (error) {
        console.error("Error fetching plans:", error);
        toast.error("Failed to load plans");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleDeclineAccount = () => {
    console.log("Delete account requested");
  };

  function handleSaveFaq(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    console.log("FAQ saved:", { answer });
    setIsEditOpen(false); // Close the dialog after saving // Reset the question input
    setAnswer(""); // Reset the answer input
  }

  return (
    <>
      <div className="flex">
        <div className="px-16 py-3 bg-[#1A3F70] rounded-lg inline-flex justify-center items-center gap-2.5">
          <div className="text-center justify-start text-white text-base font-normal">All</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-[20px]">
        {isLoading ? (
          <div className="text-white text-center col-span-full">Loading plans...</div>
        ) : plans.length > 0 ? (
          plans.map((plan, index) => (
            <div key={index} className="bg-[#1b2236] rounded-[12px] md:rounded-[20px] py-4 px-4 md:py-8 md:px-9 min-h-[33vh]">
              <div className="flex mb-[20px] justify-between">
                <div className="text-white text-xl font-semibold">{plan.name}</div>
                <div className="text-white text-lg font-semibold">{plan.price}</div>
              </div>

              <div className="w-fit mb-[10px] bg-[#1b2236] rounded-[12px] md:rounded-[20px]">
               
               
                   
                    <div className="text-white text-xs font-normal">{plan.description}</div>
                  
               
              </div>

              <div className="flex gap-[12px]">

                <Button
                  onClick={() => setIsEditOpen(true)}
                  className="bg-[#0B132B] hover:bg-[#0B132B] hover:cursor-pointer w-full"
                >
                  Edit
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-white text-center col-span-full">No plans available</div>
        )}     

        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="bg-[#1b2236] border-[#1F2937] w-[450px] p-6 flex flex-col items-center text-white rounded-lg">
            <DialogHeader className="text-center">
              <DialogTitle />
              <div className="self-stretch text-center justify-start text-white text-base font-semibold">Add Price</div>
            </DialogHeader>

            <div className="self-stretch inline-flex flex-col justify-start items-start gap-3.5">
              <Label className="self-stretch opacity-80 text-white text-base font-normal">Description (Optional)</Label>
              <Input
                type="text"
                className="self-stretch h-12 px-4 py-3.5 bg-[#0B132B] rounded-lg text-neutral-400 text-base font-normal focus:outline-none"
                placeholder="Type question here"
              />
            </div>
            <div className="self-stretch inline-flex flex-col justify-start items-start gap-3.5">
              <Label className="self-stretch opacity-80 text-white text-base font-normal">New Price</Label>
              <Input
                type="text"
                className="self-stretch h-12 px-4 py-3.5 bg-[#0B132B] rounded-lg text-neutral-400 text-base font-normal focus:outline-none"
                placeholder="Type question here"
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
        </Dialog>
      </div>
    </>
  );
};

export default Page;