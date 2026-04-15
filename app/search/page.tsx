import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { searchProducts } from "@/lib/shopify";

export const metadata: Metadata = {
  title: "Search | RebootX",
  description: "Search for premium products in our store.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const query = typeof resolvedParams.q === "string" ? resolvedParams.q : "";
  const after =
    typeof resolvedParams.after === "string" ? resolvedParams.after : undefined;

  let products: Array<{
    id: string;
    handle: string;
    title: string;
    [key: string]: any;
  }> = [];
  let pageInfo = { hasNextPage: false, endCursor: "" };

  if (query) {
    const data = await searchProducts({ query, first: 20, after });
    products = data.edges.map((e) => ({ ...e.node, cursor: e.cursor }));
    pageInfo = data.pageInfo;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-gray-900">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight mb-8">
            {query ? `Search results for "${query}"` : "Search our store"}
          </h1>
          <form action="/search" method="GET" className="relative group">
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
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors"
              role="img"
              aria-label="Search"
            >
              <title>Search icon</title>
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <Input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="What are you looking for?"
              className="w-full h-14 pl-12 pr-4 bg-white border-gray-200 focus-visible:ring-black rounded-2xl shadow-sm text-lg"
              autoFocus
            />
          </form>
        </div>

        {query && products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">
              No products found for "{query}".
            </p>
            <p className="text-gray-400 mt-2">
              Try searching with different keywords.
            </p>
          </div>
        ) : (
          query && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {pageInfo.hasNextPage && (
                <div className="mt-12 flex justify-center">
                  <Link href={`/search?q=${query}&after=${pageInfo.endCursor}`}>
                    <Button
                      variant="outline"
                      size="lg"
                      className="rounded-full px-8"
                    >
                      Load More
                    </Button>
                  </Link>
                </div>
              )}
            </>
          )
        )}

        {!query && (
          <div className="py-10">
            <h2 className="text-2xl font-bold mb-6">Popular Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["Shoes", "Clothing", "Accessories", "New Arrivals"].map(
                (cat) => (
                  <Link
                    key={cat}
                    href={`/search?q=${cat.toLowerCase()}`}
                    className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-black transition-colors text-center font-medium"
                  >
                    {cat}
                  </Link>
                ),
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
