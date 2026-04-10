"use client";

import Image from "next/image";
import Link from "next/link";
import { QuickAdd } from "./quick-add";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: any;
  view?: "grid" | "list";
  className?: string;
}

export function ProductCard({ product, view = "grid", className }: ProductCardProps) {
  const price = parseFloat(
    product.priceRange?.maxVariantPrice?.amount || "0"
  );
  const currencyCode =
    product.priceRange?.maxVariantPrice?.currencyCode || "USD";
  const imageUrl = product.images?.edges[0]?.node?.url;
  const altText =
    product.images?.edges[0]?.node?.altText || product.title;

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(price);

  if (view === "list") {
    return (
      <div
        className={cn(
          "group flex flex-row bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 h-48",
          className
        )}
      >
        <Link href={`/products/${product.handle}`} className="relative w-48 flex-shrink-0 overflow-hidden bg-slate-50">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={altText}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="200px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
              No Image
            </div>
          )}
        </Link>

        <div className="p-6 flex flex-col grow justify-between">
          <div>
            <Link href={`/products/${product.handle}`}>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-tight">
                {product.title}
              </h3>
            </Link>
            <p className="mt-2 text-2xl font-bold text-slate-900">{formattedPrice}</p>
          </div>
          
          <div className="flex justify-start">
            <QuickAdd 
              variantId={product.variants?.edges[0]?.node?.id} 
              availableForSale={product.variants?.edges[0]?.node?.availableForSale}
              className="group-hover:bg-indigo-600 group-hover:text-white px-6 py-2 h-auto flex items-center gap-2"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group flex flex-col h-full bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300",
        className
      )}
    >
      <Link href={`/products/${product.handle}`} className="block relative aspect-square overflow-hidden bg-slate-50">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={altText}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
            No Image Available
          </div>
        )}
      </Link>

      <div className="p-6 flex flex-col grow">
        <Link href={`/products/${product.handle}`}>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
            {product.title}
          </h3>
        </Link>
        
        <div className="mt-4 flex items-center justify-between mt-auto">
          <p className="text-xl font-bold text-slate-900">
            {formattedPrice}
          </p>
          <QuickAdd 
            variantId={product.variants?.edges[0]?.node?.id} 
            availableForSale={product.variants?.edges[0]?.node?.availableForSale}
            className="group-hover:bg-indigo-600 group-hover:text-white"
          />
        </div>
      </div>
    </div>
  );
}
