import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import PublicRoutes from './PublicRoutes'
import PrivateRoutes from './PrivateRoutes'

import Login from '../views/Auth/Login/index'
import ForgotPassword from '../views/Auth/ForgotPassword/index'
import ResetPassword from '../views/Auth/ResetPassword/index'
import ChangePassword from '../views/Account/ChangePassword/index'
import Dashboard from '../views/Dashboard/index'
import NotFound from '../components/NotFound'

// Settings pages
import AllReports from '../views/Reports'
import OfferManagement from '../views/Settings/OfferManagement/index'
import AddOffer from '../views/Settings/OfferManagement/AddOffer/index'
import ContentManagement from '../views/Settings/ContentManagement/index'
import AddContent from '../views/Settings/ContentManagement/AddContent/index'
import PromocodeManagement from '../views/Settings/PromocodeManagement/index'
import AddPromocode from '../views/Settings/PromocodeManagement/AddPromocode/index'
import AddNPromocode from '../views/Settings/PromocodeManagement/AddNPromocode/index'
import PromocodeStatistics from '../views/Settings/PromocodeManagement/PromocodeStatistics'
import SliderManagement from '../views/Settings/SliderManagement/index'
import AddSlider from '../views/Settings/SliderManagement/AddSlider/index'
import SliderStatistics from '../views/Settings/SliderManagement/SliderStatistics'
import SettingManagement from '../views/Settings/SettingManagement/index'
import AddSetting from '../views/Settings/SettingManagement/AddSetting/index'
import PaymentManagement from '../views/Settings/PaymentManagement/index'
import AddPayment from '../views/Settings/PaymentManagement/AddPayment/index'
import Payout from '../views/Settings/PayoutManagement'
import UpdatePayout from '../views/Settings/PayoutManagement/UpdatePayout'
import CommonRules from '../views/Settings/CommonRules/index'
import AddCommonRules from '../views/Settings/CommonRules/AddCommonRules/index'
import PointSystem from '../views/Sports/PointSystem/index'
import UpdatePointSystem from '../views/Sports/PointSystem/updatePoint/index'
import NotificationManagement from '../views/Settings/NotificationManagement/index'
import UpdateNotificationIndex from '../views/Settings/NotificationManagement/UpdateNotification'
import Sports from '../views/Settings/Sports/index'
import AddSport from '../views/Settings/Sports/AddSport/index'
import EmailTemplateList from '../views/Settings/EmailTemplate'
import UpdateEmailTemplate from '../views/Settings/EmailTemplate/UpdateEmailTemplate'
import PopupAdsManagement from '../views/Settings/PopUpAds/index'
import AddPopupAd from '../views/Settings/PopUpAds/AddPopUpAd'
import LeaderBoardComponent from '../views/Settings/LeaderShipBoard'
import FeedbackManagement from '../views/Settings/FeedbackManagement'
import UpdateComplain from '../views/Settings/FeedbackManagement/UpdateComplaint'
import Versions from '../views/Settings/Versions'
import AddVersionIndex from '../views/Settings/Versions/AddVersion'
import ValidationManagement from '../views/Settings/Validations/index'
import AddValidation from '../views/Settings/Validations/AddValidation/index'

// Users pages
import UserManagement from '../views/Users/UserManagement/index'
import UserDetails from '../views/Users/UserManagement/UserDetails'
import ReferralIndex from '../views/Users/UserManagement/UserDetails/User Referrals'
import UserDebugging from '../views/Users/UserManagement/UserDebugging'
import SystemUsers from '../views/Users/SystemUser'
import SystemUserDetails from '../views/Users/SystemUser/SystemUserDetails'
import SystemUserDebugging from '../views/Users/SystemUser/SystemUserDebugger'
import KYCVerification from '../views/Users/KYCVerification/index'
import PassbookManagement from '../views/Users/PassbookManagement/index'
import DepositManagement from '../views/Users/DepositManagement/index'
import PushNotification from '../views/Users/PushNotification/index'
import IndexAutomatedNotification from '../views/Users/PushNotification/AutomatedNotification/index'
import IndexUpdatePushNotification from '../views/Users/PushNotification/UpdatePushNotification'
import UserKYCverification from '../views/Users/KYCVerification/UserKycRequest/index'
import TDS from '../views/Users/TDS'

// Sports pages
import IndexMatchManagement from '../views/Sports/MatchManagement/index'
import IndexAddMatch from '../views/Sports/MatchManagement/AddMatch/index'
import MatchReport from '../views/Sports/MatchManagement/Reports/index'
import IndexMatchLeagueManagement from '../views/Sports/MatchLeagueManagement/index'
import MergeMatchIndex from '../views/Sports/MatchManagement/MergeMatch'
import IndexExtraWinList from '../views/Sports/MatchLeagueManagement/ExtraWinList'
import IndexAddMatchLeague from '../views/Sports/MatchLeagueManagement/AddMatchLeague/index'
import UserLeague from '../views/Sports/MatchLeagueManagement/UserLeague/UserLeague'
import SystemTeamIndex from '../views/Sports/MatchLeagueManagement/SystemTeamsMatchPlayers'
import IndexMatchPlayerManagement from '../views/Sports/MatchPlayerManagement/index'
import SystemBotLogsPage from '../views/Sports/MatchLeagueManagement/SystemBotLogs'
import IndexUpdateMatchPlayer from '../views/Sports/MatchPlayerManagement/UpdateMatchPlayer/index'
import IndexPlayerManagement from '../views/Sports/PlayerManagement/index'
import IndexAddPlayer from '../views/Sports/PlayerManagement/AddPlayer/index'
import IndexTeamManagement from '../views/Sports/TeamManagement/index'
import IndexAddTeam from '../views/Sports/TeamManagement/AddTeam/index'
import IndexPlayerRole from '../views/Sports/PlayerRole/index'
import IndexAddPlayerRole from '../views/Sports/PlayerRole/AddPlayerRole/index'
import MatchPlayerScorePoint from '../views/Sports/MatchPlayerManagement/ScorePointManagement/MatchScorePoint'
import UserJoinLeague from '../views/Sports/MatchLeagueManagement/UserJoinLeague'
import UserTeam from '../views/Sports/MatchLeagueManagement/UserTeam'
import UserTeamPlayerManagement from '../views/Sports/MatchLeagueManagement/UserTeamPlayer/UserTeamPlayerManagement'
import MatchLeagueCashback from '../views/Sports/MatchLeagueManagement/MatchLeagueCashback'
import SeasonManagement from '../views/Sports/SeasonManagement'
import UserListManagement from '../views/Sports/SeasonManagement/UserList'
import IndexAppViewMatch from '../views/Sports/MatchManagement/AppLikeView'
import PromoUsage from '../views/Sports/MatchLeagueManagement/MatchLeaguePromoUsage'
import IndexBaseTeam from '../views/Sports/MatchManagement/BaseTeam'

// League pages
import League from '../views/Leagues/index'
import AddLeagueCategory from '../views/Leagues/AddLeagueCategory/index'
import AddFilterCategory from '../views/Leagues/AddFilterCategory/index'
import LeagueCategoryList from '../views/Leagues/LeagueCategory/index'
import FilterCategoryList from '../views/Leagues/FilterCategory/index'
import LeaguePrize from '../views/Leagues/LeaguePrize/index'
import AddLeague from '../views/Leagues/AddLeague/index'
import AddLeaguePriceBreakup from '../views/Leagues/AddLeaguePrizeBreakup/index'

// Series leader board pages
import CategoryTemplate from '../views/SeriesLeaderBoard/CategoryTemplate/index'
import AddCategoryTemplate from '../views/SeriesLeaderBoard/CategoryTemplate/AddCategoryTemplate/index'
import SeriesLeaderBoard from '../views/SeriesLeaderBoard/SeriesLeaderboard/index'
import AddSeriesLeaderBoard from '../views/SeriesLeaderBoard/SeriesLeaderboard/AddSeriesLeaderboard/index'
import SeriesLeaderBoardCategory from '../views/SeriesLeaderBoard/SeriesLeaderboardCategory/index'
import AddSeriesLeaderBoardCategory from '../views/SeriesLeaderBoard/SeriesLeaderboardCategory/AddSeriesLeaderboardCategory/index'
import SeriesLeaderBoardUserRank from '../views/SeriesLeaderBoard/SeriesLeaderboardCategory/LeaderBoard'
import SeriesLeaderBoardPriceBreakup from '../views/SeriesLeaderBoard/SeriesLeaderboardCategory/SeriesLBPriceBreakUpList'
import AddSeriesLBCategoryPriceBreakup from '../views/SeriesLeaderBoard/SeriesLeaderboardCategory/SeriesLBPriceBreakUpList/AddSeriesLBPriceBreakUp'

// Sub Admin pages
import AdminLogs from '../views/SubAdmin/AdminLogs'
import Roles from '../views/SubAdmin/Roles'
import IndexAddRole from '../views/SubAdmin/Roles/AddRole'
import Permission from '../views/SubAdmin/Permission/index'
import AddPermission from '../views/SubAdmin/AddPermission/index'
import SubAdmin from '../views/SubAdmin/index'
import AddSubAdmin from '../views/SubAdmin/AddSubAdmin/index'
import SingleLog from '../views/SubAdmin/AdminLogs/SingleLogDetails'
import MatchApiLogs from '../views/SubAdmin/MatchApiLogs/index'
import IndexBaseTeams from '../views/Sports/MatchManagement/BaseTeamList'
import IndexUserCopyTeams from '../views/Sports/MatchLeagueManagement/UserCopyTeams'
import TransactionReportIndex from '../views/Users/PassbookManagement/TransactionReport'
import DroppedUser from '../views/Users/DroppedUsers'

const RoutesComponent = () => (
  <Routes>

    { /* Routes */ }

    <Route element={<PublicRoutes><Login /></PublicRoutes>} exact path='/auth/login'/>
    <Route element={<PublicRoutes><ForgotPassword /></PublicRoutes>} exact path='/auth/forgot-password'/>
    <Route element={<PublicRoutes><ResetPassword /></PublicRoutes>} exact path='/auth/reset-password/:token'/>
    <Route element={<PrivateRoutes><ChangePassword /></PrivateRoutes>} exact path='/account/change-password'/>
    <Route element={<PrivateRoutes><Dashboard /></PrivateRoutes>} exact path='/dashboard'/>

    { /* Settings */ }
    <Route element={<PrivateRoutes><OfferManagement /></PrivateRoutes>} exact path='/settings/offer-management'/>
    <Route element={<PrivateRoutes><PromocodeManagement /></PrivateRoutes>} exact path='/settings/promocode-management'/>
    <Route element={<PrivateRoutes><ValidationManagement /></PrivateRoutes>} exact path='/settings/validation-management'/>
    <Route element={<PrivateRoutes><AddValidation /></PrivateRoutes>} exact path='/settings/add-validation'/>
    <Route element={<PrivateRoutes><AddValidation /></PrivateRoutes>} exact path='/settings/validation-details/:id'/>
    <Route element={<PrivateRoutes><AddOffer /></PrivateRoutes>} exact path='/settings/add-offer'/>
    <Route element={<PrivateRoutes><AddOffer /></PrivateRoutes>} exact path='/settings/offer-details/:id'/>
    <Route element={<PrivateRoutes><AddPromocode /></PrivateRoutes>} exact path='/settings/add-promocode'/>
    <Route element={<PrivateRoutes><AddNPromocode /></PrivateRoutes>} exact path='/settings/add-n-promocode'/>
    <Route element={<PrivateRoutes><AddPromocode /></PrivateRoutes>} exact path='/settings/promocode-details/:id'/>
    <Route element={<PrivateRoutes><PromocodeStatistics /></PrivateRoutes>} exact path='/settings/promocode-statistics/:id'/>
    <Route element={<PrivateRoutes><ContentManagement /></PrivateRoutes>} exact path='/settings/content-management'/>
    <Route element={<PrivateRoutes><AddContent /></PrivateRoutes>} exact path='/settings/add-content'/>
    <Route element={<PrivateRoutes><AddContent /></PrivateRoutes>} exact path='/settings/content-details/:slug'/>
    <Route element={<PrivateRoutes><SliderManagement /></PrivateRoutes>} exact path='/settings/slider-management'/>
    <Route element={<PrivateRoutes><SettingManagement /></PrivateRoutes>} exact path='/settings/setting-management'/>
    <Route element={<PrivateRoutes><PaymentManagement /></PrivateRoutes>} exact path='/settings/payment-management'/>
    <Route element={<PrivateRoutes><Payout /></PrivateRoutes>} exact path='/settings/payout-management'/>
    <Route element={<PrivateRoutes><UpdatePayout /></PrivateRoutes>} exact path='/settings/payout-details/:id'/>
    <Route element={<PrivateRoutes><AddSlider /></PrivateRoutes>} exact path='/settings/add-slider'/>
    <Route element={<PrivateRoutes><AddSetting /></PrivateRoutes>} exact path='/settings/add-setting'/>
    <Route element={<PrivateRoutes><AddPayment /></PrivateRoutes>} exact path='/settings/add-payment'/>
    <Route element={<PrivateRoutes><AddSlider /></PrivateRoutes>} exact path='/settings/slider-details/:id'/>
    <Route element={<PrivateRoutes><SliderStatistics /></PrivateRoutes>} exact path='/settings/slider-statistics/:id'/>
    <Route element={<PrivateRoutes><AddSetting /></PrivateRoutes>} exact path='/settings/setting-details/:id'/>
    <Route element={<PrivateRoutes><AddPayment /></PrivateRoutes>} exact path='/settings/payment-details/:id'/>
    <Route element={<PrivateRoutes><NotificationManagement /></PrivateRoutes>} exact path='/settings/notification-management'/>
    <Route element={<PrivateRoutes><UpdateNotificationIndex /></PrivateRoutes>} exact path='/settings/notification-details/:id'/>
    <Route element={<PrivateRoutes><Sports /></PrivateRoutes>} exact path='/settings/sports'/>
    <Route element={<PrivateRoutes><AddSport /></PrivateRoutes>} exact path='/settings/add-sport'/>
    <Route element={<PrivateRoutes><AddSport /></PrivateRoutes>} exact path='/settings/sport-details/:id'/>
    <Route element={<PrivateRoutes><Versions /></PrivateRoutes>} exact path='/settings/versions'/>
    <Route element={<PrivateRoutes><AddVersionIndex /></PrivateRoutes>} exact path='/settings/add-version'/>
    <Route element={<PrivateRoutes><AddVersionIndex /></PrivateRoutes>} exact path='/settings/version-details/:id'/>
    <Route element={<PrivateRoutes><EmailTemplateList /></PrivateRoutes>} exact path='/settings/email-template'/>
    <Route element={<PrivateRoutes><UpdateEmailTemplate /></PrivateRoutes>} exact path='/settings/template-details/:slug'/>
    <Route element={<PrivateRoutes><CommonRules /></PrivateRoutes>} exact path='/settings/common-rules'/>
    <Route element={<PrivateRoutes><AddCommonRules /></PrivateRoutes>} exact path='/settings/common-rules-details/:id'/>
    <Route element={<PrivateRoutes><AddCommonRules /></PrivateRoutes>} exact path='/settings/add-common-rule'/>
    <Route element={<PrivateRoutes><PopupAdsManagement /></PrivateRoutes>} exact path='/settings/popup-ads-management'/>
    <Route element={<PrivateRoutes><AddPopupAd /></PrivateRoutes>} exact path='/settings/add-popup-ad'/>
    <Route element={<PrivateRoutes><AddPopupAd /></PrivateRoutes>} exact path='/settings/update-popup-ad/:id'/>
    <Route element={<PrivateRoutes><LeaderBoardComponent /></PrivateRoutes>} exact path='/settings/leader-board-management'/>
    <Route element={<PrivateRoutes><FeedbackManagement /></PrivateRoutes>} exact path='/settings/feedback-complaint-management'/>
    <Route element={<PrivateRoutes><UpdateComplain /></PrivateRoutes>} exact path='/settings/update-complaint-status/:id'/>

    { /* Users */ }
    <Route element={<PrivateRoutes><UserManagement /></PrivateRoutes>} exact path='/users/user-management'/>
    <Route element={<PrivateRoutes><DroppedUser/></PrivateRoutes>} exact path='/users/dropped-users'/>
    <Route element={<PrivateRoutes><UserManagement /></PrivateRoutes>} exact path='/users/deleted-users'/>
    <Route element={<PrivateRoutes><UserDetails /></PrivateRoutes>} exact path='/users/user-management/user-details/:id'/>
    <Route element={<PrivateRoutes><ReferralIndex /></PrivateRoutes>} exact path='/users/user-referred-list/:id'/>
    <Route element={<PrivateRoutes><UserDebugging /></PrivateRoutes>} exact path='/users/user-management/user-debugger-page/:id'/>
    <Route element={<PrivateRoutes><SystemUsers /></PrivateRoutes>} exact path='/users/system-users'/>
    <Route element={<PrivateRoutes><SystemUserDetails /></PrivateRoutes>} exact path='/users/system-user/system-user-details/:id'/>
    <Route element={<PrivateRoutes><SystemUserDebugging /></PrivateRoutes>} exact path='/users/system-user/system-user-debugger-page/:id'/>
    <Route element={<PrivateRoutes><PassbookManagement /></PrivateRoutes>} exact path='/users/passbook'/>
    <Route element={<PrivateRoutes><PassbookManagement /></PrivateRoutes>} exact path='/users/passbook/:id'/>
    <Route element={<PrivateRoutes><TransactionReportIndex /></PrivateRoutes>} exact path='/users/transaction-report'/>
    {/* <Route element={<PrivateRoutes><WithdrawManagement /></PrivateRoutes>} exact path='/users/withdraw-management'/> */}
    <Route element={<PrivateRoutes><DepositManagement /></PrivateRoutes>} exact path='/users/deposit-management'/>
    <Route element={<PrivateRoutes><KYCVerification /></PrivateRoutes>} exact path='/users/kyc-verification'/>
    <Route element={<PrivateRoutes><UserKYCverification /></PrivateRoutes>} exact path='/users/kyc-verification'/>
    <Route element={<PrivateRoutes><PushNotification /></PrivateRoutes>} exact path='/users/push-notification'/>
    <Route element={<PrivateRoutes><IndexAutomatedNotification /></PrivateRoutes>} exact path='/users/push-notification/automated-notification'/>
    <Route element={<PrivateRoutes><IndexUpdatePushNotification /></PrivateRoutes>} exact path='/users/push-notification-details/:id'/>
    <Route element={<PrivateRoutes><TDS /></PrivateRoutes>} exact path='/users/tds-management'/>
    <Route element={<PrivateRoutes><TDS /></PrivateRoutes>} exact path='/users/tds-management/:id'/>

    {/* Sports */}
    <Route element={<PrivateRoutes><IndexMatchManagement /></PrivateRoutes>} exact path='/:sportstype/match-management'/>
    <Route element={<PrivateRoutes><IndexAppViewMatch /></PrivateRoutes>} exact path='/:sportstype/matches-app-view'/>
    <Route element={<PrivateRoutes><IndexAddMatch /></PrivateRoutes>} exact path='/:sportstype/match-management/add-match'/>
    <Route element={<PrivateRoutes><IndexAddMatch /></PrivateRoutes>} exact path='/:sportstype/match-management/view-match/:id'/>
    <Route element={<PrivateRoutes><MergeMatchIndex /></PrivateRoutes>} exact path='/:sportstype/match-management/merge-match/:id'/>
    <Route element={<PrivateRoutes><IndexExtraWinList /></PrivateRoutes>} exact path='/:sportstype/match-management/extra-win-list/:id'/>
    <Route element={<PrivateRoutes><IndexMatchLeagueManagement /></PrivateRoutes>} exact path='/:sportstype/match-management/match-league-management/:id'/>
    <Route element={<PrivateRoutes><IndexBaseTeams /></PrivateRoutes>} exact path='/:sportstype/match-management/base-teams/:matchid'/>
    <Route element={<PrivateRoutes><SystemTeamIndex /></PrivateRoutes>} exact path='/:sportstype/match-management/match-league-management/system-team-match-players/:id1/:id2'/>
    <Route element={<PrivateRoutes><SystemTeamIndex /></PrivateRoutes>} exact path='/:sportstype/match-management/edit-combination-bot-teams/:id1'/>
    <Route element={<PrivateRoutes><IndexAddMatchLeague /></PrivateRoutes>} exact path='/:sportstype/match-management/match-league-management/add-match-league/:id1'/>
    <Route element={<PrivateRoutes><UserTeamPlayerManagement /></PrivateRoutes>} exact path='/:sportstype/match-management/match-league-management/user-league/user-team/user-team-player/:id1/:id2'/>
    <Route element={<PrivateRoutes><IndexMatchPlayerManagement /></PrivateRoutes>} exact path='/:sportstype/match-management/match-player-management/:id'/>
    <Route element={<PrivateRoutes><IndexUpdateMatchPlayer /></PrivateRoutes>} exact path='/:sportstype/match-management/match-player-management/add-match-player/:id1'/>
    <Route element={<PrivateRoutes><MatchReport /></PrivateRoutes>} exact path='/:sportstype/match-management/match-report/:id'/>
    <Route element={<PrivateRoutes><SeasonManagement /></PrivateRoutes>} exact path='/:sportstype/season-management'/>
    <Route element={<PrivateRoutes><UserListManagement /></PrivateRoutes>} exact path='/:sportstype/season-management/users-list/:id'/>
    <Route element={<PrivateRoutes><IndexPlayerManagement /></PrivateRoutes>} exact path='/:sportstype/player-management'/>
    <Route element={<PrivateRoutes><IndexAddPlayer /></PrivateRoutes>} exact path='/:sportstype/player-management/add-player'/>
    <Route element={<PrivateRoutes><IndexAddPlayer /></PrivateRoutes>} exact path='/:sportstype/player-management/update-player/:id'/>
    <Route element={<PrivateRoutes><IndexTeamManagement /></PrivateRoutes>} exact path='/:sportstype/team-management'/>
    <Route element={<PrivateRoutes><IndexAddTeam /></PrivateRoutes>} exact path='/:sportstype/team-management/add-team'/>
    <Route element={<PrivateRoutes><IndexAddTeam /></PrivateRoutes>} exact path='/:sportstype/team-management/update-team/:id'/>
    <Route element={<PrivateRoutes><IndexPlayerRole /></PrivateRoutes>} exact path='/:sportstype/player-role-management'/>
    <Route element={<PrivateRoutes><IndexAddPlayerRole /></PrivateRoutes>} exact path='/:sportstype/player-role-management/add-player-role'/>
    <Route element={<PrivateRoutes><IndexAddPlayerRole /></PrivateRoutes>} exact path='/:sportstype/player-role-management/update-player-role/:id'/>
    <Route element={<PrivateRoutes><IndexUpdateMatchPlayer /></PrivateRoutes>} exact path='/:sportstype/match-management/match-player-management/update-match-player/:id1/:id2'/>
    <Route element={<PrivateRoutes><MatchPlayerScorePoint /></PrivateRoutes>} exact path='/:sportstype/match-management/match-player-management/score-points/:id1'/>
    <Route element={<PrivateRoutes><MatchPlayerScorePoint /></PrivateRoutes>} exact path='/:sportstype/match-management/match-player-management/score-points/:id1/:id2'/>
    <Route element={<PrivateRoutes><UserLeague /></PrivateRoutes>} exact path='/:sportstype/match-management/match-league-management/user-league/:id1/:id2'/>
    <Route element={<PrivateRoutes><IndexUserCopyTeams /></PrivateRoutes>} exact path='/:sportstype/match-management/match-league-management/user-league/user-copy-teams/:matchid/:matchleagueid/:userteamid'/>
    <Route element={<PrivateRoutes><SystemBotLogsPage /></PrivateRoutes>} exact path='/:sportstype/match-management/match-league-management/system-bot-logs/:id1/:id2'/>
    <Route element={<PrivateRoutes><SystemBotLogsPage /></PrivateRoutes>} exact path='/:sportstype/match-management/match-league-management/system-bot-logs/:id1/:id2/copy-bot-logs'/>
    <Route element={<PrivateRoutes><UserTeam /></PrivateRoutes>} exact path='/:sportstype/match-management/match-league-management/user-league/user-teams/:id1/:id2/:id3'/>
    <Route element={<PrivateRoutes><UserJoinLeague /></PrivateRoutes>} exact path='/:sportstype/match-management/match-league-management/user-league/user-leagues/:id1/:id2/:id3'/>
    <Route element={<PrivateRoutes><MatchLeagueCashback /></PrivateRoutes>} exact path='/:sportstype/match-management/match-league-management/match-league-cashback-list/:id1/:id2'/>
    <Route element={<PrivateRoutes><PromoUsage /></PrivateRoutes>} exact path='/:sportstype/match-management/match-league-management/match-league-promo-usage-list/:id1/:id2'/>
    <Route element={<PrivateRoutes><IndexBaseTeam /></PrivateRoutes>} exact path='/:sportstype/base-team/:matchid'/>
    <Route element={<PrivateRoutes><IndexBaseTeam /></PrivateRoutes>} exact path='/:sportstype/base-team/:matchid/:id'/>
    <Route element={<PrivateRoutes><PointSystem /></PrivateRoutes>} exact path='/:sportstype/point-system'/>
    <Route element={<PrivateRoutes><UpdatePointSystem /></PrivateRoutes>} exact path='/:sportstype/point-system/:id'/>
    <Route element={<PrivateRoutes><UpdatePointSystem /></PrivateRoutes>} exact path='/:sportstype/point-system/:id/:id1'/>
    id
    { /* League */ }
    <Route element={<PrivateRoutes><League /></PrivateRoutes>} exact path='/league'/>
    <Route element={<PrivateRoutes><LeaguePrize /></PrivateRoutes>} exact path='/league/league-Prize/:id'/>
    <Route element={<PrivateRoutes><AddLeague /></PrivateRoutes>} exact path='/league/add-league'/>
    <Route element={<PrivateRoutes><AddLeagueCategory /></PrivateRoutes>} exact path='/league/add-league-category'/>
    <Route element={<PrivateRoutes><AddLeagueCategory /></PrivateRoutes>} exact path='/league/update-league-category/:id'/>
    <Route element={<PrivateRoutes><AddFilterCategory /></PrivateRoutes>} exact path='/league/add-filter-category'/>
    <Route element={<PrivateRoutes><AddFilterCategory /></PrivateRoutes>} exact path='/league/filter-league-category/:id'/>
    <Route element={<PrivateRoutes><LeagueCategoryList /></PrivateRoutes>} exact path='/league/league-category-list'/>
    <Route element={<PrivateRoutes><FilterCategoryList /></PrivateRoutes>} exact path='/league/filter-category-list'/>
    <Route element={<PrivateRoutes><AddLeague /></PrivateRoutes>} exact path='/league/update-league/:id'/>
    <Route element={<PrivateRoutes><AddLeaguePriceBreakup /></PrivateRoutes>} exact path='/league/add-League-Price-Breakup/:id1'/>
    <Route element={<PrivateRoutes><AddLeaguePriceBreakup /></PrivateRoutes>} exact path='/league/update-League-Price-Breakup/:id1/:id2'/>

    { /* Series leader board */ }
    <Route element={<PrivateRoutes><CategoryTemplate /></PrivateRoutes>} exact path='/category-template'/>
    <Route element={<PrivateRoutes><AddCategoryTemplate /></PrivateRoutes>} exact path='/category-template/add-template'/>
    <Route element={<PrivateRoutes><AddCategoryTemplate /></PrivateRoutes>} exact path='/category-template/edit-template/:id'/>
    <Route element={<PrivateRoutes><SeriesLeaderBoard /></PrivateRoutes>} exact path='/seriesLeaderBoard'/>
    <Route element={<PrivateRoutes><AddSeriesLeaderBoard /></PrivateRoutes>} exact path='/seriesLeaderBoard/add-SeriesLeaderBoard'/>
    <Route element={<PrivateRoutes><AddSeriesLeaderBoard /></PrivateRoutes>} exact path='/seriesLeaderBoard/edit-SeriesLeaderBoard/:id'/>
    <Route element={<PrivateRoutes><SeriesLeaderBoardCategory /></PrivateRoutes>} exact path='/seriesLeaderBoardCategory/:id'/>
    <Route element={<PrivateRoutes><AddSeriesLeaderBoardCategory /></PrivateRoutes>} exact path='/seriesLeaderBoardCategory/add-SeriesLeaderBoardCategory/:id'/>
    <Route element={<PrivateRoutes><AddSeriesLeaderBoardCategory /></PrivateRoutes>} exact path='/seriesLeaderBoardCategory/edit-SeriesLeaderBoardCategory/:id/:id2'/>
    <Route element={<PrivateRoutes><SeriesLeaderBoardPriceBreakup /></PrivateRoutes>} exact path='/seriesLeaderBoardCategory/seriesLBpricebreakup-list/:id/:id2'/>
    <Route element={<PrivateRoutes><AddSeriesLBCategoryPriceBreakup /></PrivateRoutes>} exact path='/seriesLeaderBoardCategory/seriesLBpricebreakup-list/add-seriesLBpricebreakup/:id/:id2'/>
    <Route element={<PrivateRoutes><AddSeriesLBCategoryPriceBreakup /></PrivateRoutes>} exact path='/seriesLeaderBoardCategory/seriesLBpricebreakup-list/update-seriesLBpricebreakup/:id/:id2/:id3'/>
    <Route element={<PrivateRoutes><SeriesLeaderBoardUserRank /></PrivateRoutes>} exact path='/seriesLeaderBoardCategory/seriesLeaderBoardUserRanks/:id/:id2'/>

    { /* Sub admin */ }
    <Route element={<PrivateRoutes><SubAdmin /></PrivateRoutes>} exact path='/sub-admin'/>
    <Route element={<PrivateRoutes><AddSubAdmin /></PrivateRoutes>} exact path='/sub-admin/add-sub-admin'/>
    <Route element={<PrivateRoutes><AddSubAdmin /></PrivateRoutes>} exact path='/sub-admin/edit-sub-admin/:id'/>
    <Route element={<PrivateRoutes><Permission /></PrivateRoutes>} exact path='/sub-admin/permission'/>
    <Route element={<PrivateRoutes><AddPermission /></PrivateRoutes>} exact path='/sub-admin/add-permission'/>
    <Route element={<PrivateRoutes><AddPermission /></PrivateRoutes>} exact path='/sub-admin/edit-permission/:id'/>
    <Route element={<PrivateRoutes><Roles /></PrivateRoutes>} exact path='/sub-admin/roles'/>
    <Route element={<PrivateRoutes><IndexAddRole /></PrivateRoutes>} exact path='/sub-admin/add-role'/>
    <Route element={<PrivateRoutes><IndexAddRole /></PrivateRoutes>} exact path='/sub-admin/update-role/:id'/>
    <Route element={<PrivateRoutes><AdminLogs /></PrivateRoutes>} exact path='/admin-logs'/>
    <Route element={<PrivateRoutes><SingleLog /></PrivateRoutes>} exact path='/admin-logs/single-log-details/:id'/>
    <Route element={<PrivateRoutes><AdminLogs /></PrivateRoutes>} exact path='/admin-logs/:id'/>
    <Route element={<PrivateRoutes><AdminLogs /></PrivateRoutes>} exact path='/admin-logs/logs/:leagueid'/>
    <Route element={<PrivateRoutes><MatchApiLogs /></PrivateRoutes>} exact path='/admin-logs/:id/matchapi-logs'/>
    <Route element={<PrivateRoutes><AllReports /></PrivateRoutes>} exact path='/reports/all-reports'/>

    <Route element={<PrivateRoutes><Dashboard /></PrivateRoutes>} exact path='/'/>
    <Route element={ <Navigate to='/auth/login' /> } path='/auth' />
    <Route element={<PrivateRoutes><NotFound /></PrivateRoutes>} />
  </Routes>
)

export default RoutesComponent
