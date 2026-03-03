import { useQuery } from "@tanstack/react-query";
import { FetchedAddress } from "../apis/AddressApi";

export const useAddressApi = () => {
    return useQuery({
        queryKey: ["address"],
        queryFn: FetchedAddress,
    })
};