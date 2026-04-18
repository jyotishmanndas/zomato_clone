import dotenv from "dotenv";
dotenv.config({ quiet: true });
import { connectDB } from "./db/db";
import { connectRabbitMQ } from "./rabbitmq/rabbitmq";
import { startPaymentConsumer } from "./rabbitmq/payment.consumer";
import server from "./app";
import { startOrderReadyConsumer } from "./rabbitmq/order.consumer";

const PORT = process.env.PORT || 3000;


const startServer = async () => {
    try {
        await connectDB();

        await connectRabbitMQ();

        await startPaymentConsumer();
        await startOrderReadyConsumer();

        server.listen(PORT, () => {
            console.log(`Server is running on the port ${PORT}`);
        })
    } catch (error) {
        console.log("Server failed to start: ", error);
        process.exit(1);
    }
};


startServer();



