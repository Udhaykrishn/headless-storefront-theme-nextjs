"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store";
import { addToCart } from "@/app/actions/cart";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { ShopifyProduct } from "@/lib/shopify";

export function AddToCart({ product }: { product: ShopifyProduct }) {
  const [isPending, setIsPending] = useState(false);
  const { cartId, setCartId, openCart } = useCartStore();

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
      setCartId(cart.id);
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
    <div className="space-y-6">
      <div className="space-y-4">
        {product.options.map((option) => (
          <div key={option.name}>
            <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide mb-2">
              {option.name}
            </h3>
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
                    className={`px-4 py-2 text-sm font-medium border rounded-md transition-all ${
                      isSelected
                        ? "border-black bg-black text-white ring-1 ring-black ring-offset-1"
                        : "border-gray-200 bg-white text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <Button
        size="lg"
        onClick={handleAdd}
        disabled={isPending || !selectedVariant?.availableForSale}
        className="w-full h-14 text-lg font-medium shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
        {!isPending && !selectedVariant?.availableForSale
          ? "Out of Stock"
          : "Add to Cart"}
      </Button>
    </div>
  );
}
