import { useQuery } from "@tanstack/react-query"
import { fetchedRiderProfile } from "../apis/RiderApi"

export const useRiderProfile = ()=>{
    return useQuery({
        queryKey: ["rider"],
        queryFn: fetchedRiderProfile
    })
};