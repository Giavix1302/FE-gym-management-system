import React, { useState } from "react"
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
} from "@mui/icons-material"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"

// Import GymCalendar component
import GymCalendar from "~/components/Calendar"

const TrainerHomePage = () => {
  // const [anchorEl, setAnchorEl] = useState(null)

  // Calendar events state
  const [events, setEvents] = useState([
    {
      title: "Yoga buổi sáng",
      start: new Date(2025, 8, 1, 8, 0),
      end: new Date(2025, 8, 1, 12, 30),
      coach: "HLV Anna",
      room: "Phòng 101",
    },
    {
      title: "PT - Cardio Training",
      start: new Date(2025, 8, 2, 14, 0),
      end: new Date(2025, 8, 2, 22, 0),
      coach: "HLV Minh",
      room: "Phòng 202",
    },
  ])

  // const handleProfileClick = (event) => {
  //   setAnchorEl(event.currentTarget)
  // }

  // const handleClose = () => {
  //   setAnchorEl(null)
  // }

  // Mock data dựa trên database schema
  const trainerData = {
    fullName: "Nguyễn Văn A",
    email: "trainer.a@gym.com",
    specialization: "Bodybuilding & Weight Training",
    bio: "Personal Trainer với 5 năm kinh nghiệm, chuyên về tăng cơ và giảm cân",
    isApproved: "approved",
    avatar: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop&crop=face",
  }

  const todayStats = {
    totalClients: 12,
    todayBookings: 6,
    completedSessions: 4,
    pendingSessions: 2,
    monthlyRevenue: 15000000,
    rating: 4.8,
  }

  const upcomingClasses = [
    {
      id: 1,
      name: "Strength Training",
      time: "09:00 - 10:00",
      room: "Room A",
      attendees: 8,
      capacity: 12,
    },
    {
      id: 2,
      name: "HIIT Workout",
      time: "14:00 - 15:00",
      room: "Room B",
      attendees: 15,
      capacity: 20,
    },
    {
      id: 3,
      name: "Yoga Flow",
      time: "18:00 - 19:00",
      room: "Room C",
      attendees: 10,
      capacity: 15,
    },
  ]

  // Updated to Personal Training Bookings (1vs1)
  const personalBookings = [
    {
      id: 1,
      clientName: "Trần Thị B",
      time: "10:00 - 11:00",
      date: "Hôm nay",
      status: "completed",
      service: "Personal Training",
      room: "Phòng 101",
      price: 500000,
    },
    {
      id: 2,
      clientName: "Lê Văn C",
      time: "15:00 - 16:00",
      date: "Hôm nay",
      status: "pending",
      service: "Strength Training",
      room: "Phòng 202",
      price: 600000,
    },
    {
      id: 3,
      clientName: "Phạm Thị D",
      time: "17:00 - 18:00",
      date: "Mai",
      status: "booked",
      service: "Weight Loss Program",
      room: "Phòng 103",
      price: 550000,
    },
    {
      id: 4,
      clientName: "Nguyễn Văn E",
      time: "19:00 - 20:00",
      date: "Mai",
      status: "booked",
      service: "Muscle Building",
      room: "Phòng 201",
      price: 650000,
    },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "success"
      case "pending":
        return "warning"
      case "booked":
        return "info"
      case "cancelled":
        return "error"
      default:
        return "default"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle />
      case "pending":
        return <AccessTime />
      case "booked":
        return <Assignment />
      case "cancelled":
        return <Cancel />
      default:
        return <Schedule />
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

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
                <Avatar src={trainerData.avatar} sx={{ width: 110, height: 110 }} />
              </Grid>
              <Grid item>
                <Typography variant="h4">Chào mừng, {trainerData.fullName}</Typography>
                <Typography variant="subtitle1" sx={{ opacity: 0.9 }} gutterBottom>
                  {trainerData.specialization}
                </Typography>
                <Chip
                  label="Verified Trainer"
                  icon={<CheckCircleIcon color="background.paper" />}
                  sx={{
                    mt: 1,
                    bgcolor: "warning.main",
                    color: "background.paper",
                  }}
                />
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
                    Khách hàng
                  </Typography>
                  <Typography variant="h4" sx={{ color: "#16697A" }}>
                    {todayStats.totalClients}
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
                    Buổi hôm nay
                  </Typography>
                  <Typography variant="h4" sx={{ color: "#16697A" }}>
                    {todayStats.todayBookings}
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
                    Hoàn thành
                  </Typography>
                  <Typography variant="h4" sx={{ color: "#16697A" }}>
                    {todayStats.completedSessions}
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
                    Doanh thu tháng
                  </Typography>
                  <Typography variant="h4" sx={{ color: "#16697A" }}>
                    {(todayStats.monthlyRevenue / 1000000).toFixed(1)}M
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
              </Typography>
              <GymCalendar events={events} />
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Classes and Personal Bookings - Row 4 */}
        <Grid item size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: "#16697A" }}>
                <Event sx={{ mr: 1, verticalAlign: "middle" }} />
                Lớp học sắp tới
              </Typography>
              <List sx={{ maxHeight: 400, overflow: "auto" }}>
                {upcomingClasses.map((class_, index) => (
                  <React.Fragment key={class_.id}>
                    <ListItem>
                      <ListItemIcon>
                        <Event sx={{ color: "#489FB5" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="subtitle1">{class_.name}</Typography>
                            <Chip
                              label={`${class_.attendees}/${class_.capacity}`}
                              size="small"
                              sx={{
                                backgroundColor: "#82C0CC",
                                color: "#16697A",
                              }}
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="textSecondary">
                              {class_.time} • {class_.room}
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={(class_.attendees / class_.capacity) * 100}
                              sx={{
                                mt: 1,
                                height: 4,
                                borderRadius: 2,
                                backgroundColor: "#EDE7E3",
                                "& .MuiLinearProgress-bar": {
                                  backgroundColor: "#489FB5",
                                },
                              }}
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < upcomingClasses.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
              <Box mt={2}>
                <Button
                  variant="outlined"
                  fullWidth
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
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: "#16697A" }}>
                <PersonPin sx={{ mr: 1, verticalAlign: "middle" }} />
                Lịch kèm 1vs1
              </Typography>
              <List sx={{ maxHeight: 400, overflow: "auto" }}>
                {personalBookings.map((booking, index) => (
                  <React.Fragment key={booking.id}>
                    <ListItem sx={{ px: 0, alignItems: "flex-start" }}>
                      <ListItemIcon sx={{ mt: 0.5 }}>{getStatusIcon(booking.status)}</ListItemIcon>
                      <ListItemText
                        primary={
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                              {booking.clientName}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {booking.service}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 0.5 }}>
                            <Typography variant="body2" color="textSecondary">
                              📅 {booking.date} • ⏰ {booking.time}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              📍 {booking.room} • 💰 {formatPrice(booking.price)}
                            </Typography>
                            <Box sx={{ mt: 0.5, display: "flex", alignItems: "center", gap: 1 }}>
                              <Chip
                                label={booking.status}
                                size="small"
                                color={getStatusColor(booking.status)}
                                sx={{ fontSize: "0.75rem" }}
                              />
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < personalBookings.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
              <Box mt={2}>
                <Button
                  variant="contained"
                  fullWidth
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

        {/* Quick Actions - Row 5 (Last Row) */}
        <Grid item size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: "#16697A" }}>
                <Settings sx={{ mr: 1, verticalAlign: "middle" }} />
                Thao tác nhanh
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<Event />}
                    sx={{
                      backgroundColor: "#489FB5",
                      "&:hover": { backgroundColor: "#16697A" },
                      py: 1.5,
                    }}
                  >
                    Tạo lớp học mới
                  </Button>
                </Grid>
                <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<PersonPin />}
                    sx={{
                      backgroundColor: "#82C0CC",
                      color: "#16697A",
                      "&:hover": { backgroundColor: "#489FB5", color: "white" },
                      py: 1.5,
                    }}
                  >
                    Đặt lịch kèm mới
                  </Button>
                </Grid>
                <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<People />}
                    sx={{
                      backgroundColor: "#FFA62B",
                      "&:hover": { backgroundColor: "#FF8F00" },
                      py: 1.5,
                    }}
                  >
                    Quản lý khách hàng
                  </Button>
                </Grid>
                <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Settings />}
                    sx={{
                      color: "#16697A",
                      borderColor: "#16697A",
                      "&:hover": {
                        borderColor: "#16697A",
                        backgroundColor: "rgba(22, 105, 122, 0.04)",
                      },
                      py: 1.5,
                    }}
                  >
                    Cài đặt hồ sơ
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}

export default TrainerHomePage
