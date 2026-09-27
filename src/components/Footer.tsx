import React from 'react';
import { 
  UtensilsCrossed, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Instagram, 
  Twitter, 
  Facebook, 
  ShieldCheck, 
  HeartHandshake,
  CheckCircle2
} from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-stone-950 text-stone-300 pt-16 pb-24 lg:pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12 border-b border-stone-800">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-extrabold text-white tracking-tight">
                  BELLE <span className="text-amber-500">FOOD</span>
                </div>
                <span className="text-[10px] tracking-widest text-stone-400 font-semibold uppercase block">
                  RESTAURANT & GRILL
                </span>
              </div>
            </div>
            
            <p className="text-amber-400 font-serif italic text-base">
              "Good food. Great moments."
            </p>
            
            <p className="text-sm text-stone-400 leading-relaxed">
              Belle Food crafts appetizing Nigerian & continental dining experiences. Made with the freshest ingredients, packaged hot, and delivered straight to your door.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-9 h-9 rounded-full bg-stone-900 hover:bg-amber-600 text-stone-300 hover:text-white flex items-center justify-center transition border border-stone-800"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-9 h-9 rounded-full bg-stone-900 hover:bg-amber-600 text-stone-300 hover:text-white flex items-center justify-center transition border border-stone-800"
                aria-label="Twitter / X"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-9 h-9 rounded-full bg-stone-900 hover:bg-amber-600 text-stone-300 hover:text-white flex items-center justify-center transition border border-stone-800"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-2.5">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button 
                  onClick={() => onNavigate('home')} 
                  className="hover:text-amber-400 transition cursor-pointer text-stone-400 hover:translate-x-1 inline-block"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('menu')} 
                  className="hover:text-amber-400 transition cursor-pointer text-stone-400 hover:translate-x-1 inline-block"
                >
                  Full Menu
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('popular')} 
                  className="hover:text-amber-400 transition cursor-pointer text-stone-400 hover:translate-x-1 inline-block"
                >
                  Popular Dishes
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('track')} 
                  className="hover:text-amber-400 transition cursor-pointer text-stone-400 hover:translate-x-1 inline-block"
                >
                  Track My Order
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('about')} 
                  className="hover:text-amber-400 transition cursor-pointer text-stone-400 hover:translate-x-1 inline-block"
                >
                  About Belle Food
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('contact')} 
                  className="hover:text-amber-400 transition cursor-pointer text-stone-400 hover:translate-x-1 inline-block"
                >
                  Contact & Locations
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Support & Account */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-2.5">
              Customer Hub
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button 
                  onClick={() => onNavigate('account')} 
                  className="hover:text-amber-400 transition cursor-pointer text-stone-400 hover:translate-x-1 inline-block"
                >
                  My Account
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('account')} 
                  className="hover:text-amber-400 transition cursor-pointer text-stone-400 hover:translate-x-1 inline-block"
                >
                  Previous Orders & Reorder
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('favorites')} 
                  className="hover:text-amber-400 transition cursor-pointer text-stone-400 hover:translate-x-1 inline-block"
                >
                  Saved Favorites
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('about')} 
                  className="hover:text-amber-400 transition cursor-pointer text-stone-400 hover:translate-x-1 inline-block"
                >
                  Delivery Information & Areas
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('admin')} 
                  className="text-stone-500 hover:text-amber-400 transition cursor-pointer text-xs flex items-center gap-1.5 pt-2"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Restaurant Staff Login</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-l-2 border-amber-500 pl-2.5">
              Contact & Hours
            </h3>
            
            <div className="space-y-3 text-sm text-stone-400">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <span>14 Admiralty Way, Lekki Phase 1, Lagos, Nigeria</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <span>+234 800 235 5336</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <span>orders@bellefood.ng</span>
              </div>
              <div className="flex items-start gap-3 pt-1">
                <Clock className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold text-stone-200 block">Opening Hours:</span>
                  <span>Monday – Sunday: 8:00 AM – 10:30 PM</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <div className="bg-stone-900 border border-stone-800 rounded-xl p-3 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">Paystack Secured Checkout</div>
                  <div className="text-[11px] text-stone-400">100% encrypted 256-bit online payments</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© 2026 Belle Food. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 text-stone-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> NAFDAC Certified Kitchen
            </span>
            <span className="flex items-center gap-1 text-stone-400">
              <HeartHandshake className="w-3.5 h-3.5 text-amber-500" /> Premium Local Ingredients
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
