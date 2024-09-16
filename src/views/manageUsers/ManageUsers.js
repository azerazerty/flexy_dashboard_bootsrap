import {
  cilFaceDead,
  cilMoney,
  cilPencil,
  cilPlus,
  cilTrash,
  cilUserFollow,
  cilZoom,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CBadge,
  CAvatar,
  CSmartTable,
  CRow,
  CCol,
  CButton,
  CCollapse,
  CCardBody,
  CCard,
  CCardHeader,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CForm,
  CFormInput,
  CToast,
  CToastBody,
  CToastClose,
  CToaster,
  CSpinner,
  CFormSelect,
} from '@coreui/react-pro'
import { useRef, useState } from 'react'

import {
  useGetUsersQuery,
  useCreateUserMutation,
  useDeleteUserMutation,
  useEditUserMutation,
  usePayUserMutation,
} from '../../Redux/features/Users/usersApi'
import { useGetNumbersQuery } from '../../Redux/features/Sim/SimApi'

import { getCurrentUser } from '../../Redux/features/Auth/authSlice'
import { useSelector } from 'react-redux'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

const ManageUsers = () => {
  const user = useSelector(getCurrentUser)
  const { data: UsersData, isLoading, isSuccess, isError } = useGetUsersQuery(user)
  const { data: SimData, ...GetNumbersQueryResult } = useGetNumbersQuery(user)

  const [CreateUser, createUserResult] = useCreateUserMutation()
  const [EditUser, editUserResult] = useEditUserMutation()
  const [DeleteUser, deleteUserResult] = useDeleteUserMutation()
  const [PayUser, payUserResult] = usePayUserMutation()

  const [showInfoModel, setShowInfoModel] = useState(false)
  const [showCreateModel, setShowCreateModel] = useState(false)

  const [toast, addToast] = useState(0)
  const [newNumber, setNewNumber] = useState('')
  const [newIp, setNewIp] = useState('')

  const [selectedUser, setSelectedUser] = useState()
  const [newUser, setNewUser] = useState()

  const toaster = useRef()

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
      key: 'username',
    },
    {
      key: 'phone_number',
      label: 'Phone Number',
    },
    {
      key: 'percentage',
      label: 'percentage %',
    },
    {
      key: 'flexy_amount',
    },
    {
      key: 'amount_topay',
      label: 'Amount To Pay',
    },
    {
      key: 'paid_amount',
    },
    {
      key: 'amount_rest_topay',
      label: 'Rest Amount To Pay',
    },
    {
      key: 'action',
      label: '',
      filter: false,
      sorter: false,
    },
  ]
  const UsersTableData = UsersData?.users || null

  const successToast = (successMessage) => (
    <CToast
      autohide={true}
      visible={true}
      color="success"
      className="text-white align-items-center"
    >
      <div className="d-flex">
        <CToastBody>{successMessage}</CToastBody>
        <CToastClose className="me-2 m-auto" white />
      </div>
    </CToast>
  )
  const failedToast = (errorMessage) => (
    <CToast autohide={true} visible={true} color="danger" className="text-white align-items-center">
      <div className="d-flex">
        <CToastBody>{errorMessage}</CToastBody>
        <CToastClose className="me-2 m-auto" white />
      </div>
    </CToast>
  )

  const handleCreateUser = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const data = await CreateUser({
        credentials: user,
        User: selectedUser,
      }).unwrap()
      if (data.status !== 'success') {
        addToast(failedToast(data.message))
        throw new Error(data.message)
      }
      setShowCreateModel(false)
      addToast(successToast('User Created Successfully.'))
    } catch (error) {
      let errorMsg = ''
      error?.message
        ? (errorMsg = error.message)
        : (errorMsg = 'Error While Creating User, Please Try Again Later.')
      addToast(failedToast(`${errorMsg}`))
    }
  }
  const handleUpdateUser = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const data = await EditUser({
        credentials: user,
        User: selectedUser,
      }).unwrap()
      if (data.status !== 'success') {
        addToast(failedToast(data.message))
        throw new Error(data.message)
      }
      setShowInfoModel(false)
      addToast(successToast('User Updated Successfully.'))
    } catch (error) {
      let errorMsg = ''
      error?.message
        ? (errorMsg = error.message)
        : (errorMsg = 'Error While Updating User, Please Try Again Later.')
      addToast(failedToast(`${errorMsg}`))
    }
  }
  const handleDeleteUser = (user) => {
    MySwal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          await deleteUser(user)
        } catch (e) {
          MySwal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
          })
          throw e
        }
      },
      allowOutsideClick: () => !MySwal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        setShowInfoModel(false)
        MySwal.fire({
          title: 'Deleted!',
          text: 'User has been deleted.',
          icon: 'success',
        })
      }
    })
  }
  const handlePayUser = (user) => {
    MySwal.fire({
      title: 'Are you sure?',
      // html: `You are About to Pay <b> ${user.amount_rest_topay} <sub>DA</sub> </b>`,
      html: `You are About to Pay the Rest Amount`,

      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Pay User!',
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          await payUser(user)
        } catch (e) {
          MySwal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
          })
          throw e
        }
      },
      allowOutsideClick: () => !MySwal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        MySwal.fire({
          title: 'Paid!',
          text: 'User has been paied.',
          icon: 'success',
        })
      }
    })
  }

  const deleteUser = async (User) => {
    let toReturn
    try {
      const data = await DeleteUser({
        credentials: user,
        User: { delete_username: User.edit_username },
      }).unwrap()

      if (data.status !== 'success') {
        addToast(failedToast(data.message))
        throw new Error(data.message)
      }

      addToast(successToast('User Deleted Successfully.'))
      toReturn = data
    } catch (error) {
      let errorMsg = error?.message || 'Error While Deleting User, Please Try Again Later.'
      addToast(failedToast(`${errorMsg}`))
      throw error // Re-throw the original error instead of creating a new one
    }
    return toReturn
  }
  const payUser = async (User) => {
    let toReturn
    try {
      const data = await PayUser({
        credentials: user,
        User: { pay_username: User.username },
      }).unwrap()

      if (data.status !== 'success') {
        addToast(failedToast(data.message))
        throw new Error(data.message)
      }

      addToast(successToast('User Paid Successfully.'))
      toReturn = data
    } catch (error) {
      let errorMsg = error?.message || 'Error While Paying User, Please Try Again Later.'
      addToast(failedToast(`${errorMsg}`))
      throw error // Re-throw the original error instead of creating a new one
    }
    return toReturn
  }

  return (
    <>
      <CToaster className="p-3" placement="top-end" push={toast} ref={toaster} />

      <CModal visible={showInfoModel} onClose={() => setShowInfoModel(false)}>
        <CModalHeader>
          <CModalTitle>User Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm noValidate>
            <CFormInput
              className="mb-3"
              id="username"
              placeholder="Username"
              label="Username"
              value={selectedUser?.edit_username || ''}
              disabled
              readOnly
            />
            <CFormInput
              onChange={(e) =>
                setSelectedUser((prev) => {
                  return {
                    ...prev,
                    new_password: `${e.target.value}`,
                  }
                })
              }
              className="mb-3"
              id="password"
              placeholder="Password"
              label="Password"
              value={selectedUser?.new_password || ''}
              required
            />
            {/* <CFormInput
              onChange={(e) =>
                setSelectedUser((prev) => {
                  return {
                    ...prev,
                    new_phone_number: `${e.target.value}`,
                  }
                })
              }
              className="mb-3"
              id="phone_number"
              placeholder="Phone Number"
              label="Phone Number"
              value={selectedUser?.new_phone_number || ''}
              required
            /> */}
            <CFormSelect
              defaultValue={selectedUser?.new_phone_number}
              onChange={(e) =>
                setSelectedUser((prev) => {
                  return {
                    ...prev,
                    phone_number: `${e.target.value}`,
                  }
                })
              }
              className="mb-3"
              id="phone_number"
              label="Phone Number"
              required
              aria-label="Select Number"
            >
              <option disabled>Select Number</option>
              {!GetNumbersQueryResult?.isLoading &&
                GetNumbersQueryResult?.isSuccess &&
                SimData?.data?.map((item, i) => (
                  <option key={i} value={item.number}>
                    {item.number}
                  </option>
                ))}
            </CFormSelect>
            <CFormInput
              onChange={(e) =>
                setSelectedUser((prev) => {
                  return {
                    ...prev,
                    new_percentage: `${e.target.value}`,
                  }
                })
              }
              className="mb-3"
              id="percentage"
              placeholder="Percentage"
              label="Percentage"
              value={selectedUser?.new_percentage || ''}
              required
            />

            <CRow>
              <CCol>
                <CButton
                  onClick={async (e) => await handleUpdateUser(e)}
                  disabled={editUserResult.isLoading}
                  className="mb-3 text-light"
                  type="submit"
                  color="success"
                >
                  <CIcon icon={cilPencil} height={16}></CIcon>
                  {` ${editUserResult.isLoading ? 'Loading ...' : 'Edit User'}`}
                </CButton>
              </CCol>
              <CCol>
                <CButton
                  onClick={(e) => handleDeleteUser(selectedUser)}
                  disabled={deleteUserResult.isLoading}
                  className="mb-3 text-light float-end"
                  type="submit"
                  color="danger"
                >
                  <CIcon icon={cilTrash} height={16}></CIcon>

                  {` ${deleteUserResult.isLoading ? 'Loading ...' : 'Delete User'}`}
                </CButton>
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
      </CModal>
      <CModal visible={showCreateModel} onClose={() => setShowCreateModel(false)}>
        <CModalHeader>
          <CModalTitle>User Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm noValidate onSubmit={handleCreateUser}>
            <CFormInput
              onChange={(e) =>
                setSelectedUser((prev) => {
                  return {
                    ...prev,
                    new_username: `${e.target.value}`,
                  }
                })
              }
              className="mb-3"
              id="username"
              placeholder="Username"
              label="Username"
              value={selectedUser?.new_username || ''}
            />
            <CFormInput
              onChange={(e) =>
                setSelectedUser((prev) => {
                  return {
                    ...prev,
                    new_password: `${e.target.value}`,
                  }
                })
              }
              className="mb-3"
              id="password"
              placeholder="Password"
              label="Password"
              value={selectedUser?.new_password || ''}
              required
            />
            {/* <CFormInput
              onChange={(e) =>
                setSelectedUser((prev) => {
                  return {
                    ...prev,
                    phone_number: `${e.target.value}`,
                  }
                })
              }
              className="mb-3"
              id="phone_number"
              placeholder="Phone Number"
              label="Phone Number"
              value={selectedUser?.phone_number || ''}
              required
            /> */}
            <CFormSelect
              onChange={(e) =>
                setSelectedUser((prev) => {
                  return {
                    ...prev,
                    phone_number: `${e.target.value}`,
                  }
                })
              }
              className="mb-3"
              id="phone_number"
              required
              label="Phone Number"
              aria-label="Select Number"
              defaultValue={
                (GetNumbersQueryResult?.isLoading &&
                  GetNumbersQueryResult?.isSuccess &&
                  SimData?.data[0]?.number) ||
                ''
              }
            >
              <option disabled>Select Number</option>
              {!GetNumbersQueryResult?.isLoading &&
                GetNumbersQueryResult?.isSuccess &&
                SimData?.data?.map((item, i) => (
                  <option key={i} value={item.number}>
                    {item.number}
                  </option>
                ))}
            </CFormSelect>
            <CFormInput
              onChange={(e) =>
                setSelectedUser((prev) => {
                  return {
                    ...prev,
                    percentage: `${e.target.value}`,
                  }
                })
              }
              className="mb-3"
              id="percentage"
              placeholder="Percentage"
              label="Percentage"
              value={selectedUser?.percentage || ''}
              required
            />

            <CButton
              disabled={createUserResult.isLoading}
              className="mb-3 float-end"
              type="submit"
              color="primary"
            >
              <CIcon icon={cilUserFollow} />
              {`${createUserResult.isLoading ? ' Creating ...' : ' Create User'}`}
            </CButton>
          </CForm>
        </CModalBody>
      </CModal>

      {!isLoading && !isError && (
        <>
          <CCard>
            <CCardHeader>Users Manager</CCardHeader>
            <CCardBody>
              <CButton
                onClick={() => {
                  console.log(SimData.data[0])
                  setSelectedUser({
                    phone_number: SimData?.data[0]?.number || null,
                  })

                  setShowCreateModel(true)
                }}
                color="primary float-end  mx-3"
              >
                <CIcon icon={cilUserFollow} height={16}></CIcon>
                {` Create New User`}
              </CButton>
              <CRow className="mt-5">
                <CCol>
                  <CSmartTable
                    activePage={1}
                    cleaner
                    clickableRows
                    columns={columns}
                    columnSorter
                    //   footer
                    items={UsersTableData}
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
                      // bordered: true,
                    }}
                    tableBodyProps={{
                      className: 'align-middle',
                    }}
                    scopedColumns={{
                      action: (item) => (
                        <td className="d-flex flex-column gap-1">
                          <CButton
                            className="d-flex align-items-center gap-2"
                            disabled={payUserResult.isLoading}
                            onClick={() => {
                              handlePayUser(item)
                            }}
                            variant="outline"
                            color="success"
                          >
                            {payUserResult.isLoading ? (
                              <CSpinner color="primary" />
                            ) : (
                              <>
                                <CIcon icon={cilMoney} height={24}></CIcon>
                                {`Pay`}
                              </>
                            )}
                          </CButton>
                          <CButton
                            className="d-flex align-items-center gap-2"
                            disabled={editUserResult.isLoading}
                            onClick={() => {
                              setSelectedUser({
                                edit_username: item.username,
                                new_password: item.password,
                                new_percentage: item.percentage,
                                new_phone_number: item.phone_number,
                              })
                              setShowInfoModel(true)
                            }}
                            variant="outline"
                            color="primary"
                          >
                            {editUserResult.isLoading ? (
                              <CSpinner color="primary" />
                            ) : (
                              <>
                                <CIcon icon={cilZoom} height={24}></CIcon>
                                {`Show`}
                              </>
                            )}
                          </CButton>
                        </td>
                      ),
                      amount_rest_topay: (item) => (
                        <td className=" fw-bold px-3">
                          <CBadge
                            color="danger"
                            className="fs-6 fw-bold text-nowrap"
                            textColor="light"
                          >
                            {`${Intl.NumberFormat().format(parseFloat(`${item.amount_rest_topay}`)) || '0'} `}
                            <sub>DA</sub>
                          </CBadge>
                        </td>
                      ),
                      paid_amount: (item) => (
                        <td className=" fw-bold px-3">
                          <CBadge
                            color="success"
                            className="fs-6 fw-bold text-nowrap"
                            textColor="light"
                          >
                            {`${Intl.NumberFormat().format(parseFloat(`${item.paid_amount}`)) || '0'} `}
                            <sub>DA</sub>
                          </CBadge>
                        </td>
                      ),
                      flexy_amount: (item) => (
                        <td className=" fw-bold px-3">
                          <CBadge
                            color="secondary"
                            className="fs-6 fw-bold text-nowrap"
                            textColor="light"
                          >
                            {`${Intl.NumberFormat().format(parseFloat(`${item.flexy_amount}`)) || '0'} `}
                            <sub>DA</sub>
                          </CBadge>
                        </td>
                      ),
                      amount_topay: (item) => (
                        <td className=" fw-bold px-3">
                          <CBadge
                            color="secondary"
                            className="fs-6 fw-bold text-nowrap"
                            textColor="light"
                          >
                            {`${Intl.NumberFormat().format(parseFloat(`${item.amount_topay}`)) || '0'} `}
                            <sub>DA</sub>
                          </CBadge>
                        </td>
                      ),
                      percentage: (item) => (
                        <td className=" fw-bold px-3">{`${item.percentage} %`}</td>
                      ),
                    }}
                    sorterValue={{
                      column: 'id',
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
export default ManageUsers
