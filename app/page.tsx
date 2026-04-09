import { Faq } from "@/components/faq";
import { FeaturedProducts } from "@/components/featured-products";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Reviews } from "@/components/reviews";
import { getProducts } from "@/lib/shopify";

export const revalidate = 0;

export default async function Home() {
  const productsData = await getProducts();
  const products = productsData.edges.map((e) => e.node);

  return (
    <div className="min-h-screen bg-white text-gray-900 selection:bg-amber-100 selection:text-amber-900 flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <FeaturedProducts products={products} />
        <Reviews />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
