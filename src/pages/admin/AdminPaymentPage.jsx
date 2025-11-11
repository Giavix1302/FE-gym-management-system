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
  TablePagination,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  CircularProgress,
  Alert,
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
  History as HistoryIcon,
} from "@mui/icons-material"

import { getAllPaymentsForAdminAPI, getPaymentsByUserIdAPI } from "~/apis/payment"

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([])
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [paymentTypeFilter, setPaymentTypeFilter] = useState("all")
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [modalOpen, setModalOpen] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [tabValue, setTabValue] = useState(0)
  const [userPayments, setUserPayments] = useState([])
  const [loadingUserPayments, setLoadingUserPayments] = useState(false)

  // API states
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalPayments: 0,
    limit: 10,
    hasNext: false,
    hasPrev: false,
  })

  // Load payments from API
  const loadPayments = async (pageNumber = 1, limit = 10) => {
    setLoading(true)
    setError(null)
    try {
      const response = await getAllPaymentsForAdminAPI(pageNumber, limit)
      if (response.success) {
        setPayments(response.payments)
        setPagination(response.pagination)
      } else {
        setError("Không thể tải dữ liệu thanh toán")
      }
    } catch (err) {
      console.error("Error loading payments:", err)
      setError("Lỗi kết nối API")
    }
    setLoading(false)
  }

  // Initial load
  useEffect(() => {
    loadPayments(1, rowsPerPage)
  }, [rowsPerPage])

  // Reload when page changes
  useEffect(() => {
    loadPayments(page + 1, rowsPerPage)
  }, [page])

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

  // Format short date
  const formatShortDate = (date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date))
  }

  // Get payment type color
  const getPaymentTypeColor = (type) => {
    switch (type) {
      case "membership":
        return "primary"
      case "booking":
        return "warning"
      case "class":
        return "info"
      default:
        return "default"
    }
  }

  // Get payment method color
  const getPaymentMethodColor = (method) => {
    switch (method) {
      case "vnpay":
        return "primary"
      case "momo":
        return "secondary"
      case "bank":
        return "info"
      case "cash":
        return "success"
      default:
        return "default"
    }
  }

  // Get payment method icon
  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case "vnpay":
        return <CreditCardIcon />
      case "momo":
        return <WalletIcon />
      case "bank":
        return <BankIcon />
      case "cash":
        return <MoneyIcon />
      default:
        return <PaymentIcon />
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
      default:
        return "Không xác định"
    }
  }

  // Get role text
  const getRoleText = (role) => {
    switch (role) {
      case "user":
        return "Thành viên"
      case "admin":
        return "Quản trị viên"
      case "staff":
        return "Nhân viên"
      case "pt":
        return "Huấn luyện viên"
      default:
        return "Khách hàng"
    }
  }

  // Get payment type text
  const getPaymentTypeText = (type) => {
    switch (type) {
      case "membership":
        return "Gói tập"
      case "booking":
        return "Đặt lịch"
      case "class":
        return "Lớp học"
      default:
        return "Khác"
    }
  }

  // Filter payments (client-side filtering for current page)
  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (payment.user.email && payment.user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment._id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = paymentTypeFilter === "all" || payment.paymentType === paymentTypeFilter
    const matchesMethod = paymentMethodFilter === "all" || payment.paymentMethod === paymentMethodFilter
    const matchesStatus = statusFilter === "all" || payment.user.status === statusFilter

    return matchesSearch && matchesType && matchesMethod && matchesStatus
  })

  // Handle row click to open modal
  const handleRowClick = (payment) => {
    setSelectedPayment(payment)
    setModalOpen(true)
    loadUserPayments(payment.userId)
  }

  // Load user payments
  const loadUserPayments = async (userId) => {
    setLoadingUserPayments(true)
    try {
      const response = await getPaymentsByUserIdAPI(userId, 1, 50) // Load more records for history
      if (response.success) {
        setUserPayments(response.payments)
      } else {
        console.error("Failed to load user payments")
        setUserPayments([])
      }
    } catch (error) {
      console.error("Error loading user payments:", error)
      setUserPayments([])
    }
    setLoadingUserPayments(false)
  }

  // Handle modal close
  const handleCloseModal = () => {
    setModalOpen(false)
    setSelectedPayment(null)
    setTabValue(0)
    setUserPayments([])
  }

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  // Calculate stats from current data
  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0)
  const uniqueCustomers = new Set(payments.map((p) => p.userId)).size
  const averageTransaction = payments.length > 0 ? Math.round(totalRevenue / payments.length) : 0

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => loadPayments(1, rowsPerPage)}>
          Thử lại
        </Button>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 1, display: "flex", flexDirection: "column", height: "100%" }}>
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

      {/* Filters */}
      <Card sx={{ mb: 1 }}>
        <CardContent sx={{ "&:last-child": { pb: 2 } }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                placeholder="Tìm kiếm theo tên, email, mô tả..."
                value={searchTerm}
                size="small"
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: "action.active" }} />,
                }}
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 2 }}>
              <FormControl size="small" fullWidth>
                <InputLabel>Loại thanh toán</InputLabel>
                <Select
                  value={paymentTypeFilter}
                  label="Loại thanh toán"
                  onChange={(e) => setPaymentTypeFilter(e.target.value)}
                >
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="membership">Gói tập</MenuItem>
                  <MenuItem value="booking">Đặt lịch</MenuItem>
                  <MenuItem value="class">Lớp học</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item size={{ xs: 12, md: 2 }}>
              <FormControl size="small" fullWidth>
                <InputLabel>Phương thức</InputLabel>
                <Select
                  value={paymentMethodFilter}
                  label="Phương thức"
                  onChange={(e) => setPaymentMethodFilter(e.target.value)}
                >
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="vnpay">VNPay</MenuItem>
                  <MenuItem value="momo">MoMo</MenuItem>
                  <MenuItem value="bank">Chuyển khoản</MenuItem>
                  <MenuItem value="cash">Tiền mặt</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item size={{ xs: 12, md: 2 }}>
              <FormControl size="small" fullWidth>
                <InputLabel>Trạng thái KH</InputLabel>
                <Select value={statusFilter} label="Trạng thái KH" onChange={(e) => setStatusFilter(e.target.value)}>
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="active">Hoạt động</MenuItem>
                  <MenuItem value="inactive">Không hoạt động</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item size={{ xs: 12, md: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  setSearchTerm("")
                  setPaymentTypeFilter("all")
                  setPaymentMethodFilter("all")
                  setStatusFilter("all")
                }}
              >
                Xóa bộ lọc
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Payment Table - Full Width */}
      <Card sx={{ flex: 1 }}>
        <CardContent sx={{ p: 0 }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 4 }}>
              <CircularProgress />
              <Typography sx={{ ml: 2 }}>Đang tải dữ liệu...</Typography>
            </Box>
          ) : (
            <Box sx={{}}>
              <TableContainer sx={{ height: "60vh", overflowY: "auto" }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow sx={{}}>
                      <TableCell>
                        <strong>Khách hàng</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Liên hệ</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Giao dịch</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Loại</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Phương thức</strong>
                      </TableCell>
                      <TableCell align="right">
                        <strong>Số tiền</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Ngày thanh toán</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Trạng thái KH</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody sx={{ overflowY: "auto" }}>
                    {filteredPayments.map((payment) => (
                      <TableRow
                        key={payment._id}
                        hover
                        sx={{
                          cursor: "pointer",
                          "&:hover": {
                            backgroundColor: "action.hover",
                          },
                        }}
                        onClick={() => handleRowClick(payment)}
                      >
                        {/* Customer Info */}
                        <TableCell sx={{ minWidth: 200, maxWidth: 200 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Avatar src={payment.user.avatar} sx={{ width: 40, height: 40 }}>
                              {payment.user.fullName.charAt(0)}
                            </Avatar>
                            <Box sx={{ minWidth: 0, flex: 1 }}>
                              <Typography
                                variant="body2"
                                fontWeight="medium"
                                sx={{
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {payment.user.fullName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                ID: {payment.userId.slice(-6)}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>

                        {/* Contact Info */}
                        <TableCell sx={{ minWidth: 180, maxWidth: 180 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {payment.user.email || "Chưa có email"}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              display: "block",
                            }}
                          >
                            {payment.user.phone}
                          </Typography>
                        </TableCell>

                        {/* Transaction Info */}
                        <TableCell sx={{ minWidth: 250, maxWidth: 250 }}>
                          <Typography
                            variant="body2"
                            fontWeight="medium"
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              lineHeight: 1.2,
                              maxHeight: "2.4em", // 2 lines * 1.2 line-height
                            }}
                          >
                            {payment.description}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            #{payment._id.slice(-8)}
                          </Typography>
                        </TableCell>

                        {/* Payment Type */}
                        <TableCell sx={{ minWidth: 120 }}>
                          <Chip
                            label={getPaymentTypeText(payment.paymentType)}
                            color={getPaymentTypeColor(payment.paymentType)}
                            size="small"
                          />
                        </TableCell>

                        {/* Payment Method */}
                        <TableCell sx={{ minWidth: 140 }}>
                          <Chip
                            icon={getPaymentMethodIcon(payment.paymentMethod)}
                            label={payment.paymentMethod.toUpperCase()}
                            color={getPaymentMethodColor(payment.paymentMethod)}
                            size="small"
                          />
                        </TableCell>

                        {/* Amount */}
                        <TableCell align="right" sx={{ minWidth: 120 }}>
                          <Typography variant="body2" fontWeight="bold" color="success.main">
                            {formatCurrencyVND(payment.amount)}
                          </Typography>
                        </TableCell>

                        {/* Payment Date */}
                        <TableCell sx={{ minWidth: 140 }}>
                          <Typography variant="body2">{formatShortDate(payment.paymentDate)}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Intl.DateTimeFormat("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            }).format(new Date(payment.paymentDate))}
                          </Typography>
                        </TableCell>

                        {/* Customer Status */}
                        <TableCell sx={{ minWidth: 120 }}>
                          <Chip
                            label={payment.user.status === "active" ? "Hoạt động" : "Không hoạt động"}
                            color={getStatusColor(payment.user.status)}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredPayments.length === 0 && !loading && (
                      <TableRow>
                        <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                          <Typography variant="body2" color="text.secondary">
                            Không tìm thấy giao dịch nào
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={pagination.totalPayments}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Số dòng mỗi trang:"
                labelDisplayedRows={({ from, to, count }) => `${from}–${to} của ${count}`}
              />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Payment Detail Modal */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={modalOpen}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "95%", sm: "90%", md: "60%" },
              maxHeight: "90vh",
              bgcolor: "background.paper",
              borderRadius: 3,
              boxShadow: 24,
              overflow: "hidden",
            }}
          >
            {/* Modal Header */}
            <DialogTitle sx={{ pb: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <PaymentIcon color="primary" sx={{ fontSize: 28 }} />
                  <Box>
                    <Typography variant="h5" fontWeight="bold" color="primary.main">
                      Chi tiết giao dịch
                    </Typography>
                    {selectedPayment && (
                      <Typography variant="body2" color="text.secondary">
                        #{selectedPayment._id.slice(-8).toUpperCase()}
                      </Typography>
                    )}
                  </Box>
                </Box>
                <IconButton onClick={handleCloseModal} size="small">
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>

            {/* Modal Content */}
            <DialogContent dividers sx={{ p: 0, overflow: "hidden" }}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="payment detail tabs">
                  <Tab label="Thông tin giao dịch" />
                  <Tab label="Thông tin khách hàng" />
                  <Tab
                    label={`Lịch sử thanh toán (${userPayments.length})`}
                    icon={<HistoryIcon />}
                    iconPosition="end"
                  />
                </Tabs>
              </Box>

              <Box sx={{ p: 3, maxHeight: 400, overflow: "auto" }}>
                {/* Tab 1: Transaction Details */}
                {tabValue === 0 && selectedPayment && (
                  <Grid container spacing={3}>
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
                            label={getPaymentTypeText(selectedPayment.paymentType)}
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

                    <Grid item size={{ xs: 12, md: 6 }}>
                      <Typography variant="h6" fontWeight="bold" gutterBottom color="primary.main">
                        Thông tin kỹ thuật
                      </Typography>
                      <Stack spacing={2}>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            ID giao dịch
                          </Typography>
                          <Typography variant="body1" fontFamily="monospace">
                            {selectedPayment._id}
                          </Typography>
                        </Box>

                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            ID khách hàng
                          </Typography>
                          <Typography variant="body1" fontFamily="monospace">
                            {selectedPayment.userId}
                          </Typography>
                        </Box>

                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Reference ID
                          </Typography>
                          <Typography variant="body1" fontFamily="monospace">
                            {selectedPayment.referenceId}
                          </Typography>
                        </Box>

                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Ngày tạo
                          </Typography>
                          <Typography variant="body1">{formatDate(new Date(selectedPayment.createdAt))}</Typography>
                        </Box>
                      </Stack>
                    </Grid>
                  </Grid>
                )}

                {/* Tab 2: Customer Details */}
                {tabValue === 1 && selectedPayment && (
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
                            <Typography variant="body1">{selectedPayment.user.email || "Chưa có email"}</Typography>
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

                        {selectedPayment.user.address && (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <LocationIcon color="action" />
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Địa chỉ
                              </Typography>
                              <Typography variant="body1">{selectedPayment.user.address}</Typography>
                            </Box>
                          </Box>
                        )}

                        {(selectedPayment.user.age || selectedPayment.user.gender) && (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <CakeIcon color="action" />
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Thông tin cá nhân
                              </Typography>
                              <Typography variant="body1">
                                {selectedPayment.user.age ? `${selectedPayment.user.age} tuổi` : ""}
                                {selectedPayment.user.age && selectedPayment.user.gender ? " - " : ""}
                                {selectedPayment.user.gender ? getGenderText(selectedPayment.user.gender) : ""}
                              </Typography>
                            </Box>
                          </Box>
                        )}

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
                  </Grid>
                )}

                {/* Tab 3: Payment History */}
                {tabValue === 2 && (
                  <Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom color="primary.main">
                      Lịch sử thanh toán của khách hàng
                    </Typography>

                    {loadingUserPayments ? (
                      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                        <CircularProgress />
                        <Typography sx={{ ml: 2 }}>Đang tải lịch sử...</Typography>
                      </Box>
                    ) : (
                      <List>
                        {userPayments.map((payment, index) => (
                          <React.Fragment key={payment._id}>
                            <ListItem
                              sx={{
                                bgcolor: payment._id === selectedPayment?._id ? "action.selected" : "transparent",
                                borderRadius: 1,
                                mb: 1,
                              }}
                            >
                              <ListItemAvatar>
                                <Avatar sx={{ bgcolor: getPaymentTypeColor(payment.paymentType) + ".light" }}>
                                  {getPaymentMethodIcon(payment.paymentMethod)}
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={
                                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <Typography variant="body1" fontWeight="medium">
                                      {payment.description}
                                    </Typography>
                                    <Typography variant="h6" fontWeight="bold" color="success.main">
                                      {formatCurrencyVND(payment.amount)}
                                    </Typography>
                                  </Box>
                                }
                                secondary={
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      mt: 1,
                                    }}
                                  >
                                    <Box sx={{ display: "flex", gap: 1 }}>
                                      <Chip
                                        label={getPaymentTypeText(payment.paymentType)}
                                        color={getPaymentTypeColor(payment.paymentType)}
                                        size="small"
                                      />
                                      <Chip
                                        label={payment.paymentMethod.toUpperCase()}
                                        color={getPaymentMethodColor(payment.paymentMethod)}
                                        size="small"
                                      />
                                    </Box>
                                    <Typography variant="caption" color="text.secondary">
                                      {formatDate(payment.paymentDate)}
                                    </Typography>
                                  </Box>
                                }
                              />
                            </ListItem>
                            {index < userPayments.length - 1 && <Divider />}
                          </React.Fragment>
                        ))}
                        {userPayments.length === 0 && !loadingUserPayments && (
                          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                            Không tìm thấy giao dịch nào khác
                          </Typography>
                        )}
                      </List>
                    )}

                    {/* Summary */}
                    {userPayments.length > 0 && (
                      <Box sx={{ mt: 3, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          Tóm tắt
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item size={{ xs: 6 }}>
                            <Typography variant="body2" color="text.secondary">
                              Tổng giao dịch
                            </Typography>
                            <Typography variant="h6" fontWeight="bold">
                              {userPayments.length}
                            </Typography>
                          </Grid>
                          <Grid item size={{ xs: 6 }}>
                            <Typography variant="body2" color="text.secondary">
                              Tổng chi tiêu
                            </Typography>
                            <Typography variant="h6" fontWeight="bold" color="success.main">
                              {formatCurrencyVND(userPayments.reduce((sum, p) => sum + p.amount, 0))}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            </DialogContent>

            {/* Modal Actions */}
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
