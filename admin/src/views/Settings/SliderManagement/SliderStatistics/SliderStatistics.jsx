import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState, Fragment } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useQueryState } from 'react-router-use-location-state'
import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export'
import { Button } from 'reactstrap'
import moment from 'moment'
import qs from 'query-string'
import PropTypes from 'prop-types'

import SkeletonTable from '../../../../components/SkeletonTable'
import DataNotFound from '../../../../components/DataNotFound'
import PaginationComponent from '../../../../components/PaginationComponent'

const SliderStatistics = forwardRef((props, ref) => {
  const { bannerStatisticsList, getList, startDate, endDate } = props
  const location = useLocation()
  const exporter = useRef(null)
  const [start, setStart] = useState(0)
  const [dateFrom, setDateFrom] = useQueryState('datefrom', '')
  const [dateTo, setDateTo] = useQueryState('dateto', '')
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [total, setTotal] = useState(0)
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [index, setIndex] = useState(1)
  const [listLength, setListLength] = useState('10 Rows')
  const [Loading, setLoading] = useState(false)
  const [sliderStatistics, setSliderStatistics] = useState([])
  const adminPermission = useSelector(state => state?.auth?.adminPermission)
  const previousProps = useRef({ bannerStatisticsList, startDate, endDate, start, offset })?.current
  const paginationFlag = useRef(false)
  const obj = qs?.parse(location?.search)

  useEffect(() => {
    let page = 1
    let limit = offset
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
    }
    const startFrom = (page - 1) * offset
    getList(startFrom, limit, dateFrom, dateTo)
    setLoading(true)
  }, [])

  // to set bannerStatistics list
  useEffect(() => {
    if (bannerStatisticsList && previousProps?.bannerStatisticsList !== bannerStatisticsList) {
      if (bannerStatisticsList.data) {
        const userArrLength = bannerStatisticsList?.data?.length
        const startFrom = ((activePageNo - 1) * offset) + 1
        const end = (startFrom - 1) + userArrLength
        setStartingNo(startFrom)
        setEndingNo(end)
      }
      setSliderStatistics(bannerStatisticsList.data)
      setIndex(activePageNo)
      setTotal(bannerStatisticsList?.total || 0)
      setLoading(false)
    }
    return () => {
      previousProps.bannerStatisticsList = bannerStatisticsList
    }
  }, [bannerStatisticsList])

  // will be called when startdate and endDate change
  useEffect(() => {
    if (previousProps?.startDate !== startDate || previousProps?.endDate !== endDate) {
      if (props?.startDate && props?.endDate) {
        const startFrom = 0
        const limit = offset
        getList(startFrom, limit, props?.startDate, props?.endDate)
        setDateFrom(moment(props?.startDate)?.format('MM-DD-YYYY'))
        setDateTo(moment(props?.endDate)?.format('MM-DD-YYYY'))
        setPageNo(1)
        setLoading(true)
      } else if ((!props?.startDate) && (!props?.endDate)) {
        const startFrom = 0
        const limit = offset
        getList(startFrom, limit, props?.startDate, props?.endDate)
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

  useEffect(() => {
    if ((previousProps?.start !== start || previousProps?.offset !== offset) && paginationFlag?.current) {
      getList(start, offset, dateFrom, dateTo)
      setLoading(true)
    }
    return () => {
      previousProps.start = start
      previousProps.offset = offset
    }
  }, [start, offset])

  // Export Excel Report List
  const processExcelExportData = data => data?.map((sliderStatisticsList) => {
    let dCreatedAt = moment(sliderStatisticsList?.dCreatedAt)?.format('DD/MM/YYYY')
    dCreatedAt = dCreatedAt === 'Invalid date' ? ' - ' : dCreatedAt
    return {
      ...sliderStatisticsList,
      dCreatedAt
    }
  })

  function onExport () {
    const { length } = sliderStatistics
    if (length !== 0) {
      exporter.current.props = { ...exporter?.current?.props, data: processExcelExportData(sliderStatistics), fileName: 'Slider.xlsx' }
      exporter?.current?.save()
    }
  }
  // function for refresh slider statistics list
  function onRefresh () {
    const startFrom = 0
    getList(startFrom, offset, dateFrom, dateTo)
    setLoading(true)
    setPageNo(1)
  }

  useImperativeHandle(ref, () => ({
    onExport,
    onRefresh
  }))

  return (
    <Fragment>
      <ExcelExport ref={exporter} data={sliderStatistics} fileName="Slider.xlsx">
        <ExcelExportColumn field="dCreatedAt" title="Creation Time" />
        <ExcelExportColumn field="userCount" title="User Count" />
      </ExcelExport>
      {!Loading && sliderStatistics?.length === 0
        ? (<DataNotFound message="Slider statistics list" obj={obj}/>)
        : (
          <div className='table-represent'>
            <div className="table-responsive">
              <div className='d-flex justify-content-between fdc-480' />
              <table className="table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Username</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {Loading
                    ? <SkeletonTable numberOfColumns={3} />
                    : (
                      <Fragment>
                        {
                    sliderStatistics && sliderStatistics?.length !== 0 && sliderStatistics.map((data, i) => (
                      <>
                        <tr key={data._id}>
                          <td>{(((index - 1) * offset) + (i + 1))}</td>
                          <td>
                            {(adminPermission && (adminPermission?.USERS !== 'N' && adminPermission?.SYSTEM_USERS !== 'N'))
                              ? <Button className="total-text-link" color="link" tag={Link} to={(data?.iUserId && data?.oUser?.eType === 'U') ? `/users/user-management/user-details/${data?.iUserId}` : (data?.oUser && `/users/system-user/system-user-details/${data?.iUserId}`)}>{data?.oUser?.sUsername || '--'}</Button>
                              : data?.oUser?.sUsername || '--'}
                          </td>
                          <td>{moment(data?.dCreatedAt)?.format('DD/MM/YYYY')}</td>
                        </tr>
                      </>
                    ))}
                      </Fragment>
                      )}
                </tbody>
              </table>
            </div>
          </div>
          )}
      {
  sliderStatistics?.length !== 0 && (
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

SliderStatistics.propTypes = {
  location: PropTypes.object,
  bannerStatisticsList: PropTypes.object,
  getList: PropTypes.func,
  handle: PropTypes.func,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  value: PropTypes.string,
  onClick: PropTypes.func,
  setDateRange: PropTypes.func,
  dateRange: PropTypes.array
}

SliderStatistics.displayName = SliderStatistics

export default SliderStatistics
