"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    question: "Do you offer international shipping?",
    answer:
      "Yes, we ship globally! International shipping times and rates vary by region. All costs are calculated at checkout so there are no surprises.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We offer a 30-day return policy for unused, unworn items in their original packaging. Simply contact our support team to initiate a return process.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Once your order ships, you will receive an email with a tracking number and a link to monitor your shipment's journey in real-time.",
  },
  {
    question: "Are your products sustainably made?",
    answer:
      "Sustainability is at the core of our brand. We use eco-friendly materials whenever possible and partner with manufacturers who share our ethical standards.",
  },
];

import { Mail, ArrowUpRight } from "lucide-react";

export function Faq() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-16 lg:gap-24">
        <div className="lg:w-1/3">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-slate-600 leading-relaxed">
            Everything you need to know about our products, shipping, and returns. Can't find the answer you're looking for? Reach out to our team.
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
          <Accordion
            type="single"
            collapsible
            className="w-full space-y-4"
          >
            {FAQS.map((faq, index) => (
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
