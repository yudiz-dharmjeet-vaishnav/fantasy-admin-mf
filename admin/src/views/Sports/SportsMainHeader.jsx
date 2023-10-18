import React from 'react'
import { Button } from 'reactstrap'
import { useNavigate, Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import backIcon from '../../assets/images/Icon.svg'
import exportIcon from '../../assets/images/export-icon.svg'

function SportsMainHeader (props) {
  const {
    MatchPageLink,
    clearPendingReq,
    seasonListPage,
    matchLeaguePage,
    userLeaguePage,
    onExport,
    matchLeagueList,
    baseTeams,
    baseTeamsPage,
    copyBotBackUrl,
    isCopyBotLogs,
    Auth,
    button,
    adminPermission,
    Name,
    ShortName,
    Key,
    Submit,
    cancelLink,
    teamPlayer,
    addPlayer,
    onSubmit,
    submitDisableButton,
    addPlayerRole,
    sportsType,
    UpdatePoint,
    updateDisableButton,
    errPoints,
    updateMatchPlayerData,
    isCreate,
    resetPlayer,
    MatchScorePoint,
    onEdit,
    multiDisableButton,
    match,
    onInsideSubmit,
    AddMatchLeague,
    isEdit,
    onExportReport,
    baseTeam,
    baseTeamButton,
    BaseTeams,
    saveAll,
    saveAllDisabled,
    userLeagueList
  } = props

  const page = JSON?.parse(localStorage?.getItem('queryParams'))
  const navigate = useNavigate()
  return (
    <div className="header-block">
      <div className="sport-header d-flex justify-content-between align-items-center">
        <div className='d-flex flex-wrap-unset align-items-center '>
          {props?.MatchPageLink && <img className='custom-go-back' height='30' onClick={() => MatchPageLink ? (clearPendingReq && clearPendingReq(), navigate(`${MatchPageLink}`)) : navigate(-1)} src={backIcon} width='30' />}
          {props?.seasonListPage && <img className='custom-go-back' height='30' onClick={() => seasonListPage ? navigate(`${seasonListPage}${page?.SeasonList || ''}`) : navigate(-1)} src={backIcon} width='30' />}
          {(history?.location?.pathname?.includes('copy-bot-logs') ? copyBotBackUrl : props?.matchLeaguePage) && <img className='custom-go-back' height='30' onClick={() => (props?.goBack === true || props?.location?.state?.goBack) ? navigate(-1) : isCopyBotLogs ? navigate({ pathname: `${copyBotBackUrl}`, search: page?.MatchLeagueManagement || '' }) : navigate({ pathname: `${matchLeaguePage}`, search: page?.MatchLeagueManagement || '' })} src={backIcon} width='30' />}
          {props?.userLeaguePage && <img className='custom-go-back' height='30' onClick={() => navigate(`${userLeaguePage}`)} src={backIcon} width='30' />}
          {MatchScorePoint && <img className='custom-go-back' height='30' onClick={() => navigate(-1)} src={backIcon} width='30' />}
          {(addPlayer || teamPlayer || addPlayerRole || UpdatePoint || updateMatchPlayerData || AddMatchLeague) && <img className='custom-go-back' height='32' onClick={() => navigate(`${cancelLink}`)} src={backIcon} width='32' />}
          {BaseTeams && <img src={backIcon} className='custom-go-back mr-2' height='22' width='22' onClick={() => navigate(`${cancelLink}`)} />}
          <h2 className='sports-heading'>
            {props?.heading}
            {' '}
            {props?.seasonName && <p>{props?.seasonName}</p>}
          </h2>
        </div>

        <div className='btn-list-user'>
          {onExport && (
          <Button className="theme-btn icon-btn-export " disabled={matchLeagueList?.total === 0} onClick={props?.onExport}>
            <img alt="add" src={exportIcon} />
            Export
          </Button>
          )}

          {onExportReport &&
          ((matchLeagueList?.total !== 0 && status === 'CMP') || (userLeagueList?.data && userLeagueList?.data[0]?.total > 0)) && (
          <Button className="theme-btn icon-btn-export" onClick={props?.onExportReport}>
            <img alt='add' src={exportIcon}/>
            Export
          </Button>
          )}

          {baseTeams && (
          <Button className='theme-btn icon-btn-refresh refresh' onClick={() => navigate(baseTeamsPage)}>Base Teams</Button>
          )}

          {baseTeam && ((Auth && Auth === 'SUPER') || (adminPermission?.BASETEAM !== 'R')) && (
            <Button className='theme-btn icon-btn-refresh refresh' onClick={() => navigate(baseTeam)}>Create Base Team</Button>
          )}

          {baseTeamButton && (
          <Button className='theme-btn' onClick={() => saveAll()} disabled={saveAllDisabled}>
            Save All
          </Button>
          )}
          {props?.refresh && (
            <Button className='theme-btn icon-btn-refresh refresh' onClick={props?.onRefresh}>
              {props?.refresh}
            </Button>
          )}
          {props?.handleDatePicker && props?.permission && (
            <Button className="theme-btn icon-btn-fetch ml fetch" name="date-range" onClick={props?.handleDatePicker}>
              {props?.selectedDate ? `${props?.selectedDate}` : props?.DateText ? `${props?.DateText}` : 'Select Match Date'}
            </Button>
          )}

          {teamPlayer && <Button className="theme-btn icon-btn-cancel " tag={Link} to={`${cancelLink}${page?.TeamManagement || ''}`} >Cancel</Button>}
          {UpdatePoint && <Button className='theme-btn icon-btn-cancel ' tag={Link} to={`/${sportsType}/point-system${page?.PointSystem || ''}`}>Cancel</Button>}
          {updateMatchPlayerData && <Button className='theme-btn icon-btn-cancel ' tag={Link} to={`${cancelLink}${page?.MatchPlayerManagement || ''}`}>Cancel</Button>}
          {addPlayerRole && <Button className='theme-btn icon-btn-cancel ' tag={Link} to={`${cancelLink}${page?.MatchPlayerManagement || ''}`}>Cancel</Button>}
          {addPlayer && <Button className='theme-btn icon-btn-cancel ' tag={Link} to={`${cancelLink}${page?.PlayerManagement || ''}`}>Cancel</Button>}

          {MatchScorePoint && (
          <Button className="theme-btn icon-btn-cancel " onClick={() => navigate(-1)}>Cancel</Button>
          )}

          {teamPlayer && ((Auth && Auth === 'SUPER') || (adminPermission?.TEAM !== 'R')) && (
          <Button className="theme-btn " disabled={(!Name || !ShortName || !Key) || updateDisableButton} onClick={Submit}>{button}</Button>
          )}

          {addPlayer && ((Auth && Auth === 'SUPER') || (adminPermission?.PLAYER !== 'R')) &&
            (<Button className="theme-btn" disabled={submitDisableButton} onClick={Submit}>{button}</Button>)
          }

          {addPlayerRole && ((Auth && Auth === 'SUPER') || (adminPermission?.ROLES !== 'R')) && (
          <Button className="theme-btn" disabled={submitDisableButton} onClick={onSubmit}>{button}</Button>
          )}

          {match?.path?.includes('id1') && UpdatePoint
            ? ((Auth && Auth === 'SUPER') || (adminPermission?.SCORE_POINT !== 'R')) && (
            <Button className="theme-btn" disabled={multiDisableButton } onClick={onInsideSubmit}>Save Changes</Button>
              )
            : UpdatePoint && ((Auth && Auth === 'SUPER') || (adminPermission?.SCORE_POINT !== 'R')) && (
            <Button className="theme-btn" disabled={updateDisableButton || errPoints } onClick={onSubmit}>Save Changes</Button>
            )}

          {updateMatchPlayerData && !isCreate && (
            <Button className="theme-btn" disabled={submitDisableButton} onClick={() => resetPlayer()}>Reset Player</Button>
          )}

          {updateMatchPlayerData &&
            ((Auth && Auth === 'SUPER') || (adminPermission?.MATCHPLAYER !== 'R')) && (
              <Button className='theme-btn ' disabled={submitDisableButton} onClick={Submit}>
                {isCreate ? 'Add Match Player ' : !isEdit ? 'Save Changes' : 'Edit Match Player'}
              </Button>
          )}

          { MatchScorePoint && ((Auth && Auth === 'SUPER') || (adminPermission?.SCORE_POINT !== 'R')) && (
            <Button className="theme-btn" onClick={onEdit}>Save Changes</Button>
          )}
        </div>
      </div>
    </div>
  )
}

SportsMainHeader.propTypes = {
  heading: PropTypes.string,
  refresh: PropTypes.bool,
  onRefresh: PropTypes.func,
  handleDatePicker: PropTypes.func,
  permission: PropTypes.bool,
  selectedDate: PropTypes.string,
  DateText: PropTypes.string,
  MatchPageLink: PropTypes.string,
  clearPendingReq: PropTypes.func,
  seasonListPage: PropTypes.string,
  matchLeaguePage: PropTypes.string,
  userLeaguePage: PropTypes.bool,
  goBack: PropTypes.bool,
  onExport: PropTypes.func,
  usersListInSeason: PropTypes.array,
  seasonName: PropTypes.string,
  baseTeams: PropTypes.bool,
  baseTeamsPage: PropTypes.string,
  location: PropTypes.object,
  copyBotBackUrl: PropTypes.string,
  isCopyBotLogs: PropTypes.bool,
  Auth: PropTypes.string,
  button: PropTypes.func,
  adminPermission: PropTypes.string,
  Name: PropTypes.string,
  Key: PropTypes.string,
  submitDisable: PropTypes.bool,
  ShortName: PropTypes.string,
  Submit: PropTypes.func,
  cancelLink: PropTypes.string,
  teamPlayer: PropTypes.bool,
  addPlayer: PropTypes.bool,
  onSubmit: PropTypes.func,
  submitDisableButton: PropTypes.func,
  addPlayerRole: PropTypes.bool,
  sportsType: PropTypes.string,
  UpdatePoint: PropTypes.bool,
  updateDisableButton: PropTypes.string,
  errPoints: PropTypes.string,
  updateMatchPlayerData: PropTypes.bool,
  isCreate: PropTypes.string,
  resetPlayer: PropTypes.func,
  MatchScorePoint: PropTypes.bool,
  history: PropTypes.object,
  onEdit: PropTypes.func,
  multiDisableButton: PropTypes.bool,
  match: PropTypes.object,
  onInsideSubmit: PropTypes.func,
  AddMatchLeague: PropTypes.bool,
  isEdit: PropTypes.bool,
  matchLeagueList: PropTypes.array,
  onExportReport: PropTypes.func,
  baseTeam: PropTypes.string,
  baseTeamButton: PropTypes.func,
  BaseTeams: PropTypes.bool,
  baseTeamSubmit: PropTypes.func,
  saveAll: PropTypes.func,
  saveAllDisabled: PropTypes.bool,
  userLeagueList: PropTypes.object
}

export default SportsMainHeader
