import axios from "axios";
import { Request, Response } from "express";
import { razorpay, verifyRazorpaySignature } from "../config/razorpay";
import { publishPaymentSuccess } from "../config/payment.producer";

export const createRazorpayOrder = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.body;

        const { data } = await axios.get(`${process.env.RESTAURANT_SERVICE}/api/v1/order/payment/${orderId}`, {
            headers: {
                "x-internal-key": process.env.INTERNAL_SERVICE_KEY
            }
        });

        const razorpayOrder = await razorpay.orders.create({
            amount: data.amount * 100,
            currency: "INR",
            receipt: orderId
        });

        return res.status(200).json({
            razorpayOrderId: razorpayOrder.id,
            key: process.env.RAZORPAY_KEY_SECRET
        })
    } catch (error) {
        console.log("Something went wrong while payment", error);
        return res.status(500).json({ msg: "Internal server error" })
    }
};

export const verifyRazorpayPayment = async (req: Request, res: Response) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

        const isValid = verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);

        if (!isValid) {
            return res.status(400).json({ msg: "Payment verification failed" })
        };

        await publishPaymentSuccess({ orderId, paymentId: razorpay_payment_id, provider: "razorpay" });

        return res.status(200).json({ msg: "payment verified successfully" })

    } catch (error) {
        console.log("Error while verify payment");
        return res.status(500).json({ msg: "Internal server error" })
    }
}