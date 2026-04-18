import { useEffect, useState } from "react";
import { useRestaurantApi } from "../hooks/useRestaurantApi";
import {
  Plus,
  Store,
  Utensils,
  User,
  Package,
  X,
  Package2,
} from "lucide-react";
import { axiosInstance } from "../config/axiosInstance";
import toast from "react-hot-toast";
import MenuForm from "../components/forms/MenuForm";
import { useNavigate } from "react-router";
import RestaurantProfile from "../components/RestaurantProfile";
import { useMenuApi } from "../hooks/useMenuApi";
import Menu from "../components/Menu/Menu";
import RestaurantOrders from "../components/RestaurantOrders";

const Restaurant = () => {
  const { data, isLoading } = useRestaurantApi();
  const { data: menus } = useMenuApi();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("profile");
  const [isStoreOpen, setIsStoreOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const restaurant = data || {};

  useEffect(() => {
    if (restaurant?.isOpen !== undefined) {
      setIsStoreOpen(restaurant.isOpen);
    }
  }, [restaurant]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[color:var(--color-bg-blush)]">
        <div className="relative flex items-center justify-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-[color:var(--color-divider)] border-t-[color:var(--color-brand-red)]" />
          <Store
            className="absolute text-[color:var(--color-brand-red)]"
            size={24}
          />
        </div>
        <p className="mt-4 text-sm font-medium text-[color:var(--color-text-secondary)]">
          Loading your storefront...
        </p>
      </div>
    );
  }

  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="flex h-screen flex-col bg-[color:var(--color-bg-blush)]">
        <div className="flex flex-1 items-center justify-center px-6">
          <div className="w-full max-w-md rounded-[2.5rem] border border-[color:var(--color-divider)] bg-[color:var(--color-surface)] p-8 text-center shadow-sm">
            <div className="mb-8 inline-flex h-24 w-24 rotate-3 items-center justify-center rounded-3xl bg-[color:var(--color-bg-blush)] text-[color:var(--color-brand-red)]">
              <Store size={48} strokeWidth={1.5} />
            </div>
            <h2 className="mb-3 font-display text-3xl font-extrabold text-[color:var(--color-charcoal)]">
              Ready to sell?
            </h2>
            <p className="mb-8 text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
              You haven't registered a restaurant yet. Create one and start
              reaching thousands of hungry customers today.
            </p>
            <button
              onClick={() => navigate("/create-restaurant")}
              className="btn-primary flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Create restaurant
            </button>
          </div>
        </div>
      </div>
    );
  }

  const toogleStatus = async () => {
    const res = await axiosInstance.patch(
      `/api/v1/restaurant/status/${restaurant._id}`
    );
    if (res.status === 200) {
      toast.success(res.data.msg);
      setIsStoreOpen(res.data.restaurant.isOpen);
    }
  };

  return (
    <div className="min-h-screen bg-[color:var(--color-bg-blush)] pb-24">
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[color:var(--color-bg-blush)] text-[color:var(--color-brand-red)]">
              <Utensils size={22} />
            </div>

            <div>
              <h1 className="text-lg font-bold text-[color:var(--color-charcoal)]">
                {restaurant.name}
              </h1>
              <p className="text-xs text-[color:var(--color-text-secondary)]">
                Manage your restaurant
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`text-xs font-semibold ${isStoreOpen
                ? "text-green-600"
                : "text-gray-400"
                }`}
            >
              {isStoreOpen ? "Live" : "Offline"}
            </span>

            <button
              onClick={toogleStatus}
              className={`relative h-6 w-11 rounded-full transition-all duration-300 ${isStoreOpen
                ? "bg-green-500"
                : "bg-gray-300"
                }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-all duration-300 ${isStoreOpen
                  ? "left-[22px]"
                  : "left-[2px]"
                  }`}
              />
            </button>
          </div>
        </div>

        <div className="mx-auto flex max-w-6xl gap-2 px-6 pb-3">
          {[
            { key: "profile", label: "Profile", icon: User },
            { key: "menu", label: "Menu", icon: Package },
            { key: "orders", label: "Orders", icon: Package2 },
          ].map((tab) => {
            const Icon = tab.icon;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all ${activeTab === tab.key
                  ? "bg-[color:var(--color-brand-red)] text-white shadow-sm"
                  : "text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-bg-blush)]"
                  }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-6 pt-6">
        {activeTab === "menu" && (
          <div className="space-y-6">

            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[color:var(--color-charcoal)]">
                Menu items
              </h2>

              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-2 rounded-full bg-[color:var(--color-brand-red)] px-4 py-2 text-xs font-semibold text-white hover:bg-[color:var(--color-brand-red-hover)] transition"
              >
                {showAddForm ? <X size={16} /> : <Plus size={16} />}
                {showAddForm ? "Close" : "Add item"}
              </button>
            </div>

            {showAddForm && (
              <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[color:var(--color-divider)]">
                <MenuForm restaurantId={restaurant._id} />
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {menus.map((m: any) => (
                <Menu key={m.id} menu={m} isSeller={true} />
              ))}
            </div>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="pt-2">
            <RestaurantProfile restaurant={restaurant} />
          </div>
        )}

        {activeTab === "orders" && (
          <div className="pt-2">
            <RestaurantOrders restaurantId={restaurant._id} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Restaurant;