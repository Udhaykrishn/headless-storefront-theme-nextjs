"use client";

import Link from "next/link";
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

import { ArrowUpRight, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";

export function Faq() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            FAQs
          </h2>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {FAQS.map((faq, _index) => (
            <AccordionItem
              key={faq.question}
              value={faq.question}
              className="border border-slate-200 rounded-2xl px-6 bg-white shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
              <AccordionTrigger className="text-left font-semibold text-slate-900 py-6 hover:no-underline hover:text-indigo-600 transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 leading-relaxed pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-20 text-center bg-indigo-50 rounded-3xl p-10 border border-indigo-100/50">
          <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-200">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <p className="text-slate-900 font-bold text-lg mb-2">
            Still have questions?
          </p>
          <p className="text-slate-600 mb-8 max-w-sm mx-auto">
            Can't find the answer you're looking for? Reach out to our team.
          </p>
          <Link href="/contact" className="inline-block">
            <Button
              size="lg"
              className="rounded-full px-10 h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg shadow-indigo-100 hover:shadow-indigo-200 transition-all"
            >
              Contact Support
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
