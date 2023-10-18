import React, { Fragment, useState, useEffect, useRef, forwardRef } from 'react'
import qs from 'query-string'
import { useDispatch, useSelector } from 'react-redux'
import { useQueryState } from 'react-router-use-location-state'
import { useLocation } from 'react-router-dom'
import moment from 'moment'
import PropTypes from 'prop-types'
import { Modal, ModalBody, Button, ModalHeader, FormGroup, Input, Label } from 'reactstrap'
import DatePicker from 'react-datepicker'

import calendarIcon from '../../../assets/images/calendar.svg'

import Layout from '../../../components/Layout'
import UserHeader from '../Component/UsersListHeader'
import DepositManagementContent from './DepositManagement'
import UsersListMainHeader from '../Component/UsersListMainHeader'

import { getFirstDeportReport } from '../../../actions/matchleague'
import { getDepositList, getDepositsTotalCount } from '../../../actions/deposit'
import { getUrl } from '../../../actions/url'

function DepositManagement (props) {
  const location = useLocation()
  const [search, setSearch] = useState('')
  const [initialFlag, setinitialFlag] = useState(false)
  const [paymentStatus, setPaymentStatus] = useQueryState('status', '')
  const [depositPaymentMethod, setDepositPaymentMethod] = useQueryState('method', '')
  const [disableButton, setDisableButton] = useState(false)
  const [modalReport, setModalReport] = useState(false)
  const dispatch = useDispatch()
  const token = useSelector(state => state.auth.token)
  const depositList = useSelector(state => state.deposit.depositList)
  const depositReportDetails = useSelector(state => state.matchleague.firsDepositReport)
  const getUrlLink = useSelector(state => state.url.getUrl)
  const [dateRange, setDateRange] = useState([null, null])
  const [dateRangeReport, setDateRangeReport] = useState([null, null])
  const [startDate, endDate] = dateRange
  const [startDateReport, endDateReport] = dateRangeReport
  const content = useRef()

  const modalToggle = () => {
    setModalReport(!modalReport)
    setDateRangeReport([null, null])
  }
  useEffect(() => {
    const obj = qs.parse(location.search)
    if (obj.searchValue) {
      setSearch(obj.searchValue)
    }
    if (obj.datefrom && obj.dateto) {
      setDateRange([new Date(obj.datefrom), new Date(obj.dateto)])
    }
    dispatch(getUrl('media'))
  }, [])

  function onHandleSearch (e) {
    if (e.key === 'Enter') {
      e.preventDefault()
    }
    setSearch(e.target.value)
    setinitialFlag(true)
  }

  // this forwardRef user Date Filter
  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
    <div className='form-control date-range' onClick={onClick}>
      <img alt="calendar" className='calenderIcon' src={calendarIcon}/>
      <Input ref={ref} className='date-input range ' placeholder='Select Date Range' readOnly style={{ width: '100%' }} value={value} />
    </div>
  ))
  ExampleCustomInput.displayName = ExampleCustomInput

  // dispatch action to get depositsTotalCount
  function getDepositsTotalCountFunc (searchText, status, method, dateFrom, dateTo, isFullResponse) {
    const StartDate = dateFrom ? new Date(moment(dateFrom).startOf('day').format()) : ''
    const EndDate = dateTo ? new Date(moment(dateTo).endOf('day').format()) : ''
    const depositListData = {
      search: searchText, status, method, startDate: StartDate ? new Date(StartDate).toISOString() : '', endDate: EndDate ? new Date(EndDate).toISOString() : '', isFullResponse, token
    }
    dispatch(getDepositsTotalCount(depositListData))
  }

  function getList (start, limit, sort, order, searchText, status, method, dateFrom, dateTo, isFullResponse) {
    const StartDate = dateFrom ? new Date(moment(dateFrom).startOf('day').format()) : ''
    const EndDate = dateTo ? new Date(moment(dateTo).endOf('day').format()) : ''
    const depositListData = {
      start, limit, sort, order, search: searchText.trim(), status, method, startDate: StartDate ? new Date(StartDate).toISOString() : '', endDate: EndDate ? new Date(EndDate).toISOString() : '', isFullResponse, token
    }
    // dispatch action to get deposit List
    dispatch(getDepositList(depositListData))
  }

  function onExport () {
    content.current.onExport()
  }

  function onRefresh () {
    content.current.onRefresh()
  }

  function onStatusChange (event) {
    setPaymentStatus(event.target.value)
  }

  function onMethodChange (event) {
    setDepositPaymentMethod(event.target.value)
  }

  function depositReport (startDate, endDate, token) {
    const StartDate = startDate ? new Date(moment(startDate).startOf('day').format()) : ''
    const EndDate = endDate ? new Date(moment(endDate).endOf('day').format()) : ''
    const ReportData = {
      startDate: StartDate ? new Date(StartDate).toISOString() : '', endDate: EndDate ? new Date(EndDate).toISOString() : '', token
    }
    setDisableButton(true)
    dispatch(getFirstDeportReport(ReportData))
    setModalReport(false)
  }

  useEffect(() => {
    if (depositReportDetails && getUrlLink) {
      setDisableButton(false)
      window.open(`${getUrlLink}${depositReportDetails?.key}`)
    }
  }, [depositReportDetails?.key, getUrlLink])

  return (
    <Fragment>
      <Layout {...props} >
        <main className="main-content">
          <section className="management-section common-box">
            <UsersListMainHeader
              heading="Deposits"
              list={depositList}
              onExport={onExport}
              onRefresh={onRefresh}
              refresh = 'Refersh Deposits Data'
            />
            <div className={ depositList?.length !== 0 && depositList?.rows?.length !== 0 ? 'setting-component' : 'deposit-component'}>
              <UserHeader
                dateRange={dateRange}
                depositPaymentMethod={depositPaymentMethod}
                disableButton={disableButton}
                endDate={endDate}
                handleSearch={onHandleSearch}
                heading="Deposits"
                list={depositList}
                modalToggle={modalToggle}
                onMethodChange={onMethodChange}
                onStatusChange={onStatusChange}
                paymentStatus={paymentStatus}
                search={search}
                setDateRange={setDateRange}
                startDate={startDate}
              />
              <DepositManagementContent
                {...props}
                ref={content}
                List={depositList}
                endDate={endDate}
                flag={initialFlag}
                getDepositsTotalCountFunc={getDepositsTotalCountFunc}
                getList={getList}
                search={search}
                startDate={startDate}
                viewLink="/users/user-management/user-details"
              />
            </div>
          </section>
        </main>
      </Layout>

      <Modal className='firstDepositReport' isOpen={modalReport} toggle={modalToggle}>
        <ModalHeader className='report-header' toggle={modalToggle}> Admin First Deposit Report </ModalHeader>
        <ModalBody className='p-4'>
          <Label className='report-date-label' for='sports-date'> Select Date Range </Label>
          <FormGroup>
            <DatePicker
              className='w-100'
              customInput={<ExampleCustomInput />}
              dropdownMode="select"
              endDate={endDateReport}
              isClearable={true}
              maxDate={new Date()}
              onChange={(update) => {
                setDateRangeReport(update)
              }}
              peekNextMonth
              placeholderText='Select Date Range'
              selectsRange={true}
              showMonthDropdown
              showYearDropdown
              startDate={startDateReport}
              value={dateRangeReport}
            />
          </FormGroup>
          <Button className='w-100 mt-3 report-button' onClick={() => depositReport(startDateReport, endDateReport, token)}>Submit</Button>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

DepositManagement.propTypes = {
  location: PropTypes.object,
  onClick: PropTypes.func,
  value: PropTypes.string
}

export default DepositManagement
