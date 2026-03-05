import { Cart } from "../models/cart.models";
import { Order } from "../models/order.model";
import { getIO } from "../socket/socket";
import { getChannel } from "./rabbitmq";

export const startPaymentConsumer = async () => {
    const channel = getChannel();

    channel.consume(process.env.PAYMENT_QUEUE!, async (msg) => {
        if (!msg) return;

        try {
            const event = JSON.parse(msg.content.toString());
            if (event.type !== "PAYMENT_SUCCESS") {
                channel.ack(msg);
                return;
            };

            const { orderId, paymentId } = event.data;
            const order = await Order.findOneAndUpdate(
                {
                    _id: orderId,
                    paymentStatus: {
                        $ne: "paid"
                    }
                },
                {
                    $set: {
                        paymentStatus: "paid",
                        status: "confirmed",
                        paymentId: paymentId
                    },
                    $unset: {
                        expiresAt: 1
                    }
                }
            );
            if (!order) {
                channel.ack(msg);
                return
            };

            await Cart.deleteOne({ ownerId: order.userId });

            const io = getIO();
            io.to(`restaurant:${order.restaurantId}`).emit("order:new", order)

            console.log("Order placed: ", order._id);
            channel.ack(msg);
        } catch (error) {
            console.log("payment consumer error", error);
        }
    })
};