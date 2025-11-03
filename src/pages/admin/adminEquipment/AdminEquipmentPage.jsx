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
  IconButton,
  Chip,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Stack,
  Avatar,
  TablePagination,
} from "@mui/material"
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FitnessCenter as GymIcon,
  AttachMoney as MoneyIcon,
  LocationOn as LocationIcon,
  Visibility as ViewIcon,
  Build as MaintenanceIcon,
} from "@mui/icons-material"

// Import components
import AddEditEquipmentModal from "./AddEditEquipmentModal"
import EquipmentDetailModal from "./EquipmentDetailModal"

import { formatCurrencyVND } from "~/utils/common"
import { getEquipmentsByLocationAPI, softDeleteEquipmentAPI, searchEquipmentsAPI } from "~/apis/equipment"
import { EQUIPMENT_MUSCLE_CATEGORIES, MUSCLE_CATEGORY_LABELS } from "~/utils/constants"

import useLocationStore from "~/stores/useLocationStore"
import ConfirmDialog from "~/components/ConfirmDialog"
import { toast } from "react-toastify"
import useEquipmentForAdminStore from "~/stores/useEquipmentForAdminStore"

export default function AdminEquipmentPage() {
  // Stores
  const { equipments, selectedLocation, setEquipments, setSelectedLocation, updateEquipment, removeEquipment } =
    useEquipmentForAdminStore()
  console.log("🚀 ~ AdminEquipmentPage ~ selectedLocation:", selectedLocation)
  const { locations } = useLocationStore()

  // Local state
  const [selectedEquipment, setSelectedEquipment] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [muscleFilter, setMuscleFilter] = useState("all")
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // Modal states
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [editingEquipment, setEditingEquipment] = useState(null)

  // Delete confirmation
  const [openDialogConfirm, setOpenDialogConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Initialize with first location
  useEffect(() => {
    if (locations.length > 0 && !selectedLocation) {
      setSelectedLocation(locations[0])
    }
  }, [locations, selectedLocation, setSelectedLocation])

  // Load equipments when location changes
  useEffect(() => {
    const loadEquipments = async () => {
      if (selectedLocation) {
        try {
          const data = await getEquipmentsByLocationAPI(selectedLocation._id)
          setEquipments(data.equipments || [])
          // Set first equipment as selected if available
          if (data.equipments && data.equipments.length > 0) {
            setSelectedEquipment(data.equipments[0])
          } else {
            setSelectedEquipment(null)
          }
        } catch (error) {
          console.error("Error loading equipments:", error)
          toast.error("Lỗi khi tải danh sách thiết bị")
        }
      }
    }
    loadEquipments()
  }, [selectedLocation, setEquipments])

  // Handle location change
  const handleLocationChange = (locationId) => {
    const location = locations.find((loc) => loc._id === locationId)
    setSelectedLocation(location)
    setSearchTerm("") // Reset search when changing location
    setPage(0) // Reset pagination
  }

  // Modal handlers
  const handleOpenAddModal = () => {
    setEditingEquipment(null)
    setIsAddEditModalOpen(true)
  }

  const handleOpenEditModal = (equipment) => {
    setEditingEquipment(equipment)
    setIsAddEditModalOpen(true)
  }

  const handleCloseAddEditModal = () => {
    setIsAddEditModalOpen(false)
    setEditingEquipment(null)
  }

  const handleUpdateSuccess = (id, dataUpdated) => {
    setSelectedEquipment(dataUpdated)
    updateEquipment(id, dataUpdated)
  }

  // Detail modal handlers
  const handleRowClick = (equipment) => {
    setSelectedEquipment(equipment)
    setIsDetailModalOpen(true)
  }

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false)
  }

  // Delete handlers
  const handleOpenDialogConfirm = () => setOpenDialogConfirm(true)

  const handleCloseDialogConfirm = () => {
    if (!deleting) setOpenDialogConfirm(false)
  }

  const handleClickDelete = async () => {
    try {
      setDeleting(true)

      const result = await softDeleteEquipmentAPI(selectedEquipment._id)

      if (result.success) {
        toast.success("Đã xóa thiết bị thành công")
        removeEquipment(selectedEquipment._id)

        // Select next equipment or clear selection
        const remainingEquipments = equipments.filter((eq) => eq._id !== selectedEquipment._id)
        setSelectedEquipment(remainingEquipments[0] || null)
      }
    } catch (error) {
      console.error("Error deleting equipment:", error)
      toast.error("Xóa thiết bị thất bại")
    } finally {
      setDeleting(false)
      setOpenDialogConfirm(false)
    }
  }

  // Search handler
  const handleSearch = async () => {
    if (searchTerm.trim()) {
      try {
        const data = await searchEquipmentsAPI(searchTerm)
        // Filter by current location
        const locationEquipments = data.equipments.filter((eq) => eq.locationId === selectedLocation._id)
        setEquipments(locationEquipments)
        setPage(0)
      } catch (error) {
        console.error("Error searching equipments:", error)
        toast.error("Lỗi khi tìm kiếm thiết bị")
      }
    } else {
      // Reload equipments for current location
      const data = await getEquipmentsByLocationAPI(selectedLocation._id)
      setEquipments(data.equipments || [])
    }
  }

  // Filter equipments
  const filteredEquipments = equipments.filter((equipment) => {
    const matchesStatus = statusFilter === "all" || equipment.status === statusFilter
    const matchesMuscle =
      muscleFilter === "all" || (equipment.muscleCategories && equipment.muscleCategories.includes(muscleFilter))

    return matchesStatus && matchesMuscle
  })

  // Pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // Status helpers
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "success"
      case "maintenance":
        return "warning"
      case "broken":
        return "error"
      default:
        return "default"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Hoạt động"
      case "maintenance":
        return "Bảo trì"
      case "broken":
        return "Hỏng"
      default:
        return status
    }
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A"
    return new Date(timestamp).toLocaleDateString("vi-VN")
  }

  return (
    <Box sx={{ p: 1, height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Card sx={{ mb: 1 }}>
        <CardContent sx={{ "&:last-child": { pb: 2 } }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <GymIcon sx={{ fontSize: 32, color: "primary.main" }} />
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                Quản lý thiết bị
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenAddModal}
                disabled={!selectedLocation}
              >
                Thêm thiết bị
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ height: "auto", display: "flex", flexDirection: "column", mb: 1 }}>
        <CardContent sx={{ "&:last-child": { pb: 0 } }}>
          {/* Location Selector */}
          <Box sx={{ mb: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Chọn cơ sở</InputLabel>
              <Select
                value={selectedLocation?._id || ""}
                onChange={(e) => handleLocationChange(e.target.value)}
                label="Chọn cơ sở"
                startAdornment={<LocationIcon color="action" sx={{ mr: 1 }} />}
              >
                {locations.map((location) => (
                  <MenuItem key={location._id} value={location._id}>
                    {location.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Search and Filters */}
          <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
            <TextField
              size="small"
              placeholder="Tìm kiếm thiết bị..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              InputProps={{
                startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
              }}
              sx={{ minWidth: 250 }}
            />
            <Button variant="outlined" onClick={handleSearch}>
              Tìm kiếm
            </Button>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Trạng thái</InputLabel>
              <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Trạng thái">
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="ACTIVE">Hoạt động</MenuItem>
                <MenuItem value="MAINTENANCE">Bảo trì</MenuItem>
                <MenuItem value="BROKEN">Hỏng</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Nhóm cơ</InputLabel>
              <Select value={muscleFilter} onChange={(e) => setMuscleFilter(e.target.value)} label="Nhóm cơ">
                <MenuItem value="all">Tất cả</MenuItem>
                {Object.entries(EQUIPMENT_MUSCLE_CATEGORIES).map(([key, value]) => (
                  <MenuItem key={value} value={value}>
                    {MUSCLE_CATEGORY_LABELS[value]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <Typography variant="h6" sx={{ p: 2, pb: 1, fontWeight: "bold", color: "primary.main" }}>
          Bảng trang thiếp bị của cơ sở {selectedLocation?.name}
        </Typography>
        <CardContent sx={{ pb: 1, flex: 1 }}>
          {/* Equipment Table */}
          <TableContainer sx={{ flex: 1 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow sx={{ bgcolor: "grey.50" }}>
                  <TableCell sx={{ fontWeight: "bold", py: 1 }}>Thiết bị</TableCell>
                  <TableCell sx={{ fontWeight: "bold", py: 1 }}>Thương hiệu</TableCell>
                  <TableCell sx={{ fontWeight: "bold", py: 1 }}>Giá</TableCell>
                  <TableCell sx={{ fontWeight: "bold", py: 1 }}>Trạng thái</TableCell>
                  <TableCell sx={{ fontWeight: "bold", py: 1 }}>Nhóm cơ</TableCell>
                  <TableCell sx={{ fontWeight: "bold", py: 1 }}>Ngày mua</TableCell>
                  <TableCell sx={{ fontWeight: "bold", py: 1 }}>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEquipments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((equipment) => (
                  <TableRow
                    key={equipment._id}
                    hover
                    onClick={() => handleRowClick(equipment)}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {equipment.image ? (
                          <img
                            src={equipment.image}
                            alt={equipment.name}
                            style={{
                              width: 40,
                              height: 40,
                              objectFit: "cover",
                              borderRadius: 4,
                            }}
                          />
                        ) : (
                          <Avatar sx={{ width: 40, height: 40 }}>
                            <GymIcon />
                          </Avatar>
                        )}
                        <Typography variant="body2" fontWeight="medium">
                          {equipment.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{equipment.brand}</TableCell>
                    <TableCell>
                      <Typography variant="body2" color="success.main" fontWeight="medium">
                        {formatCurrencyVND(equipment.price)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusText(equipment.status)}
                        color={getStatusColor(equipment.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {equipment.muscleCategories?.slice(0, 2).map((category) => (
                          <Chip
                            key={category}
                            label={MUSCLE_CATEGORY_LABELS[category]}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                        {equipment.muscleCategories?.length > 2 && (
                          <Chip label={`+${equipment.muscleCategories.length - 2}`} size="small" variant="outlined" />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>{formatDate(equipment.purchaseDate)}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 0.5 }}>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleOpenEditModal(equipment)
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedEquipment(equipment)
                            handleOpenDialogConfirm()
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredEquipments.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số hàng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`}
        />
      </Card>

      {/* Modals */}
      <AddEditEquipmentModal
        open={isAddEditModalOpen}
        onClose={handleCloseAddEditModal}
        editEquipment={editingEquipment}
        handleUpdateSuccess={handleUpdateSuccess}
      />

      <EquipmentDetailModal
        open={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        equipment={selectedEquipment}
        locationName={selectedLocation?.name}
      />

      <ConfirmDialog
        open={openDialogConfirm}
        title="Xác nhận xóa"
        description={`Bạn có chắc muốn xóa thiết bị "${selectedEquipment?.name}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        loading={deleting}
        onCancel={handleCloseDialogConfirm}
        onConfirm={handleClickDelete}
      />
    </Box>
  )
}
