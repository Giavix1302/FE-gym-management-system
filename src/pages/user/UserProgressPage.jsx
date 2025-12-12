import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Alert,
  Fab,
  Container,
} from "@mui/material"
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
} from "@mui/icons-material"
import { LineChart } from "@mui/x-charts/LineChart"
import { BarChart } from "@mui/x-charts/BarChart"
import { useState, useEffect } from "react"
import useUserStore from "~/stores/useUserStore"
import {
  createProgressAPI,
  getAllProgressByUserIdAPI,
  updateProgressAPI,
  deleteProgressAPI,
  getDashboardDataAPI,
} from "~/apis/progress"

function UserProgressPage() {
  const { user } = useUserStore()

  // States
  const [progressList, setProgressList] = useState([])
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [openModal, setOpenModal] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [editingProgress, setEditingProgress] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  // Form states
  const [formData, setFormData] = useState({
    measurementDate: new Date().toISOString().split("T")[0],
    weight: "",
    bodyFat: "",
    muscleMass: "",
    note: "",
  })
  const [formErrors, setFormErrors] = useState({})

  // Fetch data
  const fetchData = async () => {
    if (!user?._id) return

    try {
      setLoading(true)
      const [progressResponse, dashboardResponse] = await Promise.all([
        getAllProgressByUserIdAPI(user._id, { sortBy: "measurementDate", sortOrder: "desc" }),
        getDashboardDataAPI(user._id),
      ])

      if (progressResponse.success) {
        setProgressList(progressResponse.data)
      }

      if (dashboardResponse.success) {
        setDashboardData(dashboardResponse.data)
        console.log("🚀 ~ fetchData ~ dashboardResponse.data:", dashboardResponse.data)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [user?._id])

  // Handle form
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.weight || formData.weight <= 0) errors.weight = "Cân nặng phải lớn hơn 0"
    if (!formData.bodyFat || formData.bodyFat <= 0) errors.bodyFat = "Tỷ lệ mỡ phải lớn hơn 0"
    if (!formData.muscleMass || formData.muscleMass <= 0) errors.muscleMass = "Khối lượng cơ phải lớn hơn 0"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    try {
      const submitData = {
        ...formData,
        userId: user._id,
        measurementDate: formData.measurementDate + "T00:00:00.000Z",
      }
      console.log("🚀 ~ handleSubmit ~ submitData:", submitData)

      let response
      if (editingProgress) {
        response = await updateProgressAPI(editingProgress._id, submitData)
      } else {
        response = await createProgressAPI(submitData)
      }

      if (response.success) {
        await fetchData()
        handleCloseModal()
      }
    } catch (error) {
      console.error("Error submitting:", error)
    }
  }

  const handleEdit = (progress) => {
    setEditingProgress(progress)
    setFormData({
      measurementDate: new Date(progress.measurementDate).toISOString().split("T")[0],
      weight: progress.weight.toString(),
      bodyFat: progress.bodyFat.toString(),
      muscleMass: progress.muscleMass.toString(),
      note: progress.note || "",
    })
    setOpenModal(true)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return

    try {
      const response = await deleteProgressAPI(deleteTarget._id)
      if (response.success) {
        await fetchData()
        setOpenDeleteDialog(false)
        setDeleteTarget(null)
      }
    } catch (error) {
      console.error("Error deleting:", error)
    }
  }

  const handleCloseModal = () => {
    setOpenModal(false)
    setEditingProgress(null)
    setFormData({
      measurementDate: new Date().toISOString().split("T")[0],
      weight: "",
      bodyFat: "",
      muscleMass: "",
      note: "",
    })
    setFormErrors({})
  }

  // Chart data preparation
  const chartData =
    dashboardData?.trendData?.map((item) => ({
      date: new Date(item.measurementDate).toLocaleDateString("vi-VN"),
      weight: item.weight,
      bodyFat: item.bodyFat,
      muscleMass: item.muscleMass,
    })) || []
  console.log("🚀 ~ UserProgressPage ~ dashboardData:", dashboardData)
  console.log("🚀 ~ UserProgressPage ~ chartData:", chartData)

  const formatNumber = (num) => {
    return new Intl.NumberFormat("vi-VN", { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(num)
  }

  const getChangeColor = (value) => {
    if (value > 0) return "error.main"
    if (value < 0) return "success.main"
    return "text.secondary"
  }

  const getChangeIcon = (value) => {
    if (value > 0) return "↗"
    if (value < 0) return "↘"
    return "→"
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Đang tải dữ liệu...</Typography>
      </Box>
    )
  }

  return (
    <Container sx={{ p: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        flexDirection={{ xs: "column", sm: "row" }}
        gap={2}
      >
        <Typography variant="h4" component="h1" color="primary.main" fontWeight="600">
          Theo Dõi Tiến Trình
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenModal(true)}
          sx={{ minWidth: { xs: "100%", sm: "auto" } }}
        >
          Thêm Mới Đo Lường
        </Button>
      </Box>

      {/* Statistics Cards */}
      {dashboardData?.comparison && (
        <Grid container spacing={2} mb={2}>
          <Grid item size={{ xs: 12, sm: 4 }}>
            <Card>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography color="text.secondary" variant="body2">
                      Cân Nặng
                    </Typography>
                    <Typography variant="h5" fontWeight="600">
                      {formatNumber(dashboardData.comparison.current.weight)} kg
                    </Typography>
                  </Box>
                  <Box textAlign="right">
                    <Typography
                      variant="body2"
                      color={getChangeColor(dashboardData.comparison.changes.weight.value)}
                      fontWeight="500"
                    >
                      {getChangeIcon(dashboardData.comparison.changes.weight.value)}{" "}
                      {Math.abs(dashboardData.comparison.changes.weight.value)} kg
                    </Typography>
                    <Typography
                      variant="caption"
                      color={getChangeColor(dashboardData.comparison.changes.weight.percentage)}
                    >
                      ({dashboardData.comparison.changes.weight.percentage > 0 ? "+" : ""}
                      {dashboardData.comparison.changes.weight.percentage}%)
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item size={{ xs: 12, sm: 4 }}>
            <Card>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography color="text.secondary" variant="body2">
                      Tỷ Lệ Mỡ
                    </Typography>
                    <Typography variant="h5" fontWeight="600">
                      {formatNumber(dashboardData.comparison.current.bodyFat)}%
                    </Typography>
                  </Box>
                  <Box textAlign="right">
                    <Typography
                      variant="body2"
                      color={getChangeColor(dashboardData.comparison.changes.bodyFat.value)}
                      fontWeight="500"
                    >
                      {getChangeIcon(dashboardData.comparison.changes.bodyFat.value)}{" "}
                      {Math.abs(dashboardData.comparison.changes.bodyFat.value)}%
                    </Typography>
                    <Typography
                      variant="caption"
                      color={getChangeColor(dashboardData.comparison.changes.bodyFat.percentage)}
                    >
                      ({dashboardData.comparison.changes.bodyFat.percentage > 0 ? "+" : ""}
                      {dashboardData.comparison.changes.bodyFat.percentage}%)
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item size={{ xs: 12, sm: 4 }}>
            <Card>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography color="text.secondary" variant="body2">
                      Khối Lượng Cơ
                    </Typography>
                    <Typography variant="h5" fontWeight="600">
                      {formatNumber(dashboardData.comparison.current.muscleMass)} kg
                    </Typography>
                  </Box>
                  <Box textAlign="right">
                    <Typography
                      variant="body2"
                      color={getChangeColor(-dashboardData.comparison.changes.muscleMass.value)} // Đảo ngược vì tăng cơ là tốt
                      fontWeight="500"
                    >
                      {getChangeIcon(dashboardData.comparison.changes.muscleMass.value)}{" "}
                      {Math.abs(dashboardData.comparison.changes.muscleMass.value)} kg
                    </Typography>
                    <Typography
                      variant="caption"
                      color={getChangeColor(-dashboardData.comparison.changes.muscleMass.percentage)}
                    >
                      ({dashboardData.comparison.changes.muscleMass.percentage > 0 ? "+" : ""}
                      {dashboardData.comparison.changes.muscleMass.percentage}%)
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Charts */}
      {chartData.length > 0 && (
        <Grid container spacing={2} mb={2}>
          <Grid item size={{ xs: 12, md: 8 }}>
            <Card>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  display="flex"
                  alignItems="center"
                  gap={1}
                  fontWeight="bold"
                  color="primary"
                >
                  <TrendingUpIcon /> Xu Hướng Thay Đổi
                </Typography>
                <LineChart
                  width={undefined}
                  height={370}
                  series={[
                    { data: chartData.map((d) => d.weight), label: "Cân nặng (kg)", color: "#16697A" },
                    { data: chartData.map((d) => d.bodyFat), label: "Tỷ lệ mỡ (%)", color: "#489FB5" },
                    { data: chartData.map((d) => d.muscleMass), label: "Khối lượng cơ (kg)", color: "#82C0CC" },
                  ]}
                  xAxis={[
                    {
                      data: chartData.map((d) => d.date),
                      scaleType: "point",
                    },
                  ]}
                  margin={{ left: 10, right: 30, top: 30, bottom: 10 }}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  display="flex"
                  alignItems="center"
                  gap={1}
                  fontWeight="bold"
                  color="primary"
                >
                  <AssessmentIcon /> Thống Kê Tổng Quan
                </Typography>
                {dashboardData?.statistics && (
                  <Stack spacing={1}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "primary.main",
                        color: "white",
                        textAlign: "center",
                      }}
                    >
                      <Typography variant="h4" fontWeight="bold">
                        {dashboardData.statistics.totalRecords}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Tổng số lần đo
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "info.main",
                        color: "white",
                        border: "1px solid",
                        borderColor: "info.light",
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5 }}>
                            Cân nặng TB
                          </Typography>
                          <Typography variant="h5" fontWeight="600">
                            {formatNumber(dashboardData.statistics.weight.average)} kg
                          </Typography>
                        </Box>
                        <Box textAlign="right">
                          <Typography
                            variant="caption"
                            sx={{
                              bgcolor: "rgba(255,255,255,0.2)",
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              display: "block",
                              mb: 0.5,
                            }}
                          >
                            Min: {formatNumber(dashboardData.statistics.weight.min)} kg
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              bgcolor: "rgba(255,255,255,0.2)",
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              display: "block",
                            }}
                          >
                            Max: {formatNumber(dashboardData.statistics.weight.max)} kg
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>

                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "warning.main",
                        color: "white",
                        border: "1px solid",
                        borderColor: "warning.light",
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5 }}>
                            Tỷ lệ mỡ TB
                          </Typography>
                          <Typography variant="h5" fontWeight="600">
                            {formatNumber(dashboardData.statistics.bodyFat.average)}%
                          </Typography>
                        </Box>
                        <Box textAlign="right">
                          <Typography
                            variant="caption"
                            sx={{
                              bgcolor: "rgba(255,255,255,0.2)",
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              display: "block",
                              mb: 0.5,
                            }}
                          >
                            Min: {formatNumber(dashboardData.statistics.bodyFat.min)}%
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              bgcolor: "rgba(255,255,255,0.2)",
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              display: "block",
                            }}
                          >
                            Max: {formatNumber(dashboardData.statistics.bodyFat.max)}%
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>

                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "success.main",
                        color: "white",
                        border: "1px solid",
                        borderColor: "success.light",
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5 }}>
                            Khối lượng cơ TB
                          </Typography>
                          <Typography variant="h5" fontWeight="600">
                            {formatNumber(dashboardData.statistics.muscleMass.average)} kg
                          </Typography>
                        </Box>
                        <Box textAlign="right">
                          <Typography
                            variant="caption"
                            sx={{
                              bgcolor: "rgba(255,255,255,0.2)",
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              display: "block",
                              mb: 0.5,
                            }}
                          >
                            Min: {formatNumber(dashboardData.statistics.muscleMass.min)} kg
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              bgcolor: "rgba(255,255,255,0.2)",
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              display: "block",
                            }}
                          >
                            Max: {formatNumber(dashboardData.statistics.muscleMass.max)} kg
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  </Stack>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Progress Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Lịch Sử Đo Lường
          </Typography>
          <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Ngày Đo</TableCell>
                  <TableCell>Cân Nặng (kg)</TableCell>
                  <TableCell>Tỷ Lệ Mỡ (%)</TableCell>
                  <TableCell>Khối Lượng Cơ (kg)</TableCell>
                  <TableCell>Ghi Chú</TableCell>
                  <TableCell align="center">Thao Tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {progressList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography color="text.secondary">Chưa có dữ liệu đo lường</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  progressList.map((progress, index) => (
                    <TableRow key={progress._id} hover>
                      <TableCell>
                        <Stack direction="row" alignItems="center" gap={1}>
                          {new Date(progress.measurementDate).toLocaleDateString("vi-VN")}
                          {index === 0 && <Chip label="Mới nhất" size="small" color="primary" />}
                        </Stack>
                      </TableCell>
                      <TableCell>{formatNumber(progress.weight)}</TableCell>
                      <TableCell>{formatNumber(progress.bodyFat)}</TableCell>
                      <TableCell>{formatNumber(progress.muscleMass)}</TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            maxWidth: 150,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {progress.note || "-"}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <IconButton size="small" color="primary" onClick={() => handleEdit(progress)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          {index === 0 && ( // Chỉ cho phép xóa record mới nhất
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => {
                                setDeleteTarget(progress)
                                setOpenDeleteDialog(true)
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth fullScreen={false}>
        <DialogTitle>{editingProgress ? "Cập Nhật Đo Lường" : "Thêm Đo Lường Mới"}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Ngày đo"
              type="date"
              value={formData.measurementDate}
              onChange={(e) => handleInputChange("measurementDate", e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Cân nặng (kg)"
              type="number"
              value={formData.weight}
              onChange={(e) => handleInputChange("weight", e.target.value)}
              error={!!formErrors.weight}
              helperText={formErrors.weight}
              fullWidth
              inputProps={{ step: 0.1, min: 0 }}
            />

            <TextField
              label="Tỷ lệ mỡ (%)"
              type="number"
              value={formData.bodyFat}
              onChange={(e) => handleInputChange("bodyFat", e.target.value)}
              error={!!formErrors.bodyFat}
              helperText={formErrors.bodyFat}
              fullWidth
              inputProps={{ step: 0.1, min: 0 }}
            />

            <TextField
              label="Khối lượng cơ (kg)"
              type="number"
              value={formData.muscleMass}
              onChange={(e) => handleInputChange("muscleMass", e.target.value)}
              error={!!formErrors.muscleMass}
              helperText={formErrors.muscleMass}
              fullWidth
              inputProps={{ step: 0.1, min: 0 }}
            />

            <TextField
              label="Ghi chú"
              multiline
              rows={3}
              value={formData.note}
              onChange={(e) => handleInputChange("note", e.target.value)}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingProgress ? "Cập Nhật" : "Thêm Mới"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Xác Nhận Xóa</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa dữ liệu đo lường ngày{" "}
            <strong>{deleteTarget && new Date(deleteTarget.measurementDate).toLocaleDateString("vi-VN")}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Hủy</Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button for mobile */}
      <Fab
        color="primary"
        aria-label="add"
        onClick={() => setOpenModal(true)}
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          display: { xs: "flex", sm: "none" },
        }}
      >
        <AddIcon />
      </Fab>
    </Container>
  )
}

export default UserProgressPage
