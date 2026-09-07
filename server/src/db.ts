import "./env.js";
import pg from "pg";

const { Pool } = pg;

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    throw new Error("DATABASE_URL is required in environment variables");
}

export const pool = new Pool({ connectionString: DATABASE_URL });

pool.on("error", (error) => {
    console.error("Postgres pool error:", error);
});
