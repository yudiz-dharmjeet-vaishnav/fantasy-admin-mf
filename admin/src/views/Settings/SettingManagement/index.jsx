import React, { Fragment, useEffect, useState, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import qs from 'query-string'
import PropTypes from 'prop-types'
import { useQuery } from '@tanstack/react-query'
import { useQueryState } from 'react-router-use-location-state'

import Layout from '../../../components/Layout'
import Heading from '../component/Heading'
import SettingManagementList from './SettingManagementList'
import MainHeading from '../component/MainHeading'
import getSettingList from '../../../api/settingManagement/getSettingList'
// import { useMyContext } from '../../../context/context'

function SettingManagement (props) {
  const location = useLocation()
  // const { state: { isFullList = false } } = useMyContext()
  const isFullList = useRef(false)
  const [searchText, setSearchText] = useState('')
  const [initialFlag, setInitialFlag] = useState(false)
  const [search, setSearch] = useQueryState('search', '')
  const [sort] = useQueryState('sortBy', 'sTitle')
  const [start, setStart] = useState(0)
  const [offset, setOffset] = useQueryState('pageSize', 10)
  // const isFullResponse = useRef()
  const Auth = useSelector(state => state?.auth?.adminData && state?.auth?.adminData?.eType)
  const adminPermission = useSelector(state => state?.auth?.adminPermission)
  const content = useRef()

  // get SettingList query
  const { data: settingList, isLoading, refetch, isSuccess } = useQuery({
    queryKey: ['getSettingList', start, offset, sort, 'asc', search],
    queryFn: () => getSettingList(start, offset, sort, 'asc', search, isFullList.current),
    select: (res) => res?.data?.data[0],
    enabled: !!(start || offset || sort || 'asc' || search || isFullList.current)
  })

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
              heading="Settings"
              info
              list={settingList}
              onExport={onExport}
            />
            <div className={settingList?.total === 0 ? 'without-pagination' : 'setting-component'}>
              <Heading
                SearchPlaceholder="Search Setting"
                handleSearch={onHandleSearch}
                permission={(Auth && Auth === 'SUPER') || (adminPermission?.SETTING !== 'R')}
                search={searchText}
                setUrl="/settings/add-setting"
              />
              <SettingManagementList
                {...props}
                ref={content}
                flag={initialFlag}
                search={searchText}
                settingList={settingList}
                setSearch={setSearch}
                setStart={setStart}
                start={start}
                offset={offset}
                setOffset={setOffset}
                isLoading={isLoading}
                sort={sort}
                // isFullResponse={isFullResponse}
                // setIsFullResponse={setIsFullResponse}
                refetch={refetch}
                isFullList={isFullList}
                isSuccess={isSuccess}
              />
            </div>
          </section>
        </main>
      </Layout>
    </Fragment>
  )
}

SettingManagement.propTypes = {
  location: PropTypes.object
}

export default SettingManagement
