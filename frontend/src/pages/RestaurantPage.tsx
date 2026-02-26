import React from 'react'
import { useParams } from 'react-router'
import { useRestaurant } from '../hooks/useRestaurantApi';
import RestaurantProfile from '../components/RestaurantProfile';
import RestaurantHero from '../components/RestautantHero';

const RestaurantPage = () => {
    const { id } = useParams();

    const { data, isLoading } = useRestaurant(id!);

    if (isLoading) {
        return <div>Loading...</div>
    }

    console.log(data);


    return (
        <div className='pt-20 min-h-screen bg-gray-50 px-4 space-y-6'>
            <RestaurantHero restaurant={data} />
        </div>
    )
}

export default RestaurantPage