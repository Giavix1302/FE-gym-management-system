import React, { useState, useEffect } from "react"
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
  Chip,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Stack,
  IconButton,
  TablePagination,
  CircularProgress,
  Alert,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormLabel,
} from "@mui/material"
import {
  People as PeopleIcon,
  Person as PersonIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Cake as CakeIcon,
  Assignment as MembershipIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  AccessTime as AccessTimeIcon,
  Payment as PaymentIcon,
  Add as AddIcon,
  FitnessCenter as FitnessCenterIcon,
  History as HistoryIcon,
  CalendarToday as CalendarIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material"

// Import APIs
import { getListUserForStaffAPI, getUserDetailAPI } from "~/apis/user"
import { createSubscriptionForStaffAPI } from "~/apis/subscription"
import useLocationStore from "~/stores/useLocationStore"
import useMembershipStore from "~/stores/useMembershipStore"

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

function StaffUserPage() {
  const { locations } = useLocationStore()
  const { listMembership } = useMembershipStore()

  // Main state
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [subscriptionFilter, setSubscriptionFilter] = useState("all")

  // Pagination state
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [totalUsers, setTotalUsers] = useState(0)

  // Modal states
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [selectedTab, setSelectedTab] = useState(0)

  // Registration modal states
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  const [selectedMembership, setSelectedMembership] = useState(null)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [registrationData, setRegistrationData] = useState({
    paymentMethod: "cash",
    description: "",
  })
  const [registrationLoading, setRegistrationLoading] = useState(false)

  // Fetch users data
  const fetchUsers = async (currentPage = 0) => {
    try {
      setLoading(true)
      setError("")

      const response = await getListUserForStaffAPI(currentPage + 1, rowsPerPage)

      if (response.success) {
        setUsers(response.data.users || [])
        setTotalUsers(response.data.pagination?.totalUsers || 0)
      } else {
        setError("Không thể tải danh sách người dùng")
      }
    } catch (err) {
      console.error("Error fetching users:", err)
      setError("Có lỗi xảy ra khi tải dữ liệu")
    } finally {
      setLoading(false)
    }
  }

  // Filter users based on search term and subscription status
  const filterUsers = () => {
    let filtered = users

    // Filter by search term (name)
    if (searchTerm.trim()) {
      filtered = filtered.filter((user) => user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    // Filter by subscription status
    if (subscriptionFilter !== "all") {
      filtered = filtered.filter((user) => {
        const hasActiveSubscription = hasActiveSubscription(user)
        return subscriptionFilter === "hasSubscription" ? hasActiveSubscription : !hasActiveSubscription
      })
    }

    setFilteredUsers(filtered)
  }

  useEffect(() => {
    fetchUsers(page)
  }, [page, rowsPerPage])

  useEffect(() => {
    filterUsers()
  }, [users, searchTerm, subscriptionFilter])

  // Event handlers
  const handleRowClick = (user) => {
    setSelectedUser(user)
    setIsUserModalOpen(true)
    setSelectedTab(0)
  }

  const handleCloseUserModal = () => {
    setIsUserModalOpen(false)
    setSelectedUser(null)
  }

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // Filter handlers
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleSubscriptionFilterChange = (event) => {
    setSubscriptionFilter(event.target.value)
  }

  const handleClearFilters = () => {
    setSearchTerm("")
    setSubscriptionFilter("all")
  }

  // Registration handlers
  const handleOpenRegisterModal = () => {
    setIsRegisterModalOpen(true)
  }

  const handleCloseRegisterModal = () => {
    setIsRegisterModalOpen(false)
    setSelectedMembership(null)
  }

  const handleSelectMembership = (membership) => {
    setSelectedMembership(membership)
    setIsRegisterModalOpen(false)
    setIsPaymentModalOpen(true)
  }

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false)
    setSelectedMembership(null)
    setRegistrationData({
      paymentMethod: "cash",
      description: "",
    })
  }

  const handleRegistration = async () => {
    try {
      setRegistrationLoading(true)

      const finalPrice = calculateFinalPrice(selectedMembership.price, selectedMembership.discount)

      const payload = {
        userId: selectedUser._id,
        membershipId: selectedMembership._id,
        paymentMethod: registrationData.paymentMethod,
        price: finalPrice,
        description: registrationData.description,
      }

      const response = await createSubscriptionForStaffAPI(payload)

      if (response.success) {
        // Success notification
        alert("Đăng ký gói tập thành công!")

        // Refresh user data and close modals
        await fetchUsers(page)
        handleClosePaymentModal()
        handleCloseUserModal()
      } else {
        alert(response.message || "Có lỗi xảy ra khi đăng ký gói tập")
      }
    } catch (err) {
      console.error("Registration error:", err)
      alert("Có lỗi xảy ra khi đăng ký gói tập")
    } finally {
      setRegistrationLoading(false)
    }
  }

  // Helper functions
  const formatCurrencyVND = (amount) => {
    if (!amount) return "0 ₫"
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    try {
      return new Date(dateString).toLocaleDateString("vi-VN")
    } catch {
      return "N/A"
    }
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A"
    try {
      return new Date(dateString).toLocaleString("vi-VN")
    } catch {
      return "N/A"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "success"
      case "inactive":
        return "error"
      default:
        return "default"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Hoạt động"
      case "inactive":
        return "Không hoạt động"
      default:
        return status || "N/A"
    }
  }

  const getGenderText = (gender) => {
    switch (gender) {
      case "male":
        return "Nam"
      case "female":
        return "Nữ"
      case "other":
        return "Khác"
      default:
        return "Chưa xác định"
    }
  }

  const calculateFinalPrice = (price, discount) => {
    if (!price) return 0
    return price - (price * (discount || 0)) / 100
  }

  const getLocationName = (locationId) => {
    console.log("🚀 ~ getLocationName ~ locationId:", locationId)
    console.log("🚀 ~ getLocationName ~ location:", locations)
    if (!locationId || !locations) return "Không xác định"
    const loc = locations.find((l) => l._id === locationId)
    console.log("🚀 ~ getLocationName ~ loc:", loc)
    return loc ? loc.name : "Không xác định"
  }

  const getCurrentSubscription = (user) => {
    if (!user || !user.subscriptions || !Array.isArray(user.subscriptions)) return null
    return user.subscriptions.find((sub) => sub.status === "active") || null
  }

  const getSubscriptionWithMembershipInfo = (subscription) => {
    if (!subscription || !listMembership) return subscription
    const membership = listMembership.find((m) => m._id === subscription.membershipId)
    return {
      ...subscription,
      membershipInfo: membership,
    }
  }

  const hasActiveSubscription = (user) => {
    if (!user || !user.subscriptions || !Array.isArray(user.subscriptions)) return false
    return user.subscriptions.some((sub) => sub.status === "active")
  }

  // Get filtered count for display
  const getFilteredCount = () => {
    if (searchTerm || subscriptionFilter !== "all") {
      return filteredUsers.length
    }
    return totalUsers
  }

  if (loading && users.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <CircularProgress />
      </Box>
    )
  }

  // Use filtered users for display
  const displayUsers = searchTerm || subscriptionFilter !== "all" ? filteredUsers : users

  return (
    <Box sx={{ p: 1, display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <Card sx={{ mb: 1 }}>
        <CardContent sx={{ "&:last-child": { pb: 0 } }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <PeopleIcon sx={{ fontSize: 32, color: "primary.main" }} />
            <Typography variant="h4" fontWeight="bold" color="primary">
              Quản lý người dùng - Staff
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Filters */}
      <Card sx={{ mb: 1 }}>
        <CardContent sx={{ "&:last-child": { pb: 2 } }}>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
            <TextField
              placeholder="Tìm kiếm theo tên..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{ width: 250 }}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: "action.active" }} />,
              }}
            />

            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Trạng thái gói tập</InputLabel>
              <Select value={subscriptionFilter} onChange={handleSubscriptionFilterChange} label="Trạng thái gói tập">
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="hasSubscription">Có gói tập</MenuItem>
                <MenuItem value="noSubscription">Chưa có gói tập</MenuItem>
              </Select>
            </FormControl>

            {(searchTerm || subscriptionFilter !== "all") && (
              <Button variant="outlined" onClick={handleClearFilters} size="small">
                Xóa bộ lọc
              </Button>
            )}

            <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Hiển thị {displayUsers.length} / {totalUsers} người dùng
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* User Table */}
      <Card sx={{ flex: 1 }}>
        <CardContent sx={{ p: 0, height: "100%", display: "flex", flexDirection: "column", "&:last-child": { pb: 0 } }}>
          <TableContainer component={Paper} sx={{ flex: 1 }}>
            <Table stickyHeader sx={{ flex: 1 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Avatar</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Họ và tên</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Số điện thoại</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Gói tập hiện tại</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Ngày tạo</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayUsers.map((user) => {
                  const currentSub = getCurrentSubscription(user)

                  return (
                    <TableRow key={user._id} hover sx={{ cursor: "pointer" }} onClick={() => handleRowClick(user)}>
                      <TableCell>
                        <Avatar src={user.avatar} sx={{ width: 40, height: 40 }}>
                          {user.fullName?.charAt(0) || "U"}
                        </Avatar>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight="medium">
                          {user.fullName || "N/A"}
                        </Typography>
                      </TableCell>
                      <TableCell>{user.email || "N/A"}</TableCell>
                      <TableCell>{user.phone || "N/A"}</TableCell>
                      <TableCell>
                        {currentSub ? (
                          <Chip label="Có gói tập" color="success" size="small" variant="outlined" />
                        ) : (
                          <Chip label="Chưa có gói" color="warning" size="small" variant="outlined" />
                        )}
                      </TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                    </TableRow>
                  )
                })}
                {displayUsers.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ textAlign: "center", py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        {searchTerm || subscriptionFilter !== "all"
                          ? "Không tìm thấy người dùng nào phù hợp với bộ lọc"
                          : "Không có dữ liệu người dùng"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Only show pagination when not filtering */}
          {!searchTerm && subscriptionFilter === "all" && (
            <TablePagination
              component="div"
              count={totalUsers}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[10, 20, 50]}
              labelRowsPerPage="Số hàng mỗi trang:"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} trong tổng số ${count !== -1 ? count : `hơn ${to}`}`
              }
            />
          )}
        </CardContent>
      </Card>

      {/* User Detail Modal */}
      <Dialog
        open={isUserModalOpen}
        onClose={handleCloseUserModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { height: "90vh" },
        }}
      >
        <DialogTitle sx={{ borderBottom: 1, borderColor: "divider", pb: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar src={selectedUser?.avatar} sx={{ width: 48, height: 48 }}>
                {selectedUser?.fullName?.charAt(0) || "U"}
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  {selectedUser?.fullName || "N/A"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ID: {selectedUser?._id}
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={handleCloseUserModal}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={selectedTab} onChange={handleTabChange} variant="fullWidth">
            <Tab label="Thông tin cơ bản" icon={<PersonIcon />} iconPosition="start" />
            <Tab label="Gói tập" icon={<MembershipIcon />} iconPosition="start" />
            <Tab label="Lịch sử tập" icon={<HistoryIcon />} iconPosition="start" />
          </Tabs>
        </Box>

        <DialogContent sx={{ p: 0, overflow: "auto" }}>
          {/* Tab 1: Basic Info */}
          <TabPanel value={selectedTab} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" fontWeight="bold" gutterBottom color="primary.main">
                  Thông tin cá nhân
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Họ và tên
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {selectedUser?.fullName || "N/A"}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {selectedUser?.email || "N/A"}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Số điện thoại
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {selectedUser?.phone || "N/A"}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Ngày sinh
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {formatDate(selectedUser?.dateOfBirth)} {selectedUser?.age ? `(${selectedUser.age} tuổi)` : ""}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Giới tính
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {getGenderText(selectedUser?.gender)}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" fontWeight="bold" gutterBottom color="primary.main">
                  Thông tin hệ thống
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Trạng thái
                    </Typography>
                    <Chip
                      label={getStatusText(selectedUser?.status)}
                      color={getStatusColor(selectedUser?.status)}
                      size="small"
                    />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Ngày tạo tài khoản
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {formatDate(selectedUser?.createdAt)}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" fontWeight="bold" gutterBottom color="primary.main">
                  Địa chỉ
                </Typography>
                <Typography variant="body1">{selectedUser?.address || "Chưa cập nhật"}</Typography>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Tab 2: Subscriptions */}
          <TabPanel value={selectedTab} index={1}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Typography variant="h6" fontWeight="bold" color="primary.main">
                Gói tập hiện tại & Lịch sử
              </Typography>
              {selectedUser && !hasActiveSubscription(selectedUser) && (
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenRegisterModal}>
                  Đăng ký gói tập
                </Button>
              )}
            </Box>

            {!selectedUser?.subscriptions || selectedUser.subscriptions.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <MembershipIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Chưa có gói tập nào
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Người dùng này chưa đăng ký gói tập nào
                </Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenRegisterModal}>
                  Đăng ký gói tập ngay
                </Button>
              </Box>
            ) : (
              <List>
                {selectedUser.subscriptions.map((subscription) => {
                  const subWithMembershipInfo = getSubscriptionWithMembershipInfo(subscription)
                  const membershipInfo = subWithMembershipInfo.membershipInfo

                  return (
                    <ListItem
                      key={subscription._id}
                      sx={{
                        border: 1,
                        borderColor: subscription.status === "active" ? "success.main" : "divider",
                        borderRadius: 2,
                        mb: 2,
                        flexDirection: "column",
                        alignItems: "flex-start",
                        p: 2,
                        bgcolor: subscription.status === "active" ? "success.50" : "background.paper",
                      }}
                    >
                      <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", mb: 2 }}>
                        <Box>
                          <Typography variant="h6" fontWeight="bold">
                            {membershipInfo?.name || "Gói tập không xác định"}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {membershipInfo?.description || "Không có mô tả"}
                          </Typography>
                        </Box>
                        <Chip
                          label={subscription.status === "active" ? "Đang hoạt động" : "Đã hết hạn"}
                          color={subscription.status === "active" ? "success" : "error"}
                          size="small"
                        />
                      </Box>

                      <Grid container spacing={2}>
                        <Grid item xs={6} md={3}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <AccessTimeIcon fontSize="small" color="action" />
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Thời gian
                              </Typography>
                              <Typography variant="body2" fontWeight="medium">
                                {formatDate(subscription.startDate)} - {formatDate(subscription.endDate)}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>

                        <Grid item xs={6} md={3}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <CheckCircleIcon fontSize="small" color="success" />
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Số buổi còn lại
                              </Typography>
                              <Typography variant="body2" fontWeight="medium">
                                {subscription.remainingSessions || 0} buổi
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>

                        <Grid item xs={6} md={3}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <PaymentIcon fontSize="small" color="primary" />
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Thời hạn
                              </Typography>
                              <Typography variant="body2" fontWeight="medium">
                                {membershipInfo?.durationMonth || 0} tháng
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>

                        <Grid item xs={6} md={3}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <PaymentIcon fontSize="small" color="success" />
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Giá
                              </Typography>
                              <Typography variant="body2" fontWeight="bold" color="success.main">
                                {formatCurrencyVND(membershipInfo?.price || 0)}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                    </ListItem>
                  )
                })}
              </List>
            )}
          </TabPanel>

          {/* Tab 3: Attendance History */}
          <TabPanel value={selectedTab} index={2}>
            <Typography variant="h6" fontWeight="bold" gutterBottom color="primary.main">
              Lịch sử tập luyện
            </Typography>

            {!selectedUser?.attendances || selectedUser.attendances.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <FitnessCenterIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Chưa có lịch sử tập luyện
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Người dùng này chưa có lần check-in nào
                </Typography>
              </Box>
            ) : (
              <List>
                {selectedUser.attendances.map((attendance, index) => (
                  <ListItem
                    key={attendance._id || index}
                    sx={{
                      border: 1,
                      borderColor: "divider",
                      borderRadius: 2,
                      mb: 2,
                      flexDirection: "column",
                      alignItems: "flex-start",
                      p: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", mb: 2 }}>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {getLocationName(attendance.locationId)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Phương thức: {attendance.method === "qrCode" ? "Mã QR" : "Nhận diện khuôn mặt"}
                        </Typography>
                      </Box>
                      <Chip
                        label={attendance.checkoutTime ? "Đã kết thúc" : "Đang tập"}
                        color={attendance.checkoutTime ? "success" : "warning"}
                        size="small"
                      />
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={6} md={3}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <CalendarIcon fontSize="small" color="action" />
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Check-in
                            </Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {formatDateTime(attendance.checkinTime)}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      <Grid item xs={6} md={3}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <ScheduleIcon fontSize="small" color="action" />
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Check-out
                            </Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {attendance.checkoutTime ? formatDateTime(attendance.checkoutTime) : "Chưa check-out"}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      <Grid item xs={6} md={3}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <AccessTimeIcon fontSize="small" color="primary" />
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Thời gian tập
                            </Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {attendance.hours ? `${attendance.hours} giờ` : "Đang tập"}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      <Grid item xs={6} md={3}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <LocationIcon fontSize="small" color="success" />
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Cơ sở
                            </Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {getLocationName(attendance.locationId)}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </ListItem>
                ))}
              </List>
            )}
          </TabPanel>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleCloseUserModal} variant="outlined" color="inherit">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {/* Membership Selection Modal */}
      <Dialog open={isRegisterModalOpen} onClose={handleCloseRegisterModal} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            Chọn gói tập cho {selectedUser?.fullName}
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={2}>
            {(listMembership || []).map((membership) => (
              <Grid item xs={12} md={6} key={membership._id}>
                <Card
                  sx={{
                    cursor: "pointer",
                    "&:hover": { boxShadow: 4 },
                    border: 1,
                    borderColor: "divider",
                  }}
                  onClick={() => handleSelectMembership(membership)}
                >
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {membership.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {membership.description}
                    </Typography>

                    <Stack spacing={1}>
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2">Thời hạn:</Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {membership.durationMonth} tháng
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2">Giá gốc:</Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {formatCurrencyVND(membership.price)}
                        </Typography>
                      </Box>

                      {membership.discount > 0 && (
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                          <Typography variant="body2">Giảm giá:</Typography>
                          <Typography variant="body2" fontWeight="medium" color="error">
                            -{membership.discount}%
                          </Typography>
                        </Box>
                      )}

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          pt: 1,
                          borderTop: 1,
                          borderColor: "divider",
                        }}
                      >
                        <Typography variant="subtitle1" fontWeight="bold">
                          Giá cuối:
                        </Typography>
                        <Typography variant="subtitle1" fontWeight="bold" color="success.main">
                          {formatCurrencyVND(calculateFinalPrice(membership.price, membership.discount))}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseRegisterModal}>Hủy</Button>
        </DialogActions>
      </Dialog>

      {/* Payment Modal */}
      <Dialog open={isPaymentModalOpen} onClose={handleClosePaymentModal} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            Thanh toán gói tập
          </Typography>
        </DialogTitle>

        <DialogContent>
          {/* User Info */}
          <Box sx={{ mb: 3, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Thông tin khách hàng
            </Typography>
            <Typography variant="body2">
              <strong>Họ tên:</strong> {selectedUser?.fullName || "N/A"}
            </Typography>
            <Typography variant="body2">
              <strong>Số điện thoại:</strong> {selectedUser?.phone || "N/A"}
            </Typography>
          </Box>

          {/* Membership Info */}
          {selectedMembership && (
            <Box sx={{ mb: 3, p: 2, bgcolor: "primary.50", borderRadius: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Thông tin gói tập
              </Typography>
              <Typography variant="body2">
                <strong>Tên gói:</strong> {selectedMembership.name}
              </Typography>
              <Typography variant="body2">
                <strong>Thời hạn:</strong> {selectedMembership.durationMonth} tháng
              </Typography>
              <Typography variant="body2">
                <strong>Giá gốc:</strong> {formatCurrencyVND(selectedMembership.price)}
              </Typography>
              {selectedMembership.discount > 0 && (
                <Typography variant="body2">
                  <strong>Giảm giá:</strong> {selectedMembership.discount}%
                </Typography>
              )}
              <Typography variant="body1" fontWeight="bold" color="success.main">
                <strong>Thành tiền:</strong>{" "}
                {formatCurrencyVND(calculateFinalPrice(selectedMembership.price, selectedMembership.discount))}
              </Typography>
            </Box>
          )}

          {/* Payment Form */}
          <Stack spacing={3}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Phương thức thanh toán</FormLabel>
              <RadioGroup
                value={registrationData.paymentMethod}
                onChange={(e) => setRegistrationData((prev) => ({ ...prev, paymentMethod: e.target.value }))}
              >
                <FormControlLabel value="cash" control={<Radio />} label="Tiền mặt" />
                <FormControlLabel value="bank" control={<Radio />} label="Chuyển khoản" />
              </RadioGroup>
            </FormControl>

            <TextField
              label="Ghi chú"
              multiline
              rows={3}
              value={registrationData.description}
              onChange={(e) => setRegistrationData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Nhập ghi chú về thanh toán (không bắt buộc)"
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClosePaymentModal} disabled={registrationLoading}>
            Hủy
          </Button>
          <Button
            onClick={handleRegistration}
            variant="contained"
            disabled={registrationLoading}
            startIcon={registrationLoading ? <CircularProgress size={20} /> : <PaymentIcon />}
          >
            {registrationLoading ? "Đang xử lý..." : "Xác nhận thanh toán"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default StaffUserPage
