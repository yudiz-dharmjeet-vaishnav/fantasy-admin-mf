import React, { Fragment, useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import qs from 'query-string'
import PropTypes from 'prop-types'

import Layout from '../../../components/Layout'
import Heading from '../component/Heading'
import PayoutManagement from './PayoutManagement'
import MainHeading from '../component/MainHeading'
import { getPayoutList } from '../../../actions/payout'

function Payout (props) {
  const dispatch = useDispatch()
  const location = useLocation()
  const Auth = useSelector(state => state?.auth?.adminData && state?.auth?.adminData?.eType)
  const adminPermission = useSelector(state => state?.auth?.adminPermission)
  const token = useSelector(state => state?.auth?.token)
  const payoutList = useSelector(state => state?.payout?.payoutList)
  const [searchText, setSearchText] = useState('')
  const [initialFlag, setinitialFlag] = useState(false)
  const content = useRef()

  useEffect(() => {
    const obj = qs?.parse(location?.search)
    if (obj?.search) {
      setSearchText(obj?.search)
    }
  }, [])

  function onHandleSearch (e) {
    setSearchText(e?.target?.value)
    setinitialFlag(true)
  }

  function getPayoutMethods (start, limit, sort, order, search) {
    dispatch(getPayoutList(start, limit, sort, order, search?.trim(), token))
  }

  function onExport () {
    content.current.onExport()
  }

  return (
    <Fragment>
      <Layout {...props} >
        <main className="main-content">
          <section className="management-section common-box">
            <MainHeading
              export="Export"
              heading="Payout Gateways"
              list={payoutList}
              onExport={onExport}
            />
            <div className={payoutList?.total ? 'without-pagination ' : 'setting-component'}>
              <Heading
                handleSearch={onHandleSearch}
                permission={(Auth && Auth === 'SUPER') || (adminPermission?.PAYOUT_OPTION !== 'R')}
                search={searchText}
              />
              <PayoutManagement
                {...props}
                ref={content}
                flag={initialFlag}
                getList={getPayoutMethods}
                payoutList={payoutList}
                search={searchText}
              />
            </div>
          </section>
        </main>
      </Layout>
    </Fragment>
  )
}

Payout.propTypes = {
  location: PropTypes.object
}

export default Payout
