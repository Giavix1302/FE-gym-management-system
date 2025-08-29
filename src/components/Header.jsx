import React, { useState } from "react"
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
import MenuIcon from "@mui/icons-material/Menu"
import logo from "~/assets/logo.png"
import { useNavigate } from "react-router-dom"

export default function Header() {
  const navItems = ["Về THE GYM", "Hệ thống phòng tập", "Gói thuê PT", "Lớp tập nhóm", "Liên hệ"]
  const navigate = useNavigate()

  const [open, setOpen] = useState(false)

  const toggleDrawer = (state) => () => {
    setOpen(state)
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
          <Box sx={{ display: { xs: "none", sm: "block", md: "block" } }}>
            <img src={logo} alt="The Gym Logo" style={{ height: 50, width: "auto" }} />
          </Box>

          {/* Navigation desktop */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
            {navItems.map((item) => (
              <Button
                key={item}
                sx={{
                  color: "#EDE7E3",
                  fontWeight: "500",
                  "&:hover": { color: "#FFA62B", backgroundColor: "transparent" },
                }}
              >
                {item}
              </Button>
            ))}
          </Box>

          {/* Nút Login */}
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
            {navItems.map((text) => (
              <ListItem key={text} disablePadding>
                <ListItemButton color="warning.main">
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  )
}
