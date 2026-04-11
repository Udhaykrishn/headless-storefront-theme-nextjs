"use client";

import { useEffect, useState, useTransition } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { useCartStore } from "@/lib/store";
import {
  getCartData,
  removeFromCart,
  updateCartLine,
} from "@/app/actions/cart";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Loader2,
  ShoppingBag,
  Trash2,
  Minus,
  Plus,
  ArrowRight,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function CartSheet() {
  const { isCartOpen, closeCart, cartId, setCartData } = useCartStore();
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  // Track which line IDs are currently updating
  const [updatingLines, setUpdatingLines] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isCartOpen && cartId) {
      setLoading(true);
      getCartData(cartId)
        .then((data) => {
          if (!data) setCartData(null, 0);
          else {
            setCart(data);
            setCartData(data.id, data.totalQuantity);
          }
        })
        .catch(() => setCartData(null, 0))
        .finally(() => setLoading(false));
    }
  }, [isCartOpen, cartId]);

  function markUpdating(lineId: string, active: boolean) {
    setUpdatingLines((prev) => {
      const next = new Set(prev);
      active ? next.add(lineId) : next.delete(lineId);
      return next;
    });
  }

  function handleRemove(lineId: string) {
    if (!cartId) return;
    markUpdating(lineId, true);
    startTransition(async () => {
      try {
        const updatedCart = await removeFromCart(cartId, [lineId]);
        setCart(updatedCart);
        setCartData(updatedCart.id, updatedCart.totalQuantity);
        toast.success("Item removed");
      } catch {
        toast.error("Failed to remove item");
      } finally {
        markUpdating(lineId, false);
      }
    });
  }

  function handleQuantity(lineId: string, currentQty: number, delta: number) {
    if (!cartId) return;
    const newQty = currentQty + delta;
    if (newQty < 1) {
      handleRemove(lineId);
      return;
    }
    markUpdating(lineId, true);
    startTransition(async () => {
      try {
        const updatedCart = await updateCartLine(cartId, lineId, newQty);
        setCart(updatedCart);
        setCartData(updatedCart.id, updatedCart.totalQuantity);
      } catch {
        toast.error("Failed to update quantity");
      } finally {
        markUpdating(lineId, false);
      }
    });
  }

  const isEmpty =
    !cartId ||
    !cart ||
    (cart && cart.lines.edges.length === 0);

  return (
    <Sheet open={isCartOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="w-full sm:max-w-[420px] flex flex-col bg-white p-0 gap-0 border-l border-slate-200 shadow-2xl">

        {/* ── Header ── */}
        <SheetHeader className="px-6 pt-6 pb-5 border-b border-slate-100">
          <SheetTitle className="flex items-center gap-2.5 text-base font-semibold text-slate-900">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50">
              <ShoppingBag className="w-4 h-4 text-indigo-600" />
            </div>
            Your Cart
            {cart && cart.lines.edges.length > 0 && (
              <span className="ml-auto text-xs font-medium text-slate-400 tabular-nums">
                {cart.totalQuantity} {cart.totalQuantity === 1 ? "item" : "items"}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {/* ── Scrollable item list ── */}
        <div className="flex-1 overflow-y-auto">

          {/* Loading skeleton */}
          {loading && (
            <div className="flex justify-center items-center h-full py-20">
              <Loader2 className="w-7 h-7 animate-spin text-indigo-400" />
            </div>
          )}

          {/* Empty state */}
          {!loading && isEmpty && (
            <div className="flex flex-col items-center justify-center h-full gap-4 px-6 py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                <ShoppingBag className="w-7 h-7 text-slate-300" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">Your cart is empty</p>
                <p className="text-xs text-slate-400 mt-1">Add items to get started</p>
              </div>
            </div>
          )}

          {/* Cart lines */}
          {!loading && cart && cart.lines.edges.length > 0 && (
            <div className="divide-y divide-slate-50 px-6">
              {cart.lines.edges.map((edge: any) => {
                const line = edge.node;
                const merch = line.merchandise;
                const lineTotal =
                  parseFloat(merch.price.amount) * line.quantity;
                const isUpdating = updatingLines.has(line.id);

                return (
                  <div
                    key={line.id}
                    className={cn(
                      "flex gap-4 py-5 transition-opacity duration-200",
                      isUpdating && "opacity-50 pointer-events-none"
                    )}
                  >
                    {/* Thumbnail */}
                    <div className="relative w-[72px] h-[72px] rounded-xl overflow-hidden border border-slate-100 bg-slate-50 flex-shrink-0">
                      {merch.image ? (
                        <Image
                          src={merch.image.url}
                          alt={merch.image.altText || merch.product.title}
                          fill
                          className="object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-6 h-6 text-slate-200" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between gap-2">
                      <div className="flex items-start gap-1 justify-between">
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold text-slate-800 leading-snug truncate pr-1">
                            {merch.product.title}
                          </h3>
                          {merch.title && merch.title !== "Default Title" && (
                            <p className="text-xs text-slate-400 mt-0.5 truncate">
                              {merch.title}
                            </p>
                          )}
                        </div>
                        {/* Remove button */}
                        <button
                          onClick={() => handleRemove(line.id)}
                          disabled={isPending || isUpdating}
                          className="flex-shrink-0 p-1.5 rounded-md text-slate-300 hover:text-red-400 hover:bg-red-50 transition-colors disabled:opacity-40"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Quantity stepper + line total */}
                      <div className="flex items-center justify-between">
                        {/* Stepper */}
                        <div className="flex items-center gap-0 border border-slate-200 rounded-lg overflow-hidden bg-white">
                          <button
                            onClick={() => handleQuantity(line.id, line.quantity, -1)}
                            disabled={isPending || isUpdating}
                            className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors disabled:opacity-40 active:bg-slate-100"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold text-slate-800 tabular-nums select-none">
                            {line.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantity(line.id, line.quantity, 1)}
                            disabled={isPending || isUpdating}
                            className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors disabled:opacity-40 active:bg-slate-100"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Line total */}
                        <p className="text-sm font-bold text-slate-800 tabular-nums">
                          {lineTotal.toLocaleString("en-US", {
                            style: "currency",
                            currency: merch.price.currencyCode,
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        {!loading && cart && cart.lines.edges.length > 0 && (
          <SheetFooter className="px-6 pt-4 pb-6 border-t border-slate-100 flex flex-col gap-4">
            {/* Cost breakdown */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm text-slate-500">
                <span>Subtotal</span>
                <span className="font-medium text-slate-700 tabular-nums">
                  {parseFloat(cart.cost.subtotalAmount.amount).toLocaleString(
                    "en-US",
                    {
                      style: "currency",
                      currency: cart.cost.subtotalAmount.currencyCode,
                    },
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm text-slate-500">
                <span>Shipping</span>
                <span className="text-xs font-medium text-emerald-600">
                  Calculated at checkout
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <span className="text-base font-bold text-slate-900">Total</span>
                <span className="text-base font-bold text-slate-900 tabular-nums">
                  {parseFloat(cart.cost.totalAmount.amount).toLocaleString(
                    "en-US",
                    {
                      style: "currency",
                      currency: cart.cost.totalAmount.currencyCode,
                    },
                  )}
                </span>
              </div>
            </div>

            {/* CTA */}
            <Button
              asChild
              className="w-full h-12 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-200 transition-all duration-200 active:scale-[0.98]"
              disabled={isPending}
            >
              <a
                href={cart.checkoutUrl}
                className="flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </a>
            </Button>

            {/* Trust signal */}
            <p className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
              <Lock className="w-3 h-3" />
              Secure checkout · SSL encrypted
            </p>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
