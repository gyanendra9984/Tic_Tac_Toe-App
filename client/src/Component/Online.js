import React, { useState} from "react";
import { FaRegCircle } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
const renderFrom = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

const App = ({ firstplayer }) => {
  const [gameState, setGameState] = useState(renderFrom);
  const [currentPlayer, setCurrentPlayer] = useState("circle");
  const [finishedState, setFinishedState] = useState(false);
  const [finishedArrayState, setFinishedArrayState] = useState([]);
  const [playOnline, setPlayOnline] = useState(false);
  const [socket, setSocket] = useState(null);
  const [playerName, setPlayerName] = useState("");
  const [opponentName, setOpponentName] = useState(null);
  const [playingAs, setPlayingAs] = useState(null);

  const Square = ({ id, currentElement }) => {
    const clickOnSquare = () => {
      // if (playingAs !== currentPlayer) {
      //   return;
      // }

      // if (finishedState) {
      //   return;
      // }
      const myCurrentPlayer = currentPlayer;
      //   socket.emit("playerMoveFromClient", {
      //     state: {
      //       id,
      //       sign: myCurrentPlayer,
      //     },
      //   });

      setCurrentPlayer(currentPlayer === "circle" ? "cross" : "circle");
      console.log(gameState);
      console.log(id);
      setGameState((prevState) => {
        let newState = [...prevState];
        const rowIndex = Math.floor(id / 3);
        const colIndex = id % 3;
        newState[rowIndex][colIndex] = myCurrentPlayer;
        return newState;
      });
    };
    return (
      <div
        onClick={clickOnSquare}
        className={`w-24 h-24 flex items-center justify-center border cursor-pointer text-6xl bg-amber-500 rounded-sm`}
      >
        {currentElement === "circle" ? (
          <FaRegCircle />
        ) : currentElement === "cross" ? (
          <RxCross2 size={80} />
        ) : null}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center mt-4 bg-transparent">
      <div class="flex justify-between w-full max-w-md mb-4">
        <div class="w-1/3 p-2 text-center bg-green-200 rounded-sm">
          Your Wins: 0
        </div>
        <div class="w-1/3 p-2 text-center bg-red-200 rounded-sm">
          Opponent Wins: 0
        </div>
        <div class="w-1/3 p-2 text-center bg-yellow-200 rounded-sm">
          Draws: 0
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1">
        {gameState.map((arr, rowIndex) =>
          arr.map((e, colIndex) => {
            return (
              <Square
                id={rowIndex * 3 + colIndex}
                key={rowIndex * 3 + colIndex}
                currentElement={e}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default App;
