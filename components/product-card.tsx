"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { QuickAdd } from "./quick-add";

interface ProductCardProps {
  product: {
    handle: string;
    title: string;
    priceRange?: {
      maxVariantPrice: { amount: string; currencyCode: string };
    };
    images?: {
      edges: Array<{ node: { url: string; altText: string } }>;
    };
    variants?: {
      edges: Array<{
        node: { id: string; availableForSale: boolean };
      }>;
    };
  };
  view?: "grid" | "list";
  className?: string;
}

export function ProductCard({
  product,
  view = "grid",
  className,
}: ProductCardProps) {
  const price = parseFloat(product.priceRange?.maxVariantPrice?.amount || "0");
  const currencyCode =
    product.priceRange?.maxVariantPrice?.currencyCode || "USD";
  const imageUrl = product.images?.edges[0]?.node?.url;
  const altText = product.images?.edges[0]?.node?.altText || product.title;

  const firstVariant = product.variants?.edges[0]?.node;
  const variantId = firstVariant?.id;
  const availableForSale = firstVariant?.availableForSale ?? false;

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(price);

  if (view === "list") {
    return (
      <div
        className={cn(
          "group flex flex-row bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 h-48",
          className,
        )}
      >
        <Link
          href={`/products/${product.handle}`}
          className="relative w-48 flex-shrink-0 overflow-hidden bg-slate-50"
        >
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                role="img"
                aria-label="No image available"
              >
                <title>No image available</title>
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15.5 16.5 11 11 16.5" />
              </svg>
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
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {formattedPrice}
            </p>
          </div>

          <div className="flex justify-start">
            {variantId && (
              <QuickAdd
                variantId={variantId}
                availableForSale={availableForSale}
                className="group-hover:bg-indigo-600 group-hover:text-white px-6 py-2 h-auto flex items-center gap-2"
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group flex flex-col h-full bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300",
        className,
      )}
    >
      <Link
        href={`/products/${product.handle}`}
        className="block relative aspect-square overflow-hidden bg-slate-50"
      >
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
          <p className="text-xl font-bold text-slate-900">{formattedPrice}</p>
          {variantId && (
            <QuickAdd
              variantId={variantId}
              availableForSale={availableForSale}
              className="group-hover:bg-indigo-600 group-hover:text-white"
            />
          )}
        </div>
      </div>
    </div>
  );
}
