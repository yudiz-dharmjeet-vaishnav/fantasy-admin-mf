import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Button } from 'reactstrap'
import { useQueryState } from 'react-router-use-location-state'
import { Link, useLocation } from 'react-router-dom'
import qs from 'query-string'
import PropTypes from 'prop-types'

import AlertMessage from '../../../../components/AlertMessage'
import DataNotFound from '../../../../components/DataNotFound'
import SkeletonTable from '../../../../components/SkeletonTable'
import PaginationComponent from '../../../../components/PaginationComponent'

function ExtraWinList (props) {
  const { getExtraWinListFunc } = props
  const location = useLocation()
  const [start, setStart] = useState(0)
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState([])
  const [modalMessage, setModalMessage] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [total, setTotal] = useState(0)
  const [index, setIndex] = useState(1)
  const [listLength, setListLength] = useState('10 Rows')
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)

  const extraWinListData = useSelector(state => state.match.extraWinListData)
  const resMessage = useSelector(state => state.match.resMessage)
  const resStatus = useSelector(state => state.match.resStatus)

  const previousProps = useRef({ extraWinListData, resMessage, resStatus, start, offset }).current
  const paginationFlag = useRef(false)

  const obj = qs.parse(location.search)

  useEffect(() => {
    if (location.state) {
      if (location.state.message) {
        setMessage(location.state.message)
        setStatus(true)
        setModalMessage(true)
      }
    }
    let page = 1
    let limit = offset
    if (obj) {
      if (obj.page) {
        page = obj.page
        setPageNo(page)
      }
      if (obj.pageSize) {
        limit = obj.pageSize
        setOffset(limit)
        setListLength(`${limit} Rows`)
      }
    }
    const startFrom = (page - 1) * offset
    getExtraWinListFunc(startFrom, limit)
    setLoading(true)
  }, [])

  // set extraWinListData
  useEffect(() => {
    if (previousProps.extraWinListData !== extraWinListData) {
      if (extraWinListData) {
        if (extraWinListData.aUserLeague) {
          const length = extraWinListData.aUserLeague.length
          const startFrom = ((activePageNo - 1) * offset) + 1
          const end = (startFrom - 1) + length
          setStartingNo(startFrom)
          setEndingNo(end)
        }
        setList(extraWinListData.aUserLeague ? extraWinListData.aUserLeague : [])
        setIndex(activePageNo)
        setTotal(extraWinListData.nTotal ? extraWinListData.nTotal : 0)
      }
      setLoading(false)
    }

    return () => {
      previousProps.extraWinListData = extraWinListData
    }
  }, [extraWinListData])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        setMessage(resMessage)
        setStatus(resStatus)
        setLoading(false)
        if (resStatus) {
          setModalMessage(false)
        } else {
          setModalMessage(true)
        }
      }
    }

    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  useEffect(() => {
    if ((previousProps.start !== start || previousProps.offset !== offset) && paginationFlag.current) {
      getExtraWinListFunc(start, offset)
      setLoading(true)
    }
    return () => {
      previousProps.start = start
      previousProps.offset = offset
    }
  }, [start, offset])

  return (
    <>

      <AlertMessage
        close={close}
        message={message}
        modalMessage={modalMessage}
        status={status}
      />
      {
      !loading && list?.length === 0
        ? (
          <DataNotFound message="No Extrawin" obj={obj}/>
          )
        : (
          <div className='table-represent'>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>League</th>
                    <th>Extra Win</th>
                    <th>User</th>
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? <SkeletonTable numberOfColumns={4} />
                    : (
                      <Fragment>
                        {
                    list && list.length !== 0 &&
                    list.map((data, i) => {
                      return (
                        <tr key={data._id}>
                          <td>{(((index - 1) * offset) + (i + 1))}</td>
                          <td>{data?.iMatchLeagueId?.sName}</td>
                          <td>
                            {data?.aExtraWin?.map((item, index) => {
                              const str = item.sInfo
                              const str2 = data?.aExtraWin?.length === index + 1 ? '' : ', '
                              return str + str2
                            })}
                          </td>
                          <td>
                            <Button
                              className="view"
                              color="total-text-link"
                              tag={Link}
                              to={data?.iuserId?.eType === 'U' ? `/users/user-management/user-details/${data?.iUserId?._id}` : `/users/system-user/system-user-details/${data?.iUserId?._id}`}
                            >
                              {data?.iUserId?.sUsername || '--'}
                            </Button>
                          </td>
                        </tr>
                      )
                    })
                  }
                      </Fragment>
                      )
            }
                </tbody>
              </table>
            </div>
          </div>
          )}

      {
     list?.length !== 0 && (
     <PaginationComponent
       activePageNo={activePageNo}
       endingNo={endingNo}
       listLength={listLength}
       offset={offset}
       paginationFlag={paginationFlag}
       setListLength={setListLength}
       setLoading={setLoading}
       setOffset={setOffset}
       setPageNo={setPageNo}
       setStart={setStart}
       startingNo={startingNo}
       total={total}
     />
     )}
    </>
  )
}

ExtraWinList.propTypes = {
  getExtraWinListFunc: PropTypes.func,
  location: PropTypes.object
}

export default ExtraWinList
