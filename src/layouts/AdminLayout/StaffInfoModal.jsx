import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Grid,
  Avatar,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Badge,
  Snackbar,
  Alert,
} from "@mui/material"
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PhotoCamera as PhotoCameraIcon,
} from "@mui/icons-material"
import { updateAvatarAPI, updateInfoUserAPI } from "~/apis/user"

const StaffInfoModal = ({ open, onClose, user, staff, currentLocation, onUpdateUser, onUpdateStaff }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  // Snackbar states
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("success")

  // Avatar states
  const [openAvatarDialog, setOpenAvatarDialog] = useState(false)
  const [selectedAvatarFile, setSelectedAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState("")

  const [userForm, setUserForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    age: "",
    dateOfBirth: "",
    address: "",
    gender: "",
  })

  const [staffForm, setStaffForm] = useState({
    citizenId: "",
    positionName: "",
    hourlyRate: "",
    hoursWorked: "",
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (user && staff) {
      setUserForm({
        fullName: user.fullName || "",
        phone: user.phone || "",
        email: user.email || "",
        age: user.age || "",
        dateOfBirth: user.dateOfBirth ? formatDateForInput(user.dateOfBirth) : "",
        address: user.address || "",
        gender: user.gender || "",
      })
      setStaffForm({
        citizenId: staff.citizenId || "",
        positionName: staff.positionName || "",
        hourlyRate: staff.hourlyRate || "",
        hoursWorked: staff.hoursWorked || "",
      })
    }
  }, [user, staff])

  // Helper function to format date for input[type="date"]
  const formatDateForInput = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toISOString().split("T")[0]
  }

  const handleUserFormChange = (field, value) => {
    setUserForm((prev) => ({ ...prev, [field]: value }))

    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  const handleStaffFormChange = (field, value) => {
    setStaffForm((prev) => ({ ...prev, [field]: value }))
  }

  // Avatar Handlers
  const handleAvatarClick = () => {
    if (isEditing) {
      document.getElementById("staff-avatar-upload-input")?.click()
    }
  }

  const handleAvatarFileChange = (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      showSnackbar("Vui lòng chọn file ảnh!", "error")
      return
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      showSnackbar("File ảnh không được vượt quá 5MB!", "error")
      return
    }

    setSelectedAvatarFile(file)
    const previewUrl = URL.createObjectURL(file)
    setAvatarPreview(previewUrl)
    setOpenAvatarDialog(true)

    // Reset input
    event.target.value = ""
  }

  const handleConfirmAvatarUpdate = async () => {
    if (!selectedAvatarFile) return

    setOpenAvatarDialog(false)
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("avatar", selectedAvatarFile)

      console.log("🖼️ Uploading avatar for user:", user._id)
      const result = await updateAvatarAPI(user._id, formData)

      if (result.success) {
        showSnackbar("Cập nhật ảnh đại diện thành công!", "success")

        // Update parent component if callback exists
        if (onUpdateUser) {
          onUpdateUser(result.user)
        }
      } else {
        showSnackbar("Có lỗi xảy ra khi cập nhật ảnh đại diện!", "error")
      }
    } catch (error) {
      console.error("❌ Error updating avatar:", error)
      showSnackbar("Có lỗi xảy ra khi cập nhật ảnh đại diện!", "error")
    } finally {
      // Cleanup
      if (avatarPreview && avatarPreview.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview)
      }
      setSelectedAvatarFile(null)
      setAvatarPreview("")
      setLoading(false)
    }
  }

  const handleCancelAvatarUpdate = () => {
    // Cleanup preview URL
    if (avatarPreview && avatarPreview.startsWith("blob:")) {
      URL.revokeObjectURL(avatarPreview)
    }
    setSelectedAvatarFile(null)
    setAvatarPreview("")
    setOpenAvatarDialog(false)
  }

  // Validation
  const validateForm = () => {
    const newErrors = {}

    if (!userForm.fullName.trim()) {
      newErrors.fullName = "Vui lòng nhập họ tên"
    }

    if (!userForm.email.trim()) {
      newErrors.email = "Vui lòng nhập email"
    } else if (!/\S+@\S+\.\S+/.test(userForm.email)) {
      newErrors.email = "Email không hợp lệ"
    }

    // Phone is read-only, no validation needed

    if (userForm.age && (isNaN(userForm.age) || userForm.age < 18 || userForm.age > 100)) {
      newErrors.age = "Tuổi phải từ 18 đến 100"
    }

    if (!userForm.address.trim()) {
      newErrors.address = "Vui lòng nhập địa chỉ"
    }

    if (!userForm.gender) {
      newErrors.gender = "Vui lòng chọn giới tính"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) {
      showSnackbar("Vui lòng kiểm tra lại thông tin!", "error")
      return
    }

    setLoading(true)

    try {
      // Prepare user data for API (phone is read-only, so exclude it)
      const userData = {
        fullName: userForm.fullName.trim(),
        email: userForm.email.trim(),
        age: userForm.age ? parseInt(userForm.age) : null,
        dateOfBirth: userForm.dateOfBirth || null,
        address: userForm.address.trim(),
        gender: userForm.gender,
      }

      console.log("📤 Updating user info:", userData)
      const response = await updateInfoUserAPI(user._id, userData)

      if (response.success) {
        showSnackbar("Cập nhật thông tin thành công!", "success")
        setIsEditing(false)

        // Update parent component if callback exists
        if (onUpdateUser) {
          onUpdateUser(response.user)
        }
      } else {
        showSnackbar(response.message || "Có lỗi xảy ra khi cập nhật thông tin!", "error")
      }
    } catch (error) {
      console.error("❌ Error updating user info:", error)
      showSnackbar("Có lỗi xảy ra khi cập nhật thông tin!", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    // Reset form to original values
    setUserForm({
      fullName: user?.fullName || "",
      phone: user?.phone || "",
      email: user?.email || "",
      age: user?.age || "",
      dateOfBirth: user?.dateOfBirth ? formatDateForInput(user.dateOfBirth) : "",
      address: user?.address || "",
      gender: user?.gender || "",
    })
    setStaffForm({
      citizenId: staff?.citizenId || "",
      positionName: staff?.positionName || "",
      hourlyRate: staff?.hourlyRate || "",
      hoursWorked: staff?.hoursWorked || "",
    })
    setErrors({})
    setIsEditing(false)
  }

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message)
    setSnackbarSeverity(severity)
    setOpenSnackbar(true)
  }

  const getPositionDisplayName = (position) => {
    const positions = {
      receptionist: "Lễ tân",
      trainer: "Huấn luyện viên",
      manager: "Quản lý",
      cleaner: "Nhân viên vệ sinh",
    }
    return positions[position] || position
  }

  const getGenderDisplayName = (gender) => {
    const genders = {
      male: "Nam",
      female: "Nữ",
      other: "Khác",
    }
    return genders[gender] || ""
  }

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Thông tin nhân viên</Typography>
            {!isEditing && (
              <IconButton onClick={() => setIsEditing(true)} color="primary" disabled={loading}>
                <EditIcon />
              </IconButton>
            )}
          </Box>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ py: 2 }}>
            {/* Avatar and Basic Info */}
            <Box display="flex" alignItems="center" mb={3}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                badgeContent={
                  isEditing && (
                    <IconButton
                      size="small"
                      sx={{
                        bgcolor: "white",
                        "&:hover": { bgcolor: "grey.100" },
                        cursor: "pointer",
                      }}
                      onClick={handleAvatarClick}
                    >
                      <PhotoCameraIcon fontSize="small" color="primary" />
                    </IconButton>
                  )
                }
              >
                <Avatar
                  src={user?.avatar}
                  alt={user?.fullName}
                  sx={{
                    width: 80,
                    height: 80,
                    mr: 2,
                    cursor: isEditing ? "pointer" : "default",
                  }}
                  onClick={handleAvatarClick}
                />
              </Badge>

              {/* Hidden file input for avatar */}
              <input
                id="staff-avatar-upload-input"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleAvatarFileChange}
              />

              <Box>
                <Typography variant="h6">{user?.fullName}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {getPositionDisplayName(staff?.positionName)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {currentLocation?.name}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Personal Information - EDITABLE */}
            <Typography variant="h6" gutterBottom>
              Thông tin cá nhân
            </Typography>
            <Grid container spacing={2} mb={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Họ và tên"
                  value={userForm.fullName}
                  onChange={(e) => handleUserFormChange("fullName", e.target.value)}
                  disabled={!isEditing}
                  error={!!errors.fullName}
                  helperText={errors.fullName}
                  variant={isEditing ? "outlined" : "standard"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Số điện thoại" value={userForm.phone} disabled={true} variant="standard" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  value={userForm.email}
                  onChange={(e) => handleUserFormChange("email", e.target.value)}
                  disabled={!isEditing}
                  error={!!errors.email}
                  helperText={errors.email}
                  variant={isEditing ? "outlined" : "standard"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Tuổi"
                  type="number"
                  value={userForm.age}
                  onChange={(e) => handleUserFormChange("age", e.target.value)}
                  disabled={!isEditing}
                  error={!!errors.age}
                  helperText={errors.age}
                  variant={isEditing ? "outlined" : "standard"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Ngày sinh"
                  type="date"
                  value={userForm.dateOfBirth}
                  onChange={(e) => handleUserFormChange("dateOfBirth", e.target.value)}
                  disabled={!isEditing}
                  variant={isEditing ? "outlined" : "standard"}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                {isEditing ? (
                  <FormControl fullWidth error={!!errors.gender}>
                    <InputLabel>Giới tính</InputLabel>
                    <Select
                      value={userForm.gender}
                      label="Giới tính"
                      onChange={(e) => handleUserFormChange("gender", e.target.value)}
                    >
                      <MenuItem value="male">Nam</MenuItem>
                      <MenuItem value="female">Nữ</MenuItem>
                      <MenuItem value="other">Khác</MenuItem>
                    </Select>
                    {errors.gender && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                        {errors.gender}
                      </Typography>
                    )}
                  </FormControl>
                ) : (
                  <TextField
                    fullWidth
                    label="Giới tính"
                    value={getGenderDisplayName(userForm.gender)}
                    disabled
                    variant="standard"
                  />
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Địa chỉ"
                  multiline
                  rows={2}
                  value={userForm.address}
                  onChange={(e) => handleUserFormChange("address", e.target.value)}
                  disabled={!isEditing}
                  error={!!errors.address}
                  helperText={errors.address}
                  variant={isEditing ? "outlined" : "standard"}
                />
              </Grid>
            </Grid>

            <Divider sx={{ mb: 3 }} />

            {/* Work Information - READ ONLY */}
            <Typography variant="h6" gutterBottom>
              Thông tin công việc
              <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                (Chỉ xem, không thể chỉnh sửa)
              </Typography>
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="CCCD/CMND" value={staffForm.citizenId} disabled variant="standard" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Vị trí công việc"
                  value={getPositionDisplayName(staffForm.positionName)}
                  disabled
                  variant="standard"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Lương theo giờ (VND)"
                  value={staffForm.hourlyRate?.toLocaleString("vi-VN") || "0"}
                  disabled
                  variant="standard"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Số giờ làm việc"
                  value={staffForm.hoursWorked || "0"}
                  disabled
                  variant="standard"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions>
          {isEditing ? (
            <>
              <Button onClick={handleCancel} startIcon={<CancelIcon />} disabled={loading}>
                Hủy
              </Button>
              <Button
                onClick={handleSave}
                variant="contained"
                startIcon={<SaveIcon />}
                disabled={loading}
                sx={{
                  bgcolor: "#FFA62B",
                  "&:hover": { bgcolor: "#FF9500" },
                }}
              >
                {loading ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </>
          ) : (
            <Button onClick={onClose} disabled={loading}>
              Đóng
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Avatar Update Confirmation Dialog */}
      <Dialog open={openAvatarDialog} onClose={handleCancelAvatarUpdate} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: "center" }}>Xác nhận cập nhật ảnh đại diện</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <Avatar
              src={avatarPreview}
              sx={{
                width: 200,
                height: 200,
                border: "2px solid",
                borderColor: "primary.main",
              }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary" align="center">
            Bạn có muốn cập nhật ảnh đại diện mới này không?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelAvatarUpdate} color="inherit" disabled={loading}>
            Hủy
          </Button>
          <Button
            onClick={handleConfirmAvatarUpdate}
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={loading}
            sx={{
              bgcolor: "#FFA62B",
              "&:hover": { bgcolor: "#FF9500" },
            }}
          >
            {loading ? "Đang tải lên..." : "Cập nhật"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  )
}

export default StaffInfoModal
