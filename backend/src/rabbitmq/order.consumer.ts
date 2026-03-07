import { Rider } from "../models/rider.model";
import { getIO } from "../socket/socket";
import { getChannel } from "./rabbitmq"

export const startOrderReadyConsumer = async () => {
    const channel = getChannel();

    channel.consume(process.env.ORDER_READY_QUEUE!, async (msg) => {
        if (!msg) return;

        try {
            const event = JSON.parse(msg.content.toString());
            if (event.type !== "ORDER_READY_FOR_RIDER") {
                channel.ack(msg);
                return;
            };

            const { orderId, restaurantId, location } = event.data;

            const riders = await Rider.find({
                isVerified: true,
                isAvailable: true,
                location: {
                    $near: {
                        $geometry: location,
                        $maxDistance: 500
                    }
                }
            });

            if (riders.length === 0) {
                console.log("No rider available for nearby");
                channel.ack(msg);
                return;
            };

            const io = getIO();

            for (const rider of riders) {
                io.to(`user:${rider.userId}`).emit("order:available", { orderId, restaurantId });

                console.log(`Notified rider ${rider.userId} successfully`);
            };

            channel.ack(msg);
            console.log(`Message acknowledge`);
        } catch (error) {
            console.log(`OrderReady consumer error`, error);
        }
    })
}