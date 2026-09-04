'use client';

import React from 'react';
import Image from 'next/image';
import { Product } from '@/types/shop';
import { useShop } from '@/context/ShopContext';
import { Heart, ShoppingBag, Check, Star, Flame, FlameKindling } from 'lucide-react';

type ProductCardProps = {
  product: Product;
};

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { wishlist, cart, addToWishlist, removeFromWishlist, toggleHighIntent, addToCart } = useShop();

  const isWishlisted = wishlist.some((item) => item.productId === product.id);
  const isInCart = cart.some((item) => item.productId === product.id);

  // Calculate discount percentage based on current price vs original MRP
  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  const handleHighIntentToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleHighIntent(product.id);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id);
  };

  return (
    <div className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col relative">
      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          unoptimized
        />

        {/* Top Right Action Overlay: Wishlist & High Intent Toggle */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          <button
            onClick={handleWishlistToggle}
            className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md shadow-md flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
            aria-label={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            title={isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isWishlisted ? 'fill-[#ff3f6c] text-[#ff3f6c]' : 'text-gray-600 hover:text-[#ff3f6c]'
              }`}
            />
          </button>

          <button
            onClick={handleHighIntentToggle}
            className={`w-9 h-9 rounded-full backdrop-blur-md shadow-md flex items-center justify-center transition-transform hover:scale-110 active:scale-95 ${
              product.isHighIntent
                ? 'bg-amber-500 text-white'
                : 'bg-white/90 text-gray-400 hover:text-amber-500'
            }`}
            aria-label="Toggle High Intent"
            title={product.isHighIntent ? 'High Intent Product (Tracked)' : 'Mark as High Intent'}
          >
            <Flame className={`w-4 h-4 ${product.isHighIntent ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Category Tag */}
        <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded">
          {product.category}
        </span>

        {/* High Intent Badge */}
        {product.isHighIntent && (
          <span className="absolute bottom-3 left-3 bg-amber-500/90 backdrop-blur-md text-white text-[10px] font-extrabold px-2 py-0.5 rounded flex items-center gap-1">
            <Flame className="w-3 h-3 fill-white" /> High Intent
          </span>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Social Proof Stats */}
          <div className="flex items-center gap-2 mb-2 flex-wrap text-[11px] font-bold text-gray-600">
            <span className="flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded">
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              {product.recentRating} ({product.recentReviewsCount})
            </span>
            <span className="flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 px-1.5 py-0.5 rounded">
              <Flame className="w-3 h-3 text-rose-500 fill-rose-500" />
              {product.recentlySold} sold
            </span>
          </div>

          {/* Brand */}
          <h3 className="font-extrabold text-sm text-[#282c3f] tracking-wide uppercase">
            {product.brand}
          </h3>

          {/* Name */}
          <p className="text-xs text-gray-500 line-clamp-1 mt-0.5 font-normal">
            {product.name}
          </p>

          {/* Price Breakdown */}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="font-bold text-sm text-[#282c3f]">
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice > product.price && (
              <>
                <span className="text-xs text-gray-400 line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-[#ff905a]">
                  ({discountPercent}% OFF)
                </span>
              </>
            )}
          </div>

          {/* Size Tags */}
          <div className="flex items-center gap-1 mt-2.5 flex-wrap">
            <span className="text-[10px] text-gray-400 font-semibold mr-1">Sizes:</span>
            {product.availableSizes.map((size) => (
              <span
                key={size}
                className="text-[10px] text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded font-medium"
              >
                {size}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <button
            onClick={handleAddToCart}
            className={`w-full py-2.5 px-3 rounded-md text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              isInCart
                ? 'bg-[#e6f7f3] text-[#03a685] border border-[#03a685]'
                : 'bg-[#ff3f6c] text-white hover:bg-[#e0325b] shadow-sm hover:shadow-md'
            }`}
          >
            {isInCart ? (
              <>
                <Check className="w-4 h-4" /> Added to Bag
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" /> Add to Bag
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
