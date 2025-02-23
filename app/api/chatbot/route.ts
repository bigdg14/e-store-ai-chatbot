import { NextResponse } from "next/server";
import db from "@/db/db.json";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1]?.content.toLowerCase();

    if (!lastMessage) {
      return NextResponse.json({
        response: "Please ask a question about our products.",
      });
    }

    // Product Count
    if (lastMessage.includes("how many products")) {
      return NextResponse.json({
        response: `We have ${db.products.length} products.`,
      });
    }

    // Products with Specific Text in Description or Title
    if (lastMessage.includes("products with")) {
      const searchText = lastMessage.split("products with")[1]?.trim();
      if (searchText) {
        const matchedProducts = db.products.filter(
          (product) =>
            product.title.toLowerCase().includes(searchText) ||
            product.description?.toLowerCase().includes(searchText)
        );
        if (matchedProducts.length > 0) {
          const responseMessage = matchedProducts
            .map((p) => `✅ *${p.title}* - ${p.description} ($${p.price})`)
            .join("\n\n");
          return NextResponse.json({ response: responseMessage });
        } else {
          return NextResponse.json({
            response: `No products found with "${searchText}" in their description or title.`,
          });
        }
      }
    }

    // Products Related to Specific Text
    if (lastMessage.includes("products related to")) {
      const searchText = lastMessage.split("products related to")[1]?.trim();
      if (searchText) {
        const matchedProducts = db.products.filter(
          (product) =>
            product.title.toLowerCase().includes(searchText) ||
            product.description?.toLowerCase().includes(searchText)
        );
        if (matchedProducts.length > 0) {
          const responseMessage = matchedProducts
            .map((p) => `✅ *${p.title}* - ${p.description} ($${p.price})`)
            .join("\n\n");
          return NextResponse.json({ response: responseMessage });
        } else {
          return NextResponse.json({
            response: `No products found related to "${searchText}".`,
          });
        }
      }
    }

    // Product Count by Category
    if (lastMessage.includes("how many")) {
      const category = lastMessage.split("how many")[1]?.trim();
      if (category) {
        const categoryId = db.categories.find(
          (c) => c.title.toLowerCase() === category
        )?.id;
        if (categoryId) {
          const productCount = db.products.filter(
            (p) => p.catId === categoryId
          ).length;
          return NextResponse.json({
            response: `There are ${productCount} ${category} products.`,
          });
        } else {
          return NextResponse.json({
            response: `Category "${category}" not found.`,
          });
        }
      }
    }

    // Default Response
    return NextResponse.json({
      response:
        "I can answer questions about our products. Ask me something like 'How many products are there?' or 'Are there any phones?'",
    });
  } catch (error) {
    console.error("Error in chatbot API:", error);
    return NextResponse.json({
      response: "Something went wrong. Please try again.",
    });
  }
}
