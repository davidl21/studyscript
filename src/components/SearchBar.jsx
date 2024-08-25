import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { YoutubeTranscript } from "youtube-transcript";
import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";
import axios from "axios";

const SearchBar = () => {
  const [inputValue, setInputValue] = useState("");

  const onClickHandler = async () => {
    try {
      console.log("test1");
      const response = await axios.post(
        "http://localhost:3000/get-transcript",
        {
          url: inputValue,
        }
      );
      console.log("Backend response:", response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onClickHandler();
      }}
      className="w-[750px] relative"
    >
      <div className="relative">
        <input
          type="search"
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter YouTube URL..."
          className="w-full p-4 rounded-full bg-gradient-to-r from-zinc-800 to-zinc-900 border border-neutral-700/80"
        />
        <button
          type="submit"
          className="absolute right-1 top-1/2 -translate-y-1/2 p-4 bg-gradient-to-r from-purple-500 to-purple-800 rounded-full"
        >
          <FaSearch />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
