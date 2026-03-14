import { Navigate } from "react-router"
import { useAppSelector } from "../hooks/useRedux"

export const RiderRoute = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAppSelector(state => state.auth)

    if (!user) return <Navigate to="/login" replace />

    if (user.role !== "rider") {
        return <Navigate to="/home" replace />
    }

    return <>{children}</>
}