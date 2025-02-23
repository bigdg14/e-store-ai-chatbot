"use client";

import { useState } from "react";
import { Send, X, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Chatbot() {
  const [chatVisible, setChatVisible] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Toggle Chat Window
  const toggleChat = () => setChatVisible(!chatVisible);

  // Handle User Input Submission
  const handleSubmit = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json();
      if (data.response) {
        setMessages([...newMessages, { role: "bot", content: data.response }]);
      }
    } catch (error) {
      console.error("Chatbot Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        className="fixed bottom-5 right-5 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg flex items-center justify-center"
        onClick={toggleChat}
      >
        {chatVisible ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {/* Chat Window */}
      {chatVisible && (
        <div className="fixed bottom-16 right-5 bg-white dark:bg-gray-900 shadow-lg rounded-lg w-80 md:w-96 p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">
            Chat with AI
          </h3>

          <div className="h-64 overflow-y-auto p-2 space-y-3">
            {messages.length === 0 && (
              <p className="text-gray-500 text-sm">Ask about our products!</p>
            )}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white self-end"
                    : "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white"
                }`}
              >
                {msg.content}
              </div>
            ))}
            {loading && (
              <p className="text-gray-500 text-sm italic">Typing...</p>
            )}
          </div>

          <div className="mt-2 flex">
            <input
              type="text"
              placeholder="Ask about our products..."
              className="flex-1 p-2 border rounded-md text-gray-900"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
            <Button onClick={handleSubmit} className="ml-2">
              <Send size={18} />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
