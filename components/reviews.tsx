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

import { Star } from "lucide-react";

export function Reviews() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center sm:text-left">
        <div className="max-w-xl mb-16 mx-auto sm:mx-0">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Customer Reviews
          </h2>
          <p className="mt-4 text-slate-600">
            See what our customers have to say about their experience with our next-generation technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {REVIEWS.map((review) => (
            <div
              key={review.id}
              className="flex flex-col bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex gap-1 mb-6 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={`star-${review.id}-${i}`}
                    className={`w-4 h-4 ${i < review.rating ? "fill-current" : "text-slate-200"}`}
                  />
                ))}
              </div>
              
              <blockquote className="flex-grow">
                <p className="text-lg text-slate-700 leading-relaxed italic">
                  "{review.content}"
                </p>
              </blockquote>

              <div className="mt-8 flex items-center gap-4 pt-6 border-t border-slate-100">
                <Avatar className="h-12 w-12 border border-slate-200">
                  <AvatarImage src={review.avatar} alt={review.name} />
                  <AvatarFallback className="bg-slate-100 text-slate-600 font-semibold">{review.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-bold text-slate-900">{review.name}</div>
                  <div className="text-xs text-slate-500 font-medium">{review.handle}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
