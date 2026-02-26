import React, { useEffect, useState } from 'react';
import { useRestaurantApi } from '../hooks/useRestaurantApi';
import { Plus, Store, Utensils, User, Package, X } from 'lucide-react';
import { axiosInstance } from '../config/axiosInstance';
import toast from 'react-hot-toast';
import MenuForm from '../components/forms/MenuForm';
import { useNavigate } from 'react-router';
import RestaurantProfile from '../components/RestaurantProfile';
import { useMenuApi } from '../hooks/useMenuApi';
import Menu from '../components/Menu/Menu';

const Restaurant = () => {
    const { data, isLoading } = useRestaurantApi();
    const { data: menus } = useMenuApi();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('profile');
    const [isStoreOpen, setIsStoreOpen] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);

    const restaurant = data || {};

    useEffect(() => {
        if (restaurant?.isOpen !== undefined) {
            setIsStoreOpen(restaurant.isOpen);
        }
    }, [restaurant])

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
                <div className="relative flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-indigo-100 border-t-[#E23744] rounded-full animate-spin" />
                    <Store className="absolute text-[#E23744]" size={24} />
                </div>
                <p className="mt-4 text-slate-600 font-medium tracking-wide">Loading your storefront...</p>
            </div>
        );
    };

    if (!data || Object.keys(data).length === 0) {
        return (
            <div className="h-screen bg-slate-50 flex flex-col">
                <div className="flex-1 flex items-center justify-center px-6">
                    <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 text-center">
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-red-50 text-[#E23744] mb-8 transform rotate-3">
                            <Store size={48} strokeWidth={1.5} />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Ready to sell?</h2>
                        <p className="text-slate-500 mb-10 text-lg leading-relaxed">
                            You haven't registered a restaurant yet. Start your journey and reach thousands of customers today.
                        </p>
                        <button
                            onClick={() => navigate("/create-restaurant")}
                            className="w-full bg-[#E23744] hover:bg-black text-white flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-lg shadow-lg transition-all active:scale-95"
                        >
                            <Plus size={24} />
                            Create Restaurant
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const toogleStatus = async () => {
        const res = await axiosInstance.patch(`/api/v1/restaurant/status/${restaurant._id}`);
        if (res.status === 200) {
            toast.success(res.data.msg);
            setIsStoreOpen(res.data.restaurant.isOpen)
        }
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB] pb-20">
            <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-red-50 p-2 rounded-xl">
                            <Utensils className="text-red-500" size={24} />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900">{restaurant.name}</h1>
                    </div>

                    <div className={`flex items-center gap-3 px-4 py-2 rounded-2xl border transition-all ${isStoreOpen ? 'bg-green-50 border-green-100' : 'bg-slate-50 border-slate-200'}`}>
                        <span className={`text-[10px] font-black uppercase tracking-tighter ${isStoreOpen ? 'text-green-600' : 'text-slate-400'}`}>
                            {isStoreOpen ? 'Accepting Orders' : 'Store Closed'}
                        </span>
                        <button
                            onClick={toogleStatus}
                            className={`relative w-10 h-5 flex items-center rounded-full transition-colors ${isStoreOpen ? 'bg-green-500' : 'bg-slate-300'}`}
                        >
                            <span className={`absolute bg-white w-3.5 h-3.5 rounded-full shadow-sm transition-transform ${isStoreOpen ? 'translate-x-5.5' : 'translate-x-1'}`} />
                        </button>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto px-6 flex gap-8">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`py-3 text-sm font-bold flex items-center gap-2 transition-all border-b-2 ${activeTab === 'profile' ? 'border-red-500 text-red-500' : 'border-transparent text-slate-400'}`}
                    >
                        <User size={18} /> Restaurant Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('menu')}
                        className={`py-3 text-sm font-bold flex items-center gap-2 transition-all border-b-2 ${activeTab === 'menu' ? 'border-red-500 text-red-500' : 'border-transparent text-slate-400'}`}
                    >
                        <Package size={18} /> Menu Items
                    </button>
                </div>
            </div>

            <main className="max-w-5xl mx-auto p-6">

                {activeTab === 'menu' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-black text-slate-900">Your Menu</h2>
                            <button
                                onClick={() => setShowAddForm(!showAddForm)}
                                className="bg-black text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-800 transition-all"
                            >
                                {showAddForm ? <X size={18} /> : <Plus size={18} />}
                                {showAddForm ? 'Cancel' : 'Create Item'}
                            </button>
                        </div>

                        {showAddForm && (
                            <MenuForm restaurantId={restaurant._id} />
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {menus.map((m: any) => (
                                <Menu key={m.id} menu={m} isSeller={true} />
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'profile' && (
                    <RestaurantProfile restaurant={restaurant} />
                )}
            </main>
        </div>
    );
};

export default Restaurant;