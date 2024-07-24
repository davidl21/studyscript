import React from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import BreakdownSection from "./components/BreakdownSection";

const App = () => {
  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto pt-20 px-6">
        <HeroSection />
        <BreakdownSection />
      </div>
    </>
  );
};

export default App;
