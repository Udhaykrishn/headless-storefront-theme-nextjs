import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { getPage } from "@/lib/shopify";

export const revalidate = 60;

type Props = {
  params: Promise<{ handle: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  try {
    const page = await getPage(handle);
    if (!page) return { title: "Page | RebootX" };
    return {
      title: `${page.seo?.title || page.title} | RebootX`,
      description:
        page.seo?.description || `Read about ${page.title} on RebootX.`,
    };
  } catch {
    return { title: "Page | RebootX" };
  }
}

export default async function StaticPage({ params }: Props) {
  const { handle } = await params;
  const page = await getPage(handle);

  if (!page) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white flex flex-col text-gray-900">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-6 sm:px-8 lg:px-10 py-24 w-full">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-12 text-center">
          {page.title}
        </h1>

        <div
          className="prose prose-lg max-w-none 
            prose-headings:font-black prose-headings:tracking-tighter
            prose-p:text-gray-600 prose-p:leading-relaxed
            prose-a:text-black prose-strong:text-black
            prose-img:rounded-3xl prose-img:shadow-xl"
          dangerouslySetInnerHTML={{ __html: page.body }}
        />
      </main>
      <Footer />
    </div>
  );
}
