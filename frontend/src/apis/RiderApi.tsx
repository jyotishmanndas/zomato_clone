import { axiosInstance } from "../config/axiosInstance"

export const fetchedRiderProfile = async()=>{
    const res = await axiosInstance(`/api/v1/rider/profile`);
    return res.data.rider
};