import React, { useEffect, useState } from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Stack,
  InputAdornment,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material"
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  People as PeopleIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
  LocationOn as LocationIcon,
  AccountCircle as AccountIcon,
  AccessTime as TimeIcon,
  AttachMoney as MoneyIcon,
  Close as CloseIcon,
  FileDownload as ExportIcon,
  FileUpload as ImportIcon,
} from "@mui/icons-material"

import {
  createStaffSignupAPI,
  verifyStaffOTPAPI,
  getAllStaffsAPI,
  updateStaffAPI,
  softDeleteStaffAPI,
} from "~/apis/staff"
import useLocationStore from "~/stores/useLocationStore"
import AddEditStaffModal from "./AddEditStaffModal"
import OtpModal from "~/pages/auth/OtpModal"
import ConfirmDialog from "~/components/ConfirmDialog"
import { toast } from "react-toastify"

// Staff Detail Modal Component
function StaffDetailModal({ open, onClose, staff, onStaffUpdate, onStaffDelete }) {
  console.log("🚀 ~ StaffDetailModal ~ staff:", staff)

  if (!staff) return null

  const handleEdit = () => {
    console.log("🚀 ~ StaffDetailModal ~ handleEdit ~ staff:", staff)
    onStaffUpdate(staff)
    onClose()
  }

  const handleDelete = () => {
    console.log("🚀 ~ StaffDetailModal ~ handleDelete ~ staff:", staff)
    onStaffDelete(staff)
    onClose()
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A"
    return new Date(timestamp).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "N/A"
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const displayPhoneNumber = (phone) => {
    if (phone?.startsWith("+84")) {
      return "0" + phone.substring(3)
    }
    return phone || "N/A"
  }

  const getStatusColor = (isDestroyed) => {
    return !isDestroyed ? "success" : "error"
  }

  const getStatusText = (isDestroyed) => {
    return !isDestroyed ? "Hoạt động" : "Ngưng hoạt động"
  }

  const getPositionText = (position) => {
    switch (position?.toLowerCase()) {
      case "receptionist":
        return "Lễ tân"
      case "cleaner":
        return "Nhân viên vệ sinh"
      default:
        return position || "N/A"
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, maxHeight: "90vh" },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ width: 50, height: 50, bgcolor: "primary.main" }}>
              <AccountIcon />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight="bold" color="primary.main">
                {staff.userInfo?.fullName || "N/A"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {getPositionText(staff.positionName)}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Chip label={getStatusText(staff._destroy)} color={getStatusColor(staff._destroy)} size="medium" />
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        {/* Personal Information */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom color="primary.main">
            Thông tin cá nhân
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <PhoneIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Số điện thoại
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {displayPhoneNumber(staff.userInfo?.phone)}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <EmailIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {staff.userInfo?.email || "Chưa có"}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <BadgeIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      CCCD
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {staff.citizenId || "N/A"}
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Tuổi
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {staff.userInfo?.age || calculateAge(staff.userInfo?.dateOfBirth)} tuổi
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Ngày sinh
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {formatDate(staff.userInfo?.dateOfBirth)}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Giới tính
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {staff.userInfo?.gender === "male"
                      ? "Nam"
                      : staff.userInfo?.gender === "female"
                        ? "Nữ"
                        : staff.userInfo?.gender === "other"
                          ? "Khác"
                          : "N/A"}
                  </Typography>
                </Box>
              </Stack>
            </Grid>

            <Grid item xs={12}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Địa chỉ
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {staff.userInfo?.address || "N/A"}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Work Information */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom color="primary.main">
            Thông tin công việc
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <LocationIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Cơ sở làm việc
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {staff.locationInfo?.name || "N/A"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {staff.locationInfo?.address?.street}, {staff.locationInfo?.address?.ward}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <MoneyIcon color="success" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Lương theo giờ
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="success.main">
                      {staff.hourlyRate?.toLocaleString("vi-VN")} VNĐ/giờ
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <TimeIcon color="info" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Tổng giờ làm
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {staff.hoursWorked || 0} giờ
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Tổng lương
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color="info.main">
                    {((staff.hourlyRate || 0) * (staff.hoursWorked || 0)).toLocaleString("vi-VN")} VNĐ
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* System Information */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom color="primary.main">
            Thông tin hệ thống
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Ngày tạo
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {formatDate(staff.createdAt)}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Ngày cập nhật
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {formatDate(staff.updatedAt)}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Staff ID
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "monospace" }}>
                  {staff._id}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Đóng
        </Button>
        <Button onClick={handleEdit} variant="contained" startIcon={<EditIcon />} sx={{ textTransform: "none" }}>
          Chỉnh sửa
        </Button>
        <Button
          onClick={handleDelete}
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          sx={{ textTransform: "none" }}
          disabled={staff._destroy}
        >
          {staff._destroy ? "Đã xóa" : "Xóa"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default function AdminStaffPage() {
  const { locations } = useLocationStore()

  const [staffList, setStaffList] = useState([])
  const [selectedStaff, setSelectedStaff] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all") // all, active, inactive
  const [locationFilter, setLocationFilter] = useState("all")
  const [positionFilter, setPositionFilter] = useState("all")
  const [loading, setLoading] = useState(false)

  // Modal states
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState(null)
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false)
  const [pendingStaffData, setPendingStaffData] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  // Delete confirmation
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Fetch staff list
  const fetchStaffList = async () => {
    try {
      setLoading(true)
      const response = await getAllStaffsAPI()
      if (response.success) {
        setStaffList(response.staffs)
      }
    } catch (error) {
      console.error("Error fetching staff list:", error)
      toast.error("Lỗi khi tải danh sách nhân viên")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStaffList()
  }, [])

  // Filter staff list
  const filteredStaffList = staffList.filter((staff) => {
    const matchesSearch = staff.userInfo?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && !staff._destroy) ||
      (statusFilter === "inactive" && staff._destroy)
    const matchesLocation = locationFilter === "all" || staff.locationInfo?._id === locationFilter
    const matchesPosition =
      positionFilter === "all" || staff.positionName?.toLowerCase() === positionFilter.toLowerCase()

    return matchesSearch && matchesStatus && matchesLocation && matchesPosition
  })

  // Modal handlers
  const handleOpenAddModal = () => {
    setEditingStaff(null)
    setIsAddEditModalOpen(true)
  }

  const handleOpenEditModal = (staff) => {
    setEditingStaff(staff)
    setIsAddEditModalOpen(true)
  }

  const handleCloseAddEditModal = () => {
    setIsAddEditModalOpen(false)
    setEditingStaff(null)
  }

  const handleRowClick = (staff) => {
    setSelectedStaff(staff)
    setIsDetailModalOpen(true)
  }

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false)
    // Don't reset selectedStaff here to maintain it for potential delete operation
  }

  const handleStaffUpdateFromModal = (staff) => {
    console.log("🚀 ~ handleStaffUpdateFromModal ~ staff:", staff)
    setSelectedStaff(staff)
    setEditingStaff(staff)
    setIsDetailModalOpen(false)
    setIsAddEditModalOpen(true)
  }

  const handleStaffDeleteFromModal = (staff) => {
    console.log("🚀 ~ handleStaffDeleteFromModal ~ staff:", staff)
    console.log("🚀 ~ handleStaffDeleteFromModal ~ selectedStaff before:", selectedStaff)
    // Don't reset selectedStaff here, keep it for the delete operation
    setIsDetailModalOpen(false)
    setOpenDeleteDialog(true)
    console.log("🚀 ~ handleStaffDeleteFromModal ~ selectedStaff after:", selectedStaff)
  }

  // Handle staff creation with OTP
  const handleStaffCreate = async (staffData) => {
    try {
      // Step 1: Send OTP
      const phoneFormatted = formatPhoneNumber(staffData.phone)
      const otpResponse = await createStaffSignupAPI(phoneFormatted)

      if (otpResponse.success) {
        setPendingStaffData({ ...staffData, phone: phoneFormatted })
        setIsOtpModalOpen(true)
        setIsAddEditModalOpen(false)
      } else {
        toast.error(otpResponse.message || "Lỗi khi gửi OTP")
      }
    } catch (error) {
      console.error("Error sending OTP:", error)
      toast.error("Lỗi khi gửi OTP")
    }
  }

  // Handle OTP verification
  const handleOtpVerify = async (otpCode) => {
    try {
      const dataToVerify = {
        ...pendingStaffData,
        code: otpCode,
        age: parseInt(pendingStaffData.age),
        hourlyRate: parseFloat(pendingStaffData.hourlyRate),
        hoursWorked: pendingStaffData.hoursWorked ? parseFloat(pendingStaffData.hoursWorked) : 0,
      }

      const response = await verifyStaffOTPAPI(dataToVerify)

      if (response.success) {
        toast.success("Tạo nhân viên thành công!")
        setIsOtpModalOpen(false)
        setPendingStaffData(null)
        fetchStaffList() // Refresh list
      } else {
        toast.error(response.message || "Lỗi xác thực OTP")
      }
    } catch (error) {
      console.error("Error verifying OTP:", error)
      toast.error("Lỗi xác thực OTP")
    }
  }

  // Handle staff update
  const handleStaffUpdate = async (staffId, updateData) => {
    try {
      const response = await updateStaffAPI(staffId, updateData)

      if (response.success) {
        toast.success("Cập nhật nhân viên thành công!")
        fetchStaffList() // Refresh list
        setIsAddEditModalOpen(false)
      } else {
        toast.error(response.message || "Lỗi cập nhật nhân viên")
      }
    } catch (error) {
      console.error("Error updating staff:", error)
      toast.error("Lỗi cập nhật nhân viên")
    }
  }

  // Handle staff delete
  const handleDeleteStaff = async () => {
    console.log("🚀 ~ handleDeleteStaff ~ selectedStaff:", selectedStaff)

    if (!selectedStaff) {
      console.log("🚀 ~ handleDeleteStaff ~ selectedStaff is null - no staff selected")
      return
    }

    try {
      setDeleting(true)
      const response = await softDeleteStaffAPI(selectedStaff._id)

      if (response.success) {
        toast.success("Xóa nhân viên thành công!")
        fetchStaffList() // Refresh list
        setOpenDeleteDialog(false)
        setSelectedStaff(null) // Reset only after successful delete
      } else {
        toast.error(response.message || "Lỗi xóa nhân viên")
      }
    } catch (error) {
      console.error("Error deleting staff:", error)
      toast.error("Lỗi xóa nhân viên")
    } finally {
      setDeleting(false)
      setOpenDeleteDialog(false)
    }
  }

  // Utility functions
  const formatPhoneNumber = (phone) => {
    if (phone.startsWith("0")) {
      return "+84" + phone.substring(1)
    }
    return phone.startsWith("+84") ? phone : "+84" + phone
  }

  const displayPhoneNumber = (phone) => {
    if (phone?.startsWith("+84")) {
      return "0" + phone.substring(3)
    }
    return phone || "N/A"
  }

  const getStatusColor = (isDestroyed) => {
    return !isDestroyed ? "success" : "error"
  }

  const getStatusText = (isDestroyed) => {
    return !isDestroyed ? "Hoạt động" : "Ngưng hoạt động"
  }

  const getPositionText = (position) => {
    switch (position?.toLowerCase()) {
      case "receptionist":
        return "Lễ tân"
      case "cleaner":
        return "Nhân viên vệ sinh"
      default:
        return position || "N/A"
    }
  }

  return (
    <Box sx={{ p: 1, height: "100vh" }}>
      {/* Header */}
      <Card sx={{ mb: 1 }}>
        <CardContent sx={{ "&:last-child": { pb: 2 } }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <PeopleIcon sx={{ fontSize: 32, color: "primary.main" }} />
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                Quản lý nhân viên
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button variant="outlined" startIcon={<ImportIcon />} sx={{ textTransform: "none" }}>
                Import
              </Button>
              <Button variant="outlined" startIcon={<ExportIcon />} sx={{ textTransform: "none" }}>
                Export
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenAddModal}
                sx={{ textTransform: "none", fontWeight: "bold" }}
              >
                Thêm nhân viên
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card sx={{ mb: 1 }}>
        <CardContent sx={{ "&:last-child": { pb: 2 } }}>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
            <TextField
              placeholder="Tìm kiếm nhân viên..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ width: 200 }}
            />

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Trạng thái</InputLabel>
              <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Trạng thái">
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="active">Hoạt động</MenuItem>
                <MenuItem value="inactive">Ngưng hoạt động</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Cơ sở</InputLabel>
              <Select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} label="Cơ sở">
                <MenuItem value="all">Tất cả cơ sở</MenuItem>
                {locations?.map((location) => (
                  <MenuItem key={location._id} value={location._id}>
                    {location.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Chức vụ</InputLabel>
              <Select value={positionFilter} onChange={(e) => setPositionFilter(e.target.value)} label="Chức vụ">
                <MenuItem value="all">Tất cả chức vụ</MenuItem>
                <MenuItem value="receptionist">Lễ tân</MenuItem>
                <MenuItem value="cleaner">Nhân viên vệ sinh</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>
      {/* Staff Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <Typography variant="h6" sx={{ p: 2, pb: 1, fontWeight: "bold", color: "primary.main" }}>
            Danh sách nhân viên ({filteredStaffList.length} người)
          </Typography>

          <TableContainer sx={{ maxHeight: "70vh", overflowY: "auto" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", py: 1 }}>Nhân viên</TableCell>
                  <TableCell sx={{ fontWeight: "bold", py: 1 }}>Số điện thoại</TableCell>
                  <TableCell sx={{ fontWeight: "bold", py: 1 }}>Cơ sở</TableCell>
                  <TableCell sx={{ fontWeight: "bold", py: 1 }}>Chức vụ</TableCell>
                  <TableCell sx={{ fontWeight: "bold", py: 1 }}>Lương/giờ</TableCell>
                  <TableCell sx={{ fontWeight: "bold", py: 1 }}>Giờ làm</TableCell>
                  <TableCell sx={{ fontWeight: "bold", py: 1 }}>Trạng thái</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ textAlign: "center", py: 4 }}>
                      <Typography color="text.secondary">Đang tải dữ liệu...</Typography>
                    </TableCell>
                  </TableRow>
                ) : filteredStaffList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ textAlign: "center", py: 4 }}>
                      <Typography color="text.secondary">Không tìm thấy nhân viên nào</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStaffList.map((staff) => (
                    <TableRow key={staff._id} hover onClick={() => handleRowClick(staff)} sx={{ cursor: "pointer" }}>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <Avatar sx={{ width: 40, height: 40, bgcolor: "primary.main" }}>
                            <AccountIcon />
                          </Avatar>
                          <Box>
                            <Typography fontWeight="medium">{staff.userInfo?.fullName || "N/A"}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {staff.userInfo?.email || "Chưa có email"}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2">{displayPhoneNumber(staff.userInfo?.phone)}</Typography>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2">{staff.locationInfo?.name || "N/A"}</Typography>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2">{getPositionText(staff.positionName)}</Typography>
                      </TableCell>

                      <TableCell>
                        <Typography fontWeight="bold" color="success.main">
                          {staff.hourlyRate?.toLocaleString("vi-VN")} VNĐ
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography fontWeight="medium">{staff.hoursWorked || 0} giờ</Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={getStatusText(staff._destroy)}
                          color={getStatusColor(staff._destroy)}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Modals */}
      <AddEditStaffModal
        open={isAddEditModalOpen}
        onClose={handleCloseAddEditModal}
        editStaff={editingStaff}
        onStaffCreate={handleStaffCreate}
        onStaffUpdate={handleStaffUpdate}
      />

      <StaffDetailModal
        open={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        staff={selectedStaff}
        onStaffUpdate={handleStaffUpdateFromModal}
        onStaffDelete={handleStaffDeleteFromModal}
      />

      <OtpModal
        open={isOtpModalOpen}
        handleClose={() => {
          setIsOtpModalOpen(false)
          setPendingStaffData(null)
        }}
        handleVerify={handleOtpVerify}
      />

      <ConfirmDialog
        open={openDeleteDialog}
        title="Xác nhận xóa nhân viên"
        description={`Bạn có chắc muốn xóa nhân viên "${selectedStaff?.userInfo?.fullName}"? Hành động này sẽ chuyển nhân viên sang trạng thái ngưng hoạt động.`}
        confirmText="Xóa"
        cancelText="Hủy"
        loading={deleting}
        onCancel={() => setOpenDeleteDialog(false)}
        onConfirm={handleDeleteStaff}
      />
    </Box>
  )
}
