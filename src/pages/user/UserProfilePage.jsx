import React, { useState, useCallback, useMemo } from "react"
import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  TextField,
  Button,
  Grid,
  IconButton,
  Alert,
  Stack,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useMediaQuery,
  useTheme,
  InputAdornment,
} from "@mui/material"
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PhotoCamera as PhotoCameraIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarMonth as CalendarIcon,
} from "@mui/icons-material"

// Import stores và APIs
import useUserStore from "~/stores/useUserStore"
import { updateAvatarAPI, updateInfoUserAPI } from "~/apis/user"
import { convertISOToVNTime, toISODate } from "~/utils/common"
import MyBackdrop from "~/components/MyBackdrop"

// Helper function to convert ISO date to YYYY-MM-DD format for date input
const convertISOToInputDate = (isoString) => {
  if (!isoString) return ""
  try {
    const date = new Date(isoString)
    if (isNaN(date.getTime())) return ""

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  } catch (error) {
    console.error("Error converting ISO to input date:", error)
    return ""
  }
}

// Helper function to safely convert date to ISO format
const convertToISODate = (dateStr) => {
  if (!dateStr || dateStr.trim() === "") return null

  try {
    // If dateStr is in YYYY-MM-DD format from HTML date input
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
      // Convert YYYY-MM-DD to DD/MM/YYYY for toISODate function
      const [year, month, day] = dateStr.split("-")
      const vnFormatDate = `${day}/${month}/${year}`

      // Validate the date before calling toISODate
      const testDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
      if (
        isNaN(testDate.getTime()) ||
        testDate.getFullYear() !== parseInt(year) ||
        testDate.getMonth() !== parseInt(month) - 1 ||
        testDate.getDate() !== parseInt(day)
      ) {
        throw new Error("Invalid date values")
      }

      return toISODate(vnFormatDate)
    }

    // If dateStr is already in DD/MM/YYYY format
    if (dateStr.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      return toISODate(dateStr)
    }

    // Handle other date formats
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date")
    }
    return date.toISOString()
  } catch (error) {
    console.error("Date conversion error:", error)
    return null
  }
}

export default function UserProfilePage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  // States
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({})
  const [errors, setErrors] = useState({})
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("success")
  const [openBackdrop, setOpenBackdrop] = useState(false)
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)

  // Store
  const { user, updateUser } = useUserStore()

  // Dữ liệu user với các field có thể chỉnh sửa
  const userData = useMemo(
    () => ({
      _id: user._id || "",
      fullName: user.fullName || "",
      email: user.email || "",
      phone: user.phone || "",
      avatar: user.avatar || "",
      gender: user.gender || "",
      dateOfBirth: user.dateOfBirth ? convertISOToInputDate(user.dateOfBirth) : "",
      address: user.address || "",
      // Read-only fields
      role: user.role || "",
      status: user.status || "",
    }),
    [user],
  )

  // Helper function to get current value
  const getCurrentValue = useCallback(
    (field) => {
      if (!isEditing) {
        return userData[field] || ""
      }
      return editData[field] !== undefined ? editData[field] : userData[field] || ""
    },
    [isEditing, editData, userData],
  )

  // Handlers
  const handleFieldChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  const handleAvatarChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setAvatarFile(file)
      const previewUrl = URL.createObjectURL(file)
      setAvatarPreview(previewUrl)
    }
  }

  const handleStartEdit = () => {
    setIsEditing(true)
    setEditData({})
    setErrors({})
    setAvatarFile(null)
    setAvatarPreview(null)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditData({})
    setErrors({})
    setAvatarFile(null)
    setAvatarPreview(null)
  }

  const validateForm = () => {
    const newErrors = {}

    // Validate fullName
    const fullName = getCurrentValue("fullName").trim()
    if (!fullName) {
      newErrors.fullName = "Họ và tên không được để trống"
    } else if (fullName.length < 2) {
      newErrors.fullName = "Họ và tên phải có ít nhất 2 ký tự"
    }

    // Validate email
    const email = getCurrentValue("email").trim()
    if (!email) {
      newErrors.email = "Email không được để trống"
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        newErrors.email = "Email không hợp lệ"
      }
    }

    // Validate dateOfBirth
    const dateOfBirth = getCurrentValue("dateOfBirth")
    if (dateOfBirth) {
      const birthDate = new Date(dateOfBirth)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()

      if (age < 16 || age > 100) {
        newErrors.dateOfBirth = "Tuổi phải từ 16 đến 100"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) {
      return
    }

    try {
      setOpenBackdrop(true)

      // Prepare user data for update
      const updateData = {
        fullName: getCurrentValue("fullName").trim(),
        email: getCurrentValue("email").trim(),
        address: getCurrentValue("address").trim(),
        gender: getCurrentValue("gender") || null,
      }

      // Add dateOfBirth if provided
      const dateOfBirth = getCurrentValue("dateOfBirth")
      if (dateOfBirth && dateOfBirth.trim() !== "") {
        const isoDate = convertToISODate(dateOfBirth)
        if (isoDate) {
          updateData.dateOfBirth = isoDate
        } else {
          setSnackbarMessage("Ngày sinh không hợp lệ, vui lòng kiểm tra lại")
          setSnackbarSeverity("error")
          setOpenSnackbar(true)
          setOpenBackdrop(false)
          return
        }
      }

      // Update user info
      console.log("📤 Sending update data to backend:", updateData)
      const userResponse = await updateInfoUserAPI(userData._id, updateData)
      console.log("📥 Backend response:", userResponse)

      if (!userResponse.success) {
        throw new Error(userResponse.message || "Cập nhật thông tin thất bại")
      }

      // Update avatar if changed
      if (avatarFile) {
        const formData = new FormData()
        formData.append("avatar", avatarFile)

        const avatarResponse = await updateAvatarAPI(userData._id, formData)
        if (!avatarResponse.success) {
          throw new Error(avatarResponse.message || "Cập nhật avatar thất bại")
        }
      }

      // Update local store
      const updatedUserData = { ...user, ...updateData }
      if (avatarFile) {
        updatedUserData.avatar = URL.createObjectURL(avatarFile)
      }
      updateUser(updatedUserData)

      setIsEditing(false)
      setEditData({})
      setAvatarFile(null)
      setAvatarPreview(null)

      setSnackbarMessage("Cập nhật thông tin thành công!")
      setSnackbarSeverity("success")
      setOpenSnackbar(true)
    } catch (error) {
      console.error("Error updating user:", error)
      setSnackbarMessage(error.message || "Có lỗi xảy ra khi cập nhật thông tin")
      setSnackbarSeverity("error")
      setOpenSnackbar(true)
    } finally {
      setOpenBackdrop(false)
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography variant="h4" component="h1" gutterBottom color="primary">
            Thông Tin Cá Nhân
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Quản lý và cập nhật thông tin tài khoản của bạn
          </Typography>
        </Box>

        {/* Avatar Section */}
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Box sx={{ position: "relative", display: "inline-block" }}>
            <Avatar
              src={avatarPreview || userData.avatar}
              sx={{
                width: 120,
                height: 120,
                mb: 2,
                border: "4px solid",
                borderColor: "primary.main",
              }}
            >
              <PersonIcon sx={{ fontSize: 60 }} />
            </Avatar>

            {isEditing && (
              <IconButton
                sx={{
                  position: "absolute",
                  bottom: 8,
                  right: 8,
                  bgcolor: "primary.main",
                  color: "white",
                  "&:hover": { bgcolor: "primary.dark" },
                }}
                component="label"
              >
                <PhotoCameraIcon />
                <input type="file" hidden accept="image/*" onChange={handleAvatarChange} />
              </IconButton>
            )}
          </Box>

          <Typography variant="h5" gutterBottom>
            {userData.fullName || "Chưa có tên"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {userData.email}
          </Typography>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ mb: 4, textAlign: "center" }}>
          {!isEditing ? (
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleStartEdit}
              size="large"
              sx={{ bgcolor: "#FFA62B", "&:hover": { bgcolor: "#FF9500" } }}
            >
              Chỉnh sửa thông tin
            </Button>
          ) : (
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                sx={{ bgcolor: "#FFA62B", "&:hover": { bgcolor: "#FF9500" } }}
              >
                Lưu thay đổi
              </Button>
              <Button variant="outlined" startIcon={<CancelIcon />} onClick={handleCancelEdit}>
                Hủy bỏ
              </Button>
            </Stack>
          )}
        </Box>

        {/* Form Fields */}
        <Grid container spacing={3}>
          {/* Full Name */}
          <Grid item size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Họ và tên"
              value={getCurrentValue("fullName")}
              onChange={(e) => handleFieldChange("fullName", e.target.value)}
              disabled={!isEditing}
              error={!!errors.fullName}
              helperText={errors.fullName}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color={errors.fullName ? "error" : "action"} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Email */}
          <Grid item size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={getCurrentValue("email")}
              onChange={(e) => handleFieldChange("email", e.target.value)}
              disabled={!isEditing}
              error={!!errors.email}
              helperText={errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color={errors.email ? "error" : "action"} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Phone (Read-only) */}
          <Grid item size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Số điện thoại"
              value={userData.phone}
              disabled
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon color="action" />
                  </InputAdornment>
                ),
              }}
              helperText="Số điện thoại không thể thay đổi"
            />
          </Grid>

          {/* Date of Birth */}
          <Grid item size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Ngày sinh"
              type="date"
              value={getCurrentValue("dateOfBirth")}
              onChange={(e) => handleFieldChange("dateOfBirth", e.target.value)}
              disabled={!isEditing}
              error={!!errors.dateOfBirth}
              helperText={errors.dateOfBirth}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarIcon color={errors.dateOfBirth ? "error" : "action"} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Gender */}
          <Grid item size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth disabled={!isEditing}>
              <InputLabel>Giới tính</InputLabel>
              <Select
                value={getCurrentValue("gender")}
                onChange={(e) => handleFieldChange("gender", e.target.value)}
                label="Giới tính"
              >
                <MenuItem value="">Chọn giới tính</MenuItem>
                <MenuItem value="male">Nam</MenuItem>
                <MenuItem value="female">Nữ</MenuItem>
                <MenuItem value="other">Khác</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Address */}
          <Grid item size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Địa chỉ"
              value={getCurrentValue("address")}
              onChange={(e) => handleFieldChange("address", e.target.value)}
              disabled={!isEditing}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Role (Read-only) */}
          <Grid item size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Vai trò"
              value={userData.role === "user" ? "Thành viên" : userData.role}
              disabled
              helperText="Vai trò trong hệ thống"
            />
          </Grid>

          {/* Status (Read-only) */}
          <Grid item size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Trạng thái"
              value={userData.status === "active" ? "Đang hoạt động" : userData.status}
              disabled
              helperText="Trạng thái tài khoản"
            />
          </Grid>
        </Grid>

        {/* Additional Info */}
        {isEditing && (
          <Alert severity="info" sx={{ mt: 3 }}>
            <Typography variant="body2">
              <strong>Lưu ý:</strong>
              <br />
              • Số điện thoại không thể thay đổi vì đây là thông tin đăng nhập
              <br />
              • Avatar hỗ trợ các định dạng: JPG, PNG, GIF
              <br />• Thông tin sẽ được cập nhật ngay lập tức sau khi lưu
            </Typography>
          </Alert>
        )}
      </Paper>

      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Backdrop */}
      <MyBackdrop open={openBackdrop} handleClose={() => setOpenBackdrop(false)} />
    </Container>
  )
}
