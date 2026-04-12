"use client";

import { useEffect } from "react";
import { getCartData, updateCartBuyerIdentity } from "@/app/actions/cart";
import { useCartStore } from "@/lib/store";

export function CartInitializer() {
  const { cartId, setCartData } = useCartStore();

  useEffect(() => {
    if (cartId) {
      getCartData(cartId)
        .then(async (cart) => {
          if (cart) {
            setCartData(cart.id, cart.totalQuantity);

            // If user is logged in but cart doesn't have an email, sync it
            if (!cart.buyerIdentity?.email) {
              const updatedCart = await updateCartBuyerIdentity(cartId);
              if (updatedCart) {
                setCartData(updatedCart.id, updatedCart.totalQuantity);
              }
            }
          } else {
            setCartData(null, 0);
          }
        })
        .catch(() => {
          setCartData(null, 0);
        });
    }
  }, [cartId, setCartData]);

  return null;
}
