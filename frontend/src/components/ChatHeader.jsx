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
        <div className={`avatar avatar-sm ${isOnline ? 'online' : ''}`}>
          {selectedUser.username?.charAt(0) || 'U'}
        </div>
        <div className="chat-header-info">
          <div className="chat-header-name">{selectedUser.full_name}</div>
          <div className={`chat-header-status ${isOnline ? 'online' : 'offline'}`}>
            {isOnline ? '🟢 Online' : '⚫ Offline'}
          </div>
        </div>
      </div>
      
      <div className="chat-header-right">
        <button className="header-action">
          <FaPhone />
        </button>
        <button className="header-action">
          <FaVideo />
        </button>
        <button className="header-action">
          <FaEllipsisV />
        </button>
      </div>
    </div>
  );
}

export default ChatHeader;
