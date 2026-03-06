import { useQuery } from "@tanstack/react-query";
import { fetchedCustomerOrders, fetchedRestaurantOrders, fetchedSingleCustomerOrders } from "../apis/OrderApi";

export const useOrderApi = (restaurantId: string) => {
    return useQuery({
        queryKey: ["orders", restaurantId],
        queryFn: () => fetchedRestaurantOrders(restaurantId),
        enabled: !!restaurantId
    })
};

export const useCustomerOrderApi = () => {
    return useQuery({
        queryKey: ["order"],
        queryFn: fetchedCustomerOrders
    })
}

export const useCustomerSingleOrderApi = (orderId?: string) => {
    return useQuery({
        queryKey: ["order", orderId],
        queryFn: () => fetchedSingleCustomerOrders(orderId as string),
        enabled: !!orderId
    })
}