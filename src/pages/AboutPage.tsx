import React from 'react';
import { ChefHat, Flame, ShieldCheck, HeartHandshake, MapPin, Phone, Mail, Clock } from 'lucide-react';

export const AboutPage: React.FC<{ onExploreMenu: () => void }> = ({ onExploreMenu }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
      {/* Hero Intro */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
          Our Culinary Story
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-stone-900 tracking-tight">
          Welcome to Belle Food
        </h1>
        <p className="text-base sm:text-lg text-stone-600 font-serif italic">
          "Good food. Great moments."
        </p>
        <p className="text-sm text-stone-500 leading-relaxed max-w-2xl mx-auto">
          Born out of a genuine passion for honest, flavorful West African and continental cuisine, Belle Food bridges traditional firewood cooking techniques with contemporary restaurant hospitality and fast digital ordering.
        </p>
      </div>

      {/* Visual Image Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-3xl overflow-hidden aspect-4/3 shadow-md">
          <img
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80"
            alt="Belle Food Restaurant Ambience"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="rounded-3xl overflow-hidden aspect-4/3 shadow-md">
          <img
            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"
            alt="Firewood Smoky Jollof"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="rounded-3xl overflow-hidden aspect-4/3 shadow-md">
          <img
            src="https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=800&q=80"
            alt="Charcoal Grilling Station"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Values Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Flame className="w-6 h-6 text-amber-600" />
          </div>
          <h3 className="text-base font-extrabold text-stone-900">Authentic Fire & Spice</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            We don't cut corners. Our Jollof is prepared with slow-reduced tomato paste and aromatic wood smoke to guarantee that iconic celebratory party taste.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center">
            <ChefHat className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="text-base font-extrabold text-stone-900">Master Craft Kitchen</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Every dish is inspected for portion generosity, temperature, and visual appeal before our thermal packaging seals it hot for dispatch.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <HeartHandshake className="w-6 h-6 text-emerald-600" />
          </div>
          <h3 className="text-base font-extrabold text-stone-900">Locally Sourced Farm Produce</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            We partner directly with farmers across Ogun, Oyo, and Benue to source fresh ripe plantains, stone-free rice, fresh catfish, and natural spices.
          </p>
        </div>
      </div>

      {/* Delivery CTA */}
      <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-12 text-center space-y-4">
        <h2 className="text-2xl sm:text-3xl font-black">Ready to Taste the Belle Food Experience?</h2>
        <p className="text-xs sm:text-sm text-stone-300 max-w-lg mx-auto">
          Explore over 14 diverse categories of mouthwatering dishes, cooked fresh and delivered hot to your doorstep.
        </p>
        <button
          onClick={onExploreMenu}
          className="px-8 py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-full shadow-lg transition cursor-pointer"
        >
          View The Full Menu
        </button>
      </div>
    </div>
  );
};
