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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Stack,
  Avatar,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material"
import {
  Search as SearchIcon,
  FitnessCenter as GymIcon,
  AttachMoney as MoneyIcon,
  Build as MaintenanceIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Warning as WarningIcon,
} from "@mui/icons-material"

// Import components
import MaintenanceRecordModal from "./MaintenanceRecordModal"
import ConfirmDialog from "~/components/ConfirmDialog"

import { formatCurrencyVND } from "~/utils/common"
import {
  getEquipmentsByLocationAPI,
  updateEquipmentStatusAPI,
  searchEquipmentsAPI,
  addMaintenanceRecordAPI,
  updateMaintenanceRecordAPI,
  deleteMaintenanceRecordAPI,
  canEditMaintenanceRecord,
} from "~/apis/equipment"
import { EQUIPMENT_MUSCLE_CATEGORIES, MUSCLE_CATEGORY_LABELS } from "~/utils/constants"

import useCurrentLocation from "~/stores/useCurrentLocationStore"
import { toast } from "react-toastify"
import EquipmentDetailModal from "./EquipmentDetailModal"

export default function StaffEquipmentPage() {
  // Stores
  const { currentLocation } = useCurrentLocation()

  // Local state
  const [equipments, setEquipments] = useState([])
  const [selectedEquipment, setSelectedEquipment] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [muscleFilter, setMuscleFilter] = useState("all")
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [loading, setLoading] = useState(false)

  // Modal states
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false)
  const [editingMaintenanceRecord, setEditingMaintenanceRecord] = useState(null)
  const [editingMaintenanceIndex, setEditingMaintenanceIndex] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  // Delete confirmation
  const [openDialogConfirm, setOpenDialogConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [recordToDelete, setRecordToDelete] = useState(null)

  // Load equipments when component mounts or location changes
  useEffect(() => {
    const loadEquipments = async () => {
      if (currentLocation) {
        try {
          setLoading(true)
          const data = await getEquipmentsByLocationAPI(currentLocation._id)
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
        } finally {
          setLoading(false)
        }
      }
    }
    loadEquipments()
  }, [currentLocation])

  // Handle status change
  const handleStatusChange = async (equipmentId, newStatus) => {
    console.log("🚀 ~ handleStatusChange ~ newStatus:", newStatus)
    try {
      const result = await updateEquipmentStatusAPI(equipmentId, newStatus)
      if (result.success) {
        // Update equipment in list
        setEquipments((prev) => prev.map((eq) => (eq._id === equipmentId ? { ...eq, status: newStatus } : eq)))

        // Update selected equipment if it's the same
        if (selectedEquipment?._id === equipmentId) {
          setSelectedEquipment((prev) => ({ ...prev, status: newStatus }))
        }

        toast.success("Cập nhật trạng thái thiết bị thành công")
      }
    } catch (error) {
      console.error("Error updating equipment status:", error)
      toast.error("Cập nhật trạng thái thiết bị thất bại")
    }
  }

  // Search handler
  const handleSearch = async () => {
    if (searchTerm.trim()) {
      try {
        const data = await searchEquipmentsAPI(searchTerm)
        // Filter by current location
        const locationEquipments = data.equipments.filter((eq) => eq.locationId === currentLocation._id)
        setEquipments(locationEquipments)
        setPage(0)
      } catch (error) {
        console.error("Error searching equipments:", error)
        toast.error("Lỗi khi tìm kiếm thiết bị")
      }
    } else {
      // Reload equipments for current location
      const data = await getEquipmentsByLocationAPI(currentLocation._id)
      setEquipments(data.equipments || [])
    }
  }

  // Maintenance modal handlers
  const handleOpenAddMaintenanceModal = () => {
    setEditingMaintenanceRecord(null)
    setEditingMaintenanceIndex(null)
    setIsMaintenanceModalOpen(true)
  }

  const handleOpenEditMaintenanceModal = (record, index) => {
    setEditingMaintenanceRecord(record)
    setEditingMaintenanceIndex(index)
    setIsMaintenanceModalOpen(true)
  }

  const handleCloseMaintenanceModal = () => {
    setIsMaintenanceModalOpen(false)
    setEditingMaintenanceRecord(null)
    setEditingMaintenanceIndex(null)
  }

  const handleSaveMaintenanceRecord = async (maintenanceData, recordIndex) => {
    // eslint-disable-next-line no-useless-catch
    try {
      let result

      if (recordIndex !== null) {
        // Update existing record
        result = await updateMaintenanceRecordAPI(selectedEquipment._id, recordIndex, maintenanceData)
      } else {
        // Add new record
        result = await addMaintenanceRecordAPI(selectedEquipment._id, maintenanceData)

        // Auto-update status to MAINTENANCE when adding new record
        await handleStatusChange(selectedEquipment._id, "maintenance")
      }

      if (result.success) {
        // Update equipment in list
        setEquipments((prev) => prev.map((eq) => (eq._id === selectedEquipment._id ? result.equipment : eq)))

        // Update selected equipment
        setSelectedEquipment(result.equipment)
      }
    } catch (error) {
      throw error
    }
  }

  // Delete maintenance record handlers
  const handleOpenDeleteConfirm = (recordIndex) => {
    setRecordToDelete(recordIndex)
    setOpenDialogConfirm(true)
  }

  const handleCloseDeleteConfirm = () => {
    if (!deleting) {
      setOpenDialogConfirm(false)
      setRecordToDelete(null)
    }
  }

  const handleDeleteMaintenanceRecord = async () => {
    try {
      setDeleting(true)

      const result = await deleteMaintenanceRecordAPI(selectedEquipment._id, recordToDelete)

      if (result.success) {
        // Update equipment in list
        setEquipments((prev) => prev.map((eq) => (eq._id === selectedEquipment._id ? result.equipment : eq)))

        // Update selected equipment
        setSelectedEquipment(result.equipment)

        toast.success("Xóa bản ghi bảo trì thành công")
      }
    } catch (error) {
      console.error("Error deleting maintenance record:", error)
      toast.error("Xóa bản ghi bảo trì thất bại")
    } finally {
      setDeleting(false)
      setOpenDialogConfirm(false)
      setRecordToDelete(null)
    }
  }

  // Detail modal handlers
  const handleRowClick = (equipment) => {
    setSelectedEquipment(equipment)
    setIsDetailModalOpen(true)
  }

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false)
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

  const formatDateTime = (timestamp) => {
    if (!timestamp) return "N/A"
    return new Date(timestamp).toLocaleString("vi-VN")
  }

  if (!currentLocation) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Typography variant="h6" color="text.secondary">
          Đang tải thông tin cơ sở...
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 1, height: "100%" }}>
      {/* Header */}
      <Card sx={{ mb: 1 }}>
        <CardContent sx={{ "&:last-child": { pb: 2 } }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <GymIcon sx={{ fontSize: 32, color: "primary.main" }} />
              <Box>
                <Typography variant="h4" fontWeight="bold" color="primary.main">
                  Quản lý thiết bị
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Equipment Table - Full Width */}
      <Card sx={{ height: "79vh", display: "flex", flexDirection: "column" }}>
        <CardContent sx={{ pb: 1 }}>
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
                <MenuItem value="active">Hoạt động</MenuItem>
                <MenuItem value="maintenance">Bảo trì</MenuItem>
                <MenuItem value="broken">Hỏng</MenuItem>
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
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      {equipment.image ? (
                        <img
                          src={equipment.image}
                          alt={equipment.name}
                          style={{
                            width: 48,
                            height: 48,
                            objectFit: "cover",
                            borderRadius: 8,
                          }}
                        />
                      ) : (
                        <Avatar sx={{ width: 48, height: 48 }}>
                          <GymIcon />
                        </Avatar>
                      )}
                      <Typography variant="body1" fontWeight="medium">
                        {equipment.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1">{equipment.brand}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" color="success.main" fontWeight="medium">
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
                          color="primary"
                        />
                      ))}
                      {equipment.muscleCategories?.length > 2 && (
                        <Chip
                          label={`+${equipment.muscleCategories.length - 2}`}
                          size="small"
                          variant="outlined"
                          color="default"
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1">{formatDate(equipment.purchaseDate)}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

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
      <EquipmentDetailModal
        open={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        equipment={selectedEquipment}
        locationName={currentLocation?.name}
        onStatusChange={handleStatusChange}
        onAddMaintenance={handleOpenAddMaintenanceModal}
        onEditMaintenance={handleOpenEditMaintenanceModal}
        onDeleteMaintenance={handleOpenDeleteConfirm}
      />

      <MaintenanceRecordModal
        open={isMaintenanceModalOpen}
        onClose={handleCloseMaintenanceModal}
        equipmentId={selectedEquipment?._id}
        equipmentName={selectedEquipment?.name}
        editRecord={editingMaintenanceRecord}
        recordIndex={editingMaintenanceIndex}
        onSave={handleSaveMaintenanceRecord}
      />

      <ConfirmDialog
        open={openDialogConfirm}
        title="Xác nhận xóa"
        description="Bạn có chắc muốn xóa bản ghi bảo trì này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
        loading={deleting}
        onCancel={handleCloseDeleteConfirm}
        onConfirm={handleDeleteMaintenanceRecord}
      />
    </Box>
  )
}
