import React, { useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material"
import { Visibility, VisibilityOff, Lock as LockIcon } from "@mui/icons-material"

const ChangePasswordModal = ({ open, onClose, onChangePassword }) => {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleInputChange = (field, value) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }))
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!passwordForm.currentPassword) {
      newErrors.currentPassword = "Vui lòng nhập mật khẩu hiện tại"
    }

    if (!passwordForm.newPassword) {
      newErrors.newPassword = "Vui lòng nhập mật khẩu mới"
    } else if (passwordForm.newPassword.length < 6) {
      newErrors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự"
    }

    if (!passwordForm.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu mới"
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp"
    }

    if (passwordForm.currentPassword === passwordForm.newPassword) {
      newErrors.newPassword = "Mật khẩu mới phải khác mật khẩu hiện tại"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setLoading(true)
    try {
      if (onChangePassword) {
        await onChangePassword({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        })
      }
      handleClose()
    } catch (error) {
      setErrors({ submit: error.message || "Có lỗi xảy ra khi đổi mật khẩu" })
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
    setErrors({})
    setShowPasswords({
      current: false,
      new: false,
      confirm: false,
    })
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <LockIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Đổi mật khẩu</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ py: 2 }}>
          {errors.submit && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.submit}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Mật khẩu hiện tại"
            type={showPasswords.current ? "text" : "password"}
            value={passwordForm.currentPassword}
            onChange={(e) => handleInputChange("currentPassword", e.target.value)}
            error={!!errors.currentPassword}
            helperText={errors.currentPassword}
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => togglePasswordVisibility("current")} edge="end">
                    {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Mật khẩu mới"
            type={showPasswords.new ? "text" : "password"}
            value={passwordForm.newPassword}
            onChange={(e) => handleInputChange("newPassword", e.target.value)}
            error={!!errors.newPassword}
            helperText={errors.newPassword}
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => togglePasswordVisibility("new")} edge="end">
                    {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Xác nhận mật khẩu mới"
            type={showPasswords.confirm ? "text" : "password"}
            value={passwordForm.confirmPassword}
            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => togglePasswordVisibility("confirm")} edge="end">
                    {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Lưu ý: Mật khẩu mới phải có ít nhất 6 ký tự và khác mật khẩu hiện tại.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Hủy
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading} startIcon={<LockIcon />}>
          {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ChangePasswordModal
