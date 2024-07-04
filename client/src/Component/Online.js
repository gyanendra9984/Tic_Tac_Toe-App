import React, { useState, useEffect } from "react";
import { FaRegCircle } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { io } from "socket.io-client";


const App = ({ firstplayer }) => {
  const [game, setgame] = useState([
  [null, null, null],
  [null, null, null],
  [null, null, null],
]);
  const [currentplayer, setcurrentplayer] = useState("circle");
  const [finishedstate, setfinishedstate] = useState(false);
  const [finishedarraystate, setfinishedarraystate] = useState([]);
  const [socket, setsocket] = useState(null);
  const [secondplayer, setsecondplayer] = useState(null);
  const [playingas, setplayingas] = useState(null);
  const [rematchrequested, setrematchrequested] = useState(false);
  const [opponentrematchrequested, setopponentrematchrequested] = useState(false);
  const [win, setwin] = useState(0);
  const [lose, setlose] = useState(0);
  const [draw, setdraw] = useState(0);

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

  const handleRematch = () => {
    if (opponentrematchrequested) {
       socket.emit("acceptRematch");
       setrematchrequested(false);
       setopponentrematchrequested(false);
    } else {
      socket.emit("requestRematch");
      setrematchrequested(true);
    }
    setgame([
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ]);

    setfinishedstate(false);
    setcurrentplayer("circle");
    setfinishedarraystate([]);
  };
  
useEffect(() => {
  console.log(rematchrequested, "rematchrequested");
  console.log(opponentrematchrequested, "opponentrematchrequested");
}, [rematchrequested, opponentrematchrequested]);
  
  useEffect(() => {
    const winner = checkWinner();
    if (winner) {
      setfinishedstate(winner);
      if (winner === playingas) {
        setwin(win + 1);
      } else if (winner === "draw") {
        setdraw(draw + 1);
      } else {
        setlose(lose + 1);
      }
    }
  }, [game]);

  useEffect(() => {
    const newSocket = io("https://tic-tac-toe-app-backend.onrender.com", {
      autoConnect: true,
    });

    newSocket.emit("request_to_play", { firstplayer: firstplayer });

    newSocket.on("opponentLeftMatch", () => {
      setfinishedstate("opponentLeftMatch");
    });

    newSocket.on("playerMoveFromServer", (data) => {
      const id = data.state.id;
      setgame((prevState) => {
        let newState = [...prevState];
        const rowIndex = Math.floor(id / 3);
        const colIndex = id % 3;
        newState[rowIndex][colIndex] = data.state.sign;
        return newState;
      });
      setcurrentplayer(data.state.sign === "circle" ? "cross" : "circle");
    });

    newSocket.on("OpponentNotFound", () => {
      setsecondplayer(false);
    });

    newSocket.on("OpponentFound", (data) => {
      setplayingas(data.playingas);
      setsecondplayer(data.secondplayer);
    });

    newSocket.on("rematchAccepted", () => {
      setrematchrequested(false);
      setopponentrematchrequested(false);
    });

    newSocket.on("rematchRequested", () => {
      setopponentrematchrequested(true);
    });

    setsocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [firstplayer]);

  const Square = ({ id, currentElement }) => {
    const clickOnSquare = () => {
      if (
        playingas !== currentplayer ||
        finishedstate ||
        currentElement === "circle" ||
        currentElement === "cross"
      ) {
        return;
      }

      const mycurrentplayer = currentplayer;
      socket.emit("playerMoveFromClient", {
        state: { id, sign: mycurrentplayer },
      });

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
      {secondplayer === null || secondplayer === false ? (
        <div className="text-center text-xl text-red-900 mt-5">Waiting for opponent...</div>
      ) : (
        <>
          <div className="flex flex-wrap justify-between w-11/12 max-w-md mb-4 p-1 bg-gray-100 rounded-lg shadow-lg">
            <div
              className={`w-3/6 p-1 text-center bg-blue-400 rounded-sm overflow-hidden text-ellipsis whitespace-nowrap ${
                currentplayer === playingas ? "border-r-4 border-black" : ""
              }`}
            >
              <strong>{firstplayer}</strong>
            </div>
            <div className="w-2/6 p-1 text-center bg-blue-400 rounded-sm ">
              <strong>Win: {win}</strong>
            </div>
            <div
              className={`w-3/6 p-1 text-center bg-orange-500 rounded-sm mt-1 overflow-hidden text-ellipsis whitespace-nowrap ${
                currentplayer !== playingas ? "border-r-4 border-black" : ""
              }`}
            >
              <strong>{secondplayer}</strong>
            </div>
            <div className="w-2/6 p-1 text-center bg-orange-500 rounded-sm mt-1">
              <strong>Win: {lose}</strong>
            </div>
            <div className="w-full p-1 text-center bg-green-500 rounded-sm mt-1">
              <strong>Draws: {draw}</strong>
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
          {finishedstate &&
            finishedstate !== "opponentLeftMatch" &&
            finishedstate !== "draw" && (
              <div className="flex items-center space-x-4 text-red-900 mt-4">
                <h3>
                  {finishedstate === playingas
                    ? "You won!"
                    : `You lose!`}
                </h3>
                <button
                  onClick={handleRematch}
                  className="mt-1 px-4 py-2 bg-blue-900 text-white rounded-lg"
                >
                  {opponentrematchrequested
                    ? "Accept Rematch"
                    : "Request Rematch"}
                </button>
              </div>
            )}
          {finishedstate === "draw" && (
              <div className="flex items-center space-x-4 text-red-900">
                <h3>It's a Draw</h3>
                <button
                  onClick={handleRematch}
                  className="mt-4 px-4 py-2 bg-blue-900 text-white rounded-lg"
                >
                  {opponentrematchrequested
                    ? "Accept Rematch"
                    : "Request Rematch"}
                </button>
              </div>
            )}
          {finishedstate && finishedstate === "opponentLeftMatch" && (
            <div className="flex items-center space-x-4 text-red-900">
              <h3>Your opponent has left the match.</h3>
            </div>
          )}

          {rematchrequested && !opponentrematchrequested && (
            <div className="text-center text-xl mt-4 text-red-900">
              Waiting for opponent to accept rematch...
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default App;
