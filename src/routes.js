import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))

const ManageSim = React.lazy(() => import('./views/manageSim/ManageSim'))
const ManageUsers = React.lazy(() => import('./views/manageUsers/ManageUsers'))
const UsersOperations = React.lazy(() => import('./views/usersOperations/UsersOperations'))
const AdminOperations = React.lazy(() => import('./views/adminOperations/AdminOperations'))
const Invoices = React.lazy(() => import('./views/invoices/Invoices'))
const TotalFlexy = React.lazy(() => import('./views/totalFlexy/TotalFlexy'))

const Widgets = React.lazy(() => import('./views/widgets/Widgets'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/manage-sim', name: 'ManageSim', element: ManageSim },
  { path: '/manage-users', name: 'ManageUsers', element: ManageUsers },
  { path: '/users-operations', name: 'UsersOperations', element: UsersOperations },
  { path: '/admin-operations', name: 'AdminOperations', element: AdminOperations },
  { path: '/invoices', name: 'Invoices', element: Invoices },
  { path: '/total-flexy', name: 'TotalFlexy', element: TotalFlexy },
]

export default routes
