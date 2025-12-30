import { NextResponse } from "next/server";
import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function queryDatabase(query: string, params: unknown[] = []) {
  const client = await pool.connect();
  try {
    const { rows } = await client.query(query, params);
    return rows;
  } catch (error) {
    console.error("Database Query Error:", error);
    return [];
  } finally {
    client.release();
  }
}

export async function GET() {
  try {
    //await connectDB(); // Ensure the connection is established
    const result = await queryDatabase("SELECT * FROM products");
    return NextResponse.json({ data: result }, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
