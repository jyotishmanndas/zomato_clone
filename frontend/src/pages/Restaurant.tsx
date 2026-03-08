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
      <div className="sticky top-0 z-40 border-b border-[color:var(--color-divider)] bg-[color:var(--color-surface)]/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[color:var(--color-bg-blush)] p-2 text-[color:var(--color-brand-red)]">
              <Utensils size={22} />
            </div>
            <div>
              <h1 className="font-display text-[18px] font-extrabold text-[color:var(--color-charcoal)]">
                {restaurant.name}
              </h1>
              <p className="text-[11px] text-[color:var(--color-text-secondary)]">
                Manage your restaurant profile, menu and incoming orders.
              </p>
            </div>
          </div>

          <div
            className={`flex items-center gap-3 rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${
              isStoreOpen
                ? "border-green-100 bg-green-50 text-green-700"
                : "border-[color:var(--color-divider)] bg-[color:var(--color-bg-blush)] text-[color:var(--color-text-secondary)]"
            }`}
          >
            <span>{isStoreOpen ? "Accepting orders" : "Store closed"}</span>
            <button
              onClick={toogleStatus}
              className={`relative flex h-5 w-9 items-center rounded-full transition-colors ${
                isStoreOpen ? "bg-green-500" : "bg-slate-300"
              }`}
            >
              <span
                className={`absolute h-3.5 w-3.5 rounded-full bg-[color:var(--color-surface)] shadow-sm transition-transform ${
                  isStoreOpen ? "translate-x-4" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="mx-auto flex max-w-5xl gap-6 px-6">
          <button
            onClick={() => setActiveTab("profile")}
            className={`border-b-2 pb-2 pt-1 text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === "profile"
                ? "border-[color:var(--color-brand-red)] text-[color:var(--color-brand-red)]"
                : "border-transparent text-[color:var(--color-text-secondary)]"
            }`}
          >
            <User size={16} /> Profile
          </button>
          <button
            onClick={() => setActiveTab("menu")}
            className={`border-b-2 pb-2 pt-1 text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === "menu"
                ? "border-[color:var(--color-brand-red)] text-[color:var(--color-brand-red)]"
                : "border-transparent text-[color:var(--color-text-secondary)]"
            }`}
          >
            <Package size={16} /> Menu
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`border-b-2 pb-2 pt-1 text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === "orders"
                ? "border-[color:var(--color-brand-red)] text-[color:var(--color-brand-red)]"
                : "border-transparent text-[color:var(--color-text-secondary)]"
            }`}
          >
            <Package2 size={16} /> Orders
          </button>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-6 pt-6">
        {activeTab === "menu" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-[20px] font-extrabold text-[color:var(--color-charcoal)]">
                Your menu
              </h2>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="btn-outline flex items-center gap-2 px-4 text-xs"
                style={{ height: 40 }}
              >
                {showAddForm ? <X size={16} /> : <Plus size={16} />}
                {showAddForm ? "Cancel" : "Create item"}
              </button>
            </div>

            {showAddForm && (
              <div className="rounded-3xl bg-[color:var(--color-surface)] p-4 shadow-sm ring-1 ring-[color:var(--color-divider)]">
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