import { useEffect } from 'react'
import { Route, Routes } from 'react-router'
import Login from './pages/Login'
import { axiosInstance } from './config/axiosInstance'
import { useAppDispatch, useAppSelector } from './hooks/useRedux'
import { removeUser, setUser } from './features/authSlice'
import Home from './pages/Home'
import PublicRoute from './components/PublicRoute'
import ProtectedRoute from './components/ProtectedRoute'
import SelectRole from './pages/SelectRole'
import Restaurant from './pages/Restaurant'
import AddRestaurantForm from './components/forms/AddRestaurantForm'
import { useGeolocation } from './hooks/useGeolocation'
import AuthLayout from './layouts/AuthLayout'
import SellerRoute from './components/SellerRoute'
import Account from './pages/Account'
import RestaurantPage from './pages/RestaurantPage'
import Cart from './pages/Cart'
import Address from './pages/Address'
import Checkout from './pages/Checkout'
import { useSocket } from './hooks/useSocket'
import OrderPage from './pages/OrderPage'
import RiderDashboard from './pages/RiderDashboard'
import PaymentSuccess from './pages/PaymentSuccess'
import { RiderRoute } from './components/RiderRoute'
import RoleRedirect from './components/RoleDirect'
import Admin from './pages/Admin'

const App = () => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector(state => state.auth);

  useGeolocation();
  useSocket();

  useEffect(() => {
    axiosInstance.get(`/api/v1/auth/user/profile`)
      .then(res => dispatch(setUser(res.data.data)))
      .catch(() => dispatch(removeUser()))
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[color:var(--color-bg-blush)]">
        <div className="spinner-ring" role="status" aria-label="Loading" />
        <p className="text-sm font-medium text-[color:var(--color-text-secondary)]">
          Loading your experience…
        </p>
      </div>
    )
  }

  return (
    <>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/" element={<ProtectedRoute><RoleRedirect /></ProtectedRoute>} />
          <Route path='/login' element={<PublicRoute><Login /></PublicRoute>} />
          <Route path='/home' element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path='/address' element={<ProtectedRoute><Address /></ProtectedRoute>} />
          <Route path='/account' element={<ProtectedRoute><Account /></ProtectedRoute>} />
          <Route path='/order/:id' element={<ProtectedRoute><OrderPage /></ProtectedRoute>} />
          <Route path='/restaurant/:id' element={<ProtectedRoute><RestaurantPage /></ProtectedRoute>} />
          <Route path='/cart' element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path='/checkout' element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path='/paymentsuccess/:paymentId' element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
        </Route>
        <Route path='/select-role' element={<ProtectedRoute><SelectRole /></ProtectedRoute>} />
        <Route path='/restaurant' element={<SellerRoute><Restaurant /></SellerRoute>} />
        <Route path='/create-restaurant' element={<SellerRoute><AddRestaurantForm /></SellerRoute>} />
        <Route path='/rider' element={<RiderRoute><RiderDashboard /></RiderRoute>} />
        <Route path='/admin' element={<ProtectedRoute><Admin /></ProtectedRoute>} />
      </Routes>
    </>
  )
}

export default App