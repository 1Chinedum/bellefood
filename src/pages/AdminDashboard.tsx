import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  BarChart3, 
  ShoppingBag, 
  UtensilsCrossed, 
  Tag, 
  Users, 
  Settings, 
  Plus, 
  Edit2, 
  Trash2, 
  Check, 
  X, 
  AlertCircle, 
  Truck, 
  Store, 
  RefreshCw,
  Search,
  MessageSquare,
  Lock,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Product, Category, Order, PromoCode, RestaurantSettings, Review, OrderStatus } from '../types';

export const AdminDashboard: React.FC<{ onReturnToStore: () => void }> = ({ onReturnToStore }) => {
  const { user, login } = useAuth();
  const isAdmin = user?.role === 'admin';

  // Admin login credentials form for when not signed in as admin
  const [adminEmail, setAdminEmail] = useState('admin@bellefood.com');
  const [adminPassword, setAdminPassword] = useState('admin123');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<
    'overview' | 'orders' | 'products' | 'categories' | 'promos' | 'customers' | 'reviews' | 'settings'
  >('overview');

  // Stats & Collections
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Modals & form state for adding/editing food
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Rice',
    price: 4500,
    discountPercent: 0,
    description: '',
    image: '',
    prepTime: '20-25 mins',
    portionSize: 'Serves 1-2 persons',
    spicyLevel: 1,
    isAvailable: true,
    isFeatured: false,
    isPopular: false,
    ingredientsStr: 'Rice, Chicken, Tomatoes, Peppers, Onions',
  });

  // Category modal
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatImage, setNewCatImage] = useState('');

  // Promo code modal
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [promoForm, setPromoForm] = useState({
    code: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 15,
    minOrderValue: 4000,
    expiryDate: '2027-12-31',
    usageLimit: 200,
    isActive: true,
  });

  // Filter state for orders
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderSearch, setOrderSearch] = useState('');

  const loadAllAdminData = () => {
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then((d) => d.success && setStats(d.stats))
      .catch(() => {});

    fetch('/api/orders')
      .then((r) => r.json())
      .then((d) => d.success && setOrders(d.orders))
      .catch(() => {});

    fetch('/api/products')
      .then((r) => r.json())
      .then((d) => d.success && setProducts(d.products))
      .catch(() => {});

    fetch('/api/categories')
      .then((r) => r.json())
      .then((d) => d.success && setCategories(d.categories))
      .catch(() => {});

    fetch('/api/promo-codes')
      .then((r) => r.json())
      .then((d) => d.success && setPromoCodes(d.promoCodes))
      .catch(() => {});

    fetch('/api/customers')
      .then((r) => r.json())
      .then((d) => d.success && setCustomers(d.customers))
      .catch(() => {});

    fetch('/api/reviews?admin=true')
      .then((r) => r.json())
      .then((d) => d.success && setReviews(d.reviews))
      .catch(() => {});

    fetch('/api/settings')
      .then((r) => r.json())
      .then((d) => d.success && setSettings(d.settings))
      .catch(() => {});
  };

  useEffect(() => {
    if (isAdmin) {
      loadAllAdminData();
    }
  }, [isAdmin]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    const res = await login(adminEmail, adminPassword);
    setAuthLoading(false);
    if (!res.success) {
      setAuthError(res.message || 'Invalid admin credentials');
    }
  };

  // Status transition handler for orders
  const handleOrderStatusChange = async (orderNumber: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderNumber}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success && data.order) {
        setOrders((prev) => prev.map((o) => (o.orderNumber === orderNumber ? data.order : o)));
        loadAllAdminData();
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  // Toggle availability switch
  const handleToggleAvailability = async (productId: string) => {
    try {
      const res = await fetch(`/api/products/${productId}/toggle-availability`, {
        method: 'PATCH',
      });
      const data = await res.json();
      if (data.success && data.product) {
        setProducts((prev) => prev.map((p) => (p.id === productId ? data.product : p)));
      }
    } catch {}
  };

  // Delete product
  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this meal from the menu?')) return;
    try {
      const res = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
      }
    } catch {}
  };

  // Save product (Add or Edit)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: productForm.name,
      category: productForm.category,
      price: Number(productForm.price),
      discountPercent: Number(productForm.discountPercent) || 0,
      description: productForm.description,
      image: productForm.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
      prepTime: productForm.prepTime,
      portionSize: productForm.portionSize,
      spicyLevel: Number(productForm.spicyLevel) as any,
      isAvailable: productForm.isAvailable,
      isFeatured: productForm.isFeatured,
      isPopular: productForm.isPopular,
      ingredients: productForm.ingredientsStr.split(',').map((s) => s.trim()).filter(Boolean),
    };

    try {
      if (editingProduct) {
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? data.product : p)));
          setIsProductModalOpen(false);
        }
      } else {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setProducts([data.product, ...products]);
          setIsProductModalOpen(false);
        }
      }
    } catch (err) {
      console.error('Error saving product', err);
    }
  };

  const openAddProductModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: categories[0]?.name || 'Rice',
      price: 4500,
      discountPercent: 0,
      description: '',
      image: '',
      prepTime: '20-25 mins',
      portionSize: 'Serves 1-2 persons',
      spicyLevel: 1,
      isAvailable: true,
      isFeatured: false,
      isPopular: false,
      ingredientsStr: 'Rice, Chicken, Tomatoes, Peppers, Onions',
    });
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      category: prod.category,
      price: prod.price,
      discountPercent: prod.discountPercent || 0,
      description: prod.description,
      image: prod.image,
      prepTime: prod.prepTime,
      portionSize: prod.portionSize,
      spicyLevel: prod.spicyLevel || 0,
      isAvailable: prod.isAvailable,
      isFeatured: Boolean(prod.isFeatured),
      isPopular: Boolean(prod.isPopular),
      ingredientsStr: (prod.ingredients || []).join(', '),
    });
    setIsProductModalOpen(true);
  };

  // Add category
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      const slug = newCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCatName.trim(),
          slug,
          description: newCatDesc.trim() || 'Delicious offerings',
          image: newCatImage.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCategories([...categories, data.category]);
        setIsCategoryModalOpen(false);
        setNewCatName('');
        setNewCatDesc('');
      }
    } catch {}
  };

  // Add Promo Code
  const handleAddPromoCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoForm.code.trim()) return;
    try {
      const res = await fetch('/api/promo-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: promoForm.code.trim().toUpperCase(),
          discountType: promoForm.discountType,
          discountValue: Number(promoForm.discountValue),
          minOrderValue: Number(promoForm.minOrderValue),
          expiryDate: promoForm.expiryDate,
          usageLimit: Number(promoForm.usageLimit),
          isActive: promoForm.isActive,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPromoCodes([...promoCodes, data.promo]);
        setIsPromoModalOpen(false);
      }
    } catch {}
  };

  // Moderate review
  const handleModerateReview = async (reviewId: string, approved: boolean) => {
    try {
      const res = await fetch(`/api/reviews/${reviewId}/moderate`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved }),
      });
      const data = await res.json();
      if (data.success) {
        setReviews((prev) => prev.map((r) => (r.id === reviewId ? data.review : r)));
      }
    } catch {}
  };

  // Save restaurant settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setSettingsSaved(true);
        setTimeout(() => setSettingsSaved(false), 3000);
      }
    } catch {}
  };

  // If NOT logged in as admin, render secure login gate
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="bg-white rounded-3xl p-8 border border-stone-200/80 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-stone-900 text-amber-500 flex items-center justify-center mx-auto shadow-md">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-stone-900">Restaurant Admin Portal</h1>
            <p className="text-xs text-stone-500">
              Authorized Belle Food managers & kitchen staff only.
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
              {authError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Admin Email</label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition shadow-md cursor-pointer disabled:opacity-50"
            >
              {authLoading ? 'Verifying...' : 'Access Dashboard'}
            </button>
          </form>

          <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
            <span className="text-stone-400">Default: admin@bellefood.com</span>
            <button
              type="button"
              onClick={onReturnToStore}
              className="text-amber-700 font-bold hover:underline cursor-pointer"
            >
              ← Back to Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filtered orders for order management
  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) {
      return false;
    }
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customer.name.toLowerCase().includes(q) ||
        o.customer.phone.toLowerCase().includes(q) ||
        o.customer.email.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Admin Header */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold shadow-md shadow-orange-500/20">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black">Belle Food Management Suite</h1>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Live Kitchen
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              Control dishes, stock levels, orders, customer accounts, and promo codes.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadAllAdminData}
            className="p-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            title="Refresh All"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Refresh Data</span>
          </button>
          <button
            onClick={onReturnToStore}
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5"
          >
            <span>Customer View</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-200 scrollbar-thin">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
          { id: 'products', label: `Meals & Stock (${products.length})`, icon: UtensilsCrossed },
          { id: 'categories', label: `Categories (${categories.length})`, icon: Tag },
          { id: 'promos', label: `Discounts & Promos (${promoCodes.length})`, icon: Tag },
          { id: 'customers', label: `Customers (${customers.length})`, icon: Users },
          { id: 'reviews', label: `Reviews (${reviews.length})`, icon: MessageSquare },
          { id: 'settings', label: 'Restaurant Settings', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200/80'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. OVERVIEW / ANALYTICS TAB */}
      {activeTab === 'overview' && stats && (
        <div className="space-y-8">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-stone-400 uppercase">Today's Revenue</span>
              <div className="text-xl font-black text-amber-700">₦{stats.todayRevenue.toLocaleString()}</div>
              <span className="text-[10px] text-stone-400">Total: ₦{stats.totalRevenue.toLocaleString()}</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-stone-400 uppercase">Today's Orders</span>
              <div className="text-xl font-black text-stone-900">{stats.todayOrders}</div>
              <span className="text-[10px] text-stone-400">All-time: {stats.totalOrders}</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-stone-400 uppercase">Pending Cooking</span>
              <div className="text-xl font-black text-amber-600">{stats.pendingOrdersCount}</div>
              <span className="text-[10px] text-amber-600 font-semibold">Active in kitchen</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-stone-400 uppercase">Delivered</span>
              <div className="text-xl font-black text-emerald-600">{stats.completedOrdersCount}</div>
              <span className="text-[10px] text-emerald-600 font-semibold">Completed</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-stone-400 uppercase">Registered Users</span>
              <div className="text-xl font-black text-stone-900">{stats.totalCustomers}</div>
              <span className="text-[10px] text-stone-400">Customer profiles</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-stone-400 uppercase">Menu Items</span>
              <div className="text-xl font-black text-stone-900">{products.length}</div>
              <span className="text-[10px] text-emerald-600 font-semibold">{products.filter((p) => p.isAvailable).length} in stock</span>
            </div>
          </div>

          {/* Revenue Trends Chart & Popular Dishes */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Recent 7 Days Revenue Trend Bar Chart */}
            <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-stone-900">Revenue Trends (Last 7 Days)</h3>
                  <p className="text-xs text-stone-400">Daily sales performance in ₦ NGN</p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  Paystack Online & COD
                </span>
              </div>

              <div className="h-56 flex items-end justify-between gap-3 pt-6 px-2">
                {stats.recentDaysTrend?.map((day: any, idx: number) => {
                  const maxRev = Math.max(...stats.recentDaysTrend.map((d: any) => d.revenue), 20000);
                  const barHeight = Math.max(12, Math.round((day.revenue / maxRev) * 100));

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                      <span className="text-[10px] font-bold text-stone-500 opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                        ₦{(day.revenue / 1000).toFixed(0)}k
                      </span>
                      <div
                        className="w-full bg-gradient-to-t from-amber-600 to-orange-500 rounded-t-xl group-hover:scale-105 transition-all shadow-sm"
                        style={{ height: `${barHeight}%` }}
                      />
                      <span className="text-[10px] font-bold text-stone-500 truncate w-full text-center">
                        {day.date.split(',')[0]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Popular Dishes */}
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
              <h3 className="font-extrabold text-base text-stone-900">Best-Selling Dishes</h3>
              <div className="space-y-3">
                {stats.popularDishes?.map((item: any, i: number) => (
                  <div key={i} className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-5 h-5 rounded-full bg-stone-100 text-stone-600 font-extrabold text-[10px] flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <img src={item.image} alt={item.name} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                      <div className="min-w-0">
                        <div className="font-bold text-stone-900 truncate">{item.name}</div>
                        <span className="text-[11px] text-stone-400">{item.sales} portions sold</span>
                      </div>
                    </div>
                    <span className="font-extrabold text-amber-700 shrink-0">
                      ₦{item.revenue.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. ORDERS MANAGEMENT TAB (Section 15) */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search Orders */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Search order #, customer name or phone..."
                className="w-full text-xs pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
              />
            </div>

            {/* Filter by status */}
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-600 w-full sm:w-auto">
              <span>Status:</span>
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-xs font-bold text-stone-900 focus:outline-none cursor-pointer"
              >
                <option value="all">All Orders</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Preparing">Preparing</option>
                <option value="Ready">Ready</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-100 text-stone-500 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-4">Order #</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Type & Address</th>
                    <th className="p-4">Items</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Payment</th>
                    <th className="p-4">Change Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-stone-400">
                        No orders found matching filters.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-stone-50/70 transition">
                        <td className="p-4">
                          <span className="font-extrabold text-stone-900 block">{ord.orderNumber}</span>
                          <span className="text-[10px] text-stone-400">
                            {new Date(ord.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </td>

                        <td className="p-4">
                          <span className="font-bold text-stone-900 block">{ord.customer.name}</span>
                          <span className="text-[11px] text-stone-500">{ord.customer.phone}</span>
                          <span className="text-[10px] text-stone-400 block">{ord.customer.email}</span>
                        </td>

                        <td className="p-4 max-w-xs">
                          <span className="inline-flex items-center gap-1 font-semibold text-stone-800 text-[11px]">
                            {ord.orderType === 'pickup' ? (
                              <>
                                <Store className="w-3 h-3 text-amber-600" /> Pickup
                              </>
                            ) : (
                              <>
                                <Truck className="w-3 h-3 text-amber-600" /> Delivery
                              </>
                            )}
                          </span>
                          <p className="text-[11px] text-stone-500 truncate mt-0.5">
                            {ord.orderType === 'pickup' ? ord.pickupLocation : `${ord.deliveryAddress?.address}, ${ord.deliveryAddress?.city}`}
                          </p>
                        </td>

                        <td className="p-4">
                          <div className="space-y-0.5">
                            {ord.items.map((it, idx) => (
                              <div key={idx} className="text-[11px]">
                                {it.quantity}x {it.name}
                              </div>
                            ))}
                          </div>
                        </td>

                        <td className="p-4">
                          <span className="font-black text-stone-900 text-sm">₦{ord.total.toLocaleString()}</span>
                        </td>

                        <td className="p-4">
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                              ord.paymentStatus === 'paid'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-amber-50 text-amber-800'
                            }`}
                          >
                            {ord.paymentStatus === 'paid' ? 'Paid (Paystack)' : 'Pending (COD)'}
                          </span>
                        </td>

                        <td className="p-4">
                          <select
                            value={ord.status}
                            onChange={(e) => handleOrderStatusChange(ord.orderNumber, e.target.value as any)}
                            className="bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1 text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Preparing">Preparing</option>
                            <option value="Ready">Ready</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. PRODUCT MANAGEMENT TAB (Section 13) */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-stone-900">Food Menu & Stock Control</h2>
              <p className="text-xs text-stone-400">Toggle meal availability, edit prices, or introduce new dishes.</p>
            </div>
            <button
              onClick={openAddProductModal}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Meal</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-100 text-stone-500 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-4">Meal</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Discount</th>
                    <th className="p-4">Availability</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {products.map((prod) => (
                    <tr key={prod.id} className="hover:bg-stone-50/70 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={prod.image} alt={prod.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                          <div>
                            <div className="font-extrabold text-stone-900">{prod.name}</div>
                            <span className="text-[11px] text-stone-400">{prod.prepTime} • {prod.portionSize}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="bg-stone-100 text-stone-700 text-[10px] font-bold uppercase px-2 py-0.5 rounded">
                          {prod.category}
                        </span>
                      </td>

                      <td className="p-4 font-black text-stone-900 text-sm">
                        ₦{prod.price.toLocaleString()}
                      </td>

                      <td className="p-4">
                        {prod.discountPercent && prod.discountPercent > 0 ? (
                          <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded text-[11px]">
                            {prod.discountPercent}% OFF
                          </span>
                        ) : (
                          <span className="text-stone-400">—</span>
                        )}
                      </td>

                      <td className="p-4">
                        <button
                          type="button"
                          onClick={() => handleToggleAvailability(prod.id)}
                          className={`px-3 py-1 rounded-full text-[11px] font-bold transition cursor-pointer ${
                            prod.isAvailable
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                          }`}
                        >
                          {prod.isAvailable ? 'In Stock' : 'Out of Stock'}
                        </button>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditProductModal(prod)}
                            className="p-1.5 text-stone-500 hover:text-amber-600 hover:bg-stone-100 rounded-lg transition cursor-pointer"
                            title="Edit Meal"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                            title="Delete Meal"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. CATEGORIES TAB (Section 14) */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-stone-900">Food Categories ({categories.length})</h2>
            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat) => {
              const count = products.filter((p) => p.category.toLowerCase() === cat.name.toLowerCase()).length;
              return (
                <div key={cat.id} className="bg-white p-4 rounded-3xl border border-stone-200/80 shadow-xs flex items-center gap-3">
                  <img src={cat.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'} alt={cat.name} className="w-14 h-14 rounded-2xl object-cover shrink-0" />
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-xs text-stone-900 truncate">{cat.name}</h4>
                    <p className="text-[11px] text-stone-400">{count} active dishes</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. PROMO CODES TAB (Section 17) */}
      {activeTab === 'promos' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-stone-900">Discount Coupons & Promo Codes</h2>
              <p className="text-xs text-stone-400">Create promotional codes for customers to apply in checkout.</p>
            </div>
            <button
              onClick={() => setIsPromoModalOpen(true)}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Promo Code</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {promoCodes.map((p) => (
              <div key={p.id} className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-black text-sm text-stone-900 bg-amber-50 text-amber-800 px-3 py-1 rounded-xl uppercase tracking-wider">
                    {p.code}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-400'}`}>
                    {p.isActive ? 'Active' : 'Disabled'}
                  </span>
                </div>
                <div className="text-xs text-stone-600 space-y-1">
                  <div>Discount: <b>{p.discountType === 'percentage' ? `${p.discountValue}% OFF` : `₦${p.discountValue} Flat`}</b></div>
                  <div>Min Order: <b>₦{p.minOrderValue.toLocaleString()}</b></div>
                  <div>Usage: <b>{p.usageCount} / {p.usageLimit || '∞'}</b></div>
                  <div>Expires: <b>{p.expiryDate}</b></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. CUSTOMER MANAGEMENT (Section 16) */}
      {activeTab === 'customers' && (
        <div className="space-y-6">
          <h2 className="text-base font-extrabold text-stone-900">Registered Customer Directory ({customers.length})</h2>
          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-100 text-stone-500 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Total Orders</th>
                    <th className="p-4">Total Spent</th>
                    <th className="p-4">Member Since</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-stone-50/70 transition">
                      <td className="p-4 font-bold text-stone-900">
                        <div>{c.name}</div>
                        <span className="text-[10px] text-stone-400 font-normal">{c.email}</span>
                      </td>
                      <td className="p-4 text-stone-600">{c.phone || '—'}</td>
                      <td className="p-4 font-bold text-stone-900">{c.ordersCount} orders</td>
                      <td className="p-4 font-black text-amber-700 text-sm">₦{c.totalSpent.toLocaleString()}</td>
                      <td className="p-4 text-stone-400">
                        {new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 7. REVIEWS MODERATION (Section 19) */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <h2 className="text-base font-extrabold text-stone-900">Customer Reviews Moderation ({reviews.length})</h2>
          <div className="space-y-3">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs text-stone-900">{rev.customerName}</span>
                    <span className="text-[11px] text-amber-600 font-bold">★ {rev.rating}/5</span>
                    <span className="text-[10px] text-stone-400">on {rev.productName}</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed italic">"{rev.comment}"</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${rev.approved ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                    {rev.approved ? 'Published' : 'Hidden'}
                  </span>
                  <button
                    onClick={() => handleModerateReview(rev.id, !rev.approved)}
                    className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl transition cursor-pointer"
                  >
                    {rev.approved ? 'Hide' : 'Approve'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. RESTAURANT SETTINGS TAB (Section 18) */}
      {activeTab === 'settings' && settings && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs max-w-3xl space-y-6">
          <div>
            <h2 className="text-base font-extrabold text-stone-900">Restaurant Configuration</h2>
            <p className="text-xs text-stone-400">
              Manage your delivery fee thresholds, contact information, and payment options without editing source code.
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Restaurant Name</label>
                <input
                  type="text"
                  value={settings.name}
                  onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Tagline</label>
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Phone Hotline</label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Support Email</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Flat Delivery Fee (₦)</label>
                <input
                  type="number"
                  value={settings.deliveryFee}
                  onChange={(e) => setSettings({ ...settings, deliveryFee: Number(e.target.value) })}
                  className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Free Delivery Min Spend (₦)</label>
                <input
                  type="number"
                  value={settings.freeDeliveryThreshold}
                  onChange={(e) => setSettings({ ...settings, freeDeliveryThreshold: Number(e.target.value) })}
                  className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Address</label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Opening Hours</label>
              <input
                type="text"
                value={settings.openingHours}
                onChange={(e) => setSettings({ ...settings, openingHours: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 text-xs font-bold text-stone-800 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={settings.cashOnDeliveryEnabled}
                  onChange={(e) => setSettings({ ...settings, cashOnDeliveryEnabled: e.target.checked })}
                  className="w-4 h-4 text-amber-600 rounded cursor-pointer"
                />
                <span>Enable Cash on Delivery / Pay on Pickup option for customers</span>
              </label>
            </div>

            {settingsSaved && (
              <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <Check className="w-4 h-4" /> Settings saved successfully!
              </p>
            )}

            <button
              type="submit"
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer"
            >
              Save Restaurant Settings
            </button>
          </form>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-stone-200 max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-stone-100 flex justify-between items-center bg-stone-50">
              <h3 className="font-extrabold text-base text-stone-900">
                {editingProduct ? 'Edit Food Item' : 'Add New Meal to Menu'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Meal Name *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="e.g. Asun Peppered Goat Meat"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Category *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Price in ₦ (NGN) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Discount % (Optional)</label>
                  <input
                    type="number"
                    value={productForm.discountPercent}
                    onChange={(e) => setProductForm({ ...productForm, discountPercent: Number(e.target.value) })}
                    placeholder="e.g. 10 for 10% off"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Description *</label>
                <textarea
                  required
                  rows={2}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Appetizing description of ingredients and flavors..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Ingredients (Comma separated)</label>
                <input
                  type="text"
                  value={productForm.ingredientsStr}
                  onChange={(e) => setProductForm({ ...productForm, ingredientsStr: e.target.value })}
                  placeholder="Long grain rice, Pepper sauce, Chicken, Plantain..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Prep Time</label>
                  <input
                    type="text"
                    value={productForm.prepTime}
                    onChange={(e) => setProductForm({ ...productForm, prepTime: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Portion Info</label>
                  <input
                    type="text"
                    value={productForm.portionSize}
                    onChange={(e) => setProductForm({ ...productForm, portionSize: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <label className="flex items-center gap-2 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isAvailable}
                    onChange={(e) => setProductForm({ ...productForm, isAvailable: e.target.checked })}
                    className="w-4 h-4 text-amber-600 rounded"
                  />
                  <span>In Stock / Available</span>
                </label>
                <label className="flex items-center gap-2 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isFeatured}
                    onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                    className="w-4 h-4 text-amber-600 rounded"
                  />
                  <span>Featured Dish</span>
                </label>
                <label className="flex items-center gap-2 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isPopular}
                    onChange={(e) => setProductForm({ ...productForm, isPopular: e.target.checked })}
                    className="w-4 h-4 text-amber-600 rounded"
                  />
                  <span>Popular Dish</span>
                </label>
              </div>

              <div className="pt-4 border-t border-stone-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 font-bold text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl"
                >
                  Save Meal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-stone-200 space-y-4">
            <h3 className="font-extrabold text-base text-stone-900">Add New Category</h3>
            <form onSubmit={handleAddCategory} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Seafood"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-stone-700 mb-1">Description</label>
                <input
                  type="text"
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="Short description"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-stone-700 mb-1">Category Image URL</label>
                <input
                  type="url"
                  value={newCatImage}
                  onChange={(e) => setNewCatImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 font-bold text-stone-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 text-white font-bold rounded-xl"
                >
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Promo Code Modal */}
      {isPromoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-stone-200 space-y-4">
            <h3 className="font-extrabold text-base text-stone-900">Create New Promo Code</h3>
            <form onSubmit={handleAddPromoCode} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Code (e.g. WEEKEND25)</label>
                <input
                  type="text"
                  required
                  value={promoForm.code}
                  onChange={(e) => setPromoForm({ ...promoForm, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl uppercase font-bold"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Discount Type</label>
                  <select
                    value={promoForm.discountType}
                    onChange={(e) => setPromoForm({ ...promoForm, discountType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₦)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    value={promoForm.discountValue}
                    onChange={(e) => setPromoForm({ ...promoForm, discountValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-stone-700 mb-1">Min Order Value (₦)</label>
                <input
                  type="number"
                  value={promoForm.minOrderValue}
                  onChange={(e) => setPromoForm({ ...promoForm, minOrderValue: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPromoModalOpen(false)}
                  className="px-4 py-2 font-bold text-stone-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 text-white font-bold rounded-xl"
                >
                  Save Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
