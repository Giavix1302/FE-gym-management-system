import React, { useState, useMemo, useEffect } from "react"
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Stack,
  Tabs,
  Tab,
  Chip,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  IconButton,
  Badge,
  useTheme,
  useMediaQuery,
} from "@mui/material"
import {
  CalendarMonth as CalendarIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Star as StarIcon,
  AccessTime as AccessTimeIcon,
  Search as SearchIcon,
  EventAvailable as EventAvailableIcon,
  History as HistoryIcon,
  AttachMoney as AttachMoneyIcon,
  Note as NoteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Add as AddIcon,
} from "@mui/icons-material"
import GymCalendar from "~/components/Calendar"
import BookingDetailModal from "./BookingDetailModal"
import { updateTrainerAdviceAPI } from "~/apis/booking"
import { theme } from "~/theme"
import useTrainerInfoStore from "~/stores/useTrainerInfoStore"
import dayjs from "dayjs"
import { createScheduleForPtAPI } from "~/apis/schedule"
import { toast } from "react-toastify"
import DateField from "~/components/DateField"
import TimeField from "~/components/TimeField"
import useListScheduleForPTStore from "~/stores/useListScheduleForPTStore"

// Booking List Item Component
function BookingListItem({ booking, onViewDetails, onAddAdvice }) {
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
      case "booking":
        return "Đang đặt"
      default:
        return status
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const formatDateTime = (dateString) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString("vi-VN"),
      time: date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
    }
  }

  const startTime = formatDateTime(booking.startTime)
  const endTime = formatDateTime(booking.endTime)

  return (
    <Card sx={{ mb: 2, borderRadius: 2 }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item size={{ xs: 12, sm: 3 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: "primary.light", width: 48, height: 48 }}>
                {booking.booking.userInfo.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  {booking.booking.userInfo.fullName}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                >
                  <PhoneIcon fontSize="inherit" />
                  {booking.booking.userInfo.phone}
                </Typography>
              </Box>
            </Stack>
          </Grid>

          <Grid item size={{ xs: 12, sm: 2 }}>
            <Stack spacing={0.5}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
              >
                <AccessTimeIcon fontSize="small" />
                {startTime.date}
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {startTime.time} - {endTime.time}
              </Typography>
            </Stack>
          </Grid>

          <Grid item size={{ xs: 12, sm: 2 }}>
            <Stack spacing={0.5}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
              >
                <LocationIcon fontSize="small" />
                {booking.booking.locationName || "Chưa xác định"}
              </Typography>
              {booking.booking.address && booking.booking.address.street && (
                <Typography variant="caption">
                  {booking.booking.address.street}, {booking.booking.address.ward}
                </Typography>
              )}
            </Stack>
          </Grid>

          <Grid item size={{ xs: 12, sm: 2 }}>
            <Stack spacing={1}>
              <Chip
                label={getStatusText(booking.booking.status)}
                color={getStatusColor(booking.booking.status)}
                size="small"
              />
              <Typography variant="body2" fontWeight="bold" color="success.main">
                {formatCurrency(booking.booking.price || 0)}
              </Typography>
            </Stack>
          </Grid>

          <Grid item size={{ xs: 12, sm: 3 }}>
            <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center">
              {booking.booking.review && booking.booking.review.rating && (
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <StarIcon fontSize="small" sx={{ color: "warning.main" }} />
                  <Typography variant="caption">{booking.booking.review.rating}</Typography>
                </Stack>
              )}

              <IconButton size="small" onClick={() => onViewDetails(booking)}>
                <VisibilityIcon fontSize="small" />
              </IconButton>

              {booking.booking.status === "completed" && (
                <IconButton size="small" color="primary" onClick={() => onAddAdvice(booking)}>
                  <EditIcon fontSize="small" />
                </IconButton>
              )}
            </Stack>
          </Grid>
        </Grid>

        {booking.booking.note && (
          <Box sx={{ mt: 2, p: 1.5, bgcolor: "grey.50", borderRadius: 1 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
            >
              <NoteIcon fontSize="small" />
              Ghi chú: {booking.booking.note}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

// Main Component
export default function TrainerBookingPage() {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const { trainerInfo } = useTrainerInfoStore()
  const { listSchedule, setListSchedule, updateSchedule } = useListScheduleForPTStore()
  console.log("🚀 ~ TrainerBookingPage ~ listSchedule:", listSchedule)

  // States
  const [tabValue, setTabValue] = useState(0)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filters, setFilters] = useState({
    status: "all",
    location: "all",
    sortBy: "time",
    search: "",
  })

  // States for creating new schedule
  const [scheduleDateValue, setScheduleDateValue] = useState(null)
  const [startTimeValue, setStartTimeValue] = useState({
    hour: 0,
    minute: 0,
  })
  const [endTimeValue, setEndTimeValue] = useState({
    hour: 0,
    minute: 0,
  })

  // Helper function to check if schedule has booking data
  const hasBookingData = (schedule) => {
    return (
      schedule.booking &&
      schedule.booking.userInfo &&
      Object.keys(schedule.booking.userInfo).length > 0 &&
      schedule.booking.userInfo.fullName
    )
  }

  // Event click handler
  const handleEventClick = (event) => {
    // GymCalendar passes the event object directly, not wrapped in eventInfo.event
    const schedule = listSchedule.find((s) => s._id === event.id)
    if (schedule) {
      handleViewDetails(schedule)
    }
  }

  // Filter and sort bookings - only include schedules with actual booking data
  const filteredBookings = useMemo(() => {
    let filtered = listSchedule.filter(hasBookingData)

    // Status filter
    if (filters.status !== "all") {
      filtered = filtered.filter((schedule) => schedule.booking.status === filters.status)
    }

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(
        (schedule) =>
          schedule.booking.userInfo.fullName.toLowerCase().includes(filters.search.toLowerCase()) ||
          schedule.booking.userInfo.phone.includes(filters.search) ||
          (schedule.booking.locationName &&
            schedule.booking.locationName.toLowerCase().includes(filters.search.toLowerCase())),
      )
    }

    // Sort
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "time":
          return new Date(a.startTime) - new Date(b.startTime)
        case "price":
          return (b.booking.price || 0) - (a.booking.price || 0)
        case "status":
          return (a.booking.status || "").localeCompare(b.booking.status || "")
        default:
          return 0
      }
    })

    return filtered
  }, [listSchedule, filters, hasBookingData])

  // Split bookings by time
  const now = new Date()
  const upcomingBookings = filteredBookings.filter((booking) => new Date(booking.startTime) >= now)
  const pastBookings = filteredBookings.filter((booking) => new Date(booking.startTime) < now)

  // Helper function to get event color based on status
  const getEventColor = (status) => {
    switch (status) {
      case "confirmed":
        return "#4caf50"
      case "pending":
        return "#ff9800"
      case "completed":
        return "#2196f3"
      case "cancelled":
        return "#f44336"
      case "booking":
        return "#9c27b0"
      default:
        return "#9e9e9e"
    }
  }

  // Calendar events
  const calendarEvents = useMemo(() => {
    return listSchedule.map((schedule) => {
      if (hasBookingData(schedule)) {
        // Schedule with booking data
        return {
          id: schedule._id,
          title: `${schedule.booking.userInfo.fullName} - ${schedule.booking.locationName || "Chưa xác định địa điểm"}`,
          startTime: schedule.startTime, // Use startTime instead of start
          endTime: schedule.endTime, // Use endTime instead of end
          backgroundColor: getEventColor(schedule.booking.status),
          borderColor: getEventColor(schedule.booking.status),
        }
      } else {
        // Empty schedule slot
        return {
          id: schedule._id,
          title: "Slot trống",
          startTime: schedule.startTime, // Use startTime instead of start
          endTime: schedule.endTime, // Use endTime instead of end
          backgroundColor: "#e0e0e0",
          borderColor: "#bdbdbd",
        }
      }
    })
  }, [listSchedule])

  // Handlers
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking)
    setIsModalOpen(true)
  }

  const handleAddAdvice = (booking) => {
    setSelectedBooking(booking)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedBooking(null)
  }

  // const handleSaveAdvice = (bookingId, advice) => {
  //   // Handle save advice logic
  //   console.log("Save advice for booking:", bookingId, advice)

  //   updateTrainerAdviceAPI
  //   handleCloseModal()
  // }

  const handleSaveAdvice = async (scheduleId, advice) => {
    try {
      // Tìm schedule bằng scheduleId để lấy bookingId
      const scheduleToUpdate = listSchedule.find((schedule) => schedule._id === scheduleId)

      if (!scheduleToUpdate || !scheduleToUpdate.booking?.bookingId) {
        toast.error("Không tìm thấy booking để cập nhật")
        return
      }

      const bookingId = scheduleToUpdate.booking.bookingId

      // Gọi API với bookingId
      const result = await updateTrainerAdviceAPI(bookingId, advice)

      if (result.success) {
        // Cập nhật schedule với trainerAdvice mới
        updateSchedule(scheduleToUpdate._id, {
          booking: {
            ...scheduleToUpdate.booking,
            trainerAdvice: result.booking.trainerAdvice,
          },
        })

        toast.success("Đã lưu lời khuyên thành công!")
        handleCloseModal()
      } else {
        toast.error(result.message || "Không thể lưu lời khuyên")
      }
    } catch (error) {
      console.error("Failed to save advice:", error)
      toast.error("Có lỗi xảy ra khi lưu lời khuyên")
    }
  }

  const handleDeleteSlot = (bookingId) => {
    // Handle delete slot logic
    console.log("Delete slot for booking:", bookingId)
    handleCloseModal()
  }

  // Add schedule handler with booking refresh fix
  const handleAddSchedule = async () => {
    try {
      console.log("🚀 ~ handleAddSchedule ~ scheduleDateValue:", scheduleDateValue)
      console.log("🚀 ~ handleAddSchedule ~ startTimeValue:", startTimeValue)
      console.log("🚀 ~ handleAddSchedule ~ endTimeValue:", endTimeValue)

      // Validation
      if (!scheduleDateValue) {
        toast.error("Vui lòng chọn ngày")
        return
      }

      if (startTimeValue.hour === 0 && startTimeValue.minute === 0) {
        toast.error("Vui lòng chọn giờ bắt đầu")
        return
      }

      if (endTimeValue.hour === 0 && endTimeValue.minute === 0) {
        toast.error("Vui lòng chọn giờ kết thúc")
        return
      }

      // Convert scheduleDateValue to dayjs if it's not already
      let dateValue = scheduleDateValue
      if (
        typeof scheduleDateValue === "object" &&
        scheduleDateValue.day &&
        scheduleDateValue.month &&
        scheduleDateValue.year
      ) {
        // If scheduleDateValue is in {day, month, year} format
        dateValue = dayjs(
          `${scheduleDateValue.year}-${scheduleDateValue.month.toString().padStart(2, "0")}-${scheduleDateValue.day.toString().padStart(2, "0")}`,
        )
      } else if (!dayjs.isDayjs(scheduleDateValue)) {
        // If it's not a dayjs object, try to parse it
        dateValue = dayjs(scheduleDateValue)
      }

      // Check if the date is valid
      if (!dateValue || !dateValue.isValid()) {
        toast.error("Ngày không hợp lệ")
        return
      }

      const startTime = dateValue
        .hour(startTimeValue.hour)
        .minute(startTimeValue.minute)
        .second(0)
        .millisecond(0)
        .toISOString()

      const endTime = dateValue
        .hour(endTimeValue.hour)
        .minute(endTimeValue.minute)
        .second(0)
        .millisecond(0)
        .toISOString()

      console.log("🚀 ~ handleAddSchedule ~ startTime:", startTime)
      console.log("🚀 ~ handleAddSchedule ~ endTime:", endTime)

      const dataToSend = {
        trainerId: trainerInfo._id,
        startTime,
        endTime,
      }

      const result = await createScheduleForPtAPI(dataToSend)
      console.log("🚀 ~ handleAddSchedule ~ result:", result)

      // Create new schedule object with proper structure
      const newSchedule = {
        _id: result?.newSchedule._id,
        startTime: startTime,
        endTime: endTime,
        booking: {
          userInfo: {},
          address: {},
          review: {
            rating: null,
            comment: "",
          },
        },
      }

      // Update list schedule store
      setListSchedule([...listSchedule, newSchedule])
      console.log("🚀 ~ handleAddSchedule ~ newSchedule:", newSchedule)

      // Reset input
      setScheduleDateValue(null)
      setStartTimeValue({
        hour: 0,
        minute: 0,
      })
      setEndTimeValue({
        hour: 0,
        minute: 0,
      })

      // Notification
      toast.success("Thêm lịch thành công")
    } catch (err) {
      console.error("Error creating schedule:", err)
      toast.error("Có lỗi khi tạo lịch")
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Quản lý lịch booking
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Quản lý các buổi tập 1-on-1 với học viên
        </Typography>
      </Box>

      {/* Calendar Section */}
      <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CalendarIcon color="primary" />
            Lịch booking
          </Typography>
        </Stack>

        <Grid container spacing={2} sx={{ mt: 1, px: 3 }}>
          <Grid item size={{ xs: 12, sm: 4 }}>
            <DateField label="Chọn ngày" setValue={setScheduleDateValue} />
          </Grid>

          <Grid item size={{ xs: 12, sm: 3 }}>
            <TimeField
              label="Giờ bắt đầu"
              value={dayjs(`${startTimeValue.hour}:${startTimeValue.minute}`, "HH:mm")}
              setDetailValue={setStartTimeValue}
            />
          </Grid>

          <Grid item size={{ xs: 12, sm: 3 }}>
            <TimeField
              label="Giờ kết thúc"
              value={dayjs(`${endTimeValue.hour}:${endTimeValue.minute}`, "HH:mm")}
              setDetailValue={setEndTimeValue}
            />
          </Grid>
          <Grid item size={{ xs: 12, sm: 2 }}>
            <Button fullWidth variant="contained" onClick={() => handleAddSchedule()}>
              Tạo
            </Button>
          </Grid>
        </Grid>

        <GymCalendar events={calendarEvents} onEventClick={handleEventClick} />
      </Paper>

      {/* Booking List Section */}
      <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Danh sách booking
        </Typography>

        {/* Filters */}
        <Card variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item size={{ xs: 12, sm: 3 }}>
              <TextField
                fullWidth
                placeholder="Tìm kiếm..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                size="small"
              />
            </Grid>

            <Grid item size={{ xs: 12, sm: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  label="Trạng thái"
                >
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="pending">Chờ xác nhận</MenuItem>
                  <MenuItem value="confirmed">Đã xác nhận</MenuItem>
                  <MenuItem value="completed">Hoàn thành</MenuItem>
                  <MenuItem value="cancelled">Đã hủy</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item size={{ xs: 12, sm: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Địa điểm</InputLabel>
                <Select
                  value={filters.location}
                  onChange={(e) => handleFilterChange("location", e.target.value)}
                  label="Địa điểm"
                >
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="gym1">Gym Center Q1</MenuItem>
                  <MenuItem value="gym2">Fitness World Q3</MenuItem>
                  <MenuItem value="gym3">Elite Fitness Q7</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item size={{ xs: 12, sm: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Sắp xếp</InputLabel>
                <Select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                  label="Sắp xếp"
                >
                  <MenuItem value="time">Thời gian</MenuItem>
                  <MenuItem value="price">Giá tiền</MenuItem>
                  <MenuItem value="status">Trạng thái</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Card>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab
              label={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <EventAvailableIcon />
                  <span>Sắp tới</span>
                  <Badge badgeContent={upcomingBookings.length} color="primary" />
                </Stack>
              }
            />
            <Tab
              label={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <HistoryIcon />
                  <span>Lịch sử</span>
                  <Badge badgeContent={pastBookings.length} color="default" />
                </Stack>
              }
            />
          </Tabs>
        </Box>

        {/* Booking List */}
        <Box sx={{ minHeight: 400 }}>
          {tabValue === 0 && (
            <Box>
              {upcomingBookings.length > 0 ? (
                upcomingBookings.map((booking) => (
                  <BookingListItem
                    key={booking._id}
                    booking={booking}
                    onViewDetails={handleViewDetails}
                    onAddAdvice={handleAddAdvice}
                  />
                ))
              ) : (
                <Box sx={{ textAlign: "center", py: 6 }}>
                  <EventAvailableIcon sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
                  <Typography variant="h6" color="text.disabled">
                    Không có booking sắp tới
                  </Typography>
                  <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
                    Chưa có lịch booking nào được đặt trong thời gian tới
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {tabValue === 1 && (
            <Box>
              {pastBookings.length > 0 ? (
                pastBookings.map((booking) => (
                  <BookingListItem
                    key={booking._id}
                    booking={booking}
                    onViewDetails={handleViewDetails}
                    onAddAdvice={handleAddAdvice}
                  />
                ))
              ) : (
                <Box sx={{ textAlign: "center", py: 6 }}>
                  <HistoryIcon sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
                  <Typography variant="h6" color="text.disabled">
                    Chưa có lịch sử booking
                  </Typography>
                  <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
                    Bạn chưa có buổi tập nào đã hoàn thành
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Paper>

      {/* Booking Detail Modal */}
      <BookingDetailModal
        booking={selectedBooking}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSaveAdvice={handleSaveAdvice}
        onDeleteSlot={handleDeleteSlot}
      />
    </Container>
  )
}
