import { axiosInstance } from "../config/axiosInstance"

export const RestaurantApi = async () => {
    try {
        const res = await axiosInstance.get(`/api/v1/restaurant/my/restaurant`);
        return res.data.restaurant
    } catch (error) {
        console.log("Something went wrong when fetching", error);
    }
};

export const fetchedRestaurant = async (id: string) => {
    try {
        const res = await axiosInstance.get(`/api/v1/restaurant/${id}`);
        return res.data.restaurant
    } catch (error) {
        console.log("Something went wrong when fetching", error);
    }
};