import type { Restaurant } from "../types";
import { Clock, Globe, MapPin, Phone, Store } from "lucide-react";

const RestaurantProfile = ({ restaurant }: { restaurant: Restaurant }) => {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="overflow-hidden rounded-[2.5rem] border border-[color:var(--color-divider)] bg-[color:var(--color-surface)] shadow-sm">
        <div className="relative h-44 bg-[color:var(--color-charcoal)]">
          <img
            src={
              restaurant.image ||
              "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800"
            }
            className="h-full w-full object-cover opacity-70"
            alt="banner"
          />
          <div className="absolute -bottom-10 left-8 h-20 w-20 rounded-3xl border border-[color:var(--color-surface)] bg-[color:var(--color-surface)] p-1 shadow-sm">
            <div className="flex h-full w-full items-center justify-center rounded-[1.4rem] bg-[color:var(--color-bg-blush)] text-[color:var(--color-brand-red)]">
              <Store size={36} />
            </div>
          </div>
        </div>

        <div className="px-8 pb-8 pt-14">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-[22px] font-extrabold text-[color:var(--color-charcoal)]">
                {restaurant.name}
              </h2>
              <p className="mt-1 flex items-center gap-2 text-xs text-[color:var(--color-text-secondary)]">
                <Globe size={14} /> Official merchant partner
              </p>
            </div>
            <button className="btn-outline h-9 px-4 text-xs font-semibold">
              Edit details
            </button>
          </div>

          <div className="grid gap-6 border-y border-[color:var(--color-divider)] py-6 text-xs">
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[color:var(--color-bg-blush)] text-[color:var(--color-text-secondary)]">
                  <Phone size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--color-text-secondary)]">
                    Phone support
                  </p>
                  <p className="mt-1 text-[13px] font-semibold text-[color:var(--color-charcoal)]">
                    {restaurant.phone}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[color:var(--color-bg-blush)] text-[color:var(--color-text-secondary)]">
                  <MapPin size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--color-text-secondary)]">
                    Address
                  </p>
                  <p className="mt-1 text-[13px] font-semibold leading-snug text-[color:var(--color-charcoal)]">
                    {restaurant.autoLocation.formattedAddress ||
                      "Set your location"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[color:var(--color-bg-blush)] text-[color:var(--color-text-secondary)]">
                  <Clock size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--color-text-secondary)]">
                    Operating hours
                  </p>
                  <p className="mt-1 text-[13px] font-semibold text-[color:var(--color-charcoal)]">
                    09:00 AM – 10:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-3xl bg-[color:var(--color-bg-blush)] p-5">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--color-text-secondary)]">
              Restaurant bio
            </p>
            <p className="text-[13px] leading-relaxed text-[color:var(--color-charcoal)]">
              {restaurant.description ||
                "You haven't added a description yet. Tell your customers what makes your kitchen special."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantProfile;