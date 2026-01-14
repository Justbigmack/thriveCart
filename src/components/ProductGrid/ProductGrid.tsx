import { ProductCard } from "@components/ProductGrid/ProductCard";
import { useBasketActions } from "@/hooks/useBasket";

export const ProductGrid = () => {
  const { getCatalogue } = useBasketActions();
  const products = getCatalogue();

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard key={product.code} product={product} />
        ))}
      </div>
    </section>
  );
};
