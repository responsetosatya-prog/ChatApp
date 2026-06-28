// frontend/src/socket/socket.js
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const socket = io(SOCKET_URL, {
    withCredentials: true,
    autoConnect: false,
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000
});

// Log connection status
socket.on("connect", () => {
    console.log("🔗 Socket connected:", socket.id);
});

socket.on("connect_error", (error) => {
    console.error("❌ Socket connection error:", error);
});

socket.on("disconnect", (reason) => {
    console.log("🔌 Socket disconnected:", reason);
});

export default socket;
