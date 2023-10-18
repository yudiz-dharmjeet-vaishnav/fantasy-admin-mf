import React, { Fragment, useRef, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import qs from 'query-string'
import PropTypes from 'prop-types'
import moment from 'moment'

import SubAdminContent from './SubAdmin'
import Layout from '../../components/Layout'
import SubAdminHeader from './components/SubAdminHeader'
import SubAdminMainHeader from './components/SubAdminMainHeader'

import { getSubadminList } from '../../actions/subadmin'
function SubAdmin (props) {
  const location = useLocation()
  const content = useRef()
  const [SearchText, setSearchText] = useState('')
  const [initialFlag, setinitialFlag] = useState(false)
  const [dateRange, setDateRange] = useState([null, null])
  const [startDate, endDate] = dateRange
  const subadminList = useSelector(state => state?.subadmin?.subadminList)
  const Auth = useSelector(state => state?.auth?.adminData && state?.auth?.adminData.eType)
  const adminPermission = useSelector(state => state?.auth?.adminPermission)
  const token = useSelector(state => state?.auth?.token)
  const dispatch = useDispatch()

  useEffect(() => {
    const obj = qs.parse(location?.search)
    if (obj?.search) {
      setSearchText(obj?.search)
    }
    if (obj?.datefrom && obj?.dateto) {
      setDateRange([new Date(obj?.datefrom), new Date(obj?.dateto)])
    }
  }, [])

  function onHandleSearch (e) {
    setSearchText(e?.target?.value)
    setinitialFlag(true)
  }

  function getList (start, limit, sort, order, searchText, dateFrom, dateTo) {
    const StartDate = dateFrom ? new Date(moment(dateFrom).startOf('day').format()) : ''
    const EndDate = dateTo ? new Date(moment(dateTo).endOf('day').format()) : ''
    dispatch(getSubadminList(start, limit, sort, order, searchText?.trim(), StartDate, EndDate, token))
  }

  function onExport () {
    content?.current?.onExport()
  }
  return (
    <Fragment>
      <Layout {...props} >
        <main className="main-content">
          <section className="management-section common-box">
            <SubAdminMainHeader
              List={subadminList}
              export = "Export"
              header="Sub-Admins"
              onExport={onExport}
            />
            <div className={subadminList?.total === 0 ? 'without-pagination' : 'setting-component'}>
              <SubAdminHeader
                {...props}
                Searchable
                addLink="/sub-admin/add-sub-admin"
                addText="Add Sub-Admin"
                handleSearch={onHandleSearch}
                otherButton
                permission={(Auth && Auth === 'SUPER') || (adminPermission?.SUBADMIN !== 'R')}
                permissionLink="/sub-admin/permission"
                search={SearchText}
                searchPlaceholder="Search Sub-Admin"
                subAdmin
                setDateRange={setDateRange}
                startDate={startDate}
                dateRange={dateRange}
                endDate={endDate}
              />
              <SubAdminContent
                {...props}
                ref={content}
                List={subadminList}
                editLink="/sub-admin/edit-sub-admin"
                flag={initialFlag}
                getList={getList}
                search={SearchText}
                startDate={startDate}
                endDate={endDate}
              />
            </div>
          </section>
        </main>
      </Layout>
    </Fragment>
  )
}

SubAdmin.propTypes = {
  location: PropTypes.object
}

export default SubAdmin
