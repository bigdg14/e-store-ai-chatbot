"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getCategories, getProducts } from "@/lib/fetcher";
import { Category, Product } from "@/types/products";

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
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-background to-primary/5 border-b">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Welcome to SmartCart
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Shop smarter with our AI-powered shopping assistant
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/categories"
                className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
              >
                Browse Products
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center px-8 py-3 bg-card text-card-foreground font-semibold rounded-lg hover:bg-accent transition-all border"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Featured Product Section */}
        {featuredProduct && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">Featured Product</h2>
              <div className="h-1 flex-1 ml-6 bg-gradient-to-r from-primary/50 to-transparent rounded-full"></div>
            </div>
            <div className="bg-card border rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="flex flex-col md:flex-row">
                {/* Product Image */}
                <div className="md:w-2/5 bg-muted/30 p-8 flex items-center justify-center">
                  <Image
                    src={`/images/${featuredProduct.image}`}
                    alt={featuredProduct.title}
                    width={400}
                    height={400}
                    className="w-full h-auto rounded-lg object-contain"
                  />
                </div>

                {/* Product Details */}
                <div className="md:w-3/5 p-8">
                  <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">
                    Special Offer
                  </div>
                  <h2 className="text-3xl font-bold mb-4">
                    {featuredProduct.title}
                  </h2>
                  <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                    {featuredProduct.description}
                  </p>
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-4xl font-bold text-primary">
                      ${featuredProduct.price}
                    </span>
                    <span className="text-muted-foreground line-through">
                      ${(featuredProduct.price * 1.2).toFixed(2)}
                    </span>
                  </div>
                  <Link
                    href={`/products/${featuredProduct.id}`}
                    className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Categories Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Shop by Category</h2>
            <div className="h-1 flex-1 ml-6 bg-gradient-to-r from-primary/50 to-transparent rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.id}`}
                className="group relative overflow-hidden bg-card border rounded-xl p-8 hover:shadow-lg transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  {/* Category Icon */}
                  <div className="text-5xl mb-4">{category.icon || "📦"}</div>

                  <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {category.title}
                  </h3>

                  {category.description && (
                    <p className="text-muted-foreground group-hover:text-foreground transition-colors mb-3 line-clamp-2">
                      {category.description}
                    </p>
                  )}

                  {/* Product Count Badge */}
                  {category.productCount !== undefined && (
                    <div className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-semibold mb-3">
                      {category.productCount} Products
                    </div>
                  )}

                  <div className="mt-4 inline-flex items-center text-primary font-semibold group-hover:translate-x-1 transition-transform">
                    Browse →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
