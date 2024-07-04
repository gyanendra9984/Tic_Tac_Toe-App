import React, { useState, useEffect } from "react";
import { FaRegCircle } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

const App = () => {
  const [game, setgame] = useState([
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ]);
  const [currentplayer, setcurrentplayer] = useState("circle");
  const [finishedstate, setfinishedstate] = useState(false);
  const [finishedarraystate, setfinishedarraystate] = useState([]);
  

  const checkWinner = () => {
    for (let row = 0; row < game.length; row++) {
      if (
        game[row][0] === game[row][1] &&
        game[row][1] === game[row][2] &&
        game[row][0] !== null
      ) {
        setfinishedarraystate([row * 3, row * 3 + 1, row * 3 + 2]);
        return game[row][0];
      }
    }
    for (let col = 0; col < game.length; col++) {
      if (
        game[0][col] === game[1][col] &&
        game[1][col] === game[2][col] &&
        game[0][col] !== null
      ) {
        setfinishedarraystate([col, 3 + col, 6 + col]);
        return game[0][col];
      }
    }
    if (
      game[0][0] === game[1][1] &&
      game[1][1] === game[2][2] &&
      game[0][0] !== null
    ) {
      setfinishedarraystate([0, 4, 8]);
      return game[0][0];
    }

    if (
      game[0][2] === game[1][1] &&
      game[1][1] === game[2][0] &&
      game[0][2] !== null
    ) {
      setfinishedarraystate([2, 4, 6]);
      return game[0][2];
    }

    const isDrawMatch = game
      .flat()
      .every((e) => e === "circle" || e === "cross");

    if (isDrawMatch) return "draw";

    return null;
  };

  
  useEffect(() => {
    const winner = checkWinner();
    if (winner) {
      setfinishedstate(winner);
    }
  }, [game]);

  const handleRematch = () => {
    setgame([
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ]);
    setfinishedstate(false);
    setfinishedarraystate([]);
  };
  const Square = ({ id, currentElement }) => {
    const clickOnSquare = () => {
       if (finishedstate || currentElement !== null) {
         return;
       }
      const mycurrentplayer = currentplayer;
      setcurrentplayer(currentplayer === "circle" ? "cross" : "circle");
      setgame((prevState) => {
        let newState = [...prevState];
        const rowIndex = Math.floor(id / 3);
        const colIndex = id % 3;
        newState[rowIndex][colIndex] = mycurrentplayer;
        return newState;
      });
    };

    return (
      <div
        onClick={clickOnSquare}
        className={`w-24 h-24 flex items-center justify-center border cursor-pointer text-6xl rounded-md ${
          finishedarraystate.includes(id) ? " bg-rose-600" : " bg-red-400"
        }`}
      >
        {currentElement === "circle" ? (
          <FaRegCircle className="text-blue-950" />
        ) : currentElement === "cross" ? (
          <RxCross2 size={80} className="text-blue-950" />
        ) : null}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center mt-4 bg-transparent">
      <div className="flex justify-center mb-4">
        <div
          className={`px-4 py-2 text-xl bg-orange-500 rounded-lg mr-4 text-blue-900 ${
            currentplayer === "circle" ? "underline" : ""
          }`}
        >
          Circle
        </div>
        <div
          className={`px-4 py-2 text-xl bg-green-500 rounded-lg ml-4 text-blue-900 ${
            currentplayer === "cross" ? "underline" : ""
          }`}
        >
          Cross
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1">
        {game.map((arr, rowIndex) =>
          arr.map((e, colIndex) => (
            <Square
              id={rowIndex * 3 + colIndex}
              key={rowIndex * 3 + colIndex}
              currentElement={e}
            />
          ))
        )}
      </div>
      {finishedstate && finishedstate !== "draw" && (
        <div className="flex items-center space-x-4 text-white mt-4">
          <h3 className="text-red-900 mt-4 font-bold text-2xl">
            {finishedstate === "circle" ? "Circle won!" : `Cross won!`}
          </h3>
          <button
            onClick={handleRematch}
            className="mt-4 px-4 py-2 bg-blue-900 text-white rounded-lg"
          >
            Rematch
          </button>
        </div>
      )}
      {finishedstate === "draw" && (
        <div className="flex items-center space-x-4 text-white mt-4">
          <h3 className="text-red-900 mt-4 font-bold text-2xl">It's a Draw</h3>
          <button
            onClick={handleRematch}
            className="mt-4 px-4 py-2 bg-blue-900 text-white rounded-lg"
          >
            Rematch
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
