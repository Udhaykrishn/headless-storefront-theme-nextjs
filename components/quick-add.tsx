"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { addToCart } from "@/app/actions/cart";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface QuickAddProps {
  variantId: string;
  availableForSale: boolean;
  className?: string;
}

export function QuickAdd({ variantId, availableForSale, className }: QuickAddProps) {
  const [isPending, setIsPending] = useState(false);
  const { cartId, setCartData, openCart } = useCartStore();

  async function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!availableForSale || isPending) return;

    setIsPending(true);
    try {
      const cart = await addToCart(cartId, [
        { merchandiseId: variantId, quantity: 1 },
      ]);
      setCartData(cart.id, cart.totalQuantity);
      openCart();
      toast.success("Added to cart!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add to cart",
      );
    } finally {
      setIsPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={!availableForSale || isPending}
      className={cn(
        "p-2 rounded-lg bg-slate-100 text-slate-900 hover:bg-indigo-600 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:hover:bg-slate-100 disabled:hover:text-slate-900",
        className
      )}
      aria-label="Quick add to cart"
    >
      {isPending ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <Plus className="w-5 h-5" />
      )}
    </button>
  );
}
