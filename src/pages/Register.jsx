import React, { useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [registered, setRegistered] = useState(false);

  const findUser = async (email) => {
    try {
      console.log("hi")
      const response = await axios.get("http://localhost:3000/register", {params:{
        email: email
      }})
      console.log(response.data);
      return (response.data);
    } catch (error) {
      console.log(error);
      return (error);
    }
  }

  const handleSubmit = async (e) => {
    try {
      const config = {
        method: "post",
        url: "http://localhost:3000/register",
        params: {
          user_id: username,
          email: email,
          password: password
        }
      }
      const registerResponse = await axios(config);
      console.log("User registered:", registerResponse.data);
      setRegistered(true);
    } catch (error) {
      console.log("Issue making API call and registering user", error)
    }
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center mt-6 lg:mt-20-20 text-center">
        <h1 className="mt-20 text-4xl sm:text-6xl lg:text-7xl text-center font-thin">
          Join Now!
        </h1>
        <form onSubmit={(e) => handleSubmit(e)} className="w-[750px] relative">
          <div className="flex flex-col items-center mt-10 relative">
            <input
              type="username"
              placeholder=" Username"
              onChange={(e) => setUsername(e.target.value)}
              className="w-96 p-2 rounded-full bg-gradient-to-r from-zinc-800 to-zinc-900 border border-neutral-700/80"
            />
            <input
              type="email"
              placeholder=" Email"
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-96 p-2 rounded-full bg-gradient-to-r from-zinc-800 to-zinc-900 border border-neutral-700/80"
            />
            <input
              type="password"
              placeholder=" Password"
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-96 p-2 rounded-full bg-gradient-to-r from-zinc-800 to-zinc-900 border border-neutral-700/80"
            />
          </div>
          <button type="submit" className="mt-10 p-2 rounded-md bg-gradient-to-r from-purple-500 to-purple-800">
            Register
          </button>
        </form>
      </div>
    </>
  );
};

export default Register;
