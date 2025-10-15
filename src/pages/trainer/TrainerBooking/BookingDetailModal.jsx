import React, { useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip,
  Avatar,
  Divider,
  IconButton,
  TextField,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Fab,
} from "@mui/material"
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  AccessTime as AccessTimeIcon,
  LocationOn as LocationIcon,
  AttachMoney as AttachMoneyIcon,
  Star as StarIcon,
  Note as NoteIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
  Info as InfoIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Lightbulb as LightbulbIcon,
} from "@mui/icons-material"

export default function BookingDetailModal({ booking, isOpen, onClose, onSaveAdvice, onDeleteSlot }) {
  const [isEditingAdvice, setIsEditingAdvice] = useState(false)
  const [newAdviceTitle, setNewAdviceTitle] = useState("")
  const [newAdviceContent, setNewAdviceContent] = useState([""])

  if (!booking) return null

  // Handle the new data structure - check if booking has nested booking data
  const bookingData =
    booking.booking && Object.keys(booking.booking.userInfo || {}).length > 0 ? booking.booking : booking

  // Check if this is an available slot (no user info)
  const isAvailableSlot = !bookingData.userInfo || Object.keys(bookingData.userInfo).length === 0

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const formatDateTime = (dateString) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString("vi-VN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "success"
      case "pending":
        return "warning"
      case "completed":
        return "info"
      case "cancelled":
        return "error"
      default:
        return "default"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "confirmed":
        return "Đã xác nhận"
      case "pending":
        return "Chờ xác nhận"
      case "completed":
        return "Hoàn thành"
      case "cancelled":
        return "Đã hủy"
      default:
        return status
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <CheckCircleIcon />
      case "pending":
        return <PendingIcon />
      case "completed":
        return <InfoIcon />
      case "cancelled":
        return <CancelIcon />
      default:
        return <InfoIcon />
    }
  }

  const handleAddAdviceContent = () => {
    setNewAdviceContent([...newAdviceContent, ""])
  }

  const handleAdviceContentChange = (index, value) => {
    const updated = [...newAdviceContent]
    updated[index] = value
    setNewAdviceContent(updated)
  }

  const handleRemoveAdviceContent = (index) => {
    if (newAdviceContent.length > 1) {
      const updated = newAdviceContent.filter((_, i) => i !== index)
      setNewAdviceContent(updated)
    }
  }

  const handleSaveAdvice = () => {
    if (!newAdviceTitle.trim()) {
      alert("Vui lòng nhập tiêu đề lời khuyên")
      return
    }

    const validContent = newAdviceContent.filter((content) => content.trim())
    if (validContent.length === 0) {
      alert("Vui lòng nhập nội dung lời khuyên")
      return
    }

    const newAdvice = {
      title: newAdviceTitle.trim(),
      content: validContent,
    }

    onSaveAdvice && onSaveAdvice(booking._id, newAdvice)

    // Reset form
    setNewAdviceTitle("")
    setNewAdviceContent([""])
    setIsEditingAdvice(false)
  }

  const handleCancelAdvice = () => {
    setIsEditingAdvice(false)
    setNewAdviceTitle("")
    setNewAdviceContent([""])
  }

  const handleDeleteSlot = () => {
    if (onDeleteSlot) {
      onDeleteSlot(booking._id)
    }
    onClose()
  }

  const startTime = formatDateTime(booking.startTime)
  const endTime = formatDateTime(booking.endTime)

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2, maxHeight: "90vh" },
      }}
    >
      {/* Dialog Header */}
      <DialogTitle sx={{ pb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="h5" component="div" sx={{ fontWeight: "bold", mb: 0.5 }}>
              {isAvailableSlot ? "Chi tiết slot trống" : "Chi tiết booking"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {booking.title || bookingData.title}
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        {isAvailableSlot ? (
          /* Available Slot Content */
          <>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {/* Schedule Information */}
              <Grid item size={{ xs: 12, md: 6 }}>
                <Card variant="outlined" sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <AccessTimeIcon color="primary" />
                      Thời gian slot
                    </Typography>
                    <Stack spacing={1}>
                      <Typography variant="body2">
                        <strong>Ngày:</strong> {startTime.date}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Giờ:</strong> {startTime.time} - {endTime.time}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              {/* Status */}
              <Grid item size={{ xs: 12, md: 6 }}>
                <Card variant="outlined" sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <InfoIcon color="primary" />
                      Trạng thái
                    </Typography>
                    <Stack spacing={2}>
                      <Chip label="Slot trống - Có thể đặt" color="success" icon={<InfoIcon />} size="medium" />
                      <Typography variant="body2" color="text.secondary">
                        Đây là slot thời gian trống có thể được học viên đặt booking
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Alert severity="info" sx={{ mb: 4 }}>
              <Typography variant="body2">
                Đây là slot thời gian trống. Bạn có thể xóa slot này nếu không muốn nhận booking trong khung giờ này.
              </Typography>
            </Alert>
          </>
        ) : (
          /* Booked Slot Content */
          <>
            {/* Basic Information Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {/* User Information */}
              <Grid item size={{ xs: 12, md: 6 }}>
                <Card variant="outlined" sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <PersonIcon color="primary" />
                      Thông tin học viên
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: "primary.light", width: 56, height: 56 }}>
                        {bookingData.userInfo.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {bookingData.userInfo.fullName}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                        >
                          <PhoneIcon fontSize="small" />
                          {bookingData.userInfo.phone}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              {/* Status & Price */}
              <Grid item size={{ xs: 12, md: 6 }}>
                <Card variant="outlined" sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <AttachMoneyIcon color="primary" />
                      Thông tin thanh toán
                    </Typography>
                    <Stack spacing={2}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="body2" color="text.secondary">
                          Trạng thái:
                        </Typography>
                        <Chip
                          label={getStatusText(bookingData.status)}
                          color={getStatusColor(bookingData.status)}
                          icon={getStatusIcon(bookingData.status)}
                          size="small"
                        />
                      </Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="body2" color="text.secondary">
                          Giá tiền:
                        </Typography>
                        <Typography variant="h6" fontWeight="bold" color="success.main">
                          {formatCurrency(bookingData.price)}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              {/* Schedule Information */}
              <Grid item size={{ xs: 12, md: 6 }}>
                <Card variant="outlined" sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <AccessTimeIcon color="primary" />
                      Thời gian tập
                    </Typography>
                    <Stack spacing={1}>
                      <Typography variant="body2">
                        <strong>Ngày:</strong> {startTime.date}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Giờ:</strong> {startTime.time} - {endTime.time}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              {/* Location Information */}
              <Grid item size={{ xs: 12, md: 6 }}>
                <Card variant="outlined" sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <LocationIcon color="primary" />
                      Địa điểm
                    </Typography>
                    <Stack spacing={1}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {bookingData.locationName}
                      </Typography>
                      {bookingData.address && (
                        <Typography variant="body2" color="text.secondary">
                          {bookingData.address.street}, {bookingData.address.ward}, {bookingData.address.province}
                        </Typography>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Note Section */}
            {bookingData.note && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <NoteIcon color="primary" />
                  Ghi chú từ học viên
                </Typography>
                <Alert severity="info" sx={{ borderRadius: 2 }}>
                  {bookingData.note}
                </Alert>
              </Box>
            )}

            {/* Review Section */}
            {bookingData.review && bookingData.review.rating && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <StarIcon color="primary" />
                  Đánh giá từ học viên
                </Typography>
                <Alert severity="success" sx={{ borderRadius: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <Box sx={{ display: "flex" }}>
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          sx={{
                            color: i < bookingData.review.rating ? "warning.main" : "grey.300",
                            fontSize: 20,
                          }}
                        />
                      ))}
                    </Box>
                    <Typography variant="body2" fontWeight="bold">
                      {bookingData.review.rating}/5
                    </Typography>
                  </Box>
                  {bookingData.review.comment && (
                    <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                      "{bookingData.review.comment}"
                    </Typography>
                  )}
                </Alert>
              </Box>
            )}

            {/* Trainer Advice Section */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LightbulbIcon color="primary" />
                  Lời khuyên từ huấn luyện viên
                </Typography>
                {bookingData.status === "completed" && !isEditingAdvice && (
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setIsEditingAdvice(true)}
                    size="small"
                  >
                    Thêm lời khuyên
                  </Button>
                )}
              </Box>

              {/* Existing Advice */}
              {bookingData.trainerAdvice && bookingData.trainerAdvice.length > 0 ? (
                <Stack spacing={2} sx={{ mb: 2 }}>
                  {bookingData.trainerAdvice.map((advice, index) => (
                    <Card key={index} variant="outlined" sx={{ bgcolor: "success.light", borderColor: "success.main" }}>
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                          {advice.title}
                        </Typography>
                        <List dense>
                          {advice.content.map((item, itemIndex) => (
                            <ListItem key={itemIndex} sx={{ py: 0.5 }}>
                              <ListItemIcon sx={{ minWidth: 20 }}>
                                <Box
                                  sx={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: "50%",
                                    bgcolor: "success.main",
                                  }}
                                />
                              </ListItemIcon>
                              <ListItemText primary={item} />
                            </ListItem>
                          ))}
                        </List>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              ) : (
                !isEditingAdvice && (
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 4,
                      textAlign: "center",
                      bgcolor: "grey.50",
                      borderStyle: "dashed",
                    }}
                  >
                    <LightbulbIcon sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
                    <Typography variant="body1" color="text.disabled">
                      Chưa có lời khuyên nào từ huấn luyện viên
                    </Typography>
                  </Paper>
                )
              )}

              {/* Add New Advice Form */}
              {isEditingAdvice && (
                <Card variant="outlined" sx={{ bgcolor: "grey.50" }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Thêm lời khuyên mới
                    </Typography>

                    <TextField
                      fullWidth
                      label="Tiêu đề lời khuyên"
                      value={newAdviceTitle}
                      onChange={(e) => setNewAdviceTitle(e.target.value)}
                      placeholder="VD: Chế độ dinh dưỡng, Kế hoạch tập luyện..."
                      sx={{ mb: 2 }}
                    />

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Nội dung chi tiết:
                    </Typography>

                    {newAdviceContent.map((content, index) => (
                      <Box key={index} sx={{ display: "flex", gap: 1, mb: 1 }}>
                        <TextField
                          fullWidth
                          value={content}
                          onChange={(e) => handleAdviceContentChange(index, e.target.value)}
                          placeholder={`Nội dung ${index + 1}...`}
                          size="small"
                        />
                        {newAdviceContent.length > 1 && (
                          <IconButton onClick={() => handleRemoveAdviceContent(index)} color="error" size="small">
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </Box>
                    ))}

                    <Button startIcon={<AddIcon />} onClick={handleAddAdviceContent} size="small" sx={{ mb: 2 }}>
                      Thêm nội dung
                    </Button>

                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                      <Button onClick={handleCancelAdvice} color="inherit">
                        Hủy
                      </Button>
                      <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSaveAdvice} color="success">
                        Lưu lời khuyên
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              )}
            </Box>
          </>
        )}
      </DialogContent>

      <Divider />

      {/* Dialog Actions */}
      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button onClick={onClose} color="inherit">
          Đóng
        </Button>

        {isAvailableSlot ? (
          /* Actions for Available Slot - Show Delete Button */
          <Button variant="contained" color="error" startIcon={<DeleteIcon />} onClick={handleDeleteSlot}>
            Xóa slot này
          </Button>
        ) : (
          /* Actions for Booked Slot - No Delete Button */
          <>
            {bookingData.status === "pending" && (
              <>
                <Button variant="outlined" color="error">
                  Từ chối
                </Button>
                <Button variant="contained" color="success">
                  Xác nhận
                </Button>
              </>
            )}

            {bookingData.status === "confirmed" && (
              <Button variant="contained" color="primary">
                Đánh dấu hoàn thành
              </Button>
            )}
          </>
        )}
      </DialogActions>
    </Dialog>
  )
}
