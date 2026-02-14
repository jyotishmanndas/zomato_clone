import React from 'react';
import { useNavigate } from 'react-router';
import { useRestaurantApi } from '../hooks/useRestaurantApi';
import { Plus, Store, Utensils } from 'lucide-react';

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

    if (!data || data.length === 0) {
        return (
            <div className="h-screen bg-slate-50 flex flex-col">
                <div className="flex-1 flex items-center justify-center px-6">
                    <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 text-center">
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-indigo-50 text-[#E23744] mb-8 transform rotate-3">
                            <Store size={48} strokeWidth={1.5} />
                        </div>

                        <h2 className="text-3xl font-bold text-slate-900 mb-4">
                            Ready to sell?
                        </h2>
                        <p className="text-slate-500 mb-10 text-lg leading-relaxed">
                            You haven't registered a restaurant yet. Start your journey and reach thousands of customers today.
                        </p>

                        <button
                            onClick={() => navigate("/create-restaurant")} 
                            className="w-full bg-[#E23744] hover:bg-[#e23745ee] text-white flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-indigo-200 transition-all active:scale-95"
                        >
                            <Plus size={24} />
                            Create Restaurant
                        </button>

                        <p className="mt-6 text-sm text-slate-400">
                            It only takes 2 minutes to get started.
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-10">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Your Restaurants</h1>
                        <p className="text-slate-500">Manage your business locations and menus</p>
                    </div>
                    <button
                        onClick={() => navigate("/create-restaurant")}
                        className="flex items-center justify-center gap-2 bg-white border-2 border-slate-200 hover:border-indigo-600 hover:text-indigo-600 px-6 py-3 rounded-xl font-bold transition-all"
                    >
                        <Plus size={20} />
                        Add New Branch
                    </button>
                </div>

                {/* Grid of Seller's Restaurants */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.map((res: any) => (
                        <div key={res.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                <Utensils size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">{res.name}</h3>
                            <p className="text-slate-500 text-sm mb-6">{res.address || 'No address provided'}</p>
                            
                            <button className="w-full py-3 rounded-xl bg-slate-50 text-slate-700 font-semibold hover:bg-slate-900 hover:text-white transition-colors">
                                Manage Store
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Restaurant;