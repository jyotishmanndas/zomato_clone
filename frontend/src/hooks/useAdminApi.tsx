import { useQuery } from "@tanstack/react-query";
import { fetchedUnVerifiedRestaurant, fetchedUnVerifiedRider } from "../apis/AdminApi";

export const useFetchedUnVerifiedRestaurant = () => {
    return useQuery({
        queryKey: ["verifyrestaurant"],
        queryFn: fetchedUnVerifiedRestaurant,
    })
};

export const useFetchedUnVerifiedRider = () => {
    return useQuery({
        queryKey: ["verifyrider"],
        queryFn: fetchedUnVerifiedRider,
    })
};