import { NextResponse } from "next/server";
import db from "@/db/db.json"; // Ensure path is correct

// API Route: `/api/products/[id]`
export async function GET(
  req: Request,
  { params }: { params: { id: string } } // Extracts ID from params
) {
  const productId = Number(params.id); // Convert ID from string to number

  if (isNaN(productId)) {
    return NextResponse.json(
      { error: "Invalid product ID format" },
      { status: 400 }
    );
  }

  console.log(`Fetching product by ID: ${productId}`);

  // Find product in database
  const product = db.products.find((p) => p.id === productId);

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ data: product }, { status: 200 });
}
