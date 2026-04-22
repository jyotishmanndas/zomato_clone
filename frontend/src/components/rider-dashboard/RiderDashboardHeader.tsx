import { Bike } from "lucide-react";
import { useLogout } from "../../hooks/useLogout";

type RiderDashboardHeaderProps = {
  isAvailable: boolean;
};

export default function RiderDashboardHeader({
  isAvailable,
}: RiderDashboardHeaderProps) {

  const logout = useLogout()

  return (
    <header className="mb-5 flex items-center justify-between gap-4 rounded-3xl bg-surface p-4 shadow-sm ring-1 ring-divider">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-red/10 text-brand-red">
          <Bike className="h-6 w-6" />
        </div>

        <div>
          <h1 className="font-display text-[18px] font-extrabold text-charcoal">
            Rider dashboard
          </h1>
          <p className="text-xs text-text-secondary">
            Manage your availability and accept delivery requests in real time.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-full bg-bg-blush px-3 py-1">
          <span
            className={`inline-flex h-2 w-2 rounded-full ${isAvailable ? "bg-success" : "bg-red-500"
              }`}
          />
          <span className="text-xs font-medium text-text-secondary">
            {isAvailable ? "Online" : "Offline"}
          </span>
        </div>

        <button
          onClick={logout}
          className="rounded-full bg-red-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

