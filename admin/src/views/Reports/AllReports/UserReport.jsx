import React, { Fragment } from 'react'
import { useDispatch } from 'react-redux'
import { Button, Col, FormGroup, Row, UncontrolledTooltip } from 'reactstrap'
import moment from 'moment'
import PropTypes from 'prop-types'

import infoIcon from '../../../assets/images/info-icon.svg'
import refreshIcon from '../../../assets/images/refresh-icon-1.svg'

import DataNotFound from '../../../components/DataNotFound'
import Info from '../../../helpers/info'
import { updateGeneralizeReport } from '../../../actions/reports'

function UserReport (props) {
  const { permission, dateWiseReports, isOpen, userType, TotalUsers, RegisteredUsers, DroppedUsers, LoginUser, userBonus, Withdraw, Deposit, TDS, BonusExpire, token, setLoading } = props

  const dispatch = useDispatch()

  // dispatch action to update the generalize data
  function updateGeneralizeReportFunc (key) {
    if (token) {
      const generalizeReportData = {
        key, userType, token
      }
      dispatch(updateGeneralizeReport(generalizeReportData))
      setLoading(true)
    }
  }
  return (
    <>
      {isOpen === 'USER_REPORT' && dateWiseReports?.length !== 0 && (
      <section className='user-section'>
        <Row>
          <Col className='mb-4' lg='4' md='6'>
            <div className='allReports-table'>
              <div className='allReports-table-responsive'>
                <div className='total-user d-flex justify-content-between'>
                  <h3>
                    Total Users
                    <img className='custom-info' id='TU' src={infoIcon} />
                    <UncontrolledTooltip className='bg-default-s' delay={0} placement='bottom' target='TU'>
                      <p>{userType === 'U' ? Info?.totalUsers?.replace('##', '') : Info?.totalUsers?.replace('##', 'system')}</p>
                    </UncontrolledTooltip>
                  </h3>
                </div>
                {dateWiseReports && dateWiseReports?.length !== 0 && dateWiseReports?.oTotalUser
                  ? (
                    <>
                      <div className='table-date'>
                        Last Update :
                        {dateWiseReports?.oTotalUser?.dUpdatedAt
                          ? moment(dateWiseReports?.oTotalUser?.dUpdatedAt)?.format('DD/MM/YYYY hh:mm A')
                          : 'No Data Available'}
                      </div>
                      <table className='table-user'>
                        <tbody className='reports-login-users'>
                          <tr>
                            <td>Total Users</td>
                            <td>{dateWiseReports?.oTotalUser?.nTotalUsers || 0}</td>
                          </tr>
                          <tr>
                            <td>Email Verified Users</td>
                            <td>{dateWiseReports?.oTotalUser?.nTotalEmailVerifiedUsers || '0'}</td>
                          </tr>
                          <tr>
                            <td>Mobile Number Verified Users</td>
                            <td>{dateWiseReports?.oTotalUser?.nTotalPhoneVerifiedUsers || '0'}</td>
                          </tr>
                        </tbody>
                      </table>
                    </>
                    )
                  : (<Col className='notFoundImage'><DataNotFound message="Data" obj=""/></Col>)}
              </div>
            </div>
          </Col>

          <Col className='mb-4' lg='4' md='6'>
            <Fragment>
              <div className='allReports-table'>
                <div className='allReports-table-responsive'>
                  <div className='total-user d-flex justify-content-between'>
                    <h3>
                      Log In Users
                      <img className='custom-info' id='LU' src={infoIcon} />
                      <UncontrolledTooltip className='bg-default-s' delay={0} placement='bottom' target='LU'>
                        <p>{userType === 'U' ? Info?.loggedInUsers?.replace('##', '') : Info?.loggedInUsers?.replace('##', 'system')}</p>
                      </UncontrolledTooltip>
                    </h3>
                  </div>
                  {dateWiseReports && dateWiseReports?.oLoginUser && dateWiseReports !== 0
                    ? (
                      <>
                        <div className='table-date' >
                          Last Update :
                          {dateWiseReports?.oLoginUser?.dUpdatedAt
                            ? moment(dateWiseReports?.oLoginUser?.dUpdatedAt)?.format('DD/MM/YYYY hh:mm A')
                            : 'No Data Available'}
                        </div>
                        <table className='table-user'>
                          <tbody className='reports-login-users'>
                            <tr>
                              <td>Total</td>
                              <td>{dateWiseReports?.oLoginUser?.Total || '0'}</td>
                            </tr>
                          </tbody>
                        </table>
                      </>
                      )
                    : (<Col className='notFoundImage'><DataNotFound message="Data" obj=""/></Col>)}
                </div>
              </div>
            </Fragment>
          </Col>

          <Col className='mb-4' lg='4' md='6'>
            <Fragment>
              <div className='allReports-table'>
                <div className='allReports-table-responsive'>
                  <div className='total-user d-flex justify-content-between'>
                    <h3>
                      Registered Users
                      <img className='custom-info' id='RU' src={infoIcon} />
                      <UncontrolledTooltip className='bg-default-s' delay={0} placement='bottom' target='RU'>
                        <p>{userType === 'U' ? Info?.registeredUsers?.replace('##', '') : Info?.registeredUsers?.replace('##', 'system')}</p>
                      </UncontrolledTooltip>
                    </h3>
                  </div>
                  {dateWiseReports && dateWiseReports !== 0 && dateWiseReports?.oRegisterUser
                    ? (
                      <>
                        <div className='table-date'>
                          Last Update :
                          {dateWiseReports?.oRegisterUser?.dUpdatedAt
                            ? moment(dateWiseReports?.oRegisterUser?.dUpdatedAt)?.format('DD/MM/YYYY hh:mm A')
                            : 'No Data Available'}
                        </div>
                        <table className='table-user'>
                          <tbody className='reports-total-users'>
                            <tr>
                              <td>Total</td>
                              <td>{dateWiseReports?.oRegisterUser?.Total || '0'}</td>
                            </tr>
                          </tbody>
                        </table>
                      </>
                      )
                    : ('')}

                  {dateWiseReports && dateWiseReports?.length !== 0 && dateWiseReports?.oRegisterUser && dateWiseReports?.oRegisterUser?.aPlatformWiseUser
                    ? (
                      <div className='Platform'>
                        <p className='platform-heading'>Platform Wise Registered Users </p>
                        <div className='Platform-data'>
                          {dateWiseReports?.oRegisterUser?.aPlatformWiseUser?.map((platformwiseuser, index) => (
                            <Fragment key={index}>
                              <h3 className='key'>
                                <p className='name'>
                                  {platformwiseuser?.eTitle && platformwiseuser?.eTitle === 'O'
                                    ? 'Other'
                                    : platformwiseuser?.eTitle === 'A'
                                      ? 'Android'
                                      : platformwiseuser?.eTitle === 'I'
                                        ? 'iOS'
                                        : platformwiseuser?.eTitle === 'W'
                                          ? 'Web'
                                          : ''}
                                </p>
                                <p className='value'>{platformwiseuser?.nValue ? platformwiseuser?.nValue : '0'}</p>
                              </h3>
                            </Fragment>
                          )
                          )}
                        </div>
                      </div>
                      )
                    : (<Col className='notFoundImage'><DataNotFound message="Data" obj=""/></Col>)}
                </div>
              </div>
            </Fragment>
          </Col>

          <Col className='mb-4' lg='4' md='6'>
            <Fragment>
              <div className='allReports-table'>
                <div className='allReports-table-responsive'>
                  <div className='total-user d-flex justify-content-between'>
                    <h3>
                      Dropped Users
                      <img className='custom-info' id='DR' src={infoIcon} />
                      <UncontrolledTooltip className='bg-default-s' delay={0} placement='bottom' target='DR'>
                        <p>{userType === 'U' ? Info?.droppedUsers?.replace('##', '') : Info?.droppedUsers?.replace('##', 'system')}</p>
                      </UncontrolledTooltip>
                    </h3>
                  </div>
                  {dateWiseReports && dateWiseReports?.oDroppedRegistrations && dateWiseReports !== 0
                    ? (
                      <>
                        <div className='table-date' >
                          Last Update :
                          {dateWiseReports?.oDroppedRegistrations?.dUpdatedAt
                            ? moment(dateWiseReports?.oDroppedRegistrations?.dUpdatedAt)?.format('DD/MM/YYYY hh:mm A')
                            : 'No Data Available'}
                        </div>
                        <table className='table-user'>
                          <tbody className='reports-login-users'>
                            <tr>
                              <td>Total</td>
                              <td>{dateWiseReports?.oDroppedRegistrations?.Total || '0'}</td>
                            </tr>
                          </tbody>
                        </table>
                      </>
                      )
                    : (<Col className='notFoundImage'><DataNotFound message="Data" obj=""/></Col>)}
                </div>
              </div>
            </Fragment>
          </Col>

          <Col className='mb-4' lg='4' md='6'>
            <div className='allReports-table'>
              <div className='allReports-table-responsive'>
                <div className='total-user d-flex justify-content-between'>
                  <h3>
                    Bonus Expire
                    <img className='custom-info' id='BE' src={infoIcon} />
                    <UncontrolledTooltip className='bg-default-s' delay={0} placement='bottom' target='BE'>
                      <p>{userType === 'U' ? Info?.bonusExpire?.replace('##', '') : Info?.bonusExpire?.replace('##', 'System')}</p>
                    </UncontrolledTooltip>
                  </h3>
                </div>
                {dateWiseReports && dateWiseReports?.length !== 0 && dateWiseReports?.oBonusExpire
                  ? (
                    <>
                      <div className='table-date'>
                        Last Update :
                        {dateWiseReports?.oBonusExpire?.dUpdatedAt
                          ? moment(dateWiseReports?.oBonusExpire?.dUpdatedAt).format('DD/MM/YYYY hh:mm A')
                          : 'No Data Available'}
                      </div>
                      <table className='table-user'>
                        <tbody className='reports-login-users'>
                          <tr>
                            <td>Total</td>
                            <td>{dateWiseReports?.oBonusExpire?.nTotal || '0'}</td>
                          </tr>
                        </tbody>
                      </table>
                    </>
                    )
                  : (<Col className='notFoundImage'><DataNotFound message="Data" obj=""/></Col>)}
              </div>
            </div>
          </Col>

          <Col className='mb-4' lg='4' md='6'>
            <Fragment>
              <div className='allReports-table'>
                <div className='allReports-table-responsive'>
                  <div className='total-user d-flex justify-content-between'>
                    <h3>
                      User Bonus
                      <img className='custom-info' id='UB' src={infoIcon} />
                      <UncontrolledTooltip className='bg-default-s' delay={0} placement='bottom' target='UB'>
                        <p>{userType === 'U' ? Info?.userBonus?.replace(/##/g, '') : Info?.userBonus?.replace('##', 'System')}</p>
                      </UncontrolledTooltip>
                    </h3>
                  </div>
                  {dateWiseReports && dateWiseReports !== 0 && dateWiseReports?.oUserBonus
                    ? (
                      <>
                        <div className='table-date'>
                          Last Update :
                          {dateWiseReports?.oUserBonus?.dUpdatedAt
                            ? moment(dateWiseReports?.oUserBonus?.dUpdatedAt)?.format('DD/MM/YYYY hh:mm A')
                            : 'No Data Available'}
                        </div>
                        <table className='table-user'>
                          <tbody className='reports-login-users'>
                            <tr>
                              <td>Total</td>
                              <td>{dateWiseReports?.oUserBonus?.nTotal || '0'}</td>
                            </tr>
                          </tbody>
                        </table>
                      </>
                      )
                    : (<Col className='notFoundImage'><DataNotFound message="Data" obj=""/></Col>)}
                </div>
              </div>
            </Fragment>
          </Col>

          <Col className='mb-4' lg='4' md='6'>
            <Fragment>
              <div className='allReports-table'>
                <div className='allReports-table-responsive'>
                  <div className='total-user d-flex justify-content-between'>
                    <h3>
                      TDS
                      <img className='custom-info' id='TDS' src={infoIcon} />
                      <UncontrolledTooltip className='bg-default-s' delay={0} placement='bottom' target='TDS'>
                        <p>{userType === 'U' ? Info?.tds?.replace('##', '') : Info?.tds?.replace('##', 'System')}</p>
                      </UncontrolledTooltip>
                    </h3>
                  </div>
                  {dateWiseReports && dateWiseReports !== 0 && dateWiseReports?.oTds
                    ? (
                      <>
                        <div className='table-date'>
                          Last Update :
                          {dateWiseReports?.oTds?.dUpdatedAt
                            ? moment(dateWiseReports?.oTds?.dUpdatedAt)?.format('DD/MM/YYYY hh:mm A')
                            : 'No Data Available'}
                        </div>
                        <table className='table-user'>
                          <tbody className='reports-login-users'>
                            <tr>
                              <td>Total</td>
                              <td>{dateWiseReports?.oTds?.nTotalTds || '0'}</td>
                            </tr>
                            <tr>
                              <td>Total Pending TDS</td>
                              <td>{dateWiseReports?.oTds?.nTotalPendingTds || '0'}</td>
                            </tr>
                            <tr>
                              <td>Total Active TDS</td>
                              <td>{dateWiseReports?.oTds?.nTotalActiveTds || '0'}</td>
                            </tr>
                          </tbody>
                        </table>
                      </>
                      )
                    : (<Col className='notFoundImage'><DataNotFound message="Data" obj=""/></Col>)}
                </div>
              </div>
            </Fragment>
          </Col>

          <Col className='mb-4' lg='4' md='6'>
            <Fragment>
              <div className='allReports-table'>
                <div className='allReports-table-responsive'>
                  <div className='total-user d-flex justify-content-between'>
                    <h3>
                      Deposit
                      <img className='custom-info' id='DEPOSIT' src={infoIcon} />
                      <UncontrolledTooltip className='bg-default-s' delay={0} placement='bottom' target='DEPOSIT'>
                        <p>{userType === 'U' ? Info?.deposit?.replace('##', '') : Info?.deposit?.replace('##', 'System')}</p>
                      </UncontrolledTooltip>
                    </h3>
                  </div>
                  {dateWiseReports && dateWiseReports?.length !== 0 && dateWiseReports?.oDeposit
                    ? (
                      <>
                        <div className='table-date'>
                          Last Update :
                          {dateWiseReports?.oDeposit && dateWiseReports?.oDeposit?.dUpdatedAt
                            ? moment(dateWiseReports?.oDeposit?.dUpdatedAt)?.format('DD/MM/YYYY hh:mm A')
                            : 'No Data Available'}
                        </div>
                        <table className='table-user'>
                          <tbody className='reports-total-users'>
                            <tr>
                              <td>Total Deposits</td>
                              <td>{dateWiseReports?.oDeposit?.nTotalDeposits || '0'}</td>
                            </tr>
                            <tr>
                              <td>Total Winnings</td>
                              <td>{dateWiseReports?.oDeposit?.nTotalWinnings || '0'}</td>
                            </tr>
                          </tbody>
                        </table>
                      </>
                      )
                    : (<Col className='notFoundImage'><DataNotFound message="Data" obj=""/></Col>)}
                  {dateWiseReports && dateWiseReports?.length !== 0 && dateWiseReports?.oDeposit && dateWiseReports?.oDeposit?.aDeposits && (
                  <>
                    <div className='Platform'>
                      <p className='platform-heading'>Methods</p>
                      <div className='Platform-data'>
                        {dateWiseReports?.oDeposit?.aDeposits?.map((deposits, index) => (
                          <Fragment key={deposits?._id}>
                            <h3 className='key'>
                              <p className='name'>{deposits?.eTitle || '-'}</p>
                              <p className='value'>{deposits?.nValue || '0'}</p>
                            </h3>
                          </Fragment>
                        ))}
                      </div>
                    </div>
                  </>
                  )}
                </div>
              </div>
            </Fragment>
          </Col>

          <Col className='mb-4' lg='4' md='6'>
            <Fragment>
              <div className='allReports-table'>
                <div className='allReports-table-responsive'>
                  <div className='total-user d-flex justify-content-between'>
                    <h3>
                      Withdraw
                      <img className='custom-info' id='WITHDRAW' src={infoIcon} />
                      <UncontrolledTooltip className='bg-default-s' delay={0} placement='bottom' target='WITHDRAW'>
                        <p>{userType === 'U' ? Info?.withdraw?.replace('##', '') : Info?.withdraw?.replace('##', 'System')}</p>
                      </UncontrolledTooltip>
                    </h3>
                  </div>
                  {dateWiseReports && dateWiseReports !== 0 && dateWiseReports?.oWithdraw
                    ? (
                      <>
                        <div className='table-date'>
                          Last Update :
                          {dateWiseReports?.oWithdraw && dateWiseReports?.oWithdraw?.dUpdatedAt
                            ? moment(dateWiseReports?.oWithdraw?.dUpdatedAt).format('DD/MM/YYYY hh:mm A')
                            : 'No Data Available'}
                        </div>
                        <table className='table-user'>
                          <tbody className='reports-total-users'>
                            <tr>
                              <td>Total Withdrawals</td>
                              <td>{dateWiseReports?.oWithdraw?.nTotalWithdrawals || '0'}</td>
                            </tr>
                          </tbody>
                        </table>
                      </>
                      )
                    : (<Col className='notFoundImage'><DataNotFound message="Data" obj=""/></Col>)}
                  {dateWiseReports && dateWiseReports !== 0 && dateWiseReports?.oWithdraw && dateWiseReports?.oWithdraw?.aSuccessWithdrawals && dateWiseReports?.oWithdraw?.aSuccessWithdrawals?.length !== 0 && (
                  <>
                    <div className='Platform'>
                      <p className='platform-heading'>SuccessFul Withdrawal</p>
                      <div className='Platform-data'>
                        {dateWiseReports?.oWithdraw?.aSuccessWithdrawals?.map((successWithdrawals) => (
                          <Fragment key={successWithdrawals?._id}>
                            <h3 className='key'>
                              <p className='name'>{successWithdrawals?.eTitle || '-'}</p>
                              <p className='value'>{successWithdrawals?.nValue || 0}</p>
                            </h3>
                          </Fragment>
                        ))}
                      </div>
                    </div>
                  </>
                  )}
                  {dateWiseReports && dateWiseReports !== 0 && dateWiseReports?.oWithdraw && dateWiseReports?.oWithdraw?.aPendingWithdrawals && dateWiseReports?.oWithdraw?.aPendingWithdrawals?.length !== 0 && (
                  <>
                    <div className='Platform'>
                      <p className='platform-data'> Pending Withdrawal</p>
                      <div className='Platform-data'>
                        {dateWiseReports?.oWithdraw?.aPendingWithdrawals?.map((pendingWithdrawals) => (
                          <Fragment key={pendingWithdrawals?._id}>
                            <h3 className='key'>
                              <p className='name'>{pendingWithdrawals?.eTitle || '-'}</p>
                              <p className='value'>{pendingWithdrawals?.nValue || '0'}</p>
                            </h3>
                          </Fragment>
                        ))}
                      </div>
                    </div>
                  </>
                  )}
                </div>
              </div>
            </Fragment>
          </Col>
        </Row>
      </section>
      )}

      {isOpen === 'USER_REPORT' && dateWiseReports?.length === 0 && (
      <section className='user-section'>
        <Row>
          <Col className='mb-4' lg='4' md='6'>
            <Fragment>
              <div className='allReports-table'>
                <div className='allReports-table-responsive'>
                  <div className='total-user d-flex justify-content-between'>
                    <h3>
                      Total Users
                      <img className='custom-info' id='TU' src={infoIcon} />
                      <UncontrolledTooltip className='bg-default-s' delay={0} placement=' ' target='TU'>
                        <p>{userType === 'U' ? Info?.totalUsers?.replace('##', '') : Info?.totalUsers?.replace('##', 'system')}</p>
                      </UncontrolledTooltip>
                    </h3>
                    {permission && (
                    <Button color='link' onClick={() => updateGeneralizeReportFunc('TU')}>
                      <img alt='Users' height='20px' src={refreshIcon} width='20px'/>
                    </Button>
                    )}
                  </div>
                  {TotalUsers
                    ? (
                      <>
                        <div className='table-date'>
                          Last Update :
                          {TotalUsers?.dUpdatedAt
                            ? moment(TotalUsers?.dUpdatedAt)?.format('DD/MM/YYYY hh:mm A')
                            : 'No Data Available'}
                        </div>
                        <table className='table-user'>
                          <tbody className='reports-total-users'>
                            <tr>
                              <td>Total Users</td>
                              <td>{TotalUsers?.nTotalUsers || '0'}</td>
                            </tr>
                            <tr>
                              <td>Email Verified Users</td>
                              <td>{TotalUsers?.nTotalEmailVerifiedUsers || '0'}</td>
                            </tr>
                            <tr>
                              <td>Mobile Number Verified Users</td>
                              <td>{TotalUsers?.nTotalPhoneVerifiedUsers || '0'}</td>
                            </tr>
                          </tbody>
                        </table>
                      </>
                      )
                    : (<Col className='notFoundImage'><DataNotFound message="Data" obj=""/></Col>)}
                  {RegisteredUsers && RegisteredUsers?.aPlatformWiseUser && RegisteredUsers?.length !== 0 && (
                  <div className='Platform'>
                    <p className='platform-heading'>Platform Wise Registered Users</p>
                    <div className='Platform-data'>
                      {RegisteredUsers?.aPlatformWiseUser?.map((platformwiseuser, index) => (
                        <Fragment key={index}>
                          <h3 className='key'>
                            <p className='name'>
                              {platformwiseuser?.eTitle && platformwiseuser?.eTitle === 'O'
                                ? 'Other'
                                : platformwiseuser?.eTitle === 'A'
                                  ? 'Android'
                                  : platformwiseuser?.eTitle === 'I'
                                    ? 'iOS'
                                    : platformwiseuser?.eTitle === 'W'
                                      ? 'Web'
                                      : ''}
                            </p>
                            <p className='value'>{platformwiseuser?.nValue ? platformwiseuser?.nValue : '0'}</p>
                          </h3>
                        </Fragment>
                      )
                      )}
                    </div>
                  </div>
                  )}
                </div>
              </div>
            </Fragment>
          </Col>

          <Col className='mb-4' lg='4' md='6'>
            <Fragment>
              <div className='allReports-table'>
                <div className='allReports-table-responsive'>
                  <div className='total-user d-flex justify-content-between'>
                    <h3>
                      Log In Users
                      <img className='custom-info' id='LU' src={infoIcon} />
                      <UncontrolledTooltip className='bg-default-s' delay={0} placement='bottom' target='LU'>
                        <p>{userType === 'U' ? Info?.loggedInUsers?.replace('##', '') : Info?.loggedInUsers?.replace('##', 'system')}</p>
                      </UncontrolledTooltip>
                    </h3>
                    {permission && (
                    <Button color='link' onClick={() => updateGeneralizeReportFunc('LU')}>
                      <img alt='Users' height='20px' src={refreshIcon} width='20px' />
                    </Button>
                    )}
                  </div>
                  <div className='table-date'>
                    Last Update :
                    {LoginUser?.dUpdatedAt
                      ? moment(LoginUser?.dUpdatedAt)?.format('DD/MM/YYYY hh:mm A')
                      : 'No Data Available'}
                  </div>
                  {LoginUser && LoginUser !== 0
                    ? (
                      <table className='table-user'>
                        <tbody className='reports-login-users'>
                          <tr>
                            <td>Today</td>
                            <td>{LoginUser?.nToday || '0'}</td>
                          </tr>
                          <tr>
                            <td>Yesterday</td>
                            <td>{LoginUser?.nYesterday || '0'}</td>
                          </tr>
                          <tr>
                            <td>Last Week</td>
                            <td>{LoginUser?.nLastWeek || '0'}</td>
                          </tr>
                          <tr>
                            <td>Last Month</td>
                            <td>{LoginUser?.nLastMonth || '0'}</td>
                          </tr>
                          <tr>
                            <td>Last Year</td>
                            <td>{LoginUser?.nLastYear || '0'}</td>
                          </tr>
                        </tbody>
                      </table>
                      )
                    : (<Col className='notFoundImage'><DataNotFound message="Data" obj=""/></Col>)}
                </div>
              </div>
            </Fragment>
          </Col>

          <Col className='mb-4' lg='4' md='6'>
            <Fragment>
              <div className='allReports-table'>
                <div className='allReports-table-responsive'>
                  <div className='total-user d-flex justify-content-between'>
                    <h3>
                      Registered Users
                      <img className='custom-info' id='RU' src={infoIcon} />
                      <UncontrolledTooltip className='bg-default-s' delay={0} placement='bottom' target='RU'>
                        <p>{userType === 'U' ? Info?.registeredUsers?.replace('##', '') : Info?.registeredUsers?.replace('##', 'system')}</p>
                      </UncontrolledTooltip>
                    </h3>
                    {permission && (
                    <Button color='link' onClick={() => updateGeneralizeReportFunc('RU')}>
                      <img alt='Users' height='20px' src={refreshIcon} width='20px'/>
                    </Button>
                    )}
                  </div>
                  <div className='table-date'>
                    Last Update :
                    {RegisteredUsers?.dUpdatedAt
                      ? moment(RegisteredUsers?.dUpdatedAt)?.format('DD/MM/YYYY hh:mm A')
                      : 'No Data Available'}
                  </div>
                  {RegisteredUsers && RegisteredUsers?.length !== 0
                    ? (
                      <table className='table-user'>
                        <tbody className='reports-login-users'>
                          <tr>
                            <td>Today</td>
                            <td>{RegisteredUsers?.nToday || '0'}</td>
                          </tr>
                          <tr>
                            <td>Yesterday</td>
                            <td>{RegisteredUsers?.nYesterday || '0'}</td>
                          </tr>
                          <tr>
                            <td>Last Week</td>
                            <td>{RegisteredUsers?.nLastWeek || '0'}</td>
                          </tr>
                          <tr>
                            <td>Last Month</td>
                            <td>{RegisteredUsers?.nLastMonth || '0'}</td>
                          </tr>
                          <tr>
                            <td>Last Year</td>
                            <td>{RegisteredUsers?.nLastYear || '0'}</td>
                          </tr>
                        </tbody>
                      </table>
                      )
                    : (<Col className='notFoundImage'><DataNotFound message="Data" obj=""/></Col>)}
                </div>
              </div>
            </Fragment>
          </Col>

          <Col className='mb-4' lg='4' md='6'>
            <Fragment>
              <div className='allReports-table'>
                <div className='allReports-table-responsive'>
                  <div className='total-user d-flex justify-content-between'>
                    <h3>
                      Dropped Users
                      <img className='custom-info' id='DR' src={infoIcon} />
                      <UncontrolledTooltip className='bg-default-s' delay={0} placement='bottom' target='DR'>
                        <p>{userType === 'U' ? Info?.droppedUsers?.replace('##', '') : Info?.droppedUsers?.replace('##', 'system')}</p>
                      </UncontrolledTooltip>
                    </h3>
                    {permission && (
                    <Button color='link' onClick={() => updateGeneralizeReportFunc('DR')}>
                      <img alt='Users' height='20px' src={refreshIcon} width='20px'/>
                    </Button>
                    )}
                  </div>
                  <div className='table-date'>
                    Last Update :
                    {DroppedUsers?.dUpdatedAt
                      ? moment(DroppedUsers?.dUpdatedAt)?.format('DD/MM/YYYY hh:mm A')
                      : 'No Data Available'}
                  </div>
                  {DroppedUsers
                    ? (
                      <table className='table-user'>
                        <tbody className='reports-login-users'>
                          <tr>
                            <td>Today</td>
                            <td>{DroppedUsers?.nToday || '0'}</td>
                          </tr>
                          <tr>
                            <td>Yesterday</td>
                            <td>{DroppedUsers?.nYesterday || '0'}</td>
                          </tr>
                          <tr>
                            <td>Last Week</td>
                            <td>{DroppedUsers?.nLastWeek || '0'}</td>
                          </tr>
                          <tr>
                            <td>Last Month</td>
                            <td>{DroppedUsers?.nLastMonth || '0'}</td>
                          </tr>
                          <tr>
                            <td>Last Year</td>
                            <td>{DroppedUsers?.nLastYear || '0'}</td>
                          </tr>
                        </tbody>
                      </table>
                      )
                    : (<Col className='notFoundImage'><DataNotFound message="Data" obj=""/></Col>)}
                </div>
              </div>
            </Fragment>
          </Col>

          <Col className='mb-4' lg='4' md='6'>
            <Fragment>
              <div className='allReports-table'>
                <div className='allReports-table-responsive'>
                  <div className='total-user d-flex justify-content-between'>
                    <h3>
                      User Bonus
                      <img className='custom-info' id='UB' src={infoIcon} />
                      <UncontrolledTooltip className='bg-default-s' delay={0} placement='bottom' target='UB'>
                        <p>{userType === 'U' ? Info?.userBonus?.replace(/##/g, '') : Info?.userBonus?.replace(/##/g, 'System')}</p>
                      </UncontrolledTooltip>
                    </h3>
                    {permission && (
                    <Button color='link' onClick={() => updateGeneralizeReportFunc('UB')}>
                      <img alt='Users' height='20px' src={refreshIcon} width='20px'/>
                    </Button>
                    )}
                  </div>
                  {userBonus && (
                  <div className='table-date'>
                    Last Update :
                    {userBonus && userBonus?.dUpdatedAt
                      ? moment(userBonus?.dUpdatedAt)?.format('DD/MM/YYYY hh:mm A')
                      : 'No Data Available'}
                  </div>
                  )}
                  {userBonus
                    ? (
                      <table className='table-user'>
                        <tbody className='reports-login-users'>
                          <tr>
                            <td>Total</td>
                            <td>{userBonus?.nTotal || '0'}</td>
                          </tr>
                          <tr>
                            <td>Today</td>
                            <td>{userBonus?.nToday || '0'}</td>
                          </tr>
                          <tr>
                            <td>Yesterday</td>
                            <td>{userBonus?.nYesterday || '0'}</td>
                          </tr>
                          <tr>
                            <td>Last Week</td>
                            <td>{userBonus?.nLastWeek || '0'}</td>
                          </tr>
                          <tr>
                            <td>Last Month</td>
                            <td>{userBonus?.nLastMonth || '0'}</td>
                          </tr>
                          <tr>
                            <td>Last Year</td>
                            <td>{userBonus?.nLastYear || '0'}</td>
                          </tr>
                        </tbody>
                      </table>
                      )
                    : (<Col className='notFoundImage'><DataNotFound message="Data" obj=""/></Col>)}
                </div>
              </div>
            </Fragment>
          </Col>

          <Col className='mb-4' lg='4' md='6'>
            <Fragment>
              <div className='allReports-table'>
                <div className='allReports-table-responsive'>
                  <div className='total-user d-flex justify-content-between'>
                    <h3>
                      Bonus Expire
                      <img className='custom-info' id='BE' src={infoIcon} />
                      <UncontrolledTooltip className='bg-default-s' delay={0} placement='bottom' target='BE'>
                        <p>{userType === 'U' ? Info?.bonusExpire?.replace('##', '') : Info?.bonusExpire?.replace('##', 'System')}</p>
                      </UncontrolledTooltip>
                    </h3>
                    {permission && (
                    <Button color='link' onClick={() => updateGeneralizeReportFunc('BE')}>
                      <img alt='Users' height='20px' src={refreshIcon} width='20px'/>
                    </Button>
                    )}
                  </div>
                  {BonusExpire && (
                  <div className='table-date'>
                    Last Update :
                    {BonusExpire && BonusExpire?.dUpdatedAt
                      ? moment(BonusExpire?.dUpdatedAt)?.format('DD/MM/YYYY hh:mm A')
                      : 'No Data Available'}
                  </div>
                  )}
                  {BonusExpire
                    ? (
                      <table className='table-user'>
                        <tbody className='reports-login-users'>
                          <tr>
                            <td>Total</td>
                            <td>{BonusExpire?.nTotal || '0'}</td>
                          </tr>
                          <tr>
                            <td>Today</td>
                            <td>{BonusExpire?.nToday || '0'}</td>
                          </tr>
                          <tr>
                            <td>Yesterday</td>
                            <td>{BonusExpire?.nYesterday ? BonusExpire?.nYesterday : '0'}</td>
                          </tr>
                          <tr>
                            <td>Last Week</td>
                            <td>{BonusExpire?.nLastWeek ? BonusExpire?.nLastWeek : '0'}</td>
                          </tr>
                          <tr>
                            <td>Last Month</td>
                            <td>{BonusExpire?.nLastMonth ? BonusExpire?.nLastMonth : '0'}</td>
                          </tr>
                          <tr>
                            <td>Last Year</td>
                            <td>{BonusExpire?.nLastYear ? BonusExpire?.nLastYear : '0'}</td>
                          </tr>
                        </tbody>
                      </table>
                      )
                    : (<Col className='notFoundImage'><DataNotFound message="Data" obj=""/></Col>)}
                </div>
              </div>
            </Fragment>
          </Col>

          <Col className='mb-4' lg='4' md='6'>
            <Fragment>
              <div className='allReports-table'>
                <div className='allReports-table-responsive'>
                  <div className='total-user d-flex justify-content-between'>
                    <h3>
                      TDS
                      <img className='custom-info' id='TDS' src={infoIcon} />
                      <UncontrolledTooltip className='bg-default-s' delay={0} placement='bottom' target='TDS'>
                        <p>{userType === 'U' ? Info?.tds?.replace('##', '') : Info?.tds?.replace('##', 'System')}</p>
                      </UncontrolledTooltip>
                    </h3>
                    {permission && (
                    <Button color='link' onClick={() => updateGeneralizeReportFunc('TDS')}>
                      <img alt='TDS' height='20px' src={refreshIcon} width='20px'/>
                    </Button>
                    )}
                  </div>
                  {TDS && (
                  <div className='table-date'>
                    Last Update :
                    {TDS && TDS?.dUpdatedAt
                      ? moment(TDS?.dUpdatedAt)?.format('DD/MM/YYYY hh:mm A')
                      : 'No Data Available'}
                  </div>
                  )}
                  {TDS
                    ? (
                      <table className='table-user'>
                        <tbody className='reports-login-users'>
                          <tr>
                            <td>Total</td>
                            <td>{TDS?.nTotalTds || '0'}</td>
                          </tr>
                          <tr>
                            <td>Total Pending TDS</td>
                            <td>{TDS?.nTotalPendingTds || '0'}</td>
                          </tr>
                          <tr>
                            <td>Total Active TDS</td>
                            <td>{TDS?.nTotalActiveTds || '0'}</td>
                          </tr>
                        </tbody>
                      </table>
                      )
                    : (<Col className='notFoundImage'><DataNotFound message="Data" obj=""/></Col>)}
                </div>
              </div>
            </Fragment>
          </Col>

          <Col className='mb-4' lg='4' md='6'>
            <Fragment>
              <div className='allReports-table'>
                <div className='allReports-table-responsive'>
                  <div className='total-user d-flex justify-content-between'>
                    <h3>
                      Withdraw
                      <img className='custom-info' id='WITHDRAW' src={infoIcon} />
                      <UncontrolledTooltip className='bg-default-s' delay={0} placement='bottom' target='WITHDRAW'>
                        <p>{userType === 'U' ? Info?.withdraw?.replace('##', '') : Info?.withdraw?.replace('##', 'System')}</p>
                      </UncontrolledTooltip>
                    </h3>
                    {permission && (
                    <Button color='link' onClick={() => updateGeneralizeReportFunc('W')}>
                      <img alt='Users' height='20px' src={refreshIcon} width='20px'/>
                    </Button>
                    )}
                  </div>
                  <div className='table-date'>
                    Last Update :
                    {Withdraw && Withdraw?.dUpdatedAt
                      ? moment(Withdraw?.dUpdatedAt)?.format('DD/MM/YYYY hh:mm A')
                      : 'No Data Available'}
                  </div>
                  {Withdraw
                    ? (
                      <>
                        <table className='table-user'>
                          <tbody className='reports-total-users'>
                            <tr>
                              <td>Total Withdrawals</td>
                              <td>{Withdraw?.nTotalWithdrawals || '0'}</td>
                            </tr>
                            <tr>
                              <td>Instant Withdrawals</td>
                              <td>{Withdraw?.nInstantWithdrawals || '0'}</td>
                            </tr>
                          </tbody>
                        </table>
                      </>
                      )
                    : (<Col className='notFoundImage'><DataNotFound message="Data" obj=""/></Col>)}
                  {Withdraw && Withdraw?.aSuccessWithdrawals && (
                  <>
                    <div className='Platform'>
                      <p className='platform-heading'>SuccessFul Withdrawal</p>
                      <div className='Platform-data'>
                        {Withdraw?.aSuccessWithdrawals?.map((successWithdrawals) => (
                          <Fragment key={successWithdrawals?._id}>
                            <h3 className='key'>
                              <p className='name'>{successWithdrawals?.eTitle || '-'}</p>
                              <p className='value'>{successWithdrawals?.nValue || '0'}</p>
                            </h3>
                          </Fragment>
                        )
                        )}
                      </div>
                    </div>
                  </>
                  )}
                  {Withdraw && Withdraw?.aPendingWithdrawals && (
                  <>
                    <div className='Platform'>
                      <p className='platform-heading'>Pending Withdrawal</p>
                      <div className='Platform-data'>
                        {Withdraw?.aPendingWithdrawals?.map((pendingWithdrawals, index) => (
                          <FormGroup key={pendingWithdrawals?._id}>
                            <h3 className='key'>
                              <p className='name'>{pendingWithdrawals?.eTitle || '-'}</p>
                              <p className='value'>{pendingWithdrawals?.nValue || '0'}</p>
                            </h3>
                          </FormGroup>
                        )
                        )}
                      </div>
                    </div>
                  </>
                  )}
                </div>
              </div>
            </Fragment>
          </Col>

          <Col className='mb-4' lg='4' md='6'>
            <Fragment>
              <div className='allReports-table'>
                <div className='allReports-table-responsive'>
                  <div className='total-user d-flex justify-content-between'>
                    <h3>
                      Deposit
                      <img className='custom-info' id='DEPOSIT' src={infoIcon} />
                      <UncontrolledTooltip className='bg-default-s' delay={0} placeholder='bottom' target='DEPOSIT'>
                        <p>{userType === 'U' ? Info?.deposit?.replace('##', '') : Info?.deposit?.replace('##', 'System')}</p>
                      </UncontrolledTooltip>
                    </h3>
                    {permission && (
                    <Button color='link' onClick={() => updateGeneralizeReportFunc('TUT')} >
                      <img alt='Users' height='20px' src={refreshIcon} width='20px' />
                    </Button>
                    )}
                  </div>
                  {Deposit
                    ? (
                      <>
                        <div className='table-date'>
                          Last Update :
                          {Deposit && Deposit?.dUpdatedAt
                            ? moment(Deposit?.dUpdatedAt)?.format('DD/MM/YYYY hh:mm A')
                            : 'No Data Available'}
                        </div>
                        <table className='table-user'>
                          <tbody className='reports-total-users'>
                            <tr>
                              <td>Deposits</td>
                              <td>{Deposit?.nTotalDeposits || '0'}</td>
                            </tr>
                            <tr>
                              <td>Winnings</td>
                              <td>{Deposit?.nTotalWinnings || '0'}</td>
                            </tr>
                            <tr>
                              <td>Pending Deposits</td>
                              <td>{Deposit?.nTotalPendingDeposits || 0}</td>
                            </tr>
                            <tr>
                              <td>SuccessFul Deposits</td>
                              <td>{Deposit?.nTotalSuccessDeposits || 0}</td>
                            </tr>
                            <tr>
                              <td>Rejected Deposits</td>
                              <td>{Deposit?.nTotalRejectedDeposits || 0}</td>
                            </tr>
                            <tr>
                              <td>Cancelled Deposits</td>
                              <td>{Deposit?.nTotalCancelledDeposits || 0}</td>
                            </tr>
                          </tbody>
                        </table>
                      </>
                      )
                    : (
                      <Col className='notFoundImage'><DataNotFound message="Data" obj=""/></Col>
                      )}
                  {Deposit && Deposit?.aDeposits && Deposit?.aDeposits.length !== 0 && (
                  <>
                    <div className='Platform'>
                      <p className='platform-heading'>Methods</p>
                      <div className='Platform-data'>
                        {Deposit?.aDeposits?.map((deposits, index) => (
                          <Fragment key={deposits?._id}>
                            <h3 className='key'>
                              <p className='name'>{deposits?.eTitle || '-'}</p>
                              <p className='value'>{deposits?.nValue || '0'}</p>
                            </h3>
                          </Fragment>
                        ))}
                      </div>
                    </div>
                  </>
                  )}
                </div>
              </div>
            </Fragment>
          </Col>
        </Row>
      </section>
      )}
    </>
  )
}

UserReport.propTypes = {
  dateWiseReports: PropTypes?.string,
  isOpen: PropTypes?.bool,
  userType: PropTypes?.string,
  TotalUsers: PropTypes?.object,
  RegisteredUsers: PropTypes?.object,
  LoginUser: PropTypes?.object,
  userBonus: PropTypes?.object,
  TDS: PropTypes?.object,
  BonusExpire: PropTypes?.object,
  Withdraw: PropTypes?.object,
  Deposit: PropTypes?.object,
  token: PropTypes?.string,
  setLoading: PropTypes?.bool,
  permission: PropTypes?.string,
  DroppedUsers: PropTypes.object
}
export default UserReport
