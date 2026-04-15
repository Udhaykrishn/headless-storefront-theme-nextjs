"use client";

import { useEffect, useRef } from "react";
import {
  getCartData,
  saveCartToCustomer,
  updateCartBuyerIdentity,
} from "@/app/actions/cart";
import { getCustomer } from "@/app/actions/customer";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/lib/store";

export function CartInitializer() {
  const { cartId, totalQuantity, setCartData } = useCartStore();
  const pathname = usePathname();
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

          // Case 1: Browser has an active cart, and it's different from what's in the cloud
          if (cartId && cartId !== savedCartId) {
            // We only push to cloud if the local cart has items
            // If local cart is empty (quantity 0) but cloud has one, we should probably prefer cloud
            if (totalQuantity > 0) {
              await saveCartToCustomer(customer.id, cartId);
              console.log("Synced local cart to customer profile");
            } 
            else if (savedCartId) {
              // Local is empty, but cloud has a cart. Load the cloud one.
              const remoteCart = await getCartData(savedCartId);
              if (remoteCart && remoteCart.totalQuantity > 0) {
                setCartData(remoteCart.id, remoteCart.totalQuantity);
                isSyncing.current = false;
                return;
              }
            }
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
  }, [cartId, setCartData, pathname]); // Added pathname to trigger sync on navigation

  return null;
}
