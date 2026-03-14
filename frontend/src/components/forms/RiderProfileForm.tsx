import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createRiderSchema } from "../../validations/riderSchema";
import { axiosInstance } from "../../config/axiosInstance";
import toast from "react-hot-toast";
import axios from "axios";
import { Camera, IdCard, Phone, X } from "lucide-react";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";

const RiderProfileForm = () => {
    const [preview, setPreview] = useState<string | null>(null);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const form = useForm<z.infer<typeof createRiderSchema>>({
        resolver: zodResolver(createRiderSchema),
        defaultValues: {
            picture: undefined,
            mobile: "",
            aadhaarNumber: "",
            drivingLicenceNumber: "",
            location: {
                type: "Point",
                coordinates: [0, 0]
            }
        },
    });

    const onSubmit = async (data: z.infer<typeof createRiderSchema>) => {
        if (!navigator.geolocation) {
            toast.error("Location access required");
            return;
        };

        navigator.geolocation.getCurrentPosition(async (pos) => {
            const { latitude, longitude } = pos.coords;

            const location = {
                type: "Point",
                coordinates: [longitude, latitude],
            };

            const formData = new FormData();

            formData.append("mobile", data.mobile);
            formData.append("aadhaarNumber", data.aadhaarNumber);
            formData.append("drivingLicenceNumber", data.drivingLicenceNumber);
            formData.append("riderprofile", data.picture);
            formData.append("location", JSON.stringify(location))

            try {
                const res = await axiosInstance.post(
                    `/api/v1/rider/create`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                if (res.status === 201) {
                    toast.success(res.data.msg || "Rider profile created");
                    form.reset();
                    setPreview(null);
                    navigate("/rider");
                    queryClient.invalidateQueries({
                        queryKey: ["rider"],
                    });
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    toast.error(error.response?.data.msg || "Failed to create profile");
                } else {
                    toast.error("Something went wrong");
                }
            }
        })
    };

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    return (
        <div className="max-w-lg mx-auto mt-12 bg-white shadow-xl rounded-2xl p-8">

            <h2 className="text-2xl font-bold mb-1">Become a Rider</h2>
            <p className="text-sm text-slate-400 mb-6">
                Complete your rider profile to start delivering orders
            </p>

            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
            >

                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                        Mobile Number
                    </label>

                    <div className="relative mt-1">
                        <Phone
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                        />

                        <Controller
                            name="mobile"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <>
                                    <input
                                        {...field}
                                        type="tel"
                                        inputMode="numeric"
                                        maxLength={10}
                                        placeholder="Enter mobile number"
                                        className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-2 rounded-2xl outline-none transition-all
                                           ${fieldState.error
                                                ? "border-red-200 bg-red-50/20"
                                                : "border-transparent focus:border-orange-500 focus:bg-white"
                                            }`}
                                    />

                                    {fieldState.error && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {fieldState.error.message}
                                        </p>
                                    )}
                                </>
                            )}
                        />
                    </div>
                </div>

                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                        Aadhaar Number
                    </label>

                    <div className="relative mt-1">
                        <IdCard
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                        />

                        <Controller
                            name="aadhaarNumber"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <>
                                    <input
                                        {...field}
                                        placeholder="Enter Aadhaar number"
                                        className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-2 rounded-2xl outline-none transition-all
                                            ${fieldState.error
                                                ? "border-red-200 bg-red-50/20"
                                                : "border-transparent focus:border-orange-500 focus:bg-white"
                                            }`}
                                    />

                                    {fieldState.error && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {fieldState.error.message}
                                        </p>
                                    )}
                                </>
                            )}
                        />
                    </div>
                </div>

                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                        Driving Licence Number
                    </label>

                    <div className="relative mt-1">
                        <IdCard
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                        />

                        <Controller
                            name="drivingLicenceNumber"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <>
                                    <input
                                        {...field}
                                        placeholder="DL01AB1234567890"
                                        className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-2 rounded-2xl outline-none transition-all
                                            ${fieldState.error
                                                ? "border-red-200 bg-red-50/20"
                                                : "border-transparent focus:border-orange-500 focus:bg-white"
                                            }`}
                                    />

                                    {fieldState.error && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {fieldState.error.message}
                                        </p>
                                    )}
                                </>
                            )}
                        />
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50 p-6 relative group hover:border-orange-400 transition-all">

                    {preview ? (
                        <>
                            <img
                                src={preview}
                                className="w-full h-full object-cover rounded-[1.5rem]"
                            />

                            <button
                                type="button"
                                onClick={() => {
                                    setPreview(null);
                                    form.setValue("picture", undefined as any);
                                }}
                                className="absolute top-4 right-4 bg-white p-2 rounded-full shadow hover:bg-red-500 hover:text-white transition-all"
                            >
                                <X size={18} />
                            </button>
                        </>
                    ) : (
                        <>
                            <Camera
                                size={36}
                                className="text-slate-300 group-hover:text-orange-500 transition-colors"
                            />

                            <p className="text-sm font-bold text-slate-400 mt-3">
                                Upload Profile Photo
                            </p>
                        </>
                    )}

                    <Controller
                        name="picture"
                        control={form.control}
                        render={({ field: { onChange, value, ...field }, fieldState }) => (
                            <>
                                <input
                                    {...field}
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;

                                        onChange(file);

                                        const url = URL.createObjectURL(file);
                                        setPreview(url);
                                    }}
                                />

                                {fieldState.error && (
                                    <p className="text-red-500 text-xs mt-2 text-center">
                                        {fieldState.error.message}
                                    </p>
                                )}
                            </>
                        )}
                    />
                </div>

                <button
                    disabled={form.formState.isSubmitting}
                    className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 disabled:opacity-50"
                >
                    {form.formState.isSubmitting
                        ? "Creating Profile..."
                        : "Create Rider Profile"}
                </button>

            </form>
        </div>
    );
};

export default RiderProfileForm;