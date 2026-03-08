import { axiosInstance } from "../config/axiosInstance"

export const fetchedRestaurantOrders = async (restaurantId: string) => {
    const res = await axiosInstance.get(`/api/v1/order/${restaurantId}`);
    return res.data
};

export const fetchedCustomerOrders = async () => {
    const res = await axiosInstance.get(`/api/v1/order/getOrders`);
    return res.data.orders
};

export const fetchedSingleCustomerOrders = async (orderId: string) => {
    const res = await axiosInstance.get(`/api/v1/order/get/${orderId}`);
    return res.data.order
};

export const fetchedRiderOrders = async () => {
    const res = await axiosInstance.get(`/api/v1/order/getRiderOrders`);
    return res.data.order
}