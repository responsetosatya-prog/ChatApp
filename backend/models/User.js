import pool from "../config/database.js";

export async function createUser(data) {
    const result = await pool.query(
        `INSERT INTO users (full_name, username, email, password)
         VALUES ($1, $2, $3, $4)
         RETURNING id, full_name, username, email, profile_picture, bio, role, status`,
        [data.full_name, data.username, data.email, data.password]
    );
    return result.rows[0];
}

export async function findUserByEmail(email) {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    return result.rows[0];
}

export async function findUserByUsername(username) {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    return result.rows[0];
}

export async function findUserById(id) {
    const result = await pool.query(
        `SELECT id, full_name, username, email, profile_picture, bio, location, website, 
                role, status, is_online, last_seen, created_at 
         FROM users WHERE id = $1`,
        [id]
    );
    return result.rows[0];
}

export async function getAllUsers() {
    const result = await pool.query(
        `SELECT id, full_name, username, email, profile_picture, bio, role, status, is_online 
         FROM users ORDER BY created_at DESC`
    );
    return result.rows;
}

export async function searchUsers(query, excludeId) {
    const result = await pool.query(
        `SELECT id, full_name, username, email, profile_picture, bio, is_online 
         FROM users 
         WHERE (username ILIKE $1 OR full_name ILIKE $1) 
         AND id != $2 
         AND status = 'approved'
         ORDER BY username ASC`,
        [`%${query}%`, excludeId]
    );
    return result.rows;
}
