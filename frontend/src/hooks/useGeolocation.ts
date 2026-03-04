import React, { useEffect } from 'react'
import { useAppDispatch } from './useRedux';
import { setCity, setLocation } from '../features/locationSlice';
import { axiosInstance } from '../config/axiosInstance';

export const useGeolocation = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!navigator.geolocation) return alert("Please allow the location to continue");

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;

            try {
                const { data } = await axiosInstance.get(
                    `/api/v1/location/reverse`,
                    {
                        params: { lat: latitude, lng: longitude },
                    }
                );

                dispatch(setLocation({
                    latitude,
                    longitude,
                    formattedAddress: data.display_name || "current location"
                }))

                dispatch(setCity(data.address.city || data.address.town || data.address.village || "Your location"))
            } catch (error) {
                dispatch(setLocation({
                    latitude,
                    longitude,
                    formattedAddress: "current location"
                }))
                dispatch(setCity("Failed to load"))
            }
        });
    }, [dispatch])
}