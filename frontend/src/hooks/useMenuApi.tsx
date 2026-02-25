import { useQuery } from "@tanstack/react-query";
import { MenuApi } from "../apis/MenuApi";

export const useMenuApi = () => {
    return useQuery({
        queryKey: ["menu"],
        queryFn: MenuApi,
    })
};