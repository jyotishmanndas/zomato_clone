import { useQuery } from "@tanstack/react-query";
import { fetchedRestaurant, RestaurantApi } from "../apis/RestaurantApi";

export const useRestaurantApi = () => {
    return useQuery({
        queryKey: ["restaurant"],
        queryFn: RestaurantApi,
    })
};

export const useRestaurant = (id: string) => {
    return useQuery({
        queryKey: ["restaurant", id],
        queryFn: () => fetchedRestaurant(id),
        enabled: !!id
    })
};