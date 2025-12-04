import * as React from "react"
import { useState } from "react"
import PropTypes from "prop-types"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { createTheme } from "@mui/material/styles"
import { Avatar, Menu, MenuItem, ListItemIcon, ListItemText, Divider, Tooltip } from "@mui/material"

//icon
import DashboardIcon from "@mui/icons-material/Dashboard"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import SportsKabaddiIcon from "@mui/icons-material/SportsKabaddi"
import BarChartIcon from "@mui/icons-material/BarChart"
import DescriptionIcon from "@mui/icons-material/Description"
import LayersIcon from "@mui/icons-material/Layers"
import PersonIcon from "@mui/icons-material/Person"
import CardMembershipIcon from "@mui/icons-material/CardMembership"
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter"
import TableRestaurantIcon from "@mui/icons-material/TableRestaurant"
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom"
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner"
import LockIcon from "@mui/icons-material/Lock"
import LogoutIcon from "@mui/icons-material/Logout"
import InfoIcon from "@mui/icons-material/Info"
import HomeWorkIcon from "@mui/icons-material/HomeWork"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import PeopleIcon from "@mui/icons-material/People"
import SmartToyIcon from "@mui/icons-material/SmartToy"
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder"

import { AppProvider } from "@toolpad/core/AppProvider"
import { DashboardLayout } from "@toolpad/core/DashboardLayout"
import logoAdmin from "~/assets/logo-admin-preview.png"

import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { Button } from "@mui/material"

import { ToolbarActions } from "@toolpad/core/DashboardLayout"
import { getFromLocalStorage, removeFromLocalStorage } from "~/utils/common"
// store
import useUserStore from "~/stores/useUserStore"
import { logoutAPI } from "~/apis/auth"
import { useLogout } from "~/hooks/useLogout"
import useStaffStore from "~/stores/useStaffStore"
import useCurrentLocation from "~/stores/useCurrentLocationStore"

import StaffInfoModal from "./StaffInfoModal"
import ChangePasswordModal from "./ChangePasswordModal"
import { handleLogoutStaff } from "~/apis/staff"

const NAVIGATION_ADMIN = [
  {
    kind: "header",
    title: "Tổng quan",
  },
  {
    segment: "admin/dashboard",
    title: "Trang chủ",
    icon: <DashboardIcon />,
  },
  {
    kind: "divider",
  },
  {
    kind: "header",
    title: "Quản lý",
  },
  {
    segment: "admin/user",
    title: "Hội viên",
    icon: <PersonIcon />,
  },
  {
    segment: "admin/pt",
    title: "Huấn luyện viên",
    icon: <SportsKabaddiIcon />,
  },
  {
    segment: "admin/staff",
    title: "Nhân viên",
    icon: <PeopleIcon />,
  },
  {
    segment: "admin/membership",
    title: "Gói tập",
    icon: <CardMembershipIcon />,
  },
  {
    segment: "admin/equipment",
    title: "Trang thiếp bị",
    icon: <FitnessCenterIcon />,
  },
  {
    segment: "admin/location",
    title: "Cơ sở phòng gym",
    icon: <HomeWorkIcon />,
  },
  {
    segment: "admin/payment",
    title: "Thanh toán",
    icon: <AttachMoneyIcon />,
  },
  {
    kind: "divider",
  },
  {
    kind: "header",
    title: "Thông kê",
  },
  {
    segment: "admin/report",
    title: "Thống kê",
    icon: <BarChartIcon />,
    children: [
      {
        segment: "user",
        title: "Hội viên",
        icon: <PersonIcon />,
      },
      {
        segment: "pt",
        title: "Huấn luyện viên",
        icon: <SportsKabaddiIcon />,
      },
      {
        segment: "staff",
        title: "Nhân viên",
        icon: <PeopleIcon />,
      },
      {
        segment: "membership",
        title: "Gói tập",
        icon: <CardMembershipIcon />,
      },
      {
        segment: "payment",
        title: "Thanh toán",
        icon: <AttachMoneyIcon />,
      },
    ],
  },
]

const NAVIGATION_STAFF = [
  {
    kind: "header",
    title: "Tổng quan",
  },
  {
    segment: "staff/dashboard",
    title: "Trang chủ",
    icon: <DashboardIcon />,
  },
  {
    kind: "divider",
  },
  {
    kind: "header",
    title: "Quản lý",
  },
  {
    segment: "staff/checkin",
    title: "Checkin / Checkout",
    icon: <QrCodeScannerIcon />,
  },
  {
    segment: "staff/user",
    title: "Hội viên",
    icon: <PersonIcon />,
  },
  {
    segment: "staff/pt",
    title: "Huấn luyện viên (PT)",
    icon: <SportsKabaddiIcon />,
  },
  {
    segment: "staff/class",
    title: "Lớp học",
    icon: <FitnessCenterIcon />,
  },
  {
    segment: "staff/room",
    title: "Phòng tập",
    icon: <MeetingRoomIcon />,
  },
  {
    segment: "staff/equipment",
    title: "Trang thiếp bị",
    icon: <TableRestaurantIcon />,
  },
  {
    segment: "staff/info",
    title: "Thông tin phòng gym",
    icon: <HomeWorkIcon />,
  },
  {
    kind: "divider",
  },
  {
    kind: "header",
    title: "Thông kê",
  },
  {
    segment: "staff/working-hours",
    title: "Giờ làm việc",
    icon: <QueryBuilderIcon />,
  },
]

const adminTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
})

function CustomToolbarActions() {
  const { user } = useUserStore()
  const { staff } = useStaffStore()
  const { currentLocation } = useCurrentLocation()
  const logout = useLogout()

  const [anchorEl, setAnchorEl] = useState(null)
  const [openStaffInfo, setOpenStaffInfo] = useState(false)
  const [openChangePassword, setOpenChangePassword] = useState(false)
  const [mode, setMode] = useState(() => {
    localStorage.getItem("toolpad-mode")
  })

  console.log("🚀 ~ CustomToolbarActions ~ mode:", mode)
  const openMenu = Boolean(anchorEl)

  const handleChangeMode = () => {
    setMode(localStorage.getItem("toolpad-mode"))
  }

  const handleClickAvatar = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleOpenStaffInfo = () => {
    setOpenStaffInfo(true)
    handleCloseMenu()
  }

  const handleCloseStaffInfo = () => {
    setOpenStaffInfo(false)
  }

  const handleOpenChangePassword = () => {
    setOpenChangePassword(true)
    handleCloseMenu()
  }

  const handleCloseChangePassword = () => {
    setOpenChangePassword(false)
  }

  const handleLogout = () => {
    logout()
    handleCloseMenu()
  }

  // 🔧 FIXED: Now properly updates Zustand store
  const handleUpdateUser = async (updatedUserData) => {
    try {
      // Update the user store with new data
      const { updateUser } = useUserStore.getState()
      updateUser(updatedUserData)
      console.log("✅ User store updated successfully:", updatedUserData)
    } catch (error) {
      console.error("❌ Error updating user store:", error)
    }
  }

  // 🔧 FIXED: Now properly updates Zustand store
  const handleUpdateStaff = async (updatedStaffData) => {
    try {
      // Update the staff store with new data
      const { updateStaff } = useStaffStore.getState()
      updateStaff(updatedStaffData)
      console.log("✅ Staff store updated successfully:", updatedStaffData)
    } catch (error) {
      console.error("❌ Error updating staff store:", error)
    }
  }

  const handleChangePassword = async (passwordData) => {
    // TODO: Implement API call to change password
    console.log("Changing password:", passwordData)
  }

  return (
    <>
      {user?.role === "staff" ? (
        <>
          {/* Location name */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mr: 2 }}>
            <LocationOnIcon fontSize="medium" color="primary" />
            <Typography sx={{ mr: 2, color: "primary.main" }}>{currentLocation?.name || ""}</Typography>
          </Box>

          {/* User Avatar and Menu */}
          {user && (
            <Box>
              <Tooltip title={user?.fullName || "Thông tin người dùng"}>
                <Avatar
                  sx={{ cursor: "pointer" }}
                  alt={user?.fullName}
                  src={user?.avatar}
                  aria-controls={openMenu ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={openMenu ? "true" : undefined}
                  onClick={handleClickAvatar}
                />
              </Tooltip>

              <Menu
                sx={{ mt: 1 }}
                id="basic-menu"
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleCloseMenu}
                slotProps={{
                  list: {
                    "aria-labelledby": "basic-button",
                  },
                }}
              >
                {/* Dark/Light Mode Toggle */}
                <MenuItem onClick={handleChangeMode} sx={{ "&.MuiMenuItem-root": { px: 1 } }}>
                  <ToolbarActions />

                  <ListItemText sx={{ ml: 0.75 }}>Giao diện {mode === "light" ? "sáng" : "tối"}</ListItemText>
                </MenuItem>

                <Divider />
                <MenuItem onClick={handleOpenStaffInfo}>
                  <ListItemIcon>
                    <InfoIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Thông tin nhân viên</ListItemText>
                </MenuItem>

                <MenuItem onClick={handleOpenChangePassword}>
                  <ListItemIcon>
                    <LockIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Đổi mật khẩu</ListItemText>
                </MenuItem>

                <Divider />

                <MenuItem
                  onClick={() => {
                    handleLogout()
                  }}
                >
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Đăng xuất</ListItemText>
                </MenuItem>
              </Menu>
            </Box>
          )}

          {/* Modals */}
          <StaffInfoModal
            open={openStaffInfo}
            onClose={handleCloseStaffInfo}
            user={user}
            staff={staff}
            currentLocation={currentLocation}
            onUpdateUser={handleUpdateUser}
            onUpdateStaff={handleUpdateStaff}
          />

          <ChangePasswordModal
            open={openChangePassword}
            onClose={handleCloseChangePassword}
            onChangePassword={handleChangePassword}
          />
        </>
      ) : (
        <>
          <ToolbarActions />

          <Button
            color="inherit"
            variant="outlined"
            sx={{ ml: 2 }}
            onClick={() => {
              logout()
            }}
          >
            Đăng xuất
          </Button>
        </>
      )}
    </>
  )
}

function AdminLayout() {
  const location = useLocation()
  const { user } = useUserStore()
  const navigate = useNavigate()

  // Tạo router object để AppProvider hiểu
  const router = {
    pathname: location.pathname,
    navigate: (path) => navigate(path),
  }
  return (
    <AppProvider
      branding={{
        logo: <img src={logoAdmin} alt="THE GYM logo" />,
        title: "",
        homeUrl: user?.role === "staff" ? "/dashboard" : "/dashboard",
      }}
      router={router}
      navigation={user?.role === "staff" ? NAVIGATION_STAFF : NAVIGATION_ADMIN}
      theme={adminTheme}
    >
      <DashboardLayout
        slots={{
          toolbarActions: CustomToolbarActions,
        }}
      >
        <Outlet />
      </DashboardLayout>
    </AppProvider>
  )
}

export default AdminLayout
