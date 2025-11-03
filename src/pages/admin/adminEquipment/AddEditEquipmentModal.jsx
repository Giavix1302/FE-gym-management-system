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
  Chip,
  OutlinedInput,
  Checkbox,
  ListItemText,
} from "@mui/material"
import {
  Close as CloseIcon,
  CloudUpload as UploadIcon,
  Image as ImageIcon,
  AttachMoney as MoneyIcon,
  FitnessCenter as GymIcon,
  Edit as EditIcon,
  Add as AddIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import { formatCurrencyVND } from "~/utils/common"
import styled from "@emotion/styled"
import useEquipmentForAdminStore from "~/stores/useEquipmentForAdminStore"
import useLocationStore from "~/stores/useLocationStore"
import { addEquipmentAPI, updateEquipmentAPI } from "~/apis/equipment"
import { toast } from "react-toastify"
import { EQUIPMENT_MUSCLE_CATEGORIES, MUSCLE_CATEGORY_LABELS } from "~/utils/constants"

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

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

export default function AddEditEquipmentModal({
  open,
  onClose,
  editEquipment = null, // Equipment to edit, null for add mode
  handleUpdateSuccess,
}) {
  // Store
  const { addEquipment, updateEquipment } = useEquipmentForAdminStore()
  const { locations } = useLocationStore()

  // Determine if we're in edit mode
  const isEditMode = !!editEquipment

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    price: "",
    locationId: "",
    muscleCategories: [],
    purchaseDate: "",
    imageFile: null,
    preview: "",
    currentImageURL: "", // For edit mode - existing image URL
  })

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  // Get muscle categories options
  const muscleCategoryOptions = Object.entries(EQUIPMENT_MUSCLE_CATEGORIES).map(([key, value]) => ({
    value,
    label: MUSCLE_CATEGORY_LABELS[value],
  }))

  // Effect to populate form when editing
  useEffect(() => {
    if (isEditMode && editEquipment && open) {
      setFormData({
        name: editEquipment.name || "",
        brand: editEquipment.brand || "",
        price: editEquipment.price?.toString() || "",
        locationId: editEquipment.locationId || "",
        muscleCategories: [...(editEquipment?.muscleCategories ?? [])],
        purchaseDate: editEquipment.purchaseDate || "",
        imageFile: null,
        preview: "",
        currentImageURL: editEquipment.image || "",
      })
    } else if (!isEditMode && open) {
      // Reset form for add mode
      handleReset()
    }
  }, [isEditMode, editEquipment, open])

  const handleInputChange = (field, value) => {
    if (field === "imageFile") {
      const file = value[0]
      if (file) {
        const url = URL.createObjectURL(file)
        setFormData((prev) => ({
          ...prev,
          imageFile: file,
          preview: url,
        }))
      }
    } else if (field === "muscleCategories") {
      setFormData((prev) => ({
        ...prev,
        [field]: typeof value === "string" ? value.split(",") : value,
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
      newErrors.name = "Tên thiết bị là bắt buộc"
    }

    if (!formData.brand.trim()) {
      newErrors.brand = "Thương hiệu là bắt buộc"
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = "Giá phải lớn hơn 0"
    }

    if (!formData.locationId) {
      newErrors.locationId = "Vui lòng chọn cơ sở"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return
    setIsLoading(true)

    try {
      // Tạo FormData
      const formDataToSend = new FormData()
      formDataToSend.append("name", formData.name.trim())
      formDataToSend.append("brand", formData.brand.trim())
      formDataToSend.append("price", parseFloat(formData.price))
      formDataToSend.append("locationId", formData.locationId)
      formDataToSend.append("muscleCategories", JSON.stringify(formData.muscleCategories))

      if (formData.purchaseDate) {
        formDataToSend.append("purchaseDate", formData.purchaseDate)
      }

      // Nếu có ảnh mới, append file
      if (formData.imageFile) {
        formDataToSend.append("image", formData.imageFile)
      }

      let data
      if (isEditMode) {
        // Call update API
        data = await updateEquipmentAPI(editEquipment._id, formDataToSend)

        // Update equipment in store
        updateEquipment(editEquipment._id, data.equipment)
        toast.success("Cập nhật thiết bị thành công")
        handleUpdateSuccess(editEquipment._id, data.equipment)
      } else {
        // Call add API
        data = await addEquipmentAPI(formDataToSend)

        // Add equipment to store
        addEquipment(data.equipment)
        toast.success("Thêm thiết bị thành công")
      }

      handleClose()
    } catch (error) {
      console.error("Error saving equipment:", error)
      toast.error(isEditMode ? "Cập nhật thiết bị thất bại" : "Thêm thiết bị thất bại")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    onClose()
    setErrors({})
  }

  const handleReset = () => {
    setFormData({
      name: "",
      brand: "",
      price: "",
      locationId: "",
      muscleCategories: [],
      purchaseDate: "",
      imageFile: null,
      preview: "",
      currentImageURL: "",
    })
    setErrors({})
  }

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      imageFile: null,
      preview: "",
      currentImageURL: "",
    }))
  }

  const getDisplayImage = () => {
    if (formData.preview) return formData.preview
    if (formData.currentImageURL) return formData.currentImageURL
    return null
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2, display: "flex", alignItems: "center", gap: 1 }}>
        <GymIcon color="primary" />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {isEditMode ? "Chỉnh sửa thiết bị" : "Thêm thiết bị mới"}
        </Typography>
        <IconButton aria-label="close" onClick={handleClose} sx={{ color: (theme) => theme.palette.grey[500] }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Left Column */}
          <Grid item size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom color="primary.main">
              Thông tin cơ bản
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <TextField
                size="small"
                label="Tên thiết bị"
                variant="outlined"
                fullWidth
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
                placeholder="VD: Máy chạy bộ"
              />

              <TextField
                size="small"
                label="Thương hiệu"
                variant="outlined"
                fullWidth
                value={formData.brand}
                onChange={(e) => handleInputChange("brand", e.target.value)}
                error={!!errors.brand}
                helperText={errors.brand}
                placeholder="VD: NordicTrack"
              />

              <TextField
                size="small"
                label="Giá tiền"
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
                placeholder="1000000"
              />

              <FormControl fullWidth error={!!errors.locationId}>
                <InputLabel>Cơ sở</InputLabel>
                <Select
                  size="small"
                  value={formData.locationId}
                  onChange={(e) => handleInputChange("locationId", e.target.value)}
                  label="Cơ sở"
                  startAdornment={
                    <InputAdornment position="start">
                      <LocationIcon color="action" />
                    </InputAdornment>
                  }
                >
                  {locations.map((location) => (
                    <MenuItem key={location._id} value={location._id}>
                      {location.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.locationId && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                    {errors.locationId}
                  </Typography>
                )}
              </FormControl>

              <TextField
                size="small"
                label="Ngày mua"
                variant="outlined"
                fullWidth
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => handleInputChange("purchaseDate", e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>
          </Grid>

          {/* Right Column */}
          <Grid item size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom color="primary.main">
              Nhóm cơ & Hình ảnh
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <FormControl fullWidth>
                <InputLabel>Nhóm cơ tập luyện</InputLabel>
                <Select
                  multiple
                  value={formData.muscleCategories}
                  onChange={(e) => handleInputChange("muscleCategories", e.target.value)}
                  input={<OutlinedInput label="Nhóm cơ tập luyện" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={MUSCLE_CATEGORY_LABELS[value]}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {muscleCategoryOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Checkbox checked={formData.muscleCategories.indexOf(option.value) > -1} />
                      <ListItemText primary={option.label} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
              >
                {isEditMode && formData.currentImageURL && !formData.imageFile
                  ? "Thay đổi hình ảnh"
                  : "Upload hình ảnh"}
                <VisuallyHiddenInput
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleInputChange("imageFile", e.target.files)}
                />
              </Button>

              {/* Preview Image */}
              {getDisplayImage() && (
                <Box sx={{ mt: 1, position: "relative", display: "inline-block" }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {formData.imageFile ? "Ảnh mới:" : "Ảnh hiện tại:"}
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
                    alt="Equipment preview"
                    style={{
                      width: "100%",
                      height: "200px",
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
                <strong>Thông tin giá:</strong>
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
                <span>Giá thiết bị:</span>
                <span style={{ color: "#2e7d32", fontSize: "1.1rem" }}>{formatCurrencyVND(formData.price)}</span>
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
          {isLoading ? (isEditMode ? "Đang cập nhật..." : "Đang lưu...") : isEditMode ? "Cập nhật" : "Lưu thiết bị"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
