import React from "react";
import Navbar from "../components/Navbar";

const HowItWorksPage = () => {
  return (
    <>
      <Navbar />
      <div className="max-w-7xl mt-6 lg:mt-20 mx-auto pt-20 px-6">
        <div className="flex flex-col justify-center text-center">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl text-center font-thin">
            Built with AI
          </h1>
          <p className="mt-10 text-neutral-500 font-light">
            Hi! My name is David Liu, and I built this project with React and
            Tailwind on the frontend, and Node and Express on the backend.
          </p>
          <p className="mt-10 text-neutral-500 font-light">
            This is an open source project. Feel free to check out the Github or
            contact me for any questions!
          </p>
          <div className="flex justify-center my-5">
            <a
              href="https://github.com/davidl21/studyscript"
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 mx-3 border rounded-md hover:bg-purple-800 hover:text-white transition-colors duration-300"
            >
              GitHub Repo
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default HowItWorksPage;
