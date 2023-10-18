import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'reactstrap'
import moment from 'moment'
import PropTypes from 'prop-types'

import { getKYCUrl } from '../../../../actions/url'
import { singleAdminLogs } from '../../../../actions/subadmin'

function SingleLogDetails (props) {
  const [activityDetails, setActivityDetails] = useState([])
  const [url, setUrl] = useState('')
  const [KYCUrl, setKycUrl] = useState('')
  const [prizeBreakupFields, setPrizeBreakupFields] = useState({
    oldField: {},
    newField: {}
  })
  const dispatch = useDispatch()
  const location = useLocation()
  const { id } = useParams()
  const token = useSelector(state => state?.auth?.token)
  const singleLog = useSelector(state => state?.subadmin?.singleAdminLog)
  const profileUrl = useSelector(state => state?.url?.getUrl)
  const kycUrl = useSelector(state => state?.url?.kycUrl)

  const previousProps = useRef({
    singleLog
  }).current

  function highlighted (oldFieldss, newFieldss, fOld, fNew) {
    if (!oldFieldss) {
      if (fNew !== 0 && fNew !== undefined) {
        return 'admin-logs-highlighted'
      } else {
        return ''
      }
    }
    if (!newFieldss) {
      if (fOld !== 0 && fOld !== undefined) {
        return 'admin-logs-highlighted'
      } else {
        return ''
      }
    }
    if (((fOld && fNew) && fOld !== fNew) || (fOld && !fNew) || (!fOld && fNew)) {
      return 'admin-logs-highlighted'
    } else {
      return ''
    }
  }
  useEffect(() => {
    if (kycUrl) {
      setKycUrl(kycUrl)
    }
    if (profileUrl) {
      setUrl(profileUrl)
    }
  }, [kycUrl, profileUrl])

  useEffect(() => {
    if (id) {
      dispatch(singleAdminLogs(id, token))
    }
    if (location?.state) {
      setActivityDetails(location?.state)
    }
  }, [])

  useEffect(() => {
    if (previousProps?.singleLog !== singleLog) {
      if (singleLog?.eKey === 'KYC') {
        const path = {
          sImage: singleLog?.oNewFields?.sImage,
          sFrontImage: singleLog?.oNewFields?.sFrontImage,
          sBackImage: singleLog?.oNewFields?.sBackImage
        }
        dispatch(getKYCUrl(path, token))
      }
      if (singleLog?.eKey === 'PB') {
        const oldFields = singleLog?.oOldFields?.aLeaguePrize
        const newFields = singleLog?.oNewFields?.aLeaguePrize
        const isSameData = (a, b) => a?.nPrize === b?.nPrize && a?.nRankFrom === b?.nRankFrom && a?.nRankTo === b?.nRankTo && a?.eRankType === b?.eRankType && a?.sInfo === b?.sInfo && a?.sImage === b?.sImage
        const onlyInOld = (left, right, compareFunction) =>
          left?.filter(leftValue =>
            !right?.some(rightValue =>
              compareFunction(leftValue, rightValue)))
        const oldField = onlyInOld(oldFields, newFields, isSameData)
        const newField = onlyInOld(newFields, oldFields, isSameData)
        setActivityDetails({ ...activityDetails, oNewFields: singleLog?.oNewFields, oOldFields: singleLog?.oOldFields })
        setPrizeBreakupFields({
          oldField: oldField?.length !== 0 ? [...oldField] : [],
          newField: newField?.length !== 0 ? [...newField] : []
        })
      } else {
        setActivityDetails({ ...activityDetails, oNewFields: singleLog?.oNewFields, oOldFields: singleLog?.oOldFields })
      }
    }

    return () => {
      previousProps.singleLog = singleLog
    }
  }, [singleLog])

  return (
    <>
      <h3 className='text-center mt-3 mb-0'>
        Activity Done By
        {(activityDetails?.iAdminId)
          ? ''
          : (
            <>
              {activityDetails?.oDetails?.sOperationBy}
            </>
            )}
      </h3>
      <div className='table-represent'>
        <div className='table-responsive'>
          <table className='table'>
            <thead>
              <tr>
                <th>Username</th>
                <th>Admin Type</th>
                <th>Name</th>
                <th>IP</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              <tr className='apilogs-tr'>
                <td><b>{activityDetails?.iAdminId?.sUsername || '--'}</b></td>
                <td><b>{activityDetails?.iAdminId?.eType || '--'}</b></td>
                <td><b>{activityDetails?.iAdminId?.sName || '--'}</b></td>
                <td><b>{activityDetails?.sIP || '--'}</b></td>
                <td>
                  <b>
                    Latitude :
                    {activityDetails?.sLatitude || '--'}
                    {' '}
                    <br />
                    Longitude :
                    {activityDetails?.sLongitude || '--'}
                  </b>
                  <br />
                  {activityDetails?.sLatitude && activityDetails?.sLongitude && (
                  <Link to={`https://www.google.com/maps/@${activityDetails?.sLatitude} ${activityDetails?.sLongitude}`} target="_blank" className='googleMapLink'>
                    Open in Google Maps
                  </Link>
                  )}
                </td>
              </tr>
            </tbody>
          </table>

          <h3 className='text-center mb-4'>Activity Done On</h3>
          <table className='table'>
            <thead>
              <tr className='apilogs-tr'>
                <th>Operation Type</th>
                <th>Username</th>
                <th>User Type</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              <tr className='apilogs-tr'>
                <td><b>{activityDetails?.eKey === 'D' ? 'Process Deposit' : activityDetails.eKey === 'W' ? 'Process Withdraw' : activityDetails?.eKey === 'P' ? 'Profile' : activityDetails?.eKey === 'KYC' ? 'KYC' : activityDetails?.eKey === 'BD' ? 'Bank Details' : activityDetails?.eKey === 'SUB' ? 'Sub Admin' : activityDetails?.eKey === 'AD' ? 'Deposit' : activityDetails?.eKey === 'AW' ? 'Withdraw' : activityDetails?.eKey === 'PC' ? 'Promo Code' : activityDetails?.eKey === 'L' ? 'League' : activityDetails?.eKey === 'PB' ? 'Prize Breakup' : activityDetails?.eKey === 'M' ? 'Match' : activityDetails?.eKey === 'SLB' ? 'Series Leaderboard' : '--'}</b></td>
                <td>{activityDetails?.iUserId && activityDetails?.iUserId.sUsername ? <Button className="view" color="link" tag={Link} to={(activityDetails?.iUserId && activityDetails?.iUserId.eType === 'U') ? `/users/user-management/user-details/${activityDetails?.iUserId?._id}` : `/users/system-user/system-user-details/${activityDetails?.iUserId?._id}`}>{activityDetails?.iUserId?.sUsername}</Button> : '--'}</td>
                <td><b>{(activityDetails?.iUserId && activityDetails?.iUserId.eType) ? activityDetails?.iUserId?.eType === 'U' ? 'Normal' : 'Bot' : '--'}</b></td>
                <td><b>{activityDetails?.iUserId && activityDetails?.iUserId.sEmail ? activityDetails?.iUserId?.sEmail : '--'}</b></td>
              </tr>
            </tbody>
          </table>

        </div>
      </div>

      {activityDetails?.eKey === 'D' && (
      <div className='table-represent'>
        <div className='table-responsive'>
          <table className='table'>
            <thead>
              <tr>
                <th>Field Name</th>
                <th>Old Field</th>
                <th>New Field</th>
              </tr>
            </thead>
            <tbody>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.ePaymentStatus, activityDetails?.oNewFields?.ePaymentStatus)}>
                <td>Payment Status</td>
                <td><b>{activityDetails?.oOldFields && activityDetails?.oOldFields?.ePaymentStatus && activityDetails?.oOldFields?.ePaymentStatus === 'P' ? 'Pending' : activityDetails?.oOldFields?.ePaymentStatus === 'S' ? 'Accepted' : activityDetails?.oOldFields?.ePaymentStatus === 'R' ? 'Refunded' : activityDetails?.oOldFields?.ePaymentStatus === 'C' ? 'Cancelled' : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields && activityDetails?.oNewFields?.ePaymentStatus && activityDetails?.oNewFields?.ePaymentStatus === 'P' ? 'Pending' : activityDetails?.oNewFields?.ePaymentStatus === 'S' ? 'Accepted' : activityDetails?.oNewFields?.ePaymentStatus === 'R' ? 'Refunded' : activityDetails?.oNewFields?.ePaymentStatus === 'C' ? 'Cancelled' : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.nAmount, activityDetails?.oNewFields?.nAmount)}>
                <td>Amount</td>
                <td><b>{activityDetails?.oOldFields?.nAmount ? activityDetails?.oOldFields?.nAmount : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields?.nAmount ? activityDetails?.oNewFields?.nAmount : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.nBonus, activityDetails?.oNewFields?.nBonus)}>
                <td>Bonus</td>
                <td><b>{activityDetails?.oOldFields?.nBonus ? activityDetails?.oOldFields?.nBonus : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields?.nBonus ? activityDetails?.oNewFields?.nBonus : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.nCash, activityDetails?.oNewFields?.nCash)}>
                <td>Cash</td>
                <td><b>{activityDetails?.oOldFields?.nCash ? activityDetails?.oOldFields?.nCash : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields?.nCash ? activityDetails?.oNewFields?.nCash : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.ePlatform, activityDetails?.oNewFields?.ePlatform)}>
                <td>Platform</td>
                <td><b>{activityDetails?.oOldFields?.ePlatform ? (activityDetails?.oOldFields?.ePlatform === 'O' ? 'Other' : activityDetails?.oOldFields?.ePlatform === 'W' ? 'Web' : activityDetails?.oOldFields?.ePlatform === 'I' ? 'iOS' : activityDetails?.oOldFields?.ePlatform === 'A' ? 'Android' : '--') : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields?.ePlatform ? (activityDetails?.oNewFields?.ePlatform === 'O' ? 'Other' : activityDetails?.oNewFields?.ePlatform === 'W' ? 'Web' : activityDetails?.oNewFields?.ePlatform === 'I' ? 'iOS' : activityDetails?.oNewFields?.ePlatform === 'A' ? 'Android' : '--') : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.sPromocode, activityDetails?.oNewFields?.sPromocode)}>
                <td>Promo Code</td>
                <td><b>{activityDetails?.oOldFields?.sPromocode ? activityDetails?.oOldFields?.sPromocode : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields?.sPromocode ? activityDetails?.oNewFields?.sPromocode : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.iPromocodeId, activityDetails?.oNewFields?.iPromocodeId)}>
                <td>Promo Code Id</td>
                <td><b>{activityDetails?.oOldFields?.iPromocodeId ? activityDetails?.oOldFields?.iPromocodeId : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields?.iPromocodeId ? activityDetails?.oNewFields?.iPromocodeId : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.sInfo, activityDetails?.oNewFields?.sInfo)}>
                <td>Info</td>
                <td className='logDetails'><b >{activityDetails?.oOldFields?.sInfo ? activityDetails?.oOldFields?.sInfo : '--'}</b></td>
                <td className='logDetails'><b >{activityDetails?.oNewFields?.sInfo ? activityDetails?.oNewFields?.sInfo : '--'}</b></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      )}

      {activityDetails?.eKey === 'AD' && (
      <div className='table-represent'>
        <div className='table-responsive'>
          <table className='table'>
            <thead>
              <tr>
                <th>Field Name</th>
                <th>Old Field</th>
                <th>New Field</th>
              </tr>
            </thead>
            <tbody>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.eType, activityDetails?.oNewFields?.eType)}>
                <td>To Balance</td>
                <td><b>{activityDetails?.oOldFields && activityDetails?.oOldFields.eType ? activityDetails?.oOldFields?.eType : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields && activityDetails?.oNewFields.eType ? activityDetails?.oNewFields?.eType : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.nBonus, activityDetails?.oNewFields?.nBonus)}>
                <td>Bonus</td>
                <td><b>{activityDetails?.oOldFields && activityDetails?.oOldFields.nBonus ? activityDetails?.oOldFields?.nBonus : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields && activityDetails?.oNewFields.nBonus ? activityDetails?.oNewFields?.nBonus : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.nCash, activityDetails?.oNewFields?.nCash)}>
                <td>Cash</td>
                <td><b>{activityDetails?.oOldFields && activityDetails?.oOldFields?.nCash ? activityDetails?.oOldFields?.nCash : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields && activityDetails?.oNewFields?.nCash ? activityDetails?.oNewFields?.nCash : '--'}</b></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      )}

      {activityDetails?.eKey === 'W' && (
      <div className='table-represent'>
        <div className='table-responsive'>
          <table className='table'>
            <thead>
              <tr>
                <th>Field Name</th>
                <th>Old Field</th>
                <th>New Field</th>
              </tr>
            </thead>
            <tbody>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.ePaymentStatus, activityDetails?.oNewFields?.ePaymentStatus)}>
                <td>Payment Status</td>
                <td>{activityDetails.oOldFields && activityDetails.oOldFields?.ePaymentStatus && activityDetails.oOldFields?.ePaymentStatus === 'P' ? 'Pending' : activityDetails.oOldFields?.ePaymentStatus === 'S' ? 'Accepted' : activityDetails.oOldFields?.ePaymentStatus === 'R' ? 'Refunded' : activityDetails.oOldFields?.ePaymentStatus === 'C' ? 'Cancelled' : '--'}</td>
                <td>{activityDetails.oNewFields && activityDetails.oNewFields?.ePaymentStatus && activityDetails.oNewFields?.ePaymentStatus === 'P' ? 'Pending' : activityDetails.oNewFields?.ePaymentStatus === 'S' ? 'Accepted' : activityDetails.oNewFields?.ePaymentStatus === 'R' ? 'Refunded' : activityDetails.oNewFields?.ePaymentStatus === 'C' ? 'Cancelled' : '--'}</td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.nAmount, activityDetails?.oNewFields?.nAmount)}>
                <td>Amount</td>
                <td><b>{activityDetails.oOldFields?.nAmount ? activityDetails.oOldFields?.nAmount : '--'}</b></td>
                <td><b>{activityDetails.oNewFields?.nAmount ? activityDetails.oNewFields?.nAmount : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.ePlatform, activityDetails?.oNewFields?.ePlatform)}>
                <td>Platform</td>
                <td><b>{activityDetails.oOldFields?.ePlatform && activityDetails.oOldFields?.ePlatform === 'O' ? 'Other' : activityDetails.oOldFields?.ePlatform === 'W' ? 'Web' : activityDetails.oOldFields?.ePlatform === 'I' ? 'iOS' : activityDetails.oOldFields?.ePlatform === 'A' ? 'Android' : '--'}</b></td>
                <td><b>{activityDetails.oNewFields?.ePlatform && activityDetails.oNewFields?.ePlatform === 'O' ? 'Other' : activityDetails.oNewFields?.ePlatform === 'W' ? 'Web' : activityDetails.oNewFields?.ePlatform === 'I' ? 'iOS' : activityDetails.oNewFields?.ePlatform === 'A' ? 'Android' : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.sInfo, activityDetails?.oNewFields?.sInfo)}>
                <td>Info</td>
                <td><b>{activityDetails.oOldFields?.sInfo ? activityDetails.oOldFields?.sInfo : '--'}</b></td>
                <td><b>{activityDetails.oNewFields?.sInfo ? activityDetails.oNewFields?.sInfo : '--'}</b></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      )}

      {activityDetails?.eKey === 'AW' && (
      <div className='table-represent'>
        <div className='table-responsive'>
          <table className='table'>
            <thead>
              <tr>
                <th>Field Name</th>
                <th>Old Field</th>
                <th>New Field</th>
              </tr>
            </thead>
            <tbody>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.eType, activityDetails?.oNewFields?.eType)}>
                <td>From Balance</td>
                <td><b>{activityDetails?.oOldFields && activityDetails?.oOldFields?.eType ? activityDetails?.oOldFields?.eType : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields && activityDetails?.oNewFields?.eType ? activityDetails?.oNewFields?.eType : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.oOldFields, activityDetails?.oNewFields?.oOldFields)}>
                <td>Amount</td>
                <td><b>{activityDetails?.oOldFields && activityDetails?.oOldFields.nCash ? activityDetails?.oOldFields.nCash : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields && activityDetails?.oNewFields.nCash ? activityDetails?.oNewFields.nCash : '--'}</b></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      )}

      {activityDetails?.eKey === 'P' && (
      <div className='table-represent'>
        <div className='table-responsive'>
          <table className='table'>
            <thead>
              <tr>
                <th>Field Name</th>
                <th>Old Field</th>
                <th>New Field</th>
              </tr>
            </thead>
            <tbody>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.sProPic, activityDetails?.oNewFields?.sProPic)}>
                <td>Profile Pic</td>
                <td>{activityDetails?.oOldFields?.sProPic ? <img alt='No Image' className='theme-image' src={url + activityDetails?.oOldFields?.sProPic} /> : ' No Image '}</td>
                <td>{activityDetails?.oNewFields?.sProPic ? <img alt='No Image' className='theme-image' src={url + activityDetails?.oNewFields?.sProPic} /> : ' No Image '}</td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.sName, activityDetails?.oNewFields?.sName)}>
                <td>Name</td>
                <td><b>{activityDetails?.oOldFields?.sName ? activityDetails?.oOldFields?.sName : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields?.sName ? activityDetails?.oNewFields?.sName : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.sEmail, activityDetails?.oNewFields?.sEmail)}>
                <td>Email</td>
                <td><b>{activityDetails?.oOldFields?.sEmail ? activityDetails?.oOldFields?.sEmail : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields?.sEmail ? activityDetails?.oNewFields?.sEmail : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.sMobNum, activityDetails?.oNewFields?.sMobNum)}>
                <td>Mobile Number</td>
                <td><b>{activityDetails?.oOldFields?.sMobNum ? activityDetails?.oOldFields?.sMobNum : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields?.sMobNum ? activityDetails?.oNewFields?.sMobNum : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.dDob, activityDetails?.oNewFields?.dDob)}>
                <td>Date of Birth</td>
                <td><b>{activityDetails?.oOldFields?.dDob ? moment(activityDetails?.oOldFields?.dDob).format('DD-MM-YYYY') : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields?.dDob ? moment(activityDetails?.oNewFields?.dDob).format('DD-MM-YYYY') : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.eGender, activityDetails?.oNewFields?.eGender)}>
                <td>Gender</td>
                <td><b>{activityDetails?.oOldFields?.eGender ? (activityDetails?.oOldFields?.eGender === 'M' ? 'Male' : activityDetails?.oOldFields?.eGender === 'F' ? 'Female' : activityDetails?.oOldFields?.eGender === 'O' ? 'Other' : '--') : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields?.eGender ? (activityDetails?.oNewFields?.eGender === 'M' ? 'Male' : activityDetails?.oNewFields?.eGender === 'F' ? 'Female' : activityDetails?.oNewFields?.eGender === 'O' ? 'Other' : '--') : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.sAddress, activityDetails?.oNewFields?.sAddress)}>
                <td>Address</td>
                <td><b>{activityDetails?.oOldFields?.sAddress ? activityDetails?.oOldFields?.sAddress : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields?.sAddress ? activityDetails?.oNewFields?.sAddress : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.iCityId, activityDetails?.oNewFields?.iCityId)}>
                <td>City</td>
                <td><b>{activityDetails?.oOldFields?.iCityId ? activityDetails?.oOldFields?.iCityId : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields?.iCityId ? activityDetails?.oNewFields?.iCityId : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.nPinCode, activityDetails?.oNewFields?.nPinCode)}>
                <td>Pin Code</td>
                <td><b>{activityDetails?.oOldFields?.nPinCode ? activityDetails?.oOldFields?.nPinCode : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields?.nPinCode ? activityDetails?.oNewFields?.nPinCode : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.iStateId, activityDetails?.oNewFields?.iStateId)}>
                <td>State</td>
                <td><b>{activityDetails?.oOldFields?.iStateId ? activityDetails?.oOldFields?.iStateId : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields?.iStateId ? activityDetails?.oNewFields?.iStateId : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.eStatus, activityDetails?.oNewFields?.eStatus)}>
                <td>Status</td>
                <td><b>{activityDetails?.oOldFields?.eStatus ? (activityDetails?.oOldFields?.eStatus === 'Y' ? 'Active' : 'Block') : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields?.eStatus ? (activityDetails?.oNewFields?.eStatus === 'Y' ? 'Active' : 'Block') : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.bIsInternalAccount, activityDetails?.oNewFields?.bIsInternalAccount)}>
                <td>Internal Account</td>
                <td><b>{activityDetails?.oOldFields?.bIsInternalAccount ? (activityDetails?.oOldFields?.bIsInternalAccount ? 'Yes' : 'No') : 'No'}</b></td>
                <td><b>{activityDetails?.oNewFields?.bIsInternalAccount ? (activityDetails?.oNewFields?.bIsInternalAccount ? 'Yes' : 'No') : 'No'}</b></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      )}

      {activityDetails?.eKey === 'KYC' && (
      <div className='table-represent'>
        <div className='table-responsive'>
          <table className='table'>
            <thead>
              <tr>
                <th>Field Name</th>
                <th>Old Field</th>
                <th>New Field</th>
              </tr>
            </thead>
            {activityDetails?.oOldFields && ((activityDetails?.oOldFields?.sFrontImage || activityDetails?.oOldFields?.sBackImage) && (activityDetails?.oNewFields?.sFrontImage || activityDetails?.oNewFields?.sBackImage)) && (
            <tbody>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.sFrontImage, activityDetails?.oNewFields?.sFrontImage)}>
                <td>Aadhaar Front Image</td>
                <td>{activityDetails?.oOldFields && activityDetails?.oOldFields?.sFrontImage ? <img alt='No Image' className='theme-image' src={KYCUrl?.sFrontImage} /> : ' No Image '}</td>
                <td>{activityDetails?.oNewFields && activityDetails?.oNewFields?.sFrontImage ? <img alt='No Image' className='theme-image' src={KYCUrl?.sFrontImage} /> : ' No Image '}</td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.sBackImage, activityDetails?.oNewFields?.sBackImage)}>
                <td>Aadhaar Back Image</td>
                <td>{activityDetails?.oOldFields && activityDetails?.oOldFields?.sBackImage ? <img alt='No Image' className='theme-image' src={KYCUrl?.sBackImage} /> : ' No Image '}</td>
                <td>{activityDetails?.oNewFields && activityDetails?.oNewFields?.sBackImage ? <img alt='No Image' className='theme-image' src={KYCUrl?.sBackImage} /> : ' No Image '}</td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.nNo, activityDetails?.oNewFields?.nNo)}>
                <td>Aadhaar No</td>
                <td><b>{activityDetails?.oOldFields.nNo ? activityDetails?.oOldFields.nNo : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields.nNo ? activityDetails?.oNewFields.nNo : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.eStatus, activityDetails?.oNewFields?.eStatus)}>
                <td>Status</td>
                <td><b>{activityDetails?.oOldFields?.eStatus && activityDetails?.oOldFields?.eStatus === 'P' ? 'Pending' : activityDetails?.oOldFields?.eStatus === 'A' ? 'Accepted' : activityDetails?.oOldFields?.eStatus === 'R' ? 'Rejected' : activityDetails?.oOldFields?.eStatus === 'N' ? 'Not Addded' : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields?.eStatus && activityDetails?.oNewFields?.eStatus === 'P' ? 'Pending' : activityDetails?.oNewFields?.eStatus === 'A' ? 'Accepted' : activityDetails?.oNewFields?.eStatus === 'R' ? 'Rejected' : activityDetails?.oNewFields?.eStatus === 'N' ? 'Not Addded' : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.oVerifiedAt, activityDetails?.oNewFields?.oVerifiedAt)}>
                <td>Verification Time</td>
                <td><b>{activityDetails?.oOldFields && activityDetails?.oOldFields?.oVerifiedAt && activityDetails?.oOldFields?.oVerifiedAt?.dActionedAt ? moment(activityDetails?.oOldFields?.oVerifiedAt?.dActionedAt)?.format('DD/MM/YYYY hh:mm A') : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields && activityDetails?.oNewFields?.oVerifiedAt && activityDetails?.oNewFields?.oVerifiedAt?.dActionedAt ? moment(activityDetails?.oNewFields?.oVerifiedAt?.dActionedAt)?.format('DD/MM/YYYY hh:mm A') : '--'}</b></td>
              </tr>
            </tbody>
            )}
            {(activityDetails?.oOldFields && (activityDetails?.oOldFields?.sImage || activityDetails?.oNewFields?.sImage)) && (
            <tbody>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.sImage, activityDetails?.oNewFields?.sImage)}>
                <td>PAN Image</td>
                <td>{activityDetails?.oOldFields && activityDetails?.oOldFields?.sImage ? <img alt='No Image' className='theme-image' src={KYCUrl?.sImage} /> : ' No Image '}</td>
                <td>{activityDetails?.oNewFields && activityDetails?.oNewFields?.sImage ? <img alt='No Image' className='theme-image' src={KYCUrl?.sImage} /> : ' No Image '}</td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.sNo, activityDetails?.oNewFields?.sNo)}>
                <td>PAN No</td>
                <td><b>{activityDetails?.oOldFields?.sNo ? activityDetails?.oOldFields?.sNo : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields?.sNo ? activityDetails?.oNewFields?.sNo : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.eStatus, activityDetails?.oNewFields?.eStatus)}>
                <td>Status</td>
                <td><b>{activityDetails?.oOldFields?.eStatus && activityDetails.oOldFields.eStatus === 'P' ? 'Pending' : activityDetails?.oOldFields?.eStatus === 'A' ? 'Accepted' : activityDetails?.oOldFields?.eStatus === 'R' ? 'Rejected' : activityDetails?.oOldFields?.eStatus === 'N' ? 'Not Addded' : '--'}</b></td>
                <td><b>{activityDetails.oNewFields.eStatus && activityDetails.oNewFields.eStatus === 'P' ? 'Pending' : activityDetails?.oNewFields?.eStatus === 'A' ? 'Accepted' : activityDetails?.oNewFields?.eStatus === 'R' ? 'Rejected' : activityDetails?.oNewFields?.eStatus === 'N' ? 'Not Addded' : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.oVerifiedAt, activityDetails?.oNewFields?.oVerifiedAt)}>
                <td>Verification Time</td>
                <td><b>{activityDetails?.oOldFields && activityDetails?.oOldFields?.oVerifiedAt && activityDetails?.oOldFields?.oVerifiedAt?.dActionedAt ? moment(activityDetails?.oOldFields?.oVerifiedAt?.dActionedAt)?.format('DD/MM/YYYY hh:mm A') : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields && activityDetails?.oNewFields?.oVerifiedAt && activityDetails?.oNewFields?.oVerifiedAt?.dActionedAt ? moment(activityDetails?.oNewFields?.oVerifiedAt?.dActionedAt)?.format('DD/MM/YYYY hh:mm A') : '--'}</b></td>
              </tr>
            </tbody>
            )}
          </table>
        </div>
      </div>
      )}

      {activityDetails?.eKey === 'BD' && (
      <div className='table-represent'>
        <div className='table-responsive'>
          <table className='table'>
            <thead>
              <tr>
                <th>Field Name</th>
                <th>Old Field</th>
                <th>New Field</th>
              </tr>
            </thead>
            <tbody>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.sAccountHolderName, activityDetails?.oNewFields?.sAccountHolderName)}>
                <td>Account Holder Name</td>
                <td><b>{activityDetails?.oOldFields?.sAccountHolderName || '--'}</b></td>
                <td><b>{activityDetails?.oNewFields?.sAccountHolderName || '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.sBankName, activityDetails?.oNewFields?.sBankName)}>
                <td>Bank Name</td>
                <td><b>{activityDetails?.oOldFields?.sBankName || '--'}</b></td>
                <td><b>{activityDetails?.oNewFields?.sBankName || '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.sBranchName, activityDetails?.oNewFields?.sBranchName)}>
                <td>Branch Name</td>
                <td><b>{activityDetails?.oOldFields?.sBranchName || '--'}</b></td>
                <td><b>{activityDetails?.oNewFields?.sBranchName || '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.sAccountNo, activityDetails?.oNewFields?.sAccountNo)}>
                <td>Account No</td>
                <td><b>{activityDetails?.oOldFields?.sAccountNo || '--'}</b></td>
                <td><b>{activityDetails?.oNewFields?.sAccountNo || '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.sIFSC, activityDetails?.oNewFields?.sIFSC)}>
                <td>IFSC</td>
                <td><b>{activityDetails?.oOldFields?.sIFSC || '--'}</b></td>
                <td><b>{activityDetails?.oNewFields?.sIFSC || '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.bIsBankApproved, activityDetails?.oNewFields?.bIsBankApproved)}>
                <td>Bank Change Approval</td>
                <td><b>{activityDetails?.oOldFields ? (activityDetails?.oOldFields?.bIsBankApproved ? 'Yes' : 'No') : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields ? (activityDetails?.oNewFields?.bIsBankApproved ? 'Yes' : 'No') : '--'}</b></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      )}

      {activityDetails?.eKey === 'SUB' && (
      <div className='table-represent'>
        <div className='table-responsive'>
          <table className='table'>
            <thead>
              <tr>
                <th>Field Name</th>
                <th>Old Field</th>
                <th>New Field</th>
              </tr>
            </thead>
            <tbody>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.sUsername, activityDetails?.oNewFields?.sUsername)}>
                <td>Username</td>
                <td><b>{activityDetails?.oOldFields && activityDetails?.oOldFields?.sUsername ? activityDetails?.oOldFields?.sUsername : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields && activityDetails?.oNewFields?.sUsername ? activityDetails?.oNewFields?.sUsername : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.sName, activityDetails?.oNewFields?.sName)}>
                <td>Name</td>
                <td><b>{activityDetails?.oOldFields && activityDetails?.oOldFields?.sName ? activityDetails?.oOldFields?.sName : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields && activityDetails?.oNewFields?.sName ? activityDetails?.oNewFields?.sName : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.sEmail, activityDetails?.oNewFields?.sEmail)}>
                <td>Email</td>
                <td><b>{activityDetails?.oOldFields && activityDetails?.oOldFields?.sEmail ? activityDetails?.oOldFields?.sEmail : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields && activityDetails?.oNewFields?.sEmail ? activityDetails?.oNewFields?.sEmail : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.sMobNum, activityDetails?.oNewFields?.sMobNum)}>
                <td>Mobile Number</td>
                <td><b>{activityDetails?.oOldFields && activityDetails?.oOldFields?.sMobNum ? activityDetails?.oOldFields?.sMobNum : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields && activityDetails?.oNewFields?.sMobNum ? activityDetails?.oNewFields?.sMobNum : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.iRoleId, activityDetails?.oNewFields?.iRoleId)}>
                <td>Role Id</td>
                <td><b>{activityDetails?.oOldFields && activityDetails?.oOldFields?.iRoleId ? activityDetails?.oOldFields?.iRoleId : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields && activityDetails?.oNewFields?.iRoleId ? activityDetails?.oNewFields?.iRoleId : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.eStatus, activityDetails?.oNewFields?.eStatus)}>
                <td>Status</td>
                <td><b>{(activityDetails?.oOldFields && activityDetails?.oOldFields?.eStatus) ? activityDetails?.oOldFields?.eStatus === 'Y' ? 'Active' : 'Block' : '--'}</b></td>
                <td><b>{(activityDetails?.oNewFields && activityDetails?.oNewFields?.eStatus) ? activityDetails?.oNewFields?.eStatus === 'Y' ? 'Active' : 'Block' : '--'}</b></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      )}

      {activityDetails?.eKey === 'PC' && (
      <div className='table-represent'>
        <div className='table-responsive'>
          <table className='table'>
            <thead>
              <tr>
                <th>Field Name</th>
                <th>Old Field</th>
                <th>New Field</th>
              </tr>
            </thead>
            <tbody>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.eType, activityDetails?.oNewFields?.eType)}>
                <td>Promo Code Type</td>
                <td><b>{(activityDetails?.oOldFields && activityDetails?.oOldFields?.eType) ? activityDetails?.oOldFields?.eType : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields && activityDetails?.oNewFields?.eType ? activityDetails?.oNewFields?.eType : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.aMatches?.map(data => data).toString(), activityDetails?.oNewFields?.aMatches?.map(data => data).toString())}>
                <td>Matches</td>
                <td><b>{(activityDetails?.oOldFields && activityDetails?.oOldFields?.aMatches?.length > 0) ? (activityDetails?.oOldFields?.aMatches?.map(data => data))?.toString() : '--'}</b></td>
                <td><b>{(activityDetails?.oNewFields && activityDetails?.oNewFields?.aMatches?.length > 0) ? (activityDetails?.oNewFields?.aMatches?.map(data => data))?.toString() : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.aLeagues?.map(data => data).toString(), activityDetails?.oNewFields?.aLeagues?.map(data => data).toString())}>
                <td>Leagues</td>
                <td><b>{(activityDetails?.oOldFields && activityDetails?.oOldFields?.aLeagues?.length > 0) ? (activityDetails?.oOldFields?.aLeagues?.map(data => data))?.toString() : '--'}</b></td>
                <td><b>{(activityDetails?.oNewFields && activityDetails?.oNewFields?.aLeagues?.length > 0) ? (activityDetails?.oNewFields?.aLeagues?.map(data => data))?.toString() : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.sName, activityDetails?.oNewFields?.sName)}>
                <td>Promo Name</td>
                <td><b>{activityDetails?.oOldFields && activityDetails?.oOldFields?.sName ? activityDetails?.oOldFields?.sName : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields && activityDetails?.oNewFields?.sName ? activityDetails?.oNewFields?.sName : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.sCode, activityDetails?.oNewFields?.sCode)}>
                <td>Coupon Code</td>
                <td><b>{activityDetails?.oOldFields && activityDetails?.oOldFields?.sCode ? activityDetails?.oOldFields?.sCode : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields && activityDetails?.oNewFields?.sCode ? activityDetails?.oNewFields?.sCode : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.nAmount, activityDetails?.oNewFields?.nAmount)}>
                <td>Amount/Percentage</td>
                <td><b>{activityDetails?.oOldFields && activityDetails?.oOldFields.nAmount ? activityDetails?.oOldFields?.nAmount : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields && activityDetails?.oNewFields.nAmount ? activityDetails?.oNewFields?.nAmount : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.nMinAmount, activityDetails?.oNewFields?.nMinAmount)}>
                <td>Min Price</td>
                <td><b>{activityDetails?.oOldFields ? activityDetails?.oOldFields?.nMinAmount : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields ? activityDetails?.oNewFields?.nMinAmount : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.nMaxAmount, activityDetails?.oNewFields?.nMaxAmount)}>
                <td>Max Price</td>
                <td><b>{activityDetails?.oOldFields ? activityDetails?.oOldFields?.nMaxAmount : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields ? activityDetails?.oNewFields?.nMaxAmount : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.nMaxAllow, activityDetails?.oNewFields?.nMaxAllow)}>
                <td>Maximum Allow</td>
                <td><b>{activityDetails?.oOldFields && activityDetails?.oOldFields?.nMaxAllow ? activityDetails?.oOldFields?.nMaxAllow : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields && activityDetails?.oNewFields?.nMaxAllow ? activityDetails?.oNewFields?.nMaxAllow : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.bMaxAllowForAllUser, activityDetails?.oNewFields?.bMaxAllowForAllUser)}>
                <td>Promo usage allowance per user?</td>
                <td><b>{activityDetails?.oOldFields ? (activityDetails?.oOldFields?.bMaxAllowForAllUser ? 'Yes' : 'No') : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields ? (activityDetails?.oNewFields?.bMaxAllowForAllUser ? 'Yes' : 'No') : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.nPerUserUsage, activityDetails?.oNewFields?.nPerUserUsage)}>
                <td>Maximum Allow(Per User)</td>
                <td><b>{activityDetails?.oOldFields && activityDetails?.oOldFields?.nPerUserUsage ? activityDetails?.oOldFields?.nPerUserUsage : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields && activityDetails?.oNewFields?.nPerUserUsage ? activityDetails?.oNewFields?.nPerUserUsage : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.dStartTime, activityDetails?.oNewFields?.dStartTime)}>
                <td>Start Date</td>
                <td><b>{activityDetails?.oOldFields && activityDetails?.oOldFields?.dStartTime ? moment(activityDetails?.oOldFields?.dStartTime)?.format('DD/MM/YYYY hh:mm A') : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields && activityDetails?.oNewFields?.dStartTime ? moment(activityDetails?.oNewFields?.dStartTime)?.format('DD/MM/YYYY hh:mm A') : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.dExpireTime, activityDetails?.oNewFields?.dExpireTime)}>
                <td>End Date</td>
                <td><b>{activityDetails?.oOldFields && activityDetails?.oOldFields?.dExpireTime ? moment(activityDetails?.oOldFields?.dExpireTime)?.format('DD/MM/YYYY hh:mm A') : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields && activityDetails?.oNewFields?.dExpireTime ? moment(activityDetails?.oNewFields?.dExpireTime)?.format('DD/MM/YYYY hh:mm A') : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.nBonusExpireDays, activityDetails?.oNewFields?.nBonusExpireDays)}>
                <td>Expiry Days</td>
                <td><b>{(activityDetails?.oOldFields && activityDetails?.oOldFields?.nBonusExpireDays) ? activityDetails?.oOldFields?.nBonusExpireDays : '--'}</b></td>
                <td><b>{(activityDetails?.oNewFields && activityDetails?.oNewFields?.nBonusExpireDays) ? activityDetails?.oNewFields?.nBonusExpireDays : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.bIsPercent, activityDetails?.oNewFields?.bIsPercent)}>
                <td>Amount in Percentage?</td>
                <td><b>{activityDetails?.oOldFields ? (activityDetails?.oOldFields?.bIsPercent ? 'Yes' : 'No') : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields ? (activityDetails?.oNewFields?.bIsPercent ? 'Yes' : 'No') : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.eStatus, activityDetails?.oNewFields?.eStatus)}>
                <td>Status</td>
                <td><b>{activityDetails?.oOldFields ? (activityDetails?.oOldFields?.eStatus === 'Y' ? 'Active' : 'InActive') : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields ? (activityDetails?.oNewFields?.eStatus === 'Y' ? 'Active' : 'InActive') : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.sInfo, activityDetails?.oNewFields?.sInfo)}>
                <td>Description</td>
                <td><b>{(activityDetails?.oOldFields && activityDetails?.oOldFields?.sInfo) ? activityDetails?.oOldFields?.sInfo : '--'}</b></td>
                <td><b>{(activityDetails?.oNewFields && activityDetails?.oNewFields?.sInfo) ? activityDetails?.oNewFields?.sInfo : '--'}</b></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      )}

      {activityDetails?.eKey === 'L' && (
      <div className='table-represent'>
        <div className='table-responsive'>
          <table className='table'>
            <thead>
              <tr>
                <th>Field Name</th>
                <th>Old Field</th>
                <th>New Field</th>
              </tr>
            </thead>
            <tbody>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.sName, activityDetails?.oNewFields?.sName)}>
                <td>League Name</td>
                <td><b>{(activityDetails?.oOldFields && activityDetails?.oOldFields?.sName) ? activityDetails?.oOldFields?.sName : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields && activityDetails?.oNewFields?.sName ? activityDetails?.oNewFields?.sName : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.sLeagueCategory, activityDetails?.oNewFields?.sLeagueCategory)}>
                <td>League Category</td>
                <td><b>{(activityDetails?.oOldFields && activityDetails?.oOldFields?.sLeagueCategory) ? activityDetails?.oOldFields?.sLeagueCategory : '--'}</b></td>
                <td><b>{(activityDetails?.oNewFields && activityDetails?.oNewFields?.sLeagueCategory) ? activityDetails?.oNewFields?.sLeagueCategory : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.eCategory, activityDetails?.oNewFields?.eCategory)}>
                <td>Game Category</td>
                <td><b>{(activityDetails?.oOldFields && activityDetails?.oOldFields?.eCategory) ? activityDetails?.oOldFields?.eCategory : '--'}</b></td>
                <td><b>{(activityDetails?.oNewFields && activityDetails?.oNewFields?.eCategory) ? activityDetails?.oNewFields?.eCategory : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.sFilterCategory, activityDetails?.oNewFields?.sFilterCategory)}>
                <td>Filter Category</td>
                <td><b>{activityDetails?.oOldFields && activityDetails?.oOldFields?.sFilterCategory ? activityDetails?.oOldFields?.sFilterCategory : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields && activityDetails?.oNewFields?.sFilterCategory ? activityDetails?.oNewFields?.sFilterCategory : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.sPayoutBreakupDesign, activityDetails?.oNewFields?.sPayoutBreakupDesign)}>
                <td>Payout Breakup Design</td>
                <td><b>{activityDetails?.oOldFields && activityDetails?.oOldFields?.sPayoutBreakupDesign ? activityDetails?.oOldFields?.sPayoutBreakupDesign : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields && activityDetails?.oNewFields?.sPayoutBreakupDesign ? activityDetails?.oNewFields?.sPayoutBreakupDesign : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.nLoyaltyPoint, activityDetails?.oNewFields?.nLoyaltyPoint)}>
                <td>Loyalty Point</td>
                <td><b>{activityDetails?.oOldFields && activityDetails?.oOldFields?.nLoyaltyPoint ? activityDetails?.oOldFields.nLoyaltyPoint : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields && activityDetails?.oNewFields?.nLoyaltyPoint ? activityDetails?.oNewFields.nLoyaltyPoint : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.bConfirmLeague, activityDetails?.oNewFields?.bConfirmLeague)}>
                <td>Confirm League</td>
                <td><b>{activityDetails?.oOldFields ? (activityDetails?.oOldFields?.bConfirmLeague ? 'Yes' : 'No') : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields ? (activityDetails?.oNewFields?.bConfirmLeague ? 'Yes' : 'No') : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.bAutoCreate, activityDetails?.oNewFields?.bAutoCreate)}>
                <td>Auto Create</td>
                <td><b>{activityDetails?.oOldFields ? (activityDetails?.oOldFields?.bAutoCreate ? 'Yes' : 'No') : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields ? (activityDetails?.oNewFields?.bAutoCreate ? 'Yes' : 'No') : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.nMin, activityDetails?.oNewFields?.nMin)}>
                <td>Min Entry</td>
                <td><b>{activityDetails?.oOldFields && activityDetails?.oOldFields.nMin ? activityDetails?.oOldFields.nMin : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields && activityDetails?.oNewFields.nMin ? activityDetails?.oNewFields.nMin : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.nMax, activityDetails?.oNewFields?.nMax)}>
                <td>Max Entry</td>
                <td><b>{activityDetails?.oOldFields && activityDetails?.oOldFields?.nMax ? activityDetails?.oOldFields?.nMax : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields && activityDetails?.oNewFields?.nMax ? activityDetails?.oNewFields.nMax : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.nPrice, activityDetails?.oNewFields?.nPrice)}>
                <td>Entry Fees</td>
                <td><b>{(activityDetails?.oOldFields && activityDetails?.oOldFields?.nPrice) ? activityDetails?.oOldFields?.nPrice : '--'}</b></td>
                <td><b>{(activityDetails?.oNewFields && activityDetails?.oNewFields?.nPrice) ? activityDetails?.oNewFields?.nPrice : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.nTotalPayout, activityDetails?.oNewFields?.nTotalPayout)}>
                <td>Total Payout</td>
                <td><b>{(activityDetails?.oOldFields && activityDetails?.oOldFields?.nTotalPayout) ? activityDetails?.oOldFields?.nTotalPayout : '--'}</b></td>
                <td><b>{(activityDetails?.oNewFields && activityDetails?.oNewFields?.nTotalPayout) ? activityDetails?.oNewFields?.nTotalPayout : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.nBonusUtil, activityDetails?.oNewFields?.nBonusUtil)}>
                <td>Bonus Util(%)</td>
                <td><b>{(activityDetails?.oOldFields && activityDetails?.oOldFields?.nBonusUtil) ? activityDetails?.oOldFields?.nBonusUtil : '--'}</b></td>
                <td><b>{(activityDetails?.oNewFields && activityDetails?.oNewFields?.nBonusUtil) ? activityDetails?.oNewFields?.nBonusUtil : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.nWinnersCount, activityDetails?.oNewFields?.nWinnersCount)}>
                <td>Winners Count</td>
                <td><b>{(activityDetails?.oOldFields && activityDetails?.oOldFields?.nWinnersCount) ? activityDetails?.oOldFields?.nWinnersCount : '--'}</b></td>
                <td><b>{(activityDetails?.oNewFields && activityDetails?.oNewFields?.nWinnersCount) ? activityDetails?.oNewFields?.nWinnersCount : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.nPosition, activityDetails?.oNewFields?.nPosition)}>
                <td>Position</td>
                <td><b>{(activityDetails?.oOldFields && activityDetails?.oOldFields?.nPosition) ? activityDetails?.oOldFields?.nPosition : '--'}</b></td>
                <td><b>{(activityDetails?.oNewFields && activityDetails?.oNewFields?.nPosition) ? activityDetails?.oNewFields?.nPosition : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.eStatus, activityDetails?.oNewFields?.eStatus)}>
                <td>Status</td>
                <td><b>{activityDetails?.oOldFields ? (activityDetails?.oOldFields?.eStatus === 'Y' ? 'Active' : 'InActive') : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields ? (activityDetails?.oNewFields?.eStatus === 'Y' ? 'Active' : 'InActive') : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.bMultipleEntry, activityDetails?.oNewFields?.bMultipleEntry)}>
                <td>Multiple Entry</td>
                <td><b>{activityDetails?.oOldFields ? (activityDetails?.oOldFields?.bMultipleEntry ? 'Yes' : 'No') : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields ? (activityDetails?.oNewFields?.bMultipleEntry ? 'Yes' : 'No') : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.nTeamJoinLimit, activityDetails?.oNewFields?.nTeamJoinLimit)}>
                <td>Team Join Limit</td>
                <td><b>{(activityDetails?.oOldFields && activityDetails?.oOldFields?.nTeamJoinLimit) ? activityDetails?.oOldFields?.nTeamJoinLimit : '--'}</b></td>
                <td><b>{(activityDetails?.oNewFields && activityDetails?.oNewFields?.nTeamJoinLimit) ? activityDetails?.oNewFields?.nTeamJoinLimit : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.bCashbackEnabled, activityDetails?.oNewFields?.bCashbackEnabled)}>
                <td>Cashback Enabled?</td>
                <td><b>{activityDetails?.oOldFields ? (activityDetails?.oOldFields?.bCashbackEnabled ? 'Yes' : 'No') : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields ? (activityDetails?.oNewFields?.bCashbackEnabled ? 'Yes' : 'No') : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.nMinCashbackTeam, activityDetails?.oNewFields?.nMinCashbackTeam)}>
                <td>Min No of Team for Cashback</td>
                <td><b>{(activityDetails?.oOldFields && activityDetails?.oOldFields?.nMinCashbackTeam) ? activityDetails?.oOldFields?.nMinCashbackTeam : '--'}</b></td>
                <td><b>{(activityDetails?.oNewFields && activityDetails?.oNewFields?.nMinCashbackTeam) ? activityDetails?.oNewFields?.nMinCashbackTeam : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.nCashbackAmount, activityDetails?.oNewFields?.nCashbackAmount)}>
                <td>Cashback Amount</td>
                <td><b>{(activityDetails?.oOldFields && activityDetails?.oOldFields?.nCashbackAmount) ? activityDetails?.oOldFields?.nCashbackAmount : '--'}</b></td>
                <td><b>{(activityDetails?.oNewFields && activityDetails?.oNewFields?.nCashbackAmount) ? activityDetails?.oNewFields?.nCashbackAmount : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.eCashbackType, activityDetails?.oNewFields?.eCashbackType)}>
                <td>Cashback Type</td>
                <td><b>{activityDetails?.oOldFields ? (activityDetails?.oOldFields?.eCashbackType && activityDetails?.oOldFields?.eCashbackType === 'C' ? 'Cash' : activityDetails?.oOldFields?.eCashbackType === 'B' ? 'Bonus' : '--') : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields ? (activityDetails?.oNewFields?.eCashbackType && activityDetails?.oNewFields?.eCashbackType === 'C' ? 'Cash' : activityDetails?.oNewFields?.eCashbackType === 'B' ? 'Bonus' : '--') : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.bPoolPrize, activityDetails?.oNewFields?.bPoolPrize)}>
                <td>Pool Prize</td>
                <td><b>{activityDetails?.oOldFields ? (activityDetails?.oOldFields?.bPoolPrize ? 'Yes' : 'No') : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields ? (activityDetails?.oNewFields?.bPoolPrize ? 'Yes' : 'No') : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.bUnlimitedJoin, activityDetails?.oNewFields?.bUnlimitedJoin)}>
                <td>Unlimited Join</td>
                <td><b>{activityDetails?.oOldFields ? (activityDetails?.oOldFields?.bUnlimitedJoin ? 'Yes' : 'No') : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields ? (activityDetails?.oNewFields?.bUnlimitedJoin ? 'Yes' : 'No') : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.nDeductPercent, activityDetails?.oNewFields?.nDeductPercent)}>
                <td>Deduct Percent (%)</td>
                <td><b>{(activityDetails?.oOldFields && activityDetails?.oOldFields?.nDeductPercent) ? activityDetails?.oOldFields?.nDeductPercent : '--'}</b></td>
                <td><b>{(activityDetails?.oNewFields && activityDetails?.oNewFields?.nDeductPercent) ? activityDetails?.oNewFields?.nDeductPercent : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.bBotCreate, activityDetails?.oNewFields?.bBotCreate)}>
                <td>Bot Create</td>
                <td><b>{activityDetails?.oOldFields ? (activityDetails?.oOldFields?.bBotCreate ? 'Yes' : 'No') : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields ? (activityDetails?.oNewFields?.bBotCreate ? 'Yes' : 'No') : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.nMinTeamCount, activityDetails?.oNewFields?.nMinTeamCount)}>
                <td>Min no of team for Bot</td>
                <td><b>{(activityDetails?.oOldFields && activityDetails?.oOldFields.nMinTeamCount) ? activityDetails?.oOldFields?.nMinTeamCount : '--'}</b></td>
                <td><b>{(activityDetails?.oNewFields && activityDetails?.oNewFields.nMinTeamCount) ? activityDetails?.oNewFields?.nMinTeamCount : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.nCopyBotsPerTeam, activityDetails?.oNewFields?.nCopyBotsPerTeam)}>
                <td>Copy bots per Team</td>
                <td><b>{(activityDetails?.oOldFields && activityDetails?.oOldFields?.nCopyBotsPerTeam) ? activityDetails?.oOldFields?.nCopyBotsPerTeam : '--'}</b></td>
                <td><b>{(activityDetails?.oNewFields && activityDetails?.oNewFields?.nCopyBotsPerTeam) ? activityDetails?.oNewFields?.nCopyBotsPerTeam : '--'}</b></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      )}

      {activityDetails?.eKey === 'PB' && (
      <div className='table-represent'>
        <div className='table-responsive'>
          <table className='table'>
            <thead>
              <tr>
                <th>Field Name</th>
                <th>Old Field</th>
                <th>New Field</th>
              </tr>
            </thead>
            <tbody>
              <tr className={highlighted(prizeBreakupFields?.oldField, prizeBreakupFields?.newField, prizeBreakupFields?.oldField[0]?.nPrize, prizeBreakupFields?.newField[0]?.nPrize)}>
                <td>Prize</td>
                <td><b>{prizeBreakupFields?.oldField?.length !== 0 ? (prizeBreakupFields?.oldField[0]?.nPrize ? prizeBreakupFields?.oldField[0]?.nPrize : 0) : '--'}</b></td>
                <td><b>{prizeBreakupFields?.newField?.length !== 0 ? (prizeBreakupFields?.newField[0]?.nPrize ? prizeBreakupFields?.newField[0]?.nPrize : 0) : '--'}</b></td>
              </tr>
              <tr className={highlighted(prizeBreakupFields?.oldField, prizeBreakupFields?.newField, prizeBreakupFields?.oldField[0]?.nRankFrom?.toString(), prizeBreakupFields?.newField[0]?.nRankFrom?.toString())}>
                <td>Ranks</td>
                <td>
                  <b>
                    {prizeBreakupFields?.oldField?.length !== 0
                      ? (
                        <>
                          (
                          {prizeBreakupFields?.oldField[0]?.nRankFrom}
                          -
                          {prizeBreakupFields?.oldField[0]?.nRankTo}
                          )
                        </>
                        )
                      : '--'}
                  </b>
                </td>
                <td>
                  <b>
                    {prizeBreakupFields?.newField?.length !== 0
                      ? (
                        <>
                          (
                          {prizeBreakupFields?.newField[0]?.nRankFrom}
                          -
                          {prizeBreakupFields?.newField[0]?.nRankTo}
                          )
                        </>
                        )
                      : '--'}
                  </b>
                </td>
              </tr>
              <tr className={highlighted(prizeBreakupFields?.oldField, prizeBreakupFields?.newField, prizeBreakupFields?.oldField[0]?.eRankType, prizeBreakupFields?.newField[0]?.eRankType)}>
                <td>Rank Type</td>
                <td><b>{prizeBreakupFields?.oldField?.length !== 0 && prizeBreakupFields?.oldField[0]?.eRankType && prizeBreakupFields?.oldField[0]?.eRankType === 'R' ? 'Real Money' : prizeBreakupFields?.oldField[0]?.eRankType === 'B' ? 'Bonus' : prizeBreakupFields?.oldField[0]?.eRankType === 'E' ? 'Extra' : '--'}</b></td>
                <td><b>{prizeBreakupFields?.newField?.length !== 0 && prizeBreakupFields?.newField[0]?.eRankType && prizeBreakupFields?.newField[0]?.eRankType === 'R' ? 'Real Money' : prizeBreakupFields?.newField[0]?.eRankType === 'B' ? 'Bonus' : prizeBreakupFields?.newField[0]?.eRankType === 'E' ? 'Extra' : '--'}</b></td>
              </tr>
              <tr className={highlighted(prizeBreakupFields?.oldField, prizeBreakupFields?.newField, prizeBreakupFields?.oldField[0]?.sInfo, prizeBreakupFields?.newField[0]?.sInfo)}>
                <td>Extra</td>
                <td><b>{prizeBreakupFields?.oldField?.length !== 0 && prizeBreakupFields?.oldField[0]?.sInfo ? prizeBreakupFields?.oldField[0]?.sInfo : '--'}</b></td>
                <td><b>{prizeBreakupFields?.newField?.length !== 0 && prizeBreakupFields?.newField[0]?.sInfo ? prizeBreakupFields?.newField[0]?.sInfo : '--'}</b></td>
              </tr>
              <tr className={highlighted(prizeBreakupFields?.oldField, prizeBreakupFields?.newField, prizeBreakupFields?.oldField[0]?.sImage, prizeBreakupFields?.newField[0]?.sImage)}>
                <td>Image</td>
                <td>{prizeBreakupFields?.oldField?.length !== 0 && prizeBreakupFields?.oldField[0]?.sImage ? <img alt='No Image' className='theme-image' src={url + prizeBreakupFields?.oldField[0]?.sImage} /> : ' No Image '}</td>
                <td>{prizeBreakupFields?.newField?.length !== 0 && prizeBreakupFields?.newField[0]?.sImage ? <img alt='No Image' className='theme-image' src={url + prizeBreakupFields?.newField[0]?.sImage} /> : ' No Image '}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      )}

      {activityDetails?.eKey === 'M' && (
      <div className='table-represent'>
        <div className='table-responsive'>
          <table className='table'>
            <thead>
              <tr>
                <th>Field Name</th>
                <th>Old Field</th>
                <th>New Field</th>
              </tr>
            </thead>
            <tbody>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.sName, activityDetails?.oNewFields?.sName)}>
                <td>Match Name</td>
                <td><b>{activityDetails?.oOldFields?.sName || '--'}</b></td>
                <td><b>{activityDetails?.oNewFields?.sName || '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.sSeasonName, activityDetails?.oNewFields?.sSeasonName)}>
                <td>Season Name</td>
                <td><b>{activityDetails?.oNewFields?.sSeasonName || '--'}</b></td>
                <td><b>{activityDetails?.oOldFields?.sSeasonName || '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.eCategory, activityDetails?.oNewFields?.eCategory)}>
                <td>Category</td>
                <td><b>{activityDetails?.oOldFields?.eCategory ? activityDetails?.oOldFields?.eCategory : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields?.eCategory ? activityDetails?.oNewFields?.eCategory : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.eFormat, activityDetails?.oNewFields?.eFormat)}>
                <td>Format</td>
                <td><b>{activityDetails?.oOldFields?.eFormat ? activityDetails?.oOldFields?.eFormat : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields?.eFormat ? activityDetails?.oNewFields?.eFormat : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.eStatus, activityDetails?.oNewFields?.eStatus)}>
                <td>Match Status</td>
                <td><b>{(activityDetails?.oOldFields?.eStatus) ? (activityDetails?.oOldFields?.eStatus === 'P' ? 'Pending' : activityDetails?.oOldFields?.eStatus === 'U' ? 'Upcoming' : activityDetails?.oOldFields?.eStatus === 'L' ? 'Live' : activityDetails?.oOldFields?.eStatus === 'I' ? 'In-Review' : activityDetails?.oOldFields?.eStatus === 'CMP' ? 'Completed' : activityDetails?.oOldFields?.eStatus === 'CNCL' ? 'Cancelled' : '--') : '--'}</b></td>
                <td><b>{(activityDetails?.oNewFields?.eStatus) ? (activityDetails?.oNewFields?.eStatus === 'P' ? 'Pending' : activityDetails?.oNewFields?.eStatus === 'U' ? 'Upcoming' : activityDetails?.oNewFields?.eStatus === 'L' ? 'Live' : activityDetails?.oNewFields?.eStatus === 'I' ? 'In-Review' : activityDetails?.oNewFields?.eStatus === 'CMP' ? 'Completed' : activityDetails?.oNewFields?.eStatus === 'CNCL' ? 'Cancelled' : '--') : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.dStartDate, activityDetails?.oNewFields?.dStartDate)}>
                <td>Match Date & Time</td>
                <td><b>{activityDetails?.oOldFields?.dStartDate ? moment(activityDetails?.oOldFields?.dStartDate)?.format('DD/MM/YYYY hh:mm A') : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields?.dStartDate ? moment(activityDetails?.oNewFields?.dStartDate)?.format('DD/MM/YYYY hh:mm A') : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.sVenue, activityDetails?.oNewFields?.sVenue)}>
                <td>Venue</td>
                <td><b>{activityDetails?.oOldFields?.sVenue ? activityDetails?.oOldFields?.sVenue : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields?.sVenue ? activityDetails?.oNewFields?.sVenue : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.iSeriesId, activityDetails?.oNewFields?.iSeriesId)}>
                <td>Series Id</td>
                <td><b>{activityDetails?.oOldFields?.iSeriesId ? activityDetails?.oOldFields?.iSeriesId : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields?.iSeriesId ? activityDetails?.oNewFields?.iSeriesId : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.sInfo, activityDetails?.oNewFields?.sInfo)}>
                <td>Info</td>
                <td><b>{activityDetails?.oOldFields?.sInfo ? activityDetails.oOldFields?.sInfo : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields?.sInfo ? activityDetails.oNewFields?.sInfo : '--'}</b></td>
              </tr>
              {!activityDetails?.oOldFields && (
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.oHomeTeam?.sName, activityDetails?.oNewFields?.oHomeTeam?.sName)}>
                <td>Team A Name</td>
                <td><b>{activityDetails?.oOldFields?.oHomeTeam?.sName ? activityDetails?.oOldFields?.oHomeTeam?.sName : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields?.oHomeTeam?.sName ? activityDetails?.oNewFields?.oHomeTeam?.sName : '--'}</b></td>
              </tr>
              )}
              {!activityDetails?.oOldFields && (
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.oAwayTeam?.sName, activityDetails?.oNewFields?.oAwayTeam?.sName)}>
                <td>Team B Name</td>
                <td><b>{activityDetails?.oOldFields?.oAwayTeam?.sName ? activityDetails?.oOldFields?.oAwayTeam?.sName : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields?.oAwayTeam?.sName ? activityDetails?.oNewFields?.oAwayTeam?.sName : '--'}</b></td>
              </tr>
              )}
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.eTossWinnerAction, activityDetails?.oNewFields?.eTossWinnerAction)}>
                <td>Toss Winner Opt For</td>
                <td><b>{activityDetails?.oOldFields?.eTossWinnerAction ? activityDetails?.oOldFields?.eTossWinnerAction : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields?.eTossWinnerAction ? activityDetails?.oNewFields?.eTossWinnerAction : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.sWinning, activityDetails?.oNewFields?.sWinning)}>
                <td>Winning Text</td>
                <td><b>{activityDetails?.oOldFields?.sWinning ? activityDetails?.oOldFields?.sWinning : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields?.sWinning ? activityDetails?.oNewFields?.sWinning : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.sSponsoredText, activityDetails?.oNewFields?.sSponsoredText)}>
                <td>Sponsored Text</td>
                <td><b>{activityDetails?.oOldFields?.sSponsoredText || '--'}</b></td>
                <td><b>{activityDetails?.oNewFields?.sSponsoredText || '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.sStreamUrl, activityDetails?.oNewFields?.sStreamUrl)}>
                <td>Stream Url</td>
                <td><b>{activityDetails?.oOldFields?.sStreamUrl || '--'}</b></td>
                <td><b>{activityDetails?.oNewFields?.sStreamUrl || '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.sFantasyPost, activityDetails?.oNewFields?.sFantasyPost)}>
                <td>Fantasy Post Id</td>
                <td><b>{activityDetails?.oOldFields?.sFantasyPost || '--'}</b></td>
                <td><b>{activityDetails?.oNewFields?.sFantasyPost || '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.nMaxTeamLimit, activityDetails?.oNewFields?.nMaxTeamLimit)}>
                <td>Max Team Limit</td>
                <td><b>{activityDetails?.oOldFields?.nMaxTeamLimit || '--'}</b></td>
                <td><b>{activityDetails?.oNewFields?.nMaxTeamLimit || '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.bMatchOnTop, activityDetails?.oNewFields?.bMatchOnTop)}>
                <td>Match On Top?</td>
                <td><b>{(activityDetails?.oOldFields?.bMatchOnTop ? 'Yes' : 'No') || '--'}</b></td>
                <td><b>{(activityDetails?.oNewFields?.bMatchOnTop ? 'Yes' : 'No') || '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.bDisabled, activityDetails?.oNewFields?.bDisabled)}>
                <td>Disabled?</td>
                <td><b>{(activityDetails?.oOldFields?.bDisabled ? 'Yes' : 'No') || '--'}</b></td>
                <td><b>{(activityDetails?.oNewFields?.bDisabled ? 'Yes' : 'No') || '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.bScorecardShow, activityDetails?.oNewFields?.bScorecardShow)}>
                <td>Show Score Card in App?</td>
                <td><b>{(activityDetails?.oOldFields?.bScorecardShow ? 'Yes' : 'No') || '--'}</b></td>
                <td><b>{(activityDetails?.oNewFields?.bScorecardShow ? 'Yes' : 'No') || '--'}</b></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      )}

      {activityDetails?.eKey === 'ML' && (
      <div className='table-represent'>
        <div className='table-responsive'>
          <table className='table'>
            <thead>
              <tr>
                <th>Field Name</th>
                <th>Old Field</th>
                <th>New Field</th>
              </tr>
            </thead>
            <tbody>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.sName, activityDetails?.oNewFields?.sName)}>
                <td>League Name</td>
                <td><b>{activityDetails?.oOldFields?.sName || '--'}</b></td>
                <td><b>{activityDetails?.oNewFields?.sName || '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.bCancelled, activityDetails?.oNewFields?.bCancelled)}>
                <td>Cancelled?</td>
                <td><b>{activityDetails?.oOldFields ? (activityDetails?.oOldFields?.bCancelled ? 'Yes' : 'No') : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields ? (activityDetails?.oNewFields?.bCancelled ? 'Yes' : 'No') : '--'}</b></td>
              </tr>
            </tbody>
          </table>
          {(!activityDetails?.iAdminId) && (
          <div className='d-flex justify-content-between'>
            {/* <div><b>Min Entry for Match League: {activityDetails?.oDetails?.nMin || '--'}</b></div> */}
            <div>
              <b>
                Joined Users:
                {activityDetails?.oDetails?.nJoined || 0}
              </b>
            </div>
            <div>
              <b>
                Unique Joined Users:
                {activityDetails?.oDetails?.uniqueUserJoinCount || 0}
              </b>
            </div>
          </div>
          )}
        </div>
      </div>
      )}

      {activityDetails?.eKey === 'MP' && (
      <div className = "table-represent">
        <div className='table-responsive'>
          <table className='table'>
            <thead>
              <tr>
                <th>Field Name </th>
                <th>Old Field</th>
                <th>New Field</th>
              </tr>
            </thead>
            <tbody>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.sName, activityDetails?.oNewFields?.sName)}>
                <td>Player Name</td>
                <td><b>{activityDetails?.oOldFields?.sName || '--'}</b></td>
                <td><b>{activityDetails?.oNewFields?.sName || '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.sKey, activityDetails?.oNewFields?.sKey)}>
                <td>Key</td>
                <td><b>{activityDetails?.oOldFields?.sKey || '--'}</b></td>
                <td><b>{activityDetails?.oNewFields?.sKey || '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.eRole, activityDetails?.oNewFields?.eRole)}>
                <td>Role</td>
                <td><b>{activityDetails?.oOldFields?.eRole || '--'}</b></td>
                <td><b>{activityDetails?.oNewFields?.eRole || '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.nFantasyCredit, activityDetails?.oNewFields?.nFantasyCredit)}>
                <td>Fantasy Credit</td>
                <td><b>{activityDetails?.oOldFields?.nFantasyCredit || 0}</b></td>
                <td><b>{activityDetails?.oNewFields?.nFantasyCredit || 0}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.nScoredPoints, activityDetails?.oNewFields?.nScoredPoints)}>
                <td>Scored Points</td>
                <td><b>{activityDetails?.oOldFields?.nScoredPoints || 0}</b></td>
                <td><b>{activityDetails?.oNewFields?.nScoredPoints || 0}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.nSeasonPoints, activityDetails?.oNewFields?.nSeasonPoints)}>
                <td>Season Points</td>
                <td><b>{activityDetails?.oOldFields?.nSeasonPoints || 0}</b></td>
                <td><b>{activityDetails?.oNewFields?.nSeasonPoints || 0}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.sTeamName, activityDetails?.oNewFields?.sTeamName)}>
                <td>Team Name</td>
                <td><b>{activityDetails?.oOldFields?.sTeamName || '--'}</b></td>
                <td><b>{activityDetails?.oNewFields?.sTeamName || '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.sTeamKey, activityDetails?.oNewFields?.sTeamKey)}>
                <td>Team Key</td>
                <td><b>{activityDetails?.oOldFields?.sTeamKey || '--'}</b></td>
                <td><b>{activityDetails?.oNewFields?.sTeamKey || '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.bEconomyBonus, activityDetails?.oNewFields?.bEconomyBonus)}>
                <td>Economy Bonus</td>
                <td><b>{(activityDetails?.oOldFields?.bEconomyBonus ? 'Yes' : 'No') || '--'}</b></td>
                <td><b>{(activityDetails?.oNewFields?.bEconomyBonus ? 'Yes' : 'No') || '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.bShow, activityDetails?.oNewFields?.bShow)}>
                <td>Show</td>
                <td><b>{(activityDetails?.oOldFields?.bShow ? 'Yes' : 'No') || '--'}</b></td>
                <td><b>{(activityDetails?.oNewFields?.bShow ? 'Yes' : 'No') || '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.bStrikeRateBonus, activityDetails?.oNewFields?.bStrikeRateBonus)}>
                <td>Strike Rate Bonus</td>
                <td><b>{(activityDetails?.oOldFields?.bStrikeRateBonus ? 'Yes' : 'No') || '--'}</b></td>
                <td><b>{(activityDetails?.oNewFields?.bStrikeRateBonus ? 'Yes' : 'No') || '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.iMatchId, activityDetails?.oNewFields?.iMatchId)}>
                <td>Match Id</td>
                <td><b>{activityDetails?.oOldFields?.iMatchId || '--'}</b></td>
                <td><b>{activityDetails?.oNewFields?.iMatchId || '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.iPlayerId, activityDetails?.oNewFields?.iPlayerId)}>
                <td>Player Id</td>
                <td><b>{activityDetails?.oOldFields?.iPlayerId || '--'}</b></td>
                <td><b>{activityDetails?.oNewFields?.iPlayerId || '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.iTeamId, activityDetails?.oNewFields?.iTeamId)}>
                <td>Team Id</td>
                <td><b>{activityDetails?.oOldFields?.iTeamId || '--'}</b></td>
                <td><b>{activityDetails?.oNewFields?.iTeamId || '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.sImage, activityDetails?.oNewFields?.sImage)}>
                <td>Player Image</td>
                <td><b>{activityDetails?.oOldFields?.sImage ? <img alt='No Image' className='theme-image' src={url + activityDetails?.oOldFields?.sImage} /> : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields?.sImage ? <img alt='No Image' className='theme-image' src={url + activityDetails?.oNewFields?.sImage} /> : '--'}</b></td>
              </tr>
            </tbody>
          </table>
          {(!activityDetails?.iAdminId) && (
          <div className='d-flex justify-content-between'>
            {/* <div><b>Min Entry for Match League: {activityDetails?.oDetails?.nMin || '--'}</b></div> */}
            <div>
              <b>
                Joined Users:
                {activityDetails?.oDetails?.nJoined || 0}
              </b>
            </div>
            <div>
              <b>
                Unique Joined Users:
                {activityDetails?.oDetails?.uniqueUserJoinCount || 0}
              </b>
            </div>
          </div>
          )}
        </div>
      </div>
      )}

      {activityDetails?.eKey === 'S' && (
      <div className='table-represent'>
        <div className='table-responsive'>
          <table className='table'>
            <thead>
              <tr>
                <th>Field Name</th>
                <th>Old Field</th>
                <th>New Field</th>
              </tr>
            </thead>
            <tbody>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.sTitle, activityDetails?.oNewFields?.sTitle)}>
                <td>Title</td>
                <td><b>{activityDetails?.oOldFields?.sTitle || '--'}</b></td>
                <td><b>{activityDetails?.oNewFields?.sTitle || '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.sDescription, activityDetails?.oNewFields?.sDescription)}>
                <td>Description</td>
                <td><b>{activityDetails?.oOldFields?.sDescription || '--'}</b></td>
                <td><b>{activityDetails?.oNewFields?.sDescription || '--'}</b></td>
              </tr>
              {activityDetails?.oNewFields?.sKey === 'IMG' && (
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.sImage, activityDetails?.oNewFields?.sImage)}>
                <td>Side Image</td>
                <td>{activityDetails?.oOldFields?.sImage ? <img src={profileUrl + activityDetails?.oOldFields?.sImage} width={80} /> : '--'}</td>
                <td>{activityDetails?.oNewFields?.sImage ? <img src={profileUrl + activityDetails?.oNewFields?.sImage} width={80} /> : '--'}</td>
              </tr>
              )}
              {activityDetails?.oNewFields?.sKey === 'BG' && (
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.sImage, activityDetails?.oNewFields?.sImage)}>
                <td>Side Background</td>
                <td>{activityDetails?.oOldFields?.sImage ? <img src={profileUrl + activityDetails?.oOldFields?.sImage} width={80} /> : '--'}</td>
                <td>{activityDetails?.oNewFields?.sImage ? <img src={profileUrl + activityDetails?.oNewFields?.sImage} width={80} /> : '--'}</td>
              </tr>
              )}
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, ((activityDetails?.oOldFields?.sKey === 'PCF') || (activityDetails?.oOldFields?.sKey === 'PCS') || (activityDetails?.oOldFields?.sKey === 'PUBC') || (activityDetails?.oOldFields?.sKey === 'Deposit') || (activityDetails?.oOldFields?.sKey === 'Withdraw')) ? activityDetails?.oOldFields?.nMin : true, ((activityDetails?.oOldFields?.sKey === 'PCF') || (activityDetails?.oOldFields?.sKey === 'PCS') || (activityDetails?.oOldFields?.sKey === 'PUBC') || (activityDetails?.oOldFields?.sKey === 'Deposit') || (activityDetails?.oOldFields?.sKey === 'Withdraw')) ? activityDetails?.oNewFields?.nMin : true)}>
                <td>Min</td>
                <td><b>{((activityDetails?.oOldFields?.sKey === 'PCF') || (activityDetails?.oOldFields?.sKey === 'PCS') || (activityDetails?.oOldFields?.sKey === 'PUBC') || (activityDetails?.oOldFields?.sKey === 'Deposit') || (activityDetails?.oOldFields?.sKey === 'Withdraw')) ? (activityDetails?.oOldFields?.nMin || '--') : '--'}</b></td>
                <td><b>{((activityDetails?.oNewFields?.sKey === 'PCF') || (activityDetails?.oNewFields?.sKey === 'PCS') || (activityDetails?.oNewFields?.sKey === 'PUBC') || (activityDetails?.oNewFields?.sKey === 'Deposit') || (activityDetails?.oNewFields?.sKey === 'Withdraw')) ? (activityDetails?.oNewFields?.nMin || '--') : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, ((activityDetails?.oOldFields?.sKey === 'PCF') || (activityDetails?.oOldFields?.sKey === 'PCS') || (activityDetails?.oOldFields?.sKey === 'PUBC') || (activityDetails?.oOldFields?.sKey === 'Deposit') || (activityDetails?.oOldFields?.sKey === 'Withdraw')) ? activityDetails?.oOldFields?.nMax : true, ((activityDetails?.oOldFields?.sKey === 'PCF') || (activityDetails?.oOldFields?.sKey === 'PCS') || (activityDetails?.oOldFields?.sKey === 'PUBC') || (activityDetails?.oOldFields?.sKey === 'Deposit') || (activityDetails?.oOldFields?.sKey === 'Withdraw')) ? activityDetails?.oNewFields?.nMax : true)}>
                <td>Max</td>
                <td><b>{((activityDetails?.oOldFields?.sKey === 'PCF') || (activityDetails?.oOldFields?.sKey === 'PCS') || (activityDetails?.oOldFields?.sKey === 'PUBC') || (activityDetails?.oOldFields?.sKey === 'Deposit') || (activityDetails?.oOldFields?.sKey === 'Withdraw')) ? (activityDetails?.oOldFields?.nMax || '--') : '--'}</b></td>
                <td><b>{((activityDetails?.oNewFields?.sKey === 'PCF') || (activityDetails?.oNewFields?.sKey === 'PCS') || (activityDetails?.oNewFields?.sKey === 'PUBC') || (activityDetails?.oNewFields?.sKey === 'Deposit') || (activityDetails?.oNewFields?.sKey === 'Withdraw')) ? (activityDetails?.oNewFields?.nMax || '--') : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.nMax, activityDetails?.oNewFields?.nMax)}>
                <td>Value</td>
                <td><b>{((activityDetails?.oOldFields?.sKey === 'BonusExpireDays') || (activityDetails?.oOldFields?.sKey === 'UserDepositRateLimit') || (activityDetails?.oOldFields?.sKey === 'UserDepositRateLimitTimeFrame') || (activityDetails?.oOldFields?.sKey === 'TDS') || (activityDetails?.oOldFields?.sKey === 'UserWithdrawRateLimit') || (activityDetails?.oOldFields?.sKey === 'UserWithdrawRateLimitTimeFrame')) ? (activityDetails?.oOldFields?.nMax || '--') : '--'}</b></td>
                <td><b>{((activityDetails?.oNewFields?.sKey === 'BonusExpireDays') || (activityDetails?.oNewFields?.sKey === 'UserDepositRateLimit') || (activityDetails?.oNewFields?.sKey === 'UserDepositRateLimitTimeFrame') || (activityDetails?.oNewFields?.sKey === 'TDS') || (activityDetails?.oNewFields?.sKey === 'UserWithdrawRateLimit') || (activityDetails?.oNewFields?.sKey === 'UserWithdrawRateLimitTimeFrame')) ? (activityDetails?.oNewFields?.nMax || '--') : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.eStatus, activityDetails?.oNewFields?.eStatus)}>
                <td>Status</td>
                <td><b>{activityDetails?.oOldFields ? (activityDetails?.oOldFields?.eStatus === 'Y' ? 'Active' : 'Inactive') : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields ? (activityDetails?.oNewFields?.eStatus === 'Y' ? 'Active' : 'Inactive') : '--'}</b></td>
              </tr>
            </tbody>
          </table>
          {(!activityDetails?.iAdminId) && (
          <div className='d-flex justify-content-between'>
            {/* <div><b>Min Entry for Match League: {activityDetails?.oDetails?.nMin || '--'}</b></div> */}
            <div>
              <b>
                Joined Users:
                {activityDetails?.oDetails?.nJoined || 0}
              </b>
            </div>
            <div>
              <b>
                Unique Joined Users:
                {activityDetails?.oDetails?.uniqueUserJoinCount || 0}
              </b>
            </div>
          </div>
          )}
        </div>
      </div>
      )}

      {activityDetails?.eKey === 'CR' && (
      <div className='table-represent'>
        <div className='table-responsive'>
          <table className='table'>
            <thead>
              <tr>
                <th>Field Name</th>
                <th>Old Field</th>
                <th>New Field</th>
              </tr>
            </thead>
            <tbody>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.sRuleName, activityDetails?.oNewFields?.sRuleName)}>
                <td>Rule</td>
                <td><b>{activityDetails?.oOldFields?.sRuleName ? activityDetails?.oOldFields?.sRuleName : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields?.sRuleName ? activityDetails?.oNewFields?.sRuleName : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.sDescription, activityDetails?.oNewFields?.sDescription)}>
                <td>Description</td>
                <td><b>{activityDetails?.oOldFields?.sDescription || '--'}</b></td>
                <td><b>{activityDetails?.oNewFields?.sDescription || '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.nAmount, activityDetails?.oNewFields?.nAmount)}>
                <td>Amount</td>
                <td>
                  <b>
                    {activityDetails?.oOldFields?.nAmount}
                    {(activityDetails?.oOldFields?.eRule === 'PLC' || activityDetails?.oOldFields?.eRule === 'LCC' || activityDetails?.oOldFields?.eRule === 'LCG') && ' %'}
                  </b>
                </td>
                <td>
                  <b>
                    {activityDetails?.oNewFields?.nAmount}
                    {(activityDetails?.oNewFields?.eRule === 'PLC' || activityDetails?.oNewFields?.eRule === 'LCC' || activityDetails?.oNewFields?.eRule === 'LCG') && ' %'}
                  </b>
                </td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.eType, activityDetails?.oNewFields?.eType)}>
                <td>Type</td>
                <td><b>{activityDetails?.oOldFields?.eRule === 'LCG' ? '--' : activityDetails?.oOldFields?.eType === 'B' ? 'Bonus' : activityDetails?.oOldFields?.eType === 'D' ? 'Deposit' : 'Cash'}</b></td>
                <td><b>{activityDetails?.oNewFields?.eRule === 'LCG' ? '--' : activityDetails?.oNewFields?.eType === 'B' ? 'Bonus' : activityDetails?.oNewFields?.eType === 'D' ? 'Deposit' : 'Cash'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.eStatus, activityDetails?.oNewFields?.eStatus)}>
                <td>Status</td>
                <td><b>{activityDetails?.oOldFields ? (activityDetails?.oOldFields?.eStatus === 'Y' ? 'Active' : 'Inactive') : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields ? (activityDetails?.oNewFields?.eStatus === 'Y' ? 'Active' : 'Inactive') : '--'}</b></td>
              </tr>
            </tbody>
          </table>
          {(!activityDetails?.iAdminId) && (
          <div className='d-flex justify-content-between'>
            {/* <div><b>Min Entry for Match League: {activityDetails?.oDetails?.nMin || '--'}</b></div> */}
            <div>
              <b>
                Joined Users:
                {activityDetails?.oDetails?.nJoined || 0}
              </b>
            </div>
            <div>
              <b>
                Unique Joined Users:
                {activityDetails?.oDetails?.uniqueUserJoinCount || 0}
              </b>
            </div>
          </div>
          )}
        </div>
      </div>
      )}

      {activityDetails?.eKey === 'CF' && (
      <div className='table-represent'>
        <div className='table-responsive'>
          <table className='table'>
            <thead>
              <tr>
                <th>Field Name</th>
                <th>Old Field</th>
                <th>New Field</th>
              </tr>
            </thead>
            <tbody>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.sTitle, activityDetails?.oNewFields?.sTitle)}>
                <td>Title</td>
                <td><b>{activityDetails?.oOldFields?.sTitle || '--'}</b></td>
                <td><b>{activityDetails?.oNewFields?.sTitle || '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.sEmail, activityDetails?.oNewFields?.sEmail)}>
                <td>Email</td>
                <td><b>{activityDetails?.oOldFields?.sEmail || '--'}</b></td>
                <td><b>{activityDetails?.oNewFields?.sEmail || '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.eStatus, activityDetails?.oNewFields?.eStatus)}>
                <td>Status</td>
                <td><b>{activityDetails?.oOldFields?.eStatus === 'P' ? 'Pending' : activityDetails?.oOldFields?.eStatus === 'I' ? 'In-Progress' : activityDetails?.oOldFields?.eStatus === 'D' ? 'Declined' : activityDetails?.oOldFields?.eStatus === 'R' ? 'Resolved' : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields?.eStatus === 'P' ? 'Pending' : activityDetails?.oNewFields?.eStatus === 'I' ? 'In-Progress' : activityDetails?.oNewFields?.eStatus === 'D' ? 'Declined' : activityDetails?.oNewFields?.eStatus === 'R' ? 'Resolved' : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.eType, activityDetails?.oNewFields?.eType)}>
                <td>Type</td>
                <td><b>{activityDetails?.oNewFields?.eType === 'C' ? 'Complaints' : activityDetails?.oNewFields?.eType === 'F' ? 'Feedbacks' : activityDetails?.oNewFields?.eType === 'CS' ? 'Contact Us' : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields?.eType === 'C' ? 'Complaints' : activityDetails?.oNewFields?.eType === 'F' ? 'Feedbacks' : activityDetails?.oNewFields?.eType === 'CS' ? 'Contact Us' : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.sComment, activityDetails?.oNewFields?.sComment)}>
                <td>Comment</td>
                <td><b>{activityDetails?.oOldFields?.sComment || '--'}</b></td>
                <td><b>{activityDetails?.oNewFields?.sComment || '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.sDescription, activityDetails?.oNewFields?.sDescription)}>
                <td>Description</td>
                <td><b>{activityDetails?.oOldFields?.sDescription || '--'}</b></td>
                <td><b>{activityDetails?.oNewFields?.sDescription || '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.dUpdatedAt, activityDetails?.oNewFields?.dUpdatedAt)}>
                <td>Updated At</td>
                <td><b>{activityDetails?.oOldFields?.dUpdatedAt ? moment(activityDetails?.oOldFields?.dUpdatedAt)?.format('DD/MM/YYYY hh:mm A') : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields?.dUpdatedAt ? moment(activityDetails?.oNewFields?.dUpdatedAt)?.format('DD/MM/YYYY hh:mm A') : '--'}</b></td>
              </tr>
            </tbody>
          </table>
          {(!activityDetails?.iAdminId) && (
          <div className='d-flex justify-content-between'>
            {/* <div><b>Min Entry for Match League: {activityDetails?.oDetails?.nMin || '--'}</b></div> */}
            <div>
              <b>
                Joined Users:
                {activityDetails?.oDetails?.nJoined || 0}
              </b>
            </div>
            <div>
              <b>
                Unique Joined Users:
                {activityDetails?.oDetails?.uniqueUserJoinCount || 0}
              </b>
            </div>
          </div>
          )}
        </div>
      </div>
      )}

      {activityDetails?.eKey === 'SLB' && (
      <div className='table-represent'>
        <div className='table-responsive'>
          <table className='table'>
            <thead>
              <tr>
                <th>Field Name</th>
                <th>Old Field</th>
                <th>New Field</th>
              </tr>
            </thead>
            <tbody>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.sName, activityDetails?.oNewFields?.sName)}>
                <td>Series Name</td>
                <td><b>{activityDetails?.oOldFields?.sName || '--'}</b></td>
                <td><b>{activityDetails?.oNewFields?.sName || '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.eCategory, activityDetails?.oNewFields?.eCategory)}>
                <td>Category</td>
                <td><b>{(activityDetails?.oOldFields && activityDetails.oOldFields?.eCategory) ? activityDetails?.oOldFields?.eCategory : '--'}</b></td>
                <td><b>{(activityDetails?.oNewFields && activityDetails.oNewFields?.eCategory) ? activityDetails?.oNewFields?.eCategory : '--'}</b></td>
              </tr>
              <tr className={highlighted(activityDetails?.oOldFields, activityDetails?.oNewFields, activityDetails?.oOldFields?.eStatus, activityDetails?.oNewFields?.eStatus)}>
                <td>Status</td>
                <td><b>{activityDetails?.oOldFields?.eStatus === 'P' ? 'Pending' : activityDetails?.oOldFields?.eStatus === 'L' ? 'Live' : activityDetails?.oOldFields?.eStatus === 'CMP' ? 'Completed' : '--'}</b></td>
                <td><b>{activityDetails?.oNewFields?.eStatus === 'P' ? 'Pending' : activityDetails?.oNewFields?.eStatus === 'L' ? 'Live' : activityDetails?.oNewFields?.eStatus === 'CMP' ? 'Completed' : '--'}</b></td>
              </tr>
            </tbody>
          </table>
          {(!activityDetails?.iAdminId) && (
          <div className='d-flex justify-content-between'>
            {/* <div><b>Min Entry for Match League: {activityDetails?.oDetails?.nMin || '--'}</b></div> */}
            <div>
              <b>
                Joined Users:
                {activityDetails?.oDetails?.nJoined || 0}
              </b>
            </div>
            <div>
              <b>
                Unique Joined Users:
                {activityDetails?.oDetails?.uniqueUserJoinCount || 0}
              </b>
            </div>
          </div>
          )}
        </div>
      </div>
      )}

    </>
  )
}

SingleLogDetails.propTypes = {
  location: PropTypes.object,
  match: PropTypes.object
}
export default SingleLogDetails
