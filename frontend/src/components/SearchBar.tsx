import { Search } from "lucide-react";
import { useAppSelector } from "../hooks/useRedux";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

const SearchBar = () => {
  const { city } = useAppSelector((state) => state.location);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search) {
        setSearchParams({ search });
      } else {
        setSearchParams({});
      }
    }, 400);

    return () => {
      clearTimeout(timer);
    };
  }, [search, setSearchParams]);

  return (
    <div className="px-4 pb-3 pt-2">
      <div className="mx-auto flex max-w-6xl flex-col gap-3">
        <p className="text-xs font-medium text-[color:var(--color-text-secondary)]">
          {city ? `Discover great food in ${city}` : "Search for food and places"}
        </p>

        <div className="flex items-center gap-2">
          <div className="input-shell flex-1">
            <Search className="h-4 w-4 text-[color:var(--color-text-secondary)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for restaurants or dishes"
              className="w-full bg-transparent text-sm outline-none placeholder:text-[color:var(--color-text-secondary)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;