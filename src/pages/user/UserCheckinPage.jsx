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

function UserCheckinPage() {
  const { user } = useUserStore()
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

  // Mock data cho lịch sử checkin với cấu trúc như yêu cầu
  const mockdata = [
    {
      _id: "1",
      checkinTime: "2024-10-15T08:00:00.000Z",
      checkoutTime: "2024-10-15T17:30:00.000Z",
      locationName: "Gym Tân Bình",
    },
    {
      _id: "2",
      checkinTime: "2024-10-14T08:15:00.000Z",
      checkoutTime: "2024-10-14T17:00:00.000Z",
      locationName: "Gym Quận 3",
    },
    {
      _id: "3",
      checkinTime: "2024-10-13T08:30:00.000Z",
      checkoutTime: "2024-10-13T16:45:00.000Z",
      locationName: "Gym Quận 1",
    },
    {
      _id: "4",
      checkinTime: "2024-10-12T09:00:00.000Z",
      checkoutTime: "2024-10-12T18:00:00.000Z",
      locationName: "Gym Quận 7",
    },
    {
      _id: "5",
      checkinTime: "2024-10-11T08:45:00.000Z",
      checkoutTime: "2024-10-11T17:15:00.000Z",
      locationName: "Gym Tân Bình",
    },
    {
      _id: "6",
      checkinTime: "2024-10-10T09:30:00.000Z",
      checkoutTime: "2024-10-10T18:30:00.000Z",
      locationName: "Gym Quận 1",
    },
    {
      _id: "7",
      checkinTime: "2024-10-09T08:00:00.000Z",
      checkoutTime: "2024-10-09T17:00:00.000Z",
      locationName: "Gym Quận 7",
    },
    {
      _id: "8",
      checkinTime: "2024-10-08T08:30:00.000Z",
      checkoutTime: "",
      locationName: "Gym Tân Bình",
    },
  ]

  useEffect(() => {
    setCheckinHistory(mockdata)

    // Kiểm tra xem có checkin đang active không
    const activeCheckin = mockdata.find((item) => !item.checkoutTime)
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

    const thisWeekCheckins = mockdata.filter((item) => {
      const checkinDate = parseISO(item.checkinTime)
      return isWithinInterval(checkinDate, { start: thisWeekStart, end: thisWeekEnd })
    })

    const lastWeekCheckins = mockdata.filter((item) => {
      const checkinDate = parseISO(item.checkinTime)
      return isWithinInterval(checkinDate, { start: lastWeekStart, end: lastWeekEnd })
    })

    const totalHours = mockdata.reduce((acc, item) => {
      if (item.checkoutTime) {
        const hours = differenceInHours(parseISO(item.checkoutTime), parseISO(item.checkinTime))
        return acc + hours
      }
      return acc
    }, 0)

    setWeeklyStats({
      thisWeek: thisWeekCheckins.length,
      lastWeek: lastWeekCheckins.length,
      totalHours,
      avgHours:
        mockdata.filter((item) => item.checkoutTime).length > 0
          ? Math.round((totalHours / mockdata.filter((item) => item.checkoutTime).length) * 10) / 10
          : 0,
    })
  }, [])

  const handleShowQR = () => {
    setQrDialogOpen(true)
  }

  const handleCheckin = () => {
    setLoading(true)
    setTimeout(() => {
      const newCheckin = {
        _id: Date.now().toString(),
        checkinTime: new Date().toISOString(),
        checkoutTime: "",
        locationName: "Gym Tân Bình",
      }
      setCurrentCheckin(newCheckin)
      setIsCheckedIn(true)
      setCheckinHistory((prev) => [newCheckin, ...prev])
      setLoading(false)
      setQrDialogOpen(false)
    }, 2000)
  }

  const handleCheckout = () => {
    setLoading(true)
    setTimeout(() => {
      const updatedCheckin = {
        ...currentCheckin,
        checkoutTime: new Date().toISOString(),
      }
      setCurrentCheckin(null)
      setIsCheckedIn(false)
      setCheckinHistory((prev) => prev.map((item) => (item._id === currentCheckin._id ? updatedCheckin : item)))
      setLoading(false)
    }, 2000)
  }

  const formatTime = (timeString) => {
    if (!timeString) return "--"
    return format(parseISO(timeString), "HH:mm", { locale: vi })
  }

  const formatDate = (timeString) => {
    if (!timeString) return "--"
    return format(parseISO(timeString), "dd/MM/yyyy", { locale: vi })
  }

  const formatFullDate = (timeString) => {
    if (!timeString) return "--"
    return format(parseISO(timeString), "EEEE, dd/MM/yyyy", { locale: vi })
  }

  const calculateTrainingTime = (checkinTime, checkoutTime) => {
    if (!checkinTime || !checkoutTime) return "--"
    const hours = differenceInHours(parseISO(checkoutTime), parseISO(checkinTime))
    const minutes = Math.round(((parseISO(checkoutTime) - parseISO(checkinTime)) % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h${minutes > 0 ? ` ${minutes}m` : ""}`
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
                      {calculateTrainingTime(record.checkinTime, record.checkoutTime)}
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
                  <Button
                    variant="contained"
                    color="error"
                    fullWidth
                    onClick={handleCheckout}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={16} /> : <Cancel />}
                    sx={{ mt: 2 }}
                  >
                    {loading ? "Đang checkout..." : "Kết thúc tập luyện"}
                  </Button>
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
                          {calculateTrainingTime(record.checkinTime, record.checkoutTime)}
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
              Đưa mã QR này cho nhân viên để checkin tập luyện
            </Typography>
            <Divider sx={{ my: 3 }} />
            <Typography variant="body2" color="text.secondary">
              Hoặc bạn có thể tự checkin bằng cách nhấn nút bên dưới
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setQrDialogOpen(false)} color="inherit" fullWidth={isMobile}>
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleCheckin}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <CheckCircle />}
            fullWidth={isMobile}
            sx={{ ml: isMobile ? 0 : 1, mt: isMobile ? 1 : 0 }}
          >
            {loading ? "Đang checkin..." : "Bắt đầu tập luyện"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default UserCheckinPage
