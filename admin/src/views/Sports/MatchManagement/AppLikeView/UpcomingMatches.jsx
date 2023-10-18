import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'

import NoDataFound from '../../../../assets/images/no_data_found.svg'

import Match from './Match'
import SkeletonTable from '../../../../components/SkeletonTable'

const UpcomingMatches = (props) => {
  const { getList, List, getMatchesTotalCountFunc, sportsType, url } = props

  const location = useLocation()

  const [upcomingMatches, setUpcomingMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [start, setStart] = useState(0)
  const [count, setCount] = useState(0)
  const upcomingMatchesTotalCount = useSelector(state => state.match.matchesTotalCount)
  const matchStatus = useSelector(state => state.match.matchStatus)
  const previousProps = useRef({ List, matchStatus, upcomingMatchesTotalCount }).current
  const isPageChanging = useRef(false)

  useEffect(() => {
    getList(0, 50, 'dCreatedAt', 'desc', '', 'U', '', '', '', '', '')
    setUpcomingMatches([])

    return () => {
      setStart(0)
      isPageChanging.current = true
    }
  }, [location.pathname])

  useEffect(() => {
    if (matchStatus === 'U') {
      setCount(upcomingMatchesTotalCount?.count)
    }
  }, [upcomingMatchesTotalCount])

  useEffect(() => {
    getMatchesTotalCountFunc('U', '', '', '', '', '', '')
    setLoading(true)
  }, [sportsType])

  useEffect(() => {
    if (location?.pathname?.includes('/matches-app-view')) {
      localStorage.setItem('AppView', true)
    }
  }, [location])

  useEffect(() => {
    if ((previousProps.List !== List)) {
      setUpcomingMatches([...upcomingMatches, ...List?.results])
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
      if (upcomingMatches && (count >= (start + 50))) {
        setStart(start + 50)
        getList(isPageChanging.current ? (start + 50) : 0, 50, 'dCreatedAt', 'desc', '', 'U', '', '', '', '', '')
        isPageChanging.current = false
      }
    }
  }

  return (
    <>
      <div className='match-app-heading'>
        <h2 className='text-center'>Upcoming</h2>
      </div>
      <div className='home-container'>
        <div onScroll={!loading && handleScroll} style={{ overflow: 'scroll', height: '100%' }}>
          {loading
            ? <SkeletonTable matchView numberOfColumns={5}/>
            : (
              <Fragment>
                {upcomingMatches && upcomingMatches.length !== 0 && upcomingMatches.map((data, i) => {
                  return (
                    <div key={i}>
                      <Match {...props} key={i} data={data} url={url}/>
                    </div>
                  )
                }
                )
              }
                {
                upcomingMatches && !upcomingMatches.length && (
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

UpcomingMatches.propTypes = {
  getList: PropTypes.func,
  List: PropTypes.object,
  getMatchesTotalCountFunc: PropTypes.func,
  sportsType: PropTypes.string,
  location: PropTypes.object,
  url: PropTypes.string
}

export default UpcomingMatches
