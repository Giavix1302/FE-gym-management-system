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
} from "@mui/material"
import {
  CheckCircle,
  AttachMoney,
  Build,
  School,
  TrendingUp,
  Warning,
  FitnessCenter,
  Schedule,
} from "@mui/icons-material"
import { BarChart, PieChart } from "@mui/x-charts"
import { getDataDashboardForStaffAPI } from "~/apis/statistic"
import useCurrentLocation from "~/stores/useCurrentLocationStore"

function StaffHomePage() {
  const { currentLocation } = useCurrentLocation()
  const [dashboardData, setDashboardData] = useState(null)
  console.log("🚀 ~ StaffHomePage ~ dashboardData:", dashboardData)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      try {
        if (currentLocation?._id) {
          const response = await getDataDashboardForStaffAPI(currentLocation._id)
          if (response.success) {
            setDashboardData(response.data)
          }
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [currentLocation])

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

  // Format time
  const formatTime = (isoString) => {
    const date = new Date(isoString)
    return date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
  }

  // Overview Cards Component
  const OverviewCard = ({ title, value, icon, color, subtitle }) => (
    <Card sx={{ height: "100%", background: `linear-gradient(135deg, ${color}15, ${color}05)` }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" color="textSecondary" gutterBottom>
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
  const AlertItem = ({ count, message, severity, icon }) => (
    <Alert
      severity={severity}
      sx={{ mb: 1 }}
      icon={icon}
      action={
        <Chip
          label={count}
          size="small"
          color={severity === "error" ? "error" : severity === "warning" ? "warning" : "success"}
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
                Dashboard - {currentLocation?.name}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={1}>
        {/* Overview Cards */}
        <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
          <OverviewCard
            title="Lượt Check-in Hôm Nay"
            value={formatNumber(dashboardData.overview.todayCheckins)}
            subtitle="Thành viên đã check-in"
            icon={<CheckCircle />}
            color="#1976d2"
          />
        </Grid>
        <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
          <OverviewCard
            title="Doanh Thu Tháng Này"
            value={formatCurrency(dashboardData.overview.totalRevenue)}
            subtitle="Từ PT & Lớp học"
            icon={<AttachMoney />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
          <OverviewCard
            title="Tổng Số Thiết Bị"
            value={formatNumber(dashboardData.overview.totalEquipments)}
            subtitle="Thiết bị tại cơ sở"
            icon={<Build />}
            color="#9c27b0"
          />
        </Grid>
        <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
          <OverviewCard
            title="Lớp Học Hoạt Động"
            value={formatNumber(dashboardData.overview.activeClasses)}
            subtitle="Đang diễn ra"
            icon={<School />}
            color="#ed6c02"
          />
        </Grid>

        {/* Check-in Chart 7 Days */}
        <Grid item size={{ xs: 12, md: 7 }}>
          <Card sx={{ height: "400px" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <TrendingUp sx={{ mr: 1, color: "#1976d2" }} />
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Lượt Check-in 7 Ngày Gần Đây
                </Typography>
              </Box>
              <BarChart
                width={600}
                height={300}
                series={[
                  {
                    data: dashboardData.checkinChart.map((item) => item.count),
                    label: "Số lượt check-in",
                    color: "#1976d2",
                  },
                ]}
                xAxis={[
                  {
                    scaleType: "band",
                    data: dashboardData.checkinChart.map((item) => item.day),
                  },
                ]}
                yAxis={[
                  {
                    label: "Số lượt",
                  },
                ]}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Equipment Status */}
        <Grid item size={{ xs: 12, md: 5 }}>
          <Card sx={{ height: "400px" }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                Tình Trạng Thiết Bị
              </Typography>
              <PieChart
                series={[
                  {
                    data: [
                      {
                        id: 0,
                        value: dashboardData.equipmentStatus.active,
                        label: "Hoạt động",
                        color: "#2e7d32",
                      },
                      {
                        id: 1,
                        value: dashboardData.equipmentStatus.maintenance,
                        label: "Bảo trì",
                        color: "#ed6c02",
                      },
                      {
                        id: 2,
                        value: dashboardData.equipmentStatus.broken,
                        label: "Hỏng",
                        color: "#d32f2f",
                      },
                    ],
                    highlightScope: { faded: "global", highlighted: "item" },
                    faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
                  },
                ]}
                width={400}
                height={300}
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
                  count={dashboardData.alerts.equipmentIssues}
                  message="Thiết bị cần bảo trì/sửa chữa"
                  severity={dashboardData.alerts.equipmentIssues > 0 ? "error" : "success"}
                  icon={<Build />}
                />
                <AlertItem
                  count={dashboardData.alerts.lowEnrollmentClasses}
                  message="Lớp học ít người đăng ký (<5 người)"
                  severity={dashboardData.alerts.lowEnrollmentClasses > 0 ? "warning" : "success"}
                  icon={<School />}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Performing Trainers */}
        <Grid item size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: "400px" }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                Top PT Doanh Thu Cao Nhất
              </Typography>
              <List>
                {dashboardData.topPerformers.trainers.length > 0 ? (
                  dashboardData.topPerformers.trainers.map((trainer, index) => (
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
                              <Typography variant="body2" color="textSecondary">
                                Đánh giá: {trainer.avgRating}/5 ⭐
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < dashboardData.topPerformers.trainers.length - 1 && <Divider />}
                    </React.Fragment>
                  ))
                ) : (
                  <Typography variant="body2" color="textSecondary" sx={{ p: 2, textAlign: "center" }}>
                    Chưa có dữ liệu
                  </Typography>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Today Classes */}
        <Grid item size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: "400px" }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                Lịch Lớp Học Hôm Nay
              </Typography>
              <List sx={{ maxHeight: "320px", overflowY: "auto" }}>
                {dashboardData.todayClasses.length > 0 ? (
                  dashboardData.todayClasses.map((classItem, index) => (
                    <React.Fragment key={classItem.id}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: "#1976d2" }}>
                            <Schedule />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={classItem.className}
                          secondary={
                            <Box>
                              <Typography variant="body2" color="textSecondary">
                                PT: {classItem.trainerName}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                Phòng: {classItem.roomName}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                Thời gian: {formatTime(classItem.startTime)} - {formatTime(classItem.endTime)}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                Học viên: {classItem.enrolled}/{classItem.capacity}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < dashboardData.todayClasses.length - 1 && <Divider />}
                    </React.Fragment>
                  ))
                ) : (
                  <Typography variant="body2" color="textSecondary" sx={{ p: 2, textAlign: "center" }}>
                    Không có lớp học nào hôm nay
                  </Typography>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default StaffHomePage
