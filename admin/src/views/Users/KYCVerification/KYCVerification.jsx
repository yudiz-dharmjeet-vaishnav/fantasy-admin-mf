import React, { Fragment, useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import { Button } from 'reactstrap'
import { useQueryState } from 'react-router-use-location-state'
import { useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export'
import moment from 'moment'
import qs from 'query-string'
import PropTypes from 'prop-types'

import editButton from '../../../assets/images/edit-pen-icon.svg'

import Loading from '../../../components/Loading'
import AlertMessage from '../../../components/AlertMessage'
import DataNotFound from '../../../components/DataNotFound'
import SkeletonTable from '../../../components/SkeletonTable'
import PaginationComponent from '../../../components/PaginationComponent'

import { modalMessageFunc } from '../../../helpers/helper'

const KYCVerification = forwardRef((props, ref) => {
  const {
    getList, viewUser, flag, kycList, startDate, endDate, recommendedList, pendingKycCount, getPendingKycCountFunc, dateFlag
  } = props
  const navigate = useNavigate()
  const location = useLocation()
  const exporter = useRef(null)
  const [start, setStart] = useState(0)
  const [list, setList] = useState([])
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [total, setTotal] = useState(0)
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [panStatus] = useQueryState('panstatus', '')
  const [aadhaarStatus] = useQueryState('aadhaarstatus', '')
  const [index, setIndex] = useState(1)
  const [close, setClose] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loader, setLoader] = useState(false)
  const [listLength, setListLength] = useState('10 Rows')
  const [isFullResponse] = useState(false)
  const [fullList, setFullList] = useState([])
  // eslint-disable-next-line no-unused-vars
  const [dateFrom, setDateFrom] = useQueryState('datefrom', '')
  // eslint-disable-next-line no-unused-vars
  const [dateTo, setDateTo] = useQueryState('dateto', '')
  const searchProp = props.search
  const resStatus = useSelector(state => state.kyc.resStatus)
  const resMessage = useSelector(state => state.kyc.resMessage)
  const isFullList = useSelector(state => state.kyc.isFullResponse)
  const isSendId = useSelector(state => state.users.isSendId)
  const obj = qs.parse(location.search)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const previousProps = useRef({
    pendingKycCount, searchProp, resMessage, resStatus, kycList, start, offset, startDate, endDate, panStatus, aadhaarStatus
  }).current
  const paginationFlag = useRef(false)
  const [modalMessage, setModalMessage] = useState(false)

  // handle call initial query params data set and call api
  useEffect(() => {
    if (location.state) {
      if (location.state.message) {
        setMessage(location.state.message)
        setStatus(true)
        setModalMessage(true)
      }
      navigate(location.pathname, { replace: true })
    }
    let page = 1
    let limit = offset
    if (obj) {
      if (obj.page) {
        page = obj.page
        setPageNo(page)
      }
      if (obj.pageSize) {
        limit = obj.pageSize
        setOffset(limit)
        setListLength(`${limit} Rows`)
      }
      if (!obj.search) {
        const startFrom = (page - 1) * offset
        setStart(startFrom)
        getList(startFrom, limit, searchProp, obj.datefrom ? new Date(obj.datefrom) : startDate, obj.dateto ? new Date(obj.dateto) : endDate, panStatus, aadhaarStatus, isFullResponse)
        getPendingKycCountFunc(panStatus, aadhaarStatus)
      }
    }
    setLoading(true)
  }, [])

  useEffect(() => {
    if (isSendId && recommendedList && recommendedList.length > 0 && searchProp) {
      getList(start, offset, searchProp, startDate, endDate, panStatus, aadhaarStatus, isFullResponse)
      getPendingKycCountFunc(panStatus, aadhaarStatus)
      setLoading(true)
    }
  }, [isSendId, searchProp])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  // handle to set Kyc list and export report
  useEffect(() => {
    if (previousProps.kycList !== kycList) {
      if (kycList && !isFullList) {
        if (kycList.data) {
          const userArrLength = kycList.data.length
          const startFrom = ((activePageNo - 1) * offset) + 1
          const end = (startFrom - 1) + userArrLength
          setStartingNo(startFrom)
          setEndingNo(end)
        }
        setList(kycList.data ? kycList.data : [])
        setIndex(activePageNo)
        setTotal(kycList.total ? kycList.total : 0)
      } else if (kycList?.total === kycList?.data?.length && isFullList) {
        setFullList(kycList.data ? kycList.data : [])
        setLoading(false)
        exporter.current.props = {
          ...exporter.current.props,
          data: processExcelExportData(kycList.data ? kycList.data : []),
          fileName: 'KycVerifications.xlsx'
        }
        exporter.current.save()
        setLoader(false)
      }
      setLoading(false)
    }
    return () => {
      previousProps.kycList = kycList
    }
  }, [kycList])

  // will be called when something searched
  useEffect(() => {
    const callSearchService = () => {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, props.search, startDate, endDate, panStatus, aadhaarStatus, isFullResponse)
      getPendingKycCountFunc(panStatus, aadhaarStatus)
      setStart(startFrom)
      setPageNo(1)
      setLoading(true)
    }
    if (previousProps.searchProp !== searchProp && flag) {
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

  // handle will be call when startDate and endDate change
  useEffect(() => {
    if (previousProps.startDate !== startDate || previousProps.endDate !== endDate) {
      if (props.startDate && props.endDate && dateFlag.current) {
        const startFrom = (obj && obj.datefrom && obj.dateto && obj.page) ? (obj.page - 1) * offset : 0
        const limit = offset
        getList(startFrom, limit, searchProp, props.startDate, props.endDate, panStatus, aadhaarStatus, isFullResponse)
        getPendingKycCountFunc(panStatus, aadhaarStatus)
        setDateFrom(moment(props.startDate).format('MM-DD-YYYY'))
        setDateTo(moment(props.endDate).format('MM-DD-YYYY'))
        if ((obj && obj.datefrom && obj.dateto && obj.page)) {
          setPageNo(obj.page)
        } else {
          setPageNo(1)
        }
        setLoading(true)
      } else if ((!props.startDate) && (!props.endDate)) {
        const startFrom = 0
        const limit = offset
        getList(startFrom, limit, searchProp, props.startDate, props.endDate, panStatus, aadhaarStatus, isFullResponse)
        getPendingKycCountFunc(panStatus, aadhaarStatus)
        setDateFrom('')
        setDateTo('')
        setPageNo(1)
        setLoading(true)
      }
    }
    return () => {
      previousProps.startDate = startDate
      previousProps.endDate = endDate
    }
  }, [startDate, endDate])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          const startFrom = 0
          const limit = offset
          getList(startFrom, limit, searchProp, startDate, endDate, panStatus, aadhaarStatus, isFullResponse)
          getPendingKycCountFunc(panStatus, aadhaarStatus)
          setMessage(resMessage)
          setStatus(resStatus)
          setModalMessage(true)
          setPageNo(1)
        } else {
          setMessage(resMessage)
          setStatus(resStatus)
          setModalMessage(true)
          setLoading(false)
          setLoader(false)
        }
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  // handle to set panStatus and aadhaarStatus
  useEffect(() => {
    if (previousProps.panStatus !== panStatus || previousProps.aadhaarStatus !== aadhaarStatus) {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, searchProp, startDate, endDate, panStatus, aadhaarStatus, isFullResponse)
      getPendingKycCountFunc(panStatus, aadhaarStatus)
      setPageNo(1)
    }
    return () => {
      previousProps.panStatus = panStatus
      previousProps.aadhaarStatus = aadhaarStatus
    }
  }, [panStatus, aadhaarStatus])

  useEffect(() => {
    if ((previousProps.start !== start || previousProps.offset !== offset) && paginationFlag.current) {
      getList(start, offset, searchProp, startDate, endDate, panStatus, aadhaarStatus, isFullResponse)
      getPendingKycCountFunc(panStatus, aadhaarStatus)
      setLoading(true)
    }
    return () => {
      previousProps.start = start
      previousProps.offset = offset
    }
  }, [start, offset])

  const processExcelExportData = (data) =>
    data.map((kycVerificationList) => {
      const sUsername = kycVerificationList?.iUserId?.sUsername ? kycVerificationList?.iUserId?.sUsername : '--'
      let panCreatedAt = kycVerificationList.oPan && kycVerificationList.oPan.dCreatedAt ? kycVerificationList.oPan.dCreatedAt : ''
      let panStatus = kycVerificationList.oPan && kycVerificationList.oPan.eStatus
      let aadhaarCreatedAt = kycVerificationList.oAadhaar && kycVerificationList.oAadhaar.dCreatedAt ? kycVerificationList.oAadhaar.dCreatedAt : ''
      let aadhaarStatus = kycVerificationList.oAadhaar && kycVerificationList.oAadhaar.eStatus
      panCreatedAt = panCreatedAt ? moment(panCreatedAt).local().format('lll') : '-'
      panStatus = panStatus === 'P' ? 'Pending' : panStatus === 'A' ? 'Accepted' : panStatus === 'R' ? 'Rejected' : panStatus === 'N' ? 'Not uploaded' : '--'
      aadhaarCreatedAt = aadhaarCreatedAt ? moment(aadhaarCreatedAt).local().format('lll') : '-'
      aadhaarStatus = aadhaarStatus === 'P' ? 'Pending' : aadhaarStatus === 'A' ? 'Accepted' : aadhaarStatus === 'R' ? 'Rejected' : aadhaarStatus === 'N' ? 'Not uploaded' : '--'

      return {
        ...kycVerificationList,
        sUsername,
        oPan: {
          ...kycVerificationList.oPan,
          dCreatedAt: panCreatedAt,
          eStatus: panStatus
        },
        oAadhaar: {
          ...kycVerificationList.oAadhaar,
          dCreatedAt: aadhaarCreatedAt,
          eStatus: aadhaarStatus
        }
      }
    })

  async function onExport () {
    if (startDate && endDate) {
      await getList(start, offset, searchProp, startDate, endDate, panStatus, aadhaarStatus, true)
      setLoader(true)
    } else {
      setMessage('Please Select Date Range')
      setModalMessage(true)
      setStatus(false)
    }
  }

  useImperativeHandle(ref, () => ({
    onExport,
    onRefresh
  }))

  function onRefresh () {
    // const startFrom = 0
    getList(start, offset, searchProp, startDate, endDate, panStatus, aadhaarStatus, isFullResponse)
    getPendingKycCountFunc(panStatus, aadhaarStatus)
    setLoading(true)
    setPageNo(activePageNo)
  }

  return (
    <Fragment>
      <AlertMessage
        close={close}
        message={message}
        modalMessage={modalMessage}
        status={status}
      />
      <ExcelExport ref={exporter} data={fullList && fullList.length > 0 ? fullList : list} fileName='KycVerifications.xlsx'>
        <ExcelExportColumn field='iUserId.sUsername' title='Username' />
        <ExcelExportColumn field='oPan.dCreatedAt' title='Pan Submitted Date' />
        <ExcelExportColumn field='oPan.eStatus' title='Pan Verification Status' />
        <ExcelExportColumn field='oAadhaar.dCreatedAt' title='Aadhaar Submitted Date' />
        <ExcelExportColumn field='oAadhaar.eStatus' title='Aadhaar Verification Status' />
      </ExcelExport>
      {loader && <Loading />}
      {
      !loading && list?.length === 0
        ? (
          <DataNotFound message="Kyc" obj={obj}/>
          )
        : (
          <div className='table-represent'>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Username</th>
                    <th>Pan Submitted Date</th>
                    <th>PAN Card Status</th>
                    <th>Aadhaar Submitted Date</th>
                    <th> Aadhaar Card Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? <SkeletonTable numberOfColumns={7} />
                    : (
                      <Fragment>
                        {
                  list && list.length !== 0 &&
                    list.map((data, i) => (
                      <tr key={data._id}>
                        <td>{(((index - 1) * offset) + (i + 1))}</td>
                        <td>{data.iUserId && data.iUserId.sUsername ? data.iUserId.sUsername : '--'}</td>
                        <td>{data.oPan && data.oPan.dCreatedAt ? moment(data.oPan.dCreatedAt).format('DD/MM/YYYY hh:mm A') : '--'}</td>
                        <td>{data.oPan.eStatus === 'P' ? 'Pending' : data.oPan.eStatus === 'A' ? 'Accepted' : data.oPan.eStatus === 'R' ? 'Rejected' : 'Not Uploaded'}</td>
                        <td>{data.oAadhaar && data.oAadhaar.dCreatedAt ? moment(data.oAadhaar.dCreatedAt).format('DD/MM/YYYY hh:mm A') : '--'}</td>
                        <td>{data.oAadhaar.eStatus === 'P' ? 'Pending' : data.oAadhaar.eStatus === 'A' ? 'Accepted' : data.oAadhaar.eStatus === 'R' ? 'Rejected' : 'Not Uploaded'}</td>
                        <td>
                          <ul className="action-list mb-0 d-flex">
                            <li>
                              <Button className="view" color="link" disabled={(!data.iUserId) || (adminPermission?.USERS === 'N')} tag={Link} to={`${viewUser}/${data.iUserId && data.iUserId._id ? data.iUserId._id : ''}`}>
                                <Button className='edit-btn-icon'>
                                  <img alt="View" src={editButton} />
                                </Button>
                              </Button>
                            </li>
                          </ul>
                        </td>
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

KYCVerification.propTypes = {
  getList: PropTypes.func,
  viewUser: PropTypes.string,
  flag: PropTypes.bool,
  search: PropTypes.string,
  location: PropTypes.object,
  history: PropTypes.object,
  kycList: PropTypes.arrayOf(PropTypes.object),
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  openDatePicker: PropTypes.bool,
  recommendedList: PropTypes.arrayOf(PropTypes.object),
  pendingKycCount: PropTypes.object,
  getPendingKycCountFunc: PropTypes.func,
  dateFlag: PropTypes.bool
}

KYCVerification.displayName = KYCVerification

export default KYCVerification
