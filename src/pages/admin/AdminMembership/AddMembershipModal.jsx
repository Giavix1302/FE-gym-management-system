import React, { useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  InputAdornment,
  IconButton,
  Divider,
  Alert,
} from "@mui/material"
import {
  Close as CloseIcon,
  CloudUpload as UploadIcon,
  Image as ImageIcon,
  AttachMoney as MoneyIcon,
  FitnessCenter as GymIcon,
} from "@mui/icons-material"

export default function AddMembershipModal({ open, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discount: "",
    durationMonth: "",
    type: "gym",
    bannerURL: "",
  })

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

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

    if (!formData.name.trim()) {
      newErrors.name = "Tên gói là bắt buộc"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Mô tả là bắt buộc"
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = "Giá phải lớn hơn 0"
    }

    if (formData.discount && formData.discount < 0) {
      newErrors.discount = "Giảm giá không thể âm"
    }

    if (formData.discount && formData.price && formData.discount >= formData.price) {
      newErrors.discount = "Giảm giá phải nhỏ hơn giá gốc"
    }

    if (!formData.durationMonth || formData.durationMonth <= 0) {
      newErrors.durationMonth = "Thời hạn phải lớn hơn 0"
    }

    if (!formData.type) {
      newErrors.type = "Loại gói là bắt buộc"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Prepare data to save
      const packageData = {
        ...formData,
        price: parseFloat(formData.price),
        discount: formData.discount ? parseFloat(formData.discount) : 0,
        durationMonth: parseInt(formData.durationMonth),
        createdAt: Date.now(),
        updatedAt: null,
        _destroy: false,
        totalUsers: 0,
      }

      // Call the parent component's save function
      await onSave(packageData)

      // Reset form
      handleReset()
      onClose()
    } catch (error) {
      console.error("Error saving package:", error)
      // You could show an error message here
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      discount: "",
      durationMonth: "",
      type: "gym",
      bannerURL: "",
    })
    setErrors({})
  }

  const handleClose = () => {
    handleReset()
    onClose()
  }

  const formatPrice = (value) => {
    if (!value) return ""
    return new Intl.NumberFormat("vi-VN").format(value)
  }

  const calculateFinalPrice = () => {
    const price = parseFloat(formData.price) || 0
    const discount = parseFloat(formData.discount) || 0
    return price - discount
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <GymIcon color="primary" sx={{ fontSize: 28 }} />
            <Typography variant="h5" fontWeight="bold" color="primary.main">
              Thêm gói tập mới
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ py: 3 }}>
        <Grid container spacing={3}>
          {/* Left Column */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" fontWeight="bold" gutterBottom color="primary.main">
              Thông tin cơ bản
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <TextField
                label="Tên gói tập"
                variant="outlined"
                fullWidth
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
                placeholder="VD: Gói tập gym cao cấp"
              />

              <TextField
                label="Mô tả"
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                error={!!errors.description}
                helperText={errors.description}
                placeholder="Mô tả chi tiết về gói tập..."
              />

              <FormControl fullWidth error={!!errors.type}>
                <InputLabel>Loại gói</InputLabel>
                <Select
                  value={formData.type}
                  onChange={(e) => handleInputChange("type", e.target.value)}
                  label="Loại gói"
                >
                  <MenuItem value="gym">Gym</MenuItem>
                  <MenuItem value="vip">VIP</MenuItem>
                  <MenuItem value="student">Sinh viên</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Thời hạn (tháng)"
                variant="outlined"
                fullWidth
                type="number"
                value={formData.durationMonth}
                onChange={(e) => handleInputChange("durationMonth", e.target.value)}
                error={!!errors.durationMonth}
                helperText={errors.durationMonth}
                InputProps={{
                  inputProps: { min: 1, max: 24 },
                }}
              />
            </Box>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" fontWeight="bold" gutterBottom color="primary.main">
              Giá cả & Hình ảnh
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <TextField
                label="Giá gốc"
                variant="outlined"
                fullWidth
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                error={!!errors.price}
                helperText={errors.price}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MoneyIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,
                  inputProps: { min: 0 },
                }}
                placeholder="300000"
              />

              <TextField
                label="Giảm giá (tùy chọn)"
                variant="outlined"
                fullWidth
                type="number"
                value={formData.discount}
                onChange={(e) => handleInputChange("discount", e.target.value)}
                error={!!errors.discount}
                helperText={errors.discount}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MoneyIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,
                  inputProps: { min: 0 },
                }}
                placeholder="50000"
              />

              <TextField
                label="URL Banner"
                variant="outlined"
                fullWidth
                value={formData.bannerURL}
                onChange={(e) => handleInputChange("bannerURL", e.target.value)}
                placeholder="https://example.com/banner.jpg"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ImageIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Preview Banner */}
              {formData.bannerURL && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Xem trước banner:
                  </Typography>
                  <img
                    src={formData.bannerURL}
                    alt="Banner preview"
                    style={{
                      width: "100%",
                      height: "120px",
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
            </Box>
          </Grid>
        </Grid>

        {/* Price Summary */}
        {formData.price && (
          <>
            <Divider sx={{ my: 3 }} />
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                <strong>Tóm tắt giá:</strong>
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <span>Giá gốc:</span>
                <span>{formatPrice(formData.price)} VNĐ</span>
              </Box>
              {formData.discount > 0 && (
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <span>Giảm giá:</span>
                  <span style={{ color: "#f44336" }}>-{formatPrice(formData.discount)} VNĐ</span>
                </Box>
              )}
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
                <span>Giá cuối cùng:</span>
                <span style={{ color: "#2e7d32", fontSize: "1.1rem" }}>{formatPrice(calculateFinalPrice())} VNĐ</span>
              </Box>
            </Alert>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} variant="outlined" color="inherit" sx={{ minWidth: 100 }}>
          Hủy
        </Button>
        <Button onClick={handleSave} variant="contained" sx={{ minWidth: 100 }} disabled={isLoading}>
          {isLoading ? "Đang lưu..." : "Lưu gói tập"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
