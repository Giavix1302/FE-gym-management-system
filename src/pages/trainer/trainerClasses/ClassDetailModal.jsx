import React, { useState, useMemo } from "react"
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
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Alert,
  Paper,
  Tab,
  Tabs,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CardMedia,
} from "@mui/material"
import {
  Close as CloseIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  AccessTime as AccessTimeIcon,
  LocationOn as LocationIcon,
  AttachMoney as AttachMoneyIcon,
  Star as StarIcon,
  Group as GroupIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Info as InfoIcon,
  DateRange as DateRangeIcon,
  Room as RoomIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  Edit as EditIcon,
  Assessment as AssessmentIcon,
} from "@mui/icons-material"

export default function ClassDetailModal({ classData, isOpen, onClose }) {
  const [tabValue, setTabValue] = useState(0)

  if (!classData) return null

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

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN")
  }

  const getClassTypeColor = (classType) => {
    switch (classType) {
      case "dance":
        return "secondary"
      case "yoga":
        return "success"
      case "cardio":
        return "error"
      case "strength":
        return "warning"
      default:
        return "default"
    }
  }

  const getClassTypeText = (classType) => {
    switch (classType) {
      case "dance":
        return "Khiêu vũ"
      case "yoga":
        return "Yoga"
      case "cardio":
        return "Cardio"
      case "strength":
        return "Sức mạnh"
      default:
        return classType
    }
  }

  const getDayOfWeekText = (dayOfWeek) => {
    const days = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"]
    return days[dayOfWeek]
  }

  const getClassStatus = () => {
    const now = new Date()
    const startDate = new Date(classData.startDate)
    const endDate = new Date(classData.endDate)

    if (now < startDate) {
      return { status: "upcoming", text: "Sắp diễn ra", color: "info" }
    } else if (now >= startDate && now <= endDate) {
      return { status: "active", text: "Đang hoạt động", color: "success" }
    } else {
      return { status: "completed", text: "Đã hoàn thành", color: "default" }
    }
  }

  const getClassProgress = () => {
    const totalSessions = classData.classSession.length
    const now = new Date()
    const completedSessions = classData.classSession.filter((session) => new Date(session.endTime) < now).length
    return { completed: completedSessions, total: totalSessions }
  }

  const getUpcomingSessions = () => {
    const now = new Date()
    return classData.classSession
      .filter((session) => new Date(session.startTime) > now)
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
  }

  const getPastSessions = () => {
    const now = new Date()
    return classData.classSession
      .filter((session) => new Date(session.endTime) < now)
      .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
  }

  const enrolledStudents = classData.classEnrolled.filter((student) => student.userId)
  const classStatus = getClassStatus()
  const progress = getClassProgress()
  const upcomingSessions = getUpcomingSessions()
  const pastSessions = getPastSessions()

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2, maxHeight: "90vh" },
      }}
    >
      {/* Dialog Header */}
      <DialogTitle sx={{ pb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {classData.image && (
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <img
                  src={classData.image}
                  alt={classData.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Box>
            )}
            <Box>
              <Typography variant="h5" component="div" sx={{ fontWeight: "bold", mb: 0.5 }}>
                {classData.name}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  label={getClassTypeText(classData.classType)}
                  color={getClassTypeColor(classData.classType)}
                  size="small"
                />
                <Chip label={classStatus.text} color={classStatus.color} size="small" />
              </Stack>
            </Box>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        {/* Basic Information Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Class Info */}
          <Grid item size={{ xs: 12, md: 6 }}>
            <Card variant="outlined" sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <SchoolIcon color="primary" />
                  Thông tin lớp học
                </Typography>
                <Stack spacing={2}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                      Sức chứa:
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {enrolledStudents.length}/{classData.capacity} học viên
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(enrolledStudents.length / classData.capacity) * 100}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                      Giá:
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="success.main">
                      {formatCurrency(classData.price)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                      Tiến độ:
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {progress.completed}/{progress.total} buổi học
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Schedule & Location */}
          <Grid item size={{ xs: 12, md: 6 }}>
            <Card variant="outlined" sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LocationIcon color="primary" />
                  Lịch học & Địa điểm
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {classData.locationInfo.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {classData.locationInfo.address.street}, {classData.locationInfo.address.ward},{" "}
                      {classData.locationInfo.address.province}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Lịch học:
                    </Typography>
                    {classData.recurrence.map((schedule, index) => (
                      <Box key={index} sx={{ mb: 1 }}>
                        <Typography variant="body2" fontWeight="bold">
                          {getDayOfWeekText(schedule.dayOfWeek)} - {String(schedule.startTime.hour).padStart(2, "0")}:
                          {String(schedule.startTime.minute).padStart(2, "0")} -{" "}
                          {String(schedule.endTime.hour).padStart(2, "0")}:
                          {String(schedule.endTime.minute).padStart(2, "0")}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Từ:</strong> {formatDate(classData.startDate)} - <strong>Đến:</strong>{" "}
                      {formatDate(classData.endDate)}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Description */}
        {classData.description && (
          <Alert severity="info" sx={{ mb: 4, borderRadius: 2 }}>
            <Typography variant="body2">
              <strong>Mô tả lớp học:</strong> {classData.description}
            </Typography>
          </Alert>
        )}

        {/* Tabs Section */}
        <Box sx={{ mb: 3 }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab
              label={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <GroupIcon />
                  <span>Học viên ({enrolledStudents.length})</span>
                </Stack>
              }
            />
            <Tab
              label={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <ScheduleIcon />
                  <span>Lịch học ({classData.classSession.length})</span>
                </Stack>
              }
            />
            <Tab
              label={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <AssessmentIcon />
                  <span>Thống kê</span>
                </Stack>
              }
            />
          </Tabs>
        </Box>

        {/* Tab Content */}
        {tabValue === 0 && (
          <Box>
            {/* Enrolled Students */}
            {enrolledStudents.length > 0 ? (
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Danh sách học viên
                  </Typography>
                  <List>
                    {enrolledStudents.map((student, index) => (
                      <React.Fragment key={index}>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: "primary.light" }}>
                              {student.fullName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={student.fullName}
                            secondary={
                              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <PhoneIcon fontSize="small" />
                                {student.phone}
                              </Box>
                            }
                          />
                          <IconButton size="small">
                            <InfoIcon />
                          </IconButton>
                        </ListItem>
                        {index < enrolledStudents.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </CardContent>
              </Card>
            ) : (
              <Paper
                variant="outlined"
                sx={{
                  p: 4,
                  textAlign: "center",
                  bgcolor: "grey.50",
                  borderStyle: "dashed",
                }}
              >
                <GroupIcon sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
                <Typography variant="body1" color="text.disabled">
                  Chưa có học viên nào đăng ký
                </Typography>
              </Paper>
            )}
          </Box>
        )}

        {tabValue === 1 && (
          <Box>
            {/* Class Sessions */}
            <Stack spacing={3}>
              {/* Upcoming Sessions */}
              {upcomingSessions.length > 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <PlayArrowIcon color="success" />
                    Buổi học sắp tới ({upcomingSessions.length})
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Buổi học</TableCell>
                          <TableCell>Ngày & Giờ</TableCell>
                          <TableCell>Phòng</TableCell>
                          <TableCell>Thời lượng</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {upcomingSessions.slice(0, 5).map((session) => {
                          const startTime = formatDateTime(session.startTime)
                          return (
                            <TableRow key={session._id}>
                              <TableCell>
                                <Typography variant="body2" fontWeight="bold">
                                  {session.title}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">{startTime.date}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {startTime.time}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Chip label={session.roomName} size="small" variant="outlined" />
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">{session.hours} giờ</Typography>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              {/* Past Sessions */}
              {pastSessions.length > 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CheckCircleIcon color="primary" />
                    Buổi học đã hoàn thành ({pastSessions.length})
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Buổi học</TableCell>
                          <TableCell>Ngày & Giờ</TableCell>
                          <TableCell>Phòng</TableCell>
                          <TableCell>Thời lượng</TableCell>
                          <TableCell>Trạng thái</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {pastSessions.slice(0, 10).map((session) => {
                          const startTime = formatDateTime(session.startTime)
                          return (
                            <TableRow key={session._id}>
                              <TableCell>
                                <Typography variant="body2" fontWeight="bold">
                                  {session.title}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">{startTime.date}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {startTime.time}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Chip label={session.roomName} size="small" variant="outlined" />
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">{session.hours} giờ</Typography>
                              </TableCell>
                              <TableCell>
                                <Chip label="Hoàn thành" color="success" size="small" />
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              {classData.classSession.length === 0 && (
                <Paper
                  variant="outlined"
                  sx={{
                    p: 4,
                    textAlign: "center",
                    bgcolor: "grey.50",
                    borderStyle: "dashed",
                  }}
                >
                  <ScheduleIcon sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
                  <Typography variant="body1" color="text.disabled">
                    Chưa có buổi học nào được lên lịch
                  </Typography>
                </Paper>
              )}
            </Stack>
          </Box>
        )}

        {tabValue === 2 && (
          <Box>
            {/* Statistics */}
            <Grid container spacing={3}>
              <Grid item size={{ xs: 12, md: 6 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Thống kê tổng quan
                    </Typography>
                    <Stack spacing={2}>
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2" color="text.secondary">
                          Tổng buổi học:
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {classData.classSession.length}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2" color="text.secondary">
                          Đã hoàn thành:
                        </Typography>
                        <Typography variant="body2" fontWeight="bold" color="success.main">
                          {progress.completed}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2" color="text.secondary">
                          Còn lại:
                        </Typography>
                        <Typography variant="body2" fontWeight="bold" color="info.main">
                          {progress.total - progress.completed}
                        </Typography>
                      </Box>
                      <Divider />
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2" color="text.secondary">
                          Doanh thu ước tính:
                        </Typography>
                        <Typography variant="h6" fontWeight="bold" color="success.main">
                          {formatCurrency(classData.price * enrolledStudents.length)}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item size={{ xs: 12, md: 6 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Tỷ lệ lấp đầy lớp học
                    </Typography>
                    <Box sx={{ textAlign: "center", py: 2 }}>
                      <Typography variant="h3" fontWeight="bold" color="primary.main">
                        {Math.round((enrolledStudents.length / classData.capacity) * 100)}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {enrolledStudents.length} / {classData.capacity} học viên
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={(enrolledStudents.length / classData.capacity) * 100}
                        sx={{ mt: 2, height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
      </DialogContent>

      <Divider />

      {/* Dialog Actions */}
      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button onClick={onClose} color="inherit">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}
