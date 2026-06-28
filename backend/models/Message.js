// backend/models/Message.js - SIMPLIFIED VERSION
import pool from "../config/database.js";

/*
==========================================
Create a new message
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
        media_url
    )
    VALUES($1, $2, $3, $4, $5, $6)
    RETURNING *;
    `;

    const values = [
        data.conversation_id,
        data.sender_id,
        data.receiver_id,
        data.message,
        data.message_type || "text",
        data.media_url || ""
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
}

/*
==========================================
Get conversation messages
==========================================
*/

export async function getConversationMessages(conversationId) {
    const query = `
    SELECT *
    FROM messages
    WHERE conversation_id = $1
    ORDER BY created_at ASC;
    `;

    const result = await pool.query(query, [conversationId]);
    return result.rows;
}
