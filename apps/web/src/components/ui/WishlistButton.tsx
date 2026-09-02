"use client";

import React from "react";
import { useWishlist } from "@/stores/WishlistContext";
import type { Product } from "@/types";

interface WishlistButtonProps {
  product: Product;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function WishlistButton({ product, className = "", size = "md" }: WishlistButtonProps) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  const sizeClasses = {
    sm: "w-7 h-7 p-1",
    md: "w-9 h-9 p-2",
    lg: "w-11 h-11 p-2.5",
  };

  const iconSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product);
      }}
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      className={`rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-md ${
        wishlisted
          ? "bg-rose-50 text-rose-600 border border-rose-200 shadow-sm"
          : "bg-white/90 text-navy hover:text-rose-600 hover:bg-white border border-border shadow-sm hover:scale-105"
      } ${sizeClasses[size]} ${className}`}
    >
      <svg
        className={`${iconSizes[size]} transition-transform active:scale-125`}
        fill={wishlisted ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.75}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
}
