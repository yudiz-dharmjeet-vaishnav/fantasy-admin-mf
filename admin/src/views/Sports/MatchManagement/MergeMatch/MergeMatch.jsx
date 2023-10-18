import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, CustomInput } from 'reactstrap'
import { getMatchesTotalCount, getMatchList, mergeMatch } from '../../../../actions/match'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import moment from 'moment'
import PropTypes from 'prop-types'

import Loading from '../../../../components/Loading'
import AlertMessage from '../../../../components/AlertMessage'
import SkeletonTable from '../../../../components/SkeletonTable'
import { modalMessageFunc } from '../../../../helpers/helper'
import { fetchMatchPlayer, getMatchPlayerList } from '../../../../actions/matchplayer'
import DataNotFound from '../../../../components/DataNotFound'

function MergeMatch (props) {
  const { setLoading, loading, apiGeneratedMatch, setMatchListArr } = props
  const location = useLocation()
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [date, setDate] = useState('')
  const [close, setClose] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(false)
  const [modalMessage, setModalMessage] = useState(false)
  const [customMatchPlayersList, setCustomMatchPlayersList] = useState([])
  const [apiGeneratedMatchPlayersList, setApiGeneratedMatchPlayersList] = useState([])
  const [players, setPlayers] = useState([])
  const [fetchList, setFetchList] = useState(false)

  const matchList = useSelector(state => state.match.matchList)
  const matchDetails = useSelector((state) => state.match.matchDetails)
  const matchesTotalCount = useSelector(state => state.match.matchesTotalCount)
  const matchPlayerList = useSelector(state => state.matchplayer.matchPlayerList)
  const isMatchAPIGenerated = useSelector(state => state.matchplayer.isMatchAPIGenerated)
  const SportsType = location.pathname.includes('cricket') ? 'cricket' : location.pathname.includes('football') ? 'football' : location.pathname.includes('basketball') ? 'basketball' : location.pathname.includes('kabaddi') ? 'kabaddi' : location.pathname.includes('hockey') ? 'hockey' : location.pathname.includes('csgo') ? 'csgo' : location.pathname.includes('dota2') ? 'dota2' : location.pathname.includes('lol') ? 'lol' : ''
  const token = useSelector((state) => state.auth.token)
  const resStatus = useSelector(state => state.match.resStatus)
  const resMessage = useSelector(state => state.match.resMessage)
  const previousProps = useRef({ matchDetails, matchesTotalCount, matchList, matchPlayerList, isMatchAPIGenerated, resMessage, resStatus, fetchList }).current

  useEffect(() => {
    if (previousProps.matchDetails !== matchDetails) {
      if (matchDetails) {
        setDate(matchDetails?.dStartDate)
        const startOfDay = matchDetails?.dStartDate ? new Date(moment(matchDetails?.dStartDate).startOf('day').format()) : ''
        const endOfDay = matchDetails?.dStartDate ? new Date(moment(matchDetails?.dStartDate).endOf('day').format()) : ''
        const data = {
          filter: 'U', search: '', startDate: startOfDay ? new Date(startOfDay).toISOString() : '', endDate: endOfDay ? new Date(endOfDay).toISOString() : '', provider: '', season: '', format: '', sportsType: SportsType, token
        }
        dispatch(getMatchesTotalCount(data))
      }
    }
    return () => {
      previousProps.matchDetails = matchDetails
    }
  }, [matchDetails])

  useEffect(() => {
    if (previousProps.isMatchAPIGenerated !== isMatchAPIGenerated) {
      if (isMatchAPIGenerated && fetchList) {
        const data = {
          start: '', limit: '', sort: 'sName', order: 'asc', searchText: '', role: '', team: '', token, Id: apiGeneratedMatch?.value, bCMBList: false
        }
        dispatch(getMatchPlayerList(data, true))
      }
    }
    return () => {
      previousProps.isMatchAPIGenerated = isMatchAPIGenerated
    }
  }, [isMatchAPIGenerated, fetchList])

  useEffect(() => {
    if (previousProps.matchPlayerList !== matchPlayerList) {
      if (matchPlayerList && isMatchAPIGenerated) {
        if (matchPlayerList.results.length > 0) {
          setApiGeneratedMatchPlayersList(matchPlayerList.results || [])
          setLoading(false)
        } else if (matchPlayerList.results.length === 0) {
          dispatch(fetchMatchPlayer(SportsType, apiGeneratedMatch?.value, token, true))
          setFetchList(true)
        }
      } else if (matchPlayerList && !isMatchAPIGenerated) {
        setCustomMatchPlayersList(matchPlayerList?.results || [])
        const arr = []
        matchPlayerList?.results?.map(data => {
          const obj = {
            sName: data.sName,
            oldId: data._id,
            newId: ''
          }
          arr.push(obj)
          return arr
        })
        setPlayers(arr)
        setLoading(false)
      }
    }
    return () => {
      previousProps.matchPlayerList = matchPlayerList
    }
  }, [matchPlayerList])

  useEffect(() => {
    if (previousProps.matchesTotalCount !== matchesTotalCount) {
      if (matchesTotalCount) {
        const startOfDay = new Date(moment(date).startOf('day').format())
        const endOfDay = new Date(moment(date).endOf('day').format())
        const data = {
          start: 0, limit: matchesTotalCount?.count, sort: 'dCreatedAt', order: 'desc', search: '', sportsType: SportsType, filter: 'U', startDate: startOfDay ? new Date(startOfDay).toISOString() : '', endDate: endOfDay ? new Date(endOfDay).toISOString() : '', provider: '', season: '', format: '', token
        }
        dispatch(getMatchList(data))
      }
    }
    return () => {
      previousProps.matchesTotalCount = matchesTotalCount
    }
  }, [matchesTotalCount])

  useEffect(() => {
    if (previousProps.matchList !== matchList) {
      if (matchList) {
        const arr = []
        if (matchList.results && matchList.results.length !== 0) {
          matchList.results.map((data) => {
            const obj = {
              value: data._id,
              label: data.sName
            }
            arr.push(obj)
            return arr
          })
          setMatchListArr(arr)
          setLoading(false)
        } else {
          setLoading(false)
          setModalMessage(true)
          setMessage('Matches not available')
        }
      }
    }
    return () => {
      previousProps.matchList = matchList
    }
  }, [matchList])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        setMessage(resMessage)
        setStatus(resStatus)
        setLoading(false)
        if (resStatus) {
          navigate(`/${SportsType}/match-management`, { message: resMessage })
        } else {
          setModalMessage(true)
        }
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  function handlePlayerChange (event, i) {
    event.preventDefault()
    const playerData = (event.target.value).split('/')
    const arr = [...players]
    const index = players.findIndex(data => data.sName === playerData[1])
    if (index >= 0 && playerData[0]) {
      arr[index] = { ...arr[index], newId: playerData[0] }
      setPlayers(arr)
    }
  }

  function onSubmit () {
    const availablePlayers = players.filter(player => player.newId.length !== 0)
    availablePlayers.map(item => {
      delete item.sName
      return item
    })
    const data = {
      oldMatchId: id, apiGeneratedMatchId: apiGeneratedMatch?.value, availablePlayers, token
    }
    dispatch(mergeMatch(data))
    setLoading(true)
  }

  return (
    <main className='main-content'>
      {loading && <Loading />}

      <AlertMessage
        close={close}
        message={message}
        modalMessage={modalMessage}
        status={status}
      />
      {
      !loading && customMatchPlayersList?.length === 0
        ? (
          <DataNotFound message="No Match Players" obj=""/>
          )
        : (
          <div className='table-represent'>
            <div className='table-responsive'>
              <table className='table'>
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Player Name(Custom Match)</th>
                    <th>Player Name(New Match)</th>
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? <SkeletonTable numberOfColumns={3} />
                    : (
                      <Fragment>
                        {
                      customMatchPlayersList && customMatchPlayersList.length !== 0 && customMatchPlayersList.map((data, i) => (
                        <tr key={data._id}>
                          <td>{i + 1}</td>
                          <td>{data.sName}</td>
                          <td>
                            <div>
                              <CustomInput
                                className='editable-select-merge'
                                id='Role'
                                name='Role'
                                onChange={e => handlePlayerChange(e, i)}
                                type='select'
                              >
                                <option value=''>Select player</option>
                                {apiGeneratedMatchPlayersList && apiGeneratedMatchPlayersList.length !== 0 && apiGeneratedMatchPlayersList.map((player, index) => {
                                  return (
                                    <Fragment key={index}>
                                      <option key={player.sName} value={`${player._id + '/' + player.sName}`}>{player.sName}</option>
                                    </Fragment>
                                  )
                                })}
                              </CustomInput>
                            </div>
                          </td>
                        </tr>
                      ))
                    }
                      </Fragment>
                      )
                }
                </tbody>
              </table>
              {!loading && customMatchPlayersList && customMatchPlayersList.length === 0 && (
              <div className="text-center">
                <h3>No Match Players available</h3>
              </div>
              )}
              <Button className='theme-btn mb-20px-480' onClick={() => onSubmit()}>Save Changes</Button>
            </div>
          </div>
          )}
    </main>
  )
}

MergeMatch.propTypes = {
  location: PropTypes.object,
  match: PropTypes.object,
  setLoading: PropTypes.func,
  loading: PropTypes.bool,
  apiGeneratedMatch: PropTypes.object,
  setApiGeneratedMatch: PropTypes.func,
  matchListArr: PropTypes.array,
  setMatchListArr: PropTypes.func
}

export default MergeMatch
