"use client";

import { createContext, useContext, useReducer, useEffect } from "react";
import { CartState, Product, CartContextType } from "@/types/cart";
import { ProviderProps } from "@/types/context";
import { toast } from "sonner";

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: any): CartState => {
  switch (action.type) {
    case "ADD_TO_CART":
      const existingProduct = state.cart.find(
        (p) => p.id === action.payload.id
      );
      if (existingProduct) {
        return {
          cart: state.cart.map((p) =>
            p.id === action.payload.id ? { ...p, quantity: p.quantity + 1 } : p
          ),
        };
      } else {
        return { cart: [...state.cart, { ...action.payload, quantity: 1 }] };
      }
    case "REMOVE_FROM_CART":
      return { cart: state.cart.filter((p) => p.id !== action.payload) };
    case "CLEAR_CART":
      return { cart: [] };
    case "LOAD_CART":
      return { cart: action.payload };
    default:
      return state;
  }
};

export const CartProvider = ({ children }: ProviderProps) => {
  const [state, dispatch] = useReducer(cartReducer, { cart: [] });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: "LOAD_CART", payload: parsedCart });
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (state.cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(state.cart));
    } else {
      localStorage.removeItem("cart");
    }
  }, [state.cart]);

  const addToCart = (product: Product) => {
    dispatch({ type: "ADD_TO_CART", payload: product });
    toast.success(`${product.title} added to cart!`, {
      duration: 2000,
    });
  };

  const removeFromCart = (id: number) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: id });
    toast.info("Item removed from cart", {
      duration: 2000,
    });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
    toast.success("Cart cleared", {
      duration: 2000,
    });
  };

  return (
    <CartContext.Provider
      value={{ cart: state.cart, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
