"use client";

import { useState, useEffect } from "react";
import { getProducts } from "@/lib/fetcher";
import { Product } from "@/types/products"; // ✅ Import Product type

export function useProducts(categoryId?: number) {
  // ✅ Change to number | undefined
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (categoryId === undefined) return; // ✅ Explicitly check for undefined

    async function fetchData() {
      try {
        const response = await getProducts(categoryId);
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          console.error("Expected array but got:", response.data);
          setProducts([]);
        }
      } catch (err) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [categoryId]);

  return { products, loading, error };
}
