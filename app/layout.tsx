import type { Metadata } from "next";
import "@/styles/globals.css";
import Navbar from "@/components/navbar";
import { CartProvider } from "@/context/cartContext";
import Chatbot from "@/components/chatbot";
import { Toaster } from "sonner";
import { ErrorBoundary } from "@/components/error-boundary";
import { AuthProvider } from "@/components/auth-provider";

export const metadata: Metadata = {
  title: "SmartCart - AI-Powered Shopping Assistant | Modern E-Commerce",
  description:
    "Shop smarter with SmartCart - an AI-powered e-commerce platform built with Next.js 15, React 19, and OpenAI. Browse products, get AI recommendations, and enjoy an intelligent shopping experience.",
  keywords: [
    "SmartCart",
    "e-commerce",
    "AI chatbot",
    "online shopping",
    "Next.js",
    "React",
    "AI shopping assistant",
    "smart shopping",
  ],
  authors: [{ name: "SmartCart" }],
  openGraph: {
    title: "SmartCart - AI-Powered Shopping Assistant",
    description:
      "Shop smarter with our intelligent AI-powered e-commerce platform",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ErrorBoundary>
            <CartProvider>
              <Navbar />
              <main className="container mx-auto px-4">{children}</main>
              <Chatbot />
              <Toaster richColors position="top-right" />
            </CartProvider>
          </ErrorBoundary>
        </AuthProvider>
      </body>
    </html>
  );
}
