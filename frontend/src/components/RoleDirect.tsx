import { Navigate } from "react-router";
import { useAppSelector } from "../hooks/useRedux";

const RoleRedirect = () => {
    const { user } = useAppSelector((state) => state.auth);

    if (!user) return <Navigate to="/login" replace />;

    if (user.role === "customer") return <Navigate to="/home" replace />;
    if (user.role === "seller") return <Navigate to="/restaurant" replace />;
    if (user.role === "rider") return <Navigate to="/rider" replace />;

    return <Navigate to="/select-role" replace />;
};

export default RoleRedirect;