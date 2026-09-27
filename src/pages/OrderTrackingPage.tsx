import React, { useState, useEffect } from 'react';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  ChefHat, 
  PackageCheck, 
  Truck, 
  MapPin, 
  Store, 
  Phone, 
  ShieldCheck, 
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { Order, OrderStatus } from '../types';

interface OrderTrackingPageProps {
  initialOrderNumber?: string;
  onSelectProductDetails?: (productId: string) => void;
}

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({
  initialOrderNumber = '',
}) => {
  const [searchNumber, setSearchNumber] = useState(initialOrderNumber);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchOrder = async (numberToFetch: string) => {
    if (!numberToFetch.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(numberToFetch.trim())}`);
      const data = await res.json();
      if (data.success && data.order) {
        setOrder(data.order);
      } else {
        setOrder(null);
        setError(`No order found matching "${numberToFetch}". Please check the number and try again.`);
      }
    } catch {
      setError('Failed to fetch order tracking status.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderNumber) {
      setSearchNumber(initialOrderNumber);
      fetchOrder(initialOrderNumber);
    } else {
      // Default to the latest sample order for demonstration if nothing searched yet
      fetchOrder('BF-83921');
    }
  }, [initialOrderNumber]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(searchNumber);
  };

  // Timeline step definitions
  const timelineStages: { status: OrderStatus; label: string; desc: string; icon: any }[] = [
    { status: 'Pending', label: 'Order Received', desc: 'Order logged and payment confirmed', icon: Clock },
    { status: 'Preparing', label: 'Preparing in Kitchen', desc: 'Chefs are grilling and assembling fresh meals', icon: ChefHat },
    { status: 'Ready', label: 'Ready for Dispatch', desc: 'Packaged hot in thermo-insulated containers', icon: PackageCheck },
    { status: 'Out for Delivery', label: 'Out for Delivery', desc: 'Dispatch rider is en route to your address', icon: Truck },
    { status: 'Delivered', label: 'Delivered', desc: 'Meal delivered safely. Enjoy your feast!', icon: CheckCircle2 },
  ];

  const getStageIndex = (status?: OrderStatus): number => {
    if (!status) return 0;
    if (status === 'Cancelled') return -1;
    if (status === 'Confirmed') return 0;
    const idx = timelineStages.findIndex((s) => s.status === status);
    return idx >= 0 ? idx : 0;
  };

  const currentStageIndex = getStageIndex(order?.status);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Title */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
          Real-time Order Status
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
          Track Your Delicious Feast
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          Enter your order reference number (e.g. BF-83921) to view live cooking & dispatch progress.
        </p>
      </div>

      {/* Search Order Number Bar */}
      <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            required
            value={searchNumber}
            onChange={(e) => setSearchNumber(e.target.value.toUpperCase())}
            placeholder="Enter Order Number (e.g. BF-83921)"
            className="w-full text-xs sm:text-sm font-semibold pl-10 pr-3 py-3 bg-white border border-stone-200 rounded-2xl shadow-xs focus:outline-none focus:ring-2 focus:ring-amber-500 uppercase tracking-wider text-stone-900"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-md transition cursor-pointer shrink-0 flex items-center gap-1.5"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>Track</span>
            </>
          )}
        </button>
      </form>

      {/* Error state */}
      {error && (
        <div className="max-w-xl mx-auto p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 font-semibold flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Order Status Card */}
      {order && (
        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-md overflow-hidden space-y-6">
          {/* Header Bar */}
          <div className="p-6 bg-stone-900 text-white flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black">{order.orderNumber}</span>
                <span
                  className={`text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                    order.status === 'Delivered'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : order.status === 'Cancelled'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <div className="text-xs text-stone-400 mt-1">
                Ordered on {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => fetchOrder(order.orderNumber)}
                className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                title="Refresh Status"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Refresh</span>
              </button>

              <div className="text-right">
                <div className="text-xs text-stone-400">Total Paid</div>
                <div className="text-base font-extrabold text-amber-400">
                  ₦{order.total.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Cancelled Banner if applicable */}
          {order.status === 'Cancelled' && (
            <div className="mx-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 font-bold">
              This order was cancelled by the restaurant or customer. If you were charged, your refund will be returned via Paystack in 24 hours.
            </div>
          )}

          {/* 5-Stage Visual Progress Timeline */}
          {order.status !== 'Cancelled' && (
            <div className="p-6 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-6">
                Live Timeline
              </h3>

              <div className="relative">
                {/* Desktop Horizontal Stepper */}
                <div className="hidden md:grid grid-cols-5 gap-2 relative">
                  {/* Connecting Bar */}
                  <div className="absolute top-5 left-8 right-8 h-1 bg-stone-200 -z-0" />
                  <div
                    className="absolute top-5 left-8 h-1 bg-amber-600 transition-all duration-500 -z-0"
                    style={{
                      width: `${(Math.min(currentStageIndex, 4) / 4) * 82}%`,
                    }}
                  />

                  {timelineStages.map((stage, idx) => {
                    const isDone = idx < currentStageIndex;
                    const isCurrent = idx === currentStageIndex;
                    const Icon = stage.icon;

                    return (
                      <div key={idx} className="flex flex-col items-center text-center relative z-10">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition shadow-sm ${
                            isDone
                              ? 'bg-amber-600 text-white'
                              : isCurrent
                              ? 'bg-stone-900 text-amber-400 ring-4 ring-amber-100 animate-pulse'
                              : 'bg-white border-2 border-stone-200 text-stone-400'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <span
                          className={`mt-2.5 text-xs font-bold ${
                            isCurrent ? 'text-amber-800' : isDone ? 'text-stone-900' : 'text-stone-400'
                          }`}
                        >
                          {stage.label}
                        </span>
                        <span className="text-[10px] text-stone-400 mt-0.5 max-w-[120px]">
                          {stage.desc}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Mobile Vertical Stepper */}
                <div className="md:hidden space-y-4">
                  {timelineStages.map((stage, idx) => {
                    const isDone = idx < currentStageIndex;
                    const isCurrent = idx === currentStageIndex;
                    const Icon = stage.icon;

                    return (
                      <div key={idx} className="flex items-start gap-3.5">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                            isDone
                              ? 'bg-amber-600 text-white'
                              : isCurrent
                              ? 'bg-stone-900 text-amber-400 ring-4 ring-amber-100 animate-pulse'
                              : 'bg-stone-100 border border-stone-200 text-stone-400'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="pt-0.5">
                          <span
                            className={`text-xs font-extrabold block ${
                              isCurrent ? 'text-amber-700' : isDone ? 'text-stone-900' : 'text-stone-400'
                            }`}
                          >
                            {stage.label}
                          </span>
                          <span className="text-[11px] text-stone-500 block">
                            {stage.desc}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Delivery & Items Summary */}
          <div className="p-6 bg-stone-50 border-t border-stone-100 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div>
              <h4 className="font-bold text-stone-400 uppercase tracking-wider mb-2">
                {order.orderType === 'pickup' ? 'Pickup Details' : 'Destination Address'}
              </h4>
              {order.orderType === 'pickup' ? (
                <div className="flex items-start gap-2 text-stone-800">
                  <Store className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">{order.pickupLocation}</p>
                    <p className="text-stone-500">Pick up ready at counter with your Order Number</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2 text-stone-800">
                  <Truck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">{order.deliveryAddress?.address}</p>
                    <p className="text-stone-500">
                      {order.deliveryAddress?.city}, {order.deliveryAddress?.state}
                    </p>
                    {order.deliveryAddress?.instructions && (
                      <p className="text-amber-800 italic mt-0.5">
                        "{order.deliveryAddress.instructions}"
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div>
              <h4 className="font-bold text-stone-400 uppercase tracking-wider mb-2">
                Order Items ({order.items.length})
              </h4>
              <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-stone-700">
                    <span className="truncate pr-2">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="font-bold text-stone-900 shrink-0">
                      ₦{item.total.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Need help banner */}
          <div className="p-4 bg-amber-50/60 border-t border-amber-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-600" />
              <span>Need help or change instructions? Call Dispatch Hotline: <b>+234 800 235 5336</b></span>
            </div>
            <span className="font-bold text-stone-600">Quote order #{order.orderNumber}</span>
          </div>
        </div>
      )}
    </div>
  );
};
