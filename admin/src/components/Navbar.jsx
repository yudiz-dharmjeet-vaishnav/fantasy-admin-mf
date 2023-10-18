import React, { useState, Fragment, useEffect } from 'react'
import {
  Navbar, NavbarToggler, Nav, UncontrolledDropdown, DropdownMenu, DropdownItem, Button, DropdownToggle
} from 'reactstrap'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { connect, useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import Avatar from '../assets/images/avatar.svg'
import collapse from '../assets/images/Expand-Collapse.svg'
import Fansportiz from '../assets/images/fansportiz-logo.svg'
import Settings from '../assets/images/setting-image.svg'
import Sidebar from '../assets/images/dashboard.svg'
import Users from '../assets/images/user-image.svg'
import SubAdmin from '../assets/images/subAdmin-image.svg'
import Football from '../assets/images/football-image.svg'
import Kabaddi from '../assets/images/kabaddi-image.svg'
import Basketball from '../assets/images/basketball-image.svg'
import Cricket from '../assets/images/cricket-image.svg'
import League from '../assets/images/league-image.svg'
import SeriesLeaderBoard from '../assets/images/seriesLeaderboard.svg'
import collapseExpand from '../assets/images/Expand-Collapse-back.svg'
import upArrow from '../assets/images/caret-top.svg'
import downArrow from '../assets/images/caret-bottom.svg'
import fantasyLogo from '../assets/images/fantasyLogo.svg'
import baseballIcon from '../assets/images/baseball-image.svg'
import hockey from '../assets/images/hockey.svg'
import Report from '../assets/images/report.svg'
import Csgo from '../assets/images/csgo.svg'
import Dota from '../assets/images/dota2.svg'
import Lol from '../assets/images/LeagueOfLegend.svg'

import { collapseSideFunction } from '../actions/sidebarcollapse'
import { logout } from '../actions/auth'
import MatchList from './SportDropdown'

// Navbar component
function NavbarComponent (props) {
  const { openCollapse, setOpenCollapse } = props
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [dashboard, setDashBoard] = useState(false)
  const [setting, setSetting] = useState(false)
  const [user, setUser] = useState(false)
  const [league, setLeague] = useState(false)
  const [seriesboard, setSeriesBoard] = useState(false)
  const [subAdmin, setSubadmin] = useState(false)
  const [cricketSport, setCricketSport] = useState(false)
  const [footballSport, setFootballSport] = useState(false)
  const [baseballSport, setBaseballSport] = useState(false)
  const [kabaddiSport, setKabaddiSport] = useState(false)
  const [basketballSport, setBasketballSport] = useState(false)
  const [hockeySport, setHockeySport] = useState(false)
  const [csgoSport, setCsgoSport] = useState(false)
  const [dotaSport, setDotaSport] = useState(false)
  const [lolSport, setLolSport] = useState(false)
  const token = useSelector(state => state?.auth?.token)
  const adminPermission = useSelector(state => state?.auth.adminPermission)
  const Auth = useSelector(state => state?.auth?.adminData && state?.auth?.adminData?.eType)
  const localCollapse = JSON?.parse(localStorage?.getItem('collapse'))
  const [modalType, setModalType] = useState('')
  function toggle1 (type, fadeClose) {
    setModalType(type)
    setIsOpen(true)
  }
  function collapseFunction () {
    setDashBoard(false)
    setSetting(false)
    setUser(false)
    setSeriesBoard(false)
    setSubadmin(false)
    localStorage.setItem('collapse', !openCollapse)
    setOpenCollapse(!openCollapse)
    setIsOpen(!isOpen)
    setLeague(false)
    setFootballSport(false)
    setCricketSport(false)
    setBasketballSport(false)
    setKabaddiSport(false)
    setBaseballSport(false)
    setHockeySport(false)
    setCsgoSport(false)
    setDotaSport(false)
    setLolSport(false)
    dispatch(collapseSideFunction(openCollapse))
  }

  function closeModal () {
    setModalType('')
    if (openCollapse) {
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }

  const adminDetails = useSelector(state => state?.auth?.adminData)

  useEffect(() => {
    if (localCollapse) {
      setOpenCollapse(localCollapse)
      if (location?.pathname?.includes('/league')) {
        setLeague(true)
      } else if (cricketPath) {
        setCricketSport(true)
      } else if (basketballPath) {
        setBasketballSport(true)
      } else if (kabaddiPath) {
        setKabaddiSport(true)
      } else if (baseballPath) {
        setBaseballSport(true)
      } else if (footballPath) {
        setFootballSport(true)
      } else if (hockeyPath) {
        setHockeySport(true)
      } else if (csgoPath) {
        setCsgoSport(true)
      } else if (dotaPath) {
        setDotaSport(true)
      } else if (location?.pathname?.includes('/users')) {
        setUser(true)
      } else if (location?.pathname?.includes('/settings')) {
        setSetting(true)
      } else if (location?.pathname?.includes('/sub-admin') || location?.pathname?.includes('/admin-logs')) {
        setSubadmin(true)
      } else if (location?.pathname?.includes('/category-template') || location?.pathname?.includes('/seriesLeaderBoard')) {
        setSeriesBoard(true)
      }
    }
  }, [location.pathname])

  // Logout function
  function onLogout () {
    dispatch(logout(token))
  }

  const cricketPath = location && (location?.pathname?.includes('/cricket/match-management') || location?.pathname?.includes('/cricket/team-management') || location?.pathname?.includes('/cricket/player-management') || location?.pathname?.includes('/cricket/player-role-management') || location?.pathname?.includes('/cricket/season-management') || location?.pathname?.includes('/cricket/matches-app-view') || location?.pathname?.includes('/cricket/point-system'))
  const footballPath = location && (location?.pathname?.includes('/football/match-management') || location?.pathname?.includes('/football/team-management') || location?.pathname?.includes('/football/player-management') || location?.pathname?.includes('/football/player-role-management') || location?.pathname?.includes('/football/season-management') || location?.pathname?.includes('/football/matches-app-view') || location?.pathname?.includes('/football/point-system'))
  const basketballPath = location && (location?.pathname?.includes('/basketball/match-management') || location?.pathname?.includes('/basketball/team-management') || location?.pathname?.includes('/basketball/player-management') || location?.pathname?.includes('/basketball/player-role-management') || location?.pathname?.includes('/basketball/season-management') || location?.pathname?.includes('/basketball/matches-app-view') || location?.pathname.includes('/basketball/point-system'))
  const kabaddiPath = location && (location?.pathname?.includes('/kabaddi/match-management') || location?.pathname?.includes('/kabaddi/team-management') || location?.pathname?.includes('/kabaddi/player-management') || location?.pathname?.includes('/kabaddi/player-role-management') || location?.pathname?.includes('/kabaddi/season-management') || location?.pathname?.includes('/kabaddi/matches-app-view') || location?.pathname?.includes('/kabaddi/point-system'))
  const hockeyPath = location && (location?.pathname?.includes('/hockey/match-management') || location?.pathname?.includes('/hockey/team-management') || location?.pathname?.includes('/hockey/player-management') || location?.pathname.includes('/hockey/player-role-management') || location?.pathname?.includes('/hockey/season-management') || location?.pathname?.includes('/hockey/matches-app-view') || location?.pathname?.includes('/hockey/point-system'))
  const csgoPath = location && (location?.pathname?.includes('/csgo/match-management') || location?.pathname?.includes('/csgo/team-management') || location?.pathname?.includes('/csgo/player-management') || location?.pathname?.includes('/csgo/player-role-management') || location?.pathname?.includes('/csgo/season-management') || location?.pathname?.includes('/csgo/matches-app-view') || location?.pathname?.includes('/csgo/point-system'))
  const dotaPath = location && (location?.pathname?.includes('/dota2/match-management') || location?.pathname?.includes('/dota2/team-management') || location.pathname.includes('/dota2/player-management') || location?.pathname?.includes('/dota2/player-role-management') || location?.pathname?.includes('/dota2/season-management') || location?.pathname?.includes('/dota2/matches-app-view') || location?.pathname?.includes('/dota2/point-system'))
  const lolPath = location && (location?.pathname?.includes('/lol/match-management') || location.pathname.includes('/lol/team-management') || location?.pathname?.includes('/lol/player-management') || location?.pathname?.includes('/lol/player-role-management') || location.pathname?.includes('/lol/season-management') || location?.pathname?.includes('/lol/matches-app-view') || location?.pathname?.includes('/lol/point-system'))
  const baseballPath = location && (location?.pathname?.includes('/baseball/match-management') || location?.pathname?.includes('/baseball/team-management') || location?.pathname?.includes('/baseball/player-management') || location?.pathname?.includes('/baseball/player-role-management') || location.pathname?.includes('/baseball/season-management') || location?.pathname?.includes('/baseball/matches-app-view') || location?.pathname?.includes('/baseball/point-system'))
  const settingsPath = location && (location?.pathname?.includes('/settings'))

  return (
    <Navbar expand='lg' className={`d-flex flex-column collapse-nav ${openCollapse && 'main-navbar'}`} light>
      <div className={`menubar ${openCollapse ? 'collapse-menu' : ''}`}>
        <NavbarToggler tag={Button} />
        <Nav expand='lg' className={openCollapse ? 'navbar-nav collapse-nav-bar' : 'navbar-nav align-items-center'}>
          <div className={openCollapse ? 'fantasyLogo justify-content-center' : 'fansportizLogo justify-content-center'}>
            <img src={openCollapse ? fantasyLogo : Fansportiz} alt="FansportizLogo" />
          </div>

          <div className={openCollapse ? 'opendropDown-list' : 'dropDown-list'}>
            <UncontrolledDropdown nav inNavbar className={openCollapse ? 'custom-dropdown-collapse' : 'custom-dropdown'} isOpen={ isOpen && modalType === 'Dashboard'} onMouseOver={() => !openCollapse && toggle1('Dashboard')} onMouseOut={() => closeModal()} >
              <DropdownToggle nav caret id='dashboard' className={openCollapse && dashboard ? 'd-flex active-nav-link' : ''} onClick={() => navigate('/')}>
                <img src={Sidebar} alt='Dashboard' />
                {openCollapse && (
                <>
                  <h4 className='w-100'>DASHBOARD</h4>
                  {' '}
                </>
                )}
              </DropdownToggle>
              <DropdownMenu className='p-0'>
                <div className='dropdown-inner'>
                  <DropdownItem onClick={() => navigate('/')}>Dashboard</DropdownItem>
                </div>
              </DropdownMenu>
            </UncontrolledDropdown>
            {(adminPermission?.VERSION === 'N' && adminPermission?.COMPLAINT === 'N' && adminPermission?.LEADERSHIP_BOARD === 'N' && adminPermission?.EMAIL_TEMPLATES === 'N' && adminPermission?.POPUP_ADS === 'N' && adminPermission?.PAYOUT_OPTION === 'N' && adminPermission?.REPORT === 'N' && adminPermission?.OFFER === 'N' && adminPermission?.CMS === 'N' && adminPermission?.PROMO === 'N' && adminPermission?.BANNER === 'N' && adminPermission?.SETTING === 'N' && adminPermission?.PAYMENT_OPTION === 'N' && adminPermission?.RULE === 'N' && adminPermission?.NOTIFICATION === 'N' && adminPermission?.SPORT === 'N')
              ? ''
              : (
                <Fragment>
                  <UncontrolledDropdown nav inNavbar className={openCollapse ? 'custom-dropdown-collapse ' : 'custom-dropdown'} isOpen={isOpen && (modalType === 'Settings')} onMouseOver={() => !openCollapse && toggle1('Settings', true)} onMouseOut={() => closeModal()}>
                    <DropdownToggle nav caret id='setting' className={` ${classnames({ active: settingsPath })}  ${setting ? 'active-nav-link' : ''}`} onClick={() => openCollapse && setSetting(!setting)}>
                      <img src={Settings} alt='settings' />
                      {openCollapse && (
                      <>
                        {' '}
                        <h4 className='w-100'>SETTINGS</h4>
                        {' '}
                        <img src={setting ? upArrow : downArrow} alt="" className='caretIcon'/>
                        {' '}
                      </>
                      )}
                    </DropdownToggle>
                    {setting && !(adminPermission?.VERSION === 'N' && adminPermission.COMPLAINT === 'N' && adminPermission.LEADERSHIP_BOARD === 'N' && adminPermission.EMAIL_TEMPLATES === 'N' && adminPermission.POPUP_ADS === 'N' && adminPermission.PAYOUT_OPTION === 'N' && adminPermission.REPORT === 'N' && adminPermission.OFFER === 'N' && adminPermission.CMS === 'N' && adminPermission.PROMO === 'N' && adminPermission.BANNER === 'N' && adminPermission.SETTING === 'N' && adminPermission.PAYMENT_OPTION === 'N' && adminPermission.RULE === 'N' && adminPermission.SCORE_POINT === 'N' && adminPermission.NOTIFICATION === 'N' && adminPermission.SPORT === 'N') && (
                    <>
                      <div className='expand-menu'>
                        <Button tag={Link} className={classnames({ active: location && ((location.pathname === '/settings/common-rules') || location.pathname.includes('/settings/add-common-rule') || location.pathname.includes('/settings/common-rules-details')) })} to="/settings/common-rules"> Common Rules</Button>
                        <Button tag={Link} to="/settings/content-management"> Content</Button>
                        <Button tag={Link} to="/settings/email-template">Email Template</Button>
                        <Button tag={Link} to="/settings/feedback-complaint-management"> Feedbacks/Complaints</Button>
                        <Button tag={Link} to="/settings/leader-board-management"> Leader Board</Button>
                        <Button tag={Link} to="/settings/notification-management"> Notifications</Button>
                        <Button tag={Link} to="/settings/offer-management"> Offers</Button>
                        <Button tag={Link} to="/settings/payment-management"> Payment Gateways</Button>
                        {/* <Button tag={Link} to="/settings/payout-management"> Payout Gateways</Button> */}
                        <Button tag={Link} to="/settings/popup-ads-management"> Pop Up Ads</Button>
                        <Button tag={Link} to="/settings/promocode-management"> Promo Codes</Button>
                        <Button tag={Link} to="/settings/setting-management"> Settings</Button>
                        <Button tag={Link} to="/settings/slider-management"> Sliders</Button>
                        <Button tag={Link} to="/settings/sports"> Sports</Button>
                        <Button tag={Link} to="/settings/versions"> Versions/Maintenance</Button>
                      </div>
                    </>
                    )}
                    <DropdownMenu className='dropdown-setting-heading'>
                      <h4 className='mb-0'>Settings</h4>
                      <div className='dropdown-setting'>
                        {
                          ((Auth && Auth === 'SUPER') || (adminPermission?.RULE !== 'N')) && (
                            <DropdownItem tag={Link} className={classnames({ active: location && ((location?.pathname === '/settings/common-rules') || location?.pathname?.includes('/settings/add-common-rule') || location?.pathname?.includes('/settings/common-rules-details')) })} to='/settings/common-rules'>Common Rules</DropdownItem>
                          )
                        }
                        {
                          ((Auth && Auth === 'SUPER') || (adminPermission?.CMS !== 'N')) && (
                            <DropdownItem tag={Link} className={classnames({ active: location && ((location?.pathname === '/settings/content-management' || location?.pathname === '/settings/add-content') || location?.pathname?.includes('/settings/content-details')) })} to='/settings/content-management'>Content </DropdownItem>
                          )
                        }
                        {
                          ((Auth && Auth === 'SUPER') || (adminPermission?.EMAIL_TEMPLATES !== 'N')) && (
                            <DropdownItem tag={Link} className={classnames({ active: location && (location?.pathname === '/settings/email-template' || location?.pathname.includes('/settings/template-details')) })} to='/settings/email-template'>Email Template</DropdownItem>
                          )
                        }
                        {
                          ((Auth && Auth === 'SUPER') || (adminPermission?.COMPLAINT !== 'N')) && (
                            <DropdownItem tag={Link} className={classnames({ active: location && ((location?.pathname === '/settings/feedback-complaint-management') || (location?.pathname.includes('/settings/update-complaint-status'))) })} to='/settings/feedback-complaint-management'>Feedbacks/Complaints</DropdownItem>
                          )
                        }
                        {
                          ((Auth && Auth === 'SUPER') || (adminPermission?.LEADERSHIP_BOARD !== 'N')) && (
                            <DropdownItem tag={Link} className={classnames({ active: location && (location?.pathname === '/settings/leader-board-management') })} to='/settings/leader-board-management'>Leader Board</DropdownItem>
                          )
                        }
                        {
                          ((Auth && Auth === 'SUPER') || (adminPermission?.NOTIFICATION !== 'N')) && (
                            <DropdownItem tag={Link} className={classnames({ active: location && (location?.pathname === '/settings/notification-management' || location?.pathname.includes('settings/notification-details')) })} to='/settings/notification-management'>Notifications</DropdownItem>
                          )
                        }
                        {
                          ((Auth && Auth === 'SUPER') || (adminPermission?.OFFER !== 'N')) && (
                            <DropdownItem tag={Link} className={classnames({ active: location && (location?.pathname === '/settings/offer-management' || location?.pathname === '/settings/add-offer' || location?.pathname.includes('/settings/offer-details')) })} to='/settings/offer-management'>Offers</DropdownItem>
                          )
                        }
                        {
                          ((Auth && Auth === 'SUPER') || (adminPermission?.PAYMENT_OPTION !== 'N')) && (
                            <DropdownItem tag={Link} className={classnames({ active: location && (location?.pathname === '/settings/payment-management' || location?.pathname === '/settings/add-payment' || location?.pathname.includes('/settings/payment-details')) })} to='/settings/payment-management'>Payment Gateways</DropdownItem>
                          )
                        }
                        {/* {
                          ((Auth && Auth === 'SUPER') || (adminPermission?.PAYOUT_OPTION !== 'N')) && (
                            <DropdownItem tag={Link} className={classnames({ active: location && (location.pathname === '/settings/payout-management' || location.pathname.includes('/settings/payout-details')) })} to='/settings/payout-management'>Payout Gateways</DropdownItem>
                          )
                        } */}
                        {
                          ((Auth && Auth === 'SUPER') || (adminPermission?.POPUP_ADS !== 'N')) && (
                            <DropdownItem tag={Link} className={classnames({ active: location && (location?.pathname === '/settings/popup-ads-management' || location?.pathname?.includes('/settings/add-popup-ad') || location?.pathname?.includes('/settings/update-popup-ad')) })} to='/settings/popup-ads-management'>Pop Up Ads</DropdownItem>
                          )
                        }
                        {
                          ((Auth && Auth === 'SUPER') || (adminPermission?.PROMO !== 'N')) && (
                            <DropdownItem tag={Link} className={classnames({ active: location && (((location?.pathname === '/settings/promocode-management') || (location?.pathname === '/settings/add-promocode')) || location?.pathname?.includes('/settings/promocode-details') || location?.pathname?.includes('/settings/promocode-statistics')) })} to='/settings/promocode-management'>Promo Codes</DropdownItem>
                          )
                        }
                        {
                          ((Auth && Auth === 'SUPER') || (adminPermission?.SETTING !== 'N')) && (
                            <DropdownItem tag={Link} className={classnames({ active: location && ((location?.pathname === '/settings/setting-management' || location?.pathname === '/settings/add-setting') || location?.pathname?.includes('/settings/setting-details') || location?.pathname?.includes('/settings/side-background-currency-management')) })} to='/settings/setting-management'>Settings</DropdownItem>
                          )
                        }
                        {
                          ((Auth && Auth === 'SUPER') || (adminPermission?.BANNER !== 'N')) && (
                            <DropdownItem tag={Link} className={classnames({ active: location && (((location?.pathname === '/settings/slider-management') || (location?.pathname === '/settings/add-slider')) || location?.pathname?.includes('/settings/slider-details') || location?.pathname?.includes('/settings/slider-statistics')) })} to='/settings/slider-management'>Sliders</DropdownItem>
                          )
                        }
                        {
                          ((Auth && Auth === 'SUPER') || (adminPermission?.SPORT !== 'N')) && (
                            <DropdownItem tag={Link} className={classnames({ active: location && ((location?.pathname === '/settings/sports') || location?.pathname.includes('/settings/add-sport') || location?.pathname?.includes('/settings/sport-details')) })} to='/settings/sports'>Sports</DropdownItem>
                          )
                        }
                        {((Auth && Auth === 'SUPER') || (adminPermission?.VERSION !== 'N')) && (
                        <DropdownItem tag={Link} className={classnames({ active: location && ((location?.pathname === '/settings/versions') || (location?.pathname.includes('/settings/add-version')) || (location?.pathname?.includes('/settings/version-details'))) })} to='/settings/versions'>Versions/Maintenance</DropdownItem>
                        )}
                        {/*
                        ((Auth && Auth === 'SUPER') || (adminPermission?.VALIDATION !== 'N')) && (
                          <DropdownItem tag={Link} className={classnames({ active: location && ((location.pathname === '/settings/validation-management' || location.pathname === '/settings/add-validation') || location.pathname.includes('/settings/validation-details')) })} to='/settings/validation-management'>Validations</DropdownItem>
                        )
                        */}
                      </div>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </Fragment>
                )}
            {(adminPermission?.USERS === 'N' && adminPermission?.KYC === 'N' && adminPermission?.PASSBOOK === 'N' && adminPermission?.WITHDRAW === 'N' && adminPermission?.DEPOSIT === 'N' && adminPermission?.PUSHNOTIFICATION === 'N' && adminPermission?.SYSTEM_USERS === 'N' && adminPermission?.TDS === 'N')
              ? ''
              : (
                <Fragment>
                  <UncontrolledDropdown nav inNavbar className={openCollapse ? 'custom-dropdown-collapse ' : 'custom-dropdown'} isOpen={isOpen && (modalType === 'Users')} onMouseOver={() => !openCollapse && toggle1('Users')} onMouseOut={() => closeModal()}>
                    <DropdownToggle nav caret id='users' className={ `${classnames({ active: location && location?.pathname.includes('/users/') })} ${user ? 'active-nav-link' : ''}`} onClick={() => openCollapse && setUser(!user)}>
                      <img src={Users} alt='Users' />
                      {openCollapse && (
                      <>
                        <h4 className='w-100'>USERS</h4>
                        {' '}
                        <img src={user ? upArrow : downArrow} alt="" className='caretIcon'/>
                        {' '}
                      </>
                      )}
                    </DropdownToggle>
                    {user && (
                    <>
                      <div className='expand-menu'>
                        <Button tag={Link} to="/users/user-management"> Users</Button>
                        <Button tag={Link} to="/users/dropped-users"> Dropped Users</Button>
                        <Button tag={Link} to="/users/deleted-users"> Deleted Users</Button>
                        <Button tag={Link} to="/users/system-users"> System Users</Button>
                        <Button tag={Link} to="/users/kyc-verification"> KYC Verification</Button>
                        <Button tag={Link} to="/users/passbook"> Transactions</Button>
                        <Button tag={Link} to="/users/withdraw-management"> Withdrawals</Button>
                        <Button tag={Link} to="/users/deposit-management"> Deposits</Button>
                        <Button tag={Link} to="/users/push-notification"> Push Notifications</Button>
                        <Button tag={Link} to="/users/tds-management"> TDS</Button>
                      </div>
                    </>
                    )}
                    <DropdownMenu className='dropdown-setting-heading'>
                      <h4 className='mb-0'>Users</h4>
                      <div className='dropdown-inner'>
                        {
                          ((Auth && Auth === 'SUPER') || (adminPermission?.USERS !== 'N')) && (
                            <DropdownItem tag={Link} className={classnames({ active: location && (location?.pathname?.includes('/users/user-management') || location?.pathname?.includes('/users/user-referred-list')) })} to='/users/user-management'>Users</DropdownItem>
                          )
                          }
                        {
                          ((Auth && Auth === 'SUPER') || (adminPermission?.USERS !== 'N')) && (
                            <DropdownItem tag={Link} className={classnames({ active: location && (location?.pathname?.includes('/users/dropped-users')) })} to='/users/dropped-users'>Dropped Users</DropdownItem>
                          )
                          }
                        {
                          ((Auth && Auth === 'SUPER') || (adminPermission?.USERS !== 'N')) && (
                            <DropdownItem tag={Link} className={classnames({ active: location && (location?.pathname?.includes('/users/deleted-users')) })} to='/users/deleted-users'>Deleted Users</DropdownItem>
                          )
                          }
                        {
                          ((Auth && Auth === 'SUPER') || (adminPermission?.SYSTEM_USERS !== 'N')) && (
                            <DropdownItem tag={Link} className={classnames({ active: location && (location?.pathname === '/users/system-users' || location?.pathname?.includes('/users/system-user')) })} to='/users/system-users'>System Users</DropdownItem>
                          )
                          }
                        {
                          ((Auth && Auth === 'SUPER') || (adminPermission?.KYC !== 'N')) && (
                            <DropdownItem tag={Link} className={classnames({ active: location && (location?.pathname === '/users/kyc-verification') })} to='/users/kyc-verification'>KYC Verification</DropdownItem>
                          )
                          }
                        {
                          ((Auth && Auth === 'SUPER') || (adminPermission?.PASSBOOK !== 'N')) && (
                            <DropdownItem tag={Link} className={classnames({ active: location && (location?.pathname === '/users/passbook') })} to='/users/passbook'>Transactions</DropdownItem>
                          )
                          }
                        {
                          ((Auth && Auth === 'SUPER') || (adminPermission?.WITHDRAW !== 'N')) && (
                            <DropdownItem tag={Link} className={classnames({ active: location && (location?.pathname === '/users/withdraw-management') })} to='/users/withdraw-management'>Withdrawals</DropdownItem>
                          )
                          }
                        {
                          ((Auth && Auth === 'SUPER') || (adminPermission?.DEPOSIT !== 'N')) && (
                            <DropdownItem tag={Link} className={classnames({ active: location && (location?.pathname === '/users/deposit-management') })} to='/users/deposit-management'>Deposits</DropdownItem>
                          )
                          }
                        {
                          ((Auth && Auth === 'SUPER') || (adminPermission?.PUSHNOTIFICATION !== 'N')) && (
                            <DropdownItem tag={Link} className={classnames({ active: location && (location?.pathname?.includes('/users/push-notification')) })} to='/users/push-notification'>Push Notifications</DropdownItem>
                          )
                          }
                        {
                          ((Auth && Auth === 'SUPER') || (adminPermission?.TDS !== 'N')) && (
                            <DropdownItem tag={Link} className={classnames({ active: location && (location?.pathname?.includes('/users/tds-management')) })} to='/users/tds-management'>TDS</DropdownItem>
                          )
                          }
                      </div>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </Fragment>
                )
          }
            {
            (adminPermission?.LEAGUE === 'N')
              ? ''
              : (
                <Fragment>
                  <UncontrolledDropdown nav inNavbar className={openCollapse ? 'custom-dropdown-collapse ' : 'custom-dropdown'} isOpen={isOpen && (modalType === 'League')} onMouseOver={() => !openCollapse && toggle1('League')} onMouseOut={() => closeModal()}>
                    <DropdownToggle nav caret id='leagues' className={`${classnames({ active: location && (location?.pathname?.includes('/league') || location?.pathname?.includes('/league')) })} ${league ? 'active-nav-link' : ''}`} onClick={() => openCollapse && setLeague(!league)} >
                      <img src={League} alt='League' />
                      {openCollapse && (
                      <>
                        {' '}
                        <h4 className='w-100'>LEAGUE</h4>
                        {' '}
                        <img src={league ? upArrow : downArrow} alt="" className='caretIcon'/>
                      </>
                      )}
                    </DropdownToggle>
                    {league && (
                    <>
                      <div className='expand-menu'>
                        <Button tag={Link} to="/league"> Leagues</Button>
                        <Button tag={Link} to="/league/filter-category-list"> Filter Category</Button>
                        <Button tag={Link} to="/league/league-category-list"> League Category</Button>
                      </div>
                    </>
                    )}
                    <DropdownMenu className='dropdown-setting-heading'>
                      <h4 className='mb-0'>Leagues</h4>
                      <div className='dropdown-inner'>
                        <DropdownItem tag={Link} className={classnames({ active: location && (location?.pathname === '/league' || location?.pathname === '/league/add-league' || location.pathname.includes('/league/update-league')) })} to='/league'>Leagues</DropdownItem>
                        <DropdownItem tag={Link} className={classnames({ active: location && (location?.pathname === '/league/filter-category-list' || location?.pathname === '/league/add-filter-category' || location?.pathname?.includes('/league/filter-league-category')) })} to='/league/filter-category-list'>Filter Category</DropdownItem>
                        <DropdownItem tag={Link} className={classnames({ active: location && (location?.pathname === '/league/league-category-list' || location?.pathname === '/league/add-league-category' || location?.pathname?.includes('/league/update-league-category')) })} to='/league/league-category-list'>League Category</DropdownItem>
                      </div>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </Fragment>
                )
          }

            {(adminPermission?.MATCH === 'N' && adminPermission?.TEAM === 'N' && adminPermission?.PLAYER === 'N' && adminPermission?.ROLES === 'N')
              ? ''
              : (
                <Fragment>
                  <UncontrolledDropdown nav inNavbar className={openCollapse ? 'custom-dropdown-collapse ' : 'custom-dropdown'} key="cricket" isOpen={isOpen && (modalType === 'cricket')} onMouseOver={() => !openCollapse && toggle1('cricket')} onMouseOut={() => closeModal() }>
                    <DropdownToggle nav caret className={ `${classnames({ active: cricketPath })} ${cricketSport ? 'active-nav-link' : ''} `} onClick={() => openCollapse && setCricketSport(!cricketSport)} id="cricket" >
                      <img src={Cricket} alt="Cricket" />
                      {openCollapse && (
                      <>
                        {' '}
                        <h4 className='w-100'>CRICKET</h4>
                        {' '}
                        <img src={cricketSport ? upArrow : downArrow} alt="" className='caretIcon'/>
                        {' '}
                      </>
                      )}
                    </DropdownToggle>
                    {cricketSport && (
                    <>
                      <MatchList sportName="cricket" Auth={Auth} adminPermission={adminPermission} openCollapse={openCollapse}/>
                    </>
                    )}
                    <DropdownMenu className='dropdown-setting-heading'>
                      <MatchList sportName="cricket" Auth={Auth} adminPermission={adminPermission} openCollapse={openCollapse}/>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </Fragment>
                )
          }

            {(adminPermission?.MATCH === 'N' && adminPermission?.TEAM === 'N' && adminPermission?.PLAYER === 'N' && adminPermission?.ROLES === 'N')
              ? ''
              : (
                <Fragment>
                  <UncontrolledDropdown nav inNavbar className={openCollapse ? 'custom-dropdown-collapse ' : 'custom-dropdown'} key="cricket" isOpen={isOpen && (modalType === 'football')} onMouseOver={() => !openCollapse && toggle1('football')} onMouseOut={() => closeModal()}>
                    <DropdownToggle nav caret className={`${classnames({ active: footballPath })} ${footballSport ? 'active-nav-link' : ''} `} onClick={() => openCollapse && setFootballSport(!footballSport)} id='football' >
                      <img src={Football} alt="Football" />
                      {openCollapse && (
                      <>
                        {' '}
                        <h4 className='w-100'>FOOTBALL</h4>
                        {' '}
                        <img src={footballSport ? upArrow : downArrow} alt="" className='caretIcon' />
                        {' '}
                      </>
                      )}
                    </DropdownToggle>
                    {footballSport && (
                      <>
                        <MatchList sportName="football" Auth={Auth} adminPermission={adminPermission} openCollapse={openCollapse}/>
                      </>
                    )}
                    <DropdownMenu className='dropdown-setting-heading'>
                      <MatchList sportName="football" Auth={Auth} adminPermission={adminPermission} openCollapse={openCollapse} />
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </Fragment>
                )
            }

            {(adminPermission?.MATCH === 'N' && adminPermission?.TEAM === 'N' && adminPermission?.PLAYER === 'N' && adminPermission?.ROLES === 'N')
              ? ''
              : (
                <Fragment>
                  <UncontrolledDropdown nav inNavbar className={openCollapse ? 'custom-dropdown-collapse ' : 'custom-dropdown'} key="basketball" isOpen={isOpen && (modalType === 'basketball')} onMouseOver={() => !openCollapse && toggle1('basketball')} onMouseOut={() => closeModal()}>
                    <DropdownToggle nav caret className={`${classnames({ active: basketballPath })} ${basketballSport ? 'active-nav-link' : ''} `} onClick={() => openCollapse && setBasketballSport(!basketballSport)} id='basketball' >
                      <img src={Basketball} alt='Basketball' />
                      {openCollapse && (
                      <>
                        {' '}
                        <h4 className='w-100'>BASKETBALL</h4>
                        {' '}
                        <img src={basketballSport ? upArrow : downArrow} alt="" className='caretIcon' />
                        {' '}
                      </>
                      )}
                    </DropdownToggle>
                    {basketballSport && (
                      <>
                        <MatchList sportName="basketball" Auth={Auth} adminPermission={adminPermission} openCollapse={openCollapse}/>
                      </>
                    )}
                    <DropdownMenu className='dropdown-setting-heading'>
                      <MatchList sportName="basketball" Auth={Auth} adminPermission={adminPermission} openCollapse={openCollapse} />
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </Fragment>
                )
            }
            {(adminPermission?.MATCH === 'N' && adminPermission?.TEAM === 'N' && adminPermission?.PLAYER === 'N' && adminPermission?.ROLES === 'N')
              ? ''
              : (
                <Fragment>
                  <UncontrolledDropdown nav inNavbar className={openCollapse ? 'custom-dropdown-collapse ' : 'custom-dropdown'} key="baseball" isOpen={isOpen && (modalType === 'baseball')} onMouseOver={() => !openCollapse && toggle1('baseball')} onMouseOut={() => closeModal()}>
                    <DropdownToggle nav caret className={`${classnames({ active: baseballPath })}${baseballSport ? 'active-nav-link' : ''}  `} onClick={() => openCollapse && setBaseballSport(!baseballSport)} id='baseball' >
                      <img src={baseballIcon} alt='baseballIcon' />
                      {openCollapse && (
                      <>
                        {' '}
                        <h4 className='w-100'>BASEBALL</h4>
                        {' '}
                        <img src={baseballSport ? upArrow : downArrow} alt="" className='caretIcon' />
                        {' '}
                      </>
                      )}
                    </DropdownToggle>
                    {baseballSport && (
                    <>
                      <MatchList sportName="baseball" Auth={Auth} adminPermission={adminPermission} openCollapse={openCollapse} />
                    </>
                    )}
                    <DropdownMenu className='dropdown-setting-heading'>
                      <MatchList sportName="baseball" Auth={Auth} adminPermission={adminPermission} openCollapse={openCollapse} />
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </Fragment>
                )
            }
            {(adminPermission?.MATCH === 'N' && adminPermission?.TEAM === 'N' && adminPermission?.PLAYER === 'N' && adminPermission?.ROLES === 'N')
              ? ''
              : (
                <Fragment>
                  <UncontrolledDropdown nav inNavbar className={openCollapse ? 'custom-dropdown-collapse ' : 'custom-dropdown'} key="basketball" isOpen={isOpen && (modalType === 'kabaddi')} onMouseOver={() => !openCollapse && toggle1('kabaddi')} onMouseOut={() => closeModal()}>
                    <DropdownToggle nav caret className={`${classnames({ active: kabaddiPath })} ${kabaddiSport ? 'active-nav-link' : ''} `} onClick={() => openCollapse && setKabaddiSport(!kabaddiSport)} id='kabaddi' >
                      <img src={Kabaddi} alt='Kabaddi' />
                      {openCollapse && (
                      <>
                        {' '}
                        <h4 className='w-100'>KABADDI</h4>
                        {' '}
                        <img src={kabaddiSport ? upArrow : downArrow} alt="" className='caretIcon' />
                        {' '}
                      </>
                      )}
                    </DropdownToggle>
                    {kabaddiSport && (
                    <>
                      <MatchList sportName="kabaddi" Auth={Auth} adminPermission={adminPermission} openCollapse={openCollapse}/>
                    </>
                    )}
                    <DropdownMenu className='dropdown-setting-heading'>
                      <MatchList sportName="kabaddi" Auth={Auth} adminPermission={adminPermission} openCollapse={openCollapse} />
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </Fragment>
                )
            }
            {(adminPermission?.MATCH === 'N' && adminPermission?.TEAM === 'N' && adminPermission?.PLAYER === 'N' && adminPermission?.ROLES === 'N')
              ? ''
              : (
                <Fragment>
                  <UncontrolledDropdown nav inNavbar className={openCollapse ? 'custom-dropdown-collapse ' : 'custom-dropdown'} key="basketball" isOpen={isOpen && (modalType === 'hockey')} onMouseOver={() => !openCollapse && toggle1('hockey')} onMouseOut={() => closeModal()}>
                    <DropdownToggle nav caret className={`${classnames({ active: hockeyPath })} ${hockeyPath ? 'active-nav-link' : ''} `} onClick={() => openCollapse && setHockeySport(!hockeySport)} id='hockey' >
                      <img src={hockey} alt='hockey' />
                      {openCollapse && (
                      <>
                        {' '}
                        <h4 className='w-100'>HOCKEY</h4>
                        {' '}
                        <img src={hockeySport ? upArrow : downArrow} alt="" className='caretIcon' />
                        {' '}
                      </>
                      )}
                    </DropdownToggle>
                    {hockeySport && (
                    <>
                      <MatchList sportName="hockey" Auth={Auth} adminPermission={adminPermission} openCollapse={openCollapse}/>
                    </>
                    )}
                    <DropdownMenu className='dropdown-hockey-inner'>
                      <MatchList sportName="hockey" Auth={Auth} adminPermission={adminPermission} openCollapse={openCollapse} />
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </Fragment>
                )
            }

            {(adminPermission?.MATCH === 'N' && adminPermission?.TEAM === 'N' && adminPermission?.PLAYER === 'N' && adminPermission?.ROLES === 'N')
              ? ''
              : (
                <Fragment>
                  <UncontrolledDropdown nav inNavbar className={openCollapse ? 'custom-dropdown-collapse ' : 'custom-dropdown'} key="basketball" isOpen={isOpen && (modalType === 'csgo')} onMouseOver={() => !openCollapse && toggle1('csgo')} onMouseOut={() => closeModal()}>
                    <DropdownToggle nav caret className={`${classnames({ active: csgoPath })} ${csgoSport ? 'active-nav-link' : ''} `} onClick={() => openCollapse && setCsgoSport(!csgoSport)} id='csgo' >
                      <img src={Csgo} alt='csgo' />
                      {openCollapse && (
                      <>
                        {' '}
                        <h4 className='w-100'> CSGO</h4>
                        {' '}
                        <img src={csgoSport ? upArrow : downArrow} alt="" className='caretIcon' />
                        {' '}
                      </>
                      )}
                    </DropdownToggle>
                    {csgoSport && (
                    <>
                      <MatchList sportName="csgo" Auth={Auth} adminPermission={adminPermission} openCollapse={openCollapse}/>
                    </>
                    )}
                    <DropdownMenu className='dropdown-hockey-inner'>
                      <MatchList sportName="csgo" Auth={Auth} adminPermission={adminPermission} openCollapse={openCollapse} />
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </Fragment>
                )
            }
            {(adminPermission?.MATCH === 'N' && adminPermission?.TEAM === 'N' && adminPermission?.PLAYER === 'N' && adminPermission?.ROLES === 'N')
              ? ''
              : (
                <Fragment>
                  <UncontrolledDropdown nav inNavbar className={openCollapse ? 'custom-dropdown-collapse ' : 'custom-dropdown'} key="dota2" isOpen={isOpen && (modalType === 'dota2')} onMouseOver={() => !openCollapse && toggle1('dota2')} onMouseOut={() => closeModal()}>
                    <DropdownToggle nav caret className={`${classnames({ active: dotaPath })} ${dotaSport ? 'active-nav-link' : ''} `} onClick={() => openCollapse && setDotaSport(!dotaSport)} id='dota2' >
                      <img src={Dota} alt='dota2' />
                      {openCollapse && (
                      <>
                        {' '}
                        <h4 className='w-100'> Dota2</h4>
                        {' '}
                        <img src={dotaSport ? upArrow : downArrow} alt="" className='caretIcon' />
                        {' '}
                      </>
                      )}
                    </DropdownToggle>
                    {dotaSport && (
                    <>
                      <MatchList sportName="dota2" Auth={Auth} adminPermission={adminPermission} openCollapse={openCollapse}/>
                    </>
                    )}
                    <DropdownMenu className='dropdown-hockey-inner'>
                      <MatchList sportName="dota2" Auth={Auth} adminPermission={adminPermission} openCollapse={openCollapse} />
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </Fragment>
                )
            }

            {(adminPermission?.MATCH === 'N' && adminPermission?.TEAM === 'N' && adminPermission?.PLAYER === 'N' && adminPermission?.ROLES === 'N')
              ? ''
              : (
                <Fragment>
                  <UncontrolledDropdown nav inNavbar className={openCollapse ? 'custom-dropdown-collapse ' : 'custom-dropdown'} key="lol" isOpen={isOpen && (modalType === 'lol')} onMouseOver={() => !openCollapse && toggle1('lol')} onMouseOut={() => closeModal()}>
                    <DropdownToggle nav caret className={`${classnames({ active: lolPath })} ${lolSport ? 'active-nav-link' : ''} `} onClick={() => openCollapse && setLolSport(!lolSport)} id='lol' >
                      <img src={Lol} alt='lol' />
                      {openCollapse && (
                      <>
                        {' '}
                        <h4 className='w-100'> LOL</h4>
                        {' '}
                        <img src={lolSport ? upArrow : downArrow} alt="" className='caretIcon' />
                        {' '}
                      </>
                      )}
                    </DropdownToggle>
                    {lolSport && (
                    <>
                      <MatchList sportName="lol" Auth={Auth} adminPermission={adminPermission} openCollapse={openCollapse}/>
                    </>
                    )}
                    <DropdownMenu className='dropdown-lol-inner'>
                      <MatchList sportName="lol" Auth={Auth} adminPermission={adminPermission} openCollapse={openCollapse} />
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </Fragment>
                )
                }
            {
              ((Auth && Auth === 'SUPER') || (adminPermission?.SERIES_LEADERBOARD !== 'N')) && (
                <Fragment>
                  <UncontrolledDropdown nav inNavbar className={openCollapse ? 'custom-dropdown-collapse ' : 'custom-dropdown'} isOpen={isOpen && (modalType === 'SeriesLeaderBoard')} onMouseOver={() => !openCollapse && toggle1('SeriesLeaderBoard')} onMouseOut={() => closeModal()}>
                    <DropdownToggle nav caret id='seriesboard' className={ `${classnames({ active: location && (location?.pathname?.includes('category-template') || location?.pathname?.includes('/seriesLeaderBoard')) })} ${seriesboard ? 'active-nav-link' : ''}`} onClick={() => openCollapse && setSeriesBoard(!seriesboard)}>
                      <img src={SeriesLeaderBoard} alt='SeriesBoard' />
                      {openCollapse && (
                      <>
                        <h4 className='w-100'>SERIES LEADERBOARD</h4>
                        <img src={seriesboard ? upArrow : downArrow} alt="" className='caretIcon'/>
                        {' '}
                      </>
                      )}
                    </DropdownToggle>
                    {
                        seriesboard && (
                        <>
                          <div className='expand-menu'>
                            <Button tag={Link} className={classnames({ active: location && (location?.pathname === '/category-template' || location?.pathname === '/category-template/add-template' || location?.pathname === '/category-template/edit-template/:id') })} to='/category-template'>Category Template</Button>
                            <Button tag={Link} className={classnames({ active: location && (location?.pathname === '/seriesLeaderBoard' || location?.pathname === '/seriesLeaderBoard/add-SeriesLeaderBoard' || location?.pathname?.includes('/seriesLeaderBoard/edit-SeriesLeaderBoard') || location?.pathname === '/seriesLeaderBoardCategory/:id' || location?.pathname?.includes('/seriesLeaderBoardCategory')) })} to='/seriesLeaderBoard'>Series Leaderboard</Button>
                          </div>
                        </>
                        )}
                    <DropdownMenu className='dropdown-setting-heading'>
                      <h4 className='mb-0'>Series Leaderboard</h4>
                      <div className='dropdown-inner'>
                        <DropdownItem tag={Link} className={classnames({ active: location && (location?.pathname === 'category-template' || location?.pathname === '/category-template/add-template' || location?.pathname === '/category-template/edit-template/:id') })} to='/category-template'>Category Template</DropdownItem>
                        <DropdownItem tag={Link} className={classnames({ active: location && (location?.pathname === '/seriesLeaderBoard' || location?.pathname === '/seriesLeaderBoard/add-SeriesLeaderBoard' || location?.pathname?.includes('/seriesLeaderBoard/edit-SeriesLeaderBoard') || location?.pathname === '/seriesLeaderBoardCategory/:id' || location?.pathname?.includes('/seriesLeaderBoardCategory')) })} to='/seriesLeaderBoard'>Series Leaderboard</DropdownItem>
                      </div>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </Fragment>
              )
          }

            {((Auth && Auth === 'SUPER') || (adminPermission?.SUBADMIN !== 'N')) && (
            <Fragment>
              <UncontrolledDropdown nav inNavbar className={openCollapse ? 'custom-dropdown-collapse ' : 'custom-dropdown'} isOpen={isOpen && (modalType === 'Subadmin')} onMouseOver={() => !openCollapse && toggle1('Subadmin')} onMouseOut={() => closeModal()}>

                <DropdownToggle nav caret id='subadmin' className={`${classnames({ active: location && (location?.pathname?.includes('/sub-admin') || location?.pathname?.includes('/admin-logs')) })} ${subAdmin ? 'active-nav-link' : ''}`} onClick={() => openCollapse && setSubadmin(!subAdmin)}>
                  <img src={SubAdmin} alt='subadmin' />
                  {openCollapse && (
                  <>
                    <h4 className='w-100'>SUB ADMIN</h4>
                    <img src={subAdmin ? upArrow : downArrow} alt="" className='caretIcon'/>
                  </>
                  )}
                </DropdownToggle>
                {subAdmin && (
                <>
                  <div className='expand-menu'>
                    <DropdownItem tag={Link} className={classnames({ active: location && (location?.pathname === '/sub-admin/roles' || location?.pathname === '/sub-admin/add-role' || location?.pathname?.includes('/sub-admin/update-role/')) })} to='/sub-admin/roles'>Roles</DropdownItem>
                    <DropdownItem tag={Link} className={classnames({ active: location && (location?.pathname === '/sub-admin' || location?.pathname === '/sub-admin/add-sub-admin' || location?.pathname?.includes('/sub-admin/edit-sub-admin/')) })} to='/sub-admin'>Sub Admin</DropdownItem>
                    <DropdownItem tag={Link} className={classnames({ active: location && (location?.pathname?.includes('/admin-logs')) })} to='/admin-logs'>Admin Logs</DropdownItem>
                  </div>
                </>
                )}

                <DropdownMenu className='dropdown-subAdmin-inner'>
                  <h4 className='mb-0'>Sub Admin</h4>
                  <div className='dropdown-inner'>
                    <DropdownItem tag={Link} className={classnames({ active: location && (location?.pathname === '/sub-admin/roles' || location?.pathname === '/sub-admin/add-role' || location?.pathname?.includes('/sub-admin/update-role/')) })} to='/sub-admin/roles'>Roles</DropdownItem>
                    <DropdownItem tag={Link} className={classnames({ active: location && (location?.pathname === '/sub-admin' || location?.pathname === '/sub-admin/add-sub-admin' || location?.pathname?.includes('/sub-admin/edit-sub-admin/')) })} to='/sub-admin'>Sub Admin</DropdownItem>
                    <DropdownItem tag={Link} className={classnames({ active: location && (location?.pathname.includes('/admin-logs')) })} to='/admin-logs'>Admin Logs</DropdownItem>
                  </div>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Fragment>
            )
          }

            {
            (adminPermission?.LEAGUE === 'N')
              ? ''
              : (
                <Fragment>
                  <UncontrolledDropdown nav inNavbar className={openCollapse ? 'custom-dropdown-collapse ' : 'custom-dropdown'} isOpen={isOpen && (modalType === 'report')} onMouseOver={() => !openCollapse && toggle1('report')} onMouseOut={() => closeModal()}>
                    <div className={ `reportNavbar ${classnames({ active: location && (location?.pathname === '/reports/all-reports') }) && 'active-nav-link'} ${openCollapse ? 'custom-dropdown-collapse ' : 'custom-dropdown'}`} onClick={() => navigate('/reports/all-reports')}>
                      <img src={Report} alt='Report' />
                      {openCollapse && (
                      <>
                        {' '}
                        <h4 className='w-100'>REPORT</h4>
                        {' '}
                      </>
                      )}
                    </div>

                    <DropdownMenu className='dropdown-report-inner'>
                      <div className='dropdown-inner'>
                        <DropdownItem tag={Link} className={classnames({ active: location && (location?.pathname === '/reports/all-reports') })} to='/reports/all-reports'>Report</DropdownItem>
                      </div>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </Fragment>
                )
          }
          </div>

          <div className={`w-100 text-left ${openCollapse ? 'bottom-menu-collapse' : 'bottom-menu'} `}>
            <UncontrolledDropdown nav inNavbar className='login-dropdown'>
              <DropdownToggle nav caret className='w-100 d-flex align-items-center login-toggle'>
                <img src={Avatar} alt='Profile Pic' className='mr-2 avatar-image'/>
                {' '}
                {openCollapse ? Auth === 'SUPER' ? adminDetails?.sName + '(Super)' : adminDetails?.sName + '(Sub)' : ''}
              </DropdownToggle>
              <DropdownMenu className='login-option'>
                <DropdownItem className='login-user'>
                  {Auth === 'SUPER' ? adminDetails?.sName + '(Super)' : adminDetails?.sName + '(Sub)'}
                </DropdownItem>
                <DropdownItem onClick={onLogout} className='login'>
                  Logout
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
          <div className={openCollapse ? 'collapse-icon text-start' : 'collapse-icon text-center'} onClick={() => collapseFunction()}>
            <img src={openCollapse ? collapse : collapseExpand} alt="collapse" />
          </div>
        </Nav>
      </div>
    </Navbar>
  )
}

NavbarComponent.defaultProps = {
  history: {}
}

NavbarComponent.propTypes = {
  history: PropTypes.shape({
    location: PropTypes.shape({
      pathname: PropTypes.string
    })
  }),
  match: PropTypes.object,
  openCollapse: PropTypes.bool,
  setOpenCollapse: PropTypes.func
}

export default connect()(NavbarComponent)
