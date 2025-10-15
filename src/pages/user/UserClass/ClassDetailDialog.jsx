import React from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Chip,
  Divider,
  Stack,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
} from "@mui/material"
import {
  Close,
  Schedule,
  SelfImprovement,
  SportsKabaddi,
  FitnessCenter,
  Group,
  LocationOn,
  CalendarMonth,
} from "@mui/icons-material"

const ClassDetailDialog = ({ open, onClose, classData }) => {
  if (!classData) return null

  const getClassTypeIcon = (type) => {
    const normalizedType = type?.toLowerCase()
    switch (normalizedType) {
      case "yoga":
        return <SelfImprovement />
      case "boxing":
        return <SportsKabaddi />
      case "dance":
        return <FitnessCenter />
      default:
        return <Group />
    }
  }

  const getClassTypeColor = (type) => {
    const normalizedType = type?.toLowerCase()
    switch (normalizedType) {
      case "yoga":
        return "success"
      case "boxing":
        return "error"
      case "dance":
        return "secondary"
      default:
        return "default"
    }
  }

  const getDayOfWeekLabel = (dayNumber) => {
    const days = {
      0: "Chủ nhật",
      1: "Thứ 2",
      2: "Thứ 3",
      3: "Thứ 4",
      4: "Thứ 5",
      5: "Thứ 6",
      6: "Thứ 7",
    }
    return days[dayNumber] || `Ngày ${dayNumber}`
  }

  const formatTime = (timeObj) => {
    if (!timeObj || typeof timeObj !== "object") return "N/A"
    const { hour, minute } = timeObj
    return `${hour?.toString().padStart(2, "0")}:${minute?.toString().padStart(2, "0")}`
  }

  const formatPrice = (price) => {
    if (!price && price !== 0) return "Liên hệ"
    return `${price.toLocaleString("vi-VN")}đ`
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6">Chi tiết lớp học</Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box>
          <Box sx={{ position: "relative", width: "100%", height: 300 }}>
            {/* Background image */}
            <Box
              component="img"
              src={classData.image || "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500"}
              alt={classData.name}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: 2,
              }}
            />

            {/* Overlay content với nền mờ dần */}
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                p: 2,
                background: "linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0))",
                borderBottomLeftRadius: 8,
                borderBottomRightRadius: 8,
              }}
            >
              <Typography variant="h5" sx={{ color: "background.paper" }} fontWeight={600} gutterBottom>
                {classData.name}
              </Typography>

              <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                <Chip
                  sx={{ p: 1 }}
                  icon={getClassTypeIcon(classData.classType)}
                  label={classData.classType?.toUpperCase()}
                  color={getClassTypeColor(classData.classType)}
                />
                <Chip
                  sx={{ color: "background.paper", p: 1 }}
                  label={`${classData.enrolled || 0}/${classData.capacity || 0} học viên`}
                />
              </Box>

              <Typography variant="body1" sx={{ color: "background.paper" }}>
                {classData.description}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Location Information */}
          <Typography variant="h6" gutterBottom>
            Địa điểm
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 1,
              mb: 2,
              p: 1.5,
              bgcolor: "grey.50",
              borderRadius: 1,
            }}
          >
            <LocationOn color="primary" />
            <Box>
              <Typography fontWeight={600}>{classData.locationName}</Typography>
              <Typography variant="body2" color="text.secondary">
                {classData.address?.street}, {classData.address?.ward}, {classData.address?.province}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Trainers */}
          <Typography variant="h6" gutterBottom>
            Huấn luyện viên
          </Typography>
          <List>
            {classData.trainers?.map((trainer) => (
              <ListItem key={trainer._id}>
                <ListItemAvatar>
                  <Avatar src={trainer.avatar}>{trainer.name?.charAt(0)}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={trainer.name}
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Chuyên môn: {trainer.specialization}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Đánh giá: {trainer.rating}/5 ⭐
                      </Typography>
                      {trainer.phone && (
                        <Typography variant="body2" color="text.secondary">
                          SĐT: {trainer.phone}
                        </Typography>
                      )}
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 2 }} />

          {/* Schedule */}
          <Typography variant="h6" gutterBottom>
            Lịch học
          </Typography>
          <Stack spacing={1}>
            {classData.recurrence?.map((schedule, idx) => (
              <Box
                key={idx}
                sx={{ display: "flex", alignItems: "center", gap: 2, p: 1.5, bgcolor: "grey.50", borderRadius: 1 }}
              >
                <Schedule color="primary" />
                <Box>
                  <Typography>
                    <strong>{getDayOfWeekLabel(schedule.dayOfWeek)}</strong>: {formatTime(schedule.startTime)} -{" "}
                    {formatTime(schedule.endTime)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Phòng: {schedule.roomId || "Sẽ thông báo"}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>

          <Divider sx={{ my: 2 }} />

          {/* Class Sessions */}
          {classData.classSession && classData.classSession.length > 0 && (
            <>
              <Typography variant="h6" gutterBottom>
                Lịch các buổi học ({classData.classSession.length} buổi)
              </Typography>
              <Box sx={{ maxHeight: 300, overflowY: "auto", mb: 2 }}>
                <Stack spacing={1}>
                  {classData.classSession.map((session) => (
                    <Box
                      key={session._id}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        p: 1.5,
                        bgcolor: "background.paper",
                        border: 1,
                        borderColor: "divider",
                        borderRadius: 1,
                      }}
                    >
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {session.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {session.room}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: "right" }}>
                        <Typography variant="body2">
                          {new Date(session.startTime).toLocaleDateString("vi-VN")}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(session.startTime).toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          -{" "}
                          {new Date(session.endTime).toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Box>
              <Divider sx={{ my: 2 }} />
            </>
          )}

          {/* Course Duration & Price */}
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <Box sx={{ flex: 1, p: 2, bgcolor: "info.50", borderRadius: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <CalendarMonth color="info" />
                <Typography variant="h6" color="info.dark">
                  Thời gian khóa học
                </Typography>
              </Box>
              <Typography variant="body2">Từ: {new Date(classData.startDate).toLocaleDateString("vi-VN")}</Typography>
              <Typography variant="body2">Đến: {new Date(classData.endDate).toLocaleDateString("vi-VN")}</Typography>
            </Box>

            <Box sx={{ flex: 1, p: 2, bgcolor: "warning.50", borderRadius: 1 }}>
              <Typography variant="h6" color="warning.dark" fontWeight={700} gutterBottom>
                Học phí
              </Typography>
              <Typography variant="h5" color="warning.dark" fontWeight={700}>
                {formatPrice(classData.price)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default ClassDetailDialog
