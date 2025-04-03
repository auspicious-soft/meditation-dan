// "use client";
// import React, { useState, useTransition } from "react";
// import Image from "next/image";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import useSWR from "swr";
// import { buyPlan, getAllSubcriptionPlans, getAllTransactionsPlans, getUserInfo } from "@/services/company-services";
// import { loadStripe } from "@stripe/stripe-js";
// import { useSession } from "next-auth/react";
// import { toast } from "sonner"; // For notifications



// const Page = () => {
//   const session = useSession();
//   const { data: subscriptionData, error, isLoading } = useSWR(
//     "/company/products",
//     getAllSubcriptionPlans
//   );
//   const { data: transactionData, error: transactionError, isLoading: transactionLoading } = useSWR(
//     "/company/transactions",
//     getAllTransactionsPlans
//   );
//   console.log('transactionData: ', transactionData);

//   const [isPending, startTransition] = useTransition();
//   const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null); // Track the selected plan for loading

//   const handlePlanSelect = async (planType: string, price: string, planId: string) => {
//     console.log('planType received in handlePlanSelect:', planType); // Debug log
//     setSelectedPlanId(planId); // Set the selected plan ID to show loading only for that card
//     startTransition(async () => {
//       try {
//         const response = await buyPlan(`/company/create-subscription/${session.data?.user?.id}`, {
//           planType: planType,
//           email: session.data?.user?.email,
//           name: session.data?.user?.fullName,
//           interval: "month",
//           price,
//         });
//         const data = await response.data;
//         console.log('data: ', data);
//         if (data.data.id) {
//           console.log('data.id: ', data.data.id);
//           const stripe = await loadStripe(
//             process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
//           );
//           console.log('stripe: ', stripe);
//           const error = await stripe?.redirectToCheckout({ sessionId: data.data.id });
//           console.log('error: ', error);
//         } else {
//           toast.error("Something went wrong. Please try again later.");
//         }
//       } catch (error) {
//         console.error(error);
//         toast.error("An error occurred while processing your request.");
//       } finally {
//         setSelectedPlanId(null); // Reset the selected plan ID after the operation
//       }
//     });
//   };

//   if (isLoading) return <div>Loading...</div>;
//   if (error) return <div>Error loading subscription plans.</div>;

//   const products = subscriptionData?.data.products || [];

//   return (
//     <>
//       <div className="py-[30px] px-[36px] h-auto bg-[#1B2236] rounded-[20px] max-w-full">
//         <div className="mb-[64px] text-white text-2xl text-left">Subscription Plan</div>

//         <div className="flex flex-wrap lg:flex-nowrap justify-center gap-10">
//           {products.map((product: any) => {
//             // Find the first active price for the product
//             const activePrice = product.prices.find((price: any) => price.active);
//             const price = activePrice ? (activePrice.unit_amount / 100).toFixed(0) : "N/A"; // Convert cents to dollars
//             const interval = activePrice?.recurring?.interval || "month";

//             // Determine if this is the current plan
//             const isCurrentPlan = !!product.currentPlan;
//             const expiryDate = isCurrentPlan
//               ? new Date(product.currentPlan.expiryDate).toLocaleDateString()
//               : null;

//             // Transform the plan name to the desired format (e.g., "Silver Plan" → "silverPlan")
//             const planType = product.name
//               .split(" ")[0] // Get the first word (e.g., "Silver")
//               .toLowerCase() + "Plan"; // Append "Plan" (e.g., "silverPlan")

//             // Determine styling: Apply Bronze style to currentPlan or if it's the Bronze Plan
//             const isBronzePlan = product.name.toLowerCase().includes("bronze");
//             const applyBronzeStyle = isCurrentPlan ? isCurrentPlan : ""; // Apply Bronze style if it's the current plan or Bronze plan
//             const cardBgColor = applyBronzeStyle ? "bg-[#1A3F70]" : "bg-white";
//             const borderColor = applyBronzeStyle ? "border-white" : "border-neutral-800";
//             const textColor = applyBronzeStyle ? "text-white" : "text-neutral-800";
//             const priceTextColor = applyBronzeStyle ? "text-white" : "text-[#1A3F70]";
//             const buttonBgColor = applyBronzeStyle ? "bg-white" : "bg-[#1A3F70]";
//             const buttonTextColor = applyBronzeStyle ? "text-[#1A3F70]" : "text-white";
//             const tickImage = applyBronzeStyle ? "/whitetick.svg" : "/bluetick.svg";
//             const featureTextColor = applyBronzeStyle ? "text-white" : "text-black";
//             const heightClass = applyBronzeStyle ? "h-fit py-4" : "h-fit";

//             // Define features based on plan type
//             const features =
//               product.name.toLowerCase().includes("gold")
//                 ? ["Unlimited Signups", "Unlimited Access", "Unlimited Downloads", "Unlimited"]
//                 : Array(4).fill("Limited Access");

//             // Check if this specific card is in the loading state
//             const isCardLoading = isPending && selectedPlanId === product.id;

//             return (
//               <div
//                 key={product.id}
//                 className={` w-full max-w-sm ${heightClass} ${cardBgColor} rounded-lg flex flex-col items-center transition-transform duration-300 hover:scale-105 p-4`}
//               >
//                 <div className={`mt-6 font-bold flex items-center justify-center w-36 h-9 rounded-lg border ${borderColor}`}>
//                   <div className={`${textColor} text-xl font-medium`}>{product.name}</div>
//                 </div>
//                 <div className="mt-5 text-center">
//                   <span className={`${priceTextColor} text-4xl sm:text-5xl font-bold`}>${price}</span>
//                   <span className={`${priceTextColor} text-base sm:text-lg font-medium`}>/{interval}</span>
//                 </div>
//                 <div className="mt-8 flex flex-col gap-2 w-full px-4">
//                   {features.map((text: string, index: number) => (
//                     <div key={index} className="flex items-center gap-3">
//                       <Image src={tickImage} alt="check" width={20} height={20} />
//                       <div className={`${featureTextColor} text-xs font-normal leading-7 break-words whitespace-nowrap`}>
//                         {text}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//                 <div className="mt-6 flex justify-center w-full">
//                   {isCardLoading ? (
//                     <div className="flex justify-center items-center p-5">Loading...</div>
//                   ) : (
//                     <button
//                       disabled={isCurrentPlan}
//                       onClick={() => handlePlanSelect(planType, price, product.id)}
//                       className={`h-12 w-full max-w-[200px] ${buttonBgColor} rounded-lg flex items-center justify-center`}
//                     >
//                       <span className={`${buttonTextColor} text-lg font-medium`}>
//                         {isCurrentPlan ? "Currently Plan" : "Choose Plan"}
//                       </span>
//                     </button>
//                   )}
//                 </div>
//                 {isCurrentPlan && expiryDate && (
//                   <div className={`mt-[10px] text-center ${textColor} text-xs font-normal`}>
//                     Expires on {expiryDate}
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Recent Payments Section */}
//       <div className="px-[36px] py-[30px] h-auto bg-[#1B2236] rounded-[20px]">
//         <div className="mb-[29px] justify-center text-white text-2xl font-bold font-['SF_Pro_Display'] leading-loose">
//           Recent Payments
//         </div>
//         <div className="w-full rounded-none overflow-hidden">
//           <div className="w-full overflow-auto h-[210px] scroll-container">
//             <Table className="min-w-[500px] scrollbar-thin scroll-container">
//               <TableHeader>
//                 <TableRow className="text-white text-sm font-bold dm-sans border-0 hover:bg-transparent">
//                   <TableHead className="w-[100px] py-4">ID</TableHead>
//                   <TableHead className="py-4">Purchase Date</TableHead>
//                   <TableHead className="py-4">Plan</TableHead>
//                   <TableHead className="text-right py-4">Transaction</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {transactionData?.data.data.map((invoice : any) => (
//                   <TableRow key={invoice.transactionId} className="border-0 text-sm font-normal hover:bg-transparent">
//                     <TableCell className="py-4 pr-15">{invoice.transactionId}</TableCell>
//                     <TableCell className="py-4">{new Date(invoice.purchaseDate).toLocaleDateString()}</TableCell>
//                     <TableCell className="py-4">{invoice.planType}</TableCell>
//                     <TableCell className="text-right py-4">${invoice.transactionAmount}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Page;


// "use client";
// import React, { useState, useTransition } from "react";
// import Image from "next/image";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import useSWR from "swr";
// import { buyPlan, getAllSubcriptionPlans, getAllTransactionsPlans, getUserInfo } from "@/services/company-services";
// import { loadStripe } from "@stripe/stripe-js";
// import { useSession } from "next-auth/react";
// import { toast } from "sonner";
// import { cancelSubscription } from "../../../services/company-services";

// // Skeleton Loading Component
// const SkeletonCard = () => (
//   <div className="w-full max-w-sm h-fit bg-gray-200 animate-pulse rounded-lg p-4">
//     <div className="mt-6 w-36 h-9 bg-gray-300 rounded-lg mx-auto"></div>
//     <div className="mt-5 text-center">
//       <div className="h-12 w-24 bg-gray-300 rounded mx-auto"></div>
//     </div>
//     <div className="mt-8 flex flex-col gap-2 w-full px-4">
//       {Array(4).fill(0).map((_, index) => (
//         <div key={index} className="flex items-center gap-3">
//           <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
//           <div className="h-4 w-32 bg-gray-300 rounded"></div>
//         </div>
//       ))}
//     </div>
//     <div className="mt-6 w-40 h-12 bg-gray-300 rounded-lg mx-auto"></div>
//   </div>
// );

// const SkeletonTable = () => (
//   <div className="w-full animate-pulse">
//     <Table className="min-w-[500px]">
//       <TableHeader>
//         <TableRow className="border-0">
//           <TableHead className="w-[100px] py-4"><div className="h-4 w-16 bg-gray-300 rounded"></div></TableHead>
//           <TableHead className="py-4"><div className="h-4 w-32 bg-gray-300 rounded"></div></TableHead>
//           <TableHead className="py-4"><div className="h-4 w-24 bg-gray-300 rounded"></div></TableHead>
//           <TableHead className="text-right py-4"><div className="h-4 w-28 bg-gray-300 rounded ml-auto"></div></TableHead>
//         </TableRow>
//       </TableHeader>
//       <TableBody>
//         {Array(3).fill(0).map((_, index) => (
//           <TableRow key={index} className="border-0">
//             <TableCell className="py-4"><div className="h-4 w-20 bg-gray-300 rounded"></div></TableCell>
//             <TableCell className="py-4"><div className="h-4 w-28 bg-gray-300 rounded"></div></TableCell>
//             <TableCell className="py-4"><div className="h-4 w-24 bg-gray-300 rounded"></div></TableCell>
//             <TableCell className="text-right py-4"><div className="h-4 w-16 bg-gray-300 rounded ml-auto"></div></TableCell>
//           </TableRow>
//         ))}
//       </TableBody>
//     </Table>
//   </div>
// );

// const Page = () => {
//   const session = useSession();
//   const { data: subscriptionData, error, isLoading, mutate } = useSWR(
//     "/company/products",
//     getAllSubcriptionPlans
//   );
//   const { data: transactionData, error: transactionError, isLoading: transactionLoading } = useSWR(
//     "/company/transactions",
//     getAllTransactionsPlans
//   );

//   const [isPending, startTransition] = useTransition();
//   const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
//   const [isCanceling, setIsCanceling] = useState<string | null>(null); // Track canceling state

//   const handlePlanSelect = async (planType: string, price: string, planId: string) => {
//     setSelectedPlanId(planId);
//     startTransition(async () => {
//       try {
//         const response = await buyPlan(`/company/create-subscription/${session.data?.user?.id}`, {
//           planType: planType,
//           email: session.data?.user?.email,
//           name: session.data?.user?.fullName,
//           interval: "month",
//           price,
//         });
//         const data = await response.data;
//         if (data.data.id) {
//           const stripe = await loadStripe(
//             process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
//           );
//           await stripe?.redirectToCheckout({ sessionId: data.data.id });
//         } else {
//           toast.error("Something went wrong. Please try again later.");
//         }
//       } catch (error) {
//         console.error(error);
//         toast.error("An error occurred while processing your request.");
//       } finally {
//         setSelectedPlanId(null);
//       }
//     });
//   };

//   const handleCancelSubscription = async (subscriptionId: string) => {
//     console.log('subscriptionId: ', subscriptionId);
//     setIsCanceling(subscriptionId);
//     try {
//       const response = await cancelSubscription(`/company/cancel-subscription`);
//       console.log('response: ', response);
//       if (response?.data.success) {
//         mutate(); // Re-fetch subscription plans to update the UI
//         toast.success("Subscription canceled successfully.");
//       } else {
//         toast.error("Failed to cancel subscription. Please try again.");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("An error occurred while canceling your subscription.");
//     } finally {
//       setIsCanceling(null);
//     }
//   };

//   if (error) return <div>Error loading subscription plans.</div>;
//   if (transactionError) return <div>Error loading transactions.</div>;

//   const products = subscriptionData?.data.products || [];

//   return (
//     <>
//       <div className="py-[30px] px-[36px] h-auto bg-[#1B2236] rounded-[20px] max-w-full">
//         <div className="mb-[64px] text-white text-2xl text-left">Subscription Plan</div>

//         <div className="flex flex-wrap lg:flex-nowrap justify-center gap-10">
//           {isLoading ? (
//             Array(3).fill(0).map((_, index) => <SkeletonCard key={index} />)
//           ) : (
//             products.map((product: any) => {
//               console.log('product: ', product);
//               const activePrice = product.prices.find((price: any) => price.active);
//               const price = activePrice ? (activePrice.unit_amount / 100).toFixed(0) : "N/A";
//               const interval = activePrice?.recurring?.interval || "month";
//               const isCurrentPlan = !!product.currentPlan;
//               const expiryDate = isCurrentPlan
//                 ? new Date(product.currentPlan.expiryDate).toLocaleDateString()
//                 : null;
//               const planType = product.name
//                 .split(" ")[0]
//                 .toLowerCase() + "Plan";
//               const isCardLoading = isPending && selectedPlanId === product.id;
//               const isCardCanceling = isCanceling === product.currentPlan?.subscriptionId;

//               // Updated styling based on the image
//               const cardBgColor = isCurrentPlan ? "bg-[#1A3F70]" : "bg-white";
//               const textColor = isCurrentPlan ? "text-white" : "text-black";
//               const priceTextColor = isCurrentPlan ? "text-white" : "text-black";
//               const buttonBgColor = "bg-[#1A3F70]"; // Consistent button color for all plans
//               const buttonTextColor = "text-white";
//               const tickImage = isCurrentPlan ? "/whitetick.svg" : "/bluetick.svg";
//               const featureTextColor = isCurrentPlan ? "text-white" : "text-black";

//               // Features based on plan type (as per the image)
//               const features = product.name.toLowerCase().includes("gold")
//                 ? ["Unlimited Signups", "Unlimited Access", "Unlimited Downloads", "Unlimited"]
//                 : Array(4).fill("Limited Access");

//               return (
//                 <div
//                   key={product.id}
//                   className={`relative w-full max-w-sm h-fit ${cardBgColor} rounded-lg flex flex-col items-center p-6 shadow-lg transition-transform duration-300 hover:scale-105`}
//                 >
//                   {/* Current Plan Label */}
//                   {isCurrentPlan && (
//                     <div className="absolute top-4 right-4 bg-gray-200 text-black text-xs font-semibold px-2 py-1 rounded">
//                       Current Plan
//                     </div>
//                   )}

//                   {/* Plan Name */}
//                   <div className={`mt-4 font-bold ${textColor} text-xl uppercase`}>
//                     {product.name}
//                   </div>

//                   {/* Price */}
//                   <div className="mt-4 text-center">
//                     <span className={`${priceTextColor} text-4xl font-bold`}>${price}</span>
//                     <span className={`${priceTextColor} text-base font-medium`}>/{interval}ly</span>
//                   </div>

//                   {/* Features */}
//                   <div className="mt-6 flex flex-col gap-3 w-full">
//                     {features.map((text: string, index: number) => (
//                       <div key={index} className="flex items-center gap-3">
//                         <Image src={tickImage} alt="check" width={16} height={16} />
//                         <div className={`${featureTextColor} text-sm font-normal`}>
//                           {text}
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   {/* Button */}
//                   <div className="mt-8 flex justify-center w-full">
//                     {isCardLoading || isCardCanceling ? (
//                       <div className="flex justify-center items-center p-5">Loading...</div>
//                     ) : isCurrentPlan ? (
//                       <button
//                         onClick={() => handleCancelSubscription(product.currentPlan.subscriptionId)}
//                         className={`h-12 w-full max-w-[200px] ${buttonBgColor} rounded-lg flex items-center justify-center`}
//                       >
//                         <span className={`${buttonTextColor} text-base font-medium`}>
//                           Cancel Subscription
//                         </span>
//                       </button>
//                     ) : (
//                       <button
//                         disabled={isCurrentPlan}
//                         onClick={() => handlePlanSelect(planType, price, product.id)}
//                         className={`h-12 w-full max-w-[200px] ${buttonBgColor} rounded-lg flex items-center justify-center`}
//                       >
//                         <span className={`${buttonTextColor} text-base font-medium`}>
//                           Choose Plan
//                         </span>
//                       </button>
//                     )}
//                   </div>

//                   {/* Expiry Date */}
//                   {isCurrentPlan && expiryDate && (
//                     <div className={`mt-4 text-center ${textColor} text-xs font-normal`}>
//                       Expires on {expiryDate}
//                     </div>
//                   )}
//                 </div>
//               );
//             })
//           )}
//         </div>
//       </div>

//       {/* Recent Payments Section */}
//       <div className="px-[36px] py-[30px] h-auto bg-[#1B2236] rounded-[20px]">
//         <div className="mb-[29px] justify-center text-white text-2xl font-bold font-['SF_Pro_Display'] leading-loose">
//           Recent Payments
//         </div>
//         <div className="w-full rounded-none overflow-hidden">
//           <div className="w-full overflow-auto h-[210px] scroll-container">
//             {transactionLoading ? (
//               <SkeletonTable />
//             ) : (
//               <Table className="min-w-[500px] scrollbar-thin scroll-container">
//                 <TableHeader>
//                   <TableRow className="text-white text-sm font-bold dm-sans border-0 hover:bg-transparent">
//                     <TableHead className="w-[100px] py-4">ID</TableHead>
//                     <TableHead className="py-4">Purchase Date</TableHead>
//                     <TableHead className="py-4">Plan</TableHead>
//                     <TableHead className="text-right py-4">Transaction</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {transactionData?.data.data.map((invoice: any) => (
//                     <TableRow key={invoice.transactionId} className="border-0 text-sm font-normal hover:bg-transparent">
//                       <TableCell className="py-4 pr-15">{invoice.transactionId}</TableCell>
//                       <TableCell className="py-4">{new Date(invoice.purchaseDate).toLocaleDateString()}</TableCell>
//                       <TableCell className="py-4">{invoice.planType}</TableCell>
//                       <TableCell className="text-right py-4">${invoice.transactionAmount}</TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Page;




// "use client";
// import React, { useState, useTransition } from "react";
// import Image from "next/image";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import useSWR from "swr";
// import { buyPlan, getAllSubcriptionPlans, getAllTransactionsPlans, getUserInfo } from "@/services/company-services";
// import { loadStripe } from "@stripe/stripe-js";
// import { useSession } from "next-auth/react";
// import { toast } from "sonner";
// import { cancelSubscription } from "../../../services/company-services";

// // Skeleton Loading Component
// const SkeletonCard = () => (
//   <div className="w-full max-w-sm h-fit bg-gray-200 animate-pulse rounded-lg p-4">
//     <div className="mt-6 w-36 h-9 bg-gray-300 rounded-lg mx-auto"></div>
//     <div className="mt-5 text-center">
//       <div className="h-12 w-24 bg-gray-300 rounded mx-auto"></div>
//     </div>
//     <div className="mt-8 flex flex-col gap-2 w-full px-4">
//       {Array(4).fill(0).map((_, index) => (
//         <div key={index} className="flex items-center gap-3">
//           <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
//           <div className="h-4 w-32 bg-gray-300 rounded"></div>
//         </div>
//       ))}
//     </div>
//     <div className="mt-6 w-40 h-12 bg-gray-300 rounded-lg mx-auto"></div>
//   </div>
// );

// const SkeletonTable = () => (
//   <div className="w-full animate-pulse">
//     <Table className="min-w-[500px]">
//       <TableHeader>
//         <TableRow className="border-0">
//           <TableHead className="w-[100px] py-4"><div className="h-4 w-16 bg-gray-300 rounded"></div></TableHead>
//           <TableHead className="py-4"><div className="h-4 w-32 bg-gray-300 rounded"></div></TableHead>
//           <TableHead className="py-4"><div className="h-4 w-24 bg-gray-300 rounded"></div></TableHead>
//           <TableHead className="text-right py-4"><div className="h-4 w-28 bg-gray-300 rounded ml-auto"></div></TableHead>
//         </TableRow>
//       </TableHeader>
//       <TableBody>
//         {Array(3).fill(0).map((_, index) => (
//           <TableRow key={index} className="border-0">
//             <TableCell className="py-4"><div className="h-4 w-20 bg-gray-300 rounded"></div></TableCell>
//             <TableCell className="py-4"><div className="h-4 w-28 bg-gray-300 rounded"></div></TableCell>
//             <TableCell className="py-4"><div className="h-4 w-24 bg-gray-300 rounded"></div></TableCell>
//             <TableCell className="text-right py-4"><div className="h-4 w-16 bg-gray-300 rounded ml-auto"></div></TableCell>
//           </TableRow>
//         ))}
//       </TableBody>
//     </Table>
//   </div>
// );

// const Page = () => {
//   const session = useSession();
//   const { data: subscriptionData, error, isLoading, mutate } = useSWR(
//     "/company/products",
//     getAllSubcriptionPlans
//   );
//   const { data: transactionData, error: transactionError, isLoading: transactionLoading } = useSWR(
//     "/company/transactions",
//     getAllTransactionsPlans
//   );

//   const [isPending, startTransition] = useTransition();
//   const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
//   const [isCanceling, setIsCanceling] = useState<string | null>(null); // Track canceling state
//   const [showSkeletonAfterCancel, setShowSkeletonAfterCancel] = useState(false); // New state for skeleton loading after cancel

//   const handlePlanSelect = async (planType: string, price: string, planId: string) => {
//     setSelectedPlanId(planId);
//     startTransition(async () => {
//       try {
//         const response = await buyPlan(`/company/create-subscription/${session.data?.user?.id}`, {
//           planType: planType,
//           email: session.data?.user?.email,
//           name: session.data?.user?.fullName,
//           interval: "month",
//           price,
//         });
//         const data = await response.data;
//         if (data.data.id) {
//           const stripe = await loadStripe(
//             process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
//           );
//           await stripe?.redirectToCheckout({ sessionId: data.data.id });
//         } else {
//           toast.error("Something went wrong. Please try again later.");
//         }
//       } catch (error) {
//         console.error(error);
//         toast.error("An error occurred while processing your request.");
//       } finally {
//         setSelectedPlanId(null);
//       }
//     });
//   };

//   const handleCancelSubscription = async (subscriptionId: string) => {
//     console.log('subscriptionId: ', subscriptionId);
//     setIsCanceling(subscriptionId);
//     try {
//       const response = await cancelSubscription(`/company/cancel-subscription`);
//       console.log('response: ', response);
//       if (response?.data.success) {
//         setShowSkeletonAfterCancel(true); // Show skeleton loading after successful cancellation
//         await mutate(); // Re-fetch subscription plans to update the UI
//         toast.success("Subscription canceled successfully.");
//       } else {
//         toast.error("Failed to cancel subscription. Please try again.");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("An error occurred while canceling your subscription.");
//     } finally {
//       setIsCanceling(null);
//       setShowSkeletonAfterCancel(false); // Reset skeleton loading state
//     }
//   };

//   if (error) return <div>Error loading subscription plans.</div>;
//   if (transactionError) return <div>Error loading transactions.</div>;

//   const products = subscriptionData?.data.products || [];

//   return (
//     <>
//       <div className="py-[30px] px-[36px] h-auto bg-[#1B2236] rounded-[20px] max-w-full">
//         <div className="mb-[64px] text-white text-2xl text-left">Subscription Plan</div>

//         <div className="flex flex-wrap lg:flex-nowrap justify-center gap-10">
//           {isLoading || showSkeletonAfterCancel ? (
//             Array(3).fill(0).map((_, index) => <SkeletonCard key={index} />)
//           ) : (
//             products.map((product: any) => {
//               const activePrice = product.prices.find((price: any) => price.active);
//               const price = activePrice ? (activePrice.unit_amount / 100).toFixed(0) : "N/A";
//               const interval = activePrice?.recurring?.interval || "month";
//               const isCurrentPlan = !!product.currentPlan;
//               const expiryDate = isCurrentPlan
//                 ? new Date(product.currentPlan.expiryDate).toLocaleDateString()
//                 : null;
//               const planType = product.name
//                 .split(" ")[0]
//                 .toLowerCase() + "Plan";
//               const isCardLoading = isPending && selectedPlanId === product.id;
//               const isCardCanceling = isCanceling === product.currentPlan?.subscriptionId;

//               // Updated styling based on the image
//               const cardBgColor = isCurrentPlan ? "bg-[#1A3F70]" : "bg-white";
//               const textColor = isCurrentPlan ? "text-white" : "text-black";
//               const priceTextColor = isCurrentPlan ? "text-white" : "text-[#1a3f70]";
//               const buttonBgColor = isCurrentPlan ? "bg-white" : "bg-[#1A3F70]"; // Consistent button color for all plans
//               const buttonTextColor = isCurrentPlan ? "text-[#1A3F70]" : "text-white";
//               const tickImage = isCurrentPlan ? "/whitetick.svg" : "/bluetick.svg";
//               const featureTextColor = isCurrentPlan ? "text-white" : "text-black";
//               const borderColor = isCurrentPlan ? "border-white" : "border-neutral-800";
//               // Features based on plan type (as per the image)
//               const features = product.name.toLowerCase().includes("gold")
//                 ? ["Unlimited Signups", "Unlimited Access", "Unlimited Downloads", "Unlimited"]
//                 : Array(4).fill("Limited Access");

//               return (
//                 <div
//                   key={product.id}
//                   className={`relative w-full max-w-sm h-fit ${cardBgColor} rounded-lg flex flex-col items-left p-6 shadow-lg transition-transform duration-300 hover:scale-105`}
//                 >
//                   {/* Current Plan Label */}
//                   {isCurrentPlan && (
//                     <div className="absolute top-0 right-0 text-center justify-start bg-white text-[#1a3f70] text-sm font-medium font-['SF_Pro_Display'] p-2 px-3 rounded-lg shadow-lg">
//                       Current Plan
//                     </div>
//                   )}

//                   {/* Plan Name */}
//                   {/* <div className={`mt-4 font-bold ${textColor} text-xl uppercase`}>
//                     {product.name}
//                   </div> */}
//                   <div className={`font-bold flex items-center justify-center w-36 h-9 rounded-lg border ${borderColor}`}>
//                    <div className={`${textColor} text-xl font-medium`}>{product.name}</div>
//                  </div>

//                   {/* Price */}
//                   <div className="mt-4 text-left text-xl font-medium font-['SF_Pro_Display']">
//                     <span className={`${priceTextColor} text-5xl font-bold font-['SF_Pro_Display']  `}>${price}</span>
//                     <span className={`${priceTextColor} text-lg font-medium font-['SF_Pro_Display']`}>/{interval}ly</span>
//                   </div>

//                   {/* Features */}
//                   <div className="mt-6 flex flex-col gap-3 w-full">
//                     {features.map((text: string, index: number) => (
//                       <div key={index} className="flex items-center gap-3">
//                         <Image src={tickImage} alt="check" width={16} height={16} />
//                         <div className={`${featureTextColor} text-xs font-normal font-['SF_Pro_Display'] leading-7`}>
//                           {text}
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   {/* Button */}
//                   <div className="mt-8 flex justify-center w-full">
//                     {isCardLoading || isCardCanceling ? (
//                       <div className="flex justify-center items-center p-5">Loading...</div>
//                     ) : isCurrentPlan ? (
//                       <button
//                         onClick={() => handleCancelSubscription(product.currentPlan.subscriptionId)}
//                         className={`h-12 w-full max-w-[200px] ${buttonBgColor} rounded-lg flex items-center justify-center`}
//                       >
//                         <span className={`${buttonTextColor} text-lg font-medium font-['SF_Pro_Display']`}>
//                           Cancel Subscription
//                         </span>
//                       </button>
//                     ) : (
//                       <button
//                         disabled={isCurrentPlan}
//                         onClick={() => handlePlanSelect(planType, price, product.id)}
//                         className={`h-12 w-full max-w-[200px] ${buttonBgColor} rounded-lg flex items-center justify-center`}
//                       >
//                         <span className={`${buttonTextColor} text-base font-medium`}>
//                           Choose Plan
//                         </span>
//                       </button>
//                     )}
//                   </div>

//                   {/* Expiry Date */}
//                   {isCurrentPlan && expiryDate && (
//                     <div className={`mt-4 text-center ${textColor} text-xs font-normal`}>
//                       Expires on {expiryDate}
//                     </div>
//                   )}
//                 </div>
//               );
//             })
//           )}
//         </div>
//       </div>

//       {/* Recent Payments Section */}
//       <div className="px-[36px] py-[30px] h-auto bg-[#1B2236] rounded-[20px]">
//         <div className="mb-[29px] justify-center text-white text-2xl font-bold font-['SF_Pro_Display'] leading-loose">
//           Recent Payments
//         </div>
//         <div className="w-full rounded-none overflow-hidden">
//           <div className="w-full overflow-auto h-[210px] scroll-container">
//             {transactionLoading ? (
//               <SkeletonTable />
//             ) : (
//               <Table className="min-w-[500px] scrollbar-thin scroll-container">
//                 <TableHeader>
//                   <TableRow className="text-white text-sm font-bold dm-sans border-0 hover:bg-transparent">
//                     <TableHead className="w-[100px] py-4">ID</TableHead>
//                     <TableHead className="py-4">Purchase Date</TableHead>
//                     <TableHead className="py-4">Plan</TableHead>
//                     <TableHead className="text-right py-4">Transaction</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {transactionData?.data.data.map((invoice: any) => (
//                     <TableRow key={invoice.transactionId} className="border-0 text-sm font-normal hover:bg-transparent">
//                       <TableCell className="py-4 pr-15">{invoice.transactionId}</TableCell>
//                       <TableCell className="py-4">{new Date(invoice.purchaseDate).toLocaleDateString()}</TableCell>
//                       <TableCell className="py-4">{invoice.planType}</TableCell>
//                       <TableCell className="text-right py-4">${invoice.transactionAmount}</TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Page;



// "use client";
// import React, { useState, useTransition } from "react";
// import Image from "next/image";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import useSWR from "swr";
// import { buyPlan, getAllSubcriptionPlans, getAllTransactionsPlans, getUserInfo } from "@/services/company-services";
// import { loadStripe } from "@stripe/stripe-js";
// import { useSession } from "next-auth/react";
// import { toast } from "sonner";
// import { cancelSubscription } from "../../../services/company-services";

// // Skeleton Loading Component
// const SkeletonCard = () => (
//   <div className="w-full max-w-sm h-fit bg-gray-200 animate-pulse rounded-lg p-4">
//     <div className="mt-6 w-36 h-9 bg-gray-300 rounded-lg mx-auto"></div>
//     <div className="mt-5 text-center">
//       <div className="h-12 w-24 bg-gray-300 rounded mx-auto"></div>
//     </div>
//     <div className="mt-8 flex flex-col gap-2 w-full px-4">
//       {Array(4).fill(0).map((_, index) => (
//         <div key={index} className="flex items-center gap-3">
//           <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
//           <div className="h-4 w-32 bg-gray-300 rounded"></div>
//         </div>
//       ))}
//     </div>
//     <div className="mt-6 w-40 h-12 bg-gray-300 rounded-lg mx-auto"></div>
//   </div>
// );

// const SkeletonTable = () => (
//   <div className="w-full animate-pulse">
//     <Table className="min-w-[500px]">
//       <TableHeader>
//         <TableRow className="border-0">
//           <TableHead className="w-[100px] py-4"><div className="h-4 w-16 bg-gray-300 rounded"></div></TableHead>
//           <TableHead className="py-4"><div className="h-4 w-32 bg-gray-300 rounded"></div></TableHead>
//           <TableHead className="py-4"><div className="h-4 w-24 bg-gray-300 rounded"></div></TableHead>
//           <TableHead className="text-right py-4"><div className="h-4 w-28 bg-gray-300 rounded ml-auto"></div></TableHead>
//         </TableRow>
//       </TableHeader>
//       <TableBody>
//         {Array(3).fill(0).map((_, index) => (
//           <TableRow key={index} className="border-0">
//             <TableCell className="py-4"><div className="h-4 w-20 bg-gray-300 rounded"></div></TableCell>
//             <TableCell className="py-4"><div className="h-4 w-28 bg-gray-300 rounded"></div></TableCell>
//             <TableCell className="py-4"><div className="h-4 w-24 bg-gray-300 rounded"></div></TableCell>
//             <TableCell className="text-right py-4"><div className="h-4 w-16 bg-gray-300 rounded ml-auto"></div></TableCell>
//           </TableRow>
//         ))}
//       </TableBody>
//     </Table>
//   </div>
// );

// // Modal Component
// const SubscriptionModal = ({ isOpen, onClose, onContinue, planType, price } : any) => {
//   const [numberOfUsers, setNumberOfUsers] = useState(1);

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-[#1B2236] rounded-[20px] p-6 w-[400px]">
//         <h2 className="text-white text-2xl mb-4">Activate Your Plan</h2>
//         <div className="mb-4">
//           <p className="text-white">Type of plan</p>
//           <div className="bg-gray-800 text-white p-2 rounded mt-1">{planType}</div>
//         </div>
//         <div className="mb-4">
//           <p className="text-white">Amount per user</p>
//           <div className="bg-gray-800 text-white p-2 rounded mt-1">${price}</div>
//         </div>
//         <div className="mb-4">
//           <p className="text-white">Select number of users</p>
//           <input
//             type="number"
//             min="1"
//             value={numberOfUsers}
//             onChange={(e) => setNumberOfUsers(Math.max(1, parseInt(e.target.value)))}
//             className="w-full bg-gray-800 text-white p-2 rounded mt-1"
//           />
//         </div>
//         <div className="flex justify-between">
//           <button
//             onClick={onClose}
//             className="bg-blue-500 text-white px-4 py-2 rounded"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={() => onContinue(numberOfUsers)}
//             className="bg-green-500 text-white px-4 py-2 rounded"
//           >
//             Continue
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const Page = () => {
//   const session = useSession();
//   const { data: subscriptionData, error, isLoading, mutate } = useSWR(
//     "/company/products",
//     getAllSubcriptionPlans
//   );
//   const { data: transactionData, error: transactionError, isLoading: transactionLoading } = useSWR(
//     "/company/transactions",
//     getAllTransactionsPlans
//   );

//   const [isPending, startTransition] = useTransition();
//   const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
//   const [isCanceling, setIsCanceling] = useState<string | null>(null);
//   const [showSkeletonAfterCancel, setShowSkeletonAfterCancel] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedPlanDetails, setSelectedPlanDetails] = useState({ planType: "", price: "", planId: "" });

//   const handlePlanSelect = (planType: string, price: string, planId: string) => {
//     setSelectedPlanDetails({ planType, price, planId });
//     setIsModalOpen(true);
//   };

//   const handleContinue = async (numberOfUsers: number) => {
//     setIsModalOpen(false);
//     setSelectedPlanId(selectedPlanDetails.planId);
//     startTransition(async () => {
//       try {
//         const payload={
//           planType: selectedPlanDetails.planType,
//           email: session.data?.user?.email,
//           name: session.data?.user?.fullName,
//           interval: "month",
//           price: Number(selectedPlanDetails.price) * numberOfUsers,
//           numberOfUsers, // Pass the number of users
//         }
//         console.log('payload: ', payload);
//         const response = await buyPlan(`/company/create-subscription/${session.data?.user?.id}`, {
//           planType: selectedPlanDetails.planType,
//           email: session.data?.user?.email,
//           name: session.data?.user?.fullName,
//           interval: "month",
//           price: Number(selectedPlanDetails.price) * numberOfUsers,
//           numberOfUsers, // Pass the number of users
//         });
//         const data = await response.data;
//         if (data.data.id) {
//           const stripe = await loadStripe(
//             process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
//           );
//           await stripe?.redirectToCheckout({ sessionId: data.data.id });
//         } else {
//           toast.error("Something went wrong. Please try again later.");
//         }
//       } catch (error) {
//         console.error(error);
//         toast.error("An error occurred while processing your request.");
//       } finally {
//         setSelectedPlanId(null);
//       }
//     });
//   };

//   const handleCancelSubscription = async (subscriptionId: string) => {
//     setIsCanceling(subscriptionId);
//     try {
//       const response = await cancelSubscription(`/company/cancel-subscription`);
//       if (response?.data.success) {
//         setShowSkeletonAfterCancel(true);
//         await mutate();
//         toast.success("Subscription canceled successfully.");
//       } else {
//         toast.error("Failed to cancel subscription. Please try again.");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("An error occurred while canceling your subscription.");
//     } finally {
//       setIsCanceling(null);
//       setShowSkeletonAfterCancel(false);
//     }
//   };

//   if (error) return <div>Error loading subscription plans.</div>;
//   if (transactionError) return <div>Error loading transactions.</div>;

//   const products = subscriptionData?.data.products || [];

//   return (
//     <>
     
//       <div className="py-[30px] px-[36px] h-auto bg-[#1B2236] rounded-[20px] max-w-full">
//         <div className="mb-[64px] text-white text-2xl text-left">Subscription Plan</div>

//         <div className="flex flex-wrap lg:flex-nowrap justify-center gap-10">
//           {isLoading || showSkeletonAfterCancel ? (
//             Array(3).fill(0).map((_, index) => <SkeletonCard key={index} />)
//           ) : (
//             products.map((product: any) => {
//               const activePrice = product.prices.find((price: any) => price.active);
//               const price = activePrice ? (activePrice.unit_amount / 100).toFixed(0) : "N/A";
//               const interval = activePrice?.recurring?.interval || "month";
//               const isCurrentPlan = !!product.currentPlan;
//               const expiryDate = isCurrentPlan
//                 ? new Date(product.currentPlan.expiryDate).toLocaleDateString()
//                 : null;
//               const planType = product.name
//                 .split(" ")[0]
//                 .toLowerCase() + "Plan";
//               const isCardLoading = isPending && selectedPlanId === product.id;
//               const isCardCanceling = isCanceling === product.currentPlan?.subscriptionId;

//               const cardBgColor = isCurrentPlan ? "bg-[#1A3F70]" : "bg-white";
//               const textColor = isCurrentPlan ? "text-white" : "text-black";
//               const priceTextColor = isCurrentPlan ? "text-white" : "text-[#1a3f70]";
//               const buttonBgColor = isCurrentPlan ? "bg-white" : "bg-[#1A3F70]";
//               const buttonTextColor = isCurrentPlan ? "text-[#1A3F70]" : "text-white";
//               const tickImage = isCurrentPlan ? "/whitetick.svg" : "/bluetick.svg";
//               const featureTextColor = isCurrentPlan ? "text-white" : "text-black";
//               const borderColor = isCurrentPlan ? "border-white" : "border-neutral-800";
//               const features = product.name.toLowerCase().includes("gold")
//                 ? ["Unlimited Signups", "Unlimited Access", "Unlimited Downloads", "Unlimited"]
//                 : Array(4).fill("Limited Access");

//               return (
//                 <div
//                   key={product.id}
//                   className={`relative w-full max-w-sm h-fit ${cardBgColor} rounded-lg flex flex-col items-left p-6 shadow-lg transition-transform duration-300 hover:scale-105`}
//                 >
//                   {isCurrentPlan && (
//                     <div className="absolute top-0 right-0 text-center justify-start bg-white text-[#1a3f70] text-sm font-medium font-['SF_Pro_Display'] p-2 px-3 rounded-lg shadow-lg">
//                       Current Plan
//                     </div>
//                   )}
//                   <div className={`font-bold flex items-center justify-center w-36 h-9 rounded-lg border ${borderColor}`}>
//                     <div className={`${textColor} text-xl font-medium`}>{product.name}</div>
//                   </div>
//                   <div className="mt-4 text-left text-xl font-medium font-['SF_Pro_Display']">
//                     <span className={`${priceTextColor} text-5xl font-bold font-['SF_Pro_Display']`}>${price}</span>
//                     <span className={`${priceTextColor} text-lg font-medium font-['SF_Pro_Display']`}>/{interval}ly</span>
//                   </div>
//                   <div className="mt-6 flex flex-col gap-3 w-full">
//                     {features.map((text: string, index: number) => (
//                       <div key={index} className="flex items-center gap-3">
//                         <Image src={tickImage} alt="check" width={16} height={16} />
//                         <div className={`${featureTextColor} text-xs font-normal font-['SF_Pro_Display'] leading-7`}>
//                           {text}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                   <div className="mt-8 flex justify-center w-full">
//                     {isCardLoading || isCardCanceling ? (
//                       <div className="flex justify-center items-center p-5">Loading...</div>
//                     ) : isCurrentPlan ? (
//                       <button
//                         onClick={() => handleCancelSubscription(product.currentPlan.subscriptionId)}
//                         className={`h-12 w-full max-w-[200px] ${buttonBgColor} rounded-lg flex items-center justify-center`}
//                       >
//                         <span className={`${buttonTextColor} text-lg font-medium font-['SF_Pro_Display']`}>
//                           Cancel Subscription
//                         </span>
//                       </button>
//                     ) : (
//                       <button
//                         disabled={isCurrentPlan}
//                         onClick={() => handlePlanSelect(planType, price, product.id)}
//                         className={`h-12 w-full max-w-[200px] ${buttonBgColor} rounded-lg flex items-center justify-center`}
//                       >
//                         <span className={`${buttonTextColor} text-base font-medium`}>
//                           Choose Plan
//                         </span>
//                       </button>
//                     )}
//                   </div>
//                   {isCurrentPlan && expiryDate && (
//                     <div className={`mt-4 text-center ${textColor} text-xs font-normal`}>
//                       Expires on {expiryDate}
//                     </div>
//                   )}
//                 </div>
//               );
//             })
//           )}
//         </div>
//         <SubscriptionModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onContinue={handleContinue}
//         planType={selectedPlanDetails.planType}
//         price={selectedPlanDetails.price}
//       />
//       </div>

//       <div className="px-[36px] py-[30px] h-auto bg-[#1B2236] rounded-[20px]">
//         <div className="mb-[29px] justify-center text-white text-2xl font-bold font-['SF_Pro_Display'] leading-loose">
//           Recent Payments
//         </div>
//         <div className="w-full rounded-none overflow-hidden">
//           <div className="w-full overflow-auto h-[210px] scroll-container">
//             {transactionLoading ? (
//               <SkeletonTable />
//             ) : (
//               <Table className="min-w-[500px] scrollbar-thin scroll-container">
//                 <TableHeader>
//                   <TableRow className="text-white text-sm font-bold dm-sans border-0 hover:bg-transparent">
//                     <TableHead className="w-[100px] py-4">ID</TableHead>
//                     <TableHead className="py-4">Purchase Date</TableHead>
//                     <TableHead className="py-4">Plan</TableHead>
//                     <TableHead className="text-right py-4">Transaction</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {transactionData?.data.data.map((invoice: any) => (
//                     <TableRow key={invoice.transactionId} className="border-0 text-sm font-normal hover:bg-transparent">
//                       <TableCell className="py-4 pr-15">{invoice.transactionId}</TableCell>
//                       <TableCell className="py-4">{new Date(invoice.purchaseDate).toLocaleDateString()}</TableCell>
//                       <TableCell className="py-4">{invoice.planType}</TableCell>
//                       <TableCell className="text-right py-4">${invoice.transactionAmount}</TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             )}
//           </div>
//         </div>
//       </div>

     
//     </>
//   );
// };

// export default Page;





// "use client";
// import React, { useState, useTransition } from "react";
// import Image from "next/image";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import useSWR from "swr";
// import { buyPlan, getAllSubcriptionPlans, getAllTransactionsPlans, getUserInfo } from "@/services/company-services";
// import { loadStripe } from "@stripe/stripe-js";
// import { useSession } from "next-auth/react";
// import { toast } from "sonner";
// import { cancelSubscription } from "../../../services/company-services";

// // Skeleton Loading Component
// const SkeletonCard = () => (
//   <div className="w-full max-w-sm h-fit bg-gray-200 animate-pulse rounded-lg p-4">
//     <div className="mt-6 w-36 h-9 bg-gray-300 rounded-lg mx-auto"></div>
//     <div className="mt-5 text-center">
//       <div className="h-12 w-24 bg-gray-300 rounded mx-auto"></div>
//     </div>
//     <div className="mt-8 flex flex-col gap-2 w-full px-4">
//       {Array(4).fill(0).map((_, index) => (
//         <div key={index} className="flex items-center gap-3">
//           <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
//           <div className="h-4 w-32 bg-gray-300 rounded"></div>
//         </div>
//       ))}
//     </div>
//     <div className="mt-6 w-40 h-12 bg-gray-300 rounded-lg mx-auto"></div>
//   </div>
// );

// const SkeletonTable = () => (
//   <div className="w-full animate-pulse">
//     <Table className="min-w-[500px]">
//       <TableHeader>
//         <TableRow className="border-0">
//           <TableHead className="w-[100px] py-4"><div className="h-4 w-16 bg-gray-300 rounded"></div></TableHead>
//           <TableHead className="py-4"><div className="h-4 w-32 bg-gray-300 rounded"></div></TableHead>
//           <TableHead className="py-4"><div className="h-4 w-24 bg-gray-300 rounded"></div></TableHead>
//           <TableHead className="text-right py-4"><div className="h-4 w-28 bg-gray-300 rounded ml-auto"></div></TableHead>
//         </TableRow>
//       </TableHeader>
//       <TableBody>
//         {Array(3).fill(0).map((_, index) => (
//           <TableRow key={index} className="border-0">
//             <TableCell className="py-4"><div className="h-4 w-20 bg-gray-300 rounded"></div></TableCell>
//             <TableCell className="py-4"><div className="h-4 w-28 bg-gray-300 rounded"></div></TableCell>
//             <TableCell className="py-4"><div className="h-4 w-24 bg-gray-300 rounded"></div></TableCell>
//             <TableCell className="text-right py-4"><div className="h-4 w-16 bg-gray-300 rounded ml-auto"></div></TableCell>
//           </TableRow>
//         ))}
//       </TableBody>
//     </Table>
//   </div>
// );

// // Modal Component
// const SubscriptionModal = ({ isOpen, onClose, onContinue, planType, price }: any) => {
//   const [numberOfUsers, setNumberOfUsers] = useState(1);
//   const [isLoading, setIsLoading] = useState(false); // State for loading on Continue button

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
//       <div className="bg-[#1B2236] rounded-[20px] p-6 w-[400px] shadow-lg">
//         <h2 className="text-white text-2xl mb-6 text-center">Activate Your Plan</h2>
//         <div className="space-y-4">
//           <div>
//             <p className="text-white text-sm">Type of plan</p>
//             <div className="bg-[#2D3748] text-white p-3 rounded mt-2 text-center uppercase">{planType}</div>
//           </div>
//           <div>
//             <p className="text-white text-sm">Amount per user</p>
//             <div className="bg-[#2D3748] text-white p-3 rounded mt-2 text-center">${price}</div>
//           </div>
//           <div>
//             <p className="text-white text-sm">Description</p>
//             <div className="bg-[#2D3748] text-white p-3 rounded mt-2 text-center">
//               Introducing our Premium Subscription Plan for just $25.99 a month. Enjoy unlimited access to exclusive
//               content, personalized recommendations.
//             </div>
//           </div>
//           <div>
//             <p className="text-white text-sm">Select number of users</p>
//             <input
//               type="number"
//               min="1"
//               value={numberOfUsers}
//               onChange={(e) => setNumberOfUsers(Math.max(1, parseInt(e.target.value) || 1))}
//               className="w-full bg-[#2D3748] text-white p-3 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-[#1A3F70]"
//             />
//           </div>
//           <div className="flex justify-between items-center">
//             <p className="text-white text-sm">Total Amount</p>
//             <div className="text-white text-lg font-bold">${(Number(price) * numberOfUsers).toFixed(2)}</div>
//           </div>
//         </div>
//         <div className="mt-6 flex justify-between">
//           <button
//             onClick={onClose}
//             className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={() => {
//               setIsLoading(true);
//               onContinue(numberOfUsers).finally(() => setIsLoading(false));
//             }}
//             className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center"
//             disabled={isLoading}
//           >
//             {isLoading ? (
//               <span className="flex items-center">
//                 <svg
//                   className="animate-spin h-5 w-5 mr-2 text-white"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   ></circle>
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
//                   ></path>
//                 </svg>
//                 Loading...
//               </span>
//             ) : (
//               "Continue"
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const Page = () => {
//   const session = useSession();
//   const { data: subscriptionData, error, isLoading, mutate } = useSWR(
//     "/company/products",
//     getAllSubcriptionPlans
//   );
//   const { data: transactionData, error: transactionError, isLoading: transactionLoading } = useSWR(
//     "/company/transactions",
//     getAllTransactionsPlans
//   );

//   const [isPending, startTransition] = useTransition();
//   const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
//   const [isCanceling, setIsCanceling] = useState<string | null>(null);
//   const [showSkeletonAfterCancel, setShowSkeletonAfterCancel] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedPlanDetails, setSelectedPlanDetails] = useState({ planType: "", price: "", planId: "" });

//   const handlePlanSelect = (planType: string, price: string, planId: string) => {
//     setSelectedPlanDetails({ planType, price, planId });
//     setIsModalOpen(true);
//   };

//   const handleContinue = async (numberOfUsers: number) => {
//     setIsModalOpen(false);
//     setSelectedPlanId(selectedPlanDetails.planId);
//     startTransition(async () => {
//       try {
//         const payload = {
//           planType: selectedPlanDetails.planType,
//           email: session.data?.user?.email,
//           name: session.data?.user?.fullName,
//           interval: "month",
//           price: Number(selectedPlanDetails.price) * numberOfUsers,
//           numberOfUsers,
//         };
//         console.log("payload: ", payload);
//         const response = await buyPlan(`/company/create-subscription/${session.data?.user?.id}`, payload);
//         const data = await response.data;
//         if (data.data.id) {
//           const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);
//           await stripe?.redirectToCheckout({ sessionId: data.data.id });
//         } else {
//           toast.error("Something went wrong. Please try again later.");
//         }
//       } catch (error) {
//         console.error(error);
//         toast.error("An error occurred while processing your request.");
//       } finally {
//         setSelectedPlanId(null);
//       }
//     });
//   };

//   const handleCancelSubscription = async (subscriptionId: string) => {
//     setIsCanceling(subscriptionId);
//     try {
//       const response = await cancelSubscription(`/company/cancel-subscription`);
//       if (response?.data.success) {
//         setShowSkeletonAfterCancel(true);
//         await mutate();
//         toast.success("Subscription canceled successfully.");
//       } else {
//         toast.error("Failed to cancel subscription. Please try again.");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("An error occurred while canceling your subscription.");
//     } finally {
//       setIsCanceling(null);
//       setShowSkeletonAfterCancel(false);
//     }
//   };

//   if (error) return <div>Error loading subscription plans.</div>;
//   if (transactionError) return <div>Error loading transactions.</div>;

//   const products = subscriptionData?.data.products || [];

//   return (
//     <>
//       <div className="py-[30px] px-[36px] h-auto bg-[#1B2236] rounded-[20px] max-w-full">
//         <div className="mb-[64px] text-white text-2xl text-left">Subscription Plan</div>

//         <div className="flex flex-wrap lg:flex-nowrap justify-center gap-10">
//           {isLoading || showSkeletonAfterCancel ? (
//             Array(3).fill(0).map((_, index) => <SkeletonCard key={index} />)
//           ) : (
//             products.map((product: any) => {
//               const activePrice = product.prices.find((price: any) => price.active);
//               const price = activePrice ? (activePrice.unit_amount / 100).toFixed(0) : "N/A";
//               const interval = activePrice?.recurring?.interval || "month";
//               const isCurrentPlan = !!product.currentPlan;
//               const expiryDate = isCurrentPlan
//                 ? new Date(product.currentPlan.expiryDate).toLocaleDateString()
//                 : null;
//               const planType = product.name.split(" ")[0].toLowerCase() + "Plan";
//               const isCardLoading = isPending && selectedPlanId === product.id;
//               const isCardCanceling = isCanceling === product.currentPlan?.subscriptionId;

//               const cardBgColor = isCurrentPlan ? "bg-[#1A3F70]" : "bg-white";
//               const textColor = isCurrentPlan ? "text-white" : "text-black";
//               const priceTextColor = isCurrentPlan ? "text-white" : "text-[#1a3f70]";
//               const buttonBgColor = isCurrentPlan ? "bg-white" : "bg-[#1A3F70]";
//               const buttonTextColor = isCurrentPlan ? "text-[#1A3F70]" : "text-white";
//               const tickImage = isCurrentPlan ? "/whitetick.svg" : "/bluetick.svg";
//               const featureTextColor = isCurrentPlan ? "text-white" : "text-black";
//               const borderColor = isCurrentPlan ? "border-white" : "border-neutral-800";
//               const features = product.name.toLowerCase().includes("gold")
//                 ? ["Unlimited Signups", "Unlimited Access", "Unlimited Downloads", "Unlimited"]
//                 : Array(4).fill("Limited Access");

//               return (
//                 <div
//                   key={product.id}
//                   className={`relative w-full max-w-sm h-fit ${cardBgColor} rounded-lg flex flex-col items-left p-6 shadow-lg transition-transform duration-300 hover:scale-105`}
//                 >
//                   {isCurrentPlan && (
//                     <div className="absolute top-0 right-0 text-center justify-start bg-white text-[#1a3f70] text-sm font-medium font-['SF_Pro_Display'] p-2 px-3 rounded-lg shadow-lg">
//                       Current Plan
//                     </div>
//                   )}
//                   <div className={`font-bold flex items-center justify-center w-36 h-9 rounded-lg border ${borderColor}`}>
//                     <div className={`${textColor} text-xl font-medium`}>{product.name}</div>
//                   </div>
//                   <div className="mt-4 text-left text-xl font-medium font-['SF_Pro_Display']">
//                     <span className={`${priceTextColor} text-5xl font-bold font-['SF_Pro_Display']`}>${price}</span>
//                     <span className={`${priceTextColor} text-lg font-medium font-['SF_Pro_Display']`}>/{interval}ly</span>
//                   </div>
//                   <div className="mt-6 flex flex-col gap-3 w-full">
//                     {features.map((text: string, index: number) => (
//                       <div key={index} className="flex items-center gap-3">
//                         <Image src={tickImage} alt="check" width={16} height={16} />
//                         <div className={`${featureTextColor} text-xs font-normal font-['SF_Pro_Display'] leading-7`}>
//                           {text}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                   <div className="mt-8 flex justify-center w-full">
//                     {isCardLoading || isCardCanceling ? (
//                       <div className="flex justify-center items-center p-5">Loading...</div>
//                     ) : isCurrentPlan ? (
//                       <button
//                         onClick={() => handleCancelSubscription(product.currentPlan.subscriptionId)}
//                         className={`h-12 w-full max-w-[200px] ${buttonBgColor} rounded-lg flex items-center justify-center`}
//                       >
//                         <span className={`${buttonTextColor} text-lg font-medium font-['SF_Pro_Display']`}>
//                           Cancel Subscription
//                         </span>
//                       </button>
//                     ) : (
//                       <button
//                         disabled={isCurrentPlan}
//                         onClick={() => handlePlanSelect(planType, price, product.id)}
//                         className={`h-12 w-full max-w-[200px] ${buttonBgColor} rounded-lg flex items-center justify-center`}
//                       >
//                         <span className={`${buttonTextColor} text-base font-medium`}>
//                           Choose Plan
//                         </span>
//                       </button>
//                     )}
//                   </div>
//                   {isCurrentPlan && expiryDate && (
//                     <div className={`mt-4 text-center ${textColor} text-xs font-normal`}>
//                       Expires on {expiryDate}
//                     </div>
//                   )}
//                 </div>
//               );
//             })
//           )}
//         </div>
//         <SubscriptionModal
//           isOpen={isModalOpen}
//           onClose={() => setIsModalOpen(false)}
//           onContinue={handleContinue}
//           planType={selectedPlanDetails.planType}
//           price={selectedPlanDetails.price}
//         />
//       </div>

//       <div className="px-[36px] py-[30px] h-auto bg-[#1B2236] rounded-[20px]">
//         <div className="mb-[29px] justify-center text-white text-2xl font-bold font-['SF_Pro_Display'] leading-loose">
//           Recent Payments
//         </div>
//         <div className="w-full rounded-none overflow-hidden">
//           <div className="w-full overflow-auto h-[210px] scroll-container">
//             {transactionLoading ? (
//               <SkeletonTable />
//             ) : (
//               <Table className="min-w-[500px] scrollbar-thin scroll-container">
//                 <TableHeader>
//                   <TableRow className="text-white text-sm font-bold dm-sans border-0 hover:bg-transparent">
//                     <TableHead className="w-[100px] py-4">ID</TableHead>
//                     <TableHead className="py-4">Purchase Date</TableHead>
//                     <TableHead className="py-4">Plan</TableHead>
//                     <TableHead className="text-right py-4">Transaction</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {transactionData?.data.data.map((invoice: any) => (
//                     <TableRow key={invoice.transactionId} className="border-0 text-sm font-normal hover:bg-transparent">
//                       <TableCell className="py-4 pr-15">{invoice.transactionId}</TableCell>
//                       <TableCell className="py-4">{new Date(invoice.purchaseDate).toLocaleDateString()}</TableCell>
//                       <TableCell className="py-4">{invoice.planType}</TableCell>
//                       <TableCell className="text-right py-4">${invoice.transactionAmount}</TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Page;



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
              onContinue(numberOfUsers);
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
    "/company/products",
    getAllSubcriptionPlans
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
          interval: "month",
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
              const planType = product.name.split(" ")[0].toLowerCase() + "Plan";
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