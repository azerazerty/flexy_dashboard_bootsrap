import {
  cilFaceDead,
  cilMoney,
  cilPencil,
  cilPlus,
  cilReload,
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
  CFormCheck,
  CButtonGroup,
} from '@coreui/react-pro'
import { useEffect, useRef, useState } from 'react'

import {
  useGetUsersQuery,
  useCreateUserMutation,
  useDeleteUserMutation,
  useEditUserMutation,
  usePayUserMutation,
  useGenerateApiMutation,
} from '../../Redux/features/Admins/adminsApi'
import { useGetNumbersQuery } from '../../Redux/features/Sim/SimApi'

import { getCurrentUser } from '../../Redux/features/Auth/authSlice'
import { useSelector } from 'react-redux'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import CopyToClipboard from '../../components/CopyToClipboard'

const MySwal = withReactContent(Swal)

const ManageAdmins = () => {
  const user = useSelector(getCurrentUser)
  const { data: UsersData, isLoading, isSuccess, isError } = useGetUsersQuery(user)
  // const { data: SimData, ...GetNumbersQueryResult } = useGetNumbersQuery(user)
  const [ffusers, setFfusers] = useState()

  const [CreateUser, createUserResult] = useCreateUserMutation()
  const [EditUser, editUserResult] = useEditUserMutation()
  const [DeleteUser, deleteUserResult] = useDeleteUserMutation()
  const [GenerateApi, generateApiResult] = useGenerateApiMutation()

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
    //
    {
      key: 'id',
    },
    {
      key: 'user',
      label: 'Username',
    },
    {
      key: 'api_key',
      label: 'Api Key',
    },
    {
      key: 'has_freefire',
      label: 'Has FreeFire',
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
  const handleGenerateAPI = (user) => {
    MySwal.fire({
      title: 'Are you sure?',
      text: 'You Are About to Regenerate the API key!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Regenerate!',
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          await generateAPI(user)
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
          title: 'Regenerated!',
          text: 'API key has been regenerated.',
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
  const generateAPI = async (User) => {
    let toReturn
    try {
      const data = await GenerateApi({
        credentials: user,
        User: { edit_username: User.edit_username },
      }).unwrap()

      if (data.status !== 'success') {
        addToast(failedToast(data.message))
        throw new Error(data.message)
      }

      addToast(successToast('API key Regenerated Successfully.'))
      toReturn = data
    } catch (error) {
      let errorMsg = error?.message || 'Error While Regenerating API Key, Please Try Again Later.'
      addToast(failedToast(`${errorMsg}`))
      throw error // Re-throw the original error instead of creating a new one
    }
    return toReturn
  }
  useEffect(() => {
    const fetchFFusers = () => {
      fetch('https://fftopup.store/Flexy/getffusers.php', {
        body: JSON.stringify({
          ...user,
        }),
        method: 'POST',
      })
        .then(async (r) => await r.json())
        .then((response) => {
          if (response.users.length > 0) {
            let to_return = []
            response.users.map((user) => {
              to_return.push(user.user)
            })
            setFfusers(to_return)

            setFfusers(to_return)
          } else {
            setFfusers(response.users)
          }
        })
        .catch((e) => {
          //show toast
          setFfusers(null)
        })
    }

    fetchFFusers()
  }, [])

  return (
    <>
      <CToaster className="p-3" placement="top-end" push={toast} ref={toaster} />

      <CModal visible={showInfoModel} onClose={() => setShowInfoModel(false)}>
        <CModalHeader>
          <CModalTitle>Admin Details</CModalTitle>
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
            {/* <CFormSelect
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
              {ffusers &&
                ffusers.length > 0 &&
                ffusers?.map((item, i) => (
                  <option key={i} value={item.user}>
                    {item.user}
                  </option>
                ))}
            </CFormSelect> */}
            <CRow className=" mb-3">
              <CCol className="d-flex flex-column justify-content-center ">
                <CFormCheck
                  onChange={(e) =>
                    setSelectedUser((prev) => {
                      return {
                        ...prev,
                        has_freefire: selectedUser?.has_freefire === 'yes' ? 'no' : 'yes',
                        ffuser:
                          selectedUser?.has_freefire === 'yes'
                            ? null
                            : selectedUser?.ffuser || (ffusers && ffusers[0]?.user) || null,
                      }
                    })
                  }
                  id="has_freefire"
                  label="Admin Has FreeFire"
                  defaultChecked={selectedUser?.has_freefire === 'yes'}
                />
              </CCol>
              <CCol>
                <CFormSelect
                  disabled={selectedUser?.has_freefire !== 'yes'}
                  onChange={(e) =>
                    setSelectedUser((prev) => {
                      return {
                        ...prev,
                        ffuser: `${e.target.value}`,
                      }
                    })
                  }
                  id="ffuser"
                  required
                  aria-label="Select Linked User"
                  defaultValue={
                    (ffusers &&
                      ffusers.length > 0 &&
                      ffusers.includes(selectedUser?.ffuser) &&
                      selectedUser?.ffuser) ||
                    false
                  }
                >
                  <option disabled={selectedUser?.has_freefire === 'yes'}>
                    Select Linked User
                  </option>
                  {ffusers &&
                    ffusers.length > 0 &&
                    ffusers.map((item, i) => (
                      <option key={i} value={item}>
                        {item}
                      </option>
                    ))}
                </CFormSelect>
              </CCol>
            </CRow>

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
                  {` ${editUserResult.isLoading ? 'Loading ...' : 'Edit Admin'}`}
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

                  {` ${deleteUserResult.isLoading ? 'Loading ...' : 'Delete Admin'}`}
                </CButton>
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
      </CModal>
      <CModal visible={showCreateModel} onClose={() => setShowCreateModel(false)}>
        <CModalHeader>
          <CModalTitle>Admin Details</CModalTitle>
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
            <CRow className=" mb-3">
              <CCol className="d-flex flex-column justify-content-center ">
                <CFormCheck
                  onChange={(e) =>
                    setSelectedUser((prev) => {
                      return {
                        ...prev,
                        has_freefire: selectedUser?.has_freefire === 'yes' ? 'no' : 'yes',
                        ffuser:
                          selectedUser?.has_freefire === 'yes'
                            ? null
                            : selectedUser?.ffuser || (ffusers && ffusers[0]) || null,
                      }
                    })
                  }
                  id="has_freefire"
                  label="Admin Has FreeFire"
                  defaultChecked={selectedUser?.has_freefire === 'yes'}
                />
              </CCol>
              <CCol>
                <CFormSelect
                  disabled={selectedUser?.has_freefire !== 'yes'}
                  onChange={(e) =>
                    setSelectedUser((prev) => {
                      return {
                        ...prev,
                        ffuser: `${e.target.value}`,
                      }
                    })
                  }
                  id="ffuser"
                  required
                  aria-label="Select Linked User"
                  defaultValue={(ffusers && ffusers.length > 0 && ffusers[0]?.user) || null}
                >
                  <option disabled={selectedUser?.has_freefire === 'yes'}>
                    Select Linked User
                  </option>
                  {ffusers &&
                    ffusers.length > 0 &&
                    ffusers.map((item, i) => (
                      <option key={i} value={item}>
                        {item}
                      </option>
                    ))}
                </CFormSelect>
              </CCol>
            </CRow>

            <CButton
              disabled={createUserResult.isLoading}
              className="mb-3 float-end"
              type="submit"
              color="primary"
            >
              <CIcon icon={cilUserFollow} />
              {`${createUserResult.isLoading ? ' Creating ...' : ' Create Admin'}`}
            </CButton>
          </CForm>
        </CModalBody>
      </CModal>

      {!isLoading && !isError && (
        <>
          <CCard>
            <CCardHeader>Admins Manager</CCardHeader>
            <CCardBody>
              <CButton
                onClick={() => {
                  setSelectedUser({
                    has_freefire: 'no',
                    // ffuser: SimData?.data[0]?.number || null,
                    ffuser: null,
                  })

                  setShowCreateModel(true)
                }}
                color="primary float-end  mx-3"
              >
                <CIcon icon={cilUserFollow} height={16}></CIcon>
                {` Create New Admin`}
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
                    itemsPerPage={10}
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
                        <td>
                          <CButton
                            className="d-flex align-items-center gap-2"
                            disabled={editUserResult.isLoading}
                            onClick={() => {
                              console.log(item)
                              setSelectedUser({
                                edit_username: item.user,
                                new_password: item.password,
                                // new_percentage: item.percentage,
                                // new_phone_number: item.phone_number,
                                has_freefire: item.has_freefire || 'no',
                                // ffuser: SimData?.data[0]?.number || null,
                                ffuser: item.ffuser || null,
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
                      api_key: (item) => (
                        <td>
                          <CRow className="px-1 flex-nowrap" xs={{ gutterX: 2 }}>
                            <CCol>
                              <CopyToClipboard className="px-1 flex-nowrap" text={item.api_key} />
                            </CCol>
                            <CCol xs={2}>
                              <CButton
                                type="button"
                                variant="outline"
                                color="primary"
                                onClick={(e) =>
                                  handleGenerateAPI({
                                    edit_username: item.user,
                                  })
                                }
                              >
                                <CIcon icon={cilReload} />
                              </CButton>
                            </CCol>
                          </CRow>
                        </td>
                      ),

                      // amount_rest_topay: (item) => (
                      //   <td className=" fw-bold px-3">
                      //     <CBadge
                      //       color="danger"
                      //       className="fs-6 fw-bold text-nowrap"
                      //       textColor="light"
                      //     >
                      //       {`${Intl.NumberFormat().format(parseFloat(`${item.amount_rest_topay}`)) || '0'} `}
                      //       <sub>DA</sub>
                      //     </CBadge>
                      //   </td>
                      // ),
                      // paid_amount: (item) => (
                      //   <td className=" fw-bold px-3">
                      //     <CBadge
                      //       color="success"
                      //       className="fs-6 fw-bold text-nowrap"
                      //       textColor="light"
                      //     >
                      //       {`${Intl.NumberFormat().format(parseFloat(`${item.paid_amount}`)) || '0'} `}
                      //       <sub>DA</sub>
                      //     </CBadge>
                      //   </td>
                      // ),
                      // flexy_amount: (item) => (
                      //   <td className=" fw-bold px-3">
                      //     <CBadge
                      //       color="secondary"
                      //       className="fs-6 fw-bold text-nowrap"
                      //       textColor="light"
                      //     >
                      //       {`${Intl.NumberFormat().format(parseFloat(`${item.flexy_amount}`)) || '0'} `}
                      //       <sub>DA</sub>
                      //     </CBadge>
                      //   </td>
                      // ),
                      // amount_topay: (item) => (
                      //   <td className=" fw-bold px-3">
                      //     <CBadge
                      //       color="secondary"
                      //       className="fs-6 fw-bold text-nowrap"
                      //       textColor="light"
                      //     >
                      //       {`${Intl.NumberFormat().format(parseFloat(`${item.amount_topay}`)) || '0'} `}
                      //       <sub>DA</sub>
                      //     </CBadge>
                      //   </td>
                      // ),
                      // percentage: (item) => (
                      //   <td className=" fw-bold px-3">{`${item.percentage} %`}</td>
                      // ),
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
export default ManageAdmins
