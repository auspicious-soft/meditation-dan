
"use client";
import { useState } from "react";
import TermsPage from './terms';
import MiscellaneousHeader from "./miscHeader";

const AllTerms = () => {
  const [selectedTab, setSelectedTab] = useState("Privacy Policy");
  const [selectedGame, setSelectedGame] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  return (
    <div className="">
      {/* Header with Tabs & Filters */}
      <div>
        <MiscellaneousHeader selectedTab={selectedTab} setSelectedTab={setSelectedTab} selectedGame={selectedGame} setSelectedGame={setSelectedGame} selectedCity={selectedCity} setSelectedCity={setSelectedCity} setSelectedDate={setSelectedDate} selectedDate={selectedDate} />
      </div>
      {/* Render Content Based on Selected Tab */}
      <div className="mt-6 mb-6">
        {selectedTab === "Privacy Policy" && <TermsPage name="privacyPolicy"  />}
        {selectedTab === "Terms & Conditions" && <TermsPage name="termsAndConditions" />}
      </div>
    </div>
  );
};

export default AllTerms;