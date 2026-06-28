// backend/config/initDatabase.js
import pool from "../config/database.js";

export async function initializeDatabase() {
    try {
        console.log("");
        console.log("======================================");
        console.log("Initializing ChatSphere Database...");
        console.log("======================================");

        // 1. Create users table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                full_name VARCHAR(100) NOT NULL,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(120) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                profile_picture TEXT DEFAULT '',
                bio TEXT DEFAULT '',
                role VARCHAR(20) DEFAULT 'user',
                status VARCHAR(20) DEFAULT 'pending',
                is_online BOOLEAN DEFAULT FALSE,
                last_seen TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("✅ Users table ready");

        // 2. Create conversations table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS conversations (
                id SERIAL PRIMARY KEY,
                user_one_id INTEGER NOT NULL,
                user_two_id INTEGER NOT NULL,
                last_message TEXT DEFAULT '',
                last_message_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_user_one
                    FOREIGN KEY(user_one_id)
                    REFERENCES users(id)
                    ON DELETE CASCADE,
                CONSTRAINT fk_user_two
                    FOREIGN KEY(user_two_id)
                    REFERENCES users(id)
                    ON DELETE CASCADE,
                CONSTRAINT unique_conversation
                    UNIQUE(user_one_id, user_two_id)
            )
        `);
        console.log("✅ Conversations table ready");

        // 3. Create messages table with reply_to_message_id
        await pool.query(`
            CREATE TABLE IF NOT EXISTS messages (
                id SERIAL PRIMARY KEY,
                conversation_id INTEGER,
                sender_id INTEGER NOT NULL,
                receiver_id INTEGER NOT NULL,
                message TEXT,
                message_type VARCHAR(20) DEFAULT 'text',
                media_url TEXT DEFAULT '',
                is_seen BOOLEAN DEFAULT FALSE,
                reply_to_message_id INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_sender
                    FOREIGN KEY(sender_id)
                    REFERENCES users(id)
                    ON DELETE CASCADE,
                CONSTRAINT fk_receiver
                    FOREIGN KEY(receiver_id)
                    REFERENCES users(id)
                    ON DELETE CASCADE,
                CONSTRAINT fk_reply_to
                    FOREIGN KEY(reply_to_message_id)
                    REFERENCES messages(id)
                    ON DELETE SET NULL
            )
        `);
        console.log("✅ Messages table ready with reply support");

        // 4. Add foreign key for conversation_id if it doesn't exist
        try {
            await pool.query(`
                ALTER TABLE messages 
                ADD CONSTRAINT fk_conversation 
                FOREIGN KEY (conversation_id) 
                REFERENCES conversations(id) 
                ON DELETE CASCADE
            `);
            console.log("✅ Foreign key constraint added");
        } catch (err) {
            console.log("ℹ️ Foreign key constraint already exists or could not be added");
        }

        console.log("");
        console.log("======================================");
        console.log("✅ Database Initialized Successfully");
        console.log("======================================");

    } catch (error) {
        console.error("❌ Database initialization error:", error);
    }
}
