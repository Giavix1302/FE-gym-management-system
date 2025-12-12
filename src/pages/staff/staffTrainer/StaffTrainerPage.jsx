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
import { getListTrainerForAdminAPI, updateIsApprovedAPI } from "~/apis/trainer"
import useListTrainerInfoForAdmin from "~/stores/useListTrainerInfoForAdmin"

function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box>{children}</Box>}
    </div>
  )
}

// PT Detail Modal Component
function PTDetailModal({ open, onClose, trainer, onTrainerUpdate }) {
  const [tabValue, setTabValue] = useState(0)
  const [isUpdating, setIsUpdating] = useState(false)

  if (!trainer) return null

  const trainerBookings = trainer.booked || []
  const trainerReviews = trainer.review || []
  const trainerSchedules = trainer.schedule || []

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleApprovalUpdate = async (approvalStatus) => {
    try {
      setIsUpdating(true)
      const response = await updateIsApprovedAPI(trainer.trainerId, { isApproved: approvalStatus })

      if (response.success) {
        // Update the trainer status in the parent component
        if (onTrainerUpdate) {
          onTrainerUpdate(trainer.trainerId, approvalStatus)
        }

        // Close the modal after successful update
        onClose()

        // You might want to show a success message here
        console.log(`Trainer ${approvalStatus === "approved" ? "approved" : "rejected"} successfully`)
      } else {
        console.error("Failed to update trainer approval status:", response.message)
      }
    } catch (error) {
      console.error("Error updating trainer approval:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleApprove = () => {
    handleApprovalUpdate("approved")
  }

  const handleReject = () => {
    handleApprovalUpdate("rejected")
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
      case "booking":
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
      case "booking":
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
            <Avatar src={trainer.userInfo.avatar || "/api/placeholder/50/50"} sx={{ width: 50, height: 50 }} />
            <Box>
              <Typography variant="h5" fontWeight="bold" color="primary.main">
                {trainer.userInfo.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {trainer.trainerInfo.specialization}
              </Typography>
            </Box>
          </Box>
          <Chip
            label={getApprovalText(trainer.trainerInfo.isApproved)}
            color={getApprovalColor(trainer.trainerInfo.isApproved)}
            size="medium"
          />
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0 }}>
        {trainer.trainerInfo.isApproved === "pending" ? (
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
                {trainer.trainerInfo.bio}
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
                    {formatCurrencyVND(Number(trainer.trainerInfo.pricePerHour))}
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
                    {trainer.trainerInfo.experience}
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
                {trainer.trainerInfo.education}
              </Typography>
            </Box>

            {/* Images */}
            {trainer.trainerInfo.physiqueImages?.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    Hình ảnh:
                  </Typography>
                  <Grid container spacing={2}>
                    {trainer.trainerInfo.physiqueImages.map((img, index) => (
                      <Grid item size={{ xs: 6, md: 4 }} key={index}>
                        <img
                          src={img}
                          alt={`${trainer.userInfo.name} ${index + 1}`}
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
                  <Grid item size={{ xs: 6, md: 3 }}>
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
                  <Grid item size={{ xs: 6, md: 3 }}>
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
                  <Grid item size={{ xs: 6, md: 3 }}>
                    <Card variant="outlined" sx={{ textAlign: "center", p: 2 }}>
                      <MoneyIcon color="success" />
                      <Typography variant="h6" fontWeight="bold" color="success.main">
                        {formatCurrencyVND(Number(trainer.trainerInfo.pricePerHour))}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Giá/buổi
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item size={{ xs: 6, md: 3 }}>
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
                    {trainer.trainerInfo.bio}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Education */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    Học vấn & Chứng chỉ:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {trainer.trainerInfo.education}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Experience */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    Kinh nghiệm:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {trainer.trainerInfo.experience}
                  </Typography>
                </Box>

                {/* Images */}
                {trainer.trainerInfo.physiqueImages?.length > 0 && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                        Hình ảnh:
                      </Typography>
                      <Grid container spacing={2}>
                        {trainer.trainerInfo.physiqueImages.map((img, index) => (
                          <Grid item size={{ xs: 6, md: 4 }} key={index}>
                            <img
                              src={img}
                              alt={`${trainer.userInfo.name} ${index + 1}`}
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
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: "bold" }}>Ngày</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Thời gian</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Thời lượng</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Trạng thái</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Khách hàng</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Địa điểm</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {trainerSchedules.map((schedule, index) => {
                          const startTime = new Date(schedule.startTime)
                          const endTime = new Date(schedule.endTime)
                          const duration = Math.round((endTime - startTime) / (1000 * 60)) // minutes
                          const isBooked = schedule.title !== "Unbooked Schedule"

                          return (
                            <TableRow key={index}>
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
                                  label={isBooked ? "Đã đặt" : "Trống"}
                                  color={isBooked ? "info" : "success"}
                                  size="small"
                                />
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">{schedule.userName || "Chưa có"}</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">{schedule.locationName || "Chưa có"}</Typography>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
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
                          <TableCell sx={{ fontWeight: "bold" }}>Thời gian</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Địa điểm</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Giá</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Trạng thái</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {trainerBookings.map((booking) => (
                          <TableRow key={booking._id}>
                            <TableCell>{booking.fullName}</TableCell>
                            <TableCell>
                              {new Date(booking.startTime).toLocaleDateString("vi-VN", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })}
                            </TableCell>
                            <TableCell>
                              {new Date(booking.startTime).toLocaleTimeString("vi-VN", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}{" "}
                              -{" "}
                              {new Date(booking.endTime).toLocaleTimeString("vi-VN", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </TableCell>
                            <TableCell>{booking.locationName}</TableCell>
                            <TableCell>
                              <Typography color="success.main" fontWeight="medium">
                                {formatCurrencyVND(booking.price)}
                              </Typography>
                            </TableCell>
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
                            {review.fullName}
                          </Typography>
                          <Box sx={{ textAlign: "right" }}>
                            <Rating value={review.rating} precision={0.5} size="small" readOnly />
                            <Typography variant="caption" color="text.secondary" display="block">
                              {review.createAt
                                ? new Date(review.createAt).toLocaleDateString("vi-VN", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : "N/A"}
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
        {trainer.trainerInfo.isApproved === "pending" && (
          <>
            <Button
              variant="contained"
              color="success"
              startIcon={<ApprovedIcon />}
              sx={{ minWidth: 100 }}
              onClick={handleApprove}
              disabled={isUpdating}
            >
              {isUpdating ? "Đang xử lý..." : "Duyệt"}
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<RejectedIcon />}
              sx={{ minWidth: 100 }}
              onClick={handleReject}
              disabled={isUpdating}
            >
              {isUpdating ? "Đang xử lý..." : "Từ chối"}
            </Button>
          </>
        )}
        {trainer.trainerInfo.isApproved === "approved" && (
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

export default function StaffTrainerPage() {
  const { listTrainerInfo } = useListTrainerInfoForAdmin()

  const [loading, setLoading] = useState(true)
  const [selectedTrainer, setSelectedTrainer] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  // Filters
  const [searchTerm, setSearchTerm] = useState("")
  const [approvalFilter, setApprovalFilter] = useState("all")
  const [specializationFilter, setSpecializationFilter] = useState("all")

  // Filter trainers
  const filteredTrainers = listTrainerInfo.filter((trainer) => {
    const matchesSearch =
      trainer.userInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainer.trainerInfo.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesApproval = approvalFilter === "all" || trainer.trainerInfo.isApproved === approvalFilter
    const matchesSpecialization =
      specializationFilter === "all" ||
      trainer.trainerInfo.specialization.toLowerCase().includes(specializationFilter.toLowerCase())

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

  const handleTrainerUpdate = (trainerId, newApprovalStatus) => {
    const { updateTrainerInfo } = useListTrainerInfoForAdmin.getState()

    updateTrainerInfo(trainerId, {
      trainerInfo: {
        isApproved: newApprovalStatus,
        approvedAt: newApprovalStatus === "approved" ? new Date().toISOString() : "",
      },
    })
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

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true)
        const response = await getListTrainerForAdminAPI()
        console.log("🚀 ~ init ~ response:", response)

        if (response.success && response.listTrainerInfo) {
          setTrainers(response.listTrainerInfo)
        }
      } catch (error) {
        console.error("Error fetching trainers:", error)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

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
            <Box sx={{ display: "flex", gap: 1 }}></Box>
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
                <MenuItem value="gym">Gym</MenuItem>
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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ textAlign: "center", py: 4 }}>
                      <Typography color="text.secondary">Đang tải dữ liệu...</Typography>
                    </TableCell>
                  </TableRow>
                ) : filteredTrainers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ textAlign: "center", py: 4 }}>
                      <Typography color="text.secondary">Không tìm thấy PT nào</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTrainers.map((trainer) => (
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
                          <Avatar
                            src={trainer.userInfo.avatar || "/api/placeholder/40/40"}
                            sx={{ width: 40, height: 40 }}
                          />
                          <Box>
                            <Typography fontWeight="medium">{trainer.userInfo.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {trainer.trainerInfo.experience} kinh nghiệm
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2">{trainer.trainerInfo.specialization}</Typography>
                      </TableCell>

                      <TableCell>
                        <Typography fontWeight="bold" color="success.main">
                          {formatCurrencyVND(Number(trainer.trainerInfo.pricePerHour))}
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
                          label={getApprovalText(trainer.trainerInfo.isApproved)}
                          color={getApprovalColor(trainer.trainerInfo.isApproved)}
                          size="small"
                          icon={getApprovalIcon(trainer.trainerInfo.isApproved)}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* PT Detail Modal */}
      <PTDetailModal
        open={modalOpen}
        onClose={handleCloseModal}
        trainer={selectedTrainer}
        onTrainerUpdate={handleTrainerUpdate}
      />
    </Box>
  )
}
