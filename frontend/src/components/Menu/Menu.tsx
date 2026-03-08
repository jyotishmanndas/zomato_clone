import { Edit2, Flame, Trash2 } from "lucide-react";
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
    <div className="flex gap-4 rounded-2xl bg-[color:var(--color-surface)] p-4 shadow-sm ring-1 ring-[color:var(--color-divider)]">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl">
        <img
          src={menu.image.url}
          alt={menu.name}
          className={`h-full w-full object-cover ${!menu.isAvailable ? "grayscale brightness-75" : ""
            }`}
        />
        {!menu.isAvailable && (
          <span className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/55 text-[10px] font-semibold uppercase tracking-[0.08em] text-white">
            Not available
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="mb-1 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="badge-veg">
                <span className="badge-veg-dot" />
              </span>
              <h4 className="text-[15px] font-semibold text-[color:var(--color-charcoal)]">
                {menu.name}
              </h4>
            </div>

          </div>

          {menu.description && (
            <p className="mt-0.5 line-clamp-2 text-xs text-[color:var(--color-text-secondary)]">
              {menu.description}
            </p>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <p className="font-price text-[15px] font-bold text-[color:var(--color-charcoal)]">
            ₹ {menu.price}
          </p>

          {isSeller ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleToggleAvailability(menu._id)}
                className={`relative h-5 w-9 rounded-full border transition-all duration-300 ${menu.isAvailable
                    ? "border-[color:var(--color-brand-red)] bg-[color:var(--color-brand-red)]/10"
                    : "border-[color:var(--color-divider)] bg-[color:var(--color-divider)]"
                  }`}
              >
                <span
                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-[color:var(--color-surface)] shadow-sm transition-all duration-300 ${menu.isAvailable ? "right-0.5" : "left-0.5"
                    }`}
                />
              </button>

              <button className="rounded-lg p-2 text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-bg-blush)] hover:text-[color:var(--color-brand-red)]">
                <Edit2 size={16} />
              </button>

              <button
                onClick={() => handleDelete(menu._id)}
                className="rounded-lg p-2 text-[color:var(--color-text-secondary)] transition-colors hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ) : (
            menu.isAvailable && (
              <button
                onClick={() =>
                  handleAddToCart(restaurantId, menu._id.toString())
                }
                className="btn-primary w-auto px-5 text-xs"
                style={{ height: 40 }}
              >
                ADD
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;