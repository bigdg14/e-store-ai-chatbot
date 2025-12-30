"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getCategories } from "@/lib/fetcher";
import { Category } from "@/types/products";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Package } from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
      } catch {
        setError("Failed to load categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: "Categories" }]} />

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3">Browse Categories</h1>
        <p className="text-muted-foreground text-lg">
          Explore our wide range of products across different categories
        </p>
      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-6 border border-destructive/20">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && categories.length === 0 && (
        <div className="text-center py-16">
          <Package size={64} className="mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg text-muted-foreground">
            No categories found.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.id}`}
            className="group relative overflow-hidden bg-card border rounded-xl hover:shadow-xl transition-all duration-300"
          >
            {/* Background gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative p-8">
              {/* Icon */}
              <div className="text-6xl mb-4">{category.icon || "📦"}</div>

              {/* Category Info */}
              <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                {category.title}
              </h2>

              {category.description && (
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {category.description}
                </p>
              )}

              {/* Product Count Badge */}
              {category.productCount !== undefined && (
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold mb-4">
                  <Package size={14} />
                  {category.productCount} Products
                </div>
              )}

              {/* Arrow */}
              <div className="flex items-center text-primary font-semibold group-hover:translate-x-2 transition-transform">
                Browse Products
                <ArrowRight size={20} className="ml-2" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
