import type { Metadata } from "next";
import "@/styles/globals.css";
import Navbar from "@/components/navbar";
import { CartProvider } from "@/context/cartContext";
import Chatbot from "@/components/chatbot"; // ✅ Import Chatbot

export const metadata: Metadata = {
  title: "E-Store with AI Chatbot",
  description:
    "A modern e-commerce store with an AI Chatbot built with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Navbar />
          <main className="container mx-auto px-4">{children}</main>
          <Chatbot /> {/* ✅ Add Chatbot */}
        </CartProvider>
      </body>
    </html>
  );
}
