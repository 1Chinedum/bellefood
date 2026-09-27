import React, { useState, useEffect } from 'react';
import { 
  User, 
  Package, 
  Heart, 
  MapPin, 
  Plus, 
  RotateCcw, 
  Trash2, 
  LogOut, 
  Check, 
  Clock, 
  ChevronRight, 
  ShoppingBag,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Order, Product } from '../types';

interface AccountPageProps {
  onNavigateToOrderTracking: (orderNumber: string) => void;
  onExploreMenu: () => void;
  onQuickViewProduct: (product: Product) => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({
  onNavigateToOrderTracking,
  onExploreMenu,
  onQuickViewProduct,
}) => {
  const { user, logout, updateProfile, addAddress, openAuthModal, isAdmin } = useAuth();
  const { addToCart } = useCart();

  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'favorites' | 'addresses'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Profile Edit state
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profileSaved, setProfileSaved] = useState(false);

  // New Address state
  const [newLabel, setNewLabel] = useState('Home');
  const [newAddress, setNewAddress] = useState('');
  const [newCity, setNewCity] = useState('Lagos');
  const [newState, setNewState] = useState('Lagos');
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone);

      // Fetch user's orders
      setLoadingOrders(true);
      fetch(`/api/orders?user=${encodeURIComponent(user.email)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.orders) {
            setOrders(data.orders);
          }
        })
        .catch(() => {})
        .finally(() => setLoadingOrders(false));

      // Fetch favorite products
      fetch('/api/products')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.products) {
            const favs = data.products.filter((p: Product) => user.favorites?.includes(p.id));
            setFavoriteProducts(favs);
          }
        })
        .catch(() => {});
    }
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-stone-900">Sign In to Your Account</h2>
        <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
          Sign in or create an account to view your past orders, 1-click reorder your favorites, and manage saved delivery addresses.
        </p>
        <div className="flex flex-col gap-2.5">
          <button
            onClick={() => openAuthModal('login')}
            className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition shadow-md shadow-orange-500/20 cursor-pointer"
          >
            Sign In
          </button>
          <button
            onClick={() => openAuthModal('register')}
            className="w-full py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-xl transition cursor-pointer"
          >
            Create New Account
          </button>
        </div>
      </div>
    );
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await updateProfile({ name, phone });
    if (success) {
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.trim()) return;

    await addAddress({
      label: newLabel,
      address: newAddress.trim(),
      city: newCity.trim(),
      state: newState.trim(),
      isDefault: user.addresses?.length === 0,
    });

    setNewAddress('');
    setIsAddingAddress(false);
  };

  const handleReorder = (order: Order) => {
    // Add all items in the order back to the shopping cart
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.products) {
          order.items.forEach((item) => {
            const product = data.products.find((p: Product) => p.id === item.productId);
            if (product && product.isAvailable) {
              addToCart(product, item.quantity, [], item.specialInstructions);
            }
          });
        }
      });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Account Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-stone-900">{user.name}</h1>
              {isAdmin && (
                <span className="text-[10px] font-extrabold uppercase bg-red-100 text-red-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Admin
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500">{user.email} • {user.phone || 'No phone set'}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 border border-stone-200 hover:border-red-300 text-stone-600 hover:text-red-600 text-xs font-bold rounded-xl transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <div className="md:col-span-4 bg-white rounded-3xl p-3 border border-stone-200/80 shadow-xs space-y-1">
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-stone-700 hover:bg-stone-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Package className="w-4 h-4" />
              <span>Order History</span>
            </div>
            <span className="text-[11px] opacity-80">{orders.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'favorites'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-stone-700 hover:bg-stone-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Heart className="w-4 h-4" />
              <span>Favorite Meals</span>
            </div>
            <span className="text-[11px] opacity-80">{user.favorites?.length || 0}</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'addresses'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-stone-700 hover:bg-stone-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4" />
              <span>Saved Addresses</span>
            </div>
            <span className="text-[11px] opacity-80">{user.addresses?.length || 0}</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-stone-700 hover:bg-stone-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <User className="w-4 h-4" />
              <span>Profile & Settings</span>
            </div>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="md:col-span-8 space-y-6">
          {/* 1. ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <h2 className="text-base font-extrabold text-stone-900">Your Orders & Reorder</h2>
              
              {loadingOrders ? (
                <div className="py-12 text-center text-xs text-stone-400">Loading orders...</div>
              ) : orders.length === 0 ? (
                <div className="bg-white rounded-3xl p-10 text-center border border-stone-200/80 space-y-3">
                  <Package className="w-10 h-10 text-stone-300 mx-auto" />
                  <p className="text-xs font-bold text-stone-800">You haven’t placed any orders yet</p>
                  <p className="text-xs text-stone-400">Discover our mouthwatering menu and treat yourself.</p>
                  <button
                    onClick={onExploreMenu}
                    className="px-6 py-2.5 bg-amber-600 text-white font-bold text-xs rounded-full shadow-sm cursor-pointer"
                  >
                    Browse Menu
                  </button>
                </div>
              ) : (
                orders.map((ord) => (
                  <div key={ord.id} className="bg-white rounded-3xl border border-stone-200/80 p-5 shadow-xs space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-stone-900 text-sm">{ord.orderNumber}</span>
                          <span
                            className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                              ord.status === 'Delivered'
                                ? 'bg-emerald-50 text-emerald-700'
                                : ord.status === 'Cancelled'
                                ? 'bg-rose-50 text-rose-700'
                                : 'bg-amber-50 text-amber-800'
                            }`}
                          >
                            {ord.status}
                          </span>
                        </div>
                        <span className="text-[11px] text-stone-400">
                          {new Date(ord.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-black text-stone-900">₦{ord.total.toLocaleString()}</span>
                        <div className="text-[10px] text-emerald-600 font-semibold uppercase">
                          {ord.paymentStatus === 'paid' ? 'Paid (Paystack)' : 'Pay on Delivery'}
                        </div>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="space-y-1.5 text-xs text-stone-600">
                      {ord.items.map((item, i) => (
                        <div key={i} className="flex justify-between">
                          <span>{item.quantity}x {item.name}</span>
                          <span className="font-semibold text-stone-900">₦{item.total.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                      <button
                        onClick={() => onNavigateToOrderTracking(ord.orderNumber)}
                        className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
                      >
                        <span>Track Order Timeline</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleReorder(ord)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reorder Items</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 2. FAVORITES TAB */}
          {activeTab === 'favorites' && (
            <div className="space-y-4">
              <h2 className="text-base font-extrabold text-stone-900">Your Saved Favorites</h2>

              {favoriteProducts.length === 0 ? (
                <div className="bg-white rounded-3xl p-10 text-center border border-stone-200/80 space-y-3">
                  <Heart className="w-10 h-10 text-stone-300 mx-auto" />
                  <p className="text-xs font-bold text-stone-800">No favorite meals saved yet</p>
                  <p className="text-xs text-stone-400">Click the heart icon on any dish to save it here for fast reordering.</p>
                  <button
                    onClick={onExploreMenu}
                    className="px-6 py-2.5 bg-amber-600 text-white font-bold text-xs rounded-full shadow-sm cursor-pointer"
                  >
                    Explore Menu
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {favoriteProducts.map((p) => (
                    <div key={p.id} className="bg-white p-4 rounded-3xl border border-stone-200/80 shadow-xs flex items-center justify-between gap-3">
                      <div 
                        onClick={() => onQuickViewProduct(p)}
                        className="flex items-center gap-3 min-w-0 cursor-pointer"
                      >
                        <img src={p.image} alt={p.name} className="w-14 h-14 rounded-2xl object-cover" />
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs text-stone-900 truncate">{p.name}</h4>
                          <span className="text-xs font-extrabold text-amber-700">₦{p.price.toLocaleString()}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => addToCart(p, 1)}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl cursor-pointer shrink-0"
                      >
                        Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. SAVED ADDRESSES TAB */}
          {activeTab === 'addresses' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-extrabold text-stone-900">Saved Delivery Addresses</h2>
                <button
                  onClick={() => setIsAddingAddress(!isAddingAddress)}
                  className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Address</span>
                </button>
              </div>

              {isAddingAddress && (
                <form onSubmit={handleAddAddress} className="bg-stone-50 p-5 rounded-3xl border border-stone-200/80 space-y-3">
                  <h4 className="text-xs font-bold text-stone-900">Add New Delivery Location</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">Label (e.g. Home, Office)</label>
                      <input
                        type="text"
                        required
                        value={newLabel}
                        onChange={(e) => setNewLabel(e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-white border border-stone-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">City</label>
                      <input
                        type="text"
                        required
                        value={newCity}
                        onChange={(e) => setNewCity(e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-white border border-stone-200 rounded-xl"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">Full Street Address</label>
                    <input
                      type="text"
                      required
                      value={newAddress}
                      onChange={(e) => setNewAddress(e.target.value)}
                      placeholder="e.g. Plot 12, Bisola Durosinmi Etti Drive, Lekki Phase 1"
                      className="w-full text-xs px-3 py-2 bg-white border border-stone-200 rounded-xl"
                    />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-stone-900 text-white text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Save Address
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                      className="px-4 py-2 text-stone-600 text-xs font-bold cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {user.addresses?.map((addr) => (
                  <div key={addr.id} className="bg-white p-4 rounded-3xl border border-stone-200/80 shadow-xs flex items-center justify-between">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-amber-600 mt-1" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-stone-900">{addr.label}</span>
                          {addr.isDefault && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-600">{addr.address}</p>
                        <p className="text-[11px] text-stone-400">{addr.city}, {addr.state}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-5">
              <h2 className="text-base font-extrabold text-stone-900">Personal Information</h2>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full text-xs px-3.5 py-2.5 bg-stone-100 border border-stone-200 rounded-xl text-stone-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {profileSaved && (
                  <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                    <Check className="w-4 h-4" /> Profile updated successfully!
                  </p>
                )}

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer"
                >
                  Save Changes
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
