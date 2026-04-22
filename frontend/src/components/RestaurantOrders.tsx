import { useEffect, useRef, useState } from 'react'
import audio from "../assets/resAudio.mp3";
import { useOrderApi } from '../hooks/useOrderApi';
import { useSocket } from '../hooks/useSocket';
import { ACTIVE_STATUSES } from '../types';
import OrderCard from './OrderCard';
import { useQueryClient } from "@tanstack/react-query";

const RestaurantOrders = ({ restaurantId }: { restaurantId: string }) => {
    const queryClient = useQueryClient();
    const [audioUnlocked, setAudioUnlocked] = useState(() => {
        return localStorage.getItem("audioEnabled") === "true"
    });
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const { data, isLoading } = useOrderApi(restaurantId);
    const socketRef = useSocket();

    const unlockAudio = () => {
        if (audioRef.current) {
            audioRef.current.play().then(() => {
                audioRef.current!.pause();
                audioRef.current!.currentTime = 0;
                setAudioUnlocked(true);
                localStorage.setItem("audioEnabled", "true");
            }).catch((error) => {
                console.log("Failed to unlock audio", error);
            })
        };
    };

    useEffect(() => {
        audioRef.current = new Audio(audio);
        audioRef.current.load();
    }, []);

    useEffect(() => {
        const socket = socketRef.current;
        if (!socket) return;

        const onNewOrder = () => {
            if (socket && audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play().catch((err) => {
                    console.log("Audio failed to play", err);
                })
            };

            queryClient.invalidateQueries({
                queryKey: ["orders", restaurantId]
            });
        };

        socket.on("order:new", onNewOrder);

        return () => {
            socket.off("order:new", onNewOrder)
        };

    }, [socketRef, audioUnlocked, restaurantId, queryClient])

    useEffect(() => {
        const socket = socketRef.current;
        if (!socket) return;

        const onOrderUpdate = () => {
            if (socket && audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play().catch((err) => {
                    console.log("Audio failed to play", err);
                })
            };

            queryClient.invalidateQueries({
                queryKey: ["orders", restaurantId]
            });
        };

        socket.on("order:rider_assigned", onOrderUpdate);

        return () => {
            socket.off("order:rider_assigned", onOrderUpdate)
        };

    }, [socketRef, restaurantId, queryClient])


    if (isLoading) {
        return <div className='flex h-screen items-center justify-center text-[color:var(--color-text-secondary)]'>Loading orders...</div>
    };

    const activeOrder = data.orders.filter((o: any) => ACTIVE_STATUSES.includes(o.status));
    const completeOrder = data.orders.filter((o: any) => !ACTIVE_STATUSES.includes(o.status));

    return (
        <div className='space-y-5'>
            {!audioUnlocked && (
                <div className='flex items-center justify-between gap-3 rounded-3xl bg-blue-50 p-4 text-xs text-blue-900 ring-1 ring-blue-100'>
                    <div className='flex items-center gap-3'>
                        <span className='text-2xl'>🔔</span>
                        <div>
                            <p className='text-sm font-semibold'>Enable sound notifications</p>
                            <p className='text-[11px]'>Get a chime whenever a new order is placed or updated.</p>
                        </div>
                    </div>
                    <button onClick={unlockAudio}
                        className='rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700'>Enable sound</button>
                </div>
            )}

            <div className='space-y-3 rounded-3xl bg-[color:var(--color-surface)] p-4 shadow-sm ring-1 ring-[color:var(--color-divider)]'>
                <h3 className='text-sm font-semibold text-[color:var(--color-charcoal)]'>Active orders</h3>

                {activeOrder.length === 0 ? (
                    <p className='flex items-center justify-center text-xs text-[color:var(--color-text-secondary)]'>No active orders</p>
                ) : (
                    <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
                        {activeOrder.map((order: any) => (
                            <OrderCard key={order._id} order={order} />
                        ))}
                    </div>
                )}
            </div>

            <div className='space-y-3 rounded-3xl bg-[color:var(--color-surface)] p-4 shadow-sm ring-1 ring-[color:var(--color-divider)]'>
                <h3 className='text-sm font-semibold text-[color:var(--color-charcoal)]'>Completed orders</h3>

                {completeOrder.length === 0 ? (
                    <p className='flex items-center justify-center text-xs text-[color:var(--color-text-secondary)]'>No completed orders</p>
                ) : (
                    <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
                        {completeOrder.map((order: any) => (
                            <OrderCard key={order._id} order={order} />
                        ))}
                    </div>
                )}
            </div>

        </div>
    )
}

export default RestaurantOrders