import type { IOrder } from "../../types";
import RiderOrderRequest from "../RiderOrderRequest";
import RiderCurrentOrder from "../RiderCurrentOrder";
import RiderOrderMap from "../RiderOrderMap";

type RiderOrdersSectionProps = {
  isAvailable: boolean;
  incomingOrders: string[];
  audioUnlocked: boolean;
  onEnableSound: () => void;
  currentRiderOrder?: IOrder[];
  onOrderAccepted: (orderId: string) => void;
};

export default function RiderOrdersSection({
  isAvailable,
  incomingOrders,
  audioUnlocked,
  onEnableSound,
  currentRiderOrder,
  onOrderAccepted
}: RiderOrdersSectionProps) {
  return (
    <section className="space-y-4">
      {!audioUnlocked && (
        <div className="flex items-center justify-between gap-3 rounded-3xl bg-blue-50 p-4 text-xs text-blue-900 ring-1 ring-blue-100">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔔</span>

            <div>
              <p className="text-sm font-semibold">Enable sound notifications</p>
              <p className="text-[11px]">
                Get a chime whenever a new order is assigned to you.
              </p>
            </div>
          </div>

          <button
            onClick={onEnableSound}
            className="rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
          >
            Enable sound
          </button>
        </div>
      )}

      <div className="space-y-3 rounded-3xl bg-surface p-5 shadow-sm ring-1 ring-divider">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-charcoal">Incoming orders</h3>

          {isAvailable ? (
            <span className="meta-text">
              {incomingOrders.length > 0
                ? `${incomingOrders.length} new`
                : "Waiting for new orders"}
            </span>
          ) : (
            <span className="meta-text">Go online to receive orders</span>
          )}
        </div>

        {isAvailable && incomingOrders.length > 0 && (
          <div className="space-y-3">
            {incomingOrders.map((orderId) => (
              <RiderOrderRequest
                key={orderId}
                orderId={orderId}
                onAccepted={onOrderAccepted}
              />
            ))}
          </div>
        )}

        {currentRiderOrder && currentRiderOrder.length > 0 && (
          <div className="space-y-4">
            {currentRiderOrder.map((order: IOrder) => (
              <div key={order._id} className="mx-auto max-w-md px-1 space-y-4">
                <RiderCurrentOrder order={order} />
                <RiderOrderMap order={order} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

