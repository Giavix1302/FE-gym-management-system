import React from "react";
import { Box, Grid, Typography, Link, IconButton } from "@mui/material";
import { Facebook, Instagram, YouTube } from "@mui/icons-material";
import logo from "~/assets/logo.png";
import { theme } from "~/theme";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#16697A",
        color: "#EDE7E3",
        mt: 5,
        pt: 5,
        pb: 2,
        px: { xs: 3, md: 10 },
      }}
    >
      <Grid
        container
        spacing={4}
        alignItems="flex-start"
        justifyContent="space-between"
      >
        {/* Logo + Giới thiệu */}
        <Grid item xs={12} md={3}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img
              src={logo}
              alt="The Gym Logo"
              style={{ height: 50, width: "auto" }}
            />
          </Box>
        </Grid>

        {/* Quick Links */}
        <Grid item xs={12} md={3}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              mb: 1,
              color: theme.palette.warning.main,
            }}
          >
            Liên kết nhanh
          </Typography>
          {[
            "Về THE GYM",
            "Hệ thống phòng tập",
            "Gói thuê PT",
            "Lớp tập nhóm",
            "Liên hệ",
          ].map((text, i) => (
            <Typography key={i} variant="body1" sx={{ mb: 1 }}>
              <Link href="#" underline="hover" color="inherit">
                {text}
              </Link>
            </Typography>
          ))}
        </Grid>

        {/* Thông tin liên hệ */}
        <Grid item xs={12} md={3}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              mb: 1,
              color: theme.palette.warning.main,
            }}
          >
            Liên hệ
          </Typography>
          <Typography sx={{ mb: 1 }} variant="body1">
            📍 123 Nguyễn Văn Cừ, TP.HCM
          </Typography>
          <Typography sx={{ mb: 1 }} variant="body1">
            📞 0123 456 789
          </Typography>
          <Typography sx={{ mb: 1 }} variant="body1">
            ✉️ contact@thegym.com
          </Typography>
          <Typography sx={{ mb: 1 }} variant="body1">
            🕒 6:00 - 22:00
          </Typography>
        </Grid>

        {/* Mạng xã hội */}
        <Grid item xs={12} md={3}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              mb: 1,
              color: theme.palette.warning.main,
            }}
          >
            Kết nối với chúng tôi
          </Typography>
          <Box>
            <IconButton href="#" sx={{ color: "#FFA62B" }}>
              <Facebook />
            </IconButton>
            <IconButton href="#" sx={{ color: "#FFA62B" }}>
              <Instagram />
            </IconButton>
            <IconButton href="#" sx={{ color: "#FFA62B" }}>
              <YouTube />
            </IconButton>
          </Box>
        </Grid>
      </Grid>

      {/* Copyright */}
      <Box
        sx={{
          textAlign: "center",
          mt: 4,
          borderTop: "1px solid #489FB5",
          pt: 2,
        }}
      >
        <Typography variant="body2">
          © {new Date().getFullYear()} THE GYM. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
