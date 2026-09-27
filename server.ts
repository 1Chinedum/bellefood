import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './server/db';
import { initializeTransaction, verifyTransaction, getPublicKey } from './server/paystack';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// ---------------- API ROUTES ----------------

// Products
app.get('/api/products', (req: Request, res: Response) => {
  const { category, search, sort, availableOnly } = req.query;
  let products = db.getProducts();

  if (category && category !== 'all') {
    products = products.filter((p) => p.category.toLowerCase() === String(category).toLowerCase());
  }

  if (search) {
    const q = String(search).toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.ingredients.some((ing) => ing.toLowerCase().includes(q))
    );
  }

  if (availableOnly === 'true') {
    products = products.filter((p) => p.isAvailable);
  }

  if (sort) {
    if (sort === 'price-low') {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      products.sort((a, b) => b.price - a.price);
    } else if (sort === 'popular') {
      products.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
    }
  }

  res.json({ success: true, products });
});

app.get('/api/products/:id', (req: Request, res: Response) => {
  const product = db.getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({ success: true, product });
});

app.post('/api/products', (req: Request, res: Response) => {
  try {
    const product = db.createProduct(req.body);
    res.status(201).json({ success: true, product });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message || 'Failed to create product' });
  }
});

app.put('/api/products/:id', (req: Request, res: Response) => {
  const updated = db.updateProduct(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({ success: true, product: updated });
});

app.patch('/api/products/:id/toggle-availability', (req: Request, res: Response) => {
  const updated = db.toggleProductAvailability(req.params.id);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({ success: true, product: updated });
});

app.delete('/api/products/:id', (req: Request, res: Response) => {
  const deleted = db.deleteProduct(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({ success: true, message: 'Product deleted' });
});

// Categories
app.get('/api/categories', (req: Request, res: Response) => {
  const categories = db.getCategories();
  res.json({ success: true, categories });
});

app.post('/api/categories', (req: Request, res: Response) => {
  try {
    const category = db.createCategory(req.body);
    res.status(201).json({ success: true, category });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message || 'Failed to create category' });
  }
});

app.put('/api/categories/:id', (req: Request, res: Response) => {
  const updated = db.updateCategory(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }
  res.json({ success: true, category: updated });
});

app.delete('/api/categories/:id', (req: Request, res: Response) => {
  const deleted = db.deleteCategory(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }
  res.json({ success: true, message: 'Category deleted' });
});

// Orders
app.get('/api/orders', (req: Request, res: Response) => {
  const { user } = req.query;
  if (user) {
    const orders = db.getOrdersByUser(String(user));
    return res.json({ success: true, orders });
  }
  const orders = db.getOrders();
  res.json({ success: true, orders });
});

app.get('/api/orders/:orderNumber', (req: Request, res: Response) => {
  const order = db.getOrderByNumber(req.params.orderNumber);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  res.json({ success: true, order });
});

app.post('/api/orders', (req: Request, res: Response) => {
  try {
    const {
      customer,
      orderType,
      deliveryAddress,
      pickupLocation,
      items,
      subtotal,
      deliveryFee,
      discount,
      promoCode,
      total,
      paymentMethod,
      userId,
    } = req.body;

    if (!customer?.name || !customer?.email || !customer?.phone) {
      return res.status(400).json({ success: false, message: 'Customer information is incomplete' });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Your cart is empty' });
    }

    const initialPaymentStatus = paymentMethod === 'cod' ? 'pending' : 'pending';
    const estimatedDeliveryTime = orderType === 'pickup' ? '15-25 mins' : '35-45 mins';

    const order = db.createOrder({
      customer,
      orderType,
      deliveryAddress,
      pickupLocation,
      items,
      subtotal,
      deliveryFee: deliveryFee || 0,
      discount: discount || 0,
      promoCode,
      total,
      paymentMethod,
      paymentStatus: initialPaymentStatus,
      status: 'Pending',
      estimatedDeliveryTime,
      userId,
    });

    res.status(201).json({ success: true, order });
  } catch (err: any) {
    console.error('Order creation error:', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to place order' });
  }
});

app.patch('/api/orders/:orderNumber/status', (req: Request, res: Response) => {
  const { status } = req.body;
  const updated = db.updateOrderStatus(req.params.orderNumber, status);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  res.json({ success: true, order: updated });
});

// Paystack Payments
app.get('/api/paystack/public-key', (_req: Request, res: Response) => {
  res.json({ success: true, publicKey: getPublicKey() });
});

app.post('/api/paystack/initialize', async (req: Request, res: Response) => {
  try {
    const { orderNumber, email, amount, callbackUrl, metadata } = req.body;
    if (!orderNumber || !email || !amount) {
      return res.status(400).json({ success: false, message: 'Missing payment details' });
    }

    const result = await initializeTransaction({
      orderNumber,
      email,
      amount: Number(amount),
      callbackUrl,
      metadata,
    });

    res.json(result);
  } catch (err: any) {
    console.error('Payment initialization error:', err);
    res.status(500).json({ success: false, message: err.message || 'Payment initialization failed' });
  }
});

app.get('/api/paystack/verify/:reference', async (req: Request, res: Response) => {
  try {
    const { reference } = req.params;
    const result = await verifyTransaction(reference);
    res.json(result);
  } catch (err: any) {
    console.error('Payment verification error:', err);
    res.status(500).json({ success: false, message: err.message || 'Payment verification failed' });
  }
});

// Promo Codes
app.get('/api/promo-codes', (_req: Request, res: Response) => {
  const promoCodes = db.getPromoCodes();
  res.json({ success: true, promoCodes });
});

app.post('/api/promo-codes/validate', (req: Request, res: Response) => {
  const { code, subtotal } = req.body;
  if (!code) {
    return res.status(400).json({ valid: false, message: 'Please provide a promo code' });
  }
  const result = db.validatePromoCode(String(code), Number(subtotal || 0));
  res.json(result);
});

app.post('/api/promo-codes', (req: Request, res: Response) => {
  try {
    const promo = db.createPromoCode(req.body);
    res.status(201).json({ success: true, promo });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message || 'Failed to create promo code' });
  }
});

app.patch('/api/promo-codes/:id', (req: Request, res: Response) => {
  const updated = db.updatePromoCode(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Promo code not found' });
  }
  res.json({ success: true, promo: updated });
});

app.delete('/api/promo-codes/:id', (req: Request, res: Response) => {
  const deleted = db.deletePromoCode(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Promo code not found' });
  }
  res.json({ success: true, message: 'Promo code deleted' });
});

// Reviews
app.get('/api/reviews', (req: Request, res: Response) => {
  const { productId, admin } = req.query;
  if (admin === 'true') {
    return res.json({ success: true, reviews: db.getAllReviewsForAdmin() });
  }
  const reviews = db.getReviews(productId ? String(productId) : undefined);
  res.json({ success: true, reviews });
});

app.post('/api/reviews', (req: Request, res: Response) => {
  try {
    const review = db.addReview(req.body);
    res.status(201).json({ success: true, review });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message || 'Failed to submit review' });
  }
});

app.patch('/api/reviews/:id/moderate', (req: Request, res: Response) => {
  const { approved } = req.body;
  const updated = db.moderateReview(req.params.id, Boolean(approved));
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Review not found' });
  }
  res.json({ success: true, review: updated });
});

// Auth & Users
app.post('/api/auth/register', (req: Request, res: Response) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }
    const user = db.createUser(name, email, phone || '', password, 'customer');
    res.status(201).json({ success: true, user });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message || 'Registration failed' });
  }
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }
  const user = db.verifyUserPassword(email, password);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }
  res.json({ success: true, user });
});

app.get('/api/auth/me/:id', (req: Request, res: Response) => {
  const user = db.findUserById(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  const { passwordHash: _, ...safeUser } = user;
  res.json({ success: true, user: safeUser });
});

app.patch('/api/auth/profile/:id', (req: Request, res: Response) => {
  const updated = db.updateUserProfile(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  res.json({ success: true, user: updated });
});

app.post('/api/auth/favorite', (req: Request, res: Response) => {
  const { userId, productId } = req.body;
  if (!userId || !productId) {
    return res.status(400).json({ success: false, message: 'Missing userId or productId' });
  }
  const favorites = db.toggleFavorite(userId, productId);
  res.json({ success: true, favorites });
});

// Admin Stats & Customers
app.get('/api/admin/stats', (_req: Request, res: Response) => {
  const stats = db.getAdminStats();
  res.json({ success: true, stats });
});

app.get('/api/customers', (_req: Request, res: Response) => {
  const customers = db.getCustomersList();
  res.json({ success: true, customers });
});

// Settings
app.get('/api/settings', (_req: Request, res: Response) => {
  const settings = db.getSettings();
  res.json({ success: true, settings });
});

app.put('/api/settings', (req: Request, res: Response) => {
  const updated = db.updateSettings(req.body);
  res.json({ success: true, settings: updated });
});

// ---------------- VITE MIDDLEWARE / STATIC ASSETS ----------------
async function startServer() {
  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(` Belle Food Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
