import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  User as UserIcon, 
  Menu as MenuIcon, 
  X, 
  LogOut, 
  ShieldCheck, 
  Clock, 
  Phone,
  UtensilsCrossed,
  Sparkles
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, onOpenSearch }) => {
  const { itemCount, subtotal, setIsCartOpen } = useCart();
  const { user, isAdmin, logout, openAuthModal } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'menu', label: 'Menu' },
    { id: 'popular', label: 'Popular Dishes' },
    { id: 'track', label: 'Track Order' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <>
      {/* Top Banner with Delivery Hours & Promo */}
      <div className="bg-stone-900 text-stone-300 text-xs py-2 px-4 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-amber-400 font-medium">
              <Clock className="w-3.5 h-3.5" />
              <span>Open Daily: 8:00 AM – 10:30 PM</span>
            </span>
            <span className="hidden sm:inline-block text-stone-500">|</span>
            <span className="hidden sm:flex items-center gap-1.5 text-stone-300">
              <Phone className="w-3.5 h-3.5 text-amber-500" />
              <span>Order Hotline: +234 800 235 5336</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded text-[11px] font-medium">
              <Sparkles className="w-3 h-3 text-amber-400" /> Use code <b className="text-white">BELLE10</b> for 10% off
            </span>

            {isAdmin && (
              <button
                onClick={() => onNavigate('admin')}
                className="inline-flex items-center gap-1 text-[11px] bg-red-600 hover:bg-red-500 text-white px-2 py-0.5 rounded font-semibold transition"
              >
                <ShieldCheck className="w-3 h-3" /> Admin Portal
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo */}
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-extrabold tracking-tight text-stone-900 flex items-center gap-1">
                  <span>BELLE</span>
                  <span className="text-amber-600">FOOD</span>
                </div>
                <span className="text-[10px] tracking-widest text-stone-500 font-semibold uppercase block -mt-1">
                  RESTAURANT & GRILL
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`text-sm font-semibold transition-colors relative py-1 cursor-pointer ${
                    currentPage === link.id
                      ? 'text-amber-600 font-bold'
                      : 'text-stone-700 hover:text-amber-600'
                  }`}
                >
                  {link.label}
                  {currentPage === link.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600 rounded-full" />
                  )}
                </button>
              ))}
            </nav>

            {/* Right Action Icons & Buttons */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Search Trigger */}
              <button
                onClick={onOpenSearch}
                className="p-2.5 rounded-full text-stone-700 hover:text-amber-600 hover:bg-stone-100 transition cursor-pointer"
                title="Search meals"
                aria-label="Search meals"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Favorites Wishlist */}
              <button
                onClick={() => onNavigate('favorites')}
                className="p-2.5 rounded-full text-stone-700 hover:text-amber-600 hover:bg-stone-100 transition relative cursor-pointer"
                title="Favorites"
                aria-label="Favorites"
              >
                <Heart className="w-5 h-5" />
                {user?.favorites && user.favorites.length > 0 && (
                  <span className="absolute 1 top-1.5 right-1.5 bg-amber-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {user.favorites.length}
                  </span>
                )}
              </button>

              {/* Cart Drawer Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="flex items-center gap-2.5 bg-stone-100 hover:bg-stone-200 text-stone-900 px-3.5 py-2 rounded-full transition cursor-pointer relative"
                aria-label="Open Shopping Cart"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 text-amber-600" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                      {itemCount}
                    </span>
                  )}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-[10px] text-stone-500 font-medium uppercase leading-tight">My Cart</span>
                  <span className="text-xs font-bold leading-tight">
                    ₦{subtotal.toLocaleString()}
                  </span>
                </div>
              </button>

              {/* Account Dropdown */}
              <div className="relative">
                {user ? (
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-full hover:bg-stone-100 transition cursor-pointer border border-stone-200"
                    aria-label="User Account Menu"
                  >
                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center border border-amber-300">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden md:inline-block text-xs font-semibold text-stone-800 max-w-[90px] truncate">
                      {user.name.split(' ')[0]}
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={() => openAuthModal('login')}
                    className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-stone-700 hover:text-amber-600 border border-stone-200 hover:border-amber-400 px-3.5 py-2 rounded-full transition cursor-pointer"
                  >
                    <UserIcon className="w-4 h-4" />
                    <span>Sign In</span>
                  </button>
                )}

                {/* Account Menu Dropdown */}
                {isProfileMenuOpen && user && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-stone-100 py-2 z-50 text-stone-800">
                    <div className="px-4 py-2 border-b border-stone-100">
                      <p className="text-xs text-stone-500">Signed in as</p>
                      <p className="text-sm font-bold truncate">{user.name}</p>
                      <p className="text-xs text-stone-400 truncate">{user.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onNavigate('account');
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-stone-50 flex items-center gap-2 cursor-pointer font-medium"
                    >
                      <UserIcon className="w-4 h-4 text-stone-500" />
                      <span>My Account & Orders</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onNavigate('favorites');
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-stone-50 flex items-center gap-2 cursor-pointer font-medium"
                    >
                      <Heart className="w-4 h-4 text-stone-500" />
                      <span>My Favorites</span>
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          onNavigate('admin');
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-amber-50 text-amber-800 flex items-center gap-2 cursor-pointer font-bold border-t border-b border-amber-100"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-600" />
                        <span>Admin Dashboard</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Order Now CTA (Desktop) */}
              <button
                onClick={() => onNavigate('menu')}
                className="hidden md:inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-xs uppercase tracking-wider font-extrabold px-5 py-2.5 rounded-full shadow-sm shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <span>Order Now</span>
              </button>

              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-stone-700 hover:bg-stone-100 transition cursor-pointer"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-stone-100 px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top duration-200">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    onNavigate(link.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
                    currentPage === link.id
                      ? 'bg-amber-50 text-amber-700'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  {link.label}
                </button>
              ))}

              <div className="pt-3 border-t border-stone-100 flex flex-col gap-2">
                {!user ? (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      openAuthModal('login');
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-stone-100 text-stone-800 py-2.5 rounded-xl font-semibold text-sm"
                  >
                    <UserIcon className="w-4 h-4" />
                    <span>Sign In / Create Account</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onNavigate('account');
                    }}
                    className="w-full flex items-center justify-between bg-stone-50 text-stone-800 px-4 py-2.5 rounded-xl font-semibold text-sm"
                  >
                    <span>Hello, {user.name}</span>
                    <span className="text-xs text-amber-600">View Account →</span>
                  </button>
                )}

                {isAdmin && (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onNavigate('admin');
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-amber-600 text-white py-2.5 rounded-xl font-bold text-sm"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Admin Dashboard</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Sticky Bottom Navigation (Section 20 & 22) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-stone-200 px-3 py-2 shadow-2xl">
        <div className="max-w-md mx-auto flex items-center justify-around">
          <button
            onClick={() => onNavigate('home')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition ${
              currentPage === 'home' ? 'text-amber-600' : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <UtensilsCrossed className="w-5 h-5" />
            <span className="text-[10px] font-bold">Home</span>
          </button>

          <button
            onClick={() => onNavigate('menu')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition ${
              currentPage === 'menu' ? 'text-amber-600' : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <MenuIcon className="w-5 h-5" />
            <span className="text-[10px] font-bold">Menu</span>
          </button>

          <button
            onClick={onOpenSearch}
            className="flex flex-col items-center gap-1 py-1 px-2 rounded-xl text-stone-500 hover:text-stone-900 transition"
          >
            <Search className="w-5 h-5" />
            <span className="text-[10px] font-bold">Search</span>
          </button>

          <button
            onClick={() => setIsCartOpen(true)}
            className="flex flex-col items-center gap-1 py-1 px-2 rounded-xl text-stone-500 hover:text-amber-600 relative transition"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-amber-600 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold">Cart</span>
          </button>

          <button
            onClick={() => {
              if (user) {
                onNavigate('account');
              } else {
                openAuthModal('login');
              }
            }}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition ${
              currentPage === 'account' ? 'text-amber-600' : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <UserIcon className="w-5 h-5" />
            <span className="text-[10px] font-bold">{user ? 'Account' : 'Sign In'}</span>
          </button>
        </div>
      </nav>
    </>
  );
};
