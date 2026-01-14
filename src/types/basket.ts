export interface Product {
  code: string;
  name: string;
  price: number;
  color?: string;
}

export interface DeliveryRule {
  threshold: number;
  cost: number;
}

export interface Offer {
  id: string;
  description?: string;
  productCode: string;
  calculateDiscount: (items: Product[]) => number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
