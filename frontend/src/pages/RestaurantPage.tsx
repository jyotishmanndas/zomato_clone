import { useParams } from 'react-router'
import { useRestaurant } from '../hooks/useRestaurantApi';
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

    return (
        <div className="min-h-screen bg-[color:var(--color-bg-blush)] pt-20">
            <RestaurantHero restaurant={data} />

            <div className="mx-auto mt-4 max-w-4xl px-4">
                <div className="sticky top-20 z-30 flex gap-6 border-b border-[color:var(--color-divider)] bg-[color:var(--color-bg-blush)]/95 pb-2 pt-2 backdrop-blur">
                    <button className="relative pb-1 text-sm font-semibold text-[color:var(--color-brand-red)]">
                        Menu
                        <span className="absolute inset-x-0 -bottom-1 h-[2px] rounded-full bg-[color:var(--color-brand-red)]" />
                    </button>
                </div>
            </div>

            <div className="mx-auto mt-4 max-w-4xl px-4 pb-24">
                <div className="grid grid-cols-1 gap-4">
                    {menus?.map((m: any) => (
                        <Menu key={m._id} menu={m} isSeller={false} restaurantId={id} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default RestaurantPage