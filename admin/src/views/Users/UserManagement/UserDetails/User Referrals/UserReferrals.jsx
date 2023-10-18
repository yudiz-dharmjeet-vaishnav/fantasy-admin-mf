import React, { forwardRef, Fragment, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useQueryState } from 'react-router-use-location-state'
import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Badge, Button } from 'reactstrap'
import { useSelector } from 'react-redux'
import moment from 'moment'
import qs from 'query-string'
import PropTypes from 'prop-types'

import check from '../../../../../assets/images/checked-icon.svg'

import PaginationComponent from '../../../../../components/PaginationComponent'
import SkeletonTable from '../../../../../components/SkeletonTable'
import AlertMessage from '../../../../../components/AlertMessage'
import DataNotFound from '../../../../../components/DataNotFound'
import { modalMessageFunc } from '../../../../../helpers/helper'

const UserReferrals = forwardRef((props, ref) => {
  const { getList, referredList, search } = props
  const navigate = useNavigate()
  const location = useLocation()
  const exporter = useRef(null)
  const [start, setStart] = useState(0)
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [total, setTotal] = useState(0)
  const [list, setList] = useState([])
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [sort] = useQueryState('sortBy', 'dCreatedAt')
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [index, setIndex] = useState(1)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [listLength, setListLength] = useState('10 Rows')
  const [close, setClose] = useState(false)
  const [modalMessage, setModalMessage] = useState(false)

  const resStatus = useSelector((state) => state?.users?.resStatus)
  const resMessage = useSelector((state) => state?.users?.resMessage)
  const searchProp = props?.search
  const obj = qs?.parse(location?.search)

  const previousProps = useRef({
    resMessage,
    resStatus,
    referredList,
    searchProp,
    start,
    offset
  })?.current
  const paginationFlag = useRef(false)

  useEffect(() => {
    if (location?.state) {
      if (location?.state?.message) {
        setMessage(location?.state?.message)
        setStatus(true)
        setModalMessage(true)
      }
      navigate(location?.pathname, { replace: true })
    }
    let page = 1
    let limit = offset
    if (obj) {
      if (obj?.page) {
        page = obj?.page
        setPageNo(page)
      }
      if (obj?.pageSize) {
        limit = obj?.pageSize
        setOffset(limit)
        setListLength(`${limit} Rows`)
      }
    }
    const startFrom = (page - 1) * offset
    setStart(startFrom)
    getList(startFrom, limit, sort, 'asc', search)
    setLoading(true)
  }, [])

  useEffect(() => {
    if (previousProps?.referredList !== referredList) {
      if (referredList) {
        if (referredList?.results) {
          const userArrLength = referredList?.results?.length
          const startFrom = (activePageNo - 1) * offset + 1
          const end = startFrom - 1 + userArrLength
          setStartingNo(startFrom)
          setEndingNo(end)
        }
        setList(referredList?.results ? referredList?.results : [])
        setIndex(activePageNo)
        setTotal(referredList?.count ? referredList?.count : 0)
      }
      setLoading(false)
    }
    return () => {
      previousProps.referredList = referredList
    }
  }, [referredList])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (previousProps?.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          const startFrom = (activePageNo - 1) * offset
          const limit = offset
          getList(startFrom, limit, sort, 'asc', search)
          setMessage(resMessage)
          setStatus(resStatus)
          setModalMessage(true)
          setPageNo(activePageNo)
        } else {
          setMessage(resMessage)
          setStatus(resStatus)
          setModalMessage(true)
          setLoading(false)
        }
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  useEffect(() => {
    let data = localStorage?.getItem('queryParams')
      ? JSON.parse(localStorage?.getItem('queryParams'))
      : {}
    !Object?.keys(data)?.length
      ? (data = {
          SettingManagement: location?.search
        })
      : (data.SettingManagement = location?.search)
    localStorage?.setItem('queryParams', JSON?.stringify(data))
  }, [location.search])

  useEffect(() => {
    const callSearchService = () => {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, 'asc', props?.search)
      setStart(startFrom)
      setPageNo(1)
      setLoading(true)
    }
    if (previousProps?.searchProp !== searchProp && props?.flag) {
      const debouncer = setTimeout(() => {
        callSearchService()
      }, 1000)
      return () => {
        clearTimeout(debouncer)
        previousProps.searchProp = searchProp
      }
    }
    return () => {
      previousProps.searchProp = searchProp
    }
  }, [searchProp])

  useEffect(() => {
    if ((previousProps?.start !== start || previousProps?.offset !== offset) && paginationFlag?.current) {
      getList(start, offset, sort, 'asc', search)
      setLoading(true)
    }
    return () => {
      previousProps.start = start
      previousProps.offset = offset
    }
  }, [start, offset])

  const processExcelExportData = (data) =>
    data?.map((referralsList) => {
      let dCreatedAt = moment(referralsList?.dCreatedAt)?.local()?.format('lll')
      dCreatedAt = dCreatedAt === 'Invalid date' ? ' - ' : dCreatedAt
      const sUsername = referralsList?.sUsername || '--'
      const sEmail = referralsList?.sEmail || '--'
      const sName = referralsList?.sName || '--'
      const sReferrerRewardsOn = referralsList?.sReferrerRewardsOn || '--'
      const eReferStatus = referralsList?.eReferStatus || '--'
      const nReferAmount = referralsList?.nReferAmount || '--'
      const nReferrerAmount = referralsList?.nReferrerAmount || '--'

      return {
        ...referralsList,
        sUsername,
        sEmail,
        sName,
        dCreatedAt,
        sReferrerRewardsOn,
        eReferStatus,
        nReferAmount,
        nReferrerAmount
      }
    })

  function onExport () {
    const { length } = list
    if (length !== 0) {
      exporter.current.props = {
        ...exporter?.current?.props,
        data: processExcelExportData(list),
        fileName: 'ReferralsList.xlsx'
      }
      exporter?.current?.save()
    }
  }

  useImperativeHandle(ref, () => ({
    onExport
  }))

  return (
    <Fragment>
      <ExcelExport ref={exporter} data={list} fileName='ReferralsList.xlsx'>
        <ExcelExportColumn field='sUsername' title='Username' />
        <ExcelExportColumn field='sEmail' title='Email' />
        <ExcelExportColumn field='sMobNum' title='Mobile No.' />
        <ExcelExportColumn field='dCreatedAt' title='Registered Date' />
        <ExcelExportColumn field='sReferrerRewardsOn' title='Referral Type' />
        <ExcelExportColumn field='eReferStatus' title='Referral Status' />
        <ExcelExportColumn field='nReferAmount' title='Referral Bonus' />
        <ExcelExportColumn field='nReferrerAmount' title='Base User Reward' />
      </ExcelExport>

      {
      !loading && list?.length === 0
        ? (
          <DataNotFound message="Referred User" obj={obj}/>
          )
        : (
          <div className='table-represent'>
            <div className='table-responsive'>
              <AlertMessage
                close={close}
                message={message}
                modalMessage={modalMessage}
                status={status}
              />
              <table className='table'>
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Mobile No.</th>
                    <th>Registered Date</th>
                    <th>Referral Type</th>
                    <th>Referral Status</th>
                    <th>Referral Bonus</th>
                    <th>Base User Reward</th>
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? (<SkeletonTable numberOfColumns={9} />)
                    : (
                      <Fragment>
                        {list && list?.length !== 0 && list.map((data, i) => (
                          <tr key={data?._id}>
                            <td>{(index - 1) * offset + (i + 1)}</td>
                            <td>
                              {data?.sUsername ? <Button className="view" color="link" tag={Link} to={`/users/user-management/user-details/${data?._id}`}>{data?.sUsername}</Button> : '--'}
                              {data?.bIsInternalAccount ? <b className='account-text'>(Internal)</b> : ''}
                            </td>
                            <td>
                              {(data && data?.sEmail) || '--'}
                              {data && data?.bIsEmailVerified ? <img className='mx-2' src={check} /> : ''}
                            </td>
                            <td>
                              {data && data?.sMobNum}
                              {data && data?.bIsMobVerified ? <img className="mx-2" src={check} /> : ''}
                            </td>
                            <td>{moment(data?.dCreatedAt)?.format('lll')}</td>
                            <td>{data?.sReferrerRewardsOn || '--'}</td>
                            <td>
                              {data?.eReferStatus === 'S' ? (<Badge className='match-status-cmp'> success </Badge>) : ('')}
                              {data?.eReferStatus === 'P' ? (<Badge className='match-status-p'> Pending </Badge>) : ('')}
                            </td>
                            <td>{data?.nReferAmount || '--'}</td>
                            <td>{data?.nReferrerAmount || '--'}</td>
                          </tr>
                        ))}
                      </Fragment>
                      )}
                </tbody>
              </table>
            </div>
          </div>
          )}

      {list?.length !== 0 && (
      <PaginationComponent
        activePageNo={activePageNo}
        endingNo={endingNo}
        listLength={listLength}
        offset={offset}
        paginationFlag={paginationFlag}
        setListLength={setListLength}
        setLoading={setLoading}
        setOffset={setOffset}
        setPageNo={setPageNo}
        setStart={setStart}
        startingNo={startingNo}
        total={total}
      />
      )}
    </Fragment>
  )
})

UserReferrals.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
  search: PropTypes.string,
  referredList: PropTypes.object,
  getList: PropTypes.func,
  flag: PropTypes.bool
}

UserReferrals.displayName = UserReferrals

export default UserReferrals
