'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, WishlistItem, CartItem, PriceDropEvent, PriceMovementType } from '@/types/shop';
import { INITIAL_PRODUCTS, INITIAL_WISHLIST } from '@/data/products';

type ShopContextType = {
  products: Product[];
  wishlist: WishlistItem[];
  cart: CartItem[];
  activePriceDrop: PriceDropEvent | null;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  clearToast: () => void;
  addToWishlist: (productId: number) => void;
  removeFromWishlist: (productId: number) => void;
  toggleHighIntent: (productId: number) => void;
  addToCart: (productId: number, customPrice?: number) => void;
  removeFromCart: (productId: number) => void;
  updateCartQuantity: (productId: number, delta: number) => void;
  simulatePriceDrop: () => void;
  movePriceDropItemToCart: () => void;
  notifyAboutPriceDropLater: () => void;
  closePriceDropModal: () => void;
  resetDemo: () => void;
};

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const LS_WISHLIST_KEY = 'myntra-demo-wishlist';
const LS_CART_KEY = 'myntra-demo-cart';
const LS_PRICES_KEY = 'myntra-demo-product-prices';
const LS_NOTIFICATIONS_KEY = 'myntra-demo-notifications';

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [wishlist, setWishlist] = useState<WishlistItem[]>(INITIAL_WISHLIST);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activePriceDrop, setActivePriceDrop] = useState<PriceDropEvent | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem(LS_WISHLIST_KEY);
      const savedCart = localStorage.getItem(LS_CART_KEY);
      const savedPrices = localStorage.getItem(LS_PRICES_KEY);

      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
      if (savedPrices) {
        const pricesMap: Record<number, number> = JSON.parse(savedPrices);
        setProducts((prev) =>
          prev.map((p) => (pricesMap[p.id] !== undefined ? { ...p, price: pricesMap[p.id] } : p))
        );
      }
    } catch (e) {
      console.error('Failed to load local storage:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save changes to localStorage after initial hydration
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(LS_WISHLIST_KEY, JSON.stringify(wishlist));
      const notificationsMap = wishlist
        .filter((item) => item.notifyLater)
        .map((item) => item.productId);
      localStorage.setItem(LS_NOTIFICATIONS_KEY, JSON.stringify(notificationsMap));
    } catch (e) {}
  }, [wishlist, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(LS_CART_KEY, JSON.stringify(cart));
    } catch (e) {}
  }, [cart, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      const pricesMap: Record<number, number> = {};
      products.forEach((p) => {
        pricesMap[p.id] = p.price;
      });
      localStorage.setItem(LS_PRICES_KEY, JSON.stringify(pricesMap));
    } catch (e) {}
  }, [products, isLoaded]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4000);
  };

  const clearToast = () => setToastMessage(null);

  const addToWishlist = (productId: number) => {
    const targetProduct = products.find((p) => p.id === productId);
    if (!targetProduct) return;

    if (wishlist.some((item) => item.productId === productId)) {
      showToast(`"${targetProduct.name}" is already in your wishlist!`);
      return;
    }

    const newItem: WishlistItem = {
      productId,
      priceWhenWishlisted: targetProduct.price,
      wishlistedAt: new Date().toISOString(),
      notifyLater: false,
      isHighIntent: targetProduct.isHighIntent,
    };

    setWishlist((prev) => [...prev, newItem]);
    showToast(`Added "${targetProduct.name}" to wishlist ❤️`);
  };

  const removeFromWishlist = (productId: number) => {
    const targetProduct = products.find((p) => p.id === productId);
    setWishlist((prev) => prev.filter((item) => item.productId !== productId));
    if (activePriceDrop?.productId === productId) {
      setActivePriceDrop(null);
    }
    if (targetProduct) {
      showToast(`Removed "${targetProduct.name}" from wishlist.`);
    }
  };

  const toggleHighIntent = (productId: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, isHighIntent: !p.isHighIntent } : p))
    );
    setWishlist((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, isHighIntent: !item.isHighIntent } : item
      )
    );
    const prod = products.find((p) => p.id === productId);
    if (prod) {
      const nextState = !prod.isHighIntent;
      showToast(
        nextState
          ? `Marked "${prod.name}" as High Intent 🔥`
          : `Removed High Intent tag from "${prod.name}"`
      );
    }
  };

  const addToCart = (productId: number, customPrice?: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const purchasePrice = customPrice ?? product.price;

    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { productId, quantity: 1, priceAddedAt: purchasePrice }];
    });

    showToast(`Added "${product.name}" to shopping bag 🛍️`);
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const updateCartQuantity = (productId: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.productId === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const simulatePriceDrop = () => {
    if (wishlist.length === 0) {
      showToast('Add at least one high-intent product to your wishlist to simulate price drops.');
      return;
    }

    // Filter high-intent wishlist items first, fallback to all wishlist items
    const highIntentItems = wishlist.filter((item) => item.isHighIntent);
    const candidateList = highIntentItems.length > 0 ? highIntentItems : wishlist;

    const randomIndex = Math.floor(Math.random() * candidateList.length);
    const selectedItem = candidateList[randomIndex];
    const product = products.find((p) => p.id === selectedItem.productId);

    if (!product) return;

    // Minimum 10% price change (70% drop, 30% rise)
    const isDrop = Math.random() > 0.3;
    const discountPercentage = isDrop
      ? Math.floor(Math.random() * 26) + 10  // 10% to 35% drop
      : Math.floor(Math.random() * 16) + 10; // 10% to 25% rise

    const movementType: PriceMovementType = isDrop ? 'DROP' : 'RISE';
    const multiplier = isDrop ? 1 - discountPercentage / 100 : 1 + discountPercentage / 100;
    const newPrice = Math.max(99, Math.round(selectedItem.priceWhenWishlisted * multiplier));
    const savedAmount = Math.abs(selectedItem.priceWhenWishlisted - newPrice);

    // Update product price in state
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, price: newPrice } : p))
    );

    // Trigger active price movement event
    setActivePriceDrop({
      productId: product.id,
      productName: product.name,
      brand: product.brand,
      image: product.image,
      priceWhenWishlisted: selectedItem.priceWhenWishlisted,
      reducedPrice: newPrice,
      discountPercentage,
      savedAmount,
      movementType,
      recentlySold: product.recentlySold,
      recentReviewsCount: product.recentReviewsCount,
      recentRating: product.recentRating,
      stockLeft: product.stockLeft,
      isHighIntent: selectedItem.isHighIntent || product.isHighIntent,
    });
  };

  const movePriceDropItemToCart = () => {
    if (!activePriceDrop) return;

    const { productId, reducedPrice, productName } = activePriceDrop;

    // Add to cart at reduced price
    addToCart(productId, reducedPrice);

    // Remove from wishlist
    setWishlist((prev) => prev.filter((item) => item.productId !== productId));

    // Clear active modal
    setActivePriceDrop(null);

    showToast(`Moved "${productName}" to bag at price ₹${reducedPrice.toLocaleString()}! 🎉`);
  };

  const notifyAboutPriceDropLater = () => {
    if (!activePriceDrop) return;

    const { productId, productName } = activePriceDrop;

    // Set notifyLater: true in wishlist
    setWishlist((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, notifyLater: true } : item))
    );

    setActivePriceDrop(null);
    showToast(`We’ll notify you when another price movement occurs for "${productName}"! 🔔`);
  };

  const closePriceDropModal = () => {
    setActivePriceDrop(null);
  };

  const resetDemo = () => {
    try {
      localStorage.removeItem(LS_WISHLIST_KEY);
      localStorage.removeItem(LS_CART_KEY);
      localStorage.removeItem(LS_PRICES_KEY);
      localStorage.removeItem(LS_NOTIFICATIONS_KEY);
    } catch (e) {}

    setProducts(INITIAL_PRODUCTS);
    setWishlist(INITIAL_WISHLIST);
    setCart([]);
    setActivePriceDrop(null);
    showToast('Demo state restored to default catalog & wishlist! 🔄');
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        wishlist,
        cart,
        activePriceDrop,
        toastMessage,
        showToast,
        clearToast,
        addToWishlist,
        removeFromWishlist,
        toggleHighIntent,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        simulatePriceDrop,
        movePriceDropItemToCart,
        notifyAboutPriceDropLater,
        closePriceDropModal,
        resetDemo,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
