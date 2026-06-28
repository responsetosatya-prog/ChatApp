// frontend/src/pages/Chat.jsx - Updated
import { useEffect, useState, useRef } from "react";
import API from "../services/api";
import socket from "../socket/socket";
import ChatHeader from "../components/ChatHeader";

function Chat() {
    const [conversations, setConversations] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState([]);
    
    const messagesEndRef = useRef(null);
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;

    if (!user) {
        return <h2 style={{ color: "white" }}>User not found. Please log in again.</h2>;
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Load conversations
    const loadConversations = async () => {
        try {
            const res = await API.get("/conversations");
            setConversations(res.data.conversations || []);
        } catch (err) {
            console.error("Error loading conversations:", err);
        }
    };

    // Load messages for selected user
    const loadMessages = async (otherUser) => {
        try {
            setLoading(true);
            const res = await API.get(`/chat/${otherUser.id}`);
            
            const unique = Array.from(
                new Map(res.data.messages.map(m => [m.id, m])).values()
            );
            
            setMessages(unique);
            setSelectedUser(otherUser);
            
            socket.emit("join-conversation", otherUser.id);
        } catch (err) {
            console.error("Error loading messages:", err);
        } finally {
            setLoading(false);
        }
    };

    // Send message
    const sendMessage = async () => {
        if (!text.trim() || !selectedUser) return;

        try {
            const res = await API.post("/chat/send", {
                receiver_id: selectedUser.id,
                message: text
            });

            const newMessage = res.data.data;
            
            setMessages((prev) => {
                const exists = prev.find(m => m.id === newMessage.id);
                if (exists) return prev;
                return [...prev, newMessage];
            });

            socket.emit("send-message", newMessage);
            setText("");
        } catch (err) {
            console.error("Error sending message:", err);
        }
    };

    // Socket events
    useEffect(() => {
        socket.connect();
        socket.emit("user-online", user.id);

        socket.on("receive-message", (message) => {
            setMessages((prev) => {
                const exists = prev.find(m => m.id === message.id);
                if (exists) return prev;
                return [...prev, message];
            });
        });

        socket.on("online-users", (users) => {
            setOnlineUsers(users);
        });

        return () => {
            socket.off("receive-message");
            socket.off("online-users");
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        loadConversations();
    }, []);

    // Handle Enter key
    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // Logout
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        socket.disconnect();
        window.location.href = "/login";
    };

    return (
        <div style={styles.container}>
            {/* Sidebar */}
            <div style={styles.sidebar}>
                <div style={styles.sidebarHeader}>
                    <h3 style={{ color: "white" }}>💬 Chats</h3>
                    <button onClick={logout} style={styles.logoutButtonSmall}>
                        Logout
                    </button>
                </div>
                
                <div style={styles.conversationList}>
                    {conversations.length === 0 ? (
                        <p style={{ color: "#94a3b8", textAlign: "center" }}>
                            No conversations yet
                        </p>
                    ) : (
                        conversations.map((c, i) => {
                            const otherUser = c.user_one.id === user.id 
                                ? c.user_two 
                                : c.user_one;
                            
                            const isOnline = onlineUsers.includes(otherUser.id);
                            
                            return (
                                <div
                                    key={i}
                                    style={{
                                        ...styles.chatItem,
                                        ...(selectedUser?.id === otherUser.id && styles.chatItemActive)
                                    }}
                                    onClick={() => loadMessages(otherUser)}
                                >
                                    <div style={styles.chatItemContent}>
                                        <div style={styles.chatItemAvatar}>
                                            {otherUser.username?.charAt(0).toUpperCase()}
                                            <span style={{
                                                ...styles.onlineDot,
                                                ...(isOnline && styles.onlineDotActive)
                                            }} />
                                        </div>
                                        <div style={styles.chatItemInfo}>
                                            <strong>{otherUser.username}</strong>
                                            <p style={styles.chatItemPreview}>
                                                {c.last_message || "No messages yet"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Chat Box */}
            <div style={styles.chatBox}>
                {selectedUser ? (
                    <>
                        <ChatHeader
                            user={user}
                            selectedUser={selectedUser}
                            onlineUsers={onlineUsers}
                        />

                        {loading ? (
                            <div style={styles.loadingContainer}>
                                <p style={{ color: "#94a3b8" }}>Loading messages...</p>
                            </div>
                        ) : (
                            <div style={styles.messages}>
                                {messages.map((m) => (
                                    <div
                                        key={m.id}
                                        style={{
                                            ...styles.message,
                                            alignSelf: m.sender_id === user.id
                                                ? "flex-end"
                                                : "flex-start",
                                            background: m.sender_id === user.id
                                                ? "#3b82f6"
                                                : "#334155"
                                        }}
                                    >
                                        {m.message}
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                        )}

                        <div style={styles.inputBox}>
                            <input
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type a message..."
                                style={styles.input}
                            />
                            <button
                                onClick={sendMessage}
                                style={styles.sendButton}
                                disabled={!text.trim()}
                            >
                                ➤
                            </button>
                        </div>
                    </>
                ) : (
                    <div style={styles.emptyChat}>
                        <h3 style={{ color: "#94a3b8" }}>
                            👈 Select a conversation to start chatting
                        </h3>
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        height: "100vh",
        background: "#0f172a",
        fontFamily: "system-ui, -apple-system, sans-serif"
    },
    sidebar: {
        width: "30%",
        minWidth: "280px",
        background: "#1e293b",
        borderRight: "1px solid #334155",
        display: "flex",
        flexDirection: "column"
    },
    sidebarHeader: {
        padding: "20px",
        borderBottom: "1px solid #334155",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },
    conversationList: {
        flex: 1,
        overflowY: "auto",
        padding: "10px"
    },
    chatItem: {
        padding: "12px 15px",
        margin: "5px 0",
        borderRadius: "10px",
        cursor: "pointer",
        transition: "all 0.2s",
        backgroundColor: "transparent"
    },
    chatItemActive: {
        backgroundColor: "#334155"
    },
    chatItemContent: {
        display: "flex",
        alignItems: "center",
        gap: "12px"
    },
    chatItemAvatar: {
        width: "45px",
        height: "45px",
        borderRadius: "50%",
        background: "#3b82f6",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#fff",
        fontSize: "18px",
        fontWeight: "bold",
        position: "relative",
        flexShrink: 0
    },
    onlineDot: {
        position: "absolute",
        bottom: "2px",
        right: "2px",
        width: "12px",
        height: "12px",
        borderRadius: "50%",
        background: "#64748b",
        border: "2px solid #1e293b"
    },
    onlineDotActive: {
        background: "#22c55e"
    },
    chatItemInfo: {
        flex: 1,
        minWidth: 0
    },
    chatItemPreview: {
        fontSize: "13px",
        color: "#94a3b8",
        margin: "2px 0 0 0",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
    },
    chatBox: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: "#0f172a"
    },
    messages: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        overflowY: "auto",
        padding: "20px"
    },
    message: {
        padding: "10px 16px",
        borderRadius: "16px",
        color: "white",
        maxWidth: "65%",
        wordWrap: "break-word",
        fontSize: "15px",
        lineHeight: "1.5"
    },
    inputBox: {
        display: "flex",
        gap: "10px",
        padding: "16px 20px",
        background: "#1e293b",
        borderTop: "1px solid #334155"
    },
    input: {
        flex: 1,
        padding: "12px 16px",
        borderRadius: "12px",
        border: "1px solid #334155",
        background: "#0f172a",
        color: "white",
        fontSize: "15px",
        outline: "none"
    },
    sendButton: {
        padding: "12px 24px",
        background: "#3b82f6",
        color: "white",
        border: "none",
        borderRadius: "12px",
        cursor: "pointer",
        fontSize: "20px",
        transition: "all 0.2s"
    },
    logoutButtonSmall: {
        background: "#ef4444",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        padding: "8px 16px",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: "500"
    },
    emptyChat: {
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    loadingContainer: {
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }
};

export default Chat;
