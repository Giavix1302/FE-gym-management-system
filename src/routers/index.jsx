import { useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode"
import { Box, CircularProgress } from "@mui/material"

import { Routes, Route, useNavigate } from "react-router-dom"
import PrivateRoute from "./PrivateRoute"
import NotFoundPage from "~/pages/NotFoundPage"

import DefaultLayout from "~/layouts/DefaultLayout"
import Home from "~/pages/homeUnsigned/Home"

// auth layout
import AuthLayout from "~/layouts/AuthLayout"
import Login from "~/pages/auth/Login"
import Signup from "~/pages/auth/Signup"

// admin layout
import AdminLayout from "~/layouts/AdminLayout"
import AdminHomePage from "~/pages/admin/AdminHomePage"
import AdminUserPage from "~/pages/admin/AdminUserPage"
import AdminTrainerPage from "~/pages/admin/AdminTrainerPage"
import AdminClassPage from "~/pages/admin/AdminClassPage"
import AdminEquipmentPage from "~/pages/admin/AdminEquipmentPage"
import AdminPaymentPage from "~/pages/admin/AdminPaymentPage"
import AdminReportMemberPage from "~/pages/admin/report/AdminReportUserPage"
import AdminMembershipPage from "~/pages/admin/AdminMembership/AdminMembershipPage"
import UserLayout from "~/layouts/UserLayout"
import { getFromLocalStorage, saveToLocalStorage } from "~/utils/common"
import { axiosPublic } from "~/apis/axiosConfig"

// user layout
import UserHomePage from "~/pages/user/UserHomePage"
import UserMembershipPage from "~/pages/user/UserMembershipPage"

//
import { useLogout } from "~/hooks/useLogout"
import ResultPaymentPage from "~/pages/ResultPaymentPage"

export default function AppRoutes() {
  const logout = useLogout()

  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const checkToken = async () => {
      let token = getFromLocalStorage("accessToken")

      if (token) {
        const now = Date.now() / 1000
        const decoded = jwtDecode(token)

        if (decoded.exp && decoded.exp < now) {
          try {
            const res = await axiosPublic.post("/auths/refresh", {}, { withCredentials: true })
            token = res.data.accessToken
            saveToLocalStorage("accessToken", token)
            // eslint-disable-next-line no-unused-vars
          } catch (err) {
            logout()
            setLoading(false)
            return
          }
        }

        // 🚀 Chỉ điều hướng nếu chưa ở trong khu vực đúng role
        if (decoded.role === "admin" && !location.pathname.startsWith("/admin")) {
          navigate("/admin/dashboard")
        } else if (decoded.role === "user" && !location.pathname.startsWith("/user")) {
          navigate("/user/home")
        } else if (decoded.role === "pt" && !location.pathname.startsWith("/pt")) {
          navigate("/pt/home")
        }
      }

      setLoading(false)
    }

    checkToken()
  }, [location.pathname]) // depend vào pathname

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Routes>
      {/* home unsigned */}
      <Route element={<DefaultLayout />}>
        <Route path="/" element={<Home />} />
      </Route>

      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      {/* User Private Routes */}
      <Route element={<PrivateRoute roles={["user", "pt"]} />}>
        <Route element={<UserLayout />}>
          <Route path="/user/home" element={<UserHomePage />} />
          <Route path="/user/membership" element={<UserMembershipPage />} />
          <Route path="/user/payment/success" element={<ResultPaymentPage />} />
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

      {/* 404 Not Found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
