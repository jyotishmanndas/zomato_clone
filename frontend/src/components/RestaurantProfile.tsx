import { useState } from "react";
import type { Restaurant } from "../types";
import { Clock, Globe, MapPin, Phone, Store } from "lucide-react";
import EditRestaurantForm from "./forms/EditRestaurantForm";

const RestaurantProfile = ({ restaurant }: { restaurant: Restaurant }) => {
  const [openModal, setOpenModal] = useState(false);
  const [data, setData] = useState(restaurant);

  return (
    <div className="mx-auto max-w-5xl px-4">

      <div className="relative h-56 w-full overflow-hidden rounded-3xl">
        <img
          src={
            restaurant.image ||
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200"
          }
          className="h-full w-full object-cover"
          alt="banner"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-md">
              <Store className="h-7 w-7 text-[color:var(--color-brand-red)]" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">
                {restaurant.name}
              </h2>
              <p className="flex items-center gap-2 text-xs text-white/80">
                <Globe size={14} />
                Verified merchant
              </p>
            </div>
          </div>

          <button onClick={() => setOpenModal(true)}
            className="rounded-full bg-white/90 px-4 py-1.5 text-xs font-semibold text-black hover:bg-white transition">
            Edit
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-3">

        <div className="md:col-span-2 space-y-5">

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Contact & Location
            </h3>

            <div className="space-y-4">

              <div className="flex items-start gap-3">
                <Phone className="mt-1 h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {restaurant.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Address</p>
                  <p className="text-sm font-semibold text-gray-900 leading-snug">
                    {restaurant.autoLocation.formattedAddress ||
                      "Set your location"}
                  </p>
                </div>
              </div>

            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              About
            </h3>

            <p className="text-sm text-gray-700 leading-relaxed">
              {restaurant.description ||
                "Add a description to tell customers about your cuisine, specialties, and story."}
            </p>
          </div>
        </div>

        <div className="space-y-5">

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Status
            </h3>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Store status</span>
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                Open
              </span>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Working Hours
            </h3>

            <div className="flex items-center gap-3 text-sm text-gray-700">
              <Clock size={16} />
              09:00 AM – 10:00 PM
            </div>
          </div>

        </div>
      </div>

      {openModal && (
        <EditRestaurantForm
          restaurant={data}
          onClose={() => setOpenModal(false)}
          onUpdated={(updated) => setData(updated)}
        />
      )}
    </div>
  );
};

export default RestaurantProfile;