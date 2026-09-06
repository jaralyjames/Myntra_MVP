export type Product = {
  id: number;
  name: string;
  brand: string;
  category: 'Women' | 'Men' | 'Footwear' | 'Accessories' | 'Beauty';
  image: string;
  price: number;
  originalPrice: number;
  availableSizes: string[];
  isHighIntent: boolean;
  recentlySold: number;
  recentReviewsCount: number;
  recentRating: number;
  stockLeft: number;
};

export type WishlistItem = {
  productId: number;
  priceWhenWishlisted: number;
  wishlistedAt: string;
  notifyLater: boolean;
  isHighIntent: boolean;
};

export type CartItem = {
  productId: number;
  quantity: number;
  priceAddedAt: number;
};

export type PriceMovementType = 'DROP' | 'RISE';

export type PriceDropEvent = {
  productId: number;
  productName: string;
  brand: string;
  image: string;
  priceWhenWishlisted: number;
  reducedPrice: number;
  discountPercentage: number;
  savedAmount: number;
  movementType: PriceMovementType;
  recentlySold: number;
  recentReviewsCount: number;
  recentRating: number;
  stockLeft: number;
  isHighIntent: boolean;
  expiresAt: string;
  isPersonalised: boolean;
};

export type ShopState = {
  products: Product[];
  wishlist: WishlistItem[];
  cart: CartItem[];
  activePriceDrop: PriceDropEvent | null;
  toastMessage: string | null;
};
