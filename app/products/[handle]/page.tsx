import { getProduct } from "@/lib/shopify";
import { notFound } from "next/navigation";
import Image from "next/image";
import { AddToCart } from "@/components/add-to-cart";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const handle = (await params).handle;
  const product = await getProduct(handle);

  if (!product) return notFound();

  const price = product.priceRange.maxVariantPrice;
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currencyCode,
  }).format(parseFloat(price.amount));

  // The first image
  const mainImage = product.images.edges[0]?.node;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-gray-900">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          {/* Images Section */}
          <div className="space-y-4">
            {mainImage ? (
              <div className="aspect-square relative rounded-2xl overflow-hidden bg-white shadow-sm border border-black/5">
                <Image
                  src={mainImage.url}
                  alt={mainImage.altText || product.title}
                  fill
                  className="object-cover object-center"
                  priority
                />
              </div>
            ) : (
              <div className="aspect-square bg-gray-200 rounded-2xl flex items-center justify-center">
                <span className="text-gray-400">No Image</span>
              </div>
            )}

            <div className="grid grid-cols-4 gap-4">
              {product.images.edges.slice(1).map((imageEdge, i) => (
                <div
                  key={i}
                  className="aspect-square border border-black/5 relative rounded-xl overflow-hidden cursor-pointer hover:opacity-80 transition-opacity bg-white"
                >
                  <Image
                    src={imageEdge.node.url}
                    alt={imageEdge.node.altText || ""}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Details Section */}
          <div className="flex flex-col pt-4">
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">
              {product.title}
            </h1>
            <p className="text-2xl font-semibold mb-6 text-gray-700">
              {formattedPrice}
            </p>

            <div
              className="prose prose-gray mb-8"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />

            <AddToCart product={product} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
