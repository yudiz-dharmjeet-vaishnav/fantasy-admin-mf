import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useQueryState } from 'react-router-use-location-state'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from 'reactstrap'
import qs from 'query-string'
import PropTypes from 'prop-types'

import viewIcon from '../../../assets/images/view-icon.svg'

import AlertMessage from '../../../components/AlertMessage'
import SkeletonTable from '../../../components/SkeletonTable'
import PaginationComponent from '../../../components/PaginationComponent'
import { modalMessageFunc } from '../../../helpers/helper'
import { getValidationsList } from '../../../actions/validations'

function ValidationsPage (props) {
  const {
    EditValidationLink
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
  const [sort] = useQueryState('sortBy', 'sName')
  const [order, setOrder] = useQueryState('order', 'des')
  const [search, setSearch] = useQueryState('search', '')
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [index, setIndex] = useState(1)
  const [loading, setLoading] = useState(false)
  const [listLength, setListLength] = useState('10 Rows')
  const [modalMessage, setModalMessage] = useState(false)
  const [close, setClose] = useState(false)

  const dispatch = useDispatch()
  const searchProp = props.search
  const token = useSelector(state => state.auth.token)
  const validationsList = useSelector(state => state.validations.validationsList)
  const resStatus = useSelector(state => state.validations.resStatus)
  const resMessage = useSelector(state => state.validations.resMessage)
  const previousProps = useRef({ validationsList, resMessage, resStatus, start, offset }).current
  const paginationFlag = useRef(false)

  useEffect(() => {
    if (location.state) {
      if (location.state.message) {
        setMessage(location.state.message)
        setModalMessage(true)
        setStatus(true)
      }
      navigate(location.pathname, { replace: true })
    }
    let page = 1
    let limit = offset
    let orderBy = 'dsc'
    const obj = qs.parse(location.search)
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
    dispatch(getValidationsList(startFrom, limit, sort, order, search, token))
    setLoading(true)
  }, [])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    let data = localStorage.getItem('queryParams') ? JSON.parse(localStorage.getItem('queryParams')) : {}
    !Object?.keys(data)?.length
      ? data = {
        ValidationManagement: location.search
      }
      : data.ValidationManagement = location.search
    localStorage.setItem('queryParams', JSON.stringify(data))
  }, [location.search])

  useEffect(() => {
    if (previousProps.validationsList !== validationsList) {
      if (validationsList) {
        if (validationsList.results) {
          const userArrLength = validationsList && validationsList.results.length
          const startFrom = ((activePageNo - 1) * offset) + 1
          const end = (startFrom - 1) + userArrLength
          setStartingNo(startFrom)
          setEndingNo(end)
        }
        setList(validationsList && validationsList.results)
        setIndex(activePageNo)
        setTotal(validationsList.total ? validationsList.total : 0)
      } else {
        setList([])
      }
      setLoading(false)
    }
    return () => {
      previousProps.validationsList = validationsList
    }
  }, [validationsList])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          const startFrom = 0
          const limit = offset
          dispatch(getValidationsList(startFrom, limit, sort, order, search, token))
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
      dispatch(getValidationsList(startFrom, limit, sort, order, props.search, token))
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
      dispatch(getValidationsList(start, offset, sort, order, search, token))
      setLoading(true)
    }
    return () => {
      previousProps.start = start
      previousProps.offset = offset
    }
  }, [start, offset])

  return (
    <Fragment>
      <AlertMessage
        close={close}
        message={message}
        modalMessage={modalMessage}
        status={status}
      />
      <div className='table-represent'>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>No.</th>
                <th>Name</th>
                <th>Short Name</th>
                <th>Min Value</th>
                <th>Max Value</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? <SkeletonTable numberOfColumns={6} />
                : (
                  <Fragment>
                    {
                    list && list.length !== 0 && list.map((data, i) => (
                      <tr key={data._id}>
                        <td>{(((index - 1) * offset) + (i + 1))}</td>
                        <td>{data.sName ? data.sName : '-'}</td>
                        <td>{data.sKey ? data.sKey : '-'}</td>
                        <td>{data.nMin ? data.nMin : '-'}</td>
                        <td>{data.nMax ? data.nMax : '-'}</td>
                        <td>
                          <ul className="action-list mb-0 d-flex">
                            <li>
                              <Button className="view" color="link" tag={Link} to={`${EditValidationLink}/${data._id}`}>
                                <img alt="View" src={viewIcon} />
                                View
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
      {
        !loading && !list &&
        (
          <div className="text-center">
            <h3>No Validations available</h3>
          </div>
        )
      }
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
    </Fragment>
  )
}

ValidationsPage.propTypes = {
  EditValidationLink: PropTypes.string,
  search: PropTypes.string,
  location: PropTypes.object,
  history: PropTypes.object,
  flag: PropTypes.bool
}

export default ValidationsPage
