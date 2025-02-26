"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useProducts } from "@/hooks/useProducts";
import CategoryProduct from "@/components/categoryProduct";
import { getCategoryById } from "@/lib/fetcher";
import { Product } from "@/types/products";

export default function CategoryPage() {
  const { categoryId } = useParams();
  const parsedCategoryId = categoryId ? Number(categoryId) : undefined; // Change to undefined

  // ✅ Fetch products using existing hook
  const { products = [], loading, error } = useProducts(parsedCategoryId);

  // ✅ State for category title
  const [categoryTitle, setCategoryTitle] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategoryTitle() {
      if (!parsedCategoryId) return;

      try {
        const response = await getCategoryById(parsedCategoryId);
        setCategoryTitle(response?.data?.title || "Unknown Category");
      } catch (err) {
        console.error("Error fetching category:", err);
        setCategoryTitle("Unknown Category");
      }
    }

    fetchCategoryTitle();
  }, [parsedCategoryId]);

  // ✅ Loading State
  if (loading)
    return <p className="text-center text-gray-500">Loading products...</p>;
  if (error)
    return (
      <p className="text-center text-red-500">
        Error loading products: {error}
      </p>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ✅ Display Category Title */}
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        {categoryTitle}
      </h2>

      {/* ✅ Products Grid */}
      <div className="grid grid-cols-1 gap-6">
        {products.length > 0 ? (
          products.map((product: Product) => (
            <CategoryProduct key={product.id} {...product} />
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-400 text-center">
            No products found in this category.
          </p>
        )}
      </div>
    </div>
  );
}
