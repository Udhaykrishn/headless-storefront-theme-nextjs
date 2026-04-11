"use client";

import {
  CheckCircle2,
  ChevronRight,
  RotateCcw,
  ShieldCheck,
  Star,
  ThumbsUp,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AddToCart } from "@/components/add-to-cart";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import type { ShopifyProduct } from "@/lib/shopify";
import { cn } from "@/lib/utils";
import { ProductGallery } from "@/components/product-gallery";

const REVIEWS = [
  {
    name: "Rajesh K.",
    rating: 5,
    date: "Jan 2025",
    text: "Excellent refurbished laptop! Looks brand new and works perfectly. Fast shipping and great packaging.",
  },
  {
    name: "Priya S.",
    rating: 5,
    date: "Dec 2024",
    text: "Absolutely thrilled with my purchase. The screen is crisp, keyboard is responsive, and battery lasts all day.",
  },
  {
    name: "Arun M.",
    rating: 4,
    date: "Nov 2024",
    text: "Good condition and speedy delivery. Minor scratch on the lid but overall great value for money.",
  },
];

export function ProductDetailView({ product }: { product: ShopifyProduct }) {
  const allImages = product.images.edges.map((e) => e.node);
  const [activeTab, setActiveTab] = useState<
    "description" | "specs" | "shipping"
  >("description");

  const price = product.priceRange.maxVariantPrice;
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currencyCode,
  }).format(parseFloat(price.amount));

  const isAvailable = product.variants.edges.some(
    (e) => e.node.availableForSale,
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />

      <main className="flex-1 pt-16">
        {/* ── Breadcrumb ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-indigo-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link
              href="/shop"
              className="hover:text-indigo-600 transition-colors"
            >
              Shop
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-900 font-medium truncate max-w-[200px]">
              {product.title}
            </span>
          </nav>
        </div>

        {/* ── Main Product Section ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Left: Image Gallery */}
            <div className="space-y-4">
              <ProductGallery images={allImages} title={product.title} />

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: CheckCircle2, label: "Grade A+", sub: "Like new" },
                  { icon: ShieldCheck, label: "1-Year", sub: "Warranty" },
                  { icon: ThumbsUp, label: "Tested", sub: "& Certified" },
                ].map((badge) => (
                  <div
                    key={badge.label}
                    className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl bg-white border border-slate-100 shadow-sm text-center"
                  >
                    <badge.icon className="w-5 h-5 text-indigo-600" />
                    <span className="text-xs font-semibold text-slate-800 leading-tight">
                      {badge.label}
                    </span>
                    <span className="text-[10px] text-slate-500 leading-tight">
                      {badge.sub}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Product Info */}
            <div className="flex flex-col gap-6">
              {/* Tags */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold tracking-wide border border-indigo-100">
                  {product.productType || "Refurbished Laptop"}
                </span>
                {isAvailable ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    In Stock
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-semibold border border-red-100">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">
                {product.title}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={cn(
                        "w-4 h-4",
                        s <= 4
                          ? "fill-amber-400 text-amber-400"
                          : "fill-amber-200 text-amber-200",
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm text-slate-600 font-medium">
                  4.8{" "}
                  <span className="text-slate-400 font-normal">
                    (24 reviews)
                  </span>
                </span>
                <a
                  href="#reviews"
                  className="text-xs text-indigo-600 hover:underline ml-1"
                >
                  See all reviews
                </a>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 py-4 border-y border-slate-100">
                <span className="text-4xl font-bold text-slate-900 tabular-nums">
                  {formattedPrice}
                </span>
                <span className="text-sm text-slate-400 font-medium">
                  {price.currencyCode}
                </span>
              </div>

              {/* Short description */}
              <div
                className="text-sm text-slate-600 [&>ul]:space-y-1.5 [&>ul]:list-disc [&>ul]:pl-4 [&>ul>li]:text-slate-600 [&>p]:text-slate-600 [&>p]:leading-relaxed max-w-none"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />

              {/* Add to Cart with variant selectors */}
              <div className="space-y-4">
                <AddToCart product={product} />
              </div>

              {/* Delivery & Returns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                    <Truck className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Free Delivery
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Ships within 2–4 business days
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                    <RotateCcw className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      7-Day Returns
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Hassle-free return policy
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Info Tabs ── */}
        <section className="border-t border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex border-b border-slate-200 overflow-x-auto">
              {(
                [
                  { key: "description", label: "Description" },
                  { key: "specs", label: "Specifications" },
                  { key: "shipping", label: "Shipping & Returns" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "flex-shrink-0 py-4 px-6 text-sm font-medium border-b-2 transition-colors",
                    activeTab === tab.key
                      ? "border-indigo-600 text-indigo-600"
                      : "border-transparent text-slate-500 hover:text-slate-800",
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="py-10">
              {activeTab === "description" && (
                <div className="max-w-2xl">
                  <h2 className="text-xl font-bold text-slate-900 mb-4">
                    About this product
                  </h2>
                  <div
                    className="text-sm text-slate-600 [&>ul]:space-y-1.5 [&>ul]:list-disc [&>ul]:pl-4 [&>ul>li]:text-slate-600 [&>p]:text-slate-600 [&>p]:leading-relaxed [&>p]:mb-3 [&_a]:text-indigo-600 [&_a]:no-underline"
                    dangerouslySetInnerHTML={{
                      __html: product.descriptionHtml,
                    }}
                  />
                </div>
              )}

              {activeTab === "specs" && (
                <div className="max-w-2xl">
                  <h2 className="text-xl font-bold text-slate-900 mb-6">
                    Technical Specifications
                  </h2>
                  <div className="rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
                    {[
                      { label: "Brand", value: product.title.split(" ")[0] },
                      { label: "Model", value: product.title },
                      {
                        label: "Type",
                        value: product.productType || "Refurbished Laptop",
                      },
                      { label: "Condition", value: "Grade A+ Refurbished" },
                      { label: "Warranty", value: "1 Year Seller Warranty" },
                    ].map((row) => (
                      <div
                        key={row.label}
                        className="flex items-center px-5 py-3.5 odd:bg-slate-50"
                      >
                        <span className="w-40 text-sm font-medium text-slate-500 flex-shrink-0">
                          {row.label}
                        </span>
                        <span className="text-sm text-slate-800">
                          {row.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "shipping" && (
                <div className="max-w-2xl space-y-8">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-4">
                      Shipping
                    </h2>
                    <ul className="space-y-3 text-sm text-slate-600">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        Free standard delivery on all orders
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        Ships within 2–4 business days after payment
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        Securely packaged to prevent transit damage
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-4">
                      Returns
                    </h2>
                    <ul className="space-y-3 text-sm text-slate-600">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        7-day hassle-free return policy
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        Contact us within 7 days of delivery to initiate a
                        return
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        Full refund issued after product inspection
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Reviews ── */}
        <section
          id="reviews"
          className="py-16 bg-slate-50 border-t border-slate-200"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Customer Reviews
                </h2>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className="w-4 h-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <span className="text-sm text-slate-600 font-medium">
                    4.8 out of 5 · 24 reviews
                  </span>
                </div>
              </div>
              <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm">
                Write a Review
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {REVIEWS.map((review) => (
                <div
                  key={review.name}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-slate-900">
                        {review.name}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {review.date}
                      </p>
                    </div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={cn(
                            "w-3.5 h-3.5",
                            s <= review.rating
                              ? "fill-amber-400 text-amber-400"
                              : "fill-slate-200 text-slate-200",
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed flex-1">
                    &ldquo;{review.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer hover:text-indigo-600 transition-colors w-fit">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Helpful</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
