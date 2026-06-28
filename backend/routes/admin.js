import express from "express";
import pool from "../config/database.js";

const router = express.Router();

router.get("/users", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT id, full_name, email, status FROM users ORDER BY id DESC"
        );

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

export default router;
