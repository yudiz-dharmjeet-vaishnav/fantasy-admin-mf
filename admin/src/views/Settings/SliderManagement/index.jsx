import React, { Fragment, useEffect, useState, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import qs from 'query-string'
import PropTypes from 'prop-types'

import Heading from '../component/Heading'
import Layout from '../../../components/Layout'
import MainHeading from '../component/MainHeading'
import SliderManagementContent from './SliderManagementContent'
import { getBannerList } from '../../../actions/banner'

function SliderManagement (props) {
  const dispatch = useDispatch()
  const location = useLocation()
  const [searchText, setSearchText] = useState('')
  const [initialFlag, setinitialFlag] = useState(false)
  const Auth = useSelector(state => state?.auth?.adminData && state?.auth?.adminData?.eType)
  const adminPermission = useSelector(state => state?.auth?.adminPermission)
  const token = useSelector(state => state?.auth?.token)
  const bannerList = useSelector(state => state?.banner?.bannerList)
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
    setinitialFlag(true)
  }

  function getSliderList (start, limit, sort, order, search) {
    dispatch(getBannerList(start, limit, sort, order, search?.trim(), token))
  }

  return (
    <Fragment>
      <Layout {...props} >

        <main className="main-content">
          <section className="management-section common-box">
            <MainHeading
              export="Export"
              heading="Sliders"
              info
              list={bannerList}
              onExport={onExport}
            />
            <div className={bannerList?.total === 0 ? 'without-pagination ' : 'setting-component'}>
              <Heading
                SearchPlaceholder="Search Slider"
                buttonText="Add Slider"
                handleSearch={onHandleSearch}
                permission={(Auth && Auth === 'SUPER') || (adminPermission?.BANNER !== 'R')}
                search={searchText}
                setUrl="/settings/add-slider"
              />
              <SliderManagementContent
                {...props}
                ref={content}
                bannerList={bannerList}
                flag={initialFlag}
                getList={getSliderList}
                search={searchText}
              />
            </div>
          </section>
        </main>
      </Layout>
    </Fragment>
  )
}

SliderManagement.propTypes = {
  location: PropTypes.object
}

export default SliderManagement
