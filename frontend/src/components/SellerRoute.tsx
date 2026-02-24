import React from 'react'
import { useAppSelector } from '../hooks/useRedux'
import { Navigate } from 'react-router';

const SellerRoute = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAppSelector(state => state.auth);

    if (!user) return <Navigate to="/login" replace />
    if (user.role !== "seller") return <Navigate to="/home" replace />

    return (
        <>
            {children}
        </>
    )
}

export default SellerRoute