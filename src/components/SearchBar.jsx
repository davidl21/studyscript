import { useState } from "react";
import { FaSearch } from "react-icons/fa";

const SearchBar = () => {
  return (
    <form className="w-[750px] relative">
      <div className="relative">
        <input
          type="search"
          placeholder="Enter YouTube URL..."
          className="w-full p-4 rounded-full bg-gradient-to-r from-zinc-800 to-zinc-900 border border-neutral-700/80"
        />
        <button className="absolute right-1 top-1/2 -translate-y-1/2 p-4 bg-gradient-to-r from-purple-500 to-purple-800 rounded-full">
          <FaSearch />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
