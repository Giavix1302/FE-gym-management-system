import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Avatar,
  Card,
  CardContent,
  Divider,
  IconButton,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material"
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Close as CloseIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  Description as DescriptionIcon,
  EventAvailable as EventAvailableIcon,
  AccessTime as AccessTimeIcon,
} from "@mui/icons-material"
import dayjs from "dayjs"
import useRoomsStore from "~/stores/useRoomsStore"
import useListTrainerInfoForAdmin from "~/stores/useListTrainerInfoForAdmin"
import TimeField from "~/components/TimeField" // Adjust path as needed

export default function SessionDetailModal({ open, onClose, session, onEdit, onSave, locations = [] }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({})
  const [isSaving, setIsSaving] = useState(false)

  const [startTimeValue, setStartTimeValue] = useState({
    hour: 0,
    minute: 0,
  })

  const [endTimeValue, setEndTimeValue] = useState({
    hour: 0,
    minute: 0,
  })

  const { rooms } = useRoomsStore()
  const { listTrainerInfo } = useListTrainerInfoForAdmin()

  // Initialize time values when editing starts
  useEffect(() => {
    if (isEditing && session) {
      const startTime = new Date(getCurrentValue("startTime") || session.startTime)
      const endTime = new Date(getCurrentValue("endTime") || session.endTime)

      setStartTimeValue({
        hour: startTime.getHours(),
        minute: startTime.getMinutes(),
      })

      setEndTimeValue({
        hour: endTime.getHours(),
        minute: endTime.getMinutes(),
      })
    }
  }, [isEditing, session])

  if (!session) return null

  // Helper functions
  const getTrainerById = (trainerId) => {
    return listTrainerInfo.find((trainer) => trainer._id === trainerId || trainer.trainerId === trainerId)
  }

  const getRoomById = (roomId) => {
    return rooms.find((room) => room._id === roomId)
  }

  const getLocationById = (locationId) => {
    return locations.find((location) => location._id === locationId)
  }

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Determine session status
  const getSessionStatus = () => {
    const now = new Date()
    const sessionStart = new Date(session.startTime)
    const sessionEnd = new Date(session.endTime)

    if (sessionEnd < now) return { status: "completed", label: "Đã kết thúc", color: "default" }
    if (sessionStart <= now && now <= sessionEnd) return { status: "ongoing", label: "Đang diễn ra", color: "success" }
    return { status: "upcoming", label: "Sắp tới", color: "primary" }
  }

  const sessionStatus = getSessionStatus()

  // Get current value for editing
  const getCurrentValue = (field) => {
    if (!isEditing) return session[field] || ""
    return editData[field] !== undefined ? editData[field] : session[field] || ""
  }

  // Handle field changes
  const handleFieldChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Handle edit mode
  const handleEdit = () => {
    setIsEditing(true)
    setEditData({})
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditData({})
  }

  const handleSave = async () => {
    if (!onSave) return

    setIsSaving(true)
    try {
      // Combine date with time values for start and end times
      const startDate = new Date(getCurrentValue("startTime") || session.startTime)
      startDate.setHours(startTimeValue.hour, startTimeValue.minute, 0, 0)

      const endDate = new Date(getCurrentValue("endTime") || session.endTime)
      endDate.setHours(endTimeValue.hour, endTimeValue.minute, 0, 0)

      const finalEditData = {
        ...editData,
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
      }

      await onSave(session._id, finalEditData)
      setIsEditing(false)
      setEditData({})
    } catch (error) {
      console.error("Error saving session:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleClose = () => {
    if (isEditing) {
      handleCancel()
    }
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="h5" component="div" sx={{ fontWeight: "bold", mb: 0.5 }}>
              {isEditing ? (
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={getCurrentValue("title")}
                  onChange={(e) => handleFieldChange("title", e.target.value)}
                  sx={{ maxWidth: 400 }}
                />
              ) : (
                session.title
              )}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Chip label={sessionStatus.label} color={sessionStatus.color} size="small" variant="outlined" />
              <Typography variant="subtitle2" color="text.secondary">
                {formatDate(session.startTime)}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Time */}
          <Card variant="outlined">
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, "&:last-child": { pb: 2 } }}>
              <Avatar sx={{ bgcolor: "primary.light" }}>
                <ScheduleIcon />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 0.5 }}>
                  Thời gian
                </Typography>
                {isEditing ? (
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TimeField
                        label="Giờ bắt đầu"
                        value={dayjs(`${startTimeValue.hour}:${startTimeValue.minute}`, "HH:mm")}
                        setDetailValue={setStartTimeValue}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TimeField
                        label="Giờ kết thúc"
                        value={dayjs(`${endTimeValue.hour}:${endTimeValue.minute}`, "HH:mm")}
                        setDetailValue={setEndTimeValue}
                      />
                    </Grid>
                  </Grid>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    {formatTime(session.startTime)} - {formatTime(session.endTime)}
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>

          {/* Room */}
          <Card variant="outlined">
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, "&:last-child": { pb: 2 } }}>
              <Avatar sx={{ bgcolor: "warning.light" }}>
                <LocationIcon />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 0.5 }}>
                  Phòng
                </Typography>
                {isEditing ? (
                  <FormControl fullWidth size="small">
                    <InputLabel>Chọn phòng</InputLabel>
                    <Select
                      value={getCurrentValue("roomId")}
                      onChange={(e) => handleFieldChange("roomId", e.target.value)}
                      label="Chọn phòng"
                    >
                      {rooms.map((room) => (
                        <MenuItem key={room._id} value={room._id}>
                          {room.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    {getRoomById(session.roomId)?.name || `Room ${session.roomId}`}
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>

          {/* Trainers */}
          <Card variant="outlined">
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, "&:last-child": { pb: 2 } }}>
              <Avatar sx={{ bgcolor: "success.light" }}>
                <PersonIcon />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 0.5 }}>
                  Huấn luyện viên
                </Typography>
                {isEditing ? (
                  <FormControl fullWidth size="small">
                    <InputLabel>Chọn huấn luyện viên</InputLabel>
                    <Select
                      multiple
                      value={getCurrentValue("trainers") || []}
                      onChange={(e) => handleFieldChange("trainers", e.target.value)}
                      label="Chọn huấn luyện viên"
                      renderValue={(selected) => (
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                          {selected.map((trainerId) => {
                            const trainer = getTrainerById(trainerId)
                            return (
                              <Chip
                                key={trainerId}
                                label={trainer?.userInfo?.name || `Trainer ${trainerId}`}
                                size="small"
                              />
                            )
                          })}
                        </Box>
                      )}
                    >
                      {listTrainerInfo.map((trainer) => (
                        <MenuItem key={trainer._id} value={trainer._id}>
                          {trainer.userInfo?.name || `Trainer ${trainer._id}`}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : session.trainers?.length > 0 ? (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    {session.trainers.map((trainerId) => {
                      const trainer = getTrainerById(trainerId)
                      return (
                        <Box key={trainerId} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Avatar src={trainer?.userInfo?.avatar || ""} sx={{ width: 24, height: 24 }}>
                            {trainer?.userInfo?.name?.charAt(0)?.toUpperCase() || "T"}
                          </Avatar>
                          <Typography variant="body2" color="text.secondary">
                            {trainer?.userInfo?.name || `Trainer ${trainerId}`}
                          </Typography>
                        </Box>
                      )
                    })}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Chưa có huấn luyện viên
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>

          {/* Description/Notes */}
          <Card variant="outlined">
            <CardContent sx={{ "&:last-child": { pb: 2 } }}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                <Avatar sx={{ bgcolor: "info.light", mt: 0.5 }}>
                  <DescriptionIcon />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                    Ghi chú
                  </Typography>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      value={getCurrentValue("notes") || getCurrentValue("description") || ""}
                      onChange={(e) => handleFieldChange("notes", e.target.value)}
                      placeholder="Nhập ghi chú cho buổi học..."
                      variant="outlined"
                      size="small"
                    />
                  ) : (
                    <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                      {session.notes || session.description || "Không có ghi chú"}
                    </Typography>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 3, gap: 1 }}>
        {!isEditing ? (
          <>
            <Button onClick={handleClose} variant="outlined" color="inherit">
              Đóng
            </Button>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleEdit}
              disabled={sessionStatus.status === "completed"}
            >
              Chỉnh sửa
            </Button>
          </>
        ) : (
          <>
            <Button onClick={handleCancel} variant="outlined" color="inherit">
              Hủy
            </Button>
            <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Đang lưu..." : "Lưu"}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  )
}
