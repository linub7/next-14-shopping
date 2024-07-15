export type Variant = {
  variantID: number;
  quantity: number;
};

export type CartItem = {
  nama: string;
  image: string;
  id: number;
  variant: Variant;
  price: number;
};

export type CartState = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
};
