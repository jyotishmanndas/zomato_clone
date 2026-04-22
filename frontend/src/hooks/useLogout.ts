import toast from "react-hot-toast";
import { useAppDispatch } from "./useRedux";
import { removeUser } from "../features/authSlice";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { axiosInstance } from "../config/axiosInstance";
import axios from "axios";

export const useLogout = () => {
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const logout = async () => {
        try {
            const res = await axiosInstance.post(`/api/v1/auth/user/logout`);

            if (res.status === 200) {
                toast.success(res.data.msg);

                dispatch(removeUser());
                queryClient.clear();
                navigate("/login");
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.msg || "Logout failed");
            }
        }
    };

    return logout;
};