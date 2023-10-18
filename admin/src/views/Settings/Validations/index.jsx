import React, { Fragment, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import qs from 'query-string'

import Layout from '../../../components/Layout'
import Heading from '../component/Heading'
import ValidationsPage from './Validations'

function index (props) {
  const location = useLocation()
  const [searchText, setSearchText] = useState('')
  const [initialFlag, setinitialFlag] = useState(false)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)

  useEffect(() => {
    const obj = qs.parse(location.search)
    if (obj.search) {
      setSearchText(obj.search)
    }
  }, [])

  function onHandleSearch (e) {
    setSearchText(e.target.value)
    setinitialFlag(true)
  }

  return (
    <Fragment>
      <Layout {...props} >
        <main className="main-content">
          <section className="management-section common-box">
            <Heading
              SearchPlaceholder="Search Setting"
              handleSearch={onHandleSearch}
              heading="Validations"
              permission={(Auth && Auth === 'SUPER') || (adminPermission?.VALIDATION !== 'R')}
              search={searchText}
              setUrl="/settings/add-validation"
            />
            <ValidationsPage
              {...props}
              EditValidationLink="/settings/validation-details"
              flag={initialFlag}
              search={searchText}
            />
          </section>
        </main>
      </Layout>
    </Fragment>
  )
}

export default index
