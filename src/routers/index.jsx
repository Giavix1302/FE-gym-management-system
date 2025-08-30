import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import PrivateRoute from "./PrivateRoute"
import NotFoundPage from "~/pages/NotFoundPage"

import DefaultLayout from "~/layouts/defaultLayout"
import Home from "~/pages/homeUnsigned/Home"

// auth layout
import AuthLayout from "~/layouts/AuthLayout"
import Login from "~/pages/auth/Login"
import Signup from "~/pages/auth/Signup"

import HomeUserSigned from "~/pages/user/HomeUserSigned"
// admin layout
import AdminLayout from "~/layouts/AdminLayout"
import AdminHomePage from "~/pages/admin/AdminHomePage"
import AdminUserPage from "~/pages/admin/AdminUserPage"
import AdminTrainerPage from "~/pages/admin/AdminTrainerPage"
import AdminClassPage from "~/pages/admin/AdminClassPage"
import AdminEquipmentPage from "~/pages/admin/AdminEquipmentPage"
import AdminPaymentPage from "~/pages/admin/AdminPaymentPage"
import AdminReportMemberPage from "~/pages/admin/report/AdminReportUserPage"
import AdminMembershipPage from "~/pages/admin/AdminMembershipPage"

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* home unsigned */}
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<Home />} />
        </Route>

        {/* User Private Routes */}
        <Route element={<PrivateRoute roles={["user", "pt"]} />}>
          <Route element={<DefaultLayout />}>
            <Route path="/user/home" element={<HomeUserSigned />} />
          </Route>
        </Route>

        {/* <Route element={<DefaultLayout />}>
          <Route path="/user/home" element={<HomeUserSigned />} />
        </Route> */}

        {/* Admin Private Routes */}
        <Route element={<PrivateRoute roles={["admin"]} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminHomePage />} />
            <Route path="/admin/user" element={<AdminUserPage />} />
            <Route path="/admin/pt" element={<AdminTrainerPage />} />
            <Route path="/admin/membership" element={<AdminMembershipPage />} />
            <Route path="/admin/class" element={<AdminClassPage />} />
            <Route path="/admin/equipment" element={<AdminEquipmentPage />} />
            <Route path="/admin/payment" element={<AdminPaymentPage />} />
            <Route path="/admin/report/user" element={<AdminReportMemberPage />} />
          </Route>
        </Route>

        {/* <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminHomePage />} />
          <Route path="/admin/user" element={<AdminUserPage />} />
          <Route path="/admin/pt" element={<AdminTrainerPage />} />
          <Route path="/admin/membership" element={<AdminMembershipPage />} />
          <Route path="/admin/class" element={<AdminClassPage />} />
          <Route path="/admin/equipment" element={<AdminEquipmentPage />} />
          <Route path="/admin/payment" element={<AdminPaymentPage />} />
          <Route path="/admin/report/user" element={<AdminReportMemberPage />} />
        </Route> */}

        {/* 404 Not Found */}

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  )
}
