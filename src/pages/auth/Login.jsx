import { Box, Button, Checkbox, Divider, FormControlLabel, TextField, Typography, Link } from "@mui/material"
import { Google } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"

function Login() {
  const navigate = useNavigate()
  return (
    <Box
      sx={{
        px: 5,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        zIndex: 999,
        bgcolor: "rgba(255, 255, 255, 0.9)",
      }}
    >
      {/* Header */}
      <Typography variant="h4" fontWeight="bold" color="primary">
        Wellcome to THE GYM
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Đăng nhập để có những trải nghiệm tốt nhất!
      </Typography>

      {/* Form */}
      <Box sx={{ mt: 3 }}>
        {/* Số điện thoại */}
        <Typography variant="subtitle1" align="left" sx={{ fontWeight: "bold", color: "text.secondary" }}>
          Số điện thoại
        </Typography>
        <TextField size="small" fullWidth placeholder="Nhập số điện thoại" type="tel" />

        {/* Mật khẩu */}
        <Typography variant="subtitle1" align="left" sx={{ fontWeight: "bold", color: "text.secondary", mt: 2 }}>
          Mật khẩu
        </Typography>
        <TextField size="small" fullWidth placeholder="Nhập mật khẩu" type="password" />

        {/* Lưu mật khẩu */}
        <FormControlLabel
          control={<Checkbox color="primary" size="small" />}
          label="Lưu mật khẩu"
          sx={{ mt: 0, width: "100%", justifyContent: "flex-end", mr: 0 }}
        />

        {/* Nút đăng nhập */}
        <Button fullWidth variant="contained" color="primary" sx={{ mt: 1, py: 1, borderRadius: 2 }}>
          Đăng nhập
        </Button>

        {/* Divider */}
        <Divider sx={{ my: 3 }}>or</Divider>

        {/* Đăng nhập với Google */}
        <Button fullWidth variant="outlined" startIcon={<Google />} sx={{ py: 1, borderRadius: 2 }}>
          Đăng nhập với Google
        </Button>

        {/* Chưa có tài khoản */}
        <Typography variant="body2" align="center" sx={{ mt: 3, color: "text.secondary" }}>
          Bạn chưa có tài khoản?{" "}
          <Button onClick={() => navigate("/signup")} underline="hover" color="secondary">
            Đăng ký
          </Button>
        </Typography>
      </Box>
    </Box>
  )
}

export default Login
