import React from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  Chip,
  Stack,
  Divider,
} from "@mui/material"
import {
  Warning as WarningIcon,
  LocationOn as LocationIcon,
  Group as GroupIcon,
  MeetingRoom as RoomIcon,
  FitnessCenter as EquipmentIcon,
  Phone as PhoneIcon,
} from "@mui/icons-material"

export default function DeleteLocationConfirmDialog({ open, onClose, location, onConfirm }) {
  const [loading, setLoading] = React.useState(false)

  if (!location) return null

  const formatAddress = (address) => {
    return `${address.street}, ${address.ward}, ${address.province}`
  }

  const hasRelatedData =
    (location.staffCount && location.staffCount > 0) ||
    (location.roomCount && location.roomCount > 0) ||
    (location.equipmentCount && location.equipmentCount > 0)

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await onConfirm(location._id)
    } catch (error) {
      console.error("Error deleting location:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      onClose()
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth aria-labelledby="delete-location-dialog-title">
      <DialogTitle
        id="delete-location-dialog-title"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          bgcolor: "error.main",
          color: "white",
        }}
      >
        <WarningIcon />
        <Typography variant="h6" component="div">
          Xác nhận xóa Location
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {/* Warning Message */}
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="body2" fontWeight="bold">
            Bạn có chắc chắn muốn xóa location này?
          </Typography>
          <Typography variant="body2">
            Hành động này sẽ thực hiện <strong>xóa mềm</strong> và có thể được hoàn tác.
          </Typography>
        </Alert>

        {/* Location Information */}
        <Box sx={{ mb: 3, p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <LocationIcon color="primary" />
            {location.name}
          </Typography>

          <Stack spacing={1}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PhoneIcon sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography variant="body2">{location.phone}</Typography>
            </Box>

            <Typography variant="body2" color="text.secondary">
              {formatAddress(location.address)}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              ID: {location._id}
            </Typography>
          </Stack>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Related Data Warning */}
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Dữ liệu liên quan:
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Chip
            icon={<GroupIcon />}
            label={`${location.staffCount || 0} nhân viên`}
            color={location.staffCount > 0 ? "error" : "default"}
            variant={location.staffCount > 0 ? "filled" : "outlined"}
            size="small"
          />
          <Chip
            icon={<RoomIcon />}
            label={`${location.roomCount || 0} phòng`}
            color={location.roomCount > 0 ? "error" : "default"}
            variant={location.roomCount > 0 ? "filled" : "outlined"}
            size="small"
          />
          <Chip
            icon={<EquipmentIcon />}
            label={`${location.equipmentCount || 0} thiết bị`}
            color={location.equipmentCount > 0 ? "error" : "default"}
            variant={location.equipmentCount > 0 ? "filled" : "outlined"}
            size="small"
          />
        </Stack>

        {hasRelatedData && (
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Lưu ý:</strong> Location này có dữ liệu liên quan (nhân viên, phòng, hoặc thiết bị). Khi xóa
              location, các dữ liệu này sẽ không bị ảnh hưởng nhưng có thể cần được xem xét lại.
            </Typography>
          </Alert>
        )}

        {!hasRelatedData && (
          <Alert severity="success" sx={{ mt: 2 }}>
            <Typography variant="body2">Location này không có dữ liệu liên quan nào. Có thể xóa an toàn.</Typography>
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button onClick={handleClose} disabled={loading} color="inherit" variant="outlined">
          Hủy bỏ
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={loading}
          variant="contained"
          color="error"
          startIcon={<WarningIcon />}
          sx={{ minWidth: 120 }}
        >
          {loading ? "Đang xóa..." : "Xác nhận xóa"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
