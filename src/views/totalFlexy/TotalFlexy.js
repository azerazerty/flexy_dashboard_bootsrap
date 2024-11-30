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
  CButton,
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
  cilPhone,
  cilFilter,
  cilFaceDead,
} from '@coreui/icons'
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CDateRangePicker,
  CForm,
  CFormCheck,
  CFormInput,
  CFormSwitch,
  CPlaceholder,
  CToast,
  CToastBody,
  CToastClose,
  CToaster,
  CWidgetStatsF,
} from '@coreui/react-pro'
import { getCurrentUser } from '../../Redux/features/Auth/authSlice'
import { useSelector } from 'react-redux'
import {
  useGetTotalQuery,
  useApplyFilterMutation,
} from '../../Redux/features/Operations/totalFlexyApi'
import { cilTrashX } from '@coreui/icons-pro'
import { format } from 'date-fns'

const FILTER_INIT = {
  number_filter: 'all_numbers',
  credit_filter: 'all_numbers',
  number: null,
}

const TotalFlexy = (props) => {
  const user = useSelector(getCurrentUser)
  const { data: FlexyData, isLoading, isError, isSuccess } = useGetTotalQuery(user)
  const [Filter, filterResult] = useApplyFilterMutation()
  const [toast, addToast] = useState(0)

  const [numberFilter, setNumberFilter] = useState(false)
  const [creditFilter, setCreditFilter] = useState(false)
  const [statusFilter, setStatusFilter] = useState(false)
  const [dateFilter, setDateFilter] = useState(false)

  const [newFilter, setNewFilter] = useState(FILTER_INIT)

  let data = filterResult.isSuccess
    ? filterResult?.data?.total_flexy || null
    : FlexyData?.total_flexy || null
  const toaster = useRef()

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

  const handleApplyFilter = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if ((numberFilter && newFilter?.number == null) || newFilter?.number?.trim() == '') {
      addToast(failedToast(`Phone Number Can't be Empty`))

      return
    }
    try {
      const received = await Filter({
        credentials: user,
        Filter: newFilter,
      }).unwrap()
      if (received.status !== 'success') {
        addToast(failedToast(received.message))
        throw new Error(received.message)
      }
      addToast(successToast('Result Updated Successfully.'))
      data = received?.total_flexy || null
    } catch (error) {
      let errorMsg = ''
      error?.message
        ? (errorMsg = error.message)
        : (errorMsg = 'Error While Updating Result, Please Try Again Later.')
      addToast(failedToast(`${errorMsg}`))
    }
  }

  return (
    <>
      <CToaster className="p-3" placement="top-end" push={toast} ref={toaster} />

      <CRow xs={{ cols: 1 }}>
        <CCol xs lg={6}>
          <CCard className="mb-4">
            <CCardHeader>Filter</CCardHeader>

            <CCardBody>
              <CForm noValidate onSubmit={handleApplyFilter}>
                <CRow>
                  <CCol>
                    <CFormSwitch
                      className="mb-3"
                      onChange={(e) => {
                        if (dateFilter)
                          setNewFilter((prev) => ({
                            ...prev,
                            number: null,
                            number_filter: 'all_numbers',
                          }))
                        setNumberFilter(!numberFilter)
                      }}
                      label="Number Filter"
                      id="number_filter"
                      checked={numberFilter}
                    />
                  </CCol>
                  <CCol>
                    {numberFilter && (
                      <CFormInput
                        maxLength={9}
                        onChange={(e) =>
                          setNewFilter((prev) => {
                            return {
                              ...prev,
                              number: `${e.target.value}`,
                              number_filter: 'specific_number',
                            }
                          })
                        }
                        className="mb-3"
                        id="phone_number"
                        placeholder="Phone Number"
                        floatingLabel="Phone Number"
                        value={newFilter?.number || ''}
                        required
                      />
                    )}
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    <CFormSwitch
                      className="mb-3"
                      onChange={(e) => {
                        if (creditFilter)
                          setNewFilter((prev) => ({
                            ...prev,
                            credit_filter: 'all_numbers',
                          }))
                        if (!creditFilter)
                          setNewFilter((prev) => {
                            return {
                              ...prev,
                              credit_filter: 'more_than',
                            }
                          })
                        setCreditFilter(!creditFilter)
                      }}
                      label="Credit Filter"
                      id="credit_filter"
                      checked={creditFilter}
                    />
                  </CCol>
                  <CCol>
                    {creditFilter && (
                      <>
                        <CFormCheck
                          onChange={(e) => {
                            setNewFilter((prev) => {
                              return {
                                ...prev,
                                credit_filter: 'more_than',
                              }
                            })
                          }}
                          inline
                          type="radio"
                          name="credit_filter"
                          id="more_then"
                          value="more_than"
                          label="More Then 20000 DA"
                          checked={newFilter.credit_filter === 'more_than'}
                        />
                        <CFormCheck
                          onChange={(e) => {
                            setNewFilter((prev) => {
                              return {
                                ...prev,
                                credit_filter: 'less_than',
                              }
                            })
                          }}
                          inline
                          type="radio"
                          name="credit_filter"
                          id="less_then"
                          value="less_than"
                          label="Less Then 20000 DA"
                          checked={newFilter.credit_filter === 'less_than'}
                        />
                      </>
                    )}
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    <CFormSwitch
                      className="mb-3"
                      onChange={(e) => {
                        if (statusFilter)
                          setNewFilter((prev) => ({
                            ...prev,
                            status_filter: null,
                          }))
                        if (!statusFilter)
                          setNewFilter((prev) => {
                            return {
                              ...prev,
                              status_filter: 'confirmed',
                            }
                          })
                        setStatusFilter(!statusFilter)
                      }}
                      label="Status Filter"
                      id="status_filter"
                      checked={statusFilter}
                    />
                  </CCol>
                  <CCol>
                    {statusFilter && (
                      <>
                        <CFormCheck
                          onChange={(e) => {
                            setNewFilter((prev) => {
                              return {
                                ...prev,
                                status_filter: 'confirmed',
                              }
                            })
                          }}
                          inline
                          type="radio"
                          name="status_filter"
                          id="confirmed"
                          value="confirmed"
                          label="Confirmed Only"
                          checked={newFilter.status_filter === 'confirmed'}
                        />
                        <CFormCheck
                          onChange={(e) => {
                            setNewFilter((prev) => {
                              return {
                                ...prev,
                                status_filter: 'not_confirmed',
                              }
                            })
                          }}
                          inline
                          type="radio"
                          name="status_filter"
                          id="not_confirmed"
                          value="not_confirmed"
                          label="Not Confirmed Only"
                          checked={newFilter.status_filter === 'not_confirmed'}
                        />
                      </>
                    )}
                  </CCol>
                </CRow>
                <CRow xs={{ cols: 2 }}>
                  <CCol>
                    <CFormSwitch
                      className="mb-3"
                      onChange={(e) => {
                        if (dateFilter)
                          setNewFilter((prev) => ({
                            ...prev,
                            date_filter: null,
                            begin_date: null,
                            end_date: null,
                          }))
                        setDateFilter(!dateFilter)
                      }}
                      label="Date Filter"
                      id="date_filter"
                      checked={dateFilter}
                    />
                  </CCol>
                  <CCol xs={12}>
                    {dateFilter && (
                      <>
                        <CDateRangePicker
                          style={{ '--cui-date-picker-zindex': '10000' }}
                          className="mb-3 "
                          id="date"
                          name="date"
                          inputDateParse={(date) => {
                            if (date.length !== 10) return
                            return new Date(date)
                          }}
                          inputDateFormat={(date) => format(new Date(date), 'yyyy-MM-dd')}
                          onStartDateChange={(date) =>
                            setNewFilter((prev) => {
                              return {
                                ...prev,
                                begin_date: format(date, 'yyyy-MM-dd'),
                              }
                            })
                          }
                          onEndDateChange={(date) =>
                            setNewFilter((prev) => {
                              return {
                                ...prev,
                                end_date: format(date, 'yyyy-MM-dd'),
                              }
                            })
                          }
                          endDate={newFilter?.end_date || format(Date.now(), 'yyyy-MM-dd')}
                          startDate={newFilter?.begin_date || format(Date.now(), 'yyyy-MM-dd')}
                        />
                      </>
                    )}
                  </CCol>
                </CRow>

                <CRow className="mt-4">
                  <CCol>
                    <CButton
                      onClick={(e) => {
                        setNewFilter(FILTER_INIT)
                        setNumberFilter(false)
                        setCreditFilter(false)
                        setStatusFilter(false)
                        setDateFilter(false)
                      }}
                      disabled={filterResult.isLoading}
                      className="mb-3"
                      type="button"
                      color="secondary"
                      variant="outline"
                    >
                      <CIcon icon={cilTrashX} />
                      {` Reset`}
                    </CButton>
                  </CCol>
                  <CCol>
                    <CButton
                      disabled={filterResult.isLoading}
                      className="mb-3 float-end"
                      type="submit"
                      color="primary"
                    >
                      <CIcon icon={cilFilter} />
                      {`${filterResult.isLoading ? ' Filtering ...' : ' Apply Filter'}`}
                    </CButton>
                  </CCol>
                </CRow>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol>
          <CCard className="mb-4">
            <CCardHeader>Total Flexy</CCardHeader>
            <CCardBody>
              <CRow className={props.className} xs={{ gutter: 4 }}>
                {!isLoading &&
                  !filterResult.isLoading &&
                  !isError &&
                  data &&
                  Object.keys(data).length > 0 &&
                  Object.keys(data).map((number, i) => (
                    <CCol key={i} sm={6} xl={4} xxl={3}>
                      <CWidgetStatsF
                        padding={false}
                        className="mb-3 fw-bold text-nowrap"
                        color="success"
                        icon={<CIcon icon={cilPhone} height={32} />}
                        title={
                          <h3 className="fw-bold text-nowrap">
                            <CBadge
                              className="fw-bold text-nowrap"
                              color="light"
                              height={32}
                              textColor="success"
                            >
                              {`${Intl.NumberFormat().format(parseFloat(`${data[number]}`)) || '0'} `}
                              <sub>DA</sub>
                            </CBadge>
                          </h3>
                        }
                        value={
                          <h4 className="fw-bold text-nowrap text-secondary">{`0${number}`}</h4>
                        }
                      />
                    </CCol>
                  ))}
                {filterResult.isLoading && <CSpinner color="primary" />}

                {isLoading && !isError && <CSpinner color="primary" />}
                {!isError && !filterResult.isError && data && Object.keys(data).length < 1 && (
                  <>
                    {' '}
                    <h3 className="fw-bold ">
                      {' '}
                      No Result Found <CIcon icon={cilFaceDead} height={36} />{' '}
                    </h3>{' '}
                  </>
                )}

                {isError && (
                  <>
                    <h4 className="fw-bold text-secondary text-center ">
                      Error While Fetching The Data
                    </h4>
                    <CIcon className="text-secondary" height={64} icon={cilFaceDead} />
                  </>
                )}
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

TotalFlexy.propTypes = {
  className: PropTypes.string,
  withCharts: PropTypes.bool,
}

export default TotalFlexy
