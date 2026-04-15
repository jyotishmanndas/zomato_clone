import { useNavigate } from "react-router";
import { motion } from "framer-motion";

interface RestaurantCardProps {
  id: string;
  name: string;
  image: string;
  distance: string;
  isOpen: boolean;
  rating?: number;
  deliveryTimeMins?: number;
  isVeg?: boolean;
}

const RestaurantCard = ({
  id,
  name,
  image,
  distance,
  isOpen,
  rating = 4.3,
  deliveryTimeMins,
  isVeg,
}: RestaurantCardProps) => {
  const navigate = useNavigate();

  const eta =
    deliveryTimeMins ??
    Math.min(55, Math.max(25, Math.round(Number(distance || 3) * 10)));

  return (
    <motion.article
      layout
      onClick={() => navigate(`/restaurant/${id}`)}
      className={`group cursor-pointer overflow-hidden rounded-xl bg-[color:var(--color-surface)] shadow-[var(--shadow-card)] ring-1 ring-[color:var(--color-divider)] transition-shadow duration-300 hover:shadow-[var(--shadow-card-hover)] ${
        !isOpen ? "opacity-80" : ""
      }`}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <img
          src={image}
          alt={name}
          loading="lazy"
          decoding="async"
          className={`h-full w-full object-cover transition duration-500 group-hover:scale-[1.04] ${
            !isOpen ? "grayscale" : ""
          }`}
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
        <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-full bg-black/70 px-2 py-1 text-[11px] font-semibold text-white">
          <span className="inline-flex items-center rounded-md bg-[color:var(--color-success)] px-1.5 py-0.5 text-[10px] font-bold text-white">
            ★ {rating.toFixed(1)}
          </span>
          <span className="text-[10px] text-gray-200">• {eta} mins</span>
          <span className="text-[10px] text-gray-200">• {distance} km</span>
        </div>

        {!isOpen && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="rounded-full bg-black/80 px-3 py-1 text-xs font-semibold text-white">
              Currently closed
            </span>
          </div>
        )}
      </div>

      <div className="space-y-1.5 px-3.5 py-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-1.5">
            {isVeg !== undefined && (
              <span className={isVeg ? "badge-veg" : "badge-nonveg"}>
                <span
                  className={isVeg ? "badge-veg-dot" : "badge-nonveg-dot"}
                />
              </span>
            )}
            <h3 className="line-clamp-1 text-[15px] font-semibold text-[color:var(--color-charcoal)]">
              {name}
            </h3>
          </div>
          <span className="shrink-0 font-price text-[13px] font-semibold text-[color:var(--color-text-secondary)]">
            {distance} km away
          </span>
        </div>
      </div>
    </motion.article>
  );
};

export default RestaurantCard;
