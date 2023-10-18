import React, { Fragment, useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import DataNotFound from '../../../../components/DataNotFound'
import SkeletonTable from '../../../../components/SkeletonTable'

import { getMatchPlayerList } from '../../../../actions/matchplayer'

const UserCopyTeamList = forwardRef((props, ref) => {
  const {
    userCopyTeamList, getList, token
  } = props
  const { matchid } = useParams()
  const dispatch = useDispatch()
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const matchPlayerList = useSelector(state => state.matchplayer.matchPlayerList)
  const resStatus = useSelector(state => state.match.resStatus)
  const resMessage = useSelector(state => state.match.resMessage)
  const paginationFlag = useRef(false)
  const start = useRef(0)
  const sort = useRef('sName')
  const order = useRef('asc')
  const search = useRef('')
  const role = useRef('')
  const team = useRef('')
  const previousProps = useRef({ userCopyTeamList, resMessage, resStatus, paginationFlag }).current

  useEffect(() => {
    getList()
    const matchPlayerListData = {
      start: start.current, limit: '', sort: sort.current, order: order.current, searchText: search.current, role: role.current, team: team.current, token, Id: matchid, bCMBList: true
    }
    dispatch(getMatchPlayerList(matchPlayerListData))
    setLoading(true)
  }, [])

  useEffect(() => {
    if (previousProps.userCopyTeamList !== userCopyTeamList) {
      setList(userCopyTeamList || [])
    }
    if (matchPlayerList && userCopyTeamList) {
      setLoading(false)
    }
    return () => {
      previousProps.userCopyTeamList = userCopyTeamList
    }
  }, [userCopyTeamList, matchPlayerList])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        setLoading(false)
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  function onRefresh () {
    getList()
    setLoading(true)
  }

  useImperativeHandle(ref, () => ({
    onRefresh
  }))

  return (
    <Fragment>
      {!loading && list?.length === 0
        ? (
          <DataNotFound message="Team" obj=""/>
          )
        : (
          <div className='table-represent'>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Username(Team Name)</th>
                    {Array(list?.aPlayers?.length).fill().map((data, index) => <th key={index}>{'Player ' + parseInt(index + 1)}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? <SkeletonTable numberOfColumns={list?.aPlayers?.length ? parseInt(list?.aPlayers?.length) + 2 : 3} />
                    : (
                      <Fragment>
                        {
                    list && list?.aCopyBotTeams?.length > 0 && list?.aCopyBotTeams?.map((data, index) => (
                      <tr key={data._id}>
                        <td>{index + 1}</td>
                        <td>{data?.oSystemUser?.sUsername + ' (' + (data?.oSystemUserTeam?.sName) + ')' || '--'}</td>
                        {matchPlayerList?.results?.length > 0 && matchPlayerList?.results?.map(player =>
                          data?.oSystemUserTeam?.oMatchTeamHash?.aPlayers?.includes(player?._id) && (
                            <td key={player?._id}>
                              <b>
                                {player?.sName}
                                {' '}
                                {player?._id === data?.oSystemUserTeam?.iCaptainId ? '(C)' : player?._id === data?.oSystemUserTeam?.iViceCaptainId ? '(VC)' : ''}
                              </b>
                            </td>
                          )
                        )}
                      </tr>
                    ))
                  }
                      </Fragment>
                      )
            }
                </tbody>
              </table>
            </div>
          </div>
          )}
    </Fragment>
  )
})

UserCopyTeamList.propTypes = {
  userCopyTeamList: PropTypes.object,
  getList: PropTypes.func,
  match: PropTypes.object,
  location: PropTypes.object,
  getMatchPlayersFunc: PropTypes.func,
  token: PropTypes.string
}

UserCopyTeamList.displayName = UserCopyTeamList

export default UserCopyTeamList
