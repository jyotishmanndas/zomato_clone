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
        navigate("/home");
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
    <div className="flex min-h-screen items-center justify-center bg-[color:var(--color-bg-blush)] px-4">
      <div className="grid w-full max-w-2xl gap-8 rounded-[2.5rem] bg-[color:var(--color-surface)] p-6 shadow-sm ring-1 ring-[color:var(--color-divider)] md:grid-cols-[1.3fr,1.7fr] md:p-8">
        <div className="flex flex-col justify-between border-b border-[color:var(--color-divider)] pb-6 md:border-b-0 md:border-r md:pb-0 md:pr-6">
          <div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-[color:var(--color-brand-red)]">
              zomato
            </h1>
            <p className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-[color:var(--color-text-secondary)]">
              Order food in seconds
            </p>
          </div>
          <div className="mt-6 hidden text-xs text-[color:var(--color-text-secondary)] md:block">
            Discover the best food & drinks near you. Sign in to see your
            favourite restaurants, saved orders and more.
          </div>
        </div>

        <div className="flex flex-col justify-center space-y-5">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-[color:var(--color-charcoal)]">
              Login or sign up
            </h2>
            <p className="text-xs text-[color:var(--color-text-secondary)]">
              Use your Google account to continue.
            </p>
          </div>

          <button
            onClick={googleLogin}
            className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-2xl border border-[color:var(--color-divider)] bg-[color:var(--color-surface)] text-sm font-semibold text-[color:var(--color-charcoal)] shadow-sm hover:bg-[color:var(--color-bg-blush)]"
          >
            <FcGoogle size={20} />
            Continue with Google
          </button>

          <p className="text-[10px] text-[color:var(--color-text-secondary)]">
            By continuing, you agree to our{" "}
            <span className="font-semibold text-[color:var(--color-brand-red)]">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="font-semibold text-[color:var(--color-brand-red)]">
              Privacy Policy
            </span>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;