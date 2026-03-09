import React from "react";
import type { IOrder } from "../types";
import { axiosInstance } from "../config/axiosInstance";
import toast from "react-hot-toast";
import axios from "axios";
import { MapPin, Store, Phone, IndianRupee } from "lucide-react";

interface RiderCurrentOrderProps {
    order: IOrder;
}

const RiderCurrentOrder = ({ order }: RiderCurrentOrderProps) => {
    const updateStatus = async () => {
        try {
            const res = await axiosInstance.patch(
                `/api/v1/order/rider/update/status`,
                { orderId: order._id }
            );

            if (res.status === 200) {
                toast.success(res.data.msg);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data.msg);
            }
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-md p-6 max-w-xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">Current Delivery</h2>
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-600 capitalize">
                    {order.status.replaceAll("_", " ")}
                </span>
            </div>

            <div className="flex gap-3 items-start">
                <div className="p-2 bg-orange-100 rounded-lg">
                    <Store className="text-orange-600" size={18} />
                </div>

                <div>
                    <p className="text-sm text-gray-500">Pickup Restaurant</p>
                    <p className="font-semibold text-gray-800">{order.restaurantName}</p>
                </div>
            </div>

            <div className="flex gap-3 items-start">
                <div className="p-2 bg-blue-100 rounded-lg">
                    <MapPin className="text-blue-600" size={18} />
                </div>

                <div>
                    <p className="text-sm text-gray-500">Delivery Address</p>
                    <p className="font-semibold text-gray-800">
                        {order.deliveryAddress.formattedAddress}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4">
                <div>
                    <p className="text-sm text-gray-500">Order Total</p>
                    <p className="flex items-center gap-1 font-semibold text-gray-800">
                        <IndianRupee size={16} />
                        {order.total}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">Your Earnings</p>
                    <p className="flex items-center gap-1 font-semibold text-green-600">
                        <IndianRupee size={16} />
                        {order.riderAmount}
                    </p>
                </div>
            </div>

            {order.deliveryAddress.mobile && (
                <div className="flex items-center justify-between border rounded-xl p-4">
                    <div>
                        <p className="text-sm text-gray-500">Customer Phone</p>
                        <p className="font-semibold text-gray-800">
                            {order.deliveryAddress.mobile}
                        </p>
                    </div>

                    <a
                        href={`tel:${order.deliveryAddress.mobile}`}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                    >
                        <Phone size={16} />
                        Call
                    </a>
                </div>
            )}

            <div className="space-y-3">
                {order.status === "rider_assigned" && (
                    <button
                        onClick={updateStatus}
                        className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-xl transition"
                    >
                        Reached Restaurant
                    </button>
                )}

                {order.status === "picked_up" && (
                    <button
                        onClick={updateStatus}
                        className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition"
                    >
                        Mark as Delivered
                    </button>
                )}
            </div>
        </div>
    );
};

export default RiderCurrentOrder;