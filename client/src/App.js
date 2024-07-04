import React, { useState } from "react";
import Online from "./Component/Online";
import Offline from "./Component/Offline";

const App = () => {
  const [online, setOnline] = useState(false);
  const [offline, setOffline] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [firstplayer, setfirstplayer] = useState("");
  const [error, setError] = useState("");

  const handleOffline = () => {
    setOffline(true);
  };

  const takePlayerName = () => {
    return (
      <div className="fixed inset-0 flex justify-center items-center backdrop-blur-sm">
        <div className="bg-white rounded-lg shadow-md p-6 w-96">
          <div className="text-center mt-4">
            <input
              type="text"
              className="w-full p-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your name..."
              value={firstplayer}
              onChange={(e) => {
                setfirstplayer(e.target.value);
                setError("");
              }}
            />
            {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}
          </div>
          <div className="flex justify-center mt-6">
            <button
              className="px-6 py-2 bg-red-400 text-white rounded-md mr-4 hover:bg-red-600 focus:outline-none"
              onClick={() => {
                setModalOpen(false);
              }}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
              onClick={() => {
                if (firstplayer.trim() === "") {
                  setError("Please enter your name!");
                } else {
                  setModalOpen(false);
                  setOnline(true);
                }
              }}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center">
    <div className="font-extrabold text-center bg-emerald-300 text-blue-700 text-xl md:text-3xl lg:text-4xl py-4 px-8 rounded-lg mt-2">
        Welcome to Tic-Tac-Toe game
      </div>

      {!online && !offline && (
        <div className="flex flex-col items-center justify-center border-2 border-gray-300 w-60 h-60 mt-4 bg-pink-400 rounded-md">
          <button
            className="bg-green-400 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg mb-4 text-base"
            onClick={() => {
              setModalOpen(true);
            }}
          >
            Play Online
          </button>
          <button
            className="bg-blue-400 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg mb-2 text-base"
            onClick={handleOffline}
          >
            Play Offline
          </button>
        </div>
      )}

      {modalOpen && takePlayerName()}

      {offline && <Offline />}
      {online && <Online firstplayer={firstplayer} />}
    </div>
  );
};

export default App;
