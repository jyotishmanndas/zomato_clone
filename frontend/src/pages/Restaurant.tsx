import React, { useEffect, useState } from 'react';
import { useRestaurantApi } from '../hooks/useRestaurantApi';
import {
    Plus, Store, Utensils, Phone, MapPin,
    User, Package, Trash2, Edit2, Globe,
    Clock, Camera, Save, X
} from 'lucide-react';
import { axiosInstance } from '../config/axiosInstance';
import toast from 'react-hot-toast';
import MenuForm from '../components/forms/MenuForm';

const Restaurant = () => {
    const { data, isLoading } = useRestaurantApi();

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
            <div className="flex h-screen items-center justify-center bg-white">
                <div className="w-10 h-10 border-4 border-slate-100 border-t-red-500 rounded-full animate-spin" />
            </div>
        );
    };

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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Example Menu Item */}
                            <div className="bg-white p-4 rounded-3xl border border-slate-100 flex items-center gap-4 shadow-sm group">
                                <div className="w-20 h-20 bg-slate-100 rounded-2xl overflow-hidden shrink-0">
                                    <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200" className="w-full h-full object-cover" alt="food" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-slate-900 text-md">Garden Salad Bowl</h4>
                                    <p className="text-red-500 font-black text-sm">$14.00</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <button className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"><Edit2 size={16} /></button>
                                    <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'profile' && (
                    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/40">
                            {/* Profile Header Image */}
                            <div className="h-48 bg-slate-900 relative">
                                <img src={restaurant.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800"} className="w-full h-full object-cover opacity-60" alt="banner" />
                                <div className="absolute -bottom-10 left-10 w-24 h-24 bg-white rounded-3xl p-1 shadow-lg border border-slate-100">
                                    <div className="w-full h-full bg-red-50 rounded-[1.4rem] flex items-center justify-center text-red-500">
                                        <Store size={40} />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-16 px-10 pb-10">
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <h2 className="text-3xl font-black text-slate-900">{restaurant.name}</h2>
                                        <p className="text-slate-500 mt-1 flex items-center gap-2">
                                            <Globe size={14} /> Official Merchant Partner
                                        </p>
                                    </div>
                                    <button className="px-6 py-2 border-2 border-slate-100 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all">Edit Details</button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-y border-slate-50">
                                    <div className="space-y-6">
                                        <div className="flex gap-4">
                                            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400"><Phone size={18} /></div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Support</p>
                                                <p className="font-bold">{restaurant.phone}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400"><MapPin size={18} /></div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Address</p>
                                                <p className="font-bold text-sm text-slate-700 leading-tight">
                                                    {restaurant.autoLocation?.formattedAddress || "Set your location"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="flex gap-4">
                                            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400"><Clock size={18} /></div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Operating Hours</p>
                                                <p className="font-bold">09:00 AM - 10:00 PM</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 p-6 bg-slate-50 rounded-3xl">
                                    <p className="text-xs font-black text-slate-400 uppercase mb-2 tracking-widest">Restaurant Bio</p>
                                    <p className="text-slate-600 italic leading-relaxed">
                                        "{restaurant.description || "You haven't added a description yet. Tell your customers what makes your kitchen special."}"
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Restaurant;