"use client";

import { Check, Loader2, ShoppingCart, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { addToCart, createCheckout } from "@/app/actions/cart";
import type { ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function AddToCart({ product }: { product: ShopifyProduct }) {
  const [isPending, setIsPending] = useState(false);
  const [isBuyNowPending, setIsBuyNowPending] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const { cartId, setCartData, openCart } = useCartStore();

  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: string;
  }>(() => {
    const defaultOptions: { [key: string]: string } = {};
    product.options.forEach((opt) => {
      defaultOptions[opt.name] = opt.values[0];
    });
    return defaultOptions;
  });

  const selectedVariant = product.variants.edges.find((edge) => {
    return edge.node.selectedOptions.every(
      (opt) => selectedOptions[opt.name] === opt.value,
    );
  })?.node;

  async function handleAdd() {
    if (!selectedVariant) return;

    setIsPending(true);
    try {
      const cart = await addToCart(cartId, [
        { merchandiseId: selectedVariant.id, quantity: 1 },
      ]);
      setCartData(cart.id, cart.totalQuantity);
      setJustAdded(true);
      toast.success("Added to cart!");
      setTimeout(() => {
        setJustAdded(false);
        openCart();
      }, 1200);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add to cart",
      );
    } finally {
      setIsPending(false);
    }
  }

  async function handleBuyNow() {
    if (!selectedVariant) return;

    setIsBuyNowPending(true);
    try {
      const checkoutUrl = await createCheckout(selectedVariant.id, 1);
      window.location.href = checkoutUrl;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to start checkout",
      );
      setIsBuyNowPending(false);
    }
  }

  // Filter out "Title" default option (Shopify default for products without variants)
  const meaningfulOptions = product.options.filter(
    (opt) =>
      !(
        opt.name === "Title" &&
        opt.values.length === 1 &&
        opt.values[0] === "Default Title"
      ),
  );

  const isOutOfStock = selectedVariant && !selectedVariant.availableForSale;

  return (
    <div className="space-y-5">
      {/* Variant selectors */}
      {meaningfulOptions.length > 0 && (
        <div className="space-y-4">
          {meaningfulOptions.map((option) => (
            <div key={option.name}>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-slate-800">
                  {option.name}
                </label>
                <span className="text-sm text-slate-500">
                  {selectedOptions[option.name]}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {option.values.map((value) => {
                  const isSelected = selectedOptions[option.name] === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        setSelectedOptions({
                          ...selectedOptions,
                          [option.name]: value,
                        })
                      }
                      className={cn(
                        "px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all duration-150",
                        isSelected
                          ? "border-indigo-600 bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                          : "border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:text-indigo-600",
                      )}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        {/* Buy Now button */}
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={isPending || isBuyNowPending || Boolean(isOutOfStock)}
          className={cn(
            "w-full h-14 rounded-xl text-base font-bold flex items-center justify-center gap-2.5 transition-all duration-200 shadow-xl active:scale-[0.98]",
            isOutOfStock
              ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none"
              : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100 disabled:opacity-60 disabled:cursor-not-allowed",
          )}
        >
          {isBuyNowPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : isOutOfStock ? (
            "Out of Stock"
          ) : (
            <>
              <Zap className="w-5 h-5 fill-amber-400 text-amber-400" />
              Buy it now
            </>
          )}
        </button>

        {/* Add to Cart button */}
        <button
          type="button"
          onClick={handleAdd}
          disabled={isPending || isBuyNowPending || Boolean(isOutOfStock)}
          className={cn(
            "w-full h-14 rounded-xl text-base font-semibold flex items-center justify-center gap-2.5 transition-all duration-200 border-2",
            isOutOfStock
              ? "bg-slate-50 text-slate-400 cursor-not-allowed border-slate-200"
              : justAdded
                ? "bg-emerald-50 text-emerald-600 border-emerald-200 shadow-lg shadow-emerald-50"
                : "bg-white text-indigo-600 border-indigo-600 hover:bg-indigo-50 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed",
          )}
        >
          {isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : justAdded ? (
            <>
              <Check className="w-5 h-5" />
              Added to Cart
            </>
          ) : isOutOfStock ? (
            "Cannot add to cart"
          ) : (
            <>
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}
