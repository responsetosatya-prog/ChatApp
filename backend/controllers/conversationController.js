// backend/controllers/conversationController.js
import {
    findConversation,
    createConversation,
    getUserConversations
} from "../models/Conversation.js";

/*
==========================================
Get All Conversations
GET /api/conversations
==========================================
*/

export async function getConversations(req, res) {
    try {
        const userId = req.user.id;
        console.log("Getting conversations for user:", userId);

        const conversations = await getUserConversations(userId);
        console.log("Found conversations:", conversations.length);

        res.json({
            success: true,
            conversations
        });

    } catch (error) {
        console.error("Error in getConversations:", error);
        res.status(500).json({
            success: false,
            message: "Unable to fetch conversations.",
            error: error.message
        });
    }
}

/*
==========================================
Create Conversation
POST /api/conversations
==========================================
*/

export async function startConversation(req, res) {
    try {
        const userOne = req.user.id;
        const { userId } = req.body;

        console.log(`Starting conversation between ${userOne} and ${userId}`);

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required."
            });
        }

        // Check if users exist
        const userCheck = await pool.query(
            "SELECT id FROM users WHERE id = $1",
            [userId]
        );

        if (!userCheck.rows[0]) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        let conversation = await findConversation(userOne, userId);

        if (!conversation) {
            console.log("Creating new conversation");
            conversation = await createConversation(userOne, userId);
        }

        res.status(201).json({
            success: true,
            conversation
        });

    } catch (error) {
        console.error("Error in startConversation:", error);
        res.status(500).json({
            success: false,
            message: "Unable to create conversation.",
            error: error.message
        });
    }
}
