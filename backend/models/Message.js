// backend/models/Message.js
import pool from "../config/database.js";

/*
==========================================
Create a new message with reply support
==========================================
*/

export async function createMessage(data) {
    const query = `
    INSERT INTO messages(
        conversation_id,
        sender_id,
        receiver_id,
        message,
        message_type,
        media_url,
        reply_to_message_id
    )
    VALUES($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
    `;

    const values = [
        data.conversation_id,
        data.sender_id,
        data.receiver_id,
        data.message,
        data.message_type || "text",
        data.media_url || "",
        data.reply_to_message_id || null
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
}

/*
==========================================
Get messages with reply data
==========================================
*/

export async function getConversationMessages(conversationId) {
    const query = `
    SELECT 
        m.*,
        reply_msg.message as reply_to_message,
        reply_msg.sender_id as reply_to_sender_id,
        reply_user.full_name as reply_to_sender_name,
        reply_user.username as reply_to_username
    FROM messages m
    LEFT JOIN messages reply_msg ON m.reply_to_message_id = reply_msg.id
    LEFT JOIN users reply_user ON reply_msg.sender_id = reply_user.id
    WHERE m.conversation_id = $1
    ORDER BY m.created_at ASC;
    `;

    const result = await pool.query(query, [conversationId]);
    return result.rows;
}

export async function getMessageById(id) {
    const query = `
    SELECT m.*, u.full_name as sender_name, u.username 
    FROM messages m
    JOIN users u ON m.sender_id = u.id
    WHERE m.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
}
