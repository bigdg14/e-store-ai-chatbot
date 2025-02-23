export interface Product {
  id: number;
  image: string;
  title: string;
  price: number;
  quantity: number;
}

export interface CartState {
  cart: Product[];
}

export interface CartContextType extends CartState {
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
}
