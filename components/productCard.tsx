"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/cartContext";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  id: number;
  title: string;
  image: string;
  price: number;
  stock: number;
  description?: string;
}

export default function ProductCard({
  id,
  title,
  image,
  price,
  stock,
  description,
}: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <div className="group bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Product Image */}
      <Link href={`/products/${id}`} className="block relative aspect-square bg-muted/30 overflow-hidden">
        <Image
          src={`/images/${image}`}
          alt={title}
          fill
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
        />
        {stock < 5 && stock > 0 && (
          <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            Only {stock} left!
          </div>
        )}
        {stock === 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            Out of Stock
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <Link href={`/products/${id}`}>
          <h3 className="font-semibold text-foreground mb-2 line-clamp-2 hover:text-primary transition-colors min-h-[3rem]">
            {title}
          </h3>
        </Link>

        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {description}
          </p>
        )}

        <div className="flex items-center justify-between mt-4">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-primary">${price}</span>
            <span className="text-xs text-green-600 dark:text-green-400">
              FREE Delivery
            </span>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Button
            onClick={() => addToCart({ id, title, price, image, quantity: 1 })}
            disabled={stock === 0}
            className="flex-1"
          >
            <ShoppingCart size={16} className="mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
