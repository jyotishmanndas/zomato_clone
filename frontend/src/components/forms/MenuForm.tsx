import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Camera,
    Save,
    Loader2,
    X,
    Utensils,
    IndianRupee,
} from "lucide-react";
import { axiosInstance } from "../../config/axiosInstance";
import toast from "react-hot-toast";
import axios from "axios";
import { createMenuSchema } from "../../validations/menuSchema";
import { useQueryClient } from "@tanstack/react-query";

interface AddMenuFormProps {
    restaurantId: string;
}

const MenuForm = ({ restaurantId }: AddMenuFormProps) => {
    const [preview, setPreview] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const form = useForm<z.infer<typeof createMenuSchema>>({
        resolver: zodResolver(createMenuSchema),
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            isAvailable: true,
            image: undefined,
        },
    });

    const { isSubmitting } = form.formState;

    const onSubmit = async (data: z.infer<typeof createMenuSchema>) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("price", String(data.price));
        formData.append("isAvailable", JSON.stringify(data.isAvailable));
        if (data.description) {
            formData.append("description", data.description);
        };

        formData.append("menuImg", data.image);

        try {
            const res = await axiosInstance.post(
                `/api/v1/menu/add/${restaurantId}`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            if (res.status === 201) {
                toast.success(res.data.msg);
                queryClient.invalidateQueries({ queryKey: ["menu"] });
                form.reset();
                setPreview(null);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data.msg || "Failed to create menu item");
            } else {
                toast.error("Something went wrong");
            }
        }
    };

    return (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2rem] p-10 shadow-sm animate-in slide-in-from-top-4 duration-300">
            <div className="mb-8">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                    Add New Dish
                </h3>
                <p className="text-slate-500 mt-1 text-sm">
                    Create a new item for your restaurant menu
                </p>
            </div>

            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid md:grid-cols-2 gap-10"
            >
                <div className="space-y-6">
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                            Dish Name
                        </label>
                        <div className="relative mt-1">
                            <Utensils
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                            />
                            <Controller
                                name="name"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <>
                                        <input
                                            {...field}
                                            placeholder="Spicy Ramen"
                                            className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-2 rounded-2xl outline-none transition-all
                                                    ${fieldState.error
                                                    ? "border-red-200 bg-red-50/20"
                                                    : "border-transparent focus:border-red-500 focus:bg-white"
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
                            Price
                        </label>
                        <div className="relative mt-1">
                            <IndianRupee
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                            />
                            <Controller
                                name="price"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <>
                                        <input
                                            {...field}
                                            type="number"
                                            placeholder="199"
                                            className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-2 rounded-2xl outline-none transition-all
                                                    ${fieldState.error
                                                    ? "border-red-200 bg-red-50/20"
                                                    : "border-transparent focus:border-red-500 focus:bg-white"
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
                            Description
                        </label>
                        <Controller
                            name="description"
                            control={form.control}
                            render={({ field }) => (
                                <textarea
                                    {...field}
                                    rows={3}
                                    placeholder="Describe taste, ingredients, and specialities..."
                                    className="w-full mt-1 bg-slate-50 border-2 border-transparent rounded-2xl p-4 focus:border-red-500 outline-none transition-all resize-none"
                                />
                            )}
                        />
                    </div>

                    <Controller
                        name="isAvailable"
                        control={form.control}
                        render={({ field }) => (
                            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl">
                                <span className="font-medium text-slate-700">
                                    Available for Orders
                                </span>

                                <button
                                    type="button"
                                    onClick={() => field.onChange(!field.value)}
                                    className={`relative w-12 h-6 rounded-full transition-colors ${field.value ? "bg-green-500" : "bg-slate-300"
                                        }`}
                                >
                                    <span
                                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${field.value ? "translate-x-6" : ""
                                            }`}
                                    />
                                </button>
                            </div>
                        )}
                    />
                </div>

                <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50 p-6 relative group hover:border-red-400 transition-all">

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
                                    form.setValue("image", undefined as any);
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
                                className="text-slate-300 group-hover:text-red-500 transition-colors"
                            />
                            <p className="text-sm font-bold text-slate-400 mt-3">
                                Upload Dish Photo
                            </p>
                        </>
                    )}

                    <Controller
                        name="image"
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
                                        setPreview(URL.createObjectURL(file));
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

                <div className="md:col-span-2">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-red-500 hover:bg-red-600 text-white py-5 rounded-2xl font-bold text-lg shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                Save to Menu
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MenuForm;