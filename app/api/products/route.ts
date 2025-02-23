import { NextResponse } from "next/server";
import db from "@/db/db.json"; // Ensure path is correct

// API Route: `/api/products`
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.toLowerCase(); // Search query
    const categoryId = searchParams.get("catId"); // Category ID filter

    // ✅ If no query and no category filter, return all products
    if (!query && !categoryId) {
      return NextResponse.json({ data: db.products }, { status: 200 });
    }

    console.log("🔍 Server: Search Query →", query);
    console.log("🗂 Server: Category Filter →", categoryId);

    // ✅ Ensure `db.products` is an array
    if (!db.products || !Array.isArray(db.products)) {
      return NextResponse.json({
        data: [],
        errorMessage: "No products available",
      });
    }

    let filteredProducts = db.products;

    // 🔎 Search filter (title or description)
    if (query) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.title.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query)
      );
    }

    // 📂 Category filter
    if (categoryId) {
      const categoryNum = Number(categoryId);
      if (!isNaN(categoryNum)) {
        filteredProducts = filteredProducts.filter(
          (product) => product.catId === categoryNum
        );
      }
    }

    console.log("✅ Server: Filtered Products →", filteredProducts.length);

    return NextResponse.json({ data: filteredProducts, errorMessage: null });
  } catch (error) {
    console.error("❌ Server Error:", error);
    return NextResponse.json(
      { data: [], errorMessage: "Server error" },
      { status: 500 }
    );
  }
}
