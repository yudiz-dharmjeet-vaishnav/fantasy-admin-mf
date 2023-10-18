import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import qs from 'query-string'
import PropTypes from 'prop-types'

import RolesList from './RolesList'
import Layout from '../../../components/Layout'
import SubAdminHeader from '../components/SubAdminHeader'
import SubAdminMainHeader from '../components/SubAdminMainHeader'

import { getRolesList } from '../../../actions/role'

function Roles (props) {
  const location = useLocation()
  const content = useRef()
  const [searchText, setSearchText] = useState('')
  const [initialFlag, setinitialFlag] = useState(false)
  const rolesList = useSelector(state => state?.role?.rolesList)
  const adminPermission = useSelector(state => state?.auth?.adminPermission)
  const Auth = useSelector(state => state?.auth?.adminData && state?.auth?.adminData?.eType)
  const token = useSelector(state => state?.auth?.token)
  const dispatch = useDispatch()

  function getList (start, limit, search) {
    const data = {
      start, limit, search: search.trim(), token
    }
    dispatch(getRolesList(data))
  }

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
    setinitialFlag(true)
  }

  return (
    <Fragment>
      <Layout {...props} >
        <main className="main-content">
          <section className="management-section common-box">
            <SubAdminMainHeader
              List={rolesList}
              export="Export"
              header="Sub-Admin Roles"
              onExport={onExport}
            />
            <div className={rolesList?.total === 0 ? 'without-pagination' : 'setting-component'}>
              <SubAdminHeader
                {...props}
                Searchable
                addLink="/sub-admin/add-role"
                addText="Add Role"
                handleSearch={onHandleSearch}
                permission={(Auth && Auth === 'SUPER') || (adminPermission?.ADMIN_ROLE !== 'R')}
                search={searchText}
              />
              <RolesList
                {...props}
                ref={content}
                editRoleLink="/sub-admin/update-role"
                flag={initialFlag}
                getList={getList}
                rolesList={rolesList}
                search={searchText}
              />
            </div>
          </section>
        </main>
      </Layout>
    </Fragment>
  )
}

Roles.propTypes = {
  location: PropTypes.object
}

export default Roles
