import React, { useState, useEffect, useMemo } from "react"
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  TextField,
  MenuItem,
  Chip,
  Avatar,
  Stack,
  TablePagination,
  Toolbar,
  InputAdornment,
  Alert,
  Snackbar,
  CardContent,
  Card,
} from "@mui/material"
import {
  Add as AddIcon,
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Phone as PhoneIcon,
  Group as GroupIcon,
  MeetingRoom as RoomIcon,
  FitnessCenter as EquipmentIcon,
} from "@mui/icons-material"
import HomeWorkIcon from "@mui/icons-material/HomeWork"

import { getListLocationForAdminAPI, createLocationAPI, updateLocationAPI, deleteLocationAPI } from "~/apis/location"
import LocationDetailModal from "./LocationDetailModal"
import AddEditLocationModal from "./AddEditLocationModal"
import DeleteLocationConfirmDialog from "./DeleteLocationConfirmDialog"
import useLocationForAdminStore from "~/stores/useLocationForAdminStore"

function AdminLocationPage() {
  const {
    locations,
    pagination,
    loading,
    error,
    searchTerm,
    selectedProvince,
    setLocations,
    setPagination,
    addLocation,
    updateLocation,
    removeLocation,
    setLoading,
    setError,
    setSearchTerm,
    setSelectedProvince,
    getFilteredLocations,
    getUniqueProvinces,
  } = useLocationForAdminStore()

  // Local state
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [addEditModalOpen, setAddEditModalOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingLocation, setEditingLocation] = useState(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" })

  // Load locations on component mount and pagination changes
  useEffect(() => {
    fetchLocations(pagination.currentPage, rowsPerPage)
  }, [pagination.currentPage, rowsPerPage])

  const fetchLocations = async (pageNum = 1, limit = 10) => {
    try {
      setLoading(true)
      const response = await getListLocationForAdminAPI(pageNum, limit)
      if (response.success) {
        setLocations(response.locations)
        console.log("🚀 ~ fetchLocations ~ response.locations:", response.locations)
        setPagination(response.pagination)
      } else {
        setError(response.message || "Lỗi khi tải danh sách location")
      }
    } catch (error) {
      console.error("Error fetching locations:", error)
      setError("Lỗi kết nối. Vui lòng thử lại sau.")
    } finally {
      setLoading(false)
    }
  }

  // Filter locations for display (client-side filtering for search/province)
  const filteredLocations = useMemo(() => {
    return locations.filter((location) => {
      const matchesSearch =
        !searchTerm ||
        location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.phone.includes(searchTerm) ||
        location.address.street.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.address.ward.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesProvince = !selectedProvince || location.address.province === selectedProvince

      return matchesSearch && matchesProvince
    })
  }, [locations, searchTerm, selectedProvince])

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
    const newPageNum = newPage + 1
    if (newPageNum !== pagination.currentPage) {
      fetchLocations(newPageNum, rowsPerPage)
    }
  }

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10)
    setRowsPerPage(newRowsPerPage)
    setPage(0)
    fetchLocations(1, newRowsPerPage)
  }

  // Modal handlers
  const handleViewDetails = (location) => {
    setSelectedLocation(location)
    setDetailModalOpen(true)
  }

  const handleEdit = (location) => {
    setEditingLocation(location)
    setAddEditModalOpen(true)
  }

  const handleDelete = (location) => {
    setSelectedLocation(location)
    setDeleteDialogOpen(true)
  }

  const handleAddNew = () => {
    setEditingLocation(null)
    setAddEditModalOpen(true)
  }

  // CRUD operations
  const handleCreateLocation = async (formData) => {
    try {
      const response = await createLocationAPI(formData)
      if (response.success) {
        addLocation(response.location)
        setSnackbar({ open: true, message: "Thêm location thành công!", severity: "success" })
        setAddEditModalOpen(false)
        // Refresh data to get accurate counts
        fetchLocations(pagination.currentPage, rowsPerPage)
      } else {
        setSnackbar({ open: true, message: response.message || "Lỗi khi thêm location", severity: "error" })
      }
    } catch (error) {
      console.error("Error creating location:", error)
      setSnackbar({ open: true, message: "Lỗi kết nối. Vui lòng thử lại sau.", severity: "error" })
    }
  }

  const handleUpdateLocation = async (locationId, formData) => {
    try {
      const response = await updateLocationAPI(locationId, formData)
      if (response.success) {
        updateLocation(locationId, response.location)
        setSnackbar({ open: true, message: "Cập nhật location thành công!", severity: "success" })
        setAddEditModalOpen(false)
        // Refresh data to get accurate counts
        fetchLocations(pagination.currentPage, rowsPerPage)
      } else {
        setSnackbar({ open: true, message: response.message || "Lỗi khi cập nhật location", severity: "error" })
      }
    } catch (error) {
      console.error("Error updating location:", error)
      setSnackbar({ open: true, message: "Lỗi kết nối. Vui lòng thử lại sau.", severity: "error" })
    }
  }

  const handleDeleteLocation = async (locationId) => {
    try {
      const response = await deleteLocationAPI(locationId)
      if (response.success) {
        removeLocation(locationId)
        setSnackbar({ open: true, message: "Xóa location thành công!", severity: "success" })
        setDeleteDialogOpen(false)
        setSelectedLocation(null)
        // Refresh data
        fetchLocations(pagination.currentPage, rowsPerPage)
      } else {
        setSnackbar({ open: true, message: response.message || "Lỗi khi xóa location", severity: "error" })
      }
    } catch (error) {
      console.error("Error deleting location:", error)
      setSnackbar({ open: true, message: "Lỗi kết nối. Vui lòng thử lại sau.", severity: "error" })
    }
  }

  const formatAddress = (address) => {
    return `${address.street}, ${address.ward}, ${address.province}`
  }

  const uniqueProvinces = useMemo(() => {
    return [...new Set(locations.map((location) => location.address.province))].sort()
  }, [locations])

  return (
    <Box sx={{ p: 1, height: "100%" }}>
      <Card sx={{ mb: 1 }}>
        <CardContent sx={{ "&:last-child": { pb: 2 } }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <HomeWorkIcon sx={{ fontSize: 32, color: "primary.main" }} />
              <Typography variant="h4" fontWeight="bold">
                Quản lý Location
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddNew}>
                Thêm Location
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Search and Filter Toolbar */}
      <Paper sx={{ p: 1, mb: 1 }}>
        <Toolbar sx={{ px: 0 }}>
          <TextField
            placeholder="Tìm kiếm theo tên, địa chỉ, số điện thoại..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="outlined"
            size="small"
            sx={{ mr: 2, minWidth: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            select
            label="Lọc theo tỉnh/thành phố"
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            variant="outlined"
            size="small"
            sx={{ minWidth: 300 }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            {uniqueProvinces.map((province) => (
              <MenuItem key={province} value={province}>
                {province}
              </MenuItem>
            ))}
          </TextField>
        </Toolbar>
      </Paper>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Main Table */}
      <Paper sx={{ display: "flex", flexDirection: "column", flex: 1, height: "67vh" }}>
        <TableContainer sx={{ flex: 1 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Tên Location</TableCell>
                <TableCell>Địa chỉ</TableCell>
                <TableCell align="center">Số điện thoại</TableCell>
                <TableCell align="center">Nhân viên</TableCell>
                <TableCell align="center">Phòng</TableCell>
                <TableCell align="center">Thiết bị</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography>Đang tải...</Typography>
                  </TableCell>
                </TableRow>
              ) : filteredLocations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">Không có dữ liệu</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredLocations.map((location) => (
                  <TableRow
                    key={location._id}
                    hover
                    sx={{ cursor: "pointer" }}
                    onClick={() => handleViewDetails(location)}
                  >
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar sx={{ bgcolor: "primary.main" }}>
                          <LocationIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {location.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {location._id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{formatAddress(location.address)}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
                        <PhoneIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                        <Typography variant="body2">{location.phone}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        icon={<GroupIcon />}
                        label={location.staffCount || 0}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        icon={<RoomIcon />}
                        label={location.roomCount || 0}
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        icon={<EquipmentIcon />}
                        label={location.equipmentCount || 0}
                        size="small"
                        color="warning"
                        variant="outlined"
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={pagination.totalLocations || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số hàng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`}
        />
      </Paper>

      {/* Modals */}
      <LocationDetailModal
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        location={selectedLocation}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AddEditLocationModal
        open={addEditModalOpen}
        onClose={() => setAddEditModalOpen(false)}
        location={editingLocation}
        onSubmit={editingLocation ? handleUpdateLocation : handleCreateLocation}
        isEditing={!!editingLocation}
      />

      <DeleteLocationConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        location={selectedLocation}
        onConfirm={handleDeleteLocation}
      />

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default AdminLocationPage
