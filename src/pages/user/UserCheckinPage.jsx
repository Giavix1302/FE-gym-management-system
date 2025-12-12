import React, { useState, useEffect } from "react"
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Divider,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  useTheme,
  useMediaQuery,
  Stack,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  LinearProgress,
} from "@mui/material"
import {
  QrCode2,
  AccessTime,
  LocationOn,
  History,
  CheckCircle,
  Cancel,
  Close,
  Schedule,
  FitnessCenter,
  CalendarToday,
  TrendingUp,
  Timeline,
  Today,
} from "@mui/icons-material"
import { format, parseISO, differenceInHours, startOfWeek, endOfWeek, isWithinInterval } from "date-fns"
import { vi } from "date-fns/locale"
import useUserStore from "~/stores/useUserStore"
import { getListAttendanceByUserIdAPI } from "~/apis/attendance"
import useLocationStore from "~/stores/useLocationStore"

function UserCheckinPage() {
  const { user } = useUserStore()
  const { locations } = useLocationStore()

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [currentCheckin, setCurrentCheckin] = useState(null)
  const [loading, setLoading] = useState(false)
  const [qrDialogOpen, setQrDialogOpen] = useState(false)
  const [checkinHistory, setCheckinHistory] = useState([])
  const [weeklyStats, setWeeklyStats] = useState({
    thisWeek: 0,
    lastWeek: 0,
    totalHours: 0,
    avgHours: 0,
  })

  // Helper function để lấy tên location từ locationId
  const getLocationNameById = (locationId) => {
    if (!locationId) {
      return "Unknown Location"
    }

    if (!locations || locations.length === 0) {
      return "Loading..."
    }

    const location = locations.find((loc) => loc._id === locationId)
    return location?.name || "Unknown Location"
  }

  useEffect(() => {
    const init = async () => {
      if (!user?._id) return

      if (!locations || locations.length === 0) return

      try {
        const result = await getListAttendanceByUserIdAPI(user._id)

        if (result?.success && result?.attendances) {
          const attendances = result.attendances

          // Transform dữ liệu từ API để match với UI
          const transformedData = attendances.map((attendance) => ({
            _id: attendance._id,
            checkinTime: attendance.checkinTime,
            checkoutTime: attendance.checkoutTime || "",
            locationName: getLocationNameById(attendance.locationId),
            locationId: attendance.locationId,
            hours: attendance.hours,
            method: attendance.method,
          }))

          setCheckinHistory(transformedData)

          // Kiểm tra xem có checkin đang active không (chưa có checkoutTime)
          const activeCheckin = transformedData.find((item) => !item.checkoutTime)
          if (activeCheckin) {
            setIsCheckedIn(true)
            setCurrentCheckin(activeCheckin)
          }

          // Tính toán thống kê tuần
          const now = new Date()
          const thisWeekStart = startOfWeek(now, { weekStartsOn: 1 })
          const thisWeekEnd = endOfWeek(now, { weekStartsOn: 1 })
          const lastWeekStart = startOfWeek(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), { weekStartsOn: 1 })
          const lastWeekEnd = endOfWeek(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), { weekStartsOn: 1 })

          const thisWeekCheckins = transformedData.filter((item) => {
            const checkinDate = parseISO(item.checkinTime)
            return isWithinInterval(checkinDate, { start: thisWeekStart, end: thisWeekEnd })
          })

          const lastWeekCheckins = transformedData.filter((item) => {
            const checkinDate = parseISO(item.checkinTime)
            return isWithinInterval(checkinDate, { start: lastWeekStart, end: lastWeekEnd })
          })

          // Sử dụng field hours từ API thay vì tính toán lại
          const totalHours = transformedData.reduce((acc, item) => {
            return acc + (item.hours || 0)
          }, 0)

          const completedSessions = transformedData.filter((item) => item.checkoutTime && item.hours > 0)

          setWeeklyStats({
            thisWeek: thisWeekCheckins.length,
            lastWeek: lastWeekCheckins.length,
            totalHours: Math.round(totalHours * 10) / 10, // Làm tròn 1 chữ số thập phân
            avgHours: completedSessions.length > 0 ? Math.round((totalHours / completedSessions.length) * 10) / 10 : 0,
          })
        }
      } catch (error) {
        console.error("Error fetching attendance data:", error)
      }
    }

    init()
  }, [user?._id, locations])

  const handleShowQR = () => {
    setQrDialogOpen(true)
  }

  const formatTime = (timeString) => {
    if (!timeString) return "--"
    return format(parseISO(timeString), "HH:mm", { locale: vi })
  }

  const formatDate = (timeString) => {
    if (!timeString) return "--"
    return format(parseISO(timeString), "dd/MM/yyyy", { locale: vi })
  }

  const calculateTrainingTime = (checkinTime, checkoutTime, hours) => {
    if (!checkinTime || !checkoutTime) return "--"

    // Ưu tiên sử dụng field hours từ API
    if (hours !== undefined && hours !== null) {
      const wholeHours = Math.floor(hours)
      const minutes = Math.round((hours - wholeHours) * 60)
      return wholeHours > 0 ? `${wholeHours}h${minutes > 0 ? ` ${minutes}m` : ""}` : `${minutes}m`
    }

    // Fallback tính toán nếu không có field hours
    const totalHours = differenceInHours(parseISO(checkoutTime), parseISO(checkinTime))
    const minutes = Math.round(((parseISO(checkoutTime) - parseISO(checkinTime)) % (1000 * 60 * 60)) / (1000 * 60))
    return `${totalHours}h${minutes > 0 ? ` ${minutes}m` : ""}`
  }

  const getStatusChip = (checkinTime, checkoutTime) => {
    if (!checkoutTime) {
      return <Chip label="Đang tập luyện" color="success" size="small" icon={<FitnessCenter />} />
    }
    return <Chip label="Đã hoàn thành" color="default" size="small" icon={<CheckCircle />} />
  }

  const MobileHistoryList = () => (
    <List>
      {checkinHistory.slice(0, 10).map((record, index) => (
        <React.Fragment key={record._id}>
          <ListItem alignItems="flex-start" sx={{ px: 0 }}>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: record.checkoutTime ? "success.main" : "warning.main" }}>
                {record.checkoutTime ? <CheckCircle /> : <FitnessCenter />}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {formatDate(record.checkinTime)}
                  </Typography>
                  {getStatusChip(record.checkinTime, record.checkoutTime)}
                </Box>
              }
              secondary={
                <Stack spacing={1}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Checkin:
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {formatTime(record.checkinTime)}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Checkout:
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {formatTime(record.checkoutTime)}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Thời gian tập:
                    </Typography>
                    <Typography variant="body2" fontWeight="medium" color="primary">
                      {calculateTrainingTime(record.checkinTime, record.checkoutTime, record.hours)}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <LocationOn fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {record.locationName}
                    </Typography>
                  </Box>
                </Stack>
              }
            />
          </ListItem>
          {index < Math.min(checkinHistory.length, 10) - 1 && <Divider variant="inset" component="li" />}
        </React.Fragment>
      ))}
    </List>
  )

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Banner Section - tương tự UserHomePage */}
      <Card sx={{ mb: 3, background: "linear-gradient(135deg, #16697A 0%, #1A7A8A 100%)", color: "white" }}>
        <CardContent sx={{ py: 4 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              flexDirection: isMobile ? "column" : "row",
              textAlign: isMobile ? "center" : "left",
            }}
          >
            <Avatar
              src={user?.avatar}
              sx={{
                width: isMobile ? 100 : 100,
                height: isMobile ? 100 : 100,
                border: "3px solid white",
              }}
            >
              {user?.fullName?.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {user?.fullName || "Người dùng"}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  justifyContent: isMobile ? "center" : "flex-start",
                }}
              >
                <Typography variant="h6">Trạng thái tập luyện:</Typography>
                <Chip
                  label={isCheckedIn ? "Đang tập luyện" : "Chưa checkin"}
                  color={isCheckedIn ? "success" : "warning"}
                  icon={isCheckedIn ? <FitnessCenter /> : <Schedule />}
                  sx={{ color: "white", fontWeight: "bold" }}
                />
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Stats Cards Row */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Trạng thái hiện tại */}
        <Grid item size={{ xs: 12, md: 6, lg: 3 }}>
          <Card
            sx={{
              height: "100%",
              border: isCheckedIn ? "2px solid" : "1px solid",
              borderColor: isCheckedIn ? "success.main" : "grey.300",
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
                Trạng thái hiện tại
              </Typography>

              {isCheckedIn ? (
                <Box>
                  <Alert severity="success" sx={{ mb: 2 }} icon={<CheckCircle />}>
                    Đang tập luyện
                  </Alert>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Checkin lúc: <strong>{formatTime(currentCheckin?.checkinTime)}</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Tại: <strong>{currentCheckin?.locationName}</strong>
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <Alert severity="info" sx={{ mb: 2 }} icon={<Schedule />}>
                    Chưa checkin tập luyện hôm nay
                  </Alert>
                  <Button variant="contained" fullWidth onClick={handleShowQR} startIcon={<QrCode2 />}>
                    Hiển thị QR Code
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Thống kê tuần này */}
        <Grid item size={{ xs: 12, md: 6, lg: 3 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
                Tuần này
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <Today color="primary" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h3" fontWeight="bold" color="primary">
                    {weeklyStats.thisWeek}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    buổi tập
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <TrendingUp
                  fontSize="small"
                  color={weeklyStats.thisWeek >= weeklyStats.lastWeek ? "success" : "error"}
                />
                <Typography
                  variant="body2"
                  color={weeklyStats.thisWeek >= weeklyStats.lastWeek ? "success.main" : "error.main"}
                >
                  {weeklyStats.thisWeek >= weeklyStats.lastWeek
                    ? `+${weeklyStats.thisWeek - weeklyStats.lastWeek}`
                    : `${weeklyStats.thisWeek - weeklyStats.lastWeek}`}{" "}
                  so với tuần trước
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Tổng giờ tập luyện */}
        <Grid item size={{ xs: 12, md: 6, lg: 3 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
                Tổng giờ tập luyện
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <Timeline color="primary" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h3" fontWeight="bold" color="primary">
                    {weeklyStats.totalHours}h
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    tổng cộng
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Trung bình: {weeklyStats.avgHours}h/buổi
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* QR Code */}
        <Grid item size={{ xs: 12, md: 6, lg: 3 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
                QR Code của bạn
              </Typography>
              <Box
                sx={{
                  display: "inline-block",
                  p: 1,
                  bgcolor: "white",
                  borderRadius: 2,
                  border: "2px solid",
                  borderColor: "primary.main",
                  mb: 2,
                }}
              >
                <Box
                  component="img"
                  src={user?.qrCode}
                  alt="User QR Code"
                  sx={{
                    width: 100,
                    height: 100,
                    display: "block",
                  }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Đưa cho nhân viên để checkin/checkout
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Lịch sử checkin */}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
            Lịch sử tập luyện
          </Typography>

          {isMobile ? (
            <Box sx={{ maxHeight: 600, overflowY: "auto" }}>
              {checkinHistory.length > 0 ? (
                <MobileHistoryList />
              ) : (
                <Box py={4} textAlign="center">
                  <CalendarToday color="disabled" sx={{ fontSize: 48, mb: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    Chưa có lịch sử tập luyện
                  </Typography>
                </Box>
              )}
            </Box>
          ) : (
            <TableContainer sx={{ maxHeight: 600 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Ngày</TableCell>
                    <TableCell>Giờ vào</TableCell>
                    <TableCell>Giờ ra</TableCell>
                    <TableCell>Địa điểm</TableCell>
                    <TableCell>Thời gian tập</TableCell>
                    <TableCell>Trạng thái</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {checkinHistory.map((record) => (
                    <TableRow key={record._id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {formatDate(record.checkinTime)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{formatTime(record.checkinTime)}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{formatTime(record.checkoutTime)}</Typography>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <LocationOn fontSize="small" color="action" />
                          <Typography variant="body2">{record.locationName}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium" color="primary">
                          {calculateTrainingTime(record.checkinTime, record.checkoutTime, record.hours)}
                        </Typography>
                      </TableCell>
                      <TableCell>{getStatusChip(record.checkinTime, record.checkoutTime)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {checkinHistory.length === 0 && !isMobile && (
            <Box py={4} textAlign="center">
              <CalendarToday color="disabled" sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                Chưa có lịch sử tập luyện
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Dialog QR Code */}
      <Dialog open={qrDialogOpen} onClose={() => setQrDialogOpen(false)} maxWidth="sm" fullWidth fullScreen={isMobile}>
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Mã QR Checkin</Typography>
            <IconButton onClick={() => setQrDialogOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box textAlign="center" py={2}>
            <Box
              display="inline-block"
              p={3}
              bgcolor="white"
              borderRadius={2}
              border="3px solid"
              borderColor="primary.main"
              mb={3}
            >
              <Box
                component="img"
                src={user?.qrCode}
                alt="User QR Code"
                sx={{
                  width: isMobile ? 180 : 200,
                  height: isMobile ? 180 : 200,
                  display: "block",
                }}
              />
            </Box>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              {user?.fullName || "Người dùng"}
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={3}>
              Đưa mã QR này cho nhân viên để checkin/checkout tập luyện
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setQrDialogOpen(false)} color="inherit" fullWidth variant="contained">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default UserCheckinPage
