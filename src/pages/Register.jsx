import React, { useState } from "react";
import Navbar from "../components/Navbar";

const Register = () => {
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center mt-6 lg:mt-20-20 text-center">
        <h1 className="mt-20 text-4xl sm:text-6xl lg:text-7xl text-center font-thin">
          Join Now!
        </h1>
        <form className="className=w-[750px] relative">
          <div className="flex flex-col items-center mt-10 relative">
            <input
              type="username"
              placeholder=" Username"
              className="w-96 p-2 rounded-full bg-gradient-to-r from-zinc-800 to-zinc-900 border border-neutral-700/80"
            />
            <input
              type="email"
              placeholder=" Email"
              className="mt-2 w-96 p-2 rounded-full bg-gradient-to-r from-zinc-800 to-zinc-900 border border-neutral-700/80"
            />
            <input
              type="password"
              placeholder=" Password"
              className="mt-2 w-96 p-2 rounded-full bg-gradient-to-r from-zinc-800 to-zinc-900 border border-neutral-700/80"
            />
          </div>
        </form>
        <button className="mt-10 p-2 rounded-md bg-gradient-to-r from-purple-500 to-purple-800">
          Register
        </button>
      </div>
    </>
  );
};

export default Register;
