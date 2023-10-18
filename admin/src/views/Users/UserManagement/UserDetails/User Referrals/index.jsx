import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useQueryState } from 'react-router-use-location-state'
import qs from 'query-string'
import PropTypes from 'prop-types'

import UserReferrals from './UserReferrals'
import Layout from '../../../../../components/Layout'
import UserListHeader from '../../../Component/UsersListHeader'

import { getReferredList } from '../../../../../actions/users'
import UsersListMainHeader from '../../../Component/UsersListMainHeader'

function ReferralIndex (props) {
  const location = useLocation()
  const { id } = useParams()
  const dispatch = useDispatch()

  const [searchText, setSearchText] = useQueryState('search', '')
  const [initialFlag, setInitialFlag] = useState(false)
  const token = useSelector(state => state.auth.token)
  const referredList = useSelector(state => state.users.referredList)
  const content = useRef()

  useEffect(() => {
    const obj = qs.parse(location.search)
    if (obj.search) {
      setSearchText(obj.search)
    }
  }, [])

  function onHandleSearch (e) {
    setSearchText(e.target.value)
    setInitialFlag(true)
  }

  function getReferralsListFun (start, limit, sort, order, search) {
    const data = {
      start, limit, sort, order, search, userId: id, token
    }
    dispatch(getReferredList(data))
  }

  function onExport () {
    content.current.onExport()
  }

  return (
    <Fragment>
      <Layout>
        <main className="main-content">
          <section className="management-section common-box">
            <UsersListMainHeader
              heading="Referrals"
              userDetailsPage={`/users/user-management/user-details/${id}`}
              onExport={onExport}
              RefferalsDetails

            />
            <div className='without-pagination'>
              <UserListHeader
                handleSearch={onHandleSearch}
                search={searchText}
                list={referredList}
                hideDateBox
              />
              <UserReferrals
                {...props}
                ref={content}
                search={searchText}
                flag={initialFlag}
                getList={getReferralsListFun}
                referredList={referredList}
              />
            </div>
          </section>
        </main>
      </Layout>
    </Fragment>
  )
}

ReferralIndex.propTypes = {
  location: PropTypes.object,
  match: PropTypes.object
}

export default ReferralIndex
