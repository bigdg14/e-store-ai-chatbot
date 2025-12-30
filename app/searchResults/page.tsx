"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getProductsByQuery } from "@/lib/fetcher";
import CategoryProduct from "@/components/categoryProduct";

interface Product {
  id: number;
  catId?: number;
  title: string;
  productCode?: string;
  image: string;
  price: number;
  sku?: string;
  description?: string;
  specs: { dimensions: string; capacity?: string };
  features: string[];
  stock: number;
}

export default function SearchResults() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const query = searchParams.get("s");

  useEffect(() => {
    async function fetchData() {
      if (!query) return;

      const productsData = await getProductsByQuery(query);

      if (productsData.errorMessage) {
        setError(productsData.errorMessage);
      } else {
        setProducts(productsData);
      }
    }

    fetchData();
  }, [query]);



  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Search Results</h2>

      {error && <p className="text-red-500">{error}</p>}

      <p className="text-gray-500">
        Showing {products.length} results for "{query}"
      </p>

      {products.length > 0 ? (
        <div className="space-y-6">
          {products.map((p) => (
            <CategoryProduct key={p.id} {...p} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No results found.</p>
      )}
    </div>
  );
}
