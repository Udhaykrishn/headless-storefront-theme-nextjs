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
import { getCartData, removeFromCart } from "@/app/actions/cart";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Loader2, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";

export function CartSheet() {
  const { isCartOpen, closeCart, cartId, setCartId } = useCartStore();
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (isCartOpen && cartId) {
      setLoading(true);
      getCartData(cartId)
        .then((data) => {
          if (!data) setCartId(null);
          else setCart(data);
        })
        .catch(() => setCartId(null))
        .finally(() => setLoading(false));
    }
  }, [isCartOpen, cartId]);

  function handleRemove(lineId: string) {
    if (!cartId) return;
    startTransition(async () => {
      try {
        const updatedCart = await removeFromCart(cartId, [lineId]);
        setCart(updatedCart);
        toast.success("Item removed");
      } catch (e) {
        toast.error("Failed to remove item");
      }
    });
  }

  return (
    <Sheet open={isCartOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="w-full sm:max-w-md flex flex-col bg-white">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="flex flex-row items-center gap-2">
            <ShoppingBag className="w-5 h-5" /> Your Cart
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {!cartId && !loading && (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
              <ShoppingBag className="w-12 h-12 text-gray-300" />
              <p>Your cart is empty.</p>
            </div>
          )}

          {loading && (
            <div className="flex justify-center items-center h-full text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          )}

          {cart && !loading && cart.lines.edges.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
              <ShoppingBag className="w-12 h-12 text-gray-300" />
              <p>Your cart is empty.</p>
            </div>
          )}

          {cart &&
            !loading &&
            cart.lines.edges.map((edge: any) => {
              const line = edge.node;
              const merchandise = line.merchandise;
              return (
                <div
                  key={line.id}
                  className="flex gap-4 mb-4 border-b border-gray-100 pb-4 relative group"
                >
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-black/5 bg-gray-50 flex-shrink-0">
                    {merchandise.image && (
                      <Image
                        src={merchandise.image.url}
                        alt={merchandise.image.altText || ""}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-semibold pr-8 leading-tight">
                        {merchandise.product.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {merchandise.title}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-sm font-medium text-gray-600">
                        Qty: {line.quantity}
                      </p>
                      <p className="font-semibold text-sm">
                        {parseFloat(merchandise.price.amount).toLocaleString(
                          "en-US",
                          {
                            style: "currency",
                            currency: merchandise.price.currencyCode,
                          },
                        )}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemove(line.id)}
                    disabled={isPending}
                    className="absolute right-0 top-0 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
        </div>

        {cart && !loading && cart.lines.edges.length > 0 && (
          <SheetFooter className="border-t pt-4 flex flex-col gap-4">
            <div className="flex justify-between items-center text-lg font-semibold w-full">
              <span>Subtotal</span>
              <span>
                {parseFloat(cart.cost.subtotalAmount.amount).toLocaleString(
                  "en-US",
                  {
                    style: "currency",
                    currency: cart.cost.subtotalAmount.currencyCode,
                  },
                )}
              </span>
            </div>

            <Button
              asChild
              className="w-full h-12 text-md font-medium"
              size="lg"
              disabled={isPending}
            >
              <a
                href={cart.checkoutUrl}
                className="flex justify-center flex-row relative z-10 w-full"
              >
                Proceed to Checkout
              </a>
            </Button>
            <p className="text-xs text-center text-gray-500">
              Shipping and taxes calculated at checkout.
            </p>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
