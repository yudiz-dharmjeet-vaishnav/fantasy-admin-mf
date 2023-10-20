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
            {(adminPermission?.COMPLAINT === 'N')
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
                    {setting && !(adminPermission.COMPLAINT === 'N') && (
                    <>
                      <div className='expand-menu'>
                        <Button tag={Link} to="/settings/feedback-complaint-management"> Feedbacks/Complaints</Button>
                      </div>
                    </>
                    )}
                    <DropdownMenu className='dropdown-setting-heading'>
                      <h4 className='mb-0'>Settings</h4>
                      <div className='dropdown-setting'>
                        {
                          ((Auth && Auth === 'SUPER') || (adminPermission?.COMPLAINT !== 'N')) && (
                            <DropdownItem tag={Link} className={classnames({ active: location && ((location?.pathname === '/settings/feedback-complaint-management') || (location?.pathname.includes('/settings/update-complaint-status'))) })} to='/settings/feedback-complaint-management'>Feedbacks/Complaints</DropdownItem>
                          )
                        }
                      </div>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </Fragment>
                )}

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
