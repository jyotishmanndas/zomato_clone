import React, { useEffect, useState } from 'react'
import { useAddressApi } from '../hooks/useAddressApi';
import { useFetchedCart } from '../hooks/useCartApi';
import { axiosInstance } from '../config/axiosInstance';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import { CreditCard, MapPin } from 'lucide-react';


const Checkout = () => {
    const navigate = useNavigate();
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)

    const { data: address = [] } = useAddressApi();
    const { data: cartDetails, isLoading } = useFetchedCart();

    console.log(address);
    console.log(cartDetails);

    useEffect(() => {
        if (address.length > 0 && !selectedAddressId) {
            setSelectedAddressId(address[0]._id);
        }
    }, [address]);

    const cart = cartDetails?.cart;
    const subTotal = cartDetails?.subTotal ?? 0;
    const restaurant = cart?.restaurantId

    const deliveryFee = subTotal < 300 ? 40 : 0;
    const tax = Math.round(subTotal * 0.05);
    const totalAmount = subTotal + deliveryFee + tax;

    console.log("restaurant", restaurant);

    const createOrder = async (paymentMethod: "razorpay") => {
        if (!selectedAddressId) {
            toast.error("Please select address");
            return null;
        }
        try {
            const { data } = await axiosInstance.post(`/api/v1/order/create`, {
                paymentMethod,
                addressId: selectedAddressId
            });
            return data;
        } catch (error) {
            toast.error("Failed to create order")
        }
    };

    const payWithRazorpay = async () => {
        if (!restaurant?.isOpen) {
            toast.error("Restaurant is closed");
            return;
        }
        try {
            const order = await createOrder("razorpay");
            if (!order) return;

            const { orderId, amount } = order;
            const { data } = await axiosInstance.post(`/api/v1/payment/create`, { orderId })

            const { razorpayOrderId, key } = data;

            const options = {
                key,
                amount: amount * 100,
                currency: "INR",
                name: "Zomato",
                order_id: razorpayOrderId,
                handler: async (response: any) => {
                    try {
                        await axiosInstance.post(`/api/v1/payment/verify`, {
                            razorpay_order_id: response.razorpay_order_id, razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            orderId
                        });
                        toast.success("Payment successfull");
                        navigate(`/paymentsuccess/${response.razorpay_payment_id}`)
                    } catch (error) {
                        toast.error("payment verification failed")
                    }
                }
            };
            const razorpay = new (window as any).Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.log(error);
            toast.error("Payment Failed please refresh page")
        }
    }

    if (!cart || !restaurant) {
        return <div>
            Your cart is empty
        </div>
    };

    return (
        <div className='mx-auto max-w-4xl px-4 py-6 space-y-6'>
            <h1 className='text-2xl font-bold'>Checkout</h1>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-6">
                <div className="w-24 h-24 rounded-2xl overflow-hidden">
                    <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="flex-1">
                    <h2 className="text-2xl font-black text-slate-900">
                        {restaurant.name}
                    </h2>

                    <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                        <MapPin size={14} />
                        <span>
                            {restaurant.autoLocation?.formattedAddress}
                        </span>
                    </div>

                    <div className="flex items-center gap-3 mt-2">
                        <span
                            className={`text-xs px-3 py-1 rounded-full font-semibold ${restaurant.isOpen
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-600"
                                }`}
                        >
                            {restaurant.isOpen ? "Open" : "Closed"}
                        </span>

                        {restaurant.isVerified && (
                            <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-600 font-semibold">
                                Verified
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className='rounded-xl bg-white p-4 shadow-sm space-y-3'>
                <h2 className='font-bold'>Delivery Address</h2>

                {address.length === 0 ? (
                    <p className='text-sm text-gray-500'>No address found. Please add one</p>
                ) : (
                    address.map((addr: any) => (
                        <div
                            key={addr._id}
                            onClick={() => setSelectedAddressId(addr._id)}
                            className={`p-3 rounded-xl border cursor-pointer ${selectedAddressId === addr._id
                                ? "border-red-500 bg-red-50"
                                : "border-slate-200"
                                }`}
                        >
                            <p className='font-medium'>{addr.label}</p>
                            <p className='text-sm text-slate-500'>{addr.formattedAddress}</p>
                            <p className='text-sm text-gray-400 mt-1'>{addr.mobile}</p>
                        </div>
                    ))
                )}
            </div>

            <div className='rounded-xl bg-white p-4 shadow-sm space-y-4'>
                <h3 className='font-semibold'>Order Summary</h3>

                {cart.items.map((c: any) => {
                    const item = c.itemId;

                    return <div key={c._id} className='flex justify-between text-sm'>
                        <span>
                            {item.name} x {c.quantity}
                        </span>
                        <span>₹{item.price * c.quantity}</span>
                    </div>
                })}

                <hr />

                <div className='flex justify-between text-sm'>
                    <span>Items ({cart.items.length})</span>
                    <span>₹{subTotal}</span>
                </div>
                <div className='flex justify-between text-sm'>
                    <span>Delivery Fee</span>
                    <span>{deliveryFee === 0 ? "Free" : `${deliveryFee}`}</span>
                </div>
                <div className='flex justify-between text-sm'>
                    <span>Tax</span>
                    <span>{tax}</span>
                </div>
                <div className="border-t pt-4 flex justify-between font-black text-medium text-slate-900">
                    <span>Total</span>
                    <span>₹ {totalAmount}</span>
                </div>
            </div>

            <div className='rounded-xl bg-white p-4 shadow-sm space-y-3'>
                <h3 className='font-semibold'>Payment Method</h3>

                <button disabled={!selectedAddressId}
                onClick={payWithRazorpay}                
                className='w-full flex items-center justify-center gap-3 rounded-lg bg-blue-500 py-3 font-semibold text-white disabled:opacity-50'>
                    <CreditCard size={18} />
                    Pay With Razorpay
                </button>
            </div>
        </div>
    )
}

export default Checkout