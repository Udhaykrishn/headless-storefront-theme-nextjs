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

export function Faq() {
  return (
    <section className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col lg:flex-row gap-16">
        <div className="lg:w-1/3">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Can't find the answer you're looking for? Reach out to our customer
            support team directly.
          </p>
          <div className="mt-8">
            <a
              href="mailto:support@example.com"
              className="inline-flex items-center gap-2 font-medium text-black hover:text-amber-700 transition-colors"
            >
              <span className="h-10 w-10 rounded-full bg-black flex items-center justify-center">
                <svg
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </span>
              Contact Support
            </a>
          </div>
        </div>

        <div className="lg:w-2/3">
          <Accordion
            type="single"
            collapsible
            className="w-full bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
          >
            {FAQS.map((faq) => (
              <AccordionItem
                key={faq.question}
                value={faq.question}
                className="border-b border-gray-100 last:border-0"
              >
                <AccordionTrigger className="text-left text-lg font-bold text-gray-900 hover:text-amber-700 py-6 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 text-base leading-relaxed pb-6">
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
