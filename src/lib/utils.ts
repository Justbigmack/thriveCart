import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const shallowEqual = <T>(previousValue: T, nextValue: T): boolean => {
  if (previousValue === nextValue) return true;

  if (
    typeof previousValue !== "object" ||
    typeof nextValue !== "object" ||
    previousValue === null ||
    nextValue === null
  ) {
    return false;
  }

  const previousKeys = Object.keys(previousValue);
  const nextKeys = Object.keys(nextValue);

  if (previousKeys.length !== nextKeys.length) return false;

  return previousKeys.every(
    (key) =>
      (previousValue as Record<string, unknown>)[key] ===
      (nextValue as Record<string, unknown>)[key]
  );
};
