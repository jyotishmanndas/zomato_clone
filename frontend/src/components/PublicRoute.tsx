import React from 'react'
import { useAppSelector } from '../hooks/useRedux'
import { Navigate } from 'react-router'

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAppSelector(state => state.auth);

    if (user) return <Navigate to="/" replace />

    return (
        <>
            {children}
        </>
    )
}

export default PublicRoute