import React, { useState } from "react"
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
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
  Alert,
} from "@mui/material"
import {
  Close as CloseIcon,
  FitnessCenter as GymIcon,
  AttachMoney as MoneyIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Build as MaintenanceIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ChangeCircle as ChangeIcon,
  Person as PersonIcon,
} from "@mui/icons-material"
import { formatCurrencyVND } from "~/utils/common"
import { MUSCLE_CATEGORY_LABELS } from "~/utils/constants"
import { canEditMaintenanceRecord } from "~/apis/equipment"
import ConfirmDialog from "~/components/ConfirmDialog"

export default function EquipmentDetailModal({
  open,
  onClose,
  equipment,
  locationName,
  onStatusChange,
  onAddMaintenance,
  onEditMaintenance,
  onDeleteMaintenance,
}) {
  const [isEditingStatus, setIsEditingStatus] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState("")
  const [statusConfirmOpen, setStatusConfirmOpen] = useState(false)

  if (!equipment) return null

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "success"
      case "maintenance":
        return "warning"
      case "broken":
        return "error"
      default:
        return "default"
    }
  }
  console.log(getStatusColor(equipment.status))
  console.log("🚀 ~ EquipmentDetailModal ~ equipment.status:", equipment.status)

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "active"
      case "maintenance":
        return "maintenance"
      case "broken":
        return "broken"
      default:
        return status
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

  const handleStatusEditClick = () => {
    setSelectedStatus(equipment.status)
    console.log("🚀 ~ handleStatusEditClick ~ equipment:", equipment.status)
    setIsEditingStatus(true)
  }

  const handleStatusChange = (newStatus) => {
    setSelectedStatus(newStatus)
    setStatusConfirmOpen(true)
  }

  const handleConfirmStatusChange = () => {
    onStatusChange(equipment._id, selectedStatus)
    setIsEditingStatus(false)
    setStatusConfirmOpen(false)
  }

  const handleCancelStatusChange = () => {
    setIsEditingStatus(false)
    setSelectedStatus("")
    setStatusConfirmOpen(false)
  }

  const handleEditMaintenance = (record, index) => {
    onEditMaintenance(record, index)
  }

  const handleDeleteMaintenance = (index) => {
    onDeleteMaintenance(index)
  }

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle
          sx={{
            m: 0,
            p: 2,
            display: "flex",
            alignItems: "center",
            gap: 2,
            borderBottom: "1px solid #e0e0e0",
            // backgroundColor: "primary.main",
            // color: "white",
          }}
        >
          <GymIcon sx={{ fontSize: 32 }} color="primary" />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5" component="div" fontWeight="bold" color="primary">
              {equipment.name}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Thương hiệu: {equipment.brand}
            </Typography>
          </Box>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              color: "white",
              backgroundColor: "rgba(255,255,255,0.1)",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 2 }}>
          {/* First Row - Equipment Details */}
          <Card sx={{ my: 2, boxShadow: 2, borderRadius: 2 }}>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="h6" fontWeight="bold" color="primary.main" sx={{ mb: 2 }}>
                Thông tin thiết bị
              </Typography>

              <Grid container spacing={3}>
                {/* Left - Equipment Image */}
                <Grid item size={{ xs: 12, md: 4 }}>
                  {equipment.image ? (
                    <Box
                      component="img"
                      src={equipment.image}
                      alt={equipment.name}
                      sx={{
                        width: "100%",
                        height: "300px",
                        objectFit: "cover",
                        borderRadius: "12px",
                        border: "1px solid #e0e0e0",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                      onError={(e) => {
                        e.target.style.display = "none"
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: "100%",
                        height: "300px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#f5f5f5",
                        borderRadius: "12px",
                        border: "1px solid #e0e0e0",
                      }}
                    >
                      <GymIcon sx={{ fontSize: 64, color: "text.secondary" }} />
                    </Box>
                  )}
                </Grid>

                {/* Right - Equipment Information */}
                <Grid item size={{ xs: 12, md: 8 }}>
                  <Grid container spacing={4}>
                    {/* Status with Edit Button */}
                    <Grid item size={{ xs: 12, sm: 6 }}>
                      <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="text.secondary">
                        Trạng thái
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        {!isEditingStatus ? (
                          <>
                            <Chip
                              label={getStatusText(equipment.status)}
                              color={getStatusColor(equipment.status)}
                              // color="success"
                              size="medium"
                              sx={{
                                fontSize: "0.875rem",
                                fontWeight: "bold",
                                minWidth: 100,
                              }}
                            />
                            <IconButton
                              size="small"
                              onClick={handleStatusEditClick}
                              sx={{
                                backgroundColor: "action.hover",
                                "&:hover": { backgroundColor: "action.selected" },
                              }}
                            >
                              <ChangeIcon fontSize="small" />
                            </IconButton>
                          </>
                        ) : (
                          <FormControl size="small" sx={{ minWidth: 150 }}>
                            <Select
                              value={selectedStatus}
                              onChange={(e) => handleStatusChange(e.target.value)}
                              size="small"
                            >
                              <MenuItem value="active">
                                <Chip label="Hoạt động" color="success" size="small" sx={{ fontWeight: "bold" }} />
                              </MenuItem>
                              <MenuItem value="maintenance">
                                <Chip label="Bảo trì" color="warning" size="small" sx={{ fontWeight: "bold" }} />
                              </MenuItem>
                              <MenuItem value="broken">
                                <Chip label="Hỏng" color="error" size="small" sx={{ fontWeight: "bold" }} />
                              </MenuItem>
                            </Select>
                          </FormControl>
                        )}
                      </Box>
                    </Grid>

                    {/* Price */}
                    <Grid item size={{ xs: 12, sm: 6 }}>
                      <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="text.secondary">
                        Giá thiết bị
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <MoneyIcon color="success" />
                        <Typography variant="h6" fontWeight="bold" color="success.main">
                          {formatCurrencyVND(equipment.price)}
                        </Typography>
                      </Box>
                    </Grid>

                    {/* Location */}
                    <Grid item size={{ xs: 12, sm: 6 }}>
                      <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="text.secondary">
                        Cơ sở
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <LocationIcon color="primary" />
                        <Typography variant="body1" fontWeight="medium">
                          {locationName || "N/A"}
                        </Typography>
                      </Box>
                    </Grid>

                    {/* Purchase Date */}
                    <Grid item size={{ xs: 12, sm: 6 }}>
                      <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="text.secondary">
                        Ngày mua
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CalendarIcon color="info" />
                        <Typography variant="body1" fontWeight="medium">
                          {formatDate(equipment.purchaseDate)}
                        </Typography>
                      </Box>
                    </Grid>

                    {/* Muscle Categories */}
                    <Grid item size={{ xs: 12, sm: 6 }}>
                      <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="text.secondary">
                        Nhóm cơ tập luyện
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
                              sx={{ fontWeight: "medium" }}
                            />
                          ))
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Chưa phân loại
                          </Typography>
                        )}
                      </Box>
                    </Grid>

                    {/* Timestamps */}
                    <Grid item size={{ xs: 12, sm: 6 }}>
                      <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="text.secondary">
                        Thông tin thời gian
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Ngày tạo: {formatDateTime(equipment.createdAt)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Ngày cập nhật: {formatDateTime(equipment.updatedAt)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Second Row - Maintenance History */}
          <Card sx={{ boxShadow: 2, borderRadius: 2 }}>
            <CardContent sx={{}}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <MaintenanceIcon color="warning" sx={{ fontSize: 28 }} />
                  <Box>
                    <Typography variant="h6" fontWeight="bold" color="warning.main">
                      Lịch sử bảo trì
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {equipment.maintenanceHistory?.length || 0} bản ghi
                    </Typography>
                  </Box>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={onAddMaintenance}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: "medium",
                  }}
                >
                  Thêm bảo trì
                </Button>
              </Box>

              {equipment.maintenanceHistory && equipment.maintenanceHistory.length > 0 ? (
                <>
                  <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 1 }}>
                    <Table>
                      <TableHead>
                        <TableRow sx={{}}>
                          <TableCell sx={{ fontWeight: "bold" }}>Ngày</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Kỹ thuật viên</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Chi phí</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Chi tiết</TableCell>
                          <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Thao tác</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {equipment.maintenanceHistory.map((record, index) => {
                          const canEdit = canEditMaintenanceRecord(record)

                          return (
                            <TableRow key={index} hover>
                              <TableCell>
                                <Typography variant="body2" fontWeight="medium">
                                  {formatDate(record.date)}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                  <Avatar sx={{ width: 32, height: 32, fontSize: "0.875rem" }}>
                                    <PersonIcon />
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
                                <Typography variant="body2" sx={{ maxWidth: 300 }}>
                                  {record.details}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                                  {canEdit ? (
                                    <>
                                      <IconButton
                                        size="small"
                                        onClick={() => handleEditMaintenance(record, index)}
                                        sx={{
                                          color: "primary.main",
                                          "&:hover": { backgroundColor: "primary.light", color: "white" },
                                        }}
                                      >
                                        <EditIcon fontSize="small" />
                                      </IconButton>
                                      <IconButton
                                        size="small"
                                        onClick={() => handleDeleteMaintenance(index)}
                                        sx={{
                                          color: "error.main",
                                          "&:hover": { backgroundColor: "error.light", color: "white" },
                                        }}
                                      >
                                        <DeleteIcon fontSize="small" />
                                      </IconButton>
                                    </>
                                  ) : (
                                    <Typography variant="caption" color="text.secondary" sx={{ fontStyle: "italic" }}>
                                      Chỉ sửa được trong ngày
                                    </Typography>
                                  )}
                                </Box>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {/* Maintenance Summary */}
                  <Card sx={{ mt: 4, borderRadius: 2, boxShadow: 2 }}>
                    <CardContent
                      sx={{
                        p: 2,
                        "&:last-child": {
                          pb: 1,
                        },
                      }}
                    >
                      <Grid container spacing={2}>
                        <Grid item size={{ xs: 2 }}>
                          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                            Tóm tắt bảo trì:
                          </Typography>
                        </Grid>
                        <Grid item size={{ xs: 5 }}>
                          <Box sx={{ textAlign: "center" }}>
                            <Typography variant="h4" fontWeight="bold" color="primary.main">
                              {equipment.maintenanceHistory.length}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Tổng số lần bảo trì
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item size={{ xs: 5 }}>
                          <Box sx={{ textAlign: "center" }}>
                            <Typography variant="h4" fontWeight="bold" color="error.main">
                              {formatCurrencyVND(
                                equipment.maintenanceHistory.reduce((total, record) => total + (record.cost || 0), 0),
                              )}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Tổng chi phí bảo trì
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Box
                  sx={{
                    textAlign: "center",
                    py: 6,
                    border: "2px dashed #e0e0e0",
                    borderRadius: 2,
                    backgroundColor: "#fafafa",
                  }}
                >
                  <MaintenanceIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Chưa có lịch sử bảo trì
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Thiết bị này chưa được bảo trì lần nào
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={onAddMaintenance}
                    sx={{ textTransform: "none" }}
                  >
                    Thêm bản ghi bảo trì đầu tiên
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </DialogContent>

        <DialogActions
          sx={{
            px: 2,
            py: 2,
            // backgroundColor: "#f8f9fa",
            borderTop: "1px solid #e0e0e0",
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ flexGrow: 1 }}>
            ID thiết bị: {equipment._id}
          </Typography>
          <Button
            onClick={onClose}
            variant="contained"
            sx={{
              minWidth: 120,
              borderRadius: 2,
              textTransform: "none",
            }}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {/* Status Change Confirmation */}
      <ConfirmDialog
        open={statusConfirmOpen}
        title="Xác nhận thay đổi trạng thái"
        description={`Bạn có chắc muốn thay đổi trạng thái thiết bị "${equipment.name}" thành "${getStatusText(selectedStatus)}"?`}
        confirmText="Xác nhận"
        cancelText="Hủy"
        onConfirm={handleConfirmStatusChange}
        onCancel={handleCancelStatusChange}
      />
    </>
  )
}
