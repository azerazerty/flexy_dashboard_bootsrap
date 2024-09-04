import { cilPlus, cilTrash } from '@coreui/icons'
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
  useGetInvoicesQuery,
  useDeleteInvoiceMutation,
} from '../../Redux/features/Invoices/invoiceApi'
import { getCurrentUser } from '../../Redux/features/Auth/authSlice'
import { useSelector } from 'react-redux'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

const Invoices = () => {
  const user = useSelector(getCurrentUser)
  const { data: InvoicesData, isLoading, isSuccess, isError } = useGetInvoicesQuery(user)
  const [DeleteInvoice, deleteInvoiceResult] = useDeleteInvoiceMutation()

  const [toast, addToast] = useState(0)

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
      key: 'user',
      _style: { width: '20%' },
    },
    {
      key: 'flexy_amount',
      _style: { width: '20%' },
    },
    {
      key: 'paid_amount',
      _style: { width: '20%' },
    },
    {
      key: 'date',
      label: 'Date and Time',
    },
    {
      key: 'action',
      label: '',
      _style: { width: '1%' },
      filter: false,
      sorter: false,
    },
  ]
  const InvoicesTableData = InvoicesData?.invoices || null

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

  const handleDeleteInvoice = (id) => {
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
          await deleteInvoice(id)
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
          text: 'Invoice has been deleted.',
          icon: 'success',
        })
      }
    })
  }

  const deleteInvoice = async (id) => {
    let toReturn
    try {
      const data = await DeleteInvoice({
        credentials: user,
        Invoice: { id },
      }).unwrap()

      if (data.status !== 'success') {
        addToast(failedToast(data.message))
        throw new Error(data.message)
      }

      addToast(successToast('Invoice Deleted Successfully.'))
      toReturn = data
    } catch (error) {
      let errorMsg = error?.message || 'Error While Deleting Invoice, Please Try Again Later.'
      addToast(failedToast(`${errorMsg}`))
      throw error // Re-throw the original error instead of creating a new one
    }
    return toReturn
  }

  return (
    <>
      <CToaster className="p-3" placement="top-end" push={toast} ref={toaster} />
      {!isLoading && (
        <>
          <CCard>
            <CCardHeader>Invoices Manager</CCardHeader>
            <CCardBody>
              <CRow>
                <CCol>
                  <CSmartTable
                    activePage={1}
                    cleaner
                    clickableRows
                    columns={columns}
                    columnSorter
                    //   footer
                    items={InvoicesTableData}
                    itemsPerPageSelect
                    itemsPerPage={5}
                    pagination
                    //   selectable
                    tableFilter
                    sorterValue={{
                      column: 'id',
                      state: 'asc',
                    }}
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
                            disabled={deleteInvoiceResult.isLoading}
                            onClick={() => handleDeleteInvoice(item.id)}
                            variant="ghost"
                            color="danger"
                          >
                            {deleteInvoiceResult.isLoading ? (
                              <CSpinner color="danger" />
                            ) : (
                              <CIcon icon={cilTrash} height={24}></CIcon>
                            )}
                          </CButton>
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
                      percentage: (item) => (
                        <td className=" fw-bold px-3">{`${item.percentage} %`}</td>
                      ),
                      date: (item) => <td className="fst-italic text-nowrap">{`${item.date}`} </td>,
                    }}
                  />
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </>
      )}
      {isLoading && <CSpinner color="primary" />}
    </>
  )
}
export default Invoices
