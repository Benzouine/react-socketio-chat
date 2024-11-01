const cors = require("cors");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// Apply CORS middleware
app.use(cors({ origin: 'http://localhost:5173' })); // No trailing slash

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // No trailing slash here as well
    methods: ['GET', 'POST'],
  },
});

const nicknames = {};
const colors = {}; // Store colors for each user
const colorList = [
  "#002F5D",
  "#23511E",
  "#003737",
  "#8F4700",
  "#2A265F",
  "#C58C00",
  "#2C0000",
  "#C9190B",
  "#EC7A08",
  "#009596",
  "#06C",
  "#004B95",
  "#38812F",
  "#5752D1"
];
function getRandomColor() {
  return colorList[Math.floor(Math.random() * colorList.length)];
}

const connectedUsers = {};

io.on("connection", (socket) => {
  console.log("User connected");

  // Event to set nickname and assign color
  socket.on("set-nickname", (nickname) => {
    nicknames[socket.id] = nickname;
    colors[socket.id] = getRandomColor(); // Assign a random color
    connectedUsers[socket.id] = nickname; // Add user to connected users
    io.emit("user connected", connectedUsers); // Broadcast updated list of online users
  });



  // Event to handle chat messages
  socket.on("chat message", (msg) => {
    const displayName = nicknames[socket.id] || "Anonymous";
    const displayColor = colors[socket.id] || "#000000"; // Default color if none assigned
    const timestamp = new Date().toLocaleTimeString();

    io.emit("chat message", {
      message: msg,
      displayName,
      color: displayColor,
      timestamp,
    });
  });

  // Listen for typing event
  socket.on("typing", () => {
    const displayName = nicknames[socket.id] || "Anonymous";
    socket.broadcast.emit("typing", displayName);
  });

  // Listen for stop typing event
  socket.on("stop typing", () => {
    socket.broadcast.emit("stop typing");
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected");

    delete connectedUsers[socket.id]; // Remove user from connected users
    io.emit("user disconnected", connectedUsers); // Broadcast updated list
    delete nicknames[socket.id];
    delete colors[socket.id];
  });
});
console.log("Updated users:", connectedUsers);

const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
