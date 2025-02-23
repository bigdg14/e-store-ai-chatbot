"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // ✅ Import useRouter
import { getProductById } from "@/lib/fetcher";
import { useCart } from "@/context/cartContext";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function ProductDetail() {
  const { id } = useParams() as { id?: string };
  const productId = id ? Number(id) : null;
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter(); // ✅ Initialize router

  useEffect(() => {
    async function fetchProduct() {
      if (!productId) {
        setError("Invalid product ID.");
        setLoading(false);
        return;
      }

      try {
        const response = await getProductById(productId);
        if (!response || response.error) {
          setError(response.error || "Product not found.");
        } else if (response.data) {
          setProduct(response.data);
        } else {
          setError("Product not found.");
        }
      } catch (err) {
        setError("Error fetching product.");
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [productId]);

  if (loading) return <p className="text-gray-500">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!product) return <p className="text-gray-500">Product not found.</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 🔙 Back Button */}
      <Button
        onClick={() => router.back()} // ✅ Navigate back
        className="mb-6 px-4 py-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-black dark:text-white rounded-lg shadow-md transition"
      >
        ← Back
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Image
          src={`/images/${product.image}`}
          alt={product.title}
          width={500}
          height={500}
          className="rounded-lg shadow-md"
        />
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {product.title}
          </h1>
          <p className="text-gray-700 dark:text-gray-300">
            {product.description}
          </p>
          <p className="text-xl font-semibold mt-4 text-blue-600">
            ${product.price}
          </p>
          <Button
            onClick={() => addToCart(product)}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
