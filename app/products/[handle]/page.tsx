import { getProduct } from "@/lib/shopify";
import { notFound } from "next/navigation";
import { ProductDetailView } from "./product-detail-view";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) return {};

  return {
    title: `${product.title} | RebootX`,
    description: product.description?.slice(0, 160),
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = await getProduct(handle);

  if (!product) return notFound();

  return <ProductDetailView product={product} />;
}
