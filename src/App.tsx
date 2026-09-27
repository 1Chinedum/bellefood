import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { CartDrawer } from './components/CartDrawer';
import { QuickSearchModal } from './components/QuickSearchModal';
import { AuthModal } from './components/AuthModal';

import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { AccountPage } from './pages/AccountPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

import { Product, Category } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'menu' | 'popular' | 'track' | 'checkout' | 'confirmation' | 'account' | 'favorites' | 'admin' | 'about' | 'contact'>('home');
  const [pageParams, setPageParams] = useState<any>({});

  // Products and categories data
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Selected product for detailed modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Quick search modal state
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Confirmed order number for confirmation page
  const [confirmedOrderNumber, setConfirmedOrderNumber] = useState<string>('BF-83921');

  // Load products and categories on mount
  useEffect(() => {
    Promise.all([
      fetch('/api/products').then((res) => res.json()),
      fetch('/api/categories').then((res) => res.json()),
    ])
      .then(([prodData, catData]) => {
        if (prodData.success && prodData.products) {
          setProducts(prodData.products);
        }
        if (catData.success && catData.categories) {
          setCategories(catData.categories);
        }
      })
      .catch((err) => console.error('Failed to load initial data:', err))
      .finally(() => setLoadingInitial(false));
  }, []);

  const handleNavigate = (page: string, params: any = {}) => {
    setCurrentPage(page as any);
    setPageParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleOrderSuccess = (orderNumber: string) => {
    setConfirmedOrderNumber(orderNumber);
    handleNavigate('confirmation');
  };

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans selection:bg-amber-500 selection:text-white">
          {/* Main Navigation (hidden on standalone admin view if preferred, or persistent) */}
          <Navbar
            currentPage={currentPage}
            onNavigate={(page) => handleNavigate(page)}
            onOpenSearch={() => setIsSearchOpen(true)}
          />

          {/* Main App Page View */}
          <main className="flex-1">
            {currentPage === 'home' && (
              <HomePage
                products={products}
                categories={categories}
                onNavigate={(page, params) => handleNavigate(page, params)}
                onQuickView={handleQuickView}
              />
            )}

            {currentPage === 'menu' && (
              <MenuPage
                products={products}
                categories={categories}
                initialCategory={pageParams?.category || 'all'}
                onQuickView={handleQuickView}
              />
            )}

            {currentPage === 'popular' && (
              <div className="py-8">
                <MenuPage
                  products={products.filter((p) => p.isPopular)}
                  categories={categories}
                  initialCategory="all"
                  onQuickView={handleQuickView}
                />
              </div>
            )}

            {currentPage === 'checkout' && (
              <CheckoutPage
                onOrderSuccess={handleOrderSuccess}
                onBackToMenu={() => handleNavigate('menu')}
              />
            )}

            {currentPage === 'confirmation' && (
              <OrderConfirmationPage
                orderNumber={confirmedOrderNumber}
                onTrackOrder={(num) => handleNavigate('track', { orderNumber: num })}
                onContinueShopping={() => handleNavigate('menu')}
              />
            )}

            {currentPage === 'track' && (
              <OrderTrackingPage
                initialOrderNumber={pageParams?.orderNumber || confirmedOrderNumber || ''}
              />
            )}

            {currentPage === 'account' && (
              <AccountPage
                onNavigateToOrderTracking={(num) => handleNavigate('track', { orderNumber: num })}
                onExploreMenu={() => handleNavigate('menu')}
                onQuickViewProduct={handleQuickView}
              />
            )}

            {currentPage === 'favorites' && (
              <FavoritesPage
                products={products}
                onQuickView={handleQuickView}
                onExploreMenu={() => handleNavigate('menu')}
              />
            )}

            {currentPage === 'about' && (
              <AboutPage onExploreMenu={() => handleNavigate('menu')} />
            )}

            {currentPage === 'contact' && <ContactPage />}

            {currentPage === 'admin' && (
              <AdminDashboard onReturnToStore={() => handleNavigate('home')} />
            )}
          </main>

          {/* Footer (hidden on admin dashboard for clean workflow) */}
          {currentPage !== 'admin' && (
            <Footer onNavigate={(page) => handleNavigate(page)} />
          )}

          {/* Global Modals & Drawers */}
          <ProductDetailsModal
            product={selectedProduct}
            isOpen={isProductModalOpen}
            onClose={() => setIsProductModalOpen(false)}
            onNavigateToCheckout={() => handleNavigate('checkout')}
          />

          <CartDrawer
            onNavigateToCheckout={() => handleNavigate('checkout')}
            onExploreMenu={() => handleNavigate('menu')}
          />

          <QuickSearchModal
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            products={products}
            onSelectProduct={handleQuickView}
            onExploreCategory={(cat) => handleNavigate('menu', { category: cat })}
          />

          <AuthModal />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
