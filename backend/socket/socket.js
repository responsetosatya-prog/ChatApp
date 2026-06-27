import { Server } from "socket.io";
import SOCKET_EVENTS from "./socket.events.js";

/*
==========================================
Online Users Store
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

    io.on(SOCKET_EVENTS.CONNECTION, (socket) => {

        console.log(`🟢 User Connected: ${socket.id}`);

        /*
        ==========================================
        User Online
        ==========================================
        */

        socket.on(SOCKET_EVENTS.USER_ONLINE, (userId) => {

            onlineUsers.set(userId, socket.id);

            io.emit(
                SOCKET_EVENTS.ONLINE_USERS,
                [...onlineUsers.keys()]
            );

        });

        /*
        ==========================================
        Join Conversation Room
        ==========================================
        */

        socket.on(SOCKET_EVENTS.JOIN_CONVERSATION, (conversationId) => {

            socket.join(`conversation-${conversationId}`);

        });

        /*
        ==========================================
        Send Message
        ==========================================
        */

        socket.on(SOCKET_EVENTS.SEND_MESSAGE, (message) => {

            io.to(`conversation-${message.conversationId}`)
                .emit(
                    SOCKET_EVENTS.RECEIVE_MESSAGE,
                    message
                );

        });

        /*
        ==========================================
        Typing Indicator
        ==========================================
        */

        socket.on(SOCKET_EVENTS.TYPING, (data) => {

            socket.to(`conversation-${data.conversationId}`)
                .emit(
                    SOCKET_EVENTS.USER_TYPING,
                    data
                );

        });

        /*
        ==========================================
        Stop Typing
        ==========================================
        */

        socket.on(SOCKET_EVENTS.STOP_TYPING, (data) => {

            socket.to(`conversation-${data.conversationId}`)
                .emit(
                    SOCKET_EVENTS.USER_STOP_TYPING,
                    data
                );

        });

        /*
        ==========================================
        Seen Messages
        ==========================================
        */

        socket.on(SOCKET_EVENTS.MESSAGES_SEEN, (data) => {

            socket.to(`conversation-${data.conversationId}`)
                .emit(
                    SOCKET_EVENTS.MESSAGES_SEEN,
                    data
                );

        });

        /*
        ==========================================
        Disconnect
        ==========================================
        */

        socket.on(SOCKET_EVENTS.DISCONNECT, () => {

            for (const [userId, socketId] of onlineUsers.entries()) {

                if (socketId === socket.id) {

                    onlineUsers.delete(userId);
                    break;

                }

            }

            io.emit(
                SOCKET_EVENTS.ONLINE_USERS,
                [...onlineUsers.keys()]
            );

            console.log(`🔴 User Disconnected: ${socket.id}`);

        });

    });

    return io;

}
