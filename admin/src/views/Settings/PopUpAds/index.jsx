import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useQueryState } from 'react-router-use-location-state'
import { useLocation } from 'react-router-dom'
import qs from 'query-string'
import PropTypes from 'prop-types'

import Layout from '../../../components/Layout'
import Heading from '../component/Heading'
import PopupAdList from './PopUpAdList'
import MainHeading from '../component/MainHeading'
import { getPopUpAdsList } from '../../../actions/popup'

function PopupAdsManagement (props) {
  const dispatch = useDispatch()
  const location = useLocation()

  const [searchText, setSearchText] = useState('')
  const [initialFlag, setinitialFlag] = useState(false)
  const [type, setType] = useQueryState('type', '')

  const Auth = useSelector(state => state?.auth?.adminData && state?.auth?.adminData?.eType)
  const adminPermission = useSelector(state => state?.auth?.adminPermission)
  const token = useSelector(state => state?.auth?.token)
  const popUpAdsList = useSelector(state => state?.popup?.popUpAdsList)
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

  function onExport () {
    content.current.onExport()
  }

  function getPopupAds (start, limit, type, search) {
    dispatch(getPopUpAdsList(start, limit, type, search?.trim(), token))
  }

  function onFiltering (event) {
    setType(event.target.value)
  }

  return (
    <Fragment>
      <Layout {...props} >
        <main className="main-content">
          <section className="management-section common-box">
            <MainHeading
              export="Export"
              heading="Popup Ads Management"
              info
              list={popUpAdsList}
              onExport={onExport}
            />
            <div className={popUpAdsList?.total === 0 ? 'without-pagination' : 'setting-component'}>
              <Heading
                Popup
                buttonText="Add Pop Up"
                handleSearch={onHandleSearch}
                onFiltering={onFiltering}
                permission={(Auth && Auth === 'SUPER') || (adminPermission?.POPUP_ADS !== 'R')}
                search={searchText}
                setUrl="/settings/add-popup-ad"
                type={type}
              />
              <PopupAdList
                {...props}
                ref={content}
                flag={initialFlag}
                getList={getPopupAds}
                onFiltering={onFiltering}
                popUpAdsList={popUpAdsList}
                search={searchText}
                type={type}
              />
            </div>
          </section>
        </main>
      </Layout>
    </Fragment>
  )
}

PopupAdsManagement.propTypes = {
  location: PropTypes.object
}

export default PopupAdsManagement
