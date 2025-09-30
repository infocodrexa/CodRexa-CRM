import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("New socket connected:", socket.id);

    // Flexible joinRoom: handle string (user._id) or object ({type, id})
    socket.on("joinRoom", (room) => {
      let roomId = null;
      let type = "user";

      if (typeof room === "string") {
        roomId = room;
      } else if (room && room.id) {
        roomId = room.id;
        type = room.type || "user";
      }

      if (!roomId) return;
      socket.join(roomId);
      console.log(`Socket joined ${type} room: ${roomId}`);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};
