import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSim,
  cilSpeedometer,
  cilSpreadsheet,
  cilStar,
  cilTransfer,
  cilUser,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'SIM',
  },
  {
    component: CNavItem,
    name: 'Manage SIM Numbers',
    to: '/manage-sim',
    icon: <CIcon icon={cilSim} customClassName="nav-icon" />,
  },

  {
    component: CNavTitle,
    name: 'USERS',
  },
  {
    component: CNavItem,
    name: 'Manage Users',
    to: '/manage-users',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'OPERATIONS',
  },
  {
    component: CNavItem,
    name: 'Users Operations',
    to: '/users-operations',
    icon: <CIcon icon={cilTransfer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Admin Operations',
    to: '/admin-operations',
    icon: <CIcon icon={cilTransfer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Total Flexy',
    to: '/total-flexy',
    icon: <CIcon icon={cilTransfer} customClassName="nav-icon" />,
  },

  {
    component: CNavTitle,
    name: 'PAYMENT',
  },
  {
    component: CNavItem,
    name: 'Invoices',
    to: '/invoices',
    icon: <CIcon icon={cilSpreadsheet} customClassName="nav-icon" />,
  },
]

export default _nav
