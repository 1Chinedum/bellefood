import React from 'react';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { useAuth } from '../context/AuthContext';
import { FoodCard } from '../components/FoodCard';

interface FavoritesPageProps {
  products: Product[];
  onQuickView: (product: Product) => void;
  onExploreMenu: () => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({
  products,
  onQuickView,
  onExploreMenu,
}) => {
  const { user, openAuthModal } = useAuth();

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
          <Heart className="w-8 h-8 fill-rose-500" />
        </div>
        <h2 className="text-2xl font-black text-stone-900">Sign in to View Favorites</h2>
        <p className="text-xs sm:text-sm text-stone-500">
          Save your favorite delicacies so you can reorder them in seconds.
        </p>
        <button
          onClick={() => openAuthModal('login')}
          className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-full shadow-md cursor-pointer"
        >
          Sign In
        </button>
      </div>
    );
  }

  const favoriteProducts = products.filter((p) => user.favorites?.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
          Saved Delicacies
        </span>
        <h1 className="text-3xl font-black text-stone-900 mt-1">
          Your Favorite Meals ({favoriteProducts.length})
        </h1>
      </div>

      {favoriteProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200/80 space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-stone-900">Your favorites list is empty</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Click the heart icon on any meal across our menu to build your personal shortlist.
          </p>
          <button
            onClick={onExploreMenu}
            className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-full transition shadow-sm cursor-pointer"
          >
            Explore Menu
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {favoriteProducts.map((product) => (
            <FoodCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      )}
    </div>
  );
};
