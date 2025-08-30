import { Box, Typography, Button } from "@mui/material"
import { useNavigate } from "react-router-dom"
import useUserStore from "~/stores/useUserStore"

export default function NotFoundPage() {
  const { user } = useUserStore()
  const navigate = useNavigate()

  const handleBackHome = () => {
    if (user.role === "user") {
      navigate("/user/home")
    } else if (user.role === "pt") {
      navigate("/pt/home")
    } else {
      navigate("/")
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default", // dùng màu nền của bạn
        textAlign: "center",
        px: 2,
      }}
    >
      {/* Hình minh họa */}
      <Box
        component="img"
        src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"
        alt="404 Illustration"
        sx={{
          maxWidth: 400,
          width: "100%",
          height: 250,
          mb: 3,
          borderRadius: 2,
        }}
      />

      {/* Tiêu đề */}
      <Typography variant="h3" sx={{ fontWeight: "bold", mb: 1, color: "text.primary" }}>
        404 - Page Not Found
      </Typography>

      {/* Mô tả */}
      <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
        Oops! Trang bạn tìm kiếm không tồn tại hoặc đã bị di chuyển.
      </Typography>

      {/* Nút quay về */}
      <Button
        variant="contained"
        color="primary" // dùng primary.main = "#16697A"
        onClick={() => handleBackHome()}
        sx={{ borderRadius: "20px", px: 4, py: 1 }}
      >
        Quay về trang chủ
      </Button>
    </Box>
  )
}
