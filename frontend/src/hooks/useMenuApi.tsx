import { useQuery } from "@tanstack/react-query";
import { fetchedMenuItems, MenuApi } from "../apis/MenuApi";

export const useMenuApi = () => {
    return useQuery({
        queryKey: ["menu"],
        queryFn: MenuApi,
    })
};

export const useRestaurantMenu = (id: string) => {
    return useQuery({
        queryKey: ["menu", id],
        queryFn: () => fetchedMenuItems(id),
        enabled: !!id
    })
};