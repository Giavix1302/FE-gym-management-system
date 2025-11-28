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
  AccessTime,
  Paid,
  EventNote,
  CalendarToday,
  Refresh,
  BarChart as BarChartIcon,
  ShowChart,
} from "@mui/icons-material"
import { LineChart, BarChart } from "@mui/x-charts"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import dayjs from "dayjs"
import {
  getMyStatisticsAPI,
  getMyWorkingHoursChartAPI,
  getMyIncomeChartAPI,
  formatCurrency,
  formatHours,
  getTimeRangeOptions,
} from "~/apis/staff"
import useStaffStore from "~/stores/useStaffStore"

function StaffWorkingHourReportPage() {
  const { staff } = useStaffStore()
  const staffId = staff?._id

  // State for data
  const [overviewData, setOverviewData] = useState(null)
  const [chartsData, setChartsData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [chartsLoading, setChartsLoading] = useState(false)
  const [error, setError] = useState(null)

  // State for filters
  const [startDate, setStartDate] = useState(dayjs().startOf("month"))
  const [endDate, setEndDate] = useState(dayjs())
  const [timeRange, setTimeRange] = useState("thisMonth")
  const [groupBy, setGroupBy] = useState("week")

  // Quick time range options
  const timeRangeOptions = getTimeRangeOptions()

  // Initialize data
  useEffect(() => {
    if (staffId) {
      loadOverviewData()
    }
  }, [staffId])

  useEffect(() => {
    if (staffId) {
      loadChartsData()
    }
  }, [staffId, startDate, endDate, groupBy])

  const loadOverviewData = async () => {
    try {
      setLoading(true)
      setError(null)

      const result = await getMyStatisticsAPI(staffId, {
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

      const params = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        groupBy,
      }

      const [workingHoursResult, incomeResult] = await Promise.all([
        getMyWorkingHoursChartAPI(staffId, params),
        getMyIncomeChartAPI(staffId, params),
      ])

      if (workingHoursResult.success && incomeResult.success) {
        setChartsData({
          workingHours: workingHoursResult.data,
          income: incomeResult.data,
        })
      } else {
        setError("Không thể tải dữ liệu biểu đồ")
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
      const newEndDate = dayjs()
      let newStartDate

      switch (range) {
        case "today":
          newStartDate = dayjs().startOf("day")
          setGroupBy("day")
          break
        case "thisWeek":
          newStartDate = dayjs().startOf("week")
          setGroupBy("day")
          break
        case "lastWeek":
          newStartDate = dayjs().subtract(1, "week").startOf("week")
          setEndDate(dayjs().subtract(1, "week").endOf("week"))
          setGroupBy("day")
          break
        case "thisMonth":
          newStartDate = dayjs().startOf("month")
          setGroupBy("week")
          break
        case "lastMonth":
          newStartDate = dayjs().subtract(1, "month").startOf("month")
          setEndDate(dayjs().subtract(1, "month").endOf("month"))
          setGroupBy("week")
          break
        case "last3Months":
          newStartDate = dayjs().subtract(3, "month")
          setGroupBy("month")
          break
        default:
          newStartDate = dayjs().startOf("month")
      }

      setStartDate(newStartDate)
      if (range !== "lastWeek" && range !== "lastMonth") {
        setEndDate(newEndDate)
      }
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

  if (!staffId) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "50vh",
          gap: 2,
        }}
      >
        <Alert severity="error" sx={{ maxWidth: 600 }}>
          Không tìm thấy thông tin nhân viên
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
                <AccessTime sx={{ color: "white", fontSize: 32 }} />
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "white" }}>
                  Thống Kê Giờ Làm Việc
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
          <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
            <OverviewCard
              title="Tổng Giờ Làm Việc"
              value={overviewData?.totalHours ? formatHours(overviewData.totalHours) : "N/A"}
              subtitle="Tổng số giờ đã làm việc"
              icon={<AccessTime />}
              color="#1976d2"
              loading={loading}
            />
          </Grid>
          <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
            <OverviewCard
              title="Thu Nhập Dự Kiến"
              value={overviewData?.totalIncome ? formatCurrency(overviewData.totalIncome) : "N/A"}
              subtitle="Tổng thu nhập trong kỳ"
              icon={<Paid />}
              color="#2e7d32"
              loading={loading}
            />
          </Grid>
          <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
            <OverviewCard
              title="Số Ca Đã Làm"
              value={overviewData?.totalShifts ? formatNumber(overviewData.totalShifts) : "N/A"}
              subtitle="Tổng số ca làm việc"
              icon={<EventNote />}
              color="#ed6c02"
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
          {/* Working Hours Chart */}
          <Grid item size={{ xs: 12, md: 6 }}>
            <ChartCard
              title="Giờ Làm Việc Theo Thời Gian"
              icon={<BarChartIcon sx={{ color: "#1976d2" }} />}
              loading={chartsLoading}
            >
              {chartsData?.workingHours && (
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
                      data: chartsData.workingHours.map((item) => item.period),
                    },
                  ]}
                  yAxis={[
                    {
                      label: "Giờ",
                    },
                  ]}
                />
              )}
            </ChartCard>
          </Grid>

          {/* Income Chart */}
          <Grid item size={{ xs: 12, md: 6 }}>
            <ChartCard
              title="Thu Nhập Theo Thời Gian"
              icon={<ShowChart sx={{ color: "#2e7d32" }} />}
              loading={chartsLoading}
            >
              {chartsData?.income && (
                <LineChart
                  width={500}
                  height={300}
                  series={[
                    {
                      data: chartsData.income.map((item) => item.income),
                      label: "Thu nhập (VNĐ)",
                      color: "#2e7d32",
                      curve: "smooth",
                    },
                  ]}
                  xAxis={[
                    {
                      scaleType: "point",
                      data: chartsData.income.map((item) => item.period),
                    },
                  ]}
                  yAxis={[
                    {
                      label: "Thu nhập (VNĐ)",
                      valueFormatter: (value) => formatCurrency(value),
                    },
                  ]}
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

export default StaffWorkingHourReportPage
