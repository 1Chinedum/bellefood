import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Star, Clock, ArrowRight, Flame } from 'lucide-react';
import { Product } from '../types';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onExploreCategory: (category: string) => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
  onExploreCategory,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const popularTags = ['Jollof', 'Chicken', 'Egusi', 'Burger', 'Pizza', 'Suya', 'Juice', 'Cake'];

  const filteredProducts = query.trim()
    ? products.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.ingredients.some((ing) => ing.toLowerCase().includes(q))
        );
      })
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-stone-200 flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar Input */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-amber-600 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search meals, ingredients (e.g. 'jollof', 'suya', 'chicken', 'burger')..."
            className="w-full text-sm sm:text-base font-medium text-stone-900 placeholder:text-stone-400 focus:outline-none bg-transparent"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-stone-400 hover:text-stone-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block text-[10px] text-stone-400 border border-stone-200 px-2 py-0.5 rounded bg-stone-50">
              ESC
            </kbd>
          )}
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Popular Quick Search Tags */}
        <div className="px-5 py-3 bg-stone-50/70 border-b border-stone-100 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-stone-400 font-bold uppercase text-[10px] shrink-0">Popular:</span>
          {popularTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setQuery(tag)}
              className="px-3 py-1 bg-white hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300 border border-stone-200 rounded-full text-stone-600 font-medium transition shrink-0 cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Search Results Area */}
        <div className="overflow-y-auto p-4 sm:p-5 flex-1 divide-y divide-stone-100">
          {!query.trim() ? (
            <div className="py-12 text-center text-stone-400 space-y-2">
              <p className="text-sm font-semibold text-stone-600">Type what you’re craving</p>
              <p className="text-xs">Find your favorite rice, soups, chicken, burgers, grills, and drinks.</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-12 text-center text-stone-500 space-y-3">
              <div className="w-14 h-14 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-400">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-stone-800">No dishes found for "{query}"</h4>
              <p className="text-xs text-stone-400 max-w-sm mx-auto">
                Try searching for a different dish, category like "Rice" or "Chicken", or check out our full menu.
              </p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  onSelectProduct(product);
                  onClose();
                }}
                className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4 group cursor-pointer hover:bg-stone-50/80 -mx-2 px-2 rounded-2xl transition"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-14 h-14 rounded-2xl object-cover bg-stone-100 shrink-0 border border-stone-100"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                        {product.category}
                      </span>
                      {product.spicyLevel && product.spicyLevel > 0 && (
                        <Flame className="w-3 h-3 text-orange-500 fill-orange-500" />
                      )}
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-stone-900 group-hover:text-amber-600 transition truncate">
                      {product.name}
                    </h4>
                    <p className="text-[11px] text-stone-400 truncate max-w-md">
                      {product.description}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs sm:text-sm font-extrabold text-stone-900">
                    ₦{product.price.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-amber-600 font-bold justify-end mt-0.5">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>{product.rating}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
