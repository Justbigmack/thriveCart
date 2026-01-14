import { Badge } from "@components/ui/badge";
import { Separator } from "@components/ui/separator";
import { useBasketSelector } from "@hooks/useBasket";

export const ActiveOffers = () => {
  const activeOffers = useBasketSelector((b) => b.getApplicableOffers());

  if (activeOffers.length === 0) return null;

  return (
    <>
      <Separator />
      <div className="space-y-2">
        <p className="text-sm font-medium">Active Offers</p>
        {activeOffers.map((offer) => (
          <Badge key={offer.id} variant="outline">
            {offer.description}
          </Badge>
        ))}
      </div>
    </>
  );
};
