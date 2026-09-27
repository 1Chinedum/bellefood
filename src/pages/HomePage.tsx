import React from 'react';
import { 
  ArrowRight, 
  Star, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  Truck, 
  ChefHat, 
  Flame, 
  HeartHandshake,
  CheckCircle,
  MapPin,
  Tag
} from 'lucide-react';
import { Product, Category } from '../types';
import { FoodCard } from '../components/FoodCard';

interface HomePageProps {
  products: Product[];
  categories: Category[];
  onNavigate: (page: string, params?: any) => void;
  onQuickView: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  categories,
  onNavigate,
  onQuickView,
}) => {
  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4);
  const popularProducts = products.filter((p) => p.isPopular).slice(0, 8);
  const specialProducts = products.filter((p) => p.isSpecial).slice(0, 3);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-stone-900 text-white rounded-b-[2.5rem] lg:rounded-b-[4rem] shadow-2xl">
        {/* Background glow effects */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Heading & Value Prop */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold tracking-wide uppercase">
                <Flame className="w-3.5 h-3.5 fill-amber-400" />
                <span>Authentic Firewood Jollof, Grills & Continental Bites</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
                Delicious Food, <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500">
                  Delivered to Your Door.
                </span>
              </h1>

              <p className="text-stone-300 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Craving mouthwatering party Jollof, succulent charcoal-grilled chicken, rich traditional soups, or gourmet smashed burgers? Belle Food brings chef-crafted meals hot and fresh in under 45 minutes.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => onNavigate('menu')}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold text-sm uppercase tracking-wider rounded-full shadow-xl shadow-orange-500/25 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Order Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('menu')}
                  className="w-full sm:w-auto px-8 py-4 bg-stone-800/80 hover:bg-stone-800 text-stone-200 border border-stone-700 font-bold text-sm rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Explore Menu</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-stone-800/80 grid grid-cols-3 gap-4 text-center lg:text-left">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-amber-400">30–45m</div>
                  <div className="text-xs text-stone-400 font-medium">Average Delivery</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-amber-400">100% Fresh</div>
                  <div className="text-xs text-stone-400 font-medium">Farm Ingredients</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-amber-400 flex items-center justify-center lg:justify-start gap-1">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                    <span>4.9 / 5</span>
                  </div>
                  <div className="text-xs text-stone-400 font-medium">5,000+ Happy Foodies</div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Food Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Food Photo */}
                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-stone-800 aspect-4/3 sm:aspect-square relative group">
                  <img
                    src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80"
                    alt="Smoky Party Jollof & Chicken"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-4 left-4 right-4 bg-stone-900/90 backdrop-blur-md p-3.5 rounded-2xl border border-stone-700/80 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-extrabold text-white">Party Jollof Rice & Roasted Chicken</div>
                      <div className="text-[11px] text-amber-400 font-semibold">Chef’s Signature Recipe</div>
                    </div>
                    <div className="text-sm font-extrabold text-white bg-amber-600 px-3 py-1 rounded-xl">
                      ₦4,500
                    </div>
                  </div>
                </div>

                {/* Floating Badge 1 */}
                <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 bg-white text-stone-900 p-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-stone-100 animate-bounce duration-1000">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                    🔥
                  </div>
                  <div>
                    <div className="text-xs font-extrabold">Hot & Steaming</div>
                    <div className="text-[10px] text-stone-500">Cooked to your order</div>
                  </div>
                </div>

                {/* Floating Badge 2 */}
                <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 bg-stone-900 text-white p-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-stone-700">
                  <ShieldCheck className="w-8 h-8 text-emerald-400" />
                  <div>
                    <div className="text-xs font-bold">Paystack Verified</div>
                    <div className="text-[10px] text-stone-400">Card, Transfer & USSD</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FOOD CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              Browse by Category
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">
              What Are You Craving Today?
            </h2>
          </div>
          <button
            onClick={() => onNavigate('menu')}
            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {categories.slice(0, 14).map((cat) => (
            <button
              key={cat.id}
              onClick={() => onNavigate('menu', { category: cat.slug })}
              className="group bg-white rounded-2xl p-3 border border-stone-200/70 hover:border-amber-500 shadow-xs hover:shadow-lg transition-all text-center flex flex-col items-center gap-2 cursor-pointer"
            >
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-stone-100 relative">
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-amber-600 font-bold">
                    🍽️
                  </div>
                )}
              </div>
              <span className="text-xs font-extrabold text-stone-800 group-hover:text-amber-700 transition">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 3. TODAY'S SPECIALS & PROMO BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 transform skew-x-12 pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-extrabold tracking-wide uppercase">
                <Tag className="w-3.5 h-3.5" />
                <span>Today's Special Deal</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-black leading-tight">
                Get 10% OFF with Promo Code: <span className="underline decoration-white">BELLE10</span>
              </h3>
              <p className="text-amber-100 text-sm max-w-xl leading-relaxed">
                Enjoy authentic Nigerian delicacies and continental favorites at discounted prices. Valid for all online orders above ₦3,000.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3">
              <button
                onClick={() => onNavigate('menu')}
                className="px-6 py-3.5 bg-white text-stone-950 hover:bg-stone-100 font-extrabold text-xs uppercase tracking-wider rounded-full shadow-lg transition hover:scale-105 active:scale-95 cursor-pointer"
              >
                Claim Discount & Order
              </button>
              <span className="text-[11px] text-amber-100 font-medium">
                *Applies automatically in checkout
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED MEALS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Chef’s Recommendations
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">
              Featured Dishes
            </h2>
          </div>
          <button
            onClick={() => onNavigate('menu')}
            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Explore All Meals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <FoodCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      </section>

      {/* 5. POPULAR DISHES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
            Customer Favorites
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-stone-900">
            Most Popular Dishes
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Ordered repeatedly by thousands of happy food lovers across the city.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularProducts.map((product) => (
            <FoodCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => onNavigate('menu')}
            className="px-8 py-3.5 bg-stone-900 hover:bg-stone-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-full shadow-md transition hover:scale-105 active:scale-95 cursor-pointer"
          >
            See Full 14-Category Menu
          </button>
        </div>
      </section>

      {/* 6. WHY CHOOSE BELLE FOOD */}
      <section className="bg-stone-100/70 py-16 sm:py-20 border-y border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              The Belle Food Difference
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
              Why Choose Belle Food?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-stone-200/70 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Truck className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-extrabold text-base text-stone-900">Swift 45-Min Delivery</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Our fleet of dedicated food dispatch riders ensures your orders arrive piping hot within 30-45 minutes.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-stone-200/70 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-extrabold text-base text-stone-900">Master Chef Quality</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Authentic Nigerian recipes cooked with traditional methods, firewood smoke aroma, and premium ingredients.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-stone-200/70 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-extrabold text-base text-stone-900">Paystack Secure Payments</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Pay safely in seconds with Nigerian debit cards, bank transfer, or USSD, protected with 256-bit bank grade encryption.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-stone-200/70 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <HeartHandshake className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-extrabold text-base text-stone-900">Generous Portions</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Big, hearty portion sizes packed with assorted meats, chicken, and rich accompaniments so you're genuinely satisfied.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. DELIVERY & PICKUP INFORMATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-stone-200/80 p-8 sm:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                Convenience First
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
                Doorstep Delivery or Fast Pickup
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                Whether you’re working from your desk, hosting friends, or picking up dinner on your drive home, Belle Food makes ordering seamless.
              </p>

              <div className="space-y-3 text-xs sm:text-sm text-stone-700">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Free delivery on all orders above ₦20,000</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Flat delivery fee of ₦1,200 across standard zones</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Curbside pickup ready in just 15-20 minutes with zero delivery fee</span>
                </div>
              </div>

              <div className="pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                  Our Pickup Hubs:
                </h4>
                <div className="space-y-1.5 text-xs text-stone-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    <span><b>Flagship:</b> 14 Admiralty Way, Lekki Phase 1, Lagos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    <span><b>Mainland:</b> 32 Isaac John St, Ikeja GRA, Lagos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    <span><b>Abuja:</b> 45 Aminu Kano Crescent, Wuse II</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-stone-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Live Kitchen Status
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Taking Orders Now
                  </span>
                </div>

                <div className="text-2xl font-black">
                  Lagos & Abuja Kitchens Open
                </div>

                <p className="text-xs text-stone-300 leading-relaxed">
                  Our stoves are fired up! Place your order now to get your freshly prepped dishes dispatched without delay.
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => onNavigate('menu')}
                    className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer shadow-md"
                  >
                    Start Your Order Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CUSTOMER REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
            Real Diners, Real Feedback
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
            Loved by Thousands of Foodies
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed italic">
              "The Party Jollof is legendary. You can taste the genuine firewood smoke and the quarter chicken was seasoned down to the bone. 10/10 recommendation!"
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-stone-100">
              <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center">
                AB
              </div>
              <div>
                <div className="text-xs font-bold text-stone-900">Amina Bello</div>
                <div className="text-[10px] text-stone-400">Lekki Phase 1, Lagos</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed italic">
              "Ordered Egusi and Pounded Yam for an impromptu family dinner. The food arrived steaming hot in 35 minutes and the goat meat was so tender!"
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-stone-100">
              <div className="w-9 h-9 rounded-full bg-orange-100 text-orange-800 font-bold text-xs flex items-center justify-center">
                CO
              </div>
              <div>
                <div className="text-xs font-bold text-stone-900">Chinedu Okafor</div>
                <div className="text-[10px] text-stone-400">Ikeja GRA, Lagos</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed italic">
              "The Double Smashed Cheeseburger with seasoned fries is better than major international chains. Seamless Paystack checkout and live tracking was super smooth."
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-stone-100">
              <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center">
                DK
              </div>
              <div>
                <div className="text-xs font-bold text-stone-900">David Kalu</div>
                <div className="text-[10px] text-stone-400">Wuse II, Abuja</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. NEWSLETTER / SIGNUP SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-12 text-center max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Join The Belle Foodie Club
            </span>
            <h2 className="text-2xl sm:text-3xl font-black">
              Get ₦1,000 Off Your First Order
            </h2>
            <p className="text-xs sm:text-sm text-stone-300">
              Subscribe for secret weekend discounts, newly launched chef specials, and free delivery vouchers sent straight to your inbox.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Welcome to Belle Food! Use promo code WELCOME20 for 20% off your order.');
              }}
              className="flex flex-col sm:flex-row gap-2 pt-2"
            >
              <input
                type="email"
                required
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 bg-stone-800 border border-stone-700 rounded-full text-xs text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-full transition shadow-md cursor-pointer shrink-0"
              >
                Join & Save
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};
