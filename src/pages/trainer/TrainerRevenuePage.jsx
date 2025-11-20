import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  useTheme,
  useMediaQuery,
  Container,
} from "@mui/material"
import { useEffect, useState } from "react"
import { LineChart } from "@mui/x-charts/LineChart"
import { getListBookingByTrainerIdAPI } from "~/apis/trainer"
import useUserStore from "~/stores/useUserStore"

function TrainerRevenuePage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const { user } = useUserStore()

  // States
  const [bookings, setBookings] = useState([])
  const [filteredBookings, setFilteredBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({})

  // Filter states
  const [timeFilter, setTimeFilter] = useState("30")
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("")
  const [chartTimeRange, setChartTimeRange] = useState("week") // day, week, month

  // Table pagination states
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // Get unique locations for filter
  const uniqueLocations = [...new Set(bookings.map((booking) => booking.locationName))]

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  // Format date
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("vi-VN")
  }

  // Filter bookings based on time filter
  const filterBookingsByTime = (bookings, days) => {
    if (!days) return bookings
    const now = Date.now()
    const timeLimit = now - parseInt(days) * 24 * 60 * 60 * 1000
    return bookings.filter((booking) => booking.createAt >= timeLimit)
  }

  // Apply all filters
  useEffect(() => {
    let filtered = bookings

    // Time filter
    if (timeFilter) {
      filtered = filterBookingsByTime(filtered, timeFilter)
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((booking) => booking.userName.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    // Location filter
    if (locationFilter) {
      filtered = filtered.filter((booking) => booking.locationName === locationFilter)
    }

    setFilteredBookings(filtered)
    setPage(0) // Reset to first page when filters change
  }, [bookings, timeFilter, searchTerm, locationFilter])

  // Calculate statistics
  const calculateStats = () => {
    const totalRevenue = filteredBookings.reduce((sum, booking) => sum + booking.price, 0)
    const totalBookings = filteredBookings.length
    const uniqueCustomers = new Set(filteredBookings.map((booking) => booking.userName)).size
    const averageRevenuePerBooking = totalBookings > 0 ? totalRevenue / totalBookings : 0

    return {
      totalRevenue,
      totalBookings,
      uniqueCustomers,
      averageRevenuePerBooking,
    }
  }

  // Prepare chart data for MUI X Charts
  const prepareChartData = () => {
    if (filteredBookings.length === 0) return { xAxis: [], series: [] }

    const groupedData = {}

    filteredBookings.forEach((booking) => {
      const date = new Date(booking.createAt)
      let key

      switch (chartTimeRange) {
        case "day":
          key = date.toLocaleDateString("vi-VN")
          break
        case "week":
          const weekStart = new Date(date)
          weekStart.setDate(date.getDate() - date.getDay())
          key = `Tuần ${weekStart.toLocaleDateString("vi-VN")}`
          break
        case "month":
          key = `${date.getMonth() + 1}/${date.getFullYear()}`
          break
        default:
          key = date.toLocaleDateString("vi-VN")
      }

      if (!groupedData[key]) {
        groupedData[key] = 0
      }
      groupedData[key] += booking.price
    })

    const sortedEntries = Object.entries(groupedData).sort(([a], [b]) => new Date(a) - new Date(b))

    return {
      xAxis: sortedEntries.map(([date]) => date),
      series: sortedEntries.map(([, revenue]) => revenue),
    }
  }

  // Load data
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true)
        const result = await getListBookingByTrainerIdAPI(user._id)
        if (result.success) {
          setBookings(result.data)
          setPagination(result.pagination)
        }
      } catch (error) {
        console.error("Error loading bookings:", error)
      } finally {
        setLoading(false)
      }
    }
    if (user?._id) {
      init()
    }
  }, [user])

  const stats = calculateStats()
  const chartData = prepareChartData()

  // Handle table pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // Get current page data
  const currentPageData = filteredBookings.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  return (
    <Container sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Typography variant="h4" fontWeight="bold" mb={3} color="primary.main">
        Doanh Thu Của Tôi
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item size={{ xs: 6, md: 3 }}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Tổng Doanh Thu
              </Typography>
              <Typography variant="h6" color="primary.main" fontWeight="bold">
                {formatCurrency(stats.totalRevenue)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item size={{ xs: 6, md: 3 }}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Số Booking
              </Typography>
              <Typography variant="h6" color="secondary.main" fontWeight="bold">
                {stats.totalBookings}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item size={{ xs: 6, md: 3 }}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Khách Hàng
              </Typography>
              <Typography variant="h6" color="info.main" fontWeight="bold">
                {stats.uniqueCustomers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item size={{ xs: 6, md: 3 }}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                TB/Booking
              </Typography>
              <Typography variant="h6" color="warning.main" fontWeight="bold">
                {formatCurrency(stats.averageRevenuePerBooking)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Chart Section */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
          flexDirection={{ xs: "column", sm: "row" }}
          gap={2}
        >
          <Typography variant="h6" fontWeight="bold">
            Biểu Đồ Doanh Thu
          </Typography>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Thời gian</InputLabel>
            <Select value={chartTimeRange} label="Thời gian" onChange={(e) => setChartTimeRange(e.target.value)}>
              <MenuItem value="day">Theo ngày</MenuItem>
              <MenuItem value="week">Theo tuần</MenuItem>
              <MenuItem value="month">Theo tháng</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box height={{ xs: 250, md: 400 }}>
          {chartData.xAxis.length > 0 ? (
            <LineChart
              xAxis={[
                {
                  id: "time",
                  data: chartData.xAxis,
                  scaleType: "point",
                  valueFormatter: (value) => value,
                },
              ]}
              series={[
                {
                  id: "revenue",
                  data: chartData.series,
                  color: theme.palette.primary.main,
                  curve: "linear",
                  valueFormatter: (value) => formatCurrency(value),
                },
              ]}
              width={undefined}
              height={undefined}
              margin={{
                left: isMobile ? 80 : 40,
                right: 10,
                top: 10,
                bottom: isMobile ? 80 : 40,
              }}
              grid={{ horizontal: true, vertical: true }}
              sx={{
                "& .MuiLineElement-root": {
                  strokeWidth: 3,
                },
                "& .MuiMarkElement-root": {
                  strokeWidth: 2,
                  r: 4,
                },
                "& .MuiChartsAxis-tick": {
                  fontSize: 12,
                },
                "& .MuiChartsAxis-tickLabel": {
                  fontSize: 12,
                },
              }}
              slotProps={{
                legend: { hidden: true },
                axisContent: {
                  sx: {
                    "& .MuiChartsTooltip-table": {
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                    },
                  },
                },
              }}
            />
          ) : (
            <Box display="flex" alignItems="center" justifyContent="center" height="100%">
              <Typography color="text.secondary">Không có dữ liệu để hiển thị biểu đồ</Typography>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Filters Section */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight="bold" mb={3}>
          Bộ Lọc
        </Typography>
        <Grid container spacing={2}>
          <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Khoảng thời gian</InputLabel>
              <Select value={timeFilter} label="Khoảng thời gian" onChange={(e) => setTimeFilter(e.target.value)}>
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="7">7 ngày qua</MenuItem>
                <MenuItem value="30">30 ngày qua</MenuItem>
                <MenuItem value="90">90 ngày qua</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              fullWidth
              size="small"
              label="Tìm theo tên khách hàng"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nhập tên khách hàng..."
            />
          </Grid>
          <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Địa điểm</InputLabel>
              <Select value={locationFilter} label="Địa điểm" onChange={(e) => setLocationFilter(e.target.value)}>
                <MenuItem value="">Tất cả địa điểm</MenuItem>
                {uniqueLocations.map((location) => (
                  <MenuItem key={location} value={location}>
                    {location}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
            <Box display="flex" alignItems="center" height="100%">
              <Chip label={`${filteredBookings.length} kết quả`} color="primary" variant="outlined" />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Data Table */}
      <Paper elevation={2}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>STT</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Tiêu đề</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Khách hàng</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Địa điểm</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Giá tiền</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Ngày tạo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography>Đang tải dữ liệu...</Typography>
                  </TableCell>
                </TableRow>
              ) : currentPageData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">Không có dữ liệu</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                currentPageData.map((booking, index) => (
                  <TableRow key={booking._id} hover>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell sx={{ maxWidth: isMobile ? 150 : 300 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {booking.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{booking.userName}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          maxWidth: isMobile ? 100 : 200,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {booking.locationName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold" color="primary.main">
                        {formatCurrency(booking.price)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{formatDate(booking.createAt)}</Typography>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filteredBookings.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 20, 50]}
          labelRowsPerPage="Số dòng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} trong tổng số ${count !== -1 ? count : `hơn ${to}`}`
          }
        />
      </Paper>
    </Container>
  )
}

export default TrainerRevenuePage
