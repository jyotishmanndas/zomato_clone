import { useEffect, useState } from 'react'
import type { IOrder } from '../types'
import { axiosInstance } from '../config/axiosInstance';
import toast from 'react-hot-toast';
import axios from 'axios';
import { ORDER_ACTIONS, statusColor } from '../utils/orderflow';
import { useQueryClient } from "@tanstack/react-query";

interface OrderCardProps {
    order: IOrder;
};

const OrderCard = ({ order }: OrderCardProps) => {
    const [retryVisible, setRetryVisible] = useState(false);
    const [retryTrigger, setRetryTrigger] = useState(0);
    const queryClient = useQueryClient();
    const actions = ORDER_ACTIONS[order.status] || [];

    useEffect(() => {
        if (order.status !== "ready_for_rider") {
            setRetryVisible(false);
            return
        };

        const timer = setTimeout(() => {
            setRetryVisible(true)
        }, 10000);

        return () => {
            clearTimeout(timer)
        }
    }, [order.status, order._id, retryTrigger])

    const updateStatus = async (status: string) => {
        try {
            setRetryVisible(false)
            const res = await axiosInstance.patch(`/api/v1/order/update/${order._id}`, { status });
            queryClient.invalidateQueries({
                queryKey: ["orders", order.restaurantId]
            });

            if (status === "ready_for_rider") {
                setRetryTrigger(prev => prev + 1);
            }

            if (res.status === 200) {
                toast.success(res.data.msg);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data.msg)
            }
        }
    };

    return (
        <div className='rounded-xl bg-white p-4 shadow-sm space-y-3'>
            <div className='flex justify-between items-center'>
                <p className='text-sm font-medium'>Order #{order._id.slice(-6)}</p>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColor(order.status)}`}>{order.status.replaceAll("_", " ")}</span>
            </div>

            <div className='text-sm text-gray-600 space-y-1'>
                {order.items.map((item, i) => (
                    <p key={i}>
                        {item.name} x {item.quantity}
                    </p>
                ))}
            </div>

            <div className='flex justify-between text-sm font-medium'>
                <span>Total</span>
                <span>₹{order.total}</span>
            </div>
            <p className='text-xs text-gray-400'>Payment: {order.paymentStatus}</p>

            {order.paymentStatus === "paid" && actions.length > 0 && (
                <div className='flex flex-wrap gap-2 pt-2'>
                    {actions.map((status) => (
                        <button key={status} onClick={() => updateStatus(status)} className='px-4 py-1 rounded-lg bg-[#e23744] text-xs text-white hover:bg-[#d32f3a] disabled:opacity-50'>
                            Mark as {status.replaceAll("_", " ")}
                        </button>
                    ))}
                </div>
            )}

            {order.status === "ready_for_rider" && retryVisible && (
                <div className='pt-2'>
                    <button className='w-full rounded-lg border py-2 text-xs font-semibold text-[#E23744] hover:bg-red-50 disabled:opacity-50' onClick={() => updateStatus("ready_for_rider")}>Retry Ready for Rider</button>
                </div>
            )}
        </div>
    )
}

export default OrderCard