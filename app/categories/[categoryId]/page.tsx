"use client";

import { useProducts } from "@/hooks/useProducts";
import CategoryProduct from "@/components/categoryProduct";
import { useParams } from "next/navigation";
import { Product } from "@/types/products";
import { useEffect, useState } from "react";
import { getCategoryById } from "@/lib/fetcher"; // ✅ Function to fetch category details

export default function CategoryPage() {
  const { categoryId } = useParams();
  const { products = [], loading, error } = useProducts(Number(categoryId));

  const [categoryTitle, setCategoryTitle] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategoryTitle() {
      if (!categoryId) return;
      const category = await getCategoryById(Number(categoryId)); // ✅ Fetch category details
      setCategoryTitle(category?.title || "Unknown Category");
    }

    fetchCategoryTitle();
  }, [categoryId]);

  console.log("products working here: ", products);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Error loading products: {error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        {categoryTitle} {/* ✅ Displays category title instead of ID */}
      </h2>

      <div className="grid grid-cols-1 gap-6">
        {products.length > 0 ? (
          products.map((product: Product) => (
            <CategoryProduct key={product.id} {...product} />
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-400">
            No products found in this category.
          </p>
        )}
      </div>
    </div>
  );
}
