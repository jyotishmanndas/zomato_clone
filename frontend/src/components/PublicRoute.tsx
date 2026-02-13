import React from 'react'
import { useAppSelector } from '../hooks/useRedux'
import { Navigate } from 'react-router'

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAppSelector(state => state.auth)
    if (user) {
        return <Navigate to="/home" replace />
    };

    return (
        <>
            {children}
        </>
    )
}

export default PublicRoute