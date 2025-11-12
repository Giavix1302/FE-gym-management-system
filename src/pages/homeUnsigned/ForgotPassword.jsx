// ForgotPassword.jsx
import React, { useState } from "react"
import { Box, Button, Container, Paper, Step, StepLabel, Stepper, TextField, Typography, Alert } from "@mui/material"
import { ArrowBack } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { forgotPasswordSentOptAPI, forgotPasswordVerifyOtpAPI, resetPasswordAPI } from "~/apis/auth"
import { formatPhoneNumber } from "~/utils/common"

// Component cho OTP Input 6 số
const OTPInput = ({ value, onChange, error }) => {
  const handleChange = (index, val) => {
    if (val.length <= 1 && /^\d*$/.test(val)) {
      const newValue = value.split("")
      newValue[index] = val
      onChange(newValue.join(""))

      // Auto focus next input
      if (val && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`)
        nextInput?.focus()
      }
    }
  }

  const handleKeyDown = (e, index) => {
    // Backspace: focus previous input
    if (e.key === "Backspace" && !value[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const paste = e.clipboardData.getData("text")
    if (/^\d{6}$/.test(paste)) {
      onChange(paste)
    }
  }

  return (
    <Box sx={{ display: "flex", gap: 1.5, justifyContent: "center", mt: 2 }}>
      {[...Array(6)].map((_, index) => (
        <TextField
          key={index}
          id={`otp-${index}`}
          size="small"
          value={value[index] || ""}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          error={error}
          inputProps={{
            maxLength: 1,
            style: {
              textAlign: "center",
              fontSize: "1.2rem",
              fontWeight: "bold",
            },
          }}
          sx={{
            width: { xs: 40, sm: 48 },
            height: { xs: 40, sm: 48 },
            "& .MuiOutlinedInput-root": {
              height: "100%",
            },
          }}
        />
      ))}
    </Box>
  )
}

// Component Step 1: Nhập số điện thoại
const StepPhone = ({ phone, setPhone, isLoading, onNext, phoneError }) => (
  <Box sx={{ textAlign: "center", py: 3 }}>
    <Typography variant="h6" fontWeight="bold" color="primary.main" gutterBottom>
      Nhập số điện thoại
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
      Chúng tôi sẽ gửi mã xác thực đến số điện thoại của bạn
    </Typography>

    <TextField
      value={phone}
      onChange={(e) => setPhone(e.target.value)}
      fullWidth
      placeholder="Nhập số điện thoại"
      type="tel"
      error={!!phoneError}
      helperText={phoneError}
      sx={{ mb: 3 }}
    />

    <Button
      onClick={onNext}
      fullWidth
      variant="contained"
      disabled={isLoading || !phone}
      sx={{ py: 1.5, borderRadius: 2 }}
    >
      {isLoading ? "Đang gửi..." : "Gửi mã OTP"}
    </Button>
  </Box>
)

// Component Step 2: Nhập OTP
const StepOTP = ({ phone, otp, setOtp, countdown, onResend, onNext, otpError, isLoading, isResendLoading }) => (
  <Box sx={{ textAlign: "center", py: 3 }}>
    <Typography variant="h6" fontWeight="bold" color="primary.main" gutterBottom>
      Nhập mã xác thực
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
      Mã OTP đã được gửi đến số
    </Typography>
    <Typography variant="body2" fontWeight="bold" color="primary.main" sx={{ mb: 3 }}>
      {phone?.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3")}
    </Typography>

    <OTPInput value={otp} onChange={setOtp} error={!!otpError} />

    {otpError && (
      <Alert severity="error" sx={{ mt: 2, textAlign: "left" }}>
        {otpError}
      </Alert>
    )}

    <Box sx={{ mt: 3, mb: 2 }}>
      {countdown > 0 ? (
        <Typography variant="body2" color="text.secondary">
          Gửi lại mã sau {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, "0")}
        </Typography>
      ) : (
        <Button onClick={onResend} color="primary" disabled={isResendLoading} sx={{ textTransform: "none" }}>
          {isResendLoading ? "Đang gửi..." : "Gửi lại mã OTP"}
        </Button>
      )}
    </Box>

    <Button
      onClick={onNext}
      fullWidth
      variant="contained"
      disabled={isLoading || otp.length !== 6}
      sx={{ py: 1.5, borderRadius: 2 }}
    >
      {isLoading ? "Đang xác thực..." : "Xác nhận"}
    </Button>
  </Box>
)

// Component Step 3: Đặt mật khẩu mới
const StepNewPassword = ({
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  onSubmit,
  passwordError,
  isLoading,
}) => (
  <Box sx={{ textAlign: "center", py: 3 }}>
    <Typography variant="h6" fontWeight="bold" color="primary.main" gutterBottom>
      Đặt mật khẩu mới
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
      Vui lòng nhập mật khẩu mới cho tài khoản của bạn
    </Typography>

    <TextField
      value={newPassword}
      onChange={(e) => setNewPassword(e.target.value)}
      fullWidth
      type="password"
      placeholder="Mật khẩu mới"
      error={!!passwordError}
      sx={{ mb: 2 }}
    />

    <TextField
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      fullWidth
      type="password"
      placeholder="Xác nhận mật khẩu"
      error={!!passwordError}
      helperText={passwordError}
      sx={{ mb: 3 }}
    />

    <Button
      onClick={onSubmit}
      fullWidth
      variant="contained"
      disabled={isLoading || !newPassword || !confirmPassword}
      sx={{ py: 1.5, borderRadius: 2 }}
    >
      {isLoading ? "Đang cập nhật..." : "Đặt lại mật khẩu"}
    </Button>
  </Box>
)

// Component Step 4: Thành công
const StepSuccess = ({ onLogin }) => (
  <Box sx={{ textAlign: "center", py: 4 }}>
    <Box
      sx={{
        width: 80,
        height: 80,
        borderRadius: "50%",
        bgcolor: "success.main",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 24px",
      }}
    >
      <Typography variant="h2" color="white">
        ✓
      </Typography>
    </Box>

    <Typography variant="h6" fontWeight="bold" color="success.main" gutterBottom>
      Đặt lại mật khẩu thành công!
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
      Mật khẩu của bạn đã được cập nhật thành công
    </Typography>

    <Button onClick={onLogin} fullWidth variant="contained" sx={{ py: 1.5, borderRadius: 2 }}>
      Đăng nhập ngay
    </Button>
  </Box>
)

function ForgotPassword() {
  const navigate = useNavigate()

  // States
  const [activeStep, setActiveStep] = useState(0)
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [countdown, setCountdown] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isResendLoading, setIsResendLoading] = useState(false)

  // Error states
  const [phoneError, setPhoneError] = useState("")
  const [otpError, setOtpError] = useState("")
  const [passwordError, setPasswordError] = useState("")

  // Steps configuration
  const steps = ["Số điện thoại", "Mã xác thực", "Mật khẩu mới", "Hoàn thành"]

  // Countdown effect (5 phút = 300 giây)
  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  // Validation functions
  const validatePhone = (phoneNumber) => {
    // Loại bỏ tất cả ký tự không phải số
    const cleaned = phoneNumber.replace(/\D/g, "")

    // Kiểm tra độ dài và số đầu tiên
    if (cleaned.length !== 10) {
      return "Số điện thoại phải có 10 chữ số"
    }

    if (!cleaned.startsWith("0")) {
      return "Số điện thoại phải bắt đầu bằng số 0"
    }

    return ""
  }

  // Handlers
  const handleSendOTP = async () => {
    setPhoneError("")

    // Validate phone number
    const phoneValidationError = validatePhone(phone)
    if (phoneValidationError) {
      setPhoneError(phoneValidationError)
      return
    }

    setIsLoading(true)
    try {
      const formattedPhone = formatPhoneNumber(phone)
      const response = await forgotPasswordSentOptAPI(formattedPhone)

      if (response.success) {
        toast.success(response.message || "Mã OTP đã được gửi thành công")
        setActiveStep(1)
        setCountdown(300) // 5 phút
      } else {
        setPhoneError(response.message || "Có lỗi xảy ra, vui lòng thử lại")
      }
    } catch (error) {
      console.error("Send OTP error:", error)
      setPhoneError("Có lỗi xảy ra, vui lòng thử lại")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setIsResendLoading(true)
    try {
      const formattedPhone = formatPhoneNumber(phone)
      const response = await forgotPasswordSentOptAPI(formattedPhone)

      if (response.success) {
        toast.success(response.message || "Mã OTP đã được gửi lại thành công")
        setCountdown(300) // 5 phút
        setOtpError("")
      } else {
        setOtpError(response.message || "Có lỗi xảy ra khi gửi lại mã")
      }
    } catch (error) {
      console.error("Resend OTP error:", error)
      setOtpError("Có lỗi xảy ra khi gửi lại mã")
    } finally {
      setIsResendLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    setOtpError("")

    if (otp.length !== 6) {
      setOtpError("Vui lòng nhập đầy đủ mã OTP")
      return
    }

    setIsLoading(true)
    try {
      const formattedPhone = formatPhoneNumber(phone)
      const response = await forgotPasswordVerifyOtpAPI(formattedPhone, otp)

      if (response.success) {
        toast.success(response.message || "Xác thực OTP thành công")
        setActiveStep(2)
      } else {
        setOtpError(response.message || "Mã OTP không chính xác")
      }
    } catch (error) {
      console.error("Verify OTP error:", error)
      setOtpError("Mã OTP không chính xác")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async () => {
    setPasswordError("")

    if (newPassword.length < 6) {
      setPasswordError("Mật khẩu phải có ít nhất 6 ký tự")
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Mật khẩu xác nhận không khớp")
      return
    }

    setIsLoading(true)
    try {
      const formattedPhone = formatPhoneNumber(phone)
      const response = await resetPasswordAPI(formattedPhone, newPassword)

      if (response.success) {
        toast.success(response.message || "Đặt lại mật khẩu thành công")
        setActiveStep(3)
      } else {
        setPasswordError(response.message || "Có lỗi xảy ra, vui lòng thử lại")
      }
    } catch (error) {
      console.error("Reset password error:", error)
      setPasswordError("Có lỗi xảy ra, vui lòng thử lại")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoToLogin = () => {
    navigate("/login")
  }

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <StepPhone
            phone={phone}
            setPhone={setPhone}
            isLoading={isLoading}
            onNext={handleSendOTP}
            phoneError={phoneError}
          />
        )
      case 1:
        return (
          <StepOTP
            phone={phone}
            otp={otp}
            setOtp={setOtp}
            countdown={countdown}
            onResend={handleResendOTP}
            onNext={handleVerifyOTP}
            otpError={otpError}
            isLoading={isLoading}
            isResendLoading={isResendLoading}
          />
        )
      case 2:
        return (
          <StepNewPassword
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            onSubmit={handleResetPassword}
            passwordError={passwordError}
            isLoading={isLoading}
          />
        )
      case 3:
        return <StepSuccess onLogin={handleGoToLogin} />
      default:
        return null
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            bgcolor: "background.paper",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              bgcolor: "primary.main",
              color: "white",
              p: 3,
              textAlign: "center",
              position: "relative",
            }}
          >
            {activeStep < 3 && (
              <Button
                onClick={() => navigate("/login")}
                startIcon={<ArrowBack />}
                sx={{
                  position: "absolute",
                  left: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "white",
                  textTransform: "none",
                }}
              >
                Quay lại
              </Button>
            )}

            <Typography variant="h5" fontWeight="bold">
              {activeStep === 3 ? "Hoàn thành" : "Quên mật khẩu"}
            </Typography>
          </Box>

          {/* Stepper */}
          {activeStep < 3 && (
            <Box sx={{ p: 3, pb: 0 }}>
              <Stepper
                activeStep={activeStep}
                alternativeLabel
                sx={{
                  "& .MuiStepIcon-root": {
                    fontSize: "1.5rem",
                  },
                  "& .MuiStepLabel-label": {
                    fontSize: "0.875rem",
                    mt: 1,
                  },
                }}
              >
                {steps.slice(0, 3).map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
          )}

          {/* Content */}
          <Box sx={{ px: 3, pb: 3 }}>{renderStepContent()}</Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default ForgotPassword
