import { ChevronDown, MapPin, Search, ShoppingCart, User } from "lucide-react";
import { Link, useLocation } from "react-router";
import { useAppSelector } from "../hooks/useRedux";
import SearchBar from "./SearchBar";

const Navbar = () => {
  const { pathname } = useLocation();
  const { user } = useAppSelector((state) => state.auth);
  const { city } = useAppSelector((state) => state.location);

  const isHomePage = pathname === "/home";

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[color:var(--color-divider)] bg-[color:var(--color-bg-blush)]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 pt-3 pb-2">
        <div className="flex items-center gap-3">
          <Link
            to={"/home"}
            className="font-display text-[24px] font-extrabold tracking-tight text-[color:var(--color-brand-red)]"
          >
            zomato
          </Link>

          {isHomePage && (
            <button className="hidden sm:flex items-center gap-2 rounded-2xl bg-[color:var(--color-surface)] px-3 py-2 shadow-sm">
              <MapPin className="h-4 w-4 text-[color:var(--color-brand-red)]" />
              <div className="text-left">
                <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[color:var(--color-text-secondary)]">
                  Delivering to
                </p>
                <p className="max-w-[140px] truncate text-xs font-semibold text-[color:var(--color-charcoal)]">
                  {city || "Select your location"}
                </p>
              </div>
              <ChevronDown className="h-4 w-4 text-[color:var(--color-text-secondary)]" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Link
            to={"/home"}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--color-surface)] text-[color:var(--color-text-secondary)] shadow-sm sm:hidden"
          >
            <Search className="h-4 w-4" />
          </Link>

          <Link to={"/cart"} className="relative inline-flex">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--color-surface)] text-[color:var(--color-brand-red)] shadow-sm">
              <ShoppingCart className="h-4 w-4" />
            </div>
            {/* Cart count is not wired yet, keep as subtle dot */}
            <span className="absolute -right-0.5 -top-0.5 h-[14px] w-[14px] rounded-full border border-[color:var(--color-surface)] bg-[color:var(--color-brand-red)] text-[10px] font-semibold text-white flex items-center justify-center">
              0
            </span>
          </Link>

          {user ? (
            <Link
              to={"/account"}
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-[color:var(--color-surface)] px-3 py-1.5 text-xs font-semibold text-[color:var(--color-charcoal)] shadow-sm"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[color:var(--color-bg-blush)]">
                <User className="h-4 w-4 text-[color:var(--color-brand-red)]" />
              </div>
              <span className="max-w-[120px] truncate">
                {user.name || "Account"}
              </span>
            </Link>
          ) : (
            <Link
              to={"/login"}
              className="hidden sm:inline-flex items-center justify-center rounded-full border border-[color:var(--color-brand-red)] px-4 py-1.5 text-xs font-semibold text-[color:var(--color-brand-red)]"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {isHomePage && <SearchBar />}
    </header>
  );
};

export default Navbar;