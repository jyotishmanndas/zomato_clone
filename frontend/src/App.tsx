import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router'
import Login from './pages/Login'
import { axiosInstance } from './config/axiosInstance'
import { useAppDispatch } from './hooks/useRedux'
import { setUser } from './features/authSlice'
import toast from 'react-hot-toast'
import Home from './pages/Home'
import PublicRoute from './components/PublicRoute'
import ProtectedRoute from './components/ProtectedRoute'
import SelectRole from './pages/SelectRole'
import Navbar from './components/Navbar'
import Restaurant from './pages/Restaurant'
import AddRestaurantForm from './components/forms/AddRestaurantForm'
import { useGeolocation } from './hooks/useGeolocation'


const App = () => {
  const dispatch = useAppDispatch();
  useGeolocation()

  useEffect(() => {
    axiosInstance.get(`/api/v1/auth/user/profile`)
      .then(res => dispatch(setUser(res.data.data)))
      .catch(err => toast.error(err.response.data.msg))
  }, [])

  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/login' element={<PublicRoute><Login /></PublicRoute>} />
        <Route path='/home' element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path='/select-role' element={<ProtectedRoute><SelectRole /></ProtectedRoute>} />
        <Route path='/restaurant' element={<Restaurant />} />
        <Route path='/create-restaurant' element={<AddRestaurantForm />} />
      </Routes>
    </>
  )
}

export default App