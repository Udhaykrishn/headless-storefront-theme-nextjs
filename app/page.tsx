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
    <div className="min-h-screen flex flex-col text-slate-900 selection:bg-indigo-500 selection:text-white transition-colors">
      <Header />
      <main className="flex-1 relative">
        <Hero />
        <div className="relative z-10 space-y-24 pb-24 lg:pb-48">
          <FeaturedProducts products={products} />
          <Reviews />
          <Faq />
        </div>
      </main>
      <Footer />
    </div>
  );
}
