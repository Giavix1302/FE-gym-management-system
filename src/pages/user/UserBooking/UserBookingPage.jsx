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
  Fab,
  Badge,
} from "@mui/material"
import {
  FilterList,
  Search,
  Event,
  Schedule,
  Close,
  CheckCircle,
  Info,
  AutorenewOutlined,
  Cancel,
  Add,
  ShoppingCart,
  CheckCircleOutline,
  HourglassEmpty,
  CancelOutlined,
} from "@mui/icons-material"
import { theme } from "~/theme"
import BookingCartModal from "./BookingCartModal"
import BookedDetailModal from "./BookedDetailModal"
import PTDetailModal from "./BookingDetailPtModal"
import { SelectPaymentModal } from "~/components/SelectPaymentModal"
import { getListTrainerForUserAPI } from "~/apis/trainer"
import useListTrainerInfoForUser from "~/stores/useListTrainerInfoForUser"
import useLocationStore from "~/stores/useLocationStore"
import useUserStore from "~/stores/useUserStore"
import { createLinkVnpayBookingPaymentAPI } from "~/apis/payment"
import { getUpcomingBookingsByUserIdAPI } from "~/apis/booking"

function UserBookingPage() {
  // store
  const { user } = useUserStore()
  const { listTrainerInfo, setListTrainerInfo } = useListTrainerInfoForUser()
  const { locations } = useLocationStore()

  // Main states
  const [activeTab, setActiveTab] = useState(0)
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date()
    today.setDate(today.getDate() + 1) // Default to tomorrow
    return today.toISOString().split("T")[0]
  })
  const [specialization, setSpecialization] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [trainers, setTrainers] = useState([])
  const [dataLoading, setDataLoading] = useState(true)

  // Booking cart states
  const [bookingCart, setBookingCart] = useState([])
  const [selectedLocation, setSelectedLocation] = useState("")
  const [bookingNote, setBookingNote] = useState("")

  // Existing bookings - now using real API data
  const [existingBookings, setExistingBookings] = useState([])

  // Dialog states
  const [openCartDialog, setOpenCartDialog] = useState(false)
  const [openDetailDialog, setOpenDetailDialog] = useState(false)
  const [openCancelDialog, setOpenCancelDialog] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [cancelReason, setCancelReason] = useState("")

  // Payment modal states
  const [openPaymentModal, setOpenPaymentModal] = useState(false)
  const [showPayButton, setShowPayButton] = useState(false)

  // PT Detail Modal states
  const [openPTDetailDialog, setOpenPTDetailDialog] = useState(false)
  const [selectedTrainer, setSelectedTrainer] = useState(null)

  // UI states
  const [loading, setLoading] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  // Transform API data to component format
  const transformTrainerData = (apiTrainers) => {
    if (!apiTrainers || !Array.isArray(apiTrainers)) return []

    return apiTrainers.map((trainer) => {
      const userInfo = trainer?.userInfo || trainer?.userId || {}

      return {
        _id: trainer?._id || "",
        userId: {
          fullName: userInfo?.fullName || "Không có tên",
          avatar: userInfo?.avatar || "",
          email: userInfo?.email || "",
        },
        specialization: trainer?.trainerInfo?.specialization || "Chưa xác định",
        bio: trainer?.trainerInfo?.bio || "Chưa có thông tin",
        experience: trainer?.trainerInfo?.experience || "Chưa xác định",
        education: trainer?.trainerInfo?.education || "Chưa có thông tin",
        rating: trainer?.review?.rating || 0,
        totalBookings: trainer?.review?.totalBookings || 0,
        pricePerSession: parseInt(trainer?.trainerInfo?.pricePerSession) || 500000,
        physiqueImages: trainer?.trainerInfo?.physiqueImages || [],
        schedule: trainer?.schedule || [],
      }
    })
  }

  // Transform real API booking data to component format
  const transformBookingData = (apiBookings) => {
    if (!apiBookings || !Array.isArray(apiBookings)) return []

    return apiBookings.map((booking) => {
      // Transform the API structure to match component expectations
      return {
        _id: booking.allSessions?.[0]?.bookingId || `booking_${Date.now()}`,
        trainer: {
          trainerId: booking.trainer?.trainerId || "",
          userInfo: {
            fullName: booking.trainer?.userInfo?.fullName || "Unknown Trainer",
            avatar: booking.trainer?.userInfo?.avatar || "",
            email: booking.trainer?.userInfo?.email || "",
            phone: booking.trainer?.userInfo?.phone || "",
          },
          specialization: booking.trainer?.specialization || "Chưa xác định",
          rating: booking.trainer?.rating || 0,
          pricePerSession: parseInt(booking.trainer?.pricePerSession) || 0,
        },
        allSessions:
          booking.allSessions?.map((session) => ({
            bookingId: session.bookingId,
            startTime: session.startTime,
            endTime: session.endTime,
            location: {
              _id: session.location?._id || "",
              name: session.location?.name || "Unknown Location",
              address: session.location?.address
                ? typeof session.location.address === "string"
                  ? session.location.address
                  : `${session.location.address.street || ""}, ${session.location.address.ward || ""}, ${session.location.address.province || ""}`.replace(
                      /^,\s*|,\s*$/g,
                      "",
                    )
                : "No address available",
            },
            status: session.status || "unknown",
            price: session.price || 0,
            note: session.note || "",
          })) || [],
        paymentMethod: "VNPay", // Default payment method
        createdAt: new Date().toISOString(), // Default creation date
      }
    })
  }

  // Transform schedule data to match expected format
  const transformScheduleData = (apiTrainers, selectedDate) => {
    if (!apiTrainers || !Array.isArray(apiTrainers)) return []

    const schedules = []

    apiTrainers.forEach((trainer) => {
      if (trainer?.schedule && Array.isArray(trainer.schedule)) {
        trainer.schedule.forEach((scheduleItem) => {
          if (!scheduleItem?.startTime || !scheduleItem?.endTime) return

          try {
            const startDate = new Date(scheduleItem.startTime)
            const endDate = new Date(scheduleItem.endTime)
            const scheduleDate = startDate.toISOString().split("T")[0]

            if (scheduleDate === selectedDate) {
              schedules.push({
                _id: scheduleItem._id || "",
                trainerId: trainer._id || "",
                workDate: scheduleDate,
                startTime: startDate.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
                endTime: endDate.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
                isBooked: false,
                originalStartTime: scheduleItem.startTime,
                originalEndTime: scheduleItem.endTime,
              })
            }
          } catch (error) {
            console.error("Error processing schedule item:", error, scheduleItem)
          }
        })
      }
    })

    return schedules
  }

  useEffect(() => {
    const init = async () => {
      try {
        setDataLoading(true)

        // Fetch trainers
        const trainerResponse = await getListTrainerForUserAPI()
        console.log("🚀 ~ init ~ trainerResponse:", trainerResponse)
        if (trainerResponse?.listTrainerInfo) {
          setListTrainerInfo(trainerResponse.listTrainerInfo)
          const transformedTrainers = transformTrainerData(trainerResponse.listTrainerInfo)
          setTrainers(transformedTrainers)
        }

        // Fetch user bookings
        if (user?._id) {
          const bookingResponse = await getUpcomingBookingsByUserIdAPI(user._id)
          console.log("🚀 ~ init ~ bookingResponse:", bookingResponse)

          if (bookingResponse?.success && bookingResponse?.bookings) {
            const transformedBookings = transformBookingData(bookingResponse.bookings)
            console.log("🚀 ~ init ~ transformedBookings:", transformedBookings)
            setExistingBookings(transformedBookings)
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        setSnackbar({
          open: true,
          message: "Lỗi khi tải dữ liệu",
          severity: "error",
        })
      } finally {
        setDataLoading(false)
      }
    }

    init()
  }, [setListTrainerInfo, user?._id])

  // Update schedules when date or trainer data changes
  useEffect(() => {
    if (listTrainerInfo && listTrainerInfo.length > 0) {
      const transformedSchedules = transformScheduleData(listTrainerInfo, selectedDate)
      console.log("Transformed schedules for", selectedDate, ":", transformedSchedules)
    }
  }, [listTrainerInfo, selectedDate])

  const getAvailableSchedules = (trainerId) => {
    if (!listTrainerInfo || !trainerId) return []

    const trainer = listTrainerInfo.find((t) => t?._id === trainerId)
    if (!trainer?.schedule || !Array.isArray(trainer.schedule)) return []

    return trainer.schedule
      .map((scheduleItem) => {
        if (!scheduleItem?.startTime || !scheduleItem?.endTime) return null

        try {
          const startDate = new Date(scheduleItem.startTime)
          const endDate = new Date(scheduleItem.endTime)
          const scheduleDate = startDate.toISOString().split("T")[0]

          if (scheduleDate === selectedDate) {
            return {
              _id: scheduleItem._id || "",
              startTime: startDate.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
              endTime: endDate.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
              originalStartTime: scheduleItem.startTime,
              originalEndTime: scheduleItem.endTime,
              isBooked: false,
            }
          }
          return null
        } catch (error) {
          console.error("Error processing schedule item:", error)
          return null
        }
      })
      .filter(Boolean)
  }

  const addToCart = (trainer, schedule) => {
    if (!trainer?._id || !schedule?.startTime || !schedule?.endTime) {
      setSnackbar({
        open: true,
        message: "Dữ liệu không hợp lệ",
        severity: "error",
      })
      return
    }

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
    return bookingCart.reduce((total, item) => {
      const price = item?.trainer?.pricePerSession || item?.trainer?.userId?.pricePerSession || 0
      return total + price
    }, 0)
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

    setShowPayButton(true)
  }

  const handlePayNow = () => {
    setOpenPaymentModal(true)
  }

  const handlePaymentMethodSelect = async (paymentMethodId, paymentMethodData) => {
    setLoading(true)

    try {
      const newBookings = bookingCart.map((item, index) => {
        const location = Array.isArray(locations) ? locations.find((loc) => loc?._id === selectedLocation) : null

        return {
          trainer: item?.trainer || {},
          workDate: item?.workDate || selectedDate,
          schedule: item?.schedule || {},
          location: location || { _id: selectedLocation, name: "Unknown Location" },
          status: "pending",
          bookingNote: bookingNote || "",
          paymentMethod: paymentMethodData?.name || "Unknown",
        }
      })

      const dataToCreatePaymentURL = newBookings.map((booking) => {
        const trainerName =
          booking?.trainer?.userId?.fullName || booking?.trainer?.userInfo?.fullName || "Unknown Trainer"
        const userName = user?.fullName || "Unknown User"

        return {
          title: `PT ${trainerName} - Huấn luyện 1 kèm 1 cùng ${userName}`,
          userId: user?._id || "",
          scheduleId: booking?.schedule?._id || "",
          locationId: booking?.location?._id || "",
          price: booking?.trainer?.pricePerSession || 0,
          note: booking?.bookingNote || "",
        }
      })

      const paymentInfo = await createLinkVnpayBookingPaymentAPI(dataToCreatePaymentURL)

      if (paymentInfo?.paymentUrl) {
        window.open(paymentInfo.paymentUrl, "_blank")
      }

      setExistingBookings((prev) => [...prev, ...newBookings])
      setBookingCart([])
      setSelectedLocation("")
      setBookingNote("")
      setShowPayButton(false)
      setOpenPaymentModal(false)
      setOpenCartDialog(false)
      setActiveTab(1)

      setSnackbar({
        open: true,
        message: `Thanh toán thành công! Đã đặt ${newBookings.length} lịch tập.`,
        severity: "success",
      })
    } catch (error) {
      console.error("Payment error:", error)
      setSnackbar({
        open: true,
        message: "Lỗi thanh toán. Vui lòng thử lại!",
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusInfo = (status) => {
    switch (status) {
      case "confirmed":
      case "booking":
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
        booking?._id === selectedBooking?._id ? { ...booking, status: "cancelled" } : booking,
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
    if (!booking?.allSessions || booking.allSessions.length === 0) return false

    try {
      // Check if any upcoming session can be cancelled
      return booking.allSessions.some((session) => {
        const sessionDate = new Date(session.startTime)
        const now = new Date()
        const timeDiff = sessionDate.getTime() - now.getTime()
        const hoursDiff = timeDiff / (1000 * 3600)

        return (
          hoursDiff > 24 &&
          (session.status === "confirmed" || session.status === "pending" || session.status === "booking")
        )
      })
    } catch (error) {
      console.error("Error checking cancel eligibility:", error)
      return false
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Invalid Date"

    try {
      return new Date(dateString).toLocaleDateString("vi-VN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Invalid Date"
    }
  }

  const handleCancelSession = (session) => {
    setSelectedBooking(session)
    setOpenDetailDialog(false)
    setOpenCancelDialog(true)
  }

  const handleShowPTDetails = (trainer) => {
    setSelectedTrainer(trainer)
    setOpenPTDetailDialog(true)
  }

  const filteredTrainers = trainers.filter((trainer) => {
    if (!trainer) return false

    const matchSpecialization =
      specialization === "all" ||
      (trainer?.specialization && trainer.specialization.toLowerCase().includes(specialization.toLowerCase()))

    const trainerName = trainer?.userId?.fullName || ""
    const trainerSpec = trainer?.specialization || ""

    const matchSearch =
      searchTerm === "" ||
      trainerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainerSpec.toLowerCase().includes(searchTerm.toLowerCase())

    return matchSpecialization && matchSearch
  })

  const createPaymentSummaryCard = () => (
    <Card sx={{ mb: 2, bgcolor: "grey.50" }}>
      <CardContent sx={{ p: 2 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Tóm tắt đơn hàng
        </Typography>
        <Stack spacing={1}>
          {bookingCart.map((item, index) => (
            <Box key={item?.id || index} sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2">
                {"Thuê PT "}
                {item?.trainer?.userId?.fullName || item?.trainer?.userInfo?.fullName || "Unknown"} -{" "}
                {formatDate(item?.workDate)} ({item?.schedule?.startTime} {" - "}
                {item?.schedule?.endTime})
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {(item?.trainer?.pricePerSession || 0).toLocaleString("vi-VN")}đ
              </Typography>
            </Box>
          ))}
          <Divider />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="subtitle1" fontWeight={700}>
              Tổng cộng:
            </Typography>
            <Typography variant="subtitle1" fontWeight={700} color="warning.dark">
              {getTotalPrice().toLocaleString("vi-VN")}đ
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">
            Chi nhánh:{" "}
            {Array.isArray(locations) ? locations.find((loc) => loc?._id === selectedLocation)?.name : "Unknown"}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
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
                  <MenuItem value="gym">Gym</MenuItem>
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
              filteredTrainers.map((trainer, index) => {
                if (!trainer?._id) return null

                return (
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
                            <Avatar
                              src={
                                trainer?.userId?.avatar ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(trainer?.userId?.fullName || "Unknown")}&background=random`
                              }
                              sx={{
                                width: 60,
                                height: 60,
                                cursor: "pointer",
                                "&:hover": { transform: "scale(1.1)" },
                              }}
                              onClick={() => handleShowPTDetails(trainer)}
                            >
                              {(trainer?.userId?.fullName || "U").charAt(0)}
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                              <Typography
                                variant="h6"
                                fontWeight={600}
                                color="primary"
                                sx={{
                                  cursor: "pointer",
                                  "&:hover": { textDecoration: "underline" },
                                }}
                                onClick={() => handleShowPTDetails(trainer)}
                              >
                                {trainer?.userId?.fullName || "Unknown Trainer"}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {trainer?.specialization || "No specialization"}
                              </Typography>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                                <Rating value={trainer?.rating || 0} readOnly precision={0.1} size="small" />
                                <Typography variant="caption">({trainer?.totalBookings || 0})</Typography>
                              </Box>
                            </Box>
                            <Chip
                              label={`${(trainer?.pricePerSession || 0).toLocaleString("vi-VN")}đ`}
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
                                  if (!schedule?.startTime || !schedule?.endTime) return null

                                  const isInCart = bookingCart.some(
                                    (item) =>
                                      item?.trainer?._id === trainer._id &&
                                      item?.schedule?.startTime === schedule.startTime &&
                                      item?.schedule?.endTime === schedule.endTime,
                                  )

                                  return (
                                    <Box
                                      key={schedule._id || idx}
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

                          {/* Bio and Detail Button */}
                          <Box sx={{ width: "100%", mt: 2 }}>
                            <Typography
                              sx={{ width: "100%", mb: 1 }}
                              variant="caption"
                              color="text.secondary"
                              fontStyle="italic"
                            >
                              {trainer?.bio || "Chưa có thông tin"}
                            </Typography>

                            <Button
                              fullWidth
                              variant="outlined"
                              size="small"
                              color="info"
                              onClick={() => handleShowPTDetails(trainer)}
                              startIcon={<Info />}
                            >
                              Xem chi tiết PT
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grow>
                  </Grid>
                )
              })
            )}
          </Grid>
        </Box>
      )}

      {/* Tab 2: Existing Bookings */}
      {activeTab === 1 && (
        <Box>
          <Grid container spacing={3}>
            {dataLoading ? (
              [...Array(3)].map((_, index) => (
                <Grid size={{ xs: 12, md: 6 }} key={index}>
                  <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
                </Grid>
              ))
            ) : existingBookings.length === 0 ? (
              <Grid size={{ xs: 12 }}>
                <Paper sx={{ p: 4, textAlign: "center" }}>
                  <Typography color="text.secondary">Bạn chưa có lịch đặt nào</Typography>
                  <Button variant="contained" sx={{ mt: 2 }} onClick={() => setActiveTab(0)}>
                    Đặt lịch ngay
                  </Button>
                </Paper>
              </Grid>
            ) : (
              existingBookings
                .map((booking, index) => {
                  // Safety check for booking structure
                  if (!booking || !booking.trainer || !booking.allSessions || !Array.isArray(booking.allSessions)) {
                    console.warn("Invalid booking structure:", booking)
                    return null
                  }

                  // Helper function to format date from ISO string
                  const formatISODate = (isoString) => {
                    if (!isoString) return "N/A"
                    try {
                      return new Date(isoString).toLocaleDateString("vi-VN", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    } catch (error) {
                      console.error("Error formatting date:", error)
                      return "Invalid Date"
                    }
                  }

                  // Helper function to format time from ISO string
                  const formatISOTime = (isoString) => {
                    if (!isoString) return "N/A"
                    try {
                      return new Date(isoString).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    } catch (error) {
                      console.error("Error formatting time:", error)
                      return "Invalid Time"
                    }
                  }

                  // Determine booking status based on sessions
                  const getBookingStatus = (sessions) => {
                    if (!sessions || sessions.length === 0) return "unknown"
                    if (sessions.every((s) => s?.status === "completed")) return "completed"
                    if (sessions.every((s) => s?.status === "cancelled")) return "cancelled"
                    if (sessions.some((s) => s?.status === "pending")) return "pending"
                    if (sessions.some((s) => s?.status === "booking")) return "booking"
                    return "mixed"
                  }

                  // Safe data access with fallbacks
                  const trainerInfo = booking.trainer?.userInfo || {}
                  const trainerName = trainerInfo?.fullName || "Unknown Trainer"
                  const trainerAvatar = trainerInfo?.avatar || ""
                  const trainerSpecialization = booking.trainer?.specialization || "Chưa xác định"
                  const trainerRating = booking.trainer?.rating || 0
                  const pricePerSession = parseInt(booking.trainer?.pricePerSession) || 0

                  const isMultiSession = booking.allSessions && booking.allSessions.length > 1
                  const overallStatus = getBookingStatus(booking.allSessions)
                  const statusInfo = getStatusInfo(overallStatus)

                  // Calculate session statistics
                  const completedSessions = booking.allSessions.filter((s) => s?.status === "completed").length
                  const upcomingSessions = booking.allSessions.filter((s) => {
                    if (!s?.startTime) return false
                    try {
                      return new Date(s.startTime) >= new Date() && (s.status === "booking" || s.status === "pending")
                    } catch {
                      return false
                    }
                  }).length

                  // Find next upcoming session
                  const nextSession = booking.allSessions
                    .filter((s) => {
                      if (!s?.startTime) return false
                      try {
                        return new Date(s.startTime) >= new Date() && s.status !== "cancelled"
                      } catch {
                        return false
                      }
                    })
                    .sort((a, b) => {
                      try {
                        return new Date(a.startTime) - new Date(b.startTime)
                      } catch {
                        return 0
                      }
                    })[0]

                  return (
                    <Grid size={{ xs: 12, md: 6 }} key={booking._id || index}>
                      <Grow in timeout={300 + index * 100}>
                        <Card
                          sx={{
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            opacity: overallStatus === "cancelled" ? 0.7 : 1,
                            border: upcomingSessions > 0 ? "2px solid" : "1px solid",
                            borderColor: upcomingSessions > 0 ? "success.main" : "divider",
                            "&:hover": {
                              transform: "translateY(-2px)",
                              boxShadow: 4,
                            },
                          }}
                          onClick={() => {
                            setSelectedBooking(booking)
                            setOpenDetailDialog(true)
                          }}
                        >
                          <CardContent sx={{ p: 3 }}>
                            {/* Header with Status */}
                            <Box
                              sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}
                            >
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                {isMultiSession && (
                                  <Chip
                                    label={`${booking.allSessions.length} buổi`}
                                    color="info"
                                    size="small"
                                    sx={{ fontSize: "0.75rem" }}
                                  />
                                )}
                                <Typography variant="caption" color="text.secondary">
                                  Đặt:{" "}
                                  {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString("vi-VN") : "N/A"}
                                </Typography>
                              </Box>
                              <Chip
                                icon={statusInfo.icon}
                                label={statusInfo.label}
                                color={statusInfo.color}
                                size="small"
                                variant="outlined"
                              />
                            </Box>

                            {/* Trainer Info */}
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                              <Avatar src={trainerAvatar} sx={{ width: 50, height: 50 }}>
                                {trainerName.charAt(0)}
                              </Avatar>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" fontWeight={600} color="primary">
                                  {trainerName}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {trainerSpecialization}
                                </Typography>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                                  <Rating value={trainerRating} readOnly size="small" />
                                  <Typography variant="caption">({trainerRating})</Typography>
                                </Box>
                              </Box>
                            </Box>

                            <Divider sx={{ mb: 2 }} />

                            {/* Session Details */}
                            {isMultiSession ? (
                              <Box>
                                <Typography
                                  variant="subtitle2"
                                  gutterBottom
                                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                                >
                                  <Schedule color="primary" />
                                  Gói {booking.allSessions.length} buổi tập
                                </Typography>

                                {/* Session Summary Grid */}
                                <Grid container spacing={2} sx={{ mb: 2 }}>
                                  <Grid size={{ xs: 6 }}>
                                    <Paper sx={{ p: 1, textAlign: "center", bgcolor: "success.50" }}>
                                      <Typography variant="caption" color="text.secondary">
                                        Đã hoàn thành
                                      </Typography>
                                      <Typography variant="h6" color="success.main" fontWeight={600}>
                                        {completedSessions}
                                      </Typography>
                                    </Paper>
                                  </Grid>
                                  <Grid size={{ xs: 6 }}>
                                    <Paper sx={{ p: 1, textAlign: "center", bgcolor: "info.50" }}>
                                      <Typography variant="caption" color="text.secondary">
                                        Sắp tới
                                      </Typography>
                                      <Typography variant="h6" color="info.main" fontWeight={600}>
                                        {upcomingSessions}
                                      </Typography>
                                    </Paper>
                                  </Grid>
                                </Grid>

                                {/* Next Session Info */}
                                {nextSession ? (
                                  <Box sx={{ bgcolor: "grey.50", p: 1.5, borderRadius: 1, mb: 1 }}>
                                    <Typography variant="body2" fontWeight={600} gutterBottom>
                                      Buổi tiếp theo:
                                    </Typography>
                                    <Typography variant="body2">📅 {formatISODate(nextSession.startTime)}</Typography>
                                    <Typography variant="body2">
                                      ⏰ {formatISOTime(nextSession.startTime)} - {formatISOTime(nextSession.endTime)}
                                    </Typography>
                                    <Typography variant="body2">
                                      📍 {nextSession.location?.name || "Unknown Location"}
                                    </Typography>
                                  </Box>
                                ) : (
                                  <Box sx={{ bgcolor: "grey.50", p: 1.5, borderRadius: 1, mb: 1 }}>
                                    <Typography variant="body2" color="text.secondary" fontStyle="italic">
                                      Tất cả buổi tập đã hoàn thành
                                    </Typography>
                                  </Box>
                                )}

                                <Typography variant="h6" color="warning.dark" fontWeight={600}>
                                  Tổng:{" "}
                                  {booking.allSessions
                                    .reduce((total, item) => {
                                      console.log("🚀 ~ item:", item)

                                      return (total += item.price)
                                    }, 0)
                                    .toLocaleString("vi-VN")}
                                  đ
                                </Typography>
                              </Box>
                            ) : (
                              <Box>
                                {booking.allSessions[0] && (
                                  <Box
                                    sx={{
                                      bgcolor: (() => {
                                        try {
                                          return new Date(booking.allSessions[0].startTime) < new Date()
                                            ? "grey.50"
                                            : "primary.50"
                                        } catch {
                                          return "grey.50"
                                        }
                                      })(),
                                      p: 1.5,
                                      borderRadius: 1,
                                      mb: 2,
                                    }}
                                  >
                                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                                      📅 {formatISODate(booking.allSessions[0].startTime)}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                                      ⏰ {formatISOTime(booking.allSessions[0].startTime)} -{" "}
                                      {formatISOTime(booking.allSessions[0].endTime)}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                                      📍 {booking.allSessions[0].location?.name || "Unknown Location"}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {booking.allSessions[0].location?.address || ""}
                                    </Typography>
                                  </Box>
                                )}
                                <Typography variant="h6" color="primary" fontWeight={600}>
                                  {booking.allSessions
                                    .reduce((total, item) => {
                                      console.log("🚀 ~ item:", item)

                                      return (total += item.price)
                                    }, 0)
                                    .toLocaleString("vi-VN")}
                                  đ
                                </Typography>
                              </Box>
                            )}

                            {/* Booking Note Preview */}
                            {booking.allSessions[0]?.note && (
                              <Box sx={{ mt: 2, p: 1, bgcolor: "info.50", borderRadius: 1 }}>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{
                                    display: "block",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  💬 {booking.allSessions[0].note}
                                </Typography>
                              </Box>
                            )}

                            {/* Payment Method */}
                            <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1 }}>
                              <Typography variant="caption" color="text.secondary">
                                Thanh toán:
                              </Typography>
                              <Chip
                                label={booking.paymentMethod || "N/A"}
                                size="small"
                                variant="outlined"
                                color="default"
                              />
                            </Box>

                            {/* Action Buttons */}
                            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}>
                              {upcomingSessions > 0 && (
                                <Button
                                  size="small"
                                  variant="outlined"
                                  color="error"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setSelectedBooking(booking)
                                    setOpenCancelDialog(true)
                                  }}
                                  startIcon={<Cancel />}
                                >
                                  Hủy lịch
                                </Button>
                              )}
                              <Button
                                size="small"
                                variant="outlined"
                                color="primary"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedBooking(booking)
                                  setOpenDetailDialog(true)
                                }}
                                startIcon={<Info />}
                              >
                                Chi tiết
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grow>
                    </Grid>
                  )
                })
                .filter(Boolean) // Remove null entries
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

      {/* Booking Cart Modal */}
      <BookingCartModal
        open={openCartDialog}
        onClose={() => {
          setOpenCartDialog(false)
          setShowPayButton(false)
        }}
        bookingCart={bookingCart}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        bookingNote={bookingNote}
        setBookingNote={setBookingNote}
        locations={locations}
        loading={loading}
        onSubmit={handleBookingSubmit}
        onRemoveFromCart={removeFromCart}
        getTotalPrice={getTotalPrice}
        formatDate={formatDate}
        showPayButton={showPayButton}
        onPayNow={handlePayNow}
      />

      {/* Payment Modal */}
      <SelectPaymentModal
        open={openPaymentModal}
        onClose={() => setOpenPaymentModal(false)}
        title="Thanh toán đặt lịch tập"
        subtitle="Hoàn tất thanh toán để xác nhận lịch tập"
        summaryCard={createPaymentSummaryCard()}
        onPaymentMethodSelect={handlePaymentMethodSelect}
        confirmButtonText="Xác nhận thanh toán"
        cancelButtonText="Hủy thanh toán"
        isProcessing={loading}
      />

      {/* PT Detail Modal */}
      <PTDetailModal
        open={openPTDetailDialog}
        onClose={() => setOpenPTDetailDialog(false)}
        trainer={selectedTrainer}
        selectedDate={selectedDate}
        availableSchedules={selectedTrainer ? getAvailableSchedules(selectedTrainer._id) : []}
        bookingCart={bookingCart}
        onAddToCart={addToCart}
        formatDate={formatDate}
      />

      <BookedDetailModal
        open={openDetailDialog}
        onClose={() => setOpenDetailDialog(false)}
        selectedBooking={selectedBooking}
        formatDate={formatDate}
        onCancelSession={handleCancelSession}
        canCancelBooking={canCancelBooking}
      />

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
                Bạn có chắc chắn muốn hủy buổi tập với{" "}
                <strong>{selectedBooking.trainer?.userInfo?.fullName || "Unknown Trainer"}</strong>?
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

export default UserBookingPage
