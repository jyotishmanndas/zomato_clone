import React, { useEffect } from 'react'
import { useRiderProfile } from '../hooks/useRiderApi';
import toast from 'react-hot-toast';
import { axiosInstance } from '../config/axiosInstance';
import axios from 'axios';
import RiderProfileForm from '../components/forms/RiderProfileForm';

const RiderDashboard = () => {
  const { data, isLoading } = useRiderProfile();

  console.log("rider", data);

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
    </div>
  );
}

export default RiderDashboard