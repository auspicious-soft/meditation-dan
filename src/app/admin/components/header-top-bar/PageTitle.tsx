"use client";

import { usePathname } from "next/navigation";

const PageTitle = () => {
  const pathname = usePathname();

  // Get the last part of the URL
  const lastSegment = pathname.split("/").filter(Boolean).pop() || "Home";
  let pageTitle = lastSegment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
  // Check if the pathname matches the pattern for company detail
  const companyDetailPattern = /^\/admin\/company-lists\/company-detail\/[0-9a-fA-F]{24}$/;
  if (companyDetailPattern.test(pathname)) {
    pageTitle = "Company Detail";
  }
  const userprofileEditPattern =
       /^\/admin\/user-lists\/user-profile-edit\/[0-9a-zA-Z]{24}$/;
  if (userprofileEditPattern.test(pathname)) {
    pageTitle = "User Profile Edit";
  }
  const editAudioPattern = /^\/admin\/audio-files\/edit-audio\/[0-9a-fA-F]{24}$/
  if (editAudioPattern.test(pathname)) {
    pageTitle = "Audio Library";
  }
  const editCollectionPattern = /^\/admin\/all-collections\/edit-collection\/[0-9a-fA-F]{24}$/
  if (editCollectionPattern.test(pathname)) {
    pageTitle = "Audio Library";
  }
  const blockedUserPattern = /^\/admin\/blocked-users\/user-detail\/\d+$/;
  if (blockedUserPattern.test(pathname)) {
    pageTitle = "Blocked User Detail";
  }
  const allcollectionPattern = /^\/admin\/all-collections$/;
  if (allcollectionPattern.test(pathname)) {
    pageTitle = "Meditation Library";
  }
  const audioFilesPattern = /^\/admin\/audio-files$/;
  if (audioFilesPattern.test(pathname)) {
    pageTitle = "Audio Library";
  }
  const addNewAudioPattern = /^\/admin\/audio-files\/add-new-audio$/;
  if (addNewAudioPattern.test(pathname)) {
    pageTitle = "Audio Library";
  }

  const addNewCollectionPattern =
    /^\/admin\/all-collections\/add-new-collection$/;
  if (addNewCollectionPattern.test(pathname)) {
    pageTitle = "Audio Library";
  }

  const companyRequest = /^\/admin\/requests$/;
  if (companyRequest.test(pathname)) {
    pageTitle = "Join Requests";
  }

  const frequentlyAQ = /^\/admin\/faqs$/;
  if (frequentlyAQ.test(pathname)) {
    pageTitle = "Frequently Asked Questions";
  }

  const subscription = /^\/admin\/subscription$/;
  if (subscription.test(pathname)) {
    pageTitle = "Audio Library";
  }


  return <h1 className="text-2xl font-bold hidden md:block">{pageTitle}</h1>;
};

export default PageTitle;
