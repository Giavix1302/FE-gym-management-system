import React, { useState, useEffect, useRef } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  IconButton,
  Chip,
  Stack,
  Avatar,
  Divider,
  InputAdornment,
  Card,
  CardMedia,
} from "@mui/material"
import {
  Close as CloseIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  CloudUpload as UploadIcon,
  Room as RoomIcon,
  PhotoCamera as PhotoCameraIcon,
  AttachMoney as MoneyIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material"
import TimeField from "~/components/TimeField"
import dayjs from "dayjs"
import { createClassAPI, updateClassInfoAPI } from "~/apis/class"
import { toast } from "react-toastify"

const DAYS_OF_WEEK = [
  { value: 1, label: "Thứ 2" },
  { value: 2, label: "Thứ 3" },
  { value: 3, label: "Thứ 4" },
  { value: 4, label: "Thứ 5" },
  { value: 5, label: "Thứ 6" },
  { value: 6, label: "Thứ 7" },
  { value: 7, label: "Chủ nhật" },
]

const CLASS_TYPES = [
  { value: "yoga", label: "Yoga" },
  { value: "boxing", label: "Boxing" },
  { value: "dance", label: "Dance" },
  { value: "cardio", label: "Cardio" },
  { value: "strength", label: "Strength" },
]

export default function AddEditClassModal({
  open,
  onClose,
  onSubmit,
  classData,
  trainers = [],
  rooms = [],
  locations = [],
}) {
  const isEditMode = Boolean(classData)
  const fileInputRef = useRef(null)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    classType: "",
    capacity: "",
    price: "",
    startDate: "",
    endDate: "",
    trainers: [],
    recurrence: [],
    image: "",
    imageFile: null,
    locationId: "", // Change back to locationId for selection
  })

  const [errors, setErrors] = useState({})
  const [newRecurrence, setNewRecurrence] = useState({
    dayOfWeek: "",
    startTime: { hour: 0, minute: 0 },
    endTime: { hour: 0, minute: 0 },
    roomId: "",
  })
  const [imagePreview, setImagePreview] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Filter rooms based on selected location
  const availableRooms = formData.locationId
    ? rooms.filter((room) => room.locationId === formData.locationId || room.location?._id === formData.locationId)
    : rooms

  useEffect(() => {
    if (classData) {
      setFormData({
        name: classData.name || "",
        description: classData.description || "",
        classType: classData.classType || "",
        capacity: classData.capacity || "",
        price: classData.price || "",
        startDate: classData.startDate ? classData.startDate.split("T")[0] : "",
        endDate: classData.endDate ? classData.endDate.split("T")[0] : "",
        trainers: classData.trainers || [],
        recurrence: classData.recurrence || [],
        image: classData.image || "",
        imageFile: null,
        locationId: classData.locationId || "", // Load existing location ID
      })
      // Set preview for existing image
      if (classData.image) {
        setImagePreview(classData.image)
      }
    } else {
      setFormData({
        name: "",
        description: "",
        classType: "",
        capacity: "",
        price: "",
        startDate: "",
        endDate: "",
        trainers: [],
        recurrence: [],
        image: "",
        imageFile: null,
        locationId: "",
      })
      setImagePreview(null)
    }
    setErrors({})
  }, [classData, open])

  const handleChange = (field) => (event) => {
    const value = event.target.value

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Clear location-dependent data when location changes
    if (field === "locationId") {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
        recurrence: [], // Clear existing schedules when location changes
      }))
      setNewRecurrence({
        dayOfWeek: "",
        startTime: { hour: 0, minute: 0 },
        endTime: { hour: 0, minute: 0 },
        roomId: "",
      })
    }

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }))
    }
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
      if (!validTypes.includes(file.type)) {
        alert("Vui lòng chọn file hình ảnh hợp lệ (JPEG, JPG, PNG, WebP)")
        return
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        alert("Kích thước file không được vượt quá 5MB")
        return
      }

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target.result)
      }
      reader.readAsDataURL(file)

      // Update form data
      setFormData((prev) => ({
        ...prev,
        imageFile: file,
        image: "", // Clear URL when file is uploaded
      }))
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleDeleteImage = () => {
    setImagePreview(null)
    setFormData((prev) => ({
      ...prev,
      image: "",
      imageFile: null,
    }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleImageUrlChange = (event) => {
    const url = event.target.value
    setFormData((prev) => ({
      ...prev,
      image: url,
      imageFile: null, // Clear file when URL is entered
    }))

    if (url) {
      setImagePreview(url)
    } else {
      setImagePreview(null)
    }

    if (errors.image) {
      setErrors((prev) => ({ ...prev, image: null }))
    }
  }

  const handleTrainerToggle = (trainerId) => {
    setFormData((prev) => {
      const currentTrainers = prev.trainers || []
      const newTrainers = currentTrainers.includes(trainerId)
        ? currentTrainers.filter((id) => id !== trainerId)
        : [...currentTrainers, trainerId]
      return { ...prev, trainers: newTrainers }
    })
  }

  const handleAddRecurrence = () => {
    if (newRecurrence.dayOfWeek && newRecurrence.startTime && newRecurrence.endTime && newRecurrence.roomId) {
      // Check if this exact schedule already exists
      const exists = formData.recurrence.some(
        (rec) =>
          rec.dayOfWeek === newRecurrence.dayOfWeek &&
          rec.startTime?.hour === newRecurrence.startTime.hour &&
          rec.startTime?.minute === newRecurrence.startTime.minute &&
          rec.endTime?.hour === newRecurrence.endTime.hour &&
          rec.endTime?.minute === newRecurrence.endTime.minute &&
          rec.roomId === newRecurrence.roomId,
      )

      if (!exists) {
        setFormData((prev) => ({
          ...prev,
          recurrence: [
            ...prev.recurrence,
            {
              dayOfWeek: newRecurrence.dayOfWeek,
              startTime: {
                hour: newRecurrence.startTime.hour,
                minute: newRecurrence.startTime.minute,
              },
              endTime: {
                hour: newRecurrence.endTime.hour,
                minute: newRecurrence.endTime.minute,
              },
              roomId: newRecurrence.roomId,
            },
          ],
        }))
        setNewRecurrence({
          dayOfWeek: "",
          startTime: { hour: 0, minute: 0 },
          endTime: { hour: 0, minute: 0 },
          roomId: "",
        })
      }
    }
  }

  const handleRemoveRecurrence = (index) => {
    setFormData((prev) => ({
      ...prev,
      recurrence: prev.recurrence.filter((_, i) => i !== index),
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Tên lớp học là bắt buộc"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Mô tả là bắt buộc"
    }

    if (!isEditMode) {
      if (!formData.classType) {
        newErrors.classType = "Loại lớp là bắt buộc"
      }

      if (!formData.price || formData.price <= 0) {
        newErrors.price = "Giá học phí phải lớn hơn 0"
      }

      if (!formData.startDate) {
        newErrors.startDate = "Ngày bắt đầu là bắt buộc"
      }

      if (!formData.endDate) {
        newErrors.endDate = "Ngày kết thúc là bắt buộc"
      }

      if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
        newErrors.endDate = "Ngày kết thúc phải sau ngày bắt đầu"
      }

      if (!formData.locationId) {
        newErrors.locationId = "Vui lòng chọn địa điểm"
      }

      if (formData.recurrence.length === 0) {
        newErrors.recurrence = "Vui lòng thêm ít nhất một lịch học"
      }
    }

    if (!formData.capacity || formData.capacity <= 0) {
      newErrors.capacity = "Sĩ số phải lớn hơn 0"
    }

    if (formData.trainers.length === 0) {
      newErrors.trainers = "Vui lòng chọn ít nhất một huấn luyện viên"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmitClass = async () => {
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Create FormData object for backend
      const submitData = new FormData()

      // Basic fields
      submitData.append("name", formData.name)
      submitData.append("description", formData.description)
      submitData.append("capacity", parseInt(formData.capacity))

      // Handle image - either file upload or URL
      if (formData.imageFile) {
        submitData.append("image", formData.imageFile)
      } else {
        submitData.append("image", formData.image || "")
      }

      // Trainers array as JSON string
      submitData.append("trainers", JSON.stringify(formData.trainers))

      if (!isEditMode) {
        submitData.append("classType", formData.classType)
        submitData.append("price", parseFloat(formData.price))
        submitData.append("locationId", formData.locationId)

        // Format dates to ISO string (matching your data structure)
        const startDate = new Date(formData.startDate + "T00:00:00.000Z").toISOString()
        const endDate = new Date(formData.endDate + "T23:59:59.999Z").toISOString()
        submitData.append("startDate", startDate)
        submitData.append("endDate", endDate)

        // Recurrence data (already in the correct format with dayOfWeek, startTime, endTime, roomId)
        submitData.append("recurrence", JSON.stringify(formData.recurrence))
      }

      if (isEditMode) {
        // Update existing class
        // In real app, you would send formData to API endpoint

        const result = await updateClassInfoAPI(classData._id, submitData)
        console.log("🚀 ~ handleSubmitClass ~ result:", result)
        // update vào store
        toast.success("Đã cập nhật lớp học thành công!")
      } else {
        // Add new class
        const result = await createClassAPI(submitData)
        if (!result.success) {
          toast.error(result.message || "Lỗi tạo lớp")
          return
        }
        toast.success("Đã thêm lớp học mới thành công!")
      }

      // Call parent onSubmit if provided (for any additional handling)
      if (onSubmit) {
        onSubmit(submitData)
      }

      handleClose()
    } catch (error) {
      console.error("Error submitting class:", error)
      toast.error("Có lỗi xảy ra khi lưu lớp học!")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
      classType: "",
      capacity: "",
      price: "",
      startDate: "",
      endDate: "",
      trainers: [],
      recurrence: [],
      image: "",
      imageFile: null,
      locationId: "",
    })
    setErrors({})
    setNewRecurrence({
      dayOfWeek: "",
      startTime: { hour: 0, minute: 0 },
      endTime: { hour: 0, minute: 0 },
      roomId: "",
    })
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    handleDeleteImage()
    onClose()
  }

  const getDayLabel = (dayValue) => {
    return DAYS_OF_WEEK.find((d) => d.value === dayValue)?.label || `Ngày ${dayValue}`
  }

  const getRoomName = (roomId) => {
    const room = availableRooms.find((r) => (r._id || r.id) === roomId)
    return room?.name || `Room ${roomId}`
  }

  const getLocationName = (locationId) => {
    const location = locations.find((loc) => loc._id === locationId)
    return location?.name || `Location ${locationId}`
  }

  // Helper function to get trainer ID (handling both _id and trainerId)
  const getTrainerId = (trainer) => {
    return trainer._id || trainer.trainerId
  }

  // Filter approved trainers only
  const approvedTrainers = trainers.filter((trainer) => trainer.trainerInfo?.isApproved === "approved")

  // Get trainer display info
  const getTrainerDisplayInfo = (trainer) => {
    return {
      id: trainer._id || trainer.trainerId,
      name: trainer.userInfo?.name || "Không có tên",
      avatar: trainer.userInfo?.avatar || "",
      specialization: trainer.trainerInfo?.specialization || "Chưa có chuyên môn",
      rating: trainer.rating || 0,
      totalReviews: trainer.totalReviews || 0,
      experience: trainer.trainerInfo?.experience || "",
      pricePerHour: trainer.trainerInfo?.pricePerHour || 0,
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="h5" fontWeight="bold" color="primary.main">
            {isEditMode ? "Chỉnh sửa lớp học" : "Thêm lớp học mới"}
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          {/* Basic Information */}
          <Grid item size={{ xs: 12 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Thông tin cơ bản
            </Typography>
          </Grid>

          <Grid item size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Tên lớp học"
              value={formData.name}
              onChange={handleChange("name")}
              error={Boolean(errors.name)}
              helperText={errors.name}
              required
              size="small"
            />
          </Grid>

          <Grid item size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Mô tả"
              value={formData.description}
              onChange={handleChange("description")}
              error={Boolean(errors.description)}
              helperText={errors.description}
              multiline
              rows={3}
              required
              size="small"
            />
          </Grid>

          <Grid item size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Sĩ số tối đa"
              type="number"
              value={formData.capacity}
              onChange={handleChange("capacity")}
              error={Boolean(errors.capacity)}
              helperText={errors.capacity}
              InputProps={{
                inputProps: { min: 1 },
              }}
              required
              size="small"
            />
          </Grid>

          {/* Only show these fields in ADD mode */}
          {!isEditMode && (
            <>
              <Grid item size={{ xs: 12, sm: 6 }}>
                <FormControl size="small" fullWidth error={Boolean(errors.classType)} required>
                  <InputLabel>Loại lớp</InputLabel>
                  <Select value={formData.classType} onChange={handleChange("classType")} label="Loại lớp">
                    {CLASS_TYPES.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.classType && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                      {errors.classType}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Học phí (VNĐ)"
                  type="number"
                  value={formData.price}
                  onChange={handleChange("price")}
                  error={Boolean(errors.price)}
                  helperText={errors.price}
                  InputProps={{
                    inputProps: { min: 0, step: 1000 },
                    startAdornment: (
                      <InputAdornment position="start">
                        <MoneyIcon />
                      </InputAdornment>
                    ),
                  }}
                  required
                  size="small"
                />
              </Grid>

              {/* Location Selection */}
              <Grid item size={{ xs: 12 }}>
                <FormControl size="small" fullWidth error={Boolean(errors.locationId)} required>
                  <InputLabel>Địa điểm</InputLabel>
                  <Select
                    value={formData.locationId}
                    onChange={handleChange("locationId")}
                    label="Địa điểm"
                    startAdornment={
                      <InputAdornment position="start">
                        <LocationIcon />
                      </InputAdornment>
                    }
                  >
                    {locations.map((location) => (
                      <MenuItem key={location._id} value={location._id}>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {location.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {location.address.street}, {location.address.ward}, {location.address.province}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.locationId && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                      {errors.locationId}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Date Range */}
              <Grid item size={{ xs: 12 }}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
                  Thời gian
                </Typography>
              </Grid>

              <Grid item size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Ngày bắt đầu"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange("startDate")}
                  error={Boolean(errors.startDate)}
                  helperText={errors.startDate}
                  InputLabelProps={{ shrink: true }}
                  required
                  size="small"
                />
              </Grid>

              <Grid item size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Ngày kết thúc"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange("endDate")}
                  error={Boolean(errors.endDate)}
                  helperText={errors.endDate}
                  InputLabelProps={{ shrink: true }}
                  required
                  size="small"
                />
              </Grid>

              {/* Recurrence Schedule */}
              <Grid item size={{ xs: 12 }}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ mt: 2 }}>
                  Lịch học
                </Typography>
                {!formData.locationId && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Vui lòng chọn địa điểm trước để xem danh sách phòng học
                  </Typography>
                )}
              </Grid>

              <Grid item size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Ngày trong tuần</InputLabel>
                  <Select
                    value={newRecurrence.dayOfWeek}
                    onChange={(e) => setNewRecurrence((prev) => ({ ...prev, dayOfWeek: e.target.value }))}
                    label="Ngày trong tuần"
                    disabled={!formData.locationId}
                  >
                    {DAYS_OF_WEEK.map((day) => (
                      <MenuItem key={day.value} value={day.value}>
                        {day.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Phòng học</InputLabel>
                  <Select
                    value={newRecurrence.roomId}
                    onChange={(e) => setNewRecurrence((prev) => ({ ...prev, roomId: e.target.value }))}
                    label="Phòng học"
                    disabled={!formData.locationId}
                  >
                    {availableRooms.map((room) => (
                      <MenuItem key={room._id || room.id} value={room._id || room.id}>
                        {room.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item size={{ xs: 12, sm: 5 }}>
                <TimeField
                  label="Giờ bắt đầu"
                  value={dayjs(`${newRecurrence.startTime?.hour}:${newRecurrence.startTime?.minute}`, "HH:mm")}
                  setDetailValue={(updater) =>
                    setNewRecurrence((prev) => ({
                      ...prev,
                      startTime: updater(prev.startTime),
                    }))
                  }
                  disabled={!formData.locationId}
                />
              </Grid>

              <Grid item size={{ xs: 12, sm: 5 }}>
                <TimeField
                  label="Giờ kết thúc"
                  value={dayjs(`${newRecurrence.endTime?.hour}:${newRecurrence.endTime?.minute}`, "HH:mm")}
                  setDetailValue={(updater) =>
                    setNewRecurrence((prev) => ({
                      ...prev,
                      endTime: updater(prev.endTime),
                    }))
                  }
                  disabled={!formData.locationId}
                />
              </Grid>

              <Grid item size={{ xs: 12, sm: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleAddRecurrence}
                  disabled={
                    !formData.locationId ||
                    !newRecurrence.dayOfWeek ||
                    !newRecurrence.startTime ||
                    !newRecurrence.endTime ||
                    !newRecurrence.roomId
                  }
                  sx={{ height: "100%" }}
                  size="small"
                >
                  <AddIcon />
                </Button>
              </Grid>

              <Grid item size={{ xs: 12 }}>
                {formData.recurrence.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    Chưa có lịch học nào
                  </Typography>
                ) : (
                  <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                    {formData.recurrence.map((rec, idx) => (
                      <Chip
                        key={idx}
                        label={`${getDayLabel(rec.dayOfWeek)} - ${String(rec.startTime.hour).padStart(2, "0")}:${String(rec.startTime.minute).padStart(2, "0")} đến ${String(rec.endTime.hour).padStart(2, "0")}:${String(rec.endTime.minute).padStart(2, "0")} - ${getRoomName(rec.roomId)}`}
                        onDelete={() => handleRemoveRecurrence(idx)}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Stack>
                )}
                {errors.recurrence && (
                  <Typography variant="caption" color="error" sx={{ mt: 1, display: "block" }}>
                    {errors.recurrence}
                  </Typography>
                )}
              </Grid>
            </>
          )}

          {/* Trainers - Always visible */}
          <Grid item size={{ xs: 12 }}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ mt: 2 }}>
              Huấn luyện viên ({approvedTrainers.length} khả dụng)
            </Typography>
          </Grid>

          <Grid item size={{ xs: 12 }}>
            {approvedTrainers.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Không có huấn luyện viên nào được phê duyệt
              </Typography>
            ) : (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                {approvedTrainers.map((trainer) => {
                  const trainerInfo = getTrainerDisplayInfo(trainer)
                  const isSelected = formData.trainers.includes(trainerInfo.id)
                  return (
                    <Box
                      key={trainerInfo.id}
                      onClick={() => handleTrainerToggle(trainerInfo.id)}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        p: 1.5,
                        border: 2,
                        borderColor: isSelected ? "primary.main" : "divider",
                        borderRadius: 2,
                        cursor: "pointer",
                        bgcolor: isSelected ? "primary.50" : "transparent",
                        transition: "all 0.2s",
                        "&:hover": {
                          borderColor: "primary.main",
                          bgcolor: "primary.50",
                        },
                        width: "100%",
                      }}
                    >
                      <Avatar src={trainerInfo.avatar} sx={{ width: 50, height: 50 }}>
                        {trainerInfo.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" fontWeight="medium">
                          {trainerInfo.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {trainerInfo.specialization}
                        </Typography>
                        <Typography variant="caption" color="success.main" sx={{ display: "block" }}>
                          ⭐ {trainerInfo.rating} ({trainerInfo.totalReviews} đánh giá)
                        </Typography>
                        {trainerInfo.experience && (
                          <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                            Kinh nghiệm: {trainerInfo.experience}
                          </Typography>
                        )}
                        {trainerInfo.pricePerHour > 0 && (
                          <Typography variant="caption" color="primary.main" sx={{ display: "block" }}>
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(trainerInfo.pricePerHour)}
                            /buổi
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  )
                })}
              </Box>
            )}
            {errors.trainers && (
              <Typography variant="caption" color="error" sx={{ mt: 1, display: "block" }}>
                {errors.trainers}
              </Typography>
            )}
          </Grid>

          {/* Image Upload - Always visible */}
          <Grid item size={{ xs: 12 }}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ mt: 2 }}>
              Hình ảnh (Tùy chọn)
            </Typography>
          </Grid>

          {/* Image Preview */}
          {imagePreview && (
            <Grid item size={{ xs: 12 }}>
              <Card sx={{ maxWidth: 300, position: "relative" }}>
                <CardMedia
                  component="img"
                  height={200}
                  image={imagePreview}
                  alt="Class preview"
                  sx={{ objectFit: "cover" }}
                />
                <IconButton
                  onClick={handleDeleteImage}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    bgcolor: "rgba(0,0,0,0.6)",
                    color: "white",
                    "&:hover": {
                      bgcolor: "rgba(0,0,0,0.8)",
                    },
                  }}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Card>
            </Grid>
          )}

          {/* Upload Button */}
          <Grid item size={{ xs: 12 }}>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                style={{ display: "none" }}
              />
              <Button
                variant="outlined"
                startIcon={<PhotoCameraIcon />}
                onClick={() => fileInputRef.current?.click()}
                sx={{ minWidth: "150px" }}
              >
                Chọn hình ảnh
              </Button>
              <Typography variant="caption" color="text.secondary">
                Hỗ trợ: JPEG, PNG, WebP. Tối đa 5MB
              </Typography>
            </Box>
          </Grid>

          {/* URL Alternative */}
          <Grid item size={{ xs: 12 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Hoặc nhập URL hình ảnh:
            </Typography>
            <TextField
              fullWidth
              label="URL hình ảnh"
              value={formData.image}
              onChange={handleImageUrlChange}
              placeholder="https://example.com/image.jpg"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <UploadIcon />
                  </InputAdornment>
                ),
              }}
              size="small"
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} variant="outlined" color="inherit">
          Hủy
        </Button>
        <Button onClick={handleSubmitClass} variant="contained" size="large" disabled={isSubmitting}>
          {isSubmitting ? "Đang xử lý..." : isEditMode ? "Cập nhật" : "Thêm lớp học"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
