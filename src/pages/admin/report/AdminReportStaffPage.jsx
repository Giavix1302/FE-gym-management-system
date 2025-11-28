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
  People,
  PersonPin,
  AccessTime,
  AttachMoney,
  CalendarToday,
  Refresh,
  Analytics,
  BarChart as BarChartIcon,
  Timeline,
  EmojiEvents,
  Business,
  TrendingUp,
} from "@mui/icons-material"
import { LineChart, BarChart } from "@mui/x-charts"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import dayjs from "dayjs"
import {
  getStaffOverviewAPI,
  getWorkingHoursByStaffAPI,
  getCheckinTrendAPI,
  getTopWorkingStaffAPI,
  getSalaryCostByLocationAPI,
  formatDateRange,
  getDateRanges,
  validateStatisticsParams,
} from "~/apis/staff"

function AdminReportStaffPage() {
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
  const [checkinGroupBy, setCheckinGroupBy] = useState("day")

  // Quick time range options
  const timeRangeOptions = [
    { value: "7days", label: "7 ngày qua", days: 7, checkinGroupBy: "day" },
    { value: "1month", label: "1 tháng qua", days: 30, checkinGroupBy: "day" },
    { value: "3months", label: "3 tháng qua", days: 90, checkinGroupBy: "week" },
    { value: "6months", label: "6 tháng qua", days: 180, checkinGroupBy: "day" },
    { value: "1year", label: "1 năm qua", days: 365, checkinGroupBy: "month" },
    { value: "custom", label: "Tùy chỉnh", days: 0, checkinGroupBy: "day" },
  ]

  // Initialize data
  useEffect(() => {
    loadOverviewData()
  }, [])

  useEffect(() => {
    loadChartsData()
  }, [startDate, endDate, checkinGroupBy])

  const loadOverviewData = async () => {
    try {
      setLoading(true)

      const params = {
        ...formatDateRange(startDate.toDate(), endDate.toDate()),
      }

      // Validate params
      const validation = validateStatisticsParams(params)
      if (!validation.isValid) {
        console.error("Invalid parameters:", validation.errors)
        setError("Tham số không hợp lệ: " + validation.errors.join(", "))
        return
      }

      const result = await getStaffOverviewAPI(params)

      if (result.success) {
        setOverviewData(result.data)
      } else {
        setError(result.message)
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

      const params = {
        ...formatDateRange(startDate.toDate(), endDate.toDate()),
        groupBy: checkinGroupBy,
        limit: 10,
      }

      // Load all charts data
      const [workingHours, checkinTrend, topStaff, salaryCost] = await Promise.all([
        getWorkingHoursByStaffAPI(params),
        getCheckinTrendAPI(params),
        getTopWorkingStaffAPI(params),
        getSalaryCostByLocationAPI(params),
      ])

      setChartsData({
        workingHours: workingHours.success ? workingHours.data : [],
        checkinTrend: checkinTrend.success ? checkinTrend.data : [],
        topStaff: topStaff.success ? topStaff.data : [],
        salaryCost: salaryCost.success ? salaryCost.data : [],
      })
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
      const newStartDate = newEndDate.subtract(option.days, "day")

      setEndDate(newEndDate)
      setStartDate(newStartDate)
      setCheckinGroupBy(option.checkinGroupBy)
    }
  }

  const handleRefresh = () => {
    loadOverviewData()
    loadChartsData()
  }

  const handleApplyFilters = () => {
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

  const formatHours = (hours) => {
    return `${formatNumber(hours)} giờ`
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
                  Thống Kê Nhân Viên
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
              title="Tổng Số Nhân Viên"
              value={formatNumber(overviewData?.totalStaff)}
              subtitle="Tất cả nhân viên"
              icon={<People />}
              color="#1976d2"
              loading={loading}
            />
          </Grid>

          <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
            <OverviewCard
              title="Nhân Viên Có Mặt Hôm Nay"
              value={formatNumber(overviewData?.staffPresentToday)}
              subtitle="Đã check-in"
              icon={<PersonPin />}
              color="#2e7d32"
              loading={loading}
            />
          </Grid>

          <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
            <OverviewCard
              title="Tổng Giờ Làm Việc"
              value={formatHours(overviewData?.totalWorkingHours)}
              subtitle="Trong khoảng thời gian"
              icon={<AccessTime />}
              color="#ed6c02"
              loading={loading}
            />
          </Grid>

          <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
            <OverviewCard
              title="Tổng Chi Phí Lương"
              value={formatCurrency(overviewData?.totalSalaryCost)}
              subtitle="Trong khoảng thời gian"
              icon={<AttachMoney />}
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
                <InputLabel>Nhóm check-in</InputLabel>
                <Select
                  value={checkinGroupBy}
                  onChange={(e) => setCheckinGroupBy(e.target.value)}
                  label="Nhóm check-in"
                >
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
          {/* Working Hours by Staff Chart */}
          <Grid item size={{ xs: 12, md: 6 }}>
            <ChartCard
              title="Giờ Làm Việc Theo Nhân Viên"
              icon={<BarChartIcon sx={{ color: "#1976d2" }} />}
              loading={chartsLoading}
            >
              {chartsData?.workingHours?.length > 0 && (
                <BarChart
                  width={500}
                  height={300}
                  series={[
                    {
                      data: chartsData.workingHours.map((item) => item.totalHours),
                      label: "Giờ làm việc",
                      color: "#1976d2",
                    },
                  ]}
                  xAxis={[
                    {
                      scaleType: "band",
                      data: chartsData.workingHours.map((item) =>
                        item.staffName?.length > 15
                          ? item.staffName.substring(0, 15) + "..."
                          : item.staffName || "Unknown",
                      ),
                    },
                  ]}
                  yAxis={[{ label: "Giờ" }]}
                />
              )}
              {chartsData?.workingHours?.length === 0 && (
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300 }}>
                  <Typography color="textSecondary">Không có dữ liệu</Typography>
                </Box>
              )}
            </ChartCard>
          </Grid>

          {/* Checkin Trend Chart */}
          <Grid item size={{ xs: 12, md: 6 }}>
            <ChartCard
              title="Xu Hướng Check-in Theo Thời Gian"
              icon={<Timeline sx={{ color: "#2e7d32" }} />}
              loading={chartsLoading}
            >
              {chartsData?.checkinTrend?.length > 0 && (
                <LineChart
                  width={500}
                  height={300}
                  series={[
                    {
                      data: chartsData.checkinTrend.map((item) => item.checkinCount),
                      label: "Số lượt check-in",
                      color: "#2e7d32",
                      curve: "smooth",
                    },
                  ]}
                  xAxis={[
                    {
                      scaleType: "point",
                      data: chartsData.checkinTrend.map((item) => {
                        if (typeof item.period === "string") return item.period
                        // Format period object to string
                        const { year, month, day, week } = item.period
                        if (day) return `${day}/${month}/${year}`
                        if (week) return `W${week}/${year}`
                        if (month) return `${month}/${year}`
                        return `${year}`
                      }),
                    },
                  ]}
                  yAxis={[{ label: "Lượt check-in" }]}
                />
              )}
              {chartsData?.checkinTrend?.length === 0 && (
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300 }}>
                  <Typography color="textSecondary">Không có dữ liệu</Typography>
                </Box>
              )}
            </ChartCard>
          </Grid>

          {/* Top Working Staff Chart */}
          <Grid item size={{ xs: 12, md: 6 }}>
            <ChartCard
              title="Top 10 Nhân Viên Làm Việc Nhiều Nhất"
              icon={<EmojiEvents sx={{ color: "#ed6c02" }} />}
              loading={chartsLoading}
            >
              {chartsData?.topStaff?.length > 0 && (
                <BarChart
                  width={500}
                  height={300}
                  series={[
                    {
                      data: chartsData.topStaff.map((item) => item.totalHours),
                      label: "Giờ làm việc",
                      color: "#ed6c02",
                    },
                  ]}
                  xAxis={[
                    {
                      scaleType: "band",
                      data: chartsData.topStaff.map((item) =>
                        item.staffName?.length > 15
                          ? item.staffName.substring(0, 15) + "..."
                          : item.staffName || "Unknown",
                      ),
                    },
                  ]}
                  yAxis={[{ label: "Giờ" }]}
                />
              )}
              {chartsData?.topStaff?.length === 0 && (
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300 }}>
                  <Typography color="textSecondary">Không có dữ liệu</Typography>
                </Box>
              )}
            </ChartCard>
          </Grid>

          {/* Salary Cost by Location Chart */}
          <Grid item size={{ xs: 12, md: 6 }}>
            <ChartCard
              title="Chi Phí Lương Theo Chi Nhánh"
              icon={<Business sx={{ color: "#9c27b0" }} />}
              loading={chartsLoading}
            >
              {chartsData?.salaryCost?.length > 0 && (
                <BarChart
                  width={500}
                  height={300}
                  series={[
                    {
                      data: chartsData.salaryCost.map((item) => item.totalCost / 1000000),
                      label: "Chi phí lương (triệu VND)",
                      color: "#9c27b0",
                    },
                  ]}
                  xAxis={[
                    {
                      scaleType: "band",
                      data: chartsData.salaryCost.map((item) =>
                        item.locationName?.length > 15
                          ? item.locationName.substring(0, 15) + "..."
                          : item.locationName || "Unknown",
                      ),
                    },
                  ]}
                  yAxis={[{ label: "Triệu VND" }]}
                />
              )}
              {chartsData?.salaryCost?.length === 0 && (
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

export default AdminReportStaffPage
