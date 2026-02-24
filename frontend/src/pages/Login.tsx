import { axiosInstance } from '../config/axiosInstance'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from "react-icons/fc"
import { useAppDispatch } from '../hooks/useRedux';
import { setUser } from '../features/authSlice';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const responseGoogle = async (authResult: any) => {
        try {
            const res = await axiosInstance.post(`/api/v1/auth/login`, {
                code: authResult["code"]
            });

            if (res.status === 200) {
                dispatch(setUser(res.data.data))
                toast.success(res.data.msg);
                navigate("/home")
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data.msg)
            }
        }
    };

    const googleLogin = useGoogleLogin({
        onSuccess: responseGoogle,
        onError: responseGoogle,
        flow: "auth-code"
    });

    return (
        <div className='min-h-screen flex items-center justify-center px-4'>
            <div className='w-full max-w-sm space-y-6'>
                <h1 className='text-center text-3xl font-bold italic text-[#E23744]'>ZOMATO</h1>
                <p className='text-center text-sm text-gray-500'>
                    Login or signup to continue
                </p>

                <button onClick={googleLogin} className='flex items-center justify-center gap-3 px-3 py-2 rounded-xl border border-gray-300 w-full'>
                    <FcGoogle size={20} />
                    Continue with Google
                </button>

                <p className='text-center text-xs text-gray-400'>
                    By continuing, you agree with our {" "}
                    <span className='text-[#E23744]'>Terms of Services</span> &{" "}
                    <span className='text-[#E23744]'>Privacy Policy</span>
                </p>
            </div>
        </div>
    )
}

export default Login