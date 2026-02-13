import React, { useState } from 'react'
import { axiosInstance } from '../config/axiosInstance';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import { useAppDispatch } from '../hooks/useRedux';
import { setUser } from '../features/authSlice';
import axios from 'axios';

type Role = "customer" | "rider" | "seller"

const SelectRole = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [role, setRole] = useState<Role | null>(null);

    const roles: Role[] = ["customer", "rider", "seller"]

    const addRole = async () => {
        try {
            const res = await axiosInstance.patch("/api/v1/auth/add/role", { role });
            if (res.status === 200) {
                dispatch(setUser(res.data.data))
                toast.success(res.data.msg);
                navigate("/home");
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data.msg)
            }
        }
    };


    return (
        <div className='min-h-screen bg-white flex flex-col items-center justify-center'>
            <div className='w-full max-w-sm space-y-6'>
                <h1 className='text-2xl font-bold text-center'>Choose your Role</h1>

                <div className='space-y-4'>
                    {roles.map((r, i) => (
                        <button key={i} onClick={() => setRole(r)} className={
                            `w-full rounded-xl px-4 py-3 text-base font-medium border capitalize transition
                        ${role === r ? "bg-[#E23744] border-[#E23744] text-white" : "border-gray-300 bg-white hover:bg-gray-50 hover:text-gray-700"}`
                        }>
                            continue as {r}
                        </button>
                    ))}
                </div>

                <button disabled={!role} onClick={addRole} className={`px-4 py-3 rounded-xl w-full font-medium
                    ${role ? "bg-black text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"}
                `}
                >Next</button>
            </div>
        </div>
    )
}

export default SelectRole