import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import Navbar from '../../../../../components/Navbar'
import AddSeriesLBPrizeBreakUp from './AddSeriesLBPriceBreakup'
import { addSeriesLBPriceBreakup, getSeriesLBPrizeBreakup, updateSeriesLBPriceBreakup } from '../../../../../actions/seriesLeaderBoard'

function AddSeriesPrizeBreakup (props) {
  const { id, id2, id3 } = useParams()
  const token = useSelector(state => state.auth.token)
  const [seriesLBCategoryID, setSeriesLBCategoryID] = useState('')
  const [PriceBreakupId, setPriceBreakupId] = useState('')
  const dispatch = useDispatch()
  const seriesLeaderBoardPrizeBreakupDetails = useSelector(state => state.seriesLeaderBoard.seriesLeaderBoardPrizeBreakupDetails)

  function addSeriesLBPriceBreakUpFunc (Prize, RankFrom, RankTo, RankType, Info, Image) {
    const addSeriesLBPriceBreakUpData = {
      Prize, RankFrom, RankTo, RankType, Image, Info, seriesLBCategoryID, token
    }
    dispatch(addSeriesLBPriceBreakup(addSeriesLBPriceBreakUpData))
  }
  function updateSeriesLBPriceBreakUpFunc (Prize, RankFrom, RankTo, RankType, Info, Image) {
    const updateSeriesLBPriceBreakUpData = {
      Prize, RankFrom, RankTo, RankType, Info, Image, seriesLBCategoryID, PriceBreakupId, token
    }
    dispatch(updateSeriesLBPriceBreakup(updateSeriesLBPriceBreakUpData))
  }

  useEffect(() => {
    if (id2 && id3) {
      dispatch(getSeriesLBPrizeBreakup(id2, id3, token))
      setPriceBreakupId(id3)
    }
    setSeriesLBCategoryID(id2)
  }, [])

  return (
    <Fragment>
      <Navbar {...props} />
      <AddSeriesLBPrizeBreakUp
        {...props}
        AddSeriesPriceBreakup={addSeriesLBPriceBreakUpFunc}
        UpdateSeriesPriceBreakup={updateSeriesLBPriceBreakUpFunc}
        cancelLink={`/seriesLeaderBoardCategory/seriesLBpricebreakup-list/${id}/${id2}`}
        seriesLeaderBoardPrizeBreakupDetails={seriesLeaderBoardPrizeBreakupDetails}
      />
    </Fragment>
  )
}

AddSeriesPrizeBreakup.propTypes = {
  match: PropTypes.object
}

export default AddSeriesPrizeBreakup
