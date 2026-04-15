import { Minus, Plus, Trash2, MapPin } from "lucide-react";
import { useFetchedCart } from "../hooks/useCartApi";
import { axiosInstance } from "../config/axiosInstance";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const Cart = () => {
  const navigate = useNavigate()
  const { data, isLoading } = useFetchedCart();
  const queryClient = useQueryClient();

  const invalidateCart = () => {
    queryClient.invalidateQueries({ queryKey: ["cart"] });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-[color:var(--color-text-secondary)]">
        Loading cart...
      </div>
    );
  }

  if (!data?.cart || data.cart.items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[color:var(--color-bg-blush)] px-4 pt-24 text-center">
        <h2 className="font-display text-2xl font-extrabold text-[color:var(--color-charcoal)]">
          Your cart is empty
        </h2>
        <p className="mt-2 text-sm text-[color:var(--color-text-secondary)]">
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
    <div className="min-h-screen bg-[color:var(--color-bg-blush)] pt-24 pb-24">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4">

        <div className="flex items-center gap-6 rounded-3xl bg-[color:var(--color-surface)] p-6 shadow-sm ring-1 ring-[color:var(--color-divider)]">
          <div className="h-20 w-20 overflow-hidden rounded-2xl">
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1">
            <h2 className="font-display text-[20px] font-extrabold text-[color:var(--color-charcoal)]">
              {restaurant.name}
            </h2>

            <div className="mt-1 flex items-center gap-2 text-xs text-[color:var(--color-text-secondary)]">
              <MapPin size={14} />
              <span>
                {restaurant.autoLocation?.formattedAddress?.split(",")[0]}
              </span>
            </div>

            <div className="mt-2 flex items-center gap-3">
              <span
                className={`text-xs px-3 py-1 rounded-full font-semibold ${restaurant.isOpen
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"
                  }`}
              >
                {restaurant.isOpen ? "Open" : "Closed"}
              </span>

              {restaurant.isVerified && (
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-600">
                  Verified
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">

          <div className="lg:col-span-2 space-y-4 rounded-3xl bg-[color:var(--color-surface)] p-5 shadow-sm ring-1 ring-[color:var(--color-divider)]">
            <h3 className="text-[18px] font-bold text-[color:var(--color-charcoal)]">
              Cart items
            </h3>

            {cart.items.map((item: any) => (
              <div
                key={item._id}
                className="flex items-center justify-between gap-4 border-b border-[color:var(--color-divider)] pb-4 last:border-b-0 last:pb-0"
              >
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 overflow-hidden rounded-2xl">
                    <img
                      src={item.itemId.image.url || item.itemId.image}
                      alt={item.itemId.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-[color:var(--color-charcoal)]">
                      {item.itemId.name}
                    </h4>
                    <p className="font-price text-xs font-semibold text-[color:var(--color-text-secondary)]">
                      ₹ {item.itemId.price}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center rounded-full bg-[color:var(--color-divider)] px-2 py-1">
                    <button
                      onClick={() => decrementQty(item.itemId._id)}
                      className="rounded-full p-1 transition hover:bg-[color:var(--color-surface)]"
                    >
                      <Minus size={16} />
                    </button>

                    <span className="px-3 text-sm font-semibold text-[color:var(--color-charcoal)]">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => incrementQty(item.itemId._id)}
                      className="rounded-full p-1 transition hover:bg-[color:var(--color-surface)]"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <p className="w-20 text-right font-price text-sm font-bold text-[color:var(--color-charcoal)]">
                    ₹ {item.itemId.price * item.quantity}
                  </p>

                  <button
                    onClick={() => removeFromCart(item.itemId._id)}
                    className="text-[color:var(--color-text-secondary)] transition hover:text-[color:var(--color-brand-red)]"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="sticky top-24 h-fit space-y-4 rounded-3xl bg-[color:var(--color-surface)] p-5 shadow-sm ring-1 ring-[color:var(--color-divider)]">
            <h3 className="mb-3 text-[18px] font-bold text-[color:var(--color-charcoal)]">
              Bill details
            </h3>

            {/* <div className="rounded-2xl bg-[color:var(--color-bg-blush)]/60 p-3 text-xs text-[color:var(--color-text-secondary)]">
              <div className="flex items-center gap-2">
                <Scissors className="h-3.5 w-3.5" />
                <span>Have a promo code? Apply it on the next step.</span>
              </div>
            </div> */}

            <div className="space-y-4 text-sm">
              <div className="flex justify-between text-[color:var(--color-text-secondary)]">
                <span>Item total</span>
                <span className="font-price font-semibold">₹ {subTotal}</span>
              </div>

              <div className="flex justify-between text-[color:var(--color-text-secondary)]">
                <span>Delivery partner fee</span>
                <span className="font-price font-semibold">
                  ₹ {deliveryFee}
                </span>
              </div>

              <div className="flex justify-between text-[color:var(--color-text-secondary)]">
                <span>Taxes and charges</span>
                <span className="font-price font-semibold">₹ {tax}</span>
              </div>

              <div className="mt-2 border-t border-[color:var(--color-divider)] pt-3">
                <div className="flex justify-between text-sm font-bold text-[color:var(--color-charcoal)]">
                  <span>To pay</span>
                  <span className="font-price text-base">₹ {total}</span>
                </div>
              </div>

              {subTotal < 300 && (
                <p className="text-xs text-[color:var(--color-text-secondary)]">
                  Add items worth ₹{300 - subTotal} more to get free delivery.
                </p>
              )}
            </div>

            <button
              disabled={!restaurant.isOpen}
              onClick={() => navigate("/checkout")}
              className="btn-primary mt-4"
            >
              {restaurant.isOpen ? "Place order" : "Restaurant closed"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;