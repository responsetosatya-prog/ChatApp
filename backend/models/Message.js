import pool from "../config/database.js";

export async function createMessage(data) {
    const result = await pool.query(
        `INSERT INTO messages (
            conversation_id, sender_id, receiver_id, message, 
            message_type, media_url, reply_to_message_id
         ) VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [
            data.conversation_id,
            data.sender_id,
            data.receiver_id,
            data.message,
            data.message_type || 'text',
            data.media_url || '',
            data.reply_to_message_id || null,
        ]
    );
    return result.rows[0];
}

export async function getMessageById(id) {
    const result = await pool.query(
        `SELECT m.*, 
                sender.full_name as sender_name, sender.username as sender_username,
                reply_msg.message as reply_to_message,
                reply_user.full_name as reply_to_sender_name
         FROM messages m
         LEFT JOIN users sender ON m.sender_id = sender.id
         LEFT JOIN messages reply_msg ON m.reply_to_message_id = reply_msg.id
         LEFT JOIN users reply_user ON reply_msg.sender_id = reply_user.id
         WHERE m.id = $1`,
        [id]
    );
    return result.rows[0];
}

export async function getConversationMessages(conversationId) {
    const result = await pool.query(
        `SELECT m.*, 
                sender.full_name as sender_name,
                reply_msg.message as reply_to_message,
                reply_user.full_name as reply_to_sender_name
         FROM messages m
         LEFT JOIN users sender ON m.sender_id = sender.id
         LEFT JOIN messages reply_msg ON m.reply_to_message_id = reply_msg.id
         LEFT JOIN users reply_user ON reply_msg.sender_id = reply_user.id
         WHERE m.conversation_id = $1
         ORDER BY m.created_at ASC`,
        [conversationId]
    );
    return result.rows;
}

export async function markMessagesAsSeen(conversationId, userId) {
    await pool.query(
        `UPDATE messages 
         SET is_seen = TRUE 
         WHERE conversation_id = $1 AND receiver_id = $2 AND is_seen = FALSE`,
        [conversationId, userId]
    );
}
