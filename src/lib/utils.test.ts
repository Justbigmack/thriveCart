import { describe, expect, it } from "vitest";

import { shallowEqual } from "./utils";

describe("shallowEqual", () => {
  describe("primitive values", () => {
    it("should return true for identical primitives", () => {
      expect(shallowEqual(1, 1)).toBe(true);
      expect(shallowEqual("hello", "hello")).toBe(true);
      expect(shallowEqual(true, true)).toBe(true);
    });

    it("should return false for different primitives", () => {
      expect(shallowEqual(1, 2)).toBe(false);
      expect(shallowEqual("hello", "world")).toBe(false);
      expect(shallowEqual(true, false)).toBe(false);
    });
  });

  describe("null and undefined", () => {
    it("should return true for null === null", () => {
      expect(shallowEqual(null, null)).toBe(true);
    });

    it("should return true for undefined === undefined", () => {
      expect(shallowEqual(undefined, undefined)).toBe(true);
    });

    it("should return false for null vs object", () => {
      expect(shallowEqual(null, {})).toBe(false);
      expect(shallowEqual({}, null)).toBe(false);
    });

    it("should return false for null vs undefined", () => {
      expect(shallowEqual(null, undefined)).toBe(false);
    });
  });

  describe("same reference", () => {
    it("should return true for same object reference", () => {
      const obj = { a: 1 };
      expect(shallowEqual(obj, obj)).toBe(true);
    });

    it("should return true for same array reference", () => {
      const arr = [1, 2, 3];
      expect(shallowEqual(arr, arr)).toBe(true);
    });
  });

  describe("objects", () => {
    it("should return true for objects with same keys and values", () => {
      expect(shallowEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
    });

    it("should return false for objects with different values", () => {
      expect(shallowEqual({ a: 1 }, { a: 2 })).toBe(false);
    });

    it("should return false for objects with different keys", () => {
      expect(shallowEqual({ a: 1 }, { b: 1 })).toBe(false);
    });

    it("should return false for objects with different number of keys", () => {
      expect(shallowEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
      expect(shallowEqual({ a: 1, b: 2 }, { a: 1 })).toBe(false);
    });

    it("should return true for empty objects", () => {
      expect(shallowEqual({}, {})).toBe(true);
    });
  });

  describe("nested objects (shallow comparison)", () => {
    it("should return false for objects with different nested object references", () => {
      const obj1 = { nested: { a: 1 } };
      const obj2 = { nested: { a: 1 } };
      expect(shallowEqual(obj1, obj2)).toBe(false);
    });

    it("should return true for objects with same nested object reference", () => {
      const nested = { a: 1 };
      const obj1 = { nested };
      const obj2 = { nested };
      expect(shallowEqual(obj1, obj2)).toBe(true);
    });
  });

  describe("arrays", () => {
    it("should return true for arrays with same elements", () => {
      expect(shallowEqual([1, 2, 3], [1, 2, 3])).toBe(true);
    });

    it("should return false for arrays with different elements", () => {
      expect(shallowEqual([1, 2, 3], [1, 2, 4])).toBe(false);
    });

    it("should return false for arrays with different lengths", () => {
      expect(shallowEqual([1, 2], [1, 2, 3])).toBe(false);
    });

    it("should return true for empty arrays", () => {
      expect(shallowEqual([], [])).toBe(true);
    });
  });

  describe("mixed types", () => {
    it("should return true for object vs array with same keys/values (shallow limitation)", () => {
      expect(shallowEqual({ 0: 1 }, [1])).toBe(true);
    });

    it("should return false for object vs array with different structure", () => {
      expect(shallowEqual({ a: 1 }, [1])).toBe(false);
    });
  });
});
