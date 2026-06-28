// backend/controllers/reactionController.js
import pool from "../config/database.js";

// Create reactions table
export async function createReactionsTable() {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS message_reactions (
        id SERIAL PRIMARY KEY,
        message_id INTEGER REFERENCES messages(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        reaction VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(message_id, user_id, reaction)
    )
    `);
}

export async function addReaction(req, res) {
    try {
        const { messageId, reaction } = req.body;
        const userId = req.user.id;
        
        await pool.query(
            `INSERT INTO message_reactions (message_id, user_id, reaction)
             VALUES ($1, $2, $3)
             ON CONFLICT (message_id, user_id, reaction) 
             DO NOTHING`,
            [messageId, userId, reaction]
        );
        
        // Emit socket event
        const io = req.app.get('io');
        io.emit('reaction-updated', { messageId, userId, reaction });
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
