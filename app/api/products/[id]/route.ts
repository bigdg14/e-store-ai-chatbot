import { NextResponse } from "next/server";
import { getProductById } from "@/lib/fetcher"; // Import the correct functions

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const productId = Number(params.id);

  if (isNaN(productId)) {
    return NextResponse.json(
      { error: "Invalid product ID format" },
      { status: 400 }
    );
  }

  try {
    const result = await getProductById(productId);

    if (result.data === null) {
      // Check if data is null (product not found)
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ data: result.data }, { status: 200 }); // Return result.data
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
