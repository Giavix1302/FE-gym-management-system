import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  Grid,
  IconButton,
  Alert,
  Stack,
  Chip,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
} from "@mui/material"
import {
  Close as CloseIcon,
  Add as AddIcon,
  Business as BusinessIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Delete as DeleteIcon,
  CloudUpload as UploadIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material"
import { getProvinces, getWardsByProvinceCode, getProvinceByName, getWardByName } from "~/utils/address"

export default function AddEditLocationModal({ open, onClose, location, onSubmit, isEditing = false }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: {
      street: "",
      ward: "",
      province: "",
    },
  })
  const [images, setImages] = useState([])
  const [newImages, setNewImages] = useState([])
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  // Address selection states
  const [provinces, setProvinces] = useState([])
  const [wards, setWards] = useState([])
  const [selectedProvinceCode, setSelectedProvinceCode] = useState("")
  const [selectedWardCode, setSelectedWardCode] = useState("")
  const [loadingWards, setLoadingWards] = useState(false)

  // Image preview state
  const [previewImage, setPreviewImage] = useState("")
  const [previewOpen, setPreviewOpen] = useState(false)

  // Load provinces on component mount
  useEffect(() => {
    const provinceList = getProvinces()
    setProvinces(provinceList)
  }, [])

  // Reset form when modal opens/closes or location changes
  useEffect(() => {
    if (open) {
      if (isEditing && location) {
        setFormData({
          name: location.name || "",
          phone: location.phone || "",
          address: {
            street: location.address?.street || "",
            ward: location.address?.ward || "",
            province: location.address?.province || "",
          },
        })
        setImages(location.images || [])

        // Set selected province and ward codes for editing
        if (location.address?.province) {
          const province = getProvinceByName(location.address.province)
          if (province) {
            setSelectedProvinceCode(province.code)
            const wardList = getWardsByProvinceCode(province.code)
            setWards(wardList)

            if (location.address?.ward) {
              const ward = getWardByName(location.address.ward, province.code)
              if (ward) {
                setSelectedWardCode(ward.code)
              }
            }
          }
        }
      } else {
        setFormData({
          name: "",
          phone: "",
          address: {
            street: "",
            ward: "",
            province: "",
          },
        })
        setImages([])
        setSelectedProvinceCode("")
        setSelectedWardCode("")
        setWards([])
      }
      setNewImages([])
      setErrors({})
      setPreviewImage("")
      setPreviewOpen(false)
    }
  }, [open, location, isEditing])

  // Form validation
  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Tên location là bắt buộc"
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Tên location phải có ít nhất 2 ký tự"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Số điện thoại là bắt buộc"
    } else if (!/^\+[1-9]\d{1,14}$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại phải theo định dạng E.164 (ví dụ: +84901234567)"
    }

    if (!formData.address.street.trim()) {
      newErrors.street = "Đường/Số nhà là bắt buộc"
    }

    if (!formData.address.ward.trim()) {
      newErrors.ward = "Phường/Xã là bắt buộc"
    }

    if (!formData.address.province.trim()) {
      newErrors.province = "Tỉnh/Thành phố là bắt buộc"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle province selection
  const handleProvinceChange = (provinceCode) => {
    setSelectedProvinceCode(provinceCode)
    setSelectedWardCode("")
    setWards([])

    const selectedProvince = provinces.find((p) => p.code === provinceCode)
    if (selectedProvince) {
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          province: selectedProvince.name,
          ward: "",
        },
      }))

      setLoadingWards(true)
      const wardList = getWardsByProvinceCode(provinceCode)
      setWards(wardList)
      setLoadingWards(false)
    }

    // Clear province error
    if (errors.province) {
      setErrors((prev) => ({ ...prev, province: null }))
    }
  }

  // Handle ward selection
  const handleWardChange = (wardCode) => {
    setSelectedWardCode(wardCode)

    const selectedWard = wards.find((w) => w.code === wardCode)
    if (selectedWard) {
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          ward: selectedWard.name,
        },
      }))
    }

    // Clear ward error
    if (errors.ward) {
      setErrors((prev) => ({ ...prev, ward: null }))
    }
  }

  // Image preview handlers
  const handleImagePreview = (imageUrl) => {
    setPreviewImage(imageUrl)
    setPreviewOpen(true)
  }

  // Handle adding image from camera/device
  const handleAddImage = () => {
    document.getElementById("image-upload").click()
  }
  const handleInputChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
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
        [field]: null,
      }))
    }
  }

  // Handle image upload
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files)
    const totalImages = images.length + newImages.length + files.length

    if (totalImages > 6) {
      setErrors((prev) => ({
        ...prev,
        images: "Tối đa 6 hình ảnh",
      }))
      return
    }

    // Validate file types and sizes
    const validFiles = []
    for (const file of files) {
      if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/)) {
        setErrors((prev) => ({
          ...prev,
          images: "Chỉ chấp nhận file JPG, PNG, WEBP",
        }))
        continue
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          images: "Kích thước file không được vượt quá 5MB",
        }))
        continue
      }

      validFiles.push(file)
    }

    setNewImages((prev) => [...prev, ...validFiles])
    setErrors((prev) => ({ ...prev, images: null }))
  }

  // Remove existing image
  const handleRemoveExistingImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  // Remove new image
  const handleRemoveNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index))
  }

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const submitData = new FormData()
      submitData.append("name", formData.name.trim())
      submitData.append("phone", formData.phone.trim())
      submitData.append("address", JSON.stringify(formData.address))

      // Add existing images to keep (for edit mode)
      if (isEditing) {
        images.forEach((imageUrl) => {
          submitData.append("images", imageUrl)
        })
      }

      // Add new images
      newImages.forEach((file) => {
        submitData.append("locationImgs", file)
      })

      if (isEditing) {
        await onSubmit(location._id, submitData)
      } else {
        await onSubmit(submitData)
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setErrors((prev) => ({
        ...prev,
        submit: "Đã có lỗi xảy ra. Vui lòng thử lại.",
      }))
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      onClose()
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2, display: "flex", alignItems: "center", gap: 1 }}>
        <BusinessIcon color="primary" />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {isEditing ? `Sửa Location: ${location?.name}` : "Thêm Location Mới"}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          disabled={loading}
          sx={{ color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit} sx={{ overflowY: "auto" }}>
        <DialogContent dividers>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item size={{ xs: 12 }}>
              <Typography
                variant="h6"
                fontWeight="bold"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <BusinessIcon color="primary" />
                Thông tin cơ bản
              </Typography>
            </Grid>

            <Grid item size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Tên Location *"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
                variant="outlined"
                placeholder="Ví dụ: The gym Nguyễn Kiệm"
              />
            </Grid>

            <Grid item size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Số điện thoại *"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                error={!!errors.phone}
                helperText={errors.phone}
                variant="outlined"
                placeholder="+84901234567"
                InputProps={{
                  startAdornment: <PhoneIcon sx={{ mr: 1, color: "text.secondary" }} />,
                }}
              />
            </Grid>

            {/* Address Information */}
            <Grid item size={{ xs: 12 }}>
              <Typography
                variant="h6"
                fontWeight="bold"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <LocationIcon color="primary" />
                Địa chỉ
              </Typography>
            </Grid>

            <Grid item size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Đường/Số nhà *"
                value={formData.address.street}
                onChange={(e) => handleInputChange("address.street", e.target.value)}
                error={!!errors.street}
                helperText={errors.street}
                variant="outlined"
                placeholder="Ví dụ: 123 Lê Lợi"
              />
            </Grid>

            <Grid item size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth variant="outlined" error={!!errors.province}>
                <InputLabel>Tỉnh/Thành phố *</InputLabel>
                <Select
                  value={selectedProvinceCode}
                  onChange={(e) => handleProvinceChange(e.target.value)}
                  label="Tỉnh/Thành phố *"
                >
                  <MenuItem value="">
                    <em>Chọn tỉnh/thành phố</em>
                  </MenuItem>
                  {provinces.map((province) => (
                    <MenuItem key={province.code} value={province.code}>
                      {province.nameWithType}
                    </MenuItem>
                  ))}
                </Select>
                {errors.province && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                    {errors.province}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth variant="outlined" error={!!errors.ward} disabled={!selectedProvinceCode}>
                <InputLabel>Phường/Xã/Thị trấn *</InputLabel>
                <Select
                  value={selectedWardCode}
                  onChange={(e) => handleWardChange(e.target.value)}
                  label="Phường/Xã/Thị trấn *"
                  endAdornment={loadingWards ? <CircularProgress size={20} /> : null}
                >
                  <MenuItem value="">
                    <em>{selectedProvinceCode ? "Chọn phường/xã" : "Vui lòng chọn tỉnh/thành phố trước"}</em>
                  </MenuItem>
                  {wards.map((ward) => (
                    <MenuItem key={ward.code} value={ward.code}>
                      {ward.nameWithType}
                    </MenuItem>
                  ))}
                </Select>
                {errors.ward && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                    {errors.ward}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Images */}
            <Grid item size={{ xs: 12 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  Hình ảnh Location ({images.length + newImages.length}/6)
                </Typography>
                {images.length + newImages.length < 6 && (
                  <Button variant="outlined" size="small" startIcon={<AddIcon />} onClick={handleAddImage}>
                    Thêm ảnh
                  </Button>
                )}
              </Stack>

              {/* Current and New Images Gallery */}
              <ImageList
                cols={3}
                gap={8}
                sx={{
                  maxHeight: 400,
                  overflow: "auto",
                }}
              >
                {/* Existing Images */}
                {images.map((imageUrl, index) => (
                  <ImageListItem key={`existing-${index}`} sx={{ position: "relative" }}>
                    <img
                      src={`${imageUrl}?w=300&h=300&fit=crop`}
                      alt={`Current ${index + 1}`}
                      loading="lazy"
                      style={{
                        cursor: "pointer",
                        aspectRatio: "1/1",
                        objectFit: "cover",
                      }}
                      onClick={() => handleImagePreview(imageUrl)}
                    />
                    <ImageListItemBar
                      sx={{
                        background:
                          "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
                      }}
                      position="top"
                      actionIcon={
                        <Stack direction="row" spacing={1}>
                          <IconButton
                            sx={{ color: "white" }}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleImagePreview(imageUrl)
                            }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            sx={{ color: "white" }}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRemoveExistingImage(index)
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      }
                      actionPosition="right"
                    />
                  </ImageListItem>
                ))}

                {/* New Images */}
                {newImages.map((file, index) => {
                  const imageUrl = URL.createObjectURL(file)
                  return (
                    <ImageListItem key={`new-${index}`} sx={{ position: "relative" }}>
                      <img
                        src={imageUrl}
                        alt={`New ${index + 1}`}
                        loading="lazy"
                        style={{
                          cursor: "pointer",
                          aspectRatio: "1/1",
                          objectFit: "cover",
                        }}
                        onClick={() => handleImagePreview(imageUrl)}
                      />

                      {/* New Image Badge */}
                      <Box
                        sx={{
                          position: "absolute",
                          top: 8,
                          left: 8,
                          bgcolor: "#FFA62B",
                          color: "white",
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          fontSize: "0.75rem",
                          fontWeight: "bold",
                        }}
                      >
                        Mới
                      </Box>

                      <ImageListItemBar
                        sx={{
                          background:
                            "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
                        }}
                        position="top"
                        actionIcon={
                          <Stack direction="row" spacing={1}>
                            <IconButton
                              sx={{ color: "white" }}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleImagePreview(imageUrl)
                              }}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              sx={{ color: "white" }}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleRemoveNewImage(index)
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        }
                        actionPosition="right"
                      />
                    </ImageListItem>
                  )
                })}
              </ImageList>

              {/* Empty State */}
              {images.length + newImages.length === 0 && (
                <Box
                  sx={{
                    border: "2px dashed",
                    borderColor: "grey.300",
                    borderRadius: 2,
                    p: 4,
                    textAlign: "center",
                    color: "grey.500",
                  }}
                >
                  <UploadIcon sx={{ fontSize: 48, mb: 2 }} />
                  <Typography variant="body1">Nhấn 'Thêm ảnh' để thêm hình ảnh location</Typography>
                </Box>
              )}

              {/* Upload Input */}
              <input
                accept="image/jpeg,image/jpg,image/png,image/webp"
                style={{ display: "none" }}
                id="image-upload"
                multiple
                type="file"
                onChange={handleImageUpload}
                disabled={images.length + newImages.length >= 6}
              />

              {errors.images && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {errors.images}
                </Alert>
              )}

              {/* Image Info */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  * Tối đa 6 hình ảnh. Chấp nhận file JPG, PNG, WEBP. Kích thước tối đa 5MB/file.
                </Typography>
                {newImages.length > 0 && (
                  <Typography variant="caption" color="primary" sx={{ display: "block", mt: 0.5 }}>
                    Có {newImages.length} hình ảnh mới sẽ được tải lên khi lưu
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>

          {/* Submit Error */}
          {errors.submit && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errors.submit}
            </Alert>
          )}
        </DialogContent>
      </Box>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} disabled={loading} color="inherit">
          Hủy
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          startIcon={isEditing ? <BusinessIcon /> : <AddIcon />}
          sx={{ minWidth: 120 }}
        >
          {loading ? "Đang xử lý..." : isEditing ? "Cập nhật" : "Thêm mới"}
        </Button>
      </DialogActions>

      {/* Image Preview Dialog */}
      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6">Xem trước hình ảnh</Typography>
          <IconButton onClick={() => setPreviewOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", p: 1 }}>
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "70vh",
                objectFit: "contain",
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Dialog>
  )
}
