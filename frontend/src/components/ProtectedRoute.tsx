import React from 'react'
import { useAppSelector } from '../hooks/useRedux'
import { Navigate, useLocation } from 'react-router'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAppSelector(state => state.auth)
  const { pathname } = useLocation()

  // if (loading) {
  //   return (
  //     <div className="flex h-screen items-center justify-center">
  //       Loading...
  //     </div>
  //   )
  // }

  if (!user) return <Navigate to="/login" replace />

  if (!user.role && pathname !== "/select-role") {
    return <Navigate to="/select-role" replace />
  }

  if (user.role === "seller" && pathname.startsWith("/home")) {
    return <Navigate to="/restaurant" replace />
  }

  if (user.role === "rider" && pathname.startsWith("/home")) {
    return <Navigate to="/rider" replace />
  }

  // if (user.role === "customer" && pathname.startsWith("/restaurant")) {
  //   return <Navigate to="/home" replace />
  // }

  if (user.role === "customer" && pathname.startsWith("/rider")) {
    return <Navigate to="/home" replace />
  }

  if (user.role && pathname === "/select-role") {
    if (user.role === "customer") return <Navigate to="/home" replace />
    if (user.role === "seller") return <Navigate to="/restaurant" replace />
    if (user.role === "rider") return <Navigate to="/rider" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute