
import React, { Fragment, useRef, useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import { useSelector, connect, useDispatch } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button, CustomInput, Modal, ModalBody, Row, Col } from 'reactstrap'
import { useQueryState } from 'react-router-use-location-state'
import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export'
import qs from 'query-string'
import PropTypes from 'prop-types'

import sortIcon from '../../assets/images/sort-icon.svg'
import warningIcon from '../../assets/images/error-warning.svg'
import editIcon from '../../assets/images/edit-pen-icon.svg'

import AlertMessage from '../../components/AlertMessage'
import DataNotFound from '../../components/DataNotFound'
import SkeletonTable from '../../components/SkeletonTable'
import PaginationComponent from '../../components/PaginationComponent'

import { modalMessageFunc } from '../../helpers/helper'
import { updateSubadmin } from '../../actions/subadmin'
import moment from 'moment'

const SubAdminContent = forwardRef((props, ref) => {
  const {
    editLink, getList, List, startDate, endDate
  } = props

  const navigate = useNavigate()
  const location = useLocation()
  const exporter = useRef(null)
  const dispatch = useDispatch()
  const [start, setStart] = useState(0)
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [total, setTotal] = useState(0)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState([])
  const [exportFlag, setExportFlag] = useState(false)
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [order, setOrder] = useQueryState('order', 'desc')
  const [search, setSearch] = useQueryState('search', '')
  const [dateFrom, setDateFrom] = useQueryState('datefrom', '')
  const [dateTo, setDateTo] = useQueryState('dateto', '')
  const [sort] = useQueryState('sortBy', 'dCreatedAt')
  const [close, setClose] = useState(false)
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [index, setIndex] = useState(1)
  const [listLength, setListLength] = useState('10 Rows')
  const [selectedData, setSelectedData] = useState({})
  const [type, setType] = useState('')
  const [modalWarning, setModalWarning] = useState(false)
  const [modalMessage, setModalMessage] = useState(false)
  const toggleWarning = () => setModalWarning(!modalWarning)
  const searchProp = props?.search
  const obj = qs.parse(location?.search)
  const token = useSelector(state => state?.auth?.token)
  const adminPermission = useSelector(state => state?.auth?.adminPermission)
  const resStatus = useSelector(state => state?.subadmin?.resStatus)
  const resMessage = useSelector(state => state?.subadmin?.resMessage)
  const previousProps = useRef({
    resMessage, resStatus, List, start, offset, startDate, endDate
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
    let order = 'dsc'
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
      if (obj?.order) {
        order = obj?.order
        setOrder(order)
      }
    }
    const startFrom = (page - 1) * offset
    setStart(startFrom)
    getList(startFrom, limit, sort, order, search, dateFrom, dateTo)
    setLoading(true)
  }, [])

  useEffect(() => {
    let data = localStorage?.getItem('queryParams') ? JSON?.parse(localStorage?.getItem('queryParams')) : {}
    !Object?.keys(data)?.length
      ? data = {
        SubAdminManagement: location?.search
      }
      : data.SubAdminManagement = location?.search
    localStorage?.setItem('queryParams', JSON?.stringify(data))
  }, [location?.search])

  // set timeout to remove pop up success/error message after given interval
  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  //  set sub-admin list
  useEffect(() => {
    if (previousProps?.List !== List) {
      if (List) {
        if (List?.results) {
          const userArrLength = List?.results?.length
          const startFrom = ((activePageNo - 1) * offset) + 1
          const end = (startFrom - 1) + userArrLength
          setStartingNo(startFrom)
          setEndingNo(end)
        }
        setList(List?.results ? List?.results : [])
        setIndex(activePageNo)
        setTotal(List?.total ? List?.total : 0)
        if (exportFlag) {
          exporter.current.props = {
            ...exporter.current.props,
            data: processExcelExportData(List.results ? List.results : []),
            fileName: 'SubAdmins.xlsx'
          }
          exporter.current.save()
          setExportFlag(false)
        }
      }
      setLoading(false)
    }
    return () => {
      previousProps.List = List
    }
  }, [List])

  // to handle response
  useEffect(() => {
    if (previousProps?.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          const startFrom = (activePageNo - 1) * offset
          const limit = offset
          getList(startFrom, limit, sort, order, search, dateFrom, dateTo)
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

  // will be called when something searched
  useEffect(() => {
    const callSearchService = () => {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, props.search, dateFrom, dateTo)
      setSearch(searchProp?.trim())
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

  function onSorting (sortingBy) {
    if (order === 'asc') {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sortingBy, 'desc', search, dateFrom, dateTo)
      setOrder('desc')
      setPageNo(1)
      setLoading(true)
    } else {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sortingBy, 'asc', search, dateFrom, dateTo)
      setOrder('asc')
      setPageNo(1)
      setLoading(true)
    }
  }

  useEffect(() => {
    if ((previousProps?.start !== start || previousProps?.offset !== offset) && paginationFlag?.current) {
      getList(start, offset, sort, order, search, dateFrom, dateTo)
      setLoading(true)
    }
    return () => {
      previousProps.start = start
      previousProps.offset = offset
    }
  }, [start, offset])

  function warningWithConfirmMessage (data, eType) {
    setType(eType)
    setSelectedData(data)
    setModalWarning(true)
  }

  // update status from list and dispatch action
  function onStatusUpdate () {
    const subAdminstatus = selectedData?.eStatus === 'Y' ? 'B' : 'Y'
    const updatedSubAdminData = {
      fullname: selectedData?.sName,
      username: selectedData?.sUsername,
      email: selectedData?.sEmail,
      MobNum: selectedData?.sMobNum,
      aRole: selectedData?.aRole,
      subAdminStatus: subAdminstatus,
      token,
      ID: selectedData?._id
    }
    dispatch(updateSubadmin(updatedSubAdminData))
    setLoading(true)
    toggleWarning()
    setSelectedData({})
  }

  // Export Excel Report List
  const processExcelExportData = data => data?.map((subAdminList) => {
    let eStatus = subAdminList?.eStatus
    eStatus = eStatus === 'Y' ? 'Active' : 'InActive'

    return {
      ...subAdminList,
      eStatus
    }
  })

  async function onExport () {
    if (startDate && endDate) {
      setExportFlag(true)
      await getList(start, offset, sort, order, search, dateFrom, dateTo)
    } else {
      setMessage('Please Select Date Range')
      setModalMessage(true)
      setStatus(false)
    }
  }

  useEffect(() => {
    if (previousProps.startDate !== startDate || previousProps.endDate !== endDate) {
      if (startDate && endDate) {
        const startFrom = (obj && obj.datefrom && obj.dateto && obj.page) ? (obj.page - 1) * offset : 0
        const limit = offset
        getList(start, limit, sort, order, search, startDate, endDate)
        setDateFrom(moment(startDate).format('MM-DD-YYYY'))
        setDateTo(moment(endDate).format('MM-DD-YYYY'))
        setStart(startFrom)
        if ((obj && obj.datefrom && obj.dateto && obj.page)) {
          setPageNo(obj.page)
        } else {
          setPageNo(1)
        }
        setLoading(true)
      } else if ((!props.startDate) && (!props.endDate)) {
        const startFrom = 0
        const limit = offset
        getList(startFrom, limit, sort, order, search, startDate, endDate)
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

  useImperativeHandle(ref, () => ({
    onExport
  }))

  return (
    <Fragment>
      {
      !loading && list?.length === 0
        ? (
          <DataNotFound message="data" obj={obj}/>
          )
        : (
          <div className='table-represent'>
            <div className="table-responsive">

              <AlertMessage
                close={close}
                message={message}
                modalMessage={modalMessage}
                status={status}
              />

              <ExcelExport ref={exporter} data={list} fileName="SubAdmins.xlsx" >
                <ExcelExportColumn field="sUsername" title="Username" />
                <ExcelExportColumn field="sEmail" title="Email" />
                <ExcelExportColumn field="sMobNum" title="Mobile No" />
                <ExcelExportColumn field="sName" title="Name" />
                <ExcelExportColumn field="eStatus" title="Status" />
              </ExcelExport>

              <table className="table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Status</th>
                    <th>Username</th>
                    <th className='table_sortIcon'>
                      <span className="d-inline-block align-middle">Full Name</span>
                      <Button className="sort-btn" color="link" onClick={() => onSorting('sName')}><img alt="sorting" className="m-0 d-block" src={sortIcon} /></Button>
                    </th>
                    <th>Email</th>
                    <th>Mobile No.</th>
                    <th>Last Login Time</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? <SkeletonTable numberOfColumns={8} />
                    : (
                      <Fragment>
                        {
                   list?.length !== 0 && list.map((data, i) => (
                     <tr key={data?._id}>
                       <td>{(((index - 1) * offset) + (i + 1))}</td>
                       <td>
                         <CustomInput
                           key={`${data?._id}`}
                           checked={data?.eStatus === 'Y'}
                           disabled={adminPermission?.SUBADMIN === 'R'}
                           id={`${data?._id}`}
                           name={`${data?._id}`}
                           onClick={() => warningWithConfirmMessage(data, data?.eStatus === 'Y' ? 'Block' : 'Activate')}
                           type='switch'
                         />
                       </td>
                       <td>{data?.sUsername || '--'}</td>
                       <td>{data?.sName || '--'}</td>
                       <td>{data?.sEmail || '--'}</td>
                       <td>{data?.sMobNum || '--'}</td>
                       <td>{data?.dLoginAt ? moment(data?.dLoginAt)?.format('DD/MM/YYYY hh:mm A') : '--'}</td>
                       <td>
                         <ul className="action-list mb-0 d-flex">
                           <li>
                             <Button className='edit-btn-icon' color="link" tag={Link} to={`${editLink}/${data?._id}`}>
                               <span><img alt="View" src={editIcon} /></span>
                             </Button>
                           </li>
                         </ul>
                       </td>
                     </tr>
                   ))
                }
                      </Fragment>
                      )
            }
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

      <Modal className="modal-confirm" isOpen={modalWarning} toggle={toggleWarning}>
        <ModalBody className='text-center'>
          <img alt='check' className='info-icon' src={warningIcon} />
          <h2 className='popup-modal-message'>{`Are you sure you want to ${type} it?`}</h2>
          <Row className='row-12'>
            <Col>
              <Button className="theme-btn outline-btn-cancel full-btn-cancel" onClick={toggleWarning} type='submit'>Cancel</Button>
            </Col>
            <Col>
              <Button className='theme-btn danger-btn full-btn' onClick={onStatusUpdate} type='submit'>{`${type} It`}</Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>

    </Fragment>
  )
})

SubAdminContent.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
  match: PropTypes.object,
  search: PropTypes.string,
  flag: PropTypes.bool,
  getList: PropTypes.func,
  List: PropTypes.object,
  editLink: PropTypes.string,
  startDate: PropTypes.string,
  endDate: PropTypes.string
}

SubAdminContent.displayName = SubAdminContent

export default connect(null, null, null, { forwardRef: true })(SubAdminContent)
