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
} from "@mui/material"
import {
  People as PeopleIcon,
  Person as PersonIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FileDownload as ExportIcon,
  FileUpload as ImportIcon,
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
} from "@mui/icons-material"

// Mock data for demonstration
const mockUsers = [
  {
    _id: "user1",
    fullName: "Nguyễn Văn An",
    email: "nguyenvana@email.com",
    phone: "0123456789",
    avatar: "",
    age: 25,
    dateOfBirth: "1998-05-15",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    gender: "male",
    role: "member",
    status: "active",
    createdAt: "2024-01-15T00:00:00Z",
  },
  {
    _id: "user2",
    fullName: "Trần Thị Bình",
    email: "tranthib@email.com",
    phone: "0987654321",
    avatar: "",
    age: 28,
    dateOfBirth: "1995-08-22",
    address: "456 Đường XYZ, Quận 3, TP.HCM",
    gender: "female",
    role: "pt",
    status: "active",
    createdAt: "2024-02-10T00:00:00Z",
  },
  {
    _id: "user3",
    fullName: "Lê Minh Cường",
    email: "leminhc@email.com",
    phone: "0345678901",
    avatar: "",
    age: 32,
    dateOfBirth: "1991-12-03",
    address: "789 Đường DEF, Quận 7, TP.HCM",
    gender: "male",
    role: "member",
    status: "inactive",
    createdAt: "2024-01-05T00:00:00Z",
  },
]

const mockSubscriptions = [
  {
    _id: "sub1",
    userId: "user1",
    membershipId: "mem1",
    membershipName: "Gói Gym Premium",
    startDate: "2024-01-20",
    endDate: "2024-04-20",
    status: "active",
    remainingSessions: 15,
    paymentStatus: "PAID",
    price: 1200000,
    discount: 10,
  },
  {
    _id: "sub2",
    userId: "user1",
    membershipId: "mem2",
    membershipName: "Gói Boxing Cơ Bản",
    startDate: "2023-10-15",
    endDate: "2024-01-15",
    status: "expired",
    remainingSessions: 0,
    paymentStatus: "PAID",
    price: 800000,
    discount: 0,
  },
  {
    _id: "sub3",
    userId: "user3",
    membershipId: "mem1",
    membershipName: "Gói VIP",
    startDate: "2024-02-01",
    endDate: "2024-08-01",
    status: "active",
    remainingSessions: 25,
    paymentStatus: "UNPAID",
    price: 2000000,
    discount: 15,
  },
]

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

export default function AdminUserManagement() {
  const [users, setUsers] = useState(mockUsers)
  const [selectedUser, setSelectedUser] = useState(users[0])
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [genderFilter, setGenderFilter] = useState("all")

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTab, setSelectedTab] = useState(0)

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm)

    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    const matchesGender = genderFilter === "all" || user.gender === genderFilter

    return matchesSearch && matchesRole && matchesStatus && matchesGender
  })

  const handleRowClick = (user) => {
    setSelectedUser(user)
  }

  const handleOpenModal = () => {
    setIsModalOpen(true)
    setSelectedTab(0)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue)
  }

  const formatCurrencyVND = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN")
  }

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "error"
      case "pt":
        return "warning"
      case "member":
        return "primary"
      default:
        return "default"
    }
  }

  const getRoleText = (role) => {
    switch (role) {
      case "admin":
        return "Quản trị viên"
      case "pt":
        return "Huấn luyện viên"
      case "member":
        return "Thành viên"
      default:
        return role
    }
  }

  const getStatusColor = (status) => {
    return status === "active" ? "success" : "error"
  }

  const getStatusText = (status) => {
    return status === "active" ? "Hoạt động" : "Không hoạt động"
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
        return gender
    }
  }

  const getSubscriptionStatusColor = (status) => {
    return status === "active" ? "success" : "error"
  }

  const getPaymentStatusColor = (status) => {
    return status === "PAID" ? "success" : "error"
  }

  const getUserSubscriptions = (userId) => {
    return mockSubscriptions.filter((sub) => sub.userId === userId)
  }

  const calculateFinalPrice = (price, discount) => {
    return price - (price * discount) / 100
  }

  return (
    <Box sx={{ p: 1, height: "100vh" }}>
      {/* Header */}
      <Card sx={{ mb: 1 }}>
        <CardContent sx={{ "&:last-child": { pb: 2 } }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <PeopleIcon sx={{ fontSize: 32, color: "primary.main" }} />
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                Quản lý người dùng
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

      <Grid container spacing={1}>
        {/* Left Column - User List */}
        <Grid item size={{ xs: 12, md: 8 }}>
          {/* Filters */}
          <Card sx={{ mb: 1 }}>
            <CardContent sx={{ "&:last-child": { pb: 2 } }}>
              <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
                <TextField
                  placeholder="Tìm kiếm người dùng..."
                  variant="outlined"
                  size="small"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{ width: 200 }}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />,
                  }}
                />

                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Vai trò</InputLabel>
                  <Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} label="Vai trò">
                    <MenuItem value="all">Tất cả</MenuItem>
                    <MenuItem value="admin">Quản trị viên</MenuItem>
                    <MenuItem value="pt">Huấn luyện viên</MenuItem>
                    <MenuItem value="member">Thành viên</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Trạng thái</InputLabel>
                  <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Trạng thái">
                    <MenuItem value="all">Tất cả</MenuItem>
                    <MenuItem value="active">Hoạt động</MenuItem>
                    <MenuItem value="inactive">Không hoạt động</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 100 }}>
                  <InputLabel>Giới tính</InputLabel>
                  <Select value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)} label="Giới tính">
                    <MenuItem value="all">Tất cả</MenuItem>
                    <MenuItem value="male">Nam</MenuItem>
                    <MenuItem value="female">Nữ</MenuItem>
                    <MenuItem value="other">Khác</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </CardContent>
          </Card>

          {/* User Table */}
          <Card>
            <CardContent sx={{ p: 0 }}>
              <Typography variant="h6" sx={{ p: 2, pb: 1, fontWeight: "bold", color: "primary.main" }}>
                Danh sách người dùng ({filteredUsers.length} người)
              </Typography>

              <TableContainer sx={{ maxHeight: "58vh", overflowY: "auto" }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold", py: 1 }}>Người dùng</TableCell>
                      <TableCell sx={{ fontWeight: "bold", py: 1 }}>Liên hệ</TableCell>
                      <TableCell sx={{ fontWeight: "bold", py: 1 }}>Vai trò</TableCell>
                      <TableCell sx={{ fontWeight: "bold", py: 1 }}>Trạng thái</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow
                        key={user._id}
                        hover
                        onClick={() => handleRowClick(user)}
                        sx={{
                          cursor: "pointer",
                          bgcolor: selectedUser?._id === user._id ? "primary.50" : "transparent",
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Avatar src={user.avatar}>{user.fullName.charAt(0)}</Avatar>
                            <Box>
                              <Typography fontWeight="medium">{user.fullName}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {getGenderText(user.gender)}, {user.age} tuổi
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Typography variant="body2">{user.email}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {user.phone}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Chip
                            label={getRoleText(user.role)}
                            color={getRoleColor(user.role)}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>

                        <TableCell>
                          <Chip label={getStatusText(user.status)} color={getStatusColor(user.status)} size="small" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - User Details Preview */}
        <Grid item size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: "79vh", display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ overflowY: "auto", flex: 1 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", color: "primary.main" }}>
                Thông tin người dùng
              </Typography>

              {selectedUser && (
                <>
                  {/* User Header */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                    <Avatar src={selectedUser.avatar} sx={{ width: 64, height: 64 }}>
                      {selectedUser.fullName.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {selectedUser.fullName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedUser.email}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                        <Chip
                          label={getRoleText(selectedUser.role)}
                          color={getRoleColor(selectedUser.role)}
                          size="small"
                        />
                        <Chip
                          label={getStatusText(selectedUser.status)}
                          color={getStatusColor(selectedUser.status)}
                          size="small"
                        />
                      </Box>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Basic Info */}
                  <Stack spacing={2}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <PhoneIcon color="action" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Số điện thoại
                        </Typography>
                        <Typography variant="body1">{selectedUser.phone}</Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <CakeIcon color="action" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Ngày sinh / Tuổi
                        </Typography>
                        <Typography variant="body1">
                          {formatDate(selectedUser.dateOfBirth)} ({selectedUser.age} tuổi)
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <LocationIcon color="action" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Địa chỉ
                        </Typography>
                        <Typography variant="body1">{selectedUser.address}</Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <PersonIcon color="action" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Giới tính
                        </Typography>
                        <Typography variant="body1">{getGenderText(selectedUser.gender)}</Typography>
                      </Box>
                    </Box>
                  </Stack>

                  <Divider sx={{ my: 2 }} />

                  {/* Action Buttons */}
                  <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                    <Button variant="contained" fullWidth onClick={handleOpenModal} sx={{ textTransform: "none" }}>
                      Xem chi tiết
                    </Button>
                  </Box>

                  <Typography variant="caption" color="text.secondary">
                    ID: {selectedUser._id}
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* User Details Modal */}
      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        // maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar src={selectedUser?.avatar} sx={{ width: 40, height: 40 }}>
                {selectedUser?.fullName?.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="bold" color="primary.main">
                  {selectedUser?.fullName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedUser?.email}
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={handleCloseModal} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={selectedTab} onChange={handleTabChange}>
            <Tab label="Thông tin cá nhân" iconPosition="start" icon={<PersonIcon />} />
            <Tab label="Gói tập đã đăng ký" iconPosition="start" icon={<MembershipIcon />} />
          </Tabs>
        </Box>

        <DialogContent sx={{ p: 0, minHeight: 400 }}>
          {/* Tab 1: User Details */}
          <TabPanel value={selectedTab} index={0}>
            <Grid container spacing={3}>
              <Grid item size={{ xs: 12, md: 6 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom color="primary.main">
                  Thông tin cơ bản
                </Typography>

                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Họ và tên
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {selectedUser?.fullName}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {selectedUser?.email}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Số điện thoại
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {selectedUser?.phone}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Ngày sinh
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {formatDate(selectedUser?.dateOfBirth)} ({selectedUser?.age} tuổi)
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

              <Grid item size={{ xs: 12, md: 6 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom color="primary.main">
                  Thông tin hệ thống
                </Typography>

                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Vai trò
                    </Typography>
                    <Chip
                      label={getRoleText(selectedUser?.role)}
                      color={getRoleColor(selectedUser?.role)}
                      size="small"
                    />
                  </Box>

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

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      ID người dùng
                    </Typography>
                    <Typography variant="caption" sx={{ fontFamily: "monospace", p: 1, borderRadius: 1 }}>
                      {selectedUser?._id}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>

              <Grid item size={{ xs: 12 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom color="primary.main">
                  Địa chỉ
                </Typography>
                <Typography variant="body1">{selectedUser?.address}</Typography>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Tab 2: Memberships */}
          <TabPanel value={selectedTab} index={1}>
            <Typography variant="h6" fontWeight="bold" gutterBottom color="primary.main">
              Lịch sử đăng ký gói tập ({getUserSubscriptions(selectedUser?._id || "").length} gói)
            </Typography>

            {getUserSubscriptions(selectedUser?._id || "").length === 0 ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <MembershipIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Chưa có gói tập nào
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Người dùng này chưa đăng ký gói tập nào
                </Typography>
              </Box>
            ) : (
              <List>
                {getUserSubscriptions(selectedUser?._id || "").map((subscription, index) => (
                  <React.Fragment key={subscription._id}>
                    <ListItem
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
                      {/* Header */}
                      <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", mb: 2 }}>
                        <Box>
                          <Typography variant="h6" fontWeight="bold">
                            {subscription.membershipName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            ID: {subscription._id}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", gap: 1, flexDirection: "column", alignItems: "flex-end" }}>
                          <Chip
                            label={subscription.status === "active" ? "Đang hoạt động" : "Đã hết hạn"}
                            color={getSubscriptionStatusColor(subscription.status)}
                            size="small"
                          />
                          <Chip
                            label={subscription.paymentStatus === "PAID" ? "Đã thanh toán" : "Chưa thanh toán"}
                            color={getPaymentStatusColor(subscription.paymentStatus)}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      </Box>

                      {/* Details */}
                      <Grid container spacing={2}>
                        <Grid item size={{ xs: 6, md: 3 }}>
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

                        <Grid item size={{ xs: 6, md: 3 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <CheckCircleIcon fontSize="small" color="success" />
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Số buổi còn lại
                              </Typography>
                              <Typography variant="body2" fontWeight="medium">
                                {subscription.remainingSessions} buổi
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>

                        <Grid item size={{ xs: 6, md: 3 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <PaymentIcon fontSize="small" color="primary" />
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Giá gốc
                              </Typography>
                              <Typography variant="body2" fontWeight="medium">
                                {formatCurrencyVND(subscription.price)}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>

                        <Grid item size={{ xs: 6, md: 3 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <PaymentIcon fontSize="small" color="success" />
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Giá thực tế
                              </Typography>
                              <Typography variant="body2" fontWeight="bold" color="success.main">
                                {formatCurrencyVND(calculateFinalPrice(subscription.price, subscription.discount))}
                                {subscription.discount > 0 && (
                                  <Chip
                                    label={`-${subscription.discount}%`}
                                    size="small"
                                    color="error"
                                    sx={{ ml: 1, height: 20 }}
                                  />
                                )}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            )}
          </TabPanel>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleCloseModal} variant="outlined" color="inherit" sx={{ minWidth: 100 }}>
            Đóng
          </Button>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            sx={{ minWidth: 100 }}
            onClick={() => {
              // Handle edit user action
              console.log("Edit user:", selectedUser)
            }}
          >
            Chỉnh sửa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
