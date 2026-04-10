import { getProducts } from "@/lib/shopify";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShopSearch } from "@/components/shop-search";
import { ShopSort } from "@/components/shop-sort";
import { TrendingUp, Clock, ArrowUpNarrowWide, ArrowDownWideNarrow } from "lucide-react";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const sort =
    typeof resolvedParams.sort === "string" ? resolvedParams.sort : "";
  const query = typeof resolvedParams.q === "string" ? resolvedParams.q : "";
  const view = typeof resolvedParams.view === "string" ? resolvedParams.view : "grid";
  const after =
    typeof resolvedParams.after === "string" ? resolvedParams.after : undefined;
  const before =
    typeof resolvedParams.before === "string"
      ? resolvedParams.before
      : undefined;

  let sortKey = "BEST_SELLING";
  let reverse = false;

  if (sort === "price-asc") {
    sortKey = "PRICE";
    reverse = false;
  } else if (sort === "price-desc") {
    sortKey = "PRICE";
    reverse = true;
  } else if (sort === "newest") {
    sortKey = "CREATED_AT";
    reverse = true;
  }

  const productsData = await getProducts({
    sortKey,
    reverse,
    query,
    after,
    before,
    first: before ? undefined : 20,
    last: before ? 20 : undefined,
  });

  const products = productsData.edges.map((e) => ({
    ...e.node,
    cursor: e.cursor,
  }));
  const pageInfo = productsData.pageInfo;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-gray-900">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <h1 className="text-4xl font-extrabold tracking-tight">Shop</h1>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto flex-1 md:justify-end">
            <div className="flex-1 sm:max-w-[320px] relative">
              <ShopSearch defaultValue={query} />
              {query && (
                <p className="absolute -bottom-5 left-1 text-[10px] sm:text-xs text-gray-500 whitespace-nowrap">
                  Showing results for <span className="font-semibold text-gray-900">"{query}"</span>
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Desktop Sort Pills */}
              <div className="hidden lg:flex items-center gap-2 px-1">
                <Link
                  href={`/shop?sort=best-selling${query ? `&q=${query}` : ""}`}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all border ${!sort || sort === "best-selling"
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                      : "bg-white text-gray-600 border-gray-200 hover:border-indigo-200 hover:bg-indigo-50"
                    }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  Best Selling
                </Link>

                <Link
                  href={`/shop?sort=newest${query ? `&q=${query}` : ""}`}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all border ${sort === "newest"
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                      : "bg-white text-gray-600 border-gray-200 hover:border-indigo-200 hover:bg-indigo-50"
                    }`}
                >
                  <Clock className="w-4 h-4" />
                  Newest
                </Link>

                <Link
                  href={`/shop?sort=price-asc${query ? `&q=${query}` : ""}`}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all border ${sort === "price-asc"
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                      : "bg-white text-gray-600 border-gray-200 hover:border-indigo-200 hover:bg-indigo-50"
                    }`}
                >
                  <ArrowUpNarrowWide className="w-4 h-4" />
                  Price: Low to High
                </Link>

                <Link
                  href={`/shop?sort=price-desc${query ? `&q=${query}` : ""}`}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all border ${sort === "price-desc"
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                      : "bg-white text-gray-600 border-gray-200 hover:border-indigo-200 hover:bg-indigo-50"
                    }`}
                >
                  <ArrowDownWideNarrow className="w-4 h-4" />
                  Price: High to Low
                </Link>
              </div>

              {/* Mobile Sort Dropdown */}
              <div className="flex-1 sm:flex-none lg:hidden">
                <ShopSort currentSort={sort} />
              </div>

              <div className="flex items-center gap-1 border-l border-gray-200 pl-2 sm:pl-3 ml-1 lg:hidden">
                <Link
                  href={`/shop?${new URLSearchParams({ ...resolvedParams, view: "grid" }).toString()}`}
                  className={`p-2.5 rounded-xl transition-all border h-11 w-11 flex items-center justify-center ${view === "grid" ? "bg-indigo-600 text-white border-indigo-600 shadow-md" : "bg-white text-gray-400 border-gray-200 hover:border-indigo-200"}`}
                  title="Grid View"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                </Link>
                <Link
                  href={`/shop?${new URLSearchParams({ ...resolvedParams, view: "list" }).toString()}`}
                  className={`p-2.5 rounded-xl transition-all border h-11 w-11 flex items-center justify-center ${view === "list" ? "bg-indigo-600 text-white border-indigo-600 shadow-md" : "bg-white text-gray-400 border-gray-200 hover:border-indigo-200"}`}
                  title="List View"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filters */}
          <div className="hidden md:block col-span-1 border-r border-gray-200 pr-8">
            <h3 className="font-semibold text-lg mb-4">Categories</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/shop"
                  className="text-sm font-medium hover:underline text-gray-600"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?q=workstation"
                  className="text-sm font-medium hover:underline text-gray-600"
                >
                  Workstations
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?q=gaming"
                  className="text-sm font-medium hover:underline text-gray-600"
                >
                  Gaming
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?q=ultrabook"
                  className="text-sm font-medium hover:underline text-gray-600"
                >
                  Ultrabooks
                </Link>
              </li>
            </ul>
          </div>

          {/* Products Grid */}
          <div className="col-span-1 md:col-span-3">
            {products.length === 0 ? (
              <div className="py-20 text-center text-gray-500 text-lg">
                No products found.
              </div>
            ) : (
              <>
                <div className={`grid ${view === "grid" ? "grid-cols-2 gap-3 sm:gap-8" : "grid-cols-1 gap-8"} sm:grid-cols-2 lg:grid-cols-3`}>
                  {products.map((product) => {
                    const price = product.priceRange.maxVariantPrice;
                    const formattedPrice = new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: price.currencyCode,
                    }).format(parseFloat(price.amount));

                    return (
                      <Link
                        key={product.id}
                        href={`/products/${product.handle}`}
                        className="group flex flex-col cursor-pointer"
                      >
                        <div className="aspect-square relative rounded-xl overflow-hidden bg-white mb-3 shadow-sm border border-black/5">
                          <Image
                            src={product.images.edges[0]?.node?.url || ""}
                            alt={product.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <h3 className="font-medium text-sm sm:text-lg leading-tight group-hover:underline underline-offset-4 decoration-2 h-10 line-clamp-2">
                          {product.title}
                        </h3>
                        <p className="text-gray-600 mt-1 font-semibold text-xs sm:text-base">
                          {formattedPrice}
                        </p>
                      </Link>
                    );
                  })}
                </div>

                <div className="mt-12 flex justify-center gap-4">
                  {pageInfo.hasPreviousPage && (
                    <Link
                      href={`/shop?${new URLSearchParams({ ...(sort && { sort }), ...(query && { q: query }), before: pageInfo.startCursor }).toString()}`}
                    >
                      <Button variant="outline">Previous</Button>
                    </Link>
                  )}
                  {pageInfo.hasNextPage && (
                    <Link
                      href={`/shop?${new URLSearchParams({ ...(sort && { sort }), ...(query && { q: query }), after: pageInfo.endCursor }).toString()}`}
                    >
                      <Button variant="outline">Next</Button>
                    </Link>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
