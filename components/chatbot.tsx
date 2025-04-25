"use client";

import { useState, useRef, useEffect } from "react";
import { Send, X, MessageSquare, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Message = {
  role: "user" | "bot";
  content: string;
};

export default function Chatbot() {
  const [chatVisible, setChatVisible] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggestions to help users get started
  const suggestions = [
    "What products do you have in stock?",
    "What's your cheapest television?",
    "Do you have fridges with a capacity over 300 liters?",
    "Which smartphones do you have?",
  ];

  // Auto-scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Toggle Chat Window
  const toggleChat = () => setChatVisible(!chatVisible);

  // Handle User Input Submission
  const handleSubmit = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user" as const, content: input };
    const newMessages = [...messages, userMessage];
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
      setMessages([
        ...newMessages,
        {
          role: "bot",
          content: "Sorry, I encountered an error. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Use a suggestion as input
  const useSuggestion = (suggestion: string) => {
    setInput(suggestion);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        aria-label={chatVisible ? "Close chat" : "Open chat"}
        className="fixed bottom-5 right-5 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg flex items-center justify-center transition-all z-50"
        onClick={toggleChat}
      >
        {chatVisible ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {/* Chat Window */}
      {chatVisible && (
        <div className="fixed bottom-16 right-5 bg-white dark:bg-gray-900 shadow-lg rounded-lg w-80 md:w-96 z-50 flex flex-col max-h-[500px] overflow-hidden border border-gray-200 dark:border-gray-700">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <MessageSquare size={18} className="mr-2" />
              Store Assistant
            </h3>
            <p className="text-xs text-gray-500">Ask me about our products!</p>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto max-h-[300px]">
            {messages.length === 0 ? (
              <div className="space-y-4">
                <div className="bg-gray-200 dark:bg-gray-800 p-3 rounded-lg inline-block max-w-[85%]">
                  <p className="text-gray-800 dark:text-gray-200">
                    Hi there! I'm your store assistant. What can I help you with
                    today?
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-gray-500">Try asking:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => useSuggestion(suggestion)}
                        className="text-xs bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full px-3 py-1 text-gray-700 dark:text-gray-300"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`p-3 rounded-lg max-w-[85%] ${
                        msg.role === "user"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-200 dark:bg-gray-800 p-3 rounded-lg">
                      <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex">
              <input
                type="text"
                placeholder="Ask about products..."
                className="flex-1 p-2 border rounded-l-md text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                disabled={loading}
              />
              <Button
                onClick={handleSubmit}
                disabled={loading || !input.trim()}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-r-md px-3 py-2 flex items-center justify-center disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send size={18} />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
