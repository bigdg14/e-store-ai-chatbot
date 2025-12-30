"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/productCard";
import CategoryProduct from "@/components/categoryProduct";
import { getCategoryById } from "@/lib/fetcher";
import { Product, Category } from "@/types/products";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Grid3x3, List, SlidersHorizontal, Package } from "lucide-react";

type ViewMode = "grid" | "list";
type SortOption = "name-asc" | "name-desc" | "price-asc" | "price-desc";

export default function CategoryPage() {
  const { categoryId } = useParams();
  const parsedCategoryId = categoryId ? Number(categoryId) : undefined;

  const { products = [], loading, error } = useProducts(parsedCategoryId);

  const [category, setCategory] = useState<Category | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function fetchCategory() {
      if (!parsedCategoryId) return;

      try {
        const response = await getCategoryById(parsedCategoryId);
        setCategory(response?.data || null);
      } catch (err) {
        console.error("Error fetching category:", err);
      }
    }

    fetchCategory();
  }, [parsedCategoryId]);

  // Calculate price range from products
  useEffect(() => {
    if (products.length > 0) {
      const prices = products.map((p: Product) => p.price);
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      setPriceRange([Math.floor(min), Math.ceil(max)]);
    }
  }, [products]);

  // Sort and filter products
  const filteredAndSortedProducts = products
    .filter((product: Product) => {
      return product.price >= priceRange[0] && product.price <= priceRange[1];
    })
    .sort((a: Product, b: Product) => {
      switch (sortBy) {
        case "name-asc":
          return a.title.localeCompare(b.title);
        case "name-desc":
          return b.title.localeCompare(a.title);
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-6 w-48 mb-6" />
        <Skeleton className="h-10 w-64 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-64 w-full rounded-xl" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg border border-destructive/20">
          <p>Error loading products: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Categories", href: "/categories" },
          { label: category?.title || "Products" },
        ]}
      />

      {/* Category Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-5xl">{category?.icon || "📦"}</span>
          <h1 className="text-4xl font-bold">{category?.title}</h1>
        </div>
        {category?.description && (
          <p className="text-muted-foreground text-lg max-w-3xl">
            {category.description}
          </p>
        )}
        <div className="mt-4 text-sm text-muted-foreground">
          Showing {filteredAndSortedProducts.length} of {products.length}{" "}
          products
        </div>
      </div>

      {/* Toolbar: Filters, Sort, View Toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <SlidersHorizontal size={16} />
            Filters
          </Button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-3 py-2 rounded-md border bg-background text-sm"
            aria-label="Sort products"
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <Grid3x3 size={16} />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List size={16} />
          </Button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="mb-6 p-4 border rounded-lg bg-card">
          <h3 className="font-semibold mb-4">Price Range</h3>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={0}
              max={Math.ceil(Math.max(...products.map((p: Product) => p.price)))}
              value={priceRange[1]}
              onChange={(e) =>
                setPriceRange([priceRange[0], parseInt(e.target.value)])
              }
              className="flex-1"
              aria-label="Maximum price filter"
            />
            <span className="text-sm font-medium min-w-[100px]">
              Up to ${priceRange[1]}
            </span>
          </div>
        </div>
      )}

      {/* Products Display */}
      {filteredAndSortedProducts.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedProducts.map((product: Product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredAndSortedProducts.map((product: Product) => (
              <CategoryProduct key={product.id} {...product} />
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-16">
          <Package size={64} className="mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg text-muted-foreground">
            No products found matching your filters.
          </p>
        </div>
      )}
    </div>
  );
}
