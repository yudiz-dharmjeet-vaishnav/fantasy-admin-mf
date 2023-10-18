import React from 'react'
import { Button, Col, Row } from 'reactstrap'
import { Link, useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'

function MatchEditHeader (props) {
  const { isCreate, generateDreamTeamFunc, generatePDF, getScoreCardDataFunc, calculateLiveLeaderBoard, onRefresh, matchDetails, Auth, adminPermission, mergeMatchPage, SportsType, matchId } = props
  const navigate = useNavigate()
  return (
    <>
      {!isCreate && (
      <Row className='match-edit-header'>
        <Col className='column-adjest' lg='3' md='12' />
        {isCreate
          ? null
          : (
            <Col className='column-adjest' lg='9' md='12'>
              <div className='match-buttons d-flex inline-input'>
                <div className='btn-list d-flex align-items-center flex-wrap user-sub-header'>
                  {
                      (matchDetails?.eStatus === 'I' || matchDetails?.eStatus === 'CMP') && ((Auth && Auth === 'SUPER') || (adminPermission?.MATCH === 'W')) && (
                        <Button className='theme-btn d-inline-flex justify-content-center align-items-center orange-btn ' onClick={() => generateDreamTeamFunc()}>
                          Generate Dream Team
                        </Button>
                      )
                    }
                  {
                      ((Auth && Auth === 'SUPER') || (adminPermission?.SUBADMIN !== 'N')) && (
                        <Button className='theme-btn d-inline-flex justify-content-center align-items-center purple-btn' tag={Link} to={`/admin-logs/${matchDetails?._id}`}>
                          Match Logs
                        </Button>
                      )
                    }
                  {matchDetails && (matchDetails.eStatus === 'L') && ((Auth && Auth === 'SUPER') || (adminPermission?.MATCHLEAGUE === 'W')) && (
                  <Button className='theme-btn d-inline-flex justify-content-center align-items-center orange-btn ' onClick={() => generatePDF()}>
                    Generate Fair Play
                  </Button>
                  )}
                  {matchDetails && (matchDetails.eStatus === 'L') && ((Auth && Auth === 'SUPER') || (adminPermission?.MATCH === 'W')) && (
                  <Button className='theme-btn d-inline-flex justify-content-center align-items-center green-btn ' onClick={() => calculateLiveLeaderBoard()}>
                    Load Live Leader Board
                  </Button>
                  )}
                  {
                      (matchDetails && matchDetails.eStatus === 'CMP') && ((Auth && Auth === 'SUPER') || (adminPermission?.REPORT === 'W')) && (
                        <Button className='theme-btn d-inline-flex justify-content-center align-items-center dark-blue-btn ' tag={Link} to={`${props.matchReport}`}>
                          Reports
                        </Button>
                      )
                    }
                  {
                      (matchDetails && matchDetails.eProvider === 'CUSTOM') && ((Auth && Auth === 'SUPER') || (adminPermission?.MATCH !== 'N')) && (
                      <Button className='theme-btn d-inline-flex justify-content-center align-items-center pink-btn ' onClick={() => navigate(`${mergeMatchPage}/${matchId}`)}>
                        Merge Match
                      </Button>
                      )}
                  {
                      ((Auth && Auth === 'SUPER') || (adminPermission?.MATCHLEAGUE !== 'N')) && (
                        <Button className='theme-btn d-inline-flex justify-content-center align-items-center blue-btn ' tag={Link} to={`${props.matchLeague}`}>
                          League Management
                        </Button>
                      )
                    }
                  {
                      ((Auth && Auth === 'SUPER') || (adminPermission?.MATCHPLAYER !== 'N')) && (
                        <Button className='theme-btn d-inline-flex justify-content-center align-items-center green-btn ' tag={Link} to={`${props.matchPlayer}`}>
                          Player Management
                        </Button>
                      )
                    }
                  {matchDetails && ((matchDetails.eStatus === 'P') || (matchDetails.eStatus === 'U')) && ((Auth && Auth === 'SUPER') || (adminPermission?.MATCH !== 'N')) && (
                  <Button className='theme-btn orange-btn' onClick={onRefresh}>
                    Match Data Refresh
                  </Button>
                  )}
                  {SportsType === 'cricket' && matchDetails && ((matchDetails.eStatus === 'L') || (matchDetails.eStatus === 'CMP') || (matchDetails.eStatus === 'I')) && ((Auth && Auth === 'SUPER') || (adminPermission?.MATCH !== 'N')) &&
                  <Button className='theme-btn  dark-blue-btn' onClick={getScoreCardDataFunc}>Score Card</Button>
                    }
                </div>
              </div>
            </Col>
            )
            }
      </Row>
      )
}
    </>
  )
}

MatchEditHeader.propTypes = {
  isCreate: PropTypes.bool,
  generateDreamTeamFunc: PropTypes.func,
  onRefresh: PropTypes.func,
  generatePDF: PropTypes.func,
  getScoreCardDataFunc: PropTypes.func,
  calculateLiveLeaderBoard: PropTypes.func,
  matchDetails: PropTypes.object,
  Auth: PropTypes.string,
  location: PropTypes.object,
  page: PropTypes.string,
  adminPermission: PropTypes.string,
  matchReport: PropTypes.string,
  mergeMatchPage: PropTypes.string,
  matchLeague: PropTypes.string,
  matchPlayer: PropTypes.string,
  SportsType: PropTypes.string,
  matchId: PropTypes.string,
  appView: PropTypes.string

}

export default MatchEditHeader
