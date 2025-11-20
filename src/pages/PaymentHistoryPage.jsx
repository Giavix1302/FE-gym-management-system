import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Grid,
  TextField,
  MenuItem,
  TablePagination,
  TableSortLabel,
  IconButton,
  Collapse,
  useTheme,
  useMediaQuery,
  Stack,
  Divider,
  Container,
} from "@mui/material"
import {
  TrendingUp,
  Payment,
  DateRange,
  AccountBalanceWallet,
  KeyboardArrowDown,
  KeyboardArrowUp,
  FilterList,
} from "@mui/icons-material"
import { useEffect, useState } from "react"
import { getPaymentsByUserIdAPI } from "~/apis/payment"
import useUserStore from "~/stores/useUserStore"

// Utility functions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(amount)
}

const formatDate = (dateString) => {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString))
}

const getPaymentTypeLabel = (type) => {
  const types = {
    booking: "Đặt lịch",
    membership: "Gói tập",
  }
  return types[type] || type
}

const getPaymentMethodLabel = (method) => {
  const methods = {
    vnpay: "VNPay",
    momo: "MoMo",
    cash: "Tiền mặt",
  }
  return methods[method] || method
}

// Statistics Card Component
function StatCard({ title, value, icon: Icon, color, trend }) {
  const theme = useTheme()

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h6" fontWeight="bold" color={color}>
              {value}
            </Typography>
            {trend && (
              <Typography
                variant="caption"
                color="success.main"
                sx={{ display: "flex", alignItems: "center", mt: 0.5 }}
              >
                <TrendingUp sx={{ fontSize: 14, mr: 0.5 }} />
                {trend}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              backgroundColor: `${color}15`,
              borderRadius: 2,
              p: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon sx={{ color, fontSize: 24 }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

// Mobile Payment Row Component
function MobilePaymentRow({ payment, isExpanded, onToggle }) {
  const theme = useTheme()

  return (
    <Card sx={{ mb: 1 }}>
      <CardContent sx={{ pb: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box flex={1}>
            <Typography variant="body2" fontWeight="medium" noWrap>
              {payment.description}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
              <Chip
                label={getPaymentTypeLabel(payment.paymentType)}
                size="small"
                color={payment.paymentType === "membership" ? "primary" : "secondary"}
                variant="outlined"
              />
              <Typography variant="caption" color="text.secondary">
                {formatDate(payment.paymentDate)}
              </Typography>
            </Stack>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body1" fontWeight="bold" color="primary">
              {formatCurrency(payment.amount)}
            </Typography>
            <IconButton size="small" onClick={onToggle}>
              {isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          </Box>
        </Box>

        <Collapse in={isExpanded}>
          <Divider sx={{ my: 1 }} />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">
                Phương thức thanh toán
              </Typography>
              <Typography variant="body2">{getPaymentMethodLabel(payment.paymentMethod)}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">
                Mã tham chiếu
              </Typography>
              <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
                {payment.referenceId}
              </Typography>
            </Grid>
          </Grid>
        </Collapse>
      </CardContent>
    </Card>
  )
}

function PaymentHistoryPage() {
  const { user } = useUserStore()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  // State
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({})
  const [expandedRows, setExpandedRows] = useState({})

  // Filter & Sort states
  const [filters, setFilters] = useState({
    paymentType: "all",
    paymentMethod: "all",
    sortBy: "paymentDate",
    sortOrder: "desc",
  })

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // Fetch data
  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true)
      try {
        const result = await getPaymentsByUserIdAPI(user._id)
        if (result.success) {
          setPayments(result.payments)
          setPagination(result.pagination)
        }
      } catch (error) {
        console.error("Error fetching payments:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user._id) {
      fetchPayments()
    }
  }, [user._id])

  // Calculate statistics
  const statistics = {
    totalAmount: payments.reduce((sum, payment) => sum + payment.amount, 0),
    totalPayments: payments.length,
    bookingPayments: payments.filter((p) => p.paymentType === "booking").length,
    membershipPayments: payments.filter((p) => p.paymentType === "membership").length,
    avgAmount: payments.length > 0 ? payments.reduce((sum, payment) => sum + payment.amount, 0) / payments.length : 0,
  }

  // Filter and sort payments
  const filteredAndSortedPayments = payments
    .filter((payment) => {
      if (filters.paymentType !== "all" && payment.paymentType !== filters.paymentType) return false
      if (filters.paymentMethod !== "all" && payment.paymentMethod !== filters.paymentMethod) return false
      return true
    })
    .sort((a, b) => {
      let aValue = a[filters.sortBy]
      let bValue = b[filters.sortBy]

      if (filters.sortBy === "paymentDate") {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      }

      if (filters.sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  // Pagination
  const paginatedPayments = filteredAndSortedPayments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
    setPage(0)
  }

  const handleSort = (field) => {
    const isAsc = filters.sortBy === field && filters.sortOrder === "asc"
    setFilters((prev) => ({
      ...prev,
      sortBy: field,
      sortOrder: isAsc ? "desc" : "asc",
    }))
  }

  const handleRowToggle = (paymentId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [paymentId]: !prev[paymentId],
    }))
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  return (
    <Container sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box mb={3}>
        <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
          Lịch sử thanh toán
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Xem chi tiết các giao dịch thanh toán của bạn
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={2} mb={3}>
        <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Tổng chi tiêu"
            value={formatCurrency(statistics.totalAmount)}
            icon={AccountBalanceWallet}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Tổng giao dịch"
            value={statistics.totalPayments}
            icon={Payment}
            color={theme.palette.secondary.main}
          />
        </Grid>
        <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Đặt lịch"
            value={statistics.bookingPayments}
            icon={DateRange}
            color={theme.palette.info.main}
          />
        </Grid>
        <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Gói tập"
            value={statistics.membershipPayments}
            icon={TrendingUp}
            color={theme.palette.warning.main}
          />
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <FilterList color="action" />
            <Typography variant="h6" fontWeight="medium">
              Bộ lọc
            </Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                select
                fullWidth
                size="small"
                label="Loại thanh toán"
                value={filters.paymentType}
                onChange={(e) => handleFilterChange("paymentType", e.target.value)}
              >
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="booking">Đặt lịch</MenuItem>
                <MenuItem value="membership">Gói tập</MenuItem>
              </TextField>
            </Grid>

            <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                select
                fullWidth
                size="small"
                label="Phương thức"
                value={filters.paymentMethod}
                onChange={(e) => handleFilterChange("paymentMethod", e.target.value)}
              >
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="vnpay">VNPay</MenuItem>
                <MenuItem value="momo">MoMo</MenuItem>
                <MenuItem value="cash">Tiền mặt</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Payment Table/List */}
      {isMobile ? (
        // Mobile View - Card List
        <Box>
          {paginatedPayments.map((payment) => (
            <MobilePaymentRow
              key={payment._id}
              payment={payment}
              isExpanded={expandedRows[payment._id]}
              onToggle={() => handleRowToggle(payment._id)}
            />
          ))}
        </Box>
      ) : (
        // Desktop View - Table
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={filters.sortBy === "paymentDate"}
                    direction={filters.sortBy === "paymentDate" ? filters.sortOrder : "asc"}
                    onClick={() => handleSort("paymentDate")}
                  >
                    Ngày thanh toán
                  </TableSortLabel>
                </TableCell>
                <TableCell>Mô tả</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={filters.sortBy === "paymentType"}
                    direction={filters.sortBy === "paymentType" ? filters.sortOrder : "asc"}
                    onClick={() => handleSort("paymentType")}
                  >
                    Loại
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={filters.sortBy === "amount"}
                    direction={filters.sortBy === "amount" ? filters.sortOrder : "asc"}
                    onClick={() => handleSort("amount")}
                  >
                    Số tiền
                  </TableSortLabel>
                </TableCell>
                <TableCell>Phương thức</TableCell>
                <TableCell>Mã tham chiếu</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedPayments.map((payment) => (
                <TableRow key={payment._id} hover>
                  <TableCell>
                    <Typography variant="body2">{formatDate(payment.paymentDate)}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ maxWidth: 300 }} noWrap>
                      {payment.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getPaymentTypeLabel(payment.paymentType)}
                      size="small"
                      color={payment.paymentType === "membership" ? "primary" : "secondary"}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" fontWeight="medium" color="primary">
                      {formatCurrency(payment.amount)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{getPaymentMethodLabel(payment.paymentMethod)}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                      {payment.referenceId}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Pagination */}
      <Box display="flex" justifyContent="center" mt={3}>
        <TablePagination
          component="div"
          count={filteredAndSortedPayments.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          labelRowsPerPage="Số dòng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) => `${from}–${to} của ${count !== -1 ? count : `hơn ${to}`}`}
        />
      </Box>
    </Container>
  )
}

export default PaymentHistoryPage
