'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { useShop } from '@/context/ShopContext';
import { ShoppingBag, Trash2, ArrowLeft, Plus, Minus, ShieldCheck, Tag, Sparkles } from 'lucide-react';

export default function CartPage() {
  const { cart, products, updateCartQuantity, removeFromCart } = useShop();

  // Map cart items to product details with locked purchase price
  const cartItemsWithDetails = cart
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return null;

      const lineTotal = item.priceAddedAt * item.quantity;
      const lineOriginalTotal = product.originalPrice * item.quantity;
      const discount = lineOriginalTotal - lineTotal;

      return {
        ...item,
        product,
        lineTotal,
        lineOriginalTotal,
        discount,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  // Price calculations
  const totalMrp = cartItemsWithDetails.reduce((sum, item) => sum + item.lineOriginalTotal, 0);
  const totalPayable = cartItemsWithDetails.reduce((sum, item) => sum + item.lineTotal, 0);
  const totalDiscount = totalMrp - totalPayable;

  const isFreeDelivery = totalPayable >= 999 || totalPayable === 0;
  const shippingFee = isFreeDelivery ? 0 : 99;

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Page Title */}
        <div className="flex items-center gap-2 mb-8 pb-4 border-b border-gray-200">
          <Link href="/" className="text-gray-400 hover:text-[#282c3f] transition-colors p-1">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#282c3f] tracking-wide flex items-center gap-2">
            Shopping Bag <span className="text-gray-400 font-medium text-base">({cartItemsWithDetails.length} items)</span>
          </h1>
        </div>

        {cartItemsWithDetails.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {/* Delivery Banner */}
              <div className="bg-[#e6f7f3] border border-[#03a685]/30 rounded-xl p-4 flex items-center gap-3 text-xs text-[#03a685] font-bold">
                <ShieldCheck className="w-5 h-5 shrink-0" />
                <span>
                  {isFreeDelivery
                    ? '🎉 You qualify for FREE Express Doorstep Delivery!'
                    : `Add ₹${(999 - totalPayable).toLocaleString()} more to unlock FREE Express Delivery.`}
                </span>
              </div>

              {cartItemsWithDetails.map(({ productId, quantity, priceAddedAt, product, lineTotal, lineOriginalTotal }) => (
                <div
                  key={productId}
                  className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    {/* Thumbnail */}
                    <div className="relative w-20 h-24 rounded-lg overflow-hidden shrink-0 bg-gray-100 border border-gray-100">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    {/* Details */}
                    <div>
                      <span className="text-xs font-extrabold text-[#ff3f6c] uppercase tracking-wide">
                        {product.brand}
                      </span>
                      <h3 className="font-bold text-sm text-[#282c3f] line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">Category: {product.category}</p>

                      {/* Locked Purchase Price */}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="font-extrabold text-sm text-[#282c3f]">
                          ₹{priceAddedAt.toLocaleString()}
                        </span>
                        {product.originalPrice > priceAddedAt && (
                          <span className="text-xs text-gray-400 line-through">
                            ₹{product.originalPrice.toLocaleString()}
                          </span>
                        )}
                        {priceAddedAt < product.originalPrice && (
                          <span className="text-[10px] font-bold text-[#03a685] bg-[#e6f7f3] px-1.5 py-0.5 rounded">
                            Price Locked
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Actions Controls */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                      <button
                        onClick={() => updateCartQuantity(productId, -1)}
                        className="p-2 hover:bg-gray-200 text-gray-600 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-[#282c3f] min-w-[28px] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(productId, 1)}
                        className="p-2 hover:bg-gray-200 text-gray-600 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="block font-black text-sm text-[#282c3f]">
                        ₹{lineTotal.toLocaleString()}
                      </span>
                      <button
                        onClick={() => removeFromCart(productId)}
                        className="text-xs font-semibold text-gray-400 hover:text-red-600 flex items-center gap-1 mt-1 ml-auto transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Details Sidebar */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
              <h3 className="font-extrabold text-xs text-gray-500 uppercase tracking-widest pb-3 border-b border-gray-200">
                PRICE DETAILS ({cartItemsWithDetails.length} Items)
              </h3>

              <div className="space-y-2.5 text-xs text-gray-600 font-medium">
                <div className="flex justify-between">
                  <span>Total MRP</span>
                  <span>₹{totalMrp.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#03a685]">
                  <span>Discount on MRP</span>
                  <span>- ₹{totalDiscount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Convenience Fee</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-[#03a685] font-bold uppercase">FREE</span>
                    ) : (
                      `₹${shippingFee}`
                    )}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 flex justify-between items-center text-base font-extrabold text-[#282c3f]">
                <span>Total Payable</span>
                <span className="text-lg text-[#ff3f6c]">
                  ₹{(totalPayable + shippingFee).toLocaleString()}
                </span>
              </div>

              <button
                onClick={() => alert('Demo checkout completed! Thank you for testing Myntra MVP.')}
                className="w-full bg-[#ff3f6c] hover:bg-[#e0325b] text-white py-3.5 px-4 rounded-xl font-bold text-sm uppercase tracking-wider shadow-lg shadow-pink-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] mt-2"
              >
                PLACE ORDER
              </button>
            </div>
          </div>
        ) : (
          /* Empty Cart State */
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 max-w-md mx-auto my-12 shadow-sm">
            <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mx-auto text-[#ff3f6c] mb-4">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="font-extrabold text-lg text-[#282c3f]">YOUR SHOPPING BAG IS EMPTY</h3>
            <p className="text-xs text-gray-500 mt-1">
              There is nothing in your bag. Explore our catalog or move items from your wishlist!
            </p>
            <Link
              href="/"
              className="mt-6 inline-block bg-[#ff3f6c] text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-lg hover:bg-[#e0325b] transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
