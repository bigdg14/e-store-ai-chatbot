import { NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { createSqlQueryChain } from "langchain/chains/sql_db";
import { queryDatabase } from "@/lib/server/db";
import { formatWithAI } from "./ai-formatter";

/* Creates a custom database adapter for LangChain to work with our database */
const createCustomSqlDatabase = async () => {
  // Get table information
  const tables = await queryDatabase(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
  `);

  // Build table schema information
  const tableInfo = [];

  for (const tableRow of tables) {
    const tableName = tableRow.table_name;

    // Get column information
    const columns = await queryDatabase(
      `
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = $1
    `,
      [tableName]
    );

    // Get sample data
    const sampleRows = await queryDatabase(`
      SELECT * FROM "${tableName}" LIMIT 3
    `);

    tableInfo.push({
      tableName,
      columns: columns.map((col) => ({
        name: col.column_name,
        type: col.data_type,
      })),
      sampleRows,
    });
  }

  // Create a mock database object that implements the interface LangChain expects
  const mockDb = {
    _tableInfo: tableInfo,

    async query(query: string): Promise<any[]> {
      return await queryDatabase(query);
    },

    async getTableInfo(): Promise<any[]> {
      return this._tableInfo;
    },

    appDataSourceOptions: {
      type: "postgres",
    },

    dialect: "postgres",

    sampleRowsInTableInfo: 3,
  };

  return mockDb;
};

/* Chatbot API endpoint */
export async function POST(req: Request) {
  try {
    // Extract user message from request
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1]?.content;

    if (!lastMessage) {
      return NextResponse.json({
        response: "Please ask a question about our products.",
      });
    }

    console.log("🔍 User Query:", lastMessage);

    // Enhanced prompt to get better SQL generation
    const enhancedQuestion = `${lastMessage} 
    IMPORTANT: Please respond ONLY with a valid PostgreSQL SELECT query. 
    Do not include any explanations, markdown formatting, quotes, or additional text.
    Just return the raw SQL query that answers the question.
    Focus on products, categories, stock, and pricing information.`;

    // Initialize OpenAI Model for SQL generation
    const model = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY!,
      modelName: "gpt-4o",
      temperature: 0.1, // Low temperature for consistent SQL generation
    });

    // Create our custom database
    const db = await createCustomSqlDatabase();

    // Generate SQL query using LangChain
    const chain = await createSqlQueryChain({
      llm: model,
      db: db as any, 
      dialect: "postgres",
    });

    const sqlQuery = await chain.invoke({ question: enhancedQuestion });

    if (!sqlQuery || typeof sqlQuery !== "string") {
      return NextResponse.json({
        response:
          "I'm having trouble understanding that question. Could you try asking about our products in a different way?",
      });
    }

    // Clean up the SQL query
    let queryToExecute = sqlQuery
      .replace(/```sql|```/g, "") 
      .trim();

    // Security validation - only allow SELECT queries
    if (!queryToExecute.toLowerCase().startsWith("select")) {
      return NextResponse.json({
        response:
          "I can only provide information about our products. How can I help you find what you're looking for?",
      });
    }

    // Execute the query
    console.log("Generated SQL:", queryToExecute);
    const result = await queryDatabase(queryToExecute);

    // Handle empty results
    if (!result || result.length === 0) {
      return NextResponse.json({
        response:
          "I couldn't find any products matching your description. Would you like to browse our categories instead?",
      });
    }

    // Use AI to format the response in a user-friendly way
    const formattedResponse = await formatWithAI(result, lastMessage);

    return NextResponse.json({ response: formattedResponse });
  } catch (error) {
    console.error("Chatbot Error:", error);

    return NextResponse.json({
      response:
        "I'm having trouble processing your request right now. Please try asking in a different way or check back later.",
    });
  }
}
