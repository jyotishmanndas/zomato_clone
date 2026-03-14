import React, { useEffect, useState } from 'react'
import { axiosInstance } from '../config/axiosInstance';
import toast from 'react-hot-toast';
import axios from 'axios';

const RiderOrderRequest = ({ orderId }: { orderId: string }) => {
    const [accepting, setAccepting] = useState(false);
    const [secondsLeft, setSecondLeft] = useState(10);

    useEffect(() => {
        const interval = setInterval(() => {
            setSecondLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1
            })
        }, 1000);

        return () => {
            clearInterval(interval)
        }
    }, []);

    const acceptOrder = async () => {
        try {
            setAccepting(true);
            const res = await axiosInstance.put(`/api/v1/rider/accept/${orderId}`);

            if (res.status === 200) {
                toast.success("Order accepted")
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data.msg)
            }
        } finally{
            setAccepting(false);
        }
    }

    return (
        <div className='rounded-xl bg-white p-4 shadow-sm border border-green-300 space-y-3'>
            <p className='text-center text-xs font-semibold text-red-600'>
                Accept within {secondsLeft}
            </p>
            <p className='text-center text-xs font-semibold text-green-600'>
                New Delivery Request
            </p>
            <p className='text-xs text-gray-600'>
                Order ID: <b>{orderId.slice(-6)}</b>
            </p>

            <button disabled={accepting || secondsLeft === 0} onClick={acceptOrder} className='w-full rounded-lg bg-green-600 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50'>
                {accepting ? "Accepting..." : "Accept Order"}
            </button>
        </div>
    )
}

export default RiderOrderRequest