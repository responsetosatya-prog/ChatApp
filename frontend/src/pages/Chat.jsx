import { useEffect, useState, useRef, useCallback } from "react";
import {
    FaSearch, FaUserPlus, FaPaperPlane, FaImage, FaSmile,
    FaTimes, FaUser, FaReply, FaTrash, FaEdit
} from "react-icons/fa";
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
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showSearch, setShowSearch] = useState(false);
    const [typing, setTyping] = useState(false);
   
