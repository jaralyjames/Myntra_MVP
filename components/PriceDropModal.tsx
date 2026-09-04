'use client';

import React from 'react';
import Image from 'next/image';
import { useShop } from '@/context/ShopContext';
import { ShoppingBag, Bell, Trash2, X, TrendingDown, TrendingUp, Star, Flame, Zap } from 'lucide-react';

export const PriceDropModal: React.FC = () => {
  const {
    activePriceDrop,
    movePriceDropItemToCart,
    notifyAboutPriceDropLater,
    removeFromWishlist,
    closePriceDropModal,
  } = useShop();

  if (!activePriceDrop) return null;

  const {
    productId,
    productName,
    brand,
    image,
    priceWhenWishlisted,
    reducedPrice,
    discountPercentage,
    savedAmount,
    movementType,
    recentlySold,
    recentReviewsCount,
    recentRating,
    stockLeft,
    isHighIntent,
  } = activePriceDrop;

  const isDrop = movementType === 'DROP';

  const handleRemoveFromWishlist = () => {
    removeFromWishlist(productId);
    closePriceDropModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl animate-modal-pop border border-pink-100 relative">
        {/* Top Header Banner */}
        <div
          className={`p-4 text-white relative ${
            isDrop
              ? 'bg-gradient-to-r from-[#ff3f6c] to-[#ff758c]'
              : 'bg-gradient-to-r from-amber-500 to-rose-600'
          }`}
        >
          <button
            onClick={closePriceDropModal}
            className="absolute top-3.5 right-3.5 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-1 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-md">
              {isDrop ? (
                <TrendingDown className="w-7 h-7 text-yellow-300 animate-bounce" />
              ) : (
                <TrendingUp className="w-7 h-7 text-yellow-200 animate-bounce" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest bg-yellow-300 text-black px-2 py-0.5 rounded-full inline-block">
                  {isHighIntent ? '🔥 High Intent Item Alert' : '⚡ Price Movement Alert'}
                </span>
                <span className="text-[10px] font-extrabold bg-white/20 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">
                  {discountPercentage}% {isDrop ? 'DROP' : 'RISE'}
                </span>
              </div>
              <h2 className="font-extrabold text-lg leading-tight flex items-center gap-1.5">
                {isDrop ? 'Price Drop Detected! (≥10%)' : 'Price Movement Alert (≥10%)'}
              </h2>
            </div>
          </div>
        </div>

        {/* Product & Price Section */}
        <div className="p-6">
          <div className="flex gap-4 items-center bg-gray-50 p-3.5 rounded-xl border border-gray-100">
            {/* Thumbnail */}
            <div className="relative w-20 h-24 rounded-lg overflow-hidden shrink-0 bg-gray-200">
              <Image
                src={image}
                alt={productName}
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            {/* Price Information */}
            <div className="flex-1">
              <span className="text-xs font-bold text-[#ff3f6c] uppercase tracking-wider">
                {brand}
              </span>
              <h3 className="font-bold text-sm text-[#282c3f] line-clamp-1">
                {productName}
              </h3>

              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>Price when wishlisted:</span>
                  <span className="line-through font-semibold">
                    ₹{priceWhenWishlisted.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-medium">New Price:</span>
                  <span
                    className={`text-lg font-extrabold ${
                      isDrop ? 'text-[#03a685]' : 'text-amber-600'
                    }`}
                  >
                    ₹{reducedPrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded ${
                      isDrop
                        ? 'text-[#03a685] bg-[#e6f7f3]'
                        : 'text-amber-700 bg-amber-50'
                    }`}
                  >
                    {isDrop
                      ? `You save ₹${savedAmount.toLocaleString()} (${discountPercentage}% OFF)`
                      : `Increased by ₹${savedAmount.toLocaleString()} (${discountPercentage}%)`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Social Proof & Urgency Section */}
          <div className="mt-4 p-3.5 bg-gradient-to-r from-amber-50 to-rose-50 rounded-xl border border-amber-200/60 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-gray-800">
              <div className="flex items-center gap-1.5 text-amber-700">
                <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                <span>Recently Sold:</span>
              </div>
              <span className="font-extrabold text-gray-900 bg-white px-2 py-0.5 rounded-md shadow-xs border border-amber-200">
                {recentlySold} bought in last 24h
              </span>
            </div>

            <div className="flex items-center justify-between text-xs font-bold text-gray-800">
              <div className="flex items-center gap-1.5 text-amber-700">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span>Customer Reviews:</span>
              </div>
              <span className="font-extrabold text-gray-900 bg-white px-2 py-0.5 rounded-md shadow-xs border border-amber-200">
                {recentRating} ★ ({recentReviewsCount} recent reviews)
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-bold text-red-600 pt-1 border-t border-amber-200/40">
              <Zap className="w-3.5 h-3.5 fill-red-500" />
              <span>Urgency Alert: High Demand! Only {stockLeft} left in stock.</span>
            </div>
          </div>

          {/* Three Main Actions */}
          <div className="mt-5 space-y-2.5">
            {/* Action 1: Move to Cart */}
            <button
              onClick={movePriceDropItemToCart}
              className="w-full bg-[#03a685] hover:bg-[#028a6e] text-white py-3.5 px-4 rounded-xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <ShoppingBag className="w-5 h-5" />
              1. Move to Bag
            </button>

            {/* Action 2: Notify Later */}
            <button
              onClick={notifyAboutPriceDropLater}
              className="w-full bg-[#f5f5f6] hover:bg-[#eaeaec] text-[#282c3f] py-3.5 px-4 rounded-xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 border border-gray-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Bell className="w-5 h-5 text-[#ff3f6c]" />
              2. Notify Later
            </button>

            {/* Action 3: Remove from Wishlist */}
            <button
              onClick={handleRemoveFromWishlist}
              className="w-full bg-white hover:bg-red-50 text-red-600 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-red-200 transition-all"
            >
              <Trash2 className="w-4 h-4" />
              3. Remove from Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
