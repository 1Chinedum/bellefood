import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X, Sparkles, Filter } from 'lucide-react';
import { Product, Category } from '../types';
import { FoodCard } from '../components/FoodCard';

interface MenuPageProps {
  products: Product[];
  categories: Category[];
  initialCategory?: string;
  onQuickView: (product: Product) => void;
}

export const MenuPage: React.FC<MenuPageProps> = ({
  products,
  categories,
  initialCategory = 'all',
  onQuickView,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'newest'>('popular');
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  // Complete list of 14 categories requested in requirement 2:
  // All, Breakfast, Rice, Chicken, Beef, Fish, Soups, Swallow, Fast Food, Burgers, Pizza, Snacks, Drinks, Desserts
  const menuCategories = [
    { slug: 'all', name: 'All Dishes' },
    { slug: 'breakfast', name: 'Breakfast' },
    { slug: 'rice', name: 'Rice' },
    { slug: 'chicken', name: 'Chicken' },
    { slug: 'beef', name: 'Beef' },
    { slug: 'fish', name: 'Fish' },
    { slug: 'soups', name: 'Soups' },
    { slug: 'swallow', name: 'Swallow' },
    { slug: 'fast-food', name: 'Fast Food' },
    { slug: 'burgers', name: 'Burgers' },
    { slug: 'pizza', name: 'Pizza' },
    { slug: 'snacks', name: 'Snacks' },
    { slug: 'drinks', name: 'Drinks' },
    { slug: 'desserts', name: 'Desserts' },
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (selectedCategory !== 'all') {
        const prodCat = product.category.toLowerCase().replace(/[\s_]+/g, '-');
        const targetCat = selectedCategory.toLowerCase();
        if (prodCat !== targetCat && !prodCat.includes(targetCat) && !targetCat.includes(prodCat)) {
          return false;
        }
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        const matchesCat = product.category.toLowerCase().includes(q);
        const matchesIng = product.ingredients.some((i) => i.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesCat && !matchesIng) {
          return false;
        }
      }

      // Available only filter
      if (onlyAvailable && !product.isAvailable) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'newest') return (b.createdAt || '').localeCompare(a.createdAt || '');
      // default: popular (reviewsCount * rating)
      return (b.reviewsCount * b.rating) - (a.reviewsCount * a.rating);
    });
  }, [products, selectedCategory, searchQuery, sortBy, onlyAvailable]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-600 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> Handcrafted with Passion
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-stone-900 tracking-tight">
          The Belle Food Menu
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
          From fiery party Jollof to flame-grilled steaks, rich traditional African soups, artisanal stone-baked pizzas, and juicy smash burgers.
        </p>
      </div>

      {/* Filter & Search Controls Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by meal name or ingredient..."
              className="w-full text-xs pl-10 pr-9 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-stone-800"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort & Availability Filters */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            {/* Availability Toggle */}
            <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded-md border-stone-300 focus:ring-amber-500 cursor-pointer"
              />
              <span>In Stock Only</span>
            </label>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-700">
              <SlidersHorizontal className="w-3.5 h-3.5 text-stone-400" />
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest Dishes</option>
              </select>
            </div>
          </div>
        </div>

        {/* 14 Categories Horizontal Filter Pills */}
        <div className="pt-2 border-t border-stone-100 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {menuCategories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/20'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count & Current Filter Badge */}
      <div className="flex items-center justify-between text-xs text-stone-500 px-1">
        <span>
          Showing <b className="text-stone-900">{filteredProducts.length}</b> dishes
          {selectedCategory !== 'all' && (
            <span> in <b className="text-amber-700 uppercase">{selectedCategory}</b></span>
          )}
        </span>

        {(selectedCategory !== 'all' || searchQuery || onlyAvailable) && (
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setOnlyAvailable(false);
            }}
            className="text-amber-700 font-bold hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>Reset filters</span>
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Food Cards Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200/80 space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 mx-auto">
            <Filter className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-stone-900">No dishes match your search</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            We couldn’t find any meals matching your current filters. Try changing your search query or selecting a different category.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setOnlyAvailable(false);
            }}
            className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-full transition shadow-sm cursor-pointer"
          >
            View All Dishes
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
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
