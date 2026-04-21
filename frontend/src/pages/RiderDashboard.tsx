import { useEffect, useRef, useState } from "react";
import { useRiderProfile, useRiderStats } from "../hooks/useRiderApi";
import toast from "react-hot-toast";
import { axiosInstance } from "../config/axiosInstance";
import axios from "axios";
import RiderProfileForm from "../components/forms/RiderProfileForm";
import riderAudio from "../assets/riderAudio.mp3";
import { useSocket } from "../hooks/useSocket";
import { useRiderOrderApi } from "../hooks/useOrderApi";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useAppDispatch } from "../hooks/useRedux";
import { removeUser } from "../features/authSlice";

import RiderDashboardHeader from "../components/rider-dashboard/RiderDashboardHeader";
import RiderPerformanceSection from "../components/rider-dashboard/RiderPerformanceSection";
import RiderProfileSection from "../components/rider-dashboard/RiderProfileSection";
import RiderOrdersSection from "../components/rider-dashboard/RiderOrdersSection";

type TabType = "dashboard" | "performance";

const RiderDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [incomingOrders, setIncomingOrders] = useState<string[]>([]);
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  const { data, isLoading } = useRiderProfile();
  const { data: riderStats } = useRiderStats();
  const { data: currentRiderOrder } = useRiderOrderApi();

  const socketRef = useSocket();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    audioRef.current = new Audio(riderAudio);
    audioRef.current.preload = "auto";
  }, []);

  const unlockAudio = async () => {
    try {
      if (!audioRef.current) return;

      await audioRef.current.play();
      audioRef.current.pause();
      audioRef.current.currentTime = 0;

      setAudioUnlocked(true);
      toast.success("Sound enabled");
    } catch {
      toast.error("Tap again to enable sound");
    }
  };

  const handleOrderAccepted = (orderId: string) => {
    setIncomingOrders((prev) => prev.filter((id) => id !== orderId));
  };

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const onOrderAvailable = ({ orderId }: { orderId: string }) => {
      setIncomingOrders((prev) =>
        prev.includes(orderId) ? prev : [...prev, orderId]
      );

      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => { });
      }

      setTimeout(() => {
        setIncomingOrders((prev) => prev.filter((id) => id !== orderId));
      }, 10000);
    };

    socket.on("order:available", onOrderAvailable);

    return () => {
      socket.off("order:available", onOrderAvailable);
    };
  }, [socketRef]);

  const toggleAvailability = () => {
    if (!navigator.geolocation) {
      toast.error("Location access required");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const { latitude, longitude } = pos.coords;

        const res = await axiosInstance.patch(`/api/v1/rider/toggle`, {
          isAvailable: !data?.isAvailable,
          latitude,
          longitude,
        });

        if (res.status === 200) {
          toast.success(
            data?.isAvailable ? "You are offline" : "You are online"
          );

          queryClient.invalidateQueries({
            queryKey: ["rider"],
          });
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data.msg);
        }
      }
    });
  };

  const handleLogout = async () => {
    try {
      const res = await axiosInstance.post(`/api/v1/auth/user/logout`);
      if (res.status === 200) {
        toast.success(res.data.msg);
        dispatch(removeUser());
        queryClient.clear();
        navigate("/login");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.msg);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-bg-blush text-text-secondary">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-divider border-t-brand-red" />
        <span className="mt-3 text-sm font-medium">
          Loading rider details...
        </span>
      </div>
    );
  }

  if (!data) {
    return <RiderProfileForm />;
  }

  const formatINR = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value || 0);

  const statsCards = [
    {
      title: "Today",
      range: "Since midnight",
      deliveredOrders: riderStats?.today?.deliveredOrders ?? 0,
      earnings: riderStats?.today?.earnings ?? 0,
    },
    {
      title: "Last 7 days",
      range: "Including today",
      deliveredOrders: riderStats?.last7Days?.deliveredOrders ?? 0,
      earnings: riderStats?.last7Days?.earnings ?? 0,
    },
    {
      title: "Last 30 days",
      range: "Including today",
      deliveredOrders: riderStats?.last30Days?.deliveredOrders ?? 0,
      earnings: riderStats?.last30Days?.earnings ?? 0,
    },
    {
      title: "All time",
      range: "Total delivered",
      deliveredOrders: riderStats?.allTime?.deliveredOrders ?? 0,
      earnings: riderStats?.allTime?.earnings ?? 0,
    },
  ];

  return (
    <div className="min-h-screen bg-bg-blush pt-20 pb-24">
      <div className="mx-auto max-w-5xl px-4">

        <RiderDashboardHeader
          isAvailable={data.isAvailable}
          onLogout={handleLogout}
        />

        <div className="mt-5 flex gap-2 rounded-xl bg-white p-1 shadow-sm w-fit">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition ${activeTab === "dashboard"
                ? "bg-brand-red text-white"
                : "text-gray-600"
              }`}
          >
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab("performance")}
            className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition ${activeTab === "performance"
                ? "bg-brand-red text-white"
                : "text-gray-600"
              }`}
          >
            Performance
          </button>
        </div>

        {activeTab === "dashboard" && (
          <main className="mt-5 grid gap-5 md:grid-cols-[1.2fr,1.8fr]">
            <RiderProfileSection
              picture={data.picture}
              mobile={data.mobile}
              isVerified={data.isVerified}
              aadhaarNumber={data.aadhaarNumber}
              drivingLicenceNumber={data.drivingLicenceNumber}
              isAvailable={data.isAvailable}
              onToggleAvailability={toggleAvailability}
            />

            <RiderOrdersSection
              isAvailable={data.isAvailable}
              incomingOrders={incomingOrders}
              audioUnlocked={audioUnlocked}
              onEnableSound={unlockAudio}
              currentRiderOrder={currentRiderOrder}
              onOrderAccepted={handleOrderAccepted}
            />
          </main>
        )}

        {activeTab === "performance" && (
          <div className="mt-5">
            <RiderPerformanceSection
              statsCards={statsCards}
              formatINR={formatINR}
            />
          </div>
        )}

      </div>
    </div>
  );
};

export default RiderDashboard;