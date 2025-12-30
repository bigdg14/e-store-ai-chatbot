// app/api/chatbot/route.ts
import { NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
import { queryDatabase } from "@/lib/server/db";

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
    // Validate request body
    let body;
    try {
      body = await req.json();
    } catch (error) {
      return NextResponse.json(
        { response: "Invalid request format. Please try again." },
        { status: 400 }
      );
    }

    const { messages } = body;

    // Validate messages array
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { response: "Please provide a valid message." },
        { status: 400 }
      );
    }

    const lastMessage = messages[messages.length - 1]?.content;

    if (!lastMessage || typeof lastMessage !== "string") {
      return NextResponse.json({
        response: "Please ask a question about our products.",
      });
    }

    // Check for API key
    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is not configured");
      return NextResponse.json(
        {
          response:
            "AI service is currently unavailable. Please try again later.",
        },
        { status: 503 }
      );
    }

    // Use the LLM-based approach with SqlDatabaseChain for natural responses
    const model = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY!,
      modelName: "gpt-4o",
      temperature: 0,
    });

    // Create our custom database
    const db = await createCustomSqlDatabase();

    // Create SQL Database Chain using LCEL (LangChain Expression Language)
    // Step 1: Generate SQL query
    const writeQuery = PromptTemplate.fromTemplate(
      `Given an input question, create a syntactically correct PostgreSQL query to run.

IMPORTANT INSTRUCTIONS:
- Return ONLY the SQL query, nothing else
- Do NOT include explanations, comments, or markdown formatting
- Do NOT wrap the query in code blocks or backticks
- Start directly with SELECT, UPDATE, INSERT, or DELETE
- Unless the user specifies a specific number of examples, query for at most 5 results using LIMIT
- Never query for all columns - only select the columns needed to answer the question
- Pay attention to column names and table names below

Only use the following tables:
{table_info}

Question: {input}
SQL Query:`
    );

    // Step 2: Answer the question based on results
    const answerPrompt = PromptTemplate.fromTemplate(
      `Given the following user question, corresponding SQL query, and SQL result, answer the user question in a friendly, natural way.
Be conversational and helpful. Format prices with dollar signs. Mention stock availability when relevant.

Question: {question}
SQL Query: {query}
SQL Result: {result}
Answer:`
    );

    // Chain everything together
    const chain = RunnableSequence.from([
      RunnablePassthrough.assign({
        query: async (input: { question: string }) => {
          let sqlQuery = await writeQuery.pipe(model).pipe(new StringOutputParser()).invoke({
            input: input.question,
            table_info: await (db as any).getTableInfo(),
          });
          console.log("🔍 Generated SQL Query (raw):", sqlQuery);

          // Clean the SQL query - remove markdown code blocks and extra formatting
          sqlQuery = sqlQuery.replace(/```sql\s*/gi, '').replace(/```\s*/g, '');
          sqlQuery = sqlQuery.trim();

          // Extract just the SELECT statement if there's explanatory text
          // Match SELECT ... and everything until semicolon or end of string
          const selectMatch = sqlQuery.match(/\b(SELECT|INSERT|UPDATE|DELETE)\b[\s\S]*?(?:;|$)/i);
          if (selectMatch) {
            sqlQuery = selectMatch[0].replace(/;$/, '').trim();
          }

          console.log("✨ Cleaned SQL Query:", sqlQuery);
          return sqlQuery;
        },
      }),
      RunnablePassthrough.assign({
        result: async (input: { query: string }) => {
          try {
            // Execute query using our custom queryDatabase function
            const queryResult = await queryDatabase(input.query);
            console.log("✅ Query Result:", queryResult);
            // Format result as JSON string for LLM to process
            return JSON.stringify(queryResult, null, 2);
          } catch (error) {
            console.error("❌ Query Execution Error:", error);
            return "No results found or query error occurred.";
          }
        },
      }),
      {
        question: (input: { question: string }) => input.question,
        query: (input: { query: string }) => input.query,
        result: (input: { result: string }) => input.result,
      },
      answerPrompt,
      model,
      new StringOutputParser(),
    ]);

    // Invoke the chain
    const response = await chain.invoke({ question: lastMessage });

    console.log("💬 Final Response:", response);

    return NextResponse.json({ response });
  } catch (error) {
    console.error("🚨 LangChain Query Error:", error);

    // More specific error messages based on error type
    if (error instanceof Error) {
      // Check for specific error types
      if (error.message.includes("API key")) {
        return NextResponse.json(
          {
            response:
              "AI service configuration error. Please contact support.",
          },
          { status: 500 }
        );
      }

      if (error.message.includes("timeout")) {
        return NextResponse.json(
          {
            response:
              "Request timed out. Please try with a simpler question.",
          },
          { status: 504 }
        );
      }

      if (error.message.includes("rate limit")) {
        return NextResponse.json(
          {
            response:
              "Too many requests. Please wait a moment and try again.",
          },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      {
        response:
          "I encountered an error processing your request. Please try rephrasing your question.",
      },
      { status: 500 }
    );
  }
}