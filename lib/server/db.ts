"use server"; // This directive marks the entire file as server-only code

import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

// Create connection pool only on the server
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Utility function for database queries
export async function queryDatabase(query: string, params: unknown[] = []) {
  const client = await pool.connect();
  try {
    const { rows } = await client.query(query, params);
    return rows;
  } catch (error) {
    console.error("❌ Database Query Error:", error);
    return [];
  } finally {
    client.release();
  }
}
