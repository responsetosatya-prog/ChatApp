import { FaArrowLeft, FaPhone, FaVideo, FaEllipsisV } from "react-icons/fa";

function ChatHeader({ user, selectedUser, onlineUsers, onBack }) {
    const isOnline = onlineUsers?.includes(selectedUser?.id) || false;

    if (!selectedUser) return null;

    return (
        <div className="chat-header">
            <div className="chat-header-left">
                <button className="header-back" onClick={onBack}>
                    <FaArrowLeft />
                </button>
                <div className="chat-avatar-wrapper">
                    <img
                        src={selectedUser.profile_picture || `https://ui-avatars.com/api/?name=${selectedUser.full_name}&background=6C63FF&color=fff&size=40`}
                        alt={selectedUser.full_name}
                        className="chat-avatar"
                    />
                    {isOnline && <span className="online-dot-large"></span>}
                </div>
                <div className="chat-header-info">
                    <div className="chat-header-name">{selectedUser.full_name}</div>
                    <div className={`chat-header-status ${isOnline ? "online" : "offline"}`}>
                        {isOnline ? "🟢 Online" : "⚫ Offline"}
                    </div>
                </div>
            </div>
            <div className="chat-header-right">
                <button className="header-action" title="Voice Call">
                    <FaPhone />
                </button>
                <button className="header-action" title="Video Call">
                    <FaVideo />
                </button>
                <button className="header-action" title="More">
                    <FaEllipsisV />
                </button>
            </div>
        </div>
    );
}

export default ChatHeader;
