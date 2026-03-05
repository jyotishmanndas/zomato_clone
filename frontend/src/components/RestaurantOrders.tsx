import React, { useEffect, useRef, useState } from 'react'
import audio from "../assets/resAudio.mp3";
import { useOrderApi } from '../hooks/useOrderApi';
import { useSocket } from '../hooks/useSocket';
import { ACTIVE_STATUSES } from '../types';
import OrderCard from './OrderCard';
import { useQueryClient } from "@tanstack/react-query";

const RestaurantOrders = ({ restaurantId }: { restaurantId: string }) => {
    const queryClient = useQueryClient();
    const [audioUnlocked, setAudioUnlocked] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const { data, isLoading } = useOrderApi(restaurantId);
    const socketRef = useSocket();

    const unlockAudio = () => {
        if (audioRef.current) {
            audioRef.current.play().then(() => {
                audioRef.current!.pause();
                audioRef.current!.currentTime = 0;
                setAudioUnlocked(true)
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

    if (isLoading) {
        return <div className='h-screen flex items-center justify-center text-gray-500'>Loading order</div>
    };

    const activeOrder = data.orders.filter((o: any) => ACTIVE_STATUSES.includes(o.status));
    const completeOrder = data.orders.filter((o: any) => !ACTIVE_STATUSES.includes(o.status));

    return (
        <div className='space-y-6'>
            {!audioUnlocked && (
                <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        <span className='text-2xl'>🔔</span>
                        <div>
                            <p className='font-medium text-blue-900'>Enable sound notification</p>
                            <p className='text-sm text-blue-700'>Get notified when new orders arrive</p>
                        </div>
                    </div>
                    <button onClick={unlockAudio} className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition'>Enable sound</button>
                </div>
            )}


            <div className='space-y-3'>
                <h3 className='text-lg font-semibold'>Active Orders</h3>

                {activeOrder.length === 0 ? (
                    <p className='flex items-center justify-center text-sm text-gray-500'>No Active orders</p>
                ) : (
                    <div className='grid grid-cols-2 gap-4'>
                        {activeOrder.map((order: any) => (
                            <OrderCard key={order._id} order={order} />
                        ))}
                    </div>
                )}
            </div>

            <div className='space-y-3'>
                <h3 className='text-lg font-semibold'>Completed Orders</h3>

                {completeOrder.length === 0 ? (
                    <p className='flex items-center justify-center text-sm text-gray-500'>No Completed orders</p>
                ) : (
                    <div className='grid grid-cols-2 gap-4'>
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