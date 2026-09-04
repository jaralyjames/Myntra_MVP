# Phase 1: Define the MVP

Browse catalogue → Add/Mark high-intent product to wishlist → Simulate price movement → Receive notification when price moves up or down by at least 10% → Review price change with urgency & social proof (recent reviews & recently sold count) → Take action: Move to cart, notify later, or remove from wishlist.

Use React with Next.js and TypeScript, storing all data locally in `localStorage`.


# Phase 2: Set up the project

Suggested structure:

myntra-price-drop-demo/
├── app/
│   ├── cart/
│   │   └── page.tsx
│   ├── wishlist/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Header.tsx
│   ├── ProductCard.tsx
│   ├── PriceDropModal.tsx
│   ├── SocialProofBadge.tsx
│   └── SimulatePriceDropButton.tsx
├── context/
│   └── ShopContext.tsx
├── data/
│   └── products.ts
└── types/
    └── shop.ts

Deliverable: A basic application framework with navigation between catalogue, wishlist, and cart.


# Phase 3: Create 20 fake products with social proof data

Each product should contain high-intent flags and urgency/social proof metadata:

```typescript
type Product = {
  id: number;
  name: string;
  brand: string;
  category: string;
  image: string;
  price: number;
  originalPrice: number;
  availableSizes: string[];
  isHighIntent: boolean;
  recentlySold: number;        // e.g. 342 bought in last 24 hours
  recentReviewsCount: number;  // e.g. 128 recent reviews
  recentRating: number;        // e.g. 4.8
  stockLeft: number;           // e.g. 5 left in stock (urgency)
};
```

Add 20 products across categories:
| Category | Number of products |
| --- | --- |
| Women | 6 |
| Men | 5 |
| Footwear | 4 |
| Accessories | 3 |
| Beauty | 2 |


# Phase 4: Build the catalogue

Create a Myntra-inspired product grid that displays:
• Product image  
• Brand & product name  
• Current price & original price  
• Discount percentage  
• Social proof indicators (e.g. "🔥 300+ bought recently", "⭐ 4.8 (120+ reviews)")  
• High-Intent badge  
• Wishlist button  
• Add-to-cart button  

Add basic catalogue controls:
• Search by product or brand  
• Filter by category or high-intent items  
• Product count display  
• Empty search result state  

Deliverable: Users can browse, search, and filter all 20 products with visible social proof metrics.


# Phase 5: Create shared application state

Use React Context to manage the catalogue, wishlist, cart, high-intent tracking, and price-movement notifications.

```typescript
type WishlistItem = {
  productId: number;
  priceWhenWishlisted: number;
  wishlistedAt: string;
  notifyLater: boolean;
  isHighIntent: boolean;
};

type CartItem = {
  productId: number;
  quantity: number;
  priceAddedAt: number;
};

type PriceMovementType = 'DROP' | 'RISE';

type PriceDropEvent = {
  productId: number;
  oldPrice: number;
  newPrice: number;
  percentageChange: number; // Must be >= 10%
  movementType: PriceMovementType;
  triggeredAt: string;
};

type ShopState = {
  products: Product[];
  wishlist: WishlistItem[];
  cart: CartItem[];
  activePriceDrop: PriceDropEvent | null;
};
```

Create functions for:
• `addToWishlist(productId)`
• `removeFromWishlist(productId)`
• `toggleHighIntent(productId)`
• `addToCart(productId)`
• `removeFromCart(productId)`
• `simulatePriceDrop()` (Triggers ≥10% price movement up/down on high-intent wishlist items)
• `movePriceDropItemToCart()`
• `notifyAboutPriceDropLater()`

Deliverable: All pages share state for products, high-intent wishlists, price movements, and cart.


# Phase 6: Add pre-populated wishlist items

Start the demo with 3–4 high-intent products pre-populated in the wishlist with price baselines:

```typescript
const initialWishlist: WishlistItem[] = [
  {
    productId: 1,
    priceWhenWishlisted: 1599,
    wishlistedAt: "2026-08-30T10:00:00Z",
    notifyLater: false,
    isHighIntent: true
  },
  {
    productId: 3,
    priceWhenWishlisted: 1899,
    wishlistedAt: "2026-08-31T14:30:00Z",
    notifyLater: false,
    isHighIntent: true
  },
  {
    productId: 6,
    priceWhenWishlisted: 1299,
    wishlistedAt: "2026-09-01T09:15:00Z",
    notifyLater: false,
    isHighIntent: false
  }
];
```

When a new item is wishlisted, record its baseline price and mark high intent status.

Deliverable: Wishlist opens pre-populated with baseline prices for high-intent tracking.


# Phase 7: Build the wishlist page

Display each wishlisted product with:
• Image, Brand & Product Name  
• High-Intent Tag  
• Current price vs Price when wishlisted  
• Urgency & Social Proof stats (recently sold count & recent reviews)  
• Date added  
• Add-to-cart action  
• Remove-from-wishlist action  

Visual styling for price changes (≥10% movement):
• **Price Drop (≥10% lower)**: Green highlight, strike-through baseline price, "Price Dropped by X%" tag.  
• **Price Increase (≥10% higher)**: Red/Orange highlight, strike-through baseline price, "Price Increased by X%" tag.  

Deliverable: Wishlist displays price changes (≥10% threshold) alongside social proof indicators.


# Phase 8: Add the global "Simulate Price Drop" button

Place a floating fixed button accessible from catalogue, wishlist, and cart pages:

`Simulate Price Drop` (Simulate Price Movement)

The simulation engine will:
1. Identify high-intent items in the wishlist (fallback to any wishlist item if none marked high-intent).
2. Select one item randomly.
3. Generate a price movement of **at least 10%** (either a price drop between 10% and 35%, or a price rise between 10% and 25%).
4. Update the product's current price in application state.
5. Trigger the **Price Movement / Drop Notification Modal**.

Calculation Logic:
```typescript
// Minimum 10% change required
const isDrop = Math.random() > 0.3; // 70% chance drop, 30% chance rise
const discountPercentage = isDrop
  ? Math.floor(Math.random() * 26) + 10  // 10% to 35% drop
  : Math.floor(Math.random() * 16) + 10; // 10% to 25% rise

const percentageChange = isDrop ? -discountPercentage : discountPercentage;
const newPrice = Math.round(
  selectedItem.priceWhenWishlisted * (1 + percentageChange / 100)
);
```

If the wishlist is empty, show a toast alert:  
*"Add at least one high-intent product to your wishlist to simulate price movements."*

Deliverable: Floating simulation button triggers notification for ≥10% price movements.


# Phase 9: Create the price-drop & price-movement notification modal

When "Simulate Price Drop" is pressed and a ≥10% price change occurs, display a high-urgency modal:

### Modal Layout & Content:

1. **Header Banner**:  
   • *"Price Drop Alert!"* (or *"Price Alert - High Intent Item!"*)  
   • Displays price movement badge: `-19% DROP` or `+12% RISE` (Always ≥10%)  

2. **Product & Price Details**:  
   • Product image, Brand, and Name  
   • Wishlisted baseline price: `₹1,599`  
   • New price: `₹1,299`  
   • Savings / Change: `You save ₹300 (19% off)`  

3. **Urgency & Social Proof Section**:  
   • **Recently Sold Count**: *"🔥 342 items bought in the last 24 hours"*  
   • **Recent Reviews**: *"⭐ 4.8/5 rating based on 128 recent reviews"*  
   • **Stock / Urgency Tag**: *"⚡ High Demand - Selling fast!"*  

4. **Three Main Action Buttons**:  

   • **1. Move to cart**:  
     - Adds product to cart locked at the new price (`priceAddedAt`).  
     - Removes item from wishlist.  
     - Closes modal & navigates/notifies user.  

   • **2. Notify later**:  
     - Keeps item in wishlist with `notifyLater: true`.  
     - Preserves the new price.  
     - Closes modal and shows toast: *"We’ll notify you when another price movement occurs."*  

   • **3. Remove from wishlist**:  
     - Removes item from wishlist.  
     - Clears active price drop event.  
     - Closes modal.  

Deliverable: Interactive modal displaying price movement (≥10%), social proof (recent reviews & sold count), and the 3 core user actions.


# Phase 10: Build the shopping cart

Display cart items with:
• Image, Brand, Name  
• Purchase price (locked at `priceAddedAt`)  
• Quantity selector  
• Subtotal & Total calculations  
• Remove item option  

Items added via the Price Drop Modal maintain their reduced/changed price.

Deliverable: Cart correctly handles standard items and price-dropped items without price fluctuations.


# Phase 11: Add local persistence

Persist state in `localStorage`:
• `myntra-demo-wishlist` (wishlist items, baseline prices, high-intent flags)  
• `myntra-demo-cart`  
• `myntra-demo-product-prices`  
• `myntra-demo-notifications`  

Include a "Reset Demo State" button to reload defaults.

Deliverable: App state persists across browser reloads.


# Phase 12: Handle edge cases

Test conditions:
• Price movement is strictly at least 10% (up or down).  
• Wishlist empty when simulation is clicked.  
• Wishlist has no high-intent items (falls back to any wishlist item).  
• Item added to cart from modal keeps locked price.  
• Social proof counters display dynamic, believable metrics.  
• Selecting "Notify Later" persists preference without duplicate modals.  

Rules:
• Minimum 10% price shift enforced for notifications.  
• Social proof metadata always visible on high-intent item alerts.  
• Only one price movement modal active at a time.  


# Phase 13: Test the main user journeys

**Journey 1: High-Intent Price Drop → Move to Cart**  
Catalogue/Wishlist → High-Intent item price drops ≥10% → Review social proof (recent reviews & sold count) → Click "Move to Cart" → Verify cart has locked reduced price.

**Journey 2: Price Movement → Notify Later**  
Simulate price change → Modal shows ≥10% movement & urgency metrics → Click "Notify Later" → Item remains in wishlist with reminder status active.

**Journey 3: Price Movement → Remove from Wishlist**  
Simulate price change → Review product & social proof → Click "Remove from Wishlist" → Verify item removed from wishlist and active modal closed.

Deliverable: All price movement notifications, social proof displays, and 3 modal actions function reliably.
