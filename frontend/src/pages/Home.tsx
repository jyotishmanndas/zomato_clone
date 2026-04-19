import { useEffect, useState } from "react";
import { useAppSelector } from "../hooks/useRedux";
import { axiosInstance } from "../config/axiosInstance";
import { useSearchParams } from "react-router";
import RestaurantCard from "../components/RestaurantCard";
import { motion } from "framer-motion";

const Home = () => {
  const { location } = useAppSelector((state) => state.location);
  const [searchParams] = useSearchParams();

  const search = (searchParams.get("search") || "").trim();

  console.log("SEARCH FRONTEND", search);


  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const getDistanceKm = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371;
    const dlat = ((lat2 - lat1) * Math.PI) / 180;
    const dlon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dlat / 2) * Math.sin(dlat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dlon / 2) *
      Math.sin(dlon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return +(R * c).toFixed(2);
  };

  const fetchRestaurant = async () => {
    try {
      if (!location?.latitude || !location?.longitude) {
        setRestaurants([]);
        return;
      }

      setLoading(true);
      const res = await axiosInstance.get(`api/v1/restaurant/all`, {
        params: {
          latitude: location.latitude,
          longitude: location.longitude,
          search,
        },
      });

      setRestaurants(res.data.restaurant ?? []);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setRestaurants([]);
      } else {
        console.log(error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurant();
  }, [location, search]);

  const showSkeleton =
    loading && location?.latitude && location?.longitude;

  return (
    <main className="mx-auto max-w-[1200px] px-4 pb-24 pt-52">
      {showSkeleton && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl bg-[color:var(--color-surface)] shadow-[var(--shadow-card)] ring-1 ring-[color:var(--color-divider)]"
            >
              <div className="skeleton-shimmer aspect-[16/9] w-full" />
              <div className="space-y-2 p-3">
                <div className="skeleton-shimmer h-4 w-3/4" />
                <div className="skeleton-shimmer h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!showSkeleton && !location?.latitude && (
        <motion.div
          className="flex flex-col items-center justify-center py-16 text-center"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div
            className="mb-4 flex h-28 w-28 items-center justify-center rounded-2xl bg-[color:var(--color-surface)] shadow-[var(--shadow-card)] ring-1 ring-[color:var(--color-divider)]"
            aria-hidden
          >
            <svg
              width="72"
              height="72"
              viewBox="0 0 120 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-[color:var(--color-brand-red)]"
            >
              <circle cx="60" cy="60" r="52" stroke="currentColor" strokeWidth="4" opacity="0.2" />
              <path
                d="M60 28v24l16 12"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className="font-display text-lg font-semibold text-[color:var(--color-charcoal)]">
            Turn on location
          </h2>
          <p className="mt-2 max-w-sm text-sm text-[color:var(--color-text-secondary)]">
            We need your location to show restaurants near you. Enable location access in your browser settings.
          </p>
        </motion.div>
      )}

      {!showSkeleton &&
        location?.latitude &&
        restaurants.length > 0 && (
          <motion.div
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
          >
            {restaurants.map((res: any) => {
              if (!location?.latitude || !location?.longitude) return null;

              const [resLng, resLat] = res.autoLocation.coordinates;

              const distance = getDistanceKm(
                location.latitude,
                location.longitude,
                resLat,
                resLng
              );

              return (
                <RestaurantCard
                  key={res._id}
                  id={res._id}
                  name={res.name}
                  distance={`${distance}`}
                  image={res.image ?? ""}
                  isOpen={res.isOpen}
                />
              );
            })}
          </motion.div>
        )}

      {!showSkeleton &&
        location?.latitude &&
        restaurants.length === 0 && (
          <motion.div
            className="flex flex-col items-center justify-center py-16 text-center"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div
              className="mb-4 flex h-28 w-28 items-center justify-center rounded-2xl bg-[color:var(--color-surface)] shadow-[var(--shadow-card)] ring-1 ring-[color:var(--color-divider)]"
              aria-hidden
            >
              <svg
                width="80"
                height="80"
                viewBox="0 0 120 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[color:var(--color-accent)]"
              >
                <path
                  d="M30 88h60M44 72c4-12 10-20 16-20s12 8 16 20"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <circle cx="60" cy="44" r="18" stroke="currentColor" strokeWidth="4" />
              </svg>
            </div>
            <h2 className="font-display text-lg font-semibold text-[color:var(--color-charcoal)]">
              No restaurants nearby
            </h2>
            <p className="mt-2 max-w-md text-sm text-[color:var(--color-text-secondary)]">
              Try widening your search or check back soon — new places join us every week.
            </p>
          </motion.div>
        )}
    </main>
  );
};

export default Home;