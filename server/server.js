const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const alluser = {};
const allroom = [];

io.on("connection", (socket) => {
  alluser[socket.id] = {
    socket: socket,
    online: true,
    playing: false,
  };

  socket.on("request_to_play", (data) => {
    const currentuser = alluser[socket.id];
    currentuser.firstplayer = data.firstplayer;

    let opponentplayer;

    for (const key in alluser) {
      const user = alluser[key];
      if (user.online && !user.playing && socket.id !== key) {
        opponentplayer = user;
        break;
      }
    }

    if (opponentplayer) {
      allroom.push({
        player1: opponentplayer,
        player2: currentuser,
      });
      currentuser.playing = true;
      opponentplayer.playing = true;
      currentuser.socket.emit("OpponentFound", {
        secondplayer: opponentplayer.firstplayer,
        playingas: "circle",
      });

      opponentplayer.socket.emit("OpponentFound", {
        secondplayer: currentuser.firstplayer,
        playingas: "cross",
      });

      currentuser.socket.on("playerMoveFromClient", (data) => {
        opponentplayer.socket.emit("playerMoveFromServer", { ...data });
      });

      opponentplayer.socket.on("playerMoveFromClient", (data) => {
        currentuser.socket.emit("playerMoveFromServer", { ...data });
      });

      currentuser.socket.on("requestRematch", () => {
        opponentplayer.socket.emit("rematchRequested");
      });

      opponentplayer.socket.on("requestRematch", () => {
        currentuser.socket.emit("rematchRequested");
      });

      currentuser.socket.on("acceptRematch", () => {
        opponentplayer.socket.emit("rematchAccepted");
      });

      opponentplayer.socket.on("acceptRematch", () => {
        currentuser.socket.emit("rematchAccepted");
      });
    } else {
      currentuser.socket.emit("OpponentNotFound");
    }
  });

  socket.on("disconnect", () => {
    const currentuser = alluser[socket.id];
    currentuser.online = false;
    currentuser.playing = false;

    for (let i = 0; i < allroom.length; i++) {
      const { player1, player2 } = allroom[i];

      if (player1.socket.id === socket.id) {
        player2.socket.emit("opponentLeftMatch");
        break;
      }

      if (player2.socket.id === socket.id) {
        player1.socket.emit("opponentLeftMatch");
        break;
      }
    }
  });
});

httpServer.listen(5000, () => {
  console.log("Server is listening on port 5000");
});
