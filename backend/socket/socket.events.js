const SOCKET_EVENTS = {
    CONNECTION: "connection",
    DISCONNECT: "disconnect",
    USER_ONLINE: "user-online",
    ONLINE_USERS: "online-users",
    JOIN_CONVERSATION: "join-conversation",
    SEND_MESSAGE: "send-message",
    RECEIVE_MESSAGE: "receive-message",
    TYPING: "typing",
    STOP_TYPING: "stop-typing",
    USER_TYPING: "user-typing",
    USER_STOP_TYPING: "user-stop-typing",
    MESSAGES_SEEN: "messages-seen",
};

export default SOCKET_EVENTS;
