import { Card, CardContent } from "@components/ui/card";
import { Minus, Plus, Trash2 } from "lucide-react";

import { Button } from "@components/ui/button";
import { CartItem as CartItemType } from "@/types/basket";
import { memo } from "react";
import { useBasketActions } from "@hooks/useBasket";

interface CartItemProps {
  item: CartItemType;
}

const CartItemComponent = ({ item }: CartItemProps) => {
  const { product, quantity } = item;
  const { add, remove } = useBasketActions();

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div
            className={`${product.color} w-20 h-20 rounded-md flex items-center justify-center text-white font-bold flex-shrink-0`}
          >
            {product.code}
          </div>

          <div className="flex-1">
            <h3 className="font-semibold text-lg">{product.name}</h3>
            <p className="text-sm text-muted-foreground">
              Code: {product.code}
            </p>
            <p className="text-sm text-muted-foreground">
              ${product.price.toFixed(2)} each
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => remove(product.code, 1)}
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="w-8 text-center font-semibold">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => add(product.code)}
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="text-right min-w-[80px]">
            <p className="font-bold text-lg">
              ${(product.price * quantity).toFixed(2)}
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => remove(product.code)}
            aria-label="Remove all items"
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Custom comparison function is required because Basket.getItems()
// returns new object references every time.
const areCartItemsEqual = (
  previousProps: CartItemProps,
  nextProps: CartItemProps
) => {
  return (
    previousProps.item.product.code === nextProps.item.product.code &&
    previousProps.item.quantity === nextProps.item.quantity &&
    previousProps.item.product.price === nextProps.item.product.price
  );
};

export const CartItem = memo(CartItemComponent, areCartItemsEqual);
