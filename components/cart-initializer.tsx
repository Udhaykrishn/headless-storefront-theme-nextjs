"use client";

import { useEffect, useRef } from "react";
import {
  getCartData,
  saveCartToCustomer,
  updateCartBuyerIdentity,
} from "@/app/actions/cart";
import { getCustomer } from "@/app/actions/customer";
import { useCartStore } from "@/lib/store";

export function CartInitializer() {
  const { cartId, setCartData } = useCartStore();
  const isSyncing = useRef(false);

  useEffect(() => {
    async function syncCart() {
      if (isSyncing.current) return;
      isSyncing.current = true;

      try {
        const customer = await getCustomer();

        // If user is logged in
        if (customer) {
          const savedCartId = (customer as any).metafield?.value;

          // Case 1: Browser has a cart, but Shopify doesn't have it yet (or it's different)
          if (cartId && cartId !== savedCartId) {
            await saveCartToCustomer(customer.id, cartId);
          }
          // Case 2: Browser has no cart, but Shopify has one from another device
          else if (!cartId && savedCartId) {
            const remoteCart = await getCartData(savedCartId);
            if (remoteCart) {
              setCartData(remoteCart.id, remoteCart.totalQuantity);
              isSyncing.current = false;
              return;
            }
          }
        }

        // Standard initialization logic
        if (cartId) {
          const cart = await getCartData(cartId);
          if (cart) {
            setCartData(cart.id, cart.totalQuantity);

            // Ensure buyer identity is synced if logged in
            if (customer && !cart.buyerIdentity?.email) {
              const updatedCart = await updateCartBuyerIdentity(cartId);
              if (updatedCart) {
                setCartData(updatedCart.id, updatedCart.totalQuantity);
              }
            }
          } else {
            setCartData(null, 0);
          }
        }
      } catch (error) {
        console.error("Cart sync error:", error);
      } finally {
        isSyncing.current = false;
      }
    }

    syncCart();
  }, [cartId, setCartData]);

  return null;
}
