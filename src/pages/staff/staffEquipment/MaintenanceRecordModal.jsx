import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material"
import {
  Close as CloseIcon,
  Build as MaintenanceIcon,
  Person as PersonIcon,
  AttachMoney as MoneyIcon,
  CalendarToday as CalendarIcon,
  Edit as EditIcon,
  Add as AddIcon,
} from "@mui/icons-material"
import { toast } from "react-toastify"

export default function MaintenanceRecordModal({
  open,
  onClose,
  equipmentId,
  equipmentName,
  editRecord = null, // Record to edit, null for add mode
  recordIndex = null, // Index for editing
  onSave,
}) {
  // Determine if we're in edit mode
  const isEditMode = !!editRecord

  const [formData, setFormData] = useState({
    date: "",
    details: "",
    technician: "",
    cost: "",
  })

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  // Effect to populate form when editing
  useEffect(() => {
    if (isEditMode && editRecord && open) {
      setFormData({
        date: editRecord.date || "",
        details: editRecord.details || "",
        technician: editRecord.technician || "",
        cost: editRecord.cost?.toString() || "",
      })
    } else if (!isEditMode && open) {
      // Reset form for add mode with today's date
      const today = new Date().toISOString().split("T")[0]
      setFormData({
        date: today,
        details: "",
        technician: "",
        cost: "",
      })
    }
  }, [isEditMode, editRecord, open])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.date) {
      newErrors.date = "Ngày bảo trì là bắt buộc"
    }

    if (!formData.details.trim()) {
      newErrors.details = "Chi tiết bảo trì là bắt buộc"
    }

    if (!formData.technician.trim()) {
      newErrors.technician = "Tên kỹ thuật viên là bắt buộc"
    }

    if (formData.cost && formData.cost < 0) {
      newErrors.cost = "Chi phí không thể âm"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return
    setIsLoading(true)

    try {
      const maintenanceData = {
        date: formData.date,
        details: formData.details.trim(),
        technician: formData.technician.trim(),
        cost: formData.cost ? parseFloat(formData.cost) : 0,
      }

      await onSave(maintenanceData, recordIndex)
      handleClose()

      toast.success(isEditMode ? "Cập nhật bản ghi bảo trì thành công" : "Thêm bản ghi bảo trì thành công")
    } catch (error) {
      console.error("Error saving maintenance record:", error)
      toast.error(isEditMode ? "Cập nhật bản ghi bảo trì thất bại" : "Thêm bản ghi bảo trì thất bại")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    onClose()
    setErrors({})
  }

  // Check if record is from today (can be edited)
  const isRecordFromToday = () => {
    if (!editRecord || !editRecord.date) return false
    const recordDate = new Date(editRecord.date).toDateString()
    const today = new Date().toDateString()
    return recordDate === today
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2, display: "flex", alignItems: "center", gap: 1 }}>
        <MaintenanceIcon color="warning" />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {isEditMode ? "Chỉnh sửa bản ghi bảo trì" : "Thêm bản ghi bảo trì"}
        </Typography>
        <IconButton aria-label="close" onClick={handleClose} sx={{ color: (theme) => theme.palette.grey[500] }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {/* Equipment Info */}
        <Box sx={{ mb: 3, p: 2, borderRadius: 2, bgcolor: "Background" }}>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            Thiết bị: {equipmentName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ID: {equipmentId}
          </Typography>
        </Box>

        {/* Edit restriction warning */}
        {isEditMode && !isRecordFromToday() && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Bạn chỉ có thể chỉnh sửa bản ghi bảo trì được tạo trong ngày hôm nay.
          </Alert>
        )}

        {/* Form Fields */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          <TextField
            label="Ngày bảo trì"
            variant="outlined"
            fullWidth
            type="date"
            value={formData.date}
            onChange={(e) => handleInputChange("date", e.target.value)}
            error={!!errors.date}
            helperText={errors.date}
            disabled={isEditMode && !isRecordFromToday()}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Kỹ thuật viên"
            variant="outlined"
            fullWidth
            value={formData.technician}
            onChange={(e) => handleInputChange("technician", e.target.value)}
            error={!!errors.technician}
            helperText={errors.technician}
            disabled={isEditMode && !isRecordFromToday()}
            placeholder="VD: Nguyễn Văn A"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Chi tiết bảo trì"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={formData.details}
            onChange={(e) => handleInputChange("details", e.target.value)}
            error={!!errors.details}
            helperText={errors.details}
            disabled={isEditMode && !isRecordFromToday()}
            placeholder="Mô tả chi tiết về công việc bảo trì đã thực hiện..."
          />

          <TextField
            label="Chi phí (VNĐ)"
            variant="outlined"
            fullWidth
            type="number"
            value={formData.cost}
            onChange={(e) => handleInputChange("cost", e.target.value)}
            error={!!errors.cost}
            helperText={errors.cost}
            disabled={isEditMode && !isRecordFromToday()}
            placeholder="0"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MoneyIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,
              inputProps: { min: 0 },
            }}
          />
        </Box>

        {/* Add new maintenance info */}
        {!isEditMode && (
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Lưu ý:</strong> Khi thêm bản ghi bảo trì, trạng thái thiết bị sẽ được tự động chuyển thành "Đang
              bảo trì".
            </Typography>
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} variant="outlined" color="inherit" sx={{ minWidth: 100 }}>
          Hủy
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{ minWidth: 100 }}
          disabled={isLoading || (isEditMode && !isRecordFromToday())}
          startIcon={isEditMode ? <EditIcon /> : <AddIcon />}
        >
          {isLoading ? (isEditMode ? "Đang cập nhật..." : "Đang lưu...") : isEditMode ? "Cập nhật" : "Lưu bản ghi"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
