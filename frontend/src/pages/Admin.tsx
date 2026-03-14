import React, { useState } from "react";
import {
    useFetchedUnVerifiedRestaurant,
    useFetchedUnVerifiedRider,
} from "../hooks/useAdminApi";
import { axiosInstance } from "../config/axiosInstance";
import toast from "react-hot-toast";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";

const Admin = () => {
    const queryClient = useQueryClient();

    const [tab, setTab] = useState<"riders" | "restaurants">("riders");
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const { data: restaurant } = useFetchedUnVerifiedRestaurant();
    const { data: rider } = useFetchedUnVerifiedRider();

    const verifyRestaurant = async (id: string) => {
        try {
            setLoadingId(id);

            const res = await axiosInstance.patch(
                `/api/v1/admin/verify/restaurant/${id}`
            );

            if (res.status === 200) {
                toast.success(res.data.msg);

                queryClient.invalidateQueries({
                    queryKey: ["verifyrestaurant"],
                });
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data.msg);
            }
        } finally {
            setLoadingId(null);
        }
    };

    const verifyRider = async (id: string) => {
        try {
            setLoadingId(id);

            const res = await axiosInstance.patch(`/api/v1/admin/verify/rider/${id}`);

            if (res.status === 200) {
                toast.success(res.data.msg);

                queryClient.invalidateQueries({
                    queryKey: ["verifyrider"],
                });
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data.msg);
            }
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-white shadow-md px-8 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Admin Verification Panel</h1>
                <span className="text-gray-500">Delivery Platform</span>
            </div>

            <div className="flex gap-4 p-6">
                <button
                    onClick={() => setTab("riders")}
                    className={`px-5 py-2 rounded-lg ${tab === "riders" ? "bg-black text-white" : "bg-white border"
                        }`}
                >
                    Riders ({rider?.length || 0})
                </button>

                <button
                    onClick={() => setTab("restaurants")}
                    className={`px-5 py-2 rounded-lg ${tab === "restaurants" ? "bg-black text-white" : "bg-white border"
                        }`}
                >
                    Restaurants ({restaurant?.length || 0})
                </button>
            </div>

            <div className="p-6 grid grid-cols-3 gap-6">

                {tab === "riders" &&
                    (rider?.length ? (
                        rider.map((r: any) => (
                            <div
                                key={r._id}
                                className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <img
                                        src={r.picture}
                                        className="w-16 h-16 rounded-full object-cover"
                                    />

                                    <div>
                                        <p className="font-semibold">Rider</p>
                                        <p className="text-sm text-gray-500">{r.mobile}</p>
                                    </div>
                                </div>

                                <div className="text-sm space-y-2">
                                    <p>
                                        <span className="font-medium">Aadhaar:</span>{" "}
                                        {r.aadhaarNumber}
                                    </p>

                                    <p>
                                        <span className="font-medium">Licence:</span>{" "}
                                        {r.drivingLicenceNumber}
                                    </p>

                                    <p>
                                        <span className="font-medium">Available:</span>{" "}
                                        {r.isAvailable ? "Yes" : "No"}
                                    </p>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <button
                                        disabled={loadingId === r._id}
                                        onClick={() => verifyRider(r._id)}
                                        className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
                                    >
                                        {loadingId === r._id ? "Verifying..." : "Approve"}
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No pending riders</p>
                    ))}

                {tab === "restaurants" &&
                    (restaurant?.length ? (
                        restaurant.map((res: any) => (
                            <div
                                key={res._id}
                                className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition"
                            >
                                <img
                                    src={res.image}
                                    className="w-full h-40 object-cover"
                                />

                                <div className="p-5">
                                    <h2 className="font-semibold text-lg mb-1">{res.name}</h2>

                                    <p className="text-sm text-gray-500 mb-3">
                                        {res.description}
                                    </p>

                                    <p className="text-sm">
                                        <span className="font-medium">Phone:</span> {res.phone}
                                    </p>

                                    <p className="text-sm">
                                        <span className="font-medium">Status:</span>{" "}
                                        {res.isOpen ? "Open" : "Closed"}
                                    </p>

                                    <div className="flex gap-3 mt-5">
                                        <button
                                            disabled={loadingId === res._id}
                                            onClick={() => verifyRestaurant(res._id)}
                                            className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
                                        >
                                            {loadingId === res._id ? "Verifying..." : "Approve"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No pending restaurants</p>
                    ))}
            </div>
        </div>
    );
};

export default Admin;