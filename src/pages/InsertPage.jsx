import React from "react";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";

const InsertPage = () => {
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center mt-6 lg:mt-20">
        <h1 className="mt-20 text-4xl sm:text-6xl lg:text-7xl text-center font-thin">
          Hello, Insert
        </h1>
        <p className="mt-5 text-center text-neutral-500 max-w-4xl">
          Welcome to StudyScript!
        </p>
        <div className="mt-20 flex items-center">
          <SearchBar />
        </div>
      </div>
    </>
  );
};

export default InsertPage;
