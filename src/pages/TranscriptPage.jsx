import React from "react";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";

const TranscriptPage = () => {
  return (
    <>
      <Navbar />
      <div className="flex flex-col justify-center items-center text-center mt-40">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl text-center font-thin mb-20">
          Input your Lecture!
        </h1>
        <SearchBar />
      </div>
    </>
  );
};

export default TranscriptPage;
