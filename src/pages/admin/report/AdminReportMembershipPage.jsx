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
  Stack,
  Skeleton,
  CircularProgress,
} from "@mui/material"
import {
  CardMembership,
  TrendingUp,
  AttachMoney,
  CalendarToday,
  Refresh,
  Analytics,
  BarChart as BarChartIcon,
  ShowChart,
  PersonOff,
} from "@mui/icons-material"
import { LineChart, BarChart } from "@mui/x-charts"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import dayjs from "dayjs"
import { getMembershipOverviewAPI, getMembershipAnalyticsAPI, formatAnalyticsParams } from "~/apis/membership"

function AdminReportMembershipPage() {
  // State for data
  const [overviewData, setOverviewData] = useState(null)
  console.log("🚀 ~ AdminReportMembershipPage ~ overviewData:", overviewData)
  const [chartsData, setChartsData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [chartsLoading, setChartsLoading] = useState(false)
  const [error, setError] = useState(null)

  // State for filters
  const [startDate, setStartDate] = useState(dayjs().subtract(6, "month"))
  const [endDate, setEndDate] = useState(dayjs())
  const [timeRange, setTimeRange] = useState("6months")
  const [groupBy, setGroupBy] = useState("month")

  // Quick time range options
  const timeRangeOptions = [
    { value: "today", label: "Hôm nay", days: 1, groupBy: "day" },
    { value: "7days", label: "7 ngày qua", days: 7, groupBy: "day" },
    { value: "30days", label: "30 ngày qua", days: 30, groupBy: "day" },
    { value: "3months", label: "3 tháng qua", days: 90, groupBy: "week" },
    { value: "6months", label: "6 tháng qua", days: 180, groupBy: "month" },
    { value: "custom", label: "Tùy chỉnh", days: 0, groupBy: "month" },
  ]

  // Initialize data
  useEffect(() => {
    loadOverviewData()
  }, [])

  useEffect(() => {
    loadChartsData()
  }, [startDate, endDate, groupBy])

  const loadOverviewData = async () => {
    try {
      setLoading(true)
      setError(null)

      const result = await getMembershipOverviewAPI({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      })

      if (result.success) {
        setOverviewData(result.data)
      } else {
        setError(result.message || "Không thể tải dữ liệu tổng quan")
      }
    } catch (err) {
      console.error("Error loading overview data:", err)
      setError("Không thể tải dữ liệu tổng quan")
    } finally {
      setLoading(false)
    }
  }

  const loadChartsData = async () => {
    try {
      setChartsLoading(true)

      const params = formatAnalyticsParams({
        timeRange: "custom",
        startDate: startDate.toDate(),
        endDate: endDate.toDate(),
        groupBy,
      })

      const result = await getMembershipAnalyticsAPI(params)

      if (result.success) {
        setChartsData(result.data.charts)
      } else {
        setError(result.message || "Không thể tải dữ liệu biểu đồ")
      }
    } catch (err) {
      console.error("Error loading charts data:", err)
      setError("Không thể tải dữ liệu biểu đồ")
    } finally {
      setChartsLoading(false)
    }
  }

  const handleTimeRangeChange = (range) => {
    setTimeRange(range)
    if (range !== "custom") {
      const option = timeRangeOptions.find((opt) => opt.value === range)
      const newEndDate = dayjs()
      const newStartDate = range === "today" ? dayjs().startOf("day") : newEndDate.subtract(option.days - 1, "day")

      setEndDate(newEndDate)
      setStartDate(newStartDate)
      setGroupBy(option.groupBy)
    }
  }

  const handleApplyFilters = () => {
    loadOverviewData()
    loadChartsData()
  }

  const handleRefresh = () => {
    loadOverviewData()
    loadChartsData()
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

  const formatPercentage = (num) => {
    return `${(num || 0).toFixed(1)}%`
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
                <CardMembership sx={{ color: "white", fontSize: 32 }} />
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "white" }}>
                  Thống Kê Membership
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
              value={overviewData?.totalRevenue ? formatCurrency(overviewData.totalRevenue) : "N/A"}
              subtitle="Từ membership"
              icon={<AttachMoney />}
              color="#1976d2"
              loading={loading}
            />
          </Grid>
          <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
            <OverviewCard
              title="Gói Membership Có Sẵn"
              value={overviewData?.totalMembershipPackages ? formatNumber(overviewData.totalMembershipPackages) : "N/A"}
              subtitle="Số gói membership"
              icon={<CardMembership />}
              color="#2e7d32"
              loading={loading}
            />
          </Grid>
          <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
            <OverviewCard
              title="Người Có Gói Tập"
              value={
                overviewData?.totalActiveSubscriptions ? formatNumber(overviewData.totalActiveSubscriptions) : "N/A"
              }
              subtitle="Active subscriptions"
              icon={<TrendingUp />}
              color="#ed6c02"
              loading={loading}
            />
          </Grid>
          <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
            <OverviewCard
              title="Người Không Có Gói Tập"
              value={
                overviewData?.inactiveUsersCount !== undefined ? formatNumber(overviewData.inactiveUsersCount) : "N/A"
              }
              subtitle="Users không có subscription"
              icon={<PersonOff />}
              color="#9c27b0"
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
          {/* Revenue Chart */}
          <Grid item size={{ xs: 12, md: 6 }}>
            <ChartCard
              title="Doanh Thu Membership Theo Thời Gian"
              icon={<BarChartIcon sx={{ color: "#1976d2" }} />}
              loading={chartsLoading}
            >
              {chartsData?.revenue && (
                <BarChart
                  width={500}
                  height={300}
                  series={[
                    {
                      data: chartsData.revenue.map((item) => item.revenue),
                      label: "Doanh thu (VND)",
                      color: "#1976d2",
                    },
                  ]}
                  xAxis={[
                    {
                      scaleType: "band",
                      data: chartsData.revenue.map((item) => item.period),
                    },
                  ]}
                  yAxis={[
                    {
                      label: "Doanh thu (VND)",
                      valueFormatter: (value) => formatCurrency(value),
                    },
                  ]}
                />
              )}
            </ChartCard>
          </Grid>

          {/* Trends Chart */}
          <Grid item size={{ xs: 12, md: 6 }}>
            <ChartCard
              title="Xu Hướng Đăng Ký Membership"
              icon={<ShowChart sx={{ color: "#2e7d32" }} />}
              loading={chartsLoading}
            >
              {chartsData?.trends && (
                <LineChart
                  width={500}
                  height={300}
                  series={[
                    {
                      data: chartsData.trends.map((item) => item.newSubscriptions),
                      label: "Đăng ký mới",
                      color: "#2e7d32",
                      curve: "smooth",
                    },
                    {
                      data: chartsData.trends.map((item) => item.expiredSubscriptions),
                      label: "Hết hạn",
                      color: "#d32f2f",
                      curve: "smooth",
                    },
                  ]}
                  xAxis={[
                    {
                      scaleType: "point",
                      data: chartsData.trends.map((item) => item.period),
                    },
                  ]}
                  yAxis={[{ label: "Số lượng" }]}
                />
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

export default AdminReportMembershipPage
