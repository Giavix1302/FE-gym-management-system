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
  Alert,
  Paper,
  LinearProgress,
  CardMedia,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material"
import {
  Close as CloseIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  AccessTime as AccessTimeIcon,
  LocationOn as LocationIcon,
  AttachMoney as AttachMoneyIcon,
  Group as GroupIcon,
  Room as RoomIcon,
  Info as InfoIcon,
  School as SchoolIcon,
  CheckCircle as CheckCircleIcon,
  Edit as EditIcon,
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon,
  Assessment as AssessmentIcon,
  EventNote as EventNoteIcon,
} from "@mui/icons-material"
import PendingIcon from "@mui/icons-material/Pending"

export default function SessionDetailModal({ session, isOpen, onClose }) {
  if (!session) return null

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

  const getSessionStatus = () => {
    const now = new Date()
    const startTime = new Date(session.startTime)
    const endTime = new Date(session.endTime)

    if (now < startTime) {
      return { status: "upcoming", text: "Sắp diễn ra", color: "info", icon: <PendingIcon /> }
    } else if (now >= startTime && now <= endTime) {
      return { status: "ongoing", text: "Đang diễn ra", color: "warning", icon: <PlayArrowIcon /> }
    } else {
      return { status: "completed", text: "Đã hoàn thành", color: "success", icon: <CheckCircleIcon /> }
    }
  }

  const startTime = formatDateTime(session.startTime)
  const endTime = formatDateTime(session.endTime)
  const sessionStatus = getSessionStatus()
  const enrolledStudents = session.classData.classEnrolled.filter((student) => student.userId)

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
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {session.classData.image && (
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <img
                  src={session.classData.image}
                  alt={session.className}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Box>
            )}
            <Box>
              <Typography variant="h5" component="div" sx={{ fontWeight: "bold", mb: 0.5 }}>
                {session.title}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  label={getClassTypeText(session.classType)}
                  color={getClassTypeColor(session.classType)}
                  size="small"
                />
                <Chip label={sessionStatus.text} color={sessionStatus.color} icon={sessionStatus.icon} size="small" />
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
          {/* Session Info */}
          <Grid item size={{ xs: 12, md: 6 }}>
            <Card variant="outlined" sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <ScheduleIcon color="primary" />
                  Thông tin buổi học
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Ngày & Giờ:
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {startTime.date}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {startTime.time} - {endTime.time} ({session.hours} giờ)
                    </Typography>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Phòng học:
                    </Typography>
                    <Chip label={session.roomName} icon={<RoomIcon />} variant="outlined" />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Class & Location Info */}
          <Grid item size={{ xs: 12, md: 6 }}>
            <Card variant="outlined" sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LocationIcon color="primary" />
                  Lớp học & Địa điểm
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Tên lớp:
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {session.className}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Địa điểm:
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {session.location}
                    </Typography>
                    {session.classData.locationInfo.address && (
                      <Typography variant="caption" color="text.secondary">
                        {session.classData.locationInfo.address.street}, {session.classData.locationInfo.address.ward}
                      </Typography>
                    )}
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Enrollment & Revenue */}
          <Grid item size={{ xs: 12, md: 6 }}>
            <Card variant="outlined" sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <GroupIcon color="primary" />
                  Học viên tham gia
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Số lượng:
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" color="primary.main">
                      {session.enrolledCount}/{session.capacity}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={(session.enrolledCount / session.capacity) * 100}
                      sx={{ mt: 1, height: 6, borderRadius: 3 }}
                    />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Revenue */}
          <Grid item size={{ xs: 12, md: 6 }}>
            <Card variant="outlined" sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <AttachMoneyIcon color="primary" />
                  Doanh thu
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Giá mỗi học viên:
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {formatCurrency(session.price)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Tổng doanh thu:
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="success.main">
                      {formatCurrency(session.price * session.enrolledCount)}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Class Description */}
        {session.classData.description && (
          <Alert severity="info" sx={{ mb: 4, borderRadius: 2 }}>
            <Typography variant="body2">
              <strong>Mô tả lớp học:</strong> {session.classData.description}
            </Typography>
          </Alert>
        )}

        {/* Enrolled Students List */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PersonIcon color="primary" />
            Danh sách học viên ({enrolledStudents.length})
          </Typography>

          {enrolledStudents.length > 0 ? (
            <Card variant="outlined">
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Họ và tên</TableCell>
                      <TableCell>Số điện thoại</TableCell>
                      <TableCell align="center">Trạng thái</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {enrolledStudents.map((student, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar sx={{ bgcolor: "primary.light", width: 32, height: 32 }}>
                              {student.fullName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </Avatar>
                            <Typography variant="body2" fontWeight="bold">
                              {student.fullName}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <PhoneIcon fontSize="small" color="disabled" />
                            {student.phone}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip label="Đã đăng ký" color="success" size="small" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
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

        {/* Session Actions based on status */}
        {sessionStatus.status === "upcoming" && (
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              Buổi học này sẽ bắt đầu vào {startTime.time} ngày {startTime.date}. Bạn có thể chuẩn bị tài liệu và kiểm
              tra thiết bị trước khi bắt đầu.
            </Typography>
          </Alert>
        )}

        {sessionStatus.status === "ongoing" && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="body2">Buổi học đang diễn ra. Thời gian kết thúc dự kiến: {endTime.time}</Typography>
          </Alert>
        )}

        {sessionStatus.status === "completed" && (
          <Alert severity="success" sx={{ mb: 2 }}>
            <Typography variant="body2">
              Buổi học đã hoàn thành vào {endTime.time} ngày {endTime.date}.
            </Typography>
          </Alert>
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
