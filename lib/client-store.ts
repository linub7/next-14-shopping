import { create } from 'zustand';

import { CartState } from '@/types/@types/cart';

export const useCartStore = create<CartState>((set) => ({
  cart: [],
  addToCart: (item) =>
    set((state) => {
      const existingItem = state.cart.find(
        (cartItem) => cartItem.variant.variantID === item.variant.variantID
      );
      if (existingItem) {
        const updatedCart = state.cart.map((cartItem) => {
          if (cartItem.variant.variantID === item.variant.variantID) {
            return {
              ...cartItem,
              variant: {
                ...cartItem.variant,
                quantity: cartItem.variant.quantity + item.variant.quantity,
              },
            };
          }
          return cartItem;
        });
        return { cart: updatedCart };
      } else {
        return {
          cart: [
            ...state.cart,
            {
              ...item,
              variant: {
                variantID: item.variant.variantID,
                quantity: item.variant.quantity,
              },
            },
          ],
        };
      }
    }),
}));
