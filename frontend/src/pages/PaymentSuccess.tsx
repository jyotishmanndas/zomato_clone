import { CheckCircle, Package, Home } from "lucide-react";
import { useParams, useNavigate } from "react-router";

const PaymentSuccess = () => {
    const { paymentId } = useParams<{ paymentId: string }>();
    const navigate = useNavigate();

    return (
        <div className="flex min-h-screen items-center justify-center bg-[color:var(--color-bg-blush)] px-4">
            <div className="w-full max-w-md rounded-3xl bg-[color:var(--color-surface)] p-8 text-center shadow-soft ring-1 ring-[color:var(--color-divider)]">
                <div className="mb-5 flex justify-center">
                    <CheckCircle
                        size={70}
                        className="text-[color:var(--color-success)]"
                    />
                </div>

                <h1 className="font-display text-2xl font-extrabold text-[color:var(--color-charcoal)]">
                    Payment Successful 🎉
                </h1>

                <p className="mt-2 text-sm text-[color:var(--color-text-secondary)]">
                    Your order has been placed successfully.
                    The restaurant is preparing your food.
                </p>

                <div className="mt-5 rounded-2xl bg-[color:var(--color-bg-blush)] p-3 text-xs text-[color:var(--color-text-secondary)]">
                    Payment ID
                    <div className="mt-1 font-price font-semibold text-[color:var(--color-charcoal)]">
                        {paymentId}
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[color:var(--color-text-secondary)]">
                    <Package size={14} />
                    <span>You will receive order updates shortly</span>
                </div>

                <div className="mt-6 space-y-3">

                    <button
                        onClick={() => navigate("/account?tab=orders")}
                        className="btn-primary flex items-center justify-center gap-2"
                    >
                        <Package size={18} />
                        Track Order
                    </button>

                    <button
                        onClick={() => navigate("/home")}
                        className="btn-outline w-full flex items-center justify-center gap-2"
                    >
                        <Home size={18} />
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;