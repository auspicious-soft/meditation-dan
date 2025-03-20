import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import React from 'react';

const SearchBar = () => {
    return (
      <div className="relative bg-[#0b132b] !rounded-lg">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-white" />
        <Input
          type="text"
          placeholder="Search..."
          className="pl-8 placeholder-white bg-transparent dm-sans border-0 !rounded-lg !text-sm font-normal !text-white w-full max-w-[214px] md:min-w-[214px] h-10"      
        />
      </div>
    );
}

export default SearchBar;
