"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, 
  ChevronLeft, 
  Loader2, 
  Lock, 
  Minus, 
  Plus, 
  ShoppingBag, 
  Trash2, 
  ShieldCheck,
  Truck,
  RotateCcw
} from "lucide-react";
import { toast } from "sonner";
import { getCartData, removeFromCart, updateCartLine } from "@/app/actions/cart";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function CartPage() {
  const { cartId, setCartData } = useCartStore();
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [updatingLines, setUpdatingLines] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (cartId) {
      setLoading(true);
      getCartData(cartId)
        .then((data) => {
          if (!data) setCartData(null, 0);
          else {
            setCart(data);
            setCartData(data.id, data.totalQuantity);
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [cartId, setCartData]);

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
        toast.success("Item removed from cart");
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
          <p className="text-sm font-medium text-slate-500 animate-pulse">Loading your cart...</p>
        </div>
      </div>
    );
  }

  const isEmpty = !cart || cart.lines.edges.length === 0;

  if (isEmpty) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col pt-20">
        <div className="max-w-2xl mx-auto px-6 w-full text-center">
          <div className="mb-8 inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-white border border-slate-100 shadow-xl shadow-slate-200/50">
            <ShoppingBag className="w-10 h-10 text-slate-200" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4 font-display">Your cart is feeling light</h1>
          <p className="text-slate-500 mb-10 max-w-sm mx-auto">
            Looks like you haven&apos;t added anything to your cart yet. Browse our collection of premium laptops to get started.
          </p>
          <Button asChild size="lg" className="rounded-2xl px-10 h-14 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200">
            <Link href="/shop" className="gap-2">
              Start Shopping
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/30 pb-24 lg:pb-32">
      {/* ── Cart Header ── */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-30 pt-8 pb-6 shadow-sm shadow-slate-100/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <Link 
              href="/shop" 
              className="group flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Continue Shopping
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 font-display">Shopping Cart</h1>
              <div className="h-6 px-2.5 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                <span className="text-xs font-bold text-indigo-700 tabular-nums">
                  {cart.totalQuantity}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start text-indigo-500 ">
          {/* ── Left Side: Cart Items ── */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="divide-y divide-slate-50">
                {cart.lines.edges.map((edge: any) => {
                  const line = edge.node;
                  const merch = line.merchandise;
                  const isUpdating = updatingLines.has(line.id);

                  return (
                    <div 
                      key={line.id} 
                      className={cn(
                        "p-6 lg:p-8 flex flex-col sm:flex-row gap-6 lg:gap-8 transition-all duration-300",
                        isUpdating && "opacity-50 pointer-events-none scale-[0.99]"
                      )}
                    >
                      {/* Product Image */}
                      <div className="relative w-full sm:w-40 aspect-square rounded-3xl overflow-hidden border border-slate-100 bg-slate-50 flex-shrink-0 group">
                        {merch.image ? (
                          <Image
                            src={merch.image.url}
                            alt={merch.image.altText || merch.product.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="w-10 h-10 text-slate-200" />
                          </div>
                        )}
                        <Link 
                          href={`/products/${merch.product.handle}`} 
                          className="absolute inset-0 z-10"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 flex flex-col justify-between py-2">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <Link 
                                href={`/products/${merch.product.handle}`}
                                className="text-lg lg:text-xl font-bold text-slate-900 hover:text-indigo-600 transition-colors"
                              >
                                {merch.product.title}
                              </Link>
                              {merch.title && merch.title !== "Default Title" && (
                                <p className="text-sm font-medium text-slate-400 mt-1">
                                  {merch.title}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-lg lg:text-xl font-black text-slate-900 tabular-nums">
                                {(parseFloat(merch.price.amount) * line.quantity).toLocaleString("en-US", {
                                  style: "currency",
                                  currency: merch.price.currencyCode,
                                })}
                              </p>
                              <p className="text-xs font-semibold text-slate-400 mt-1">
                                {parseFloat(merch.price.amount).toLocaleString("en-US", {
                                  style: "currency",
                                  currency: merch.price.currencyCode,
                                })} / each
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-6">
                          {/* Quantity Controls */}
                          <div className="flex items-center p-1 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
                            <button
                              onClick={() => handleQuantity(line.id, line.quantity, -1)}
                              disabled={isPending || isUpdating}
                              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white hover:text-indigo-600 hover:shadow-sm border border-transparent transition-all disabled:opacity-40"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-12 text-center text-sm font-black text-slate-900 tabular-nums">
                              {line.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantity(line.id, line.quantity, 1)}
                              disabled={isPending || isUpdating}
                              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white hover:text-indigo-600 hover:shadow-sm border border-transparent transition-all disabled:opacity-40"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <button
                            onClick={() => handleRemove(line.id)}
                            disabled={isPending || isUpdating}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-40 group"
                          >
                            <Trash2 className="w-4 h-4 group-hover:shake" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Benefits Row ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
              <div className="p-6 rounded-3xl bg-indigo-50 border border-indigo-100 flex flex-col items-center text-center gap-3">
                <Truck className="w-6 h-6 text-indigo-600" />
                <span className="text-xs font-bold text-indigo-900 uppercase tracking-widest leading-loose">Fast Delivery</span>
              </div>
              <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-100 flex flex-col items-center text-center gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                <span className="text-xs font-bold text-emerald-900 uppercase tracking-widest leading-loose">Secure Warranty</span>
              </div>
              <div className="p-6 rounded-3xl bg-amber-50 border border-amber-100 flex flex-col items-center text-center gap-3">
                <RotateCcw className="w-6 h-6 text-amber-600" />
                <span className="text-xs font-bold text-amber-900 uppercase tracking-widest leading-loose">Easy Return</span>
              </div>
            </div>
          </div>

          {/* ── Right Side: Summary ── */}
          <div className="lg:col-span-4 sticky top-32">
            <div className="p-8 lg:p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50">
              <h2 className="text-xl font-bold text-slate-900 mb-8 font-display italic ">Order Summary</h2>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Subtotal</span>
                  <span className="text-slate-900 font-bold tabular-nums italic">
                    {parseFloat(cart.cost.subtotalAmount.amount).toLocaleString("en-US", {
                      style: "currency",
                      currency: cart.cost.subtotalAmount.currencyCode,
                    })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Shipping</span>
                  <span className="text-emerald-600 font-bold uppercase text-[10px] tracking-widest leading-loose">Free Delivery</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Estimated Tax</span>
                  <span className="text-slate-900 font-bold tabular-nums italic ">$0.00</span>
                </div>
                
                <div className="h-px bg-slate-50 w-full my-6" />
                
                <div className="flex justify-between items-baseline mb-10">
                  <span className="text-lg font-bold text-slate-900 font-display">Total Price</span>
                  <div className="text-right">
                    <span className="text-3xl font-black text-indigo-600 tabular-nums font-display leading-[0px]">
                      {parseFloat(cart.cost.totalAmount.amount).toLocaleString("en-US", {
                        style: "currency",
                        currency: cart.cost.totalAmount.currencyCode,
                      })}
                    </span>
                    <p className="text-[10px] items-center italic  font-black text-slate-400 mt-2 uppercase tracking-widest opacity-3 px-10">Inclusive of all taxes</p>
                  </div>
                </div>

                <Button 
                  asChild
                  className="w-full h-16 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg shadow-xl shadow-indigo-100 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <a href={cart.checkoutUrl} className="gap-3">
                    <Lock className="w-5 h-5 opacity-50" />
                    Complete Purchase
                    <ArrowRight className="w-5 h-5 flex-shrink-0" />
                  </a>
                </Button>

                <div className="flex items-center justify-center gap-3 pt-6">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-10 h-6 bg-slate-50 border border-slate-100 rounded flex items-center justify-center">
                        <div className="w-6 h-3 bg-slate-200 rounded-sm opacity-50" />
                      </div>
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Global Secure Pay</span>
                </div>
              </div>
            </div>

            <p className="mt-8 text-center text-xs text-slate-400 leading-normal px-6">
              Tax and shipping will be calculated during checkout based on your delivery address.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
