import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { CartState } from '@/types/@types/cart';

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: [],
      cartOpen: false,
      checkoutProgress: 'cart-page',
      setCheckoutProgress: (val) => set((state) => ({ checkoutProgress: val })),
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
      removeFromCart: (item) =>
        set((state) => {
          const updatedCart = state.cart.map((cartItem) => {
            if (cartItem.variant.variantID === item.variant.variantID) {
              return {
                ...cartItem,
                variant: {
                  ...cartItem.variant,
                  quantity: cartItem.variant.quantity - 1,
                },
              };
            }
            return cartItem;
          });
          return {
            cart: updatedCart.filter((item) => item.variant.quantity > 0),
          };
        }),
      clearCart: () => set((state) => ({ cart: [] })),
      setCartOpen: (val) => set((state) => ({ cartOpen: val })),
    }),
    { name: 'cart-storage' }
  )
);
