import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, AddOnOption, OrderType, PromoCode } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedAddOns?: AddOnOption[], specialInstructions?: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  appliedPromo: PromoCode | null;
  applyPromoCode: (code: string) => Promise<{ success: boolean; message: string }>;
  removePromoCode: () => void;
  orderType: OrderType;
  setOrderType: (type: OrderType) => void;
  total: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'belle_food_cart_v1';
const PROMO_STORAGE_KEY = 'belle_food_promo_v1';
const ORDER_TYPE_KEY = 'belle_food_order_type_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(() => {
    try {
      const saved = localStorage.getItem(PROMO_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [orderType, setOrderTypeState] = useState<OrderType>(() => {
    try {
      const saved = localStorage.getItem(ORDER_TYPE_KEY);
      return (saved as OrderType) || 'delivery';
    } catch {
      return 'delivery';
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      if (appliedPromo) {
        localStorage.setItem(PROMO_STORAGE_KEY, JSON.stringify(appliedPromo));
      } else {
        localStorage.removeItem(PROMO_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to save promo to localStorage', e);
    }
  }, [appliedPromo]);

  const setOrderType = (type: OrderType) => {
    setOrderTypeState(type);
    try {
      localStorage.setItem(ORDER_TYPE_KEY, type);
    } catch {}
  };

  const addToCart = (
    product: Product,
    quantity = 1,
    selectedAddOns: AddOnOption[] = [],
    specialInstructions = ''
  ) => {
    // Generate unique ID based on product ID and selected add-ons
    const addOnIds = selectedAddOns.map((a) => a.id).sort().join('-');
    const cartItemId = `${product.id}_${addOnIds}_${encodeURIComponent(specialInstructions.trim().slice(0, 30))}`;

    const addOnsTotal = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
    const unitPrice = product.price + addOnsTotal;

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          itemTotal: newQty * unitPrice,
        };
        return updated;
      }

      const newItem: CartItem = {
        id: cartItemId,
        productId: product.id,
        product,
        quantity,
        selectedAddOns,
        specialInstructions: specialInstructions.trim(),
        unitPrice,
        itemTotal: quantity * unitPrice,
      };

      return [...prev, newItem];
    });

    setIsCartOpen(true);
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setCart((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          return {
            ...item,
            quantity,
            itemTotal: quantity * item.unitPrice,
          };
        }
        return item;
      })
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromo(null);
  };

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.itemTotal, 0);

  // Delivery fee logic: Free if pickup or if subtotal >= ₦20,000, otherwise ₦1,200
  const deliveryFee = orderType === 'pickup' ? 0 : subtotal >= 20000 || subtotal === 0 ? 0 : 1200;

  // Calculate promo discount
  let discount = 0;
  if (appliedPromo && subtotal >= appliedPromo.minOrderValue) {
    if (appliedPromo.discountType === 'percentage') {
      discount = Math.round((subtotal * appliedPromo.discountValue) / 100);
    } else {
      discount = appliedPromo.discountValue;
    }
  }

  const total = Math.max(0, subtotal + deliveryFee - discount);

  const applyPromoCode = async (code: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch('/api/promo-codes/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal }),
      });
      const data = await res.json();
      if (data.valid && data.promo) {
        setAppliedPromo(data.promo);
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || 'Invalid promo code' };
      }
    } catch {
      return { success: false, message: 'Could not validate promo code at this moment' };
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        itemCount,
        subtotal,
        deliveryFee,
        discount,
        appliedPromo,
        applyPromoCode,
        removePromoCode,
        orderType,
        setOrderType,
        total,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
