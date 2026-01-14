import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";

import { ActiveOffers } from "@components/OrderSummary/ActiveOffers";
import { Separator } from "@components/ui/separator";
import { SummaryLineItem } from "@components/OrderSummary/SummaryLineItem";
import { useBasketSelector } from "@hooks/useBasket";

export const OrderSummary = () => {
  const totals = useBasketSelector((basket) => basket.total());
  const hasItems = useBasketSelector((basket) => basket.getItems().length > 0);
  const { totalCost, deliveryCost, discount, subtotalCost } = totals;

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <SummaryLineItem
          label="Subtotal"
          value={`$${subtotalCost.toFixed(2)}`}
        />

        {discount > 0 && (
          <SummaryLineItem
            label="Savings"
            value={`-$${discount.toFixed(2)}`}
            valueClassName="text-green-600"
          />
        )}

        {totalCost !== 0 && (
          <SummaryLineItem
            label="Shipping"
            value={deliveryCost === 0 ? "Free" : `$${deliveryCost.toFixed(2)}`}
            valueClassName={deliveryCost === 0 ? "text-green-600" : ""}
          />
        )}

        <Separator />

        <div className="flex justify-between">
          <span className="text-lg font-bold">Total</span>
          <span className="text-lg font-bold">${totalCost.toFixed(2)}</span>
        </div>

        {hasItems && <ActiveOffers />}
      </CardContent>
    </Card>
  );
};
