import { useEffect, useState } from "react";
import socket from "../socket"; // make sure the path matches your project

const useRegisterSocket = (token: string | null, userId: string | null) => {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    if (!token || !userId) return;

    function onConnect() {
      setIsConnected(true);
      console.log("✅ Socket connected");
      socket.emit("register", userId);
      console.log(`🧾 Registered user ${userId}`);
    }

    function onDisconnect() {
      setIsConnected(false);
      console.log("❌ Socket disconnected");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    // If already connected (hot reload case), register immediately
    if (socket.connected) {
      onConnect();
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [token, userId]);

  return { isConnected };
};

export default useRegisterSocket;
