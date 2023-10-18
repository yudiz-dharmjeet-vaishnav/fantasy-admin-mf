import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import Layout from '../../../components/Layout'
import LeagueHeader from '../../Leagues/Header/LeagueHeader'
import SeriesLeaderBoardCategory from './SeriesLeaderBoardCategory'
import MainLeagueHeader from '../../Leagues/MainHeader/MainLeagueHeader'
import { getSeriesCount, getSeriesLBCategoryList, getSeriesLeaderBoardDetails, PrizeCalculate, WinPrizeDistribution } from '../../../actions/seriesLeaderBoard'

function SeriesLBCategory (props) {
  const { id } = useParams()
  const token = useSelector(state => state.auth.token)
  const seriesLBCategoryList = useSelector(state => state.seriesLeaderBoard.seriesLBCategoryList)?.sort((a, b) => a.nMaxRank - b.nMaxRank)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const dispatch = useDispatch()
  const [prizeCalculateFlag, setPrizeCalculateFlag] = useState(false)
  const [winPrizeCalculateFlag, setWinPrizeCalculateFlag] = useState(false)
  const [prizeCalculateInterval, setPrizeCalculateInterval] = useState({})
  const [winPrizeCalculateInterval, setWinPrizeCalculateInterval] = useState({})
  const seriesCount = useSelector(state => state.seriesLeaderBoard.seriesCount)

  useEffect(() => {
    if (id) {
      dispatch(getSeriesLeaderBoardDetails(id, token))
    }
  }, [])

  function getList () {
    dispatch(getSeriesLBCategoryList(id, token))
  }

  useEffect(() => {
    if (seriesCount) {
      if (seriesCount?.nPrizeCalculatedCategory === seriesCount?.nSeriesCategoryCount) {
        setPrizeCalculateFlag(false)
        clearInterval(prizeCalculateInterval)
      }
      if (seriesCount?.nWinDistributedCategory === seriesCount?.nSeriesCategoryCount) {
        setWinPrizeCalculateFlag(false)
        clearInterval(winPrizeCalculateInterval)
      }
    }
  }, [seriesCount])

  useEffect(() => {
    if (prizeCalculateFlag) {
      const intervalPriceCalculate = setInterval(() => {
        leagueCountFunc()
      }, 2000)
      setPrizeCalculateInterval(intervalPriceCalculate)
    }
  }, [prizeCalculateFlag])

  useEffect(() => {
    if (winPrizeCalculateFlag) {
      const intervalWinPrizeCalculate = setInterval(() => {
        leagueCountFunc()
      }, 2000)
      setWinPrizeCalculateInterval(intervalWinPrizeCalculate)
    }
  }, [winPrizeCalculateFlag])

  function prizeDistributionFunc () {
    setPrizeCalculateFlag(true)
    dispatch(PrizeCalculate(id, token))
    if (id) {
      dispatch(getSeriesLeaderBoardDetails(id, token))
    }
  }

  function winPrizeDistributionFunc () {
    setWinPrizeCalculateFlag(true)
    dispatch(WinPrizeDistribution(id, token))
    if (id) {
      dispatch(getSeriesLeaderBoardDetails(id, token))
    }
  }

  function leagueCountFunc () {
    dispatch(getSeriesCount(id, token))
  }

  return (
    <div>
      <Layout {...props} >
        <main className="main-content">
          <section className="management-section common-box">
            <MainLeagueHeader
              addButton
              backUrl={`/seriesLeaderBoard/edit-SeriesLeaderBoard/${id}`}
              buttonText="Add Series Category"
              heading="Series LeaderBoard Category"
              permission={(Auth && Auth === 'SUPER') || (adminPermission?.SERIES_LEADERBOARD !== 'R')}
              prizeDistributionFunc={prizeDistributionFunc}
              seriesDetails
              seriesLeaderBoard
              setUrl={`/seriesLeaderBoardCategory/add-SeriesLeaderBoardCategory/${id}`}
              winPrizeDistributionFunc={winPrizeDistributionFunc}
            />
            <div className='without-pagination' >
              <LeagueHeader
                {...props}
                SearchPlaceholder="Search Series Leader Board Category"
                calculate
                hidden
                league
                prizeDistributionFunc={prizeDistributionFunc}
                winPrizeDistributionFunc={winPrizeDistributionFunc}
              />
              <SeriesLeaderBoardCategory
                {...props}
                getList={getList}
                leaderBoardUrl={`/seriesLeaderBoardCategory/seriesLeaderBoardUserRanks/${id}`}
                leagueCountFunc={leagueCountFunc}
                list={seriesLBCategoryList}
                prizeBreakupUrl={`/seriesLeaderBoardCategory/seriesLBpricebreakup-list/${id}`}
                prizeCalculateFlag={prizeCalculateFlag}
                updateSeriesCategory={`/seriesLeaderBoardCategory/edit-SeriesLeaderBoardCategory/${id}`}
                winPrizeCalculateFlag={winPrizeCalculateFlag}
              />
            </div>
          </section>
        </main>
      </Layout>
    </div>
  )
}

SeriesLBCategory.propTypes = {
  match: PropTypes.object
}

export default SeriesLBCategory
