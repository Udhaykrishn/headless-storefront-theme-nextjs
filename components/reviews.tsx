"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const REVIEWS = [
  {
    id: 1,
    name: "Sarah Jenkins",
    handle: "@sarahj",
    content:
      "Absolutely love the quality of the new spring collection. The fabric feels premium and the fit is perfect.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=sarahj",
  },
  {
    id: 2,
    name: "Michael Chen",
    handle: "@mchen_opts",
    content:
      "Fast shipping and incredible customer service. The minimalist design is exactly what I was looking for.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=mchen",
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    handle: "@elenar",
    content:
      "I've bought three items so far and they never disappoint. The attention to detail is unmatched.",
    rating: 4,
    avatar: "https://i.pravatar.cc/150?u=elena",
  },
];

export function Reviews() {
  return (
    <section className="bg-white py-24 sm:py-32 border-y border-gray-100">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-lg font-semibold leading-8 tracking-tight text-amber-600">
            Testimonials
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Loved by thousand of shoppers
          </p>
        </div>
        <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-auto lg:max-w-none">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {REVIEWS.map((review) => (
              <figure
                key={review.id}
                className="rounded-3xl bg-gray-50/80 p-8 shadow-sm ring-1 ring-gray-900/5 transition-all hover:-translate-y-2 hover:shadow-xl hover:bg-white flex flex-col justify-between h-full"
              >
                <blockquote className="text-gray-900 flex-1">
                  <div className="flex gap-1 mb-6 text-amber-400">
                    {[...Array(review.rating)].map((_, i) => (
                      <svg
                        aria-hidden="true"
                        key={`star-filled-${review.id}-${i}`}
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        stroke="none"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                    {[...Array(5 - review.rating)].map((_, i) => (
                      <svg
                        aria-hidden="true"
                        key={`star-empty-${review.id}-${i}`}
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-300"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-lg leading-relaxed">{`"${review.content}"`}</p>
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-x-4 border-t border-gray-100 pt-6">
                  <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                    <AvatarImage src={review.avatar} alt={review.name} />
                    <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-bold text-gray-900">{review.name}</div>
                    <div className="text-sm text-gray-500">{review.handle}</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
