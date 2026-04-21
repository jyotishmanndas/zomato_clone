import type { IOrder } from "../types";
import { axiosInstance } from "../config/axiosInstance";
import toast from "react-hot-toast";
import axios from "axios";
import { Clock3, IndianRupee, MapPin, Phone, Route, Store } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

interface RiderCurrentOrderProps {
    order: IOrder;
}

const RiderCurrentOrder = ({ order }: RiderCurrentOrderProps) => {
    const queryClient = useQueryClient();

    const formatINR = (value: number) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(value || 0);

    const prettyStatus = (status: string) => status.replaceAll("_", " ");

    const statusPillClass = () => {
        if (order.status === "rider_assigned") return "bg-amber-50 text-amber-700 ring-amber-200";
        if (order.status === "picked_up") return "bg-blue-50 text-blue-700 ring-blue-200";
        if (order.status === "delivered") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
        return "bg-gray-50 text-gray-700 ring-gray-200";
    };

    const updateStatus = async () => {
        try {
            const res = await axiosInstance.patch(
                `/api/v1/order/rider/update/status`,
                { orderId: order._id }
            );

            if (res.status === 200) {
                toast.success(res.data.msg);

                const updatedOrder = res.data.order; // ✅ IMPORTANT

                queryClient.setQueryData(["riderorder"], (old: any) => {
                    if (!old) return old;

                    // ✅ REMOVE only if delivered
                    if (updatedOrder.status === "delivered") {
                        return old.filter((o: any) => o._id !== order._id);
                    }

                    // ✅ OTHERWISE update
                    return old.map((o: any) =>
                        o._id === order._id ? updatedOrder : o
                    );
                });
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data.msg);
            }
        }
    };

    return (
        <div className="rounded-3xl bg-surface p-5 shadow-sm ring-1 ring-divider">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-[11px] font-semibold text-text-secondary">
                        Current order
                    </p>
                    <p className="mt-1 text-sm font-extrabold text-charcoal">
                        {order.restaurantName}
                    </p>
                    <p className="mt-1 text-[11px] text-text-secondary">
                        Order ID: <span className="font-semibold text-charcoal">#{String(order._id).slice(-6).toUpperCase()}</span>
                    </p>
                </div>

                <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold capitalize ring-1 ${statusPillClass()}`}
                >
                    <Clock3 className="h-3.5 w-3.5" />
                    {prettyStatus(order.status)}
                </span>
            </div>

            <div className="mt-4 grid gap-3">
                <div className="rounded-2xl bg-bg-blush p-4 ring-1 ring-divider">
                    <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/70 text-brand-red ring-1 ring-divider">
                            <Store className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                            <p className="text-[11px] font-semibold text-text-secondary">
                                Pickup
                            </p>
                            <p className="truncate text-sm font-semibold text-charcoal">
                                {order.restaurantName}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl bg-bg-blush p-4 ring-1 ring-divider">
                    <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/70 text-brand-red ring-1 ring-divider">
                            <MapPin className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                            <p className="text-[11px] font-semibold text-text-secondary">
                                Drop
                            </p>
                            <p className="text-sm font-semibold text-charcoal">
                                {order.deliveryAddress.formattedAddress}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-bg-blush p-4 ring-1 ring-divider">
                    <p className="text-[11px] font-semibold text-text-secondary">
                        Order total
                    </p>
                    <p className="mt-1 inline-flex items-center gap-1 text-sm font-extrabold text-charcoal">
                        <IndianRupee className="h-4 w-4" />
                        {formatINR(order.total)}
                    </p>
                </div>

                <div className="rounded-2xl bg-bg-blush p-4 ring-1 ring-divider">
                    <p className="text-[11px] font-semibold text-text-secondary">
                        Your earnings
                    </p>
                    <p className="mt-1 inline-flex items-center gap-1 text-sm font-extrabold text-success">
                        <IndianRupee className="h-4 w-4" />
                        {formatINR(order.riderAmount)}
                    </p>
                </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-bg-blush p-4 ring-1 ring-divider">
                <div className="inline-flex items-center gap-2 text-[11px] font-semibold text-text-secondary">
                    <Route className="h-4 w-4" />
                    Distance: <span className="text-charcoal">{order.distance} km</span>
                </div>

                {order.deliveryAddress.mobile && (
                    <a
                        href={`tel:${order.deliveryAddress.mobile}`}
                        className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                    >
                        <Phone className="h-4 w-4" />
                        Call customer
                    </a>
                )}
            </div>

            <div className="mt-4 space-y-3">
                {order.status === "rider_assigned" && (
                    <button
                        onClick={updateStatus}
                        className="w-full rounded-2xl bg-amber-500 py-3 text-sm font-extrabold text-white transition hover:bg-amber-600"
                    >
                        Reached restaurant
                    </button>
                )}

                {order.status === "picked_up" && (
                    <button
                        onClick={updateStatus}
                        className="w-full rounded-2xl bg-success py-3 text-sm font-extrabold text-white transition hover:opacity-95"
                    >
                        Mark as delivered
                    </button>
                )}
            </div>
        </div>
    );
};

export default RiderCurrentOrder;