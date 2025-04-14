import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
const socket = io(process.env.VITE_BASE_URL, {
  transports: ["websocket"],
  withCredentials: true,
});

export default socket;
