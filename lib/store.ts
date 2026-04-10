import { create } from "zustand";
import { persist } from "zustand/middleware";

type CartState = {
  cartId: string | null;
  totalQuantity: number;
  isCartOpen: boolean;
  setCartId: (id: string | null) => void;
  setCartData: (id: string | null, totalQuantity: number) => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cartId: null,
      totalQuantity: 0,
      isCartOpen: false,
      setCartId: (id) => set({ cartId: id }),
      setCartData: (id, totalQuantity) => set({ cartId: id, totalQuantity }),
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({ cartId: state.cartId, totalQuantity: state.totalQuantity }), // Persist cartId and quantity
    },
  ),
);
