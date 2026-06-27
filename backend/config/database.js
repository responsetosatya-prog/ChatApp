import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,

    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,

    ssl:
        process.env.NODE_ENV === "production"
            ? {
                  rejectUnauthorized: false
              }
            : false
});

/**
 * Test database connection
 */
export async function connectDatabase() {

    try {

        const client = await pool.connect();

        console.log("==================================");
        console.log("✅ PostgreSQL Connected");
        console.log("Database :", process.env.DB_NAME);
        console.log("Host     :", process.env.DB_HOST);
        console.log("==================================");

        client.release();

    } catch (error) {

        console.error("==================================");
        console.error("❌ Database Connection Failed");
        console.error(error.message);
        console.error("==================================");

        process.exit(1);

    }

}

export default pool;
