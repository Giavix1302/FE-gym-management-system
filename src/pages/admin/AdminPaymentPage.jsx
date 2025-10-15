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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Modal,
  Fade,
  Backdrop,
} from "@mui/material"
import {
  Search as SearchIcon,
  FileDownload as ExportIcon,
  FileUpload as ImportIcon,
  Payment as PaymentIcon,
  AttachMoney as MoneyIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Close as CloseIcon,
  AccountBalanceWallet as WalletIcon,
  CreditCard as CreditCardIcon,
  AccountBalance as BankIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Cake as CakeIcon,
  AccountCircle as AccountCircleIcon,
} from "@mui/icons-material"

// Mock data - replace with actual API calls
const mockPayments = [
  {
    _id: "payment1",
    userId: "user1",
    referenceId: "ref1",
    paymentType: "membership",
    amount: 500000,
    paymentDate: new Date("2024-01-15"),
    paymentMethod: "vnpay",
    description: "Payment for gym membership package",
    user: {
      _id: "user1",
      fullName: "Nguyễn Văn An",
      email: "nguyenvanan@gmail.com",
      phone: "0912345678",
      avatar: "https://i.pravatar.cc/150?img=1",
      age: 25,
      dateOfBirth: new Date("1999-05-10"),
      address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
      gender: "male",
      role: "member",
      status: "active",
    },
  },
  {
    _id: "payment2",
    userId: "user2",
    referenceId: "ref2",
    paymentType: "booking",
    amount: 100000,
    paymentDate: new Date("2024-01-14"),
    paymentMethod: "momo",
    description: "Personal training session booking",
    user: {
      _id: "user2",
      fullName: "Trần Thị Bình",
      email: "tranthibibh@gmail.com",
      phone: "0987654321",
      avatar: "https://i.pravatar.cc/150?img=2",
      age: 30,
      dateOfBirth: new Date("1994-03-22"),
      address: "456 Lê Lợi, Quận 3, TP.HCM",
      gender: "female",
      role: "member",
      status: "active",
    },
  },
  {
    _id: "payment3",
    userId: "user3",
    referenceId: "ref3",
    paymentType: "membership",
    amount: 800000,
    paymentDate: new Date("2024-01-13"),
    paymentMethod: "bank",
    description: "VIP membership package payment",
    user: {
      _id: "user3",
      fullName: "Lê Hoàng Cường",
      email: "lehoangcuong@gmail.com",
      phone: "0901234567",
      avatar: "https://i.pravatar.cc/150?img=3",
      age: 28,
      dateOfBirth: new Date("1996-07-15"),
      address: "789 Điện Biên Phủ, Quận 10, TP.HCM",
      gender: "male",
      role: "member",
      status: "active",
    },
  },
  {
    _id: "payment4",
    userId: "user4",
    referenceId: "ref4",
    paymentType: "booking",
    amount: 150000,
    paymentDate: new Date("2024-01-12"),
    paymentMethod: "cash",
    description: "Group class booking payment",
    user: {
      _id: "user4",
      fullName: "Phạm Thị Dung",
      email: "phamthidung@gmail.com",
      phone: "0976543210",
      avatar: "https://i.pravatar.cc/150?img=4",
      age: 22,
      dateOfBirth: new Date("2002-11-08"),
      address: "321 Võ Văn Tần, Quận 3, TP.HCM",
      gender: "female",
      role: "member",
      status: "active",
    },
  },
  {
    _id: "payment5",
    userId: "user5",
    referenceId: "ref5",
    paymentType: "membership",
    amount: 300000,
    paymentDate: new Date("2024-01-11"),
    paymentMethod: "vnpay",
    description: "Student membership package",
    user: {
      _id: "user5",
      fullName: "Võ Minh Tuấn",
      email: "vominhtuan@gmail.com",
      phone: "0965432109",
      avatar: "https://i.pravatar.cc/150?img=5",
      age: 20,
      dateOfBirth: new Date("2004-02-28"),
      address: "654 Cách Mạng Tháng 8, Quận Tân Bình, TP.HCM",
      gender: "male",
      role: "member",
      status: "inactive",
    },
  },
]

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState(mockPayments)
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [paymentTypeFilter, setPaymentTypeFilter] = useState("all")
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    // Initialize with first payment selected
    if (payments.length > 0) {
      setSelectedPayment(payments[0])
    }
  }, [])

  // Format currency
  const formatCurrencyVND = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  // Format date
  const formatDate = (date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date))
  }

  // Filter payments
  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment._id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = paymentTypeFilter === "all" || payment.paymentType === paymentTypeFilter
    const matchesMethod = paymentMethodFilter === "all" || payment.paymentMethod === paymentMethodFilter
    const matchesStatus = statusFilter === "all" || payment.user.status === statusFilter

    return matchesSearch && matchesType && matchesMethod && matchesStatus
  })

  const handleRowClick = (payment) => {
    setSelectedPayment(payment)
  }

  const handleOpenModal = (payment) => {
    setSelectedPayment(payment)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
  }

  // Get payment method icon
  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case "cash":
        return <MoneyIcon />
      case "bank":
        return <BankIcon />
      case "momo":
        return <WalletIcon />
      case "vnpay":
        return <CreditCardIcon />
      default:
        return <PaymentIcon />
    }
  }

  // Get payment method color
  const getPaymentMethodColor = (method) => {
    switch (method) {
      case "cash":
        return "success"
      case "bank":
        return "primary"
      case "momo":
        return "secondary"
      case "vnpay":
        return "info"
      default:
        return "default"
    }
  }

  // Get payment type color
  const getPaymentTypeColor = (type) => {
    switch (type) {
      case "membership":
        return "primary"
      case "booking":
        return "warning"
      default:
        return "default"
    }
  }

  // Get status color
  const getStatusColor = (status) => {
    return status === "active" ? "success" : "error"
  }

  // Get gender text
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

  // Get role text
  const getRoleText = (role) => {
    switch (role) {
      case "admin":
        return "Quản trị viên"
      case "pt":
        return "HLV cá nhân"
      case "member":
        return "Thành viên"
      default:
        return role
    }
  }

  return (
    <Box sx={{ p: 1, height: "100%" }}>
      {/* Header */}
      <Card sx={{ mb: 1 }}>
        <CardContent sx={{ "&:last-child": { pb: 2 } }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <PaymentIcon sx={{ fontSize: 32, color: "primary.main" }} />
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                Quản lý thanh toán
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

      {/* Main Content */}
      <Grid container spacing={1}>
        {/* Left Column - Table */}
        <Grid item size={{ xs: 12, md: 8 }}>
          {/* Filters */}
          <Card sx={{ mb: 1 }}>
            <CardContent sx={{ "&:last-child": { pb: 2 } }}>
              <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
                <TextField
                  placeholder="Tìm kiếm giao dịch..."
                  variant="outlined"
                  size="small"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{ width: 200 }}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: "action.active" }} />,
                  }}
                />

                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Loại thanh toán</InputLabel>
                  <Select
                    value={paymentTypeFilter}
                    onChange={(e) => setPaymentTypeFilter(e.target.value)}
                    label="Loại thanh toán"
                  >
                    <MenuItem value="all">Tất cả</MenuItem>
                    <MenuItem value="membership">Gói tập</MenuItem>
                    <MenuItem value="booking">Đặt lịch</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Phương thức</InputLabel>
                  <Select
                    value={paymentMethodFilter}
                    onChange={(e) => setPaymentMethodFilter(e.target.value)}
                    label="Phương thức"
                  >
                    <MenuItem value="all">Tất cả</MenuItem>
                    <MenuItem value="cash">Tiền mặt</MenuItem>
                    <MenuItem value="bank">Ngân hàng</MenuItem>
                    <MenuItem value="momo">MoMo</MenuItem>
                    <MenuItem value="vnpay">VNPay</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Trạng thái user</InputLabel>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    label="Trạng thái user"
                  >
                    <MenuItem value="all">Tất cả</MenuItem>
                    <MenuItem value="active">Hoạt động</MenuItem>
                    <MenuItem value="inactive">Không hoạt động</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </CardContent>
          </Card>

          {/* Data Table */}
          <Card>
            <CardContent sx={{ p: 0 }}>
              <Typography variant="h6" sx={{ p: 2, pb: 1, fontWeight: "bold", color: "primary.main" }}>
                Danh sách giao dịch ({filteredPayments.length} giao dịch)
              </Typography>

              <TableContainer sx={{ maxHeight: "58vh", overflowY: "auto" }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "grey.50" }}>
                      <TableCell sx={{ fontWeight: "bold", py: 1 }}>Khách hàng</TableCell>
                      <TableCell sx={{ fontWeight: "bold", py: 1 }}>Loại</TableCell>
                      <TableCell sx={{ fontWeight: "bold", py: 1 }}>Số tiền</TableCell>
                      <TableCell sx={{ fontWeight: "bold", py: 1 }}>Phương thức</TableCell>
                      <TableCell sx={{ fontWeight: "bold", py: 1 }}>Ngày thanh toán</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {filteredPayments.map((payment) => (
                      <TableRow
                        key={payment._id}
                        hover
                        onClick={() => handleRowClick(payment)}
                        sx={{
                          cursor: "pointer",
                          bgcolor: selectedPayment?._id === payment._id ? "primary.50" : "transparent",
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Avatar src={payment.user.avatar} sx={{ width: 40, height: 40 }}>
                              {payment.user.fullName.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography fontWeight="medium">{payment.user.fullName}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {payment.user.email}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Chip
                            label={payment.paymentType === "membership" ? "Gói tập" : "Đặt lịch"}
                            color={getPaymentTypeColor(payment.paymentType)}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>

                        <TableCell>
                          <Typography fontWeight="bold" color="success.main">
                            {formatCurrencyVND(payment.amount)}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Chip
                            icon={getPaymentMethodIcon(payment.paymentMethod)}
                            label={payment.paymentMethod.toUpperCase()}
                            color={getPaymentMethodColor(payment.paymentMethod)}
                            size="small"
                          />
                        </TableCell>

                        <TableCell>
                          <Typography variant="body2">{formatDate(payment.paymentDate)}</Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Payment Details */}
        <Grid item size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: "79vh", display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ overflowY: "auto", flex: 1 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", color: "primary.main" }}>
                Thông tin chi tiết giao dịch
              </Typography>

              {selectedPayment && (
                <>
                  {/* Payment Header */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Giao dịch #{selectedPayment._id.slice(-6).toUpperCase()}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                      <Chip
                        label={selectedPayment.paymentType === "membership" ? "Gói tập" : "Đặt lịch"}
                        color={getPaymentTypeColor(selectedPayment.paymentType)}
                        size="small"
                      />
                      <Chip
                        icon={getPaymentMethodIcon(selectedPayment.paymentMethod)}
                        label={selectedPayment.paymentMethod.toUpperCase()}
                        color={getPaymentMethodColor(selectedPayment.paymentMethod)}
                        size="small"
                      />
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Payment Information */}
                  <Stack spacing={2} sx={{ mb: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <MoneyIcon color="success" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Số tiền thanh toán
                        </Typography>
                        <Typography variant="h5" fontWeight="bold" color="success.main">
                          {formatCurrencyVND(selectedPayment.amount)}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <CalendarIcon color="info" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Ngày thanh toán
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {formatDate(selectedPayment.paymentDate)}
                        </Typography>
                      </Box>
                    </Box>

                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Mô tả giao dịch
                      </Typography>
                      <Typography variant="body1">{selectedPayment.description}</Typography>
                    </Box>
                  </Stack>

                  <Divider sx={{ my: 2 }} />

                  {/* Customer Information */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="primary.main">
                      Thông tin khách hàng
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                      <Avatar src={selectedPayment.user.avatar} sx={{ width: 60, height: 60 }}>
                        {selectedPayment.user.fullName.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {selectedPayment.user.fullName}
                        </Typography>
                        <Chip
                          label={selectedPayment.user.status === "active" ? "Hoạt động" : "Không hoạt động"}
                          color={getStatusColor(selectedPayment.user.status)}
                          size="small"
                        />
                      </Box>
                    </Box>

                    <Stack spacing={1.5}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <EmailIcon fontSize="small" color="action" />
                        <Typography variant="body2">{selectedPayment.user.email}</Typography>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <PhoneIcon fontSize="small" color="action" />
                        <Typography variant="body2">{selectedPayment.user.phone}</Typography>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <LocationIcon fontSize="small" color="action" />
                        <Typography variant="body2">{selectedPayment.user.address}</Typography>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <CakeIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          {selectedPayment.user.age} tuổi - {getGenderText(selectedPayment.user.gender)}
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <AccountCircleIcon fontSize="small" color="action" />
                        <Typography variant="body2">{getRoleText(selectedPayment.user.role)}</Typography>
                      </Box>
                    </Stack>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Technical Information */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                      Thông tin kỹ thuật:
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      ID giao dịch: {selectedPayment._id}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      ID khách hàng: {selectedPayment.userId}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Reference ID: {selectedPayment.referenceId}
                    </Typography>
                  </Box>

                  {/* View Details Button */}
                  <Box sx={{ mt: 3 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => handleOpenModal(selectedPayment)}
                      sx={{ textTransform: "none", fontWeight: "bold" }}
                    >
                      Xem chi tiết đầy đủ
                    </Button>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Payment Detail Modal */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={modalOpen}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "90%", sm: "80%", md: "60%" },
              maxHeight: "90vh",
              bgcolor: "background.paper",
              borderRadius: 3,
              boxShadow: 24,
              overflow: "auto",
            }}
          >
            <DialogTitle sx={{ pb: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <PaymentIcon color="primary" sx={{ fontSize: 28 }} />
                  <Typography variant="h5" fontWeight="bold" color="primary.main">
                    Chi tiết giao dịch
                  </Typography>
                </Box>
                <IconButton onClick={handleCloseModal} size="small">
                  <CloseIcon />
                </IconButton>
              </Box>
              {selectedPayment && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, ml: 5 }}>
                  #{selectedPayment._id.slice(-8).toUpperCase()}
                </Typography>
              )}
            </DialogTitle>

            <DialogContent dividers>
              {selectedPayment && (
                <Grid container spacing={3}>
                  <Grid item size={{ xs: 12, md: 6 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom color="primary.main">
                      Thông tin khách hàng
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                      <Avatar src={selectedPayment.user.avatar} sx={{ width: 80, height: 80 }}>
                        {selectedPayment.user.fullName.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="h5" fontWeight="bold">
                          {selectedPayment.user.fullName}
                        </Typography>
                        <Chip
                          label={selectedPayment.user.status === "active" ? "Hoạt động" : "Không hoạt động"}
                          color={getStatusColor(selectedPayment.user.status)}
                          size="small"
                        />
                      </Box>
                    </Box>

                    <Stack spacing={2}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <EmailIcon color="action" />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Email
                          </Typography>
                          <Typography variant="body1">{selectedPayment.user.email}</Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <PhoneIcon color="action" />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Số điện thoại
                          </Typography>
                          <Typography variant="body1">{selectedPayment.user.phone}</Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <LocationIcon color="action" />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Địa chỉ
                          </Typography>
                          <Typography variant="body1">{selectedPayment.user.address}</Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <CakeIcon color="action" />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Tuổi & Giới tính
                          </Typography>
                          <Typography variant="body1">
                            {selectedPayment.user.age} tuổi - {getGenderText(selectedPayment.user.gender)}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <AccountCircleIcon color="action" />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Vai trò
                          </Typography>
                          <Typography variant="body1">{getRoleText(selectedPayment.user.role)}</Typography>
                        </Box>
                      </Box>
                    </Stack>
                  </Grid>

                  <Grid item size={{ xs: 12, md: 6 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom color="primary.main">
                      Thông tin giao dịch
                    </Typography>

                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Số tiền
                        </Typography>
                        <Typography variant="h4" fontWeight="bold" color="success.main">
                          {formatCurrencyVND(selectedPayment.amount)}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Loại thanh toán
                        </Typography>
                        <Chip
                          label={selectedPayment.paymentType === "membership" ? "Gói tập" : "Đặt lịch"}
                          color={getPaymentTypeColor(selectedPayment.paymentType)}
                          sx={{ mt: 0.5 }}
                        />
                      </Box>

                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Phương thức thanh toán
                        </Typography>
                        <Chip
                          icon={getPaymentMethodIcon(selectedPayment.paymentMethod)}
                          label={selectedPayment.paymentMethod.toUpperCase()}
                          color={getPaymentMethodColor(selectedPayment.paymentMethod)}
                          sx={{ mt: 0.5 }}
                        />
                      </Box>

                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Ngày thanh toán
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {formatDate(selectedPayment.paymentDate)}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Mô tả
                        </Typography>
                        <Typography variant="body1">{selectedPayment.description}</Typography>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
              )}
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button onClick={handleCloseModal} variant="outlined" color="inherit">
                Đóng
              </Button>
              <Button variant="contained" sx={{ minWidth: 100 }}>
                In hóa đơn
              </Button>
            </DialogActions>
          </Box>
        </Fade>
      </Modal>
    </Box>
  )
}
