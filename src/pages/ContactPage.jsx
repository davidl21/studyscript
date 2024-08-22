import React from "react";
import Navbar from "../components/Navbar";

const ContactPage = () => {
  return (
    <>
      <Navbar />
      <div className="max-w-7xl mt-6 lg:mt-20 mx-auto pt-20 px-6">
        <div className="flex flex-col justify-center text-center">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl text-center font-thin">
            Connect with Me!
          </h1>
          <div className="flex justify-center my-10">
            <a
              href="https://linkedin.com/in/davidl21"
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 mx-3 border rounded-md hover:bg-purple-800 hover:text-white transition-colors duration-300"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
