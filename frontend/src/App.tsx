import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router'
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

const App = () => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector(state => state.auth);

  useGeolocation()

  useEffect(() => {
    axiosInstance.get(`/api/v1/auth/user/profile`)
      .then(res => dispatch(setUser(res.data.data)))
      .catch(() => dispatch(removeUser()))
  }, []);

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path='/login' element={<PublicRoute><Login /></PublicRoute>} />
          <Route path='/home' element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path='/account' element={<Account />} />
          <Route path='/restaurant/:id' element={<RestaurantPage />} />
        </Route>
        <Route path='/select-role' element={<ProtectedRoute><SelectRole /></ProtectedRoute>} />
        <Route path='/restaurant' element={<SellerRoute><Restaurant /></SellerRoute>} />
        <Route path='/create-restaurant' element={<SellerRoute><AddRestaurantForm /></SellerRoute>} />
      </Routes>
    </>
  )
}

export default App