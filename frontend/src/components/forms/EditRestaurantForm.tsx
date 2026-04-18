import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { axiosInstance } from "../../config/axiosInstance";
import { updateRestaurantSchema } from "../../validations/restaurantSchema";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
    restaurant: any;
    onClose: () => void;
    onUpdated: (data: any) => void;
};

const EditRestaurantForm = ({ restaurant, onClose, onUpdated }: Props) => {
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof updateRestaurantSchema>>({
        resolver: zodResolver(updateRestaurantSchema),
        defaultValues: {
            name: restaurant.name,
            description: restaurant.description || "",
            phone: restaurant.phone,
        },
    });

    async function onSubmit(data: z.infer<typeof updateRestaurantSchema>) {
        try {
            setLoading(true);
            const res = await axiosInstance.patch(
                `/api/v1/restaurant/update-details/${restaurant._id}`,
                data
            );

            toast.success("Updated successfully");
            queryClient.invalidateQueries({queryKey: ["restaurant"]})
            onUpdated(res.data.restaurant);
            onClose();
        } catch (err: any) {
            toast.error(err?.response?.data?.msg || "Update failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <div className="absolute inset-0" onClick={onClose} />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ duration: 0.25 }}
                    className="relative z-10 w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
                >
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-gray-900">
                            Edit restaurant
                        </h2>

                        <button
                            onClick={onClose}
                            className="rounded-full p-2 hover:bg-gray-100"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="mt-6 space-y-5"
                    >
                        <div>
                            <label className="text-xs text-gray-500">Name</label>
                            <input
                                {...form.register("name")}
                                className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-red-400 focus:bg-white"
                            />
                            {form.formState.errors.name && (
                                <p className="mt-1 text-xs text-red-500">
                                    {form.formState.errors.name.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="text-xs text-gray-500">Phone</label>
                            <input
                                {...form.register("phone")}
                                type="text"
                                className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-red-400 focus:bg-white"
                            />
                            {form.formState.errors.phone && (
                                <p className="mt-1 text-xs text-red-500">
                                    {form.formState.errors.phone.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="text-xs text-gray-500">Description</label>
                            <textarea
                                {...form.register("description")}
                                rows={3}
                                className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-red-400 focus:bg-white"
                            />
                            {form.formState.errors.description && (
                                <p className="mt-1 text-xs text-red-500">
                                    {form.formState.errors.description.message}
                                </p>
                            )}
                        </div>

                        <div className="mt-6 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                className="rounded-full bg-red-500 px-5 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-50"
                            >
                                {loading ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default EditRestaurantForm;