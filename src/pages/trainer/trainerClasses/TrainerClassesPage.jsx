import React, { useState, useMemo, useEffect } from "react"
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  Tabs,
  Tab,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  IconButton,
  Badge,
} from "@mui/material"
import {
  School as SchoolIcon,
  LocationOn as LocationIcon,
  AccessTime as AccessTimeIcon,
  Search as SearchIcon,
  EventAvailable as EventAvailableIcon,
  History as HistoryIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Group as GroupIcon,
  CalendarMonth as CalendarIcon,
} from "@mui/icons-material"
import NoteIcon from "@mui/icons-material/Note"
import GymCalendar from "~/components/Calendar"
import ClassDetailModal from "./ClassDetailModal"
import SessionDetailModal from "./SessionDetailModal"
import useTrainerInfoStore from "~/stores/useTrainerInfoStore"
import { getListClassForTrainerAPI } from "~/apis/class"
import { toast } from "react-toastify"

function ClassListItem({ classData, onViewDetails, onEditClass }) {
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
      case "boxing":
        return "Boxing"
      default:
        return classType
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN")
  }

  const getUpcomingSessions = () => {
    const now = new Date()
    return classData.classSession.filter((session) => new Date(session.startTime) > now)
  }

  const getClassProgress = () => {
    const totalSessions = classData.classSession.length
    const completedSessions = classData.classSession.filter((session) => new Date(session.endTime) < new Date()).length
    return { completed: completedSessions, total: totalSessions }
  }

  const upcomingSessions = getUpcomingSessions()
  const progress = getClassProgress()
  const enrolledCount = classData.classEnrolled.filter((student) => student.userId).length

  return (
    <Card sx={{ mb: 2, borderRadius: 2 }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          {/* Class Image & Basic Info */}
          <Grid item size={{ xs: 12, sm: 4 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: 2,
                  overflow: "hidden",
                  bgcolor: "grey.100",
                }}
              >
                {classData.image ? (
                  <img
                    src={classData.image}
                    alt={classData.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <SchoolIcon color="disabled" />
                  </Box>
                )}
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" noWrap>
                  {classData.name}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                  <Chip
                    label={getClassTypeText(classData.classType)}
                    color={getClassTypeColor(classData.classType)}
                    size="small"
                  />
                  <Chip
                    label={`${enrolledCount}/${classData.capacity}`}
                    icon={<GroupIcon />}
                    size="small"
                    variant="outlined"
                  />
                </Stack>
              </Box>
            </Stack>
          </Grid>

          {/* Schedule & Location */}
          <Grid item size={{ xs: 12, sm: 3 }}>
            <Stack spacing={0.5}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
              >
                <AccessTimeIcon fontSize="small" />
                {classData.recurrence.length > 0 && (
                  <>
                    {["CN", "T2", "T3", "T4", "T5", "T6", "T7"][classData.recurrence[0].dayOfWeek]} -{" "}
                    {String(classData.recurrence[0].startTime.hour).padStart(2, "0")}:
                    {String(classData.recurrence[0].startTime.minute).padStart(2, "0")}
                  </>
                )}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
              >
                <LocationIcon fontSize="small" />
                {classData.locationInfo.name}
              </Typography>
              <Typography variant="caption" color="text.disabled">
                {formatDate(classData.startDate)} - {formatDate(classData.endDate)}
              </Typography>
            </Stack>
          </Grid>

          {/* Progress & Next Session */}
          <Grid item size={{ xs: 12, sm: 3 }}>
            <Stack spacing={1}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Tiến độ: {progress.completed}/{progress.total} buổi
                </Typography>
                <Box
                  sx={{
                    width: "100%",
                    height: 4,
                    bgcolor: "grey.200",
                    borderRadius: 2,
                    mt: 0.5,
                  }}
                >
                  <Box
                    sx={{
                      width: `${(progress.completed / progress.total) * 100}%`,
                      height: "100%",
                      bgcolor: "primary.main",
                      borderRadius: 2,
                    }}
                  />
                </Box>
              </Box>
              {upcomingSessions.length > 0 && (
                <Typography variant="caption" color="success.main" fontWeight="bold">
                  Buổi tiếp theo: {new Date(upcomingSessions[0].startTime).toLocaleDateString("vi-VN")}
                </Typography>
              )}
            </Stack>
          </Grid>

          {/* Price & Actions */}
          <Grid item size={{ xs: 12, sm: 2 }}>
            <Stack spacing={1} alignItems="flex-end">
              <Typography variant="body2" fontWeight="bold" color="success.main">
                {formatCurrency(classData.price)}
              </Typography>
              <Stack direction="row" spacing={1}>
                <IconButton size="small" onClick={() => onViewDetails(classData)}>
                  <VisibilityIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" color="primary" onClick={() => onEditClass(classData)}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Stack>
          </Grid>
        </Grid>

        {/* Description */}
        {classData.description && (
          <Box sx={{ mt: 2, p: 1.5, bgcolor: "grey.50", borderRadius: 1 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
            >
              <NoteIcon fontSize="small" />
              {classData.description}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

// Main Component
export default function TrainerClassManagePage() {
  const { trainerInfo } = useTrainerInfoStore()

  // States
  const [classes, setClasses] = useState([])
  const [tabValue, setTabValue] = useState(0)
  const [selectedClass, setSelectedClass] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSession, setSelectedSession] = useState(null)
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false)
  const [filters, setFilters] = useState({
    classType: "all",
    location: "all",
    status: "all",
    sortBy: "startDate",
    search: "",
  })

  // Mock data - replace with actual API call
  useEffect(() => {
    // Simulate API call
    const init = async () => {
      if (!trainerInfo._id) return
      const classInfo = await getListClassForTrainerAPI(trainerInfo._id)
      if (!classInfo.success) return
      setClasses(classInfo.classes)
    }

    init()
  }, [])

  // Filter and sort classes
  const filteredClasses = useMemo(() => {
    let filtered = [...classes]

    if (filters.classType !== "all") {
      filtered = filtered.filter((cls) => cls.classType === filters.classType)
    }

    if (filters.status !== "all") {
      const now = new Date()
      filtered = filtered.filter((cls) => {
        const startDate = new Date(cls.startDate)
        const endDate = new Date(cls.endDate)

        if (filters.status === "active") {
          return startDate <= now && endDate >= now
        } else if (filters.status === "upcoming") {
          return startDate > now
        } else if (filters.status === "completed") {
          return endDate < now
        }
        return true
      })
    }

    if (filters.search) {
      filtered = filtered.filter(
        (cls) =>
          cls.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          cls.locationInfo.name.toLowerCase().includes(filters.search.toLowerCase()),
      )
    }

    filtered.sort((a, b) => {
      if (filters.sortBy === "startDate") {
        return new Date(b.startDate) - new Date(a.startDate)
      } else if (filters.sortBy === "name") {
        return a.name.localeCompare(b.name)
      } else if (filters.sortBy === "enrolled") {
        const aEnrolled = a.classEnrolled.filter((s) => s.userId).length
        const bEnrolled = b.classEnrolled.filter((s) => s.userId).length
        return bEnrolled - aEnrolled
      }
      return 0
    })

    return filtered
  }, [classes, filters])

  // Separate active and completed classes
  const now = new Date()
  const activeClasses = filteredClasses.filter((cls) => new Date(cls.endDate) >= now)
  const completedClasses = filteredClasses.filter((cls) => new Date(cls.endDate) < now)

  // Event handlers
  const handleViewDetails = (classData) => {
    setSelectedClass(classData)
    setIsModalOpen(true)
  }

  const handleEditClass = (classData) => {
    setSelectedClass(classData)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedClass(null)
  }

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Convert class sessions to calendar events format
  const calendarEvents = useMemo(() => {
    const events = []

    classes.forEach((classData) => {
      classData.classSession.forEach((session) => {
        const enrolledCount = classData.classEnrolled.filter((s) => s.userId).length

        events.push({
          _id: session._id,
          title: session.title || `${classData.name} - ${session.roomName}`,
          startTime: session.startTime,
          endTime: session.endTime,
          status: new Date(session.endTime) < new Date() ? "completed" : "upcoming",
          className: classData.name,
          classType: classData.classType,
          location: classData.locationInfo.name,
          roomName: session.roomName,
          hours: session.hours,
          enrolledCount,
          capacity: classData.capacity,
          price: classData.price,
          classData, // Full class data for modal
          sessionData: session, // Session specific data
        })
      })
    })

    return events.sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
  }, [classes])

  // Session handlers
  const handleSessionClick = (session) => {
    setSelectedSession(session)
    setIsSessionModalOpen(true)
  }

  const handleCloseSessionModal = () => {
    setIsSessionModalOpen(false)
    setSelectedSession(null)
  }

  // Get statistics
  const stats = useMemo(() => {
    const total = classes.length
    const active = classes.filter((cls) => new Date(cls.endDate) >= now).length
    const totalStudents = classes.reduce((sum, cls) => sum + cls.classEnrolled.filter((s) => s.userId).length, 0)
    const totalRevenue = classes.reduce(
      (sum, cls) => sum + cls.price * cls.classEnrolled.filter((s) => s.userId).length,
      0,
    )

    return { total, active, totalStudents, totalRevenue }
  }, [classes])

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Quản lý lớp học
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Quản lý các lớp học nhóm mà bạn đang giảng dạy
        </Typography>
      </Box>

      {/* Calendar Section */}
      <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CalendarIcon color="primary" />
            Lịch học
          </Typography>
        </Stack>

        <GymCalendar events={calendarEvents} onEventClick={handleSessionClick} />
      </Paper>

      {/* Classes List Section */}
      <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6">Danh sách lớp học</Typography>

        {/* Filters */}
        <Card variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item size={{ xs: 12, sm: 3 }}>
              <TextField
                fullWidth
                placeholder="Tìm kiếm..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                size="small"
              />
            </Grid>

            <Grid item size={{ xs: 12, sm: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Loại lớp</InputLabel>
                <Select
                  value={filters.classType}
                  onChange={(e) => handleFilterChange("classType", e.target.value)}
                  label="Loại lớp"
                >
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="dance">Khiêu vũ</MenuItem>
                  <MenuItem value="yoga">Yoga</MenuItem>
                  <MenuItem value="cardio">Cardio</MenuItem>
                  <MenuItem value="strength">Sức mạnh</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item size={{ xs: 12, sm: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  label="Trạng thái"
                >
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="upcoming">Sắp diễn ra</MenuItem>
                  <MenuItem value="active">Đang hoạt động</MenuItem>
                  <MenuItem value="completed">Đã hoàn thành</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item size={{ xs: 12, sm: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Địa điểm</InputLabel>
                <Select
                  value={filters.location}
                  onChange={(e) => handleFilterChange("location", e.target.value)}
                  label="Địa điểm"
                >
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="gym1">THE GEM Nguyen Kiem</MenuItem>
                  <MenuItem value="gym2">Fitness World Q3</MenuItem>
                  <MenuItem value="gym3">Elite Fitness Q7</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item size={{ xs: 12, sm: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Sắp xếp</InputLabel>
                <Select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                  label="Sắp xếp"
                >
                  <MenuItem value="startDate">Ngày bắt đầu</MenuItem>
                  <MenuItem value="name">Tên lớp</MenuItem>
                  <MenuItem value="enrolled">Số học viên</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Card>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab
              label={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <EventAvailableIcon />
                  <span>Đang hoạt động</span>
                  <Badge badgeContent={activeClasses.length} color="primary" />
                </Stack>
              }
            />
            <Tab
              label={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <HistoryIcon />
                  <span>Đã hoàn thành</span>
                  <Badge badgeContent={completedClasses.length} color="default" />
                </Stack>
              }
            />
          </Tabs>
        </Box>

        {/* Classes List */}
        <Box sx={{ minHeight: 400 }}>
          {tabValue === 0 && (
            <Box>
              {activeClasses.length > 0 ? (
                activeClasses.map((classData) => (
                  <ClassListItem
                    key={classData._id}
                    classData={classData}
                    onViewDetails={handleViewDetails}
                    onEditClass={handleEditClass}
                  />
                ))
              ) : (
                <Box sx={{ textAlign: "center", py: 6 }}>
                  <SchoolIcon sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
                  <Typography variant="h6" color="text.disabled">
                    Không có lớp học nào đang hoạt động
                  </Typography>
                  <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
                    Tạo lớp học mới để bắt đầu giảng dạy
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {tabValue === 1 && (
            <Box>
              {completedClasses.length > 0 ? (
                completedClasses.map((classData) => (
                  <ClassListItem
                    key={classData._id}
                    classData={classData}
                    onViewDetails={handleViewDetails}
                    onEditClass={handleEditClass}
                  />
                ))
              ) : (
                <Box sx={{ textAlign: "center", py: 6 }}>
                  <HistoryIcon sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
                  <Typography variant="h6" color="text.disabled">
                    Chưa có lớp học nào đã hoàn thành
                  </Typography>
                  <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
                    Các lớp học đã kết thúc sẽ hiển thị ở đây
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Paper>

      {/* Class Detail Modal */}
      <ClassDetailModal classData={selectedClass} isOpen={isModalOpen} onClose={handleCloseModal} />

      {/* Session Detail Modal */}
      <SessionDetailModal session={selectedSession} isOpen={isSessionModalOpen} onClose={handleCloseSessionModal} />
    </Container>
  )
}
