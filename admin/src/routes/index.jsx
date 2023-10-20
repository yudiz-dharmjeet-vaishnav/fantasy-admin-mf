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
// import AllReports from '../views/Reports'
import FeedbackManagement from '../views/Settings/FeedbackManagement'
import UpdateComplain from '../views/Settings/FeedbackManagement/UpdateComplaint'

// Sub Admin pages
import AdminLogs from '../views/SubAdmin/AdminLogs'
import Roles from '../views/SubAdmin/Roles'
import IndexAddRole from '../views/SubAdmin/Roles/AddRole'
import Permission from '../views/SubAdmin/Permission/index'
import AddPermission from '../views/SubAdmin/AddPermission/index'
import SubAdmin from '../views/SubAdmin/index'
import AddSubAdmin from '../views/SubAdmin/AddSubAdmin/index'
import SingleLog from '../views/SubAdmin/AdminLogs/SingleLogDetails'
// import MatchApiLogs from '../views/SubAdmin/MatchApiLogs/index'

const RoutesComponent = () => (
  <Routes>

    { /* Routes */ }
    <Route element={<PublicRoutes><Login /></PublicRoutes>} exact path='/auth/login'/>
    <Route element={<PublicRoutes><ForgotPassword /></PublicRoutes>} exact path='/auth/forgot-password'/>
    <Route element={<PublicRoutes><ResetPassword /></PublicRoutes>} exact path='/auth/reset-password/:token'/>
    <Route element={<PrivateRoutes><ChangePassword /></PrivateRoutes>} exact path='/account/change-password'/>
    <Route element={<PrivateRoutes><Dashboard /></PrivateRoutes>} exact path='/dashboard'/>

    { /* Settings */ }
    <Route element={<PrivateRoutes><FeedbackManagement /></PrivateRoutes>} exact path='/settings/feedback-complaint-management'/>
    <Route element={<PrivateRoutes><UpdateComplain /></PrivateRoutes>} exact path='/settings/update-complaint-status/:id'/>

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
    {/* <Route element={<PrivateRoutes><MatchApiLogs /></PrivateRoutes>} exact path='/admin-logs/:id/matchapi-logs'/> */}
    {/* <Route element={<PrivateRoutes><AllReports /></PrivateRoutes>} exact path='/reports/all-reports'/> */}

    <Route element={<PrivateRoutes><Dashboard /></PrivateRoutes>} exact path='/'/>
    <Route element={ <Navigate to='/auth/login' /> } path='/auth' />
    <Route element={<PrivateRoutes><NotFound /></PrivateRoutes>} />
  </Routes>
)

export default RoutesComponent
