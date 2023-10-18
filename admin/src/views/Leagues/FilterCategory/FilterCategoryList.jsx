import React, { Fragment, useEffect, useState, useRef } from 'react'
import { Button, Modal, ModalBody, Row, Col } from 'reactstrap'
import { useQueryState } from 'react-router-use-location-state'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import qs from 'query-string'
import PropTypes from 'prop-types'

import editButton from '../../../assets/images/edit-pen-icon.svg'
import deleteButton from '../../../assets/images/delete-bin-icon.svg'
import warningIcon from '../../../assets/images/error-warning.svg'

import AlertMessage from '../../../components/AlertMessage'
import DataNotFound from '../../../components/DataNotFound'
import SkeletonTable from '../../../components/SkeletonTable'
import PaginationComponent from '../../../components/PaginationComponent'
import { modalMessageFunc } from '../../../helpers/helper'
import { deleteFilterCategory } from '../../../actions/leaguecategory'

function FilterCategoryList (props) {
  const {
    List, getList
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
  const [order, setOrder] = useQueryState('order', 'des')
  const [search, setSearch] = useQueryState('search', '')
  const [sort, setSort] = useQueryState('sortBy', 'dCreatedAt')
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [type, setType] = useState('')
  const [deleteId, setDeleteId] = useState('')
  const [index, setIndex] = useState(1)
  const [close, setClose] = useState(false)
  const [loading, setLoading] = useState(false)
  const [listLength, setListLength] = useState('10 Rows')
  const [modalWarning, setModalWarning] = useState(false)
  const toggleWarning = () => setModalWarning(!modalWarning)

  const Auth = useSelector(
    (state) => state.auth.adminData && state.auth.adminData.eType
  )
  const adminPermission = useSelector((state) => state.auth.adminPermission)
  const searchProp = props.search
  const resStatus = useSelector(state => state.leaguecategory.resStatus)
  const resMessage = useSelector(state => state.leaguecategory.resMessage)
  const isDeleted = useSelector(state => state.leaguecategory.isDeleted)
  const token = useSelector((state) => state.auth.token)
  const previousProps = useRef({ List, resMessage, resStatus, start, offset, isDeleted }).current
  const paginationFlag = useRef(false)
  const obj = qs.parse(location.search)

  const [modalMessage, setModalMessage] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    setSort('dCreatedAt')
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
    let orders = 'dsc'
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
        orders = obj.order
        setOrder(orders)
      }
    }
    const startFrom = (page - 1) * offset
    setStart(startFrom)
    getList(startFrom, limit, sort, order, search)
    setLoading(true)
  }, [])

  // set timeout to remove pop up success/error message after given interval
  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  // to handle query params
  useEffect(() => {
    let data = localStorage.getItem('queryParams') ? JSON.parse(localStorage.getItem('queryParams')) : {}
    data === {}
      ? data = {
        FilterCategory: location.search
      }
      : data.FilterCategory = location.search
    localStorage.setItem('queryParams', JSON.stringify(data))
  }, [location.search])

  // to set filterCategoryList
  useEffect(() => {
    if (previousProps.List !== List) {
      if (List) {
        if (List.results) {
          const userArrLength = List.results.length
          const startFrom = ((activePageNo - 1) * offset) + 1
          const end = (startFrom - 1) + userArrLength
          setStartingNo(startFrom)
          setEndingNo(end)
        }
        setList(List.results ? List.results : [])
        setIndex(activePageNo)
        setTotal(List.total ? List.total : 0)
      }
      setLoading(false)
    }
    return () => {
      previousProps.List = List
    }
  }, [List])

  // to handle response
  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          const startFrom = 0
          const limit = offset
          getList(startFrom, limit, sort, order, search)
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
    if (previousProps.isDeleted !== isDeleted) {
      if (isDeleted) {
        toggleWarning()
        const startFrom = 0
        const limit = offset
        getList(startFrom, limit, sort, order, search)
      }
    }
    return () => {
      previousProps.isDeleted = isDeleted
    }
  }, [isDeleted])

  // will be called when something searched
  useEffect(() => {
    const callSearchService = () => {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, props.search)
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

  // will be called when page changes occurred
  useEffect(() => {
    if ((previousProps.start !== start || previousProps.offset !== offset) && paginationFlag.current) {
      getList(start, offset, sort, order, props.search)
      setLoading(true)
    }
    return () => {
      previousProps.start = start
      previousProps.offset = offset
    }
  }, [start, offset])

  function warningWithDeleteMessage (Id, eType) {
    setType(eType)
    setModalWarning(true)
    setDeleteId(Id)
  }

  function onCancel () {
    toggleWarning()
    setDeleteId('')
  }

  function onDelete () {
    dispatch(deleteFilterCategory(deleteId, token))
    setLoading(true)
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
          <DataNotFound message="Filter Category" obj={obj}/>
          )
        : (
          <div className='table-represent'>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th> No. </th>
                    <th> Title </th>
                    <th> Remark </th>
                    <th> Actions  </th>
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? <SkeletonTable numberOfColumns={4} />
                    : (
                      <Fragment>
                        {
                    list && list.length !== 0 && list.map((data, i) => {
                      return (
                        <tr key={data._id}>
                          <td>{(((index - 1) * offset) + (i + 1))}</td>
                          <td>
                            {' '}
                            {data.sTitle}
                            {' '}
                          </td>
                          <td>
                            {data.sRemark ? data.sRemark : ' - '}
                            {' '}
                          </td>
                          <td>
                            <ul className="action-list mb-0 d-flex filter-view">
                              <li className='action-btn'>
                                <Button className='edit-btn-icon' color="link" tag={Link} to={`${props.updateLeague}/${data._id}`}>
                                  <span><img alt="View" src={editButton} /></span>
                                </Button>
                              </li>
                              {((Auth && Auth === 'SUPER') ||
                                (adminPermission?.LEAGUE !== 'R')) && (
                                <li>
                                  <Button className='delete-btn-icon' color='link' onClick={() => warningWithDeleteMessage(data._id, 'delete')}>
                                    <span><img alt="Delete" src={deleteButton} /></span>
                                  </Button>
                                </li>
                              )}
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
      <Modal className='modal-confirm' isOpen={modalWarning} toggle={toggleWarning}>
        <ModalBody className='text-center'>
          <img alt='check' className='info-icon' src={warningIcon} />
          <h2 className='popup-modal-message'>{`Are you sure you want to ${type} it?`}</h2>
          <Row className='row-12'>
            <Col>
              <Button
                className="theme-btn outline-btn-cancel full-btn-cancel"
                onClick={deleteId ? onCancel : toggleWarning}
                type='submit'
              >
                Cancel
              </Button>
            </Col>
            <Col>
              <Button
                className='theme-btn danger-btn full-btn'
                onClick={deleteId && onDelete}
                type='submit'
              >
                {' '}
                {deleteId ? 'Delete It' : `${type} It`}
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

FilterCategoryList.propTypes = {
  List: PropTypes.object,
  getList: PropTypes.func,
  search: PropTypes.string,
  location: PropTypes.object,
  history: PropTypes.arrayOf(PropTypes.object),
  flag: PropTypes.bool,
  updateLeague: PropTypes.string
}

export default FilterCategoryList
