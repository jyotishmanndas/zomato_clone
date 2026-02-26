import { axiosInstance } from "../config/axiosInstance"

export const fetchedCart = async () => {
    try {
        const res = await axiosInstance.get(`/api/v1/cart/getCart`);
        return res.data
    } catch (error) {
        console.log("Something went wrong while fetching", error);
    }
};