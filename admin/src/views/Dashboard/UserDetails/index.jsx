import React from 'react'
import { Row, Col } from 'reactstrap'
import PropTypes from 'prop-types'
function UserDetails ({ dashBoardData }) {
  return (
    <>
      <div className='dashboard-user-detail'>
        <Row className='dashboard-row'>
          <Col className='deposit-col flex-grow-1' md={6} lg="auto">
            <div className='common-box-dashboard'>
              <div className='common-box-dashboard-div'>
                <h2 className='dashboard-heading'>
                  {' '}
                  {dashBoardData?.oUser?.nTotal}
                  {' '}
                </h2>
                <p className='text-label'>Total User</p>
              </div>

            </div>
          </Col>
          <Col className='withdraw-col flex-grow-1' md={6} lg="auto" >
            <div className='common-box-dashboard'>
              <div className='common-box-dashboard-div'>
                <h2 className='dashboard-heading'>
                  {' '}
                  {dashBoardData?.oUser?.nActive}
                  {' '}
                </h2>
                <p className='text-label'>Active Users</p>
              </div>
            </div>
          </Col>
          <Col className='free-contest-col flex-2 flex-grow-1' md={6} lg="auto" >
            <div className='common-box-dashboard'>
              <div className='common-box-dashboard-div'>
                <h2 className='dashboard-heading'>
                  {' '}
                  {dashBoardData?.oUser?.nInActive}
                  {' '}
                </h2>
                <p className='text-label'>Inactive Users</p>
              </div>
            </div>
          </Col>
          <Col className='paid-contest-col flex-2 flex-grow-1' md={6} lg="auto" >
            <div className='common-box-dashboard'>
              <div className='common-box-dashboard-div'>
                <h2 className='dashboard-heading'>
                  {' '}
                  {dashBoardData?.oUser?.nFreeLeague}
                  {' '}
                </h2>
                <p className='text-label'>Free League Users</p>
              </div>
            </div>
          </Col>
          <Col className='Dropped-user-col flex-2 flex-grow-1' md={6} lg="auto" >
            <div className='common-box-dashboard'>
              <div className='common-box-dashboard-div'>
                <h2 className='dashboard-heading'>
                  {' '}
                  {dashBoardData?.oUser?.nDroppedRegistrations}
                  {' '}
                </h2>
                <p className='text-label'>Dropped Users</p>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  )
}

UserDetails.propTypes = {
  dashBoardData: PropTypes.object
}
export default UserDetails
