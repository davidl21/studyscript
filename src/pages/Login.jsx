import React, { useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/login", {
        username: username,
      });

      if (response.status === 200) {
        sessionStorage.setItem("user_id", response.data.user_id);

        navigate("/search");
      } else {
        console.log("Login failed");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center mt-6 lg:mt-20-20 text-center">
        <h1 className="mt-20 text-4xl sm:text-6xl lg:text-7xl text-center font-thin">
          Login to StudyScript!
        </h1>
        <form onSubmit={handleLogin} className="className=w-[750px] relative">
          <div className="flex flex-col items-center mt-10 relative">
            <input
              type="text"
              id="username"
              placeholder=" Username"
              className="w-96 p-2 rounded-full bg-gradient-to-r from-zinc-800 to-zinc-900 border border-neutral-700/80"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="mt-10 p-2 rounded-md bg-gradient-to-r from-purple-500 to-purple-800"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;
