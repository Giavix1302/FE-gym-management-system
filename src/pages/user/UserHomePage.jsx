import React, { useEffect } from "react"
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  LinearProgress,
  Divider,
  IconButton,
  CircularProgress,
  Modal,
  Backdrop,
  Fade,
} from "@mui/material"
// icon
import {
  Edit as EditIcon,
  FitnessCenter as FitnessCenterIcon,
  CalendarToday as CalendarIcon,
  Payment as PaymentIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Cake as CakeIcon,
} from "@mui/icons-material"
import CloseIcon from "@mui/icons-material/Close"
// chart
import { LineChart } from "@mui/x-charts/LineChart"
// custom
import GymCalendar from "~/components/Calendar"
//react
import { useState } from "react"
import useUserStore from "~/stores/useUserStore"
import useMyMembershipStore from "~/stores/useMyMembershipStore"
import { calculateProgressPercent, convertISOToVNTime, countRemainingDays } from "~/utils/common"
import { getPaymentsByUserIdAPI } from "~/apis/payment"
import { getListAttendanceByUserIdAPI } from "~/apis/attendance"
import { getUserEventsForThreeMonthsAPI } from "~/apis/user"
import { getDashboardDataAPI } from "~/apis/progress"
import { useNavigate } from "react-router-dom"

// Utility function to format amount
const formatAmount = (amount) => {
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ"
}

// Utility function to get payment type display
const getPaymentTypeDisplay = (paymentType) => {
  switch (paymentType) {
    case "membership":
      return "Gói tập"
    case "booking":
      return "Đặt lịch PT"
    default:
      return paymentType
  }
}

// Helper function to calculate BMI
const calculateBMI = (weight, height = 1.7) => {
  // Default height 1.7m if not provided
  return Math.round((weight / (height * height)) * 10) / 10
}

// Helper function to transform progress data
const transformProgressData = (trendData) => {
  console.log("🚀 ~ transformProgressData ~ trendData:", trendData)
  if (!trendData || trendData.length === 0) return []

  return trendData.map((item) => {
    const date = new Date(item.measurementDate)
    const dayName = date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })

    return {
      month: dayName,
      weight: item.weight,
      bodyFat: item.bodyFat,
      muscleMass: item.muscleMass,
      bmi: calculateBMI(item.weight),
    }
  })
}

// Event Modal Component
function EventModal({ open, event, onClose }) {
  if (!event) return null

  const formatTime = (isoString) => {
    return new Date(isoString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Ho_Chi_Minh",
    })
  }

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Ho_Chi_Minh",
    })
  }

  const getEventTypeDisplay = (eventType) => {
    switch (eventType) {
      case "booking":
        return "Đặt lịch PT"
      case "classSession":
        return "Lớp học"
      default:
        return eventType
    }
  }

  const getEventTypeColor = (eventType) => {
    switch (eventType) {
      case "booking":
        return "primary"
      case "classSession":
        return "secondary"
      default:
        return "default"
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 600 },
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            maxHeight: "90vh",
            overflow: "auto",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h5" fontWeight="bold" color="primary">
              Chi tiết sự kiện
            </Typography>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Event Type */}
            <Box>
              <Chip
                label={getEventTypeDisplay(event.eventType)}
                color={getEventTypeColor(event.eventType)}
                sx={{ mb: 2 }}
              />
              {event.status && <Chip label={event.status} color="error" sx={{ mb: 2, ml: 1 }} />}
              <Typography variant="h6" fontWeight="bold">
                {event.title}
              </Typography>
            </Box>

            {/* Date and Time */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ScheduleIcon color="action" />
              <Box>
                <Typography variant="body1" fontWeight="bold">
                  {formatDate(event.startTime)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatTime(event.startTime)} - {formatTime(event.endTime)}
                </Typography>
              </Box>
            </Box>

            {/* Location */}
            {event.locationName && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LocationIcon color="action" />
                <Box>
                  <Typography variant="body1" fontWeight="bold">
                    Địa điểm
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {event.locationName}
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Room (for class sessions) */}
            {event.roomName && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <FitnessCenterIcon color="action" />
                <Box>
                  <Typography variant="body1" fontWeight="bold">
                    Phòng tập
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {event.roomName}
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Trainer */}
            {event.trainerName && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PersonIcon color="action" />
                <Box>
                  <Typography variant="body1" fontWeight="bold">
                    Huấn luyện viên
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {Array.isArray(event.trainerName) ? event.trainerName.join(", ") : event.trainerName}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Fade>
    </Modal>
  )
}

function UserHomePage() {
  const { user } = useUserStore()
  const { myMembership } = useMyMembershipStore()
  const navigate = useNavigate()

  // State for real data
  const [payments, setPayments] = useState([])
  const [attendances, setAttendances] = useState([])
  const [events, setEvents] = useState([])
  const [progressData, setProgressData] = useState([])
  const [loadingPayments, setLoadingPayments] = useState(true)
  const [loadingAttendances, setLoadingAttendances] = useState(true)
  const [loadingEvents, setLoadingEvents] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(true)

  // Modal state
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  // Transform API events to GymCalendar format
  const transformEventsForCalendar = (apiEvents) => {
    return apiEvents.map((event) => ({
      _id: event._id,
      title: event.title,
      startTime: event.startTime, // Already in ISO format
      endTime: event.endTime, // Already in ISO format
      locationName: event.locationName,
      trainerName: event.trainerName,
      eventType: event.eventType,
      status: event?.status,
      // Add roomName if it's a class session
      roomName: event.roomName || null,
    }))
  }

  // Handle event click
  const handleEventClick = (event) => {
    console.log("🚀 ~ handleEventClick ~ event:", event)
    setSelectedEvent(event)
    setModalOpen(true)
  }

  // Handle modal close
  const handleModalClose = () => {
    setModalOpen(false)
    setSelectedEvent(null)
  }

  useEffect(() => {
    const init = async () => {
      try {
        // Load payments
        setLoadingPayments(true)
        const dataPayment = await getPaymentsByUserIdAPI(user._id)
        if (dataPayment?.success && dataPayment?.payments) {
          setPayments(dataPayment.payments)
        }
        setLoadingPayments(false)

        // Load attendances
        setLoadingAttendances(true)
        const dataAttendance = await getListAttendanceByUserIdAPI(user._id)
        console.log("🚀 ~ init ~ dataAttendance:", dataAttendance)
        if (dataAttendance?.success && dataAttendance?.attendances) {
          setAttendances(dataAttendance.attendances)
        }
        setLoadingAttendances(false)

        // Load events
        setLoadingEvents(true)
        const eventsResponse = await getUserEventsForThreeMonthsAPI(user._id)

        if (eventsResponse?.success && eventsResponse?.data?.events) {
          const transformedEvents = transformEventsForCalendar(eventsResponse.data.events)
          setEvents(transformedEvents)
        }
        setLoadingEvents(false)

        // Load progress data
        setLoadingProgress(true)
        const result = await getDashboardDataAPI(user._id)

        if (result?.success && result?.data?.trendData) {
          const transformedProgressData = transformProgressData(result.data.trendData)
          setProgressData(transformedProgressData)
        }
        setLoadingProgress(false)
      } catch (error) {
        console.error("Error loading data:", error)
        setLoadingPayments(false)
        setLoadingAttendances(false)
        setLoadingEvents(false)
        setLoadingProgress(false)
      }
    }

    if (user?._id) {
      init()
    }
  }, [user._id])

  return (
    <Container sx={{ py: 3 }}>
      {/* Banner Section */}
      <Card sx={{ mb: 3, background: "linear-gradient(135deg, #16697A 0%, #1A7A8A 100%)", color: "white" }}>
        <CardContent sx={{ py: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Avatar src={user.avatar} sx={{ width: 100, height: 100, border: "3px solid white" }} />
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {user.fullName}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="h6">Trạng thái:</Typography>
                <Chip
                  label={user.status === "active" ? "Active" : "Inactive"}
                  color={user.status === "active" ? "success" : "error"}
                  icon={user.status === "active" && <CheckCircleIcon />}
                  sx={{ color: "white", fontWeight: "bold" }}
                />
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Main Info Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Profile Info */}
        <Grid item size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" fontWeight="bold" color="primary">
                  Thông tin cá nhân
                </Typography>
                <IconButton onClick={() => navigate("/user/profile")} color="primary" size="small">
                  <EditIcon />
                </IconButton>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CakeIcon color="action" fontSize="small" />
                  <Typography variant="body2">Tuổi: {user?.age ? user.age : "Chưa cập nhật"}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <PersonIcon color="action" fontSize="small" />
                  <Typography variant="body2">
                    Giới tính: {user?.gender === "male" ? "Nam" : user?.gender === "female" ? "Nữ" : "Chưa cập nhật"}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <PhoneIcon color="action" fontSize="small" />
                  <Typography variant="body2">SĐT: {user.phone}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LocationIcon color="action" fontSize="small" />
                  <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                    Địa chỉ: {user?.address || "Chưa cập nhật"}
                  </Typography>
                </Box>
              </Box>

              <Button
                onClick={() => navigate("/user/profile")}
                variant="outlined"
                fullWidth
                sx={{ mt: 3 }}
                startIcon={<EditIcon />}
              >
                Chỉnh sửa
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Membership Current */}
        <Grid item size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: "100%", border: "2px solid", borderColor: "primary.main" }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
                Gói tập hiện tại
              </Typography>

              <Box sx={{ textAlign: "center", mb: 2 }}>
                <Typography variant="h5" fontWeight="bold" color="primary">
                  {myMembership?.name || "Chưa có gói"}
                </Typography>
                {myMembership?.startDate && myMembership?.endDate && (
                  <Typography variant="body2" color="text.secondary">
                    {convertISOToVNTime(myMembership.startDate)} - {convertISOToVNTime(myMembership.endDate)}
                  </Typography>
                )}
              </Box>

              {myMembership?.startDate && myMembership?.endDate && (
                <>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography variant="body2">Thời hạn gói tập</Typography>
                      <Typography variant="body2">
                        {calculateProgressPercent(myMembership.startDate, myMembership.endDate)} %
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={calculateProgressPercent(myMembership.startDate, myMembership.endDate)}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Còn lại: {countRemainingDays(myMembership.endDate)} ngày
                    </Typography>
                    <Chip label="Còn hạn" color="success" size="small" />
                  </Box>
                </>
              )}

              <Button onClick={() => navigate("/user/membership")} variant="contained" fullWidth sx={{ mt: 1 }}>
                Xem gói tập
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Progress Chart */}
        <Grid item size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
                Tiến độ tập luyện
                {loadingProgress && <CircularProgress size={20} sx={{ ml: 2 }} />}
              </Typography>

              {loadingProgress ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 200 }}>
                  <CircularProgress />
                </Box>
              ) : progressData.length > 0 ? (
                <Box sx={{ height: 200, mb: 2 }}>
                  <LineChart
                    xAxis={[{ dataKey: "month", scaleType: "point" }]}
                    series={[
                      { dataKey: "weight", label: "Cân nặng (kg)", color: "#16697A" },
                      { dataKey: "bodyFat", label: "% Mỡ cơ", color: "#FF4C4C" },
                      { dataKey: "muscleMass", label: "Khối lượng cơ (kg)", color: "#4CAF50" },
                    ]}
                    dataset={progressData}
                    height={200}
                    grid={{ vertical: true, horizontal: true }}
                    slotProps={{
                      legend: {
                        direction: "row",
                        position: { vertical: "bottom", horizontal: "middle" },
                      },
                    }}
                    margin={{ top: 0, right: 10, bottom: 0, left: -10 }}
                  />
                </Box>
              ) : (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 200 }}>
                  <Typography color="text.secondary">Chưa có dữ liệu tiến độ</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Booking Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6" fontWeight="bold" color="primary">
              Lịch đặt PT & Lớp học
              {loadingEvents && <CircularProgress size={20} sx={{ ml: 2 }} />}
            </Typography>
            <Button variant="outlined" startIcon={<CalendarIcon />}>
              Đặt thêm
            </Button>
          </Box>

          {loadingEvents ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 400 }}>
              <CircularProgress />
            </Box>
          ) : (
            <GymCalendar events={events} onEventClick={handleEventClick} />
          )}
        </CardContent>
      </Card>

      {/* Bottom Section */}
      <Grid container spacing={3}>
        {/* Payments History */}
        <Grid item size={{ xs: 12, md: 7 }}>
          <Card sx={{ height: 500, display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", p: 2, minHeight: 0 }}>
              <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
                Lịch sử thanh toán
              </Typography>

              {loadingPayments ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <TableContainer sx={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>Mã GD</TableCell>
                        <TableCell>Loại thanh toán</TableCell>
                        <TableCell align="right">Số tiền</TableCell>
                        <TableCell>Ngày</TableCell>
                        <TableCell>Phương thức</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {payments.map((payment) => (
                        <TableRow key={payment._id} sx={{ py: 6 }}>
                          <TableCell sx={{ fontSize: "0.75rem" }}>{payment._id.slice(-8).toUpperCase()}</TableCell>
                          <TableCell>
                            <Chip
                              label={getPaymentTypeDisplay(payment.paymentType)}
                              color={payment.paymentType === "membership" ? "primary" : "secondary"}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: "bold" }}>
                            {formatAmount(payment.amount)}
                          </TableCell>
                          <TableCell>{convertISOToVNTime(payment.paymentDate)}</TableCell>
                          <TableCell>
                            <Chip label={payment.paymentMethod.toUpperCase()} color="success" size="small" />
                          </TableCell>
                        </TableRow>
                      ))}
                      {payments.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                            <Typography color="text.secondary">Chưa có lịch sử thanh toán</Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Check-in History */}
        <Grid item size={{ xs: 12, md: 5 }}>
          <Card sx={{ height: 500, display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
                Lịch sử check-in
              </Typography>

              {loadingAttendances ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Box sx={{ flex: 1, overflowY: "auto" }}>
                  <List dense>
                    {attendances.map((attendance, index) => (
                      <React.Fragment key={attendance._id}>
                        <ListItem sx={{ px: 0 }}>
                          <ListItemIcon>
                            <CheckCircleIcon color="success" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Box>
                                <Typography variant="body2" fontWeight="bold">
                                  {convertISOToVNTime(attendance.checkinTime)}
                                </Typography>
                                {attendance.checkoutTime && (
                                  <Typography variant="caption" color="text.secondary">
                                    Checkout: {convertISOToVNTime(attendance.checkoutTime)}
                                  </Typography>
                                )}
                              </Box>
                            }
                            secondary={
                              <Box>
                                <Typography variant="body2">{attendance.location?.name}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {attendance.location?.address?.street}, {attendance.location?.address?.ward}
                                </Typography>
                                {attendance.hours >= 0 && (
                                  <Typography variant="caption" display="block" color="primary">
                                    Thời gian tập: {attendance.hours.toFixed(1)} giờ
                                  </Typography>
                                )}
                              </Box>
                            }
                          />
                        </ListItem>
                        {index < attendances.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                    {attendances.length === 0 && (
                      <ListItem>
                        <ListItemText
                          primary={
                            <Typography align="center" color="text.secondary">
                              Chưa có lịch sử check-in
                            </Typography>
                          }
                        />
                      </ListItem>
                    )}
                  </List>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Event Modal */}
      <EventModal open={modalOpen} event={selectedEvent} onClose={handleModalClose} />
    </Container>
  )
}

export default UserHomePage
