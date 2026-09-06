'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { useShop } from '@/context/ShopContext';
import { Heart, ShoppingBag, Trash2, ArrowLeft, TrendingDown, TrendingUp, Bell, Zap, Flame, Star } from 'lucide-react';

export default function WishlistPage() {
  const { wishlist, products, removeFromWishlist, addToCart, simulatePriceDrop } = useShop();

  // Combine wishlist item metadata with product information
  const wishlistedProducts = wishlist
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return null;

      const priceDiff = product.price - item.priceWhenWishlisted;
      const hasPriceDropped = priceDiff < 0;
      const hasPriceIncreased = priceDiff > 0;
      const savings = Math.abs(priceDiff);

      return {
        ...item,
        product,
        hasPriceDropped,
        hasPriceIncreased,
        savings,
        isHighIntent: item.isHighIntent || product.isHighIntent,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Page Title Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="text-gray-400 hover:text-[#282c3f] transition-colors p-1"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#282c3f] tracking-wide flex items-center gap-2">
                My Wishlist <span className="text-gray-400 font-medium text-base">({wishlistedProducts.length} items)</span>
              </h1>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Track personalised time-bound discounts (10% to 20% OFF) on high-intent items.
            </p>
          </div>
        </div>

        {/* Wishlist Items Grid */}
        {wishlistedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistedProducts.map(
              ({
                productId,
                priceWhenWishlisted,
                wishlistedAt,
                notifyLater,
                product,
                hasPriceDropped,
                savings,
                isHighIntent,
              }) => (
                <div
                  key={productId}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col relative group"
                >
                  {/* Remove Button Overlay */}
                  <button
                    onClick={() => removeFromWishlist(productId)}
                    className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-md text-gray-500 hover:text-red-600 p-2 rounded-full shadow transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* High Intent & Price Movement Badges */}
                  <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                    {isHighIntent && (
                      <div className="bg-amber-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
                        <Flame className="w-3 h-3 fill-white" /> HIGH INTENT
                      </div>
                    )}

                    {hasPriceDropped && (
                      <div className="bg-[#03a685] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1 animate-pulse">
                        <TrendingDown className="w-3 h-3" /> PERSONALISED DISCOUNT
                      </div>
                    )}
                  </div>

                  {/* Image Container */}
                  <div className="relative aspect-[3/4] w-full bg-gray-100 overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                  </div>

                  {/* Card Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Social Proof Stats */}
                      <div className="flex items-center gap-1.5 mb-2 text-[10px] font-bold text-gray-600">
                        <span className="flex items-center gap-0.5 bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded">
                          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          {product.recentRating} ({product.recentReviewsCount})
                        </span>
                        <span className="flex items-center gap-0.5 bg-rose-50 text-rose-700 border border-rose-200 px-1.5 py-0.5 rounded">
                          <Flame className="w-3 h-3 text-rose-500 fill-rose-500" />
                          {product.recentlySold} sold
                        </span>
                      </div>

                      <span className="text-xs font-extrabold text-[#282c3f] uppercase tracking-wide">
                        {product.brand}
                      </span>
                      <h3 className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                        {product.name}
                      </h3>

                      {/* Notification Alert Status */}
                      {notifyLater && (
                        <div className="mt-2 flex items-center gap-1.5 text-[11px] font-bold text-[#ff3f6c] bg-[#fff0f3] px-2 py-1 rounded">
                          <Bell className="w-3.5 h-3.5" /> Remind on next drop enabled
                        </div>
                      )}

                      {/* Price History Section */}
                      <div className="mt-3 p-2.5 bg-gray-50 rounded-lg border border-gray-100 space-y-1">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Wishlisted price:</span>
                          <span
                            className={
                              hasPriceDropped
                                ? 'line-through font-semibold text-gray-400'
                                : 'font-bold text-[#282c3f]'
                            }
                          >
                            ₹{priceWhenWishlisted.toLocaleString()}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-gray-600">Current price:</span>
                          <span
                            className={`font-extrabold ${
                              hasPriceDropped
                                ? 'text-[#03a685] text-sm'
                                : 'text-[#282c3f]'
                            }`}
                          >
                            ₹{product.price.toLocaleString()}
                          </span>
                        </div>

                        {hasPriceDropped && (
                          <div className="pt-1 border-t border-gray-200 flex items-center justify-between text-[11px] font-bold text-[#03a685]">
                            <span>You Save:</span>
                            <span>₹{savings.toLocaleString()} 🎉</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-2 text-[10px] text-gray-400 text-right">
                        Wishlisted on {new Date(wishlistedAt).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Move to Bag Action */}
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => {
                          addToCart(productId, product.price);
                          removeFromWishlist(productId);
                        }}
                        className="w-full bg-[#ff3f6c] hover:bg-[#e0325b] text-white py-2.5 px-3 rounded-md text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm"
                      >
                        <ShoppingBag className="w-4 h-4" /> Move to Bag
                      </button>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        ) : (
          /* Empty Wishlist State */
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 max-w-md mx-auto my-12 shadow-sm">
            <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mx-auto text-[#ff3f6c] mb-4">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="font-extrabold text-lg text-[#282c3f]">YOUR WISHLIST IS EMPTY</h3>
            <p className="text-xs text-gray-500 mt-1">
              Explore our fashion catalogue, tap the heart icon on any product, and simulate instant price movements!
            </p>
            <Link
              href="/"
              className="mt-6 inline-block bg-[#ff3f6c] text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-lg hover:bg-[#e0325b] transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
