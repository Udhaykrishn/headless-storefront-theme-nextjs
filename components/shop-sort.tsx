"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  TrendingUp, 
  Clock, 
  ArrowUpNarrowWide, 
  ArrowDownWideNarrow,
  ChevronDown
} from "lucide-react";

export function ShopSort({ currentSort = "" }: { currentSort?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "best-selling") {
      params.set("sort", value);
    } else {
      params.delete("sort");
    }
    router.push(`/shop?${params.toString()}`);
  };

  const sortOptions = [
    { value: "best-selling", label: "Best Selling", icon: TrendingUp },
    { value: "newest", label: "Newest", icon: Clock },
    { value: "price-asc", label: "Price: Low to High", icon: ArrowUpNarrowWide },
    { value: "price-desc", label: "Price: High to Low", icon: ArrowDownWideNarrow },
  ];

  const currentOption = sortOptions.find(opt => opt.value === (currentSort || "best-selling"));

  return (
    <div className="w-full lg:w-fit">
      <Select value={currentSort || "best-selling"} onValueChange={handleSortChange}>
        <SelectTrigger className="h-11 rounded-xl bg-white border-gray-200 text-sm font-medium focus:ring-indigo-500/20 w-full lg:w-[200px] shadow-sm hover:border-indigo-200 transition-colors">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent 
          position="popper" 
          sideOffset={4} 
          align="start"
          className="rounded-xl border-gray-200 shadow-xl p-1 w-[var(--radix-select-trigger-width)] z-[100]"
        >
          {sortOptions.map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              className="rounded-lg py-2.5 cursor-pointer focus:bg-indigo-50 focus:text-indigo-600"
            >
              <div className="flex items-center gap-2.5">
                <option.icon className="w-4 h-4 text-gray-400" />
                <span>{option.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
