import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Col, Row } from 'reactstrap'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import PropTypes from 'prop-types'

import verify from '../../../../assets/images/verify.svg'
import emailIcon from '../../../../assets/images/mail-icon.svg'
import userIcon from '../../../../assets/images/user-Icon.svg'
import callIcon from '../../../../assets/images/call-icon.svg'
import dateIcon from '../../../../assets/images/reg-date-icon.svg'
import reject from '../../../../assets/images/red-close-icon.svg'

import UserStatistics from './UserStatistics'
import Loading from '../../../../components/Loading'
import { fixDigit } from '../../../../helpers/helper'
import { getPassbookDetails, getStatisticDetails, getSystemUserPassbookDetails, getSystemUserStatisticDetails } from '../../../../actions/passbook'

function UserDebugging (props) {
  const { usersDetails, systemUser } = props
  const { id } = useParams()
  const dispatch = useDispatch()
  const [userName, setUserName] = useState('')
  const [mobNum, setMobNum] = useState('')
  const [Email, setEmail] = useState('')
  const [RegistrationDate, setRegistrationDate] = useState('')
  const [isInternalAccount, setIsInternalAccount] = useState(false)
  // eslint-disable-next-line no-unused-vars
  const [TotalPlayedWithCash, setTotalPlayedWithCash] = useState(0)
  // eslint-disable-next-line no-unused-vars
  const [TotalPlayedWithBonus, setTotalPlayedWithBonus] = useState(0)
  const [loading, setLoading] = useState(false)
  const [PassbookData, setPassbookData] = useState([])
  const [StatisticData, setStatisticData] = useState([])
  const [MobNumVerified, setMobNumVerified] = useState(false)
  const [EmailVerified, setEmailVerified] = useState(false)

  const token = useSelector(state => state?.auth?.token)
  const passbookDetails = useSelector(state => state?.passbook?.passbookDetails)
  const statisticDetails = useSelector(state => state?.passbook?.statisticDetails)
  const systemUserPassbookDetails = useSelector(state => state?.passbook?.systemUserPassbookDetails)
  const systemUserStatisticDetails = useSelector(state => state?.passbook?.systemUserStatisticDetails)
  const resMessage = useSelector(state => state?.passbook?.resMessage)
  const previousProps = useRef({ PassbookData, StatisticData, resMessage })?.current

  useEffect(() => {
    if (id) {
      if (systemUser) {
        // dispatch action to get SystemUserPassbookDetails and staticDetails
        dispatch(getSystemUserPassbookDetails(id, token))
        dispatch(getSystemUserStatisticDetails(id, token))
      } else {
        dispatch(getPassbookDetails(id, token))
        dispatch(getStatisticDetails(id, token))
      }
      setLoading(true)
    }
  }, [])

  useEffect(() => {
    if (usersDetails) {
      setUserName(usersDetails?.sUsername)
      setMobNum(usersDetails?.sMobNum)
      setEmail(usersDetails?.sEmail)
      setRegistrationDate(usersDetails?.dCreatedAt)
      setIsInternalAccount(usersDetails?.bIsInternalAccount)
      setEmailVerified(usersDetails?.bIsEmailVerified)
      setMobNumVerified(usersDetails?.bIsMobVerified)
    }
  }, [usersDetails])

  // use effect to set passbookData and staticDetailsData
  useEffect(() => {
    if (passbookDetails && statisticDetails) {
      setPassbookData(passbookDetails)
      setStatisticData(statisticDetails)
    } else if (systemUserPassbookDetails && systemUserStatisticDetails) {
      setPassbookData(systemUserPassbookDetails)
      setStatisticData(systemUserStatisticDetails)
    }
  }, [passbookDetails, statisticDetails, systemUserPassbookDetails, systemUserStatisticDetails])

  // use effect to set totalPlayerWithCash and TotalPlayerBonus
  useEffect(() => {
    if (previousProps?.PassbookData !== PassbookData && previousProps?.StatisticData !== StatisticData) {
      if (PassbookData && StatisticData && resMessage) {
        setTotalPlayedWithCash(((StatisticData?.oCricket && StatisticData?.oCricket?.nSpendingCash ? StatisticData?.oCricket?.nSpendingCash : 0) +
          (StatisticData?.oFootball && StatisticData?.oFootball?.nSpendingCash ? StatisticData?.oFootball?.nSpendingCash : 0) +
          (StatisticData?.oBasketball && StatisticData?.oBasketball?.nSpendingCash ? StatisticData?.oBasketball?.nSpendingCash : 0) +
          (StatisticData?.oKabaddi && StatisticData?.oKabaddi?.nSpendingCash ? StatisticData?.oKabaddi.nSpendingCash : 0)) + (StatisticData?.nTotalPlayReturnCash ? StatisticData?.nTotalPlayReturnCash : 0))
        setTotalPlayedWithBonus(((StatisticData?.oCricket && StatisticData?.oCricket.nSpendingBonus ? StatisticData?.oCricket.nSpendingBonus : 0) +
          (StatisticData?.oFootball && StatisticData?.oFootball?.nSpendingBonus ? StatisticData?.oFootball?.nSpendingBonus : 0) +
          (StatisticData?.oBasketball && StatisticData?.oBasketball?.nSpendingBonus ? StatisticData.oBasketball?.nSpendingBonus : 0) +
          (StatisticData?.oKabaddi && StatisticData?.oKabaddi?.nSpendingBonus ? StatisticData?.oKabaddi?.nSpendingBonus : 0)) + (StatisticData?.nTotalPlayReturnBonus ? StatisticData?.nTotalPlayReturnBonus : 0))
        setLoading(false)
      }
    }
    return () => {
      previousProps.PassbookData = PassbookData
      previousProps.StatisticData = StatisticData
      previousProps.resMessage = resMessage
    }
  }, [PassbookData, StatisticData, resMessage])

  return (
    <main className="main-content d-flex">
      {loading && <Loading />}
      <section className="user-section">
        <Col md={12}>
          <Row>

            <Col md={6} sm={12} xl={3} >
              <div className='user-debug'>
                <div className='user-debug-1'>
                  <div className='debug-btn'><img src={emailIcon} /></div>
                  <span className='ml-4'>
                    <h4>Email</h4>
                    <h4><b>{Email || 'No data available'}</b></h4>
                  </span>
                </div>
                <div>
                  {
                    Email && (EmailVerified
                      ? <img alt='verify' src={verify} />
                      : <img alt='reject' src={reject}/>
                    )
                  }
                </div>
              </div>
            </Col>

            <Col md={6} sm={12} xl={3} >
              <div className='user-debug'>
                <div className='user-debug-1'>
                  <div className='debug-btn'><img src={userIcon} /></div>
                  <span className='ml-4'>
                    <h4>Username</h4>
                    <h4><b>{userName || 'No data available'}</b></h4>
                  </span>
                </div>
              </div>
            </Col>

            <Col md={6} sm={12} xl={3} >
              <div className='user-debug'>
                <div className='user-debug-1'>
                  <div className='debug-btn'><img src={callIcon} /></div>
                  <span className='ml-4'>
                    <h4>Mobile Number</h4>
                    <h4><b>{mobNum || 'No data available'}</b></h4>
                  </span>
                </div>
                <div>
                  {
                    mobNum && (MobNumVerified
                      ? <img alt='verify' src={verify} />
                      : <img alt='reject' src={reject}/>
                    )
                  }
                </div>
              </div>
            </Col>

            <Col md={6} sm={12} xl={3} >
              <div className='user-debug'>
                <div className='user-debug-1'>
                  <div className='debug-btn'><img src={dateIcon} /></div>
                  <span className='ml-4'>
                    <h4>Registration Date</h4>
                    <h4><b>{RegistrationDate ? moment(RegistrationDate)?.format('DD-MM-YYYY') : 'No data available'}</b></h4>
                  </span>
                </div>
              </div>
            </Col>

            {isInternalAccount && (
            <Col>
              <h5 className='account-text'><b>Internal Account</b></h5>
            </Col>
            )}
          </Row>
        </Col>

        <Col md={12}>
          <Row>
            <Col className='mt-4' md={6} sm={12} xl={3}>
              <div className="debugger-table-responsive  debugger-box">
                <h3 className="text-h3">Cash Details(Passbook)</h3>
                {PassbookData
                  ? (
                    <table className="debugger-table">
                      <tbody>
                        <tr>
                          <td>Opening Cash</td>
                          <td>0</td>
                        </tr>
                        <tr>
                          <td>Total Deposit</td>
                          <td>{PassbookData?.length === 0 ? 0 : (fixDigit(PassbookData?.nTotalDepositAmount))}</td>
                        </tr>
                        <tr>
                          <td>Total Withdrawal</td>
                          <td>{PassbookData?.length === 0 ? 0 : (fixDigit(PassbookData?.nTotalWithdrawAmount))}</td>
                        </tr>
                        <tr>
                          <td>Total Winnings</td>
                          <td>{PassbookData?.length === 0 ? 0 : (fixDigit(PassbookData?.nTotalWinningAmount))}</td>
                        </tr>
                        <tr >
                          <td className='debug-mid-head'>Total Bonus Earned</td>
                          <td className='debug-mid-head'>{PassbookData?.length === 0 ? 0 : (fixDigit(PassbookData?.nTotalBonusEarned))}</td>
                        </tr>
                        <tr>
                          <td className='debug-sub-heading' colSpan="2"><b>Total Played</b></td>
                        </tr>
                        <tr>
                          <td>Total Played Cash</td>
                          <td>{PassbookData?.length === 0 ? 0 : (fixDigit(PassbookData?.nTotalPlayedCash))}</td>
                        </tr>
                        <tr>
                          <td className='debug-mid-head'>Total Played Bonus</td>
                          <td className='debug-mid-head'>{PassbookData?.length === 0 ? 0 : (fixDigit(PassbookData?.nTotalPlayedBonus))}</td>
                        </tr>
                        <tr>
                          <td className='debug-sub-heading' colSpan="2"><b>Play Return</b></td>
                        </tr>
                        <tr>
                          <td>Total Play Return Cash</td>
                          <td>{PassbookData?.length === 0 ? 0 : (fixDigit(PassbookData?.nTotalPlayReturnCash))}</td>
                        </tr>
                        <tr>
                          <td>Total Play Return Bonus</td>
                          <td>{PassbookData?.length === 0 ? 0 : (fixDigit(PassbookData?.nTotalPlayReturnBonus))}</td>
                        </tr>
                      </tbody>
                    </table>
                    )
                  : 'No Data Available'}
              </div>
            </Col>

            <Col className='mt-4' md={6} sm={12} xl={3}>
              <Fragment>
                <div className="debugger-table-responsive  debugger-box">
                  <h3 className="text-h3">Cash Details(Statistics)</h3>
                  {StatisticData
                    ? (
                      <table className="debugger-table">
                        <tbody>
                          <tr>
                            <td>Opening Cash</td>
                            <td>0</td>
                          </tr>
                          <tr>
                            <td>Total Deposit</td>
                            <td>{StatisticData?.length === 0 ? 0 : (fixDigit(StatisticData?.nDeposits))}</td>
                          </tr>
                          <tr>
                            <td>Total Withdrawal</td>
                            <td>{StatisticData?.length === 0 ? 0 : (fixDigit(StatisticData?.nWithdraw))}</td>
                          </tr>
                          <tr>
                            <td>Total Winnings</td>
                            <td>{StatisticData?.length === 0 ? 0 : (fixDigit(StatisticData?.nTotalWinnings))}</td>
                          </tr>
                          <tr>
                            <td className='debug-mid-head'>Total Bonus Earned</td>
                            <td className='debug-mid-head'>{StatisticData?.length === 0 ? 0 : (fixDigit(StatisticData?.nBonus))}</td>
                          </tr>
                          <tr>
                            <td className='debug-sub-heading' colSpan="2"><b>Total Played</b></td>
                          </tr>
                          <tr>
                            <td>Total Played Cash</td>
                            <td>{StatisticData?.nTotalPlayedCash ? StatisticData?.length === 0 ? 0 : (fixDigit(StatisticData?.nTotalPlayedCash)) : 0}</td>
                          </tr>
                          <tr>
                            <td className='debug-mid-head'>Total Played Bonus</td>
                            <td className='debug-mid-head'>{StatisticData?.nTotalPlayedBonus ? StatisticData?.length === 0 ? 0 : (fixDigit(StatisticData?.nTotalPlayedBonus)) : 0}</td>
                          </tr>
                          <tr>
                            <td className='debug-sub-heading' colSpan="2"><b>Play Return</b></td>
                          </tr>
                          <tr>
                            <td>Total Play Return Cash</td>
                            <td>{StatisticData?.length === 0 ? 0 : (fixDigit(StatisticData?.nTotalPlayReturnCash))}</td>
                          </tr>
                          <tr>
                            <td>Total Play Return Bonus</td>
                            <td>{StatisticData?.length === 0 ? 0 : (fixDigit(StatisticData?.nTotalPlayReturnBonus))}</td>
                          </tr>
                        </tbody>
                      </table>
                      )
                    : 'No Data Available'}
                </div>
              </Fragment>
            </Col>

            <Col className='mt-4' md={6} sm={12} xl={3}>
              <Fragment>
                <div className="debugger-table-responsive  debugger-box">
                  <h3 className="text-h3">Difference(Passbook - Statistics)</h3>
                  {PassbookData
                    ? (
                      <table className="debugger-table">
                        <tbody>
                          <tr>
                            <td>Current Deposit Balance</td>
                            <td>{PassbookData?.length === 0 ? 0 : (fixDigit(PassbookData?.nCurrentDepositBalance))}</td>
                          </tr>
                          <tr>
                            <td>Actual Deposit Balance</td>
                            <td>{StatisticData?.length === 0 ? 0 : (fixDigit(StatisticData?.nActualDepositBalance))}</td>
                          </tr>
                          <tr>
                            <td className='debug-mid-head'><b>Deposit Balance(Current - Actual)</b></td>
                            <td className='debug-mid-head'>
                              <b>
                                {(PassbookData?.length === 0)
                                  ? 0
                                  : (fixDigit(PassbookData?.nCurrentDepositBalance) - fixDigit(StatisticData?.nActualDepositBalance))?.toFixed(2)}
                              </b>
                            </td>
                          </tr>
                          <tr>
                            <td>Current Winning Balance</td>
                            <td>{PassbookData?.length === 0 ? 0 : (fixDigit(PassbookData?.nCurrentWinningBalance))}</td>
                          </tr>
                          <tr>
                            <td>Actual Winning Balance</td>
                            <td>{StatisticData?.length === 0 ? 0 : (fixDigit(StatisticData?.nActualWinningBalance))}</td>
                          </tr>
                          <tr>
                            <td className='debug-mid-head'><b>Winning Balance(Current - Actual)</b></td>
                            <td className='debug-mid-head'>
                              <b>
                                {(PassbookData?.length === 0)
                                  ? 0
                                  : (fixDigit(PassbookData?.nCurrentWinningBalance) - fixDigit(StatisticData?.nActualWinningBalance))?.toFixed(2)}
                              </b>

                            </td>
                          </tr>
                          <tr>
                            <td>Current Bonus</td>
                            <td>{PassbookData?.length === 0 ? 0 : (fixDigit(PassbookData?.nCurrentBonus))}</td>
                          </tr>
                          <tr>
                            <td>Actual Bonus</td>
                            <td>{StatisticData?.length === 0 ? 0 : (fixDigit(StatisticData?.nActualBonus))}</td>
                          </tr>
                          <tr>
                            <td className='debug-mid-head'><b>Bonus(Current - Actual)</b></td>
                            <td className='debug-mid-head'>
                              <b>
                                {PassbookData?.length === 0
                                  ? 0
                                  : (fixDigit(PassbookData?.nCurrentBonus) - fixDigit(StatisticData?.nActualBonus))?.toFixed(2)}
                              </b>

                            </td>
                          </tr>
                        </tbody>
                      </table>
                      )
                    : 'No Data Available'}
                </div>
              </Fragment>
            </Col>

            <Col className='mt-4' md={6} sm={12} xl={3}>
              <Fragment>
                <div className="debugger-table-responsive  debugger-box">
                  <h3 className="text-h3">User Balance Details</h3>
                  {StatisticData
                    ? (
                      <table className="debugger-table">
                        <tbody>
                          <tr>
                            <td>Total Creator Bonus</td>
                            <td>{PassbookData?.length === 0 ? 0 : (fixDigit(PassbookData?.nTotalCreatorBonus))}</td>
                          </tr>
                          <tr>
                            <td>Total Refer Bonus</td>
                            <td>{PassbookData?.length === 0 ? 0 : (fixDigit(PassbookData?.nTotalReferBonus))}</td>
                          </tr>
                          <tr>
                            <td>Register Bonus</td>
                            <td>{PassbookData?.length === 0 ? 0 : (fixDigit(PassbookData?.nTotalRegisterBonus))}</td>
                          </tr>
                          <tr>
                            <td>Last Pending Withdrawal</td>
                            <td>{PassbookData?.length === 0 ? 0 : (fixDigit(PassbookData?.nLastPendingWithdraw))}</td>
                          </tr>
                          <tr>
                            <td>Win Balance At Last Pending Withdrawal</td>
                            <td>{PassbookData?.length === 0 ? 0 : (fixDigit(PassbookData?.nWinBalanceAtLastPendingWithdraw))}</td>
                          </tr>
                          <tr>
                            <td>Total Cashback Cash</td>
                            <td>{PassbookData?.length === 0 ? 0 : (fixDigit(PassbookData?.nTotalCashbackCash))}</td>
                          </tr>
                          <tr>
                            <td>Total Cashback Bonus</td>
                            <td>{PassbookData?.length === 0 ? 0 : (fixDigit(PassbookData?.nTotalCashbackBonus))}</td>
                          </tr>
                          <tr>
                            <td>Bonus Expired</td>
                            <td>{PassbookData?.length === 0 ? 0 : (fixDigit(PassbookData.nTotalBonusExpired))}</td>
                          </tr>
                          <tr>
                            <td>Promo Code Discount</td>
                            <td>
                              {StatisticData?.length === 0
                                ? 0
                                : StatisticData?.nDiscountAmount && !StatisticData?.nDepositDiscount
                                  ? (fixDigit(StatisticData?.nDiscountAmount))
                                  : !StatisticData?.nDiscountAmount && StatisticData?.nDepositDiscount
                                      ? (fixDigit(StatisticData?.nDepositDiscount))
                                      : StatisticData?.nDiscountAmount && StatisticData?.nDepositDiscount
                                        ? (fixDigit(StatisticData?.nDiscountAmount) + fixDigit(StatisticData?.nDepositDiscount))
                                        : 0}

                            </td>
                          </tr>
                        </tbody>
                      </table>
                      )
                    : 'No Data Available'}
                </div>
              </Fragment>
            </Col>
          </Row>
        </Col>

        <UserStatistics {...props}
          StatisticData={StatisticData}
        />

      </section>
    </main>
  )
}

UserDebugging.propTypes = {
  usersDetails: PropTypes.object,
  match: PropTypes.object,
  systemUser: PropTypes.bool,
  user: PropTypes.bool,
  location: PropTypes.object
}

export default UserDebugging
