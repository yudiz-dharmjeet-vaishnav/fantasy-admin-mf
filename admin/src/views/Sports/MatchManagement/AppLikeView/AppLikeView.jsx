import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { Col, Row } from 'reactstrap'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'

import UpcomingMatches from './UpcomingMatches'
import LiveMatches from './LiveMatches'
import InReviewMatches from './InReviewMatches'

const AppLikeView = forwardRef((props, ref) => {
  const { getList, getListInReview, List, LiveMatchList, getListLive, inReview, getMatchesTotalCountFunc, sportsType, getMediaUrlFunc, location } = props
  const [url, setUrl] = useState('')
  const getUrlLink = useSelector(state => state.url.getUrl)

  useEffect(() => {
    getMediaUrlFunc()
  }, [sportsType])

  useEffect(() => {
    if (location?.pathname?.includes('/matches-app-view')) {
      localStorage.setItem('AppView', true)
    }
  }, [location])

  useEffect(() => {
    if (getUrlLink) {
      setUrl(getUrlLink)
    }
  }, [getUrlLink])

  function getMatchCounts () {
    // call MatchesTotalCount for U=Upcoming, L="Live", I="In-Review"
    getMatchesTotalCountFunc('U', '', '', '', '', '', '')
    getMatchesTotalCountFunc('L', '', '', '', '', '', '')
    getMatchesTotalCountFunc('I', '', '', '', '', '', '')
  }

  function onRefresh () {
    getMatchCounts()
  }

  useImperativeHandle(ref, () => ({
    onRefresh
  }))

  return (
    <Row className='match-app-box'>
      <Col className='custom-box' lg='4'>
        <UpcomingMatches
          List={List}
          getList={getList}
          getMatchesTotalCountFunc={getMatchesTotalCountFunc}
          sportsType={sportsType}
          url={url}
        />
      </Col>
      <Col className='custom-box' lg='4'>
        <LiveMatches
          List={LiveMatchList}
          getList={getListLive}
          getMatchesTotalCountFunc={getMatchesTotalCountFunc}
          sportsType={sportsType}
          url={url}
        />
      </Col>
      <Col className='custom-box inreview' lg='4'>
        <InReviewMatches
          List={inReview}
          getList={getListInReview}
          getMatchesTotalCountFunc={getMatchesTotalCountFunc}
          sportsType={sportsType}
          url={url}
        />
      </Col>
    </Row>
  )
})

AppLikeView.propTypes = {
  getList: PropTypes.func,
  List: PropTypes.object,
  matchStatus: PropTypes.string,
  getMatchesTotalCountFunc: PropTypes.func,
  sportsType: PropTypes.string,
  location: PropTypes.object,
  getMediaUrlFunc: PropTypes.func,
  getListInReview: PropTypes.func,
  getListLive: PropTypes.func,
  inReview: PropTypes.array,
  LiveMatchList: PropTypes.array
}

AppLikeView.displayName = AppLikeView

export default AppLikeView
