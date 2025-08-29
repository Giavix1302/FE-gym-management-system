import React, { useState, useEffect } from "react"
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography } from "@mui/material"
import { MuiOtpInput } from "mui-one-time-password-input"
import styled from "@emotion/styled" // ✅ dùng Emotion thay vì styled-components

// Custom style cho OtpInput
const MuiOtpInputStyled = styled(MuiOtpInput)`
  display: flex;
  gap: 8px; /* khoảng cách giữa các ô */
  max-width: 320px;
  margin-inline: auto;

  input {
    height: 32px;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    padding: 8px;
    border: 1px solid #ccc;
  }
`

export default function OtpModal({ open, handleClose, handleVerify }) {
  const [otp, setOtp] = useState("")
  const [timeLeft, setTimeLeft] = useState(300) // 5 phút = 300 giây

  const handleChange = (value) => {
    setOtp(value)
  }

  const handleCloseModal = () => {
    setOtp("") // reset OTP
    handleClose() // gọi hàm đóng từ cha
  }

  const onVerify = () => {
    handleVerify(otp)
    setOtp("")
  }

  useEffect(() => {
    if (!open) return
    setTimeLeft(300)
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [open])

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, "0")}`
  }

  return (
    <Dialog open={open} onClose={handleCloseModal} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", color: "primary.main" }}>Nhập mã OTP</DialogTitle>
      <DialogContent>
        <Typography variant="body2" textAlign="center" mb={2}>
          Vui lòng nhập mã OTP đã được gửi đến số điện thoại của bạn
        </Typography>

        {/* Thay bằng version styled */}
        <Box display="flex" justifyContent="center" mb={2}>
          <MuiOtpInputStyled length={6} value={otp} onChange={handleChange} />
        </Box>

        <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
          {timeLeft > 0 ? (
            <>
              <Typography variant="body2" color="text.secondary">
                Mã OTP sẽ hết hạn sau
              </Typography>
              <Typography variant="body2" fontWeight="bold" color="warning.main">
                {formatTime(timeLeft)}
              </Typography>
            </>
          ) : (
            <Typography variant="body2" color="error">
              Mã OTP đã hết hạn
            </Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button onClick={handleCloseModal} color="secondary" variant="outlined">
          Hủy
        </Button>
        <Button onClick={onVerify} color="primary" variant="contained" disabled={timeLeft === 0 || otp.length < 6}>
          Xác thực
        </Button>
      </DialogActions>
    </Dialog>
  )
}
