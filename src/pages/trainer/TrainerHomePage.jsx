import React, { useEffect, useState } from "react"
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  IconButton,
  AppBar,
  Toolbar,
  Badge,
  Menu,
  MenuItem,
  LinearProgress,
  Modal,
  Backdrop,
  Fade,
  CircularProgress,
} from "@mui/material"
import {
  Dashboard,
  FitnessCenter,
  People,
  Schedule,
  TrendingUp,
  Event,
  Person,
  Notifications,
  Settings,
  ExitToApp,
  CheckCircle,
  Cancel,
  AccessTime,
  Assignment,
  MonetizationOn,
  PersonPin,
  CalendarMonth,
  LocationOn,
  School,
  Group,
} from "@mui/icons-material"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import AutorenewIcon from "@mui/icons-material/Autorenew"
import CancelIcon from "@mui/icons-material/Cancel"
import CloseIcon from "@mui/icons-material/Close"

// Import GymCalendar component
import GymCalendar from "~/components/Calendar"
import useUserStore from "~/stores/useUserStore"
import useTrainerInfoStore from "~/stores/useTrainerInfoStore"
import { getTrainerDashboardStatsAPI, getTrainerEventsForThreeMonthsAPI } from "~/apis/trainer"
import { useNavigate } from "react-router-dom"

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
        return "Huấn luyện 1 kèm 1"
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
              Chi tiết lịch dạy
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
              <Typography variant="h6" fontWeight="bold">
                {event.title}
              </Typography>
            </Box>

            {/* Date and Time */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Schedule color="action" />
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
                <LocationOn color="action" />
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
                <FitnessCenter color="action" />
                <Box>
                  <Typography variant="body1" fontWeight="bold">
                    Phòng học
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {event.roomName}
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Student Name (for bookings) */}
            {event.userName && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Person color="action" />
                <Box>
                  <Typography variant="body1" fontWeight="bold">
                    Học viên
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {event.userName}
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Price (for bookings) */}
            {event.price && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <MonetizationOn color="action" />
                <Box>
                  <Typography variant="body1" fontWeight="bold">
                    Giá tiền
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: "bold", color: "#16697A" }}>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(event.price)}
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Class capacity (for class sessions) */}
            {event.capacity && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Group color="action" />
                <Box>
                  <Typography variant="body1" fontWeight="bold">
                    Sức chứa lớp
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {event.enrolledCount || 0}/{event.capacity} học viên
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Class Session Info */}
            {event.sessionNumber && event.totalSessions && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <School color="action" />
                <Box>
                  <Typography variant="body1" fontWeight="bold">
                    Buổi học
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Buổi {event.sessionNumber}/{event.totalSessions}
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Note */}
            {event.note && event.note.trim() && (
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                <Assignment color="action" />
                <Box>
                  <Typography variant="body1" fontWeight="bold">
                    Ghi chú
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {event.note}
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

const TrainerHomePage = () => {
  const navigate = useNavigate()

  const { user } = useUserStore()
  const { trainerInfo } = useTrainerInfoStore()

  const [dataTrainerDashboardStats, setDataTrainerDashboardStats] = useState({})
  const [events, setEvents] = useState([])
  const [upcomingClasses, setUpcomingClasses] = useState([])
  const [personalBookings, setPersonalBookings] = useState([])
  const [loading, setLoading] = useState(true)

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)

  const renderStatusChip = (status) => {
    switch (status) {
      case "approved":
        return (
          <Chip
            label="Đã xác thực"
            icon={<CheckCircleIcon color="success.light" />}
            sx={{
              mt: 1,
              bgcolor: "success.main",
              color: "background.paper",
            }}
          />
        )

      case "pending":
        return (
          <Chip
            label="Đang được duyệt"
            icon={<AutorenewIcon color="warning.light" />}
            sx={{
              mt: 1,
              bgcolor: "warning.main",
              color: "background.paper",
            }}
          />
        )

      case "rejected":
        return (
          <Chip
            label="Bị từ chối"
            icon={<CancelIcon color="error.light" />}
            sx={{
              mt: 1,
              bgcolor: "error.main",
              color: "background.paper",
            }}
          />
        )

      default:
        return null
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  // Hàm chuyển đổi dữ liệu API thành format events cho calendar
  const convertApiEventsToCalendarEvents = (apiEvents) => {
    return apiEvents.map((apiEvent) => {
      // Xác định loại event
      const eventType = apiEvent.userName ? "booking" : "classSession"

      return {
        title: apiEvent.title,
        startTime: apiEvent.startTime,
        endTime: apiEvent.endTime,
        locationName: apiEvent.locationName,
        userName: apiEvent.userName,
        roomName: apiEvent.roomName,
        note: apiEvent.note || "",
        sessionNumber: apiEvent.sessionNumber,
        totalSessions: apiEvent.totalSessions,
        eventType: eventType,
        price: apiEvent.price,
        enrolledCount: apiEvent.enrolledCount,
        capacity: apiEvent.capacity,
      }
    })
  }

  // Hàm lọc và format dữ liệu cho upcoming classes (chỉ classSession, 3 buổi sắp tới)
  const getUpcomingClasses = (apiEvents) => {
    const now = new Date()
    const classSessions = apiEvents
      .filter((event) => !event.userName) // Không có userName nghĩa là class session
      .filter((event) => new Date(event.startTime) > now) // Chỉ lấy events trong tương lai
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime)) // Sắp xếp theo thời gian
      .slice(0, 3) // Chỉ lấy 3 buổi đầu

    return classSessions.map((session) => ({
      id: session._id || Math.random(),
      name: session.title,
      time:
        new Date(session.startTime).toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }) +
        " - " +
        new Date(session.endTime).toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      room: session.roomName || "Phòng không xác định",
      attendees: session.enrolledCount || 0,
      capacity: session.capacity || 10,
      sessionNumber: session.sessionNumber,
      totalSessions: session.totalSessions,
    }))
  }

  // Hàm lọc và format dữ liệu cho personal bookings (chỉ booking, 3 buổi sắp tới)
  const getPersonalBookings = (apiEvents) => {
    const now = new Date()
    const bookings = apiEvents
      .filter((event) => event.userName) // Có userName nghĩa là booking
      .filter((event) => new Date(event.startTime) > now) // Chỉ lấy events trong tương lai
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime)) // Sắp xếp theo thời gian
      .slice(0, 3) // Chỉ lấy 3 buổi đầu

    return bookings.map((booking) => {
      const startDate = new Date(booking.startTime)
      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(today.getDate() + 1)

      let dateDisplay = ""
      if (startDate.toDateString() === today.toDateString()) {
        dateDisplay = "Hôm nay"
      } else if (startDate.toDateString() === tomorrow.toDateString()) {
        dateDisplay = "Mai"
      } else {
        dateDisplay = startDate.toLocaleDateString("vi-VN")
      }

      return {
        id: booking._id || Math.random(),
        clientName: booking.userName,
        time:
          new Date(booking.startTime).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }) +
          " - " +
          new Date(booking.endTime).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
        date: dateDisplay,
        location: booking.locationName,
        price: booking.price,
        note: booking.note,
      }
    })
  }

  // Handle event click
  const handleEventClick = (event) => {
    setSelectedEvent(event)
    setModalOpen(true)
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setSelectedEvent(null)
  }

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true)

        // Lấy thống kê dashboard
        if (!trainerInfo._id) return
        const dataTrainerDashboardStats = await getTrainerDashboardStatsAPI(user._id)
        setDataTrainerDashboardStats(dataTrainerDashboardStats?.stats)

        // Lấy events của trainer
        const trainerEvents = await getTrainerEventsForThreeMonthsAPI(user._id)

        if (trainerEvents?.success && trainerEvents?.events) {
          // Chuyển đổi dữ liệu cho calendar
          const calendarEvents = convertApiEventsToCalendarEvents(trainerEvents.events)
          setEvents(calendarEvents)

          // Lấy dữ liệu cho upcoming classes
          const upcomingClassesData = getUpcomingClasses(trainerEvents.events)
          setUpcomingClasses(upcomingClassesData)

          // Lấy dữ liệu cho personal bookings
          const personalBookingsData = getPersonalBookings(trainerEvents.events)
          setPersonalBookings(personalBookingsData)
        }
      } catch (error) {
        console.error("Error fetching trainer data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user?._id) {
      init()
    }
  }, [user._id])

  return (
    <Container sx={{ py: 3 }}>
      <Grid container spacing={3}>
        {/* Welcome Section - Row 1 */}
        <Grid item size={{ xs: 12 }}>
          <Paper
            sx={{
              p: 3,
              background: "linear-gradient(135deg, #16697A 0%, #489FB5 100%)",
              color: "white",
              borderRadius: 2,
            }}
          >
            <Grid container spacing={3} alignItems="flex-start">
              <Grid item>
                <Avatar src={user.avatar} sx={{ width: 110, height: 110 }} />
              </Grid>
              <Grid item>
                <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                  Chào mừng
                </Typography>
                <Typography variant="h4" sx={{ mb: 1.5 }}>
                  {user.fullName}
                </Typography>
                {renderStatusChip(trainerInfo.isApproved)}
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Stats Cards - Row 2 */}
        <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Lịch dạy kèm tuần này
                  </Typography>
                  <Typography variant="h4" sx={{ color: "#16697A" }}>
                    {dataTrainerDashboardStats.weeklyBookingSessions || 0}
                  </Typography>
                </Box>
                <Schedule sx={{ fontSize: 40, color: "#489FB5" }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Lịch dạy lớp tuần này
                  </Typography>
                  <Typography variant="h4" sx={{ color: "#16697A" }}>
                    {dataTrainerDashboardStats.weeklyClassSessions || 0}
                  </Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 40, color: "#489FB5" }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Số buổi hoàng thành tháng này
                  </Typography>
                  <Typography variant="h4" sx={{ color: "#16697A" }}>
                    {dataTrainerDashboardStats.monthlyCompletedSessions || 0}
                  </Typography>
                </Box>
                <People sx={{ fontSize: 40, color: "#489FB5" }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Doanh thu tháng
                  </Typography>
                  <Typography variant="h4" sx={{ color: "#16697A" }}>
                    {formatPrice(dataTrainerDashboardStats.monthlyRevenue || 0)}
                  </Typography>
                </Box>
                <MonetizationOn sx={{ fontSize: 40, color: "#FFA62B" }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Calendar Section - Row 3 (Full Width) */}
        <Grid item size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: "#16697A" }}>
                <CalendarMonth sx={{ mr: 1, verticalAlign: "middle" }} />
                Lịch dạy của tôi
                {loading && <CircularProgress size={20} sx={{ ml: 2 }} />}
              </Typography>
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 400 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <GymCalendar events={events} onEventClick={handleEventClick} />
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Classes and Personal Bookings - Row 4 */}
        <Grid item size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: "#16697A" }}>
                <Event sx={{ mr: 1, verticalAlign: "middle" }} />
                Lịch dạy lớp sắp tới
              </Typography>
              <List sx={{ maxHeight: 400, overflow: "auto" }}>
                {upcomingClasses.length > 0 ? (
                  upcomingClasses.map((class_, index) => (
                    <React.Fragment key={class_.id}>
                      <ListItem>
                        <ListItemIcon>
                          <Group sx={{ color: "#489FB5" }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                              <Typography variant="subtitle1">{class_.name}</Typography>
                              {class_.capacity > 0 ? (
                                <Chip
                                  label={`${class_.attendees}/${class_.capacity}`}
                                  size="small"
                                  sx={{
                                    backgroundColor: class_.attendees === 0 ? "#FFA62B" : "#82C0CC",
                                    color: class_.attendees === 0 ? "white" : "#16697A",
                                  }}
                                />
                              ) : (
                                <Chip
                                  label="Chưa có học viên"
                                  size="small"
                                  sx={{
                                    backgroundColor: "#FFA62B",
                                    color: "white",
                                  }}
                                />
                              )}
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="textSecondary">
                                {class_.time} • {class_.room}
                              </Typography>
                              {class_.sessionNumber && class_.totalSessions && (
                                <Typography variant="body2" color="primary" sx={{ fontWeight: "bold" }}>
                                  Buổi {class_.sessionNumber}/{class_.totalSessions}
                                </Typography>
                              )}
                              {class_.capacity > 0 && (
                                <LinearProgress
                                  variant="determinate"
                                  value={(class_.attendees / class_.capacity) * 100}
                                  sx={{
                                    mt: 1,
                                    height: 4,
                                    borderRadius: 2,
                                    backgroundColor: "#EDE7E3",
                                    "& .MuiLinearProgress-bar": {
                                      backgroundColor: class_.attendees === 0 ? "#FFA62B" : "#489FB5",
                                    },
                                  }}
                                />
                              )}
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < upcomingClasses.length - 1 && <Divider />}
                    </React.Fragment>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText
                      primary={
                        <Typography align="center" color="text.secondary">
                          Không có lịch dạy lớp sắp tới
                        </Typography>
                      }
                    />
                  </ListItem>
                )}
              </List>
              <Box mt={2}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => {
                    navigate("/pt/class")
                  }}
                  sx={{
                    color: "#16697A",
                    borderColor: "#16697A",
                    "&:hover": {
                      borderColor: "#16697A",
                      backgroundColor: "rgba(22, 105, 122, 0.04)",
                    },
                  }}
                >
                  Xem tất cả lớp học
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <Typography variant="h6" gutterBottom sx={{ color: "#16697A" }}>
                <PersonPin sx={{ mr: 1, verticalAlign: "middle" }} />
                Lịch kèm 1vs1 sắp tới
              </Typography>
              <List sx={{ overflow: "auto", flex: 1 }}>
                {personalBookings.length > 0 ? (
                  personalBookings.map((booking, index) => (
                    <React.Fragment key={booking.id}>
                      <ListItem sx={{ px: 0, py: 0 }}>
                        <Avatar
                          sx={{
                            bgcolor: "#16697A",
                            mr: 2,
                            width: 48,
                            height: 48,
                            fontSize: "1.2rem",
                          }}
                        >
                          {booking.clientName.charAt(0)}
                        </Avatar>
                        <ListItemText
                          primary={
                            <Box sx={{ mb: 0.5 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#16697A" }}>
                                {booking.clientName}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                                <Schedule sx={{ fontSize: 16, color: "text.secondary", mr: 0.5 }} />
                                <Typography variant="body2" color="textSecondary">
                                  {booking.date} • {booking.time}
                                </Typography>
                              </Box>

                              {booking.location && (
                                <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                                  <LocationOn sx={{ fontSize: 16, color: "text.secondary", mr: 0.5 }} />
                                  <Typography variant="body2" color="textSecondary">
                                    {booking.location}
                                  </Typography>
                                </Box>
                              )}

                              {booking.price && (
                                <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                                  <MonetizationOn sx={{ fontSize: 16, color: "#FFA62B", mr: 0.5 }} />
                                  <Typography variant="body2" sx={{ color: "#FFA62B", fontWeight: "bold" }}>
                                    {formatPrice(booking.price)}
                                  </Typography>
                                </Box>
                              )}

                              {booking.note && booking.note.trim() && (
                                <Box sx={{ display: "flex", alignItems: "flex-start", mt: 0.5 }}>
                                  <Assignment sx={{ fontSize: 16, color: "text.secondary", mr: 0.5, mt: 0.2 }} />
                                  <Typography variant="body2" color="textSecondary" sx={{ fontStyle: "italic" }}>
                                    {booking.note}
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < personalBookings.length - 1 && <Divider variant="inset" component="li" />}
                    </React.Fragment>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText
                      primary={
                        <Box sx={{ textAlign: "center", py: 4 }}>
                          <PersonPin sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
                          <Typography color="text.secondary">Không có lịch kèm sắp tới</Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                )}
              </List>
              <Box mt={2}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => {
                    navigate("/pt/booking")
                  }}
                  sx={{
                    backgroundColor: "#16697A",
                    "&:hover": {
                      backgroundColor: "#489FB5",
                    },
                  }}
                >
                  Quản lý lịch kèm
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Event Modal */}
      <EventModal open={modalOpen} event={selectedEvent} onClose={handleModalClose} />
    </Container>
  )
}

export default TrainerHomePage
