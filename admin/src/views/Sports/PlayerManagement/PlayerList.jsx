import React, { Fragment, useEffect, useState, useRef } from 'react'
import { Button, Modal, ModalBody, Row, Col } from 'reactstrap'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useQueryState } from 'react-router-use-location-state'
import { useSelector, useDispatch } from 'react-redux'
import qs from 'query-string'
import PropTypes from 'prop-types'

import NoImage from '../../../assets/images/no-image-1.svg'
import sortIcon from '../../../assets/images/sort-icon.svg'
import editButton from '../../../assets/images/edit-pen-icon.svg'
import warningIcon from '../../../assets/images/error-warning.svg'

import AlertMessage from '../../../components/AlertMessage'
import DataNotFound from '../../../components/DataNotFound'
import SkeletonTable from '../../../components/SkeletonTable'
import PaginationComponent from '../../../components/PaginationComponent'
import { modalMessageFunc } from '../../../helpers/helper'
import { getUrl } from '../../../actions/url'

function PlayerList (props) {
  const {
    sportsType, getList, EditPlayerLink, getPlayersTotalCountFunc, provider
  } = props
  const navigate = useNavigate()
  const location = useLocation()
  const [start, setStart] = useState(0)
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [total, setTotal] = useState(0)
  const [list, setList] = useState([])
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [order, setOrder] = useQueryState('order', 'dsc')
  const [nameOrder, setNameOrder] = useState('asc')
  const [createdOrder, setCreatedOrder] = useState('asc')
  const [search, setSearch] = useQueryState('search', '')
  const [sort, setSort] = useQueryState('sortBy', 'dCreatedAt')
  const [url, setUrl] = useState('')
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [index, setIndex] = useState(1)
  const [close, setClose] = useState(false)
  const [loading, setLoading] = useState(false)
  const [listLength, setListLength] = useState('10 Rows')
  const searchProp = props.search

  const dispatch = useDispatch()
  const playerList = useSelector(state => state.player.playersList)
  const playersTotalCount = useSelector(state => state.player.playersTotalCount)
  const resStatus = useSelector(state => state.team.resStatus)
  const getUrlLink = useSelector(state => state.url.getUrl)
  const resMessage = useSelector(state => state.team.resMessage)
  const previousProps = useRef({ playerList, resMessage, resStatus, provider, start, offset, playersTotalCount }).current
  const paginationFlag = useRef(false)

  const [modalMessage, setModalMessage] = useState(false)
  const [modalWarning, setModalWarning] = useState(false)
  const toggleWarning = () => setModalWarning(!modalWarning)
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
    let order = 'dsc'

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
    }
    dispatch(getUrl('media'))
    const startFrom = (page - 1) * offset
    setStart(startFrom)
    getList(startFrom, limit, sort, order, search, provider)
    getPlayersTotalCountFunc(search, provider)
    setLoading(true)
  }, [sportsType])

  useEffect(() => {
    if (getUrlLink) {
      setUrl(getUrlLink)
    }
  }, [getUrlLink])

  useEffect(() => {
    if (previousProps.playerList !== playerList) {
      if (playerList) {
        if (playerList.results) {
          const userArrLength = playerList.results.length
          const startFrom = ((activePageNo - 1) * offset) + 1
          const end = (startFrom - 1) + userArrLength
          setStartingNo(startFrom)
          setEndingNo(end)
        }
        setList(playerList.results ? playerList.results : [])
        setIndex(activePageNo)
        setLoading(false)
      }
    }
    if (previousProps.playersTotalCount !== playersTotalCount && playersTotalCount) {
      setTotal(playersTotalCount?.count ? playersTotalCount?.count : 0)
    }
    return () => {
      previousProps.playerList = playerList
      previousProps.playersTotalCount = playersTotalCount
    }
  }, [playerList, playersTotalCount])

  useEffect(() => {
    let data = localStorage.getItem('queryParams') ? JSON.parse(localStorage.getItem('queryParams')) : []
    data === {}
      ? data = {
        PlayerManagement: location.search
      }
      : data.PlayerManagement = location.search
    localStorage.setItem('queryParams', JSON.stringify(data))
  }, [location.search])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          const startFrom = 0
          const limit = offset
          getList(startFrom, limit, sort, order, search, provider)
          getPlayersTotalCountFunc(search, provider)
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
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (previousProps.provider !== provider) {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, search, provider)
      getPlayersTotalCountFunc(search, provider)
      setLoading(true)
      setPageNo(1)
    }
    return () => {
      previousProps.provider = provider
    }
  }, [provider])

  useEffect(() => {
    const callSearchService = () => {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, props.search, provider)
      getPlayersTotalCountFunc(props.search, provider)
      setSearch(searchProp.trim())
      setStart(startFrom)
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
    if ((previousProps.start !== start || previousProps.offset !== offset) && paginationFlag.current && start) {
      getList(start, offset, sort, order, search, provider)
      setLoading(true)
    } else if (previousProps.offset !== offset) {
      getList(start, offset, sort, order, search, provider)
      getPlayersTotalCountFunc(search, provider)
      setLoading(true)
    } else if (((previousProps.start !== start || previousProps.offset !== offset) && paginationFlag.current)) {
      getList(0, offset, sort, order, search, provider)
      setLoading(true)
    }
    return () => {
      previousProps.start = start
      previousProps.offset = offset
    }
  }, [start, offset])

  function onSorting (sortingBy) {
    const Order = sortingBy === 'sName' ? nameOrder : createdOrder
    if (Order === 'asc') {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sortingBy, 'desc', search, provider)
      setOrder('desc')
      setPageNo(1)
      setLoading(true)
      if (sortingBy === 'sName') {
        setNameOrder('desc')
        setSort(sortingBy)
      } else {
        setCreatedOrder('desc')
        setSort(sortingBy)
      }
    } else {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sortingBy, 'asc', search, provider)
      setOrder('asc')
      setPageNo(1)
      setLoading(true)
      if (sortingBy === 'sName') {
        setNameOrder('asc')
        setSort(sortingBy)
      } else {
        setCreatedOrder('asc')
        setSort(sortingBy)
      }
    }
  }

  return (
    <Fragment>
      {
      !loading && list?.length === 0
        ? (
          <DataNotFound message="Players" obj={obj}/>
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
              <table className="table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Player Image</th>
                    <th className='table_sortIcon'>
                      <ul>
                        <li>
                          <span className="d-inline-block align-middle">Player Name</span>
                          <Button className="sort-btn" color="link" onClick={() => onSorting('sName')}><img alt="sorting" className="m-0 d-block" src={sortIcon} /></Button>
                        </li>

                      </ul>
                    </th>
                    <th>Player Key</th>
                    <th>Provider </th>
                    <th>Credits</th>
                    <th>Player Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? <SkeletonTable numberOfColumns={8} />
                    : (
                      <Fragment>
                        {
                    list && list.length !== 0 && list.map((data, i) => {
                      return (
                        <Fragment key={data._id}>
                          <tr key={data._id}>
                            <td>{(((index - 1) * offset) + (i + 1))}</td>
                            <td>{data?.sImage ? <img alt="No Image" className="theme-image" src={url + data.sImage} width="56px"/> : <img alt='No Image' src={NoImage} />}</td>
                            <td >{data?.sName ? data?.sName : '--'}</td>
                            <td>{data?.sKey}</td>
                            <td>{data?.eProvider ? data?.eProvider : '--'}</td>
                            <td>{data?.nFantasyCredit ? data?.nFantasyCredit : ' - '}</td>
                            <td>{data?.eRole}</td>
                            <td>
                              <ul className="action-list mb-0 d-flex">
                                <li>
                                  <Button className="view" color="link" tag={Link} to={`${EditPlayerLink}/${data._id}`}>
                                    <Button className='edit-btn-icon'>
                                      <img alt="View" src={editButton} />
                                    </Button>
                                  </Button>
                                </li>
                              </ul>
                            </td>
                          </tr>
                        </Fragment>
                      )
                    })}
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
        <ModalBody className="text-center">
          <img alt="check" className="info-icon" src={warningIcon} />
          <h2 className='popup-modal-message'>Are you sure you want to delete it?</h2>
          <Row className="row-12">
            <Col>
              <Button className='theme-btn outline-btn-cancel full-btn-cancel' onClick={toggleWarning} type="submit">Cancel</Button>
            </Col>
            <Col>
              <Button className="theme-btn danger-btn full-btn" type="submit">Delete It</Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

PlayerList.propTypes = {
  sportsType: PropTypes.string,
  getList: PropTypes.func,
  EditPlayerLink: PropTypes.string,
  search: PropTypes.string,
  location: PropTypes.object,
  history: PropTypes.object,
  flag: PropTypes.bool,
  provider: PropTypes.string,
  getPlayersTotalCountFunc: PropTypes.func
}

export default PlayerList
