import React, { useEffect, useRef } from 'react'
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
import { cilArrowBottom, cilArrowTop, cilOptions, cilMoney, cilUser, cilSim } from '@coreui/icons'
import { CBadge, CCardBody, CPlaceholder } from '@coreui/react-pro'
import { getCurrentUser } from '../../Redux/features/Auth/authSlice'
import { useSelector } from 'react-redux'
import { useHomeQuery } from '../../Redux/features/Home/homeApi'

const WidgetsDropdown = (props) => {
  const user = useSelector(getCurrentUser)
  const widgetChartRef1 = useRef(null)
  const widgetChartRef2 = useRef(null)
  const { data: homeData, isLoading, isError, isSuccess } = useHomeQuery(user)

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
    <CRow className="justify-content-center " xs={{ gutter: 4 }}>
      {!isLoading && (
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
      {isLoading && <CSpinner color="primary" />}
    </CRow>
  )
}

WidgetsDropdown.propTypes = {
  className: PropTypes.string,
  withCharts: PropTypes.bool,
}

export default WidgetsDropdown
