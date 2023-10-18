import React, { Fragment } from 'react'
import { Button, UncontrolledTooltip } from 'reactstrap'
import { Link, useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'

import backIcon from '../../../assets/images/back-icon-1.svg'
import exportIcon from '../../../assets/images/export-icon.svg'
import maintenance from '../../../assets/images/Maintenance.svg'
import infoIcon from '../../../assets/images/info-icon.svg'
function MainHeading (props) {
  const {
    promocodeStatistics,
    automatedNotification,
    sliderStatistics,
    heading,
    list,
    maintenancePermission,
    FormatsList,
    getMaintenanceModeFunc,
    leadershipBoard,
    calculateLeaderBoardData,
    AddVersion,
    cancelLink,
    AddSport,
    AddSlider,
    AddSetting,
    AddPromocode,
    AddPopUpAd,
    UpdatePayout,
    AddPayment,
    AddOffer,
    UpdateNotification,
    UpdateComplaint,
    UpdateEmailTemplate,
    AddContent,
    AddRuleComponent,
    Auth,
    adminPermission,
    onSubmit,
    submitDisableButton,
    button,
    onEdit,
    Title,
    Description,
    Details,
    onAdd,
    updateCurrencyData,
    imageSubmit,
    conditionUrl,
    Key,
    AllReports,
    AddNPromocode
  } = props
  // eslint-disable-next-line react/prop-types
  const page = JSON.parse(localStorage.getItem('queryParams'))
  const navigate = useNavigate()
  return (
    <div className='header-block-setting'>
      <div className='d-flex justify-content-between align-items-center'>
        <div className='d-flex inline-input align-items-center'>
          {promocodeStatistics ? <img className='custom-go-back mr-2' height='22' onClick={() => navigate(`/settings/promocode-management${page?.PromoCodeManagement || ''}`)} src={backIcon} width='22' /> : ''}
          {automatedNotification ? <img className='custom-go-back mr-2' height='22' onClick={() => navigate(`/users/push-notification${page?.PushNotificationManagement || ''}`)} src={backIcon} width='22' /> : ''}
          {sliderStatistics ? <img className='custom-go-back mr-2' height='22' onClick={() => navigate(`/settings/slider-management${page?.SliderManagement || ''}`)} src={backIcon} width='22' /> : ''}
          {(AddSport || AddVersion || AddSlider || AddSetting || AddPromocode || AddPopUpAd || UpdatePayout || AddPayment || AddOffer || UpdateNotification || UpdateComplaint || UpdateEmailTemplate || AddContent || AddRuleComponent || AddNPromocode)
            ? <img className='custom-go-back mr-2' height='22' onClick={() => navigate(`${cancelLink}`)} src={backIcon} width='22' />
            : ''}

          <h2 className='setting-heading'>
            {heading}
            {props?.info && (
            <Fragment>
              <img className='custom-info' id='info' src={infoIcon} />
              <UncontrolledTooltip className="bg-default-s" delay={0} placement="right-center" target="info">
                <p>
                  After updating anything from here, It will take some time to reflect on the app.
                </p>
              </UncontrolledTooltip>
            </Fragment>
            )}
          </h2>
        </div>
        <div className='btn-list-user'>
          {AddVersion && <Button className="theme-btn icon-btn-cancel" tag={Link} to={`/settings/versions${page?.VersionManagement || ''}`}>Cancel</Button>}
          {AddSport && <Button className="theme-btn icon-btn-cancel " tag={Link} to="/settings/sports">Cancel</Button>}
          {AddSlider && <Button className="theme-btn icon-btn-cancel " tag={Link} to={`/settings/slider-management${page?.SliderManagement || ''}`}>Cancel</Button>}
          {AddSetting && <Button className="theme-btn icon-btn-cancel " tag={Link} to={`/settings/setting-management${page?.SettingManagement || ''}`}>Cancel</Button>}
          {AddPromocode && <Button className="theme-btn icon-btn-cancel " tag={Link} to={`/settings/promocode-management${page?.PromoCodeManagement || ''}`}>Cancel</Button>}
          {AddPopUpAd && <Button className="theme-btn icon-btn-cancel " tag={Link} to={`/settings/popup-ads-management${page?.PopupAdsManagement || ''}`}>Cancel</Button>}
          {UpdatePayout && <Button className="theme-btn icon-btn-cancel " tag={Link} to={`/settings/payout-management${page?.PayoutManagement || ''}`}>Cancel</Button>}
          {AddOffer && <Button className="theme-btn icon-btn-cancel " tag={Link} to={`/settings/offer-management${page?.OfferManagement || ''}`}>Cancel</Button>}
          {AddPayment && <Button className="theme-btn icon-btn-cancel " tag={Link} to={`/settings/payment-management${page?.PaymentManagement || ''}`}>Cancel</Button>}
          {UpdateNotification && <Button className="theme-btn icon-btn-cancel " tag={Link} to={`/settings/notification-management${page?.NotificationManagement || ''}`}>Cancel</Button>}
          {UpdateComplaint && <Button className="theme-btn icon-btn-cancel " tag={Link} to={`/settings/feedback-complaint-management${page?.FeedbackManagement || ''}`}>Cancel</Button>}
          {UpdateEmailTemplate && <Button className="theme-btn icon-btn-cancel " tag={Link} to="/settings/email-template">Cancel</Button>}
          {AddContent && <Button className="theme-btn icon-btn-cancel " tag={Link} to={`/settings/content-management${page?.ContentManagement || ''}`}>Cancel</Button>}
          {AddRuleComponent && <Button className="theme-btn icon-btn-cancel " tag={Link} to="/settings/common-rules">Cancel</Button>}
          {AddNPromocode && <Button className="theme-btn icon-btn-cancel " tag={Link} to={`/settings/promocode-management${page?.PromoCodeManagement || ''}`}>Cancel</Button>}

          {props?.onExport && list && (list?.total > 0 || list?.length >= 1 || list?.nTotal >= 1) && (
            <Button className="theme-btn icon-btn-export " onClick={props?.onExport}>
              <img alt='excel' src={exportIcon} />
              {props?.export}
            </Button>
          )}
          {maintenancePermission && (
            <Button className='icon-btn-maintenance' onClick={getMaintenanceModeFunc}>
              <img alt="maintenance" src={maintenance} title='Maintenance' />
              {props?.maintenance}
            </Button>
          )}

          {props?.refresh && (
            <Button className="theme-btn icon-btn-refresh refresh" onClick={props?.onRefresh}>
              {props?.refresh}
            </Button>
          )}
          {leadershipBoard && (
          <Button className="theme-btn icon-btn-refresh  refresh" onClick={calculateLeaderBoardData} >
            Refresh
          </Button>
          )}
          {props?.onExport && FormatsList && (FormatsList?.total > 0 || FormatsList?.length !== 0)
            ? (
              <Button className="theme-btn icon-btn-export" onClick={props?.onExport}>
                <img alt='excel' src={exportIcon} />
                {props?.export}
              </Button>
              )
            : ''}

          { AddRuleComponent &&
            ((Auth && Auth === 'SUPER') || (adminPermission?.RULE !== 'R')) &&
            (
              <Fragment>
                <Button className="theme-btn " disabled={submitDisableButton} onClick={onSubmit}>Save Changes</Button>
              </Fragment>
            )
          }
          {props?.onExport && AllReports
            ? (
              <Button className="theme-btn icon-btn-export " onClick={props?.onExport}>
                <img alt='excel' src={exportIcon} />
                {props?.export}
              </Button>
              )
            : ''}
          {AddContent && ((Auth && Auth === 'SUPER') || (adminPermission?.CMS !== 'R')) &&
            (
              <Fragment>
                <Button className="theme-btn" disabled={submitDisableButton} onClick={onSubmit}>{button}</Button>
              </Fragment>
            )
          }
          { UpdateComplaint && ((Auth && Auth === 'SUPER') || (adminPermission?.COMPLAINT !== 'R')) &&
            (
              <Fragment>
                <Button className="theme-btn" disabled={submitDisableButton} onClick={onEdit}>Save Changes</Button>
              </Fragment>
            )
          }
          { UpdateNotification && ((Auth && Auth === 'SUPER') || (adminPermission?.NOTFICATION !== 'R')) &&
            (
              <Fragment>
                <Button className="theme-btn " disabled={submitDisableButton} onClick={onSubmit} >Save Changes</Button>
              </Fragment>
            )
          }
          { AddOffer && ((Auth && Auth === 'SUPER') || (adminPermission?.OFFER !== 'R')) &&
            (
              <Fragment>
                <Button className="theme-btn " disabled={(!Title || !Details || !Description) || submitDisableButton} onClick={onSubmit}>{button}</Button>
              </Fragment>
            )
          }
          { AddPayment && ((Auth && Auth === 'SUPER') || (adminPermission?.PAYMENT_OPTION !== 'R')) &&
            (
              <Button className="theme-btn" disabled={submitDisableButton} onClick={onSubmit}>Save Changes</Button>
            )
          }
          { UpdatePayout && ((Auth && Auth === 'SUPER') || (adminPermission?.PAYOUT_OPTION !== 'R')) &&
            (
              <Button className="theme-btn " disabled={submitDisableButton} onClick={onSubmit}>Save Changes</Button>
            )
          }
          { AddPopUpAd && ((Auth && Auth === 'SUPER') || (adminPermission?.POPUP_ADS !== 'R')) &&
            (
              <Fragment>
                <Button className="theme-btn" disabled={submitDisableButton} onClick={onSubmit}>{button}</Button>
              </Fragment>
            )
          }
          { AddPromocode && ((Auth && Auth === 'SUPER') || (adminPermission?.PROMO !== 'R')) &&
            (
              <Fragment>
                <Button className="theme-btn" disabled={submitDisableButton} onClick={onAdd}>{button}</Button>
              </Fragment>
            )
          }
          { AddSetting && ((Auth && Auth === 'SUPER') || (adminPermission?.SETTING !== 'R')) &&
            (
              <Fragment>
                <Button className="theme-btn " disabled={submitDisableButton} onClick={(e) => (Key === 'BG' || Key === 'IMG') ? imageSubmit(Key) : Key === 'CURRENCY' ? updateCurrencyData() : onSubmit(e)}>
                  Save Changes
                </Button>
              </Fragment>
            )
          }
          { AddSlider && ((Auth && Auth === 'SUPER') || (adminPermission?.BANNER !== 'R')) &&
            (
              <Fragment>
                <Button className="theme-btn " disabled={submitDisableButton} onClick={onSubmit}>{button}</Button>
              </Fragment>
            )
          }
          { AddSport && ((Auth && Auth === 'SUPER') || (adminPermission?.SPORT !== 'R')) &&
            (
              <Fragment>
                <Button className="theme-btn " disabled={submitDisableButton} onClick={onSubmit}>Save Changes</Button>
              </Fragment>
            )
          }
          {AddVersion && ((Auth && Auth === 'SUPER') || (adminPermission?.VERSION !== 'R')) && (
          <Fragment>
            <Button className='theme-btn' disabled={submitDisableButton} onClick={onSubmit}>{conditionUrl ? ' Save Changes' : 'Add Version'}</Button>
          </Fragment>
          )}
          { UpdateEmailTemplate && ((Auth && Auth === 'SUPER') || (adminPermission?.EMAIL_TEMPLATES !== 'R')) &&
            (
              <Fragment>
                <Button className="theme-btn " disabled={submitDisableButton} onClick={onSubmit}>Save Changes</Button>
              </Fragment>
            )
          }
          { AddNPromocode && ((Auth && Auth === 'SUPER') || (adminPermission?.PROMO !== 'R')) &&
            (
              <Fragment>
                <Button className="theme-btn" disabled={submitDisableButton} onClick={onAdd}>{button}</Button>
              </Fragment>
            )
          }
        </div>
      </div>
    </div>

  )
}
MainHeading.propTypes = {
  promocodeStatistics: PropTypes.any,
  automatedNotification: PropTypes.bool,
  sliderStatistics: PropTypes.bool,
  heading: PropTypes.string,
  info: PropTypes.bool,
  onExport: PropTypes.func,
  list: PropTypes.arrayOf(PropTypes.object),
  refresh: PropTypes.string,
  onRefresh: PropTypes.func,
  maintenancePermission: PropTypes.bool,
  FormatsList: PropTypes.object,
  getMaintenanceModeFunc: PropTypes.func,
  export: PropTypes.string,
  leadershipBoard: PropTypes.bool,
  calculateLeaderBoardData: PropTypes.func,
  maintenance: PropTypes.string,
  cancelLink: PropTypes.string,
  AddVersion: PropTypes.bool,
  AddSport: PropTypes.bool,
  AddSlider: PropTypes.bool,
  AddSetting: PropTypes.bool,
  AddPromocode: PropTypes.bool,
  AddPopUpAd: PropTypes.bool,
  UpdatePayout: PropTypes.bool,
  AddPayment: PropTypes.bool,
  AddOffer: PropTypes.bool,
  UpdateNotification: PropTypes.bool,
  UpdateComplaint: PropTypes.bool,
  UpdateEmailTemplate: PropTypes.bool,
  AddContent: PropTypes.bool,
  AddRuleComponent: PropTypes.bool,
  Auth: PropTypes.string,
  adminPermission: PropTypes.string,
  onSubmit: PropTypes.func,
  submitDisableButton: PropTypes.bool,
  button: PropTypes.string,
  onEdit: PropTypes.func,
  Title: PropTypes.string,
  Description: PropTypes.string,
  Details: PropTypes.string,
  onAdd: PropTypes.func,
  updateCurrencyData: PropTypes.func,
  imageSubmit: PropTypes.func,
  Key: PropTypes.string,
  conditionUrl: PropTypes.string,
  AllReports: PropTypes.bool,
  AddNPromocode: PropTypes.bool

}

export default MainHeading
