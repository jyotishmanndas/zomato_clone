import { axiosInstance } from "../config/axiosInstance";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import { useAppDispatch } from "../hooks/useRedux";
import { setUser } from "../features/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const responseGoogle = async (authResult: any) => {
    try {
      const res = await axiosInstance.post(`/api/v1/auth/login`, {
        code: authResult["code"],
      });

      if (res.status === 200) {
        dispatch(setUser(res.data.data));
        toast.success(res.data.msg);

        if (res.data.data.role === "customer") navigate("/home");
        else if (res.data.data.role === "seller") navigate("/restaurant");
        else if (res.data.data.role === "rider") navigate("/rider");
        else navigate("/select-role");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.msg);
      }
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  return (
    <div className="h-screen overflow-hidden flex items-center justify-center bg-[color:var(--color-bg-blush)] px-4">
      <div className="w-full max-w-md rounded-[28px] bg-[color:var(--color-surface)] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.08)] ring-1 ring-[color:var(--color-divider)]">

        <div className="text-center">
          <h1 className="font-display text-3xl font-extrabold text-[color:var(--color-brand-red)]">
            zomato
          </h1>
          <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">
            India’s best food delivery app
          </p>
        </div>

        <div className="mt-8 text-center">
          <h2 className="text-xl font-bold text-[color:var(--color-charcoal)]">
            Login or Sign up
          </h2>
          <p className="text-xs text-[color:var(--color-text-secondary)] mt-1">
            Continue with Google
          </p>
        </div>

        <button
          onClick={googleLogin}
          className="mt-6 flex h-[52px] w-full items-center justify-center gap-3 rounded-xl border border-[color:var(--color-divider)] bg-white text-sm font-semibold text-[color:var(--color-charcoal)] shadow-sm transition hover:bg-[color:var(--color-bg-blush)] active:scale-[0.98]"
        >
          <FcGoogle size={20} />
          Continue with Google
        </button>

        <p className="mt-6 text-center text-[11px] text-[color:var(--color-text-secondary)] leading-relaxed">
          By continuing, you agree to our{" "}
          <span className="text-[color:var(--color-brand-red)] font-semibold">
            Terms
          </span>{" "}
          and{" "}
          <span className="text-[color:var(--color-brand-red)] font-semibold">
            Privacy Policy
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;