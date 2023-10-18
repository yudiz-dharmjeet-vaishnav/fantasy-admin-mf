import React, { Fragment, useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useQueryState } from 'react-router-use-location-state'
import { useLocation } from 'react-router-dom'
import moment from 'moment'
import qs from 'query-string'
import PropTypes from 'prop-types'
// import { useQuery } from '@tanstack/react-query'

import FeedbackList from './FeedbackList'
import Layout from '../../../components/Layout'
import Heading from '../component/Heading'
import MainHeading from '../component/MainHeading'
import { isNumber } from '../../../helpers/helper'
import { getFeedbackList } from '../../../actions/feedback'
// import getFeedbackList from '../../../api/feedbackList/getFeedbackList'
import { getRecommendedList } from '../../../actions/users'

function FeedbackManagement (props) {
  const dispatch = useDispatch('')
  const location = useLocation()
  const content = useRef()
  const [IsNumber, setIsNumber] = useState(false)
  const [searchText, setSearchText] = useQueryState('search', '')
  const [complaintSearch, setComplaintSearch] = useState('')
  const [initialFlag, setinitialFlag] = useState(false)
  const [type, setType] = useQueryState('type', '')
  const [complainStatus, setComplainStatus] = useQueryState('complainStatus', 'P')
  const [dateRange, setDateRange] = useState([null, null])
  const [startDate, endDate] = dateRange
  const feedbackList = useSelector(state => state?.feedback?.feedbackList)
  const token = useSelector(state => state?.auth?.token)
  const recommendedList = useSelector(state => state?.users?.recommendedList)
  const previousProps = useRef({ complaintSearch })?.current
  const dateFlag = useRef(false)

  // const { data: feedbackList } = useQuery({
  //   queryKey: ['getFeedbackList'],
  //   queryFn: () => getFeedbackList(),
  //   select: (res) => res?.data?.data
  // })

  useEffect(() => {
    const obj = qs?.parse(location?.search)
    if (obj?.search) {
      setSearchText(obj?.search)
      setComplaintSearch(obj?.search)
      onGetRecommendedList(obj?.search, true)
    } else if (recommendedList?.length === 0 || !recommendedList) {
      onGetRecommendedList('', false)
    }
    if (obj?.datefrom && obj?.dateto) {
      setDateRange([new Date(obj?.datefrom), new Date(obj?.dateto)])
    }
  }, [])

  useEffect(() => {
    const callSearchService = () => {
      onGetRecommendedList(complaintSearch?.trim(), false)
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
  }, [complaintSearch])

  function handleChangeSearch (e, value) {
    if (e?.key === 'Enter') {
      e?.preventDefault()
    } else {
      setSearchText(value)
      setinitialFlag(true)
    }
  }

  function onHandleRecommendedSearch (e, value) {
    if (e?.key === 'Enter') {
      e?.preventDefault()
    }
    if (isNumber(value)) {
      setComplaintSearch(parseInt(value))
      setIsNumber(true)
    } else {
      setComplaintSearch(value)
      setIsNumber(false)
    }
  }

  function getList (start, limit, sort, order, search, type, status, StartDate, EndDate) {
    let searchData = ''
    if (search) {
      if (IsNumber) {
        const mobNum = recommendedList?.length > 0 && recommendedList?.find(rec => rec?.sMobNum === search)
        searchData = mobNum?._id
      } else {
        const email = recommendedList?.length > 0 && recommendedList?.find(rec => rec?.sUsername === search)
        searchData = email?._id
      }
    }
    const dateFrom = StartDate ? new Date(moment(StartDate)?.startOf('day')?.format()) : ''
    const dateTo = EndDate ? new Date(moment(EndDate)?.endOf('day')?.format()) : ''
    const data = {
      start, limit, sort, order, search: (searchData || search), type, status, dateFrom: dateFrom ? new Date(dateFrom)?.toISOString() : '', dateTo: dateFrom ? new Date(dateTo)?.toISOString() : '', token
    }
    dispatch(getFeedbackList(data))
  }

  function onGetRecommendedList (data, sendId) {
    dispatch(getRecommendedList(data, sendId, token))
  }

  function onExport () {
    content?.current?.onExport()
  }

  function onRefresh () {
    content?.current?.onRefresh()
  }

  function onFiltering (event, Type) {
    if (Type === 'type') {
      setType(event?.target?.value)
    } else {
      setComplainStatus(event?.target?.value)
    }
  }

  return (
    <Fragment>
      <Layout {...props} >
        <main className="main-content">
          <section className="management-section common-box">
            <MainHeading
              export="Export"
              heading="Feedbacks/Complaints"
              list={feedbackList}
              onExport={onExport}
              onRefresh={onRefresh}
              refresh = "Refresh"
            />
            <div className={feedbackList?.nTotal === 0 ? 'without-pagination' : 'setting-component'}>
              <Heading
                complainStatus={complainStatus}
                complaintSearch={complaintSearch}
                dateFlag={dateFlag}
                dateRange={dateRange}
                endDate={endDate}
                feedback
                handleChangeSearch={handleChangeSearch}
                handleRecommendedSearch={onHandleRecommendedSearch}
                list = {feedbackList}
                onFiltering={onFiltering}
                recommendedList={recommendedList}
                search={searchText}
                setDateRange={setDateRange}
                startDate={startDate}
                type={type}
              />
              <FeedbackList
                {...props}
                ref={content}
                complainStatus={complainStatus}
                dateFlag={dateFlag}
                endDate={endDate}
                feedbackList={feedbackList}
                flag={initialFlag}
                getList={getList}
                onExport={onExport}
                recommendedList={recommendedList}
                search={searchText}
                startDate={startDate}
                type={type}
              />
            </div>
          </section>
        </main>
      </Layout>
    </Fragment>
  )
}

FeedbackManagement.propTypes = {
  location: PropTypes.object
}

export default FeedbackManagement
