import React, { createContext, useMemo } from "react";

import { Basket } from "@/features/basket/Basket";
import { ErrorPage } from "@/components/Layout/ErrorPage";
import { LoadingPage } from "@/components/Layout/LoadingPage";
import { fetchBasketInfo } from "@/api/basket";
import { useQuery } from "@tanstack/react-query";

export const BasketContext = createContext<Basket | null>(null);

export const BasketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["catalogue"],
    queryFn: fetchBasketInfo,
    staleTime: Infinity,
  });

  const basket = useMemo(() => {
    if (!data) return null;
    const basketInstance = new Basket(data.deliveryRules, data.offers);
    basketInstance.setupCatalogue(data.products);
    return basketInstance;
  }, [data]);

  if (isLoading) return <LoadingPage />;

  if (isError) return <ErrorPage />;

  if (!basket) return null;

  return (
    <BasketContext.Provider value={basket}>{children}</BasketContext.Provider>
  );
};
