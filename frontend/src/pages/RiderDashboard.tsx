import { useEffect, useRef, useState } from 'react'
import { useRiderProfile } from '../hooks/useRiderApi';
import toast from 'react-hot-toast';
import { axiosInstance } from '../config/axiosInstance';
import axios from 'axios';
import RiderProfileForm from '../components/forms/RiderProfileForm';
import riderAudio from "../assets/riderAudio.mp3"
import { useSocket } from '../hooks/useSocket';
import { useRiderOrderApi } from '../hooks/useOrderApi';
import RiderOrderRequest from '../components/RiderOrderRequest';

const RiderDashboard = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [incomingOrders, setIncomingOrders] = useState<string[]>([]);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const { data, isLoading } = useRiderProfile();
  const { data: riderOrder } = useRiderOrderApi();
  const socketRef = useSocket();

  useEffect(() => {
    audioRef.current = new Audio(riderAudio);
    audioRef.current.preload = "auto";
  }, []);

  const unlockAudio = async () => {
    try {
      if (!audioRef.current) return;

      await audioRef.current.play();
      audioRef.current.pause()
      audioRef.current.currentTime = 0;
      setAudioUnlocked(true);
      toast.success("Sound enabled")
    } catch (error) {
      toast.success("Tap again to enable sound")
    }
  };

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const onOrderAvailable = ({ orderId }: { orderId: string }) => {
      setIncomingOrders((prev) => prev.includes(orderId) ? prev : [...prev, orderId])

      if (socket && audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch((err) => {
          console.log("Audio failed to play", err);
        })
      };

      setTimeout(() => {
        setIncomingOrders((prev) => prev.filter((id) => id !== orderId))
      }, 20000)

    };

    socket.on("order:available", onOrderAvailable)

    return () => {
      socket.off("order:available", onOrderAvailable)
    }

  }, [socketRef])

  const toggleAvailability = () => {
    if (!navigator.geolocation) {
      toast.error("Location access required");
      return;
    };

    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const { latitude, longitude } = pos.coords;
        const res = await axiosInstance.patch(`/api/v1/rider/toggle`, {
          isAvailable: !data?.isAvailable,
          latitude,
          longitude
        });

        if (res.status === 200) {
          toast.success(data?.isAvailable ? "Your are offline" : "You are online")
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data.msg)
        }
      }
    })
  };

  if (isLoading) {
    return <div className=' h-screen flex flex-col items-center justify-center'>
      <div className='h-6 w-6 rounded-full border animate-spin' />
      <span>Loading rider details</span>
    </div>
  };

  if (!data) {
    return <RiderProfileForm />
  }

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-lg rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-6">Rider Dashboard</h2>

      <div className="flex items-center gap-4 mb-6">
        <img
          src={data.picture}
          alt="rider"
          className="w-20 h-20 rounded-full object-cover"
        />

        <div>
          <p className="font-semibold">{data.mobile}</p>
          <p className="text-sm text-gray-500">
            Verified: {data.isVerified ? "Yes" : "No"}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="border p-3 rounded-lg flex justify-between">
          <span>Aadhaar</span>
          <span>****{data.aadhaarNumber.slice(-4)}</span>
        </div>

        <div className="border p-3 rounded-lg flex justify-between">
          <span>Driving Licence</span>
          <span>****{data.drivingLicenceNumber.slice(-4)}</span>
        </div>

        <div className="border p-3 rounded-lg flex justify-between">
          <span>Status</span>
          <span
            className={`font-semibold ${data.isAvailable ? "text-green-600" : "text-red-500"
              }`}
          >
            {data.isAvailable ? "Online" : "Offline"}
          </span>
        </div>
      </div>

      <button
        onClick={toggleAvailability}
        className={`mt-6 w-full py-3 rounded-lg text-white ${data.isAvailable
          ? "bg-red-500 hover:bg-red-600"
          : "bg-green-500 hover:bg-green-600"
          }`}
      >
        {data.isAvailable ? "Go Offline" : "Go Online"}
      </button>

      <div className='space-y-5'>
        {!audioUnlocked && (
          <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <span className='text-2xl'>🔔</span>
              <div>
                <p className='font-medium text-blue-900'>Enable sound notification</p>
                <p className='text-sm text-blue-700'>Get notified when new orders arrive</p>
              </div>
            </div>

            <button onClick={unlockAudio} className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition'>Enable sound</button>
          </div>
        )}

        <div className='space-y-3'>
          {data.isAvailable && incomingOrders.length > 0 && (
              <div className='mx-auto max-w-md px-4 space-y-3'>
                <h3 className='font-semibold text-gray-700'>Incomming orders</h3>
                  {incomingOrders.map((orderId) =>(
                   <RiderOrderRequest key={orderId} orderId={orderId} />
                  ))}
              </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RiderDashboard