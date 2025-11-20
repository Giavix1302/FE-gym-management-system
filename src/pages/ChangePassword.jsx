import React, { useState } from "react"
import { Box, Button, Container, Paper, TextField, Typography, IconButton, InputAdornment } from "@mui/material"
import { ArrowBack, Visibility, VisibilityOff } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { changePasswordAPI } from "~/apis/user"
import useUserStore from "~/stores/useUserStore"

function ChangePassword() {
  const navigate = useNavigate()
  const { user } = useUserStore()

  // States
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Password visibility states
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Error states
  const [oldPasswordError, setOldPasswordError] = useState("")
  const [newPasswordError, setNewPasswordError] = useState("")
  const [confirmPasswordError, setConfirmPasswordError] = useState("")

  // Validation functions
  const validateForm = () => {
    let isValid = true

    // Clear previous errors
    setOldPasswordError("")
    setNewPasswordError("")
    setConfirmPasswordError("")

    // Validate old password
    if (!oldPassword) {
      setOldPasswordError("Vui lòng nhập mật khẩu cũ")
      isValid = false
    }

    // Validate new password
    if (!newPassword) {
      setNewPasswordError("Vui lòng nhập mật khẩu mới")
      isValid = false
    } else if (newPassword.length < 6) {
      setNewPasswordError("Mật khẩu phải có ít nhất 6 ký tự")
      isValid = false
    }

    // Validate confirm password
    if (!confirmPassword) {
      setConfirmPasswordError("Vui lòng xác nhận mật khẩu")
      isValid = false
    } else if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Mật khẩu xác nhận không khớp")
      isValid = false
    }

    // Check if new password is different from old password
    if (oldPassword && newPassword && oldPassword === newPassword) {
      setNewPasswordError("Mật khẩu mới phải khác mật khẩu cũ")
      isValid = false
    }

    return isValid
  }

  // Handle form submission
  const handleChangePassword = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    try {
      const response = await changePasswordAPI(user._id, oldPassword, newPassword)

      if (response.success) {
        toast.success(response.message || "Đổi mật khẩu thành công")
        // Reset form
        setOldPassword("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        // Handle specific error cases
        if (response.message?.includes("old password") || response.message?.includes("mật khẩu cũ")) {
          setOldPasswordError(response.message)
        } else {
          setNewPasswordError(response.message || "Có lỗi xảy ra, vui lòng thử lại")
        }
      }
    } catch (error) {
      console.error("Change password error:", error)
      setOldPasswordError("Có lỗi xảy ra, vui lòng thử lại")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleChangePassword()
    }
  }

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    switch (field) {
      case "old":
        setShowOldPassword(!showOldPassword)
        break
      case "new":
        setShowNewPassword(!showNewPassword)
        break
      case "confirm":
        setShowConfirmPassword(!showConfirmPassword)
        break
    }
  }

  return (
    <Box
      sx={{
        minHeight: "90vh",
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
              p: 2,
              textAlign: "center",
              position: "relative",
            }}
          >
            <Button
              onClick={() => navigate(-1)}
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

            <Typography variant="h5" fontWeight="bold">
              Đổi mật khẩu
            </Typography>
          </Box>

          {/* Content */}
          <Box sx={{ p: 4 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4, textAlign: "center" }}>
              Nhập thông tin để thay đổi mật khẩu của bạn
            </Typography>

            {/* Mật khẩu cũ */}
            <Typography variant="subtitle1" fontWeight="bold" color="text.secondary" sx={{ mb: 1 }}>
              Mật khẩu cũ
            </Typography>
            <TextField
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              fullWidth
              size="small"
              type={showOldPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu cũ"
              error={!!oldPasswordError}
              helperText={oldPasswordError}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => togglePasswordVisibility("old")} edge="end">
                      {showOldPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />

            {/* Mật khẩu mới */}
            <Typography variant="subtitle1" fontWeight="bold" color="text.secondary" sx={{ mb: 1 }}>
              Mật khẩu mới
            </Typography>
            <TextField
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              fullWidth
              size="small"
              type={showNewPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu mới"
              error={!!newPasswordError}
              helperText={newPasswordError}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => togglePasswordVisibility("new")} edge="end">
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />

            {/* Xác nhận mật khẩu */}
            <Typography variant="subtitle1" fontWeight="bold" color="text.secondary" sx={{ mb: 1 }}>
              Xác nhận mật khẩu mới
            </Typography>
            <TextField
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              fullWidth
              size="small"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Nhập lại mật khẩu mới"
              error={!!confirmPasswordError}
              helperText={confirmPasswordError}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => togglePasswordVisibility("confirm")} edge="end">
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 4 }}
            />

            {/* Submit Button */}
            <Button
              onClick={handleChangePassword}
              fullWidth
              size="small"
              variant="contained"
              disabled={isLoading || !oldPassword || !newPassword || !confirmPassword}
              sx={{ py: 1, borderRadius: 2 }}
            >
              {isLoading ? "Đang cập nhật..." : "Đổi mật khẩu"}
            </Button>

            {/* Info text */}
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: "center" }}>
              Mật khẩu phải có ít nhất 6 ký tự
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default ChangePassword
