import React, { useEffect, useState } from 'react'
import { useAppSelector } from '../hooks/useRedux'
import { axiosInstance } from '../config/axiosInstance';
import { useSearchParams } from 'react-router';
import RestaurantCard from '../components/RestaurantCard';

const Home = () => {
  const { location } = useAppSelector(state => state.location);
  const [searchParams] = useSearchParams();

  const search = searchParams.get("search") || "";

  const [restaurants, setRestaurants] = useState<any[]>([])

  const getDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dlat = ((lat2 - lat1) * Math.PI) / 180;
    const dlon = ((lon2 - lon1) * Math.PI) / 180;

    const a = Math.sin(dlat / 2) * Math.sin(dlat / 2) + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dlon / 2) * Math.sin(dlon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return +(R * c).toFixed(2)
  };

  const fetchRestaurant = async () => {
    try {
      if (!location?.latitude || !location?.longitude) {
        return;
      };

      const res = await axiosInstance.get(`api/v1/restaurant/all`, {
        params: {
          latitude: location.latitude,
          longitude: location.longitude,
          search
        }
      });

      setRestaurants(res.data.restaurant ?? [])
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRestaurant()
  }, [location, search])

  return (
    <div className='pt-40 px-10 mx-auto max-w-7xl'>
      {restaurants.length > 0 ? (
        <div className='grid grid-cols-4 gap-4'>
          {
            restaurants.map((res) => {
              const [resLng, resLat] = res.autoLocation.coordinates;

              if (!location?.latitude || !location?.longitude) {
                return null;
              }

              const distance = getDistanceKm(
                location.latitude,
                location.longitude,
                resLat,
                resLng
              );

              return <RestaurantCard key={res._id} id={res._id} name={res.name} distance={`${distance}`} image={res.image ?? ""} isOpen={res.isOpen} />
            })
          }
        </div>
      ): (
        <p className='text-center text-gray-500'>No restaurant found</p>
      )}
    </div>
  )
}

export default Home