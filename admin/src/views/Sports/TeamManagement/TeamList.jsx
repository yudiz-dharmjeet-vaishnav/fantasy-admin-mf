import React, { Fragment, useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useQueryState } from 'react-router-use-location-state'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Modal, ModalBody, Row, Col, CustomInput } from 'reactstrap'
import qs from 'query-string'
import PropTypes from 'prop-types'

import sortIcon from '../../../assets/images/sort-icon.svg'
import NoImage from '../../../assets/images/no-image-1.svg'
import editButton from '../../../assets/images/edit-pen-icon.svg'
import warningIcon from '../../../assets/images/error-warning.svg'

import AlertMessage from '../../../components/AlertMessage'
import DataNotFound from '../../../components/DataNotFound'
import { modalMessageFunc } from '../../../helpers/helper'
import SkeletonTable from '../../../components/SkeletonTable'
import PaginationComponent from '../../../components/PaginationComponent'
import { getUrl } from '../../../actions/url'
import { updateTeam } from '../../../actions/team'

function TeamList (props) {
  const {
    sportsType, getList, flag, EditPlayerLink, getTeamsTotalCountFunc, token, provider
  } = props
  const navigate = useNavigate()
  const location = useLocation()
  const [start, setStart] = useState(0)
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [total, setTotal] = useState(0)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [list, setList] = useState([])
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [order, setOrder] = useQueryState('order', 'desc')
  const [nameOrder, setNameOrder] = useState('asc')
  const [createdOrder, setCreatedOrder] = useState('asc')
  const [search, setSearch] = useQueryState('search', '')
  const [sort, setSort] = useQueryState('sortBy', 'dCreatedAt')
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [index, setIndex] = useState(1)
  const [loading, setLoading] = useState(false)
  const [listLength, setListLength] = useState('10 Rows')
  const [selectedData, setSelectedData] = useState({})
  const [type, setType] = useState('')
  const [url, setUrl] = useState('')

  const dispatch = useDispatch()
  const searchProp = props.search
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const teamsTotalCount = useSelector(state => state.team.teamsTotalCount)
  const teamList = useSelector(state => state.team.teamList)
  const resStatus = useSelector(state => state.team.resStatus)
  const getUrlLink = useSelector(state => state.url.getUrl)
  const resMessage = useSelector(state => state.team.resMessage)
  const previousProps = useRef({ teamList, resMessage, resStatus, getUrlLink, provider, start, offset, teamsTotalCount }).current
  const [close, setClose] = useState(false)
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
    dispatch(getUrl('media'))
    let page = 1
    let limit = offset
    let orderBy = 'desc'
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
        orderBy = obj.order
        setOrder(orderBy)
      }
    }
    const startFrom = (page - 1) * offset
    setStart(startFrom)
    getList(startFrom, limit, sort, orderBy, search, provider)
    getTeamsTotalCountFunc(search, provider)
    setLoading(true)
  }, [sportsType])

  useEffect(() => {
    if (getUrlLink) {
      setUrl(getUrlLink)
    }
  }, [getUrlLink])

  useEffect(() => {
    if (modalMessage) {
      setTimeout(() => {
        setModalMessage(false)
      }, 2000)
    }
  }, [modalMessage])

  useEffect(() => {
    let data = localStorage.getItem('queryParams') ? JSON.parse(localStorage.getItem('queryParams')) : {}
    data === {}
      ? data = {
        TeamManagement: location.search
      }
      : data.TeamManagement = location.search
    localStorage.setItem('queryParams', JSON.stringify(data))
  }, [location.search])

  useEffect(() => {
    if (previousProps.teamList !== teamList) {
      if (teamList) {
        if (teamList.results) {
          const userArrLength = teamList.results.length
          const startFrom = ((activePageNo - 1) * offset) + 1
          const end = (startFrom - 1) + userArrLength
          setStartingNo(startFrom)
          setEndingNo(end)
        }
        setList(teamList.results ? teamList.results : [])
        setIndex(activePageNo)
        setLoading(false)
      }
    }
    if (previousProps.teamsTotalCount !== teamsTotalCount && teamsTotalCount) {
      setTotal(teamsTotalCount?.count ? teamsTotalCount?.count : 0)
      setLoading(false)
    }
    return () => {
      previousProps.teamList = teamList
      previousProps.teamsTotalCount = teamsTotalCount
    }
  }, [teamList, teamsTotalCount])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          const startFrom = 0
          const limit = offset
          getList(startFrom, limit, sort, order, search, provider)
          getTeamsTotalCountFunc(search, provider)
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
      getList(startFrom, limit, sort, order, props.search, provider)
      getTeamsTotalCountFunc(props.search, provider)
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
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (previousProps.provider !== provider) {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, search, provider)
      getTeamsTotalCountFunc(search, provider)
      setLoading(true)
      setPageNo(1)
    }
    return () => {
      previousProps.provider = provider
    }
  }, [provider])

  useEffect(() => {
    if (((previousProps.start !== start || previousProps.offset !== offset) && paginationFlag.current) && start) {
      getList(start, offset, sort, order, search, provider)
      setLoading(true)
    } else if (previousProps.offset !== offset) {
      getList(start, offset, sort, order, search, provider)
      getTeamsTotalCountFunc(search, provider)
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

  function warningWithConfirmMessage (data, eType) {
    setType(eType)
    setSelectedData(data)
    setModalWarning(true)
  }

  function onStatusUpdate () {
    const statuss = selectedData.eStatus === 'Y' ? 'N' : 'Y'
    const updateTeamData = {
      Id: selectedData._id,
      sportsType,
      sKey: selectedData.sKey,
      sName: selectedData.sName,
      sImage: selectedData.sImage,
      sShortName: selectedData.sShortName,
      teamStatus: statuss,
      token
    }
    dispatch(updateTeam(updateTeamData))
    setLoading(true)
    toggleWarning()
    setSelectedData({})
  }

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
          <DataNotFound message="Team" obj={obj}/>
          )
        : (
          <div className='table-represent'>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Status</th>
                    <th>Image</th>
                    <th className='table_sortIcon'>
                      <ul>
                        <li>
                          Team
                          <Button className="sort-btn" color="link" onClick={() => onSorting('sName')}><img alt="sorting" className="m-0 d-block" src={sortIcon} /></Button>
                        </li>
                      </ul>
                    </th>
                    <th>Short Name</th>
                    <th>
                      <div>Provider</div>

                    </th>
                    <th>Key</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? <SkeletonTable numberOfColumns={8} />
                    : (
                      <Fragment>
                        {
                    list && list.length !== 0 && list.map((data, i) => (
                      <tr key={data._id}>
                        <td>{(((index - 1) * offset) + (i + 1))}</td>
                        <td className="success-text">
                          <CustomInput
                            key={`${data._id}`}
                            checked={data.eStatus === 'Y'}
                            disabled={adminPermission?.TEAM === 'R'}
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
                        <td>{data.sImage ? <img alt="No Image" className="theme-image" src={url + data.sImage} /> : <img alt='No Image' src={NoImage} />}</td>
                        <td>{data.sName ? data.sName : '-'}</td>
                        <td>{data.sShortName ? data.sShortName : '-'}</td>
                        <td>{data.eProvider ? data.eProvider : '--'}</td>
                        <td>{data.sKey ? data.sKey : '-'}</td>

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
        <ModalBody className="text-center">
          <img alt="check" className="info-icon" src={warningIcon} />
          <h2 className='popup-modal-message'>Are you sure you want to delete it?</h2>
          <Row className="row-12">
            <Col>
              <Button
                className='theme-btn outline-btn-cancel full-btn-cancel'
                onClick={toggleWarning}
                type="submit"
              >
                Cancel
              </Button>
            </Col>
            <Col>
              <Button
                className="theme-btn danger-btn full-btn"
                type="submit"
              >
                Delete It
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>

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
                {`${type} It`}
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

TeamList.propTypes = {
  sportsType: PropTypes.string,
  getList: PropTypes.func,
  flag: PropTypes.bool,
  EditPlayerLink: PropTypes.string,
  search: PropTypes.string,
  location: PropTypes.object,
  history: PropTypes.object,
  getTeamsTotalCountFunc: PropTypes.func,
  token: PropTypes.string,
  provider: PropTypes.string,
  setProvider: PropTypes.func
}

export default TeamList
