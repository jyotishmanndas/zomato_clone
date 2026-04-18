import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { X, Loader2, Save } from "lucide-react";
import { axiosInstance } from "../../config/axiosInstance";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
    menu: any;
    onClose: () => void;
};

const EditMenuForm = ({ menu, onClose }: Props) => {
    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();

    const { register, handleSubmit } = useForm({
        defaultValues: {
            name: menu.name,
            price: menu.price,
            description: menu.description || "",
        },
    });

    const onSubmit = async (data: any) => {
        try {
            setLoading(true);
            const res = await axiosInstance.patch(
                `/api/v1/menu/update/${menu._id}`,
                data
            );

            toast.success(res.data.msg);
            queryClient.invalidateQueries({ queryKey: ["menu"] });

            onClose();
        } catch (err: any) {
            toast.error(err?.response?.data?.msg || "Update failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                {/* click outside */}
                <div className="absolute inset-0" onClick={onClose} />

                {/* modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ duration: 0.25 }}
                    className="relative z-10 w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
                >
                    {/* HEADER */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-gray-900">
                            Edit menu item
                        </h2>

                        <button
                            onClick={onClose}
                            className="rounded-full p-2 hover:bg-gray-100"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* FORM */}
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="mt-6 space-y-5"
                    >
                        {/* NAME */}
                        <div>
                            <label className="text-xs text-gray-500">Name</label>
                            <input
                                {...register("name")}
                                className="mt-1 w-full rounded-xl bg-gray-50 px-4 py-3 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-red-400"
                            />
                        </div>

                        {/* PRICE */}
                        <div>
                            <label className="text-xs text-gray-500">Price</label>
                            <div className="relative mt-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                                    ₹
                                </span>
                                <input
                                    {...register("price")}
                                    type="number"
                                    className="w-full pl-8 pr-4 py-3 rounded-xl bg-gray-50 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-red-400"
                                />
                            </div>
                        </div>

                        {/* DESCRIPTION */}
                        <div>
                            <label className="text-xs text-gray-500">Description</label>
                            <textarea
                                {...register("description")}
                                rows={3}
                                className="mt-1 w-full rounded-xl bg-gray-50 px-4 py-3 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-red-400 resize-none"
                            />
                        </div>

                        {/* ACTIONS */}
                        <div className="flex justify-end gap-3 mt-6">
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
                                className="rounded-full bg-red-500 px-5 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-50 flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={16} />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save size={16} />
                                        Save
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default EditMenuForm;