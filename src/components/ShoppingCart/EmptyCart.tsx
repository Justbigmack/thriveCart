import { ShoppingCart } from "lucide-react";

export const EmptyCart = () => {
  return (
    <div className="text-center py-12 border-2 border-dashed rounded-lg">
      <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
      <p className="text-lg text-muted-foreground">Your cart is empty</p>
      <p className="text-sm text-muted-foreground mt-2">
        Add products from the selection above
      </p>
    </div>
  );
};
