"use client";
import React, { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import useSWR from "swr";
import { buyPlan, getAllSubcriptionPlans, getAllTransactionsPlans, getCompanyDetails, getUserInfo } from "@/services/company-services";
import { loadStripe } from "@stripe/stripe-js";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { cancelSubscription } from "../../../services/company-services";
import { Loader2 } from "lucide-react";

// Skeleton Loading Components (unchanged)
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


const SubscriptionModal = ({ isOpen, onClose, onContinue, planType, price, description, totalUsers }: any) => {
  const [numberOfUsers, setNumberOfUsers] = useState<number | null>(totalUsers === 0 ? 1 : totalUsers);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (totalUsers !== undefined) {
      const initialUsers = Math.max(totalUsers || 1, 1);
      setNumberOfUsers(initialUsers);
      setErrorMessage(null);
    }
  }, [totalUsers]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isOpen]);

  const handleClose = () => {
    setNumberOfUsers(totalUsers === 0 ? 1 : totalUsers);
    setErrorMessage(null);
    onClose();
  };

  if (!isOpen) return null;

  const totalAmount = numberOfUsers !== null ? (Number(price) * numberOfUsers).toFixed(2) : "0.00";

  const handleNumberOfUsersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;

    // Handle empty input
    if (rawValue === "") {
      setNumberOfUsers(null);
      setErrorMessage(null);
      return;
    }

    // Remove leading zeros (in case of pasting)
    const cleanedValue = rawValue.replace(/^0+/, "") || "";
    if (cleanedValue === "") {
      setNumberOfUsers(null);
      setErrorMessage("Number of users cannot be less than 1.");
      return;
    }

    const value = parseInt(cleanedValue, 10);
    const clampedValue = isNaN(value) ? 0 : Math.max(value, 0);

    setNumberOfUsers(clampedValue);

    // Validate the input
    if (clampedValue < 1) {
      setErrorMessage("Number of users cannot be less than 1.");
    } else if (clampedValue < totalUsers) {
      setErrorMessage(`Number of users cannot be less than the current ${totalUsers} users.`);
    } else {
      setErrorMessage(null);
    }

    // Update the input field to reflect the cleaned value
    e.target.value = cleanedValue;
  };

  // Prevent typing "0" as the first digit
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const currentValue = input.value;

    // Block "0" when the input is empty or at the start
    if (e.key === "0" && currentValue === "") {
      e.preventDefault();
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-none">
      <div className="bg-[#1b2236] rounded-lg p-6 w-[50%] shadow-lg border border-gray-700">
        <h2 className="text-white text-xl font-semibold mb-6 text-center">Activate Your Plan</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="opacity-80 text-white text-base font-normal font-['DM_Sans']">Type of plan</p>
            <div className="text-white text-2xl font-semibold">{planType}</div>
          </div>
          <div className="flex justify-between items-center">
            <p className="opacity-80 text-white text-base font-normal font-['DM_Sans']">Amount per user</p>
            <div className="text-white text-2xl font-semibold">${price}</div>
          </div>
          <div className="flex justify-between items-center">
            <p className="opacity-80 text-white text-base font-normal font-['DM_Sans']">Description</p>
            <div className="w-[50%] text-white text-sm font-normal">{description}</div>
          </div>
          <div>
            <p className="self-stretch opacity-80 text-white text-base font-normal">Select number of users</p>
            <div className="relative">
              <input
                type="number"
                min="1"
                value={numberOfUsers !== null ? numberOfUsers : ""}
                onChange={handleNumberOfUsersChange}
                onKeyDown={handleKeyDown} // Add onKeyDown handler
                className="w-full mt-[15px] bg-slate-900 rounded-lg px-4 py-3.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3F70] appearance-none [&::-webkit-outer-spin-button]:hidden [&::-webkit-inner-spin-button]:hidden"
              />
              {errorMessage && (
                <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <p className="opacity-80 text-white text-base font-normal">Total Amount</p>
            <div className="opacity-80 text-white text-base font-normal">
              ${price} * {numberOfUsers ?? "..."}
            </div>
          </div>
          <div className="flex justify-end">
            <hr className="w-[50%] opacity-[0.30]" />
          </div>
          <div className="self-stretch text-right text-white text-2xl font-semibold leading-10">
            ${totalAmount}
          </div>
        </div>
        <div className="w-full mt-6 flex justify-between gap-[12px]">
          <button
            onClick={handleClose}
            className="w-[45%] bg-[#1a3f70] text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition hover:cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (numberOfUsers !== null && !errorMessage && numberOfUsers >= totalUsers && numberOfUsers >= 1) {
                setIsLoading(true);
                onContinue(numberOfUsers);
                setTimeout(() => setIsLoading(false), 2000);
              }
            }}
            className="w-full bg-[#14ab00] text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition flex items-center justify-center hover:cursor-pointer disabled:bg-green-700"
            disabled={isLoading || numberOfUsers === null || !!errorMessage}
          >
            {isLoading ? "Loading..." : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
};
const CancelSubscriptionModal = ({ isOpen, onClose, onConfirm, isLoading, userName }: { isOpen: boolean; onClose: () => void; onConfirm: () => void; isLoading: boolean, userName: string }) => {
  React.useEffect(() => {
    if (isOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    // Cleanup on unmount
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#1b2236] rounded-lg p-8 w-[400px] shadow-lg border border-gray-700">
        <h2 className="text-white text-2xl font-bold  mb-6 text-center">Cancel Subscription</h2>
        <p className="opacity-80 text-center justify-start text-white text-base font-normal font-['SF_Pro_Display'] ">Hi {userName},</p>
        <p className="opacity-80 text-center justify-start text-white text-base font-normal  font-['SF_Pro_Display'] mb-6">Are you sure you want to cancel this subscription?</p>
        <div className="flex w-full gap-4">
          <button
            onClick={onClose}
            className="bg-[#1a3f70] w-full text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition hover:cursor-pointer"
            disabled={isLoading}
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="bg-[#ff4444] w-full text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition hover:cursor-pointer "
            disabled={isLoading}
          >
            {isLoading ? <Loader2 size={20} className="animate-spin items-center ml-12" /> : "Yes"}

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
  const { data: companyData } = useSWR(
    session?.data?.user?.id
      ? `/company/company-details/${session?.data?.user.id}`
      : null,
    getCompanyDetails,
    { revalidateOnFocus: false, refreshInterval: 0 }
  );
  const currentActiveUsers = companyData?.data?.data?.totalUsers;
  const { data: transactionData, error: transactionError, isLoading: transactionLoading } = useSWR(
    "/company/transactions",
    getAllTransactionsPlans
  );

  const [isPending, startTransition] = useTransition();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [isCanceling, setIsCanceling] = useState(false);
  const [showSkeletonAfterCancel, setShowSkeletonAfterCancel] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedPlanDetails, setSelectedPlanDetails] = useState({ planType: "", price: "", planId: "", description: "", totalUsers: 0 });

  const handlePlanSelect = (planType: string, price: string, planId: string, description: string) => {
    const selectedProduct = filteredProducts.find((product: any) => product.id === planId);
    const isCurrentPlanDetails = filteredProducts.find((product: any) => product.currentPlan);
    const isCurrentPlan = !!selectedProduct?.currentPlan;
    const totalUsers = isCurrentPlanDetails ? isCurrentPlanDetails.currentPlan.totalUsers || 1 : 1;


    setSelectedPlanDetails({ planType, price, planId, description, totalUsers });
    setIsModalOpen(true);
  };
  const { data } = useSession();
  const userName = data?.user?.fullName || "User";
  const handleContinue = async (numberOfUsers: number) => {
    setIsModalOpen(false);
    setSelectedPlanId(selectedPlanDetails.planId);

    startTransition(async () => {
      try {
        const payload = {
          planType: selectedPlanDetails.planType,
          email: session.data?.user?.email,
          name: session.data?.user?.fullName,
          interval: selectedPlanDetails.planType === "yearly" ? "year" : selectedPlanDetails.planType === "monthly" ? "month" : "lifetime",
          price: Number(selectedPlanDetails.price) * numberOfUsers,
          numberOfUsers,
        };
        const response = await buyPlan(`/company/create-subscription/${session.data?.user?.id}`, payload);
        const data = await response.data;
        if (data.data.id) {
          const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);
          await stripe?.redirectToCheckout({ sessionId: data.data.id });
        } else {
          toast.error("Something went wrong. Please try again later.", {
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
        console.error(error);
        toast.error("An error occurred while processing your request.", {
                duration: Infinity,
                position: "top-center",
                action: {
                  label: "OK",
                  onClick: (toastId : any) => toast.dismiss(toastId),
                },
                closeButton: false,
              });
      } finally {
        setSelectedPlanId(null);
      }
    });
  };

  const handleCancelSubscription = async () => {
    setIsCanceling(true);
    try {
      const response = await cancelSubscription(`/company/cancel-subscription`);
      if (response?.data.success) {
        setShowSkeletonAfterCancel(true);
        await mutate();
        toast.success("Subscription canceled successfully.", {
        duration: Infinity,
        position: "top-center",
        action: {
          label: "OK",
          onClick: (toastId : any) => toast.dismiss(toastId),
        },
        closeButton: false,
      });
        setIsCancelModalOpen(false);
      } else {
        toast.error("Failed to cancel subscription. Please try again.", {
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
      console.error(error);
      toast.error("An error occurred while canceling your subscription.", {
              duration: Infinity,
              position: "top-center",
              action: {
                label: "OK",
                onClick: (toastId : any) => toast.dismiss(toastId),
              },
              closeButton: false,
            });
    } finally {
      setIsCanceling(false);
      setShowSkeletonAfterCancel(false);
    }
  };

  if (error) return <div>Error loading subscription plans.</div>;
  if (transactionError) return <div>Error loading transactions.</div>;

  const products = subscriptionData?.data.products || [];

  // Check if the user has a lifetime plan
  const hasLifetimePlan = products.some((product: any) => product.currentPlan?.name === "Lifetime");

  // Filter products: if lifetime plan exists, only show the lifetime plan
  const filteredProducts = hasLifetimePlan
    ? products.filter((product: any) => product.currentPlan?.name === "Lifetime")
    : products;

  return (
    <>
      <div className="py-[30px] px-[36px] h-auto bg-[#1B2236] rounded-[20px] max-w-full">
        <div className="mb-[20px] text-white text-2xl text-left">Subscription Plan</div>

        <div className={`flex flex-wrap lg:flex-nowrap ${filteredProducts.length === 1 ? "justify-left" : "justify-center"} gap-5`}>
          {isLoading || showSkeletonAfterCancel ? (
            Array(3).fill(0).map((_, index) => <SkeletonCard key={index} />)
          ) : (
            filteredProducts.length === 0 ? (
              <div className="text-white text-center col-span-full">No subscription plans available.</div>
            ) :
              filteredProducts.map((product: any) => {
                const activePrice = product.prices.find((price: any) => price.active);
                const price = activePrice ? (activePrice.unit_amount / 100).toFixed(0) : "N/A";
                const interval = activePrice?.recurring?.interval || "month";
                const isCurrentPlan = !!product.currentPlan;
                const expiryDate = (isCurrentPlan && product.currentPlan.expiryDate)
                  ? new Date(product.currentPlan.expiryDate).toLocaleDateString()
                  : (isCurrentPlan && product.currentPlan.planType === "lifetime") ? "Lifetime" : null;
                const numberOfUsers = product.currentPlan?.numUsersForPlan || 0;
                const planType = product.name.split(" ")[0].toLowerCase();
                const isCardLoading = isPending && selectedPlanId === product.id;
                const isLifetime = product.currentPlan?.planType === "lifetime";
                const isCardCanceling = isCanceling;

                const cardBgColor = isCurrentPlan ? "bg-[#1A3F70]" : "bg-white";
                const textColor = isCurrentPlan ? "text-white" : "text-black";
                const descriptionColor = isCurrentPlan ? "text-white" : "text-neutral-400";
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
                    className={`relative w-full max-w-sm h-fit ${isCurrentPlan ? "md:min-w-[240px]": ""} ${cardBgColor} rounded-lg flex flex-col items-left p-6 shadow-lg transition-transform duration-300 hover:scale-105`}
                  >
                    {isCurrentPlan && (
                      <div className="absolute top-0 right-0 text-center justify-start bg-white text-[#1a3f70] text-sm font-medium p-2 px-3 rounded-tr-lg rounded-bl-lg shadow-lg">
                        Current Plan
                      </div>
                    )}
                    <div className={`font-bold flex items-center  ${isCurrentPlan? "w-28" : "w-36"} justify-center  h-9 rounded-lg border ${borderColor}`}>
                      <div className={`${textColor} text-xl font-medium`}>{product.name}</div>
                    </div>
                    <div className="mt-4 text-left text-xl font-medium font-['SF_Pro_Display']">
                      <span className={`${priceTextColor} text-5xl font-bold font-['SF_Pro_Display']`}>${price}</span>
                      <span className={`${priceTextColor} text-lg font-medium font-['SF_Pro_Display']`}>/user</span>
                    </div>

                    <div
                      className={`mt-6 self-stretch h-[60px] overflow-hidden ${descriptionColor} text-sm font-normal flex flex-col gap-3 w-full text-ellipsis `}
                      style={{ wordBreak: 'break-all' }}
                    >

                      {product.description}
                    </div>
                    {isCurrentPlan && numberOfUsers && (
                      <div className={`mt-2 text-left text-white text-sm font-normal`}>
                        Number of Users: {numberOfUsers}
                      </div>
                    )}
                    <div className="mt-6 flex justify-left w-full">
                      {isCardCanceling || isCardLoading ? (
                        <div className={`flex justify-center items-center w-full max-w-[200px] h-12 rounded-lg bg-[#1A3F70]`}>
                          <Loader2 size={24} className="animate-spin text-white" />
                        </div>
                      ) : isCurrentPlan && !isLifetime ? (
                        <button
                          onClick={() => setIsCancelModalOpen(true)}
                          className={`h-12 w-full max-w-[200px] ${buttonBgColor} rounded-lg flex items-center justify-center hover:cursor-pointer`}
                        >
                          <span className={`${buttonTextColor} text-lg font-medium font-['SF_Pro_Display']`}>
                            Cancel Subscription
                          </span>
                        </button>
                      ) : isCurrentPlan && isLifetime ? (
                        <div className="text-center text-white">Lifetime Plan</div>
                      ) : (
                        <button
                          onClick={() => handlePlanSelect(product.name.split(" ")[0].toLowerCase(), price, product.id, product.description)}
                          className={`h-12 w-full max-w-[150px] ${buttonBgColor} rounded-lg flex items-center justify-center text-center hover:cursor-pointer`}
                        >
                          <span className={`${buttonTextColor} text-base font-medium`}>
                            Activate Plan
                          </span>
                        </button>
                      )}
                    </div>
                    {isCurrentPlan && expiryDate && (
                      <div className={`mt-4 text-left ${textColor} text-xs font-normal`}>
                        Expires on {expiryDate}
                      </div>
                    )}
                  </div>
                );
              }
              )
          )}
        </div>
        <SubscriptionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onContinue={handleContinue}
          planType={selectedPlanDetails.planType}
          price={selectedPlanDetails.price}
          description={selectedPlanDetails.description}
          totalUsers={currentActiveUsers}
        />
        <CancelSubscriptionModal
          isOpen={isCancelModalOpen}
          onClose={() => setIsCancelModalOpen(false)}
          onConfirm={handleCancelSubscription}
          isLoading={isCanceling}
          userName={userName}
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
                  {transactionData?.data.data.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        No transactions found
                      </TableCell>
                    </TableRow>
                  ) : null}
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