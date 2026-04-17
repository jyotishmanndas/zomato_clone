import { useQuery } from "@tanstack/react-query"
import { fetchedRiderProfile, fetchedRiderStats } from "../apis/RiderApi"

export const useRiderProfile = ()=>{
    return useQuery({
        queryKey: ["rider"],
        queryFn: fetchedRiderProfile
    })
};

export const useRiderStats = () => {
    return useQuery({
        queryKey: ["riderstats"],
        queryFn: fetchedRiderStats,
    })
};