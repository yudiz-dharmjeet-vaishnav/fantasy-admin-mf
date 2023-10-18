import React, { Fragment, useState, useEffect, useRef } from 'react'
import qs from 'query-string'
import PropTypes from 'prop-types'
import moment from 'moment'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useQueryState } from 'react-router-use-location-state'

import Layout from '../../../components/Layout'
import UserHeader from '../Component/UsersListHeader'
import UsersListMainHeader from '../Component/UsersListMainHeader'
import KYCVerificationContent from './KYCVerification'

import { isNumber } from '../../../helpers/helper'
import { getRecommendedList } from '../../../actions/users'
import { getKYCList, getPendingKycCount } from '../../../actions/kyc'

function KYCVerification (props) {
  const location = useLocation()
  const [searchText, setSearchText] = useQueryState('search', '')
  const [initialFlag, setinitialFlag] = useState(false)
  const [IsNumber, setIsNumber] = useState(false)
  const [kycSearch, setKycSearch] = useState('')
  const [dateRange, setDateRange] = useState([null, null])
  const [startDate, endDate] = dateRange
  const [panStatus, setPanStatus] = useQueryState('panstatus', '')
  const [aadhaarStatus, setAadhaarStatus] = useQueryState('aadhaarstatus', '')

  const token = useSelector(state => state.auth.token)
  const kycList = useSelector(state => state.kyc.kycList)

  const pendingKycCount = useSelector(state => state.kyc.pendingKycCount)
  const recommendedList = useSelector(state => state.users.recommendedList)
  const content = useRef()
  const previousProps = useRef({ kycSearch }).current
  const dateFlag = useRef(false)
  const dispatch = useDispatch()

  useEffect(() => {
    const obj = qs.parse(location.search)
    if (obj.search) {
      setSearchText(obj.search)
      setKycSearch(obj.search)
      onGetRecommendedList(obj.search, true)
    } else if (recommendedList?.length === 0 || !recommendedList) {
      onGetRecommendedList('', false)
    }
    if (obj.datefrom && obj.dateto) {
      setDateRange([new Date(obj.datefrom), new Date(obj.dateto)])
    }
  }, [])

  // will be called when something searched
  useEffect(() => {
    const callSearchService = () => {
      onGetRecommendedList(kycSearch.trim(), false)
    }
    if (initialFlag) {
      const debouncer = setTimeout(() => {
        callSearchService()
      }, 1000)
      return () => {
        clearTimeout(debouncer)
        previousProps.searchText = searchText
      }
    }
  }, [kycSearch])

  function onGetRecommendedList (data, sendId) {
    // dispatch action recommended list
    dispatch(getRecommendedList(data, sendId, token))
  }

  function getPendingKycCountFunc (panStatus, aadhaarStatus) {
    // dispatch action pending kyc count
    dispatch(getPendingKycCount(panStatus, aadhaarStatus, token))
  }

  function getList (start, limit, search, dateFrom, dateTo, PanStatus, AadhaarStatus, isFullResponse) {
    let searchData = ''
    if (search) {
      if (IsNumber) {
        const data = recommendedList?.length > 0 && recommendedList.find(rec => rec.sMobNum === search)
        searchData = data._id
      } else {
        const data = recommendedList?.length > 0 && recommendedList.find(rec => rec.sEmail === search)
        searchData = data._id
      }
    }
    const StartDate = dateFrom ? new Date(moment(dateFrom).startOf('day').format()) : ''
    const EndDate = dateTo ? new Date(moment(dateTo).endOf('day').format()) : ''
    const KYCList = {
      token, start, limit, search: (searchData || search), startDate: StartDate ? new Date(StartDate).toISOString() : '', endDate: EndDate ? new Date(EndDate).toISOString() : '', PanStatus, AadhaarStatus, isFullResponse
    }
    // dispatch action get kyc list
    dispatch(getKYCList(KYCList))
  }

  // Export function
  function onExport () {
    content.current.onExport()
  }

  // function to handle search operations
  function handleChangeSearch (e, value) {
    if (e.key === 'Enter') {
      e.preventDefault()
    } else {
      setSearchText(value)
      setinitialFlag(true)
    }
  }

  // function to handle search operations
  function onHandleRecommendedSearch (e, value) {
    if (e.key === 'Enter') {
      e.preventDefault()
    }
    if (isNumber(value)) {
      setKycSearch(parseInt(value))
      setIsNumber(true)
    } else {
      setKycSearch(value)
      setIsNumber(false)
    }
  }

  function onRefreshFun () {
    content.current.onRefresh()
  }

  function onFiltering (event, FilterType) {
    FilterType === 'PAN' ? setPanStatus(event.target.value) : setAadhaarStatus(event.target.value)
  }

  return (
    <Fragment>
      <Layout {...props} >
        <main className="main-content">
          <section className="management-section common-box">
            <UsersListMainHeader
              heading="KYC Verification"
              list={kycList}
              onExport={onExport}
              onRefresh={onRefreshFun}
              refresh = 'Refresh KYC Data'
            />
            <div className={kycList?.length === 0 ? 'with-pagination ' : 'setting-component'}>
              <UserHeader
                aadhaarStatus={aadhaarStatus}
                dateFlag={dateFlag}
                dateRange={dateRange}
                endDate={endDate}
                handleChangeSearch={handleChangeSearch}
                handleRecommendedSearch={onHandleRecommendedSearch}
                heading= "KYC Verification"
                isDateRangeSelect={false}
                isOpenDateModal
                kycSearch={kycSearch}
                list={kycList}
                onFiltering={onFiltering}
                panStatus={panStatus}
                pendingKycCount={pendingKycCount}
                recommendedList={recommendedList}
                search={searchText}
                searchComplaint
                setDateRange={setDateRange}
                startDate={startDate}
              />
              <KYCVerificationContent
                {...props}
                ref={content}
                dateFlag={dateFlag}
                endDate={endDate}
                flag={initialFlag}
                getList={getList}
                getPendingKycCountFunc={getPendingKycCountFunc}
                kycList={kycList}
                pendingKycCount={pendingKycCount}
                recommendedList={recommendedList}
                search={searchText}
                startDate={startDate}
                viewUser="/users/user-management/user-details"
              />
            </div>
          </section>
        </main>
      </Layout>
    </Fragment>
  )
}

KYCVerification.propTypes = {
  location: PropTypes.object
}

export default KYCVerification
