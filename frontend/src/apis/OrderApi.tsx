import { axiosInstance } from "../config/axiosInstance"

export const fetchedRestaurantOrders = async (restaurantId: string) => {
    const res = await axiosInstance.get(`/api/v1/order/${restaurantId}`);
    return res.data
};