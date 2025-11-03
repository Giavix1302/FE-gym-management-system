import { Suspense, useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode"
import { Box, CircularProgress } from "@mui/material"

import { Routes, Route, useNavigate, useLocation } from "react-router-dom"
import PrivateRoute from "./PrivateRoute"
import NotFoundPage from "~/pages/NotFoundPage"

import DefaultLayout from "~/layouts/DefaultLayout"
import Home from "~/pages/homeUnsigned/Home"

// auth layout
import AuthLayout from "~/layouts/AuthLayout"
import Login from "~/pages/auth/Login"
import Signup from "~/pages/auth/Signup"

// admin layout
import AdminLayout from "~/layouts/AdminLayout/AdminLayout"
import AdminHomePage from "~/pages/admin/AdminHomePage"
import AdminUserPage from "~/pages/admin/AdminUserPage"
import AdminTrainerPage from "~/pages/admin/AdminTrainerPage"
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
import UserBookingPage from "~/pages/user/UserBooking/UserBookingPage"
import ClassEnrollmentPage from "~/pages/user/UserClass/UserClassPage"
import TrainerHomePage from "~/pages/trainer/TrainerHomePage"
import TrainerProfilePage from "~/pages/trainer/TrainerProfilePage"
import TrainerBookingPage from "~/pages/trainer/TrainerBooking/TrainerBookingPage"
import TrainerClassesPage from "~/pages/trainer/trainerClasses/TrainerClassesPage"
import UserCheckinPage from "~/pages/user/UserCheckinPage"
import StaffCheckinPage from "~/pages/staff/StaffCheckinPage"
import StaffUserPage from "~/pages/staff/StaffUserPage"
import StaffRoomPage from "~/pages/staff/StaffRoomPage"
import AdminLocationPage from "~/pages/admin/AdminLocationPage"
import StaffClassPage from "~/pages/staff/StaffClass/StaffClassPage"
import StaffTrainerPage from "~/pages/staff/StaffTrainerPage"
import StaffHomePage from "~/pages/staff/StaffHomePage"
import StaffEquipmentPage from "~/pages/staff/staffEquipment/StaffEquipmentPage"
import StaffLocationInfoPage from "~/pages/staff/StaffLocationInfoPage"
import AdminStaffPage from "~/pages/admin/AdminStaff/AdminStaffPage"
import AdminEquipmentPage from "~/pages/admin/adminEquipment/AdminEquipmentPage"

// ✅ Loading Component
const LoadingScreen = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#f5f5f5",
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999,
    }}
  >
    <CircularProgress size={40} />
  </Box>
)

export default function AppRoutes() {
  const logout = useLogout()
  const [initializing, setInitializing] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const initializeAuth = async () => {
      // ✅ Delay ngắn để tránh flash content
      await new Promise((resolve) => setTimeout(resolve, 100))

      let token = getFromLocalStorage("accessToken")

      if (token) {
        try {
          const now = Date.now() / 1000
          const decoded = jwtDecode(token)

          if (decoded.exp && decoded.exp < now) {
            try {
              const res = await axiosPublic.post("/auths/refresh", {}, { withCredentials: true })
              token = res.data.accessToken
              saveToLocalStorage("accessToken", token)
              const newDecoded = jwtDecode(token)
              handleRoleBasedRedirect(newDecoded)
            } catch (err) {
              logout()
            }
          } else {
            handleRoleBasedRedirect(decoded)
          }
        } catch (error) {
          logout()
        }
      }

      setInitializing(false)
    }

    const handleRoleBasedRedirect = (decoded) => {
      const currentPath = location.pathname

      const roleHomePaths = {
        admin: "/admin/dashboard",
        staff: "/staff/dashboard",
        user: "/user/home",
        pt: "/pt/home",
      }

      const rolePathPrefixes = {
        admin: "/admin",
        staff: "/staff",
        user: "/user",
        pt: "/pt",
      }

      const userRole = decoded.role
      const expectedPrefix = rolePathPrefixes[userRole]
      const homePath = roleHomePaths[userRole]

      if (currentPath === "/" || (expectedPrefix && !currentPath.startsWith(expectedPrefix))) {
        if (currentPath !== homePath) {
          // ✅ Sử dụng setTimeout để đảm bảo redirect xảy ra sau khi component đã mount
          setTimeout(() => {
            navigate(homePath, { replace: true })
          }, 0)
        }
      }
    }

    initializeAuth()
  }, [location.pathname, navigate, logout])

  // ✅ Hiển thị loading screen trong quá trình khởi tạo
  if (initializing) {
    return <LoadingScreen />
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
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
        <Route element={<PrivateRoute roles={["user"]} />}>
          <Route element={<UserLayout />}>
            <Route path="/user/home" element={<UserHomePage />} />
            <Route path="/user/membership" element={<UserMembershipPage />} />
            <Route path="/user/booking" element={<UserBookingPage />} />
            <Route path="/user/class" element={<ClassEnrollmentPage />} />
            <Route path="/user/payment/success" element={<ResultPaymentPage />} />
            <Route path="/user/checkin" element={<UserCheckinPage />} />
          </Route>
        </Route>

        {/* Trainer Private Routes */}
        <Route element={<PrivateRoute roles={["pt"]} />}>
          <Route element={<UserLayout />}>
            <Route path="/pt/home" element={<TrainerHomePage />} />
            <Route path="/pt/membership" element={<UserMembershipPage />} />
            <Route path="/pt/profile" element={<TrainerProfilePage />} />
            <Route path="/pt/booking" element={<TrainerBookingPage />} />
            <Route path="/pt/class" element={<TrainerClassesPage />} />
            <Route path="/pt/payment/success" element={<ResultPaymentPage />} />
            <Route path="/pt/checkin" element={<UserCheckinPage />} />
          </Route>
        </Route>

        {/* Admin Private Routes */}
        <Route element={<PrivateRoute roles={["admin"]} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminHomePage />} />
            <Route path="/admin/user" element={<AdminUserPage />} />
            <Route path="/admin/pt" element={<AdminTrainerPage />} />
            <Route path="/admin/membership" element={<AdminMembershipPage />} />
            <Route path="/admin/location" element={<AdminLocationPage />} />
            <Route path="/admin/payment" element={<AdminPaymentPage />} />
            <Route path="/admin/staff" element={<AdminStaffPage />} />
            <Route path="/admin/equipment" element={<AdminEquipmentPage />} />
            <Route path="/admin/report/user" element={<AdminReportMemberPage />} />
          </Route>
        </Route>

        {/* Staff Routes */}
        <Route element={<PrivateRoute roles={["staff"]} />}>
          <Route element={<AdminLayout />}>
            <Route path="/staff/dashboard" element={<StaffHomePage />} />
            <Route path="/staff/checkin" element={<StaffCheckinPage />} />
            <Route path="/staff/user" element={<StaffUserPage />} />
            <Route path="/staff/pt" element={<StaffTrainerPage />} />
            <Route path="/staff/room" element={<StaffRoomPage />} />
            <Route path="/staff/class" element={<StaffClassPage />} />
            <Route path="/staff/equipment" element={<StaffEquipmentPage />} />
            <Route path="/staff/info" element={<StaffLocationInfoPage />} />
          </Route>
        </Route>

        {/* 404 Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
