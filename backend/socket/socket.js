import { Server } from "socket.io";
import pool from "../config/database.js";
import SOCKET_EVENTS from "./socket.events.js";

const onlineUsers = new Map();

export function initializeSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL || "http://localhost:3000",
            methods: ["GET", "POST"],
            credentials: true,
        },
        transports: ["websocket", "polling"],
        pingTimeout: 60000,
        pingInterval: 25000,
    });

    io.on(SOCKET_EVENTS.CONNECTION, (socket) => {
        console.log(`🟢 User Connected: ${socket.id}`);
        let currentUserId = null;

        socket.on(SOCKET_EVENTS.USER_ONLINE, async (userId) => {
            currentUserId = userId;
            onlineUsers.set(userId, socket.id);
            await pool.query("UPDATE users SET is_online = TRUE, last_seen = NOW() WHERE id = $1", [userId]);
            io.emit(SOCKET_EVENTS.ONLINE_USERS, [...onlineUsers.keys()]);
            console.log(`👤 User ${userId} is online (${onlineUsers.size} users online)`);
        });

        socket.on(SOCKET_EVENTS.JOIN_CONVERSATION, (conversationId) => {
            const room = `conversation-${conversationId}`;
            socket.join(room);
            console.log(`📨 User joined room: ${room}`);
        });

        socket.on(SOCKET_EVENTS.SEND_MESSAGE, async (message) => {
            console.log(`📤 Message sent:`, message);
            const room = `conversation-${message.conversation_id || message.receiver_id}`;
            io.to(room).emit(SOCKET_EVENTS.RECEIVE_MESSAGE, message);

            const receiverSocketId = onlineUsers.get(message.receiver_id);
            if (receiverSocketId && receiverSocketId !== socket.id) {
                io.to(receiverSocketId).emit(SOCKET_EVENTS.RECEIVE_MESSAGE, message);
            }
        });

        socket.on(SOCKET_EVENTS.TYPING, (data) => {
            const room = `conversation-${data.conversationId}`;
            socket.to(room).emit(SOCKET_EVENTS.USER_TYPING, {
                userId: currentUserId,
                conversationId: data.conversationId,
            });
        });

        socket.on(SOCKET_EVENTS.STOP_TYPING, (data) => {
            const room = `conversation-${data.conversationId}`;
            socket.to(room).emit(SOCKET_EVENTS.USER_STOP_TYPING, {
                userId: currentUserId,
                conversationId: data.conversationId,
            });
        });

        socket.on(SOCKET_EVENTS.DISCONNECT, async () => {
            if (currentUserId) {
                onlineUsers.delete(currentUserId);
                await pool.query("UPDATE users SET is_online = FALSE, last_seen = NOW() WHERE id = $1", [currentUserId]);
                io.emit(SOCKET_EVENTS.ONLINE_USERS, [...onlineUsers.keys()]);
                console.log(`👤 User ${currentUserId} went offline (${onlineUsers.size} users online)`);
            }
            console.log(`🔴 User Disconnected: ${socket.id}`);
        });
    });

    return io;
}
