import React, { useState, useEffect } from "react"
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Avatar,
  Divider,
  IconButton,
  Paper,
  Stack,
  InputAdornment,
  Skeleton,
  Fade,
  Grow,
  Tabs,
  Tab,
  Badge,
  AvatarGroup,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  LinearProgress,
  CardHeader,
} from "@mui/material"
import {
  FilterList,
  Search,
  Event,
  Close,
  CheckCircle,
  Info,
  Cancel,
  People,
  Schedule,
  CalendarMonth,
  Payment,
  FitnessCenter,
  SelfImprovement,
  SportsKabaddi,
  Group,
  Person,
  LocationOn,
  AccessTime,
  CheckCircleOutline,
  HourglassEmpty,
  CancelOutlined,
  Star,
  Phone,
  PlayArrow,
  Pause,
  School,
  MonetizationOn,
  TrendingUp,
} from "@mui/icons-material"

// Import the new ClassDetailDialog component
import ClassDetailDialog from "./ClassDetailDialog"
// Import the shared SelectPaymentModal component
import { SelectPaymentModal } from "~/components/SelectPaymentModal"
import { cancelClassEnrollmentAPI, getListClassForUserAPI, getMemberEnrolledClassesAPI } from "~/apis/class"
import { toast } from "react-toastify"
import useLocationStore from "~/stores/useLocationStore"
import { createLinkVnpayClassPaymentAPI } from "~/apis/payment"
import useUserStore from "~/stores/useUserStore"

function ClassEnrollmentPage() {
  const { user } = useUserStore()

  const [activeTab, setActiveTab] = useState(0)
  const [classes, setClasses] = useState([])
  const [enrolledClasses, setEnrolledClasses] = useState([])
  console.log("🚀 ~ ClassEnrollmentPage ~ enrolledClasses:", enrolledClasses)
  const [classType, setClassType] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [dataLoading, setDataLoading] = useState(false)

  // Dialog states
  const [openDetailDialog, setOpenDetailDialog] = useState(false)
  const [openEnrollDialog, setOpenEnrollDialog] = useState(false)
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false)
  const [openCancelDialog, setOpenCancelDialog] = useState(false)
  const [selectedClass, setSelectedClass] = useState(null)
  const [selectedEnrollment, setSelectedEnrollment] = useState(null)
  const [selectedLocation, setSelectedLocation] = useState("")
  const [enrollmentNote, setEnrollmentNote] = useState("")
  const [cancelReason, setCancelReason] = useState("")

  // UI states
  const [loading, setLoading] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })

  // Helper function to format the new address structure
  const formatAddress = (address) => {
    if (!address) return "Địa chỉ không xác định"
    const { street, ward, province } = address
    return [street, ward, province].filter(Boolean).join(", ")
  }

  // Helper function to get full location display
  const getLocationDisplay = (location) => {
    if (!location) return "Không xác định"
    return `${location.name} - ${formatAddress(location.address)}`
  }

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

  const getStatusInfo = (status) => {
    switch (status) {
      case "active":
        return { label: "Đang học", color: "success", icon: <CheckCircleOutline /> }
      case "completed":
        return { label: "Đã hoàn thành", color: "info", icon: <CheckCircle /> }
      case "cancelled":
        return { label: "Đã hủy", color: "error", icon: <CancelOutlined /> }
      default:
        return { label: "Không xác định", color: "default", icon: <Info /> }
    }
  }

  const getPaymentStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return { label: "Đã thanh toán", color: "success", icon: <CheckCircle /> }
      case "pending":
        return { label: "Chờ thanh toán", color: "warning", icon: <HourglassEmpty /> }
      case "failed":
        return { label: "Thanh toán thất bại", color: "error", icon: <CancelOutlined /> }
      default:
        return { label: "Chưa thanh toán", color: "default", icon: <MonetizationOn /> }
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

  // Calculate progress for enrolled classes
  const calculateProgress = (enrolledClass) => {
    const totalSessions = enrolledClass.classSession?.length || 0
    const currentDate = new Date()
    const completedSessions =
      enrolledClass.classSession?.filter((session) => new Date(session.startTime) <= currentDate).length || 0

    return {
      completed: completedSessions,
      total: totalSessions,
      percentage: totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0,
    }
  }

  // Get next session for enrolled class
  const getNextSession = (enrolledClass) => {
    const currentDate = new Date()
    const upcomingSessions = enrolledClass.classSession
      ?.filter((session) => new Date(session.startTime) > currentDate)
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))

    return upcomingSessions?.[0] || null
  }

  const handleEnrollClick = (classItem) => {
    setSelectedClass(classItem)
    setOpenEnrollDialog(true)
  }

  const handleEnrollSubmit = () => {
    handlePayment()
  }

  const handlePayment = () => {
    setOpenEnrollDialog(false)
    setOpenPaymentDialog(true)
  }

  const handlePaymentMethodSelect = async (paymentMethodId, paymentMethodData) => {
    setLoading(true)

    try {
      const dataToCreate = {
        userId: user._id,
        classId: selectedClass._id,
        title: "Đăng kí " + selectedClass.name,
        price: selectedClass.price,
      }

      const result = await createLinkVnpayClassPaymentAPI(dataToCreate)
      if (!result.success) {
        throw new Error(result.message || "Lỗi tạo thanh toán")
      }

      window.open(result.paymentUrl, "_blank")
      setOpenPaymentDialog(false)
      setSelectedClass(null)

      setSnackbar({
        open: true,
        message: `Đang chuyển hướng đến trang thanh toán. Phương thức: ${paymentMethodData?.name || "VNPay"}`,
        severity: "success",
      })
    } catch (error) {
      console.error("Payment error:", error)
      setSnackbar({
        open: true,
        message: error.message || "Lỗi thanh toán. Vui lòng thử lại!",
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCancelEnrollment = async () => {
    if (!cancelReason.trim()) {
      setSnackbar({
        open: true,
        message: "Vui lòng nhập lý do hủy đăng ký",
        severity: "error",
      })
      return
    }
    setLoading(true)
    const result = await cancelClassEnrollmentAPI(selectedEnrollment.classEnrollmentId)

    if (result.success) {
      toast.success(result.message)
    }
    setOpenCancelDialog(false)
    setSelectedEnrollment(null)
    setCancelReason("")
    setLoading(false)
  }

  const filteredClasses = classes.filter((classItem) => {
    const matchType = classType === "all" || classItem.classType?.toLowerCase() === classType.toLowerCase()
    const matchSearch =
      searchTerm === "" ||
      classItem.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.description?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchType && matchSearch
  })

  const isClassFull = (classItem) => (classItem.enrolled || 0) >= (classItem.capacity || 0)
  const isUserEnrolled = (classId) => enrolledClasses.some((e) => e._id === classId)

  useEffect(() => {
    const init = async () => {
      setDataLoading(true)
      try {
        const [classesResult, enrolledResult] = await Promise.all([
          getListClassForUserAPI(),
          getMemberEnrolledClassesAPI(user._id),
        ])

        if (!classesResult.success) {
          toast.error(classesResult?.message || "Lỗi lấy dữ liệu lớp học")
        } else {
          setClasses(classesResult.classes || [])
        }

        if (!enrolledResult.success) {
          toast.error(enrolledResult?.message || "Lỗi lấy dữ liệu lớp đã đăng ký")
        } else {
          setEnrolledClasses(enrolledResult.classes || [])
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Lỗi kết nối API")
      } finally {
        setDataLoading(false)
      }
    }
    init()
  }, [user._id])

  return (
    <Container sx={{ py: 4 }}>
      {/* Header */}
      <Fade in timeout={800}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h3" sx={{ color: "primary.main", mb: 2 }}>
            Đăng Ký Lớp Học
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: "auto" }}>
            Tham gia các lớp học nhóm và nâng cao sức khỏe cùng cộng đồng
          </Typography>
        </Box>
      </Fade>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} variant="fullWidth">
          <Tab label="Lớp học khả dụng" icon={<Search />} iconPosition="start" />
          <Tab
            label={
              <Badge badgeContent={enrolledClasses.length} color="primary">
                Lớp đã đăng ký
              </Badge>
            }
            icon={<Event />}
            iconPosition="start"
          />
        </Tabs>
      </Paper>

      {/* Tab 1: Available Classes */}
      {activeTab === 0 && (
        <Box>
          {/* Filters */}
          <Paper elevation={0} sx={{ p: 3, mb: 4, border: "1px solid", borderColor: "divider" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
              <FilterList color="primary" />
              <Typography variant="h6" color="primary">
                Tìm kiếm lớp học
              </Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Tìm kiếm lớp học..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
                <TextField
                  fullWidth
                  select
                  size="small"
                  label="Loại lớp học"
                  value={classType}
                  onChange={(e) => setClassType(e.target.value)}
                >
                  <MenuItem value="all">Tất cả loại</MenuItem>
                  <MenuItem value="yoga">Yoga</MenuItem>
                  <MenuItem value="boxing">Boxing</MenuItem>
                  <MenuItem value="dance">Dance</MenuItem>
                </TextField>
              </Grid>

              <Grid item size={{ xs: 12, sm: 12, md: 4 }}>
                <Paper
                  sx={{
                    px: 2,
                    py: 1,
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "rgba(130, 192, 204, 0.15)",
                  }}
                >
                  <Typography variant="body2" fontWeight={600} color="primary">
                    {filteredClasses.length} lớp học phù hợp
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Paper>

          {/* Loading State */}
          {dataLoading && (
            <Grid container spacing={3}>
              {[1, 2, 3].map((index) => (
                <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                  <Card>
                    <Skeleton variant="rectangular" height={200} />
                    <CardContent>
                      <Skeleton variant="text" height={30} sx={{ mb: 1 }} />
                      <Skeleton variant="text" height={60} sx={{ mb: 2 }} />
                      <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
                      <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
                      <Skeleton variant="rectangular" height={40} />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Classes Grid */}
          {!dataLoading && (
            <Grid container spacing={3}>
              {filteredClasses.length === 0 ? (
                <Grid item size={{ xs: 12 }}>
                  <Paper sx={{ p: 4, textAlign: "center" }}>
                    <Typography color="text.secondary">
                      {classes.length === 0 ? "Hiện tại chưa có lớp học nào" : "Không tìm thấy lớp học phù hợp"}
                    </Typography>
                  </Paper>
                </Grid>
              ) : (
                filteredClasses.map((classItem, index) => (
                  <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={classItem._id}>
                    <Grow in timeout={500 + index * 100}>
                      <Card
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          transition: "all 0.3s",
                          "&:hover": { transform: "translateY(-4px)", boxShadow: 6 },
                        }}
                      >
                        <CardMedia
                          component="img"
                          height="200"
                          image={
                            classItem.image || "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500"
                          }
                          alt={classItem.name}
                        />
                        <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                          <Box
                            sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}
                          >
                            <Typography variant="h6" fontWeight={600} color="primary">
                              {classItem.name}
                            </Typography>
                            <Chip
                              icon={getClassTypeIcon(classItem.classType)}
                              label={classItem.classType?.toUpperCase()}
                              color={getClassTypeColor(classItem.classType)}
                              size="small"
                            />
                          </Box>

                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flex: 1 }}>
                            {classItem.description}
                          </Typography>

                          <Divider sx={{ my: 2 }} />

                          <Stack spacing={1.5}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <People fontSize="small" color="action" />
                              <Typography variant="body2">
                                {classItem.enrolled || 0}/{classItem.capacity || 0} học viên
                              </Typography>
                              {isClassFull(classItem) && <Chip label="Đầy" color="error" size="small" />}
                            </Box>

                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Person fontSize="small" color="action" />
                              <AvatarGroup
                                max={2}
                                sx={{ "& .MuiAvatar-root": { width: 24, height: 24, fontSize: "0.75rem" } }}
                              >
                                {classItem.trainers?.map((trainer) => (
                                  <Avatar key={trainer._id} src={trainer.avatar} sx={{ bgcolor: "primary.main" }}>
                                    {trainer.name?.charAt(0)}
                                  </Avatar>
                                ))}
                              </AvatarGroup>
                              <Typography variant="body2">
                                {classItem.trainers?.map((t) => t.name).join(", ") || "Chưa có HLV"}
                              </Typography>
                            </Box>

                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Schedule fontSize="small" color="action" />
                              <Typography variant="body2">{classItem.recurrence?.length || 0} buổi/tuần</Typography>
                            </Box>

                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <CalendarMonth fontSize="small" color="action" />
                              <Typography variant="body2">
                                {new Date(classItem.startDate).toLocaleDateString("vi-VN")} -{" "}
                                {new Date(classItem.endDate).toLocaleDateString("vi-VN")}
                              </Typography>
                            </Box>

                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <LocationOn fontSize="small" color="action" />
                              <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                                {classItem.locationName || "Chưa xác định địa điểm"}
                              </Typography>
                            </Box>
                          </Stack>

                          <Divider sx={{ my: 2 }} />

                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography variant="h6" color="warning.dark" fontWeight={700}>
                              {formatPrice(classItem.price)}
                            </Typography>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => {
                                setSelectedClass(classItem)
                                setOpenDetailDialog(true)
                              }}
                              startIcon={<Info />}
                            >
                              Chi tiết
                            </Button>
                          </Box>

                          <Button
                            fullWidth
                            variant="contained"
                            sx={{ mt: 2 }}
                            onClick={() => handleEnrollClick(classItem)}
                            disabled={isClassFull(classItem) || isUserEnrolled(classItem._id)}
                          >
                            {isUserEnrolled(classItem._id)
                              ? "Đã đăng ký"
                              : isClassFull(classItem)
                                ? "Đã đầy"
                                : "Đăng ký ngay"}
                          </Button>
                        </CardContent>
                      </Card>
                    </Grow>
                  </Grid>
                ))
              )}
            </Grid>
          )}
        </Box>
      )}

      {/* Tab 2: Enrolled Classes - Professional Redesign */}
      {activeTab === 1 && (
        <Box>
          {enrolledClasses.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: "center", bgcolor: "grey.50" }}>
              <School sx={{ fontSize: 64, color: "grey.400", mb: 2 }} />
              <Typography variant="h5" color="text.secondary" gutterBottom>
                Bạn chưa đăng ký lớp học nào
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Khám phá các lớp học thú vị và bắt đầu hành trình học tập của bạn
              </Typography>
              <Button variant="contained" size="large" onClick={() => setActiveTab(0)}>
                Khám phá lớp học
              </Button>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {enrolledClasses.map((enrolledClass, index) => {
                console.log("🚀 ~ ClassEnrollmentPage ~ enrolledClass:", enrolledClass)
                const progress = calculateProgress(enrolledClass)
                const nextSession = getNextSession(enrolledClass)
                const paymentStatus = getPaymentStatusInfo(enrolledClass.paymentStatus)

                return (
                  <Grid item size={{ xs: 12 }} key={enrolledClass._id}>
                    <Grow in timeout={300 + index * 100}>
                      <Card
                        sx={{
                          borderRadius: 3,
                          overflow: "hidden",
                          transition: "all 0.3s ease-in-out",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
                          },
                        }}
                      >
                        <CardHeader
                          avatar={
                            <Avatar
                              sx={{
                                bgcolor:
                                  getClassTypeColor(enrolledClass.classType) === "success"
                                    ? "success.main"
                                    : getClassTypeColor(enrolledClass.classType) === "error"
                                      ? "error.main"
                                      : getClassTypeColor(enrolledClass.classType) === "secondary"
                                        ? "secondary.main"
                                        : "primary.main",
                                width: 56,
                                height: 56,
                              }}
                            >
                              {getClassTypeIcon(enrolledClass.classType)}
                            </Avatar>
                          }
                          action={
                            <Stack direction="row" spacing={1}>
                              <Chip
                                icon={paymentStatus.icon}
                                label={paymentStatus.label}
                                color={paymentStatus.color}
                                size="small"
                                variant="outlined"
                              />
                              <IconButton
                                onClick={() => {
                                  setSelectedClass(enrolledClass)
                                  setOpenDetailDialog(true)
                                }}
                              >
                                <Info />
                              </IconButton>
                            </Stack>
                          }
                          title={
                            <Typography variant="h5" fontWeight={700} color="primary">
                              {enrolledClass.name}
                            </Typography>
                          }
                          subheader={
                            <Box sx={{ mt: 1 }}>
                              <Chip
                                icon={getClassTypeIcon(enrolledClass.classType)}
                                label={enrolledClass.classType?.toUpperCase()}
                                color={getClassTypeColor(enrolledClass.classType)}
                                size="small"
                                sx={{ mr: 1 }}
                              />
                              <Typography variant="body2" color="text.secondary" component="span">
                                Đăng ký: {new Date(enrolledClass.enrolledAt).toLocaleDateString("vi-VN")}
                              </Typography>
                            </Box>
                          }
                        />

                        <CardContent sx={{ pt: 0 }}>
                          <Grid container spacing={3}>
                            {/* Left Column - Main Info */}
                            <Grid item size={{ xs: 12, md: 8 }}>
                              <Stack spacing={3}>
                                {/* Progress Section */}
                                <Paper
                                  elevation={0}
                                  sx={{
                                    p: 3,
                                    bgcolor: "primary.light",
                                    borderRadius: 2,
                                    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      mb: 2,
                                    }}
                                  >
                                    <Typography variant="h6" fontWeight={600}>
                                      Tiến độ học tập
                                    </Typography>
                                    <Typography variant="h6" color="primary" fontWeight={700}>
                                      {Math.round(progress.percentage)}%
                                    </Typography>
                                  </Box>
                                  <LinearProgress
                                    variant="determinate"
                                    value={progress.percentage}
                                    sx={{
                                      height: 8,
                                      borderRadius: 4,
                                      bgcolor: "rgba(255,255,255,0.3)",
                                      "& .MuiLinearProgress-bar": {
                                        borderRadius: 4,
                                      },
                                    }}
                                  />
                                  <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                      {progress.completed}/{progress.total} buổi học
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      {progress.total - progress.completed} buổi còn lại
                                    </Typography>
                                  </Box>
                                </Paper>

                                {/* Class Details */}
                                <Grid container spacing={2}>
                                  <Grid item size={{ xs: 12, sm: 6 }}>
                                    <Paper elevation={0} sx={{ p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
                                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                        <People fontSize="small" color="primary" />
                                        <Typography variant="subtitle2" fontWeight={600}>
                                          Huấn luyện viên
                                        </Typography>
                                      </Box>
                                      <Stack direction="row" spacing={1} alignItems="center">
                                        <AvatarGroup max={3} sx={{ "& .MuiAvatar-root": { width: 28, height: 28 } }}>
                                          {enrolledClass.trainers?.map((trainer) => (
                                            <Avatar key={trainer._id} src={trainer.avatar}>
                                              {trainer.name?.charAt(0)}
                                            </Avatar>
                                          ))}
                                        </AvatarGroup>
                                        <Box>
                                          {enrolledClass.trainers?.map((trainer, idx) => (
                                            <Typography key={trainer._id} variant="body2" fontWeight={500}>
                                              {trainer.name}
                                            </Typography>
                                          ))}
                                        </Box>
                                      </Stack>
                                    </Paper>
                                  </Grid>

                                  <Grid item size={{ xs: 12, sm: 6 }}>
                                    <Paper elevation={0} sx={{ p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
                                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                        <LocationOn fontSize="small" color="primary" />
                                        <Typography variant="subtitle2" fontWeight={600}>
                                          Địa điểm
                                        </Typography>
                                      </Box>
                                      <Typography variant="body2" fontWeight={500}>
                                        {enrolledClass.locationName}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary">
                                        {formatAddress(enrolledClass.address)}
                                      </Typography>
                                    </Paper>
                                  </Grid>

                                  <Grid item size={{ xs: 12, sm: 6 }}>
                                    <Paper elevation={0} sx={{ p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
                                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                        <CalendarMonth fontSize="small" color="primary" />
                                        <Typography variant="subtitle2" fontWeight={600}>
                                          Thời gian học
                                        </Typography>
                                      </Box>
                                      <Typography variant="body2" fontWeight={500}>
                                        {new Date(enrolledClass.startDate).toLocaleDateString("vi-VN")} -{" "}
                                        {new Date(enrolledClass.endDate).toLocaleDateString("vi-VN")}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary">
                                        {enrolledClass.recurrence
                                          ?.map(
                                            (r) =>
                                              `${getDayOfWeekLabel(r.dayOfWeek)} ${formatTime(r.startTime)}-${formatTime(r.endTime)}`,
                                          )
                                          .join(", ")}
                                      </Typography>
                                    </Paper>
                                  </Grid>

                                  <Grid item size={{ xs: 12, sm: 6 }}>
                                    <Paper elevation={0} sx={{ p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
                                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                        <MonetizationOn fontSize="small" color="primary" />
                                        <Typography variant="subtitle2" fontWeight={600}>
                                          Học phí
                                        </Typography>
                                      </Box>
                                      <Typography variant="h6" color="warning.dark" fontWeight={700}>
                                        {formatPrice(enrolledClass.price)}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary">
                                        Trạng thái: {paymentStatus.label}
                                      </Typography>
                                    </Paper>
                                  </Grid>
                                </Grid>
                              </Stack>
                            </Grid>

                            {/* Right Column - Next Session & Actions */}
                            <Grid item size={{ xs: 12, md: 4 }}>
                              <Stack spacing={3}>
                                {/* Next Session */}
                                {nextSession ? (
                                  <Paper
                                    elevation={0}
                                    sx={{
                                      p: 3,
                                      bgcolor: "success.light",
                                      borderRadius: 2,
                                      background: "linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)",
                                    }}
                                  >
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                                      <PlayArrow fontSize="small" color="success" />
                                      <Typography variant="subtitle1" fontWeight={600} color="success.dark">
                                        Buổi học tiếp theo
                                      </Typography>
                                    </Box>
                                    <Typography variant="h6" fontWeight={700} gutterBottom>
                                      {nextSession.title}
                                    </Typography>
                                    <Stack spacing={1}>
                                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <AccessTime fontSize="small" />
                                        <Typography variant="body2">
                                          {new Date(nextSession.startTime).toLocaleString("vi-VN")}
                                        </Typography>
                                      </Box>
                                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <LocationOn fontSize="small" />
                                        <Typography variant="body2">{nextSession.room}</Typography>
                                      </Box>
                                    </Stack>
                                  </Paper>
                                ) : (
                                  <Paper
                                    elevation={0}
                                    sx={{
                                      p: 3,
                                      bgcolor: "info.light",
                                      borderRadius: 2,
                                      background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
                                    }}
                                  >
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                                      <CheckCircle fontSize="small" color="info" />
                                      <Typography variant="subtitle1" fontWeight={600} color="info.dark">
                                        Trạng thái lớp học
                                      </Typography>
                                    </Box>
                                    <Typography variant="body1" fontWeight={600}>
                                      Đã hoàn thành tất cả buổi học
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      Chúc mừng bạn đã hoàn thành khóa học!
                                    </Typography>
                                  </Paper>
                                )}

                                {/* Quick Stats */}
                                <Paper elevation={0} sx={{ p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
                                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                    Thống kê nhanh
                                  </Typography>
                                  <Grid container spacing={1}>
                                    <Grid item size={{ xs: 6 }}>
                                      <Box sx={{ textAlign: "center", p: 1 }}>
                                        <Typography variant="h6" color="primary" fontWeight={700}>
                                          {progress.completed}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                          Buổi đã học
                                        </Typography>
                                      </Box>
                                    </Grid>
                                    <Grid item size={{ xs: 6 }}>
                                      <Box sx={{ textAlign: "center", p: 1 }}>
                                        <Typography variant="h6" color="warning.dark" fontWeight={700}>
                                          {progress.total - progress.completed}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                          Buổi còn lại
                                        </Typography>
                                      </Box>
                                    </Grid>
                                  </Grid>
                                </Paper>

                                {/* Action Buttons */}
                                <Stack spacing={2}>
                                  <Button
                                    fullWidth
                                    variant="outlined"
                                    startIcon={<Info />}
                                    onClick={() => {
                                      setSelectedClass(enrolledClass)
                                      setOpenDetailDialog(true)
                                    }}
                                  >
                                    Xem chi tiết
                                  </Button>

                                  {enrolledClass.paymentStatus?.toLowerCase() === "paid" &&
                                    progress.completed < progress.total && (
                                      <Button
                                        fullWidth
                                        variant="outlined"
                                        color="error"
                                        startIcon={<Cancel />}
                                        onClick={() => {
                                          setSelectedEnrollment(enrolledClass)
                                          setOpenCancelDialog(true)
                                        }}
                                      >
                                        Hủy đăng ký
                                      </Button>
                                    )}
                                </Stack>
                              </Stack>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grow>
                  </Grid>
                )
              })}
            </Grid>
          )}
        </Box>
      )}

      {/* Class Detail Dialog - Using the new component */}
      <ClassDetailDialog open={openDetailDialog} onClose={() => setOpenDetailDialog(false)} classData={selectedClass} />

      {/* Enrollment Dialog */}
      <Dialog open={openEnrollDialog} onClose={() => setOpenEnrollDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h5" fontWeight={600} color="primary">
            Xác nhận đăng ký lớp học
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedClass && (
            <Box sx={{ pt: 1 }}>
              <Alert severity="info" sx={{ mb: 3 }}>
                Vui lòng xem lại thông tin lớp học trước khi thanh toán
              </Alert>

              {/* Class Information Card */}
              <Card sx={{ mb: 3, border: "1px solid", borderColor: "divider" }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Typography variant="h6" fontWeight={600} color="primary">
                      {selectedClass.name}
                    </Typography>
                    <Chip
                      icon={getClassTypeIcon(selectedClass.classType)}
                      label={selectedClass.classType?.toUpperCase()}
                      color={getClassTypeColor(selectedClass.classType)}
                      size="small"
                    />
                  </Box>

                  {selectedClass.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      {selectedClass.description}
                    </Typography>
                  )}

                  <Divider sx={{ my: 2 }} />

                  <Grid container spacing={2}>
                    <Grid item size={{ xs: 12, sm: 6 }}>
                      <Stack spacing={2}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <People fontSize="small" color="primary" />
                          <Typography variant="body2">
                            <strong>Sĩ số:</strong> {selectedClass.enrolled || 0}/{selectedClass.capacity || 0} học viên
                          </Typography>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Person fontSize="small" color="primary" />
                          <Box>
                            <Typography variant="body2">
                              <strong> :</strong>
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                              <AvatarGroup
                                max={3}
                                sx={{ "& .MuiAvatar-root": { width: 24, height: 24, fontSize: "0.75rem" } }}
                              >
                                {selectedClass.trainers?.map((trainer) => (
                                  <Avatar key={trainer._id} src={trainer.avatar} sx={{ bgcolor: "primary.main" }}>
                                    {trainer.name?.charAt(0)}
                                  </Avatar>
                                ))}
                              </AvatarGroup>
                              <Typography variant="body2">
                                {selectedClass.trainers?.map((t) => t.name).join(", ") || "Chưa có HLV"}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Schedule fontSize="small" color="primary" />
                          <Typography variant="body2">
                            <strong>Tần suất:</strong> {selectedClass.recurrence?.length || 0} buổi/tuần
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>

                    <Grid item size={{ xs: 12, sm: 6 }}>
                      <Stack spacing={2}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <CalendarMonth fontSize="small" color="primary" />
                          <Box>
                            <Typography variant="body2">
                              <strong>Thời gian:</strong>
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(selectedClass.startDate).toLocaleDateString("vi-VN")} -{" "}
                              {new Date(selectedClass.endDate).toLocaleDateString("vi-VN")}
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <LocationOn fontSize="small" color="primary" />
                          <Box>
                            <Typography variant="body2">
                              <strong>Địa điểm:</strong>
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {selectedClass.locationName || "Chưa xác định"}
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <AccessTime fontSize="small" color="primary" />
                          <Box>
                            <Typography variant="body2">
                              <strong>Tổng số buổi:</strong>
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {selectedClass.classSession?.length || 0} buổi học
                            </Typography>
                          </Box>
                        </Box>
                      </Stack>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 3 }} />

                  {/* Price Section */}
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 1,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="h6" fontWeight={600}>
                      Học phí:
                    </Typography>
                    <Typography variant="h4" color="warning.dark" fontWeight={700}>
                      {formatPrice(selectedClass.price)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              <Alert severity="warning">
                <Typography variant="body2">
                  • Vui lòng đến đúng giờ trong buổi học đầu tiên
                  <br />• Liên hệ với chúng tôi nếu có bất kỳ thắc mắc nào
                </Typography>
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenEnrollDialog(false)} color="inherit" size="large">
            Hủy
          </Button>
          <Button onClick={handleEnrollSubmit} variant="contained" size="large">
            Thanh toán ngay
          </Button>
        </DialogActions>
      </Dialog>

      {/* Payment Modal using SelectPaymentModal */}
      <SelectPaymentModal
        open={openPaymentDialog}
        onClose={() => {
          if (!loading) {
            setOpenPaymentDialog(false)
          }
        }}
        title="Thanh toán học phí"
        subtitle="Hoàn tất thanh toán để xác nhận đăng ký lớp học"
        summaryCard={
          selectedClass ? (
            <Card sx={{ mb: 2, bgcolor: "grey.50" }}>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Thông tin thanh toán
                </Typography>
                <Stack spacing={1}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2">Lớp học:</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {selectedClass.name}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="body2">Loại:</Typography>
                    <Chip
                      label={selectedClass.classType?.toUpperCase()}
                      size="small"
                      color={getClassTypeColor(selectedClass.classType)}
                    />
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2">Thời gian:</Typography>
                    <Typography variant="body2">
                      {new Date(selectedClass.startDate).toLocaleDateString("vi-VN")} -{" "}
                      {new Date(selectedClass.endDate).toLocaleDateString("vi-VN")}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2">Địa điểm:</Typography>
                    <Typography variant="body2" sx={{ maxWidth: "60%", textAlign: "right" }}>
                      {selectedClass.locationName || "Chưa xác định"}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2">Số buổi học:</Typography>
                    <Typography variant="body2">{selectedClass.classSession?.length || 0} buổi</Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2">Huấn luyện viên:</Typography>
                    <Typography variant="body2" sx={{ maxWidth: "60%", textAlign: "right" }}>
                      {selectedClass.trainers?.map((t) => t.name).join(", ") || "Chưa có HLV"}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="subtitle1" fontWeight={700}>
                      Tổng cộng:
                    </Typography>
                    <Typography variant="h6" color="warning.dark" fontWeight={700}>
                      {formatPrice(selectedClass.price)}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ) : null
        }
        onPaymentMethodSelect={handlePaymentMethodSelect}
        confirmButtonText="Xác nhận thanh toán"
        cancelButtonText="Hủy thanh toán"
        isProcessing={loading}
      />

      {/* Cancel Enrollment Dialog */}
      <Dialog open={openCancelDialog} onClose={() => setOpenCancelDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" color="error">
            Xác nhận hủy lớp học
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedEnrollment && (
            <Box>
              <Alert severity="warning" sx={{ mb: 3 }}>
                Bạn có chắc chắn muốn hủy lớp học <strong>{selectedEnrollment.name}</strong>?
              </Alert>

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Lý do hủy lớp học *"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Vui lòng cho biết lý do..."
                error={!cancelReason.trim()}
              />

              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  • Hủy trước khi lớp bắt đầu: Hoàn 100% học phí
                  <br />
                  Hủy sau khi lớp bắt đầu: Không hoàn học phí
                </Typography>
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenCancelDialog(false)} color="inherit">
            Không hủy
          </Button>
          <Button
            onClick={handleCancelEnrollment}
            color="error"
            variant="contained"
            disabled={loading || !cancelReason.trim()}
            startIcon={<Cancel />}
          >
            {loading ? "Đang xử lý..." : "Xác nhận hủy"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default ClassEnrollmentPage
