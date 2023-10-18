import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import Layout from '../../../components/Layout'
import AddPrizeBreakUp from './AddPrizeBreakUp'
import { addLeaguePrice, getLeagueDetails, getLeaguePriceDetails, updateLeaguePrice } from '../../../actions/league'

function AddLeaguePrizeBreakup (props) {
  const { id1, id2 } = useParams()
  const token = useSelector(state => state.auth.token)
  const LeaguePriceDetails = useSelector(state => state.league.LeaguePriceDetails)
  const LeagueDetails = useSelector(state => state.league.LeagueDetails)
  const [leaguePrize, setleaguePrize] = useState('')
  const [PriceBreakupId, setPriceBreakupId] = useState('')
  const dispatch = useDispatch()

  useEffect(() => {
    if (id1 && id2) {
      getLeaguePriceBreakupDetails()
    }
    if (id1) {
      getLeagueDetailsFunc()
    }
    setleaguePrize(id1)
  }, [])

  function AddNewLeaguePrice (price, rFrom, rTo, rType, extra, PrizeBreakupImage) {
    const addLeaguePriceData = {
      price, rFrom, rTo, rType, extra, PrizeBreakupImage, ID: leaguePrize, token
    }
    dispatch(addLeaguePrice(addLeaguePriceData))
  }
  function UpdateLeaguePricefun (price, rFrom, rTo, rType, extra, PrizeBreakupImage) {
    const updateLeaguePriceData = {
      price, rFrom, rTo, rType, extra, PrizeBreakupImage, ID1: leaguePrize, ID2: PriceBreakupId, token
    }
    dispatch(updateLeaguePrice(updateLeaguePriceData))
  }

  function getLeaguePriceBreakupDetails () {
    dispatch(getLeaguePriceDetails(id1, id2, token))
    setPriceBreakupId(id2)
  }

  function getLeagueDetailsFunc () {
    dispatch(getLeagueDetails(id1, token))
  }

  return (
    <Fragment>
      <Layout {...props} >
        <AddPrizeBreakUp
          {...props}
          AddNewLeaguePrice={AddNewLeaguePrice}
          LeagueDetails={LeagueDetails}
          LeaguePriceDetails={LeaguePriceDetails}
          UpdateLeaguePrice={UpdateLeaguePricefun}
          cancelLink={`/league/league-Prize/${leaguePrize}`}
          getLeagueDetailsFunc={getLeagueDetailsFunc}
          getLeaguePriceBreakupDetails={getLeaguePriceBreakupDetails}
        />
      </Layout>
    </Fragment>
  )
}

AddLeaguePrizeBreakup.propTypes = {
  match: PropTypes.object
}

export default AddLeaguePrizeBreakup
