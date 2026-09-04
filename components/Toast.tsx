'use client';

import React from 'react';
import { useShop } from '@/context/ShopContext';
import { Sparkles, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage, clearToast } = useShop();

  if (!toastMessage) return null;

  return (
    <div className="fixed top-24 right-6 z-50 animate-slide-down max-w-md">
      <div className="bg-[#282c3f] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-gray-700">
        <Sparkles className="w-5 h-5 text-[#ff3f6c] shrink-0" />
        <p className="text-xs font-semibold leading-snug flex-1">{toastMessage}</p>
        <button
          onClick={clearToast}
          className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
