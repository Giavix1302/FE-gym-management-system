import React, { useState, useEffect } from "react"
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Avatar,
  Rating,
  Divider,
  IconButton,
  Paper,
  Stack,
  InputAdornment,
  Skeleton,
  Fade,
  Grow,
  useMediaQuery,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Fab,
  Badge,
} from "@mui/material"
import {
  FilterList,
  Search,
  Event,
  LocationOn,
  Schedule,
  Close,
  CheckCircle,
  Info,
  AutorenewOutlined,
  Cancel,
  Delete,
  Add,
  ShoppingCart,
  AccessTime,
  DateRange,
  CheckCircleOutline,
  HourglassEmpty,
  CancelOutlined,
} from "@mui/icons-material"
import { theme } from "~/theme"

// Mock data
const mockTrainers = [
  {
    _id: "1",
    userId: {
      fullName: "Nguyễn Văn An",
      avatar: "https://i.pravatar.cc/150?img=1",
      email: "an.nguyen@gym.com",
    },
    specialization: "Bodybuilding, Giảm cân",
    bio: "Chuyên gia 10 năm kinh nghiệm trong lĩnh vực thể hình và dinh dưỡng. Đã giúp hơn 500 học viên đạt được mục tiêu.",
    experience: "10 năm",
    education: "Cử nhân TDTT, Chứng chỉ PT Quốc tế",
    rating: 4.8,
    totalBookings: 156,
    pricePerSession: 500000,
  },
  {
    _id: "2",
    userId: {
      fullName: "Trần Thị Bình",
      avatar: "https://i.pravatar.cc/150?img=2",
      email: "binh.tran@gym.com",
    },
    specialization: "Yoga, Pilates",
    bio: "Huấn luyện viên Yoga chứng chỉ quốc tế RYT-500. Chuyên về yoga trị liệu và phục hồi chức năng.",
    experience: "8 năm",
    education: "Chứng chỉ Yoga Alliance RYT-500",
    rating: 4.9,
    totalBookings: 203,
    pricePerSession: 450000,
  },
  {
    _id: "3",
    userId: {
      fullName: "Lê Minh Đức",
      avatar: "https://i.pravatar.cc/150?img=3",
      email: "duc.le@gym.com",
    },
    specialization: "CrossFit, HIIT",
    bio: "Vô địch CrossFit Việt Nam 2023, chuyên gia HIIT và functional training.",
    experience: "6 năm",
    education: "CrossFit Level 3 Trainer",
    rating: 4.7,
    totalBookings: 98,
    pricePerSession: 550000,
  },
  {
    _id: "4",
    userId: {
      fullName: "Phạm Thị Mai",
      avatar: "https://i.pravatar.cc/150?img=5",
      email: "mai.pham@gym.com",
    },
    specialization: "Zumba, Aerobic",
    bio: "Huấn luyện viên Zumba quốc tế, mang đến niềm vui và năng lượng trong mỗi buổi tập.",
    experience: "5 năm",
    education: "Zumba Instructor License",
    rating: 4.6,
    totalBookings: 120,
    pricePerSession: 400000,
  },
]

const mockSchedules = [
  { trainerId: "1", workDate: "2025-01-22", startTime: "07:00", endTime: "09:00", isBooked: false },
  { trainerId: "1", workDate: "2025-01-22", startTime: "09:00", endTime: "11:00", isBooked: false },
  { trainerId: "1", workDate: "2025-01-22", startTime: "14:00", endTime: "16:00", isBooked: false },
  { trainerId: "1", workDate: "2025-01-22", startTime: "16:00", endTime: "18:00", isBooked: false },
  { trainerId: "2", workDate: "2025-01-22", startTime: "08:00", endTime: "10:00", isBooked: false },
  { trainerId: "2", workDate: "2025-01-22", startTime: "15:00", endTime: "17:00", isBooked: false },
  { trainerId: "3", workDate: "2025-01-22", startTime: "06:00", endTime: "08:00", isBooked: false },
  { trainerId: "3", workDate: "2025-01-22", startTime: "18:00", endTime: "20:00", isBooked: false },
  { trainerId: "4", workDate: "2025-01-22", startTime: "16:00", endTime: "18:00", isBooked: false },
]

const mockLocations = [
  { _id: "1", name: "Chi nhánh Quận 1", address: "123 Nguyễn Huệ, Quận 1, TP.HCM" },
  { _id: "2", name: "Chi nhánh Quận 7", address: "456 Nguyễn Văn Linh, Quận 7, TP.HCM" },
  { _id: "3", name: "Chi nhánh Quận 3", address: "789 Võ Văn Tần, Quận 3, TP.HCM" },
]

// Mock existing bookings
const mockExistingBookings = [
  {
    _id: "booking1",
    trainer: mockTrainers[0],
    workDate: "2025-01-25",
    startTime: "07:00",
    endTime: "09:00",
    location: mockLocations[0],
    status: "confirmed",
    bookingNote: "Tập tăng cơ bắp",
    createdAt: "2025-01-20T10:30:00Z",
  },
  {
    _id: "booking2",
    trainer: mockTrainers[1],
    workDate: "2025-01-26",
    startTime: "15:00",
    endTime: "17:00",
    location: mockLocations[1],
    status: "pending",
    bookingNote: "Yoga trị liệu",
    createdAt: "2025-01-21T14:15:00Z",
  },
]

function BookingPage() {
  // Main states
  const [activeTab, setActiveTab] = useState(0)
  const [selectedDate, setSelectedDate] = useState("2025-01-22")
  const [specialization, setSpecialization] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [trainers, setTrainers] = useState([])
  const [schedules, setSchedules] = useState([])
  const [dataLoading, setDataLoading] = useState(true)

  // Booking cart states
  const [bookingCart, setBookingCart] = useState([])
  const [selectedLocation, setSelectedLocation] = useState("")
  const [bookingNote, setBookingNote] = useState("")

  // Existing bookings
  const [existingBookings, setExistingBookings] = useState([])

  // Dialog states
  const [openCartDialog, setOpenCartDialog] = useState(false)
  const [openDetailDialog, setOpenDetailDialog] = useState(false)
  const [openCancelDialog, setOpenCancelDialog] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [cancelReason, setCancelReason] = useState("")

  // UI states
  const [loading, setLoading] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  useEffect(() => {
    // Simulate API calls
    setTimeout(() => {
      setTrainers(mockTrainers)
      setSchedules(mockSchedules)
      setExistingBookings(mockExistingBookings)
      setDataLoading(false)
    }, 1000)
  }, [])

  const getAvailableSchedules = (trainerId) => {
    return schedules.filter((s) => s.trainerId === trainerId && s.workDate === selectedDate && !s.isBooked)
  }

  const addToCart = (trainer, schedule) => {
    const cartItem = {
      id: `${trainer._id}-${schedule.startTime}-${schedule.endTime}`,
      trainer,
      schedule,
      workDate: selectedDate,
    }

    const exists = bookingCart.find((item) => item.id === cartItem.id)
    if (!exists) {
      setBookingCart((prev) => [...prev, cartItem])
      setSnackbar({
        open: true,
        message: "Đã thêm vào giỏ đặt lịch",
        severity: "success",
      })
    } else {
      setSnackbar({
        open: true,
        message: "Lịch này đã có trong giỏ",
        severity: "warning",
      })
    }
  }

  const removeFromCart = (itemId) => {
    setBookingCart((prev) => prev.filter((item) => item.id !== itemId))
  }

  const getTotalPrice = () => {
    return bookingCart.reduce((total, item) => total + item.trainer.pricePerSession, 0)
  }

  const handleBookingSubmit = () => {
    if (!selectedLocation || bookingCart.length === 0) {
      setSnackbar({
        open: true,
        message: "Vui lòng chọn chi nhánh và có ít nhất 1 lịch trong giỏ!",
        severity: "error",
      })
      return
    }

    setLoading(true)
    setTimeout(() => {
      // Create new bookings
      const newBookings = bookingCart.map((item, index) => ({
        _id: `booking_${Date.now()}_${index}`,
        trainer: item.trainer,
        workDate: item.workDate,
        startTime: item.schedule.startTime,
        endTime: item.schedule.endTime,
        location: mockLocations.find((loc) => loc._id === selectedLocation),
        status: "pending",
        bookingNote: bookingNote,
        createdAt: new Date().toISOString(),
      }))

      // Update schedules to mark as booked
      const updatedSchedules = schedules.map((schedule) => {
        const bookedSchedule = bookingCart.find(
          (item) =>
            item.trainer._id === schedule.trainerId &&
            item.schedule.startTime === schedule.startTime &&
            item.schedule.endTime === schedule.endTime &&
            item.workDate === schedule.workDate,
        )

        if (bookedSchedule) {
          return { ...schedule, isBooked: true }
        }
        return schedule
      })

      // Update states
      setSchedules(updatedSchedules)
      setExistingBookings((prev) => [...prev, ...newBookings])
      setBookingCart([])
      setSelectedLocation("")
      setBookingNote("")
      setOpenCartDialog(false)
      setLoading(false)
      setActiveTab(1) // Switch to bookings tab

      setSnackbar({
        open: true,
        message: `Đặt thành công ${newBookings.length} lịch tập!`,
        severity: "success",
      })
    }, 2000)
  }

  const getStatusInfo = (status) => {
    switch (status) {
      case "confirmed":
        return {
          label: "Đã xác nhận",
          color: "success",
          icon: <CheckCircleOutline fontSize="small" />,
        }
      case "pending":
        return {
          label: "Chờ xác nhận",
          color: "warning",
          icon: <HourglassEmpty fontSize="small" />,
        }
      case "completed":
        return {
          label: "Đã hoàn thành",
          color: "info",
          icon: <CheckCircle fontSize="small" />,
        }
      case "cancelled":
        return {
          label: "Đã hủy",
          color: "error",
          icon: <CancelOutlined fontSize="small" />,
        }
      default:
        return {
          label: "Không xác định",
          color: "default",
          icon: <Info fontSize="small" />,
        }
    }
  }

  const handleCancelBooking = () => {
    if (!cancelReason.trim()) {
      setSnackbar({
        open: true,
        message: "Vui lòng nhập lý do hủy lịch",
        severity: "error",
      })
      return
    }

    setLoading(true)
    setTimeout(() => {
      const updatedBookings = existingBookings.map((booking) =>
        booking._id === selectedBooking._id ? { ...booking, status: "cancelled" } : booking,
      )
      setExistingBookings(updatedBookings)
      setOpenCancelDialog(false)
      setSelectedBooking(null)
      setCancelReason("")
      setLoading(false)
      setSnackbar({
        open: true,
        message: "Hủy lịch thành công",
        severity: "success",
      })
    }, 1500)
  }

  const canCancelBooking = (booking) => {
    const bookingDate = new Date(booking.workDate)
    const now = new Date()
    const timeDiff = bookingDate.getTime() - now.getTime()
    const hoursDiff = timeDiff / (1000 * 3600)

    return hoursDiff > 24 && (booking.status === "confirmed" || booking.status === "pending")
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const filteredTrainers = trainers.filter((trainer) => {
    const matchSpecialization =
      specialization === "all" || trainer.specialization.toLowerCase().includes(specialization.toLowerCase())
    const matchSearch =
      searchTerm === "" ||
      trainer.userId.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainer.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    return matchSpecialization && matchSearch
  })

  const upcomingBookings = existingBookings.filter(
    (booking) =>
      new Date(booking.workDate) >= new Date() && (booking.status === "confirmed" || booking.status === "pending"),
  )

  return (
    <Container sx={{ py: 4 }}>
      {/* Header */}
      <Fade in timeout={800}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              color: "primary.main",
              mb: 2,
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
            }}
          >
            Quản Lý Lịch Tập
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              maxWidth: 600,
              mx: "auto",
              fontWeight: 400,
              fontSize: { xs: "0.95rem", sm: "1.1rem" },
            }}
          >
            Đặt lịch với huấn luyện viên và quản lý các buổi tập của bạn
          </Typography>
        </Box>
      </Fade>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant={isMobile ? "scrollable" : "fullWidth"}
          scrollButtons="auto"
        >
          <Tab label="Đặt lịch mới" icon={<Add />} iconPosition="start" />
          <Tab label="Lịch đã đặt" icon={<Event />} iconPosition="start" />
        </Tabs>
      </Paper>

      {/* Tab 1: Booking */}
      {activeTab === 0 && (
        <Box>
          {/* Filters */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              mb: 4,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
              <FilterList color="primary" />
              <Typography variant="h6" color="primary">
                Tìm kiếm huấn luyện viên
              </Typography>
            </Box>

            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Tìm kiếm PT..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  label="Chọn ngày"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    min: new Date().toISOString().split("T")[0],
                    max: "2025-12-31",
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  fullWidth
                  select
                  size="small"
                  label="Chuyên môn"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                >
                  <MenuItem value="all">Tất cả chuyên môn</MenuItem>
                  <MenuItem value="bodybuilding">Bodybuilding</MenuItem>
                  <MenuItem value="yoga">Yoga</MenuItem>
                  <MenuItem value="crossfit">CrossFit</MenuItem>
                  <MenuItem value="giảm cân">Giảm cân</MenuItem>
                  <MenuItem value="zumba">Zumba</MenuItem>
                  <MenuItem value="aerobic">Aerobic</MenuItem>
                  <MenuItem value="boxing">Boxing</MenuItem>
                  <MenuItem value="mma">MMA</MenuItem>
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Paper
                  sx={{
                    px: 2,
                    py: 1,
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "rgba(130, 192, 204, 0.15)",
                    border: "1px solid",
                    borderColor: "info.main",
                  }}
                >
                  <Typography variant="body2" fontWeight={600} color="primary">
                    {filteredTrainers.length} PT phù hợp
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Paper>

          {/* Trainers Grid */}
          <Grid container spacing={3}>
            {dataLoading ? (
              [...Array(4)].map((_, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                  <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
                </Grid>
              ))
            ) : filteredTrainers.length === 0 ? (
              <Grid size={{ xs: 12 }}>
                <Paper sx={{ p: 4, textAlign: "center" }}>
                  <Typography color="text.secondary">Không tìm thấy PT phù hợp với tiêu chí tìm kiếm</Typography>
                </Paper>
              </Grid>
            ) : (
              filteredTrainers.map((trainer, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={trainer._id}>
                  <Grow in timeout={500 + index * 100}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: 6,
                        },
                      }}
                    >
                      <CardContent sx={{ width: "100%", p: 3, flex: 1, display: "flex", flexDirection: "column" }}>
                        {/* Trainer Header */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                          <Avatar src={trainer.userId.avatar} sx={{ width: 60, height: 60 }} />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" fontWeight={600} color="primary">
                              {trainer.userId.fullName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {trainer.specialization}
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                              <Rating value={trainer.rating} readOnly precision={0.1} size="small" />
                              <Typography variant="caption">({trainer.totalBookings})</Typography>
                            </Box>
                          </Box>
                          <Chip
                            label={`${trainer.pricePerSession.toLocaleString("vi-VN")}đ`}
                            color="warning"
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>

                        <Divider sx={{ mb: 2 }} />

                        {/* Available Schedules */}
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" fontWeight={600} gutterBottom>
                            Lịch trống ngày {formatDate(selectedDate)}:
                          </Typography>

                          {getAvailableSchedules(trainer._id).length > 0 ? (
                            <Stack spacing={1}>
                              {getAvailableSchedules(trainer._id).map((schedule, idx) => {
                                const isInCart = bookingCart.some(
                                  (item) =>
                                    item.trainer._id === trainer._id &&
                                    item.schedule.startTime === schedule.startTime &&
                                    item.schedule.endTime === schedule.endTime,
                                )

                                return (
                                  <Box
                                    key={idx}
                                    sx={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      p: 1,
                                      border: "1px solid",
                                      borderColor: isInCart ? "success.main" : "divider",
                                      borderRadius: 1,
                                      bgcolor: isInCart ? "success.50" : "transparent",
                                    }}
                                  >
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                      <Schedule fontSize="small" color={isInCart ? "success" : "info"} />
                                      <Typography variant="body2" fontWeight={500}>
                                        {schedule.startTime} - {schedule.endTime}
                                      </Typography>
                                    </Box>
                                    <Button
                                      size="small"
                                      variant={isInCart ? "outlined" : "contained"}
                                      color={isInCart ? "success" : "primary"}
                                      onClick={() => addToCart(trainer, schedule)}
                                      disabled={isInCart}
                                      startIcon={isInCart ? <CheckCircle /> : <Add />}
                                    >
                                      {isInCart ? "Đã thêm" : "Thêm"}
                                    </Button>
                                  </Box>
                                )
                              })}
                            </Stack>
                          ) : (
                            <Typography variant="body2" color="text.secondary" fontStyle="italic">
                              Không có lịch trống
                            </Typography>
                          )}
                        </Box>

                        {/* Bio */}
                        <Box sx={{ width: "100%", mt: 2 }}>
                          <Typography
                            sx={{ width: "100%" }}
                            variant="caption"
                            color="text.secondary"
                            fontStyle="italic"
                          >
                            {trainer.bio}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grow>
                </Grid>
              ))
            )}
          </Grid>
        </Box>
      )}

      {/* Tab 2: Existing Bookings */}
      {activeTab === 1 && (
        <Box>
          <Grid container spacing={3}>
            {existingBookings.length === 0 ? (
              <Grid size={{ xs: 12 }}>
                <Paper sx={{ p: 4, textAlign: "center" }}>
                  <Typography color="text.secondary">Bạn chưa có lịch đặt nào</Typography>
                  <Button variant="contained" sx={{ mt: 2 }} onClick={() => setActiveTab(0)}>
                    Đặt lịch ngay
                  </Button>
                </Paper>
              </Grid>
            ) : (
              // Group bookings by trainer
              (() => {
                const groupedBookings = existingBookings.reduce((groups, booking) => {
                  const trainerId = booking.trainer._id
                  if (!groups[trainerId]) {
                    groups[trainerId] = []
                  }
                  groups[trainerId].push(booking)
                  return groups
                }, {})

                return Object.values(groupedBookings).map((trainerBookings, groupIndex) => {
                  const trainer = trainerBookings[0].trainer
                  const totalSessions = trainerBookings.length
                  const totalPrice = trainerBookings.reduce((sum, booking) => sum + booking.trainer.pricePerSession, 0)
                  const hasUpcoming = trainerBookings.some(
                    (booking) =>
                      new Date(booking.workDate) >= new Date() &&
                      (booking.status === "confirmed" || booking.status === "pending"),
                  )
                  const hasCompleted = trainerBookings.some((booking) => booking.status === "completed")
                  const hasCancelled = trainerBookings.some((booking) => booking.status === "cancelled")

                  // Determine overall status
                  let overallStatus = "mixed"
                  if (trainerBookings.every((booking) => booking.status === "pending")) overallStatus = "pending"
                  else if (trainerBookings.every((booking) => booking.status === "confirmed"))
                    overallStatus = "confirmed"
                  else if (trainerBookings.every((booking) => booking.status === "completed"))
                    overallStatus = "completed"
                  else if (trainerBookings.every((booking) => booking.status === "cancelled"))
                    overallStatus = "cancelled"

                  return (
                    <Grid size={{ xs: 12, md: 6 }} key={`trainer-${trainer._id}`}>
                      <Card
                        sx={{
                          border: hasUpcoming ? "2px solid" : "1px solid",
                          borderColor: hasUpcoming ? "success.light" : "divider",
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          {/* Header */}
                          <Box
                            sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}
                          >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                              <Avatar src={trainer.userId.avatar} sx={{ width: 60, height: 60 }} />
                              <Box>
                                <Typography variant="h6" fontWeight={600}>
                                  {trainer.userId.fullName}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {trainer.specialization}
                                </Typography>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                                  <Rating value={trainer.rating} readOnly precision={0.1} size="small" />
                                  <Typography variant="caption">({trainer.rating})</Typography>
                                </Box>
                              </Box>
                            </Box>

                            <Stack spacing={1} alignItems="flex-end">
                              <Chip
                                label={`${totalSessions} buổi tập`}
                                color="primary"
                                size="small"
                                variant="outlined"
                              />
                              {overallStatus !== "mixed" && (
                                <Chip
                                  icon={getStatusInfo(overallStatus).icon}
                                  label={getStatusInfo(overallStatus).label}
                                  color={getStatusInfo(overallStatus).color}
                                  size="small"
                                  variant="outlined"
                                />
                              )}
                            </Stack>
                          </Box>

                          <Divider sx={{ mb: 2 }} />

                          {/* Summary */}
                          <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid size={{ xs: 6 }}>
                              <Typography variant="caption" color="text.secondary">
                                Tổng chi phí
                              </Typography>
                              <Typography variant="h6" color="warning.dark" fontWeight={600}>
                                {totalPrice.toLocaleString("vi-VN")}đ
                              </Typography>
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                              <Typography variant="caption" color="text.secondary">
                                Trạng thái
                              </Typography>
                              <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }}>
                                {hasUpcoming && (
                                  <Chip
                                    label="Sắp tới"
                                    color="success"
                                    size="small"
                                    sx={{ fontSize: "0.7rem", height: 20 }}
                                  />
                                )}
                                {hasCompleted && (
                                  <Chip
                                    label="Hoàn thành"
                                    color="info"
                                    size="small"
                                    sx={{ fontSize: "0.7rem", height: 20 }}
                                  />
                                )}
                                {hasCancelled && (
                                  <Chip
                                    label="Đã hủy"
                                    color="error"
                                    size="small"
                                    sx={{ fontSize: "0.7rem", height: 20 }}
                                  />
                                )}
                              </Stack>
                            </Grid>
                          </Grid>

                          {/* Quick session preview */}
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="caption" color="text.secondary" gutterBottom>
                              Các buổi tập gần nhất:
                            </Typography>
                            <Stack spacing={0.5}>
                              {trainerBookings
                                .sort((a, b) => new Date(a.workDate) - new Date(b.workDate))
                                .slice(0, 3)
                                .map((booking, idx) => (
                                  <Box key={booking._id} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
                                      📅 {formatDate(booking.workDate)}
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
                                      ⏰ {booking.startTime} - {booking.endTime}
                                    </Typography>
                                    <Chip
                                      icon={getStatusInfo(booking.status).icon}
                                      label={getStatusInfo(booking.status).label}
                                      color={getStatusInfo(booking.status).color}
                                      size="small"
                                      sx={{ fontSize: "0.65rem", height: 18 }}
                                    />
                                  </Box>
                                ))}
                              {trainerBookings.length > 3 && (
                                <Typography variant="caption" color="text.secondary" fontStyle="italic">
                                  ... và {trainerBookings.length - 3} buổi khác
                                </Typography>
                              )}
                            </Stack>
                          </Box>

                          <Divider sx={{ mb: 2 }} />

                          {/* Actions */}
                          <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => {
                                setSelectedBooking({
                                  ...trainerBookings[0],
                                  allSessions: trainerBookings,
                                })
                                setOpenDetailDialog(true)
                              }}
                            >
                              Chi tiết ({totalSessions})
                            </Button>

                            {trainerBookings.some((booking) => canCancelBooking(booking)) && (
                              <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                onClick={() => {
                                  // Find the first cancellable booking
                                  const cancellableBooking = trainerBookings.find((booking) =>
                                    canCancelBooking(booking),
                                  )
                                  setSelectedBooking(cancellableBooking)
                                  setOpenCancelDialog(true)
                                }}
                              >
                                Hủy lịch
                              </Button>
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  )
                })
              })()
            )}
          </Grid>
        </Box>
      )}

      {/* Floating Cart Button */}
      {activeTab === 0 && bookingCart.length > 0 && (
        <Fab
          color="warning"
          sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 1000,
          }}
          onClick={() => setOpenCartDialog(true)}
        >
          <Badge badgeContent={bookingCart.length} color="error">
            <ShoppingCart />
          </Badge>
        </Fab>
      )}

      {/* Cart Dialog */}
      <Dialog
        open={openCartDialog}
        onClose={() => setOpenCartDialog(false)}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ bgcolor: "warning.main", color: "white" }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="h6" fontWeight={600}>
              Giỏ đặt lịch ({bookingCart.length} buổi)
            </Typography>
            <IconButton onClick={() => setOpenCartDialog(false)} sx={{ color: "white" }}>
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
                            💰 {item.trainer.pricePerSession.toLocaleString("vi-VN")}đ
                          </Typography>
                        </Stack>
                      }
                    />
                    <IconButton edge="end" onClick={() => removeFromCart(item.id)} color="error">
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
                {mockLocations.map((loc) => (
                  <MenuItem key={loc._id} value={loc._id}>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        {loc.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {loc.address}
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
                  • Thanh toán tại quầy lễ tân khi đến tập
                  <br />
                  • Hủy lịch trước 24h để tránh phí
                  <br />• Đến sớm 15 phút để làm thủ tục
                </Typography>
              </Alert>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setOpenCartDialog(false)} color="inherit" variant="outlined">
            Tiếp tục chọn
          </Button>
          <Button
            onClick={handleBookingSubmit}
            variant="contained"
            color="warning"
            disabled={loading || !selectedLocation || bookingCart.length === 0}
            startIcon={loading ? <AutorenewOutlined sx={{ animation: "spin 1s linear infinite" }} /> : <CheckCircle />}
            sx={{ minWidth: 140 }}
          >
            {loading ? "Đang xử lý..." : `Đặt ${bookingCart.length} buổi`}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog
        open={openDetailDialog}
        onClose={() => setOpenDetailDialog(false)}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="h6">
              Chi tiết lịch đặt {selectedBooking?.allSessions ? `(${selectedBooking.allSessions.length} buổi)` : ""}
            </Typography>
            <IconButton onClick={() => setOpenDetailDialog(false)} sx={{ color: "white" }}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedBooking && (
            <Stack spacing={3}>
              {/* Trainer Info */}
              <Paper elevation={0} sx={{ p: 3, bgcolor: "grey.50", borderRadius: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                  <Avatar src={selectedBooking.trainer.userId.avatar} sx={{ width: 80, height: 80 }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h5" fontWeight={600} gutterBottom>
                      {selectedBooking.trainer.userId.fullName}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                      {selectedBooking.trainer.specialization}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Rating value={selectedBooking.trainer.rating} readOnly size="small" />
                      <Typography variant="caption">({selectedBooking.trainer.rating})</Typography>
                    </Box>
                  </Box>
                  {selectedBooking.allSessions && (
                    <Box sx={{ textAlign: "right" }}>
                      <Typography variant="h6" color="primary" fontWeight={600}>
                        {selectedBooking.allSessions.length} buổi tập
                      </Typography>
                      <Typography variant="h5" color="warning.dark" fontWeight={700}>
                        {(selectedBooking.allSessions.length * selectedBooking.trainer.pricePerSession).toLocaleString(
                          "vi-VN",
                        )}
                        đ
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Paper>

              {/* All Sessions or Single Session */}
              {selectedBooking.allSessions ? (
                // Multiple sessions view
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Schedule color="primary" />
                    Danh sách các buổi tập
                  </Typography>

                  <Stack spacing={2}>
                    {selectedBooking.allSessions
                      .sort((a, b) => new Date(a.workDate) - new Date(b.workDate))
                      .map((session, index) => {
                        const statusInfo = getStatusInfo(session.status)
                        const isPast = new Date(session.workDate) < new Date()

                        return (
                          <Paper
                            key={session._id}
                            elevation={0}
                            sx={{
                              p: 2,
                              border: "1px solid",
                              borderColor: "divider",
                              borderRadius: 2,
                              bgcolor: isPast ? "grey.25" : "white",
                            }}
                          >
                            <Grid container spacing={2} alignItems="center">
                              <Grid size={{ xs: 12, sm: 3 }}>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                  Buổi {index + 1}
                                </Typography>
                                <Typography variant="subtitle1" fontWeight={600}>
                                  {formatDate(session.workDate)}
                                </Typography>
                              </Grid>

                              <Grid size={{ xs: 12, sm: 3 }}>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                  Thời gian
                                </Typography>
                                <Typography
                                  variant="subtitle1"
                                  sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                                >
                                  <AccessTime fontSize="small" />
                                  {session.startTime} - {session.endTime}
                                </Typography>
                              </Grid>

                              <Grid size={{ xs: 12, sm: 3 }}>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                  Địa điểm
                                </Typography>
                                <Typography
                                  variant="subtitle1"
                                  sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                                >
                                  <LocationOn fontSize="small" />
                                  {session.location.name}
                                </Typography>
                              </Grid>

                              <Grid size={{ xs: 12, sm: 3 }}>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                  Trạng thái
                                </Typography>
                                <Chip
                                  icon={statusInfo.icon}
                                  label={statusInfo.label}
                                  color={statusInfo.color}
                                  size="small"
                                  variant="outlined"
                                />
                              </Grid>

                              {session.bookingNote && (
                                <Grid size={{ xs: 12 }}>
                                  <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Ghi chú:
                                  </Typography>
                                  <Typography variant="body2" fontStyle="italic">
                                    "{session.bookingNote}"
                                  </Typography>
                                </Grid>
                              )}
                            </Grid>

                            {/* Individual session actions */}
                            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 1 }}>
                              {canCancelBooking(session) && (
                                <Button
                                  size="small"
                                  variant="outlined"
                                  color="error"
                                  onClick={() => {
                                    setSelectedBooking(session)
                                    setOpenDetailDialog(false)
                                    setOpenCancelDialog(true)
                                  }}
                                >
                                  Hủy buổi này
                                </Button>
                              )}
                            </Box>
                          </Paper>
                        )
                      })}
                  </Stack>

                  {/* Summary */}
                  <Paper elevation={0} sx={{ p: 2, bgcolor: "warning.50", borderRadius: 2 }}>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 6, sm: 3 }}>
                        <Typography variant="caption" color="text.secondary">
                          Tổng buổi tập
                        </Typography>
                        <Typography variant="h6" fontWeight={600}>
                          {selectedBooking.allSessions.length}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6, sm: 3 }}>
                        <Typography variant="caption" color="text.secondary">
                          Tổng chi phí
                        </Typography>
                        <Typography variant="h6" color="warning.dark" fontWeight={600}>
                          {(
                            selectedBooking.allSessions.length * selectedBooking.trainer.pricePerSession
                          ).toLocaleString("vi-VN")}
                          đ
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6, sm: 3 }}>
                        <Typography variant="caption" color="text.secondary">
                          Đã hoàn thành
                        </Typography>
                        <Typography variant="h6" color="success.main" fontWeight={600}>
                          {selectedBooking.allSessions.filter((s) => s.status === "completed").length}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6, sm: 3 }}>
                        <Typography variant="caption" color="text.secondary">
                          Sắp tới
                        </Typography>
                        <Typography variant="h6" color="info.main" fontWeight={600}>
                          {
                            selectedBooking.allSessions.filter(
                              (s) =>
                                new Date(s.workDate) >= new Date() &&
                                (s.status === "confirmed" || s.status === "pending"),
                            ).length
                          }
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Box>
              ) : (
                // Single session view (fallback)
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Trạng thái
                    </Typography>
                    <Chip
                      icon={getStatusInfo(selectedBooking.status).icon}
                      label={getStatusInfo(selectedBooking.status).label}
                      color={getStatusInfo(selectedBooking.status).color}
                      variant="outlined"
                    />
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Lịch tập
                    </Typography>
                    <Stack spacing={1}>
                      <Typography variant="body1">📅 {formatDate(selectedBooking.workDate)}</Typography>
                      <Typography variant="body1">
                        ⏰ {selectedBooking.startTime} - {selectedBooking.endTime}
                      </Typography>
                      <Typography variant="body1">📍 {selectedBooking.location.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {selectedBooking.location.address}
                      </Typography>
                    </Stack>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Chi phí
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {selectedBooking.trainer.pricePerSession.toLocaleString("vi-VN")}đ
                    </Typography>
                  </Box>

                  {selectedBooking.bookingNote && (
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Ghi chú
                      </Typography>
                      <Typography variant="body2" fontStyle="italic">
                        "{selectedBooking.bookingNote}"
                      </Typography>
                    </Box>
                  )}

                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Ngày đặt lịch
                    </Typography>
                    <Typography variant="body2">
                      {new Date(selectedBooking.createdAt).toLocaleString("vi-VN")}
                    </Typography>
                  </Box>
                </Stack>
              )}
            </Stack>
          )}
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={openCancelDialog} onClose={() => setOpenCancelDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" color="error">
            Xác nhận hủy lịch
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Box>
              <Alert severity="warning" sx={{ mb: 3 }}>
                Bạn có chắc chắn muốn hủy buổi tập với <strong>{selectedBooking.trainer.userId.fullName}</strong> vào{" "}
                <strong>{formatDate(selectedBooking.workDate)}</strong> lúc{" "}
                <strong>
                  {selectedBooking.startTime} - {selectedBooking.endTime}
                </strong>
                ?
              </Alert>

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Lý do hủy lịch *"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Vui lòng cho biết lý do hủy lịch..."
                error={!cancelReason.trim()}
                helperText={!cancelReason.trim() ? "Vui lòng nhập lý do hủy lịch" : ""}
              />

              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  • Hủy lịch trước 24h: Miễn phí
                  <br />
                  • Hủy lịch trong vòng 24h: Phí 50% giá trị buổi tập
                  <br />• Chúng tôi sẽ liên hệ xác nhận việc hủy lịch trong vòng 30 phút
                </Typography>
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setOpenCancelDialog(false)} color="inherit" variant="outlined">
            Không hủy
          </Button>
          <Button
            onClick={handleCancelBooking}
            color="error"
            variant="contained"
            disabled={loading || !cancelReason.trim()}
            startIcon={loading ? <AutorenewOutlined sx={{ animation: "spin 1s linear infinite" }} /> : <Cancel />}
          >
            {loading ? "Đang xử lý..." : "Xác nhận hủy"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default BookingPage
