import React from "react"
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  LinearProgress,
  Divider,
  IconButton,
} from "@mui/material"
// icon
import {
  Edit as EditIcon,
  FitnessCenter as FitnessCenterIcon,
  CalendarToday as CalendarIcon,
  Payment as PaymentIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Cake as CakeIcon,
} from "@mui/icons-material"
import CloseIcon from "@mui/icons-material/Close"
// chart
import { LineChart } from "@mui/x-charts/LineChart"
// custom
import GymCalendar from "~/utils/Calendar"
//react
import { useState } from "react"

// Mock data
const mockUser = {
  fullName: "Nguyễn Hoàng Gia Vĩ",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  age: 25,
  gender: "Nam",
  phone: "0123456789",
  address: "123 Nguyễn Văn Linh, Quận 7, TP.HCM",
  membershipStatus: "Inactive",
}

const mockMembership = {
  packageName: "Premium Plus",
  startDate: "01/08/2025",
  endDate: "01/02/2026",
  status: "active",
  sessionsUsed: 15,
  totalSessions: 30,
  daysLeft: 92,
}

const mockProgressData = [
  { month: "Tháng 1", weight: 70, bmi: 23, bodyFat: 18 },
  { month: "Tháng 2", weight: 69, bmi: 22.8, bodyFat: 17.5 },
  { month: "Tháng 3", weight: 68, bmi: 22.5, bodyFat: 17 },
  { month: "Tháng 4", weight: 67, bmi: 22.2, bodyFat: 16.8 },
  { month: "Tháng 5", weight: 66, bmi: 22, bodyFat: 16.5 },
  { month: "Tháng 6", weight: 65, bmi: 21.8, bodyFat: 16 },
  { month: "Tháng 7", weight: 64.5, bmi: 21.5, bodyFat: 15.8 },
  { month: "Tháng 8", weight: 64, bmi: 21.3, bodyFat: 15.5 },
  { month: "Tháng 9", weight: 63.5, bmi: 21, bodyFat: 15.2 },
  { month: "Tháng 10", weight: 63, bmi: 20.8, bodyFat: 15 },
  { month: "Tháng 11", weight: 62.5, bmi: 20.6, bodyFat: 14.8 },
  { month: "Tháng 12", weight: 62, bmi: 20.4, bodyFat: 14.5 },
]

const mockBookings = [
  { id: 1, type: "PT", trainer: "Nguyễn Minh Tâm", date: "03/09/2025", time: "18:00", status: "upcoming" },
  { id: 2, type: "Class", name: "Yoga Buổi Sáng", date: "05/09/2025", time: "07:00", status: "upcoming" },
  { id: 3, type: "PT", trainer: "Trần Việt Anh", date: "01/09/2025", time: "19:00", status: "completed" },
  { id: 1, type: "PT", trainer: "Nguyễn Minh Tâm", date: "03/09/2025", time: "18:00", status: "upcoming" },
  { id: 2, type: "Class", name: "Yoga Buổi Sáng", date: "05/09/2025", time: "07:00", status: "upcoming" },
  { id: 3, type: "PT", trainer: "Trần Việt Anh", date: "01/09/2025", time: "19:00", status: "completed" },
  { id: 1, type: "PT", trainer: "Nguyễn Minh Tâm", date: "03/09/2025", time: "18:00", status: "upcoming" },
  { id: 2, type: "Class", name: "Yoga Buổi Sáng", date: "05/09/2025", time: "07:00", status: "upcoming" },
  { id: 3, type: "PT", trainer: "Trần Việt Anh", date: "01/09/2025", time: "19:00", status: "completed" },
  { id: 1, type: "PT", trainer: "Nguyễn Minh Tâm", date: "03/09/2025", time: "18:00", status: "upcoming" },
  { id: 2, type: "Class", name: "Yoga Buổi Sáng", date: "05/09/2025", time: "07:00", status: "upcoming" },
  { id: 3, type: "PT", trainer: "Trần Việt Anh", date: "01/09/2025", time: "19:00", status: "completed" },
  { id: 1, type: "PT", trainer: "Nguyễn Minh Tâm", date: "03/09/2025", time: "18:00", status: "upcoming" },
  { id: 2, type: "Class", name: "Yoga Buổi Sáng", date: "05/09/2025", time: "07:00", status: "upcoming" },
  { id: 3, type: "PT", trainer: "Trần Việt Anh", date: "01/09/2025", time: "19:00", status: "completed" },
]

const mockPayments = [
  { id: "PAY001", package: "Premium Plus", amount: "2,500,000", date: "01/08/2025", status: "Thành công" },
  { id: "PAY002", package: "Basic", amount: "1,200,000", date: "01/05/2025", status: "Thành công" },
  { id: "PAY003", package: "Premium", amount: "1,800,000", date: "01/02/2025", status: "Thành công" },
  { id: "PAY004", package: "Premium Plus", amount: "2,500,000", date: "01/08/2025", status: "Thành công" },
  { id: "PAY005", package: "Basic", amount: "1,200,000", date: "01/05/2025", status: "Thành công" },
  { id: "PAY006", package: "Premium", amount: "1,800,000", date: "01/02/2025", status: "Thành công" },
  { id: "PAY007", package: "Premium Plus", amount: "2,500,000", date: "01/08/2025", status: "Thành công" },
  { id: "PAY008", package: "Basic", amount: "1,200,000", date: "01/05/2025", status: "Thành công" },
  { id: "PAY009", package: "Premium", amount: "1,800,000", date: "01/02/2025", status: "Thành công" },
  { id: "PAY0010", package: "Premium Plus", amount: "2,500,000", date: "01/08/2025", status: "Thành công" },
  { id: "PAY0011", package: "Basic", amount: "1,200,000", date: "01/05/2025", status: "Thành công" },
  { id: "PAY0012", package: "Premium", amount: "1,800,000", date: "01/02/2025", status: "Thành công" },
  { id: "PAY0013", package: "Premium Plus", amount: "2,500,000", date: "01/08/2025", status: "Thành công" },
  { id: "PAY0014", package: "Basic", amount: "1,200,000", date: "01/05/2025", status: "Thành công" },
  { id: "PAY0015", package: "Premium", amount: "1,800,000", date: "01/02/2025", status: "Thành công" },
]

const mockCheckins = [
  { date: "02/09/2025", time: "18:30", location: "Gym Tân Bình" },
  { date: "30/08/2025", time: "19:15", location: "Gym Tân Bình" },
  { date: "28/08/2025", time: "17:45", location: "Gym Quận 7" },
  { date: "26/08/2025", time: "18:00", location: "Gym Tân Bình" },
  { date: "24/08/2025", time: "20:00", location: "Gym Quận 1" },
  { date: "02/09/2025", time: "18:30", location: "Gym Tân Bình" },
  { date: "30/08/2025", time: "19:15", location: "Gym Tân Bình" },
  { date: "28/08/2025", time: "17:45", location: "Gym Quận 7" },
  { date: "26/08/2025", time: "18:00", location: "Gym Tân Bình" },
  { date: "24/08/2025", time: "20:00", location: "Gym Quận 1" },
  { date: "02/09/2025", time: "18:30", location: "Gym Tân Bình" },
  { date: "30/08/2025", time: "19:15", location: "Gym Tân Bình" },
  { date: "28/08/2025", time: "17:45", location: "Gym Quận 7" },
  { date: "26/08/2025", time: "18:00", location: "Gym Tân Bình" },
  { date: "24/08/2025", time: "20:00", location: "Gym Quận 1" },
  { date: "02/09/2025", time: "18:30", location: "Gym Tân Bình" },
  { date: "30/08/2025", time: "19:15", location: "Gym Tân Bình" },
  { date: "28/08/2025", time: "17:45", location: "Gym Quận 7" },
  { date: "26/08/2025", time: "18:00", location: "Gym Tân Bình" },
  { date: "24/08/2025", time: "20:00", location: "Gym Quận 1" },
  { date: "02/09/2025", time: "18:30", location: "Gym Tân Bình" },
  { date: "30/08/2025", time: "19:15", location: "Gym Tân Bình" },
  { date: "28/08/2025", time: "17:45", location: "Gym Quận 7" },
  { date: "26/08/2025", time: "18:00", location: "Gym Tân Bình" },
  { date: "24/08/2025", time: "20:00", location: "Gym Quận 1" },
]

function UserHomePage() {
  const progressPercentage = (mockMembership.sessionsUsed / mockMembership.totalSessions) * 100

  const [events, setEvents] = useState([
    {
      title: "Yoga buổi sáng",
      start: new Date(2025, 8, 1, 8, 0),
      end: new Date(2025, 8, 1, 12, 30),
      coach: "HLV Anna",
      room: "Phòng 101",
    },
    {
      title: "PT - Cardio Training",
      start: new Date(2025, 8, 2, 14, 0),
      end: new Date(2025, 8, 2, 22, 0),
      coach: "HLV Minh",
      room: "Phòng 202",
    },
  ])

  return (
    <Container sx={{ py: 3 }}>
      {/* Banner Section */}
      <Card sx={{ mb: 3, background: "linear-gradient(135deg, #16697A 0%, #1A7A8A 100%)", color: "white" }}>
        <CardContent sx={{ py: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Avatar src={mockUser.avatar} sx={{ width: 100, height: 100, border: "3px solid white" }} />
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {mockUser.fullName}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="h6">Trạng thái:</Typography>
                <Chip
                  label={mockUser.membershipStatus === "active" ? "Active" : "Inactive"}
                  color={mockUser.membershipStatus === "active" ? "success" : "error"}
                  icon={mockUser.membershipStatus === "active" && <CheckCircleIcon />}
                  sx={{ color: "white", fontWeight: "bold" }}
                />
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Main Info Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Profile Info */}
        <Grid item size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" fontWeight="bold" color="primary">
                  Thông tin cá nhân
                </Typography>
                <IconButton color="primary" size="small">
                  <EditIcon />
                </IconButton>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CakeIcon color="action" fontSize="small" />
                  <Typography variant="body2">Tuổi: {mockUser.age}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <PersonIcon color="action" fontSize="small" />
                  <Typography variant="body2">Giới tính: {mockUser.gender}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <PhoneIcon color="action" fontSize="small" />
                  <Typography variant="body2">SĐT: {mockUser.phone}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LocationIcon color="action" fontSize="small" />
                  <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                    Địa chỉ: {mockUser.address}
                  </Typography>
                </Box>
              </Box>

              <Button variant="outlined" fullWidth sx={{ mt: 3 }} startIcon={<EditIcon />}>
                Chỉnh sửa
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Membership Current */}
        <Grid item size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: "100%", border: "2px solid", borderColor: "primary.main" }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
                Gói tập hiện tại
              </Typography>

              <Box sx={{ textAlign: "center", mb: 2 }}>
                <Typography variant="h5" fontWeight="bold" color="primary">
                  {mockMembership.packageName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {mockMembership.startDate} - {mockMembership.endDate}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2">Buổi tập đã dùng</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {mockMembership.sessionsUsed}/{mockMembership.totalSessions}
                  </Typography>
                </Box>
                <LinearProgress variant="determinate" value={progressPercentage} sx={{ height: 8, borderRadius: 4 }} />
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Còn lại: {mockMembership.daysLeft} ngày
                </Typography>
                <Chip label="Còn hạn" color="success" size="small" />
              </Box>

              <Button variant="contained" fullWidth sx={{ mt: 1 }}>
                Gia hạn gói
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Progress Chart */}
        <Grid item size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
                Tiến độ tập luyện
              </Typography>

              <Box sx={{ height: 200, mb: 2 }}>
                <LineChart
                  xAxis={[{ dataKey: "month", scaleType: "point" }]}
                  series={[
                    { dataKey: "weight", label: "Cân nặng (kg)", color: "#16697A" },
                    { dataKey: "bmi", label: "BMI", color: "#FFA500" },
                    { dataKey: "bodyFat", label: "% Mỡ cơ", color: "#FF4C4C" },
                  ]}
                  dataset={mockProgressData}
                  height={200}
                  grid={{ vertical: true, horizontal: true }}
                  slotProps={{
                    legend: {
                      direction: "row",
                      position: { vertical: "bottom", horizontal: "middle" },
                    },
                  }}
                  margin={{ top: 0, right: 10, bottom: 0, left: -10 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Booking Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6" fontWeight="bold" color="primary">
              Lịch đặt PT & Lớp học
            </Typography>
            <Button variant="outlined" startIcon={<CalendarIcon />}>
              Đặt thêm
            </Button>
          </Box>
          <GymCalendar />
          {/* <Grid container spacing={2}>
            {mockBookings.map((booking) => (
              <Grid item xs={12} md={4} key={booking.id}>
                <Card variant="outlined">
                  <CardContent sx={{ py: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                      <FitnessCenterIcon color="primary" fontSize="small" />
                      <Typography variant="subtitle2" fontWeight="bold">
                        {booking.type === "PT" ? booking.trainer : booking.name}
                      </Typography>
                      <Chip
                        label={booking.status === "upcoming" ? "Sắp tới" : "Đã xong"}
                        color={booking.status === "upcoming" ? "warning" : "success"}
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {booking.date} - {booking.time}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid> */}
        </CardContent>
      </Card>

      {/* Bottom Section */}
      <Grid container spacing={3}>
        {/* Payments History */}
        <Grid item size={{ xs: 12, md: 7 }}>
          <Card sx={{ height: 500, display: "flex", flexDirection: "column" }}>
            {/* bỏ padding mặc định, tự quản lý */}
            <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", p: 2, minHeight: 0 }}>
              <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
                Lịch sử thanh toán
              </Typography>

              <TableContainer sx={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Mã GD</TableCell>
                      <TableCell>Gói tập</TableCell>
                      <TableCell align="right">Số tiền</TableCell>
                      <TableCell>Ngày</TableCell>
                      <TableCell>Trạng thái</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{payment.id}</TableCell>
                        <TableCell>{payment.package}</TableCell>
                        <TableCell align="right">{payment.amount}đ</TableCell>
                        <TableCell>{payment.date}</TableCell>
                        <TableCell>
                          <Chip label={payment.status} color="success" size="small" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Check-in History */}
        <Grid item size={{ xs: 12, md: 5 }}>
          <Card sx={{ height: 500, display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
                Lịch sử check-in
              </Typography>

              {/* Danh sách cuộn */}
              <Box sx={{ flex: 1, overflowY: "auto" }}>
                <List dense>
                  {mockCheckins.map((checkin, index) => (
                    <React.Fragment key={index}>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon>
                          <CheckCircleIcon color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={`${checkin.date} - ${checkin.time}`} secondary={checkin.location} />
                      </ListItem>
                      {index < mockCheckins.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}

export default UserHomePage
