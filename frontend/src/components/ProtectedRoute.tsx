import React from 'react'
import { useAppSelector } from '../hooks/useRedux'
import { Navigate, useLocation } from 'react-router';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAppSelector(state => state.auth);
  const { pathname } = useLocation();

  if (!user) {
    return <Navigate to="/login" replace />
  };

  if (!user.role && pathname !== "/select-role") {
    return <Navigate to="/select-role" replace />
  };

  if (user.role && pathname === "/select-role") {
    return <Navigate to="/home" replace />
  };


  return (
    <>
      {children}
    </>
  )
}

export default ProtectedRoute