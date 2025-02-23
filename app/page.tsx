"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getCategories, getProducts } from "@/lib/fetcher";

interface Category {
  id: number;
  title: string;
}

interface Product {
  id: number;
  title: string;
  image: string;
  description: string;
  price: number;
}

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProduct, setFeaturedProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const categoryResponse = await getCategories();
        if (categoryResponse.data) setCategories(categoryResponse.data);

        const productResponse = await getProducts();
        if (productResponse.data.length > 0) {
          const randomProduct =
            productResponse.data[
              Math.floor(Math.random() * productResponse.data.length)
            ];
          setFeaturedProduct(randomProduct);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Heading */}
      <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
        Welcome to E-Store
      </h1>

      {/* Featured Product Section */}
      {featuredProduct && (
        <div className="flex flex-col md:flex-row items-center bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md mb-10">
          {/* Product Image */}
          <Image
            src={`/images/${featuredProduct.image}`}
            alt={featuredProduct.title}
            width={400}
            height={400}
            className="w-full md:w-1/3 rounded-lg"
          />

          {/* Product Details */}
          <div className="mt-6 md:mt-0 md:ml-6 flex-1">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {featuredProduct.title}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mt-2">
              {featuredProduct.description}
            </p>
            <p className="text-xl font-bold text-blue-500 mt-4">
              ${featuredProduct.price}
            </p>
            <Link
              href={`/products/${featuredProduct.id}`}
              className="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg transition-all"
            >
              View Product
            </Link>
          </div>
        </div>
      )}

      {/* Categories Section */}
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
        Shop by Category
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.id}`}
            className="block p-4 border rounded-lg shadow-md hover:shadow-lg transition-all bg-white dark:bg-gray-900"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {category.title}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
