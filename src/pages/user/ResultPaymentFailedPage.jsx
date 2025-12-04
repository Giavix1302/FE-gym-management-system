import { Box, Typography, Button, Paper, Container, Stack, Divider } from "@mui/material"
import { ErrorOutline as ErrorIcon, Home as HomeIcon, Refresh as RefreshIcon } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"

function ResultPaymentFailedPage() {
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate("/user/home")
  }

  const handleTryAgain = () => {
    navigate(-1) // Quay lại trang trước đó
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          textAlign: "center",
          borderRadius: 3,
          backgroundColor: "background.paper",
        }}
      >
        {/* Icon thất bại */}
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            backgroundColor: "error.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 3,
          }}
        >
          <ErrorIcon sx={{ fontSize: 40, color: "white" }} />
        </Box>

        {/* Tiêu đề */}
        <Typography variant="h4" fontWeight="bold" color="error.main" gutterBottom>
          Thanh toán thất bại!
        </Typography>

        {/* Mô tả */}
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
          Rất tiếc, giao dịch của bạn không thể hoàn tất. Vui lòng kiểm tra lại thông tin thanh toán hoặc thử lại sau.
        </Typography>

        {/* Thông tin chi tiết */}
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            mb: 3,
            backgroundColor: "error.light",
            border: `1px solid`,
            borderColor: "error.main",
          }}
        >
          <Typography variant="body2">
            <strong>Mã lỗi:</strong> PAYMENT_FAILED_001
          </Typography>
          <Typography variant="body2">
            <strong>Thời gian:</strong> {new Date().toLocaleString("vi-VN")}
          </Typography>
        </Paper>

        <Divider sx={{ mb: 3 }} />

        {/* Các nút hành động */}
        <Stack spacing={2} direction={{ xs: "column", sm: "row" }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleTryAgain}
            fullWidth
            sx={{
              py: 1.5,
              borderColor: "primary.main",
              color: "primary.main",
              "&:hover": {
                borderColor: "primary.main",
                backgroundColor: "primary.main",
                color: "white",
              },
            }}
          >
            Thử lại
          </Button>

          <Button
            variant="contained"
            startIcon={<HomeIcon />}
            onClick={handleGoHome}
            fullWidth
            sx={{
              py: 1.5,
              backgroundColor: "primary.main",
              "&:hover": {
                backgroundColor: "secondary.main",
              },
            }}
          >
            Về trang chủ
          </Button>
        </Stack>

        {/* Thông tin hỗ trợ */}
        <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: "divider" }}>
          <Typography variant="body2" color="text.secondary">
            Cần hỗ trợ? Liên hệ với chúng tôi tại{" "}
            <Typography component="span" color="primary.main" sx={{ fontWeight: "medium" }}>
              thegym@example.com
            </Typography>{" "}
            hoặc hotline{" "}
            <Typography component="span" color="primary.main" sx={{ fontWeight: "medium" }}>
              0972296068
            </Typography>
          </Typography>
        </Box>
      </Paper>
    </Container>
  )
}

export default ResultPaymentFailedPage
