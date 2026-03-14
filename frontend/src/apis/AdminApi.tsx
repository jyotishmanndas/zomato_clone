import { axiosInstance } from "../config/axiosInstance"

export const fetchedUnVerifiedRestaurant = async()=>{
    const res = await axiosInstance.get(`/api/v1/admin/restaurant/pending`);
    return res.data.restaurant
};

export const fetchedUnVerifiedRider = async()=>{
    const res = await axiosInstance.get(`/api/v1/admin/rider/pending`);
    return res.data.rider
};

