import { cilCheck, cilFaceDead, cilPlus, cilTrash, cilUserFollow } from '@coreui/icons'
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
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CForm,
  CFormSelect,
  CToast,
  CToastBody,
  CToastClose,
} from '@coreui/react-pro'
import { useEffect, useRef, useState } from 'react'

import {
  useAdminOperationsQuery,
  useConfirmOperationMutation,
} from '../../Redux/features/Operations/adminOperationsApi'
import { getCurrentUser } from '../../Redux/features/Auth/authSlice'
import { useSelector } from 'react-redux'
import { CButton } from '@coreui/react'
import { cilSearch } from '@coreui/icons-pro'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

const AdminOperations = () => {
  const user = useSelector(getCurrentUser)
  const { data: AdminOperationsData, isLoading, isSuccess, isError } = useAdminOperationsQuery(user)
  const [ConfirmOperation, confirmOperationResult] = useConfirmOperationMutation(user)
  const [selectedOperation, setSelectedOperation] = useState()
  const [showConfirmModel, setShowConfirmModel] = useState(false)
  const [toast, addToast] = useState(0)
  const [users, setUsers] = useState([])

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
      key: 'date',
      label: 'Date And Time',
    },
    {
      key: 'action',
      label: '',
    },
    // {
    //   key: 'action',
    //   label: '',
    //   _style: { width: '1%' },
    //   filter: false,
    //   sorter: false,
    // },
  ]
  const AdminOperationsTableData = AdminOperationsData?.operations || null

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
  const handleConfirm = () => {
    MySwal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, confirm it!',
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          await confirmOperation(selectedOperation)
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
          title: 'Confirmed!',
          text: 'Operation has been confirmed.',
          icon: 'success',
        })
      }
    })
  }

  const confirmOperation = async (operation) => {
    let toReturn
    try {
      const data = await ConfirmOperation({
        credentials: user,
        Operation: operation,
      }).unwrap()

      if (data.status !== 'success') {
        addToast(failedToast(data.message))
        throw new Error(data.message)
      }
      setShowConfirmModel(false)
      setSelectedOperation(null)
      addToast(successToast('Operation Confirmed Successfully.'))
      toReturn = data
    } catch (error) {
      let errorMsg = error?.message || 'Error While Confirming Operation, Please Try Again Later.'
      addToast(failedToast(`${errorMsg}`))
      throw error // Re-throw the original error instead of creating a new one
    }
    return toReturn
  }

  useEffect(() => {
    const fetchUsers = () => {
      fetch('https://fftopup.store/Flexy/getflexyusers.php', {
        body: JSON.stringify({
          ...user,
        }),
        method: 'POST',
      })
        .then(async (r) => await r.json())
        .then((response) => {
          if (response.users.length > 0 && response.status === 'success') {
            setUsers(response.users)
          } else {
            setUsers([])
            throw new Error(response.error || 'Unknown server error')
          }
        })
        .catch((e) => {
          //show toast
          setUsers([])
          addToast(failedToast(`${e.message || e}`))
        })
    }

    fetchUsers()
  }, [])

  return (
    <>
      {!isLoading && !isError && (
        <>
          <CModal visible={showConfirmModel} onClose={() => setShowConfirmModel(false)}>
            <CModalHeader>
              <CModalTitle>Confirm Operation</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CForm noValidate onSubmit={handleConfirm}>
                <CFormSelect
                  onChange={(e) =>
                    setSelectedOperation((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                  className="mb-3"
                  id="username"
                  required
                  label="Select Username"
                  aria-label="Select Username"
                  defaultValue={selectedOperation?.username || users[0]?.username || ''}
                >
                  <option disabled>Select User</option>
                  {users?.map((item, i) => (
                    <option key={i} value={item.username}>
                      {item.username}
                    </option>
                  ))}
                </CFormSelect>

                <CButton
                  disabled={confirmOperationResult.isLoading}
                  className="mb-3 float-end"
                  type="submit"
                  color="primary"
                >
                  <CIcon icon={cilCheck} />
                  {`${confirmOperationResult.isLoading ? ' Confirming ...' : ' Confirm Operation'}`}
                </CButton>
              </CForm>
            </CModalBody>
          </CModal>
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
                    items={AdminOperationsTableData}
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
                      date: (item) => <td className="fst-italic text-nowrap">{`${item.date}`} </td>,
                      action: (item) => (
                        <td>
                          <CButton
                            disabled={item.status === 'confirmed'}
                            onClick={() => {
                              setSelectedOperation({
                                operation_id: item.id,
                                username: users[0].username || null,
                              })
                              setShowConfirmModel(true)
                            }}
                            color={`${item.status === 'confirmed' ? 'dark' : 'success'}`}
                            variant="outline"
                          >
                            <CIcon icon={cilCheck} />
                            {` Confirm`}
                          </CButton>
                        </td>
                      ),
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
export default AdminOperations
