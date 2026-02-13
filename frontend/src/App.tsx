import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router'
import Login from './pages/Login'
import { axiosInstance } from './config/axiosInstance'
import { useAppDispatch } from './hooks/useRedux'
import { removeUser, setUser } from './features/authSlice'
import toast from 'react-hot-toast'
import Home from './pages/Home'
import PublicRoute from './components/PublicRoute'
import ProtectedRoute from './components/ProtectedRoute'
import Role from './pages/Role'

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    axiosInstance.get(`/api/v1/auth/user/profile`)
      .then(res => dispatch(setUser(res.data.data)))
      .catch(err => toast.error(err.response.data.msg))
  }, [])

  return (
    <Routes>
      <Route path='/login' element={<PublicRoute><Login /></PublicRoute>} />
      <Route path='/home' element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path='/select-role' element={<ProtectedRoute><Role /></ProtectedRoute>} />
    </Routes>
  )
}

export default App