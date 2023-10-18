import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { useQueryState } from 'react-router-use-location-state'
import qs from 'query-string'
import PropTypes from 'prop-types'

import Layout from '../../../components/Layout'
import Heading from '../component/Heading'
import ContentManagementContent from './ContentManagementComponent'
import MainHeading from '../component/MainHeading'
import { useQuery } from '@tanstack/react-query'
import getCMSList from '../../../api/contentManagement/getCMSList'
// import { getCMSList } from '../../../actions/cms'
// import getCMSList from '../../../api/contentManagement/getCMSList'
function CMS (props) {
  const content = useRef()
  // const dispatch = useDispatch()
  const location = useLocation()
  const [searchText, setSearchText] = useState('')
  const [initialFlag, setinitialFlag] = useState(false)
  const [start, setStart] = useState(0)
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [order, setOrder] = useQueryState('order', 'desc')
  const [search, setSearch] = useQueryState('search', '')

  const adminPermission = useSelector(state => state?.auth?.adminPermission)
  const Auth = useSelector(state => state?.auth?.adminData && state?.auth?.adminData?.eType)
  // const token = useSelector(state => state.auth.token)
  // const cmsList = useSelector(state => state.cms.cmsList)

  // cms list fetch
  const { data: cmsList, isLoading } = useQuery({
    queryKey: ['getCmsList', start, offset, search],
    queryFn: () => getCMSList(start, offset, search),
    select: (response) => response?.data

  })
  useEffect(() => {
    const obj = qs?.parse(location?.search)
    if (obj?.search) {
      setSearchText(obj?.search)
    }
  }, [])

  function onExport () {
    content?.current?.onExport()
  }

  // function getCmsList (search) {
  //   dispatch(getCMSList(search.trim(), token))
  // }

  function onHandleSearch (e) {
    setSearchText(e?.target?.value)
    setinitialFlag(true)
  }

  return (
    <Fragment>
      <Layout {...props} >
        <main className="main-content">
          <section className="management-section common-box">
            <MainHeading
              export="Export"
              heading="Content"
              info
              // list={cmsList}
              onExport={onExport}
            />
            <div className='without-pagination'>
              <Heading
                buttonText="Add Content"
                handleSearch={onHandleSearch}
                permission={(Auth && Auth === 'SUPER') || (adminPermission?.CMS !== 'R')}
                search={searchText}
                setUrl="/settings/add-content"
              />
              <ContentManagementContent
                {...props}
                ref={content}
                cmsList={cmsList}
                flag={initialFlag}
                // getList={getCmsList}
                isLoading={isLoading}
                search={searchText}
                setSearch={setSearch}
                start={start}
                setStart={setStart}
                offset={offset}
                setOffset={setOffset}
                order={order}
                setOrder={setOrder}
              />
            </div>
          </section>
        </main>
      </Layout>
    </Fragment>
  )
}

CMS.propTypes = {
  location: PropTypes.object
}

export default CMS
