import { NextResponse } from "next/server";
import db from "@/db/db.json"; // Assuming `db.json` is moved to `src/db/db.json`

export async function GET() {
  return NextResponse.json(db.categories);
}
