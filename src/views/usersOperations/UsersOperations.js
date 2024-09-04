import { cilFaceDead, cilPlus, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CBadge,
  CAvatar,
  CSmartTable,
  CRow,
  CCol,
  CCardBody,
  CCard,
  CCardHeader,
  CSpinner,
} from '@coreui/react-pro'
import { useRef, useState } from 'react'

import { useUsersOperationsQuery } from '../../Redux/features/Operations/usersOperationsApi'
import { getCurrentUser } from '../../Redux/features/Auth/authSlice'
import { useSelector } from 'react-redux'

const UsersOperations = () => {
  const user = useSelector(getCurrentUser)
  const { data: UsersOperationsData, isLoading, isSuccess, isError } = useUsersOperationsQuery(user)

  const columns = [
    // {
    //   key: 'avatar',
    //   label: '',
    //   filter: false,
    //   sorter: false,
    // },
    {
      key: 'id',
    },
    {
      key: 'operation_number',
    },
    {
      key: 'phone_number',
    },
    {
      key: 'credit',
    },
    {
      key: 'status',
    },
    {
      key: 'user',
    },
    {
      key: 'date',
      label: 'Date And Time',
    },
    // {
    //   key: 'action',
    //   label: '',
    //   _style: { width: '1%' },
    //   filter: false,
    //   sorter: false,
    // },
  ]
  const UsersOperationsTableData = UsersOperationsData?.operations || null

  const getBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <CBadge color="success">Confirmed</CBadge>

      case 'not_confirmed':
        return <CBadge color="danger">Not Confirmed</CBadge>
      default:
        return <CBadge color="primary">Undefined</CBadge>
    }
  }

  return (
    <>
      {!isLoading && !isError && (
        <>
          <CCard>
            <CCardHeader>Users Operations</CCardHeader>
            <CCardBody>
              <CRow className="mt-5">
                <CCol>
                  <CSmartTable
                    activePage={1}
                    cleaner
                    clickableRows
                    columns={columns}
                    columnSorter
                    //   footer
                    items={UsersOperationsTableData}
                    itemsPerPageSelect
                    itemsPerPage={5}
                    pagination
                    //   selectable
                    tableFilter
                    tableProps={{
                      className: 'add-this-class',
                      responsive: true,
                      striped: true,
                      hover: true,
                      bordered: true,
                    }}
                    tableBodyProps={{
                      className: 'align-middle',
                    }}
                    scopedColumns={{
                      operation_number: (item) => (
                        <td className="fst-italic">{`${item.operation_number}`} </td>
                      ),

                      status: (item) => <td>{getBadge(item.status)}</td>,
                      credit: (item) => (
                        <td className="fw-bold text-success">
                          {`${item.credit} `}
                          <sub>DA</sub>
                        </td>
                      ),
                      user: (item) => (
                        <td className="fw-semibold">{`${item.user ? item.user : 'NO USER'} `} </td>
                      ),
                      date: (item) => <td className="fst-italic text-nowrap">{`${item.date}`} </td>,
                    }}
                    sorterValue={{
                      column: 'date',
                      state: 'desc',
                    }}
                  />
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </>
      )}
      {isLoading && !isError && <CSpinner color="primary" />}
      {isError && (
        <>
          <CRow className="align-items-center justify-content-center">
            <h4 className="fw-bold text-secondary text-center ">Error While Fetching The Data</h4>
            <CIcon className="text-secondary text-center" height={64} icon={cilFaceDead} />
          </CRow>
        </>
      )}
    </>
  )
}
export default UsersOperations
