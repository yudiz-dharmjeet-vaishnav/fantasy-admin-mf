import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useParams } from 'react-router-dom'
import qs from 'query-string'
import moment from 'moment'
import PropTypes from 'prop-types'

import Heading from '../../component/Heading'
import Layout from '../../../../components/Layout'
import MainHeading from '../../component/MainHeading'
import SliderStatisticsComponent from './SliderStatistics'
import { getBannerStatisticsList } from '../../../../actions/banner'

function SliderStatistics (props) {
  const content = useRef()
  const { id } = useParams()
  const location = useLocation()

  const dispatch = useDispatch('')
  const [dateRange, setDateRange] = useState([null, null])
  const [startDate, endDate] = dateRange
  const token = useSelector(state => state?.auth?.token)
  const bannerStatisticsList = useSelector(state => state?.banner?.bannerStatisticsList)

  useEffect(() => {
    const obj = qs?.parse(location?.search)
    if (obj?.datefrom && obj?.dateto) {
      setDateRange([new Date(obj?.datefrom), new Date(obj?.dateto)])
    }
  }, [])

  function onExport () {
    content?.current?.onExport()
  }

  function onRefresh () {
    content?.current?.onRefresh()
  }

  function getList (start, limit, datefrom, dateto) {
    if (id) {
      const StartDate = datefrom ? new Date(moment(datefrom)?.startOf('day')?.format()) : ''
      const EndDate = dateto ? new Date(moment(dateto)?.endOf('day')?.format()) : ''
      const data = {
        start, limit, startDate: (StartDate ? new Date(StartDate)?.toISOString() : ''), endDate: (EndDate ? new Date(EndDate)?.toISOString() : ''), bannerId: id, token
      }
      dispatch(getBannerStatisticsList(data))
    }
  }

  return (
    <div>
      <Layout {...props} >
        <main className="main-content">
          <section className="management-section common-box">
            <MainHeading
              {...props}
              export="Export"
              heading="Slider Statistics"
              list={bannerStatisticsList}
              onExport={onExport}
              onRefresh={onRefresh}
              refresh="Refresh Slider Statistics"
              sliderStatistics
            />
            <div className={bannerStatisticsList?.total === 0 ? 'without-pagination ' : 'setting-component'}>
              <Heading
                {...props}
                bannerStatisticsList={bannerStatisticsList}
                dateRange={dateRange}
                endDate={endDate}
                setDateRange={setDateRange}
                sliderStatistics
                startDate={startDate}
              />
              <SliderStatisticsComponent
                {...props}
                ref={content}
                bannerStatisticsList={bannerStatisticsList}
                dateRange={dateRange}
                endDate={endDate}
                getList={getList}
                setDateRange={setDateRange}
                startDate={startDate}
              />
            </div>
          </section>
        </main>
      </Layout>
    </div>
  )
}

SliderStatistics.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object
}

export default SliderStatistics
