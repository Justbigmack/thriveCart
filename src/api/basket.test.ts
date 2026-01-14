import { beforeEach, describe, expect, it } from "vitest";
import {
  mockedDeliveryRules,
  mockedOffers,
  mockedProducts,
} from "@/api/basket";

import { Basket } from "@/features/basket/Basket";

describe("Basket Business Logic", () => {
  let basket: Basket;

  beforeEach(() => {
    basket = new Basket(mockedDeliveryRules, mockedOffers);
    basket.setupCatalogue(mockedProducts);
  });

  describe("Requirements Baseline Tests", () => {
    it("should calculate $37.85 for products B01, G01", () => {
      basket.add("B01");
      basket.add("G01");
      const totals = basket.total();

      expect(totals.totalCost).toBe(37.85);
    });

    it("should calculate $54.37 for products R01, R01", () => {
      basket.add("R01");
      basket.add("R01");
      const totals = basket.total();

      expect(totals.totalCost).toBe(54.37);
    });

    it("should calculate $60.85 for products R01, G01", () => {
      basket.add("R01");
      basket.add("G01");
      const totals = basket.total();

      expect(totals.totalCost).toBe(60.85);
    });

    it("should calculate $98.27 for products B01, B01, R01, R01, R01", () => {
      basket.add("B01");
      basket.add("B01");
      basket.add("R01");
      basket.add("R01");
      basket.add("R01");
      const totals = basket.total();

      expect(totals.totalCost).toBe(98.27);
    });
  });

  describe("Delivery Rule Transitions", () => {
    it("should apply $4.95 delivery for orders under $50", () => {
      basket.add("B01");
      expect(basket.total().deliveryCost).toBe(4.95);
    });

    it("should apply $2.95 delivery for orders between $50 and $90", () => {
      basket.add("R01");
      basket.add("G01");
      expect(basket.total().deliveryCost).toBe(2.95);
    });

    it("should apply free delivery for orders of $90 or more", () => {
      basket.add("R01");
      basket.add("R01");
      basket.add("R01");
      basket.add("B01");
      basket.add("B01");
      expect(basket.total().deliveryCost).toBe(0);
    });
  });

  describe("Offer Logic", () => {
    it("should not apply discount for a single Red Widget", () => {
      basket.add("R01");
      expect(basket.total().discount).toBe(0);
    });

    it("should apply half price to exactly one item when three are purchased", () => {
      basket.add("R01");
      basket.add("R01");
      basket.add("R01");
      expect(basket.total().discount).toBe(16.47);
    });
  });

  describe("Basket Management", () => {
    it("should correctly group items by code", () => {
      basket.add("R01");
      basket.add("R01");
      basket.add("B01");

      const items = basket.getItems();
      expect(items.length).toBe(2);

      const redGroup = items.find((i) => i.product.code === "R01");
      expect(redGroup?.quantity).toBe(2);
    });

    it("should remove all items of a code when count is not provided", () => {
      basket.add("R01");
      basket.add("R01");
      basket.add("G01");

      basket.remove("R01");
      expect(basket.getItems().length).toBe(1);
      expect(basket.getItems()[0].product.code).toBe("G01");
    });

    it("should decrement quantity by one when count is 1", () => {
      basket.add("R01");
      basket.add("R01");

      basket.remove("R01", 1);
      const items = basket.getItems();
      expect(items[0].quantity).toBe(1);
    });
  });
});
