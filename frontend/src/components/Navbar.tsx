import { Map, MapPin, Search, ShoppingCart } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router'
import { useAppSelector } from '../hooks/useRedux';
import SearchBar from './SearchBar';

const Navbar = () => {
    const { pathname } = useLocation();
    const { user } = useAppSelector(state => state.auth);

    const isHomePage = pathname === "/home";

    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState(searchParams.get("search") || "");

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search) {
                setSearchParams({ search })
            } else {
                setSearchParams({})
            }
        }, 500)

        return () => {
            clearTimeout(timer)
        }

    }, [search])

    return (
        <div className='w-full bg-white shadow-sm fixed left-0 top-0 z-50'>
            <div className='mx-auto flex max-w-7xl items-center justify-between px-4 py-4 '>
                <Link to={"/"} className='text-2xl font-bold italic text-[#E23744] cursor-pointer'>ZOMATO</Link>

                <div className='flex items-center gap-4'>
                    <Link to={"/cart"} className='relative'>
                        <ShoppingCart className='text-[#E23744] h-6 w-6' />
                        <span className='absolute -top-2 -right-2 flex h-5 w-5 items-center rounded-full justify-center bg-[#E23744]text-xs font-semibold text-white'>0</span>
                    </Link>

                    {user ? (
                        <Link to={"/account"} className='font-medium text-[#E23744]'>Account</Link>
                    ) : (
                        <Link to={"/login"} className='font-medium text-[#E23744]'>Login</Link>
                    )}
                </div>
            </div>

            {isHomePage && (
                <SearchBar />
            )}
        </div>
    )
}

export default Navbar