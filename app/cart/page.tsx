"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cartContext";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  const router = useRouter(); // ✅ Router for navigation

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Shopping Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-6">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border p-4 rounded-lg bg-white dark:bg-gray-800"
            >
              <Image
                src={`/images/${item.image}`}
                alt={item.title}
                width={100}
                height={100}
                className="rounded-md"
              />
              <p className="text-lg">{item.title}</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                ${item.price}
              </p>
              <Button
                onClick={() => removeFromCart(item.id)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Remove
              </Button>
            </div>
          ))}
          <div className="flex justify-between">
            <Button
              onClick={clearCart}
              className="bg-gray-800 text-white px-6 py-2 rounded-lg"
            >
              Clear Cart
            </Button>
            <Button
              onClick={() => router.push("/checkout")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
