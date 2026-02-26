import React from "react";
import type { Restaurant } from "../types";

interface RestaurantHeroProps {
    restaurant: Restaurant;
}

const RestaurantHero = ({ restaurant }: RestaurantHeroProps) => {
    return (
        <div className="max-w-4xl mx-auto px-4 pt-6 animate-in fade-in duration-500">
            <div className="flex items-center gap-3 mb-4">
                <h1 className="text-3xl font-extrabold text-slate-900">
                    {restaurant.name}
                </h1>

                <span
                    className={`text-xs px-3 py-1 rounded-full font-semibold ${restaurant.isOpen
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                >
                    {restaurant.isOpen ? "Open" : "Closed"}
                </span>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-5 flex flex-col md:flex-row items-start gap-5">
                <div className="flex-1 space-y-3">
                    <p className="text-red-500 text-sm font-medium underline underline-offset-4">
                        {restaurant.description}
                    </p>

                    <div className="text-sm">
                        <span className="text-slate-500 font-semibold">
                            Outlet
                        </span>{" "}
                        <span className="text-slate-400">
                            {restaurant.autoLocation?.formattedAddress || "Main Market"}
                        </span>
                    </div>
                    <div className="text-sm text-slate-600">
                        📞 {restaurant.phone}
                    </div>

                    {restaurant.isVerified && (
                        <div className="text-xs inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                            Verified Restaurant
                        </div>
                    )}
                </div>
                
                <div className="w-full md:w-44 h-32 rounded-xl overflow-hidden">
                    <img
                        src={
                            restaurant.image ||
                            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800"
                        }
                        alt={restaurant.name}
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </div>
    );
};

export default RestaurantHero;