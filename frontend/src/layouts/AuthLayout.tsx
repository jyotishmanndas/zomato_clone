import Navbar from "../components/Navbar";
import { Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <div className="app-shell pb-16">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default AuthLayout;