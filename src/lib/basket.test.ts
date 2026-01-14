import { describe, expect, it } from "vitest";

import { truncateToCents } from "./basket";

describe("truncateToCents", () => {
  it("should return whole numbers unchanged", () => {
    expect(truncateToCents(10)).toBe(10);
    expect(truncateToCents(0)).toBe(0);
    expect(truncateToCents(100)).toBe(100);
  });

  it("should keep two decimal places", () => {
    expect(truncateToCents(10.99)).toBe(10.99);
    expect(truncateToCents(5.01)).toBe(5.01);
  });

  it("should truncate (not round) to two decimal places", () => {
    expect(truncateToCents(54.375)).toBe(54.37);
    expect(truncateToCents(54.379)).toBe(54.37);
    expect(truncateToCents(10.999)).toBe(10.99);
  });

  it("should handle floating point precision issues", () => {
    // Epsilon prevents 98.26999... from becoming 98.26
    expect(truncateToCents(98.2699999999999)).toBe(98.27);
    expect(truncateToCents(16.4699999999999)).toBe(16.47);
  });

  it("should handle values that end in exactly .XX5", () => {
    expect(truncateToCents(16.475)).toBe(16.47);
    expect(truncateToCents(32.955)).toBe(32.95);
  });

  it("should handle small values", () => {
    expect(truncateToCents(0.001)).toBe(0);
    expect(truncateToCents(0.01)).toBe(0.01);
    expect(truncateToCents(0.99)).toBe(0.99);
  });
});
