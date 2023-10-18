import React, { Fragment, useEffect, useState, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import qs from 'query-string'
import { useQuery } from '@tanstack/react-query'
import PropTypes from 'prop-types'
import { useQueryState } from 'react-router-use-location-state'

import Heading from '../component/Heading'
import Layout from '../../../components/Layout'
import MainHeading from '../component/MainHeading'
import OfferManagementContent from './OfferManagementContent'
// import { updateOffer } from '../../../actions/offers'
import getOfferList from '../../../api/Offermangement/getOfferList'
function OfferManagement (props) {
  // const dispatch = useDispatch()
  const location = useLocation()
  const [searchText, setSearchText] = useState('')
  const [initialFlag, setInitialFlag] = useState(false)
  const [start, setStart] = useState(0)
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [order, setOrder] = useQueryState('order', 'desc')
  const [search, setSearch] = useQueryState('search', '')
  const [sort] = useQueryState('sortBy', 'dCreatedAt')

  const adminPermission = useSelector(state => state?.auth?.adminPermission)
  const Auth = useSelector(state => state?.auth?.adminData && state?.auth?.adminData?.eType)
  // const token = useSelector(state => state.auth.token)
  // const offerList = useSelector(state => state.offers.offerList)

  // offerList Query
  const { data: offerList, isLoading } = useQuery({
    queryKey: ['getOfferList', start, offset, sort, order, search],
    queryFn: () => getOfferList(start, offset, sort, order, search),
    select: (res) => res?.data?.data[0],
    enabled: !!(start || offset || sort || order || search)
  })

  // updateOfferList Query

  const content = useRef()

  function onExport () {
    content?.current?.onExport()
  }

  useEffect(() => {
    const obj = qs?.parse(location?.search)
    if (obj?.search) {
      setSearchText(obj?.search)
    }
  }, [])

  function onHandleSearch (e) {
    setSearchText(e?.target?.value)
    setInitialFlag(true)
  }

  // function getOffersList (start, limit, sort, order, search) {
  //   dispatch(getOfferList(start, limit, sort, order, search.trim(), token))
  // }

  // function updateOfferFunction (data, id) {
  //   dispatch(updateOffer(data, id, token))
  // }

  return (
    <Fragment>
      <div>
        <Layout {...props} >
          <main className="main-content">
            <section className="management-section common-box">
              <MainHeading
                export="Export"
                heading="Offers"
                info
                list={offerList}
                onExport={onExport}
              />
              <div className={offerList?.total === 0 ? 'without-pagination ' : 'setting-component'}>
                <Heading
                  SearchPlaceholder="Search offer"
                  buttonText="Add Offer"
                  handleSearch={onHandleSearch}
                  permission={(Auth && Auth === 'SUPER') || (adminPermission?.OFFER === 'W')}
                  search={searchText}
                  setUrl="/settings/add-offer"
                />
                <OfferManagementContent
                  {...props}
                  ref={content}
                  flag={initialFlag}
                  // getList={getOffersList}
                  offerList={offerList}
                  search={searchText}
                  setStart={setStart}
                  setOffset={setOffset}
                  setSearch={setSearch}
                  setOrder={setOrder}
                  start={start}
                  offset={offset}
                  order={order}
                  isLoading={isLoading}
                  // updateOfferFunction={updateOfferFunction}
                />
              </div>
            </section>
          </main>
        </Layout>
      </div>
    </Fragment>
  )
}

OfferManagement.propTypes = {
  location: PropTypes.object
}

export default OfferManagement
