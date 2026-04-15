import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { getCollection } from "@/lib/shopify";

export const revalidate = 60;

type Props = {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  try {
    const collection = await getCollection({ handle });
    if (!collection) return { title: "Collection | RebootX" };
    return {
      title: `${collection.title} | RebootX`,
      description:
        collection.description || `Shop our ${collection.title} collection.`,
    };
  } catch {
    return { title: "Collection | RebootX" };
  }
}

export default async function CollectionPage({ params, searchParams }: Props) {
  const { handle } = await params;
  const resolved = await searchParams;

  const sort = typeof resolved.sort === "string" ? resolved.sort : "";
  const after = typeof resolved.after === "string" ? resolved.after : undefined;

  let sortKey = "BEST_SELLING";
  let reverse = false;

  if (sort === "newest") {
    sortKey = "CREATED";
    reverse = true;
  } else if (sort === "price-asc") {
    sortKey = "PRICE";
    reverse = false;
  } else if (sort === "price-desc") {
    sortKey = "PRICE";
    reverse = true;
  } else if (sort === "title-asc") {
    sortKey = "TITLE";
    reverse = false;
  }

  const collection = await getCollection({
    handle,
    sortKey,
    reverse,
    after,
  }).catch(() => null);

  if (!collection) notFound();

  const products = collection.products.edges.map((e) => ({
    ...e.node,
    cursor: e.cursor,
  }));
  const pageInfo = collection.products.pageInfo;

  const _sortParams = sort ? `&sort=${sort}` : "";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-gray-900">
      <Header />
      <main className="flex-1 w-full">
        {/* Collection Hero Banner */}
        <div className="relative h-64 md:h-80 bg-gray-900 overflow-hidden">
          {collection.image ? (
            <>
              <Image
                src={collection.image.url}
                alt={collection.image.altText || collection.title}
                fill
                className="object-cover opacity-60"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
          )}
          <div className="relative z-10 h-full flex flex-col justify-end max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm text-white/60 mb-3">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link
                href="/collections"
                className="hover:text-white transition-colors"
              >
                Collections
              </Link>
              <span>/</span>
              <span className="text-white">{collection.title}</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
              {collection.title}
            </h1>
            {collection.description && (
              <p className="text-white/70 mt-2 max-w-xl text-sm">
                {collection.description}
              </p>
            )}
          </div>
        </div>

        {/* Products Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
          {/* Sort bar */}
          <div className="flex items-center justify-between mb-8">
            <p className="text-sm text-gray-500">
              {products.length} product{products.length !== 1 ? "s" : ""}
            </p>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 hidden sm:block">
                Sort by:
              </span>
              <div className="flex gap-2 flex-wrap">
                {[
                  { label: "Best Selling", value: "" },
                  { label: "Newest", value: "newest" },
                  { label: "Price: Low→High", value: "price-asc" },
                  { label: "Price: High→Low", value: "price-desc" },
                ].map((opt) => (
                  <Link
                    key={opt.value}
                    href={`/collections/${handle}?sort=${opt.value}`}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      sort === opt.value
                        ? "bg-black text-white border-black"
                        : "border-gray-300 text-gray-600 hover:border-gray-900 hover:text-gray-900"
                    }`}
                  >
                    {opt.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-gray-400">
              <p className="text-xl font-medium">
                No products in this collection yet
              </p>
              <Link href="/shop">
                <Button variant="outline" className="mt-6">
                  Browse all products
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-12 flex justify-center gap-4">
                {pageInfo.hasPreviousPage && (
                  <Link
                    href={`/collections/${handle}?${new URLSearchParams({ ...(sort && { sort }), before: pageInfo.startCursor }).toString()}`}
                  >
                    <Button variant="outline">← Previous</Button>
                  </Link>
                )}
                {pageInfo.hasNextPage && (
                  <Link
                    href={`/collections/${handle}?${new URLSearchParams({ ...(sort && { sort }), after: pageInfo.endCursor }).toString()}`}
                  >
                    <Button variant="outline">Next →</Button>
                  </Link>
                )}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
