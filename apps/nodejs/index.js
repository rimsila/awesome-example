const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

io.on("connection", (socket) => {
  console.log(`Socket ${socket.id} connected`);

  socket.on("joinRoom", (roomId) => {
    console.log(`Socket ${socket.id} joined room ${roomId}`);
    socket.join(roomId);
  });

  socket.on("chatMessage", (data) => {
    console.log(
      `Received message from ${socket.id} in room ${data.roomId}: ${data.message}`
    );
    io.to(data.roomId).emit("chatMessage", `${socket.id}: ${data.message}`);
  });

  socket.on("disconnect", () => {
    console.log(`Socket ${socket.id} disconnected`);
  });
});

const PORT = process.env.PORT || 4000;
http.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
