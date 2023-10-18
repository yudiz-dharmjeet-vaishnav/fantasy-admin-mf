import React, { forwardRef, Fragment, useEffect, useState } from 'react'
import { Button, UncontrolledTooltip } from 'reactstrap'
import { Link } from 'react-router-dom'
import moment from 'moment'
import classNames from 'classnames'
import PropTypes from 'prop-types'

import BEP from '../../../../assets/images/bep.jpg'
import HUT from '../../../../assets/images/hut.jpg'
import Ball from '../../../../assets/images/ball.svg'
import Dollar from '../../../../assets/images/dollar.svg'
import infoIcon from '../../../../assets/images/info.svg'
import Bat from '../../../../assets/images/cricket-bat.svg'

const Match = forwardRef((props, ref) => {
  const { data, url, sportsType } = props

  const [time, setTime] = useState('')
  const [intervalRef, setIntervalRef] = useState(null)
  useEffect(() => {
    clearInterval(intervalRef)
    if (data && data.dStartDate) {
      if ((new Date(data.dStartDate) > Date.now() + 86400000) || (new Date(data.dStartDate) < new Date(Date.now()))) {
        setTime(moment(data.dStartDate).format('lll'))
      } else {
        setIntervalRef(setInterval(() => {
          const duration = moment.duration(moment(data.dStartDate).diff(moment(new Date())))
          if (((duration.hours() === 0 || duration.hours() < 0) && (duration.minutes() === 0 || duration.minutes() < 0) && duration.seconds() < 0)) {
            setTime(moment(data.dStartDate).format('lll'))
          } else {
            setTime(`${duration.hours()}h ${duration.minutes()}m  ${duration.seconds()}s left `)
          }
        }, 1000))
      }
    }
    return () => {
      clearInterval(intervalRef)
    }
  }, [data])

  return (
    <div className={classNames('match-box', { disabled: data && data.bDisabled })}>
      {
      data && data.sInfo && (
        <Fragment>
          <img alt='Info Image' className='i-button' id={`p${data._id}`} src={infoIcon} width={20} />
          <UncontrolledTooltip className="bg-default-s" delay={0} placement="bottom" target={`p${data._id}`} >
            <p className='info-tooltip'>
              {' '}
              {data && data.sInfo}
            </p>
          </UncontrolledTooltip>
        </Fragment>
      )
    }
      <Link className='match-i' to={`/${sportsType}/match-management/view-match/${data?._id}`}>
        <div className="m-name">
          <strong>{data && data.sSeasonName ? data.sSeasonName : ' '}</strong>
          {data && data.sSponsoredText ? <p>{data.sSponsoredText}</p> : ''}
        </div>
        <div className="d-flex align-items-center justify-content-between">
          <div className="team d-flex align-items-center">
            <div className="t-img"><img alt='Home team image' src={data && data.oHomeTeam && data.oHomeTeam.sImage ? `${url}${data.oHomeTeam.sImage}` : HUT}/></div>
            <div className="name">
              <h3>{data && data.oHomeTeam && data.oHomeTeam.sShortName ? data.oHomeTeam.sShortName : data?.oHomeTeam?.sName && data.oHomeTeam.sName.substr(0, 3)}</h3>
              <div className="d-flex">
                {data && data.iTossWinnerId && data.iTossWinnerId === data.oHomeTeam.iTeamId
                  ? data.eTossWinnerAction === 'BAT'
                    ? (
                      <Fragment>
                        <img alt="dollar" src={Dollar} width="18px" />
                        <img alt="Bat" src={Bat} width="18px" />
                      </Fragment>
                      )
                    : (
                      <Fragment>
                        <img alt="dollar" src={Dollar} width="18px" />
                        <img alt="Bat" src={Ball} width="18px" />
                      </Fragment>
                      )
                  : data && data.iTossWinnerId && data.oAwayTeam && data.iTossWinnerId === data.oAwayTeam.iTeamId
                    ? data.eTossWinnerAction === 'BAT'
                      ? <img alt="Ball" src={Ball} width="18px" />
                      : <img alt="Bat" src={Bat} width="18px" />
                    : ''
              }
              </div>
            </div>
          </div>
          <div className="time">
            {time}
            {' '}
          </div>
          <div className="team d-flex align-items-center">
            <div className="name">
              <h3>{data && data.oAwayTeam && data.oAwayTeam.sShortName ? data.oAwayTeam.sShortName : data?.oAwayTeam?.sName.substr(0, 3)}</h3>
              <div className="d-flex justify-content-end">
                {data && data.iTossWinnerId && data.iTossWinnerId === data.oAwayTeam.iTeamId
                  ? data.eTossWinnerAction === 'BAT'
                    ? (
                      <Fragment>
                        <img alt="dollar" src={Dollar} width="18px" />
                        <img alt="Bat" src={Bat} width="18px" />
                      </Fragment>
                      )
                    : (
                      <Fragment>
                        <img alt="dollar" src={Dollar} width="18px" />
                        <img alt="Ball" src={Ball} width="18px" />
                      </Fragment>
                      )
                  : data && data.iTossWinnerId && data.oHomeTeam && data.iTossWinnerId === data.oHomeTeam.iTeamId
                    ? data.eTossWinnerAction === 'BAT'
                      ? <img alt="Ball" src={Ball} width="18px" />
                      : <img alt="Bat" src={Bat} width="18px" />
                    : ''
              }
              </div>
              {props.icons
                ? (
                  <div className="d-flex justify-content-end">
                    <img alt="Ball" src={Ball} width="18px" />
                  </div>
                  )
                : ''
            }
            </div>
            <div className="t-img"><img alt='Away team image' src={data && data.oAwayTeam && data.oAwayTeam.sImage ? `${url}${data.oAwayTeam.sImage}` : BEP} /></div>
          </div>
        </div>
        <div className={
        `footer-m d-flex align-items-center ${((data?.nTeams && data?.bLineupsOut && data?.eStatus === 'U') || data?.nWinnings) ? 'justify-content-between' : ''} ${(data?.nTeams && data.bLineupsOut && data.eStatus !== 'U') ? 'justify-content-center' : ''}${(data?.nTeams && !data.bLineupsOut) ? 'justify-content-center' : ''} ${(!data?.nTeams && data?.bLineupsOut) ? 'justify-content-center' : ''}
`}
        >
          {data?.nTeams
            ? (
              <ul className="d-flex align-items-center m-0">
                <li>
                  <i className="icon-group" />
                  {`${data.nTeams} `}
                </li>
                <li>
                  <i className="icon-security-star-symbol" />
                  {`${data.nJoinedLeague ? data.nJoinedLeague : '0'}  `}
                </li>
              </ul>
              )
            : ''
        }
          {data && data.bLineupsOut && data.eStatus === 'U' && <Button color="success" >Lineups Out</Button>}
          {
          data && data.nWinnings && (data.eStatus === 'CMP' || data.eStatus === 'I')
            ? <b className="text-success">{data && data.nWinnings}</b>
            : ''
        }
        </div>
      </Link>
    </div>
  )
})

Match.propTypes = {
  data: PropTypes.object,
  icons: PropTypes.any,
  url: PropTypes.string,
  sportsType: PropTypes.string
}

Match.displayName = Match

export default Match
