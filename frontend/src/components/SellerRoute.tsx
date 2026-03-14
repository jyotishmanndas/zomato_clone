import React from 'react'
import { useAppSelector } from '../hooks/useRedux'
import { Navigate } from 'react-router';

const SellerRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAppSelector(state => state.auth);

    if (loading) {
        return (
          <div className="flex h-screen items-center justify-center">
            Loading...
          </div>
        );
      }

    if (!user) return <Navigate to="/login" replace />
    if (user.role !== "seller") return <Navigate to="/home" replace />

    return (
        <>
            {children}
        </>
    )
}

export default SellerRoute