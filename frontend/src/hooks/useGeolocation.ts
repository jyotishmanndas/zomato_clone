import React, { useEffect, useState } from 'react'
import type { LocationData } from '../types';
import { useAppDispatch } from './useRedux';
import { setCity, setLocation } from '../features/locationSlice';

export const useGeolocation = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!navigator.geolocation) return alert("Please allow the location to continue");

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;

            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                const data = await res.json();

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