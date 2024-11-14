import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getCurrentUser, logout } from '../Redux/features/Auth/authSlice'
import { Navigate, Outlet } from 'react-router-dom'
import { useHomeQuery } from '../Redux/features/Home/homeApi'

function ProtectedRoutes() {
  const user = useSelector(getCurrentUser)
  const dispatch = useDispatch()
  const [validSession, setValidSession] = useState(false)
  const { data: homeData, isLoading, isError, isSuccess } = useHomeQuery(user)

  const Logout = () => {
    setValidSession(false)
    dispatch(logout())
  }
  useEffect(() => {
    if (user && user.user && user.auth_token && user.role) {
      if (homeData && !isLoading && isSuccess) {
        if (homeData.status === 'success') setValidSession(true)
        else {
          Logout()
        }
      }
    } else {
      Logout()
    }
  }, [homeData])
  if (!user || !user.user || !user.auth_token || !user.role) return <Navigate to="/login" />

  return (
    <>
      {isLoading && <></>}
      {!isLoading && isSuccess && validSession && <Outlet />}
    </>
  )
}

export default ProtectedRoutes
