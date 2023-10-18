import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { useLocation } from 'react-router-dom'

import NoDataFound from '../../../../assets/images/no_data_found.svg'

import Match from './Match'
import SkeletonTable from '../../../../components/SkeletonTable'

const InReviewMatches = (props) => {
  const { getList, List, getMatchesTotalCountFunc, sportsType, url } = props
  const location = useLocation()
  const [inReviewMatches, setInReviewMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [start, setStart] = useState(0)
  const [count, setCount] = useState(0)
  const inReviewMatchesTotalCount = useSelector(state => state.match.matchesTotalCount)
  const matchStatus = useSelector(state => state.match.matchStatusInReview)
  const previousProps = useRef({ List, matchStatus, inReviewMatchesTotalCount, start }).current
  const isPageChanging = useRef(false)
  useEffect(() => {
    getList(0, 50, 'dCreatedAt', 'desc', '', 'I', '', '', '', '', '')
    setInReviewMatches([])

    return () => {
      setStart(0)
      isPageChanging.current = true
    }
  }, [location.pathname])

  useEffect(() => {
    if (matchStatus === 'I') {
      setCount(inReviewMatchesTotalCount?.count)
    }
  }, [inReviewMatchesTotalCount])

  useEffect(() => {
    getMatchesTotalCountFunc('I', '', '', '', '', '', '')
    setLoading(true)
  }, [sportsType])

  useEffect(() => {
    if (location?.pathname?.includes('/matches-app-view')) {
      localStorage.setItem('AppView', true)
    }
  }, [location])

  useEffect(() => {
    if ((previousProps.List !== List)) {
      setInReviewMatches([...inReviewMatches, ...List?.results])
      setLoading(false)
    }
    return () => {
      previousProps.List = List
      previousProps.matchStatus = matchStatus
    }
  }, [List, matchStatus])

  function handleScroll (e) {
    const element = e?.target
    if (element.scrollHeight - element.scrollTop - element.clientHeight <= 0) {
      if (inReviewMatches?.length && (count >= (start + 50))) {
        setStart(start + 50)
        getList(isPageChanging.current ? (start + 50) : 0, 50, 'dCreatedAt', 'desc', '', 'I', '', '', '', '', '')
        isPageChanging.current = false
      }
    }
  }

  return (
    <>
      <div className='match-app-heading'>
        <h2 className='text-center'>In Review</h2>
      </div>
      <div className='home-container'>
        <div onScroll={!loading && handleScroll} style={{ overflow: 'scroll', height: '100%' }}>
          {loading
            ? <SkeletonTable matchView numberOfColumns={5}/>
            : (
              <Fragment>
                {inReviewMatches && inReviewMatches.length !== 0 && inReviewMatches.map((data, i) => {
                  return (
                    <div key={i}>
                      <Match {...props} key={i} data={data} url={url}/>
                    </div>
                  )
                })
                }
                {
                inReviewMatches && !inReviewMatches.length && (
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

InReviewMatches.propTypes = {
  getList: PropTypes.func,
  List: PropTypes.object,
  getMatchesTotalCountFunc: PropTypes.func,
  sportsType: PropTypes.string,
  location: PropTypes.object,
  url: PropTypes.string
}

export default InReviewMatches
