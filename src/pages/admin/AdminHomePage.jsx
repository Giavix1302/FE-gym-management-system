import React, { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Alert,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Paper,
  IconButton,
  Badge,
} from "@mui/material"
import {
  People,
  AttachMoney,
  FitnessCenter,
  LocationOn,
  TrendingUp,
  Warning,
  CheckCircle,
  Error,
  Schedule,
  Group,
  Build,
} from "@mui/icons-material"
import { LineChart, BarChart } from "@mui/x-charts"
import { getDataDashboardForAdminAPI } from "~/apis/statistic"

function AdminHomePage() {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      try {
        const response = await getDataDashboardForAdminAPI()
        if (response.success) {
          setDashboardData(response.data)
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <Typography>Đang tải dữ liệu...</Typography>
      </Box>
    )
  }

  if (!dashboardData) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <Typography>Không thể tải dữ liệu</Typography>
      </Box>
    )
  }

  // Format currency VND
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  // Format number with commas
  const formatNumber = (num) => {
    return new Intl.NumberFormat("vi-VN").format(num)
  }

  // Overview Cards Component
  const OverviewCard = ({ title, value, icon, color, subtitle }) => (
    <Card sx={{ height: "100%", background: `linear-gradient(135deg, ${color}15, ${color}05)` }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: "bold", color: color }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>{icon}</Avatar>
        </Box>
      </CardContent>
    </Card>
  )

  // Alert Component
  const AlertItem = ({ type, count, message, severity, icon }) => (
    <Alert
      severity={severity}
      sx={{ mb: 1 }}
      icon={icon}
      action={
        <Chip
          label={count}
          size="small"
          color={severity === "error" ? "error" : severity === "warning" ? "warning" : "info"}
        />
      }
    >
      <Typography variant="body2">{message}</Typography>
    </Alert>
  )

  return (
    <Box sx={{ p: 1, minHeight: "100vh" }}>
      {/* Header */}
      <Card sx={{ mb: 1 }}>
        <CardContent sx={{ "&:last-child": { pb: 2 } }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                Tổng quan
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={1}>
        {/* Overview Cards */}
        <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
          <OverviewCard
            title="Tổng Thành Viên"
            value={formatNumber(dashboardData.overview.totalMembers)}
            subtitle="Đang hoạt động"
            icon={<People />}
            color="#1976d2"
          />
        </Grid>
        <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
          <OverviewCard
            title="Doanh Thu"
            value={formatCurrency(dashboardData.overview.totalRevenue)}
            subtitle="3 tháng gần đây"
            icon={<AttachMoney />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
          <OverviewCard
            title="Huấn Luyện Viên"
            value={formatNumber(dashboardData.overview.totalTrainers)}
            subtitle="PT đã được duyệt"
            icon={<FitnessCenter />}
            color="#ed6c02"
          />
        </Grid>
        <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
          <OverviewCard
            title="Cơ Sở"
            value={formatNumber(dashboardData.overview.totalLocations)}
            subtitle="Chi nhánh hoạt động"
            icon={<LocationOn />}
            color="#9c27b0"
          />
        </Grid>

        {/* Revenue Chart */}
        <Grid item size={{ xs: 12, md: 7 }}>
          <Card sx={{ height: "400px" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <TrendingUp sx={{ mr: 1, color: "#1976d2" }} />
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Biểu Đồ Doanh Thu 3 Tháng Gần Đây
                </Typography>
              </Box>
              <LineChart
                width={600}
                height={300}
                series={[
                  {
                    data: dashboardData.revenueChart.dataRevenue.data.map((item) => item.revenue / 1000000),
                    label: "Doanh thu (triệu VND)",
                    color: "#1976d2",
                  },
                ]}
                xAxis={[
                  {
                    scaleType: "point",
                    data: dashboardData.revenueChart.dataRevenue.data.map((item) => item.label),
                  },
                ]}
                yAxis={[
                  {
                    label: "Doanh thu (triệu VND)",
                  },
                ]}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Revenue Breakdown - Changed to Multi-line Chart */}
        <Grid item size={{ xs: 12, md: 5 }}>
          <Card sx={{ height: "400px" }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                Phân Tích Doanh Thu Theo Nguồn
              </Typography>
              <LineChart
                width={400}
                height={300}
                series={[
                  {
                    data: dashboardData.revenueBreakdown.map((item) => item.membership / 1000000),
                    label: "Membership (triệu VND)",
                    color: "#1976d2",
                  },
                  {
                    data: dashboardData.revenueBreakdown.map((item) => item.booking / 1000000),
                    label: "PT Sessions (triệu VND)",
                    color: "#2e7d32",
                  },
                  {
                    data: dashboardData.revenueBreakdown.map((item) => item.class / 1000000),
                    label: "Group Classes (triệu VND)",
                    color: "#ed6c02",
                  },
                ]}
                xAxis={[
                  {
                    scaleType: "point",
                    data: dashboardData.revenueBreakdown.map((item) => item.month),
                  },
                ]}
                yAxis={[
                  {
                    label: "Doanh thu (triệu VND)",
                  },
                ]}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Alerts Panel */}
        <Grid item size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: "400px" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Warning sx={{ mr: 1, color: "#ed6c02" }} />
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Cảnh Báo Hệ Thống
                </Typography>
              </Box>
              <Box sx={{ maxHeight: "320px", overflowY: "auto" }}>
                <AlertItem
                  type="pendingTrainers"
                  count={dashboardData.alerts.pendingTrainers}
                  message="PT chờ duyệt quá lâu (>3 ngày)"
                  severity={dashboardData.alerts.pendingTrainers > 0 ? "error" : "success"}
                  icon={<Schedule />}
                />
                <AlertItem
                  type="equipmentIssues"
                  count={dashboardData.alerts.equipmentIssues}
                  message="Thiết bị cần bảo trì/sửa chữa"
                  severity={dashboardData.alerts.equipmentIssues > 0 ? "error" : "success"}
                  icon={<Build />}
                />
                <AlertItem
                  type="lowEnrollment"
                  count={dashboardData.alerts.lowEnrollmentClasses}
                  message="Lớp học ít người đăng ký (<5 người)"
                  severity={dashboardData.alerts.lowEnrollmentClasses > 0 ? "warning" : "success"}
                  icon={<Group />}
                />
                <AlertItem
                  type="membershipExpiring"
                  count={dashboardData.alerts.membershipExpiring}
                  message="Membership sắp hết hạn (7 ngày)"
                  severity={dashboardData.alerts.membershipExpiring > 0 ? "info" : "success"}
                  icon={<Schedule />}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Performing Locations */}
        <Grid item size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: "400px" }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                Top Cơ Sở Hoạt Động Tốt Nhất
              </Typography>
              <List>
                {dashboardData.topPerformers.locations.map((location, index) => (
                  <React.Fragment key={location.id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: index === 0 ? "#ffd700" : index === 1 ? "#c0c0c0" : "#cd7f32",
                            color: "#000",
                          }}
                        >
                          {index + 1}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={location.name}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="textSecondary">
                              Lượt tham gia: {formatNumber(location.attendance)}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              Trung bình giờ tập: {location.avgTrainingHours.toFixed(2)}h
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              Người dùng: {formatNumber(location.uniqueUsers)}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < dashboardData.topPerformers.locations.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Performing Trainers */}
        <Grid item size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: "400px" }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                Top PT Có Doanh Thu Cao Nhất
              </Typography>
              <List>
                {dashboardData.topPerformers.trainers.map((trainer, index) => (
                  <React.Fragment key={trainer.id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: index === 0 ? "#ffd700" : index === 1 ? "#c0c0c0" : "#cd7f32",
                            color: "#000",
                          }}
                        >
                          {index + 1}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={trainer.name}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="textSecondary">
                              Doanh thu: {formatCurrency(trainer.revenue)}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              Buổi tập: {formatNumber(trainer.sessions)}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < dashboardData.topPerformers.trainers.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default AdminHomePage
