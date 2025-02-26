import { NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { createSqlQueryChain } from "langchain/chains/sql_db";
import { queryDatabase } from "@/lib/server/db"; // ✅ Corrected import path
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { HumanMessage } from "@langchain/core/messages";

// ... (rest of your code)

// We'll create a simple mock for the SqlDatabase
// that implements the required interface
const createCustomSqlDatabase = async () => {
  // First, get table info for the database
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

  // Create a mock database object that mimics SqlDatabase
  const mockDb = {
    // Store the table information
    _tableInfo: tableInfo,

    // Implement the query method
    async query(query: string): Promise<any[]> {
      return await queryDatabase(query);
    },

    // Implement getTableInfo method
    async getTableInfo(): Promise<any[]> {
      return this._tableInfo;
    },

    // Add any other required methods/properties
    appDataSourceOptions: {
      type: "postgres",
    },

    // The dialect for SQL generation
    dialect: "postgres",

    // Sample rows in table info
    sampleRowsInTableInfo: 3,
  };

  return mockDb;
};

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1]?.content;

    if (!lastMessage) {
      return NextResponse.json({
        response: "Please ask a question about our products.",
      });
    }

    console.log("🔍 User Query:", lastMessage);

    // ✅ Initialize OpenAI Model
    const model = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY!,
      modelName: "gpt-4o",
    });

    // Create our custom database
    const db = await createCustomSqlDatabase();

    // ✅ Generate SQL query using LangChain
    const chain = await createSqlQueryChain({
      llm: model,
      db: db as any, // Use type assertion to satisfy TypeScript
      dialect: "postgres",
    });

    const sqlQuery = await chain.invoke({ question: lastMessage });
    console.log("sqlQuery = " + sqlQuery);

    if (!sqlQuery || typeof sqlQuery !== "string") {
      return NextResponse.json({ response: "Failed to generate SQL query." });
    }

    if (!sqlQuery.toLowerCase().startsWith("select")) {
      return NextResponse.json({
        response: "❌ Only SELECT queries are allowed.",
      });
    }

    console.log("📝 Generated SQL:", sqlQuery);

    // ✅ Run the query
    const result = await queryDatabase(sqlQuery);

    if (!result || result.length === 0) {
      return NextResponse.json({ response: "No matching products found." });
    }

    const formattedResponse = result
      .map((row) =>
        Object.entries(row)
          .map(([key, value]) => `**${key}**: ${value}`)
          .join("\n")
      )
      .join("\n\n");

    return NextResponse.json({ response: formattedResponse });
  } catch (error) {
    console.error("🚨 LangChain Query Error:", error);

    return NextResponse.json({
      response: "Something went wrong. Please try again.",
    });
  }
}
