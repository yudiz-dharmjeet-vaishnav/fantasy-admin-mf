import React, { Fragment, useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import { useSelector, connect, useDispatch } from 'react-redux'
import { Badge, Button, Modal, ModalBody, ModalHeader } from 'reactstrap'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import Loading from '../../../../components/Loading'
import DataNotFound from '../../../../components/DataNotFound'
import SkeletonTable from '../../../../components/SkeletonTable'
import { getUserTeamPlayerList } from '../../../../actions/matchleague'

const UserLeagueList = forwardRef((props, ref) => {
  const { List, getList } = props
  const { id1, id3 } = useParams()
  const dispatch = useDispatch()
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [loader, setLoader] = useState(false)
  const [modalState, setModalState] = useState(false)
  const [totalScoredPoints, setTotalScoredPoints] = useState(0)
  const [totalCredits, setTotalCredits] = useState(0)
  const token = useSelector((state) => state.auth.token)
  const resStatus = useSelector(state => state.league.resStatus)
  const resMessage = useSelector(state => state.league.resMessage)
  const userTeamPlayerList = useSelector(state => state.matchleague.userTeamPlayerList)
  const [selectedFieldData, setSelectedFieldData] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const toggleModal = () => setIsModalOpen(!isModalOpen)
  const previousProps = useRef({ List, resMessage, resStatus, userTeamPlayerList }).current
  useEffect(() => {
    if (id1 && id3) {
      getList(id1, id3)
    }
    setLoading(true)
  }, [])

  useEffect(() => {
    if (previousProps.List !== List) {
      if (List) {
        setList(List)
        setLoading(false)
      }
    }
    return () => {
      previousProps.List = List
    }
  }, [List])

  function onRefresh () {
    if (id1 && id3) {
      getList(id1, id3)
      setLoading(true)
    }
  }

  useImperativeHandle(ref, () => ({
    onRefresh
  }))

  useEffect(() => {
    if (previousProps.userTeamPlayerList !== userTeamPlayerList) {
      if (userTeamPlayerList) {
        setModalState(true)
        const nScoredPoints = userTeamPlayerList?.aPlayers?.map(data => data.nScoredPoints)
        const sum = nScoredPoints?.reduce((a, b) => {
          return a + b
        })
        setTotalScoredPoints(sum)
        const nFantasyCredit = userTeamPlayerList?.aPlayers?.map(data => data.iMatchPlayerId.nFantasyCredit)
        const creditSum = nFantasyCredit?.reduce((a, b) => {
          return a + b
        })
        setTotalCredits(creditSum)
        setLoader(false)
      }
    }
    return () => {
      previousProps.userTeamPlayerList = userTeamPlayerList
    }
  }, [userTeamPlayerList])
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

  function modalOpenFunc (data) {
    setSelectedFieldData(data)
    setIsModalOpen(true)
  }

  return (
    <Fragment>
      {loader && <Loading />}

      {
      !loading && list?.length === 0
        ? (
          <DataNotFound message="User Leagues" obj=""/>
          )
        : (
          <div className="table-responsive">
            <div className='table-represent'>
              <table className="match-league-table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Team Name </th>
                    <th>League Name</th>
                    <th>Pool Prize</th>
                    <th>Total Payout</th>
                    <th>Rank</th>
                    <th>Prize</th>
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? <SkeletonTable numberOfColumns={7} />
                    : (
                      <Fragment>
                        {
                    list && list.length !== 0 && list.map((data, i) => {
                      return (
                        <tr key={data._id}
                          className={data.bCancelled ? 'cancelled-raw' : data.bWinDistributed ? 'priceDone-raw' : ''}
                        >
                          <td>{i + 1}</td>
                          <td>
                            <Button
                              className="total-text-link"
                              color="link"
                              onClick={() => {
                                dispatch(getUserTeamPlayerList(data.iUserTeamId, token))
                                setLoader(true)
                              }}
                            >
                              {data && data.sTeamName ? data.sTeamName : '-'}
                            </Button>
                          </td>
                          <td>{data && data.sLeagueName ? data.sLeagueName : '-'}</td>
                          <td>
                            <Badge
                              className='league-pool-prize ml-2'
                              color={`${data.nPoolPrice ? 'success' : 'danger'}`}
                            >
                              {data.nPoolPrice ? 'Yes' : 'No'}
                            </Badge>
                          </td>
                          <td>{data && data.nTotalPayout ? data.nTotalPayout : '-'}</td>
                          <td>{data && data.nRank ? data.nRank : '-'}</td>
                          <td>
                            <Button className="total-text-link" color="link" onClick={() => modalOpenFunc(data)}>
                              {data.nPrice || 0}
                              {data.nBonusWin ? '(Bonus -' + Number(data.nBonusWin).toFixed(2) + ')' : ''}
                              {data.aExtraWin && data.aExtraWin[0]?.sInfo ? '(Extra -' + data.aExtraWin[0].sInfo + ')' : ''}
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

      <Modal
        className='userTeam-modal'
        isOpen={modalState}
        toggle={() => {
          setModalState(false)
        }}
      >
        User Team (
        {userTeamPlayerList?.sName || '--'}
        )
        <ModalHeader
          className='mb-4'
          toggle={() => {
            setModalState(false)
          }}
        />
        <ModalBody>
          <table className='table'>
            <thead>
              <tr>
                <th>Player Name</th>
                <th>Player Role</th>
                <th>Player Team</th>
                <th>Score Points</th>
                <th>Credits</th>
              </tr>
            </thead>
            <tbody>
              {userTeamPlayerList && userTeamPlayerList.aPlayers && userTeamPlayerList.aPlayers.map((data, index) => (
                <tr key={index}>
                  <td>
                    {data.iMatchPlayerId && data.iMatchPlayerId.sName ? data.iMatchPlayerId.sName : '-'}
                    <span className='primary-text'>{userTeamPlayerList.iCaptainId === data.iMatchPlayerId._id ? '(C)' : userTeamPlayerList.iViceCaptainId === data.iMatchPlayerId._id ? '(VC)' : ''}</span>
                  </td>
                  <td>
                    {data.iMatchPlayerId && data.iMatchPlayerId.eRole &&
                data.iMatchPlayerId.eRole === 'ALLR'
                      ? 'All Rounder'
                      : data.iMatchPlayerId.eRole === 'BATS'
                        ? 'Batsman'
                        : data.iMatchPlayerId.eRole === 'BWL'
                          ? 'Bowler'
                          : data.iMatchPlayerId.eRole === 'WK'
                            ? 'Wicket Keeper'
                            : data.iMatchPlayerId.eRole === 'FWD'
                              ? 'Forwards'
                              : data.iMatchPlayerId.eRole === 'GK'
                                ? 'Goal Keeper'
                                : data.iMatchPlayerId.eRole === 'DEF'
                                  ? 'Defender'
                                  : data.iMatchPlayerId.eRole === 'RAID'
                                    ? 'Raider'
                                    : data.iMatchPlayerId.eRole === 'MID'
                                      ? 'Mid fielders'
                                      : data.iMatchPlayerId.eRole === 'PG'
                                        ? 'Point-Gaurd'
                                        : data.iMatchPlayerId.eRole === 'SG'
                                          ? 'Shooting-Gaurd'
                                          : data.iMatchPlayerId.eRole === 'SF'
                                            ? 'Small-Forwards'
                                            : data.iMatchPlayerId.eRole === 'PF'
                                              ? 'Power-Forwards'
                                              : data.iMatchPlayerId.eRole === 'C'
                                                ? 'Centre'
                                                : data.iMatchPlayerId.eRole === 'IF'
                                                  ? 'Infielder'
                                                  : data.iMatchPlayerId.eRole === 'OF'
                                                    ? 'Outfielder'
                                                    : data.iMatchPlayerId.eRole === 'P'
                                                      ? 'Pitcher'
                                                      : data.iMatchPlayerId.eRole === 'CT'
                                                        ? 'Catcher'
                                                        : '--'}
                  </td>
                  <td>{(data.iTeamId && data.iTeamId.sName) ? data.iTeamId.sName : '--'}</td>
                  <td>{data.nScoredPoints ? data.nScoredPoints : '--'}</td>
                  <td>{data.iMatchPlayerId && data.iMatchPlayerId.nFantasyCredit ? data.iMatchPlayerId.nFantasyCredit : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <table>
            <thead>
              <tr className='score-row'>
                <td>Total</td>
                <td />
                <td />
                <td>{totalScoredPoints}</td>
                <td>{totalCredits}</td>
              </tr>
            </thead>
          </table>

        </ModalBody>
      </Modal>
      <Modal className='modal-confirm-bot' isOpen={isModalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Prize</ModalHeader>
        <ModalBody>
          <div className="table-responsive-prize">
            <table className="table-prize">
              <tr>
                <th>Cash Win</th>
                <th>Bonus</th>
                <th>Extra Win</th>
              </tr>
              <tr>
                <td>
                  <b>
                    ₹
                    {selectedFieldData?.nPrice || 0}
                  </b>
                </td>
                <td><b>{selectedFieldData?.nBonusWin ? Number(selectedFieldData?.nBonusWin).toFixed(2) : 0}</b></td>
                <td><b>{(selectedFieldData?.aExtraWin?.length > 0) ? [...new Set(selectedFieldData?.aExtraWin?.map(data => data.sInfo))].toString() : '--'}</b></td>
              </tr>
            </table>
          </div>
        </ModalBody>
      </Modal>
    </Fragment>
  )
})

UserLeagueList.propTypes = {
  List: PropTypes.object,
  getList: PropTypes.func,
  match: PropTypes.object
}

UserLeagueList.displayName = UserLeagueList

export default connect(null, null, null, { forwardRef: true })(UserLeagueList)
