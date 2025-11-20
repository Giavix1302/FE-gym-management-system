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
  IconButton,
  Chip,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  LinearProgress,
  AvatarGroup,
  Snackbar,
  Alert,
} from "@mui/material"
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FileDownload as ExportIcon,
  FileUpload as ImportIcon,
  Class as ClassIcon,
  SelfImprovement as YogaIcon,
  SportsKabaddi as BoxingIcon,
  MusicNote as DanceIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material"
import AddEditClassModal from "./AddEditClassModal"
import ClassDetailModal from "./ClassDetailModal"
import ConfirmDialog from "~/components/ConfirmDialog"
import useRoomsStore from "~/stores/useRoomsStore"
import useListTrainerInfoForAdmin from "~/stores/useListTrainerInfoForAdmin"
import { deleteClassAPI, getListClassForAdminAPI } from "~/apis/class"
import useLocationStore from "~/stores/useLocationStore"

// Main Component
export default function StaffClassPage() {
  const { rooms } = useRoomsStore()
  const { listTrainerInfo } = useListTrainerInfoForAdmin()
  const { locations } = useLocationStore()

  const [classes, setClasses] = useState([])
  console.log("🚀 ~ StaffClassPage ~ classes:", classes)
  const [selectedClass, setSelectedClass] = useState(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [formModalOpen, setFormModalOpen] = useState(false)
  const [editingClass, setEditingClass] = useState(null)

  const [searchTerm, setSearchTerm] = useState("")
  const [classTypeFilter, setClassTypeFilter] = useState("all")

  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    description: "",
    onConfirm: null,
    loading: false,
  })

  useEffect(() => {
    const init = async () => {
      const data = await getListClassForAdminAPI()
      setClasses(data.classes)
    }
    init()
  }, [])

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  const filteredClasses = classes.filter((cls) => {
    const matchesSearch =
      cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = classTypeFilter === "all" || cls.classType.toLowerCase() === classTypeFilter.toLowerCase()
    return matchesSearch && matchesType
  })

  const handleRowClick = (classData) => {
    setSelectedClass(classData)
    setDetailModalOpen(true)
  }

  const handleAddClass = () => {
    setEditingClass(null)
    setFormModalOpen(true)
  }

  const handleEditClass = (classData, event) => {
    event?.stopPropagation()
    setEditingClass(classData)
    setFormModalOpen(true)
  }

  const handleDeleteClass = (classData, event) => {
    event?.stopPropagation()

    setConfirmDialog({
      open: true,
      title: "Xác nhận xóa lớp học",
      description: `Bạn có chắc chắn muốn xóa lớp học "${classData.name}"? Hành động này không thể hoàn tác.`,
      loading: false,
      onConfirm: async () => {
        setConfirmDialog((prev) => ({ ...prev, loading: true }))

        try {
          // Simulate API call delay
          await deleteClassAPI(classData._id)

          // Remove class from state
          setClasses((prev) => prev.filter((cls) => cls._id !== classData._id))

          setSnackbar({
            open: true,
            message: "Đã xóa lớp học thành công!",
            severity: "success",
          })

          setConfirmDialog({ open: false, title: "", description: "", onConfirm: null, loading: false })
        } catch (error) {
          setSnackbar({
            open: true,
            message: "Có lỗi xảy ra khi xóa lớp học!",
            severity: "error",
          })
          setConfirmDialog((prev) => ({ ...prev, loading: false }))
        }
      },
    })
  }

  const handleConfirmCancel = () => {
    if (!confirmDialog.loading) {
      setConfirmDialog({ open: false, title: "", description: "", onConfirm: null, loading: false })
    }
  }

  const handleClassSubmitted = (formData) => {
    setFormModalOpen(false)
    setEditingClass(null)
    // Refresh the classes list
    const init = async () => {
      const data = await getListClassForAdminAPI()
      setClasses(data.classes)
    }
    init()
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const getClassTypeIcon = (type) => {
    const typeStr = type?.toLowerCase()
    switch (typeStr) {
      case "yoga":
        return <YogaIcon />
      case "boxing":
        return <BoxingIcon />
      case "dance":
        return <DanceIcon />
      default:
        return <ClassIcon />
    }
  }

  const getClassTypeColor = (type) => {
    const typeStr = type?.toLowerCase()
    switch (typeStr) {
      case "yoga":
        return "success"
      case "boxing":
        return "error"
      case "dance":
        return "secondary"
      default:
        return "primary"
    }
  }

  // Helper function to get trainer info by ID
  const getTrainerById = (trainerId) => {
    return listTrainerInfo.find((trainer) => trainer._id === trainerId || trainer.trainerId === trainerId)
  }

  // Helper function to get room info by ID
  const getRoomById = (roomId) => {
    return rooms.find((room) => room._id === roomId)
  }

  // Helper function to get location info by ID
  const getLocationById = (locationId) => {
    return locations.find((location) => location._id === locationId)
  }

  // Helper function to format recurrence for display
  const formatRecurrenceForDisplay = (recurrence) => {
    if (!recurrence || recurrence.length === 0) return "Chưa có lịch"

    const dayMap = {
      1: "T2",
      2: "T3",
      3: "T4",
      4: "T5",
      5: "T6",
      6: "T7",
      7: "CN",
    }

    return recurrence
      .map((rec) => {
        const dayLabel = dayMap[rec.dayOfWeek] || rec.day
        const startTime = rec.startTime
          ? `${String(rec.startTime.hour).padStart(2, "0")}:${String(rec.startTime.minute).padStart(2, "0")}`
          : rec.time || ""
        return `${dayLabel} ${startTime}`
      })
      .join(", ")
  }

  return (
    <Box sx={{ p: 1 }}>
      {/* Header */}
      <Card sx={{ mb: 1 }}>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <ClassIcon sx={{ fontSize: 40, color: "primary.main" }} />
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                Quản lý Lớp học
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button variant="outlined" startIcon={<ImportIcon />}>
                Import
              </Button>
              <Button variant="outlined" startIcon={<ExportIcon />}>
                Export
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card sx={{ mb: 1 }}>
        <CardContent>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
            <TextField
              placeholder="Tìm kiếm lớp học..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ width: 250 }}
            />

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Loại lớp</InputLabel>
              <Select value={classTypeFilter} onChange={(e) => setClassTypeFilter(e.target.value)} label="Loại lớp">
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="yoga">Yoga</MenuItem>
                <MenuItem value="boxing">Boxing</MenuItem>
                <MenuItem value="dance">Dance</MenuItem>
                <MenuItem value="cardio">Cardio</MenuItem>
                <MenuItem value="strength">Strength</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ ml: "auto" }}>
              <Button variant="contained" startIcon={<AddIcon />} size="large" onClick={handleAddClass}>
                Thêm lớp học
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Classes Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <Typography variant="h6" sx={{ p: 2, fontWeight: "bold", color: "primary.main" }}>
            Danh sách lớp học ({filteredClasses.length})
          </Typography>

          <TableContainer sx={{ maxHeight: "58vh", overflowY: "auto" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Lớp học</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Loại</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Sĩ số</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>HLV</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Buổi học</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Thời gian</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Doanh thu</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredClasses.map((cls) => {
                  const enrollmentRate = cls.capacity > 0 ? (cls.enrolledCount / cls.capacity) * 100 : 0
                  const classTrainers = cls.trainers.map((trainerId) => getTrainerById(trainerId)).filter(Boolean)

                  return (
                    <TableRow key={cls._id} hover sx={{ cursor: "pointer" }} onClick={() => handleRowClick(cls)}>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <Avatar src={cls.image} variant="rounded" sx={{ width: 50, height: 50 }}>
                            {getClassTypeIcon(cls.classType)}
                          </Avatar>
                          <Box>
                            <Typography fontWeight="bold">{cls.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {cls.description.substring(0, 50)}...
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={cls.classType}
                          color={getClassTypeColor(cls.classType)}
                          size="small"
                          icon={getClassTypeIcon(cls.classType)}
                        />
                      </TableCell>

                      <TableCell>
                        <Box>
                          <Typography fontWeight="bold">
                            {cls.enrolledCount}/{cls.capacity}
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={enrollmentRate}
                            sx={{ width: 80, mt: 0.5 }}
                            color={enrollmentRate > 80 ? "success" : "primary"}
                          />
                        </Box>
                      </TableCell>

                      <TableCell>
                        <AvatarGroup max={3} sx={{ justifyContent: "flex-start" }}>
                          {classTrainers.map((trainer) => (
                            <Avatar
                              key={trainer._id}
                              src={trainer.userInfo?.avatar}
                              sx={{ width: 32, height: 32 }}
                              title={trainer.userInfo?.name || "Unknown Trainer"}
                            >
                              {trainer.userInfo?.name?.charAt(0)?.toUpperCase() || "T"}
                            </Avatar>
                          ))}
                        </AvatarGroup>
                      </TableCell>

                      <TableCell>
                        <Typography fontWeight="medium">{cls.sessionsCount}</Typography>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2">{new Date(cls.startDate).toLocaleDateString("vi-VN")}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          đến {new Date(cls.endDate).toLocaleDateString("vi-VN")}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography fontWeight="bold" color="success.main">
                          {formatCurrency(cls.revenue || 0)}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={(e) => handleEditClass(cls, e)}
                          title="Chỉnh sửa"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={(e) => handleDeleteClass(cls, e)} title="Xóa">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Class Detail Modal */}
      <ClassDetailModal
        open={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false)
          setSelectedClass(null)
        }}
        classData={selectedClass}
        locations={locations}
        onEdit={(classData) => {
          setDetailModalOpen(false)
          handleEditClass(classData)
        }}
        onDelete={(classData) => {
          setDetailModalOpen(false)
          handleDeleteClass(classData)
        }}
        setClasses={setClasses}
      />

      {/* Class Form Modal */}
      <AddEditClassModal
        open={formModalOpen}
        onClose={() => {
          setFormModalOpen(false)
          setEditingClass(null)
        }}
        onSubmit={handleClassSubmitted}
        classData={editingClass}
        trainers={listTrainerInfo}
        rooms={rooms}
        locations={locations}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        description={confirmDialog.description}
        loading={confirmDialog.loading}
        onCancel={handleConfirmCancel}
        onConfirm={confirmDialog.onConfirm}
        confirmText="Xóa"
        cancelText="Hủy"
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}
