import { useQuery } from "@tanstack/react-query";
import { RestaurantApi } from "../apis/RestaurantApi";

export const useRestaurantApi = () => {
    return useQuery({
        queryKey: ["restaurant"],
        queryFn: RestaurantApi,
    })
};