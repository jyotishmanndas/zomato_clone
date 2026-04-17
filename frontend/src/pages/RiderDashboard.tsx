import { useEffect, useRef, useState } from "react";
import { useRiderProfile } from "../hooks/useRiderApi";
import toast from "react-hot-toast";
import { axiosInstance } from "../config/axiosInstance";
import axios from "axios";
import RiderProfileForm from "../components/forms/RiderProfileForm";
import riderAudio from "../assets/riderAudio.mp3";
import { useSocket } from "../hooks/useSocket";
import RiderOrderRequest from "../components/RiderOrderRequest";
import { Bike, ShieldCheck } from "lucide-react";
import { useRiderOrderApi } from "../hooks/useOrderApi";
import RiderCurrentOrder from "../components/RiderCurrentOrder";
import type { IOrder } from "../types";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useAppDispatch } from "../hooks/useRedux";
import { removeUser } from "../features/authSlice";
import RiderOrderMap from "../components/RiderOrderMap";

const RiderDashboard = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [incomingOrders, setIncomingOrders] = useState<string[]>([]);
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  const { data, isLoading } = useRiderProfile();
  const { data: currentRiderOrder } = useRiderOrderApi();

  const socketRef = useSocket();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // console.log(currentRiderOrder);


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
      toast.success("Tap again to enable sound");
    }
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
      }, 20000);
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
      alert("Do you want to log out");
      const res = await axiosInstance.post(`/api/v1/auth/user/logout`);
      if (res.status === 200) {
        toast.success(res.data.msg);
        dispatch(removeUser());
        queryClient.clear();
        navigate("/login")
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.msg)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[color:var(--color-bg-blush)] text-[color:var(--color-text-secondary)]">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-[color:var(--color-divider)] border-t-[color:var(--color-brand-red)]" />
        <span className="mt-3 text-sm font-medium">
          Loading rider details...
        </span>
      </div>
    );
  }

  if (!data) {
    return <RiderProfileForm />;
  }

  return (
    <div className="min-h-screen bg-[color:var(--color-bg-blush)] pt-20 pb-24">
      <div className="mx-auto max-w-4xl px-4">

        <header className="mb-5 flex items-center justify-between gap-4 rounded-3xl bg-[color:var(--color-surface)] p-4 shadow-sm ring-1 ring-[color:var(--color-divider)]">

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--color-brand-red)]/10 text-[color:var(--color-brand-red)]">
              <Bike className="h-6 w-6" />
            </div>

            <div>
              <h1 className="font-display text-[18px] font-extrabold text-[color:var(--color-charcoal)]">
                Rider dashboard
              </h1>
              <p className="text-xs text-[color:var(--color-text-secondary)]">
                Manage your availability and accept delivery requests in real time.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">

            <div className="flex items-center gap-2 rounded-full bg-[color:var(--color-bg-blush)] px-3 py-1">
              <span
                className={`inline-flex h-2 w-2 rounded-full ${data.isAvailable
                  ? "bg-[color:var(--color-success)]"
                  : "bg-red-500"
                  }`}
              />
              <span className="text-xs font-medium text-[color:var(--color-text-secondary)]">
                {data.isAvailable ? "Online" : "Offline"}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-full bg-red-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-600"
            >
              Logout
            </button>

          </div>
        </header>

        <main className="grid gap-5 md:grid-cols-[1.4fr,1.6fr]">

          <section className="space-y-4 rounded-3xl bg-[color:var(--color-surface)] p-5 shadow-sm ring-1 ring-[color:var(--color-divider)]">

            <div className="flex items-center gap-4">
              <img
                src={data.picture}
                alt="rider"
                className="h-16 w-16 rounded-full object-cover"
              />

              <div>
                <p className="text-sm font-semibold text-[color:var(--color-charcoal)]">
                  {data.mobile}
                </p>

                <p className="mt-1 flex items-center gap-1 text-[11px] text-[color:var(--color-text-secondary)]">
                  <ShieldCheck
                    className={`h-3.5 w-3.5 ${data.isVerified
                      ? "text-[color:var(--color-success)]"
                      : "text-[color:var(--color-text-secondary)]"
                      }`}
                  />

                  {data.isVerified
                    ? "Verified partner"
                    : "Verification pending"}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-[color:var(--color-text-secondary)]">
              <div className="flex items-center justify-between rounded-2xl bg-[color:var(--color-bg-blush)] px-3 py-2">
                <span className="font-medium">Aadhaar</span>
                <span className="font-semibold">
                  ****{data.aadhaarNumber.slice(-4)}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-[color:var(--color-bg-blush)] px-3 py-2">
                <span className="font-medium">Driving licence</span>
                <span className="font-semibold">
                  ****{data.drivingLicenceNumber.slice(-4)}
                </span>
              </div>
            </div>

            <button onClick={toggleAvailability} className="btn-primary mt-3">
              {data.isAvailable ? "Go offline" : "Go online"}
            </button>
          </section>

          <section className="space-y-4">

            {!audioUnlocked && (
              <div className="flex items-center justify-between gap-3 rounded-3xl bg-blue-50 p-4 text-xs text-blue-900 ring-1 ring-blue-100">

                <div className="flex items-center gap-3">
                  <span className="text-2xl">🔔</span>

                  <div>
                    <p className="text-sm font-semibold">
                      Enable sound notifications
                    </p>
                    <p className="text-[11px]">
                      Get a chime whenever a new order is assigned to you.
                    </p>
                  </div>
                </div>

                <button
                  onClick={unlockAudio}
                  className="rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                >
                  Enable sound
                </button>

              </div>
            )}

            <div className="space-y-3 rounded-3xl bg-[color:var(--color-surface)] p-5 shadow-sm ring-1 ring-[color:var(--color-divider)]">

              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[color:var(--color-charcoal)]">
                  Incoming orders
                </h3>

                {data.isAvailable ? (
                  <span className="meta-text">
                    {incomingOrders.length > 0
                      ? `${incomingOrders.length} new`
                      : "Waiting for new orders"}
                  </span>
                ) : (
                  <span className="meta-text">
                    Go online to receive orders
                  </span>
                )}
              </div>

              {data.isAvailable && incomingOrders.length > 0 && (
                <div className="space-y-3">
                  {incomingOrders.map((orderId) => (
                    <RiderOrderRequest key={orderId} orderId={orderId} />
                  ))}
                </div>
              )}

              {currentRiderOrder && (
                <div className="flex items-center gap-3">
                  {currentRiderOrder.map((order: IOrder) => (
                    <div className="mx-auto max-w-md px-4 space-y-4">
                      <RiderCurrentOrder order={order} />

                      <RiderOrderMap order={order} />
                    </div>
                  ))}
                </div>
              )}

            </div>

          </section>

        </main>

      </div>
    </div>
  );
};

export default RiderDashboard;