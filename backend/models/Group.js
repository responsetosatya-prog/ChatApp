// backend/models/Group.js
import pool from "../config/database.js";

// Create groups table
export async function createGroupsTable() {
    const query = `
    CREATE TABLE IF NOT EXISTS groups (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        created_by INTEGER REFERENCES users(id),
        group_picture TEXT DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    `;
    await pool.query(query);
    
    // Group members table
    await pool.query(`
    CREATE TABLE IF NOT EXISTS group_members (
        group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        role VARCHAR(20) DEFAULT 'member',
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (group_id, user_id)
    )
    `);
    
    // Group messages
    await pool.query(`
    ALTER TABLE messages 
    ADD COLUMN IF NOT EXISTS group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
    ADD COLUMN IF NOT EXISTS is_group_message BOOLEAN DEFAULT FALSE
    `);
}
