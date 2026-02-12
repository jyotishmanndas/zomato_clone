import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const instances = await mongoose.connect(`${process.env.MONGODB_URI}/zomato`);
        console.log("\n mongoDB connected successfully", instances.connection.host);
    } catch (error) {
        console.log("Error while connect to mongoDB", error);
        process.exit(1);
    }
};