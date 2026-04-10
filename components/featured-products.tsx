import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { QuickAdd } from "./quick-add";

// biome-ignore lint/suspicious/noExplicitAny: Passing any since shopify node type is extensive
export function FeaturedProducts({ products }: { products: any[] }) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              Top Refurbished Deals
            </h2>
            <p className="mt-4 text-slate-600">
              Our highest-rated laptops, restored to factory standards and ready for work.
            </p>
          </div>
          <Link href="/shop" className="group flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
            View All Products
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => {
            const price = parseFloat(
              product.priceRange?.maxVariantPrice?.amount || "0",
            );
            const currencyCode =
              product.priceRange?.maxVariantPrice?.currencyCode || "USD";
            const imageUrl = product.images?.edges[0]?.node?.url;
            const altText =
              product.images?.edges[0]?.node?.altText || product.title;

            return (
              <div
                key={product.id}
                className="group flex flex-col h-full bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300"
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
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
                    {product.title}
                  </h3>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-xl font-bold text-slate-900">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: currencyCode,
                      }).format(price)}
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
          })}
        </div>
      </div>
    </section>
  );
}
