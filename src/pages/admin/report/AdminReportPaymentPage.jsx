import React, { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Alert,
  Avatar,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Skeleton,
  CircularProgress,
} from "@mui/material"
import {
  AttachMoney,
  CheckCircle,
  ShowChart,
  MoneyOff,
  CalendarToday,
  TrendingUp,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  AccountBalance,
  Analytics,
  Refresh,
} from "@mui/icons-material"
import { LineChart, BarChart, PieChart } from "@mui/x-charts"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import dayjs from "dayjs"
import { getAllPaymentStatisticsAPI } from "~/apis/payment"

function AdminReportPaymentPage() {
  // State for data
  const [overviewData, setOverviewData] = useState(null)
  const [chartsData, setChartsData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [chartsLoading, setChartsLoading] = useState(false)
  const [error, setError] = useState(null)

  // State for filters
  const [startDate, setStartDate] = useState(dayjs().subtract(6, "month"))
  const [endDate, setEndDate] = useState(dayjs())
  const [timeRange, setTimeRange] = useState("6months")
  const [groupBy, setGroupBy] = useState("day")

  // Quick time range options
  const timeRangeOptions = [
    { value: "7days", label: "7 ngày qua", days: 7, groupBy: "day" },
    { value: "1month", label: "1 tháng qua", days: 30, groupBy: "day" },
    { value: "3months", label: "3 tháng qua", days: 90, groupBy: "week" },
    { value: "6months", label: "6 tháng qua", days: 180, groupBy: "day" },
    { value: "1year", label: "1 năm qua", days: 365, groupBy: "month" },
    { value: "custom", label: "Tùy chỉnh", days: 0, groupBy: "day" },
  ]

  // Initialize data
  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    try {
      setLoading(true)
      setChartsLoading(true)

      const params = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        groupBy: groupBy,
      }

      const result = await getAllPaymentStatisticsAPI(params)

      if (result.success) {
        setOverviewData(result.data.overview)
        setChartsData(result.data.charts)
      } else {
        setError(result.message || "Không thể tải dữ liệu")
      }
    } catch (err) {
      console.error("Error loading payment statistics:", err)
      setError("Không thể tải dữ liệu thống kê thanh toán")
    } finally {
      setLoading(false)
      setChartsLoading(false)
    }
  }

  const handleTimeRangeChange = (range) => {
    setTimeRange(range)
    if (range !== "custom") {
      const option = timeRangeOptions.find((opt) => opt.value === range)
      const newEndDate = dayjs()
      const newStartDate = newEndDate.subtract(option.days, "day")

      setEndDate(newEndDate)
      setStartDate(newStartDate)
      setGroupBy(option.groupBy)
    }
  }

  const handleRefresh = () => {
    loadAllData()
  }

  const handleApplyFilters = () => {
    loadAllData()
  }

  // Format functions
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0)
  }

  const formatNumber = (num) => {
    return new Intl.NumberFormat("vi-VN").format(num || 0)
  }

  // Overview Card Component
  const OverviewCard = ({ title, value, icon, color, subtitle, loading }) => (
    <Card
      sx={{
        height: "100%",
        background: `linear-gradient(135deg, ${color}15, ${color}05)`,
        border: `1px solid ${color}20`,
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: `0 8px 25px ${color}25`,
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body2"
              color="textSecondary"
              gutterBottom
              sx={{ fontSize: "0.875rem", fontWeight: 500 }}
            >
              {title}
            </Typography>
            {loading ? (
              <Skeleton variant="text" width="80%" height={32} />
            ) : (
              <Typography variant="h4" sx={{ fontWeight: "bold", color: color, mb: 0.5 }}>
                {value}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="caption" color="textSecondary" sx={{ fontSize: "0.75rem" }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Avatar
            sx={{
              bgcolor: color,
              width: 56,
              height: 56,
              boxShadow: `0 4px 20px ${color}30`,
            }}
          >
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  )

  // Chart Card Component
  const ChartCard = ({ title, icon, children, loading = false }) => (
    <Card
      sx={{
        height: "100%",
        transition: "transform 0.2s",
        "&:hover": {
          transform: "translateY(-1px)",
          boxShadow: 3,
        },
      }}
    >
      <CardContent sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          {icon}
          <Typography variant="h6" sx={{ fontWeight: "bold", ml: 1 }}>
            {title}
          </Typography>
        </Box>
        {loading ? (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 300,
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ flex: 1, minHeight: 300 }}>{children}</Box>
        )}
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="rectangular" width="100%" height={60} sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          {[...Array(4)].map((_, i) => (
            <Grid item size={{ xs: 12, sm: 6, md: 3 }} key={i}>
              <Skeleton variant="rectangular" height={120} />
            </Grid>
          ))}
        </Grid>
      </Box>
    )
  }

  if (error && !overviewData) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={handleRefresh} startIcon={<Refresh />}>
          Thử lại
        </Button>
      </Box>
    )
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 1, minHeight: "100vh" }}>
        {/* Header */}
        <Card sx={{ mb: 1, background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)" }}>
          <CardContent sx={{ "&:last-child": { pb: 2 } }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Analytics sx={{ color: "white", fontSize: 32 }} />
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "white" }}>
                  Thống Kê Thanh Toán
                </Typography>
              </Box>
              <Button
                variant="contained"
                onClick={handleRefresh}
                startIcon={<Refresh />}
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
                }}
              >
                Làm mới
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Overview Cards */}
        <Grid container spacing={1} sx={{ mb: 1 }}>
          <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
            <OverviewCard
              title="Tổng Doanh Thu"
              value={formatCurrency(overviewData?.totalRevenue)}
              icon={<AttachMoney />}
              color="#1976d2"
              subtitle={`${formatNumber(overviewData?.totalTransactions)} giao dịch`}
              loading={loading}
            />
          </Grid>

          <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
            <OverviewCard
              title="Giao Dịch Thành Công"
              value={formatNumber(overviewData?.successfulTransactions)}
              icon={<CheckCircle />}
              color="#2e7d32"
              subtitle="Đã thanh toán"
              loading={loading}
            />
          </Grid>

          <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
            <OverviewCard
              title="Doanh Thu Trung Bình"
              value={formatCurrency(overviewData?.averageTransactionAmount)}
              icon={<ShowChart />}
              color="#ed6c02"
              subtitle="Mỗi giao dịch"
              loading={loading}
            />
          </Grid>

          <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
            <OverviewCard
              title="Tổng Hoàn Trả"
              value={formatCurrency(overviewData?.totalRefunded)}
              icon={<MoneyOff />}
              color="#9c27b0"
              subtitle={`${formatNumber(overviewData?.refundedTransactions)} giao dịch`}
              loading={loading}
            />
          </Grid>
        </Grid>

        {/* Filters */}
        <Paper sx={{ p: 3, mb: 1 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", display: "flex", alignItems: "center" }}>
            <CalendarToday sx={{ mr: 1 }} />
            Bộ Lọc Thời Gian
          </Typography>

          <Grid container spacing={1} alignItems="center">
            <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Khoảng thời gian</InputLabel>
                <Select
                  value={timeRange}
                  onChange={(e) => handleTimeRangeChange(e.target.value)}
                  label="Khoảng thời gian"
                >
                  {timeRangeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {timeRange === "custom" && (
              <>
                <Grid item size={{ xs: 12, sm: 6, md: 2 }}>
                  <DatePicker
                    label="Ngày bắt đầu"
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
                <Grid item size={{ xs: 12, sm: 6, md: 2 }}>
                  <DatePicker
                    label="Ngày kết thúc"
                    value={endDate}
                    onChange={(newValue) => setEndDate(newValue)}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
              </>
            )}

            <Grid item size={{ xs: 12, sm: 6, md: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Nhóm thời gian</InputLabel>
                <Select value={groupBy} onChange={(e) => setGroupBy(e.target.value)} label="Nhóm thời gian">
                  <MenuItem value="day">Ngày</MenuItem>
                  <MenuItem value="week">Tuần</MenuItem>
                  <MenuItem value="month">Tháng</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item size={{ xs: 12, sm: 6, md: 1 }}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleApplyFilters}
                disabled={chartsLoading}
                sx={{ height: 56 }}
              >
                Áp dụng
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Charts */}
        <Grid container spacing={1}>
          {/* Chart 1: Revenue by Payment Type */}
          <Grid item size={{ xs: 12, md: 6 }}>
            <ChartCard
              title="Doanh Thu Theo Loại Thanh Toán"
              icon={<BarChartIcon sx={{ color: "#1976d2" }} />}
              loading={chartsLoading}
            >
              {chartsData?.revenueByType?.length > 0 ? (
                <BarChart
                  width={500}
                  height={300}
                  series={[
                    {
                      data: chartsData.revenueByType.map((item) => item.totalRevenue / 1000000),
                      label: "Doanh thu (triệu VND)",
                      color: "#1976d2",
                    },
                  ]}
                  xAxis={[
                    {
                      scaleType: "band",
                      data: chartsData.revenueByType.map((item) => item.paymentTypeName),
                    },
                  ]}
                  yAxis={[{ label: "Triệu VND" }]}
                />
              ) : (
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300 }}>
                  <Typography color="textSecondary">Không có dữ liệu</Typography>
                </Box>
              )}
            </ChartCard>
          </Grid>

          {/* Chart 2: Revenue Trend */}
          <Grid item size={{ xs: 12, md: 6 }}>
            <ChartCard
              title="Xu Hướng Doanh Thu Theo Thời Gian"
              icon={<TrendingUp sx={{ color: "#2e7d32" }} />}
              loading={chartsLoading}
            >
              {chartsData?.revenueTrend?.length > 0 ? (
                <LineChart
                  width={500}
                  height={300}
                  series={[
                    {
                      data: chartsData.revenueTrend.map((item) => item.totalRevenue / 1000000),
                      label: "Doanh thu (triệu VND)",
                      color: "#2e7d32",
                      curve: "smooth",
                    },
                  ]}
                  xAxis={[
                    {
                      scaleType: "point",
                      data: chartsData.revenueTrend.map((item) => item.label),
                    },
                  ]}
                  yAxis={[{ label: "Triệu VND" }]}
                />
              ) : (
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300 }}>
                  <Typography color="textSecondary">Không có dữ liệu</Typography>
                </Box>
              )}
            </ChartCard>
          </Grid>

          {/* Chart 3: Payment Method Distribution */}
          <Grid item size={{ xs: 12, md: 6 }}>
            <ChartCard
              title="Phân Bố Phương Thức Thanh Toán"
              icon={<PieChartIcon sx={{ color: "#ed6c02" }} />}
              loading={chartsLoading}
            >
              {chartsData?.methodDistribution?.length > 0 ? (
                <PieChart
                  series={[
                    {
                      data: chartsData.methodDistribution.map((item, index) => ({
                        id: index,
                        value: item.totalAmount / 1000000,
                        label: item.paymentMethodName,
                      })),
                      highlightScope: { faded: "global", highlighted: "item" },
                      faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
                    },
                  ]}
                  width={500}
                  height={300}
                />
              ) : (
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300 }}>
                  <Typography color="textSecondary">Không có dữ liệu</Typography>
                </Box>
              )}
            </ChartCard>
          </Grid>

          {/* Chart 4: Payment Status Over Time */}
          <Grid item size={{ xs: 12, md: 6 }}>
            <ChartCard
              title="Trạng Thái Thanh Toán Theo Thời Gian"
              icon={<AccountBalance sx={{ color: "#9c27b0" }} />}
              loading={chartsLoading}
            >
              {chartsData?.statusOverTime?.length > 0 ? (
                <BarChart
                  width={500}
                  height={300}
                  series={[
                    {
                      data: chartsData.statusOverTime.map((item) => item.paid),
                      label: "Đã thanh toán",
                      color: "#2e7d32",
                      stack: "total",
                    },
                    {
                      data: chartsData.statusOverTime.map((item) => item.unpaid),
                      label: "Chưa thanh toán",
                      color: "#9e9e9e",
                      stack: "total",
                    },
                    {
                      data: chartsData.statusOverTime.map((item) => item.refunded),
                      label: "Đã hoàn trả",
                      color: "#ed6c02",
                      stack: "total",
                    },
                  ]}
                  xAxis={[
                    {
                      scaleType: "band",
                      data: chartsData.statusOverTime.map((item) => item.label),
                    },
                  ]}
                  yAxis={[{ label: "Số lượng giao dịch" }]}
                />
              ) : (
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300 }}>
                  <Typography color="textSecondary">Không có dữ liệu</Typography>
                </Box>
              )}
            </ChartCard>
          </Grid>
        </Grid>

        {/* Error Alert */}
        {error && (
          <Alert severity="warning" sx={{ mt: 3 }}>
            {error}
          </Alert>
        )}
      </Box>
    </LocalizationProvider>
  )
}

export default AdminReportPaymentPage
