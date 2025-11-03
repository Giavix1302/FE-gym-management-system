import React from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Stack,
  Avatar,
} from "@mui/material"
import {
  Close as CloseIcon,
  FitnessCenter as GymIcon,
  AttachMoney as MoneyIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Build as MaintenanceIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
} from "@mui/icons-material"
import { formatCurrencyVND } from "~/utils/common"
import { MUSCLE_CATEGORY_LABELS } from "~/utils/constants"

export default function EquipmentDetailModal({ open, onClose, equipment, locationName }) {
  if (!equipment) return null

  const getStatusColor = (status) => {
    switch (status) {
      case "ACTIVE":
        return "success"
      case "MAINTENANCE":
        return "warning"
      case "BROKEN":
        return "error"
      default:
        return "default"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "ACTIVE":
        return "Hoạt động"
      case "MAINTENANCE":
        return "Bảo trì"
      case "BROKEN":
        return "Hỏng"
      default:
        return status
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "ACTIVE":
        return <CheckIcon />
      case "MAINTENANCE":
        return <WarningIcon />
      case "BROKEN":
        return <ErrorIcon />
      default:
        return <CheckIcon />
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("vi-VN")
  }

  const formatDateTime = (timestamp) => {
    if (!timestamp) return "N/A"
    return new Date(timestamp).toLocaleString("vi-VN")
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2, display: "flex", alignItems: "center", gap: 1 }}>
        <GymIcon color="primary" />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Chi tiết thiết bị
        </Typography>
        <IconButton aria-label="close" onClick={onClose} sx={{ color: (theme) => theme.palette.grey[500] }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Left Column - Equipment Info */}
          <Grid item size={{ xs: 12, md: 6 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {equipment.name}
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {equipment.brand}
              </Typography>

              <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                <Chip
                  label={getStatusText(equipment.status)}
                  color={getStatusColor(equipment.status)}
                  icon={getStatusIcon(equipment.status)}
                  size="small"
                />
              </Box>
            </Box>

            {/* Equipment Image */}
            {equipment.image && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  Hình ảnh thiết bị:
                </Typography>
                <img
                  src={equipment.image}
                  alt={equipment.name}
                  style={{
                    width: "100%",
                    height: "250px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    border: "1px solid #e0e0e0",
                  }}
                  onError={(e) => {
                    e.target.style.display = "none"
                  }}
                />
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            {/* Equipment Details */}
            <Stack spacing={2}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <MoneyIcon color="success" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Giá thiết bị
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color="success.main">
                    {formatCurrencyVND(equipment.price)}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <LocationIcon color="primary" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Cơ sở
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {locationName || "N/A"}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <CalendarIcon color="info" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Ngày mua
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {formatDate(equipment.purchaseDate)}
                  </Typography>
                </Box>
              </Box>
            </Stack>

            <Divider sx={{ my: 2 }} />

            {/* Muscle Categories */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Nhóm cơ tập luyện:
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {equipment.muscleCategories && equipment.muscleCategories.length > 0 ? (
                  equipment.muscleCategories.map((category) => (
                    <Chip
                      key={category}
                      label={MUSCLE_CATEGORY_LABELS[category] || category}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Chưa phân loại
                  </Typography>
                )}
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Timestamps */}
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Thông tin thời gian:
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Ngày tạo: {formatDateTime(equipment.createdAt)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ngày cập nhật: {formatDateTime(equipment.updatedAt)}
              </Typography>
            </Box>
          </Grid>

          {/* Right Column - Maintenance History */}
          <Grid item size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <MaintenanceIcon color="warning" />
              <Typography variant="h6" fontWeight="bold" color="warning.main">
                Lịch sử bảo trì
              </Typography>
            </Box>

            {equipment.maintenanceHistory && equipment.maintenanceHistory.length > 0 ? (
              <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Ngày</TableCell>
                      <TableCell>Kỹ thuật viên</TableCell>
                      <TableCell>Chi phí</TableCell>
                      <TableCell>Chi tiết</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {equipment.maintenanceHistory.map((record, index) => (
                      <TableRow key={index} hover>
                        <TableCell>
                          <Typography variant="body2">{formatDate(record.date)}</Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Avatar sx={{ width: 24, height: 24, fontSize: "0.875rem" }}>
                              {record.technician.charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography variant="body2">{record.technician}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="error.main" fontWeight="medium">
                            {record.cost ? formatCurrencyVND(record.cost) : "0 VNĐ"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ maxWidth: 200 }}>
                            {record.details}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box
                sx={{
                  textAlign: "center",
                  py: 4,
                  border: "1px dashed #e0e0e0",
                  borderRadius: 2,
                  backgroundColor: "#fafafa",
                }}
              >
                <MaintenanceIcon sx={{ fontSize: 48, color: "text.secondary", mb: 1 }} />
                <Typography variant="body1" color="text.secondary">
                  Chưa có lịch sử bảo trì
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Thiết bị này chưa được bảo trì lần nào
                </Typography>
              </Box>
            )}

            {/* Maintenance Summary */}
            {equipment.maintenanceHistory && equipment.maintenanceHistory.length > 0 && (
              <Box sx={{ mt: 2, p: 2, backgroundColor: "#f5f5f5", borderRadius: 2 }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  Tóm tắt bảo trì:
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <span>Tổng số lần bảo trì:</span>
                  <span style={{ fontWeight: "bold" }}>{equipment.maintenanceHistory.length} lần</span>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Tổng chi phí bảo trì:</span>
                  <span style={{ fontWeight: "bold", color: "#f44336" }}>
                    {formatCurrencyVND(
                      equipment.maintenanceHistory.reduce((total, record) => total + (record.cost || 0), 0),
                    )}
                  </span>
                </Box>
              </Box>
            )}
          </Grid>
        </Grid>

        {/* Equipment ID */}
        <Box sx={{ mt: 3, pt: 2, borderTop: "1px solid #e0e0e0" }}>
          <Typography variant="caption" color="text.secondary">
            ID thiết bị: {equipment._id}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="contained" sx={{ minWidth: 100 }}>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}
