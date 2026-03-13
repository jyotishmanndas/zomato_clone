import { axiosInstance } from "../config/axiosInstance"

export const FetchedAddress = async () => {
    const res = await axiosInstance.get(`/api/v1/address/getAddress`);
    return res.data.address
};