import React, { useEffect } from 'react'
import { useParams } from 'react-router'
import { useCustomerSingleOrderApi } from '../hooks/useOrderApi'
import { useSocket } from '../hooks/useSocket';
import { useQueryClient } from '@tanstack/react-query';

const OrderPage = () => {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const socketRef = useSocket();

  const { data, isLoading } = useCustomerSingleOrderApi(id);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const onOrderUpdate = () => {
      queryClient.invalidateQueries({
        queryKey: ["order"]
      });
    };
    socket.on("order:update", onOrderUpdate);

    return () => {
      socket.off("order:update", onOrderUpdate)
    };

  }, [socketRef])

  if (isLoading) {
    return <div className='flex items-center justify-center'>Loading orders...</div>
  };

  if (data.length === 0) {
    return (
      <div className='flex items-center justify-center'>
        No order found
      </div>
    )
  };

  return (
    <div className='mx-auto max-w-3xl px-6 py-20 space-y-6'>
      <h1 className='text-xl font-bold'>Order #{data._id.slice(-6)}</h1>
      <div className='rounded-lg bg-blue-50 p-3 text-sm font-medium'>
        Status: <span className='capitalize'>{data.status}</span>
      </div>

      <div className='rounded-lg bg-white p-4 shadow-sm space-y-2'>
        <h2 className='font-semibold'>Items</h2>

        {data.items.map((item: any, i: any) => (
          <div key={i} className='flex justify-between text-sm'>
            <span>
              {item.name} x {item.quantity}
            </span>
            <span>
              {item.price * item.quantity}
            </span>
          </div>
        ))}
      </div>

      <div className='rounded-xl bg-white shadow-sm p-4 space-y-1'>
        <h2 className='font-semibold'>Delivery Address</h2>
        <p className='text-sm text-gray-600'>
          {data.deliveryAddress.formattedAddress}
        </p>
        <p className='text-sm text-gray-600'>Mobile: {data.deliveryAddress.mobile}</p>
      </div>

      <div className='rounded-xl bg-white shadow-sm p-4 space-y-2'>
        <div className="flex justify-between text-sm">
          <span>SubTotal</span> <span>₹{data.subtotal}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Delivery Fee</span> <span>₹{data.deliveryFee}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Tax</span> <span>₹{data.tax}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Total</span> <span>₹{data.total}</span>
        </div>

        <p className='text-xs text-gray-500'>Payment Method: {data.paymentMethod}</p>
        <p className='text-xs text-gray-500'>Payment Status: {data.paymentStatus}</p>
      </div>
    </div>
  )
}

export default OrderPage