"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Grid2X2, Square } from "lucide-react";
import { ProductCard } from "./product-card";
import { Button } from "./ui/button";

// biome-ignore lint/suspicious/noExplicitAny: Passing any since shopify node type is extensive
export function FeaturedProducts({ products }: { products: any[] }) {
  const [mobileCols, setMobileCols] = useState<1 | 2>(2);

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              Top Refurbished Deals
            </h2>
            <p className="mt-4 text-slate-600">
              Our highest-rated laptops, restored to factory standards and ready for work.
            </p>
          </div>
          
          <div className="flex items-center justify-between w-full md:w-auto gap-6 mt-4 md:mt-0">
            {/* Mobile-only column toggle */}
            <div className="flex md:hidden items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileCols(1)}
                className={`h-9 w-9 p-0 rounded-lg transition-all ${mobileCols === 1 ? "bg-white shadow-sm text-indigo-600" : "text-slate-500 hover:text-slate-900"}`}
                title="Single product per row"
              >
                <Square className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileCols(2)}
                className={`h-9 w-9 p-0 rounded-lg transition-all ${mobileCols === 2 ? "bg-white shadow-sm text-indigo-600" : "text-slate-500 hover:text-slate-900"}`}
                title="Two products per row"
              >
                <Grid2X2 className="w-4 h-4" />
              </Button>
            </div>

            <Link href="/shop" className="group flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors ml-auto md:ml-0">
              View All Products
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <div className={`grid gap-4 sm:gap-8 ${mobileCols === 1 ? "grid-cols-1" : "grid-cols-2"} sm:grid-cols-2 lg:grid-cols-4`}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} view="grid" />
          ))}
        </div>
      </div>
    </section>
  );
}
