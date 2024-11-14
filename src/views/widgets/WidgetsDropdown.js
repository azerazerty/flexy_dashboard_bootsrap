import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'

import {
  CRow,
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CWidgetStatsA,
  CSpinner,
} from '@coreui/react'
import { getStyle } from '@coreui/utils'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import {
  cilArrowBottom,
  cilArrowTop,
  cilOptions,
  cilMoney,
  cilUser,
  cilSim,
  cilFaceDead,
  cilReload,
} from '@coreui/icons'
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CPlaceholder,
  CToaster,
  CToast,
  CToastBody,
  CToastClose,
} from '@coreui/react-pro'
import { getCurrentUser } from '../../Redux/features/Auth/authSlice'
import { useSelector } from 'react-redux'
import { useHomeQuery } from '../../Redux/features/Home/homeApi'
import CopyToClipboard from '../../components/CopyToClipboard'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'

import { useGenerateApiMutation } from '../../Redux/features/Admins/adminsApi'

const MySwal = withReactContent(Swal)

const WidgetsDropdown = (props) => {
  const user = useSelector(getCurrentUser)
  const widgetChartRef1 = useRef(null)
  const widgetChartRef2 = useRef(null)
  const { data: homeData, isLoading, isError, isSuccess } = useHomeQuery(user)
  const [GenerateApi, generateApiResult] = useGenerateApiMutation()

  const toaster = useRef()
  const [toast, addToast] = useState(0)
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
    document.documentElement.addEventListener('ColorSchemeChange', () => {
      if (widgetChartRef1.current) {
        setTimeout(() => {
          widgetChartRef1.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-primary')
          widgetChartRef1.current.update()
        })
      }

      if (widgetChartRef2.current) {
        setTimeout(() => {
          widgetChartRef2.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-info')
          widgetChartRef2.current.update()
        })
      }
    })
  }, [widgetChartRef1, widgetChartRef2])

  return (
    <>
      <CToaster className="p-3" placement="top-end" push={toast} ref={toaster} />

      {!isLoading && !isError && homeData && (
        <>
          <CCard className="w-100 d-lg-none mb-4 ">
            <CCardHeader>Your Api Key</CCardHeader>
            <CCardBody>
              <CRow className=" flex-nowarp" xs={{ gutterX: 2, cols: 8 }}>
                <CCol>
                  <CopyToClipboard
                    className="px-1 flex-nowrap"
                    text={homeData?.data.api_key || 'Invalid API key'}
                  />
                </CCol>
                <CCol xs={2}>
                  <CButton
                    type="button"
                    variant="outline"
                    color="primary"
                    onClick={(e) =>
                      handleGenerateAPI({
                        edit_username: user.username,
                      })
                    }
                  >
                    <CIcon icon={cilReload} />
                  </CButton>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
          <CCard className="d-none d-lg-flex mb-4 w-50">
            <CCardHeader>Your Api Key</CCardHeader>
            <CCardBody>
              <CRow className=" flex-nowarp" xs={{ gutterX: 2, cols: 8 }}>
                <CCol>
                  <CopyToClipboard
                    className="px-1 flex-nowrap"
                    text={homeData?.data.api_key || 'Invalid API key'}
                  />
                </CCol>
                {user.role === 'super' && (
                  <CCol xs={1}>
                    <CButton
                      type="button"
                      variant="outline"
                      color="primary"
                      onClick={(e) =>
                        handleGenerateAPI({
                          edit_username: user.username,
                        })
                      }
                    >
                      <CIcon icon={cilReload} />
                    </CButton>
                  </CCol>
                )}
              </CRow>
            </CCardBody>
          </CCard>
        </>
      )}
      <CRow className="justify-content-center " xs={{ gutter: 4 }}>
        {!isLoading && !isError && homeData && (
          <>
            <CCol sm={6} xl={5}>
              <CWidgetStatsA
                color="info"
                value={
                  <>
                    <CRow>
                      <CCol xs sm={12} md>
                        <CIcon icon={cilUser} height={64} />
                      </CCol>
                      <CCol>
                        <h5 className="fw-bold text-nowrap mb-3"> Total Users</h5>
                        <h3 className="fw-bold text-nowrap mb-3">
                          <CBadge color="light" textColor="secondary">
                            {`${Intl.NumberFormat().format(parseFloat(`${homeData.data.total_users}`)) || '0'} `}
                          </CBadge>
                        </h3>
                      </CCol>
                    </CRow>
                  </>
                }
              />
            </CCol>
            {/* <CCol sm={6} xl={3} xxl={3}> */}
            <CCol sm={6} xl={5}>
              <CWidgetStatsA
                color="warning"
                value={
                  <>
                    <CRow>
                      <CCol xs sm={12} md>
                        <CIcon icon={cilSim} height={64} />
                      </CCol>
                      <CCol>
                        <h5 className="fw-bold text-nowrap mb-3"> Total Sim Numbers</h5>
                        <h3 className="fw-bold text-nowrap mb-3">
                          <CBadge color="light" textColor="warning">
                            {`${Intl.NumberFormat().format(parseFloat(`${homeData.data.total_sim_numbers}`)) || '0'} `}
                          </CBadge>
                        </h3>
                      </CCol>
                    </CRow>
                  </>
                }
              />
            </CCol>
            <CCol sm={6} xl={5}>
              <CWidgetStatsA
                color="danger"
                value={
                  <>
                    <CRow>
                      <CCol xs sm={12} md>
                        <CIcon icon={cilMoney} height={64} />
                      </CCol>
                      <CCol>
                        <h5 className="fw-bold text-nowrap mb-3"> Total Flexy For All Users</h5>
                        <h3 className="fw-bold text-nowrap mb-3">
                          <CBadge color="light" textColor="danger">
                            {`${Intl.NumberFormat().format(parseFloat(`${homeData.data.total_flexy}`)) || '0'} `}
                            <sub>DA</sub>
                          </CBadge>
                        </h3>
                      </CCol>
                    </CRow>
                  </>
                }
                // title="Users"
                // action={
                //   <CDropdown alignment="end">
                //     <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                //       <CIcon icon={cilOptions} />
                //     </CDropdownToggle>
                //     <CDropdownMenu>
                //       <CDropdownItem>Action</CDropdownItem>
                //       <CDropdownItem>Another action</CDropdownItem>
                //       <CDropdownItem>Something else here...</CDropdownItem>
                //       <CDropdownItem disabled>Disabled action</CDropdownItem>
                //     </CDropdownMenu>
                //   </CDropdown>
                // }
                // chart={
                //   <CChartLine
                //     ref={widgetChartRef1}
                //     className="mt-3 mx-3"
                //     style={{ height: '70px' }}
                //     data={{
                //       labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                //       datasets: [
                //         {
                //           label: 'My First dataset',
                //           backgroundColor: 'transparent',
                //           borderColor: 'rgba(255,255,255,.55)',
                //           pointBackgroundColor: getStyle('--cui-primary'),
                //           data: [65, 59, 84, 84, 51, 55, 40],
                //         },
                //       ],
                //     }}
                //     options={{
                //       plugins: {
                //         legend: {
                //           display: false,
                //         },
                //       },
                //       maintainAspectRatio: false,
                //       scales: {
                //         x: {
                //           border: {
                //             display: false,
                //           },
                //           grid: {
                //             display: false,
                //             drawBorder: false,
                //           },
                //           ticks: {
                //             display: false,
                //           },
                //         },
                //         y: {
                //           min: 30,
                //           max: 89,
                //           display: false,
                //           grid: {
                //             display: false,
                //           },
                //           ticks: {
                //             display: false,
                //           },
                //         },
                //       },
                //       elements: {
                //         line: {
                //           borderWidth: 1,
                //           tension: 0.4,
                //         },
                //         point: {
                //           radius: 4,
                //           hitRadius: 10,
                //           hoverRadius: 4,
                //         },
                //       },
                //     }}
                //   />
                // }
              />
            </CCol>
            <CCol sm={6} xl={5}>
              <CWidgetStatsA
                color="success"
                value={
                  <>
                    <CRow>
                      <CCol xs sm={12} md>
                        <CIcon icon={cilMoney} height={64} />
                      </CCol>
                      <CCol>
                        <h5 className="fw-bold text-nowrap mb-3"> Total Paid Payments</h5>
                        <h3 className="fw-bold text-nowrap mb-3">
                          <CBadge color="light" textColor="success">
                            {`${Intl.NumberFormat().format(parseFloat(`${homeData.data.total_paid_amount}`)) || '0'} `}
                            <sub>DA</sub>
                          </CBadge>
                        </h3>
                      </CCol>
                    </CRow>
                  </>
                }
              />
            </CCol>
          </>
        )}
        {isLoading && !isError && <CSpinner color="primary" />}
        {isError && (
          <>
            <h4 className="fw-bold text-secondary text-center ">Error While Fetching The Data</h4>
            <CIcon className="text-secondary" height={64} icon={cilFaceDead} />
          </>
        )}
      </CRow>
    </>
  )
}

WidgetsDropdown.propTypes = {
  className: PropTypes.string,
  withCharts: PropTypes.bool,
}

export default WidgetsDropdown
