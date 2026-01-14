import { CartList } from "@/components/ShoppingCart/CartList";
import { Layout } from "@components/Layout/Layout";
import { OrderSummary } from "@/components/OrderSummary/OrderSummary";
import { ProductGrid } from "@components/ProductGrid/ProductGrid";

const App = () => {
  return (
    <Layout>
      <ProductGrid />
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CartList />
        </div>
        <div>
          <OrderSummary />
        </div>
      </section>
    </Layout>
  );
};

export default App;
