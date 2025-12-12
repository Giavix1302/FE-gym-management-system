import React, { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab,
} from "@mui/material"
import {
  Add as AddIcon,
  Room as RoomIcon,
  Group as GroupIcon,
  Schedule as ScheduleIcon,
  FiberManualRecord as StatusIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material"
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom"
import { toast } from "react-toastify"
import { createRoomAPI, updateRoomAPI, softDeleteRoomAPI, getListRoomByLocationIdAPI } from "~/apis/room"
import useCurrentLocation from "~/stores/useCurrentLocationStore"

import RoomDetailModal from "./RoomDetailModal"
import RoomFormModal from "./RoomFormModal"

function StaffRoomPage() {
  const { currentLocation } = useCurrentLocation()

  // States
  const [rooms, setRooms] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Modal states
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [formModalOpen, setFormModalOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [isEditMode, setIsEditMode] = useState(false)

  // Delete confirmation
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [roomToDelete, setRoomToDelete] = useState(null)

  // Load rooms data
  const loadRooms = async () => {
    if (!currentLocation?._id) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await getListRoomByLocationIdAPI(currentLocation._id)
      if (response.success) {
        setRooms(response.data || [])
      } else {
        setError("Không thể tải danh sách phòng")
      }
    } catch (error) {
      console.error("Error loading rooms:", error)
      setError("Lỗi kết nối. Vui lòng thử lại")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadRooms()
  }, [currentLocation?._id])

  // Get room status and current/next session
  const getRoomStatus = (room) => {
    if (!room.classSession || room.classSession.length === 0) {
      return {
        status: "empty",
        statusText: "Phòng trống",
        statusColor: "success",
        currentSession: null,
      }
    }

    const now = new Date()
    const today = new Date().toDateString()

    // Check for current session (happening now)
    const currentSession = room.classSession.find((session) => {
      const startTime = new Date(session.startTime)
      const endTime = new Date(session.endTime)
      return startTime <= now && endTime >= now
    })

    if (currentSession) {
      return {
        status: "occupied",
        statusText: "Đang sử dụng",
        statusColor: "error",
        currentSession,
      }
    }

    // Check for next session today
    const upcomingSessions = room.classSession.filter((session) => {
      const startTime = new Date(session.startTime)
      return startTime > now && startTime.toDateString() === today
    })

    if (upcomingSessions.length > 0) {
      const nextSession = upcomingSessions[0] // Already sorted by start time
      return {
        status: "scheduled",
        statusText: "Có lịch hôm nay",
        statusColor: "warning",
        currentSession: nextSession,
      }
    }

    return {
      status: "empty",
      statusText: "Phòng trống",
      statusColor: "success",
      currentSession: null,
    }
  }

  // Handle room card click
  const handleRoomClick = (room) => {
    setSelectedRoom(room)
    setDetailModalOpen(true)
  }

  // Handle add room
  const handleAddRoom = () => {
    setSelectedRoom(null)
    setIsEditMode(false)
    setFormModalOpen(true)
  }

  // Handle edit room
  const handleEditRoom = (room) => {
    setSelectedRoom(room)
    setIsEditMode(true)
    setDetailModalOpen(false)
    setFormModalOpen(true)
  }

  // Handle delete room
  const handleDeleteRoom = (room) => {
    // Check if room has current or future sessions
    const now = new Date()
    const hasFutureSessions = room.classSession.some((session) => {
      const startTime = new Date(session.startTime)
      return startTime >= now
    })

    if (hasFutureSessions) {
      toast.error("Không thể xóa phòng có buổi học hiện tại hoặc trong tương lai")
      return
    }

    setRoomToDelete(room)
    setDeleteConfirmOpen(true)
  }

  // Confirm delete
  const confirmDelete = async () => {
    if (!roomToDelete) return

    try {
      const response = await softDeleteRoomAPI(roomToDelete._id)
      if (response.success) {
        toast.success("Xóa phòng thành công")
        loadRooms() // Reload data
        setDetailModalOpen(false)
      } else {
        toast.error(response.message || "Xóa phòng thất bại")
      }
    } catch (error) {
      console.error("Error deleting room:", error)
      toast.error("Lỗi khi xóa phòng")
    } finally {
      setDeleteConfirmOpen(false)
      setRoomToDelete(null)
    }
  }

  // Handle form save
  const handleFormSave = async (formData) => {
    try {
      let response
      if (isEditMode && selectedRoom) {
        response = await updateRoomAPI(selectedRoom._id, formData)
      } else {
        response = await createRoomAPI({
          ...formData,
          locationId: currentLocation._id,
        })
      }

      if (response.success) {
        toast.success(isEditMode ? "Cập nhật phòng thành công" : "Thêm phòng thành công")
        setFormModalOpen(false)
        loadRooms()
      } else {
        toast.error(response.message || "Có lỗi xảy ra")
      }
    } catch (error) {
      console.error("Error saving room:", error)
      toast.error("Lỗi khi lưu thông tin phòng")
    }
  }

  // Format time
  const formatTime = (timeString) => {
    return new Date(timeString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!currentLocation) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <Alert severity="warning">Vui lòng chọn cơ sở để quản lý phòng</Alert>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 1 }}>
      {/* Header */}
      <Card sx={{ mb: 1 }}>
        <CardContent sx={{ "&:last-child": { pb: 2 } }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <MeetingRoomIcon sx={{ fontSize: 32, color: "primary.main" }} />
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                Quản lý phòng
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {rooms.length} phòng
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddRoom}
                sx={{ height: "fit-content" }}
              >
                Thêm phòng
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Error state */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Loading state */}
      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Rooms grid */}
      {!isLoading && rooms.length > 0 && (
        <Grid container spacing={1}>
          {rooms.map((room) => {
            const roomStatus = getRoomStatus(room)

            return (
              <Grid item size={{ xs: 12, sm: 3 }} key={room._id} sx={{}}>
                <Card
                  sx={{
                    cursor: "pointer",
                    transition: "all 0.2s",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: 4,
                    },
                    height: "100%",
                  }}
                  onClick={() => handleRoomClick(room)}
                >
                  <CardContent>
                    {/* Room header */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                      <RoomIcon color="primary" />
                      <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        {room.name}
                      </Typography>
                    </Box>

                    {/* Capacity */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                      <GroupIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        Sức chứa: {room.capacity} người
                      </Typography>
                    </Box>

                    {/* Status */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                      <StatusIcon fontSize="small" color={roomStatus.statusColor} />
                      <Chip label={roomStatus.statusText} color={roomStatus.statusColor} size="small" />
                    </Box>

                    {/* Current/Next session */}
                    {roomStatus.currentSession && (
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 1,
                          bgcolor: "background.default",
                          border: "1px solid",
                          borderColor:
                            roomStatus.statusColor === "error"
                              ? "error.light"
                              : roomStatus.statusColor === "warning"
                                ? "warning.light"
                                : "success.light",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                          <ScheduleIcon fontSize="small" />
                          <Typography variant="subtitle2">
                            {roomStatus.status === "occupied" ? "Đang diễn ra" : "Sắp tới"}
                          </Typography>
                        </Box>
                        <Typography variant="body2" fontWeight="bold" gutterBottom>
                          {roomStatus.currentSession.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatTime(roomStatus.currentSession.startTime)} -{" "}
                          {formatTime(roomStatus.currentSession.endTime)} ({roomStatus.currentSession.hours}h)
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      )}

      {/* Empty state */}
      {!isLoading && rooms.length === 0 && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <RoomIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Chưa có phòng nào
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Thêm phòng đầu tiên để bắt đầu quản lý
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddRoom}>
            Thêm phòng đầu tiên
          </Button>
        </Box>
      )}

      {/* Floating Action Button for mobile */}
      <Fab
        color="primary"
        aria-label="add room"
        onClick={handleAddRoom}
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          display: { xs: "flex", md: "none" },
        }}
      >
        <AddIcon />
      </Fab>

      {/* Room Detail Modal */}
      <RoomDetailModal
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        room={selectedRoom}
        onEdit={handleEditRoom}
        onDelete={handleDeleteRoom}
      />

      {/* Room Form Modal */}
      <RoomFormModal
        open={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        room={isEditMode ? selectedRoom : null}
        isEditMode={isEditMode}
        onSave={handleFormSave}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Xác nhận xóa phòng</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn xóa phòng "{roomToDelete?.name}"?</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Hủy</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Xóa phòng
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default StaffRoomPage
