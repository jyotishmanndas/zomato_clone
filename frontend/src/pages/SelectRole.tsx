import React, { useState } from 'react';
import { axiosInstance } from '../config/axiosInstance';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import { useAppDispatch } from '../hooks/useRedux';
import { setUser } from '../features/authSlice';
import axios from 'axios';
import { User, Bike, Store, ArrowRight } from 'lucide-react';

type Role = "customer" | "rider" | "seller";

const roleConfig = {
    customer: { icon: User, desc: "Order food and groceries" },
    rider: { icon: Bike, desc: "Earn by delivering orders" },
    seller: { icon: Store, desc: "Grow your business with us" }
};

const SelectRole = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [role, setRole] = useState<Role | null>(null);
    const [loading, setLoading] = useState(false);

    const roles: Role[] = ["customer", "rider", "seller"];

    const addRole = async () => {
        if (!role) return;
        setLoading(true);
        try {
            const res = await axiosInstance.patch("/api/v1/auth/add/role", { role });
            if (res.status === 200) {
                dispatch(setUser(res.data.data));
                toast.success(res.data.msg);
                if (res.data.data.role === "seller") {
                    navigate("/restaurant")
                } else {
                    navigate("/home")
                }
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data.msg || "Something went wrong");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-8 md:p-10">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        Join our community
                    </h1>
                    <p className="text-slate-500 mt-2">Choose how you'd like to use the platform</p>
                </div>

                <div className="space-y-4">
                    {roles.map((r) => {
                        const Icon = roleConfig[r].icon;
                        const isSelected = role === r;

                        return (
                            <button
                                key={r}
                                onClick={() => setRole(r)}
                                className={`group relative w-full flex items-center p-4 rounded-2xl border-2 transition-all duration-200 text-left
                                       ${isSelected
                                        ? "border-[#E23744] bg-indigo-50/50 ring-4 ring-indigo-50"
                                        : "border-slate-100 hover:border-indigo-200 hover:bg-slate-50"
                                    }`}
                            >
                                <div className={`p-3 rounded-xl mr-4 transition-colors ${isSelected ? "bg-[#E23744] text-white" : "bg-slate-100 text-slate-500 group-hover:bg-indigo-100"
                                    }`}>
                                    <Icon size={24} />
                                </div>

                                <div className="flex-1">
                                    <h3 className={`font-bold capitalize ${isSelected ? "text-indigo-900" : "text-slate-700"}`}>
                                        {r}
                                    </h3>
                                    <p className="text-sm text-slate-500 leading-tight">
                                        {roleConfig[r].desc}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>

                <button
                    disabled={!role || loading}
                    onClick={addRole}
                    className={`mt-10 w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-lg transition-all transform active:scale-[0.98]
                          ${role
                            ? "bg-slate-900 text-white shadow-lg shadow-slate-300 hover:bg-black"
                            : "bg-slate-200 text-slate-400 cursor-not-allowed"}
                         `}>
                    {loading ? "Updating..." : "Get Started"}
                    <ArrowRight size={20} />
                </button>
            </div>
        </div>
    );
};

export default SelectRole;