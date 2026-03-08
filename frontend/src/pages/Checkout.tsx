import { useEffect, useState } from "react";
import { useAddressApi } from "../hooks/useAddressApi";
import { useFetchedCart } from "../hooks/useCartApi";
import { axiosInstance } from "../config/axiosInstance";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { CreditCard, MapPin } from "lucide-react";

const Checkout = () => {
  const navigate = useNavigate();
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );

  const { data: address = [] } = useAddressApi();
  const { data: cartDetails, isLoading } = useFetchedCart();

  useEffect(() => {
    if (address.length > 0 && !selectedAddressId) {
      setSelectedAddressId(address[0]._id);
    }
  }, [address, selectedAddressId]);

  const cart = cartDetails?.cart;
  const subTotal = cartDetails?.subTotal ?? 0;
  const restaurant = cart?.restaurantId;

  const deliveryFee = subTotal < 300 ? 40 : 0;
  const tax = Math.round(subTotal * 0.05);
  const totalAmount = subTotal + deliveryFee + tax;

  const createOrder = async (paymentMethod: "razorpay") => {
    if (!selectedAddressId) {
      toast.error("Please select an address");
      return null;
    }
    try {
      const { data } = await axiosInstance.post(`/api/v1/order/create`, {
        paymentMethod,
        addressId: selectedAddressId,
      });
      return data;
    } catch {
      toast.error("Failed to create order");
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
      const { data } = await axiosInstance.post(`/api/v1/payment/create`, {
        orderId,
      });

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
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId,
            });
            toast.success("Payment successful");
            navigate(`/paymentsuccess/${response.razorpay_payment_id}`);
          } catch {
            toast.error("Payment verification failed");
          }
        },
      };
      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.log(error);
      toast.error("Payment failed, please refresh the page");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[color:var(--color-bg-blush)] text-[color:var(--color-text-secondary)]">
        Loading checkout...
      </div>
    );
  }

  if (!cart || !restaurant) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[color:var(--color-bg-blush)] text-[color:var(--color-text-secondary)]">
        Your cart is empty
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[color:var(--color-bg-blush)] pt-24 pb-24">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4">
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="meta-text mb-1">STEP 2 OF 2</p>
            <h1 className="font-display text-[22px] font-extrabold text-[color:var(--color-charcoal)]">
              Review and pay
            </h1>
          </div>
          <div className="rounded-full bg-[color:var(--color-surface)] px-4 py-2 text-xs font-semibold text-[color:var(--color-text-secondary)] shadow-sm">
            Secure payment powered by Razorpay
          </div>
        </header>

        <section className="rounded-3xl bg-[color:var(--color-surface)] p-5 shadow-sm ring-1 ring-[color:var(--color-divider)]">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 overflow-hidden rounded-2xl">
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex-1">
              <h2 className="font-display text-[18px] font-extrabold text-[color:var(--color-charcoal)]">
                {restaurant.name}
              </h2>
              <div className="mt-1 flex items-center gap-2 text-xs text-[color:var(--color-text-secondary)]">
                <MapPin size={14} />
                <span>{restaurant.autoLocation?.formattedAddress}</span>
              </div>
              <div className="mt-2 flex items-center gap-2 text-[11px]">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    restaurant.isOpen
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {restaurant.isOpen ? "Open" : "Closed"}
                </span>
                {restaurant.isVerified && (
                  <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                    Verified partner
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-[1.6fr,1.4fr]">
          {/* Delivery address selection */}
          <div className="space-y-4 rounded-3xl bg-[color:var(--color-surface)] p-5 shadow-sm ring-1 ring-[color:var(--color-divider)]">
            <h2 className="text-sm font-semibold text-[color:var(--color-charcoal)]">
              Delivery address
            </h2>

            {address.length === 0 ? (
              <p className="text-xs text-[color:var(--color-text-secondary)]">
                No saved addresses found. Add an address from your profile or
                the address screen.
              </p>
            ) : (
              <div className="space-y-3">
                {address.map((addr: any) => (
                  <button
                    key={addr._id}
                    type="button"
                    onClick={() => setSelectedAddressId(addr._id)}
                    className={`w-full rounded-2xl border px-4 py-3 text-left text-xs transition ${
                      selectedAddressId === addr._id
                        ? "border-[color:var(--color-brand-red)] bg-[color:var(--color-bg-blush)]"
                        : "border-[color:var(--color-divider)] bg-[color:var(--color-surface)] hover:border-[color:var(--color-brand-red)]/40"
                    }`}
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[color:var(--color-text-secondary)]">
                      {addr.label || "Address"}
                    </p>
                    <p className="mt-1 text-[13px] text-[color:var(--color-charcoal)]">
                      {addr.formattedAddress}
                    </p>
                    <p className="mt-1 text-[11px] text-[color:var(--color-text-secondary)]">
                      Mobile: {addr.mobile}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Order summary + payment */}
          <div className="space-y-4">
            <div className="space-y-3 rounded-3xl bg-[color:var(--color-surface)] p-5 shadow-sm ring-1 ring-[color:var(--color-divider)]">
              <h3 className="text-sm font-semibold text-[color:var(--color-charcoal)]">
                Order summary
              </h3>

              <div className="space-y-2 text-xs">
                {cart.items.map((c: any) => {
                  const item = c.itemId;
                  return (
                    <div
                      key={c._id}
                      className="flex justify-between border-b border-[color:var(--color-divider)] pb-1 last:border-b-0 last:pb-0"
                    >
                      <span className="text-[color:var(--color-charcoal)]">
                        {item.name}{" "}
                        <span className="text-[color:var(--color-text-secondary)]">
                          × {c.quantity}
                        </span>
                      </span>
                      <span className="font-price font-semibold text-[color:var(--color-charcoal)]">
                        ₹{item.price * c.quantity}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-2 space-y-2 text-xs">
                <div className="flex justify-between text-[color:var(--color-text-secondary)]">
                  <span>Items ({cart.items.length})</span>
                  <span className="font-price font-semibold">₹{subTotal}</span>
                </div>
                <div className="flex justify-between text-[color:var(--color-text-secondary)]">
                  <span>Delivery partner fee</span>
                  <span className="font-price font-semibold">
                    {deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-[color:var(--color-text-secondary)]">
                  <span>Tax</span>
                  <span className="font-price font-semibold">₹{tax}</span>
                </div>
                <div className="mt-2 border-t border-[color:var(--color-divider)] pt-2">
                  <div className="flex justify-between text-sm font-bold text-[color:var(--color-charcoal)]">
                    <span>To pay</span>
                    <span className="font-price text-base">
                      ₹ {totalAmount}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 rounded-3xl bg-[color:var(--color-surface)] p-5 shadow-sm ring-1 ring-[color:var(--color-divider)]">
              <h3 className="text-sm font-semibold text-[color:var(--color-charcoal)]">
                Payment method
              </h3>

              <button
                disabled={!selectedAddressId || !restaurant?.isOpen}
                onClick={payWithRazorpay}
                className="btn-primary flex items-center justify-center gap-2 disabled:cursor-not-allowed"
              >
                <CreditCard size={18} />
                Pay with Razorpay
              </button>

              {!restaurant?.isOpen && (
                <p className="text-[11px] text-[color:var(--color-text-secondary)]">
                  This restaurant is currently closed. You won’t be able to
                  place an order right now.
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Checkout;