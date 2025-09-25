import React, { useEffect, useState } from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Avatar,
  Stack,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
} from "@mui/material"
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FileDownload as ExportIcon,
  FileUpload as ImportIcon,
  FitnessCenter as GymIcon,
  AccessTime as TimeIcon,
  AttachMoney as MoneyIcon,
  People as PeopleIcon,
  Image as ImageIcon,
  LocalOffer as OfferIcon,
  CheckCircle,
  Schedule as ScheduleIcon,
  BookOnline as BookingIcon,
  RateReview as ReviewIcon,
  Person as PersonIcon,
  Pending as PendingIcon,
  Check as ApprovedIcon,
  Close as RejectedIcon,
  Star as StarIcon,
  TrendingUp as RevenueIcon,
} from "@mui/icons-material"
import GymCalendar from "~/utils/Calendar"

// Mock data
const mockTrainers = [
  {
    _id: "trainer1",
    userId: "user1",
    name: "Nguyễn Văn Minh",
    specialization: "Fitness & Bodybuilding",
    bio: "10 năm kinh nghiệm trong lĩnh vực tập luyện thể hình và fitness. Chuyên về xây dựng cơ bắp và giảm cân.",
    physiqueImages: ["/api/placeholder/300/400", "/api/placeholder/300/400"],
    isApproved: "approved",
    approvedAt: "2024-01-15T10:30:00Z",
    experience: "10 năm",
    education: "Cử nhân Giáo dục Thể chất, Chứng chỉ PT quốc tế",
    pricePerSession: 300000,
    totalBookings: 156,
    rating: 4.8,
    totalReviews: 89,
    revenue: 46800000,
  },
  {
    _id: "trainer2",
    userId: "user2",
    name: "Trần Thị Hạnh",
    specialization: "Yoga & Pilates",
    bio: "Chuyên gia yoga với 8 năm kinh nghiệm, tập trung vào yoga trị liệu và pilates.",
    physiqueImages: ["/api/placeholder/300/400"],
    isApproved: "pending",
    approvedAt: null,
    experience: "8 năm",
    education: "Chứng chỉ Yoga Alliance RYT-500",
    pricePerSession: 250000,
    totalBookings: 92,
    rating: 4.9,
    totalReviews: 67,
    revenue: 23000000,
  },
  {
    _id: "trainer3",
    userId: "user3",
    name: "Lê Hoàng Nam",
    specialization: "Boxing & Martial Arts",
    bio: "HLV boxing chuyên nghiệp, từng thi đấu cấp quốc gia.",
    physiqueImages: ["/api/placeholder/300/400", "/api/placeholder/300/400"],
    isApproved: "rejected",
    approvedAt: null,
    experience: "12 năm",
    education: "Cử nhân Thể thao, Chứng chỉ HLV Boxing",
    pricePerSession: 350000,
    totalBookings: 203,
    rating: 4.7,
    totalReviews: 134,
    revenue: 71050000,
  },
]

const mockBookings = [
  {
    _id: "booking1",
    userId: "user123",
    userName: "Nguyễn Văn A",
    scheduleId: "schedule1",
    trainerId: "trainer1",
    trainerName: "Nguyễn Văn Minh",
    locationId: "location1",
    status: "booked",
    note: "Muốn tập trung vào giảm cân",
    price: 300000,
    sessionDate: "2024-09-25T09:00:00Z",
    createdAt: "2024-09-20T14:30:00Z",
  },
  {
    _id: "booking2",
    userId: "user124",
    userName: "Trần Thị B",
    scheduleId: "schedule2",
    trainerId: "trainer1",
    trainerName: "Nguyễn Văn Minh",
    locationId: "location1",
    status: "completed",
    note: "Yoga trị liệu cho đau lưng",
    price: 300000,
    sessionDate: "2024-09-20T16:00:00Z",
    createdAt: "2024-09-18T10:15:00Z",
  },
  {
    _id: "booking3",
    userId: "user125",
    userName: "Phạm Văn C",
    scheduleId: "schedule3",
    trainerId: "trainer3",
    trainerName: "Lê Hoàng Nam",
    locationId: "location2",
    status: "pending",
    note: "Muốn học boxing cơ bản",
    price: 350000,
    sessionDate: "2024-09-26T14:00:00Z",
    createdAt: "2024-09-21T09:20:00Z",
  },
]

const mockReviews = [
  {
    _id: "review1",
    bookingId: "booking2",
    userId: "user124",
    userName: "Trần Thị B",
    trainerId: "trainer1",
    trainerName: "Nguyễn Văn Minh",
    rating: 5,
    comment: "Anh Minh rất chuyên nghiệp và tận tình. Các bài tập rất hiệu quả cho việc giảm cân.",
    createdAt: "2024-09-21T18:00:00Z",
  },
  {
    _id: "review2",
    bookingId: "booking1",
    userId: "user123",
    userName: "Nguyễn Văn A",
    trainerId: "trainer1",
    trainerName: "Nguyễn Văn Minh",
    rating: 4,
    comment: "Anh Minh hướng dẫn rất chi tiết, tuy nhiên có thể strict hơn một chút.",
    createdAt: "2024-09-22T20:30:00Z",
  },
  {
    _id: "review3",
    bookingId: "booking3",
    userId: "user125",
    userName: "Phạm Văn C",
    trainerId: "trainer3",
    trainerName: "Lê Hoàng Nam",
    rating: 5,
    comment: "Kỹ thuật boxing được hướng dẫn rất kỹ càng và dễ hiểu.",
    createdAt: "2024-09-23T16:45:00Z",
  },
]

const mockSchedules = [
  {
    _id: "schedule1",
    trainerId: "trainer1",
    startTime: "2024-09-25T09:00:00Z",
    endTime: "2024-09-25T10:00:00Z",
    isBooked: true,
    createdAt: "2024-09-20T08:00:00Z",
  },
  {
    _id: "schedule2",
    trainerId: "trainer1",
    startTime: "2024-09-25T10:30:00Z",
    endTime: "2024-09-25T11:30:00Z",
    isBooked: false,
    createdAt: "2024-09-20T08:00:00Z",
  },
  {
    _id: "schedule3",
    trainerId: "trainer1",
    startTime: "2024-09-26T09:00:00Z",
    endTime: "2024-09-26T10:00:00Z",
    isBooked: false,
    createdAt: "2024-09-21T08:00:00Z",
  },
  {
    _id: "schedule4",
    trainerId: "trainer1",
    startTime: "2024-09-26T14:00:00Z",
    endTime: "2024-09-26T15:00:00Z",
    isBooked: true,
    createdAt: "2024-09-21T08:00:00Z",
  },
  {
    _id: "schedule5",
    trainerId: "trainer2",
    startTime: "2024-09-25T16:00:00Z",
    endTime: "2024-09-25T17:00:00Z",
    isBooked: false,
    createdAt: "2024-09-22T10:00:00Z",
  },
  {
    _id: "schedule6",
    trainerId: "trainer3",
    startTime: "2024-09-27T10:00:00Z",
    endTime: "2024-09-27T11:30:00Z",
    isBooked: true,
    createdAt: "2024-09-23T09:00:00Z",
  },
]

function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box>{children}</Box>}
    </div>
  )
}

// PT Detail Modal Component
function PTDetailModal({ open, onClose, trainer }) {
  const [tabValue, setTabValue] = useState(0)

  if (!trainer) return null

  const trainerBookings = mockBookings.filter((booking) => booking.trainerId === trainer._id)
  const trainerReviews = mockReviews.filter((review) => review.trainerId === trainer._id)
  const trainerSchedules = mockSchedules.filter((schedule) => schedule.trainerId === trainer._id)

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const formatCurrencyVND = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A"
    return new Date(timestamp).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getApprovalColor = (status) => {
    switch (status) {
      case "approved":
        return "success"
      case "pending":
        return "warning"
      case "rejected":
        return "error"
      default:
        return "default"
    }
  }

  const getApprovalText = (status) => {
    switch (status) {
      case "approved":
        return "Đã duyệt"
      case "pending":
        return "Chờ duyệt"
      case "rejected":
        return "Từ chối"
      default:
        return status
    }
  }

  const getBookingStatusColor = (status) => {
    switch (status) {
      case "booked":
        return "info"
      case "completed":
        return "success"
      case "pending":
        return "warning"
      case "cancelled":
        return "error"
      default:
        return "default"
    }
  }

  const getBookingStatusText = (status) => {
    switch (status) {
      case "booked":
        return "Đã đặt"
      case "completed":
        return "Hoàn thành"
      case "pending":
        return "Chờ xác nhận"
      case "cancelled":
        return "Đã hủy"
      default:
        return status
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, maxHeight: "90vh" },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar src={trainer.physiqueImages[0]} sx={{ width: 50, height: 50 }} />
            <Box>
              <Typography variant="h5" fontWeight="bold" color="primary.main">
                {trainer.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {trainer.specialization}
              </Typography>
            </Box>
          </Box>
          <Chip
            label={getApprovalText(trainer.isApproved)}
            color={getApprovalColor(trainer.isApproved)}
            size="medium"
          />
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0 }}>
        {trainer.isApproved === "pending" ? (
          // Only show details for pending trainers
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom color="warning.main">
              Đang chờ phê duyệt
            </Typography>

            {/* Bio */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Giới thiệu:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {trainer.bio}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Basic Info */}
            <Stack spacing={2} sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <MoneyIcon color="success" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Giá mỗi buổi
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color="success.main">
                    {formatCurrencyVND(trainer.pricePerSession)}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <TimeIcon color="primary" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Kinh nghiệm
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {trainer.experience}
                  </Typography>
                </Box>
              </Box>
            </Stack>

            <Divider sx={{ my: 2 }} />

            {/* Education */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Học vấn & Chứng chỉ:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {trainer.education}
              </Typography>
            </Box>

            {/* Images */}
            {trainer.physiqueImages.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    Hình ảnh:
                  </Typography>
                  <Grid container spacing={2}>
                    {trainer.physiqueImages.map((img, index) => (
                      <Grid item xs={6} md={4} key={index}>
                        <img
                          src={img}
                          alt={`${trainer.name} ${index + 1}`}
                          style={{
                            width: "100%",
                            height: "200px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            border: "1px solid #e0e0e0",
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </>
            )}
          </Box>
        ) : (
          // Show full details with tabs for approved trainers
          <Box>
            <Tabs value={tabValue} onChange={handleTabChange} sx={{ px: 2, pt: 1 }}>
              <Tab label="Thông tin chi tiết" />
              <Tab label={`Schedules (${trainerSchedules.length})`} />
              <Tab label={`Bookings (${trainerBookings.length})`} />
              <Tab label={`Reviews (${trainerReviews.length})`} />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              <Box sx={{ p: 3 }}>
                {/* Header Stats */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6} md={3}>
                    <Card variant="outlined" sx={{ textAlign: "center", p: 2 }}>
                      <Rating value={trainer.rating} precision={0.1} size="small" readOnly />
                      <Typography variant="h6" fontWeight="bold">
                        {trainer.rating}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {trainer.totalReviews} đánh giá
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Card variant="outlined" sx={{ textAlign: "center", p: 2 }}>
                      <BookingIcon color="primary" />
                      <Typography variant="h6" fontWeight="bold">
                        {trainer.totalBookings}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Buổi tập
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Card variant="outlined" sx={{ textAlign: "center", p: 2 }}>
                      <MoneyIcon color="success" />
                      <Typography variant="h6" fontWeight="bold" color="success.main">
                        {formatCurrencyVND(trainer.pricePerSession)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Giá/buổi
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Card variant="outlined" sx={{ textAlign: "center", p: 2 }}>
                      <RevenueIcon color="info" />
                      <Typography variant="h6" fontWeight="bold" color="info.main">
                        {formatCurrencyVND(trainer.revenue)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Doanh thu
                      </Typography>
                    </Card>
                  </Grid>
                </Grid>

                {/* Bio */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    Giới thiệu:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {trainer.bio}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Education */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    Học vấn & Chứng chỉ:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {trainer.education}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Experience */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    Kinh nghiệm:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {trainer.experience}
                  </Typography>
                </Box>

                {/* Images */}
                {trainer.physiqueImages.length > 0 && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                        Hình ảnh:
                      </Typography>
                      <Grid container spacing={2}>
                        {trainer.physiqueImages.map((img, index) => (
                          <Grid item xs={6} md={4} key={index}>
                            <img
                              src={img}
                              alt={`${trainer.name} ${index + 1}`}
                              style={{
                                width: "100%",
                                height: "200px",
                                objectFit: "cover",
                                borderRadius: "8px",
                                border: "1px solid #e0e0e0",
                              }}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  </>
                )}
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Lịch làm việc
                </Typography>
                {trainerSchedules.length === 0 ? (
                  <Typography color="text.secondary">Chưa có lịch làm việc nào</Typography>
                ) : (
                  <TableContainer>
                    {/* <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: "bold" }}>Ngày</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Thời gian</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Thời lượng</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Trạng thái</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Tạo lúc</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {trainerSchedules.map((schedule) => {
                          const startTime = new Date(schedule.startTime)
                          const endTime = new Date(schedule.endTime)
                          const duration = Math.round((endTime - startTime) / (1000 * 60)) // minutes

                          return (
                            <TableRow key={schedule._id}>
                              <TableCell>
                                <Typography fontWeight="medium">
                                  {startTime.toLocaleDateString("vi-VN", {
                                    weekday: "short",
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                  })}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>
                                  {startTime.toLocaleTimeString("vi-VN", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}{" "}
                                  -{" "}
                                  {endTime.toLocaleTimeString("vi-VN", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>{duration} phút</Typography>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={schedule.isBooked ? "Đã đặt" : "Trống"}
                                  color={schedule.isBooked ? "info" : "success"}
                                  size="small"
                                />
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" color="text.secondary">
                                  {formatDate(schedule.createdAt)}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table> */}
                    <GymCalendar />
                  </TableContainer>
                )}
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Lịch sử Bookings
                </Typography>
                {trainerBookings.length === 0 ? (
                  <Typography color="text.secondary">Chưa có booking nào</Typography>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: "bold" }}>Khách hàng</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Ngày tập</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Giá</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Ghi chú</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Trạng thái</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {trainerBookings.map((booking) => (
                          <TableRow key={booking._id}>
                            <TableCell>{booking.userName}</TableCell>
                            <TableCell>{formatDate(booking.sessionDate)}</TableCell>
                            <TableCell>
                              <Typography color="success.main" fontWeight="medium">
                                {formatCurrencyVND(booking.price)}
                              </Typography>
                            </TableCell>
                            <TableCell>{booking.note || "Không có"}</TableCell>
                            <TableCell>
                              <Chip
                                label={getBookingStatusText(booking.status)}
                                color={getBookingStatusColor(booking.status)}
                                size="small"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={3}>
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Đánh giá từ khách hàng
                </Typography>
                {trainerReviews.length === 0 ? (
                  <Typography color="text.secondary">Chưa có đánh giá nào</Typography>
                ) : (
                  <Stack spacing={2}>
                    {trainerReviews.map((review) => (
                      <Paper key={review._id} sx={{ p: 2 }} variant="outlined">
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                          <Typography variant="subtitle1" fontWeight="medium">
                            {review.userName}
                          </Typography>
                          <Box sx={{ textAlign: "right" }}>
                            <Rating value={review.rating} precision={0.5} size="small" readOnly />
                            <Typography variant="caption" color="text.secondary" display="block">
                              {formatDate(review.createdAt)}
                            </Typography>
                          </Box>
                        </Box>
                        <Typography variant="body2">{review.comment}</Typography>
                      </Paper>
                    ))}
                  </Stack>
                )}
              </Box>
            </TabPanel>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        {trainer.isApproved === "pending" && (
          <>
            <Button variant="contained" color="success" startIcon={<ApprovedIcon />} sx={{ minWidth: 100 }}>
              Duyệt
            </Button>
            <Button variant="outlined" color="error" startIcon={<RejectedIcon />} sx={{ minWidth: 100 }}>
              Từ chối
            </Button>
          </>
        )}
        {trainer.isApproved === "approved" && (
          <Button variant="contained" startIcon={<EditIcon />} sx={{ minWidth: 100 }}>
            Chỉnh sửa
          </Button>
        )}
        <Button onClick={onClose} variant="outlined" color="inherit" sx={{ minWidth: 100 }}>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default function PTManagementPage() {
  const [trainers, setTrainers] = useState(mockTrainers)
  const [selectedTrainer, setSelectedTrainer] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  // Filters
  const [searchTerm, setSearchTerm] = useState("")
  const [approvalFilter, setApprovalFilter] = useState("all")
  const [specializationFilter, setSpecializationFilter] = useState("all")

  // Filter trainers
  const filteredTrainers = trainers.filter((trainer) => {
    const matchesSearch =
      trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainer.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesApproval = approvalFilter === "all" || trainer.isApproved === approvalFilter
    const matchesSpecialization =
      specializationFilter === "all" ||
      trainer.specialization.toLowerCase().includes(specializationFilter.toLowerCase())

    return matchesSearch && matchesApproval && matchesSpecialization
  })

  const handleRowClick = (trainer) => {
    setSelectedTrainer(trainer)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setSelectedTrainer(null)
  }

  const formatCurrencyVND = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const getApprovalColor = (status) => {
    switch (status) {
      case "approved":
        return "success"
      case "pending":
        return "warning"
      case "rejected":
        return "error"
      default:
        return "default"
    }
  }

  const getApprovalText = (status) => {
    switch (status) {
      case "approved":
        return "Đã duyệt"
      case "pending":
        return "Chờ duyệt"
      case "rejected":
        return "Từ chối"
      default:
        return status
    }
  }

  const getApprovalIcon = (status) => {
    switch (status) {
      case "approved":
        return <ApprovedIcon />
      case "pending":
        return <PendingIcon />
      case "rejected":
        return <RejectedIcon />
      default:
        return <PersonIcon />
    }
  }

  return (
    <Box sx={{ p: 1, height: "100vh" }}>
      {/* Header */}
      <Card sx={{ mb: 1 }}>
        <CardContent sx={{ "&:last-child": { pb: 2 } }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <PersonIcon sx={{ fontSize: 32, color: "primary.main" }} />
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                Quản lý Personal Trainer
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button variant="outlined" startIcon={<ImportIcon />} sx={{ textTransform: "none" }}>
                Import
              </Button>
              <Button variant="outlined" startIcon={<ExportIcon />} sx={{ textTransform: "none" }}>
                Export
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card sx={{ mb: 1 }}>
        <CardContent sx={{ "&:last-child": { pb: 2 } }}>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
            <TextField
              placeholder="Tìm kiếm PT..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ width: 200 }}
            />

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Trạng thái</InputLabel>
              <Select value={approvalFilter} onChange={(e) => setApprovalFilter(e.target.value)} label="Trạng thái">
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="approved">Đã duyệt</MenuItem>
                <MenuItem value="pending">Chờ duyệt</MenuItem>
                <MenuItem value="rejected">Từ chối</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Chuyên môn</InputLabel>
              <Select
                value={specializationFilter}
                onChange={(e) => setSpecializationFilter(e.target.value)}
                label="Chuyên môn"
              >
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="fitness">Fitness</MenuItem>
                <MenuItem value="yoga">Yoga</MenuItem>
                <MenuItem value="boxing">Boxing</MenuItem>
                <MenuItem value="pilates">Pilates</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ ml: "auto" }}>
              <Button variant="contained" startIcon={<AddIcon />} sx={{ textTransform: "none", fontWeight: "bold" }}>
                Thêm PT
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Trainers Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <Typography variant="h6" sx={{ p: 2, pb: 1, fontWeight: "bold", color: "primary.main" }}>
            Danh sách PT ({filteredTrainers.length} người)
          </Typography>

          <TableContainer sx={{ maxHeight: "70vh", overflowY: "auto" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", py: 1 }}>PT</TableCell>
                  <TableCell sx={{ fontWeight: "bold", py: 1 }}>Chuyên môn</TableCell>
                  <TableCell sx={{ fontWeight: "bold", py: 1 }}>Giá/buổi</TableCell>
                  <TableCell sx={{ fontWeight: "bold", py: 1 }}>Đánh giá</TableCell>
                  <TableCell sx={{ fontWeight: "bold", py: 1 }}>Bookings</TableCell>
                  <TableCell sx={{ fontWeight: "bold", py: 1 }}>Doanh thu</TableCell>
                  <TableCell sx={{ fontWeight: "bold", py: 1 }}>Trạng thái</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredTrainers.map((trainer) => (
                  <TableRow
                    key={trainer._id}
                    hover
                    onClick={() => handleRowClick(trainer)}
                    sx={{
                      cursor: "pointer",
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar src={trainer.physiqueImages[0]} sx={{ width: 40, height: 40 }} />
                        <Box>
                          <Typography fontWeight="medium">{trainer.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {trainer.experience} kinh nghiệm
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2">{trainer.specialization}</Typography>
                    </TableCell>

                    <TableCell>
                      <Typography fontWeight="bold" color="success.main">
                        {formatCurrencyVND(trainer.pricePerSession)}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Rating value={trainer.rating} precision={0.1} size="small" readOnly />
                        <Typography variant="body2">
                          {trainer.rating} ({trainer.totalReviews})
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Typography fontWeight="medium">{trainer.totalBookings}</Typography>
                    </TableCell>

                    <TableCell>
                      <Typography fontWeight="bold" color="info.main">
                        {formatCurrencyVND(trainer.revenue)}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={getApprovalText(trainer.isApproved)}
                        color={getApprovalColor(trainer.isApproved)}
                        size="small"
                        icon={getApprovalIcon(trainer.isApproved)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* PT Detail Modal */}
      <PTDetailModal open={modalOpen} onClose={handleCloseModal} trainer={selectedTrainer} />
    </Box>
  )
}
