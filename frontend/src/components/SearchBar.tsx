import { MapPinned, Search } from 'lucide-react'
import { useAppSelector } from '../hooks/useRedux'

const SearchBar = () => {
    const { city } = useAppSelector(state => state.location)

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