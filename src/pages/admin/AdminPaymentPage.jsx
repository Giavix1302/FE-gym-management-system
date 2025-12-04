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
  Undo as RefundIcon,
} from "@mui/icons-material"

import { getAllPaymentsForAdminAPI, getPaymentsByUserIdAPI, updateRefundPayment } from "~/apis/payment"

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([])
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [paymentTypeFilter, setPaymentTypeFilter] = useState("all")
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all")
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all") // Added payment status filter
  const [modalOpen, setModalOpen] = useState(false)
  const [refundDialogOpen, setRefundDialogOpen] = useState(false) // Added refund dialog state
  const [refundAmount, setRefundAmount] = useState("") // Added refund amount input
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
      console.log("🚀 ~ loadPayments ~ response:", response)
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

  // Get payment status color
  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "success"
      case "unpaid":
        return "warning"
      case "refunded":
        return "error"
      default:
        return "default"
    }
  }

  // Get payment status text
  const getPaymentStatusText = (status) => {
    switch (status) {
      case "paid":
        return "Đã thanh toán"
      case "unpaid":
        return "Chưa thanh toán"
      case "refunded":
        return "Hoàn tiền"
      default:
        return "Không xác định"
    }
  }

  // Get refund status display
  const getRefundStatusDisplay = (payment) => {
    // paymentStatus: 'paid' hoặc 'unpaid' -> "Không cần"
    if (payment.paymentStatus === "paid" || payment.paymentStatus === "unpaid") {
      return { text: "Không cần", color: "default" }
    }

    // paymentStatus: 'refunded' với refundAmount: 0 và refundDate: '' -> "Hoàn trả ngay"
    if (payment.paymentStatus === "refunded" && payment.refundAmount === 0 && !payment.refundDate) {
      return { text: "Hoàn trả ngay", color: "warning" }
    }

    // paymentStatus: 'refunded' với refundAmount > 0 và refundDate có giá trị -> Hiển thị số tiền + ngày
    if (payment.paymentStatus === "refunded" && payment.refundAmount > 0 && payment.refundDate) {
      return {
        text: `${formatCurrencyVND(payment.refundAmount)}`,
        subtext: `${formatShortDate(payment.refundDate)}`,
        color: "success",
      }
    }

    return { text: "Không xác định", color: "default" }
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

  // Check if payment can be refunded
  const canRefund = (payment) => {
    return payment.paymentStatus === "refunded" && payment.refundAmount === 0 && !payment.refundDate
  }

  // Filter payments
  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (payment.user.email && payment.user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment._id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = paymentTypeFilter === "all" || payment.paymentType === paymentTypeFilter
    const matchesMethod = paymentMethodFilter === "all" || payment.paymentMethod === paymentMethodFilter
    const matchesPaymentStatus = paymentStatusFilter === "all" || payment.paymentStatus === paymentStatusFilter

    return matchesSearch && matchesType && matchesMethod && matchesPaymentStatus
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
      const response = await getPaymentsByUserIdAPI(userId, 1, 50)
      console.log("🚀 ~ loadUserPayments ~ response:", response)
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

  // Handle refund dialog open
  const handleOpenRefundDialog = () => {
    setRefundDialogOpen(true)
    setRefundAmount(selectedPayment?.amount?.toString() || "")
  }

  // Handle refund dialog close
  const handleCloseRefundDialog = () => {
    setRefundDialogOpen(false)
    setRefundAmount("")
  }

  // Handle refund process
  const handleProcessRefund = async () => {
    // TODO: Implement refund API call
    console.log("Processing refund:", {
      paymentId: selectedPayment._id,
      refundAmount: parseFloat(refundAmount),
    })

    const result = await updateRefundPayment(selectedPayment._id, { refundAmount: parseFloat(refundAmount) })
    console.log("🚀 ~ handleProcessRefund ~ result:", result)

    // Close dialogs and refresh data
    handleCloseRefundDialog()
    handleCloseModal()
    // Optionally reload payments to see updated status
    loadPayments(page + 1, rowsPerPage)
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
            <Grid item size={{ xs: 12, md: 3 }}>
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
                <InputLabel>Trạng thái TT</InputLabel>
                <Select
                  value={paymentStatusFilter}
                  label="Trạng thái TT"
                  onChange={(e) => setPaymentStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="paid">Đã thanh toán</MenuItem>
                  <MenuItem value="unpaid">Chưa thanh toán</MenuItem>
                  <MenuItem value="refunded">Đã hoàn trả</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item size={{ xs: 12, md: 3 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  setSearchTerm("")
                  setPaymentTypeFilter("all")
                  setPaymentMethodFilter("all")
                  setPaymentStatusFilter("all")
                }}
              >
                Xóa bộ lọc
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Payment Table */}
      <Card sx={{ flex: 1 }}>
        <CardContent sx={{ p: 0 }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 4 }}>
              <CircularProgress />
              <Typography sx={{ ml: 2 }}>Đang tải dữ liệu...</Typography>
            </Box>
          ) : (
            <Box>
              <TableContainer sx={{ height: "60vh", overflowY: "auto" }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Khách hàng</strong>
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
                        <strong>Trạng thái thanh toán</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Hoàn trả</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Ngày thanh toán</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredPayments.map((payment) => {
                      const refundStatus = getRefundStatusDisplay(payment)
                      return (
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
                                maxHeight: "2.4em",
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

                          {/* Payment Status */}
                          <TableCell sx={{ minWidth: 140 }}>
                            <Chip
                              label={getPaymentStatusText(payment.paymentStatus)}
                              color={getPaymentStatusColor(payment.paymentStatus)}
                              size="small"
                            />
                          </TableCell>

                          {/* Refund Status */}
                          <TableCell sx={{ minWidth: 140 }}>
                            <Box>
                              <Chip label={refundStatus.text} color={refundStatus.color} size="small" />
                              {refundStatus.subtext && (
                                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                                  {refundStatus.subtext}
                                </Typography>
                              )}
                            </Box>
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
                        </TableRow>
                      )
                    })}
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
                            Trạng thái thanh toán
                          </Typography>
                          <Chip
                            label={getPaymentStatusText(selectedPayment.paymentStatus)}
                            color={getPaymentStatusColor(selectedPayment.paymentStatus)}
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

                        {selectedPayment.paymentStatus === "refunded" && (
                          <>
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Số tiền hoàn trả
                              </Typography>
                              <Typography variant="h6" fontWeight="bold" color="error.main">
                                {formatCurrencyVND(selectedPayment.refundAmount || 0)}
                              </Typography>
                            </Box>
                            {selectedPayment.refundDate && (
                              <Box>
                                <Typography variant="body2" color="text.secondary">
                                  Ngày hoàn trả
                                </Typography>
                                <Typography variant="body1" fontWeight="medium">
                                  {formatDate(selectedPayment.refundDate)}
                                </Typography>
                              </Box>
                            )}
                          </>
                        )}
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
                          <Typography variant="body2" color="text.secondary">
                            {getRoleText(selectedPayment.user.role)}
                          </Typography>
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
                                        label={getPaymentStatusText(payment.paymentStatus)}
                                        color={getPaymentStatusColor(payment.paymentStatus)}
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
                              {formatCurrencyVND(
                                userPayments
                                  .filter((p) => p.paymentStatus !== "refunded")
                                  .reduce((sum, p) => sum + p.amount, 0),
                              )}
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
              {selectedPayment && canRefund(selectedPayment) && (
                <Button onClick={handleOpenRefundDialog} variant="outlined" color="error" startIcon={<RefundIcon />}>
                  Hoàn tiền
                </Button>
              )}
              <Button variant="contained" sx={{ minWidth: 100 }}>
                In hóa đơn
              </Button>
            </DialogActions>
          </Box>
        </Fade>
      </Modal>

      {/* Refund Dialog */}
      <Dialog open={refundDialogOpen} onClose={handleCloseRefundDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <RefundIcon color="error" />
            <Typography variant="h6" fontWeight="bold">
              Xác nhận hoàn tiền
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedPayment && (
            <Stack spacing={3}>
              <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Thông tin khách hàng
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  <Avatar src={selectedPayment.user.avatar}>{selectedPayment.user.fullName.charAt(0)}</Avatar>
                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      {selectedPayment.user.fullName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedPayment.user.phone} • {selectedPayment.user.email || "Không có email"}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Mô tả giao dịch
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {selectedPayment.description}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Số tiền gốc
                </Typography>
                <Typography variant="h5" fontWeight="bold" color="success.main">
                  {formatCurrencyVND(selectedPayment.amount)}
                </Typography>
              </Box>

              <TextField
                fullWidth
                label="Số tiền hoàn trả"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                type="number"
                InputProps={{
                  endAdornment: "VND",
                }}
                helperText="Nhập số tiền cần hoàn trả"
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleCloseRefundDialog} variant="outlined">
            Hủy
          </Button>
          <Button
            onClick={handleProcessRefund}
            variant="contained"
            color="error"
            disabled={!refundAmount || parseFloat(refundAmount) <= 0}
          >
            Xác nhận hoàn tiền
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
