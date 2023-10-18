import React from 'react'
import { Col, Row, Button } from 'reactstrap'
import { useNavigate, Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import backIcon from '../../assets/images/back-icon-1.svg'

function MatchEditMainHeader (props) {
  const { isCreate, page, SportsType, appView, Auth, adminPermission, onAdd, updateDisableButton } = props
  const navigate = useNavigate()
  return (
    <>
      <Row className='match-edit-main-header'>
        <Col className='column-adjest' lg='3' md='5'>
          <div className='d-flex inline-input align-items-center' >
            <img className='custom-go-back' height='22' onClick={() => props?.location?.state?.goBack ? navigate(-1) : (appView === 'true') ? navigate(`/${SportsType}/matches-app-view`) : navigate(`/${SportsType}/match-management${page?.MatchManagement || ''}`)} src={backIcon} width='22' />
            <h2 className='ml-2 match-heading'>{isCreate ? 'Create Match' : 'Edit Match Details'}</h2>
          </div>
        </Col>
        <Col className='column-adjest' lg="9" md="7">
          <div className='footer-btn match-button-design'>
            <Link
              className='theme-btn-cancel d-flex justify-content-center align-items-center'
              to={appView === 'true' ? `/${SportsType}/matches-app-view` : `/${SportsType}/match-management${page?.MatchManagement || ''}`}
            >
              Cancel
            </Link>
            {((Auth && Auth === 'SUPER') ||
              (adminPermission?.MATCH !== 'R')) && (
                <Button className='theme-btn-league' disabled={updateDisableButton} onClick={onAdd}>
                  {isCreate
                    ? 'Add Match'
                    : 'Update Match'}
                </Button>
            )}
          </div>
        </Col>
      </Row>
    </>
  )
}

MatchEditMainHeader.propTypes = {
  isCreate: PropTypes.bool,
  generateDreamTeamFunc: PropTypes.func,
  onRefresh: PropTypes.func,
  generatePDF: PropTypes.func,
  getScoreCardDataFunc: PropTypes.func,
  calculateLiveLeaderBoard: PropTypes.func,
  matchDetails: PropTypes.array,
  Auth: PropTypes.string,
  location: PropTypes.object,
  page: PropTypes.object,
  adminPermission: PropTypes.object,
  matchReport: PropTypes.string,
  mergeMatchPage: PropTypes.string,
  matchLeague: PropTypes.string,
  matchPlayer: PropTypes.string,
  SportsType: PropTypes.string,
  matchId: PropTypes.string,
  appView: PropTypes.string,
  onAdd: PropTypes.func,
  updateDisableButton: PropTypes.bool

}

export default MatchEditMainHeader
