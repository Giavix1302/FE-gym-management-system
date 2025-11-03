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
} from "@mui/material"
import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from "@mui/icons-material"

const StaffInfoModal = ({ open, onClose, user, staff, currentLocation, onUpdateUser, onUpdateStaff }) => {
  const [isEditing, setIsEditing] = useState(false)
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

  useEffect(() => {
    if (user && staff) {
      setUserForm({
        fullName: user.fullName || "",
        phone: user.phone || "",
        email: user.email || "",
        age: user.age || "",
        dateOfBirth: user.dateOfBirth || "",
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

  const handleUserFormChange = (field, value) => {
    setUserForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleStaffFormChange = (field, value) => {
    setStaffForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    try {
      // Call API to update user and staff information
      if (onUpdateUser) {
        await onUpdateUser(userForm)
      }
      if (onUpdateStaff) {
        await onUpdateStaff(staffForm)
      }
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating staff information:", error)
    }
  }

  const handleCancel = () => {
    // Reset form to original values
    setUserForm({
      fullName: user?.fullName || "",
      phone: user?.phone || "",
      email: user?.email || "",
      age: user?.age || "",
      dateOfBirth: user?.dateOfBirth || "",
      address: user?.address || "",
      gender: user?.gender || "",
    })
    setStaffForm({
      citizenId: staff?.citizenId || "",
      positionName: staff?.positionName || "",
      hourlyRate: staff?.hourlyRate || "",
      hoursWorked: staff?.hoursWorked || "",
    })
    setIsEditing(false)
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
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Thông tin nhân viên</Typography>
          {!isEditing && (
            <IconButton onClick={() => setIsEditing(true)} color="primary">
              <EditIcon />
            </IconButton>
          )}
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ py: 2 }}>
          {/* Avatar and Basic Info */}
          <Box display="flex" alignItems="center" mb={3}>
            <Avatar src={user?.avatar} alt={user?.fullName} sx={{ width: 80, height: 80, mr: 2 }} />
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

          {/* Personal Information */}
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
                variant={isEditing ? "outlined" : "standard"}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Số điện thoại"
                value={userForm.phone}
                onChange={(e) => handleUserFormChange("phone", e.target.value)}
                disabled={!isEditing}
                variant={isEditing ? "outlined" : "standard"}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                value={userForm.email}
                onChange={(e) => handleUserFormChange("email", e.target.value)}
                disabled={!isEditing}
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
                <FormControl fullWidth>
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
                variant={isEditing ? "outlined" : "standard"}
              />
            </Grid>
          </Grid>

          <Divider sx={{ mb: 3 }} />

          {/* Work Information */}
          <Typography variant="h6" gutterBottom>
            Thông tin công việc
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="CCCD/CMND"
                value={staffForm.citizenId}
                onChange={(e) => handleStaffFormChange("citizenId", e.target.value)}
                disabled={!isEditing}
                variant={isEditing ? "outlined" : "standard"}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              {isEditing ? (
                <FormControl fullWidth>
                  <InputLabel>Vị trí công việc</InputLabel>
                  <Select
                    value={staffForm.positionName}
                    label="Vị trí công việc"
                    onChange={(e) => handleStaffFormChange("positionName", e.target.value)}
                  >
                    <MenuItem value="receptionist">Lễ tân</MenuItem>
                    <MenuItem value="trainer">Huấn luyện viên</MenuItem>
                    <MenuItem value="manager">Quản lý</MenuItem>
                    <MenuItem value="cleaner">Nhân viên vệ sinh</MenuItem>
                  </Select>
                </FormControl>
              ) : (
                <TextField
                  fullWidth
                  label="Vị trí công việc"
                  value={getPositionDisplayName(staffForm.positionName)}
                  disabled
                  variant="standard"
                />
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Lương theo giờ (VND)"
                type="number"
                value={staffForm.hourlyRate}
                onChange={(e) => handleStaffFormChange("hourlyRate", e.target.value)}
                disabled={!isEditing}
                variant={isEditing ? "outlined" : "standard"}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Số giờ làm việc"
                type="number"
                value={staffForm.hoursWorked}
                onChange={(e) => handleStaffFormChange("hoursWorked", e.target.value)}
                disabled={!isEditing}
                variant={isEditing ? "outlined" : "standard"}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions>
        {isEditing ? (
          <>
            <Button onClick={handleCancel} startIcon={<CancelIcon />}>
              Hủy
            </Button>
            <Button onClick={handleSave} variant="contained" startIcon={<SaveIcon />}>
              Lưu thay đổi
            </Button>
          </>
        ) : (
          <Button onClick={onClose}>Đóng</Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default StaffInfoModal
