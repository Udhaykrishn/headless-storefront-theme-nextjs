"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    question: "How do you grade your refurbished laptops?",
    answer:
      "All our laptops undergo a 90-point inspection and are graded as 'A+', 'A', or 'B'. Grade 'A+' units are virtually indistinguishable from new, while 'B' units offer deeper discounts for slight cosmetic wear.",
  },
  {
    question: "What kind of warranty do you provide?",
    answer:
      "We provide a comprehensive 1-year limited warranty on all refurbished hardware, covering defects and component failures. We also offer extended protection plans at checkout.",
  },
  {
    question: "Is the battery life guaranteed?",
    answer:
      "Yes! Every laptop is tested to ensure the battery holds at least 80% of its original design capacity. If a battery falls below this threshold during testing, we replace it with a new one.",
  },
  {
    question: "Can I upgrade the RAM or storage?",
    answer:
      "For many of our workstation and business series models, upgrades are available. You can select RAM and SSD upgrades directly on the product page before adding to your cart.",
  },
];

import { ArrowUpRight } from "lucide-react";

export function Faq() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-16 lg:gap-24">
        <div className="lg:w-1/3">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-slate-600 leading-relaxed">
            Everything you need to know about our products, shipping, and
            returns. Can't find the answer you're looking for? Reach out to our
            team.
          </p>

          <div className="mt-8">
            <a
              href="mailto:support@nextstore.com"
              className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
            >
              Contact Support <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="lg:w-2/3">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {FAQS.map((faq, _index) => (
              <AccordionItem
                key={faq.question}
                value={faq.question}
                className="border rounded-xl px-6 bg-white shadow-sm overflow-hidden"
              >
                <AccordionTrigger className="text-left font-bold text-slate-900 py-6 hover:no-underline hover:text-indigo-600 transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
