import { useQuery } from "@tanstack/react-query"
import { fetchedCart } from "../apis/CartApi"

export const useFetchedCart = () => {
    return useQuery({
        queryKey: ["cart"],
        queryFn: fetchedCart
    })
};