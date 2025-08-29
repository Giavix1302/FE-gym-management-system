import { Box, Container } from "@mui/material"
import backgroundLogin from "~/assets/background-login.jpg"
import backgroundLogin1 from "~/assets/background-login1.jpg"
import { Outlet, useLocation } from "react-router-dom"

function AuthLayout() {
  const location = useLocation()

  console.log(location.pathname)
  return (
    <Container
      maxWidth="xl"
      sx={{
        position: "relative",
        width: "100%",
        height: "100vh", // set chiều cao banner
        backgroundImage: `url(${backgroundLogin})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        "&::after": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.6)", // lớp mờ đen 40%
          zIndex: 1,
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          zIndex: 2, // phải cao hơn overlay
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          // bgcolor: "rgba(255, 255, 255, 0.6)",
          height: { xs: "85vh", sm: "80vh" },
          width: { xs: "90%", sm: "70%", md: "80vw" },
          borderRadius: 4,
          display: "flex",
          boxShadow: 3,
          overflow: "hidden",
        }}
      >
        <Box sx={{ width: { xs: "100%", sm: "100%", md: "40%" }, zIndex: 3 }}>
          <Outlet />
        </Box>
        <Box
          sx={{
            width: "60%",
            display: { xs: "none", sm: "none", md: "block" },
          }}
        >
          <Box component="img" src={backgroundLogin1} sx={{ height: "100%", width: "100%", objectFit: "cover" }} />
        </Box>
      </Box>
    </Container>
  )
}

export default AuthLayout
