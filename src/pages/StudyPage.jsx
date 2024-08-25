import React, { useState } from "react";
import YouTube from "react-youtube";
import axios from "axios";

const StudyPage = () => {
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const videoId = "KSAPc5NwLYU?si=VSzgpBduaLj97CsJ"; // Replace with your video ID

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput) return;

    try {
      const response = await axios.post("/qa", {
        question: chatInput,
      });

      const aiMessage = response.data.ai_message;

      setChatHistory([...chatHistory, { user: chatInput, bot: aiMessage }]);
      setChatInput("");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* youtube video */}
      <div className="flex-1 flex justify-center items-center bg-gray-900">
        <div className="w-full h-full max-w-4xl max-h-[50vh] flex justify-center items-center">
          <YouTube
            videoId={videoId}
            className="w-full h-full"
            opts={{
              height: "100%",
              width: "100%",
              playerVars: { autoplay: 0, controls: 1 },
            }}
          />
        </div>
      </div>

      {/* chatbot interface */}
      <div className="flex-1 p-4 bg-gray-800 overflow-auto">
        <div className="h-full flex flex-col justify-between">
          <div className="chat-history flex-1 overflow-y-auto bg-gray-700 p-4 rounded-lg">
            {chatHistory.map((chat, index) => (
              <div key={index} className="mb-4">
                <p className="text-blue-300">You: {chat.user}</p>
                <p className="text-green-300">Bot: {chat.bot}</p>
              </div>
            ))}
          </div>
          <form
            onSubmit={handleChatSubmit}
            className="mt-4 flex bg-gray-600 p-2 rounded-lg"
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 p-2 bg-gray-700 text-white rounded-l-lg outline-none"
            />
            <button
              type="submit"
              className="bg-purple-700 text-white p-2 rounded-r-lg"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudyPage;
