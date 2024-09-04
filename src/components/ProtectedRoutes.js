import React from 'react'
import { useSelector } from 'react-redux'
import { getCurrentUser } from '../Redux/features/Auth/authSlice'
import { Navigate, Outlet } from 'react-router-dom'

function ProtectedRoutes() {
  const user = useSelector(getCurrentUser)

  if (!user || !user.user || !user.auth_token) return <Navigate to="/login" />

  return <Outlet />
}

export default ProtectedRoutes
