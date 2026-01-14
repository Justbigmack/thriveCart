import { CartItem, DeliveryRule, Offer, Product } from "@/types/basket";

export class Basket {
  private catalogue: Product[] = [];
  private deliveryRules: DeliveryRule[];
  private offers: Offer[];
  private items: Product[] = [];
  private listeners: Array<() => void> = [];

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
    this.notify();
  };

  // Calculates the total with truncation to 2 decimal places (for example, 54.375 -> 54.37)
  public total = () => {
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

    const totalCost = Math.floor(rawTotal * 100 + 0.00000001) / 100;
    const finalDiscount = Math.floor(totalDiscount * 100 + 0.00000001) / 100;
    const finalSubtotal = Math.floor(subtotal * 100 + 0.00000001) / 100;

    return {
      subtotalCost: finalSubtotal,
      discount: finalDiscount,
      deliveryCost: deliveryCost,
      totalCost,
    };
  };
}
