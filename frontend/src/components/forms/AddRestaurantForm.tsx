import { useEffect, useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { createRestaurantSchema } from "../../validations/restaurantSchema";
import { Store, Phone, AlignLeft, Upload, MapPin, Loader2, X } from "lucide-react";
import { useNavigate } from 'react-router';
import { useAppSelector } from '../../hooks/useRedux';
import { axiosInstance } from '../../config/axiosInstance';
import toast from 'react-hot-toast';
import axios from 'axios';

const AddRestaurantForm = () => {
    const navigate = useNavigate();
    const { location } = useAppSelector(state => state.location)
    const [preview, setPreview] = useState<string | null>(null);

    const form = useForm<z.infer<typeof createRestaurantSchema>>({
        resolver: zodResolver(createRestaurantSchema),
        defaultValues: {
            name: "",
            description: "",
            phone: "",
            image: undefined,
            autoLocation: {
                type: "Point",
                coordinates: [0, 0],
                formattedAddress: ""
            }
        }
    });

    const { isSubmitting } = form.formState;

    useEffect(() => {
        if (!location) return;
        form.setValue("autoLocation", {
            type: "Point",
            coordinates: [location.longitude, location.latitude],
            formattedAddress: location.formattedAddress
        });
    }, [location, form]);

    async function onSubmit(data: z.infer<typeof createRestaurantSchema>) {
        const formdata = new FormData();
        formdata.append("name", data.name);
        if (data.description) formdata.append("description", data.description);
        formdata.append("phone", data.phone);
        formdata.append("image", data.image);
        formdata.append("autoLocation", JSON.stringify(data.autoLocation));

        try {
            const res = await axiosInstance.post(`/api/v1/restaurant/create`, formdata, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            if (res.status === 201) {
                toast.success(res.data.msg);
                setPreview(null);
                navigate(`/restaurant`)
                form.reset();
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data.msg || "Something went wrong");
            }
        }
    }

    return (
        <div className="min-h-screen w-full bg-[#FDFDFD] flex items-center justify-center p-4 md:p-10">
            <div className="w-full max-w-6xl bg-white rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col md:flex-row border border-slate-100">
                <div className="md:w-5/12 bg-slate-50 p-8 md:p-12 flex flex-col items-center justify-center border-r border-slate-100">
                    <div className="w-full max-w-sm">
                        <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">Restaurant Cover</h3>

                        <div className="relative group aspect-square w-full bg-white rounded-[2rem] shadow-inner border-2 border-dashed border-slate-200 overflow-hidden flex flex-col items-center justify-center transition-all hover:border-[#E23744] hover:bg-red-50/30">
                            {preview ? (
                                <>
                                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => { setPreview(null); form.setValue("image", undefined as any); }}
                                        className="absolute top-4 right-4 bg-white/90 p-2 rounded-full text-[#E23744] shadow-lg hover:bg-[#E23744] hover:text-white transition-all z-10"
                                    >
                                        <X size={18} />
                                    </button>
                                </>
                            ) : (
                                <div className="p-8 flex flex-col items-center pointer-events-none">
                                    <div className="w-20 h-20 bg-red-50 text-[#E23744] rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                                        <Upload size={32} />
                                    </div>
                                    <p className="font-bold text-slate-700 text-center">Drop your image here</p>
                                </div>
                            )}
                            <Controller
                                name="image"
                                control={form.control}
                                render={({ field: { onChange, value, ...field }, fieldState }) => (
                                    <div className="absolute inset-0">
                                        <input
                                            {...field}
                                            type="file"
                                            accept="image/*"
                                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;
                                                onChange(file);
                                                setPreview(URL.createObjectURL(file));
                                            }}
                                        />
                                        {fieldState.error && (
                                            <p className="absolute bottom-4 text-red-500 text-xs text-center w-full">{fieldState.error.message}</p>
                                        )}
                                    </div>
                                )}
                            />
                        </div>
                        <p className="mt-6 text-xs text-slate-400 font-medium uppercase tracking-widest text-center">Maximum file size: 5MB</p>
                    </div>
                </div>

                <div className="md:w-7/12 p-8 md:p-16">
                    <div className="max-w-md mx-auto">
                        <header className="mb-10 text-center md:text-left">
                            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Restaurant Profile</h2>
                            <p className="text-slate-500 mt-2 font-medium">Let's set up your restaurant identity</p>
                        </header>

                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Restaurant Name</label>
                                <div className="relative">
                                    <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none transition-colors" size={20} />
                                    <Controller
                                        name="name"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <>
                                                <input
                                                    {...field}
                                                    type='text'
                                                    placeholder="Enter restaurant name"
                                                    className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-2 rounded-2xl outline-none transition-all
                                                    ${fieldState.error ? "border-red-200 bg-red-50/20" : "border-transparent focus:border-[#E23744] focus:bg-white focus:ring-0"}`}
                                                />
                                                {fieldState.error && <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>}
                                            </>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none transition-colors" size={20} />
                                    <Controller
                                        name="phone"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <>
                                                <input
                                                    {...field}
                                                    placeholder="+91 XXXXX XXXXX"
                                                    className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-2 rounded-2xl outline-none transition-all
                                                    ${fieldState.error ? "border-red-200 bg-red-50/20" : "border-transparent focus:border-[#E23744] focus:bg-white focus:ring-0"}`}
                                                />
                                                {fieldState.error && <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>}
                                            </>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Full Restaurant Address</label>
                                <div className="flex items-start gap-4 px-4 py-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl">
                                    <MapPin className="text-[#E23744] mt-0.5 shrink-0" size={20} />
                                    <div className="flex flex-col">
                                        <span className="text-sm text-slate-700 leading-relaxed font-medium">
                                            {location?.formattedAddress || "Detecting address..."}
                                        </span>
                                        {location && (
                                            <span className="text-[10px] text-slate-400 mt-1 uppercase tracking-tighter">
                                                Verified GPS: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">About</label>
                                <div className="relative">
                                    <AlignLeft className="absolute left-4 top-5 text-slate-300 pointer-events-none transition-colors" size={20} />
                                    <Controller
                                        name="description"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <>
                                                <textarea
                                                    {...field}
                                                    rows={4}
                                                    placeholder="Describe your cuisine and atmosphere..."
                                                    className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-2 rounded-2xl outline-none transition-all resize-none
                                                    ${fieldState.error ? "border-red-200 bg-red-50/20" : "border-transparent focus:border-[#E23744] focus:bg-white focus:ring-0"}`}
                                                />
                                                {fieldState.error && <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>}
                                            </>
                                        )}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-slate-900 hover:bg-black text-white py-5 rounded-2xl font-bold text-lg shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin" /> : "Save & Continue"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddRestaurantForm;