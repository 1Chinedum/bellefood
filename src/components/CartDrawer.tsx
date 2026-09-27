import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  Sparkles, 
  Check, 
  Truck, 
  Store 
} from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartDrawerProps {
  onNavigateToCheckout: () => void;
  onExploreMenu: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  onNavigateToCheckout,
  onExploreMenu,
}) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    deliveryFee,
    discount,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    orderType,
    setOrderType,
    total,
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoMsg, setPromoMsg] = useState<{ text: string; isError: boolean } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;

    setPromoLoading(true);
    setPromoMsg(null);
    const result = await applyPromoCode(promoInput.trim());
    setPromoLoading(false);

    if (result.success) {
      setPromoMsg({ text: result.message, isError: false });
      setPromoInput('');
    } else {
      setPromoMsg({ text: result.message, isError: true });
    }
  };

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    onNavigateToCheckout();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-stone-900">Your Delicious Cart</h2>
                <p className="text-xs text-stone-500">
                  {cart.length} {cart.length === 1 ? 'item' : 'distinct items'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery vs Pickup Selector */}
          <div className="p-4 bg-stone-100/60 border-b border-stone-200/60">
            <div className="grid grid-cols-2 gap-2 bg-stone-200/70 p-1 rounded-2xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setOrderType('delivery')}
                className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  orderType === 'delivery'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Truck className="w-3.5 h-3.5 text-amber-600" />
                <span>Delivery (₦1,200)</span>
              </button>
              <button
                type="button"
                onClick={() => setOrderType('pickup')}
                className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  orderType === 'pickup'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Store className="w-3.5 h-3.5 text-amber-600" />
                <span>Pickup (FREE)</span>
              </button>
            </div>
            {orderType === 'delivery' && subtotal < 20000 && (
              <p className="text-[11px] text-stone-500 text-center mt-2">
                Add ₦{(20000 - subtotal).toLocaleString()} more for <b className="text-emerald-600">FREE Delivery</b>!
              </p>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-stone-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 mb-2">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-bold text-stone-800">Your cart is empty</h3>
                <p className="text-xs text-stone-500 max-w-xs leading-relaxed">
                  Craving smoky Jollof, spicy wings, or gourmet burgers? Explore our menu and pick your favourites.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onExploreMenu();
                  }}
                  className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-full transition shadow-md shadow-orange-500/20 cursor-pointer"
                >
                  Explore Menu
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-3.5">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-18 h-18 rounded-2xl object-cover bg-stone-100 shrink-0 border border-stone-100"
                  />

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-stone-900 leading-snug truncate">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-stone-400 hover:text-rose-600 transition p-1 cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Selected Add-ons Pill */}
                      {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {item.selectedAddOns.map((addon) => (
                            <span
                              key={addon.id}
                              className="text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded font-medium"
                            >
                              +{addon.name} (₦{addon.price})
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Special instructions */}
                      {item.specialInstructions && (
                        <p className="text-[10px] text-amber-700 italic mt-1 line-clamp-1">
                          "{item.specialInstructions}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2.5">
                      <span className="text-xs font-extrabold text-stone-900">
                        ₦{item.itemTotal.toLocaleString()}
                      </span>

                      {/* Quantity Controller */}
                      <div className="flex items-center bg-stone-100 rounded-full p-0.5 border border-stone-200">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-full flex items-center justify-center text-stone-600 hover:bg-white cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-stone-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-full flex items-center justify-center text-stone-600 hover:bg-white cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer with Calculations */}
          {cart.length > 0 && (
            <div className="p-5 bg-stone-50 border-t border-stone-200 space-y-4">
              {/* Promo Code Input */}
              <div>
                {appliedPromo ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <div>
                        <span className="font-bold text-emerald-900">{appliedPromo.code}</span>
                        <span className="text-emerald-700 ml-1.5">
                          (-{appliedPromo.discountType === 'percentage' ? `${appliedPromo.discountValue}%` : `₦${appliedPromo.discountValue}`})
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={removePromoCode}
                      className="text-stone-400 hover:text-stone-700 text-xs font-bold cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                        placeholder="Promo code (e.g. BELLE10)"
                        className="w-full text-xs pl-8 pr-3 py-2 bg-white border border-stone-200 rounded-xl uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={promoLoading || !promoInput.trim()}
                      className="px-4 py-2 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                    >
                      {promoLoading ? '...' : 'Apply'}
                    </button>
                  </form>
                )}

                {promoMsg && (
                  <p
                    className={`text-[11px] mt-1.5 font-medium ${
                      promoMsg.isError ? 'text-rose-600' : 'text-emerald-600'
                    }`}
                  >
                    {promoMsg.text}
                  </p>
                )}
              </div>

              {/* Order Calculations Breakdown */}
              <div className="space-y-1.5 text-xs text-stone-600 pt-2 border-t border-stone-200">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900">₦{subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-semibold text-stone-900">
                    {deliveryFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₦${deliveryFee.toLocaleString()}`}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount ({appliedPromo?.code})</span>
                    <span>-₦{discount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm font-extrabold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Total</span>
                  <span className="text-base text-amber-700">₦{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleCheckoutClick}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-full text-xs uppercase tracking-wider font-extrabold shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-2 text-stone-500 hover:text-stone-800 text-xs font-semibold text-center cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
