import { axiosInstance } from "../config/axiosInstance"

export const MenuApi = async () => {
    try {
        const res = await axiosInstance.get(`/api/v1/menu/my-items`);
        return res.data.items
    } catch (error) {
        console.log("Something went wrong when fetching", error);
    }
};

export const fetchedMenuItems = async (id: string) => {
    try {
        const res = await axiosInstance.get(`/api/v1/menu/items/${id}`);
        return res.data.menuItems
    } catch (error) {
        console.log("Something went wrong when fetching", error);
    }
}