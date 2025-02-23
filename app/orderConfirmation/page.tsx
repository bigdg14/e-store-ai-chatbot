"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function OrderConfirmation() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        Order Confirmation 🎉
      </h2>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
        Thank you for placing your order! We will process it shortly.
      </p>

      <Button
        onClick={() => router.push("/")}
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
      >
        Return to Home
      </Button>
    </div>
  );
}
