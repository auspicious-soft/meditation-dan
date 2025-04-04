"use client";
import React from 'react';
import Head from 'next/head';
import Image from 'next/image'; // Import the Image component
import Wait from "../../../../public/images/waiting.gif"
import { useRouter } from 'next/navigation';
const RequestDeclinePage: React.FC = () => {
    const router = useRouter();
    const handleOk = () => {
        router.push('/');
    }
  return (
    <>
      <Head>
        <title>Request Decline</title>
        <meta name="description" content="Request decline page" />
      </Head>
      <div className="min-h-screen bg-[#1a2a44] flex flex-col items-center justify-center text-white text-center">
        <div className="mb-5">
          {/* Use next/image for the GIF */}
          <Image
            src={Wait}
            alt="Hourglass and person animation"
            width={200}
            height={200}
            className="object-contain"
          />
        </div>
        <h1 className="text-5xl font-bold mb-2">Opps!</h1>
        <p className="text-2xl mb-5 w-[40%]">Your Request Decline</p>
        <button onClick={handleOk} className="px-4 py-2 bg-[#1a3f70] text-white rounded-lg hover:bg-blue-700 transition">OK</button>
      </div>
    </>
  );
};

export default RequestDeclinePage;