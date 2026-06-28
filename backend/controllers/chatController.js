// backend/controllers/chatController.js
import pool from "../config/database.js";
import {
    findConversation,
    createConversation,
    updateConversation
} from "../models/Conversation.js";
import { createMessage, getMessageById } from "../models/Message.js";

/*
==========================================
Get Messages Between Users (with replies)
==========================================
*/

export async function getMessages(req, res) {
    try {
        const userId = req.user.id;
        const otherUserId = parseInt(req.params.userId);

        console.log(`Getting messages between ${userId} and ${otherUserId}`);

        if (!otherUserId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        let conversation = await findConversation(userId, otherUserId);

        if (!conversation) {
            return res.json({
                success: true,
                messages: []
            });
        }

        const result = await pool.query(
            `
            SELECT 
                m.id,
                m.sender_id,
                m.receiver_id,
                m.message,
                m.message_type,
                m.media_url,
                m.is_seen,
                m.created_at,
                m.updated_at,
                m.reply_to_message_id,
                reply_msg.message as reply_to_message,
                reply_msg.sender_id as reply_to_sender_id,
                reply_user.full_name as reply_to_sender_name,
                reply_user.username as reply_to_username,
                sender.full_name as sender_name,
                sender.username as sender_username
            FROM messages m
            LEFT JOIN messages reply_msg ON m.reply_to_message_id = reply_msg.id
            LEFT JOIN users reply_user ON reply_msg.sender_id = reply_user.id
            LEFT JOIN users sender ON m.sender_id = sender.id
            WHERE m.conversation_id = $1
            ORDER BY m.created_at ASC
            `,
            [conversation.id]
        );

        console.log(`Found ${result.rows.length} messages`);

        res.json({
            success: true,
            messages: result.rows
        });

    } catch (error) {
        console.error("Error in getMessages:", error);
        res.status(500).json({
            success: false,
            message: "Failed to load messages",
            error: error.message
        });
    }
}

/*
==========================================
Send Message with Reply Support
==========================================
*/

export async function sendMessage(req, res) {
    try {
        const senderId = req.user.id;
        const { receiver_id, message, reply_to_message_id } = req.body;

        console.log(`Sending message from ${senderId} to ${receiver_id}`);

        if (!receiver_id) {
            return res.status(400).json({
                success: false,
                message: "Receiver ID is required"
            });
        }

        if (!message || message.trim() === '') {
            return res.status(400).json({
                success: false,
                message: "Message cannot be empty"
            });
        }

        // Find or create conversation
        let conversation = await findConversation(senderId, receiver_id);

        if (!conversation) {
            console.log("Creating new conversation");
            conversation = await createConversation(senderId, receiver_id);
        }

        console.log("Conversation ID:", conversation.id);

        // If replying to a message, verify it exists
        if (reply_to_message_id) {
            const replyMessage = await getMessageById(reply_to_message_id);
            if (!replyMessage) {
                return res.status(404).json({
                    success: false,
                    message: "Message you're replying to not found"
                });
            }
        }

        // Insert message
        const newMessage = await createMessage({
            conversation_id: conversation.id,
            sender_id: senderId,
            receiver_id: receiver_id,
            message: message.trim(),
            message_type: "text",
            reply_to_message_id: reply_to_message_id || null
        });

        console.log("Message created:", newMessage.id);

        // Update conversation last message
        await updateConversation(conversation.id, message.trim());

        // Get the full message with reply data
        const fullMessage = await getMessageById(newMessage.id);

        res.status(201).json({
            success: true,
            data: fullMessage
        });

    } catch (error) {
        console.error("Error in sendMessage:", error);
        res.status(500).json({
            success: false,
            message: "Failed to send message",
            error: error.message
        });
    }
}
