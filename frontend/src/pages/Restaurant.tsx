import React from 'react';
import { useNavigate } from 'react-router';
import { useRestaurantApi } from '../hooks/useRestaurantApi';
import { Plus, Store, Utensils, Phone, MapPin, ArrowRight, ExternalLink } from 'lucide-react';

const Restaurant = () => {
    const { data, isLoading } = useRestaurantApi();
    const navigate = useNavigate();

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
    }

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
    const restaurant = data;

    return (
        <div className="min-h-screen bg-[#FDFDFD] p-6 md:p-10">
            <div className="max-w-5xl mx-auto">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">My Restaurant</h1>
                        <p className="text-slate-500 font-medium mt-1">Manage your restaurant presence and operations</p>
                    </div>
                </header>

                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                        <div className="md:w-2/5 relative h-64 md:h-auto overflow-hidden">
                            <img
                                src={restaurant.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800"}
                                alt={restaurant.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:hidden" />
                            <div className="absolute bottom-6 left-6 md:hidden">
                                <span className="px-3 py-1 bg-[#E23744] text-white text-xs font-bold rounded-full uppercase">Active</span>
                            </div>
                        </div>

                        <div className="md:w-3/5 p-8 md:p-12 flex flex-col justify-between">
                            <div>
                                <div className="hidden md:block mb-4">
                                    <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full uppercase tracking-wider">
                                        Store Open
                                    </span>
                                </div>
                                <h2 className="text-3xl font-black text-slate-900 mb-2">{restaurant.name}</h2>
                                <p className="text-slate-500 line-clamp-2 mb-8 text-lg">
                                    {restaurant.description || "No description provided for this restaurant."}
                                </p>

                                <div className="space-y-4 mb-10">
                                    <div className="flex items-center gap-4 text-slate-600">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#E23744]">
                                            <Phone size={18} />
                                        </div>
                                        <span className="font-semibold">{restaurant.phone}</span>
                                    </div>
                                    <div className="flex items-start gap-4 text-slate-600">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#E23744] shrink-0">
                                            <MapPin size={18} />
                                        </div>
                                        <span className="font-medium text-sm leading-relaxed italic">
                                            {restaurant.autoLocation?.formattedAddress || "Location not set"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => navigate(`/manage/${restaurant._id}`)}
                                    className="flex-1 bg-slate-900 hover:bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all group"
                                >
                                    Manage Store
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button className="flex-1 border-2 border-slate-100 hover:border-slate-200 py-4 rounded-2xl font-bold text-slate-700 transition-all">
                                    Edit Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                    {['Active Menu', 'Total Orders', 'Revenue'].map((label) => (
                        <div key={label} className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                                <Utensils size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
                                <p className="text-xl font-black text-slate-900">--</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Restaurant;