import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@components/ui/card";

import { Button } from "@components/ui/button";
import { Plus } from "lucide-react";
import { Product } from "@/types/basket";
import { useBasketActions } from "@hooks/useBasket";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { add } = useBasketActions();

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <div
          className={`${product.color} h-48 rounded-md flex items-center justify-center text-white text-4xl font-bold`}
        >
          {product.code}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <CardTitle className="text-lg">{product.name}</CardTitle>
        <p className="text-sm text-muted-foreground">Code: {product.code}</p>
        <p className="text-2xl font-bold mt-2">${product.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={() => add(product.code)} className="w-full" size="lg">
          <Plus className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};
