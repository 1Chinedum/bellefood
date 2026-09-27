import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  Product,
  Category,
  Order,
  User,
  Review,
  PromoCode,
  RestaurantSettings,
  OrderStatus,
} from '../src/types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_PROMO_CODES,
  INITIAL_SETTINGS,
} from './seedData';

interface DatabaseSchema {
  products: Product[];
  categories: Category[];
  orders: Order[];
  users: (User & { passwordHash?: string })[];
  reviews: Review[];
  promoCodes: PromoCode[];
  settings: RestaurantSettings;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + 'belle_salt_2026').digest('hex');
}

function getInitialData(): DatabaseSchema {
  const initialAdmin: User & { passwordHash: string } = {
    id: 'user-admin',
    name: 'Belle Food Manager',
    email: 'admin@bellefood.com',
    phone: '+234 801 234 5678',
    role: 'admin',
    addresses: [
      {
        id: 'addr-admin-1',
        label: 'Flagship Store',
        address: '14 Admiralty Way, Lekki Phase 1',
        city: 'Lekki',
        state: 'Lagos',
        isDefault: true,
      },
    ],
    favorites: ['prod-jollof-chicken', 'prod-egusi-pounded-yam'],
    createdAt: new Date().toISOString(),
    passwordHash: hashPassword('admin123'),
  };

  const initialCustomer: User & { passwordHash: string } = {
    id: 'user-customer-1',
    name: 'Chioma Adebayo',
    email: 'chioma@example.com',
    phone: '+234 809 111 2233',
    role: 'customer',
    addresses: [
      {
        id: 'addr-c1',
        label: 'Home',
        address: 'Plot 8, Bisola Durosinmi Etti Drive, Lekki Phase 1',
        city: 'Lekki',
        state: 'Lagos',
        isDefault: true,
      },
    ],
    favorites: ['prod-jollof-chicken', 'prod-beef-burger'],
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    passwordHash: hashPassword('password123'),
  };

  const initialOrders: Order[] = [
    {
      id: 'ord-101',
      orderNumber: 'BF-83921',
      customer: {
        name: 'Chioma Adebayo',
        email: 'chioma@example.com',
        phone: '+234 809 111 2233',
      },
      orderType: 'delivery',
      deliveryAddress: {
        address: 'Plot 8, Bisola Durosinmi Etti Drive, Lekki Phase 1',
        city: 'Lekki',
        state: 'Lagos',
        instructions: 'Call at the security gate',
      },
      items: [
        {
          productId: 'prod-jollof-chicken',
          name: 'Party Jollof Rice & Roasted Chicken',
          price: 4500,
          quantity: 2,
          selectedAddOns: [{ name: 'Extra Sweet Plantain (Dodo)', price: 700 }],
          specialInstructions: 'Please make it extra spicy',
          total: 10400,
          image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
        },
        {
          productId: 'prod-fresh-juice',
          name: 'Fresh Pineapple & Ginger Nectar (500ml)',
          price: 1800,
          quantity: 2,
          selectedAddOns: [],
          total: 3600,
          image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=400&q=80',
        },
      ],
      subtotal: 14000,
      deliveryFee: 1200,
      discount: 1400,
      promoCode: 'BELLE10',
      total: 13800,
      paymentMethod: 'paystack',
      paymentStatus: 'paid',
      paystackReference: 'T_REF_83921_OK',
      status: 'Delivered',
      createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 3600000).toISOString(),
      estimatedDeliveryTime: 'Delivered on time',
      userId: 'user-customer-1',
    },
    {
      id: 'ord-102',
      orderNumber: 'BF-91823',
      customer: {
        name: 'Emeka Okafor',
        email: 'emeka@example.com',
        phone: '+234 812 555 6789',
      },
      orderType: 'delivery',
      deliveryAddress: {
        address: '18 Victoria Arobieke St, Lekki Phase 1',
        city: 'Lekki',
        state: 'Lagos',
        instructions: 'Apartment 4B on 2nd floor',
      },
      items: [
        {
          productId: 'prod-egusi-pounded-yam',
          name: 'Rich Egusi Soup & Fluffy Pounded Yam',
          price: 5800,
          quantity: 1,
          selectedAddOns: [{ name: 'Extra Goat Meat (2 pcs)', price: 1800 }],
          specialInstructions: 'Warm the soup well please',
          total: 7600,
          image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=400&q=80',
        },
        {
          productId: 'prod-chapman-special',
          name: 'Belle Classic Chapman Cocktail (Mocktail)',
          price: 2000,
          quantity: 1,
          selectedAddOns: [],
          total: 2000,
          image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=400&q=80',
        },
      ],
      subtotal: 9600,
      deliveryFee: 1200,
      discount: 0,
      total: 10800,
      paymentMethod: 'paystack',
      paymentStatus: 'paid',
      paystackReference: 'T_REF_91823_OK',
      status: 'Out for Delivery',
      createdAt: new Date(Date.now() - 35 * 60000).toISOString(),
      updatedAt: new Date(Date.now() - 10 * 60000).toISOString(),
      estimatedDeliveryTime: '15-20 mins',
    },
    {
      id: 'ord-103',
      orderNumber: 'BF-94112',
      customer: {
        name: 'Tunde Bakare',
        email: 'tunde@example.com',
        phone: '+234 803 444 8899',
      },
      orderType: 'pickup',
      pickupLocation: 'Flagship Branch: 14 Admiralty Way, Lekki Phase 1, Lagos',
      items: [
        {
          productId: 'prod-beef-burger',
          name: 'Belle Classic Double Cheeseburger',
          price: 5200,
          quantity: 1,
          selectedAddOns: [{ name: 'Extra Cheddar Slice', price: 600 }],
          total: 5800,
          image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80',
        },
      ],
      subtotal: 5800,
      deliveryFee: 0,
      discount: 580,
      promoCode: 'BELLE10',
      total: 5220,
      paymentMethod: 'paystack',
      paymentStatus: 'paid',
      paystackReference: 'T_REF_94112_OK',
      status: 'Preparing',
      createdAt: new Date(Date.now() - 12 * 60000).toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedDeliveryTime: 'Ready for pickup in 10 mins',
    },
  ];

  const initialReviews: Review[] = [
    {
      id: 'rev-1',
      productId: 'prod-jollof-chicken',
      productName: 'Party Jollof Rice & Roasted Chicken',
      customerName: 'Amina Bello',
      rating: 5,
      comment: 'The smoky party flavor is 100% authentic! The chicken was deeply seasoned and the plantain was sweet and golden. Belle Food has become our family Friday tradition.',
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      approved: true,
    },
    {
      id: 'rev-2',
      productId: 'prod-egusi-pounded-yam',
      productName: 'Rich Egusi Soup & Fluffy Pounded Yam',
      customerName: 'Chinedu Eze',
      rating: 5,
      comment: 'Incredible depth of flavor with the stockfish and goat meat. The pounded yam was smooth without a single lump. Delivered hot in 35 mins.',
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      approved: true,
    },
    {
      id: 'rev-3',
      productId: 'prod-beef-burger',
      productName: 'Belle Classic Double Cheeseburger',
      customerName: 'David Kalu',
      rating: 5,
      comment: 'Legitimately one of the best gourmet smash burgers in Lagos. Juicy double patties and brioche was toasted to perfection.',
      createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
      approved: true,
    },
    {
      id: 'rev-4',
      productId: 'prod-pizza-chicken',
      productName: 'Loaded BBQ Chicken & Sweetcorn Pizza',
      customerName: 'Funmi Adeleke',
      rating: 5,
      comment: 'Crust is so crisp and the shredded BBQ chicken topping is very generous. The Paystack payment was super quick too.',
      createdAt: new Date(Date.now() - 9 * 86400000).toISOString(),
      approved: true,
    },
  ];

  return {
    products: INITIAL_PRODUCTS,
    categories: INITIAL_CATEGORIES,
    orders: initialOrders,
    users: [initialAdmin, initialCustomer],
    reviews: initialReviews,
    promoCodes: INITIAL_PROMO_CODES,
    settings: INITIAL_SETTINGS,
  };
}

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error('Error loading db.json, reinitializing from seed:', err);
    }
    const initial = getInitialData();
    this.save(initial);
    return initial;
  }

  private save(dataToSave?: DatabaseSchema) {
    try {
      const data = dataToSave || this.data;
      const tmp = `${DB_FILE}.tmp.${Date.now()}`;
      fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(tmp, DB_FILE);
    } catch (err) {
      console.error('Error saving db.json:', err);
    }
  }

  // PRODUCTS
  getProducts(): Product[] {
    return this.data.products;
  }

  getProductById(id: string): Product | undefined {
    return this.data.products.find((p) => p.id === id || p.slug === id);
  }

  createProduct(productData: Omit<Product, 'id'>): Product {
    const id = `prod-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    const newProduct: Product = {
      ...productData,
      id,
      slug: productData.slug || productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      rating: productData.rating || 5.0,
      reviewsCount: productData.reviewsCount || 0,
      addOns: productData.addOns || [],
      ingredients: productData.ingredients || [],
    };
    this.data.products.unshift(newProduct);
    this.save();
    return newProduct;
  }

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const idx = this.data.products.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.data.products[idx] = { ...this.data.products[idx], ...updates };
    this.save();
    return this.data.products[idx];
  }

  deleteProduct(id: string): boolean {
    const initialLen = this.data.products.length;
    this.data.products = this.data.products.filter((p) => p.id !== id);
    if (this.data.products.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  toggleProductAvailability(id: string): Product | null {
    const product = this.data.products.find((p) => p.id === id);
    if (!product) return null;
    product.isAvailable = !product.isAvailable;
    this.save();
    return product;
  }

  // CATEGORIES
  getCategories(): Category[] {
    return this.data.categories;
  }

  createCategory(categoryData: Omit<Category, 'id'>): Category {
    const id = `cat-${categoryData.slug || Date.now().toString(36)}`;
    const newCat: Category = { ...categoryData, id };
    this.data.categories.push(newCat);
    this.save();
    return newCat;
  }

  updateCategory(id: string, updates: Partial<Category>): Category | null {
    const idx = this.data.categories.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    this.data.categories[idx] = { ...this.data.categories[idx], ...updates };
    this.save();
    return this.data.categories[idx];
  }

  deleteCategory(id: string): boolean {
    const initialLen = this.data.categories.length;
    this.data.categories = this.data.categories.filter((c) => c.id !== id);
    if (this.data.categories.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // ORDERS
  getOrders(): Order[] {
    return this.data.orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getOrderByNumber(orderNumber: string): Order | undefined {
    return this.data.orders.find(
      (o) => o.orderNumber.toLowerCase() === orderNumber.toLowerCase() || o.id === orderNumber
    );
  }

  getOrdersByUser(userIdOrEmail: string): Order[] {
    return this.data.orders.filter(
      (o) => o.userId === userIdOrEmail || o.customer.email.toLowerCase() === userIdOrEmail.toLowerCase()
    );
  }

  createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Order {
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `BF-${randomDigits}`;
    const id = `ord-${Date.now()}`;
    const now = new Date().toISOString();

    const newOrder: Order = {
      ...orderData,
      id,
      orderNumber,
      createdAt: now,
      updatedAt: now,
    };

    // If promo code was used, increment promo usage count
    if (newOrder.promoCode) {
      const promo = this.data.promoCodes.find((p) => p.code.toUpperCase() === newOrder.promoCode?.toUpperCase());
      if (promo) {
        promo.usageCount += 1;
      }
    }

    this.data.orders.unshift(newOrder);
    this.save();
    return newOrder;
  }

  updateOrderStatus(orderNumber: string, status: OrderStatus): Order | null {
    const order = this.getOrderByNumber(orderNumber);
    if (!order) return null;
    order.status = status;
    order.updatedAt = new Date().toISOString();
    this.save();
    return order;
  }

  updateOrderPayment(orderNumber: string, paymentStatus: 'paid' | 'pending' | 'failed', reference?: string): Order | null {
    const order = this.getOrderByNumber(orderNumber);
    if (!order) return null;
    order.paymentStatus = paymentStatus;
    if (reference) order.paystackReference = reference;
    if (paymentStatus === 'paid' && order.status === 'Pending') {
      order.status = 'Confirmed';
    }
    order.updatedAt = new Date().toISOString();
    this.save();
    return order;
  }

  // PROMO CODES
  getPromoCodes(): PromoCode[] {
    return this.data.promoCodes;
  }

  validatePromoCode(code: string, subtotal: number): { valid: boolean; discount: number; message: string; promo?: PromoCode } {
    const normalized = code.trim().toUpperCase();
    const promo = this.data.promoCodes.find((p) => p.code.toUpperCase() === normalized);

    if (!promo) {
      return { valid: false, discount: 0, message: 'Invalid promo code' };
    }
    if (!promo.isActive) {
      return { valid: false, discount: 0, message: 'This promo code is no longer active' };
    }
    if (promo.usageLimit > 0 && promo.usageCount >= promo.usageLimit) {
      return { valid: false, discount: 0, message: 'This promo code has reached its usage limit' };
    }
    if (new Date(promo.expiryDate).getTime() < Date.now()) {
      return { valid: false, discount: 0, message: 'This promo code has expired' };
    }
    if (subtotal < promo.minOrderValue) {
      return {
        valid: false,
        discount: 0,
        message: `Minimum order value for ${promo.code} is ₦${promo.minOrderValue.toLocaleString()}`,
      };
    }

    let discount = 0;
    if (promo.discountType === 'percentage') {
      discount = Math.round((subtotal * promo.discountValue) / 100);
    } else {
      discount = promo.discountValue;
    }

    return {
      valid: true,
      discount,
      message: `Promo code ${promo.code} applied successfully!`,
      promo,
    };
  }

  createPromoCode(data: Omit<PromoCode, 'id' | 'usageCount'>): PromoCode {
    const newPromo: PromoCode = {
      ...data,
      id: `promo-${Date.now()}`,
      code: data.code.trim().toUpperCase(),
      usageCount: 0,
    };
    this.data.promoCodes.push(newPromo);
    this.save();
    return newPromo;
  }

  updatePromoCode(id: string, updates: Partial<PromoCode>): PromoCode | null {
    const idx = this.data.promoCodes.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.data.promoCodes[idx] = { ...this.data.promoCodes[idx], ...updates };
    this.save();
    return this.data.promoCodes[idx];
  }

  deletePromoCode(id: string): boolean {
    const initialLen = this.data.promoCodes.length;
    this.data.promoCodes = this.data.promoCodes.filter((p) => p.id !== id);
    if (this.data.promoCodes.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // REVIEWS
  getReviews(productId?: string): Review[] {
    if (productId) {
      return this.data.reviews.filter((r) => r.productId === productId && r.approved);
    }
    return this.data.reviews;
  }

  getAllReviewsForAdmin(): Review[] {
    return this.data.reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  addReview(reviewData: Omit<Review, 'id' | 'createdAt' | 'approved'>): Review {
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString(),
      approved: true, // Auto-approve with moderation toggle in admin
    };
    this.data.reviews.unshift(newReview);

    // Update product rating and reviewsCount
    const product = this.data.products.find((p) => p.id === reviewData.productId);
    if (product) {
      const prodReviews = this.data.reviews.filter((r) => r.productId === product.id);
      const totalRating = prodReviews.reduce((sum, r) => sum + r.rating, 0);
      product.rating = Number((totalRating / prodReviews.length).toFixed(1));
      product.reviewsCount = prodReviews.length;
    }

    this.save();
    return newReview;
  }

  moderateReview(id: string, approved: boolean): Review | null {
    const review = this.data.reviews.find((r) => r.id === id);
    if (!review) return null;
    review.approved = approved;
    this.save();
    return review;
  }

  // USERS & AUTH
  findUserByEmail(email: string): (User & { passwordHash?: string }) | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id: string): (User & { passwordHash?: string }) | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  createUser(name: string, email: string, phone: string, password: string, role: 'customer' | 'admin' = 'customer'): User {
    const existing = this.findUserByEmail(email);
    if (existing) {
      throw new Error('A user with this email already exists.');
    }
    const newUser: User & { passwordHash: string } = {
      id: `user-${Date.now()}`,
      name,
      email: email.toLowerCase(),
      phone,
      role,
      addresses: [],
      favorites: [],
      createdAt: new Date().toISOString(),
      passwordHash: hashPassword(password),
    };
    this.data.users.push(newUser);
    this.save();
    const { passwordHash: _, ...safeUser } = newUser;
    return safeUser;
  }

  verifyUserPassword(email: string, password: string): User | null {
    const user = this.findUserByEmail(email);
    if (!user || !user.passwordHash) return null;
    const computed = hashPassword(password);
    if (computed === user.passwordHash) {
      const { passwordHash: _, ...safeUser } = user;
      return safeUser;
    }
    return null;
  }

  updateUserProfile(id: string, updates: Partial<User>): User | null {
    const user = this.data.users.find((u) => u.id === id);
    if (!user) return null;
    if (updates.name) user.name = updates.name;
    if (updates.phone) user.phone = updates.phone;
    if (updates.addresses) user.addresses = updates.addresses;
    if (updates.favorites) user.favorites = updates.favorites;
    this.save();
    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  }

  toggleFavorite(userId: string, productId: string): string[] {
    const user = this.data.users.find((u) => u.id === userId);
    if (!user) return [];
    if (!user.favorites) user.favorites = [];
    if (user.favorites.includes(productId)) {
      user.favorites = user.favorites.filter((id) => id !== productId);
    } else {
      user.favorites.push(productId);
    }
    this.save();
    return user.favorites;
  }

  getCustomersList() {
    return this.data.users
      .filter((u) => u.role === 'customer')
      .map((u) => {
        const userOrders = this.data.orders.filter(
          (o) => o.userId === u.id || o.customer.email.toLowerCase() === u.email.toLowerCase()
        );
        const totalSpent = userOrders
          .filter((o) => o.paymentStatus === 'paid')
          .reduce((sum, o) => sum + o.total, 0);

        return {
          id: u.id,
          name: u.name,
          email: u.email,
          phone: u.phone,
          ordersCount: userOrders.length,
          totalSpent,
          createdAt: u.createdAt,
        };
      });
  }

  // SETTINGS
  getSettings(): RestaurantSettings {
    return this.data.settings;
  }

  updateSettings(updates: Partial<RestaurantSettings>): RestaurantSettings {
    this.data.settings = { ...this.data.settings, ...updates };
    this.save();
    return this.data.settings;
  }

  // ADMIN ANALYTICS
  getAdminStats() {
    const orders = this.data.orders;
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    const todayOrders = orders.filter((o) => new Date(o.createdAt).getTime() >= todayStart);
    const todayRevenue = todayOrders
      .filter((o) => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + o.total, 0);
    const totalRevenue = orders
      .filter((o) => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + o.total, 0);

    const pendingOrdersCount = orders.filter((o) => o.status === 'Pending' || o.status === 'Preparing').length;
    const completedOrdersCount = orders.filter((o) => o.status === 'Delivered').length;
    const totalCustomers = this.data.users.filter((u) => u.role === 'customer').length;

    // Popular dish sales counting
    const productSalesMap: Record<string, { name: string; sales: number; revenue: number; image: string }> = {};
    orders.forEach((o) => {
      o.items.forEach((item) => {
        if (!productSalesMap[item.productId]) {
          productSalesMap[item.productId] = {
            name: item.name,
            sales: 0,
            revenue: 0,
            image: item.image,
          };
        }
        productSalesMap[item.productId].sales += item.quantity;
        productSalesMap[item.productId].revenue += item.total;
      });
    });

    const popularDishes = Object.values(productSalesMap)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    // Recent 7 days revenue trend
    const recentDaysTrend = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(todayStart - i * 86400000);
      const nextD = new Date(d.getTime() + 86400000);
      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      const dayOrders = orders.filter((o) => {
        const t = new Date(o.createdAt).getTime();
        return t >= d.getTime() && t < nextD.getTime() && o.paymentStatus === 'paid';
      });
      const dayRevenue = dayOrders.reduce((sum, o) => sum + o.total, 0);
      recentDaysTrend.push({ date: dayLabel, revenue: dayRevenue, orders: dayOrders.length });
    }

    return {
      totalOrders: orders.length,
      todayOrders: todayOrders.length,
      todayRevenue,
      totalRevenue,
      pendingOrdersCount,
      completedOrdersCount,
      totalCustomers,
      popularDishes,
      recentDaysTrend,
    };
  }
}

export const db = new Database();
