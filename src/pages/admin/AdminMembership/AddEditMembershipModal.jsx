import React, { useState, useEffect } from "react"
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
  Edit as EditIcon,
  Add as AddIcon,
} from "@mui/icons-material"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import DiscountIcon from "@mui/icons-material/Discount"
import { formatCurrencyVND } from "~/utils/common"
import styled from "@emotion/styled"
import useMembershipStore from "~/stores/useMembershipStore"
import { addMembershipAPI, updateMembershipAPI } from "~/apis/membership"
import { toast } from "react-toastify"
// import { useNavigate } from "react-router-dom"

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
})

export default function AddEditMembershipModal({
  open,
  onClose,
  editPackage = null, // Package to edit, null for add mode
  handleUpdateSuccess,
}) {
  // navigate
  // const navigate = useNavigate()
  // store
  const { addPackage, updatePackage } = useMembershipStore()

  // Determine if we're in edit mode
  const isEditMode = !!editPackage

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discount: "",
    durationMonth: "",
    type: "gym",
    bannerFile: null,
    preview: "",
    feature: "",
    features: [],
    currentBannerURL: "", // For edit mode - existing banner URL
  })
  console.log("🚀 ~ AddEditMembershipModal ~ formData:", formData)

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  // Effect to populate form when editing
  useEffect(() => {
    if (isEditMode && editPackage && open) {
      setFormData({
        name: editPackage.name || "",
        description: editPackage.description || "",
        price: editPackage.price?.toString() || "",
        discount: editPackage.discount?.toString() || "",
        durationMonth: editPackage.durationMonth?.toString() || "",
        type: editPackage.type || "gym",
        features: [...(editPackage?.features ?? [])],
        feature: editPackage?.features.join("; ") || "",
        bannerFile: null,
        preview: "",
        currentBannerURL: editPackage.bannerURL || "",
      })
    } else if (!isEditMode && open) {
      console.log("🚀 ~ AddEditMembershipModal ~ isEditMode:", isEditMode)
      // Reset form for add mode
      handleReset()
    }
  }, [isEditMode, editPackage, open])

  const handleInputChange = (field, value) => {
    if (field === "bannerFile") {
      const file = value[0]
      if (file) {
        const url = URL.createObjectURL(file)
        setFormData((prev) => ({
          ...prev,
          bannerFile: file,
          preview: url,
        }))
      }
    } else if (field === "feature") {
      console.log("xử lí features ....", value)
      // Tách thành mảng
      const arr = value.split(";")

      // Xóa khoảng trắng thừa (trim)
      const cleanArr = arr.map((item) => item.trim())

      setFormData((prev) => ({
        ...prev,
        features: [...cleanArr],
        [field]: value,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }))
    }

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
    if (!formData.feature.trim()) {
      newErrors.feature = "Quyền lợi là bắt buộc"
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = "Giá phải lớn hơn 0"
    }

    if (formData.discount && formData.discount < 0) {
      newErrors.discount = "Giảm giá không thể âm"
    }

    if (formData.discount && formData.price && parseFloat(formData.discount) >= parseFloat(formData.price)) {
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
    if (!validateForm()) return
    setIsLoading(true)

    console.log("🚀 ~ AddEditMembershipModal ~ formData: 1", formData)

    try {
      console.log("🚀 ~ AddEditMembershipModal ~ formData: 2", formData)

      // Tạo FormData
      const formDataToSend = new FormData()
      formDataToSend.append("name", formData.name)
      formDataToSend.append("durationMonth", parseInt(formData.durationMonth))
      formDataToSend.append("price", parseFloat(formData.price))
      formDataToSend.append("discount", formData.discount ? parseFloat(formData.discount) : 0)
      formDataToSend.append("description", formData.description)
      formDataToSend.append("type", formData.type)
      formDataToSend.append("features", JSON.stringify(formData.features))

      // xử lí mảng của feature JSON.stringfy

      if (formData.bannerFile === null && !isEditMode) {
        toast.error("Vui lòng thêm ảnh cho gói tập")
        return
      }

      // Nếu có ảnh mới, append file
      if (formData.bannerFile) {
        formDataToSend.append("banner", formData.bannerFile)
      }

      let data
      if (isEditMode) {
        // Call update API
        console.log("🚀 ~ Updating package:", editPackage._id)
        // Debug formData
        for (let [key, value] of formDataToSend.entries()) {
          console.log(key, value)
        }
        data = await updateMembershipAPI(editPackage._id, formDataToSend)
        console.log("🚀 ~ handleSave ~ formDataToSend:", formDataToSend)

        // Update package in store
        updatePackage(editPackage._id, data.updatedMembership)
        toast.success("Cập nhật gói tập thành công")
        handleUpdateSuccess(editPackage._id, data.updatedMembership)
      } else {
        // Call add API
        console.log("🚀 ~ Adding new package")
        data = await addMembershipAPI(formDataToSend)

        // Add new membership to store
        addPackage(data.membership)
        toast.success("Thêm gói tập thành công")
      }

      // Reset form and close
      handleReset()
      onClose()
    } catch (error) {
      console.error("Error saving package:", error)
      toast.error(isEditMode ? "Cập nhật gói tập thất bại" : "Thêm gói tập thất bại")
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
      bannerFile: null,
      features: [],
      feature: "",
      preview: "",
      currentBannerURL: "",
    })
    setErrors({})
  }

  const handleClose = () => {
    handleReset()
    onClose()
  }

  const calculateFinalPrice = () => {
    const price = parseFloat(formData.price) || 0
    const discount = parseFloat(formData.discount) || 0
    return price - (price * discount) / 100
  }

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      preview: "",
      bannerFile: null,
      ...(isEditMode && { currentBannerURL: "" }), // Clear current banner in edit mode
    }))
  }

  // Get display image (preview for new upload or current banner for edit mode)
  const getDisplayImage = () => {
    if (formData.preview) return formData.preview
    if (isEditMode && formData.currentBannerURL) return formData.currentBannerURL
    return null
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
            {isEditMode ? (
              <EditIcon color="primary" sx={{ fontSize: 28 }} />
            ) : (
              <GymIcon color="primary" sx={{ fontSize: 28 }} />
            )}
            <Typography variant="h5" fontWeight="bold" color="primary.main">
              {isEditMode ? "Chỉnh sửa gói tập" : "Thêm gói tập mới"}
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        {isEditMode && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, ml: 5 }}>
            ID: {editPackage?._id}
          </Typography>
        )}
      </DialogTitle>

      <DialogContent dividers sx={{ py: 2 }}>
        <Grid container spacing={2}>
          {/* Left Column */}
          <Grid item size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom color="primary.main">
              Thông tin cơ bản
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                size="small"
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
                size="small"
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
                  size="small"
                  value={formData.type}
                  onChange={(e) => handleInputChange("type", e.target.value)}
                  label="Loại gói"
                >
                  <MenuItem value="gym">Gym</MenuItem>
                  <MenuItem value="yoga">Yoga</MenuItem>
                  <MenuItem value="boxing">Boxing</MenuItem>
                  <MenuItem value="dance">Dance</MenuItem>
                  <MenuItem value="vip">VIP</MenuItem>
                  <MenuItem value="student">Sinh viên</MenuItem>
                </Select>
              </FormControl>

              <TextField
                size="small"
                label="Thời hạn (tháng)"
                variant="outlined"
                fullWidth
                type="number"
                value={formData.durationMonth}
                onChange={(e) => handleInputChange("durationMonth", e.target.value)}
                error={!!errors.durationMonth}
                helperText={errors.durationMonth}
              />
              <TextField
                size="small"
                label="Quyền lợi"
                variant="outlined"
                multiline
                rows={3}
                fullWidth
                value={formData.feature}
                onChange={(e) => handleInputChange("feature", e.target.value)}
                error={!!errors.feature}
                helperText={errors.feature}
                placeholder="Quyền lợi 1; quyền lợi 2; ...."
              />
            </Box>
          </Grid>

          {/* Right Column */}
          <Grid item size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom color="primary.main">
              Giá cả & Hình ảnh
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <TextField
                size="small"
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
                size="small"
                label="Giảm giá (%)"
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
                      <DiscountIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  inputProps: { min: 0 },
                }}
                placeholder="10"
              />

              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
              >
                {isEditMode && formData.currentBannerURL && !formData.bannerFile ? "Thay đổi Banner" : "Upload Banner"}
                <VisuallyHiddenInput
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleInputChange("bannerFile", e.target.files)}
                />
              </Button>

              {/* Preview Banner */}
              {getDisplayImage() && (
                <Box sx={{ mt: 1, position: "relative", display: "inline-block" }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {formData.bannerFile ? "Ảnh mới:" : "Ảnh hiện tại:"}
                  </Typography>

                  {/* Nút X để xóa ảnh */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 30,
                      right: 6,
                      backgroundColor: "rgba(0,0,0,0.6)",
                      color: "white",
                      borderRadius: "50%",
                      width: 24,
                      height: 24,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                      zIndex: 1,
                    }}
                    onClick={handleRemoveImage}
                  >
                    <CloseIcon fontSize="small" />
                  </Box>

                  <img
                    src={getDisplayImage()}
                    alt="Banner preview"
                    style={{
                      width: "100%",
                      height: "150px",
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
                <span>{formatCurrencyVND(formData.price)}</span>
              </Box>
              {formData.discount > 0 && (
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <span>Giảm giá:</span>
                  <span style={{ color: "#f44336" }}>-{formData.discount}%</span>
                </Box>
              )}
              <Divider sx={{ my: 1 }} />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: "bold",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <span>Giá cuối:</span>
                <span style={{ color: "#2e7d32", fontSize: "1.1rem" }}>{formatCurrencyVND(calculateFinalPrice())}</span>
              </Box>
            </Alert>
          </>
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
          disabled={isLoading}
          startIcon={isEditMode ? <EditIcon /> : <AddIcon />}
        >
          {isLoading ? (isEditMode ? "Đang cập nhật..." : "Đang lưu...") : isEditMode ? "Cập nhật" : "Lưu gói tập"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
