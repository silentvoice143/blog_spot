// socket.js
import { Server } from "socket.io";

const connectedUsers: any = {}; // In-memory store

export let io: any;

export const initSocket = (server: any) => {
  console.log("inside socket");
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // or your frontend origin
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket: any) => {
    console.log("🔌 Socket connected:", socket.id);

    socket.on("register", (userId: any) => {
      connectedUsers[userId] = socket.id;
      console.log(`✅ User ${userId} registered on socket`);
    });

    socket.on("disconnect", () => {
      for (const [userId, sockId] of Object.entries(connectedUsers)) {
        if (sockId === socket.id) {
          delete connectedUsers[userId];
          console.log(`❌ User ${userId} disconnected`);
        }
      }
    });
  });
};

// Utility to send a notification
export const sendNotification = async ({
  toUserId,
  notification,
}: {
  toUserId: any;
  notification: any;
}) => {
  const socketId = connectedUsers[toUserId];
  if (socketId && io) {
    io.to(socketId).emit("notification", notification);
  }
};
