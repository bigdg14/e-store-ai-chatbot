"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCategories } from "@/lib/fetcher";

export default function Sidebar() {
  const [categories, setCategories] = useState<{ id: number; title: string }[]>(
    []
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getCategories();

        if (!response || !Array.isArray(response.data)) {
          throw new Error("Invalid category data received");
        }

        setCategories(response.data);
      } catch {
        setError("Failed to load categories");
        setCategories([]); // Ensure categories remains a valid empty array
      }
    }

    fetchData();
  }, []);

  return (
    <aside className="w-64 p-4 bg-gray-100 dark:bg-gray-900 h-full">
      <h2 className="text-lg font-semibold mb-4">Categories</h2>
      {error && <p className="text-red-500">{error}</p>}
      <ul className="space-y-2">
        {categories.length > 0
          ? categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/categories/${category.id}`}
                  className="block px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                >
                  {category.title}
                </Link>
              </li>
            ))
          : !error && <p className="text-gray-500">No categories available.</p>}
      </ul>
    </aside>
  );
}
