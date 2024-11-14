import React, { createContext, useEffect, useState } from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { useSelector } from 'react-redux'
import { getCurrentUser } from '../Redux/features/Auth/authSlice'
import routes from '../routes'

export const ProvideRoutes = createContext(null)

const CheckRoutes = ({ children }) => {
  const user = useSelector(getCurrentUser)
  // const [Routes, setRoutes] = useState([])

  // useEffect(() => {
  //   if (!Routes || Routes.length < 1) {
  //     if (user.role === 'super') {
  //       setRoutes(routes.admin_routes)
  //     } else setRoutes(routes.routes)
  //   }
  // }, [Routes])
  return (
    <>
      {user.role === 'super' ? (
        <ProvideRoutes.Provider value={{ routes: routes.admin_Routes }}>
          {children}
        </ProvideRoutes.Provider>
      ) : (
        <ProvideRoutes.Provider value={{ routes: routes.routes }}>
          {children}
        </ProvideRoutes.Provider>
      )}
    </>
  )
}

const DefaultLayout = () => {
  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <CheckRoutes>
            <AppContent />
          </CheckRoutes>
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
