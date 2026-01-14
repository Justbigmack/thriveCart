# Acme Widget Co - Shopping Cart System

A proof-of-concept shopping cart system built for Acme Widget Co's technical assessment.

## Features

- ✅ Product catalogue display with add-to-cart functionality
- ✅ Shopping cart with quantity management (+/- controls)
- ✅ Dynamic pricing with special offers
- ✅ Tiered delivery cost calculation
- ✅ Real-time order summary with breakdown
- ✅ Clean, modern UI using React, TypeScript, and Tailwind CSS

## Tech Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript (strict mode)
- **Build Tool**: Vite
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The application will be available at `http://localhost:5173`

## Architecture

### Two-Layer Design

The implementation uses a two-layer architecture that separates business logic from UI state management:

#### Layer 1: Basket Class (`src/lib/Basket.ts`)

A pure TypeScript class that implements the assignment's required interface:

```typescript
// Initialize with products, delivery rules, and offers
const basket = new Basket(products, deliveryRules, offers);

// Add products
basket.add('R01');
basket.add('G01');

// Get total
console.log(basket.total()); // Returns final cost with offers and delivery
```

**Required Methods:**
- `add(productCode)` - Adds a product to the basket
- `total()` - Returns the total cost including offers and delivery

**Additional Methods for UI:**
- `remove(productCode)` - Removes one instance of a product
- `clear(productCode)` - Removes all instances of a product
- `getItems()` - Returns cart items with product details
- `getOrderBreakdown()` - Returns detailed pricing breakdown

#### Layer 2: Zustand Store (`src/stores/cartStore.ts`)

Wraps the Basket class to provide reactive state management for React components:

```typescript
const { add, remove, getOrderBreakdown } = useCartStore();
```

The store delegates all operations to the Basket instance and triggers React re-renders when the basket changes.

### Offer System Design

The offer system uses the **Strategy Pattern with factory functions**, providing flexibility and extensibility:

```typescript
// Define an offer factory
export const buyOneGetSecondHalfPrice = (productCode: string): OfferFunction => {
  return (items, products) => {
    // Calculate savings and return OfferResult
  };
};

// Configure active offers
export const activeOffers: OfferFunction[] = [
  buyOneGetSecondHalfPrice('R01'),
  // Easy to add more offers:
  // buyXGetYFree('G01', 'B01', 2, 1),
  // percentOffTotal(100, 10),
];
```

**Available Offer Types:**
1. `buyOneGetSecondHalfPrice(productCode)` - Every pair gets one at half price
2. `buyXGetYFree(buyProduct, freeProduct, buyQty, freeQty)` - Buy X, get Y free
3. `percentOffTotal(minAmount, percent)` - Percentage discount on cart total

Adding new offers requires no changes to the Basket class—just create a new factory function and add it to `activeOffers`.

## Products

| Code | Name | Price |
|------|------|-------|
| R01 | Red Widget | $32.95 |
| G01 | Green Widget | $24.95 |
| B01 | Blue Widget | $7.95 |

## Delivery Rules

| Order Value | Delivery Cost |
|-------------|---------------|
| Under $50 | $4.95 |
| $50 - $89.99 | $2.95 |
| $90+ | Free |

## Special Offers

Currently active offer:
- **Buy one red widget, get the second half price**
  - Applies to every pair of red widgets
  - 2 red widgets: 1 full price + 1 half price
  - 3 red widgets: 2 full price + 1 half price

## Test Cases Verification

All test cases from the assignment have been verified:

| Products | Subtotal | Savings | Delivery | Total | Status |
|----------|----------|---------|----------|-------|--------|
| B01, G01 | $32.90 | $0.00 | $4.95 | $37.85 | ✅ PASS |
| R01, R01 | $65.90 | $16.47 | $4.95 | $54.37 | ✅ PASS |
| R01, G01 | $57.90 | $0.00 | $2.95 | $60.85 | ✅ PASS |
| B01, B01, R01, R01, R01 | $114.75 | $16.47 | $0.00 | $98.27 | ✅ PASS |

Run the automated test suite:

```bash
npx tsx test-cases.ts
```

## Project Structure

```
src/
├── lib/
│   ├── Basket.ts              # Core basket logic (meets assignment interface)
│   └── utils.ts               # Utility functions
├── stores/
│   └── cartStore.ts           # Zustand store wrapping Basket
├── types/
│   └── index.ts               # TypeScript interfaces
├── data/
│   └── products.ts            # Product catalogue and delivery rules
├── offers/
│   ├── types.ts               # Offer system types
│   ├── buyOneGetSecondHalfPrice.ts
│   ├── buyXGetYFree.ts
│   ├── percentOffTotal.ts
│   └── index.ts               # Active offers configuration
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── ProductGrid.tsx        # Product selection
│   ├── CartItem.tsx           # Individual cart item
│   ├── CartList.tsx           # Cart container
│   └── OrderSummary.tsx       # Price breakdown
├── App.tsx                    # Main application
├── main.tsx                   # Entry point
└── index.css                  # Global styles
```

## Key Implementation Decisions

### 1. Basket Class vs. Store-Only Approach

**Decision**: Implement a separate Basket class wrapped by Zustand store

**Rationale**:
- Meets the assignment's explicit interface requirement: "It is initialised with the product catalogue, delivery charge rules, and offers"
- Separates business logic from UI state management
- Makes business logic independently testable without React
- Basket class can be used in Node.js, tests, or other contexts
- Zustand provides reactive UI updates

### 2. Zustand for State Management

**Decision**: Use Zustand instead of useState/Context or other alternatives

**Rationale**:
- Lightweight (1KB) and minimal boilerplate
- No Provider wrapper needed
- Excellent TypeScript support
- Perfect balance for this application's scale
- Easier to test than Context-based solutions

### 3. Strategy Pattern for Offers

**Decision**: Factory functions that return offer calculators

**Rationale**:
- Demonstrates extensibility without over-engineering
- Easy to add new offer types without modifying existing code
- Functional programming approach aligns with React patterns
- Each offer is a pure function, making testing straightforward
- Shows good software design principles for an interview

### 4. shadcn/ui Component Library

**Decision**: Use shadcn/ui instead of a traditional component library

**Rationale**:
- Components are copied into the project (full control)
- Built on Radix UI primitives (accessibility built-in)
- Tailwind CSS integration (consistent styling)
- Modern, clean aesthetic
- Demonstrates familiarity with contemporary React tooling

## Assumptions

1. **Offer Calculation**: The "buy one get second half price" offer applies to pairs of red widgets. With 3 red widgets, you get 2 at full price and 1 at half price.

2. **Delivery Calculation**: Delivery cost is based on the subtotal AFTER applying special offers.

3. **Rounding**: Prices are truncated (rounded down) to 2 decimal places using `Math.floor` to ensure consistency with expected test results.

4. **Multiple Offers**: If multiple offers were active, they would all apply cumulatively (savings are additive).

5. **Product Images**: Colored placeholders are used instead of actual product images.

6. **No Persistence**: Cart state resets on page refresh (no localStorage implementation).

7. **Single Page**: No routing or navigation; this is a single-page proof of concept.

## Future Enhancements

Potential improvements for a production system:

- **Persistence**: LocalStorage or database integration
- **User Authentication**: Link carts to user accounts
- **Multiple Offers**: Priority system for offer conflicts
- **Analytics**: Track cart abandonment, popular products
- **Inventory Management**: Stock tracking and availability
- **Payment Integration**: Checkout flow with payment processing
- **Admin Interface**: Manage products, offers, and delivery rules
- **Testing**: Unit tests, integration tests, E2E tests
- **Accessibility**: Enhanced ARIA labels and keyboard navigation

## License

This project was created for a technical assessment and is not licensed for public use.

## Contact

For questions or feedback, please contact the repository owner.
