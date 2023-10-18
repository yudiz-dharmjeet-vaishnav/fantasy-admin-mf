import React, { Fragment, useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import qs from 'query-string'
import PropTypes from 'prop-types'

import Layout from '../../../components/Layout'
import Heading from '../component/Heading'
import MainHeading from '../component/MainHeading'
import PaymentManagementContent from './PaymentManagement'
import { getPaymentList } from '../../../actions/payment'

function PaymentManagement (props) {
  const dispatch = useDispatch()
  const location = useLocation()
  const Auth = useSelector(state => state?.auth?.adminData && state?.auth?.adminData?.eType)
  const adminPermission = useSelector(state => state?.auth?.adminPermission)
  const token = useSelector(state => state?.auth?.token)
  const paymentList = useSelector(state => state?.payment?.paymentList)
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

  function getPaymentMethods (start, limit, sort, order, search) {
    dispatch(getPaymentList(start, limit, sort, order, search?.trim(), token))
  }

  function onExport () {
    content?.current?.onExport()
  }

  return (
    <Fragment>
      <Layout {...props} >
        <main className="main-content">
          <section className="management-section common-box">
            <MainHeading
              export="Export"
              heading="Payment Gateways"
              list={paymentList}
              onExport={onExport}
            />
            <div className={paymentList?.total === 0 ? 'without-pagination' : 'setting-component'}>
              <Heading
                SearchPlaceholder="Search payment"
                handleSearch={onHandleSearch}
                permission={(Auth && Auth === 'SUPER') || (adminPermission?.PAYMENT_OPTION !== 'R')}
                search={searchText}
              />
              <PaymentManagementContent
                {...props}
                ref={content}
                flag={initialFlag}
                getList={getPaymentMethods}
                paymentList={paymentList}
                search={searchText}
              />
            </div>
          </section>
        </main>
      </Layout>
    </Fragment>
  )
}

PaymentManagement.propTypes = {
  location: PropTypes.object
}

export default PaymentManagement
