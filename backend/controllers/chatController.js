import {
    createMessage,
    getConversation,
    editMessage,
    deleteMessage,
    markSeen
} from "../models/Message.js";

/*
==========================================
Send Message
POST /api/chat/send
==========================================
*/

export async function sendMessage(req, res) {

    try {

        const sender_id = req.user.id;

        const {
            receiver_id,
            message,
            message_type,
            media_url
        } = req.body;

        if (!receiver_id) {
            return res.status(400).json({
                success: false,
                message: "Receiver ID is required."
            });
        }

        if (!message && !media_url) {
            return res.status(400).json({
                success: false,
                message: "Message cannot be empty."
            });
        }

        const newMessage = await createMessage({
            sender_id,
            receiver_id,
            message,
            message_type,
            media_url
        });

        // Socket.IO will be integrated later

        res.status(201).json({
            success: true,
            message: "Message sent successfully.",
            data: newMessage
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to send message."
        });

    }

}

/*
==========================================
Get Conversation
GET /api/chat/:userId
==========================================
*/

export async function getMessages(req, res) {

    try {

        const currentUser = req.user.id;

        const otherUser = req.params.userId;

        const messages = await getConversation(
            currentUser,
            otherUser
        );

        res.json({
            success: true,
            messages
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to load messages."
        });

    }

}

/*
==========================================
Edit Message
PUT /api/chat/message/:id
==========================================
*/

export async function updateMessage(req, res) {

    try {

        const { id } = req.params;
        const { message } = req.body;

        const updated = await editMessage(id, message);

        res.json({
            success: true,
            message: "Message updated.",
            data: updated
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to update message."
        });

    }

}

/*
==========================================
Delete Message
DELETE /api/chat/message/:id
==========================================
*/

export async function removeMessage(req, res) {

    try {

        const { id } = req.params;

        await deleteMessage(id);

        res.json({
            success: true,
            message: "Message deleted."
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to delete message."
        });

    }

}

/*
==========================================
Mark Messages As Seen
PUT /api/chat/seen/:userId
==========================================
*/

export async function seenMessages(req, res) {

    try {

        const receiverId = req.user.id;
        const senderId = req.params.userId;

        await markSeen(senderId, receiverId);

        res.json({
            success: true,
            message: "Messages marked as seen."
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to update seen status."
        });

    }

}
