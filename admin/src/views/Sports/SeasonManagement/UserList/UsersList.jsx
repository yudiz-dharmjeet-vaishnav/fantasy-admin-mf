import React, { useState, Fragment, useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export'
import { useSelector, connect, useDispatch } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useQueryState } from 'react-router-use-location-state'
import { Button } from 'reactstrap'
import moment from 'moment'
import qs from 'query-string'
import PropTypes from 'prop-types'

import noImage from '../../../../assets/images/no-image-1.svg'

import AlertMessage from '../../../../components/AlertMessage'
import DataNotFound from '../../../../components/DataNotFound'
import SkeletonTable from '../../../../components/SkeletonTable'
import PaginationComponent from '../../../../components/PaginationComponent'
import { modalMessageFunc } from '../../../../helpers/helper'
import { getUrl } from '../../../../actions/url'

const UsersList = forwardRef((props, ref) => {
  const {
    getList, usersList, sportsType, getSeasonDetailsFunc, fullSeasonList, getSeasonDataFunc
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
  const [list, setList] = useState([])
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [index, setIndex] = useState(1)
  const [loading, setLoading] = useState(false)
  const [listLength, setListLength] = useState('10 Rows')
  const [close, setClose] = useState(false)
  const [modalMessage, setModalMessage] = useState(false)
  const [url, setUrl] = useState('')
  const resStatus = useSelector(state => state.season.resStatus)
  const resMessage = useSelector(state => state.season.resMessage)
  const getUrlLink = useSelector(state => state.url.getUrl)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const previousProps = useRef({
    start, offset, usersList, resMessage, resStatus
  }).current
  const paginationFlag = useRef(false)
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
        setListLength(`${limit} Rows`)
      }
    }
    const startFrom = (page - 1) * offset
    setStart(startFrom)
    getList(startFrom, limit)
    getSeasonDetailsFunc()
    getSeasonDataFunc()
    dispatch(getUrl('media'))
    setLoading(true)
  }, [sportsType])

  useEffect(() => {
    if (getUrlLink) {
      setUrl(getUrlLink)
    }
  }, [getUrlLink])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    let data = localStorage.getItem('queryParams') ? JSON.parse(localStorage.getItem('queryParams')) : {}
    !Object.keys(data).length
      ? data = {
        UsersList: location.search
      }
      : data.UsersList = location.search
    localStorage.setItem('queryParams', JSON.stringify(data))
  }, [location.search])

  useEffect(() => {
    if (previousProps.usersList !== usersList) {
      if (usersList) {
        if (usersList.results) {
          const userArrLength = usersList.results.length
          const startFrom = ((activePageNo - 1) * offset) + 1
          const end = (startFrom - 1) + userArrLength
          setStartingNo(startFrom)
          setEndingNo(end)
        }
        setList(usersList.results ? usersList.results : [])
        setIndex(activePageNo)
        setTotal(usersList.total ? usersList.total : 0)
        setLoading(false)
      }
    }
    return () => {
      previousProps.usersList = usersList
    }
  }, [usersList])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          const startFrom = 0
          const limit = offset
          getList(startFrom, limit)
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
        getSeasonDetailsFunc()
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  function onRefresh () {
    // const startFrom = 0
    // const limit = offset
    getList(start, offset)
    getSeasonDetailsFunc()
    setLoading(true)
    setPageNo(activePageNo)
  }

  useImperativeHandle(ref, () => ({
    onRefresh,
    onExport
  }))

  useEffect(() => {
    if ((previousProps.start !== start || previousProps.offset !== offset) && paginationFlag.current) {
      getList(start, offset)
      setLoading(true)
    }
    return () => {
      previousProps.start = start
      previousProps.offset = offset
    }
  }, [start, offset])

  const processExcelExportData = (data) =>
    data.map((userList) => {
      const sUserName = userList.sUserName ? userList.sUserName : '-'
      const eType = userList?.eType === 'B' ? 'Bot' : userList?.eType === 'CB' ? 'Copy Bot' : userList?.eType === 'CMB' ? 'Combination Bot' : userList?.eType === 'U' ? 'Normal' : '-'

      return {
        ...userList,
        sUserName,
        eType
      }
    })

  function onExport () {
    if (fullSeasonList?.length) {
      setLoading(false)
      exporter.current.props = {
        ...exporter.current.props,
        data: processExcelExportData(fullSeasonList),
        fileName: 'SeasonsUsersList.xlsx'
      }
      exporter.current.save()
    }
  }

  return (
    <Fragment>
      {
      !loading && list.length === 0
        ? (
          <>
            <div className='super-not-found'>
              <DataNotFound message="Users" obj={obj}/>
            </div>
          </>
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
              <ExcelExport ref={exporter} data={(fullSeasonList && fullSeasonList.length > 0) ? fullSeasonList : []} fileName='SeasonsUsersList.xlsx'>
                <ExcelExportColumn field='sUserName' title='Username' />
                <ExcelExportColumn field='eType' title='Type' />
              </ExcelExport>
              <table className="table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Profile Pic</th>
                    <th>Username</th>
                    <th>Type</th>
                    <th>Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? <SkeletonTable numberOfColumns={5} />
                    : (
                      <Fragment>
                        {list && list.length !== 0 && list.map((data, i) => {
                          return (
                            <tr key={data._id}>
                              <td>{(((index - 1) * offset) + (i + 1))}</td>
                              <td>
                                {data.sProPic
                                  ? <img alt="NA" className='l-cat-img' src={url + data.sProPic} />
                                  : <img alt="League Category Image" className='l-cat-img' src={noImage} /> }
                              </td>
                              <td>
                                {(adminPermission && (adminPermission.USERS !== 'N' && adminPermission.SYSTEM_USERS !== 'N'))
                                  ? <Button className="total-text-link" color="link" tag={Link} to={`${data.eType === 'U' ? props.userDetailsPage : props.systemUserDetailsPage}/${data.iUserId}`}>{data.sUserName || '--'}</Button>
                                  : data.sUserName || '--'}
                              </td>
                              <td>{data?.eType === 'B' ? 'Bot' : data?.eType === 'CB' ? 'Copy Bot' : data?.eType === 'CMB' ? 'Combination Bot' : data?.eType === 'U' ? 'Normal' : '-'}</td>
                              <td>{moment(data.dCreatedAt).format('DD/MM/YYYY hh:mm A')}</td>
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
    </Fragment>
  )
})

UsersList.propTypes = {
  sportsType: PropTypes.string,
  getList: PropTypes.func,
  usersList: PropTypes.object,
  location: PropTypes.object,
  history: PropTypes.object,
  userDetailsPage: PropTypes.string,
  systemUserDetailsPage: PropTypes.string,
  getSeasonDetailsFunc: PropTypes.func,
  fullSeasonList: PropTypes.object,
  getSeasonDataFunc: PropTypes.object
}

UsersList.displayName = UsersList

export default connect(null, null, null, { forwardRef: true })(UsersList)
