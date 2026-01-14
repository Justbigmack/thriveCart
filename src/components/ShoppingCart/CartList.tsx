import { CartItem } from "@components/ShoppingCart/CartItem";
import { EmptyCart } from "@components/ShoppingCart/EmptyCart";
import { useBasketSelector } from "@hooks/useBasket";

export const CartList = () => {
  const items = useBasketSelector((b) => b.getItems());
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-2xl font-bold">Shopping Cart</h2>
      </div>

      {totalItems > 0 ? (
        <>
          <p className="text-muted-foreground mb-4">
            {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
          </p>
          <div>
            {items.map((item) => (
              <CartItem key={item.product.code} item={item} />
            ))}
          </div>
        </>
      ) : (
        <EmptyCart />
      )}
    </div>
  );
};
