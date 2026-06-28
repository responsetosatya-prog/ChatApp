import express from "express";
import pool from "../config/database.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Get all users (for searching)
router.get("/", authenticateToken, async (req, res) => {
    try {
        const { search } = req.query;
        let query = `
            SELECT id, username, full_name, email, profile_picture, status, is_online
            FROM users
            WHERE id != $1 AND status = 'approved'
        `;
        const params = [req.user.id];

        if (search) {
            query += ` AND (username ILIKE $2 OR full_name ILIKE $2)`;
            params.push(`%${search}%`);
        }

        query += ` ORDER BY username ASC`;

        const result = await pool.query(query, params);
        res.json({ success: true, users: result.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to fetch users" });
    }
});

// Get user by ID
router.get("/:id", authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, username, full_name, email, profile_picture, bio, is_online, last_seen
             FROM users WHERE id = $1`,
            [req.params.id]
        );
        
        if (!result.rows[0]) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        
        res.json({ success: true, user: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to fetch user" });
    }
});

export default router;
