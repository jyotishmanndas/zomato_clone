import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from './useRedux';
import { setCity, setLocation } from '../features/locationSlice';
import { axiosInstance } from '../config/axiosInstance';

export const useGeolocation = (user: any) => {
    const dispatch = useAppDispatch();
    const { location } = useAppSelector(state => state.location);

    useEffect(() => {
        if(location) return;

        const saved = localStorage.getItem("location");
        if (saved) {
            const parsed = JSON.parse(saved);
            dispatch(setLocation(parsed))
            dispatch(setCity(parsed.city));

            return;
        };

        if (!user) return;
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

                const city =
                    data.address.city ||
                    data.address.town ||
                    data.address.village ||
                    "Your location";

                const locationData = {
                    latitude,
                    longitude,
                    formattedAddress:
                        data.display_name || "current location",
                    city,
                };

                dispatch(setLocation(locationData));
                dispatch(setCity(city));

                localStorage.setItem("location", JSON.stringify(locationData));
            } catch (error) {
                const fallback = {
                    latitude,
                    longitude,
                    formattedAddress: "current location",
                    city: "Unknown",
                };

                dispatch(setLocation(fallback));
                dispatch(setCity("Failed to load"));

                localStorage.setItem("location", JSON.stringify(fallback));
            }
        });
    }, [user, location, dispatch])
}