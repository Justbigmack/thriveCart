export const truncateToCents = (value: number): number =>
  Math.floor(value * 100 + 0.00000001) / 100;
