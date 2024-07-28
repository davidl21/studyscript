import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { YoutubeTranscript } from "youtube-transcript";

const getYoutubeTranscript = async (url) => {
  try {
    const response = await YoutubeTranscript.fetchTranscript(url);
    console.log(response);
  } catch (error) {
    console.error("Error fetching transcript:", error);
  }
};

const SearchBar = () => {
  const [inputValue, setInputValue] = useState("");

  const onClickHandler = () => {
    console.log("this is input url");
    console.log(inputValue);
    if (inputValue.trim()) {
      getYoutubeTranscript(inputValue);
    } else {
      console.log("Input is empty");
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
