import React from "react";
import type { Restaurant } from "../types";
import { Clock, Dot, MapPin } from "lucide-react";

interface RestaurantHeroProps {
  restaurant: Restaurant;
}

const RestaurantHero = ({ restaurant }: RestaurantHeroProps) => {
  return (
    <div className="mx-auto max-w-4xl px-4 pt-4">
      <div className="overflow-hidden rounded-[24px] bg-[color:var(--color-surface)] shadow-sm">
        <div className="relative h-40 w-full overflow-hidden sm:h-52">
          <img
            src={
              restaurant.image ||
              "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800"
            }
            alt={restaurant.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-3">
            <div>
              <h1 className="font-display text-[22px] font-extrabold text-white sm:text-[24px]">
                {restaurant.name}
              </h1>
              {restaurant.description && (
                <p className="mt-0.5 line-clamp-1 text-xs font-medium text-white/80">
                  {restaurant.description}
                </p>
              )}
            </div>
            <div className="rounded-[12px] bg-[rgba(0,0,0,0.75)] px-3 py-1.5 text-right text-xs text-white">
              <div className="flex items-center justify-end gap-1.5">
                <span className="inline-flex items-center rounded-[8px] bg-[color:var(--color-success)] px-1.5 py-0.5 text-[11px] font-bold">
                  ★ 4.3
                </span>
                <span className="text-[10px] text-gray-200">(200+ ratings)</span>
              </div>
              <p className="mt-0.5 text-[10px] text-gray-200">
                ₹300 for two • 30-40 mins
              </p>
            </div>
          </div>

          <div className="absolute left-4 top-3 inline-flex items-center gap-2 rounded-full bg-[rgba(0,0,0,0.7)] px-3 py-1 text-[11px] font-semibold text-white">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                restaurant.isOpen ? "bg-[color:var(--color-success)]" : "bg-red-500"
              }`}
            />
            {restaurant.isOpen ? "Open now" : "Closed"}
          </div>
        </div>

        <div className="space-y-3 px-4 pb-4 pt-3">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[color:var(--color-text-secondary)]">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-bg-blush)] px-2.5 py-1 font-semibold text-[11px] text-[color:var(--color-charcoal)]">
              <Clock className="h-3 w-3" />
              <span>30-40 mins</span>
            </div>
            <Dot className="h-4 w-4 text-[color:var(--color-text-secondary)]" />
            <span>₹300 for two</span>
            {/* <Dot className="h-4 w-4 text-[color:var(--color-text-secondary)]" /> */}
            {/* <span>Pure veg & non-veg options</span> */}
          </div>

          <div className="flex items-center gap-2 text-xs text-[color:var(--color-text-secondary)]">
            <MapPin className="h-3.5 w-3.5" />
            <span className="line-clamp-1">
              {restaurant.autoLocation?.formattedAddress || "Outlet address"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantHero;