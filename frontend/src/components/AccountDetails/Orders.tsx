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
        return <div className='flex items-center justify-center text-[color:var(--color-text-secondary)]'>Loading orders...</div>
    };

    if (!data || data.length === 0) {
        return (
            <div className='flex items-center justify-center text-[color:var(--color-text-secondary)]'>
                No orders yet
            </div>
        )
    };

    const activeOrder = data.filter((o: IOrder) => ACTIVE_STATUSES.includes(o.status));
    const completeOrder = data.filter((o: IOrder) => !ACTIVE_STATUSES.includes(o.status));

    return (
        <div className="space-y-6">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[color:var(--color-charcoal)]">My orders</h3>
                <Clock size={18} className="text-[color:var(--color-text-secondary)]" />
            </div>

            <div className="space-y-4">
                <h2 className='text-sm font-semibold text-[color:var(--color-charcoal)]'>Active orders</h2>

                {activeOrder.length === 0 ? (
                    <p className='text-xs text-[color:var(--color-text-secondary)]'>No active orders</p>
                ) : (
                    activeOrder.map((order: IOrder) => (
                        <OrderRow key={order._id} order={order} />
                    ))
                )}
            </div>

            <div className="space-y-4">
                <h2 className='text-sm font-semibold text-[color:var(--color-charcoal)]'>Completed orders</h2>

                {completeOrder.length === 0 ? (
                    <p className='text-xs text-[color:var(--color-text-secondary)]'>No completed orders</p>
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