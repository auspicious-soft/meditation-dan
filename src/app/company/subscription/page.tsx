"use client";
import React, { useState, useTransition } from "react";
import Image from "next/image";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import useSWR from "swr";
import { buyPlan, getAllSubcriptionPlans, getAllTransactionsPlans, getUserInfo } from "@/services/company-services";
import { loadStripe } from "@stripe/stripe-js";
import { useSession } from "next-auth/react";
import { toast } from "sonner"; // For notifications



const Page = () => {
  const session = useSession();
  const { data: subscriptionData, error, isLoading } = useSWR(
    "/company/products",
    getAllSubcriptionPlans
  );
  const { data: transactionData, error: transactionError, isLoading: transactionLoading } = useSWR(
    "/company/transactions",
    getAllTransactionsPlans
  );
  console.log('transactionData: ', transactionData);

  const [isPending, startTransition] = useTransition();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null); // Track the selected plan for loading

  const handlePlanSelect = async (planType: string, price: string, planId: string) => {
    console.log('planType received in handlePlanSelect:', planType); // Debug log
    setSelectedPlanId(planId); // Set the selected plan ID to show loading only for that card
    startTransition(async () => {
      try {
        const response = await buyPlan(`/company/create-subscription/${session.data?.user?.id}`, {
          planType: planType,
          email: session.data?.user?.email,
          name: session.data?.user?.fullName,
          interval: "month",
          price,
        });
        const data = await response.data;
        console.log('data: ', data);
        if (data.data.id) {
          console.log('data.id: ', data.data.id);
          const stripe = await loadStripe(
            process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
          );
          console.log('stripe: ', stripe);
          const error = await stripe?.redirectToCheckout({ sessionId: data.data.id });
          console.log('error: ', error);
        } else {
          toast.error("Something went wrong. Please try again later.");
        }
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while processing your request.");
      } finally {
        setSelectedPlanId(null); // Reset the selected plan ID after the operation
      }
    });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading subscription plans.</div>;

  const products = subscriptionData?.data.products || [];

  return (
    <>
      <div className="py-[30px] px-[36px] h-auto bg-[#1B2236] rounded-[20px] max-w-full">
        <div className="mb-[64px] text-white text-2xl text-left">Subscription Plan</div>

        <div className="flex flex-wrap lg:flex-nowrap justify-center gap-10">
          {products.map((product: any) => {
            // Find the first active price for the product
            const activePrice = product.prices.find((price: any) => price.active);
            const price = activePrice ? (activePrice.unit_amount / 100).toFixed(0) : "N/A"; // Convert cents to dollars
            const interval = activePrice?.recurring?.interval || "month";

            // Determine if this is the current plan
            const isCurrentPlan = !!product.currentPlan;
            const expiryDate = isCurrentPlan
              ? new Date(product.currentPlan.expiryDate).toLocaleDateString()
              : null;

            // Transform the plan name to the desired format (e.g., "Silver Plan" → "silverPlan")
            const planType = product.name
              .split(" ")[0] // Get the first word (e.g., "Silver")
              .toLowerCase() + "Plan"; // Append "Plan" (e.g., "silverPlan")

            // Determine styling: Apply Bronze style to currentPlan or if it's the Bronze Plan
            const isBronzePlan = product.name.toLowerCase().includes("bronze");
            const applyBronzeStyle = isCurrentPlan ? isCurrentPlan : ""; // Apply Bronze style if it's the current plan or Bronze plan
            const cardBgColor = applyBronzeStyle ? "bg-[#1A3F70]" : "bg-white";
            const borderColor = applyBronzeStyle ? "border-white" : "border-neutral-800";
            const textColor = applyBronzeStyle ? "text-white" : "text-neutral-800";
            const priceTextColor = applyBronzeStyle ? "text-white" : "text-[#1A3F70]";
            const buttonBgColor = applyBronzeStyle ? "bg-white" : "bg-[#1A3F70]";
            const buttonTextColor = applyBronzeStyle ? "text-[#1A3F70]" : "text-white";
            const tickImage = applyBronzeStyle ? "/whitetick.svg" : "/bluetick.svg";
            const featureTextColor = applyBronzeStyle ? "text-white" : "text-black";
            const heightClass = applyBronzeStyle ? "h-fit py-4" : "h-fit";

            // Define features based on plan type
            const features =
              product.name.toLowerCase().includes("gold")
                ? ["Unlimited Signups", "Unlimited Access", "Unlimited Downloads", "Unlimited"]
                : Array(4).fill("Limited Access");

            // Check if this specific card is in the loading state
            const isCardLoading = isPending && selectedPlanId === product.id;

            return (
              <div
                key={product.id}
                className={` w-full max-w-sm ${heightClass} ${cardBgColor} rounded-lg flex flex-col items-center transition-transform duration-300 hover:scale-105 p-4`}
              >
                <div className={`mt-6 font-bold flex items-center justify-center w-36 h-9 rounded-lg border ${borderColor}`}>
                  <div className={`${textColor} text-xl font-medium`}>{product.name}</div>
                </div>
                <div className="mt-5 text-center">
                  <span className={`${priceTextColor} text-4xl sm:text-5xl font-bold`}>${price}</span>
                  <span className={`${priceTextColor} text-base sm:text-lg font-medium`}>/{interval}</span>
                </div>
                <div className="mt-8 flex flex-col gap-2 w-full px-4">
                  {features.map((text: string, index: number) => (
                    <div key={index} className="flex items-center gap-3">
                      <Image src={tickImage} alt="check" width={20} height={20} />
                      <div className={`${featureTextColor} text-xs font-normal leading-7 break-words whitespace-nowrap`}>
                        {text}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex justify-center w-full">
                  {isCardLoading ? (
                    <div className="flex justify-center items-center p-5">Loading...</div>
                  ) : (
                    <button
                      disabled={isCurrentPlan}
                      onClick={() => handlePlanSelect(planType, price, product.id)}
                      className={`h-12 w-full max-w-[200px] ${buttonBgColor} rounded-lg flex items-center justify-center`}
                    >
                      <span className={`${buttonTextColor} text-lg font-medium`}>
                        {isCurrentPlan ? "Currently Plan" : "Choose Plan"}
                      </span>
                    </button>
                  )}
                </div>
                {isCurrentPlan && expiryDate && (
                  <div className={`mt-[10px] text-center ${textColor} text-xs font-normal`}>
                    Expires on {expiryDate}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Payments Section */}
      <div className="px-[36px] py-[30px] h-auto bg-[#1B2236] rounded-[20px]">
        <div className="mb-[29px] justify-center text-white text-2xl font-bold font-['SF_Pro_Display'] leading-loose">
          Recent Payments
        </div>
        <div className="w-full rounded-none overflow-hidden">
          <div className="w-full overflow-auto h-[210px] scroll-container">
            <Table className="min-w-[500px] scrollbar-thin scroll-container">
              <TableHeader>
                <TableRow className="text-white text-sm font-bold dm-sans border-0 hover:bg-transparent">
                  <TableHead className="w-[100px] py-4">ID</TableHead>
                  <TableHead className="py-4">Purchase Date</TableHead>
                  <TableHead className="py-4">Plan</TableHead>
                  <TableHead className="text-right py-4">Transaction</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactionData?.data.data.map((invoice : any) => (
                  <TableRow key={invoice.Id} className="border-0 text-sm font-normal hover:bg-transparent">
                    <TableCell className="py-4 pr-15">{invoice.transactionId}</TableCell>
                    <TableCell className="py-4">{new Date(invoice.purchaseDate).toLocaleDateString()}</TableCell>
                    <TableCell className="py-4">{invoice.planType}</TableCell>
                    <TableCell className="text-right py-4">${invoice.transactionAmount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;