import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CNavItem,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

// import { logo } from 'src/assets/brand/logo'
import logo from '../assets/logo.png'

import { sygnet } from 'src/assets/brand/sygnet'

// sidebar nav config
import navigation from '../_nav'
import { Link } from 'react-router-dom'
import { changeState } from '../Redux/features/Theme/themeSlice'
import { cilUser } from '@coreui/icons'
import { getCurrentUser } from '../Redux/features/Auth/authSlice'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.theme.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.theme.sidebarShow)
  const user = useSelector(getCurrentUser)

  const [customNavigations, setCustomNavigations] = useState(() => {
    if (user.role === 'super') return navigation._admin_nav
    return navigation._nav
  })

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch(changeState({ type: 'set', sidebarShow: visible }))
      }}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand className="text-decoration-none" href="/">
          <img src={logo} className="mx-auto" height={64}></img>
          {` `}
          {!unfoldable && (
            <span className=" text-decoration-none fs-2 fw-bold">
              Ich<span className=" text-decoration-none text-primary">7en</span>
            </span>
          )}
          {/* <CIcon customClassName="sidebar-brand-full" icon={logo} height={32} /> */}
          {/* <CIcon customClassName="sidebar-brand-narrow" icon={sygnet} height={32} /> */}
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch(changeState({ type: 'set', sidebarShow: false }))}
        />
      </CSidebarHeader>
      <AppSidebarNav items={customNavigations} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch(changeState({ type: 'set', sidebarUnfoldable: !unfoldable }))}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
