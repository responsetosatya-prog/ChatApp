import express from "express";
import pool from "../config/database.js";

const router = express.Router();

router.get("/user/:email", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT email, status FROM users WHERE email = $1",
            [req.params.email]
        );

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

export default router;
