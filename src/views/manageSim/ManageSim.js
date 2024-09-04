import { cilFaceDead, cilPlus, cilTrash } from '@coreui/icons'
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
} from '@coreui/react-pro'
import { useRef, useState } from 'react'

import {
  useGetNumbersQuery,
  useAddNumberMutation,
  useDeleteNumberMutation,
} from '../../Redux/features/Sim/SimApi'
import { getCurrentUser } from '../../Redux/features/Auth/authSlice'
import { useSelector } from 'react-redux'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

const ManageSim = () => {
  const user = useSelector(getCurrentUser)
  const { data: SimData, isLoading, isSuccess, isError } = useGetNumbersQuery(user)
  const [AddNumber, addNUmberResult] = useAddNumberMutation()
  const [DeleteNumber, deleteNUmberResult] = useDeleteNumberMutation()

  const [showModel, setShowModel] = useState(false)
  const [toast, addToast] = useState(0)
  const [newNumber, setNewNumber] = useState('')
  const [newIp, setNewIp] = useState('')

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
      _style: { width: '10%' },
    },
    {
      key: 'number',
      _style: { width: '40%' },
    },
    {
      key: 'ip',
      _style: { width: '40%' },
    },
    {
      key: 'action',
      label: '',
      _style: { width: '1%' },
      filter: false,
      sorter: false,
    },
  ]
  const SimTableData = SimData?.data || null

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

  const handleAddNumber = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const data = await AddNumber({
        credentials: user,
        Number: { number: newNumber, ip: newIp },
      }).unwrap()
      if (data.status !== 'success') {
        addToast(failedToast(data.message))
        throw new Error(data.message)
      }
      setShowModel(false)
      addToast(successToast('Phone Number Added Successfully.'))
    } catch (error) {
      let errorMsg = ''
      error?.message
        ? (errorMsg = error.message)
        : (errorMsg = 'Error While Adding Number, Please Try Again Later.')
      addToast(failedToast(`${errorMsg}`))
    }
  }

  const handleDeleteNumber = (number) => {
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
          await deleteNumber(number)
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
          title: 'Deleted!',
          text: 'Phone Number has been deleted.',
          icon: 'success',
        })
      }
    })
  }

  const deleteNumber = async (number) => {
    let toReturn
    try {
      const data = await DeleteNumber({
        credentials: user,
        Number: { number },
      }).unwrap()

      if (data.status !== 'success') {
        addToast(failedToast(data.message))
        throw new Error(data.message)
      }

      addToast(successToast('Phone Number Deleted Successfully.'))
      toReturn = data
    } catch (error) {
      let errorMsg = error?.message || 'Error While Deleting Number, Please Try Again Later.'
      addToast(failedToast(`${errorMsg}`))
      throw error // Re-throw the original error instead of creating a new one
    }
    return toReturn
  }

  return (
    <>
      <CToaster className="p-3" placement="top-end" push={toast} ref={toaster} />
      <CModal visible={showModel} onClose={() => setShowModel(false)}>
        <CModalHeader>
          <CModalTitle>Add New Number</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm noValidate onSubmit={handleAddNumber}>
            <CFormInput
              onChange={(e) => setNewNumber(e.target.value)}
              className="mb-3"
              id="number"
              placeholder="Phone Number"
              label="Phone Number"
              value={newNumber}
              required
            />
            <CFormInput
              onChange={(e) => setNewIp(e.target.value)}
              className="mb-3"
              id="ip"
              placeholder="IP Address"
              label="IP Address"
              value={newIp}
              required
            />
            <CButton
              disabled={addNUmberResult.isLoading}
              className="mb-3 float-end"
              type="submit"
              color="primary"
            >
              {`${addNUmberResult.isLoading ? 'Adding ...' : 'Add Number'}`}
            </CButton>
          </CForm>
        </CModalBody>
      </CModal>
      {!isLoading && !isError && (
        <>
          <CCard>
            <CCardHeader>SIM Numbers Manager</CCardHeader>
            <CCardBody>
              <CButton onClick={() => setShowModel(true)} color="primary float-end  mx-3">
                <CIcon icon={cilPlus} height={16}></CIcon>
                {` Add New Number`}
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
                    items={SimTableData}
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
                      action: (item) => (
                        <td className="py-2">
                          <CButton
                            disabled={deleteNUmberResult.isLoading}
                            onClick={() => handleDeleteNumber(item.number)}
                            variant="ghost"
                            color="danger"
                          >
                            {deleteNUmberResult.isLoading ? (
                              <CSpinner color="danger" />
                            ) : (
                              <CIcon icon={cilTrash} height={24}></CIcon>
                            )}
                          </CButton>
                        </td>
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
export default ManageSim
