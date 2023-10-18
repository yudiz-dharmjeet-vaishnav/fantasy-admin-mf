import React, { useState, Fragment, useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import { useSelector, useDispatch, connect } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Button, CustomInput, Modal, ModalBody, Row, Col, ModalHeader, Input, FormGroup, Badge, Label
} from 'reactstrap'
import moment from 'moment'
import qs from 'query-string'
import { useQueryState } from 'react-router-use-location-state'
import SkeletonTable from '../../../components/SkeletonTable'
import sortIcon from '../../../assets/images/sort-icon.svg'
import editButton from '../../../assets/images/edit-pen-icon.svg'
import warningIcon from '../../../assets/images/error-warning.svg'
import checkboxIcon from '../../../assets/images/CheckBox.svg'
import calenderIcon from '../../../assets/images/calendar.svg'

import AlertMessage from '../../../components/AlertMessage'
import DataNotFound from '../../../components/DataNotFound'
import PaginationComponent from '../../../components/PaginationComponent'
import PropTypes from 'prop-types'
import DatePicker from 'react-datepicker'
import { modalMessageFunc } from '../../../helpers/helper'
import { getFormatsList } from '../../../actions/pointSystem'
import RequiredField from '../../../components/RequiredField'

const MatchManagement = forwardRef((props, ref) => {
  const {
    sportsType, getList, flag, openPicker, AddMatch, clearMatchMsg, startDate, endDate, setProviderFunc, provider, getMatchesTotalCountFunc, seasonList, getSeason, season, setSelectedSeason, setListOfSeasons, listOfSeasons, seasonInput
  } = props
  const navigate = useNavigate()
  const location = useLocation()
  const searchProp = props.search
  const searchDateProp = props.searchDate
  const [start, setStart] = useState(0)
  const [filterMatchStatus] = useQueryState('filter', '')
  const [sProvider] = useQueryState('provider', '')
  const [sFormat] = useQueryState('format', '')
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [total, setTotal] = useState(0)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [successStatusModal, setSuccessStatusModal] = useState(false)
  const [list, setList] = useState([])
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [order, setOrder] = useQueryState('order', 'desc')
  const [search, setSearch] = useQueryState('search', '')
  const [sort, setSort] = useQueryState('sortBy', 'dCreatedAt')
  // eslint-disable-next-line no-unused-vars
  const [dateFrom, setDateFrom] = useQueryState('datefrom', '')
  // eslint-disable-next-line no-unused-vars
  const [dateTo, setDateTo] = useQueryState('dateto', '')
  // const [selectedSeason, setSelectedSeason] = useState([])
  const [nameOrder, setNameOrder] = useState('asc')
  const [createdOrder, setCreatedOrder] = useState('asc')
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [index, setIndex] = useState(1)
  const [loading, setLoading] = useState(false)
  const [listLength, setListLength] = useState('10 Rows')
  const [close, setClose] = useState(false)
  const [selectDate, setselectDate] = useState(null)
  const [modalMessage, setModalMessage] = useState(false)
  const [modalWarning, setModalWarning] = useState(false)
  const toggleWarning = () => setModalWarning(!modalWarning)
  const dispatch = useDispatch()
  const toggle1 = () => setModalMessage(!modalMessage)
  const obj = qs.parse(location.search)
  const token = useSelector(state => state.auth.token)
  const adminPermission = useSelector((state) => state.auth.adminPermission)
  const matchList = useSelector(state => state.match.matchList)
  const matchesTotalCount = useSelector(state => state.match.matchesTotalCount)
  const resStatus = useSelector(state => state.match.resStatus)
  const resMessage = useSelector(state => state.match.resMessage)
  const seasonResponseList = useSelector(state => state?.season?.seasonList)
  const seasonDetails = useSelector(state => state?.season?.seasonDetails)
  const previousProps = useRef({
    start, offset, matchList, searchProp, resMessage, resStatus, searchDateProp, filterMatchStatus, startDate, endDate, sProvider, season, sFormat, matchesTotalCount, seasonResponseList, sportsType, seasonDetails
  }).current
  const paginationFlag = useRef(false)
  function onClose () {
    props.handleDatePicker(false)
  }

  useEffect(() => {
    if (JSON.stringify(previousProps.seasonResponseList) !== JSON.stringify(seasonResponseList)) {
      if (seasonResponseList) {
        const arr = [...listOfSeasons]
        if (seasonResponseList.length !== 0) {
          seasonResponseList?.results.map((seasonData) => {
            const obj = {
              value: seasonData._id,
              label: seasonData.sName
            }
            if (seasonData.sName) {
              arr.push(obj)
            }
            return arr
          })
          setListOfSeasons(arr)
        }
      }
    }
    return () => {
      previousProps.seasonResponseList = seasonResponseList
    }
  }, [seasonResponseList])

  useEffect(() => {
    if (previousProps.seasonDetails !== seasonDetails) {
      setSelectedSeason({
        value: seasonDetails?._id,
        label: seasonDetails?.sName
      })
    }

    return () => {
      previousProps.seasonDetails = seasonDetails
    }
  }, [seasonDetails])

  useEffect(() => {
    if (location.state) {
      if (location.state.message) {
        setMessage(location.state.message)
        setSuccessStatusModal(location.state.resStatus)
        setModalMessage(true)
      }
      navigate(location.pathname, { replace: true })
    }
    let page = 1
    let limit = offset
    let order = 'desc'
    let searchValue = ''
    const sortbyvalue = 'dCreatedAt'
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
      if (obj.order) {
        order = obj.order
        setOrder(order)
      }
      if (obj.search) {
        searchValue = obj.search
        setSearch(obj.search)
      }
      if (obj.iSeasonId) {
        getSeason(obj.iSeasonId)
      }
      if (!(obj.datefrom && obj.dateto)) {
        const startFrom = (page - 1) * offset
        setStart(startFrom)
        getList(startFrom, limit, sortbyvalue, order, searchValue, filterMatchStatus, startDate, endDate, sProvider, season, sFormat)
        getMatchesTotalCountFunc(searchValue, filterMatchStatus, startDate, endDate, sProvider, season, sFormat)
      }
    }
    token && dispatch(getFormatsList(sportsType.toUpperCase(), token))
    setLoading(true)
    setListOfSeasons([])
    seasonList(0, 10, '', sportsType)

    return () => {
      previousProps.sportsType = sportsType
    }
  }, [sportsType])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    localStorage.setItem('AppView', false)
  }, [location])

  useEffect(() => {
    let data = localStorage.getItem('queryParams') ? JSON.parse(localStorage.getItem('queryParams')) : {}
    !Object.keys(data)?.length
      ? data = {
        MatchManagement: location.search
      }
      : data.MatchManagement = location.search
    localStorage.setItem('queryParams', JSON.stringify(data))
  }, [location.search])

  useEffect(() => {
    if (previousProps.matchList !== matchList) {
      if (matchList) {
        if (matchList.results) {
          const userArrLength = matchList.results.length
          const startFrom = ((activePageNo - 1) * offset) + 1
          const end = (startFrom - 1) + userArrLength
          setStartingNo(startFrom)
          setEndingNo(end)
        }
        setList(matchList.results ? matchList.results : [])
        setIndex(activePageNo)
        setLoading(false)
      }
    }
    if (previousProps.matchesTotalCount !== matchesTotalCount) {
      setTotal(matchesTotalCount?.count ? matchesTotalCount.count : 0)
      setLoading(false)
    }
    return () => {
      previousProps.matchList = matchList
      previousProps.matchesTotalCount = matchesTotalCount
    }
  }, [matchList, matchesTotalCount])

  useEffect(() => {
    if (previousProps.filterMatchStatus !== filterMatchStatus) {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, search, filterMatchStatus, startDate, endDate, sProvider, season, sFormat)
      getMatchesTotalCountFunc(search, filterMatchStatus, startDate, endDate, sProvider, season, sFormat)
      setLoading(true)
      setPageNo(1)
    }
    return () => {
      previousProps.filterMatchStatus = filterMatchStatus
    }
  }, [filterMatchStatus])

  useEffect(() => {
    if (previousProps.sProvider !== sProvider) {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, search, filterMatchStatus, startDate, endDate, sProvider, season, sFormat)
      getMatchesTotalCountFunc(search, filterMatchStatus, startDate, endDate, sProvider, season, sFormat)
      setLoading(true)
      setPageNo(1)
    }
    return () => {
      previousProps.sProvider = sProvider
    }
  }, [sProvider])

  useEffect(() => {
    if (previousProps.season !== season) {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, search, filterMatchStatus, startDate, endDate, sProvider, season, sFormat)
      getMatchesTotalCountFunc(search, filterMatchStatus, startDate, endDate, sProvider, season, sFormat)
      setLoading(true)
      setPageNo(1)
    }
    return () => {
      previousProps.season = season
    }
  }, [season])

  useEffect(() => {
    if (previousProps.sFormat !== sFormat) {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, search, filterMatchStatus, startDate, endDate, sProvider, season, sFormat)
      getMatchesTotalCountFunc(search, filterMatchStatus, startDate, endDate, sProvider, season, sFormat)
      setLoading(true)
      setPageNo(1)
    }
    return () => {
      previousProps.sFormat = sFormat
    }
  }, [sFormat])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          const startFrom = 0
          const limit = offset
          getList(startFrom, limit, sort, order, search, filterMatchStatus, startDate, endDate, sProvider, season, sFormat)
          getMatchesTotalCountFunc(search, filterMatchStatus, startDate, endDate, sProvider, season, sFormat)
          setMessage(resMessage)
          setStatus(resStatus)
          setModalWarning(false)
          setModalMessage(true)
          setPageNo(1)
        } else {
          setMessage(resMessage)
          setStatus(resStatus)
          setModalWarning(false)
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
    const callSearchService = () => {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, props.search, filterMatchStatus, startDate, endDate, sProvider, season, sFormat)
      getMatchesTotalCountFunc(props.search, filterMatchStatus, startDate, endDate, sProvider, season, sFormat)
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

  useEffect(() => {
    if (previousProps.startDate !== startDate || previousProps.endDate !== endDate) {
      if (props.startDate && props.endDate) {
        const startFrom = (obj && obj.datefrom && obj.dateto && obj.page) ? (obj.page - 1) * offset : 0
        const limit = offset
        getList(startFrom, limit, sort, order, search, filterMatchStatus, props.startDate, props.endDate, sProvider, season, sFormat)
        getMatchesTotalCountFunc(search, filterMatchStatus, props.startDate, props.endDate, sProvider, season, sFormat)
        props.startDate && setDateFrom(moment(props.startDate).format('YYYY-MM-DD'))
        props.endDate && setDateTo(moment(props.endDate).format('YYYY-MM-DD'))
        if ((obj && obj.datefrom && obj.dateto && obj.page)) {
          setPageNo(obj.page)
        } else {
          setPageNo(1)
        }
        setLoading(true)
      } else if ((!props.startDate) && (!props.endDate)) {
        const startFrom = 0
        const limit = offset
        getList(startFrom, limit, sort, order, search, filterMatchStatus, props.startDate, props.endDate, sProvider, season, sFormat)
        getMatchesTotalCountFunc(search, filterMatchStatus, props.startDate, props.endDate, sProvider, season, sFormat)
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

  function onRefresh () {
    // const startFrom = 0
    // const limit = offset
    clearMatchMsg()
    getList(start, offset, sort, order, search, filterMatchStatus, startDate, endDate, sProvider, season, sFormat)
    getMatchesTotalCountFunc(search, filterMatchStatus, startDate, endDate, sProvider, season, sFormat)
    setLoading(true)
    setPageNo(activePageNo)
  }

  useImperativeHandle(ref, () => ({
    onRefresh
  }))

  useEffect(() => {
    if ((previousProps.start !== start || previousProps.offset !== offset) && paginationFlag.current && start) {
      getList(start, offset, sort, order, search, filterMatchStatus, startDate, endDate, sProvider, season, sFormat)
      setLoading(true)
    } else if (previousProps.offset !== offset) {
      getList(start, offset, sort, order, search, filterMatchStatus, startDate, endDate, sProvider, season, sFormat)
      getMatchesTotalCountFunc(search, filterMatchStatus, startDate, endDate, sProvider, season, sFormat)
      setLoading(true)
    } else if ((previousProps.start !== start || previousProps.offset !== offset) && paginationFlag.current) {
      getList(0, offset, sort, order, search, filterMatchStatus, startDate, endDate, sProvider, season, sFormat)
      setLoading(true)
    }
    return () => {
      previousProps.start = start
      previousProps.offset = offset
    }
  }, [start, offset])

  useEffect(() => {
    setListOfSeasons([])
    const callSearchService = () => {
      seasonList(0, 10, seasonInput, sportsType)
    }
    if (seasonInput) {
      if (previousProps.seasonInput !== seasonInput) {
        const debouncer = setTimeout(() => {
          callSearchService()
        }, 1000)
        return () => {
          clearTimeout(debouncer)
          previousProps.seasonInput = seasonInput
        }
      }
    }
    if (!seasonInput) {
      seasonList(0, 10, seasonInput, sportsType)
    }
    return () => {
      previousProps.seasonInput = seasonInput
    }
  }, [seasonInput])

  function onSorting (sortingBy) {
    const Order = sortingBy === 'dStartTime' ? nameOrder : createdOrder
    if (Order === 'asc') {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sortingBy, 'desc', search, filterMatchStatus, startDate, endDate, sProvider, season, sFormat)
      setOrder('desc')
      setPageNo(1)
      setLoading(true)
      if (sortingBy === 'dStartTime') {
        setNameOrder('desc')
        setSort(sortingBy)
      } else {
        setCreatedOrder('desc')
        setSort(sortingBy)
      }
    } else {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sortingBy, 'asc', search, filterMatchStatus, startDate, endDate, sProvider, season, sFormat)
      setOrder('asc')
      setPageNo(1)
      setLoading(true)
      if (sortingBy === 'dStartTime') {
        setNameOrder('asc')
        setSort(sortingBy)
      } else {
        setCreatedOrder('asc')
        setSort(sortingBy)
      }
    }
  }

  function handleSelect (e) {
    setselectDate(e)
  }

  function addMatch () {
    AddMatch(moment(selectDate).format('YYYY-MM-DD'))
    props.handleDatePicker(false)
    setLoading(true)
  }

  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
    <div className='form-control date-range-notify' onClick={onClick}>
      <img alt="calender" src={calenderIcon} />
      <Input ref={ref} className='date-input range' placeholder='DD/MM/YYYY' readOnly value={value} />
    </div>
  ))
  ExampleCustomInput.displayName = ExampleCustomInput

  return (
    < >
      {
      !loading && list?.length === 0
        ? (
          <DataNotFound message="Match" obj={obj}/>
          )
        : (
          <div className='table-represent'>
            <div className="table-responsive">
              {
            modalMessage && message && (
            <>
              {' '}
              {successStatusModal
                ? (
                  <Modal className="modal-confirm-match" isOpen={modalMessage} toggle={toggle1}>
                    <ModalBody className="text-center">
                      <img alt="check" className="info-icon" src={checkboxIcon} />
                      <h2>{message}</h2>
                    </ModalBody>
                  </Modal>
                  )

                : (
                  <AlertMessage
                    close={close}
                    message={message}
                    modalMessage={modalMessage}
                    status={status}
                  />
                  )
            }
            </>
            )
        }
              <table className="table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th> Name </th>
                    <th>Format</th>
                    <th>Status</th>
                    <th>Provider</th>
                    <th>Match Key </th>
                    <th>Season Name</th>
                    <th>
                      <span className="d-inline-block align-middle">Match Date & Time</span>
                      <Button className="sort-btn" color="link" onClick={() => onSorting('dStartDate')}><img alt="sorting" className="m-0 d-block" src={sortIcon} /></Button>
                    </th>

                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? <SkeletonTable numberOfColumns={9} />
                    : (
                      <Fragment>
                        {list && list.length !== 0 && list.map((data, i) => {
                          return (
                            <tr key={data._id}>
                              <td>{(((index - 1) * offset) + (i + 1))}</td>
                              <td>{data.sName ? data.sName : '-'}</td>
                              <td>{data.eFormat ? data.eFormat : '-'}</td>
                              <td>
                                {data.eStatus === 'I'
                                  ? (
                                    <Badge className='match-status-r '>
                                      In-Review
                                    </Badge>
                                    )
                                  : (
                                      ''
                                    )}
                                {data.eStatus === 'P'
                                  ? (
                                    <Badge className="match-status-p">
                                      Pending
                                    </Badge>
                                    )
                                  : (
                                      ''
                                    )}
                                {data.eStatus === 'U'
                                  ? (
                                    <Badge className="match-status-u">
                                      Upcoming
                                    </Badge>
                                    )
                                  : (
                                      ''
                                    )}
                                {data.eStatus === 'L'
                                  ? (
                                    <Badge className="match-status-l">
                                      Live
                                    </Badge>
                                    )
                                  : (
                                      ''
                                    )}
                                {data.eStatus === 'CMP'
                                  ? (
                                    <Badge className="match-status-cmp">
                                      Completed
                                    </Badge>
                                    )
                                  : (
                                      ''
                                    )}
                                {data.eStatus === 'CNCL'
                                  ? (
                                    <Badge className="match-status-cancl">
                                      Cancel
                                    </Badge>
                                    )
                                  : (
                                      ''
                                    )}
                              </td>
                              <td>{data.eProvider ? data.eProvider : '--'}</td>
                              <td>{data.sKey ? data.sKey : '-'}</td>
                              <td>{data.sSeasonName ? data.sSeasonName : '-'}</td>
                              <td>{moment(data.dStartDate).format('DD/MM/YYYY hh:mm A')}</td>

                              <td>
                                <ul className='action-list mb-0 d-flex'>
                                  <li>
                                    <Link className='view' color='link' to={`${props.viewLink}/${data._id}`}>
                                      <Button className='edit-btn-icon'>
                                        <img alt="View" src={editButton} />
                                      </Button>
                                    </Link>
                                  </li>
                                </ul>
                              </td>
                            </tr>
                          )
                        })
                }
                      </Fragment>
                      )
            }
                </tbody>
              </table>
            </div>
          </div>
          )
      }

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
      )
     }
      <Modal className='fetchMatchModal' isOpen={openPicker}>
        <ModalHeader toggle={onClose}>Fetch Match From Date</ModalHeader>
        <ModalBody>
          <Row className='p-3'>
            {sportsType === 'kabaddi' && <Col md='12' />}
            <Col md={12} xl={12}>
              <Label className='fetch-date-label' for='sports-select'>
                {' '}
                Select
                {' '}
                <span className="required-field">*</span>
              </Label>
              <CustomInput type="select"
                name="sportsType"
                id="sportsType"
                className="form-control"
                value={provider}
                onChange={event =>
                  setProviderFunc(event)
                }
              >
                {(sportsType !== 'csgo' && sportsType !== 'dota2') && <option className='select-sport-option' value='ENTITYSPORT'>ENTITYSPORT</option>}
                {(sportsType === 'cricket' || sportsType === 'football' || sportsType === 'kabaddi') && <option className='select-sport-option' value="ROANUZ">ROANUZ</option>}
                {(sportsType !== 'kabaddi' && sportsType !== 'hockey' && sportsType !== 'csgo' && sportsType !== 'dota2') && <option value='SPORTSRADAR'>SPORTSRADAR</option>}
                {(sportsType === 'csgo' || sportsType === 'dota2') && <option value='PANDASCORE'>PANDASCORE</option>}
              </CustomInput>
            </Col>
          </Row>
          {sportsType === 'kabaddi' && <Col md='12' />}
          {sportsType !== 'kabaddi' && !(sportsType === 'football' && provider === 'ROANUZ') && (
          <Col md='12'>
            <Row>
              <Col md={12} xl={12}>
                <FormGroup className='d-flex flex-column'>
                  <Label className='fetch-date-label' for='sports-date'>
                    {' '}
                    Select Dates
                    <RequiredField/>
                  </Label>
                  <DatePicker
                    customInput={<ExampleCustomInput />}
                    dateFormat="dd-MM-yyyy"
                    disabled={adminPermission?.MATCH === 'R'}
                    dropdownMode="select"
                    onChange={handleSelect}
                    peekNextMonth
                    placeholderText='DD/MM/YYYY'
                    selected={selectDate}
                    showMonthDropdown
                    showYearDropdown
                    value={selectDate}
                  />
                </FormGroup>
              </Col>
            </Row>
          </Col>
          )

          }

          <Row className='p-3'>
            <Col md={12} xl={12} className='mb-3 mt-3'>
              <Button className="theme-btn success-btn full-btn" data-dismiss="modal" type="button" onClick={addMatch} disabled={(sportsType !== 'kabaddi' && sportsType !== 'csgo') && !(sportsType === 'football' && provider === 'ROANUZ') && !selectDate }>Confirm</Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>

      <Modal className="modal-confirm" isOpen={modalWarning} toggle={toggleWarning}>
        <ModalBody className="text-center">
          <img alt="check" className="info-icon" src={warningIcon} />
          <h2 className='popup-modal-message'>Are you sure you want to delete it?</h2>
          <Row className="row-12">
            <Col>
              <Button className='theme-btn outline-btn-cancel full-btn-cancel' onClick={toggleWarning} type="submit">Cancel</Button>
            </Col>
            <Col>
              <Button className="theme-btn danger-btn full-btn" type="submit">Delete it</Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </>
  )
})

MatchManagement.propTypes = {
  sportsType: PropTypes.string,
  getList: PropTypes.func,
  flag: PropTypes.bool,
  openPicker: PropTypes.bool,
  AddMatch: PropTypes.func,
  clearMatchMsg: PropTypes.func,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  setProviderFunc: PropTypes.func,
  provider: PropTypes.string,
  location: PropTypes.object,
  viewLink: PropTypes.string,
  handleDatePicker: PropTypes.func,
  openDatePicker: PropTypes.bool,
  search: PropTypes.string,
  searchDate: PropTypes.string,
  history: PropTypes.object,
  getMatchesTotalCountFunc: PropTypes.func,
  value: PropTypes.string,
  onClick: PropTypes.func,
  seasonList: PropTypes.func,
  getSeason: PropTypes.func,
  filterMatchStatus: PropTypes.string,
  season: PropTypes.string,
  setSelectedSeason: PropTypes.func,
  selectedSeason: PropTypes.array,
  seasonInput: PropTypes.string,
  setListOfSeasons: PropTypes.func,
  listOfSeasons: PropTypes.array,
  setProvider: PropTypes.func

}

MatchManagement.displayName = MatchManagement

export default connect(null, null, null, { forwardRef: true })(MatchManagement)
