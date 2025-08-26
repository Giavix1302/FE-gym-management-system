import React from "react"
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import logo from "~/assets/logo.png"

import { useNavigate } from "react-router-dom"

export default function Header() {
  const navItems = ["Về THE GYM", "Hệ thống phòng tập", "Gói thuê PT", "Lớp tập nhóm", "Liên hệ"]
  const navigate = useNavigate()

  return (
    <AppBar position="fixed" sx={{ backgroundColor: "#16697A", pt: 1 }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Logo */}
        <Box>
          <img src={logo} alt="The Gym Logo" style={{ height: 50, width: "auto" }} />
        </Box>

        {/* Navigation */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
          {navItems.map((item) => (
            <Button
              key={item}
              sx={{
                color: "#EDE7E3",
                fontWeight: "500",
                "&:hover": {
                  color: "#FFA62B",
                  backgroundColor: "transparent",
                },
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
            "&:hover": {
              backgroundColor: "#FF8C00",
            },
          }}
        >
          Login
        </Button>

        {/* Menu mobile */}
        <IconButton sx={{ display: { xs: "block", md: "none" }, color: "#EDE7E3" }}>
          <MenuIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}
