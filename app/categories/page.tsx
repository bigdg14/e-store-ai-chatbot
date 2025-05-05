"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCategories } from "@/lib/fetcher";
import { Category } from "@/types/products";
import { Button } from "@/components/ui/button";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        const response = await getCategories();

        if (response.errorMessage) {
          setError(response.errorMessage);
        } else if (response.data) {
          setCategories(response.data);
        } else {
          setError("No categories found.");
        }
      } catch (err) {
        setError("Failed to load categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Product Categories
      </h1>

      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">
            Loading categories...
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && categories.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">
            No categories found.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 border border-gray-200 dark:border-gray-700"
          >
            <div className="p-6 flex flex-col h-full">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {category.title}
              </h2>

              <div className="mt-auto pt-4">
                <Button
                  onClick={() => router.push(`/categories/${category.id}`)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                >
                  View Products
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
