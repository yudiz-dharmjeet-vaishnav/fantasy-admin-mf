import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useQueryState } from 'react-router-use-location-state'
import { useLocation, useParams } from 'react-router-dom'
import Layout from '../../../../components/Layout'
import PromoCodeStatisticsComponent from './PromocodeStatistics'
import qs from 'query-string'
import PropTypes from 'prop-types'

import Heading from '../../component/Heading'
import MainHeading from '../../component/MainHeading'
import { isNumber } from '../../../../helpers/helper'
import { getRecommendedList } from '../../../../actions/users'
import { getPromocodeStatisticsDetails } from '../../../../actions/promocode'

function PromocodeStatistics (props) {
  const { id } = useParams()
  const location = useLocation()
  const content = useRef()
  const dispatch = useDispatch('')
  const [searchText, setSearchText] = useState('')
  const [initialFlag, setinitialFlag] = useState(false)
  const [Promocode, setPromocode] = useState('')
  const [IsNumber, setIsNumber] = useState(false)
  const [userSearch, setUserSearch] = useState('')
  const [search, setSearch] = useQueryState('search', '')
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const token = useSelector(state => state.auth.token)
  const promocodeStatisticsDetails = useSelector(state => state.promocode.promocodeStatisticsDetails)
  const recommendedList = useSelector(state => state.users.recommendedList)
  const previousProps = useRef({ userSearch }).current
  const [TotalBonusGiven, setTotalBonusGiven] = useState(0)
  const [PromoUsage, setPromoUsage] = useState([])

  useEffect(() => {
    const obj = qs.parse(location.search)
    if (obj.search) {
      setSearchText(obj.search)
      setUserSearch(obj.search)
      onGetRecommendedList(obj.search, true)
    } else if (recommendedList?.length === 0 || !recommendedList) {
      onGetRecommendedList('', false)
    }
  }, [])

  function onExport () {
    content.current.onExport()
  }

  function onRefresh () {
    content.current.onRefresh()
  }

  useEffect(() => {
    const callSearchService = () => {
      onGetRecommendedList(userSearch, false)
    }
    if (initialFlag) {
      const debouncer = setTimeout(() => {
        callSearchService()
      }, 1000)
      return () => {
        clearTimeout(debouncer)
        previousProps.searchText = searchText
      }
    }
  }, [userSearch])

  useEffect(() => {
    if (promocodeStatisticsDetails) {
      setPromocode(promocodeStatisticsDetails.sCode ? promocodeStatisticsDetails.sCode : '')
    }
  }, [promocodeStatisticsDetails])

  function onHandleSearch (e, value) {
    if (e.key === 'Enter') {
      e.preventDefault()
    } else {
      setSearchText(value)
      setinitialFlag(true)
    }
  }

  function onHandleRecommendedSearch (e, value) {
    if (e.key === 'Enter') {
      e.preventDefault()
    }
    if (isNumber(value)) {
      setUserSearch(parseInt(value))
      setIsNumber(true)
    } else {
      setUserSearch(value)
      setIsNumber(false)
    }
  }

  function getList (start, limit, sort, order, search) {
    if (id) {
      let searchData
      if (searchText) {
        if (IsNumber) {
          const data = recommendedList?.length > 0 && recommendedList.find(rec => rec.sMobNum === search)
          searchData = data._id
        } else {
          const data = recommendedList?.length > 0 && recommendedList.find(rec => rec.sEmail === search)
          searchData = data._id
        }
      }
      const Search = (searchData || search)
      dispatch(getPromocodeStatisticsDetails(start, limit, sort, order, Search, id, token))
    }
  }

  function onGetRecommendedList (data, sendId) {
    dispatch(getRecommendedList(data, sendId, token))
  }

  return (
    <div>
      <Layout {...props} >
        <main className="main-content">
          <section className="management-section common-box">
            <MainHeading
              export="Export"
              heading={`Promocode Usage Statistics ${Promocode && '(' + Promocode + ')'}`}
              list={promocodeStatisticsDetails}
              onExport={onExport}
              onRefresh={onRefresh}
              permission={(Auth && Auth === 'SUPER') || (adminPermission?.PROMO !== 'R')}
              promocodeStatistics
              refresh="Refresh"
            />
            <div className={promocodeStatisticsDetails ? 'without-pagination' : 'setting-component'}>
              <Heading
                {...props}
                PromoUsage={PromoUsage}
            // list={promocodeStatisticsDetails}
                TotalBonusGiven={TotalBonusGiven}
                handleChangeSearchStatistics={onHandleSearch}
                handleRecommendedSearchStatistics={onHandleRecommendedSearch}
                permission={(Auth && Auth === 'SUPER') || (adminPermission?.PROMO !== 'R')}
                promocodeStatistics
                recommendedList={recommendedList}
                search={search}
                userSearch={userSearch}
              />
              <PromoCodeStatisticsComponent
                {...props}
                ref={content}
                PromoUsage={PromoUsage}
                TotalBonusGiven={TotalBonusGiven}
                flag={initialFlag}
                getList={getList}
                handleChangeSearch={onHandleSearch}
                handleRecommendedSearch={onHandleRecommendedSearch}
                isComplainSearch
                promocodeStatisticsDetails={promocodeStatisticsDetails}
                recommendedList={recommendedList}
                search={searchText}
                setPromoUsage={setPromoUsage}
                setSearch={setSearch}
                setTotalBonusGiven={setTotalBonusGiven}
                userSearch={userSearch}
              />
            </div>
          </section>
        </main>
      </Layout>
    </div>
  )
}

PromocodeStatistics.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object
}

export default PromocodeStatistics
