import React, { Fragment, useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { FormGroup, Button, Input, UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useQueryState } from 'react-router-use-location-state'
import { useSelector, connect } from 'react-redux'
import qs from 'query-string'
import PropTypes from 'prop-types'

import closeIcon from '../../../../assets/images/close-icon.svg'

import AlertMessage from '../../../../components/AlertMessage'
import DataNotFound from '../../../../components/DataNotFound'
import SkeletonTable from '../../../../components/SkeletonTable'
import PaginationComponent from '../../../../components/PaginationComponent'
import { modalMessageFunc } from '../../../../helpers/helper'

const MatchLeagueCashbackList = forwardRef((props, ref) => {
  const {
    List, getList, userDebuggerPage, systemUserDebuggerPage, matchLeagueName, recommendedList
  } = props
  const navigate = useNavigate()
  const location = useLocation()
  const [start, setStart] = useState(0)
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [total, setTotal] = useState(0)
  const [show, setShow] = useState(false)
  const [list, setList] = useState([])
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [search, setSearch] = useQueryState('search', '')
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [index, setIndex] = useState(1)
  const [loading, setLoading] = useState(false)
  const [listLength, setListLength] = useState('10 Rows')
  const [close, setClose] = useState(false)
  const searchProp = props.search
  const isSendId = useSelector(state => state.users.isSendId)
  const resStatus = useSelector(state => state.matchleague.resStatus)
  const resMessage = useSelector(state => state.matchleague.resMessage)
  const previousProps = useRef({ List, resMessage, resStatus, start, offset }).current
  const paginationFlag = useRef(false)
  const [modalMessage, setModalMessage] = useState(false)
  const obj = qs.parse(location.search)

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
        setListLength(`${limit} users`)
      }
      if (obj.search) {
        setSearch(obj.search)
      }
      if ((!obj.search) && (!obj.datefrom)) {
        const startFrom = (page - 1) * offset
        setStart(startFrom)
        getList(startFrom, limit, search)
      }
    }
    setLoading(true)
  }, [])

  useEffect(() => {
    if (isSendId && recommendedList && recommendedList.length > 0 && searchProp) {
      getList(start, offset, search)
      setLoading(true)
    }
  }, [isSendId, searchProp])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (previousProps.List !== List) {
      if (List) {
        if (List.data) {
          const userArrLength = List.data.length
          const startFrom = ((activePageNo - 1) * offset) + 1
          const end = (startFrom - 1) + userArrLength
          setStartingNo(startFrom)
          setEndingNo(end)
        }
        setList(List.data ? List.data : [])
        setIndex(activePageNo)
        setTotal(List.total ? List.total : 0)
      }
      setLoading(false)
    }
    return () => {
      previousProps.List = List
    }
  }, [List])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          const startFrom = 0
          const limit = offset
          getList(startFrom, limit, search)
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

  useEffect(() => {
    const callSearchService = () => {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, props.search)
      setSearch(searchProp.trim())
      setPageNo(1)
      setLoading(true)
    }
    if (previousProps.searchProp !== searchProp && props.flag) {
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
    if ((previousProps.start !== start || previousProps.offset !== offset) && paginationFlag.current) {
      getList(start, offset, search)
      setLoading(true)
    }
    return () => {
      previousProps.start = start
      previousProps.offset = offset
    }
  }, [start, offset])

  function onRefresh () {
    const startFrom = 0
    const limit = offset
    getList(startFrom, limit, search)
    setLoading(true)
    setPageNo(1)
  }

  useImperativeHandle(ref, () => ({
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
      {
      !loading && list?.length === 0
        ? (
          <>
            <div className='match-cashback'>
              <DataNotFound message="Match League Cashback list" obj={obj}/>
            </div>
          </>
          )
        : (
          <div className='table-represent'>
            <div className="table-responsive">
              <div className="d-flex justify-content-between mb-3 fdc-480">
                <FormGroup>
                  <UncontrolledDropdown>
                    <DropdownToggle caret className='searchList' nav>
                      <Input
                        autoComplete="off"
                        className='search-box'
                        name='search'
                        onChange={(e) => {
                          props.handleRecommendedSearch(e, e.target.value)
                          props.handleChangeSearch(e, '')
                          setShow(true)
                        }}
                        placeholder='Search'
                        type='text'
                        value={props.search || props.userSearch}
                      />
                    </DropdownToggle>
                    {(props.search || props.userSearch)
                      ? (
                        <img alt="close"
                          className='custom-close-img'
                          onClick={(e) => {
                            props.handleRecommendedSearch(e, '')
                            props.handleChangeSearch(e, '')
                          }
                }
                          src={closeIcon}
                        />
                        )
                      : ''}
                    {list?.length >= 1
                      ? (
                        <DropdownMenu className={recommendedList?.length >= 1 ? 'recommended-search-dropdown' : ''} open={show}>
                          {(recommendedList?.length >= 1)
                            ? ((typeof (props.userSearch) === 'number')
                                ? (
                                  <Fragment>
                                    {
                          recommendedList?.length > 0 && recommendedList.map((recommendedData, index1) => {
                            return (
                              <DropdownItem key={index1}
                                onClick={(e) => {
                                  props.handleChangeSearch(recommendedData.sMobNum)
                                }}
                              >
                                {recommendedData.sMobNum}
                              </DropdownItem>
                            )
                          })
                        }
                                  </Fragment>
                                  )
                                : (
                                  <Fragment>
                                    {
                          recommendedList?.length > 0 && recommendedList.map((recommendedData, index2) => {
                            return (
                              <DropdownItem key={index2}
                                onClick={(e) => {
                                  props.handleChangeSearch(e, recommendedData.sEmail)
                                }}
                              >
                                {recommendedData.sEmail}
                              </DropdownItem>
                            )
                          })
                        }
                                  </Fragment>
                                  ))
                            : (
                              <DropdownItem>
                                User not found
                              </DropdownItem>
                              )
                  }
                        </DropdownMenu>
                        )
                      : ''}
                  </UncontrolledDropdown>
                </FormGroup>
                {/* <FormGroup><Input type="search" className="search-box" name="search" placeholder="Search" value={props.search} onChange={props.handleSearch} /></FormGroup> */}
                <h3>
                  Match League :
                  {matchLeagueName || '--'}
                </h3>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Username</th>
                    <th>Cashback Amount </th>
                    <th>No of joined teams</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? <SkeletonTable numberOfColumns={5} />
                    : (
                      <Fragment>
                        {
                    list && list.length !== 0 && list.map((data, i) => {
                      return (
                        <tr key={i + 1}>
                          <td>{(((index - 1) * offset) + (i + 1))}</td>
                          <td>
                            <Button className="view" color="link" tag={Link} to={data.iUserId && data.iUserId.eType === 'U' ? { pathname: userDebuggerPage + data?.iUserId?._id, state: { goBack: 'yes' } } : { pathname: systemUserDebuggerPage + data?.iUserId._id, state: { goBack: 'yes' } }}>
                              {data.iUserId && data.iUserId.sUsername ? data.iUserId.sUsername : '-'}
                            </Button>
                          </td>
                          <td>{data.aMatchLeagueCashback && data.aMatchLeagueCashback[0] && data.aMatchLeagueCashback[0].nAmount ? data.aMatchLeagueCashback[0].nAmount : '--'}</td>
                          <td>{data.aMatchLeagueCashback && data.aMatchLeagueCashback[0] && data.aMatchLeagueCashback[0].nTeams ? data.aMatchLeagueCashback[0].nTeams : '--'}</td>
                          <td>{data.aMatchLeagueCashback && data.aMatchLeagueCashback[0] && data.aMatchLeagueCashback[0].eType ? (data.aMatchLeagueCashback[0].eType === 'B' ? 'Bonus' : data.aMatchLeagueCashback[0].eType === 'C' ? 'Cash' : '--') : '--'}</td>
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
          )}
      {/* {
        !loading && list.length === 0 &&
        (
          <div className="text-center">
            <h3>No Match League Cashback list available</h3>
          </div>
        )
      } */}
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

MatchLeagueCashbackList.propTypes = {
  List: PropTypes.object,
  getList: PropTypes.func,
  handleChangeSearch: PropTypes.func,
  handleRecommendedSearch: PropTypes.func,
  search: PropTypes.string,
  userSearch: PropTypes.string,
  flag: PropTypes.bool,
  location: PropTypes.object,
  history: PropTypes.object,
  recommendedList: PropTypes.array,
  userDebuggerPage: PropTypes.string,
  systemUserDebuggerPage: PropTypes.string,
  handleSearch: PropTypes.func,
  matchLeagueName: PropTypes.string
}

MatchLeagueCashbackList.displayName = MatchLeagueCashbackList

export default connect(null, null, null, { forwardRef: true })(MatchLeagueCashbackList)
