import { getProducts } from "@/lib/shopify";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShopSearch } from "@/components/shop-search";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const sort =
    typeof resolvedParams.sort === "string" ? resolvedParams.sort : "";
  const query = typeof resolvedParams.q === "string" ? resolvedParams.q : "";
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
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Shop {query && `results for "${query}"`}
          </h1>
          <div className="flex items-center gap-4 mt-4 md:mt-0 relative">
            <Link
              href={`/shop?sort=best-selling${query ? `&q=${query}` : ""}`}
              className={`text-sm ${!sort || sort === "best-selling" ? "font-bold" : "text-gray-500 hover:text-gray-900"}`}
            >
              Best Selling
            </Link>
            <Link
              href={`/shop?sort=newest${query ? `&q=${query}` : ""}`}
              className={`text-sm ${sort === "newest" ? "font-bold" : "text-gray-500 hover:text-gray-900"}`}
            >
              Newest
            </Link>
            <Link
              href={`/shop?sort=price-asc${query ? `&q=${query}` : ""}`}
              className={`text-sm ${sort === "price-asc" ? "font-bold" : "text-gray-500 hover:text-gray-900"}`}
            >
              Price: Low to High
            </Link>
            <Link
              href={`/shop?sort=price-desc${query ? `&q=${query}` : ""}`}
              className={`text-sm ${sort === "price-desc" ? "font-bold" : "text-gray-500 hover:text-gray-900"}`}
            >
              Price: High to Low
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filters */}
          <div className="hidden md:block col-span-1 border-r border-gray-200 pr-8">
            <div className="mb-6">
              <ShopSearch defaultValue={query} />
            </div>

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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
                        className="group flex flex-col cursor-pointer block"
                      >
                        <div className="aspect-square relative rounded-xl overflow-hidden bg-white mb-4 shadow-sm border border-black/5">
                          <Image
                            src={product.images.edges[0]?.node?.url || ""}
                            alt={product.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <h3 className="font-medium text-lg leading-tight group-hover:underline underline-offset-4 decoration-2">
                          {product.title}
                        </h3>
                        <p className="text-gray-600 mt-1 font-semibold">
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
