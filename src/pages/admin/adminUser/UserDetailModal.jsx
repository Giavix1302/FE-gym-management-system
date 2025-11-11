import React, { useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Tabs,
  Tab,
  Grid,
  Avatar,
  Chip,
  Stack,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  IconButton,
  Alert,
  CircularProgress,
  Paper,
} from "@mui/material"
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Cake as CakeIcon,
  Assignment as MembershipIcon,
  Close as CloseIcon,
  FitnessCenter as FitnessCenterIcon,
  History as HistoryIcon,
  CalendarToday as CalendarIcon,
  Schedule as ScheduleIcon,
  AccessTime as AccessTimeIcon,
  Payment as PaymentIcon,
  PersonOff as PersonOffIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  EventNote as BookingIcon,
  QrCode as QrCodeIcon,
} from "@mui/icons-material"

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`user-detail-tabpanel-${index}`}
      aria-labelledby={`user-detail-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

function UserDetailModal({ open, onClose, user, locations = [], onDeleteUser, deleteLoading = false }) {
  const [selectedTab, setSelectedTab] = useState(0)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

  // Utility functions
  const formatCurrencyVND = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const getLocationName = (locationId) => {
    const location = locations.find((loc) => loc._id === locationId)
    return location ? location.name : "N/A"
  }

  const hasActiveSubscription = (user) => {
    if (!user?.subscriptions || user.subscriptions.length === 0) return false

    const now = new Date()
    return user.subscriptions.some((sub) => {
      const endDate = new Date(sub.endDate)
      return sub.status === "active" && endDate > now
    })
  }

  const hasActiveFutureBookings = (user) => {
    if (!user?.booking || user.booking.length === 0) return false

    const now = new Date()
    return user.booking.some((book) => {
      const endTime = new Date(book.endTime)
      return endTime > now && (book.status === "booking" || book.status === "confirmed")
    })
  }

  const getUserStatusColor = (user) => {
    if (user?.isDeleted) return "error"
    return hasActiveSubscription(user) ? "success" : "default"
  }

  const getUserStatusText = (user) => {
    if (user?.isDeleted) return "Đã xóa"
    return hasActiveSubscription(user) ? "Đang tập" : "Hết hạn"
  }

  const getBookingStatusColor = (status) => {
    switch (status) {
      case "booking":
      case "confirmed":
        return "primary"
      case "completed":
        return "success"
      case "cancelled":
        return "error"
      default:
        return "default"
    }
  }

  const getBookingStatusText = (status) => {
    switch (status) {
      case "booking":
        return "Đã đặt"
      case "confirmed":
        return "Đã xác nhận"
      case "completed":
        return "Hoàn thành"
      case "cancelled":
        return "Đã hủy"
      default:
        return status
    }
  }

  // Validation logic cho việc xóa user
  const canDeleteUser = () => {
    if (!user) return { canDelete: false, reason: "Không có thông tin user" }

    // Kiểm tra có subscription active
    if (hasActiveSubscription(user)) {
      return {
        canDelete: false,
        reason: "User đang có gói tập hoạt động",
      }
    }

    // Kiểm tra có booking trong tương lai
    if (hasActiveFutureBookings(user)) {
      return {
        canDelete: false,
        reason: "User có lịch đặt PT trong tương lai",
      }
    }

    return { canDelete: true, reason: "" }
  }

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue)
  }

  const handleDeleteClick = () => {
    setDeleteConfirmOpen(true)
  }

  const handleDeleteConfirm = () => {
    onDeleteUser(user._id)
    setDeleteConfirmOpen(false)
  }

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false)
  }

  if (!user) return null

  const deleteValidation = canDeleteUser()

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                sx={{
                  bgcolor: user.isDeleted ? "grey.400" : "primary.main",
                  width: 48,
                  height: 48,
                }}
              >
                {user.isDeleted ? <PersonOffIcon /> : <PersonIcon />}
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  {user.fullName || "N/A"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ID: {user._id}
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            sx={{
              borderBottom: 1,
              borderColor: "divider",
            }}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Thông tin cơ bản" icon={<PersonIcon />} iconPosition="start" />
            <Tab label="Gói tập" icon={<MembershipIcon />} iconPosition="start" />
            <Tab label="Lịch sử tập" icon={<HistoryIcon />} iconPosition="start" />
            <Tab label="Booking PT" icon={<BookingIcon />} iconPosition="start" />
          </Tabs>

          {/* Tab 1: Basic Info */}
          <TabPanel value={selectedTab} index={0}>
            <Grid container spacing={3}>
              {/* User Avatar and Status */}
              <Grid item size={{ xs: 12, md: 4 }}>
                <Paper elevation={1} sx={{ p: 3, textAlign: "center", borderRadius: 2 }}>
                  <Avatar
                    src={user.avatar}
                    sx={{
                      width: 120,
                      height: 120,
                      mx: "auto",
                      mb: 2,
                      bgcolor: user.isDeleted ? "grey.400" : "primary.main",
                      fontSize: "3rem",
                    }}
                  >
                    {user.isDeleted ? (
                      <PersonOffIcon sx={{ fontSize: "3rem" }} />
                    ) : (
                      <PersonIcon sx={{ fontSize: "3rem" }} />
                    )}
                  </Avatar>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {user.fullName || "N/A"}
                  </Typography>
                  <Stack spacing={1} alignItems="center">
                    <Chip
                      label={getUserStatusText(user)}
                      color={getUserStatusColor(user)}
                      variant={user.isDeleted ? "filled" : "outlined"}
                      size="medium"
                    />
                    {user.qrCode && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                        <QrCodeIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          Có QR Code
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </Paper>
              </Grid>

              {/* User Details */}
              <Grid item size={{ xs: 12, md: 8 }}>
                <Stack spacing={3}>
                  {/* Contact Info */}
                  <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      gutterBottom
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <EmailIcon color="primary" />
                      Thông tin liên hệ
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                          <PhoneIcon fontSize="small" color="primary" />
                          <Typography variant="body2" color="text.secondary" fontWeight="medium">
                            Số điện thoại
                          </Typography>
                        </Box>
                        <Typography variant="body1">{user.phone || "Chưa cập nhật"}</Typography>
                      </Grid>

                      <Grid item size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                          <EmailIcon fontSize="small" color="primary" />
                          <Typography variant="body2" color="text.secondary" fontWeight="medium">
                            Email
                          </Typography>
                        </Box>
                        <Typography variant="body1">{user.email || "Chưa cập nhật"}</Typography>
                      </Grid>
                    </Grid>
                  </Paper>

                  {/* Personal Info */}
                  <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      gutterBottom
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <PersonIcon color="primary" />
                      Thông tin cá nhân
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                          <CakeIcon fontSize="small" color="primary" />
                          <Typography variant="body2" color="text.secondary" fontWeight="medium">
                            Ngày sinh
                          </Typography>
                        </Box>
                        <Typography variant="body1">
                          {user.dateOfBirth ? formatDate(user.dateOfBirth) : "Chưa cập nhật"}
                        </Typography>
                      </Grid>

                      <Grid item size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                          <PersonIcon fontSize="small" color="primary" />
                          <Typography variant="body2" color="text.secondary" fontWeight="medium">
                            Giới tính
                          </Typography>
                        </Box>
                        <Typography variant="body1">
                          {user.gender === "male" ? "Nam" : user.gender === "female" ? "Nữ" : "Chưa cập nhật"}
                        </Typography>
                      </Grid>

                      <Grid item size={{ xs: 12 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                          <LocationIcon fontSize="small" color="primary" />
                          <Typography variant="body2" color="text.secondary" fontWeight="medium">
                            Địa chỉ
                          </Typography>
                        </Box>
                        <Typography variant="body1">{user.address || "Chưa cập nhật"}</Typography>
                      </Grid>
                    </Grid>
                  </Paper>

                  {/* Account Info */}
                  <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      gutterBottom
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <CheckCircleIcon color="primary" />
                      Thông tin tài khoản
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                          <CalendarIcon fontSize="small" color="primary" />
                          <Typography variant="body2" color="text.secondary" fontWeight="medium">
                            Ngày tạo tài khoản
                          </Typography>
                        </Box>
                        <Typography variant="body1">
                          {user.createdAt ? formatDateTime(user.createdAt) : "N/A"}
                        </Typography>
                      </Grid>

                      <Grid item size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                          <CheckCircleIcon fontSize="small" color="primary" />
                          <Typography variant="body2" color="text.secondary" fontWeight="medium">
                            Vai trò
                          </Typography>
                        </Box>
                        <Typography variant="body1">{user.role === "user" ? "Người dùng" : user.role}</Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Stack>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Tab 2: Membership */}
          <TabPanel value={selectedTab} index={1}>
            {user.subscriptions && user.subscriptions.length > 0 ? (
              <Stack spacing={2}>
                {user.subscriptions.map((subscription, index) => (
                  <Paper key={subscription._id} elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar sx={{ bgcolor: subscription.status === "active" ? "success.main" : "grey.400" }}>
                          <MembershipIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight="bold">
                            Gói tập #{index + 1}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            ID: {subscription.membershipId}
                          </Typography>
                        </Box>
                      </Box>
                      <Stack spacing={1} alignItems="flex-end">
                        <Chip
                          label={subscription.status === "active" ? "Đang hoạt động" : "Hết hạn"}
                          color={subscription.status === "active" ? "success" : "default"}
                          variant="outlined"
                        />
                        <Chip
                          label={subscription.paymentStatus === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
                          color={subscription.paymentStatus === "paid" ? "success" : "error"}
                          variant="outlined"
                          size="small"
                        />
                      </Stack>
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item size={{ xs: 6, md: 3 }}>
                        <Box sx={{ textAlign: "center", p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                          <CalendarIcon color="primary" sx={{ mb: 1 }} />
                          <Typography variant="caption" color="text.secondary" display="block">
                            Ngày bắt đầu
                          </Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {formatDate(subscription.startDate)}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item size={{ xs: 6, md: 3 }}>
                        <Box sx={{ textAlign: "center", p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                          <CalendarIcon color="action" sx={{ mb: 1 }} />
                          <Typography variant="caption" color="text.secondary" display="block">
                            Ngày kết thúc
                          </Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {formatDate(subscription.endDate)}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item size={{ xs: 6, md: 3 }}>
                        <Box sx={{ textAlign: "center", p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                          <FitnessCenterIcon color="primary" sx={{ mb: 1 }} />
                          <Typography variant="caption" color="text.secondary" display="block">
                            Buổi tập còn lại
                          </Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {subscription.remainingSessions || 0} buổi
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item size={{ xs: 6, md: 3 }}>
                        <Box sx={{ textAlign: "center", p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                          <PaymentIcon color="success" sx={{ mb: 1 }} />
                          <Typography variant="caption" color="text.secondary" display="block">
                            Trạng thái
                          </Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {subscription.paymentStatus === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                ))}
              </Stack>
            ) : (
              <Box sx={{ textAlign: "center", py: 8 }}>
                <MembershipIcon sx={{ fontSize: 80, color: "grey.300", mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Chưa có gói tập nào
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Người dùng này chưa đăng ký gói tập nào
                </Typography>
              </Box>
            )}
          </TabPanel>

          {/* Tab 3: Attendance History */}
          <TabPanel value={selectedTab} index={2}>
            {user.attendances && user.attendances.length > 0 ? (
              <Stack spacing={2}>
                {user.attendances.map((attendance, index) => (
                  <Paper key={attendance._id} elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar sx={{ bgcolor: attendance.checkoutTime ? "success.main" : "warning.main" }}>
                          <FitnessCenterIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight="bold">
                            Phiên tập #{index + 1}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {formatDateTime(attendance.checkinTime)}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip
                        label={attendance.checkoutTime ? "Đã hoàn thành" : "Đang tập"}
                        color={attendance.checkoutTime ? "success" : "warning"}
                        variant="outlined"
                      />
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={6} md={3}>
                        <Box sx={{ textAlign: "center", p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                          <ScheduleIcon color="success" sx={{ mb: 1 }} />
                          <Typography variant="caption" color="text.secondary" display="block">
                            Check-in
                          </Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {formatDateTime(attendance.checkinTime)}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={6} md={3}>
                        <Box sx={{ textAlign: "center", p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                          <ScheduleIcon color="action" sx={{ mb: 1 }} />
                          <Typography variant="caption" color="text.secondary" display="block">
                            Check-out
                          </Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {attendance.checkoutTime ? formatDateTime(attendance.checkoutTime) : "Chưa check-out"}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={6} md={3}>
                        <Box sx={{ textAlign: "center", p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                          <AccessTimeIcon color="primary" sx={{ mb: 1 }} />
                          <Typography variant="caption" color="text.secondary" display="block">
                            Thời gian tập
                          </Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {attendance.hours ? `${attendance.hours} giờ` : "Đang tập"}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={6} md={3}>
                        <Box sx={{ textAlign: "center", p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                          <LocationIcon color="success" sx={{ mb: 1 }} />
                          <Typography variant="caption" color="text.secondary" display="block">
                            Cơ sở
                          </Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {getLocationName(attendance.locationId)}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                ))}
              </Stack>
            ) : (
              <Box sx={{ textAlign: "center", py: 8 }}>
                <HistoryIcon sx={{ fontSize: 80, color: "grey.300", mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Chưa có lịch sử tập luyện
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Người dùng này chưa có hoạt động tập luyện nào
                </Typography>
              </Box>
            )}
          </TabPanel>

          {/* Tab 4: Booking PT */}
          <TabPanel value={selectedTab} index={3}>
            {user.booking && user.booking.length > 0 ? (
              <Stack spacing={2}>
                {user.booking.map((booking, index) => (
                  <Paper key={booking._id} elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar sx={{ bgcolor: getBookingStatusColor(booking.status) + ".main" }}>
                          <BookingIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight="bold">
                            {booking.title || `Session PT #${index + 1}`}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {formatDateTime(booking.createdAt)}
                          </Typography>
                        </Box>
                      </Box>
                      <Stack spacing={1} alignItems="flex-end">
                        <Chip
                          label={getBookingStatusText(booking.status)}
                          color={getBookingStatusColor(booking.status)}
                          variant="outlined"
                        />
                        <Typography variant="h6" color="success.main" fontWeight="bold">
                          {formatCurrencyVND(booking.price || 0)}
                        </Typography>
                      </Stack>
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ textAlign: "center", p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                          <PersonIcon color="primary" sx={{ mb: 1 }} />
                          <Typography variant="caption" color="text.secondary" display="block">
                            Huấn luyện viên
                          </Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {booking.trainerName || "N/A"}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Box sx={{ textAlign: "center", p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                          <LocationIcon color="primary" sx={{ mb: 1 }} />
                          <Typography variant="caption" color="text.secondary" display="block">
                            Địa điểm
                          </Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {booking.locationName || "N/A"}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Box sx={{ textAlign: "center", p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                          <ScheduleIcon color="success" sx={{ mb: 1 }} />
                          <Typography variant="caption" color="text.secondary" display="block">
                            Thời gian bắt đầu
                          </Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {formatDateTime(booking.startTime)}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Box sx={{ textAlign: "center", p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                          <ScheduleIcon color="action" sx={{ mb: 1 }} />
                          <Typography variant="caption" color="text.secondary" display="block">
                            Thời gian kết thúc
                          </Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {formatDateTime(booking.endTime)}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    {booking.note && (
                      <Box
                        sx={{
                          mt: 2,
                          p: 2,
                          bgcolor: "info.50",
                          borderRadius: 1,
                          borderLeft: 4,
                          borderColor: "info.main",
                        }}
                      >
                        <Typography variant="caption" color="text.secondary" fontWeight="medium">
                          Ghi chú:
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          {booking.note}
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                ))}
              </Stack>
            ) : (
              <Box sx={{ textAlign: "center", py: 8 }}>
                <BookingIcon sx={{ fontSize: 80, color: "grey.300", mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Chưa có lịch đặt PT nào
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Người dùng này chưa đặt lịch PT nào
                </Typography>
              </Box>
            )}
          </TabPanel>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, justifyContent: "space-between", bgcolor: "grey.50" }}>
          <Box>
            {!user.isDeleted && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDeleteClick}
                disabled={!deleteValidation.canDelete}
                sx={{
                  borderWidth: 2,
                  "&:hover": {
                    borderWidth: 2,
                    bgcolor: "error.50",
                  },
                }}
              >
                Xóa người dùng
              </Button>
            )}
          </Box>

          <Button onClick={onClose} variant="contained" color="inherit" sx={{ px: 4 }}>
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteConfirmOpen} onClose={handleDeleteCancel} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, bgcolor: "warning.50" }}>
          <WarningIcon color="warning" />
          <Typography variant="h6" fontWeight="bold">
            Xác nhận xóa người dùng
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          {!deleteValidation.canDelete ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>Không thể xóa:</strong> {deleteValidation.reason}
              </Typography>
            </Alert>
          ) : (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Hành động này sẽ xóa mềm người dùng. Bạn có thể khôi phục sau này nếu cần.
            </Alert>
          )}

          <Paper elevation={1} sx={{ p: 3, bgcolor: "grey.50", borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Thông tin người dùng sẽ bị xóa:
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body2">
                <strong>Họ tên:</strong> {user.fullName || "N/A"}
              </Typography>
              <Typography variant="body2">
                <strong>Số điện thoại:</strong> {user.phone || "N/A"}
              </Typography>
              <Typography variant="body2">
                <strong>Email:</strong> {user.email || "N/A"}
              </Typography>
            </Stack>

            {hasActiveSubscription(user) && (
              <Alert severity="error" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Cảnh báo:</strong> Người dùng này đang có gói tập hoạt động!
                </Typography>
              </Alert>
            )}

            {hasActiveFutureBookings(user) && (
              <Alert severity="error" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Cảnh báo:</strong> Người dùng này có lịch đặt PT trong tương lai!
                </Typography>
              </Alert>
            )}
          </Paper>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleDeleteCancel} disabled={deleteLoading} variant="outlined">
            Hủy
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            disabled={deleteLoading || !deleteValidation.canDelete}
            startIcon={deleteLoading ? <CircularProgress size={20} /> : <DeleteIcon />}
            sx={{ px: 4 }}
          >
            {deleteLoading ? "Đang xóa..." : "Xác nhận xóa"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default UserDetailModal
