export type Variant = {
  variantID: number;
  quantity: number;
};

export type CartItem = {
  name: string;
  image: string;
  id: number;
  variant: Variant;
  price: number;
};

export type CartState = {
  cart: CartItem[];
  checkoutProgress: 'cart-page' | 'payment-page' | 'confirmation-page';
  addToCart: (item: CartItem) => void;
  removeFromCart: (item: CartItem) => void;
  setCheckoutProgress: (
    val: 'cart-page' | 'payment-page' | 'confirmation-page'
  ) => void;
};
