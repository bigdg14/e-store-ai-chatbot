import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

export async function formatWithAI(
  results: Record<string, unknown>[],
  userQuery: string
): Promise<string> {
  // Skip AI formatting if there are no results
  if (!results || results.length === 0) {
    return "I couldn't find any products matching your question. Could you try asking in a different way?";
  }

  try {
    // Initialize the AI model with a lower temperature for reliable formatting
    const model = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY!,
      modelName: "gpt-3.5-turbo", 
      temperature: 0.2, 
    });

    // System prompt that explains how to format the results
    const systemPrompt = `
      You are an expert assistant who speaks in exciting laymen's terms. 
      Format database query results into a user-friendly message. Examples:
      
      - Input: [{ "count": "50" }]
      - Output: There are 50 products available.
      
      - Input: [{ "id": 1, "name": "Product A", "description": "Data on housing prices" }]
      - Output: The 1st product is Product A, which is described as data on housing prices.
      
      Don't mention anything about formatting, databases, or SQL. Just provide a natural, 
      conversational response as if you already knew this information.
      
      Keep your response concise - ideally 1-3 sentences unless the results require more detail.
      Don't ask the user any questions in your response.
      
      If there are multiple products, limit to mentioning 3-5 of them unless specifically asked for more.
      For pricing, always include the $ symbol.
    `;

    // Friendly message with the data to format
    const humanPrompt = `
      User query: "${userQuery}"
      
      Raw database results: ${JSON.stringify(results, null, 2)}
      
      Format this into a user-friendly response. Do not ask the user any further questions.
    `;

    // Call the model to generate the formatted response
    const response = await model.invoke([
      new SystemMessage(systemPrompt),
      new HumanMessage(humanPrompt),
    ]);

    // Return the generated response text
    return response.content as string;
  } catch (error) {
    console.error("AI formatting error:", error);

    // Fall back to a basic formatter if AI fails
    return basicFormatter(results, userQuery);
  }
}

/* Basic fallback formatter in case AI formatting fails */
function basicFormatter(results: Record<string, unknown>[], userQuery: string): string {
  // Count results
  if (results.length === 1 && results[0].count !== undefined) {
    return `There ${results[0].count === 1 ? "is" : "are"} ${
      results[0].count
    } ${results[0].count === 1 ? "product" : "products"} available.`;
  }

  // Multiple products
  if (results.length > 0 && results[0].title) {
    const productCount = results.length;
    let response = `I found ${productCount} products that match your search. `;

    if (productCount <= 5) {
      response += `These include: ${results.map((p) => p.title).join(", ")}.`;
    } else {
      const sample = results.slice(0, 3);
      response += `Some examples include: ${sample
        .map((p) => p.title)
        .join(", ")}, and more.`;
    }

    return response;
  }

  // Generic fallback
  return `I found some information based on your question about "${userQuery.substring(
    0,
    30
  )}...". There ${results.length === 1 ? "is" : "are"} ${
    results.length
  } result${results.length === 1 ? "" : "s"}.`;
}
