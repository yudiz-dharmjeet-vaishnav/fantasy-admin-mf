import React, { Fragment } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button, UncontrolledTooltip } from 'reactstrap'
import PropTypes from 'prop-types'

import backIcon from '../../../assets/images/back-icon-1.svg'
import infoIcon from '../../../assets/images/info-icon.svg'
import exportIcon from '../../../assets/images/export-icon.svg'
import addlIcon from '../../../assets/images/add-white-icon.svg'

function MainLeagueHeader (props) {
  const {
    list,
    seriesDetails,
    seriesLBCategory,
    button,
    Auth,
    onSubmit,
    adminPermission,
    submitDisableButton,
    Title,
    Remark,
    AddFilterCategory,
    cancelLink,
    page,
    addLeagueCategory,
    Position,
    addSeriesLeaderBoard,
    Submit,
    addSeriesLeaderBoardCategory,
    updateDisableButton,
    ref
  } = props

  const navigate = useNavigate()

  return (
    <div className="header-block">
      <div className="main-league-header  d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          {seriesDetails && props.backUrl
            ? (
              <img
                className="custom-go-back mr-2"
                height="20"
                onClick={() => navigate(`${props.backUrl}`)}
                src={backIcon}
                width="20"
              />
              )
            : (
                ''
              )}

          {seriesLBCategory && props.backUrl
            ? (
              <img
                className="custom-go-back mr-2"
                height="20"
                onClick={() => navigate(`${props.backUrl}`)}
                src={backIcon}
                width="20"
              />
              )
            : (
                ''
              )}

          {props.goToLeague
            ? (
              <img
                className="custom-go-back mr-2"
                height="20"
                onClick={() => navigate(`${props.goToLeague}`)}
                src={backIcon}
                width="20"
              />
              )
            : (
                ''
              )}

          {props.LeagueDetailsLink
            ? (
              <img
                className="custom-go-back mr-2"
                height="22"
                onClick={() => navigate(`${props.LeagueDetailsLink}`)}
                src={backIcon}
                width="22"
              />
              )
            : (
                ''
              )}

          {(AddFilterCategory || addLeagueCategory) && <img className='custom-go-back mr-2' height='22' onClick={() => navigate(`${cancelLink}`)} src={backIcon} width='22' />}
          {addSeriesLeaderBoard && <img className='custom-go-back mx-3' height='24' onClick={() => navigate(`${cancelLink}${page?.SeriesLeaderBoard || ''}`)} src={backIcon} width='24' />}
          {addSeriesLeaderBoardCategory && <img className='custom-go-back mx-3' height='24' onClick={() => navigate(`${cancelLink}`)} src={backIcon} width='24' />}
          <h2 className="league-main-heading m-0">
            {props.heading}
            {props.info && (
              <Fragment>
                <img className="custom-info" id="info" src={infoIcon} />
                <UncontrolledTooltip className="bg-default-s" delay={0} placement="right-center" target="info">
                  <p>After updating anything from here, It will take some time to reflect on the app.</p>
                </UncontrolledTooltip>
              </Fragment>
            )}
          </h2>
        </div>

        <div className="btn-list-user d-flex ">
          {AddFilterCategory && <Button className="theme-btn icon-btn-cancel" tag={Link} to={`${cancelLink}${page?.FilterCategory || ''}`}>Cancel</Button>}
          {addLeagueCategory && <Button className="theme-btn icon-btn-cancel " tag={Link} to={`${cancelLink}${page?.LeagueCategory || ''}`}>Cancel</Button>}
          {addSeriesLeaderBoardCategory && <Button className="theme-btn icon-btn-cancel " tag={Link} to={`${cancelLink}${page?.SeriesLeaderBoardCategory || ''}`}>Cancel</Button>}

          {props.onExport && list && (list.total > 0 || list.length !== 0) && (
            <Button className="theme-btn icon-btn-export " onClick={props.onExport}>
              <img alt="add" src={exportIcon} />
              {props.export}
            </Button>
          )}

          {AddFilterCategory &&
            ((Auth && Auth.length === 'SUPER') || (adminPermission?.LEAGUE !== 'R')) && (
              <Button className="theme-btn " disabled={submitDisableButton || (!Title || !Remark)} onClick={onSubmit}>
                {button}
              </Button>
          )
          }
          {addLeagueCategory && ((Auth && Auth === 'SUPER') || adminPermission?.LEAGUE !== 'R') && (
            <Button className="theme-btn" disabled={submitDisableButton || !Title || !Position} onClick={onSubmit}>
              {button}
            </Button>
          )}

          {props.buttonText && props.permission && props.addButton && (
            <Button className="theme-btn icon-btn " tag={Link} to={props.setUrl}>
              <img alt="add" src={addlIcon} />
              {props.buttonText}
            </Button>
          )}
          {addSeriesLeaderBoard &&
            ((Auth && Auth === 'SUPER') || (adminPermission?.SERIES_LEADERBOARD !== 'R')) &&
            (
              <Button className="theme-btn ml-0-480 " onClick={Submit}>
                {button()}
              </Button>
            )
          }
          {addSeriesLeaderBoardCategory && ((Auth && Auth === 'SUPER') || (adminPermission?.SERIES_LEADERBOARD !== 'R')) &&
            (
              <Button ref={ref} className="theme-btn text-nowrap" disabled={updateDisableButton} onClick={Submit}>
                {button}
              </Button>
            )}
        </div>
      </div>
    </div>
  )
}

MainLeagueHeader.propTypes = {
  seriesDetails: PropTypes.bool,
  backUrl: PropTypes.string,
  seriesLBCategory: PropTypes.bool,
  goToLeague: PropTypes.string,
  LeagueDetailsLink: PropTypes.string,
  heading: PropTypes.string,
  info: PropTypes.bool,
  onExport: PropTypes.func,
  list: PropTypes.object,
  export: PropTypes.string,
  button: PropTypes.func,
  Auth: PropTypes.string,
  onSubmit: PropTypes.func,
  adminPermission: PropTypes.string,
  submitDisableButton: PropTypes.bool,
  Title: PropTypes.string,
  Remark: PropTypes.string,
  AddFilterCategory: PropTypes.bool,
  cancelLink: PropTypes.string,
  page: PropTypes.object,
  addLeagueCategory: PropTypes.bool,
  Position: PropTypes.string,
  addSeriesLeaderBoard: PropTypes.bool,
  buttonText: PropTypes.string,
  addButton: PropTypes.bool,
  permission: PropTypes.string,
  setUrl: PropTypes.string,
  Submit: PropTypes.func,
  addSeriesLeaderBoardCategory: PropTypes.bool,
  updateDisableButton: PropTypes.bool,
  ref: PropTypes.element
}

export default MainLeagueHeader
