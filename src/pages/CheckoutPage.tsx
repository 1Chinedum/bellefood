import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Truck, 
  Store, 
  CreditCard, 
  Banknote, 
  MapPin, 
  Sparkles, 
  Lock, 
  ArrowLeft, 
  Tag, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { OrderType, PaymentMethod, RestaurantSettings } from '../types';

declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: {
        key: string;
        email: string;
        amount: number;
        currency?: string;
        ref: string;
        callback: (response: { reference: string; status: string }) => void;
        onClose: () => void;
      }) => { openIframe: () => void };
    };
  }
}

interface CheckoutPageProps {
  onOrderSuccess: (orderNumber: string) => void;
  onBackToMenu: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  onOrderSuccess,
  onBackToMenu,
}) => {
  const { cart, subtotal, deliveryFee, discount, appliedPromo, total, clearCart, orderType, setOrderType, applyPromoCode, removePromoCode } = useCart();
  const { user } = useAuth();

  // Form states
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  
  // Delivery Address
  const defaultAddress = user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0];
  const [address, setAddress] = useState(defaultAddress?.address || '');
  const [city, setCity] = useState(defaultAddress?.city || 'Lagos');
  const [state, setState] = useState(defaultAddress?.state || 'Lagos');
  const [instructions, setInstructions] = useState('');

  // Pickup Branch
  const [pickupBranch, setPickupBranch] = useState('Flagship Branch: 14 Admiralty Way, Lekki Phase 1, Lagos');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('paystack');

  // Promo in Checkout
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [promoError, setPromoError] = useState('');

  // Processing state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Settings for COD & pickup options
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setSettings(data.settings);
          if (data.settings.pickupLocations?.length > 0) {
            setPickupBranch(data.settings.pickupLocations[0]);
          }
        }
      })
      .catch(() => {});
  }, []);

  // Update customer fields if user logs in during checkout
  useEffect(() => {
    if (user) {
      if (!name) setName(user.name);
      if (!email) setEmail(user.email);
      if (!phone) setPhone(user.phone);
    }
  }, [user]);

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <Truck className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-stone-900">Your cart is empty</h2>
        <p className="text-xs sm:text-sm text-stone-500">
          Please add some delicious dishes to your cart before proceeding to checkout.
        </p>
        <button
          onClick={onBackToMenu}
          className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-md cursor-pointer"
        >
          Explore Delicious Menu
        </button>
      </div>
    );
  }

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCodeInput.trim()) return;
    setPromoError('');
    const res = await applyPromoCode(promoCodeInput.trim());
    if (!res.success) {
      setPromoError(res.message);
    } else {
      setPromoCodeInput('');
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim() || !email.trim() || !phone.trim()) {
      setErrorMessage('Please provide your full name, email, and phone number.');
      return;
    }

    if (orderType === 'delivery' && !address.trim()) {
      setErrorMessage('Please provide your delivery street address.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Prepare historical order items payload
      const orderItems = cart.map((item) => ({
        productId: item.productId,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        selectedAddOns: item.selectedAddOns.map((a) => ({ name: a.name, price: a.price })),
        specialInstructions: item.specialInstructions,
        total: item.itemTotal,
        image: item.product.image,
      }));

      // 2. Create the order in the database
      const orderPayload = {
        customer: {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
        },
        orderType,
        deliveryAddress:
          orderType === 'delivery'
            ? {
                address: address.trim(),
                city: city.trim(),
                state: state.trim(),
                instructions: instructions.trim(),
              }
            : undefined,
        pickupLocation: orderType === 'pickup' ? pickupBranch : undefined,
        items: orderItems,
        subtotal,
        deliveryFee,
        discount,
        promoCode: appliedPromo?.code,
        total,
        paymentMethod,
        userId: user?.id,
      };

      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const orderData = await orderRes.json();
      if (!orderData.success || !orderData.order) {
        throw new Error(orderData.message || 'Failed to place order');
      }

      const createdOrder = orderData.order;

      // 3. Handle Payment
      if (paymentMethod === 'cod') {
        // Cash on Delivery / Pay on Pickup
        clearCart();
        onOrderSuccess(createdOrder.orderNumber);
        return;
      }

      // Paystack Payment Flow
      const paystackInitRes = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber: createdOrder.orderNumber,
          email: email.trim(),
          amount: total,
          callbackUrl: `${window.location.origin}/order-confirmation/${createdOrder.orderNumber}`,
          metadata: {
            orderNumber: createdOrder.orderNumber,
            customerName: name.trim(),
          },
        }),
      });

      const paystackData = await paystackInitRes.json();
      if (!paystackData.success) {
        throw new Error('Payment initialization failed. Please try again.');
      }

      const { reference, publicKey, isTestMode } = paystackData;

      // Check if Paystack Inline JS popup is available and active
      if (window.PaystackPop && publicKey && !isTestMode) {
        const handler = window.PaystackPop.setup({
          key: publicKey,
          email: email.trim(),
          amount: Math.round(total * 100),
          currency: 'NGN',
          ref: reference,
          callback: async (response) => {
            // Verify payment on backend
            const verifyRes = await fetch(`/api/paystack/verify/${response.reference}`);
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              clearCart();
              onOrderSuccess(createdOrder.orderNumber);
            } else {
              setErrorMessage('Payment verification unconfirmed. Please contact customer support.');
              setIsSubmitting(false);
            }
          },
          onClose: () => {
            setIsSubmitting(false);
            setErrorMessage('Payment window was closed. You can retry whenever you are ready.');
          },
        });

        handler.openIframe();
      } else {
        // Test mode / sandbox verification fallback
        // Verify transaction securely on backend:
        const verifyRes = await fetch(`/api/paystack/verify/${reference}`);
        const verifyData = await verifyRes.json();

        if (verifyData.success) {
          clearCart();
          onOrderSuccess(createdOrder.orderNumber);
        } else {
          throw new Error('Payment verification failed');
        }
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setErrorMessage(err.message || 'An error occurred during checkout.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Back button */}
      <button
        onClick={onBackToMenu}
        className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-stone-900 mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Menu</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Details */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handlePlaceOrder} id="checkout-form" className="space-y-6">
            {/* Step 1: Customer Contact Info */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="font-extrabold text-base text-stone-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs flex items-center justify-center font-black">
                    1
                  </span>
                  Customer Information
                </h3>
                {user ? (
                  <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-medium">
                    Logged in as {user.name.split(' ')[0]}
                  </span>
                ) : (
                  <span className="text-xs text-stone-400 font-medium">Guest Checkout</span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Chioma Adebayo"
                    className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                  <span className="text-[10px] text-stone-400 mt-1 block">Order receipt will be sent here</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234 800 000 0000"
                    className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                  <span className="text-[10px] text-stone-400 mt-1 block">Rider will call upon arrival</span>
                </div>
              </div>
            </div>

            {/* Step 2: Order Type & Delivery/Pickup Address */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="font-extrabold text-base text-stone-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs flex items-center justify-center font-black">
                    2
                  </span>
                  Delivery or Pickup
                </h3>
              </div>

              {/* Order Type Toggle */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setOrderType('delivery')}
                  className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
                    orderType === 'delivery'
                      ? 'border-amber-600 bg-amber-50/60 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Truck className={`w-5 h-5 ${orderType === 'delivery' ? 'text-amber-600' : 'text-stone-400'}`} />
                    <span className="text-xs font-bold text-stone-900">
                      {deliveryFee === 0 ? 'FREE' : `₦${deliveryFee.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="font-extrabold text-xs text-stone-900">Doorstep Delivery</div>
                  <div className="text-[11px] text-stone-500">Delivered in 35-45 mins</div>
                </button>

                <button
                  type="button"
                  onClick={() => setOrderType('pickup')}
                  className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
                    orderType === 'pickup'
                      ? 'border-amber-600 bg-amber-50/60 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Store className={`w-5 h-5 ${orderType === 'pickup' ? 'text-amber-600' : 'text-stone-400'}`} />
                    <span className="text-xs font-bold text-emerald-600">FREE</span>
                  </div>
                  <div className="font-extrabold text-xs text-stone-900">Restaurant Pickup</div>
                  <div className="text-[11px] text-stone-500">Ready in 15-20 mins</div>
                </button>
              </div>

              {/* Delivery Address Fields */}
              {orderType === 'delivery' ? (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Street Address *</label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. 14 Admiralty Way, Flat 3B"
                      className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">City / Area *</label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Lekki Phase 1"
                        className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">State *</label>
                      <input
                        type="text"
                        required
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="e.g. Lagos"
                        className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Delivery Landmark / Notes (Optional)
                    </label>
                    <input
                      type="text"
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      placeholder="e.g. Near the roundabout, call security when at gate"
                      className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                    />
                  </div>
                </div>
              ) : (
                /* Pickup Branch Picker */
                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-bold text-stone-700">
                    Select Pickup Location *
                  </label>
                  <div className="space-y-2">
                    {(settings?.pickupLocations || [
                      'Flagship Branch: 14 Admiralty Way, Lekki Phase 1, Lagos',
                      'Mainland Hub: 32 Isaac John St, Ikeja GRA, Lagos',
                      'Abuja Express: 45 Aminu Kano Crescent, Wuse II, Abuja',
                    ]).map((loc, idx) => (
                      <label
                        key={idx}
                        className={`flex items-start gap-3 p-3 rounded-xl border text-xs cursor-pointer transition ${
                          pickupBranch === loc
                            ? 'border-amber-600 bg-amber-50/70 text-stone-900 font-bold'
                            : 'border-stone-200 hover:border-stone-300 text-stone-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name="pickupBranch"
                          checked={pickupBranch === loc}
                          onChange={() => setPickupBranch(loc)}
                          className="mt-0.5 text-amber-600 focus:ring-amber-500"
                        />
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>{loc}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Step 3: Payment Method */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="font-extrabold text-base text-stone-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs flex items-center justify-center font-black">
                    3
                  </span>
                  Payment Method
                </h3>
                <span className="text-xs text-stone-400 font-semibold flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" /> 256-Bit Encrypted
                </span>
              </div>

              <div className="space-y-3">
                {/* Paystack Option */}
                <label
                  className={`flex items-start justify-between p-4 rounded-2xl border cursor-pointer transition ${
                    paymentMethod === 'paystack'
                      ? 'border-amber-600 bg-amber-50/60 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paystack"
                      checked={paymentMethod === 'paystack'}
                      onChange={() => setPaymentMethod('paystack')}
                      className="mt-1 text-amber-600 focus:ring-amber-500 cursor-pointer"
                    />
                    <div>
                      <div className="font-extrabold text-xs sm:text-sm text-stone-900 flex items-center gap-2">
                        <span>Paystack Secure Online Payment</span>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                          Fast & Instant
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-1">
                        Debit Card (Mastercard, Visa, Verve), Bank Transfer, or USSD. Verified securely on backend.
                      </p>
                    </div>
                  </div>
                  <CreditCard className="w-5 h-5 text-amber-600 shrink-0 hidden sm:block" />
                </label>

                {/* Cash on Delivery / Pay on Pickup Option */}
                {settings?.cashOnDeliveryEnabled !== false && (
                  <label
                    className={`flex items-start justify-between p-4 rounded-2xl border cursor-pointer transition ${
                      paymentMethod === 'cod'
                        ? 'border-amber-600 bg-amber-50/60 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="mt-1 text-amber-600 focus:ring-amber-500 cursor-pointer"
                      />
                      <div>
                        <div className="font-extrabold text-xs sm:text-sm text-stone-900">
                          {orderType === 'pickup' ? 'Pay at Pickup Counter' : 'Cash on Delivery (COD)'}
                        </div>
                        <p className="text-[11px] text-stone-500 mt-1">
                          Pay cash or POS card payment to the dispatch rider upon delivery.
                        </p>
                      </div>
                    </div>
                    <Banknote className="w-5 h-5 text-stone-500 shrink-0 hidden sm:block" />
                  </label>
                )}
              </div>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-xs text-rose-800 font-semibold">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </form>
        </div>

        {/* Right Column: Order Summary & Pay Button */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-5 sticky top-28">
            <h3 className="font-extrabold text-base text-stone-900 border-b border-stone-100 pb-3">
              Order Summary ({cart.length} {cart.length === 1 ? 'item' : 'items'})
            </h3>

            {/* Items Mini List */}
            <div className="space-y-3 max-h-60 overflow-y-auto divide-y divide-stone-100 pr-1">
              {cart.map((item) => (
                <div key={item.id} className="pt-2 first:pt-0 flex items-center justify-between text-xs gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-10 h-10 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-stone-900 truncate">
                        {item.quantity}x {item.product.name}
                      </div>
                      {item.selectedAddOns.length > 0 && (
                        <div className="text-[10px] text-stone-500 truncate">
                          +{item.selectedAddOns.map((a) => a.name).join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="font-extrabold text-stone-900 shrink-0">
                    ₦{item.itemTotal.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Promo Code Input in Checkout */}
            <div className="pt-3 border-t border-stone-100">
              {appliedPromo ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                    <Tag className="w-3.5 h-3.5" />
                    <span>{appliedPromo.code} Applied</span>
                  </div>
                  <button
                    type="button"
                    onClick={removePromoCode}
                    className="text-stone-400 hover:text-stone-700 text-xs font-semibold cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                    placeholder="Promo code (e.g. BELLE10)"
                    className="flex-1 text-xs px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none uppercase"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              )}
              {promoError && (
                <p className="text-[11px] text-rose-600 font-medium mt-1">{promoError}</p>
              )}
            </div>

            {/* Totals Breakdown */}
            <div className="space-y-2 text-xs text-stone-600 pt-3 border-t border-stone-100">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-stone-900">₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-bold text-stone-900">
                  {deliveryFee === 0 ? <span className="text-emerald-600">FREE</span> : `₦${deliveryFee.toLocaleString()}`}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount ({appliedPromo?.code})</span>
                  <span>-₦{discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-stone-900 pt-2 border-t border-stone-200">
                <span>Total Due</span>
                <span className="text-amber-700">₦{total.toLocaleString()}</span>
              </div>
            </div>

            {/* Pay & Place Order CTA */}
            <button
              type="submit"
              form="checkout-form"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-xs uppercase tracking-wider font-extrabold rounded-2xl shadow-xl shadow-orange-500/25 hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Securing Order...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>
                    {paymentMethod === 'paystack'
                      ? `Pay ₦${total.toLocaleString()} & Place Order`
                      : `Place Order (₦${total.toLocaleString()} on Delivery)`}
                  </span>
                </>
              )}
            </button>

            {/* Security Guarantee Note */}
            <div className="text-center pt-1">
              <p className="text-[11px] text-stone-400 flex items-center justify-center gap-1">
                <Lock className="w-3 h-3 text-emerald-600" />
                <span>Protected by Paystack 256-bit bank SSL security</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
