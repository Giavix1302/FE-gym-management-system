// Login.jsx
import { Box, Button, Checkbox, Divider, FormControlLabel, TextField, Typography } from "@mui/material"
import { Google } from "@mui/icons-material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { useNavigate } from "react-router-dom"

// Import hook logic
import { useLoginLogic } from "~/hooks/useLoginLogic" // Giả định đường dẫn

// Tách Form thành một component riêng để dễ đọc hơn (Tùy chọn)
const LoginForm = ({
  phone,
  setPhone,
  isPhoneError,
  password,
  setPassword,
  isPasswordError,
  handleLogin,
  navigate,
}) => (
  <Box sx={{ mt: 3, width: "100%" }}>
    {/* Số điện thoại */}
    <Typography variant="subtitle1" align="left" sx={{ fontWeight: "bold", color: "text.secondary" }}>
      Số điện thoại
    </Typography>
    <TextField
      value={phone}
      onChange={(e) => setPhone(e.target.value)}
      size="small"
      fullWidth
      placeholder="Nhập số điện thoại"
      type="tel"
      error={isPhoneError}
    />

    {/* Mật khẩu */}
    <Typography variant="subtitle1" align="left" sx={{ fontWeight: "bold", color: "text.secondary", mt: 2 }}>
      Mật khẩu
    </Typography>
    <TextField
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      size="small"
      fullWidth
      placeholder="Nhập mật khẩu"
      type="password"
      error={isPasswordError}
      onKeyDown={(e) => {
        // Cho phép đăng nhập bằng phím Enter
        if (e.key === "Enter") handleLogin()
      }}
    />

    {/* Lưu mật khẩu & Quên mật khẩu */}
    <FormControlLabel
      control={<Checkbox color="primary" size="small" />}
      label="Lưu mật khẩu"
      sx={{ mt: 0, width: "100%", justifyContent: "flex-end", mr: 0 }}
    />

    {/* Nút đăng nhập */}
    <Button onClick={handleLogin} fullWidth variant="contained" color="primary" sx={{ mt: 1, py: 1, borderRadius: 2 }}>
      Đăng nhập
    </Button>

    {/* Divider */}
    <Divider sx={{ my: 3 }}>hoặc</Divider>

    {/* Đăng nhập với Google */}
    <Button fullWidth variant="outlined" startIcon={<Google />} sx={{ py: 1, borderRadius: 2 }}>
      Đăng nhập với Google
    </Button>

    {/* Chưa có tài khoản */}
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mt: 2 }}>
      <Typography variant="body2" align="center" sx={{ color: "text.secondary" }}>
        Bạn chưa có tài khoản?
      </Typography>
      <Button onClick={() => navigate("/signup")} color="secondary">
        Đăng ký
      </Button>
    </Box>
  </Box>
)

function Login() {
  const navigate = useNavigate()

  // Gắn logic từ custom hook vào component
  const { phone, setPhone, isPhoneError, password, setPassword, isPasswordError, handleLogin } = useLoginLogic()

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 4, md: 3, lg: 5 },
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
      <Box sx={{ mb: 1 }}>
        <Button onClick={() => navigate("/")} startIcon={<ArrowBackIcon />}>
          Quay lại
        </Button>
      </Box>

      {/* Header */}
      <Typography variant="h4" fontWeight="bold" color="primary" sx={{ fontSize: { xs: "1.75rem", sm: "2.125rem" } }}>
        Wellcome to THE GYM
      </Typography>
      <Typography variant="caption" color="text.secondary">
        <Typography variant="caption" color="primary.main" sx={{ fontWeight: "bold", fontSize: "1rem" }}>
          Đăng nhập{" "}
        </Typography>
        để có những trải nghiệm tốt nhất!
      </Typography>

      {/* Form (Đã tách ra) */}
      <LoginForm
        phone={phone}
        setPhone={setPhone}
        isPhoneError={isPhoneError}
        password={password}
        setPassword={setPassword}
        isPasswordError={isPasswordError}
        handleLogin={handleLogin}
        navigate={navigate}
      />
    </Box>
  )
}

export default Login
