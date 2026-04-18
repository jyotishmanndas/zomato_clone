import {
  ChevronDown,
  MapPin,
  Search,
  ShoppingCart,
  User,
} from "lucide-react";
import { Link, useLocation } from "react-router";
import { useAppSelector } from "../hooks/useRedux";
import SearchBar from "./SearchBar";

const Navbar = () => {
  const { pathname } = useLocation();
  const { user } = useAppSelector((state) => state.auth);
  const { city } = useAppSelector((state) => state.location);

  const isHomePage = pathname === "/home";
  const cart = pathname !== "/login"

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[color:var(--color-divider)] bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-[64px] max-w-6xl items-center justify-between px-4">

        <div className="flex items-center gap-4">
          <Link
            to="/home"
            className="font-display text-[22px] font-extrabold text-[color:var(--color-brand-red)]"
          >
            zomato
          </Link>

          {isHomePage && (
            <div className="hidden sm:flex items-center gap-2 rounded-xl bg-[color:var(--color-bg-blush)] px-3 py-2">
              <MapPin className="h-4 w-4 text-[color:var(--color-brand-red)]" />
              <span className="text-sm font-medium max-w-[140px] truncate">
                {city || "Select location"}
              </span>
              <ChevronDown className="h-4 w-4 text-[color:var(--color-text-secondary)]" />
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/home"
            className="sm:hidden flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--color-bg-blush)]"
          >
            <Search className="h-4 w-4 text-[color:var(--color-text-secondary)]" />
          </Link>

          {cart && (
            <Link to="/cart">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--color-bg-blush)] hover:bg-gray-200 transition">
                <ShoppingCart className="h-4 w-4 text-[color:var(--color-brand-red)]" />
              </div>
            </Link>
          )}

          {user && (
            <Link
              to="/account"
              className="flex items-center gap-2 rounded-full bg-[color:var(--color-bg-blush)] px-3 py-1.5 hover:bg-gray-200 transition"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white">
                <User className="h-4 w-4 text-[color:var(--color-brand-red)]" />
              </div>
              <span className="hidden sm:block text-sm font-medium max-w-[120px] truncate">
                {user.name}
              </span>
            </Link>
          )}
        </div>
      </div>

      {isHomePage && <SearchBar />}
    </header>
  );
};

export default Navbar;