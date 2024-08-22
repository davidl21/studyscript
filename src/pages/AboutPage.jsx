import React from "react";
import Navbar from "../components/Navbar";

const AboutPage = () => {
  return (
    <>
      <Navbar />
      <div className="max-w-7xl mt-6 lg:mt-20 mx-auto pt-20 px-6">
        <div className="flex flex-col justify-center text-center">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl text-center font-thin">
            About StudyScript
          </h1>
          <p className="mt-10 text-center text-neutral-400 font-light">
            Welcome to StudyScript! I'm a Computer Science student at UC
            Berkeley, and like many students, I wanted a tool that could help me
            better understand and engage with the material I learn in class.
            That's why I created StudyScript—a personalized AI tutor designed to
            assist with your studies. Whether you're looking to clarify complex
            concepts or need a study companion to guide you through challenging
            topics, StudyScript is here to help you learn more effectively and
            efficiently.
          </p>
          <p className="mt-10 text-center text-neutral-400 font-light">
            StudyScript is perfect for anyone who wants to: Clarify Complex
            Concepts: Struggling with a tough topic? StudyScript can break down
            difficult material into more digestible explanations, making it
            easier to understand even the most challenging subjects. Prepare for
            Exams: Whether it’s midterms, finals, or quizzes, StudyScript can
            help you review key concepts and practice problem-solving, ensuring
            you’re well-prepared for your assessments. Get Instant Feedback:
            Stuck on a problem? StudyScript provides instant feedback and
            guidance, helping you learn from your mistakes and improve your
            understanding in real-time. Study at Your Own Pace: Everyone learns
            differently. StudyScript adapts to your pace, allowing you to study
            efficiently without feeling rushed or left behind. StudyScript is
            ideal for students who want a tailored learning experience that
            complements their coursework. Whether you're a fellow Berkeley
            student, someone in a similar rigorous academic environment, or just
            looking to deepen your understanding of a subject, StudyScript is
            here to support your educational journey
          </p>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
