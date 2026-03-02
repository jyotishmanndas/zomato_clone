import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./db/db";
import app from "./app";
import { connectRabbitMQ } from "./config/rabbitmq";

const PORT = process.env.PORT || 3000;


const startServer = async () => {
    try {
        await connectDB();
        await connectRabbitMQ();

        app.listen(PORT, () => {
            console.log(`Server is running on the port ${PORT}`);
        })
    } catch (error) {
        console.log("Server failed to start: ", error);
        process.exit(1);
    }
};


startServer();



