import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'

import NoDataFound from '../../../../assets/images/no_data_found.svg'

import Match from './Match'
import SkeletonTable from '../../../../components/SkeletonTable'

const LiveMatches = (props) => {
  const { getList, List, getMatchesTotalCountFunc, sportsType, url } = props

  const location = useLocation()

  const [liveMatches, setLiveMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [start, setStart] = useState(0)
  const [count, setCount] = useState(0)
  const liveMatchesTotalCount = useSelector(state => state.match.matchesTotalCount)
  const matchStatus = useSelector(state => state.match.matchStatusLive)
  const previousProps = useRef({ List, matchStatus, liveMatchesTotalCount }).current
  const isPageChanging = useRef(false)

  useEffect(() => {
    getList(0, 50, 'dCreatedAt', 'desc', '', 'L', '', '', '', '', '')
    setLiveMatches([])

    return () => {
      setStart(0)
      isPageChanging.current = true
    }
  }, [location.pathname])

  useEffect(() => {
    if (matchStatus === 'L') {
      setCount(liveMatchesTotalCount?.count)
    }
  }, [liveMatchesTotalCount])

  useEffect(() => {
    getMatchesTotalCountFunc('L', '', '', '', '', '', '')
    setLoading(true)
  }, [sportsType])

  useEffect(() => {
    if (location?.pathname?.includes('/matches-app-view')) {
      localStorage.setItem('AppView', true)
    }
  }, [location])

  useEffect(() => {
    if ((previousProps.List !== List) && matchStatus === 'L') {
      setLiveMatches([...liveMatches, ...List?.results])
      setLoading(false)
    }
    return () => {
      previousProps.List = List
      previousProps.matchStatus = matchStatus
    }
  }, [List, matchStatus])

  function handleScroll (e) {
    // match listing pagination
    const element = e?.target
    if (element.scrollHeight - element.scrollTop - element.clientHeight <= 0) {
      if (liveMatches && (count >= (start + 50))) {
        setStart(start + 50)
        getList(isPageChanging.current ? (start + 50) : 0, 50, 'dCreatedAt', 'desc', '', 'L', '', '', '', '', '')
        isPageChanging.current = false
      }
    }
  }

  return (
    <>
      <div className='match-app-heading'>
        <h2 className='text-center'>Live</h2>
      </div>
      <div className='home-container'>
        <div onScroll={!loading && handleScroll} style={{ overflow: 'scroll', height: '100%' }}>
          {loading
            ? <SkeletonTable matchView numberOfColumns={5}/>
            : (
              <Fragment>
                {liveMatches && liveMatches.length !== 0 && liveMatches.map((data, i) => {
                  return (
                    <div key={i}>
                      <Match {...props} key={i} data={data} url={url}/>
                    </div>
                  )
                }
                )
              }
                {
                liveMatches && !liveMatches.length && (
                <div className="no-team d-flex align-items-center justify-content-center">
                  <div>
                    <img src={NoDataFound} />
                    <h6>No match found</h6>
                  </div>
                </div>
                )
              }
              </Fragment>
              )
          }
        </div>
      </div>
    </>
  )
}

LiveMatches.propTypes = {
  getList: PropTypes.func,
  List: PropTypes.object,
  getMatchesTotalCountFunc: PropTypes.func,
  sportsType: PropTypes.string,
  location: PropTypes.object,
  url: PropTypes.string
}

LiveMatches.displayName = LiveMatches

export default LiveMatches
