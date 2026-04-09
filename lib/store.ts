import { create } from "zustand";
import { persist } from "zustand/middleware";

type CartState = {
  cartId: string | null;
  isCartOpen: boolean;
  setCartId: (id: string | null) => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cartId: null,
      isCartOpen: false,
      setCartId: (id) => set({ cartId: id }),
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({ cartId: state.cartId }), // Persist only cartId
    },
  ),
);
