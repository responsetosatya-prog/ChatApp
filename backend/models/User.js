import pool from "../config/database.js";

/**
 * Create Users Table
 */

export async function createUsersTable() {

    const query = `

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

    );

    `;

    try{

        await pool.query(query);

        console.log("✅ Users table created.");

    }

    catch(error){

        console.error("❌ Error creating users table");

        console.error(error);

    }

}

/**
 * Create User
 */

export async function createUser(user){

    const query = `

    INSERT INTO users(

        full_name,
        username,
        email,
        password

    )

    VALUES($1,$2,$3,$4)

    RETURNING *;

    `;

    const values = [

        user.full_name,
        user.username,
        user.email,
        user.password

    ];

    const result = await pool.query(query,values);

    return result.rows[0];

}

/**
 * Find User By Email
 */

export async function findUserByEmail(email){

    const result = await pool.query(

        "SELECT * FROM users WHERE email=$1",

        [email]

    );

    return result.rows[0];

}

/**
 * Find User By Username
 */

export async function findUserByUsername(username){

    const result = await pool.query(

        "SELECT * FROM users WHERE username=$1",

        [username]

    );

    return result.rows[0];

}

/**
 * Find User By ID
 */

export async function findUserById(id){

    const result = await pool.query(

        "SELECT * FROM users WHERE id=$1",

        [id]

    );

    return result.rows[0];

}

/**
 * Get All Users
 */

export async function getAllUsers(){

    const result = await pool.query(

        "SELECT * FROM users ORDER BY created_at DESC"

    );

    return result.rows;

}

/**
 * Update User Status
 */

export async function updateUserStatus(id,status){

    const result = await pool.query(

        `UPDATE users
        SET status=$1,
        updated_at=NOW()
        WHERE id=$2
        RETURNING *`,

        [status,id]

    );

    return result.rows[0];

}
