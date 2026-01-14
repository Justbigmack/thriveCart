import { useContext, useEffect, useRef, useState } from "react";

import { Basket } from "@/features/basket/Basket";
import { BasketContext } from "@/context/BasketContext";

//Use this to subscribe to specific pieces of data.
// The component will only rerender if the selected value changes.

export const useBasketSelector = <T,>(selector: (basket: Basket) => T): T => {
  const basket = useContext(BasketContext);
  if (!basket) throw new Error("useBasket must be used within BasketProvider");

  const [selectedState, setSelectedState] = useState(() => selector(basket));
  const lastSelectedState = useRef(selectedState);

  useEffect(() => {
    const unsubscribe = basket.subscribe(() => {
      const nextSelectedState = selector(basket);

      // Shallow comparison to prevent rerenders if data is identical
      if (
        JSON.stringify(lastSelectedState.current) !==
        JSON.stringify(nextSelectedState)
      ) {
        lastSelectedState.current = nextSelectedState;
        setSelectedState(nextSelectedState);
      }
    });
    return unsubscribe;
  }, [basket, selector]);

  return selectedState;
};

// Use this for components that only need to add or remove items.
// This does not subscribe to changes, so the component never re-renders.
export const useBasketActions = () => {
  const basket = useContext(BasketContext);
  if (!basket) throw new Error("useBasket must be used within BasketProvider");
  return basket;
};
