import React, { Fragment, useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { Button } from 'reactstrap'
import { useSelector, connect } from 'react-redux'
import { useQueryState } from 'react-router-use-location-state'
import { Link, useLocation } from 'react-router-dom'
import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export'
import qs from 'query-string'
import PropTypes from 'prop-types'

import AlertMessage from '../../../../components/AlertMessage'
import DataNotFound from '../../../../components/DataNotFound'
import { modalMessageFunc } from '../../../../helpers/helper'
import SkeletonTable from '../../../../components/SkeletonTable'
import PaginationComponent from '../../../../components/PaginationComponent'

const MatchLeaguePromoUsage = forwardRef((props, ref) => {
  const { List, getList } = props
  const location = useLocation()
  const exporter = useRef(null)
  const [start, setStart] = useState(0)
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [total, setTotal] = useState(0)
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
  const searchProp = props.searchText
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
      // props.history.replace()
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
    }
    const startFrom = (page - 1) * offset
    setStart(startFrom)
    getList(startFrom, limit, search)
    setLoading(true)
  }, [])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

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
      getList(startFrom, limit, props.searchText)
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

  const processExcelExportData = data => data.map((promoUsageList) => {
    const sUserName = promoUsageList.sUserName || '--'
    const sTeamName = promoUsageList.sTeamName || '--'
    const nPromoDiscount = promoUsageList.nPromoDiscount || '--'
    const sPromoCode = promoUsageList?.iPromocodeId?.sCode || '--'
    const sPromoName = promoUsageList?.iPromocodeId?.sName || '--'
    return {
      ...promoUsageList,
      sUserName,
      sTeamName,
      nPromoDiscount,
      sPromoCode,
      sPromoName
    }
  })

  function onExport () {
    const { length } = list
    if (length !== 0) {
      exporter.current.props = { ...exporter.current.props, data: processExcelExportData(list), fileName: 'PromoUsageList.xlsx' }
      exporter.current.save()
    }
  }

  useImperativeHandle(ref, () => ({
    onExport,
    onRefresh
  }))

  return (
    <Fragment>
      {/* {
        modalMessage && message &&
        (
          <UncontrolledAlert color="primary" className={alertClass(status, close)}>{message}</UncontrolledAlert>
        )
      } */}

      <AlertMessage
        close={close}
        message={message}
        modalMessage={modalMessage}
        status={status}
      />

      <ExcelExport
        ref={exporter}
        data={list}
        fileName="PromoUsageList.xlsx"
      >
        <ExcelExportColumn field="sUserName" title="Username" />
        <ExcelExportColumn field="nPromoDiscount" title="Promo Discount" />
        <ExcelExportColumn field="sTeamName" title="Team Name" />
        <ExcelExportColumn field="sPromoCode" title="Promo Code" />
        <ExcelExportColumn field="sPromoName" title="Promo Name" />
      </ExcelExport>
      {
      !loading && list?.length === 0
        ? (
          <DataNotFound message="Promo Usage list" obj={obj}/>
          )
        : (
          <div className='table-represent'>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Username</th>
                    <th>Promo Code Discount </th>
                    <th>Team Name</th>
                    <th>Promo Code</th>
                    <th>Promo Name</th>
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? <SkeletonTable numberOfColumns={6} />
                    : (
                      <Fragment>
                        {
                    list && list.length !== 0 && list.map((data, i) => {
                      return (
                        <tr key={i + 1}>
                          <td>{(((index - 1) * offset) + (i + 1))}</td>
                          <td><Button className="view" color="link" tag={Link} to={ { pathname: data?.eType === 'U' ? '/users/user-management/user-details/' + data.iUserId : '/users/system-user/system-user-details/' + data.iUserId, state: { goBack: 'yes' } }}>{data.sUserName || '-'}</Button></td>
                          <td>{data.nPromoDiscount || 0}</td>
                          <td>{data.sTeamName || '--'}</td>
                          <td>{data?.iPromocodeId?.sCode || '--'}</td>
                          <td>{data?.iPromocodeId?.sName || '--'}</td>
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
        !loading && list?.length === 0 &&
        (
          <div className="text-center">
            <h3>No Promo Usage list available</h3>
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

MatchLeaguePromoUsage.propTypes = {
  List: PropTypes.object,
  getList: PropTypes.func,
  searchText: PropTypes.string,
  flag: PropTypes.bool,
  location: PropTypes.object,
  history: PropTypes.object,
  handleSearch: PropTypes.func,
  matchLeagueName: PropTypes.string,
  userDetailsPage: PropTypes.string,
  systemUserDetailsPage: PropTypes.string
}

MatchLeaguePromoUsage.displayName = MatchLeaguePromoUsage

export default connect(null, null, null, { forwardRef: true })(MatchLeaguePromoUsage)
