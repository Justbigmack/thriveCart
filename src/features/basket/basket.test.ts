import { DeliveryRule, Offer, Product } from "@/types/basket";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Basket } from "./Basket";

const mockProductsCatalogue: Product[] = [
  { code: "R01", name: "Red Widget", price: 32.95 },
  { code: "G01", name: "Green Widget", price: 24.95 },
  { code: "B01", name: "Blue Widget", price: 7.95 },
];

const mockDeliveryRules: DeliveryRule[] = [
  { threshold: 90, cost: 0 },
  { threshold: 50, cost: 2.95 },
  { threshold: 0, cost: 4.95 },
];

const mockRWidgetHalfPriceOffer: Offer = {
  id: "red-widget-half-price",
  productCode: "R01",
  calculateDiscount: (basketItems: Product[]) => {
    const redWidgetItems = basketItems.filter((item) => item.code === "R01");
    const pairCount = Math.floor(redWidgetItems.length / 2);
    return pairCount * (32.95 / 2);
  },
};

describe("Basket Class", () => {
  let shoppingBasket: Basket;

  beforeEach(() => {
    shoppingBasket = new Basket(mockDeliveryRules, [mockRWidgetHalfPriceOffer]);
    shoppingBasket.setupCatalogue(mockProductsCatalogue);
  });

  describe("Catalogue and Items Management", () => {
    it("should initialize with an empty item list", () => {
      expect(shoppingBasket.getItems()).toHaveLength(0);
    });

    it("should add products by code and group them in getItems", () => {
      shoppingBasket.add("R01");
      shoppingBasket.add("R01");
      shoppingBasket.add("G01");

      const itemsInBasket = shoppingBasket.getItems();
      const redWidgetEntry = itemsInBasket.find(
        (item) => item.product.code === "R01"
      );

      expect(itemsInBasket).toHaveLength(2);
      expect(redWidgetEntry?.quantity).toBe(2);
    });

    it("should remove all instances of a product when no count is provided", () => {
      shoppingBasket.add("R01");
      shoppingBasket.add("R01");
      shoppingBasket.remove("R01");
      expect(shoppingBasket.getItems()).toHaveLength(0);
    });

    it("should remove a specific quantity of a product", () => {
      shoppingBasket.add("R01");
      shoppingBasket.add("R01");
      shoppingBasket.add("R01");
      shoppingBasket.remove("R01", 1);

      const itemsInBasket = shoppingBasket.getItems();
      const redWidgetEntry = itemsInBasket.find(
        (item) => item.product.code === "R01"
      );

      expect(redWidgetEntry?.quantity).toBe(2);
    });
  });

  describe("Subscription System", () => {
    it("should notify listeners when catalogue is setup", () => {
      const listenerCallback = vi.fn();
      shoppingBasket.subscribe(listenerCallback);
      shoppingBasket.setupCatalogue(mockProductsCatalogue);
      expect(listenerCallback).toHaveBeenCalled();
    });

    it("should notify listeners when items are added or removed", () => {
      const listenerCallback = vi.fn();
      shoppingBasket.subscribe(listenerCallback);

      shoppingBasket.add("R01");
      expect(listenerCallback).toHaveBeenCalledTimes(1);

      shoppingBasket.remove("R01");
      expect(listenerCallback).toHaveBeenCalledTimes(2);
    });

    it("should unsubscribe correctly", () => {
      const listenerCallback = vi.fn();
      const unsubscribeFunction = shoppingBasket.subscribe(listenerCallback);
      unsubscribeFunction();

      shoppingBasket.add("R01");
      expect(listenerCallback).not.toHaveBeenCalled();
    });
  });

  describe("Total Calculations", () => {
    it("should apply delivery costs based on thresholds", () => {
      shoppingBasket.add("B01");
      const calculatedTotals = shoppingBasket.total();
      expect(calculatedTotals.deliveryCost).toBe(4.95);
      expect(calculatedTotals.totalCost).toBe(12.9);
    });

    it("should apply offers and determine delivery cost based on discounted subtotal", () => {
      shoppingBasket.add("R01");
      shoppingBasket.add("R01");

      const calculatedTotals = shoppingBasket.total();
      expect(calculatedTotals.deliveryCost).toBe(4.95);
    });

    it("should truncate values to two decimal places using floor rounding", () => {
      const customDeliveryRules: DeliveryRule[] = [{ threshold: 0, cost: 0 }];
      const truncationTestBasket = new Basket(customDeliveryRules, []);
      truncationTestBasket.setupCatalogue([
        { code: "T01", name: "Test Item", price: 54.375 },
      ]);
      truncationTestBasket.add("T01");

      const { totalCost } = truncationTestBasket.total();
      expect(totalCost).toBe(54.37);
    });

    it("should apply free shipping when the threshold is met", () => {
      shoppingBasket.add("R01");
      shoppingBasket.add("R01");
      shoppingBasket.add("R01");
      shoppingBasket.add("R01");

      const calculatedTotals = shoppingBasket.total();
      expect(calculatedTotals.deliveryCost).toBe(0);
    });
  });
});
