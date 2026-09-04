'use client';

import React from 'react';
import { useShop } from '@/context/ShopContext';
import { Zap } from 'lucide-react';

export const SimulatePriceDropButton: React.FC = () => {
  const { simulatePriceDrop, wishlist } = useShop();

  const highIntentCount = wishlist.filter((item) => item.isHighIntent).length;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        onClick={simulatePriceDrop}
        className="group relative bg-gradient-to-r from-[#ff3f6c] to-[#ff758c] text-white font-bold px-5 py-3.5 rounded-full shadow-2xl hover:shadow-pink-500/40 flex items-center gap-2.5 transition-all duration-300 transform hover:scale-105 active:scale-95 animate-pulse-glow border-2 border-white/40"
      >
        <Zap className="w-5 h-5 text-yellow-300 fill-yellow-300 animate-bounce" />
        <div className="text-left leading-tight">
          <span className="block text-xs font-extrabold uppercase tracking-wider text-yellow-200">
            High Intent Alert
          </span>
          <span className="block text-sm tracking-wide font-extrabold uppercase">
            Simulate Price Drop (≥10%)
          </span>
        </div>
        {wishlist.length > 0 && (
          <span className="bg-white text-[#ff3f6c] text-xs font-black px-2 py-0.5 rounded-full ml-1">
            {highIntentCount > 0 ? `${highIntentCount} 🔥` : wishlist.length}
          </span>
        )}
      </button>
    </div>
  );
};
