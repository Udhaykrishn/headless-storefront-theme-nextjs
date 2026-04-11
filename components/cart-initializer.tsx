"use client";

import { useEffect } from "react";
import { useCartStore } from "@/lib/store";
import { getCartData } from "@/app/actions/cart";

export function CartInitializer() {
  const { cartId, setCartData } = useCartStore();

  useEffect(() => {
    if (cartId) {
      getCartData(cartId)
        .then((cart) => {
          if (cart) {
            setCartData(cart.id, cart.totalQuantity);
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
