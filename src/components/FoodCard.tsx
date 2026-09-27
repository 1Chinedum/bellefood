import React from 'react';
import { Star, Plus, Heart, Eye, Clock, Flame } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface FoodCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useAuth();
  const favorited = isFavorite(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.isAvailable) return;
    
    // If the product has options/add-ons, open the modal so the customer can pick add-ons & instructions
    if (product.addOns && product.addOns.length > 0) {
      onQuickView(product);
    } else {
      addToCart(product, 1);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  return (
    <div 
      onClick={() => onQuickView(product)}
      className="group bg-white rounded-3xl overflow-hidden border border-stone-100/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer relative"
    >
      {/* Image Container */}
      <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Overlay for subtle contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <span className="bg-stone-900/85 backdrop-blur-sm text-stone-100 text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
            {product.category}
          </span>
          {product.discountPercent && product.discountPercent > 0 && (
            <span className="bg-amber-600 text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-sm">
              {product.discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Favorite Heart Button */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition shadow-md z-10 cursor-pointer ${
            favorited 
              ? 'bg-rose-50 text-rose-600 border border-rose-200' 
              : 'bg-white/90 text-stone-600 hover:text-rose-500 hover:bg-white backdrop-blur-sm'
          }`}
          title={favorited ? 'Remove from favorites' : 'Save to favorites'}
          aria-label="Toggle favorite"
        >
          <Heart className={`w-4 h-4 ${favorited ? 'fill-rose-600' : ''}`} />
        </button>

        {/* Quick View Floating Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <span className="bg-white/95 text-stone-900 text-xs font-bold px-3.5 py-2 rounded-full shadow-lg flex items-center gap-1.5 backdrop-blur-xs transform -translate-y-1 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5 text-amber-600" /> Quick View
          </span>
        </div>

        {/* Out of Stock Overlay */}
        {!product.isAvailable && (
          <div className="absolute inset-0 bg-stone-900/75 backdrop-blur-[2px] flex items-center justify-center z-20">
            <span className="bg-stone-800 text-stone-200 text-xs font-extrabold uppercase tracking-widest px-4 py-2 rounded-xl border border-stone-600 shadow-md">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Rating & Prep Time */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <div className="flex items-center gap-1 text-amber-600 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{product.rating}</span>
              <span className="text-stone-400 font-normal">({product.reviewsCount})</span>
            </div>

            <div className="flex items-center gap-1 text-stone-500">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              <span>{product.prepTime}</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="font-bold text-base text-stone-900 leading-snug group-hover:text-amber-700 transition line-clamp-1">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-stone-500 line-clamp-2 mt-1.5 leading-relaxed">
            {product.description}
          </p>

          {/* Portion or spicy badge */}
          {product.spicyLevel && product.spicyLevel > 0 && (
            <div className="mt-2.5 flex items-center gap-1 text-[11px] font-medium text-amber-700">
              <Flame className="w-3 h-3 text-orange-500 fill-orange-500" />
              <span>{product.spicyLevel === 3 ? 'Extra Spicy' : 'Mildly Spicy'}</span>
            </div>
          )}
        </div>

        {/* Price & Action Button */}
        <div className="pt-4 mt-3 border-t border-stone-100 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-stone-500 font-semibold uppercase block">Price</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-extrabold text-stone-900">
                ₦{product.price.toLocaleString()}
              </span>
              {product.discountPercent && product.discountPercent > 0 && (
                <span className="text-xs text-stone-400 line-through">
                  ₦{Math.round(product.price * (1 + product.discountPercent / 100)).toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!product.isAvailable}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold transition shadow-xs cursor-pointer ${
              !product.isAvailable
                ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                : 'bg-amber-600 hover:bg-amber-700 text-white hover:scale-105 active:scale-95 shadow-orange-500/20'
            }`}
            title={product.isAvailable ? 'Add to cart' : 'Item is currently unavailable'}
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
