"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { getStripeDetail, updateSubscriptionPlan } from "@/services/admin-services"; // Import updateStripePlan
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload, Trash2, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton"; // Import Skeleton
import "react-loading-skeleton/dist/skeleton.css"; // Import CSS for Skeleton

const Page = () => {
  interface Plan {
    productId: string; // Added to track the product ID for updates
    name: string;
    price: string;
    features: string[];
    description: string;
  }

  const [plans, setPlans] = useState<Plan[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null); // State for the plan being edited
  const [updatedDescription, setUpdatedDescription] = useState(""); // State for new description
  const [updatedPrice, setUpdatedPrice] = useState(""); // State for new price
  const [isLoading, setIsLoading] = useState(false);

  // Fetch Stripe product details on mount
  useEffect(() => {
    const fetchPlans = async () => {
      setIsLoading(true);
      try {
        const response = await getStripeDetail("admin/products", { status: "active" });
        console.log("response:", response);
        if (response.data.success) {
          interface Product {
            id: string; // Assuming productId is returned as 'id'
            name: string;
            description?: string;
            prices: { active: boolean; unit_amount: number }[];
          }

          const fetchedPlans = response.data.products.map((product: Product) => {
            // Find the active price and convert unit_amount (cents) to dollars
            const activePrice = product.prices.find((price) => price.active);
            const priceInDollars = activePrice ? `$${(activePrice.unit_amount / 100).toFixed(2)}/user` : "$0.00/user";

            return {
              productId: product.id, // Store the product ID for updates
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
          toast.error("Failed to load plans", {
                  duration: Infinity,
                  position: "top-center",
                  action: {
                    label: "OK",
                    onClick: (toastId : any) => toast.dismiss(toastId),
                  },
                  closeButton: false,
                });
        }
      } catch (error) {
        console.error("Error fetching plans:", error);
        toast.error("Failed to load plans", {
                duration: Infinity,
                position: "top-center",
                action: {
                  label: "OK",
                  onClick: (toastId : any) => toast.dismiss(toastId),
                },
                closeButton: false,
              });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleDeclineAccount = () => {
    console.log("Delete account requested");
  };

  // Handle updating the plan
  const handleUpdatePlan = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!selectedPlan || !updatedDescription || !updatedPrice) {
      toast.error("Please fill in all fields", {
              duration: Infinity,
              position: "top-center",
              action: {
                label: "OK",
                onClick: (toastId : any) => toast.dismiss(toastId),
              },
              closeButton: false,
            });
      return;
    }

    setIsLoading(true);
    try {
      const response = await updateSubscriptionPlan(`/admin/update-prices`, {
        productId: selectedPlan.productId,
        description: updatedDescription,
        price: updatedPrice, // Send price in cents
      });

      console.log("Update response:", response); // Debug the full response

      // Adjust success check based on actual response structure
      if (response.data && (response.data.success || response.status === 200)) {
        // Update the local plans state with the new data
        setPlans((prevPlans) =>
          prevPlans.map((plan) =>
            plan.productId === selectedPlan.productId
              ? { ...plan, description: updatedDescription, price: `$${parseFloat(updatedPrice).toFixed(2)}/user` }
              : plan
          )
        );
        toast.success("Plan updated successfully!", {
        duration: Infinity,
        position: "top-center",
        action: {
          label: "OK",
          onClick: (toastId : any) => toast.dismiss(toastId),
        },
        closeButton: false,
      });
        setIsEditOpen(false);
        setUpdatedDescription("");
        setUpdatedPrice("");
        setSelectedPlan(null);
        window.location.reload(); // Reload the page to reflect changes
      } else if (response.data && response.data.message) {
      } else {
        toast.error("Failed to update plan: " + (response.data.message || "Unknown error"), {
                duration: Infinity,
                position: "top-center",
                action: {
                  label: "OK",
                  onClick: (toastId : any) => toast.dismiss(toastId),
                },
                closeButton: false,
              });
      }
    } catch (error) {
      console.error("Error updating plan:", error);
      toast.error("Failed to update plan: " + (error instanceof Error ? error.message : "Unknown error"), {
              duration: Infinity,
              position: "top-center",
              action: {
                label: "OK",
                onClick: (toastId : any) => toast.dismiss(toastId),
              },
              closeButton: false,
            });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-[20px]">
        <SkeletonTheme baseColor="#0B132B" highlightColor="#1B2236" borderRadius="0.5rem">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-[#1b2236] rounded-[12px] md:rounded-[20px] py-4 px-4 md:py-8 md:px-9 min-h-[33vh]">
                <Skeleton height={24} width={150} className="mb-4" />
                <Skeleton height={20} width={100} className="mb-4" />
                <Skeleton height={60} className="mb-4" />
                <Skeleton height={40} width={100} />
              </div>
            ))
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
                    onClick={() => {
                      setSelectedPlan(plan);
                      setUpdatedDescription(plan.description);
                      setUpdatedPrice(plan.price.replace("/user", "").replace("$", ""));
                      setIsEditOpen(true);
                    }}
                    className="bg-[#0B132B] hover:bg-[#0B132B] hover:cursor-pointer w-full"
                    disabled={isLoading}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-white text-center col-span-full">No plans available</div>
          )}
        </SkeletonTheme>

        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="bg-[#1b2236] border-[#1F2937] w-[450px] p-6 flex flex-col items-center text-white rounded-lg">
            <DialogHeader className="text-center">
              <DialogTitle />
              <div className="self-stretch text-center justify-start text-white text-base font-semibold">Update Plan</div>
            </DialogHeader>

            <div className="self-stretch inline-flex flex-col justify-start items-start gap-3.5">
              <Label className="self-stretch opacity-80 text-white text-base font-normal">Description (Optional)</Label>
              <Textarea
                className="self-stretch h-12 px-4 py-3.5 border-none bg-[#0B132B] rounded-lg text-neutral-400 text-base font-normal focus:outline-none"
                value={updatedDescription}
                onChange={(e) => setUpdatedDescription(e.target.value)}
                placeholder="Type description here"
              />
            </div>
            <div className="self-stretch inline-flex flex-col justify-start items-start gap-3.5">
              <Label className="self-stretch opacity-80 text-white text-base font-normal">New Price (in $)</Label>
              <Input
                type="number"
                className="self-stretch h-12 px-4 py-3.5 border-none bg-[#0B132B] rounded-lg text-neutral-400 text-base font-normal focus:outline-none"
                value={updatedPrice}
                onChange={(e) => setUpdatedPrice(e.target.value)}
                placeholder="Enter price"
              />
            </div>

            <DialogFooter className="flex justify-end w-full mt-6">             
              <Button
                variant="destructive"
                className="bg-[#1A3F70] hover:bg-[#1A3F70] hover:cursor-pointer w-full h-11"
                onClick={handleUpdatePlan}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 size={20} className="animate-spin text-white" /> : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default Page;