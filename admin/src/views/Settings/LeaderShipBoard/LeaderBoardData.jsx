import React, { useEffect, useRef, useState, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useQuery } from '@tanstack/react-query'

import noImage from '../../../assets/images/no-image-1.svg'

import Loading from '../../../components/Loading'
import AlertMessage from '../../../components/AlertMessage'
import DataNotFound from '../../../components/DataNotFound'
import SkeletonTable from '../../../components/SkeletonTable'
import { modalMessageFunc } from '../../../helpers/helper'

import getLeadershipBoard from '../../../api/leaderBoardData/getLeadershipBoard'
import { getUrl } from '../../../actions/url'

const LeaderBoardData = (props) => {
  const { isOpen, setSeasonErr, seasonInput, setLoading, adminPermission, seasonIds, setSeasonList, seasonList, setMessage, setModalMessage, message, close, setClose, status, setStatus, modalMessage } = props
  const dispatch = useDispatch('')
  const [url, setUrl] = useState('')
  const [allTimeData, setAllTimeData] = useState([])
  const [monthlyData, setMonthlyData] = useState([])
  const [seasonData, setSeasonData] = useState([])
  // const token = useSelector(state => state.auth.token)
  const resStatus = useSelector(state => state?.leaderboard?.resStatus)
  const resMessage = useSelector(state => state?.leaderboard?.resMessage)
  const calculatedLeaderBoardData = useSelector(state => state?.leaderboard?.calculatedLeaderBoardData)
  const getUrlLink = useSelector(state => state?.url?.getUrl)

  const { data: leaderBoardData, isLoading } = useQuery({
    queryKey: ['getLeaderBoardData'],
    queryFn: () => getLeadershipBoard(),
    select: (res) => res?.data?.data
  })

  const previousProps = useRef({ leaderBoardData, calculatedLeaderBoardData, resMessage, resStatus, seasonInput }).current
  useEffect(() => {
    setLoading(true)
    if (!getUrlLink && !url) {
      dispatch(getUrl('media'))
    }
  }, [])

  useEffect(() => {
    !url && setUrl(getUrlLink)
  }, [getUrlLink])

  // for set Leader Board Data
  useEffect(() => {
    if (leaderBoardData) {
      leaderBoardData?.oAllTimeData && setAllTimeData(leaderBoardData?.oAllTimeData)
      leaderBoardData?.oMonthData && setMonthlyData(leaderBoardData?.oMonthData)
      leaderBoardData?.aSeasonData && setSeasonData(leaderBoardData?.aSeasonData)
      setLoading(false)
    }
  }, [leaderBoardData])

  useEffect(() => {
    if (previousProps?.calculatedLeaderBoardData !== calculatedLeaderBoardData) {
      if (calculatedLeaderBoardData) {
        calculatedLeaderBoardData?.oAllTimeData && setAllTimeData(calculatedLeaderBoardData?.oAllTimeData)
        calculatedLeaderBoardData?.oMonthData && setMonthlyData(calculatedLeaderBoardData?.oMonthData)
        calculatedLeaderBoardData?.aSeasonData && setSeasonData(calculatedLeaderBoardData?.aSeasonData)
        setLoading(false)
      }
    }
    return () => {
      previousProps.calculatedLeaderBoardData = calculatedLeaderBoardData
    }
  }, [calculatedLeaderBoardData])

  // to set season list
  useEffect(() => {
    if (seasonIds) {
      !seasonIds && setSeasonErr('')
      const arr = [...seasonList]
      if (seasonIds && seasonIds?.aResult?.length !== 0) {
        seasonIds?.aResult?.map((data) => {
          const obj = {
            value: data?._id,
            label: data?.sName + '(' + data?.eCategory + ')'
          }
          arr?.push(obj)
          return arr
        })
        setSeasonList(arr)
      }
    }
    return () => {
      previousProps.seasonIds = seasonIds
    }
  }, [seasonIds])

  // to handle response
  useEffect(() => {
    if (previousProps?.resMessage !== resMessage) {
      if (resMessage) {
        setMessage(resMessage)
        setStatus(resStatus)
        if (resStatus) {
          setModalMessage(true)
        }
        setLoading(false)
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  // will be called when something searched
  useEffect(() => {
    setSeasonList([])
    const callSearchService = () => {
    }
    if (seasonInput) {
      if (previousProps?.seasonInput !== seasonInput) {
        const debouncer = setTimeout(() => {
          callSearchService()
        }, 1000)
        return () => {
          clearTimeout(debouncer)
          previousProps.seasonInput = seasonInput
        }
      }
    }
    // if (!seasonInput) {
    //   getSeasonIds(0, 10, seasonInput, token)
    // }
    return () => {
      previousProps.seasonInput = seasonInput
    }
  }, [seasonInput])

  return (
    <div>
      {isLoading && <Loading />}
      <AlertMessage
        close={close}
        message={message}
        modalMessage={modalMessage}
        status={status}
      />
      {isOpen === 'ALL_TIME' && (
      <>
        {
      !isLoading && allTimeData?.aData?.length === 0
        ? (<DataNotFound message="Data" obj=""/>)
        : (
          <div className='table-represent'>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Profile Pic</th>
                    <th>Name</th>
                    <th>Username</th>
                    <th>User Type</th>
                    <th>User Rank</th>
                    <th>Total Join League</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading
                    ? <SkeletonTable numberOfColumns={7} />
                    : (
                      <Fragment>
                        {
                      allTimeData && allTimeData?.length !== 0 && allTimeData?.aData && allTimeData?.aData?.length !== 0 &&
                      allTimeData.aData.map((data, i) => (
                        <tr key={data?._id}>
                          <td>{(i + 1)}</td>
                          <td>
                            {data?.oUser && data?.oUser?.sProPic
                              ? <img alt="No Image" className="theme-image" src={url + data?.oUser?.sProPic} />
                              : <img alt="No Image" className='l-cat-img' src={noImage} />
                            }
                          </td>
                          <td>{data?.oUser?.sName || '--'}</td>
                          <td>
                            {(adminPermission && (adminPermission?.USERS !== 'N' && adminPermission?.SYSTEM_USERS !== 'N'))
                              ? (
                                <Button className="total-text-link" color="link" tag={Link} to={`${data?.oUser && data?.oUser?.eType && data?.oUser?.eType === 'B' ? '/users/system-user/system-user-details' : '/users/user-management/user-details'}/${data?.oUser && data?.oUser?._id}`}>
                                  {data?.oUser?.sUsername || '--'}
                                </Button>
                                )
                              : data?.oUser?.sUsername || '--'}
                          </td>
                          <td>{data?.oUser && data?.oUser?.eType ? (data?.oUser?.eType === 'B' ? 'Bot' : 'Normal') : '--'}</td>
                          <td>{data?.nUserRank || 0}</td>
                          <td>{data?.nTotalJoinLeague || 0}</td>
                        </tr>
                      ))}
                      </Fragment>
                      )}
                </tbody>
              </table>
            </div>
          </div>
          )}
      </>
      )}

      {isOpen === 'MONTH_WISE' && (
      <>
        {
      !isLoading && monthlyData?.aData?.length === 0
        ? (
          <DataNotFound message="Data" obj=""/>
          )
        : (
          <div className='table-represent'>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Profile Pic</th>
                    <th>Name</th>
                    <th>Username</th>
                    <th>User Type</th>
                    <th>User Rank</th>
                    <th>Total Join League</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading
                    ? <SkeletonTable numberOfColumns={7} />
                    : (
                      <Fragment>
                        {
                      monthlyData && monthlyData?.length !== 0 && monthlyData?.aData && monthlyData?.aData?.length !== 0 &&
                      monthlyData.aData.map((data, i) => (
                        <tr key={data?._id}>
                          <td>{(i + 1)}</td>
                          <td>
                            {data?.oUser && data?.oUser?.sProPic
                              ? <img alt="No Image" className="theme-image" src={url + data?.oUser?.sProPic} />
                              : <img alt="No Image" className='l-cat-img' src={noImage} />
                            }
                          </td>
                          <td>{(adminPermission && (adminPermission?.USERS !== 'N' && adminPermission?.SYSTEM_USERS !== 'N')) ? <Button className='total-text-link' color="link" tag={Link} to={`${data?.oUser && data?.oUser?.eType && data?.oUser?.eType === 'B' ? '/users/system-user/system-user-details' : '/users/user-management/user-details'}/${data?.oUser && data?.oUser?._id}`}>{data?.oUser?.sName || '--'}</Button> : data?.oUser?.sName || '--'}</td>
                          <td>{data?.oUser?.sUsername || '--'}</td>
                          <td>{data?.oUser && data?.oUser?.eType ? (data?.oUser?.eType === 'B' ? 'Bot' : 'Normal') : '--'}</td>
                          <td>{data?.nUserRank || 0}</td>
                          <td>{data?.nTotalJoinLeague || 0}</td>
                        </tr>
                      ))}
                      </Fragment>
                      )}
                </tbody>
              </table>
            </div>
          </div>
          )}
      </>
      )}

      {isOpen === 'SEASON_WISE' && (
        <div>
          { !isLoading && seasonData?.length === 0
            ? (<DataNotFound message="Data" obj=""/>)
            : (
              <div className='table-represent'>
                <div className="table-responsive">
                  {isLoading
                    ? <SkeletonTable numberOfColumns={7} />
                    : (
                      <Fragment>
                        {
                      seasonData && seasonData?.length !== 0 && seasonData.map((data, i) => {
                        return (
                          <Fragment key={i}>
                            <table key={data?._id} className="table">
                              <thead>
                                <tr>
                                  <th className="text-center" colSpan='7'>{data?.sTitle}</th>
                                </tr>
                                <tr>
                                  <th>No.</th>
                                  <th>Profile Pic</th>
                                  <th>Name</th>
                                  <th>Username</th>
                                  <th>User Type</th>
                                  <th>User Rank</th>
                                  <th>Total Join League</th>
                                </tr>
                              </thead>
                              <tbody>
                                {data && data.aData.map((seriesData, index) => (
                                  <tr key={seriesData?._id}>
                                    <td>{(index + 1)}</td>
                                    <td>
                                      {seriesData?.oUser?.sProPic
                                        ? <img alt="No Image" className="theme-image" src={url + seriesData?.oUser?.sProPic} />
                                        : <img alt="No Image" className='l-cat-img' src={noImage} />
                                  }
                                    </td>
                                    <td>
                                      {(adminPermission && (adminPermission?.USERS !== 'N' && adminPermission?.SYSTEM_USERS !== 'N'))
                                        ? (
                                          <Button className='total-text-link' color="link" tag={Link} to={`${seriesData?.oUser && seriesData?.oUser?.eType && seriesData?.oUser?.eType === 'B' ? '/users/system-user/system-user-details' : '/users/user-management/user-details'}/${seriesData?.oUser && seriesData?.oUser?._id}`}>
                                            {seriesData?.oUser?.sName || '--'}
                                          </Button>
                                          )
                                        : seriesData?.oUser?.sName || '--'}
                                    </td>
                                    <td>{seriesData?.oUser?.sUsername || '--'}</td>
                                    <td>{seriesData?.oUser && seriesData?.oUser?.eType ? (seriesData?.oUser?.eType === 'B' ? 'Bot' : 'Normal') : '--'}</td>
                                    <td>{seriesData?.nUserRank || '--'}</td>
                                    <td>{seriesData?.nTotalJoinLeague || '--'}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </Fragment>
                        )
                      }
                      )}
                      </Fragment>
                      )}
                </div>
              </div>
              )}
        </div>
      )}
    </div>
  )
}

LeaderBoardData.propTypes = {
  isOpen: PropTypes.string,
  selectedSeasonOption: PropTypes.array,
  setSeason: PropTypes.func,
  setSeasonErr: PropTypes.func,
  seasonErr: PropTypes.string,
  seasonInput: PropTypes.array,
  isLoading: PropTypes.bool,
  setLoading: PropTypes.func,
  adminPermission: PropTypes.string,
  seasonIds: PropTypes.string,
  seasonList: PropTypes.object,
  setSeasonList: PropTypes.func,
  setMessage: PropTypes.func,
  message: PropTypes.string,
  setClose: PropTypes.func,
  close: PropTypes.bool,
  modalMessage: PropTypes.bool,
  setModalMessage: PropTypes.func,
  status: PropTypes.bool,
  setStatus: PropTypes.func
}

export default LeaderBoardData
