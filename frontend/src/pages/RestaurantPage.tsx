import React from 'react'
import { useParams } from 'react-router'
import { useRestaurant } from '../hooks/useRestaurantApi';
import RestaurantProfile from '../components/RestaurantProfile';
import RestaurantHero from '../components/RestautantHero';
import { useRestaurantMenu } from '../hooks/useMenuApi';
import Menu from '../components/Menu/Menu';

const RestaurantPage = () => {
    const { id } = useParams();

    const { data, isLoading } = useRestaurant(id!);
    const { data: menus } = useRestaurantMenu(id!)

    if (isLoading) {
        return <div>Loading...</div>
    }

    console.log('menu', menus);

    return (
        <div className='pt-20 min-h-screen bg-gray-50 px-4 space-y-6'>
            <RestaurantHero restaurant={data} />

            <div className="max-w-5xl mx-auto px-4 mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {menus?.map((m: any) => (
                        <Menu key={m._id} menu={m} isSeller={false} restaurantId={id} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default RestaurantPage