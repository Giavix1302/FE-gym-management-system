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
// logo
import logo from "~/assets/logo.png"
// router
import { useNavigate } from "react-router-dom"
// utils
import { navItemsUnsigned, navItemPTSigned, navItemUserSigned } from "~/utils/constants.js"
//store
import useUserStore from "~/stores/useUserStore"
import { removeFromLocalStorage } from "~/utils"
import { toast } from "react-toastify"

export default function Header() {
  useUserStore.subscribe((state) => {
    console.log("Store changed:", state)
  })
  // store
  const { user, resetUser } = useUserStore()

  // menu
  const [anchorEl, setAnchorEl] = React.useState(null)
  const openMenu = Boolean(anchorEl)
  const handleClickAvatar = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const [navHeader, setNavHeader] = useState([])
  useEffect(() => {
    if (user.role === "") {
      setNavHeader([...navItemsUnsigned])
    } else if (user.role === "user") {
      setNavHeader([...navItemUserSigned])
    } else if (user.role === "pt") {
      setNavHeader([...navItemPTSigned])
    }
  }, [user.role])

  const navigate = useNavigate()

  const [open, setOpen] = useState(false)

  const toggleDrawer = (state) => () => {
    setOpen(state)
  }

  // handle logout
  const handleLogout = () => {
    // xóa token
    removeFromLocalStorage("token")
    // xóa store
    resetUser()
    // thông báo đăng xuất thành công
    toast.success("Đăng xuất thành công")
    // điều hướng về trang chủ chưa login
    navigate("/")
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
                  fontWeight: "500",
                  "&:hover": { color: "#FFA62B", backgroundColor: "transparent" },
                }}
              >
                {item.title}
              </Button>
            ))}
          </Box>

          {/* Nút Login */}
          {user._id !== "" ? (
            <Box>
              <Tooltip title={user.fullName || "Thông tin người dùng"}>
                <Avatar
                  sx={{ cursor: "pointer" }}
                  alt={user.fullName}
                  src={user.avatar}
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
                <MenuItem>
                  <ListItemIcon>
                    <DirectionsRunIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Lịch sử tới phòng gym</ListItemText>
                </MenuItem>
                <MenuItem>
                  <ListItemIcon>
                    <PasswordIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Đổi mật khẩu</ListItemText>
                </MenuItem>
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
              width: { xs: "80vw", sm: "50vw" }, // full width
              height: "100vh", // full height
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
