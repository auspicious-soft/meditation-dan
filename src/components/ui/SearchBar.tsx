
import React, { useEffect, useState } from 'react';
import {  Search } from "lucide-react";
interface SearchBarProps {
    setQuery: React.Dispatch<React.SetStateAction<string>>;
    query?: string;
}

const SearchBar = (props: SearchBarProps) => {
    const { setQuery, query = '' } = props;
    const [inputValue, setInputValue] = useState(query);
    useEffect(() => {
        const handler = setTimeout(() => {
            setQuery(inputValue); // Pass raw search term, no "description=" prefix
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [inputValue, setQuery]);

    // Handle input change and prevent space as the first character
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        // Prevent space as the first character
        if (value.length > 0 && value[0] === ' ' && inputValue === '') {
            return; // Do nothing if trying to start with a space
        }
        setInputValue(value); // Update local state
    };

    // Sync inputValue with query prop when it changes from parent
    useEffect(() => {
        setInputValue(query);
    }, [query]);

    return (
        <div className='w-[248px]'>
            <label htmlFor="" className='relative flex w-full'>
                <input
                    type="search"
                    value={inputValue}
                    onChange={handleInputChange}
                    name=""
                    id=""
                    placeholder="Search..."
                    className='!h-[40px] placeholder:text-white w-full px-5 pl-[40px] focus-visible:outline-none bg-[#0b132b] rounded-[39px] py-2 text-white'
                />
                <span className='absolute left-[15px] top-[13px]'>
                    <Search height={15}/>
                </span>
            </label>
        </div>
    );
};

export default SearchBar;