import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  ShoppingBag, 
  MapPin, 
  Clock, 
  ArrowRight, 
  Printer, 
  Store, 
  Truck, 
  ShieldCheck 
} from 'lucide-react';
import { Order } from '../types';

interface OrderConfirmationPageProps {
  orderNumber: string;
  onTrackOrder: (orderNumber: string) => void;
  onContinueShopping: () => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({
  orderNumber,
  onTrackOrder,
  onContinueShopping,
}) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fire confetti celebration!
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ea580c', '#f59e0b', '#10b981', '#3b82f6'],
      });
    } catch {}

    // Fetch order details
    if (orderNumber) {
      fetch(`/api/orders/${orderNumber}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.order) {
            setOrder(data.order);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [orderNumber]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-24 px-4 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-bold text-stone-700">Loading your order receipt...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Top Banner Celebration */}
      <div className="text-center space-y-3">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10 animate-bounce duration-1000">
          <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
          Order Confirmed! 🎉
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
          Thank you for choosing Belle Food! We’ve received your order and our chefs are already preparing your meals with fresh ingredients.
        </p>
      </div>

      {/* Receipt Card */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-lg overflow-hidden">
        {/* Receipt Header */}
        <div className="p-6 bg-stone-900 text-white flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs text-amber-400 font-bold uppercase tracking-wider">Order Reference</div>
            <div className="text-2xl font-black">{order?.orderNumber || orderNumber}</div>
            <div className="text-xs text-stone-400 mt-1">
              Placed on {order ? new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Today'}
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              {order?.paymentStatus === 'paid' ? 'Payment Verified (Paystack)' : 'Pay on Delivery'}
            </span>
            <span className="text-[11px] text-stone-400">
              Est: {order?.estimatedDeliveryTime || '35-45 mins'}
            </span>
          </div>
        </div>

        {/* Customer & Delivery Summary Info */}
        <div className="p-6 border-b border-stone-100 grid grid-cols-1 sm:grid-cols-2 gap-6 bg-stone-50/50 text-xs">
          <div>
            <span className="font-bold text-stone-400 uppercase tracking-wider block mb-1">
              Customer Info
            </span>
            <div className="font-extrabold text-stone-900 text-sm">{order?.customer.name}</div>
            <div className="text-stone-600">{order?.customer.email}</div>
            <div className="text-stone-600">{order?.customer.phone}</div>
          </div>

          <div>
            <span className="font-bold text-stone-400 uppercase tracking-wider block mb-1">
              {order?.orderType === 'pickup' ? 'Pickup Location' : 'Delivery Address'}
            </span>
            {order?.orderType === 'pickup' ? (
              <div className="flex items-start gap-2 text-stone-800 font-medium">
                <Store className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <span>{order.pickupLocation}</span>
              </div>
            ) : (
              <div className="flex items-start gap-2 text-stone-800 font-medium">
                <Truck className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold">{order?.deliveryAddress?.address}</p>
                  <p className="text-stone-500">{order?.deliveryAddress?.city}, {order?.deliveryAddress?.state}</p>
                  {order?.deliveryAddress?.instructions && (
                    <p className="text-amber-800 italic mt-0.5">Note: "{order.deliveryAddress.instructions}"</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Ordered Items List */}
        <div className="p-6 divide-y divide-stone-100">
          <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">
            Ordered Items
          </h3>
          {order?.items.map((item, idx) => (
            <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between text-xs gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 rounded-xl object-cover bg-stone-100 shrink-0"
                />
                <div className="min-w-0">
                  <div className="font-bold text-stone-900 truncate">
                    {item.quantity}x {item.name}
                  </div>
                  {item.selectedAddOns?.length > 0 && (
                    <div className="text-[11px] text-stone-500 truncate">
                      +{item.selectedAddOns.map((a) => a.name).join(', ')}
                    </div>
                  )}
                  {item.specialInstructions && (
                    <div className="text-[10px] text-amber-700 italic">
                      "{item.specialInstructions}"
                    </div>
                  )}
                </div>
              </div>

              <span className="font-extrabold text-stone-900 shrink-0">
                ₦{item.total.toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        {/* Pricing Subtotal Breakdown */}
        <div className="p-6 bg-stone-50 border-t border-stone-200/80 space-y-2 text-xs">
          <div className="flex justify-between text-stone-600">
            <span>Subtotal</span>
            <span className="font-bold text-stone-900">₦{order?.subtotal.toLocaleString()}</span>
          </div>

          <div className="flex justify-between text-stone-600">
            <span>Delivery Fee</span>
            <span className="font-bold text-stone-900">
              {order?.deliveryFee === 0 ? <span className="text-emerald-600">FREE</span> : `₦${order?.deliveryFee.toLocaleString()}`}
            </span>
          </div>

          {order?.discount && order.discount > 0 && (
            <div className="flex justify-between text-emerald-600 font-bold">
              <span>Discount ({order.promoCode})</span>
              <span>-₦{order.discount.toLocaleString()}</span>
            </div>
          )}

          <div className="flex justify-between text-base font-black text-stone-900 pt-3 border-t border-stone-200">
            <span>Total Paid</span>
            <span className="text-amber-700">₦{order?.total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
        <button
          onClick={() => onTrackOrder(order?.orderNumber || orderNumber)}
          className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-full shadow-lg shadow-orange-500/20 hover:scale-105 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Track My Order Live</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={handlePrint}
          className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 font-bold text-xs rounded-full transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <Printer className="w-4 h-4 text-stone-500" />
          <span>Print Receipt</span>
        </button>

        <button
          onClick={onContinueShopping}
          className="w-full sm:w-auto px-6 py-3.5 text-stone-500 hover:text-stone-900 font-bold text-xs rounded-full transition cursor-pointer"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};
