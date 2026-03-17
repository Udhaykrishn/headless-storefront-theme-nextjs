import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// biome-ignore lint/suspicious/noExplicitAny: Passing any since shopify node type is extensive
export function FeaturedProducts({ products }: { products: any[] }) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pb-28">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-xl">
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
              Featured Items
            </h2>
            <p className="text-lg text-gray-500">
              Handpicked selections that represent the best of our collection.
              Trending now and designed to impress.
            </p>
          </div>
          <Button
            variant="link"
            className="text-gray-900 font-semibold p-0 hover:text-black"
          >
            View All Products &rarr;
          </Button>
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
              <Card
                key={product.id}
                className="group overflow-hidden rounded-3xl border-gray-100 shadow-sm transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 bg-white flex flex-col h-full"
              >
                <div className="aspect-[4/5] relative overflow-hidden bg-gray-100/50 p-6 flex items-center justify-center">
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full text-black shadow-sm">
                      New
                    </span>
                  </div>
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={altText}
                      fill
                      className="object-contain p-6 mix-blend-multiply group-hover:scale-110 transition-transform duration-700 ease-in-out"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium">
                      No Image Available
                    </div>
                  )}
                  {/* Subtle hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 pointer-events-none transition-colors duration-500" />
                </div>

                <div className="p-6 flex flex-col grow justify-between bg-white z-10 relative">
                  <div>
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-amber-800 transition-colors">
                        {product.title}
                      </h3>
                    </div>

                    <div
                      className="text-sm text-gray-500 line-clamp-2 leading-relaxed"
                      // biome-ignore lint/security/noDangerouslySetInnerHtml: Shopify description
                      dangerouslySetInnerHTML={{
                        __html: product.descriptionHtml || "",
                      }}
                    />
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-xl font-black text-gray-900 whitespace-nowrap">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: currencyCode,
                      }).format(price)}
                    </p>
                    <Button
                      size="icon"
                      className="rounded-full bg-black text-white hover:bg-gray-800 hover:scale-105 active:scale-95 transition-all shadow-md"
                    >
                      <svg
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14" />
                        <path d="M12 5v14" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
