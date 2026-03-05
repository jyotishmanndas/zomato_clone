import { useQuery } from "@tanstack/react-query";
import { fetchedRestaurantOrders } from "../apis/OrderApi";

export const useOrderApi = (restaurantId: string) => {
    return useQuery({
        queryKey: ["orders", restaurantId],
        queryFn: () => fetchedRestaurantOrders(restaurantId),
        enabled: !!restaurantId
    })
};