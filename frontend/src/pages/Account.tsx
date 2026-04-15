import { useState, useEffect } from 'react';
import { User, Package, MapPin, LogOut, ChevronRight } from 'lucide-react';
import { useAppSelector } from '../hooks/useRedux';
import Profile from '../components/AccountDetails/Profile';
import Orders from '../components/AccountDetails/Orders';
import Address from '../components/AccountDetails/Address';
import { axiosInstance } from '../config/axiosInstance';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router';
import { useDispatch } from 'react-redux';
import { removeUser } from '../features/authSlice';

const Account = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useAppSelector((state) => state.auth);

    const [searchParams] = useSearchParams();
    const tab = searchParams.get("tab");

    const [activeTab, setActiveTab] = useState(tab || "profile");

    useEffect(() => {
        if (tab) {
            setActiveTab(tab);
        }
    }, [tab]);

    const menuItems = [
        { id: "profile", label: "My Profile", icon: User },
        { id: "orders", label: "Recent Orders", icon: Package },
        { id: "addresses", label: "Saved Addresses", icon: MapPin },
    ];

    const handleLogout = async () => {
        try {
            const res = await axiosInstance.post(`/api/v1/auth/user/logout`);

            if (res.status === 200) {
                toast.success(res.data.msg);
                dispatch(removeUser());
                navigate("/login");
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data.msg);
            }
        }
    };

    return (
        <div className="min-h-screen bg-[color:var(--color-bg-blush)] px-4 pb-20 pt-24">
            <div className="mx-auto max-w-6xl">
                <div className="flex flex-col gap-6 lg:flex-row">
                    <aside className="flex flex-col gap-2 lg:w-72">
                        <div className="mb-3 rounded-[2rem] border border-[color:var(--color-divider)] bg-[color:var(--color-surface)] p-5 shadow-sm">

                            <div className="mb-5 flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--color-brand-red)] text-base font-bold text-white">
                                    {user?.name.charAt(0).toUpperCase()}
                                </div>

                                <div>
                                    <h2 className="text-sm font-semibold text-[color:var(--color-charcoal)]">
                                        {user?.name}
                                    </h2>
                                    <p className="text-[11px] text-[color:var(--color-text-secondary)]">
                                        View and manage your account
                                    </p>
                                </div>
                            </div>

                            <nav className="space-y-1.5">
                                {menuItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => navigate(`/account?tab=${item.id}`)}
                                        className={`flex w-full items-center gap-3 rounded-2xl px-4 py-2.5 text-xs font-semibold transition-all ${activeTab === item.id
                                                ? "bg-[color:var(--color-brand-red)] text-white"
                                                : "text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-bg-blush)]"
                                            }`}
                                    >
                                        <item.icon size={16} />
                                        <span>{item.label}</span>

                                        <ChevronRight
                                            size={12}
                                            className={`ml-auto ${activeTab === item.id ? "opacity-100" : "opacity-0"
                                                }`}
                                        />
                                    </button>
                                ))}
                            </nav>

                            <div className="mt-6 border-t border-[color:var(--color-divider)] pt-4">
                                <button
                                    onClick={handleLogout}
                                    className="flex w-full items-center gap-3 rounded-2xl px-4 py-2.5 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                                >
                                    <LogOut size={16} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    </aside>

                    <main className="flex-1">
                        <div className="min-h-[520px] rounded-[2.5rem] border border-[color:var(--color-divider)] bg-[color:var(--color-surface)] p-5 shadow-sm md:p-8">

                            {activeTab === "profile" && <Profile />}

                            {activeTab === "orders" && <Orders />}

                            {activeTab === "addresses" && <Address />}

                        </div>
                    </main>

                </div>
            </div>
        </div>
    );
};

export default Account;