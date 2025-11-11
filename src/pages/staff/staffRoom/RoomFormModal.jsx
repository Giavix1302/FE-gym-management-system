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
  IconButton,
  Alert,
  InputAdornment,
} from "@mui/material"
import {
  Close as CloseIcon,
  Room as RoomIcon,
  Group as GroupIcon,
  Edit as EditIcon,
  Add as AddIcon,
} from "@mui/icons-material"

export default function RoomFormModal({
  open,
  onClose,
  room = null, // Room data for edit mode
  isEditMode = false,
  onSave,
}) {
  const [formData, setFormData] = useState({
    name: "",
    capacity: "",
  })

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  // Effect to populate form when editing
  useEffect(() => {
    if (isEditMode && room && open) {
      setFormData({
        name: room.name || "",
        capacity: room.capacity?.toString() || "",
      })
    } else if (!isEditMode && open) {
      // Reset form for add mode
      setFormData({
        name: "",
        capacity: "",
      })
    }
    // Clear errors when modal opens
    if (open) {
      setErrors({})
    }
  }, [isEditMode, room, open])

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

    // Validate room name
    if (!formData.name.trim()) {
      newErrors.name = "Tên phòng là bắt buộc"
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Tên phòng phải có ít nhất 2 ký tự"
    } else if (formData.name.trim().length > 50) {
      newErrors.name = "Tên phòng không được quá 50 ký tự"
    }

    // Validate capacity
    if (!formData.capacity) {
      newErrors.capacity = "Sức chứa là bắt buộc"
    } else {
      const capacity = parseInt(formData.capacity)
      if (isNaN(capacity) || capacity <= 0) {
        newErrors.capacity = "Sức chứa phải là số nguyên dương"
      } else if (capacity < 1) {
        newErrors.capacity = "Sức chứa phải ít nhất 1 người"
      } else if (capacity > 1000) {
        newErrors.capacity = "Sức chứa không được quá 1000 người"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return

    setIsLoading(true)

    try {
      const roomData = {
        name: formData.name.trim(),
        capacity: parseInt(formData.capacity),
      }

      await onSave(roomData)
      handleClose()
    } catch (error) {
      console.error("Error saving room:", error)
      // Error will be handled by parent component
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    onClose()
    setErrors({})
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2, display: "flex", alignItems: "center", gap: 1 }}>
        <RoomIcon color="primary" />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {isEditMode ? "Chỉnh sửa phòng" : "Thêm phòng mới"}
        </Typography>
        <IconButton aria-label="close" onClick={handleClose} sx={{ color: (theme) => theme.palette.grey[500] }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {/* Form Fields */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Room Name */}
          <TextField
            label="Tên phòng"
            variant="outlined"
            fullWidth
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
            placeholder="VD: Phòng Yoga A1, Phòng tập 01..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <RoomIcon color="action" />
                </InputAdornment>
              ),
            }}
            inputProps={{
              maxLength: 50,
            }}
          />

          {/* Capacity */}
          <TextField
            label="Sức chứa"
            variant="outlined"
            fullWidth
            type="number"
            value={formData.capacity}
            onChange={(e) => handleInputChange("capacity", e.target.value)}
            error={!!errors.capacity}
            helperText={errors.capacity || "Số lượng người tối đa có thể sử dụng phòng"}
            placeholder="20"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <GroupIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: <InputAdornment position="end">người</InputAdornment>,
              inputProps: {
                min: 1,
                max: 1000,
                step: 1,
              },
            }}
          />

          {/* Info Alert */}
          <Alert severity="info">
            <Typography variant="body2">
              <strong>Lưu ý:</strong> Sau khi tạo phòng, bạn có thể chỉnh sửa thông tin này bất kỳ lúc nào.
              {isEditMode && " Việc thay đổi sức chứa sẽ không ảnh hưởng đến các buổi học đã được lên lịch."}
            </Typography>
          </Alert>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} variant="outlined" color="inherit" sx={{ minWidth: 100 }} disabled={isLoading}>
          Hủy
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{ minWidth: 120 }}
          disabled={isLoading}
          startIcon={isEditMode ? <EditIcon /> : <AddIcon />}
        >
          {isLoading ? (isEditMode ? "Đang cập nhật..." : "Đang lưu...") : isEditMode ? "Cập nhật" : "Tạo phòng"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
