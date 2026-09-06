# Phase 1: Define the MVP

Browse catalogue → Add/Mark high-intent product to wishlist → Simulate price drop (using the single global floating simulation button) → Receive notification for a personalised time-bound discount (strictly 10% to 20% drop on high-intent wishlisted items only; no price increases) → Review price change with social proof (countdown timer & recently sold count; urgency alert & reviews excluded from pop-up notification) → Take action: Move to cart, notify later, or remove from wishlist.

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
│   ├── PriceDropModal.tsx        // Personalised Time-Bound Discount Modal (No reviews or urgency alert)
│   ├── SocialProofBadge.tsx
│   └── SimulatePriceDropButton.tsx // Single global floating simulation button
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
  recentReviewsCount: number;  // e.g. 128 recent reviews (displayed in catalogue, excluded from pop-up notification)
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
• Discount percentage (Personalised time-bound discount badge when active)  
• Social proof indicators (e.g. "🔥 300+ bought recently", "⭐ 4.8 (120+ reviews)" in catalogue)  
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

type PriceMovementType = 'DROP';

type PriceDropEvent = {
  productId: number;
  oldPrice: number;
  newPrice: number;
  percentageChange: number; // Strictly between 10% and 20% drop
  movementType: PriceMovementType;
  triggeredAt: string;
  expiresAt: string; // Expiration timestamp for personalised time-bound discount (e.g. 15 minutes)
  isPersonalised: boolean; // Flag for personalised time-bound discount
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
• `simulatePriceDrop()` (Triggers 10% to 20% personalised time-bound discount with countdown timer ONLY on high-intent wishlist items)
• `movePriceDropItemToCart()` (Locks the personalised discount price in cart)
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
    isHighIntent: true // High intent item #1
  },
  {
    productId: 3,
    priceWhenWishlisted: 1899,
    wishlistedAt: "2026-08-31T14:30:00Z",
    notifyLater: false,
    isHighIntent: true // High intent item #2
  },
  {
    productId: 6,
    priceWhenWishlisted: 1299,
    wishlistedAt: "2026-09-01T09:15:00Z",
    notifyLater: false,
    isHighIntent: false // Normal wishlist item
  },
  {
    productId: 8,
    priceWhenWishlisted: 2499,
    wishlistedAt: "2026-09-02T11:20:00Z",
    notifyLater: false,
    isHighIntent: false // Normal wishlist item
  }
];
```

When a new item is wishlisted, record its baseline price and mark high intent status.

Deliverable: Wishlist opens pre-populated with baseline prices for high-intent tracking.


# Phase 7: Build the wishlist page

Display each wishlisted product with:
• Image, Brand & Product Name  
• High-Intent Tag (shown on 1 or 2 items)  
• Current price vs Price when wishlisted  
• Social proof stats (recently sold count & countdown timer; reviews excluded from pop-up notification)  
• Date added  
• Add-to-cart action  
• Remove-from-wishlist action  

Visual styling for price changes (10% to 20% drop):
• **Personalised Price Drop (10% - 20% lower)**: Green highlight, strike-through baseline price, "Personalised Offer: X% OFF (Expires in 15m)" tag. (No price increases displayed).  

Deliverable: Wishlist displays price drops (10% to 20% range) on high-intent items alongside social proof indicators.


# Phase 8: Add the single global "Simulate Price Drop" button

Place a single floating fixed button accessible from all pages:

`Simulate Price Drop` (Global Floating Button)

The simulation engine will:
1. Filter wishlist items strictly for **High-Intent items** (`isHighIntent: true`).
2. Select one High-Intent item randomly. (If no High-Intent items exist in wishlist, alert the user to mark an item as High-Intent).
3. Generate a personalised time-bound price drop **strictly between 10% and 20%** (no price rises/increases).
4. Update the product's current price and 15-minute discount expiration timestamp in application state.
5. Trigger the **Personalised Time-Bound Discount Notification Modal**.

Calculation Logic:
```typescript
// Always a price drop strictly between 10% and 20%
const discountPercentage = Math.floor(Math.random() * 11) + 10; // 10% to 20%
const percentageChange = -discountPercentage;
const newPrice = Math.round(
  selectedItem.priceWhenWishlisted * (1 - discountPercentage / 100)
);
```

If no high-intent item is in the wishlist, show a toast alert:  
*"Mark at least one wishlisted product as High Intent (🔥) to simulate a personalised discount."*

Deliverable: Single floating simulation button triggers personalised 10-20% discount notifications exclusively for high-intent items.


# Phase 9: Create the personalised time-bound discount notification modal

When the global "Simulate Price Drop" button is pressed, display a modal featuring a personalised time-bound discount (strictly 10-20% drop) on a high-intent item:

### Modal Layout & Content:

1. **Header Banner**:  
   • *"Personalised Time-Bound Discount Alert!"*  
   • Displays price drop badge & timer: `-15% DROP • Valid for 15:00 mins` (Always 10% to 20% drop)  

2. **Product & Price Details**:  
   • Product image, Brand, and Name  
   • Wishlisted baseline price: `₹1,599`  
   • Personalised discounted price: `₹1,359`  
   • Savings: `Personalised Offer: You save ₹240 (15% off)`  

3. **Urgency & Social Proof Section**:  
   • **Countdown Timer**: *"⏳ Exclusive Discount Expires in: 14:59 mins"*  
   • **Recently Sold Count**: *"🔥 342 items bought in the last 24 hours"*  
   *(Note: Reviews and Urgency stock alert ("Only X left") are explicitly excluded from this pop-up notification modal)*  

4. **Three Main Action Buttons**:  

   • **1. Move to cart**:  
     - Adds product to cart locked at the personalised discounted price (`priceAddedAt`).  
     - Removes item from wishlist.  
     - Closes modal & navigates/notifies user.  

   • **2. Notify later**:  
     - Keeps item in wishlist with `notifyLater: true`.  
     - Preserves the personalised time-bound price.  
     - Closes modal and shows toast: *"We’ll notify you when another personalised discount occurs."*  

   • **3. Remove from wishlist**:  
     - Removes item from wishlist.  
     - Clears active price drop event.  
     - Closes modal.  

Deliverable: Interactive modal displaying personalised 10-20% time-bound discount, live countdown timer, recently sold count (reviews & urgency stock alert removed from pop-up notification), and 3 core user actions.


# Phase 10: Build the shopping cart

Display cart items with:
• Image, Brand, Name  
• Purchase price (locked at `priceAddedAt`)  
• Quantity selector  
• Subtotal & Total calculations  
• Remove item option  

Items added via the Personalised Discount Modal maintain their reduced/changed price.

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
• Price movement is strictly a drop between 10% and 20% (no price increases).  
• Personalised discount applies exclusively to high-intent wishlist items.  
• Wishlist has no high-intent items (triggers prompt to mark an item as High-Intent).  
• Only 1 simulate price drop button exists in the frontend (floating button).  
• Urgency stock alert and reviews are excluded from the pop-up notification.  
• Item added to cart from modal keeps locked discounted price.  
• Selecting "Notify Later" persists preference without duplicate modals.  

Rules:
• Strictly 10% to 20% price drop range enforced.  
• Personalised time-bound discount countdown timer and sold count visible on high-intent item alerts; reviews and urgency stock alert excluded from pop-up notifications.  
• Only one global floating simulation button in frontend.  
• Only one active price drop modal at a time.  


# Phase 13: Test the main user journeys

**Journey 1: High-Intent Personalised Time-Bound Discount → Move to Cart**  
Catalogue/Wishlist → Click global floating simulation button → High-Intent item gets personalised discount (10-20% drop) with time limit → Review countdown timer & sold count (no urgency alert or reviews in notification) → Click "Move to Cart" → Verify cart has locked reduced price.

**Journey 2: Personalised Discount → Notify Later**  
Simulate price drop → Modal shows personalised 10-20% discount & countdown timer → Click "Notify Later" → Item remains in wishlist with reminder status active.

**Journey 3: Personalised Discount → Remove from Wishlist**  
Simulate price drop → Review product & time-bound offer → Click "Remove from Wishlist" → Verify item removed from wishlist and active modal closed.

Deliverable: All personalised time-bound discount notifications, timer elements, social proof displays (without reviews or urgency alert in pop-up), single simulation button, and 3 modal actions function reliably.
