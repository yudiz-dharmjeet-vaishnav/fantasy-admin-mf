import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import Layout from '../../../../components/Layout'
import SeriesLeaderBoardUserRankList from './SeriesLeaderBoardUserRankList'
import MainLeagueHeader from '../../../Leagues/MainHeader/MainLeagueHeader'
import { getSeriesLeaderBoardUserRankList } from '../../../../actions/seriesLeaderBoard'

function SeriesLeaderBoardUserRank (props) {
  const { id, id2 } = useParams()
  const token = useSelector(state => state.auth.token)
  const [Id, setID] = useState('')
  const seriesLeaderBoardUserRankList = useSelector(state => state.seriesLeaderBoard.seriesLeaderBoardUserRankList)
  const dispatch = useDispatch()
  const content = useRef()

  useEffect(() => {
    if (id) {
      setID(id)
    }
  }, [])

  function getList (start, limit, isFullList) {
    if (id2) {
      const data = {
        start, limit, isFullList, categoryId: id2, token
      }
      dispatch(getSeriesLeaderBoardUserRankList(data))
    }
  }

  function onExport () {
    content.current.onExport()
  }

  return (
    <div>
      <Layout {...props} >
        <main className="main-content">
          <section className="management-section common-box">
            <MainLeagueHeader
              backUrl={`/seriesLeaderBoardCategory/${Id}`}
              export="Export"
              heading="Leader Board"
              hidden
              list={seriesLeaderBoardUserRankList}
              onExport={onExport}
              seriesLBCategory
            />
            <div className={seriesLeaderBoardUserRankList?.total !== 0 ? 'without-pagination' : 'setting-component'}>
              <SeriesLeaderBoardUserRankList
                {...props}
                ref={content}
                List={seriesLeaderBoardUserRankList}
                getList={getList}
              />
            </div>
          </section>
        </main>
      </Layout>
    </div>
  )
}

SeriesLeaderBoardUserRank.propTypes = {
  match: PropTypes.object
}

export default SeriesLeaderBoardUserRank
