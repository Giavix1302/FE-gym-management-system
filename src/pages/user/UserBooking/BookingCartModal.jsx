import React from "react"
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Avatar,
  Divider,
  IconButton,
  Stack,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  useMediaQuery,
} from "@mui/material"
import { Close, CheckCircle, AutorenewOutlined, Delete, Payment } from "@mui/icons-material"
import { theme } from "~/theme"

function BookingCartModal({
  open,
  onClose,
  bookingCart,
  selectedLocation,
  setSelectedLocation,
  bookingNote,
  setBookingNote,
  locations,
  loading,
  onSubmit,
  onRemoveFromCart,
  getTotalPrice,
  formatDate,
  showPayButton = true,
  onPayNow,
}) {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  // Helper function to format location display
  const formatLocationAddress = (location) => {
    if (location?.address) {
      const { street, ward, province } = location.address
      return `${street}${ward ? `, ${ward}` : ""}${province ? `, ${province}` : ""}`
    }
    return location?.address || ""
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth fullScreen={isMobile}>
      <DialogTitle sx={{ bgcolor: "warning.main", color: "white" }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="h6" fontWeight={600}>
            Giỏ đặt lịch ({bookingCart.length} buổi)
          </Typography>
          <IconButton onClick={onClose} sx={{ color: "white" }}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {bookingCart.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography color="text.secondary">Giỏ đặt lịch trống</Typography>
          </Box>
        ) : (
          <List>
            {bookingCart.map((item, index) => (
              <React.Fragment key={item.id}>
                <ListItem sx={{ py: 2 }}>
                  <ListItemAvatar>
                    <Avatar src={item.trainer.userId.avatar} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight={600}>
                        {item.trainer.userId.fullName}
                      </Typography>
                    }
                    secondary={
                      <Stack spacing={0.5}>
                        <Typography variant="body2" color="text.secondary">
                          {item.trainer.specialization}
                        </Typography>
                        <Typography variant="body2">📅 {formatDate(item.workDate)}</Typography>
                        <Typography variant="body2">
                          ⏰ {item.schedule.startTime} - {item.schedule.endTime}
                        </Typography>
                        <Typography variant="body2" fontWeight={600} color="warning.dark">
                          💰 {item.trainer.pricePerHour.toLocaleString("vi-VN")}đ x {item.hours}
                        </Typography>
                      </Stack>
                    }
                  />
                  <IconButton edge="end" onClick={() => onRemoveFromCart(item.id)} color="error">
                    <Delete />
                  </IconButton>
                </ListItem>
                {index < bookingCart.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}

        {bookingCart.length > 0 && (
          <Box sx={{ p: 3 }}>
            <Divider sx={{ mb: 3 }} />

            {/* Total */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Typography variant="h6">Tổng cộng:</Typography>
              <Typography variant="h5" color="warning.dark" fontWeight={700}>
                {getTotalPrice().toLocaleString("vi-VN")}đ
              </Typography>
            </Box>

            {/* Location Selection */}
            <TextField
              fullWidth
              select
              label="Chọn chi nhánh *"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              sx={{ mb: 3 }}
              error={!selectedLocation}
              helperText={!selectedLocation ? "Vui lòng chọn chi nhánh" : ""}
            >
              {locations.map((loc) => (
                <MenuItem key={loc._id} value={loc._id}>
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      {loc.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatLocationAddress(loc)}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </TextField>

            {/* Note */}
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Ghi chú chung (tùy chọn)"
              value={bookingNote}
              onChange={(e) => setBookingNote(e.target.value)}
              placeholder="Mục tiêu tập luyện, yêu cầu đặc biệt..."
              sx={{ mb: 3 }}
            />

            {/* Warning */}
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                <>
                  • Vui lòng chọn phương thức thanh toán để hoàn tất đặt lịch
                  <br />
                  • Thanh toán an toàn và bảo mật 100%
                  <br />• Lịch sẽ được xác nhận ngay sau khi thanh toán thành công
                </>
              </Typography>
            </Alert>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={onClose} color="inherit" variant="outlined">
          Tiếp tục chọn
        </Button>

        <Button
          onClick={onPayNow}
          variant="contained"
          color="success"
          disabled={loading || !selectedLocation || bookingCart.length === 0}
          startIcon={<Payment />}
          sx={{ minWidth: 140 }}
        >
          Thanh toán ngay
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default BookingCartModal
