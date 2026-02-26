import { Edit2, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
// import { useMenuApi } from "../../hooks/useMenuApi";
import { axiosInstance } from "../../config/axiosInstance";
import toast from "react-hot-toast";
import axios from "axios";

interface MenuProps {
    menu: any;
    isSeller: boolean;
    restaurantId?: string
}

const Menu = ({ menu, isSeller, restaurantId }: MenuProps) => {
    // const { data, isLoading } = useMenuApi();
    // const [menus, setMenus] = useState<any[]>([]);

    // useEffect(() => {
    //     if (data) {
    //         setMenus(data);
    //     }
    // }, [data]);

    const handleToggleAvailability = async (id: string) => {
        // setMenus((prev) =>
        //     prev.map((item) =>
        //         item._id === id
        //             ? { ...item, isAvailable: !item.isAvailable }
        //             : item
        //     )
        // );

        try {
            const res = await axiosInstance.patch(
                `/api/v1/menu/status/${id}`
            );
            toast.success(res.data.msg);
        } catch (error) {
            toast.error("Failed to update availability");

            // setMenus((prev) =>
            //     prev.map((item) =>
            //         item._id === id
            //             ? { ...item, isAvailable: !item.isAvailable }
            //             : item
            //     )
            // );
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this item?")) return;

        try {
            await axiosInstance.delete(`/api/v1/menu/delete/${id}`);
            // setMenus((prev) => prev.filter((item) => item._id !== id));
            toast.success("Item deleted successfully");
        } catch (error) {
            toast.error("Delete failed");
        }
    };

    const handleAddToCart = async (restaurantId: string | undefined, id: string) => {
        try {
            const res = await axiosInstance.post(`/api/v1/cart/addToCart`, { restaurantId, itemId: id });
            if (res.status === 201 || 200) {
                toast.success(res.data.msg)
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data.msg)
            }
        }
    }

    // if (isLoading) {
    //     return (
    //         <div className="flex justify-center py-10">
    //             <span className="animate-pulse text-slate-400 font-medium">
    //                 Loading menu...
    //             </span>
    //         </div>
    //     );
    // }

    // if (!menus || menus.length === 0) {
    //     return (
    //         <div className="bg-white p-10 rounded-3xl border border-dashed border-slate-200 text-center">
    //             <p className="text-slate-500 font-medium">
    //                 No menu items added yet.
    //             </p>
    //         </div>
    //     );
    // }

    return (
        <div
            className="bg-white p-6 rounded-3xl border border-slate-100 flex gap-5 shadow-sm hover:shadow-lg transition-all duration-300"
        >
            <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 relative">
                <img
                    src={menu.image.url}
                    alt={menu.name}
                    className={`w-full h-full object-cover ${!menu.isAvailable ? "grayscale brightness-75" : ""}`}
                />
                {!menu.isAvailable &&
                    <span className="absolute inset-0 flex items-center justify-center rounded bg-black/60 text-xs font-semibold text-white">Not Avaliable</span>
                }
            </div>

            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-900 capitalize text-lg">
                            {menu.name}
                        </h4>

                        <span
                            className={`text-xs font-bold px-3 py-1 rounded-full ${menu.isAvailable
                                ? "bg-green-100 text-green-600"
                                : "bg-red-100 text-red-600"
                                }`}
                        >
                            {menu.isAvailable ? "Available" : "Unavailable"}
                        </span>
                    </div>

                    {menu.description && (
                        <p className="text-sm text-slate-500 mt-2 line-clamp-2">
                            {menu.description}
                        </p>
                    )}
                </div>

                <div className="flex items-center justify-between mt-4">
                    <p className="text-red-500 font-black text-xl">
                        ₹ {menu.price}
                    </p>

                    {isSeller ? (
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => handleToggleAvailability(menu._id)}
                                className={`relative w-10 h-5 rounded-full border transition-all duration-300 ${menu.isAvailable
                                    ? "bg-blue-100 border-blue-400"
                                    : "bg-slate-200 border-slate-300"
                                    }`}
                            >
                                <span
                                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${menu.isAvailable ? "translate-x-5" : ""
                                        }`}
                                />
                            </button>

                            <button className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all">
                                <Edit2 size={16} />
                            </button>

                            <button
                                onClick={() => handleDelete(menu._id)}
                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ) : (
                        menu.isAvailable && (
                            <button onClick={() => handleAddToCart(restaurantId, menu._id.toString())} className="bg-[#E23744] hover:bg-black text-white px-4 py-2 rounded-xl text-sm font-bold transition-all active:scale-95">
                                Add to Cart
                            </button>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default Menu;