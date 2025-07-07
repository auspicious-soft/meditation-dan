"use client";
import { useState, useRef, useEffect } from "react";
import useSWR from "swr";
import { getAllCities } from "@/services/admin-services";

const tabs = ["Privacy Policy", "Terms & Conditions"];
const games = ["All", "Padel", "Pickleball"];

interface MatchesHeaderProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  selectedGame: string,
  setSelectedGame: any,
  selectedCity: string,
  setSelectedCity: any,
  selectedDate: string,
  setSelectedDate: any
}

const MiscellaneousHeader: React.FC<MatchesHeaderProps> = ({ selectedTab, setSelectedTab, setSelectedGame, selectedGame, selectedCity, setSelectedCity, selectedDate, setSelectedDate }) => {
  const [gameDropdown, setGameDropdown] = useState(false);
  const [cityDropdown, setCityDropdown] = useState(false);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const gameDropdownRef = useRef<HTMLDivElement>(null);
  const cityDropdownRef = useRef<HTMLDivElement>(null);
  // const {data, mutate,isLoading} = useSWR(`/admin/settings?type=${selectedTab}`,getAllCities)
  // const cities = data?.data?.data || [];
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (gameDropdownRef.current && !gameDropdownRef.current.contains(event.target as Node)) {
        setGameDropdown(false);
      }
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target as Node)) {
        setCityDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleGameChange = (value: string) => {
    setSelectedGame(value === "All" ? null : value);
    setGameDropdown(false);
  };

  const handleCityChange = (value: string) => {
    setSelectedCity(value === "All" ? null : value);
    setCityDropdown(false);
  };

  return (
    <div className="space-y-[10px] relative">

      <div className="flex w-[65%] justify-between flex-wrap gap-[15px]">
        {/* Tabs */}
        <div className=" gap-2  justify-start items-start inline-flex">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`h-16 px-5 py-3  justify-center items-center inline-flex ${selectedTab === tab ? "bg-[#1A3F70] text-white" : "text-white bg-[#1B2236] hover:bg-[#1B2236]"} transition-colors duration-300`}
              onClick={() => setSelectedTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
    
      </div>
    </div>
  );
};

export default MiscellaneousHeader;