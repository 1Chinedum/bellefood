export type CategorySlug = 
  | 'all'
  | 'breakfast'
  | 'rice'
  | 'chicken'
  | 'beef'
  | 'fish'
  | 'soups'
  | 'swallow'
  | 'fast-food'
  | 'burgers'
  | 'pizza'
  | 'snacks'
  | 'drinks'
  | 'desserts';

export interface AddOnOption {
  id: string;
  name: string;
  price: number; // in NGN (₦)
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string; // e.g. "Rice", "Chicken", "Burgers"
  description: string;
  price: number; // in NGN
  discountPercent?: number; // e.g. 10 for 10% off
  image: string;
  images?: string[];
  rating: number; // e.g. 4.8
  reviewsCount: number;
  isAvailable: boolean;
  isFeatured?: boolean;
  isPopular?: boolean;
  isSpecial?: boolean;
  prepTime: string; // e.g. "20-25 mins"
  portionSize: string; // e.g. "Serves 1-2 persons"
  spicyLevel?: 0 | 1 | 2 | 3;
  ingredients: string[];
  addOns: AddOnOption[];
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  image?: string;
}

export interface CartItem {
  id: string; // Unique combination of productId + selected addOns + instructions
  productId: string;
  product: Product;
  quantity: number;
  selectedAddOns: AddOnOption[];
  specialInstructions?: string;
  unitPrice: number; // base price + sum(addOns)
  itemTotal: number; // unitPrice * quantity
}

export type OrderStatus = 
  | 'Pending'
  | 'Confirmed'
  | 'Preparing'
  | 'Ready'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export type PaymentStatus = 'paid' | 'pending' | 'failed';
export type PaymentMethod = 'paystack' | 'cod';
export type OrderType = 'delivery' | 'pickup';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  selectedAddOns: { name: string; price: number }[];
  specialInstructions?: string;
  total: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. BF-84291
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  orderType: OrderType;
  deliveryAddress?: {
    address: string;
    city: string;
    state: string;
    instructions?: string;
  };
  pickupLocation?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  promoCode?: string;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paystackReference?: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  estimatedDeliveryTime: string;
  userId?: string;
}

export interface UserAddress {
  id: string;
  label: string; // 'Home', 'Work'
  address: string;
  city: string;
  state: string;
  isDefault?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  addresses: UserAddress[];
  favorites: string[]; // productIds
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  customerEmail?: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
  approved: boolean;
}

export interface PromoCode {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  expiryDate: string;
  usageLimit: number;
  usageCount: number;
  isActive: boolean;
}

export interface RestaurantSettings {
  name: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  openingHours: string;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  estimatedDeliveryMins: string;
  currency: string;
  currencySymbol: string;
  pickupLocations: string[];
  cashOnDeliveryEnabled: boolean;
  paystackTestMode: boolean;
  instagramUrl: string;
  twitterUrl: string;
  facebookUrl: string;
}
