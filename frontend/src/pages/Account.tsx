import React, { useState } from 'react';
import { User, Package, MapPin, LogOut, ChevronRight } from 'lucide-react';
import { useAppSelector } from '../hooks/useRedux';
import Profile from '../components/AccountDetails/Profile';
import Orders from '../components/AccountDetails/Orders';
import Address from '../components/AccountDetails/Address';

const Account = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const { user } = useAppSelector(state => state.auth);

    const menuItems = [
        { id: 'profile', label: 'My Profile', icon: User },
        { id: 'orders', label: 'Recent Orders', icon: Package },
        { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
    ];

    return (
        <div className="min-h-screen bg-[#FDFDFD] p-4 md:pt-20">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-8">
                    <aside className="lg:w-80 flex flex-col gap-2">
                        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm mb-4">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 bg-[#E23744] rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                                    {user?.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h2 className="font-bold text-slate-900">{user?.name}</h2>
                                </div>
                            </div>

                            <nav className="space-y-2">
                                {menuItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all ${activeTab === item.id
                                            ? "bg-slate-900 text-white"
                                            : "text-slate-500 hover:bg-slate-50 hover:border border-slate-200"
                                            }`}
                                    >
                                        <item.icon size={18} />
                                        <span className="text-sm">{item.label}</span>
                                        <ChevronRight size={14} className={`ml-auto ${activeTab === item.id ? "opacity-100" : "opacity-0"}`} />
                                    </button>
                                ))}
                            </nav>

                            <div className="mt-8 pt-6 border-t border-slate-50">
                                <button className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-red-500 hover:bg-red-50 transition-all">
                                    <LogOut size={18} />
                                    <span className="text-sm">Logout</span>
                                </button>
                            </div>
                        </div>
                    </aside>

                    <main className="flex-1">
                        <div className="bg-white min-h-[600px] rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] p-6 md:p-10">

                            {activeTab === 'profile' && (
                                <Profile />
                            )}

                            {activeTab === 'orders' && (
                                <Orders />
                            )}

                            {activeTab === 'addresses' && (
                                <Address />
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Account;