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
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  AccessTime as TimeIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material"

import useLocationStore from "~/stores/useLocationStore"
import { formatUpdateStaffData } from "~/apis/staff"

export default function AddEditStaffModal({ open, onClose, editStaff = null, onStaffCreate, onStaffUpdate }) {
  const { locations } = useLocationStore()
  const isEditMode = !!editStaff

  const [formData, setFormData] = useState({
    // User info
    fullName: "",
    phone: "",
    email: "",
    password: "",
    age: "",
    dateOfBirth: "",
    address: "",
    gender: "",

    // Staff info
    locationId: "",
    citizenId: "",
    positionName: "",
    hourlyRate: "",
    hoursWorked: "",
  })

  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Populate form when editing
  useEffect(() => {
    if (isEditMode && editStaff && open) {
      setFormData({
        // User info
        fullName: editStaff.userInfo?.fullName || "",
        phone: displayPhoneNumber(editStaff.userInfo?.phone || ""),
        email: editStaff.userInfo?.email || "",
        password: "",
        age: editStaff.userInfo?.age?.toString() || "",
        dateOfBirth: editStaff.userInfo?.dateOfBirth || "",
        address: editStaff.userInfo?.address || "",
        gender: editStaff.userInfo?.gender || "",

        // Staff info
        locationId: editStaff.locationId || "",
        citizenId: editStaff.citizenId || "",
        positionName: editStaff.positionName || "",
        hourlyRate: editStaff.hourlyRate?.toString() || "",
        hoursWorked: editStaff.hoursWorked?.toString() || "",
      })
    } else if (!isEditMode && open) {
      handleReset()
    }
  }, [isEditMode, editStaff, open])

  const handleReset = () => {
    setFormData({
      fullName: "",
      phone: "",
      email: "",
      password: "",
      age: "",
      dateOfBirth: "",
      address: "",
      gender: "",
      locationId: "",
      citizenId: "",
      positionName: "",
      hourlyRate: "",
      hoursWorked: "",
    })
    setErrors({})
  }

  const handleInputChange = (field, value) => {
    // Special handling for phone number
    if (field === "phone") {
      // Remove all non-digits
      const digits = value.replace(/\D/g, "")
      // Limit to 10 digits if starts with 0, or 9 if not
      const formattedValue = digits.startsWith("0") ? digits.substring(0, 10) : digits.substring(0, 9)
      setFormData((prev) => ({ ...prev, [field]: formattedValue }))
    }
    // Special handling for CCCD
    else if (field === "citizenId") {
      // Only allow digits, max 12
      const digits = value.replace(/\D/g, "").substring(0, 12)
      setFormData((prev) => ({ ...prev, [field]: digits }))
    }
    // Special handling for date
    else if (field === "dateOfBirth") {
      setFormData((prev) => ({ ...prev, [field]: value }))
      // Auto-calculate age if date is provided
      if (value) {
        const age = calculateAge(value)
        setFormData((prev) => ({ ...prev, age: age.toString() }))
      }
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return ""
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const formatPhoneNumber = (phone) => {
    if (phone.startsWith("0")) {
      return "+84" + phone.substring(1)
    }
    return phone.startsWith("+84") ? phone : "+84" + phone
  }

  const displayPhoneNumber = (phone) => {
    if (phone.startsWith("+84")) {
      return "0" + phone.substring(3)
    }
    return phone
  }

  const validateForm = () => {
    const newErrors = {}

    // User info validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Họ tên là bắt buộc"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Số điện thoại là bắt buộc"
    } else if (formData.phone.length < 9 || formData.phone.length > 10) {
      newErrors.phone = "Số điện thoại không hợp lệ"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email là bắt buộc"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ"
    }

    if (!isEditMode && !formData.password.trim()) {
      newErrors.password = "Mật khẩu là bắt buộc"
    } else if (!isEditMode && formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự"
    }

    if (!formData.age.trim()) {
      newErrors.age = "Tuổi là bắt buộc"
    } else if (parseInt(formData.age) < 16 || parseInt(formData.age) > 70) {
      newErrors.age = "Tuổi phải từ 16 đến 70"
    }

    if (!formData.dateOfBirth.trim()) {
      newErrors.dateOfBirth = "Ngày sinh là bắt buộc"
    }

    if (!formData.address.trim()) {
      newErrors.address = "Địa chỉ là bắt buộc"
    }

    if (!formData.gender.trim()) {
      newErrors.gender = "Giới tính là bắt buộc"
    }

    // Staff info validation
    if (!formData.locationId.trim()) {
      newErrors.locationId = "Cơ sở là bắt buộc"
    }

    if (!formData.citizenId.trim()) {
      newErrors.citizenId = "CCCD là bắt buộc"
    } else if (formData.citizenId.length !== 12) {
      newErrors.citizenId = "CCCD phải có đúng 12 số"
    }

    if (!formData.positionName.trim()) {
      newErrors.positionName = "Chức vụ là bắt buộc"
    }

    if (!formData.hourlyRate.trim()) {
      newErrors.hourlyRate = "Lương theo giờ là bắt buộc"
    } else if (parseFloat(formData.hourlyRate) <= 0) {
      newErrors.hourlyRate = "Lương phải lớn hơn 0"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    try {
      if (isEditMode) {
        // Handle update
        const userInfo = {
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formatPhoneNumber(formData.phone.trim()),
          age: parseInt(formData.age),
          dateOfBirth: formData.dateOfBirth,
          address: formData.address.trim(),
          gender: formData.gender,
        }

        // Only include password if provided
        if (formData.password.trim()) {
          userInfo.password = formData.password
        }

        const staffInfo = {
          locationId: formData.locationId,
          citizenId: formData.citizenId,
          positionName: formData.positionName.toLowerCase(), // Convert to lowercase
          hourlyRate: parseFloat(formData.hourlyRate),
          hoursWorked: formData.hoursWorked ? parseFloat(formData.hoursWorked) : 0,
        }

        const updateData = formatUpdateStaffData(userInfo, staffInfo)
        await onStaffUpdate(editStaff._id, updateData)
      } else {
        // Handle create
        const staffData = {
          phone: formData.phone.trim(),
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          password: formData.password,
          age: parseInt(formData.age),
          dateOfBirth: formData.dateOfBirth,
          address: formData.address.trim(),
          gender: formData.gender,
          locationId: formData.locationId,
          citizenId: formData.citizenId,
          positionName: formData.positionName.toLowerCase(), // Convert to lowercase
          hourlyRate: parseFloat(formData.hourlyRate),
          hoursWorked: formData.hoursWorked ? parseFloat(formData.hoursWorked) : 0,
        }

        await onStaffCreate(staffData)
      }
    } catch (error) {
      console.error("Error saving staff:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    handleReset()
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {isEditMode ? <EditIcon color="primary" /> : <AddIcon color="primary" />}
          <Typography variant="h6" fontWeight="bold" color="primary.main">
            {isEditMode ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"}
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Left Column - Personal Info */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" fontWeight="bold" gutterBottom color="primary.main">
              <PersonIcon sx={{ verticalAlign: "middle", mr: 1 }} />
              Thông tin cá nhân
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <TextField
                size="small"
                label="Họ và tên"
                variant="outlined"
                fullWidth
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                error={!!errors.fullName}
                helperText={errors.fullName}
                placeholder="VD: Nguyễn Văn A"
              />

              <TextField
                size="small"
                label="Số điện thoại"
                variant="outlined"
                fullWidth
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                error={!!errors.phone}
                helperText={errors.phone}
                placeholder="VD: 0987654321"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                size="small"
                label="Email"
                variant="outlined"
                fullWidth
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
                placeholder="VD: example@gmail.com"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              {!isEditMode && (
                <TextField
                  size="small"
                  label="Mật khẩu"
                  variant="outlined"
                  fullWidth
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  error={!!errors.password}
                  helperText={errors.password}
                  placeholder="Nhập mật khẩu"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}

              {isEditMode && (
                <TextField
                  size="small"
                  label="Mật khẩu mới (để trống nếu không đổi)"
                  variant="outlined"
                  fullWidth
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  error={!!errors.password}
                  helperText={errors.password}
                  placeholder="Nhập mật khẩu mới"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    size="small"
                    label="Tuổi"
                    variant="outlined"
                    fullWidth
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    error={!!errors.age}
                    helperText={errors.age}
                    inputProps={{ min: 16, max: 70 }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    size="small"
                    label="Ngày sinh"
                    variant="outlined"
                    fullWidth
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                    error={!!errors.dateOfBirth}
                    helperText={errors.dateOfBirth}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>

              <FormControl fullWidth error={!!errors.gender}>
                <InputLabel>Giới tính</InputLabel>
                <Select
                  size="small"
                  value={formData.gender}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  label="Giới tính"
                >
                  <MenuItem value="male">Nam</MenuItem>
                  <MenuItem value="female">Nữ</MenuItem>
                  <MenuItem value="other">Khác</MenuItem>
                </Select>
              </FormControl>

              <TextField
                size="small"
                label="Địa chỉ"
                variant="outlined"
                fullWidth
                multiline
                rows={2}
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                error={!!errors.address}
                helperText={errors.address}
                placeholder="VD: 123 Đường ABC, Quận XYZ, TP.HCM"
              />
            </Box>
          </Grid>

          {/* Right Column - Work Info */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" fontWeight="bold" gutterBottom color="primary.main">
              <BadgeIcon sx={{ verticalAlign: "middle", mr: 1 }} />
              Thông tin công việc
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <TextField
                size="small"
                label="CCCD"
                variant="outlined"
                fullWidth
                value={formData.citizenId}
                onChange={(e) => handleInputChange("citizenId", e.target.value)}
                error={!!errors.citizenId}
                helperText={errors.citizenId}
                placeholder="VD: 123456789012"
                inputProps={{ maxLength: 12 }}
              />

              <FormControl fullWidth error={!!errors.locationId}>
                <InputLabel>Cơ sở làm việc</InputLabel>
                <Select
                  size="small"
                  value={formData.locationId}
                  onChange={(e) => handleInputChange("locationId", e.target.value)}
                  label="Cơ sở làm việc"
                  startAdornment={
                    <InputAdornment position="start">
                      <LocationIcon color="action" />
                    </InputAdornment>
                  }
                >
                  {locations?.map((location) => (
                    <MenuItem key={location._id} value={location._id}>
                      {location.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth error={!!errors.positionName}>
                <InputLabel>Chức vụ</InputLabel>
                <Select
                  size="small"
                  value={formData.positionName}
                  onChange={(e) => handleInputChange("positionName", e.target.value)}
                  label="Chức vụ"
                >
                  <MenuItem value="receptionist">Lễ tân</MenuItem>
                  <MenuItem value="cleaner">Nhân viên vệ sinh</MenuItem>
                </Select>
              </FormControl>

              <TextField
                size="small"
                label="Lương theo giờ"
                variant="outlined"
                fullWidth
                type="number"
                value={formData.hourlyRate}
                onChange={(e) => handleInputChange("hourlyRate", e.target.value)}
                error={!!errors.hourlyRate}
                helperText={errors.hourlyRate}
                placeholder="VD: 25000"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MoneyIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: <InputAdornment position="end">VNĐ/giờ</InputAdornment>,
                  inputProps: { min: 0 },
                }}
              />

              <TextField
                size="small"
                label="Số giờ làm việc hiện tại"
                variant="outlined"
                fullWidth
                type="number"
                value={formData.hoursWorked}
                onChange={(e) => handleInputChange("hoursWorked", e.target.value)}
                placeholder="VD: 40"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TimeIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: <InputAdornment position="end">giờ</InputAdornment>,
                  inputProps: { min: 0 },
                }}
              />
            </Box>
          </Grid>
        </Grid>

        {/* Summary */}
        {formData.hourlyRate && formData.hoursWorked && (
          <>
            <Divider sx={{ my: 3 }} />
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                <strong>Tóm tắt lương:</strong>
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <span>Lương theo giờ:</span>
                <span>{parseFloat(formData.hourlyRate)?.toLocaleString("vi-VN")} VNĐ/giờ</span>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <span>Số giờ làm:</span>
                <span>{formData.hoursWorked} giờ</span>
              </Box>
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
                <span>Tổng lương:</span>
                <span style={{ color: "#2e7d32", fontSize: "1.1rem" }}>
                  {(parseFloat(formData.hourlyRate || 0) * parseFloat(formData.hoursWorked || 0)).toLocaleString(
                    "vi-VN",
                  )}{" "}
                  VNĐ
                </span>
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
          {isLoading ? (isEditMode ? "Đang cập nhật..." : "Đang tạo...") : isEditMode ? "Cập nhật" : "Tạo nhân viên"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
