"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/context/cartContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CategoryProductProps {
  id: number;
  title: string;
  image: string;
  specs: {
    dimensions: string;
    capacity?: string;
  };
  features: string[] | null | undefined; // Allow null or undefined
  price: number;
  stock: number;
}

export default function CategoryProduct({
  id,
  title,
  image,
  specs,
  features, // Remove default value here
  price,
  stock,
}: CategoryProductProps) {
  const router = useRouter();
  const { addToCart } = useCart();

  return (
    <article className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white dark:bg-gray-800 p-6 shadow-md rounded-lg border border-gray-200 dark:border-gray-700">
      {/* ✅ Column 1: Product Image */}
      <figure className="flex justify-center items-center">
        <img
          src={`/images/${image}`}
          alt={title}
          className="w-full h-auto max-w-[500px] rounded-md shadow-md"
        />
      </figure>

      {/* ✅ Column 2: Product Description */}
      <aside className="flex flex-col space-y-4">
        {/* Title */}
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          <Link href={`/products/${id}`} className="hover:underline">
            {title}
          </Link>
        </h2>

        {/* Specs */}
        <div className="text-gray-700 dark:text-gray-300">
          <p>
            <strong>Dimensions:</strong> {specs.dimensions}
          </p>
          {specs.capacity && (
            <p>
              <strong>Capacity:</strong> {specs.capacity}
            </p>
          )}
        </div>

        {/* Features */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            Features
          </h3>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
            {Array.isArray(features) ? ( // Check if features is an array
              features.map((feature, index) => <li key={index}>{feature}</li>)
            ) : (
              <li>No features listed.</li>
            )}
          </ul>
        </div>
      </aside>

      {/* ✅ Column 3: Price, Stock, and Buttons */}
      <aside className="flex flex-col items-center space-y-4">
        {/* Price */}
        <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          ${price}
        </div>

        {/* Stock Level */}
        <div className="p-3 bg-gray-300 dark:bg-gray-700 rounded-md w-fit text-right">
          <p className="font-bold text-gray-800 dark:text-gray-200">
            Stock Level: {stock}
          </p>
          <p className="text-green-700 dark:text-green-400">FREE Delivery</p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col space-y-2 w-fit">
          <Button
            onClick={() => router.push(`/products/${id}`)}
            variant="outline"
            className="w-full"
          >
            View Product
          </Button>
          <Button
            onClick={() => addToCart({ id, title, price, image, quantity: 1 })}
            className="w-full"
          >
            Add to Cart
          </Button>
        </div>
      </aside>
    </article>
  );
}
