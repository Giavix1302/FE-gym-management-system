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
import { getBookingsByTrainerIdAPI } from "~/apis/booking"
import { theme } from "~/theme"
import useTrainerInfoStore from "~/stores/useTrainerInfoStore"
import dayjs from "dayjs"
import { convertToISODateRange } from "~/utils/common"
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
                {booking.booking.locationName}
              </Typography>
              <Typography variant="caption">
                {booking.booking.address.street}, {booking.booking.address.ward}
              </Typography>
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
                {formatCurrency(booking.booking.price)}
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
  const { listSchedule, setListSchedule } = useListScheduleForPTStore()

  // States
  const [bookings, setBooking] = useState([])
  const [tabValue, setTabValue] = useState(0)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filters, setFilters] = useState({
    status: "all",
    location: "all",
    sortBy: "time",
    search: "",
  })
  const [scheduleDateValue, setScheduleDateValue] = useState({ day: 0, month: 0, year: 0 })
  const [startTimeValue, setStartTimeValue] = useState({
    hour: 0,
    minute: 0,
  })
  const [endTimeValue, setEndTimeValue] = useState({
    hour: 0,
    minute: 0,
  })

  useEffect(() => {
    const init = async () => {
      const result = await getBookingsByTrainerIdAPI(trainerInfo._id)
      setBooking(result.bookings)
    }
    init()
  }, [])

  // Convert bookings to calendar events format
  const calendarEvents = useMemo(() => {
    return listSchedule.map((booking) => {
      // Check if this booking has actual booking data
      const hasBookingData =
        booking.booking && booking.booking.userInfo && Object.keys(booking.booking.userInfo).length > 0

      if (hasBookingData) {
        return {
          _id: booking._id,
          title: booking.title || booking.booking.title,
          startTime: booking.startTime,
          endTime: booking.endTime,
          status: booking.booking.status,
          member: booking.booking.userInfo.fullName,
          location: booking.booking.locationName,
          note: booking.booking.note,
          ...booking.booking,
          bookingId: booking.booking.bookingId,
          userInfo: booking.booking.userInfo,
          locationName: booking.booking.locationName,
          address: booking.booking.address,
          price: booking.booking.price,
          review: booking.booking.review,
        }
      } else {
        // This is just a schedule slot without booking
        return {
          _id: booking._id,
          title: "Slot trống",
          startTime: booking.startTime,
          endTime: booking.endTime,
          status: "available",
          member: null,
          location: "Chưa xác định",
          note: "Slot thời gian trống cho booking",
          isAvailableSlot: true,
        }
      }
    })
  }, [bookings])

  // Filter and sort bookings - only include bookings with actual booking data
  const filteredBookings = useMemo(() => {
    let filtered = listSchedule.filter((booking) => {
      // Only include bookings that have actual booking data
      return booking.booking && booking.booking.userInfo && Object.keys(booking.booking.userInfo).length > 0
    })

    if (filters.status !== "all") {
      filtered = filtered.filter((booking) => booking.booking.status === filters.status)
    }

    if (filters.search) {
      filtered = filtered.filter(
        (booking) =>
          booking.booking.userInfo.fullName.toLowerCase().includes(filters.search.toLowerCase()) ||
          booking.booking.locationName.toLowerCase().includes(filters.search.toLowerCase()),
      )
    }

    filtered.sort((a, b) => {
      if (filters.sortBy === "time") {
        return new Date(b.startTime) - new Date(a.startTime)
      }
      return 0
    })

    return filtered
  }, [filters, bookings])

  // Separate upcoming and past bookings
  const upcomingBookings = filteredBookings.filter((booking) => new Date(booking.startTime) > new Date())

  const pastBookings = filteredBookings.filter((booking) => new Date(booking.startTime) <= new Date())

  // Event handlers
  const handleEventClick = (event) => {
    setSelectedBooking(event)
    setIsModalOpen(true)
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

  const handleSaveAdvice = (bookingId, newAdvice) => {
    console.log("Saving advice for booking:", bookingId, newAdvice)
    // Here you would typically call an API to save the advice
    // For now, just close the modal
    handleCloseModal()
  }

  const handleDeleteSlot = async (slotId) => {
    try {
      // Add your delete API call here
      // await deleteSlotAPI(slotId)

      // Remove from local state
      // const updatedBookings = listSchedule.filter((booking) => booking._id !== slotId)
      // setBooking(updatedBookings)

      // Show success message
      console.log("Slot deleted successfully")
    } catch (error) {
      console.error("Error deleting slot:", error)
      // Show error message
    }
  }

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAddSchedule = async () => {
    // check empty
    if (!scheduleDateValue.day || !scheduleDateValue.month || !scheduleDateValue.year) {
      toast.error("Vui lòng chọn ngày")
      return
    }

    if (startTimeValue.hour === 0 && startTimeValue.minute === 0) {
      toast.error("Vui lòng chọn giờ bắt đầu và giờ bắt đầu từ 8:00")
      return
    }

    if (endTimeValue.hour === 0 && endTimeValue.minute === 0) {
      toast.error("Vui lòng chọn giờ kết thúc")
      return
    }

    try {
      // convert
      const isoDate = convertToISODateRange(scheduleDateValue, startTimeValue, endTimeValue)

      const dataToCreate = {
        trainerId: trainerInfo._id,
        startTime: isoDate.startISO,
        endTime: isoDate.endISO,
      }
      const result = await createScheduleForPtAPI(dataToCreate)
      setListSchedule(result.listSchedule)

      setStartTimeValue({
        hour: 0,
        minute: 0,
      })

      setEndTimeValue({
        hour: 0,
        minute: 0,
      })

      // notification
      toast.success("Thêm lịch thành công")
    } catch (err) {}
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
