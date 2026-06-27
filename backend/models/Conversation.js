import pool from "../config/database.js";

/*
==========================================
Create Conversations Table
==========================================
*/

export async function createConversationsTable() {

    const query = `

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

    );

    `;

    try {

        await pool.query(query);

        console.log("✅ Conversations table created.");

    } catch (error) {

        console.error("❌ Error creating conversations table");
        console.error(error);

    }

}

/*
==========================================
Find Existing Conversation
==========================================
*/

export async function findConversation(userOne, userTwo) {

    const result = await pool.query(

        `

        SELECT *

        FROM conversations

        WHERE

        (user_one_id=$1 AND user_two_id=$2)

        OR

        (user_one_id=$2 AND user_two_id=$1)

        LIMIT 1

        `,

        [userOne, userTwo]

    );

    return result.rows[0];

}

/*
==========================================
Create Conversation
==========================================
*/

export async function createConversation(userOne, userTwo) {

    const result = await pool.query(

        `

        INSERT INTO conversations(

            user_one_id,
            user_two_id

        )

        VALUES($1,$2)

        RETURNING *;

        `,

        [userOne, userTwo]

    );

    return result.rows[0];

}

/*
==========================================
Get User Conversations
==========================================
*/

export async function getUserConversations(userId) {

    const result = await pool.query(

        `

        SELECT *

        FROM conversations

        WHERE

        user_one_id=$1

        OR

        user_two_id=$1

        ORDER BY last_message_at DESC;

        `,

        [userId]

    );

    return result.rows;

}

/*
==========================================
Update Last Message
==========================================
*/

export async function updateConversation(conversationId, message) {

    await pool.query(

        `

        UPDATE conversations

        SET

        last_message=$1,

        last_message_at=NOW()

        WHERE id=$2

        `,

        [message, conversationId]

    );

}
