import { Server } from "socket.io";

/*
==========================================
Online Users
==========================================
*/

const onlineUsers = new Map();

/*
==========================================
Initialize Socket.IO
==========================================
*/

export function initializeSocket(server) {

    const io = new Server(server, {

        cors: {

            origin: process.env.FRONTEND_URL || "*",

            methods: ["GET", "POST"],

            credentials: true

        }

    });

    io.on("connection", (socket) => {

        console.log(`🟢 User Connected: ${socket.id}`);

        /*
        ==========================================
        User Online
        ==========================================
        */

        socket.on("user-online", (userId) => {

            onlineUsers.set(userId, socket.id);

            io.emit("online-users", [...onlineUsers.keys()]);

        });

        /*
        ==========================================
        Join Conversation
        ==========================================
        */

        socket.on("join-conversation", (conversationId) => {

            socket.join(`conversation-${conversationId}`);

        });

        /*
        ==========================================
        Send Message
        ==========================================
        */

        socket.on("send-message", (message) => {

            io.to(`conversation-${message.conversationId}`)
                .emit("receive-message", message);

        });

        /*
        ==========================================
        Typing Indicator
        ==========================================
        */

        socket.on("typing", (data) => {

            socket.to(`conversation-${data.conversationId}`)
                .emit("user-typing", data);

        });

        /*
        ==========================================
        Stop Typing
        ==========================================
        */

        socket.on("stop-typing", (data) => {

            socket.to(`conversation-${data.conversationId}`)
                .emit("user-stop-typing", data);

        });

        /*
        ==========================================
        Seen Messages
        ==========================================
        */

        socket.on("messages-seen", (data) => {

            socket.to(`conversation-${data.conversationId}`)
                .emit("messages-seen", data);

        });

        /*
        ==========================================
        Disconnect
        ==========================================
        */

        socket.on("disconnect", () => {

            for (const [userId, socketId] of onlineUsers.entries()) {

                if (socketId === socket.id) {

                    onlineUsers.delete(userId);

                    break;

                }

            }

            io.emit("online-users", [...onlineUsers.keys()]);

            console.log(`🔴 User Disconnected: ${socket.id}`);

        });

    });

    return io;

}
