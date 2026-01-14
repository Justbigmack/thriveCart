import { DeliveryRule, Offer, Product } from "@/types/basket";

const randomDelay = () => Math.floor(Math.random() * 200) + 500;

export const mockedProducts: Product[] = [
  { code: "R01", name: "Red Widget", price: 32.95, color: "bg-red-500" },
  { code: "G01", name: "Green Widget", price: 24.95, color: "bg-green-500" },
  { code: "B01", name: "Blue Widget", price: 7.95, color: "bg-blue-500" },
];

export const mockedDeliveryRules: DeliveryRule[] = [
  { threshold: 90, cost: 0 },
  { threshold: 50, cost: 2.95 },
  { threshold: 0, cost: 4.95 },
];

export const mockedOffers: Offer[] = [
  {
    id: "red-widget-bogo",
    productCode: "R01",
    description: "Buy one red widget, get the second half price",
    calculateDiscount: (items) => {
      const reds = items.filter((i) => i.code === "R01");
      const pairs = Math.floor(reds.length / 2);
      return pairs * (32.95 / 2);
    },
  },
];

export const fetchProductCatalogue = async (): Promise<Product[]> => {
  await new Promise((resolve) => setTimeout(resolve, randomDelay()));
  return mockedProducts;
};

export const fetchDeliveryRules = async (): Promise<DeliveryRule[]> => {
  await new Promise((resolve) => setTimeout(resolve, randomDelay()));
  return mockedDeliveryRules;
};

export const fetchOffers = async (): Promise<Offer[]> => {
  await new Promise((resolve) => setTimeout(resolve, randomDelay()));
  return mockedOffers;
};

export const fetchBasketInfo = async () => {
  const [products, deliveryRules, offers] = await Promise.all([
    fetchProductCatalogue(),
    fetchDeliveryRules(),
    fetchOffers(),
  ]);

  return {
    products,
    deliveryRules,
    offers,
  };
};
