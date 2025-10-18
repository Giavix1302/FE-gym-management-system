import React, { useEffect, useState } from "react"
//mui
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Badge,
} from "@mui/material"
import Avatar from "@mui/material/Avatar"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import Tooltip from "@mui/material/Tooltip"
import Divider from "@mui/material/Divider"
import Paper from "@mui/material/Paper"
import MenuList from "@mui/material/MenuList"
import ListItemIcon from "@mui/material/ListItemIcon"
import Typography from "@mui/material/Typography"
import ContentCut from "@mui/icons-material/ContentCut"
import ContentCopy from "@mui/icons-material/ContentCopy"
import ContentPaste from "@mui/icons-material/ContentPaste"
import Cloud from "@mui/icons-material/Cloud"
// icon
import MenuIcon from "@mui/icons-material/Menu"
import PasswordIcon from "@mui/icons-material/Password"
import LogoutIcon from "@mui/icons-material/Logout"
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun"
import PaymentsIcon from "@mui/icons-material/Payments"
import PersonIcon from "@mui/icons-material/Person"
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"
import NotificationsIcon from "@mui/icons-material/Notifications"
// logo
import logo from "~/assets/logo.png"
// router
import { useLocation, useNavigate } from "react-router-dom"
// utils
import { navItemsUnsigned, navItemPTSigned, navItemUserSigned } from "~/utils/constants.js"
//store
import useUserStore from "~/stores/useUserStore"
import { toast } from "react-toastify"
import { useLogout } from "~/hooks/useLogout"

export default function Header() {
  // custom hooks
  const logout = useLogout()
  useUserStore.subscribe((state) => {
    console.log("Store changed:", state)
  })
  // store
  const { user } = useUserStore()

  // menu
  const [anchorEl, setAnchorEl] = React.useState(null)
  const openMenu = Boolean(anchorEl)
  const handleClickAvatar = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  // notifications menu
  const [notificationAnchorEl, setNotificationAnchorEl] = React.useState(null)
  const openNotificationMenu = Boolean(notificationAnchorEl)
  const handleClickNotification = (event) => {
    setNotificationAnchorEl(event.currentTarget)
  }
  const handleCloseNotification = () => {
    setNotificationAnchorEl(null)
  }

  // Sample notifications data - replace with your actual data source
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Thông báo mới", message: "Bạn có lịch tập mới vào ngày mai", time: "5 phút trước", unread: true },
    {
      id: 2,
      title: "Thanh toán thành công",
      message: "Gói tập của bạn đã được gia hạn",
      time: "1 giờ trước",
      unread: true,
    },
    { id: 3, title: "Nhắc nhở", message: "Đừng quên buổi tập lúc 6h chiều nay", time: "2 giờ trước", unread: false },
  ])

  const unreadCount = notifications.filter((n) => n.unread).length

  const [navHeader, setNavHeader] = useState([])
  useEffect(() => {
    if (!user) {
      setNavHeader([...navItemsUnsigned])
      return
    } else {
      if (user.role === "") {
        setNavHeader([...navItemsUnsigned])
      } else if (user.role === "user") {
        setNavHeader([...navItemUserSigned])
      } else if (user.role === "pt") {
        setNavHeader([...navItemPTSigned])
      }
    }
  }, [user])

  // router
  const navigate = useNavigate()
  const location = useLocation()

  const [open, setOpen] = useState(false)

  const toggleDrawer = (state) => () => {
    setOpen(state)
  }

  // handle logout
  const handleLogout = () => {
    toast.success("Đăng xuất thành công")
    logout()
  }

  // Kiểm tra xem nav item có đang active không
  const isActiveNavItem = (itemLink) => {
    console.log("🚀 ~ isActiveNavItem ~ location.pathname:", location.pathname)
    return location.pathname === "/" + itemLink
  }

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: "#16697A", pt: 1, width: "100vw" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Menu mobile (bên trái) */}
          <IconButton
            onClick={toggleDrawer(true)}
            sx={{
              display: { xs: "block", md: "none" },
              color: "#EDE7E3",
              order: { xs: -1, md: 0 },
            }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo */}
          <Box
            onClick={() => navigate("/")}
            sx={{ display: { xs: "none", sm: "block", md: "block" }, cursor: "pointer" }}
          >
            <img src={logo} alt="The Gym Logo" style={{ height: 50, width: "auto" }} />
          </Box>

          {/* Navigation desktop */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
            {navHeader.map((item) => (
              <Button
                onClick={() => navigate(item.link)}
                key={item.title}
                sx={{
                  color: "#EDE7E3",
                  textTransform: "uppercase",
                  fontSize: "1rem",
                  position: "relative",
                  "&:hover": {
                    color: "#FFA62B",
                    backgroundColor: "transparent",
                  },
                  // Active state styling
                  ...(isActiveNavItem(item.link) && {
                    color: "#FFA62B",
                    fontWeight: "bold",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: 2,
                      left: 0,
                      right: 0,
                      height: "2px",
                      backgroundColor: "#FFA62B",
                      borderRadius: "1px",
                    },
                  }),
                }}
              >
                {item.title}
              </Button>
            ))}
          </Box>

          {/* Right side: Notification + User */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* Notification Icon - only show when logged in */}
            {user?._id !== "" && (
              <Tooltip title="Thông báo">
                <IconButton
                  onClick={handleClickNotification}
                  sx={{
                    color: "#EDE7E3",
                    "&:hover": { color: "#FFA62B" },
                  }}
                >
                  <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
            )}

            {/* Notification Menu */}
            <Menu
              anchorEl={notificationAnchorEl}
              open={openNotificationMenu}
              onClose={handleCloseNotification}
              slotProps={{
                paper: {
                  sx: {
                    mt: 1,
                    width: 450,
                    maxHeight: 500,
                  },
                },
              }}
            >
              <Box sx={{ px: 2, py: 1.5, borderBottom: "1px solid #e0e0e0" }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Thông báo
                </Typography>
              </Box>
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <MenuItem
                    key={notification.id}
                    onClick={handleCloseNotification}
                    sx={{
                      display: "block",
                      py: 1.5,
                      px: 2,
                      backgroundColor: notification.unread ? "#f5f5f5" : "transparent",
                      "&:hover": {
                        backgroundColor: notification.unread ? "#eeeeee" : "#f9f9f9",
                      },
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 0.5 }}>
                      {notification.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary", mb: 0.5 }}>
                      {notification.message}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "text.disabled" }}>
                      {notification.time}
                    </Typography>
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Không có thông báo mới
                  </Typography>
                </MenuItem>
              )}
              <Divider />
              <MenuItem
                onClick={handleCloseNotification}
                sx={{
                  justifyContent: "center",
                  color: "primary.main",
                  fontWeight: "bold",
                }}
              >
                Xem tất cả thông báo
              </MenuItem>
            </Menu>

            {/* Nút Login hoặc Avatar */}
            {user?._id !== "" ? (
              <Box>
                <Tooltip title={user?.fullName || "Thông tin người dùng"}>
                  <Avatar
                    sx={{ cursor: "pointer" }}
                    alt={user?.fullName}
                    src={user?.avatar}
                    aria-controls={open ? "basic-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    onClick={handleClickAvatar}
                  />
                </Tooltip>

                <Menu
                  sx={{ mt: 1 }}
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={openMenu}
                  onClose={handleClose}
                  slotProps={{
                    list: {
                      "aria-labelledby": "basic-button",
                    },
                  }}
                >
                  <MenuItem>
                    <ListItemIcon>
                      <PaymentsIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Lịch sử thanh toán</ListItemText>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      if (user?.role === "user") {
                        navigate("user/checkin")
                      } else {
                        navigate("pt/checkin")
                      }
                    }}
                  >
                    <ListItemIcon>
                      <DirectionsRunIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Checkin / Checkout</ListItemText>
                  </MenuItem>
                  <MenuItem>
                    <ListItemIcon>
                      <PasswordIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Đổi mật khẩu</ListItemText>
                  </MenuItem>

                  {user?.role === "pt" && (
                    <Box>
                      <Divider />
                      <MenuItem onClick={() => navigate("pt/profile")}>
                        <ListItemIcon>
                          <PersonIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Hồ sơ cá nhân</ListItemText>
                      </MenuItem>
                      <MenuItem onClick={() => navigate("pt/payments")}>
                        <ListItemIcon>
                          <AttachMoneyIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Doanh thu</ListItemText>
                      </MenuItem>
                    </Box>
                  )}

                  <Divider />
                  <MenuItem onClick={() => handleLogout()}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Đăng xuất</ListItemText>
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Button
                onClick={() => navigate("/login")}
                variant="contained"
                sx={{
                  backgroundColor: "#FFA62B",
                  color: "#212121",
                  fontWeight: "bold",
                  borderRadius: "20px",
                  px: 3,
                  "&:hover": { backgroundColor: "#FF8C00" },
                }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer menu cho mobile */}
      <Drawer
        anchor="left"
        open={open}
        onClose={toggleDrawer(false)}
        slotProps={{
          paper: {
            sx: {
              width: { xs: "80vw", sm: "50vw" },
              height: "100vh",
              backgroundColor: "#16697A",
            },
          },
        }}
      >
        <Box
          sx={{ width: "100%", height: "100vh", bgcolor: "background.default" }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <Box sx={{ px: 2, pt: 2, bgcolor: "primary.main" }}>
            <Box sx={{ display: { xs: "block", sm: "block" } }}>
              <img src={logo} alt="The Gym Logo" style={{ height: 50, width: "auto" }} />
            </Box>
          </Box>

          <List>
            {navHeader.map((item) => (
              <ListItem onClick={() => navigate(item.link)} key={item.title} disablePadding>
                <ListItemButton color="warning.main">
                  <ListItemText primary={item.title} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  )
}
