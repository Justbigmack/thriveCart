import { CartItem, DeliveryRule, Offer, Product } from "@/types/basket";

import { truncateToCents } from "@/lib/basket";

export class Basket {
  private catalogue: Product[] = [];
  private deliveryRules: DeliveryRule[];
  private offers: Offer[];
  private items: Product[] = [];
  private listeners: Array<() => void> = [];
  private static STORAGE_KEY = "basket-items";

  constructor(deliveryRules: DeliveryRule[], offers: Offer[]) {
    this.deliveryRules = [...deliveryRules].sort(
      (a, b) => b.threshold - a.threshold
    );
    this.offers = offers;
  }

  public setupCatalogue = (products: Product[]) => {
    this.catalogue = products;
    this.notify();
  };

  private notify = () => {
    this.listeners.forEach((listener) => listener());
  };

  public subscribe = (listener: () => void) => {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  };

  public getCatalogue = () => this.catalogue;

  public getApplicableOffers = () => {
    return this.offers.filter(
      (offer) => offer.calculateDiscount(this.items) > 0
    );
  };

  public getItems = (): CartItem[] => {
    const grouped = new Map<string, CartItem>();

    this.items.forEach((product) => {
      const existing = grouped.get(product.code);
      if (existing) {
        existing.quantity++;
      } else {
        grouped.set(product.code, { product, quantity: 1 });
      }
    });

    return Array.from(grouped.values());
  };

  public add = (productCode: string): void => {
    const product = this.catalogue.find((p) => p.code === productCode);
    if (product) {
      this.items = [...this.items, { ...product }];
      this.saveToStorage();
      this.notify();
    }
  };

  public remove = (productCode: string, count?: number): void => {
    if (count === undefined) {
      this.items = this.items.filter((item) => item.code !== productCode);
    } else {
      let removedCount = 0;
      this.items = this.items.filter((item) => {
        if (item.code === productCode && removedCount < count) {
          removedCount++;
          return false;
        }
        return true;
      });
    }
    this.saveToStorage();
    this.notify();
  };

  private saveToStorage = (): void => {
    const codes = this.items.map((item) => item.code);
    localStorage.setItem(Basket.STORAGE_KEY, JSON.stringify(codes));
  };

  public loadFromStorage = (): void => {
    const stored = localStorage.getItem(Basket.STORAGE_KEY);
    if (!stored) return;
    try {
      const codes: string[] = JSON.parse(stored);
      codes.forEach((code) => {
        const product = this.catalogue.find((p) => p.code === code);
        if (product) {
          this.items.push({ ...product });
        }
      });
      this.notify();
    } catch {
      // Invalid storage data, ignore
    }
  };

  // Calculates the total with truncation to 2 decimal places (for example, 54.375 -> 54.37)
  public total = () => {
    if (this.items.length === 0) {
      return { subtotalCost: 0, discount: 0, deliveryCost: 0, totalCost: 0 };
    }

    const subtotal = this.items.reduce((sum, item) => sum + item.price, 0);
    const totalDiscount = this.offers.reduce(
      (sum, offer) => offer.calculateDiscount(this.items) + sum,
      0
    );

    const discountedSubtotal = subtotal - totalDiscount;
    const deliveryCost =
      this.deliveryRules.find((r) => discountedSubtotal >= r.threshold)?.cost ??
      0;

    const rawTotal = discountedSubtotal + deliveryCost;

    const subtotalCost = truncateToCents(subtotal);
    const totalCost = truncateToCents(rawTotal);
    // This is displayed discount to avoid visual inconsistencies
    const discount = truncateToCents(subtotalCost - totalCost + deliveryCost);

    return {
      subtotalCost,
      discount,
      deliveryCost,
      totalCost,
    };
  };
}
