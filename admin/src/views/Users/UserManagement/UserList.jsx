import React, { Fragment, useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { Button, CustomInput, Modal, ModalBody, Row, Col } from 'reactstrap'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useQueryState } from 'react-router-use-location-state'
import { useDispatch, useSelector } from 'react-redux'
import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export'
import moment from 'moment'
import qs from 'query-string'
import PropTypes from 'prop-types'

import sortIcon from '../../../assets/images/sort-icon.svg'
import editButton from '../../../assets/images/edit-pen-icon.svg'
import viewButton from '../../../assets/images/view-eye.svg'
import debugButton from '../../../assets/images/carbon-debug.svg'
import verify from '../../../assets/images/verify.svg'
import warningIcon from '../../../assets/images/error-warning.svg'

import Loading from '../../../components/Loading'
import SkeletonTable from '../../../components/SkeletonTable'
import PaginationComponent from '../../../components/PaginationComponent'
import AlertMessage from '../../../components/AlertMessage'
import DataNotFound from '../../../components/DataNotFound'
import { modalMessageFunc } from '../../../helpers/helper'
import { updateUserDetails } from '../../../actions/users'

const UserList = forwardRef((props, ref) => {
  const { List, resStatus, resMessage, getList, flag, startDate, endDate, filter, getUsersTotalCountFunc, usersTotalCount, getDeletedUsers, setSearchProp, setFilter, setinitialFlag, setDateRange } = props
  const location = useLocation()
  const exporter = useRef(null)
  const dispatch = useDispatch()
  const searchProp = props.search
  const [isFullResponse] = useState(false)
  const [fullList, setFullList] = useState([])
  const [loading, setLoading] = useState(false)
  const [loader, setLoader] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [total, setTotal] = useState(0)
  const [index, setIndex] = useState(1)
  const [list, setList] = useState([])
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  // eslint-disable-next-line no-unused-vars
  const [dateFrom, setDateFrom] = useQueryState('datefrom', '')
  // eslint-disable-next-line no-unused-vars
  const [dateTo, setDateTo] = useQueryState('dateto', '')
  const [filterBy, setFilterBy] = useQueryState('filterBy', '')
  const [order, setOrder] = useQueryState('order', 'desc')
  const [start, setStart] = useState(0)
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [sort] = useQueryState('sortBy', 'dCreatedAt')
  const [search, setSearch] = useQueryState('searchvalue', '')
  const [listLength, setListLength] = useState('10 Rows')
  const [close, setClose] = useState(false)
  const [selectedData, setSelectedData] = useState({})
  const [type, setType] = useState('')
  const [modalMessage, setModalMessage] = useState(false)
  const isFullList = useSelector(state => state.users.isFullResponse)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const token = useSelector(state => state.auth.token)
  const [modalWarning, setModalWarning] = useState(false)
  const toggleWarning = () => setModalWarning(!modalWarning)
  const obj = qs.parse(location.search)
  const deletedUsers = location.pathname.includes('deleted-users')
  const previousProps = useRef({
    List,
    resStatus,
    resMessage,
    startDate,
    endDate,
    activePageNo,
    start,
    offset,
    filter,
    deletedUsers
  }).current
  const paginationFlag = useRef(false)
  const navigate = useNavigate()

  // useEffect to set Query Param form url and also set Message from navigate
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
    let searchText = ''
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
      if (obj.searchvalue) {
        searchText = obj.searchvalue
        setSearch(obj.searchvalue)
      }
      if (!(obj.datefrom && obj.dateto)) {
        const startFrom = (page - 1) * offset
        setStart(startFrom)
        if (deletedUsers) {
          getDeletedUsers(startFrom, limit, sort, order, searchText, filterBy, startDate, endDate, isFullResponse)
        } else {
          getList(startFrom, limit, sort, order, searchText, filterBy, startDate, endDate, isFullResponse)
          getUsersTotalCountFunc(searchText, filterBy, startDate, endDate)
        }
      }
    }
    setLoading(true)
  }, [])

  //  handle to set deletedUsers
  useEffect(() => {
    if (previousProps.deletedUsers !== deletedUsers) {
      if (deletedUsers) {
        getDeletedUsers(0, 10, 'dCreatedAt', 'desc', '', filterBy, '', '', isFullResponse)
      } else {
        getList(0, 10, 'dCreatedAt', 'desc', '', filterBy, '', '', isFullResponse)
        getUsersTotalCountFunc('', filterBy, '', '')
      }

      setSearchProp('')
      setFilter('')
      setinitialFlag(false)
      setDateRange([null, null])
      setLoading(true)
    }

    return () => {
      previousProps.deletedUsers = deletedUsers
    }
  }, [deletedUsers])

  // will be called when something searched
  useEffect(() => {
    const callSearchService = () => {
      const startFrom = 0
      const limit = offset
      if (deletedUsers) {
        getDeletedUsers(startFrom, limit, sort, order, props.search, filterBy, startDate, endDate, isFullResponse)
      } else {
        getList(startFrom, limit, sort, order, props.search, filterBy, startDate, endDate, isFullResponse)
        getUsersTotalCountFunc(props.search, filterBy, startDate, endDate)
      }
      setSearch(searchProp.trim())
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

  // handle to set filter
  useEffect(() => {
    if (previousProps.filter !== filter) {
      if (filter === 'EMAIL_VERIFIED' || filter === 'MOBILE_VERIFIED' || filter === 'INTERNAL_ACCOUNT' || filter === '') {
        const startFrom = 0
        const limit = offset
        if (deletedUsers) {
          getDeletedUsers(startFrom, limit, sort, order, props.search, props.filter, startDate, endDate, isFullResponse)
        } else {
          getList(startFrom, limit, sort, order, props.search, props.filter, startDate, endDate, isFullResponse)
          getUsersTotalCountFunc(search, props.filter, startDate, endDate)
        }
        setFilterBy(props.filter)
        setStart(startFrom)
        setPageNo(1)
        setLoading(true)
      }
    }
    return () => {
      previousProps.filter = filter
    }
  }, [filter])

  // handle to set startDate and EndDate
  useEffect(() => {
    if (previousProps.startDate !== startDate || previousProps.endDate !== endDate) {
      if (props.startDate && props.endDate) {
        const startFrom = (obj && obj.datefrom && obj.dateto && obj.page) ? (obj.page - 1) * offset : 0
        const limit = offset
        if (deletedUsers) {
          getDeletedUsers(startFrom, limit, sort, order, search, filterBy, props.startDate, props.endDate, isFullResponse)
        } else {
          getList(startFrom, limit, sort, order, search, filterBy, props.startDate, props.endDate, isFullResponse)
          getUsersTotalCountFunc(search, filterBy, startDate, endDate)
        }
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
        if (deletedUsers) {
          getDeletedUsers(startFrom, limit, sort, order, search, filterBy, props.startDate, props.endDate, isFullResponse)
        } else {
          getList(startFrom, limit, sort, order, search, filterBy, props.startDate, props.endDate, isFullResponse)
          getUsersTotalCountFunc(search, filterBy, startDate, endDate)
        }
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

  // set timeout to remove pop up success/error message after given interval
  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  // handle to set user List
  useEffect(() => {
    if (previousProps.List !== List) {
      if (List && List.results && !isFullList) {
        const userArrLength = List.results.length
        const startFrom = (activePageNo - 1) * offset + 1
        const end = startFrom - 1 + userArrLength
        setStartingNo(startFrom)
        setEndingNo(end)
        setList(List.results)
        setIndex(activePageNo)
        setLoading(false)
      } else if (isFullList) {
        setFullList(List.results ? List.results : [])
        setLoading(false)
        exporter.current.props = {
          ...exporter.current.props,
          data: processExcelExportData(List.results ? List.results : []),
          fileName: 'Users.xlsx'
        }
        exporter.current.save()
        setLoader(false)
      }
    }
    if (!deletedUsers) {
      if (previousProps.usersTotalCount !== usersTotalCount && usersTotalCount) {
        setTotal(usersTotalCount?.count ? usersTotalCount.count : 0)
      }
    } else {
      setTotal(List?.count)
    }
    return () => {
      previousProps.List = List
      previousProps.usersTotalCount = usersTotalCount
    }
  }, [List, usersTotalCount])

  // handle to set resMessage
  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          const startFrom = 0
          const limit = offset
          if (deletedUsers) {
            getDeletedUsers(startFrom, limit, sort, order, search, filterBy, startDate, endDate, isFullResponse)
          } else {
            getList(startFrom, limit, sort, order, search, filterBy, startDate, endDate, isFullResponse)
            getUsersTotalCountFunc(search, filterBy, startDate, endDate)
          }
          setMessage(resMessage)
          setStatus(resStatus)
          setModalMessage(true)
          setPageNo(1)
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

  // useEffect to handle QueryParams
  useEffect(() => {
    let data = localStorage.getItem('queryParams')
      ? JSON.parse(localStorage.getItem('queryParams'))
      : {}
    !Object.keys(data).length
      ? (data = {
          UserManagement: location.search
        })
      : (data.UserManagement = location.search)
    localStorage.setItem('queryParams', JSON.stringify(data))
  }, [location.search])

  // will be called when page changes occurred
  useEffect(() => {
    if ((previousProps.start !== start || previousProps.offset !== offset) && paginationFlag.current && start) {
      if (deletedUsers) {
        getDeletedUsers(start, offset, sort, order, search, filterBy, startDate, endDate, isFullResponse)
      } else {
        getList(start, offset, sort, order, search, filterBy, startDate, endDate, isFullResponse)
      }
      setLoading(true)
    } else if (previousProps.offset !== offset) {
      if (deletedUsers) {
        getDeletedUsers(start, offset, sort, order, search, filterBy, startDate, endDate, isFullResponse)
      } else {
        getList(start, offset, sort, order, search, filterBy, startDate, endDate, isFullResponse)
        getUsersTotalCountFunc(search, filterBy, startDate, endDate)
      }
      setLoading(true)
    } else if (((previousProps.start !== start || previousProps.offset !== offset) && paginationFlag.current)) {
      if (deletedUsers) {
        getDeletedUsers(0, offset, sort, order, search, filterBy, startDate, endDate, isFullResponse)
      } else {
        getList(0, offset, sort, order, search, filterBy, startDate, endDate, isFullResponse)
      }
      setLoading(true)
    }
    return () => {
      previousProps.start = start
      previousProps.offset = offset
    }
  }, [start, offset])

  // function use for listing sorting
  function onSorting (sortingBy) {
    if (order === 'desc') {
      const start = 0
      const limit = offset
      if (deletedUsers) {
        getDeletedUsers(start, limit, sortingBy, 'asc', search, filterBy, startDate, endDate, isFullResponse)
      } else {
        getList(start, limit, sortingBy, 'asc', search, filterBy, startDate, endDate, isFullResponse)
      }
      setOrder('asc')
      setPageNo(1)
      setLoading(true)
    } else {
      const start = 0
      const limit = offset
      if (deletedUsers) {
        getDeletedUsers(start, limit, sortingBy, 'desc', search, filterBy, startDate, endDate, isFullResponse)
      } else {
        getList(start, limit, sortingBy, 'desc', search, filterBy, startDate, endDate, isFullResponse)
      }
      setOrder('desc')
      setPageNo(1)
      setLoading(true)
    }
  }

  function warningWithConfirmMessage (data, eType) {
    setType(eType)
    setSelectedData(data)
    setModalWarning(true)
  }

  // function status and dispatch updateUseDetails
  function onStatusUpdate () {
    const statuss = selectedData.eStatus === 'Y' ? 'N' : 'Y'
    const updatedUsersData = {
      userAccount: selectedData.bIsInternalAccount,
      fullname: selectedData.sName,
      email: selectedData.sEmail,
      MobNum: selectedData.sMobNum,
      userName: selectedData.sUsername,
      ID: selectedData._id,
      userStatus: statuss,
      token
    }
    dispatch(updateUserDetails(updatedUsersData))
    setLoading(true)
    toggleWarning()
    setSelectedData({})
  }

  // export list
  const processExcelExportData = (data) =>
    data.map((userList) => {
      const sName = userList.sName ? userList.sName : '-'
      let dCreatedAt = moment(userList.dCreatedAt).local().format('lll')
      dCreatedAt = dCreatedAt === 'Invalid date' ? ' - ' : dCreatedAt
      const ePlatform = userList.ePlatform ? (userList.ePlatform === 'I' ? 'iOS' : userList.ePlatform === 'W' ? 'Web' : userList.ePlatform === 'A' ? 'Android' : '-') : '-'
      let dDeletedAt = moment(userList.dDeletedAt).local().format('lll')
      dDeletedAt = dDeletedAt === 'Invalid date' ? ' - ' : dDeletedAt

      return {
        ...userList,
        dCreatedAt,
        sName,
        ePlatform,
        dDeletedAt
      }
    })

  async function onExport () {
    if (startDate && endDate) {
      if (deletedUsers) {
        await getDeletedUsers(start, offset, sort, order, search, filterBy, startDate, endDate, true)
      } else {
        await getList(start, offset, sort, order, search, filterBy, startDate, endDate, true)
        await getUsersTotalCountFunc(search, filterBy, startDate, endDate)
      }
      setLoader(true)
    } else {
      setMessage('Please Select Date Range')
      setModalMessage(true)
      setStatus(false)
    }
  }

  function onRefresh () {
    // const startFrom = 0
    if (deletedUsers) {
      getDeletedUsers(start, offset, sort, order, search, filterBy, startDate, endDate, isFullResponse)
    } else {
      getList(start, offset, sort, order, search, filterBy, startDate, endDate, isFullResponse)
      getUsersTotalCountFunc(search, filterBy, startDate, endDate)
    }
    setLoading(true)
    setPageNo(activePageNo)
  }

  useImperativeHandle(ref, () => ({
    onExport,
    onRefresh
  }))

  return (
    <Fragment>
      <AlertMessage
        close={close}
        message={message}
        modalMessage={modalMessage}
        status={status}
      />
      <ExcelExport ref={exporter} data={fullList && fullList.length > 0 ? fullList : list} fileName='Users.xlsx'>
        {!deletedUsers &&
          <ExcelExportColumn field='sName' title='Name' />
        }
        <ExcelExportColumn field='sUsername' title='Username' />
        <ExcelExportColumn field='sEmail' title='Email' />
        <ExcelExportColumn field='sMobNum' title='Mobile No.' />
        <ExcelExportColumn field='ePlatform' title='Platform' />
        <ExcelExportColumn field='dCreatedAt' title='Registration Date' />
        {deletedUsers && (
          <>
            <ExcelExportColumn field='dDeletedAt' title='Deletion Date' />
            <ExcelExportColumn field='sReason' title='Deletion Reason' />
          </>
        )}
      </ExcelExport>
      {loader && <Loading />}
      {
      !loading && list?.length === 0
        ? (
          <DataNotFound message="User List" obj={obj}/>
          )
        : (
          <div className='table-represent'>
            <div className='table-responsive'>
              <table className='table'>
                <thead>
                  <tr>
                    <th>No.</th>
                    {!deletedUsers &&
                    <th>Status</th>
              }
                    <th>Username</th>
                    <th>Email</th>
                    <th>Mobile No.</th>
                    <th>Platform</th>
                    <th>
                      Last Login Time
                    </th>
                    <th>
                      Registration Date
                      <Button
                        className='sort-btn'
                        color='link'
                        onClick={() => onSorting('dCreatedAt')}
                      >
                        <img alt='sorting' className='m-0 d-block' src={sortIcon} />
                      </Button>
                    </th>

                    {deletedUsers && (
                    <th>
                      Deletion Date
                      <Button
                        className='sort-btn'
                        color='link'
                        onClick={() => onSorting('dDeletedAt')}
                      >
                        <img alt='sorting' className='m-0 d-block' src={sortIcon} />
                      </Button>
                    </th>
                    )}
                    {deletedUsers &&
                    <th>Deletion Reason</th>
              }
                    <th>Actions</th>
                    <th>User Debugger</th>
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? <SkeletonTable numberOfColumns={deletedUsers ? 10 : 10} />
                    : (
                      <Fragment>
                        {
                    list && list.length !== 0 && list.map((data, i) => (
                      <tr key={data._id}>
                        <td>{(((index - 1) * offset) + (i + 1))}</td>
                        {!deletedUsers && (
                          <td className="success-text">
                            <CustomInput
                              key={`${data._id}`}
                              checked={data.eStatus === 'Y'}
                              disabled={adminPermission.USERS === 'R'
                              }
                              id={`${data._id}`}
                              name={`${data._id}`}
                              onClick={() =>
                                warningWithConfirmMessage(
                                  data,
                                  data.eStatus === 'Y' ? 'Inactivate' : 'Activate'
                                )
                              }
                              type='switch'
                            />
                          </td>
                        )}
                        <td>
                          {data && data.sUsername}
                          {data.bIsInternalAccount ? <b className='account-text'>(Internal)</b> : ''}
                        </td>
                        <td>
                          {data.sEmail || '--'}
                          {data && data.sEmail && data.bIsEmailVerified ? <img className='mx-2' src={verify} /> : ''}
                        </td>
                        <td>
                          {data && data.sMobNum}
                          {data && data.bIsMobVerified ? <img className="mx-2" src={verify} /> : ''}
                        </td>
                        <td>{data?.ePlatform === 'A' ? 'Android' : data?.ePlatform === 'I' ? 'iOS' : data?.ePlatform === 'W' ? 'Web' : '--'}</td>
                        <td>
                          { data?.dLoginAt ? moment(data?.dLoginAt).format('DD/MM/YYYY hh:mm A') : '--'}
                        </td>
                        <td>{moment(data?.dCreatedAt).format('DD/MM/YYYY hh:mm A')}</td>
                        {deletedUsers && <td>{moment(data.dDeletedAt).format('DD/MM/YYYY hh:mm A')}</td>}
                        {deletedUsers &&
                          <td>{data.sReason || '-'}</td>
                        }
                        <td>
                          <ul className="action-list mb-0 d-flex">
                            <li>
                              <Button className="view" color="link" onClick={() => navigate(`${props.viewLink}/${data?._id}`, { userList: !deletedUsers, deletedUsersList: deletedUsers })}>
                                <Button className={location?.pathname?.includes('deleted-users') ? 'view-btn-icon' : 'edit-btn-icon'}>
                                  <img alt="View" src={location?.pathname?.includes('deleted-users') ? viewButton : editButton} />
                                </Button>
                              </Button>
                            </li>
                          </ul>
                        </td>
                        <td>
                          <ul className="action-list mb-0 d-flex">
                            <li>
                              <Link className="view" color="link" state= {{ userList: !deletedUsers, deletedUsersList: deletedUsers } } to={{ pathname: `/users/user-management/user-debugger-page/${data._id}` }}>
                                <Button className='debug-btn-icon'>
                                  <img alt="debug" src={debugButton} />
                                </Button>
                              </Link>
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
              <Button
                className='theme-btn outline-btn-cancel full-btn-cancel'
                onClick={toggleWarning}
                type='submit'
              >
                Cancel
              </Button>
            </Col>
            <Col>
              <Button
                className='theme-btn danger-btn full-btn'
                onClick={onStatusUpdate}
                type='submit'
              >
                {`${type} Now`}
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </Fragment>
  )
})

UserList.propTypes = {
  location: PropTypes.object,
  openPicker: PropTypes.bool,
  search: PropTypes.string,
  List: PropTypes.object,
  resStatus: PropTypes.bool,
  resMessage: PropTypes.string,
  getList: PropTypes.func,
  flag: PropTypes.bool,
  startDate: PropTypes.object,
  endDate: PropTypes.object,
  viewLink: PropTypes.string,
  searchBox: PropTypes.string,
  history: PropTypes.object,
  filter: PropTypes.string,
  getUsersTotalCountFunc: PropTypes.func,
  usersTotalCount: PropTypes.object,
  onRefresh: PropTypes.func,
  getDeletedUsers: PropTypes.func,
  setSearchProp: PropTypes.func,
  setFilter: PropTypes.func,
  setinitialFlag: PropTypes.func,
  setDateRange: PropTypes.func
}

UserList.displayName = UserList

export default UserList
