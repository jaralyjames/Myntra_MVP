'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import { Heart, ShoppingBag, Search, RotateCcw, Sparkles } from 'lucide-react';

type HeaderProps = {
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
  selectedCategory?: string;
  setSelectedCategory?: (cat: string) => void;
};

export const Header: React.FC<HeaderProps> = ({
  searchQuery = '',
  setSearchQuery,
  selectedCategory = 'All',
  setSelectedCategory,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { wishlist, cart, resetDemo } = useShop();

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const categories = ['All', 'Women', 'Men', 'Footwear', 'Accessories', 'Beauty'];

  const handleCategoryClick = (cat: string) => {
    if (setSelectedCategory) {
      setSelectedCategory(cat);
    }
    if (pathname !== '/') {
      router.push('/');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (setSearchQuery) {
      setSearchQuery(e.target.value);
    }
    if (pathname !== '/') {
      router.push('/');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#ff3f6c] to-[#ff758c] flex items-center justify-center text-white font-extrabold text-2xl shadow-md group-hover:scale-105 transition-transform">
            M
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-wider text-[#282c3f] flex items-center gap-1">
              MYNTRA <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#ff3f6c] text-white tracking-normal">MVP</span>
            </span>
            <span className="text-[10px] text-gray-500 font-medium tracking-wide -mt-1">
              PRICE DROP ENGINE
            </span>
          </div>
        </Link>

        {/* Category Nav Links */}
        <nav className="hidden lg:flex items-center gap-6 font-bold text-xs tracking-wider uppercase text-[#282c3f]">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`py-6 border-b-4 transition-all ${
                pathname === '/' && selectedCategory === cat
                  ? 'border-[#ff3f6c] text-[#ff3f6c]'
                  : 'border-transparent hover:border-[#ff3f6c] hover:text-[#ff3f6c]'
              }`}
            >
              {cat}
            </button>
          ))}
        </nav>

        {/* Search Bar */}
        <div className="flex-1 max-w-md relative hidden md:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search for products, brands and more..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-[#f5f5f6] hover:bg-[#eaeaea] focus:bg-white text-sm text-[#282c3f] placeholder-gray-400 pl-10 pr-4 py-2.5 rounded-md outline-none border border-transparent focus:border-[#ff3f6c] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery && setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 bg-gray-200 rounded-full w-4 h-4 flex items-center justify-center"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Wishlist Link */}
          <Link
            href="/wishlist"
            className={`flex flex-col items-center gap-1 group relative p-1 ${
              pathname === '/wishlist' ? 'text-[#ff3f6c]' : 'text-[#282c3f] hover:text-[#ff3f6c]'
            }`}
          >
            <div className="relative">
              <Heart className={`w-6 h-6 transition-transform group-hover:scale-110 ${
                pathname === '/wishlist' ? 'fill-[#ff3f6c] text-[#ff3f6c]' : ''
              }`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#ff3f6c] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                  {wishlist.length}
                </span>
              )}
            </div>
            <span className="text-[11px] font-bold tracking-tight">Wishlist</span>
          </Link>

          {/* Cart Link */}
          <Link
            href="/cart"
            className={`flex flex-col items-center gap-1 group relative p-1 ${
              pathname === '/cart' ? 'text-[#ff3f6c]' : 'text-[#282c3f] hover:text-[#ff3f6c]'
            }`}
          >
            <div className="relative">
              <ShoppingBag className={`w-6 h-6 transition-transform group-hover:scale-110 ${
                pathname === '/cart' ? 'fill-[#ff3f6c] text-[#ff3f6c]' : ''
              }`} />
              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#03a685] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalCartCount}
                </span>
              )}
            </div>
            <span className="text-[11px] font-bold tracking-tight">Bag</span>
          </Link>

          {/* Reset Demo Button */}
          <button
            onClick={resetDemo}
            title="Reset demo data to defaults"
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-gray-800 transition-colors p-1"
          >
            <RotateCcw className="w-5 h-5 hover:rotate-180 transition-transform duration-500" />
            <span className="text-[10px] font-semibold text-gray-400">Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
};
