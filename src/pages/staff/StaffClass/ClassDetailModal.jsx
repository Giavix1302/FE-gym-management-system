import React, { useState } from "react"
import {
  Box,
  Card,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Grid,
  Divider,
  Avatar,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  LinearProgress,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material"
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  SelfImprovement as YogaIcon,
  SportsKabaddi as BoxingIcon,
  MusicNote as DanceIcon,
  Class as ClassIcon,
  LocationOn as LocationIcon,
  TableView as TableViewIcon,
  CalendarMonth as CalendarViewIcon,
  Payment as PaymentIcon,
} from "@mui/icons-material"
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"
import useRoomsStore from "~/stores/useRoomsStore"
import useListTrainerInfoForAdmin from "~/stores/useListTrainerInfoForAdmin"
import GymCalendar from "~/components/Calendar"
import SessionDetailModal from "./SessionDetailModal"
import { updateClassSessionAPI } from "~/apis/classSession"
import { toast } from "react-toastify"
import { getHoursBetween, isValidTimeRange } from "~/utils/common"
import { getListClassForAdminAPI } from "~/apis/class"

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box>{children}</Box>}
    </div>
  )
}

export default function ClassDetailModal({ open, onClose, classData, onEdit, onDelete, locations = [], setClasses }) {
  const [tabValue, setTabValue] = useState(0)
  const [sessionViewMode, setSessionViewMode] = useState("table") // "table" or "calendar"
  const [selectedSession, setSelectedSession] = useState(null)
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false)

  const { rooms } = useRoomsStore()
  const { listTrainerInfo } = useListTrainerInfoForAdmin()

  if (!classData) return null

  // Use actual data structure from your API
  const classSessions = classData.classSessions || []
  const classEnrollments = classData.classEnrollments || []

  // Helper functions to get trainer, room, and location info
  const getTrainerById = (trainerId) => {
    return listTrainerInfo.find((trainer) => trainer._id === trainerId || trainer.trainerId === trainerId)
  }

  const getRoomById = (roomId) => {
    return rooms.find((room) => room._id === roomId)
  }

  const getLocationById = (locationId) => {
    return locations.find((location) => location._id === locationId)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
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

  const getClassTypeIcon = (type) => {
    const typeStr = type?.toLowerCase()
    switch (typeStr) {
      case "yoga":
        return <YogaIcon />
      case "boxing":
        return <BoxingIcon />
      case "dance":
        return <DanceIcon />
      default:
        return <ClassIcon />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "success"
      case "cancelled":
        return "error"
      case "completed":
        return "info"
      default:
        return "default"
    }
  }

  const getPaymentStatusColor = (status) => {
    return status === "PAID" ? "success" : "error"
  }

  const enrollmentRate = classData.capacity > 0 ? (classData.enrolledCount / classData.capacity) * 100 : 0

  const handleEdit = () => {
    onEdit?.(classData)
  }

  // Handle session view mode change
  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setSessionViewMode(newMode)
    }
  }

  // Handle session click from calendar
  const handleSessionClick = (session) => {
    setSelectedSession(session)
    setIsSessionModalOpen(true)
  }

  // Handle session modal close
  const closeSessionModal = () => {
    setIsSessionModalOpen(false)
    setSelectedSession(null)
  }

  const handleSessionSave = async (sessionId, editData) => {
    console.log("Saving session:", sessionId, editData)

    if (Object.keys(editData).length === 0) {
      toast.warning("Không có field nào được sửa")
      return
    }

    // Get the updated session data (editData contains the new ISO string times from SessionDetailModal)
    const updatedStartTime = editData.startTime || selectedSession.startTime
    const updatedEndTime = editData.endTime || selectedSession.endTime

    // Validate time range
    if (!isValidTimeRange(updatedStartTime, updatedEndTime)) {
      toast.error("Thời gian bắt đầu phải trước thời gian kết thúc")
      return
    }

    // Check if duration matches expected hours
    const actualHours = getHoursBetween(updatedStartTime, updatedEndTime)
    if (actualHours !== selectedSession.hours) {
      toast.error(`Thời gian học của 1 buổi là ${selectedSession.hours} giờ`)
      return
    }

    // Prepare data for API call
    const dataUpdate = {
      startTime: updatedStartTime,
      endTime: updatedEndTime,
      trainers: editData.trainers !== undefined ? editData.trainers : selectedSession.trainers,
      roomId: editData.roomId !== undefined ? editData.roomId : selectedSession.roomId,
      title: editData.title !== undefined ? editData.title : selectedSession.title,
    }

    console.log("🚀 ~ handleSessionSave ~ dataUpdate:", dataUpdate)

    try {
      const result = await updateClassSessionAPI(sessionId, dataUpdate)
      console.log("🚀 ~ handleSessionSave ~ result:", result)
      if (!result.success) return

      toast.success("Cập nhật buổi học thành công")

      // Optionally refresh the class data here
      const data = await getListClassForAdminAPI()
      setClasses(data.classes)
      // Close modal after successful save
      closeSessionModal()
      onClose()
    } catch (error) {
      console.error("Error updating session:", error)
      toast.error("Cập nhật buổi học thất bại")
    }
  }

  // Convert sessions to calendar events format
  const calendarEvents = classSessions.map((session) => ({
    _id: session._id,
    title: session.title,
    startTime: session.startTime,
    endTime: session.endTime,
    coach:
      session.trainers
        ?.map((trainerId) => {
          const trainer = getTrainerById(trainerId)
          return trainer?.userInfo?.name || `Trainer ${trainerId}`
        })
        .join(", ") || "Chưa có",
    location: getRoomById(session.roomId)?.name || `Room ${session.roomId}`,
    note: session.notes || session.description || "Không có ghi chú",
    member: "", // Sessions don't typically have individual members
    // Include original session data for modal
    ...session,
  }))

  // Format recurrence for display using actual data structure
  const formatRecurrenceForDisplay = (recurrence) => {
    if (!recurrence || recurrence.length === 0) return []

    const dayMap = {
      1: "Thứ 2",
      2: "Thứ 3",
      3: "Thứ 4",
      4: "Thứ 5",
      5: "Thứ 6",
      6: "Thứ 7",
      7: "Chủ nhật",
    }

    return recurrence.map((rec, idx) => {
      let dayLabel, timeLabel, roomLabel

      if (rec.dayOfWeek) {
        // Your actual data format with dayOfWeek number
        dayLabel = dayMap[rec.dayOfWeek] || `Ngày ${rec.dayOfWeek}`
        if (rec.startTime && rec.endTime) {
          const startTime = `${String(rec.startTime.hour).padStart(2, "0")}:${String(rec.startTime.minute).padStart(2, "0")}`
          const endTime = `${String(rec.endTime.hour).padStart(2, "0")}:${String(rec.endTime.minute).padStart(2, "0")}`
          timeLabel = `${startTime} - ${endTime}`
        }
        if (rec.roomId) {
          const room = getRoomById(rec.roomId)
          roomLabel = room?.name || `Room ${rec.roomId}`
        }
      }

      return {
        id: idx,
        label: `${dayLabel} ${timeLabel} - ${roomLabel}`.trim(),
      }
    })
  }

  const formattedRecurrence = formatRecurrenceForDisplay(classData.recurrence)

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar src={classData.image} sx={{ width: 60, height: 60 }} variant="rounded">
                {getClassTypeIcon(classData.classType)}
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight="bold" color="primary.main">
                  {classData.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {classData.classType}
                </Typography>
                {/* Display location in header */}
                {/* Handle both locationId (new) and locationName (old) structures */}
                {classData.locationId ? (
                  // New structure with locationId reference
                  (() => {
                    const location = getLocationById(classData.locationId)
                    return location ? (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                        <LocationIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                        <Typography variant="caption" color="text.secondary">
                          {location.name}
                        </Typography>
                      </Box>
                    ) : null
                  })()
                ) : classData.locationName ? (
                  // Old structure with embedded location data
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                    <LocationIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                    <Typography variant="caption" color="text.secondary">
                      {classData.locationName}
                    </Typography>
                  </Box>
                ) : null}
              </Box>
            </Box>
            <Chip
              label={`${classData.enrolledCount}/${classData.capacity} học viên`}
              color={enrollmentRate > 80 ? "success" : "primary"}
              variant="outlined"
            />
          </Box>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 0 }}>
          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ px: 2, pt: 1 }}>
            <Tab label="Thông tin chi tiết" />
            <Tab label={`Buổi học (${classSessions.length})`} />
            <Tab label={`Học viên (${classEnrollments.length})`} />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Box sx={{ p: 3 }}>
              {/* Stats Cards */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item size={{ xs: 6, md: 3 }}>
                  <Card variant="outlined" sx={{ textAlign: "center", p: 2 }}>
                    <PeopleIcon color="primary" />
                    <Typography variant="h6" fontWeight="bold">
                      {classData.enrolledCount}/{classData.capacity}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Sĩ số
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={enrollmentRate}
                      sx={{ mt: 1 }}
                      color={enrollmentRate > 80 ? "success" : "primary"}
                    />
                  </Card>
                </Grid>
                <Grid item size={{ xs: 6, md: 3 }}>
                  <Card variant="outlined" sx={{ textAlign: "center", p: 2 }}>
                    <ScheduleIcon color="info" />
                    <Typography variant="h6" fontWeight="bold">
                      {classData.sessionsCount}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Buổi học
                    </Typography>
                  </Card>
                </Grid>
                <Grid item size={{ xs: 6, md: 3 }}>
                  <Card variant="outlined" sx={{ textAlign: "center", p: 2 }}>
                    <PersonIcon color="secondary" />
                    <Typography variant="h6" fontWeight="bold">
                      {classData.trainers?.length || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Huấn luyện viên
                    </Typography>
                  </Card>
                </Grid>
                <Grid item size={{ xs: 6, md: 3 }}>
                  <Card variant="outlined" sx={{ textAlign: "center", p: 2 }}>
                    <AttachMoneyIcon color="success" />
                    <Typography variant="h6" fontWeight="bold" color="success.main">
                      {formatCurrency(classData.revenue || 0)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Doanh thu
                    </Typography>
                  </Card>
                </Grid>
              </Grid>

              {/* Description */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Mô tả:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {classData.description}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Pricing Information */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Thông tin giá:
                </Typography>
                <Grid container spacing={3}>
                  <Grid item size={{ xs: 6 }}>
                    <Card variant="outlined" sx={{ p: 2, textAlign: "center" }}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 1 }}>
                        <AttachMoneyIcon color="primary" />
                        <Typography variant="body2" color="text.secondary" fontWeight="medium">
                          Học phí
                        </Typography>
                      </Box>
                      <Typography variant="h5" fontWeight="bold" color="primary.main">
                        {formatCurrency(classData.price || 0)}
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item size={{ xs: 6 }}>
                    <Card variant="outlined" sx={{ p: 2, textAlign: "center" }}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 1 }}>
                        <PaymentIcon color="success" />
                        <Typography variant="body2" color="text.secondary" fontWeight="medium">
                          Lương mỗi buổi dạy
                        </Typography>
                      </Box>
                      <Typography variant="h5" fontWeight="bold" color="success.main">
                        {formatCurrency(classData.ratePerClassSession || 0)}
                      </Typography>
                    </Card>
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Location Information */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Địa điểm:
                </Typography>
                {/* Handle both locationId (new) and locationName (old) structures */}
                {classData.locationId ? (
                  // New structure with locationId reference
                  (() => {
                    const location = getLocationById(classData.locationId)
                    return location ? (
                      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                        <LocationIcon color="primary" />
                        <Box>
                          <Typography variant="body1" fontWeight="medium">
                            {location.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {`${location.address.street}, ${location.address.ward}, ${location.address.province}`}
                          </Typography>
                          {location.phone && (
                            <Typography variant="caption" color="text.secondary">
                              Điện thoại: {location.phone}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Không tìm thấy thông tin địa điểm
                      </Typography>
                    )
                  })()
                ) : classData.locationName ? (
                  // Old structure with embedded location data
                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                    <LocationIcon color="primary" />
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        {classData.locationName}
                      </Typography>
                      {classData.locationAddress && (
                        <Typography variant="body2" color="text.secondary">
                          {`${classData.locationAddress.street}, ${classData.locationAddress.ward}, ${classData.locationAddress.province}`}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Chưa có thông tin địa điểm
                  </Typography>
                )}
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Duration */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Thời gian:
                </Typography>
                <Box sx={{ display: "flex", gap: 3 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Bắt đầu
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {formatDate(classData.startDate)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Kết thúc
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {formatDate(classData.endDate)}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Recurrence Schedule */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Lịch học:
                </Typography>
                {formattedRecurrence.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    Chưa có lịch học
                  </Typography>
                ) : (
                  <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                    {formattedRecurrence.map((rec) => (
                      <Chip key={rec.id} label={rec.label} color="primary" variant="outlined" size="small" />
                    ))}
                  </Stack>
                )}
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Trainers */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Huấn luyện viên:
                </Typography>
                {!classData.trainers || classData.trainers.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    Chưa có huấn luyện viên
                  </Typography>
                ) : (
                  <Stack spacing={1}>
                    {classData.trainers.map((trainerId) => {
                      const trainer = getTrainerById(trainerId)
                      return (
                        <Box key={trainerId} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <Avatar src={trainer?.userInfo?.avatar || ""} sx={{ width: 40, height: 40 }}>
                            {trainer?.userInfo?.name?.charAt(0)?.toUpperCase() || "T"}
                          </Avatar>
                          <Box>
                            <Typography variant="body1" fontWeight="medium">
                              {trainer?.userInfo?.name || "Không tìm thấy thông tin trainer"}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {trainer?.trainerInfo?.specialization || "Chưa có chuyên môn"}
                            </Typography>
                            {trainer && (
                              <Typography variant="caption" color="success.main" sx={{ display: "block" }}>
                                ⭐ {trainer.rating || 0} ({trainer.totalReviews || 0} đánh giá)
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      )
                    })}
                  </Stack>
                )}
              </Box>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box sx={{ p: 2 }}>
              {/* Header with View Toggle */}
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                  Lịch sử buổi học
                </Typography>
                <ToggleButtonGroup value={sessionViewMode} exclusive onChange={handleViewModeChange} size="small">
                  <ToggleButton value="table" aria-label="table view">
                    <TableViewIcon sx={{ mr: 1 }} />
                    Bảng
                  </ToggleButton>
                  <ToggleButton value="calendar" aria-label="calendar view">
                    <CalendarViewIcon sx={{ mr: 1 }} />
                    Lịch
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>

              {/* Content based on view mode */}
              {sessionViewMode === "table" ? (
                // Table View
                classSessions.length === 0 ? (
                  <Typography color="text.secondary">Chưa có buổi học nào</Typography>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: "bold" }}>Trạng thái</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Tiêu đề</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Ngày & Giờ</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Phòng</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Huấn luyện viên</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Hành động</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {classSessions
                          .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
                          .map((session) => {
                            const now = new Date()
                            const sessionStart = new Date(session.startTime)
                            const sessionEnd = new Date(session.endTime)
                            const isPast = sessionEnd < now
                            const isOngoing = sessionStart <= now && now <= sessionEnd
                            const isFuture = sessionStart > now

                            return (
                              <TableRow
                                key={session._id}
                                sx={{
                                  backgroundColor: isPast ? "action.hover" : isOngoing ? "success.50" : "transparent",
                                  opacity: isPast ? 0.7 : 1,
                                }}
                              >
                                <TableCell>
                                  {isPast ? (
                                    <Chip label="Đã kết thúc" color="default" size="small" variant="outlined" />
                                  ) : isOngoing ? (
                                    <Chip label="Đang diễn ra" color="success" size="small" />
                                  ) : (
                                    <Chip label="Sắp tới" color="primary" size="small" />
                                  )}
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    variant="body2"
                                    fontWeight="medium"
                                    sx={{
                                      textDecoration: isPast ? "line-through" : "none",
                                      color: isPast ? "text.secondary" : "text.primary",
                                    }}
                                  >
                                    {session.title}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Box>
                                    <Typography
                                      variant="body2"
                                      fontWeight="medium"
                                      sx={{
                                        color: isPast ? "text.secondary" : "text.primary",
                                      }}
                                    >
                                      {formatDateTime(session.startTime)}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      đến{" "}
                                      {new Date(session.endTime).toLocaleTimeString("vi-VN", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </Typography>
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color: isPast ? "text.secondary" : "text.primary",
                                    }}
                                  >
                                    {getRoomById(session.roomId)?.name || `Room ${session.roomId}`}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  {session.trainers?.length > 0 ? (
                                    <Box>
                                      {session.trainers.map((trainerId) => {
                                        const trainer = getTrainerById(trainerId)
                                        return (
                                          <Typography
                                            key={trainerId}
                                            variant="body2"
                                            sx={{
                                              color: isPast ? "text.secondary" : "text.primary",
                                            }}
                                          >
                                            {trainer?.userInfo?.name || `Trainer ${trainerId}`}
                                          </Typography>
                                        )
                                      })}
                                    </Box>
                                  ) : (
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        color: isPast ? "text.secondary" : "text.primary",
                                      }}
                                    >
                                      Chưa có
                                    </Typography>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <IconButton size="small" color="primary" onClick={() => handleSessionClick(session)}>
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            )
                          })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )
              ) : (
                // Calendar View
                <Box sx={{ height: 600 }}>
                  {classSessions.length === 0 ? (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                        flexDirection: "column",
                        gap: 2,
                      }}
                    >
                      <CalendarViewIcon sx={{ fontSize: 64, color: "text.secondary" }} />
                      <Typography color="text.secondary">Chưa có buổi học nào</Typography>
                    </Box>
                  ) : (
                    <GymCalendar events={calendarEvents} onEventClick={handleSessionClick} />
                  )}
                </Box>
              )}
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Danh sách học viên
              </Typography>
              {classEnrollments.length === 0 ? (
                <Typography color="text.secondary">Chưa có học viên nào</Typography>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>Học viên</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Số điện thoại</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Ngày đăng ký</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Hành động</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {classEnrollments.map((enrollment) => (
                        <TableRow key={enrollment._id}>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Avatar src={enrollment.avatar} sx={{ width: 32, height: 32 }}>
                                {enrollment.fullName?.charAt(0)?.toUpperCase() || "U"}
                              </Avatar>
                              <Typography variant="body2">{enrollment.fullName}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{enrollment.phone}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{formatDate(enrollment.createAt)}</Typography>
                          </TableCell>
                          <TableCell>
                            <IconButton size="small" color="primary">
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" color="error">
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          </TabPanel>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button variant="contained" startIcon={<EditIcon />} onClick={handleEdit}>
            Chỉnh sửa
          </Button>
          <Button onClick={onClose} variant="outlined" color="inherit">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {/* Session Detail Modal */}
      <SessionDetailModal
        open={isSessionModalOpen}
        onClose={closeSessionModal}
        session={selectedSession}
        onSave={handleSessionSave}
        locations={locations}
      />
    </>
  )
}
