import React, { useState, useEffect } from "react"
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
  Chip,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Stack,
  TablePagination,
  CircularProgress,
  Alert,
  Paper,
  Tooltip,
} from "@mui/material"
import {
  People as PeopleIcon,
  Person as PersonIcon,
  Search as SearchIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  PersonOff as PersonOffIcon,
  Clear as ClearIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material"

// Import components and stores
import UserDetailModal from "./UserDetailModal"
import useLocationStore from "~/stores/useLocationStore"

// Import APIs
import { getListUserForAdminAPI, softDeleteUserAPI } from "~/apis/user"
import useListUserForAdminStore from "~/stores/useListUserForAdminStore" //do

function AdminUserPage() {
  // Zustand stores
  const { listUsers, loading, pagination, setListUsers, setPagination, setLoading, softDeleteUser } =
    useListUserForAdminStore()

  const { locations } = useLocationStore()

  // Component state
  const [filteredUsers, setFilteredUsers] = useState([]) //danhsach user khi ap dung filter
  const [selectedUser, setSelectedUser] = useState(null)// user dc chon de xem chi tiet
  const [error, setError] = useState("") 
  const [successMessage, setSuccessMessage] = useState("")//thong bao thanh cong

  // Filter state 
  const [searchTerm, setSearchTerm] = useState("") //tu khoa tim kiem
  const [subscriptionFilter, setSubscriptionFilter] = useState("all") //goi tap: all, hasSubscription, noSubscription
  const [statusFilter, setStatusFilter] = useState("active") // active, deleted, all

  // Modal states
  const [isUserModalOpen, setIsUserModalOpen] = useState(false) //modal xem chi tiet user
  const [deleteLoading, setDeleteLoading] = useState(false) //trang thai loading khi xoa user

  // Utility functions
  const hasActiveSubscription = (user) => { // kiem tra user co goi tap dang hoat dong khong
    if (!user.subscriptions || user.subscriptions.length === 0) return false

    const now = new Date()
    return user.subscriptions.some((sub) => {
      const endDate = new Date(sub.endDate)
      return sub.status === "active" && endDate > now
    })
  }

  const getUserStatusColor = (user) => {// lay mau trang thai 
    if (user.isDeleted) return "error"
    return hasActiveSubscription(user) ? "success" : "default"
  }

  const getUserStatusText = (user) => { // lay text trang thai
    if (user.isDeleted) return "Đã xóa"
    return hasActiveSubscription(user) ? "Đang tập" : "Hết hạn"
  }

  // Fetch users data
  const fetchUsers = async (currentPage = 0) => { // trang hien tai
    try {
      setLoading(true) // bat dau loading
      setError("") // xoa loi cu

      const response = await getListUserForAdminAPI(currentPage + 1, pagination.limit) //api lay ds user
      console.log("🚀 ~ fetchUsers ~ response:", response)

      if (response.success) { //neu thanh cong
        setListUsers(response.data.users || [])// cap nhat store
        setPagination(// cap nhat phan trang
          response.data.pagination || {
            currentPage: 1,
            totalPages: 1,
            totalUsers: 0,
            limit: 20,
            hasNext: false,
            hasPrev: false,
          },
        )
      } else {// neu khong thanh cong
        setError("Không thể tải danh sách người dùng")
      }
    } catch (err) {//xu ly loi
      console.error("Error fetching users:", err)
      setError("Có lỗi xảy ra khi tải dữ liệu")
    } finally {
      setLoading(false)// ket thuc loading
    }
  }

  // Filter users based on search term, subscription status, and delete status
  const filterUsers = () => { // loc user dua tren tu khoa, trang thai goi tap, trang thai xoa
    let filtered = listUsers

    // Filter by search term (name, phone, email)
    if (searchTerm.trim()) { // neu co tu khoa tim kiem
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(// loc user
        (user) =>
          user.fullName?.toLowerCase().includes(search) ||
          user.phone?.includes(searchTerm) ||
          user.email?.toLowerCase().includes(search),
      )
    }

    // Filter by subscription status goi tap
    if (subscriptionFilter !== "all") { // neu khong phai all
      filtered = filtered.filter((user) => {// kiem tra dieu kien loc
        const hasActive = hasActiveSubscription(user)// kiem tra user co goi tap dang hoat dong khong
        return subscriptionFilter === "hasSubscription" ? hasActive : !hasActive// neu loc theo co goi tap thi phai co, nguoc lai phai khong co
      })
    }

    // Filter by delete status
    if (statusFilter === "active") { // hien thi user chua bi xoa
      filtered = filtered.filter((user) => !user.isDeleted) 
    } else if (statusFilter === "deleted") {// hien thi user da bi xoa
      filtered = filtered.filter((user) => user.isDeleted)
    }

    setFilteredUsers(filtered)
  }

  // Effects
  useEffect(() => { 
    fetchUsers(pagination.currentPage - 1)// trang hien tai trong store bat dau tu 1
  }, [pagination.currentPage, pagination.limit, statusFilter])

  useEffect(() => {
    filterUsers()
  }, [listUsers, searchTerm, subscriptionFilter, statusFilter])

  // Auto clear messages after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 5000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  // Event handlers
  const handleRowClick = (user) => {
    setSelectedUser(user)
    setIsUserModalOpen(true)
  }

  const handleCloseUserModal = () => {
    setIsUserModalOpen(false)
    setSelectedUser(null)
  }

  const handleChangePage = (event, newPage) => {
    setPagination({ ...pagination, currentPage: newPage + 1 })
  }

  const handleChangeRowsPerPage = (event) => {
    const newLimit = parseInt(event.target.value, 10)
    setPagination({ ...pagination, limit: newLimit, currentPage: 1 })
  }

  // Filter handlers
  const handleSearchChange = (event) => { 
    setSearchTerm(event.target.value)
  }

  const handleSubscriptionFilterChange = (event) => {
    setSubscriptionFilter(event.target.value)
  }

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value)
  }

  const handleClearFilters = () => {
    setSearchTerm("")
    setSubscriptionFilter("all")
    setStatusFilter("active")
  }

  // Delete user handler
  const handleDeleteUser = async (userId) => {
    try {
      setDeleteLoading(true)

      const response = await softDeleteUserAPI(userId)

      if (response.success) {
        setSuccessMessage(response.message || "Đã xóa người dùng thành công")

        // Update store
        softDeleteUser(userId)

        // Close modal
        handleCloseUserModal()
      } else {
        setError(response.message || "Không thể xóa người dùng")
      }
    } catch (err) {
      console.error("Error soft deleting user:", err)
      setError("Có lỗi xảy ra khi xóa người dùng")
    } finally {
      setDeleteLoading(false)
    }
  }

  const getFilterSummary = () => {
    const totalFiltered = filteredUsers.length
    const activeCount = filteredUsers.filter((user) => !user.isDeleted).length
    const deletedCount = filteredUsers.filter((user) => user.isDeleted).length
    const withSubscriptionCount = filteredUsers.filter((user) => hasActiveSubscription(user)).length

    return { totalFiltered, activeCount, deletedCount, withSubscriptionCount }
  }

  const filterSummary = getFilterSummary()

  return (
    <Box sx={{ p: 1, height: "100%", display: "flex", flexDirection: "column" }}>
      <Card sx={{ mb: 1 }}>
        <CardContent sx={{ "&:last-child": { pb: 0 } }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <PeopleIcon sx={{ fontSize: 32, color: "primary.main" }} />
            <Typography variant="h4" fontWeight="bold" color="primary">
              Quản lý người dùng
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Filters */}
      <Card sx={{ mb: 1, boxShadow: 1 }}>
        <CardContent sx={{ "&:last-child": { pb: 2 } }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Tìm kiếm theo tên, số điện thoại, email..."
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: "action.active" }} />,
                }}
              />
            </Grid>

            <Grid item size={{ xs: 12, md: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Trạng thái gói tập</InputLabel>
                <Select value={subscriptionFilter} onChange={handleSubscriptionFilterChange} label="Trạng thái gói tập">
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="hasSubscription">Đang có gói tập</MenuItem>
                  <MenuItem value="noSubscription">Hết hạn gói tập</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item size={{ xs: 12, md: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Trạng thái tài khoản</InputLabel>
                <Select value={statusFilter} onChange={handleStatusFilterChange} label="Trạng thái tài khoản">
                  <MenuItem value="active">Đang hoạt động</MenuItem>
                  <MenuItem value="deleted">Đã xóa</MenuItem>
                  <MenuItem value="all">Tất cả</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item size={{ xs: 12, md: 2 }}>
              <Button variant="outlined" onClick={handleClearFilters} fullWidth startIcon={<ClearIcon />}>
                Xóa bộ lọc
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card sx={{ overflow: "hidden", flex: 1 }}>
        <CardContent sx={{ p: 0, "&:last-child": { pb: 0 }, height: "100%" }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress size={48} />
            </Box>
          ) : (
            <Box sx={{ height: "100%", display: "flex", flexDirection: "column", flex: 1 }}>
              <TableContainer sx={{ flex: 1 }}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow sx={{}}>
                      <TableCell sx={{ fontWeight: "bold", fontSize: "0.9rem" }}>Người dùng</TableCell>
                      <TableCell sx={{ fontWeight: "bold", fontSize: "0.9rem" }}>Liên hệ</TableCell>
                      <TableCell sx={{ fontWeight: "bold", fontSize: "0.9rem" }}>Gói tập</TableCell>
                      <TableCell sx={{ fontWeight: "bold", fontSize: "0.9rem" }}>Lịch sử tập</TableCell>
                      <TableCell sx={{ fontWeight: "bold", fontSize: "0.9rem" }}>Booking PT</TableCell>
                      <TableCell sx={{ fontWeight: "bold", fontSize: "0.9rem" }}>Trạng thái</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredUsers.map((user, index) => (
                      <TableRow
                        key={user._id}
                        hover
                        onClick={() => handleRowClick(user)}
                        sx={{
                          cursor: "pointer",
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Avatar
                              src={user.avatar}
                              sx={{
                                bgcolor: user.isDeleted ? "grey.400" : "primary.main",
                                border: user.isDeleted ? "2px solid" : "none",
                                borderColor: "error.main",
                              }}
                            >
                              {user.isDeleted ? <PersonOffIcon /> : <PersonIcon />}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2" fontWeight="bold">
                                {user.fullName || "N/A"}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                #{index + 1} • ID: {user._id.slice(-6)}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Stack spacing={0.5}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <PhoneIcon fontSize="small" color="action" />
                              <Typography variant="body2">{user.phone || "Chưa có"}</Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <EmailIcon fontSize="small" color="action" />
                              <Typography variant="body2" sx={{ maxWidth: 150 }} noWrap>
                                {user.email || "Chưa có"}
                              </Typography>
                            </Box>
                          </Stack>
                        </TableCell>

                        <TableCell>
                          <Stack spacing={1}>
                            <Chip
                              size="small"
                              label={hasActiveSubscription(user) ? "Đang tập" : "Hết hạn"}
                              color={hasActiveSubscription(user) ? "success" : "default"}
                              variant="outlined"
                              icon={hasActiveSubscription(user) ? <CheckCircleIcon /> : <CancelIcon />}
                            />
                            <Typography variant="caption" color="text.secondary">
                              {user.subscriptions?.length || 0} gói tập
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell>
                          <Stack spacing={1}>
                            <Typography variant="body2" fontWeight="medium">
                              {user.attendances?.length || 0} lần tập
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Tổng giờ:{" "}
                              {user.attendances?.reduce((total, att) => total + (att.hours || 0), 0).toFixed(1)}h
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell>
                          <Stack spacing={1}>
                            <Typography variant="body2" fontWeight="medium">
                              {user.booking?.length || 0} booking
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {user.booking?.filter((b) => b.status === "completed").length || 0} hoàn thành
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell>
                          <Chip
                            label={getUserStatusText(user)}
                            color={getUserStatusColor(user)}
                            variant={user.isDeleted ? "filled" : "outlined"}
                            size="medium"
                            sx={{
                              fontWeight: "bold",
                              minWidth: 80,
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}

                    {filteredUsers.length === 0 && !loading && (
                      <TableRow>
                        <TableCell colSpan={6} sx={{ textAlign: "center", py: 8 }}>
                          <PersonOffIcon sx={{ fontSize: 64, color: "grey.300", mb: 2 }} />
                          <Typography variant="h6" color="text.secondary" gutterBottom>
                            Không tìm thấy người dùng nào
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Thử thay đổi bộ lọc tìm kiếm để xem kết quả khác
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Enhanced Pagination */}
              <Box sx={{ borderTop: 1, borderColor: "divider" }}>
                <TablePagination
                  component="div"
                  count={pagination.totalUsers}
                  page={pagination.currentPage - 1}
                  onPageChange={handleChangePage}
                  rowsPerPage={pagination.limit}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[10, 20, 50, 100]}
                  labelRowsPerPage="Số hàng mỗi trang:"
                  labelDisplayedRows={({ from, to, count }) =>
                    `${from}-${to} trong ${count !== -1 ? count : `hơn ${to}`}`
                  }
                  sx={{
                    "& .MuiTablePagination-toolbar": {
                      minHeight: 64,
                    },
                  }}
                />
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* User Detail Modal */}
      <UserDetailModal
        open={isUserModalOpen}
        onClose={handleCloseUserModal}
        user={selectedUser}
        locations={locations}
        onDeleteUser={handleDeleteUser}
        deleteLoading={deleteLoading}
      />
    </Box>
  )
}

export default AdminUserPage
