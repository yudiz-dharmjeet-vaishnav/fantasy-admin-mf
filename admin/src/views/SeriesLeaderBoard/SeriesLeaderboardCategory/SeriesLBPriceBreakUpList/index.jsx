import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import Layout from '../../../../components/Layout'
import SeriesLBHeader from '../../Header/SeriesLBHeader'
import SeriesLBPriceBreakUpList from './SeriesPriceBreakupList'
import { getLBCategoryDetails, listOfSeriesLBPrizeBreakup } from '../../../../actions/seriesLeaderBoard'

function SeriesLeaderBoardPriceBreakup (props) {
  const { id, id2 } = useParams()
  const [showInputFields, setShowInputFields] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const token = useSelector(state => state.auth.token)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const seriesLBPrizeBreakUpList = useSelector(state => state.seriesLeaderBoard.seriesLBPrizeBreakUpList)
  const dispatch = useDispatch()

  useEffect(() => {
    getList(id2)
    dispatch(getLBCategoryDetails(id2, token))
  }, [])

  function getList (seriesID) {
    dispatch(listOfSeriesLBPrizeBreakup(seriesID, token))
  }

  function addPrizeBreakup (errorToggle) {
    if (isEdit) {
      if (errorToggle) {
        setIsEdit(true)
      } else {
        setIsEdit(false)
      }
    }
    if (errorToggle) {
      setShowInputFields(true)
    } else {
      setShowInputFields(!showInputFields)
    }
  }

  return (
    <div>
      <Layout {...props} >
        <main className="main-content">
          <section className="management-section common-box">
            <SeriesLBHeader
              addButton
              addPrizeBreakup={addPrizeBreakup}
              buttonText="Add Series Prize BreakUp"
              heading="Series Prize Breakup List"
              permission={(Auth && Auth === 'SUPER') || (adminPermission?.SERIES_LEADERBOARD !== 'R')}
              seriesLBCategoryLink={`/seriesLeaderBoardCategory/${id}`}
            />
            <div className='without-pagination'>
              <SeriesLBPriceBreakUpList
                {...props}
                List={seriesLBPrizeBreakUpList}
                addPrizeBreakup={addPrizeBreakup}
                getList={getList}
                isEdit={isEdit}
                setIsEdit={setIsEdit}
                setShowInputFields={setShowInputFields}
                showInputFields={showInputFields}
              />
            </div>
          </section>
        </main>
      </Layout>
    </div>
  )
}

SeriesLeaderBoardPriceBreakup.propTypes = {
  match: PropTypes.object
}

export default SeriesLeaderBoardPriceBreakup
