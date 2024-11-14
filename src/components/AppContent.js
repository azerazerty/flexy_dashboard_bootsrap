import React, { createContext, Suspense, useContext, useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'

// routes config
// import routes from '../routes'
import { useSelector } from 'react-redux'
import { getCurrentUser } from '../Redux/features/Auth/authSlice'
import { ProvideRoutes } from '../layout/DefaultLayout'

const AppContent = () => {
  // const [Routes, setRoutes] = useContext(ProvideRoutes)
  const { routes } = useContext(ProvideRoutes)

  return (
    <CContainer className="px-4" lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map((route, idx) => {
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={<route.element />}
                />
              )
            )
          })}
          <Route path="/" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
