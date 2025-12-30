import { NextResponse } from "next/server";
import { getCategories } from "@/lib/fetcher";

export async function GET() {
  try {
    const result = await getCategories();

    if (result.errorMessage) {
      return NextResponse.json(
        { error: result.errorMessage },
        { status: 500 }
      );
    }

    return NextResponse.json(result.data, { status: 200 });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
