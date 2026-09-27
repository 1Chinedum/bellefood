import React, { useState, useEffect } from 'react';
import { 
  X, 
  Star, 
  Minus, 
  Plus, 
  ShoppingBag, 
  Zap, 
  Clock, 
  Users, 
  Heart, 
  Flame, 
  Check, 
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { Product, AddOnOption, Review } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface ProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToCheckout: () => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  isOpen,
  onClose,
  onNavigateToCheckout,
}) => {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite, user } = useAuth();

  const [quantity, setQuantity] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<AddOnOption[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');

  // Reviews state for this product
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewerName, setReviewerName] = useState(user?.name || '');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState('');

  // Reset state when opening product
  useEffect(() => {
    if (product) {
      setQuantity(1);
      setSelectedAddOns([]);
      setSpecialInstructions('');
      setActiveTab('details');
      setReviewSuccessMsg('');
      if (user?.name) setReviewerName(user.name);

      // Fetch reviews for this product
      fetch(`/api/reviews?productId=${product.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.reviews) {
            setReviews(data.reviews);
          }
        })
        .catch(() => {});
    }
  }, [product, user]);

  if (!isOpen || !product) return null;

  const favorited = isFavorite(product.id);

  const toggleAddOn = (addOn: AddOnOption) => {
    setSelectedAddOns((prev) => {
      const exists = prev.some((a) => a.id === addOn.id);
      if (exists) {
        return prev.filter((a) => a.id !== addOn.id);
      } else {
        return [...prev, addOn];
      }
    });
  };

  const addOnsTotal = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
  const unitPrice = product.price + addOnsTotal;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    if (!product.isAvailable) return;
    addToCart(product, quantity, selectedAddOns, specialInstructions);
    onClose();
  };

  const handleBuyNow = () => {
    if (!product.isAvailable) return;
    addToCart(product, quantity, selectedAddOns, specialInstructions);
    onClose();
    onNavigateToCheckout();
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName || !newComment.trim()) return;

    setIsSubmittingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          productName: product.name,
          customerName: reviewerName,
          customerEmail: user?.email,
          rating: newRating,
          comment: newComment.trim(),
        }),
      });
      const data = await res.json();
      if (data.success && data.review) {
        setReviews([data.review, ...reviews]);
        setNewComment('');
        setReviewSuccessMsg('Thank you! Your review has been submitted.');
      }
    } catch {
      setReviewSuccessMsg('Failed to submit review. Please try again.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl border border-stone-200 my-auto flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50/80">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100/70 px-3 py-1 rounded-full">
              {product.category}
            </span>
            {product.isAvailable ? (
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-600" /> In Stock
              </span>
            ) : (
              <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full">
                Temporarily Sold Out
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFavorite(product.id)}
              className={`p-2 rounded-full border transition cursor-pointer ${
                favorited 
                  ? 'bg-rose-50 text-rose-600 border-rose-200' 
                  : 'bg-white text-stone-500 hover:text-rose-500 border-stone-200'
              }`}
              title={favorited ? 'Remove favorite' : 'Add to favorites'}
            >
              <Heart className={`w-4 h-4 ${favorited ? 'fill-rose-600' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/70 transition cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Image Gallery */}
            <div className="relative rounded-2xl overflow-hidden aspect-4/3 md:aspect-square bg-stone-100 shadow-inner">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.discountPercent && product.discountPercent > 0 && (
                <div className="absolute top-3 left-3 bg-amber-600 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-md">
                  {product.discountPercent}% OFF
                </div>
              )}
            </div>

            {/* Core Info */}
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-extrabold text-stone-900 leading-tight">
                  {product.name}
                </h2>
                
                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-stone-600">
                  <div className="flex items-center gap-1.5 text-amber-600 font-bold">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                    <span>{product.rating}</span>
                    <span className="text-stone-400 font-normal">({reviews.length || product.reviewsCount} reviews)</span>
                  </div>

                  <div className="flex items-center gap-1 text-stone-500">
                    <Clock className="w-4 h-4 text-stone-400" />
                    <span>{product.prepTime}</span>
                  </div>

                  {product.portionSize && (
                    <div className="flex items-center gap-1 text-stone-500">
                      <Users className="w-4 h-4 text-stone-400" />
                      <span>{product.portionSize}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Price */}
              <div className="bg-amber-50/50 border border-amber-100/80 p-3.5 rounded-2xl flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-stone-900">
                  ₦{product.price.toLocaleString()}
                </span>
                {product.discountPercent && product.discountPercent > 0 && (
                  <span className="text-sm text-stone-400 line-through">
                    ₦{Math.round(product.price * (1 + product.discountPercent / 100)).toLocaleString()}
                  </span>
                )}
                <span className="text-xs text-stone-500 ml-auto font-medium">Standard Portion</span>
              </div>

              {/* Description */}
              <p className="text-sm text-stone-600 leading-relaxed">
                {product.description}
              </p>

              {/* Spicy Indicator */}
              {product.spicyLevel && product.spicyLevel > 0 && (
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-xl">
                  <Flame className="w-4 h-4 text-orange-600 fill-orange-600" />
                  <span>
                    Spice Level: {product.spicyLevel === 3 ? 'Extra Hot & Spicy 🔥🔥🔥' : 'Mildly Spicy 🔥'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Tabs between Ingredients/Addons and Customer Reviews */}
          <div className="border-b border-stone-200 flex gap-6 text-sm font-semibold">
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-3 border-b-2 transition cursor-pointer ${
                activeTab === 'details'
                  ? 'border-amber-600 text-amber-600 font-bold'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              Customization & Ingredients
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 border-b-2 transition cursor-pointer flex items-center gap-2 ${
                activeTab === 'reviews'
                  ? 'border-amber-600 text-amber-600 font-bold'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Customer Reviews ({reviews.length})</span>
            </button>
          </div>

          {activeTab === 'details' ? (
            <div className="space-y-6">
              {/* Ingredients Pill List */}
              {product.ingredients && product.ingredients.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2.5">
                    Key Ingredients
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {product.ingredients.map((ing, i) => (
                      <span
                        key={i}
                        className="bg-stone-100 text-stone-700 text-xs px-3 py-1 rounded-lg font-medium border border-stone-200/60"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Add-on Options */}
              {product.addOns && product.addOns.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                      Customize with Add-ons (Optional)
                    </h4>
                    <span className="text-[11px] text-stone-400">Select multiple</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {product.addOns.map((addOn) => {
                      const isSelected = selectedAddOns.some((a) => a.id === addOn.id);
                      return (
                        <button
                          key={addOn.id}
                          type="button"
                          onClick={() => toggleAddOn(addOn)}
                          className={`flex items-center justify-between p-3 rounded-2xl border text-xs font-medium transition cursor-pointer text-left ${
                            isSelected
                              ? 'border-amber-600 bg-amber-50/70 text-stone-900 shadow-xs'
                              : 'border-stone-200 hover:border-amber-400 bg-white text-stone-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-4 h-4 rounded-md flex items-center justify-center border transition ${
                                isSelected
                                  ? 'bg-amber-600 border-amber-600 text-white'
                                  : 'border-stone-300 bg-white'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span className="font-semibold">{addOn.name}</span>
                          </div>
                          <span className="text-amber-800 font-bold ml-2">
                            +₦{addOn.price.toLocaleString()}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Special Instructions */}
              <div>
                <label 
                  htmlFor="special-instructions"
                  className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5"
                >
                  Special Kitchen Instructions
                </label>
                <textarea
                  id="special-instructions"
                  rows={2}
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g. Please make it extra spicy, sauce on the side, no onions..."
                  className="w-full text-xs p-3 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none text-stone-800"
                />
              </div>
            </div>
          ) : (
            /* Customer Reviews Tab */
            <div className="space-y-6">
              {/* Write Review Form */}
              <form onSubmit={handleSubmitReview} className="bg-stone-50 p-4 rounded-2xl border border-stone-200/80 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Leave a Review for this Meal
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      placeholder="e.g. Tolu Balogun"
                      className="w-full text-xs px-3 py-2 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">Rating</label>
                    <div className="flex items-center gap-1 py-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className="p-1 cursor-pointer hover:scale-110 transition"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= newRating ? 'fill-amber-400 text-amber-500' : 'text-stone-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">Your Comment</label>
                  <textarea
                    required
                    rows={2}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="How was the taste, portion, spice, and freshness?"
                    className="w-full text-xs p-3 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                  />
                </div>

                {reviewSuccessMsg && (
                  <p className="text-xs text-emerald-600 font-semibold">{reviewSuccessMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingReview ? 'Submitting...' : 'Post Review'}
                </button>
              </form>

              {/* Reviews List */}
              <div className="space-y-3">
                {reviews.length === 0 ? (
                  <div className="text-center py-8 text-stone-400 text-xs">
                    No reviews yet for this dish. Be the first to share your thoughts!
                  </div>
                ) : (
                  reviews.map((rev) => (
                    <div key={rev.id} className="p-3.5 bg-white border border-stone-100 rounded-2xl shadow-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-stone-900">{rev.customerName}</span>
                          <span className="text-[10px] text-stone-400">
                            {new Date(rev.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < rev.rating ? 'fill-amber-400 text-amber-500' : 'text-stone-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 sm:p-6 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Quantity Controls */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-stone-600">Qty:</span>
            <div className="flex items-center bg-white border border-stone-200 rounded-full p-1 shadow-xs">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-full flex items-center justify-center text-stone-600 hover:bg-stone-100 cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-9 text-center font-extrabold text-sm text-stone-900">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-stone-600 hover:bg-stone-100 cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!product.isAvailable}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-extrabold transition shadow-md cursor-pointer ${
                !product.isAvailable
                  ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                  : 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20 hover:scale-105 active:scale-95'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart • ₦{totalPrice.toLocaleString()}</span>
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              disabled={!product.isAvailable}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-6 py-3 rounded-full text-xs font-extrabold transition cursor-pointer ${
                !product.isAvailable
                  ? 'hidden'
                  : 'bg-stone-900 hover:bg-stone-800 text-white hover:scale-105 active:scale-95'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
