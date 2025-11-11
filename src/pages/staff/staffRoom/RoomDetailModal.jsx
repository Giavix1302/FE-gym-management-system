import React, { useMemo } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Chip,
  Card,
  CardContent,
  Grid,
  Divider,
  Alert,
} from "@mui/material"
import {
  Close as CloseIcon,
  Room as RoomIcon,
  Group as GroupIcon,
  Schedule as ScheduleIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  School as ClassIcon,
} from "@mui/icons-material"

export default function RoomDetailModal({ open, onClose, room, onEdit, onDelete }) {
  // Group sessions by date and classify
  const sessionsByDate = useMemo(() => {
    if (!room?.classSession) return {}

    const now = new Date()
    const today = new Date().toDateString()

    const grouped = {}

    room.classSession.forEach((session) => {
      const sessionDate = new Date(session.startTime)
      const dateKey = sessionDate.toDateString()

      if (!grouped[dateKey]) {
        grouped[dateKey] = {
          date: sessionDate,
          sessions: [],
          isPast: sessionDate < new Date(today),
          isToday: dateKey === today,
          isFuture: sessionDate > new Date(today),
        }
      }

      // Add session type (past, current, future)
      const sessionStart = new Date(session.startTime)
      const sessionEnd = new Date(session.endTime)

      let sessionType = "future"
      if (sessionEnd < now) {
        sessionType = "past"
      } else if (sessionStart <= now && sessionEnd >= now) {
        sessionType = "current"
      }

      grouped[dateKey].sessions.push({
        ...session,
        sessionType,
      })
    })

    // Sort sessions within each day by start time
    Object.values(grouped).forEach((day) => {
      day.sessions.sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
    })

    return grouped
  }, [room?.classSession])

  // Sort dates: past, today, future
  const sortedDates = useMemo(() => {
    return Object.keys(sessionsByDate).sort((a, b) => {
      return new Date(a) - new Date(b)
    })
  }, [sessionsByDate])

  // Check if room can be deleted
  const canDelete = useMemo(() => {
    if (!room?.classSession) return true

    const now = new Date()
    return !room.classSession.some((session) => {
      const startTime = new Date(session.startTime)
      return startTime >= now
    })
  }, [room?.classSession])

  // Format date
  const formatDate = (date) => {
    const today = new Date().toDateString()
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toDateString()
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()

    if (date.toDateString() === today) return "Hôm nay"
    if (date.toDateString() === tomorrow) return "Ngày mai"
    if (date.toDateString() === yesterday) return "Hôm qua"

    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  // Format time
  const formatTime = (timeString) => {
    return new Date(timeString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Get session chip props
  const getSessionChipProps = (sessionType) => {
    switch (sessionType) {
      case "current":
        return { color: "success", label: "Đang diễn ra" }
      case "past":
        return { color: "default", label: "Đã kết thúc" }
      default:
        return { color: "primary", label: "Sắp tới" }
    }
  }

  if (!room) return null

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2, display: "flex", alignItems: "center", gap: 1 }}>
        <RoomIcon color="primary" />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Chi tiết phòng
        </Typography>
        <IconButton aria-label="close" onClick={onClose} sx={{ color: (theme) => theme.palette.grey[500] }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {/* Room Info */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item size={{ xs: 12, md: 8 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <RoomIcon color="primary" />
                  <Typography variant="h5">{room.name}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <GroupIcon fontSize="small" color="action" />
                  <Typography variant="body1">
                    Sức chứa: <strong>{room.capacity}</strong> người
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  ID: {room._id}
                </Typography>
              </Grid>
              <Grid item size={{ xs: 12, md: 4 }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Button variant="outlined" startIcon={<EditIcon />} onClick={() => onEdit(room)} fullWidth>
                    Chỉnh sửa
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => onDelete(room)}
                    disabled={!canDelete}
                    fullWidth
                  >
                    Xóa phòng
                  </Button>
                </Box>
              </Grid>
            </Grid>

            {!canDelete && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                Không thể xóa phòng có buổi học hiện tại hoặc trong tương lai
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Sessions */}
        <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ScheduleIcon />
          Lịch sử và kế hoạch buổi học ({room.classSession?.length || 0} buổi)
        </Typography>

        {!room.classSession || room.classSession.length === 0 ? (
          <Alert severity="info">Phòng này chưa có buổi học nào được lên lịch</Alert>
        ) : (
          <Box>
            {sortedDates.map((dateKey) => {
              const dayData = sessionsByDate[dateKey]

              return (
                <Box key={dateKey} sx={{ mb: 3 }}>
                  {/* Date header */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <CalendarIcon fontSize="small" />
                    <Typography variant="subtitle1" fontWeight="bold">
                      {formatDate(dayData.date)}
                    </Typography>
                    <Chip
                      size="small"
                      label={`${dayData.sessions.length} buổi`}
                      color={dayData.isToday ? "primary" : "default"}
                    />
                  </Box>

                  {/* Sessions for this date */}
                  <Grid container spacing={2}>
                    {dayData.sessions.map((session, index) => {
                      const chipProps = getSessionChipProps(session.sessionType)

                      return (
                        <Grid item size={{ xs: 12 }} key={index}>
                          <Card
                            variant="outlined"
                            sx={{
                              backgroundColor: session.sessionType === "current" ? "success.50" : "background.paper",
                            }}
                          >
                            <CardContent sx={{ py: 2 }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "flex-start",
                                  mb: 1,
                                }}
                              >
                                <Box sx={{ flexGrow: 1 }}>
                                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                    {session.title}
                                  </Typography>

                                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                      <TimeIcon fontSize="small" color="action" />
                                      <Typography variant="body2" color="text.secondary">
                                        {formatTime(session.startTime)} - {formatTime(session.endTime)}
                                      </Typography>
                                    </Box>

                                    <Typography variant="body2" color="text.secondary">
                                      {session.hours}h
                                    </Typography>

                                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                      <GroupIcon fontSize="small" color="action" />
                                      <Typography variant="body2" color="text.secondary">
                                        {session.users?.length || 0} học viên
                                      </Typography>
                                    </Box>

                                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                      <ClassIcon fontSize="small" color="action" />
                                      <Typography variant="body2" color="text.secondary">
                                        {session.trainers?.length || 0} HLV
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Box>

                                <Chip size="small" color={chipProps.color} label={chipProps.label} />
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      )
                    })}
                  </Grid>

                  {dateKey !== sortedDates[sortedDates.length - 1] && <Divider sx={{ mt: 2 }} />}
                </Box>
              )
            })}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}
