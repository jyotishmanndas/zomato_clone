import React from "react";
import { Minus, Plus, Trash2, MapPin } from "lucide-react";
import { useFetchedCart } from "../hooks/useCartApi";
import { axiosInstance } from "../config/axiosInstance";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const Cart = () => {
  const { data, isLoading } = useFetchedCart();
  const queryClient = useQueryClient();

  const invalidateCart = () => {
    queryClient.invalidateQueries({ queryKey: ["cart"] });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Loading cart...
      </div>
    );
  }

  if (!data?.cart || data.cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-slate-900">
          Your cart is empty
        </h2>
        <p className="text-slate-500 mt-2">
          Add some delicious items to get started 🍽
        </p>
      </div>
    );
  }

  const { cart, subTotal } = data;
  const restaurant = cart.restaurantId;

  const deliveryFee = subTotal < 300 ? 40 : 0;
  const tax = Math.round(subTotal * 0.05);
  const total = subTotal + deliveryFee + tax;

  const incrementQty = async (id: string) => {
    try {
      await axiosInstance.post(`/api/v1/cart/increment`, { itemId: id });
      invalidateCart();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const decrementQty = async (id: string) => {
    try {
      await axiosInstance.post(`/api/v1/cart/decrement`, { itemId: id });
      invalidateCart();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const removeFromCart = async (id: string) => {
    try {
      await axiosInstance.post(`/api/v1/cart/remove/${id}`);
      invalidateCart();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 space-y-8">

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
                {restaurant.autoLocation?.formattedAddress?.split(",")[0]}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-6">
            <h3 className="text-xl font-bold text-slate-900">
              Cart Items
            </h3>

            {cart.items.map((item: any) => (
              <div
                key={item._id}
                className="flex items-center justify-between gap-6 border-b pb-6 last:border-none last:pb-0"
              >
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden">
                    <img
                      src={item.itemId.image.url || item.itemId.image}
                      alt={item.itemId.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900">
                      {item.itemId.name}
                    </h4>
                    <p className="text-sm text-slate-500">
                      ₹ {item.itemId.price}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center bg-slate-100 rounded-xl px-2 py-1">
                    <button
                      onClick={() => decrementQty(item.itemId._id)}
                      className="p-1 hover:bg-white rounded-lg transition"
                    >
                      <Minus size={16} />
                    </button>

                    <span className="px-4 font-bold text-slate-900">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => incrementQty(item.itemId._id)}
                      className="p-1 hover:bg-white rounded-lg transition"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <p className="font-bold text-slate-900 w-20 text-right">
                    ₹ {item.itemId.price * item.quantity}
                  </p>

                  <button
                    onClick={() => removeFromCart(item.itemId._id)}
                    className="text-slate-400 hover:text-red-500 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 h-fit sticky top-28">
            <h3 className="text-xl font-bold text-slate-900 mb-6">
              Order Summary
            </h3>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>₹ {subTotal}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Delivery Fee</span>
                <span>₹ {deliveryFee}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Taxes</span>
                <span>₹ {tax}</span>
              </div>

              <div className="border-t pt-4 flex justify-between font-black text-lg text-slate-900">
                <span>Total</span>
                <span>₹ {total}</span>
              </div>

              {subTotal < 300 && (
                <p className="text-sm text-gray-500">
                  Add items worth ₹{300 - subTotal} more to get Free delivery
                </p>
              )}
            </div>

            <button
              disabled={!restaurant.isOpen}
              className={`w-full mt-8 py-3 rounded-2xl font-bold transition-all ${restaurant.isOpen
                ? "bg-[#E23744] hover:bg-black text-white"
                : "bg-slate-300 text-slate-500 cursor-not-allowed"
                }`}
            >
              {restaurant.isOpen
                ? "Proceed to Checkout"
                : "Restaurant Closed"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;