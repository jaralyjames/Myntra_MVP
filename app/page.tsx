'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import { useShop } from '@/context/ShopContext';
import { Sparkles, SlidersHorizontal, PackageX, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export default function CataloguePage() {
  const { products } = useShop();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'recommended' | 'low-high' | 'high-low'>('recommended');

  const categories = ['All', 'High Intent 🔥', 'Women', 'Men', 'Footwear', 'Accessories', 'Beauty'];

  // Filter products by category & search query
  let filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'All'
        ? true
        : selectedCategory === 'High Intent 🔥'
        ? product.isHighIntent
        : product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sort products
  if (sortBy === 'low-high') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'high-low') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory === 'High Intent 🔥' ? 'All' : selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Hero Banner Section */}
      <section className="bg-gradient-to-r from-[#282c3f] via-[#3e4152] to-[#282c3f] text-white py-8 px-4 border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 bg-[#ff3f6c] text-white text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
              <Sparkles className="w-3.5 h-3.5" /> Grand Fashion Festival
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Flat 50-80% OFF On Top Brands
            </h1>
            <p className="text-gray-300 text-xs sm:text-sm max-w-xl">
              Save your high-intent fashion picks & test our instant <span className="text-[#ff3f6c] font-bold">Price Movement Engine (≥10%)</span> with live social proof & urgency tracking!
            </p>
          </div>

          {/* Quick Stats Badges */}
          <div className="flex items-center gap-4 text-center">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10">
              <span className="block text-xl font-black text-[#ff758c]">100%</span>
              <span className="text-[10px] text-gray-300 uppercase font-semibold">Original Brands</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10">
              <span className="block text-xl font-black text-[#03a685]">20</span>
              <span className="text-[10px] text-gray-300 uppercase font-semibold">Curated Items</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Filter Bar & Sorting */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 no-scrollbar">
            <SlidersHorizontal className="w-4 h-4 text-gray-500 shrink-0 mr-1" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#ff3f6c] text-white shadow-md shadow-pink-500/20'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-[#ff3f6c] hover:text-[#ff3f6c]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Count & Sort Selector */}
          <div className="flex items-center justify-between w-full sm:w-auto gap-4">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              {filteredProducts.length} Items Found
            </span>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-gray-200 text-xs font-bold text-[#282c3f] px-3 py-2 rounded-lg outline-none focus:border-[#ff3f6c]"
            >
              <option value="recommended">Sort by: Recommended</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* Empty Search / Filter State */
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 max-w-md mx-auto my-12 shadow-sm">
            <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mx-auto text-[#ff3f6c] mb-4">
              <PackageX className="w-8 h-8" />
            </div>
            <h3 className="font-extrabold text-lg text-[#282c3f]">No Products Found</h3>
            <p className="text-xs text-gray-500 mt-1">
              We couldn't find any items matching "{searchQuery}". Try selecting another category or clear your search query.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-6 bg-[#ff3f6c] text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-lg hover:bg-[#e0325b] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Trust Badges */}
        <section className="mt-16 pt-10 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-4 bg-white rounded-xl border border-gray-100 flex flex-col items-center">
            <ShieldCheck className="w-8 h-8 text-[#ff3f6c] mb-2" />
            <h4 className="font-bold text-sm text-[#282c3f]">100% Authentic Products</h4>
            <p className="text-xs text-gray-500 mt-0.5">Sourced directly from verified top fashion brands</p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-gray-100 flex flex-col items-center">
            <Truck className="w-8 h-8 text-[#ff3f6c] mb-2" />
            <h4 className="font-bold text-sm text-[#282c3f]">Express Delivery</h4>
            <p className="text-xs text-gray-500 mt-0.5">Fast & secure shipping across all Indian pincodes</p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-gray-100 flex flex-col items-center">
            <RefreshCw className="w-8 h-8 text-[#ff3f6c] mb-2" />
            <h4 className="font-bold text-sm text-[#282c3f]">Easy 14 Day Returns</h4>
            <p className="text-xs text-gray-500 mt-0.5">Hassle-free doorstep pickup & instant refund</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 px-4 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 MYNTRA MVP — Price Drop Simulation Demo</p>
          <p className="text-[11px] text-gray-400">Designed with Next.js, React & TypeScript</p>
        </div>
      </footer>
    </div>
  );
}
