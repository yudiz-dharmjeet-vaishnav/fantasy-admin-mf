import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button, DropdownItem } from 'reactstrap'
import classnames from 'classnames'
import PropTypes from 'prop-types'

// Common Sport dropDown List

function SportDropdown (props) {
  const { sportName, Auth, adminPermission, openCollapse } = props
  const navigate = useNavigate()
  const location = useLocation()
  return (
    <>
      {openCollapse && (
      <div className='expand-menu'>
        <Button className={classnames({
          active: location && location.pathname.includes((sportName).toLowerCase() + '/match-management')
        })}
          tag={Link}
          to={'/' + sportName.toLowerCase() + '/match-management'}
        >
          {' '}
          Matches List View
        </Button>
        <Button className={classnames({ active: location && location.pathname.includes((sportName).toLowerCase() + '/matches-app-view') })} tag={Link} to={'/' + sportName.toLowerCase() + '/matches-app-view'}> Matches App View</Button>
        <Button className={classnames({ active: location && location.pathname.includes((sportName).toLowerCase() + '/season-management') })} tag={Link} to={'/' + sportName.toLowerCase() + '/season-management'}> Season</Button>
        <Button className={classnames({ active: location && (location.pathname.includes((sportName).toLowerCase() + '/team-management')) })} tag={Link} to={'/' + sportName.toLowerCase() + '/team-management'}> Teams</Button>
        <Button className={classnames({ active: location && (location.pathname.includes((sportName).toLowerCase() + '/player-management')) })} tag={Link} to={'/' + sportName.toLowerCase() + '/player-management'}> Players</Button>
        <Button className={classnames({ active: location && (location.pathname.includes((sportName).toLowerCase() + '/player-role-management')) })} tag={Link} to={'/' + sportName.toLowerCase() + '/player-role-management'}> Player Role</Button>
        <Button className={classnames({ active: location && ((location.pathname === (sportName).toLowerCase() + '/point-system') || location.pathname.includes('/' + (sportName).toLowerCase() + '/point-system')) })} tag={Link} to={'/' + sportName.toLowerCase() + '/point-system'}> Point System</Button>
      </div>
      )}
      { !openCollapse && (
      <>
        <h4 className='mb-0'>{sportName.charAt(0).toUpperCase() + sportName.slice(1).toLowerCase()}</h4>
        <div className='dropdown-inner'>
          {
            ((Auth && Auth === 'SUPER') || (adminPermission?.MATCH !== 'N')) && (
              <DropdownItem className={classnames({
                active: location && location.pathname.includes((sportName).toLowerCase() +
                  '/match-management')
              })}
                onClick={() => navigate('/' + (sportName).toLowerCase() + '/match-management')}
              >
                Matches List View
              </DropdownItem>
            )
          }
          {
            ((Auth && Auth === 'SUPER') || (adminPermission?.MATCH !== 'N')) && (
              <DropdownItem className={classnames({ active: location && location.pathname.includes((sportName).toLowerCase() + '/matches-app-view') })} onClick={() => navigate('/' + (sportName).toLowerCase() + '/matches-app-view')}>Matches App View</DropdownItem>
            )
          }
          {
            ((Auth && Auth === 'SUPER') || (adminPermission?.SEASON !== 'N')) && (
              <DropdownItem className={classnames({ active: location && location.pathname.includes((sportName).toLowerCase() + '/season-management') })} onClick={() => navigate('/' + (sportName).toLowerCase() + '/season-management')}>Season</DropdownItem>
            )
          }
          {
            ((Auth && Auth === 'SUPER') || (adminPermission?.TEAM !== 'N')) && (
              <DropdownItem className={classnames({ active: location && (location.pathname.includes((sportName).toLowerCase() + '/team-management')) })} onClick={() => navigate('/' + (sportName).toLowerCase() + '/team-management')}>Teams</DropdownItem>
            )
          }
          {
            ((Auth && Auth === 'SUPER') || (adminPermission?.PLAYER !== 'N')) && (
              <DropdownItem className={classnames({ active: location && (location.pathname.includes((sportName).toLowerCase() + '/player-management')) })} onClick={() => navigate('/' + (sportName).toLowerCase() + '/player-management')}>Players</DropdownItem>
            )
          }
          {
            ((Auth && Auth === 'SUPER') || (adminPermission?.ROLES !== 'N')) && (
              <DropdownItem className={classnames({ active: location && (location.pathname.includes((sportName).toLowerCase() + '/player-role-management')) })} onClick={() => navigate('/' + (sportName).toLowerCase() + '/player-role-management')}>Player Role</DropdownItem>
            )
          }
          {
            ((Auth && Auth === 'SUPER') || (adminPermission?.SCORE_POINT !== 'N')) && (
              <DropdownItem className={classnames({ active: location && ((location.pathname === (sportName).toLowerCase() + '/point-system') || location.pathname.includes('/' + (sportName).toLowerCase() + '/point-system')) })} onClick={() => navigate('/' + (sportName).toLowerCase() + '/point-system')}>Point System</DropdownItem>
            )
          }
        </div>
      </>
      )}
    </>
  )
}

SportDropdown.propTypes = {
  sportName: PropTypes.string,
  Auth: PropTypes.string,
  adminPermission: PropTypes.string,
  openCollapse: PropTypes.bool
}
export default SportDropdown
