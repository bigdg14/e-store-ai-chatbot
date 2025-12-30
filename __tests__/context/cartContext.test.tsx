import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from '@/context/cartContext';
import { toast } from 'sonner';

// Mock sonner toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    info: jest.fn(),
  },
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('CartContext', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  const mockProduct = {
    id: 1,
    title: 'Test Product',
    price: 99.99,
    image: 'test.jpg',
    description: 'Test description',
    stock: 10,
    specs: { dimensions: '10x10x10' },
    features: ['feature1'],
  };

  it('should add product to cart', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addToCart(mockProduct);
    });

    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0]).toMatchObject({
      id: mockProduct.id,
      title: mockProduct.title,
      price: mockProduct.price,
      quantity: 1,
    });
    expect(toast.success).toHaveBeenCalledWith(
      `${mockProduct.title} added to cart!`,
      { duration: 2000 }
    );
  });

  it('should increment quantity when adding same product twice', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addToCart(mockProduct);
      result.current.addToCart(mockProduct);
    });

    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].quantity).toBe(2);
  });

  it('should remove product from cart', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addToCart(mockProduct);
    });

    expect(result.current.cart).toHaveLength(1);

    act(() => {
      result.current.removeFromCart(mockProduct.id);
    });

    expect(result.current.cart).toHaveLength(0);
    expect(toast.info).toHaveBeenCalledWith('Item removed from cart', {
      duration: 2000,
    });
  });

  it('should clear cart', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addToCart(mockProduct);
      result.current.addToCart({ ...mockProduct, id: 2 });
    });

    expect(result.current.cart).toHaveLength(2);

    act(() => {
      result.current.clearCart();
    });

    expect(result.current.cart).toHaveLength(0);
    expect(toast.success).toHaveBeenCalledWith('Cart cleared', {
      duration: 2000,
    });
  });

  it('should persist cart to localStorage', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addToCart(mockProduct);
    });

    const savedCart = localStorage.getItem('cart');
    expect(savedCart).toBeTruthy();
    const parsedCart = JSON.parse(savedCart!);
    expect(parsedCart).toHaveLength(1);
    expect(parsedCart[0].id).toBe(mockProduct.id);
  });

  it('should load cart from localStorage on mount', () => {
    const cartData = [{ ...mockProduct, quantity: 3 }];
    localStorage.setItem('cart', JSON.stringify(cartData));

    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    // Wait for useEffect to run
    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].quantity).toBe(3);
  });

  it('should throw error when useCart is used outside CartProvider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    expect(() => {
      renderHook(() => useCart());
    }).toThrow('useCart must be used within a CartProvider');

    consoleSpy.mockRestore();
  });
});
