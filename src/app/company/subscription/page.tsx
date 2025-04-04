"use client";
import React, { useState, useTransition } from "react";
import Image from "next/image";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import useSWR from "swr";
import { buyPlan, getAllSubcriptionPlans, getAllTransactionsPlans, getUserInfo } from "@/services/company-services";
import { loadStripe } from "@stripe/stripe-js";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { cancelSubscription } from "../../../services/company-services";

// Skeleton Loading Component
const SkeletonCard = () => (
  <div className="w-full max-w-sm h-fit bg-gray-200 animate-pulse rounded-lg p-4">
    <div className="mt-6 w-36 h-9 bg-gray-300 rounded-lg mx-auto"></div>
    <div className="mt-5 text-center">
      <div className="h-12 w-24 bg-gray-300 rounded mx-auto"></div>
    </div>
    <div className="mt-8 flex flex-col gap-2 w-full px-4">
      {Array(4).fill(0).map((_, index) => (
        <div key={index} className="flex items-center gap-3">
          <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
          <div className="h-4 w-32 bg-gray-300 rounded"></div>
        </div>
      ))}
    </div>
    <div className="mt-6 w-40 h-12 bg-gray-300 rounded-lg mx-auto"></div>
  </div>
);

const SkeletonTable = () => (
  <div className="w-full animate-pulse">
    <Table className="min-w-[500px]">
      <TableHeader>
        <TableRow className="border-0">
          <TableHead className="w-[100px] py-4"><div className="h-4 w-16 bg-gray-300 rounded"></div></TableHead>
          <TableHead className="py-4"><div className="h-4 w-32 bg-gray-300 rounded"></div></TableHead>
          <TableHead className="py-4"><div className="h-4 w-24 bg-gray-300 rounded"></div></TableHead>
          <TableHead className="text-right py-4"><div className="h-4 w-28 bg-gray-300 rounded ml-auto"></div></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array(3).fill(0).map((_, index) => (
          <TableRow key={index} className="border-0">
            <TableCell className="py-4"><div className="h-4 w-20 bg-gray-300 rounded"></div></TableCell>
            <TableCell className="py-4"><div className="h-4 w-28 bg-gray-300 rounded"></div></TableCell>
            <TableCell className="py-4"><div className="h-4 w-24 bg-gray-300 rounded"></div></TableCell>
            <TableCell className="text-right py-4"><div className="h-4 w-16 bg-gray-300 rounded ml-auto"></div></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

// Modal Component
const SubscriptionModal = ({ isOpen, onClose, onContinue, planType, price }: any) => {
  const [numberOfUsers, setNumberOfUsers] = useState(1);
  const [isLoading, setIsLoading] = useState(false); // State for loading on Continue button
  console.log('isLoading: ', isLoading);

  if (!isOpen) return null;

  const totalAmount = (Number(price) * numberOfUsers).toFixed(2);

  return (
    <div className="w-full fixed inset-0  bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#1b2236] rounded-lg p-6 w-[50%] shadow-lg border border-gray-700">
        <h2 className="text-white text-xl font-semibold mb-6 text-center">Activate Your Plan</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="opacity-80 justify-start text-white text-base font-normal font-['DM_Sans']">Type of plan</p>
            <div className="t text-white text-2xl font-semibold ">{planType}</div>
          </div>
          <div className="flex justify-between items-center">
            <p className="opacity-80 text-white text-base font-normal font-['DM_Sans']">Amount per user</p>
            <div className="text-white text-2xl font-semibold ">${price}</div>
          </div>
          <div className="flex justify-between items-center ">
            <p className="opacity-80 text-white text-base font-normal font-['DM_Sans']">Description</p>
            <div className="w-[50%] justify-start text-white text-sm font-normal ">
              Introducing our Premium Subscription Plan for just $25.99 a month. Enjoy unlimited access to exclusive
              content, personalized recommendations.
            </div>
          </div>
          <div>
            <p className="self-stretch opacity-80 justify-start text-white text-base font-normal">Select number of users</p>
            <input
              type="number"
              min="1"
              value={numberOfUsers}
              onChange={(e) => setNumberOfUsers(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full mt-[15px] bg-slate-900 rounded-lg px-4 py-3.5 text-white text-sm  focus:outline-none focus:ring-2 focus:ring-[#1A3F70]"
            />
          </div>
          <div className="flex justify-between items-center">
           
            <p className="opacity-80 text-white text-base font-normal ">Total Amount</p>
          
            <div className="opacity-80  text-white text-base font-normal">${price} * {numberOfUsers}</div>
          </div>
          <div className="flex justify-end">

          <hr className="w-[50%] opacity-[0.30] "/>
          </div>
            <div className="self-stretch text-right justify-end text-white text-2xl font-semibold  leading-10">${totalAmount}</div>
        </div>
        <div className="w-full mt-6 flex justify-between gap-[12px]">
          <button
            onClick={onClose}
            className="w-[45%] bg-[#1a3f70] text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setIsLoading(true);
              onContinue(numberOfUsers).finally(() => setIsLoading(false));
            }}
            className="w-full bg-[#14ab00] text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
};

const Page = () => {
  const session = useSession();
  const { data: subscriptionData, error, isLoading, mutate } = useSWR(
    "/company/products?status=active",
    getAllSubcriptionPlans,
  { revalidateOnFocus: false, refreshInterval: 0 }
  );
  const { data: transactionData, error: transactionError, isLoading: transactionLoading } = useSWR(
    "/company/transactions",
    getAllTransactionsPlans
  );

  const [isPending, startTransition] = useTransition();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [isCanceling, setIsCanceling] = useState<string | null>(null);
  const [showSkeletonAfterCancel, setShowSkeletonAfterCancel] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlanDetails, setSelectedPlanDetails] = useState({ planType: "", price: "", planId: "" });

  const handlePlanSelect = (planType: string, price: string, planId: string) => {
    setSelectedPlanDetails({ planType, price, planId });
    setIsModalOpen(true);
  };

  const handleContinue = async (numberOfUsers: number) => {
    setIsModalOpen(false);
    setSelectedPlanId(selectedPlanDetails.planId);

    startTransition(async () => {
      // setIsLoading(false)
      try {
        const payload = {
          planType: selectedPlanDetails.planType,
          email: session.data?.user?.email,
          name: session.data?.user?.fullName,
          interval: selectedPlanDetails.planType ==="yearly" ? "year" :selectedPlanDetails.planType ==="monthly" ? "month":"lifetime",
          price: Number(selectedPlanDetails.price) * numberOfUsers,
          numberOfUsers,
        };
        console.log("payload: ", payload);
        const response = await buyPlan(`/company/create-subscription/${session.data?.user?.id}`, payload);
        const data = await response.data;
        if (data.data.id) {
          const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);
          await stripe?.redirectToCheckout({ sessionId: data.data.id });
        } else {
          toast.error("Something went wrong. Please try again later.");
        }
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while processing your request.");
      } finally {
        setSelectedPlanId(null);
      }
    });
  };

  const handleCancelSubscription = async (subscriptionId: string) => {
    setIsCanceling(subscriptionId);
    try {
      const response = await cancelSubscription(`/company/cancel-subscription`);
      if (response?.data.success) {
        setShowSkeletonAfterCancel(true);
        await mutate();
        toast.success("Subscription canceled successfully.");
      } else {
        toast.error("Failed to cancel subscription. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while canceling your subscription.");
    } finally {
      setIsCanceling(null);
      setShowSkeletonAfterCancel(false);
    }
  };

  if (error) return <div>Error loading subscription plans.</div>;
  if (transactionError) return <div>Error loading transactions.</div>;

  const products = subscriptionData?.data.products || [];
  console.log('products: ', products);

  return (
    <>
      <div className="py-[30px] px-[36px] h-auto bg-[#1B2236] rounded-[20px] max-w-full">
        <div className="mb-[64px] text-white text-2xl text-left">Subscription Plan</div>

        <div className="flex flex-wrap lg:flex-nowrap justify-center gap-10">
          {isLoading || showSkeletonAfterCancel ? (
            Array(3).fill(0).map((_, index) => <SkeletonCard key={index} />)
          ) : (
            products.map((product: any) => {
              const activePrice = product.prices.find((price: any) => price.active);
              const price = activePrice ? (activePrice.unit_amount / 100).toFixed(0) : "N/A";
              const interval = activePrice?.recurring?.interval || "month";
              const isCurrentPlan = !!product.currentPlan;
              const expiryDate = isCurrentPlan
                ? new Date(product.currentPlan.expiryDate).toLocaleDateString()
                : null;
              const planType = product.name.split(" ")[0].toLowerCase();
              const isCardLoading = isPending && selectedPlanId === product.id;
              const isCardCanceling = isCanceling === product.currentPlan?.subscriptionId;

              const cardBgColor = isCurrentPlan ? "bg-[#1A3F70]" : "bg-white";
              const textColor = isCurrentPlan ? "text-white" : "text-black";
              const priceTextColor = isCurrentPlan ? "text-white" : "text-[#1a3f70]";
              const buttonBgColor = isCurrentPlan ? "bg-white" : "bg-[#1A3F70]";
              const buttonTextColor = isCurrentPlan ? "text-[#1A3F70]" : "text-white";
              const tickImage = isCurrentPlan ? "/whitetick.svg" : "/bluetick.svg";
              const featureTextColor = isCurrentPlan ? "text-white" : "text-black";
              const borderColor = isCurrentPlan ? "border-white" : "border-neutral-800";
              const features = product.name.toLowerCase().includes("gold")
                ? ["Unlimited Signups", "Unlimited Access", "Unlimited Downloads", "Unlimited"]
                : Array(4).fill("Limited Access");

              return (
                <div
                  key={product.id}
                  className={`relative w-full max-w-sm h-fit ${cardBgColor} rounded-lg flex flex-col items-left p-6 shadow-lg transition-transform duration-300 hover:scale-105`}
                >
                  {isCurrentPlan && (
                    <div className="absolute top-0 right-0 text-center justify-start bg-white text-[#1a3f70] text-sm font-medium font-['SF_Pro_Display'] p-2 px-3 rounded-lg shadow-lg">
                      Current Plan
                    </div>
                  )}
                  <div className={`font-bold flex items-center justify-center w-36 h-9 rounded-lg border ${borderColor}`}>
                    <div className={`${textColor} text-xl font-medium`}>{product.name}</div>
                  </div>
                  <div className="mt-4 text-left text-xl font-medium font-['SF_Pro_Display']">
                    <span className={`${priceTextColor} text-5xl font-bold font-['SF_Pro_Display']`}>${price}</span>
                    <span className={`${priceTextColor} text-lg font-medium font-['SF_Pro_Display']`}>/{interval}ly</span>
                  </div>
                  <div className="mt-6 flex flex-col gap-3 w-full">
                    {features.map((text: string, index: number) => (
                      <div key={index} className="flex items-center gap-3">
                        <Image src={tickImage} alt="check" width={16} height={16} />
                        <div className={`${featureTextColor} text-xs font-normal font-['SF_Pro_Display'] leading-7`}>
                          {text}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 flex justify-center w-full">
                    {isCardLoading || isCardCanceling ? (
                      <div className={`flex justify-center items-center p-5 ${isCurrentPlan ? "text-white" : "text-[#1A3F70]"}`}>Loading...</div>
                    ) : isCurrentPlan ? (
                      <button
                        onClick={() => handleCancelSubscription(product.currentPlan.subscriptionId)}
                        className={`h-12 w-full max-w-[200px] ${buttonBgColor} rounded-lg flex items-center justify-center`}
                      >
                        <span className={`${buttonTextColor} text-lg font-medium font-['SF_Pro_Display']`}>
                          Cancel Subscription
                        </span>
                      </button>
                    ) : (
                      <button
                        disabled={isCurrentPlan}
                        onClick={() => handlePlanSelect(planType, price, product.id)}
                        className={`h-12 w-full max-w-[200px] ${buttonBgColor} rounded-lg flex items-center justify-center`}
                      >
                        <span className={`${buttonTextColor} text-base font-medium`}>
                        Activate Plan
                        </span>
                      </button>
                    )}
                  </div>
                  {isCurrentPlan && expiryDate && (
                    <div className={`mt-4 text-center ${textColor} text-xs font-normal`}>
                      Expires on {expiryDate}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
        <SubscriptionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onContinue={handleContinue}
          planType={selectedPlanDetails.planType}
          price={selectedPlanDetails.price}
        />
      </div>

      <div className="px-[36px] py-[30px] h-auto bg-[#1B2236] rounded-[20px]">
        <div className="mb-[29px] justify-center text-white text-2xl font-bold font-['SF_Pro_Display'] leading-loose">
          Recent Payments
        </div>
        <div className="w-full rounded-none overflow-hidden">
          <div className="w-full overflow-auto h-[210px] scroll-container">
            {transactionLoading ? (
              <SkeletonTable />
            ) : (
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
                  {transactionData?.data.data.map((invoice: any) => (
                    <TableRow key={invoice.transactionId} className="border-0 text-sm font-normal hover:bg-transparent">
                      <TableCell className="py-4 pr-15">{invoice.transactionId}</TableCell>
                      <TableCell className="py-4">{new Date(invoice.purchaseDate).toLocaleDateString()}</TableCell>
                      <TableCell className="py-4">{invoice.planType}</TableCell>
                      <TableCell className="text-right py-4">${invoice.transactionAmount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;