import { NextResponse } from "next/server";
import db from "@/db/db.json"; // ✅ Ensure this path is correct

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const categoryId = Number(id);

  if (isNaN(categoryId)) {
    return NextResponse.json({ error: "Invalid category ID" }, { status: 400 });
  }

  const category = db.categories.find((c) => c.id === categoryId);

  if (!category) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  return NextResponse.json(category, { status: 200 });
}
