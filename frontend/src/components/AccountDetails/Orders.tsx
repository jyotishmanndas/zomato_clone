import { Clock } from 'lucide-react'
import { useCustomerOrderApi } from '../../hooks/useOrderApi';
import { useSocket } from '../../hooks/useSocket';
import { useEffect } from 'react';
import { useQueryClient } from "@tanstack/react-query";
import { ACTIVE_STATUSES, type IOrder } from '../../types';
import OrderRow from './OrderRow';

const Orders = () => {
    const queryClient = useQueryClient();
    const { data, isLoading } = useCustomerOrderApi();
    const socketRef = useSocket();

    useEffect(() => {
        const socket = socketRef.current;
        if (!socket) return;

        const onOrderUpdate = () => {
            queryClient.invalidateQueries({
                queryKey: ["order"]
            });
        };
        socket.on("order:update", onOrderUpdate);
        socket.on("order:rider_assigned", onOrderUpdate);

        return () => {
            socket.off("order:update", onOrderUpdate);
            socket.off("order:rider_assigned", onOrderUpdate)
        };

    }, [socketRef])

    if (isLoading) {
        return <div className='flex items-center justify-center'>Loading orders...</div>
    };

    if (data.length === 0) {
        return (
            <div className='flex items-center justify-center'>
                No orders yet
            </div>
        )
    };

    const activeOrder = data.filter((o: IOrder) => ACTIVE_STATUSES.includes(o.status));
    const completeOrder = data.filter((o: IOrder) => !ACTIVE_STATUSES.includes(o.status));

    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-slate-900">My Orders</h3>
                <Clock size={20} className="text-slate-300" />
            </div>

            <div className="space-y-4">
                <h2 className='text-lg font-semibold'>Active Orders</h2>

                {activeOrder.length === 0 ? (
                    <p>No active orders</p>
                ) : (
                    activeOrder.map((order: IOrder) => (
                        <OrderRow key={order._id} order={order} />
                    ))
                )}
            </div>

            <div className="space-y-4">
                <h2 className='text-lg font-semibold'>Completed Orders</h2>

                {activeOrder.length === 0 ? (
                    <p>No completed orders</p>
                ) : (
                    completeOrder.map((order: IOrder) => (
                        <OrderRow key={order._id} order={order} />
                    ))
                )}
            </div>
        </div>
    )
}

export default Orders