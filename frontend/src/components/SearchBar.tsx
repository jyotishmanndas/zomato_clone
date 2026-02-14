import { MapPinned, Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import type { LocationData } from '../types';

const SearchBar = () => {
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [location, setLocation] = useState<LocationData | null>(null);
    const [city, setCity] = useState("Fetching location");

    useEffect(() => {
        if (!navigator.geolocation) return alert("Please allow the location to continue");
        setLoadingLocation(true);

        navigator.geolocation.getCurrentPosition(async(postion) =>{
            const {latitude, longitude} = postion.coords;

            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                const data = await res.json();

                setLocation({
                    latitude,
                    longitude,
                    formattedAddress: data.display_name || "current location"
                })

                setCity(data.address.city || data.address.town || data.address.village || "Your location")
            } catch (error) {
                setLocation({
                    latitude,
                    longitude,
                    formattedAddress: "current location"
                })
                setCity("Failed to load")
            }
        });
    }, [])

    return (
        <div className='border-t px-4 py-3'>
            <div className='mx-auto flex max-w-7xl items-center rounded-lg border shadow-sm'>
                <div className='flex items-center gap-2 px-3 border-r text-gray-700'>
                    <MapPinned className='h-4 w-4' />
                    <span className='text-sm truncate'>{city}</span>
                </div>
                <div className='flex flex-1 items-center gap-2 px-3'>
                    <Search className='h-4 w-4' />
                    <input type="text" placeholder='search for restaurant' className='w-full py-2 text-base outline-none' />
                </div>
            </div>
        </div>
    )
}

export default SearchBar