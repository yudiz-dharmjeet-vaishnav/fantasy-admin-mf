import React, { Fragment, useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useQueryState } from 'react-router-use-location-state'
import { useLocation } from 'react-router-dom'
import moment from 'moment'
import qs from 'query-string'
import PropTypes from 'prop-types'

import Heading from '../component/Heading'
import Layout from '../../../components/Layout'
import MainHeading from '../component/MainHeading'
import PromocodeContent from './PromocodeManagement'
import { getPromocodeList, updatePromocode } from '../../../actions/promocode'
function Promocode (props) {
  const dispatch = useDispatch()
  const location = useLocation()
  const [searchText, setSearchText] = useState('')
  const [initialFlag, setInitialFlag] = useState(false)
  const content = useRef()
  const [dateRange, setDateRange] = useState([null, null])
  const [promoType, setPromoType] = useQueryState('type', '')

  const [startDate, endDate] = dateRange
  const adminPermission = useSelector(state => state?.auth?.adminPermission)
  const Auth = useSelector(state => state?.auth?.adminData && state?.auth?.adminData?.eType)
  const token = useSelector(state => state?.auth?.token)
  const promocodeList = useSelector(state => state?.promocode?.promocodeList)

  function onExport () {
    content?.current?.onExport()
  }
  useEffect(() => {
    const obj = qs?.parse(location.search)
    if (obj?.search) {
      setSearchText(obj?.search)
    }
    if (obj?.datefrom && obj?.dateto) {
      setDateRange([new Date(obj?.datefrom), new Date(obj?.dateto)])
    }
  }, [])

  function onHandleSearch (e) {
    setSearchText(e?.target?.value)
    setInitialFlag(true)
  }

  function getPromoCodeList (start, limit, sort, order, search, promoType, StartDate, EndDate) {
    const dateFrom = StartDate ? new Date(moment(StartDate)?.startOf('day')?.format()) : ''
    const dateTo = EndDate ? new Date(moment(EndDate)?.endOf('day')?.format()) : ''
    const promoCodeListData = {
      start, limit, sort, order, search: search?.trim(), promoType, dateFrom: dateFrom ? new Date(dateFrom)?.toISOString() : '', dateTo: dateTo ? new Date(dateTo)?.toISOString() : '', token
    }
    dispatch(getPromocodeList(promoCodeListData))
  }

  function updatePromoFunc (data) {
    dispatch(updatePromocode(data))
  }

  function onFiltering (event) {
    setPromoType(event?.target?.value)
  }
  return (
    <Fragment>
      <Layout {...props} >
        <main className="main-content">
          <section className="management-section common-box">
            <MainHeading
              export="Export"
              heading="Promo Codes"
              info
              list={promocodeList}
              onExport={onExport}
            />
            <div className={promocodeList?.total === 0 ? 'without-pagination' : 'setting-component'}>
              <Heading
                {...props}
                SearchPlaceholder="Search Promocode"
                buttonText="Add Promocode"
                dateRange={dateRange}
                endDate={endDate}
                handleSearch={onHandleSearch}
                onFiltering={onFiltering}
                permission={(Auth && Auth === 'SUPER') || (adminPermission?.PROMO !== 'R')}
                promoType={promoType}
                promocode
                search={searchText}
                setDateRange={setDateRange}
                setUrl="/settings/add-promocode"
                startDate={startDate}
              />
              <PromocodeContent
                {...props}
                ref={content}
                endDate={endDate}
                flag={initialFlag}
                getList={getPromoCodeList}
                promoType={promoType}
                promocodeList={promocodeList}
                search={searchText}
                startDate={startDate}
                updatePromo={updatePromoFunc}
              />
            </div>

          </section>
        </main>
      </Layout>
    </Fragment>
  )
}

Promocode.propTypes = {
  location: PropTypes.object
}

export default Promocode
