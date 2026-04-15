import Navbar from "../components/Navbar";
import { Outlet, useLocation } from "react-router";
import { AnimatePresence, motion } from "framer-motion";

const AuthLayout = () => {
  const location = useLocation();

  return (
    <div className="app-shell pb-16">
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AuthLayout;
