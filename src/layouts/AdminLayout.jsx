import * as React from "react"
import PropTypes from "prop-types"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { createTheme } from "@mui/material/styles"

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

import { AppProvider } from "@toolpad/core/AppProvider"
import { DashboardLayout } from "@toolpad/core/DashboardLayout"
import logoAdmin from "~/assets/logo-admin-preview.png"

import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { Button } from "@mui/material"

import { ToolbarActions } from "@toolpad/core/DashboardLayout"
import { removeFromLocalStorage } from "~/utils/common"
// store
import useUserStore from "~/stores/useUserStore"
import { logoutAPI } from "~/apis/auth"
import { useLogout } from "~/hooks/useLogout"

const NAVIGATION = [
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
    title: "Quản lí",
  },
  {
    segment: "admin/checkin",
    title: "Checkin / Checkout",
    icon: <QrCodeScannerIcon />,
  },
  {
    segment: "admin/user",
    title: "Hội viên",
    icon: <PersonIcon />,
  },
  {
    segment: "admin/pt",
    title: "Huấn luyện viên (PT)",
    icon: <SportsKabaddiIcon />,
  },
  {
    segment: "admin/membership",
    title: "Gói tập",
    icon: <CardMembershipIcon />,
  },
  {
    segment: "admin/class",
    title: "Lớp học",
    icon: <FitnessCenterIcon />,
  },
  {
    segment: "admin/room",
    title: "Phòng tập",
    icon: <MeetingRoomIcon />,
  },
  {
    segment: "admin/equipment",
    title: "Trang thiếp bị",
    icon: <TableRestaurantIcon />,
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
        segment: "traffic",
        title: "Traffic",
        icon: <DescriptionIcon />,
      },
    ],
  },

  {
    segment: "admin/integrations",
    title: "Tích hợp",
    icon: <LayersIcon />,
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
  const logout = useLogout()

  return (
    <>
      <ToolbarActions /> {/* giữ lại dark/light mode + account */}
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
  )
}

function AdminLayout() {
  const location = useLocation()
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
        homeUrl: "/dashboard",
      }}
      router={router}
      navigation={NAVIGATION}
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
