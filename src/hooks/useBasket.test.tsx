import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useBasketActions, useBasketSelector } from "@hooks/useBasket";

import { Basket } from "@features/basket/Basket";
import { BasketContext } from "@context/BasketContext";
import React from "react";

type MockBasket = Pick<
  Basket,
  "subscribe" | "total" | "add" | "remove" | "getCatalogue"
> & {
  notify: () => void;
};

const createMockBasket = (): MockBasket => {
  let listeners: Array<() => void> = [];
  return {
    subscribe: vi.fn((l: () => void) => {
      listeners.push(l);
      return () => {
        listeners = listeners.filter((item) => item !== l);
      };
    }),
    notify: () => listeners.forEach((l) => l()),
    total: vi.fn(() => ({
      totalCost: 100,
      subtotalCost: 100,
      discount: 0,
      deliveryCost: 0,
    })),
    add: vi.fn(),
    remove: vi.fn(),
    getCatalogue: vi.fn(() => []),
  };
};

describe("Basket Hooks", () => {
  let mockBasket: MockBasket;
  let wrapper: React.FC<{ children: React.ReactNode }>;

  beforeEach(() => {
    mockBasket = createMockBasket();
    wrapper = ({ children }) => (
      <BasketContext.Provider value={mockBasket as unknown as Basket}>
        {children}
      </BasketContext.Provider>
    );
  });

  describe("useBasketSelector", () => {
    it("should return the selected value", () => {
      const { result } = renderHook(
        () => useBasketSelector((b) => b.total().totalCost),
        { wrapper }
      );

      expect(result.current).toBe(100);
    });

    it("should update when the selected value changes", () => {
      const { result } = renderHook(
        () => useBasketSelector((b) => b.total().totalCost),
        { wrapper }
      );

      mockBasket.total.mockReturnValue({ totalCost: 150 });

      act(() => {
        mockBasket.notify();
      });

      expect(result.current).toBe(150);
    });

    it("should NOT trigger a re-render if the selected value remains the same", () => {
      let renderCount = 0;
      renderHook(
        () => {
          renderCount++;
          return useBasketSelector((b) => b.total().totalCost);
        },
        { wrapper }
      );

      expect(renderCount).toBe(1);

      act(() => {
        mockBasket.notify();
      });

      expect(renderCount).toBe(1);
    });

    it("should throw error if used outside of Provider", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      expect(() => renderHook(() => useBasketSelector((b) => b))).toThrow(
        "useBasket must be used within BasketProvider"
      );

      consoleSpy.mockRestore();
    });
  });

  describe("useBasketActions", () => {
    it("should return the basket instance without subscribing", () => {
      const { result } = renderHook(() => useBasketActions(), { wrapper });

      expect(result.current).toBe(mockBasket);

      expect(mockBasket.subscribe).not.toHaveBeenCalled();
    });
  });
});
