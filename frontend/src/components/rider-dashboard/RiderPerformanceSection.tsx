import { IndianRupee, PackageCheck } from "lucide-react";

type StatCard = {
  title: string;
  range: string;
  deliveredOrders: number;
  earnings: number;
};

type RiderPerformanceSectionProps = {
  statsCards: StatCard[];
  formatINR: (value: number) => string;
};

export default function RiderPerformanceSection({
  statsCards,
  formatINR,
}: RiderPerformanceSectionProps) {
  return (
    <section className="mb-5 rounded-3xl bg-white p-6 shadow-md ring-1 ring-gray-100">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Performance</h2>
          <p className="mt-1 text-sm text-gray-500">
            Track your earnings and delivery activity
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          Live
        </div>
      </div>

      {/* CARDS */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((card) => (
          <div
            key={card.title}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 p-5 shadow-sm ring-1 ring-gray-100 transition hover:shadow-md"
          >
            {/* subtle gradient accent */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-red-50 to-transparent" />

            {/* TOP */}
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {card.title}
                </p>
                <p className="mt-1 text-xs text-gray-400">{card.range}</p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <IndianRupee className="h-5 w-5" />
              </div>
            </div>

            {/* MAIN METRIC (IMPORTANT) */}
            <div className="relative mt-4">
              <p className="text-2xl font-extrabold text-gray-900 tracking-tight">
                {formatINR(card.earnings)}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">Total earnings</p>
            </div>

            {/* SECONDARY METRIC */}
            <div className="relative mt-4 flex items-center justify-between rounded-lg bg-white/70 px-3 py-2 ring-1 ring-gray-100">
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <PackageCheck className="h-4 w-4" />
                Delivered
              </span>

              <span className="text-sm font-semibold text-gray-800">
                {card.deliveredOrders}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}