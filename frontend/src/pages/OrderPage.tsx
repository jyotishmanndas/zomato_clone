import { useEffect } from "react";
import { useParams } from "react-router";
import { useCustomerSingleOrderApi } from "../hooks/useOrderApi";
import { useSocket } from "../hooks/useSocket";
import { useQueryClient } from "@tanstack/react-query";
import type { IOrder } from "../types";

const steps = ["Placed", "Confirmed", "Cooking", "On the way", "Delivered"] as const;

const getStepIndex = (status: IOrder["status"]) => {
  switch (status) {
    case "pending":
      return 0;
    case "confirmed":
    case "accepted":
      return 1;
    case "preparing":
    case "ready_for_rider":
      return 2;
    case "rider_assigned":
    case "picked_up":
      return 3;
    case "delivered":
      return 4;
    default:
      return 0;
  }
};

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
        queryKey: ["order"],
      });
    };
    socket.on("order:update", onOrderUpdate);
    socket.off("order:rider_assigned", onOrderUpdate);

    return () => {
      socket.off("order:update", onOrderUpdate);
      socket.off("order:rider_assigned", onOrderUpdate);
    };
  }, [socketRef, queryClient]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-[color:var(--color-text-secondary)]">
        Loading orders...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center text-[color:var(--color-text-secondary)]">
        No order found
      </div>
    );
  }

  const currentStep = getStepIndex(data.status);

  const etaMinutes =
    data.status === "delivered"
      ? null
      : Math.max(15, Math.min(55, Math.round(data.distance * 8)));

  return (
    <div className="mx-auto max-w-4xl px-4 pb-24 pt-24">
      <section className="mb-6 rounded-3xl bg-[color:var(--color-surface)] p-5 shadow-sm ring-1 ring-[color:var(--color-divider)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="meta-text mb-0.5">
              ORDER ID #{data._id.slice(-6).toUpperCase()}
            </p>
            <h1 className="font-display text-[20px] font-extrabold text-[color:var(--color-charcoal)]">
              {data.restaurantName}
            </h1>
          </div>
          {etaMinutes && (
            <div className="text-right">
              <p className="meta-text mb-0.5">Estimated delivery in</p>
              <p className="font-display text-[22px] font-extrabold text-[color:var(--color-brand-red)]">
                {etaMinutes} mins
              </p>
            </div>
          )}
        </div>

        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between">
            {steps.map((label, index) => {
              const isCompleted = index <= currentStep;
              return (
                <div key={label} className="flex flex-1 flex-col items-center">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${isCompleted
                      ? "bg-[color:var(--color-brand-red)] text-white"
                      : "bg-[color:var(--color-divider)] text-[color:var(--color-text-secondary)]"
                      }`}
                  >
                    {index + 1}
                  </div>
                  <p className="mt-1 text-[10px] font-medium text-[color:var(--color-text-secondary)]">
                    {label}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="relative mt-1 h-1 rounded-full bg-[color:var(--color-divider)]">
            <div
              className="absolute left-0 top-0 h-1 rounded-full bg-[color:var(--color-brand-red)] transition-all"
              style={{
                width: `${(currentStep / (steps.length - 1)) * 100}%`,
              }}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-[2fr,1.3fr]">
        <div className="space-y-4 rounded-3xl bg-[color:var(--color-surface)] p-5 shadow-sm ring-1 ring-[color:var(--color-divider)]">
          <h2 className="text-sm font-semibold text-[color:var(--color-charcoal)]">
            Items in this order
          </h2>
          <div className="space-y-3 text-sm">
            {data.items.map((item: any, i: number) => (
              <div
                key={i}
                className="flex items-center justify-between border-b border-[color:var(--color-divider)] pb-2 last:border-b-0 last:pb-0"
              >
                <span className="text-[color:var(--color-charcoal)]">
                  {item.name}{" "}
                  <span className="text-[color:var(--color-text-secondary)]">
                    × {item.quantity}
                  </span>
                </span>
                <span className="font-price text-sm font-semibold text-[color:var(--color-charcoal)]">
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2 rounded-3xl bg-[color:var(--color-surface)] p-4 shadow-sm ring-1 ring-[color:var(--color-divider)]">
            <h2 className="text-sm font-semibold text-[color:var(--color-charcoal)]">
              Delivery address
            </h2>
            <p className="text-xs text-[color:var(--color-text-secondary)]">
              {data.deliveryAddress.formattedAddress}
            </p>
            <p className="text-xs text-[color:var(--color-text-secondary)]">
              Mobile: {data.deliveryAddress.mobile}
            </p>
          </div>

          <div className="space-y-2 rounded-3xl bg-[color:var(--color-surface)] p-4 shadow-sm ring-1 ring-[color:var(--color-divider)]">
            <h2 className="text-sm font-semibold text-[color:var(--color-charcoal)]">
              Bill summary
            </h2>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-[color:var(--color-text-secondary)]">
                <span>Item total</span>
                <span className="font-price font-semibold">
                  ₹{data.subtotal}
                </span>
              </div>
              <div className="flex justify-between text-[color:var(--color-text-secondary)]">
                <span>Delivery partner fee</span>
                <span className="font-price font-semibold">
                  ₹{data.deliveryFee}
                </span>
              </div>
              <div className="flex justify-between text-[color:var(--color-text-secondary)]">
                <span>Taxes and charges</span>
                <span className="font-price font-semibold">₹{data.tax}</span>
              </div>
              <div className="mt-2 border-t border-[color:var(--color-divider)] pt-2">
                <div className="flex justify-between text-sm font-bold text-[color:var(--color-charcoal)]">
                  <span>Paid via {data.paymentMethod}</span>
                  <span className="font-price text-base">₹{data.total}</span>
                </div>
              </div>
              <p className="mt-1 text-[10px] text-[color:var(--color-text-secondary)]">
                Payment status:{" "}
                <span className="capitalize">{data.paymentStatus}</span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OrderPage;