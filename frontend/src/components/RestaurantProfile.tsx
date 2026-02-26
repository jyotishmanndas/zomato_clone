import React from 'react'
import type { Restaurant } from '../types'
import { Clock, Globe, MapPin, Phone, Store } from 'lucide-react'


const RestaurantProfile = ({ restaurant }: { restaurant: Restaurant }) => {
  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/40">
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
                    {restaurant.autoLocation.formattedAddress || "Set your location"}
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
  )
}

export default RestaurantProfile