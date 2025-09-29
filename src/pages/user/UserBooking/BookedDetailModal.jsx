import React from "react"
import {
  Box,
  Typography,
  Grid,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  Avatar,
  Rating,
  IconButton,
  Paper,
  Stack,
  useMediaQuery,
} from "@mui/material"
import {
  Close,
  Schedule,
  LocationOn,
  AccessTime,
  CheckCircleOutline,
  HourglassEmpty,
  CancelOutlined,
  CheckCircle,
  Info,
} from "@mui/icons-material"
import { theme } from "~/theme"

function BookedDetailModal({ open, onClose, selectedBooking, formatDate, onCancelSession, canCancelBooking }) {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  console.log("🚀 ~ BookedDetailModal ~ selectedBooking:", selectedBooking)
  console.log("🚀 ~ BookedDetailModal ~ open:", open)

  // Helper function to format date from ISO string
  const formatISODate = (isoString) => {
    if (!isoString) return "N/A"
    try {
      return new Date(isoString).toLocaleDateString("vi-VN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Invalid Date"
    }
  }

  // Helper function to format time from ISO string
  const formatISOTime = (isoString) => {
    if (!isoString) return "N/A"
    try {
      return new Date(isoString).toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (error) {
      console.error("Error formatting time:", error)
      return "Invalid Time"
    }
  }

  const getStatusInfo = (status) => {
    switch (status) {
      case "booking":
        return {
          label: "Đặt thành công",
          color: "success",
          icon: <CheckCircleOutline fontSize="small" />,
        }
      case "pending":
        return {
          label: "Chưa thanh toán",
          color: "warning",
          icon: <HourglassEmpty fontSize="small" />,
        }
      case "completed":
        return {
          label: "Đã hoàn thành",
          color: "info",
          icon: <CheckCircle fontSize="small" />,
        }
      case "cancelled":
        return {
          label: "Đã hủy",
          color: "error",
          icon: <CancelOutlined fontSize="small" />,
        }
      default:
        return {
          label: "Không xác định",
          color: "default",
          icon: <Info fontSize="small" />,
        }
    }
  }

  // Early return if no booking selected
  if (!selectedBooking) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogContent sx={{ p: 3, textAlign: "center" }}>
          <Typography>Không có thông tin booking</Typography>
          <Button onClick={onClose} sx={{ mt: 2 }}>
            Đóng
          </Button>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth fullScreen={isMobile}>
      <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="h6">
            Chi tiết lịch đặt {selectedBooking?.allSessions ? `(${selectedBooking.allSessions.length} buổi)` : ""}
          </Typography>
          <IconButton onClick={onClose} sx={{ color: "white" }}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Stack spacing={3}>
          {/* Trainer Info */}
          <Paper elevation={0} sx={{ p: 3, bgcolor: "grey.50", borderRadius: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              <Avatar
                src={selectedBooking.trainer?.userInfo?.avatar || selectedBooking.trainer?.userId?.avatar}
                sx={{ width: 80, height: 80 }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  {selectedBooking.trainer?.userInfo?.fullName ||
                    selectedBooking.trainer?.userId?.fullName ||
                    "Unknown Trainer"}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  {selectedBooking.trainer?.specialization || "No specialization"}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Rating value={selectedBooking.trainer?.rating || 0} readOnly size="small" />
                  <Typography variant="caption">({selectedBooking.trainer?.rating || 0})</Typography>
                </Box>
                {selectedBooking.trainer?.userInfo?.phone && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    📞 {selectedBooking.trainer.userInfo.phone}
                  </Typography>
                )}
                {selectedBooking.trainer?.userInfo?.email && (
                  <Typography variant="body2" color="text.secondary">
                    📧 {selectedBooking.trainer.userInfo.email}
                  </Typography>
                )}
              </Box>
              {selectedBooking.allSessions && (
                <Box sx={{ textAlign: "right" }}>
                  <Typography variant="h6" color="primary" fontWeight={600}>
                    {selectedBooking.allSessions.length} buổi tập
                  </Typography>
                  <Typography variant="h5" color="warning.dark" fontWeight={700}>
                    {(
                      selectedBooking.allSessions.length * (selectedBooking.trainer?.pricePerSession || 0)
                    ).toLocaleString("vi-VN")}
                    đ
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>

          {/* All Sessions */}
          {selectedBooking.allSessions && selectedBooking.allSessions.length > 0 ? (
            <Box>
              <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Schedule color="primary" />
                Danh sách các buổi tập
              </Typography>

              <Stack spacing={2}>
                {selectedBooking.allSessions
                  .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
                  .map((session, index) => {
                    const statusInfo = getStatusInfo(session.status)
                    const isPast = new Date(session.startTime) < new Date()

                    return (
                      <Paper
                        key={session._id || index}
                        elevation={0}
                        sx={{
                          p: 2,
                          border: "1px solid",
                          borderColor: "divider",
                          borderRadius: 2,
                          bgcolor: isPast ? "grey.25" : "white",
                        }}
                      >
                        <Grid container spacing={2} alignItems="center">
                          <Grid size={{ xs: 12, sm: 3 }}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Buổi {index + 1}
                            </Typography>
                            <Typography variant="subtitle1" fontWeight={600}>
                              {formatISODate(session.startTime)}
                            </Typography>
                          </Grid>

                          <Grid size={{ xs: 12, sm: 3 }}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Thời gian
                            </Typography>
                            <Typography variant="subtitle1" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                              <AccessTime fontSize="small" />
                              {formatISOTime(session.startTime)} - {formatISOTime(session.endTime)}
                            </Typography>
                          </Grid>

                          <Grid size={{ xs: 12, sm: 3 }}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Địa điểm
                            </Typography>
                            <Typography variant="subtitle1" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                              <LocationOn fontSize="small" />
                              {session.location?.name || "Unknown Location"}
                            </Typography>
                          </Grid>

                          <Grid size={{ xs: 12, sm: 3 }}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Trạng thái
                            </Typography>
                            <Chip
                              icon={statusInfo.icon}
                              label={statusInfo.label}
                              color={statusInfo.color}
                              size="small"
                              variant="outlined"
                            />
                          </Grid>

                          {session.note && (
                            <Grid size={{ xs: 12 }}>
                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                Ghi chú:
                              </Typography>
                              <Typography variant="body2" fontStyle="italic">
                                "{session.note}"
                              </Typography>
                            </Grid>
                          )}
                        </Grid>

                        {/* Individual session actions */}
                        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 1 }}>
                          {(session.status === "booking" || session.status === "pending") &&
                            new Date(session.startTime) > new Date() &&
                            onCancelSession && (
                              <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                onClick={() => onCancelSession(session)}
                              >
                                Hủy buổi này
                              </Button>
                            )}
                        </Box>
                      </Paper>
                    )
                  })}
              </Stack>

              {/* Summary */}
              <Paper elevation={0} sx={{ p: 2, bgcolor: "warning.50", borderRadius: 2 }}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography variant="caption" color="text.secondary">
                      Tổng buổi tập
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {selectedBooking.allSessions.length}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography variant="caption" color="text.secondary">
                      Tổng chi phí
                    </Typography>
                    <Typography variant="h6" color="warning.dark" fontWeight={600}>
                      {(
                        selectedBooking.allSessions.length * (selectedBooking.trainer?.pricePerSession || 0)
                      ).toLocaleString("vi-VN")}
                      đ
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography variant="caption" color="text.secondary">
                      Đã hoàn thành
                    </Typography>
                    <Typography variant="h6" color="success.main" fontWeight={600}>
                      {selectedBooking.allSessions.filter((s) => s.status === "completed").length}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography variant="caption" color="text.secondary">
                      Sắp tới
                    </Typography>
                    <Typography variant="h6" color="info.main" fontWeight={600}>
                      {
                        selectedBooking.allSessions.filter(
                          (s) =>
                            new Date(s.startTime) >= new Date() && (s.status === "booking" || s.status === "pending"),
                        ).length
                      }
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* Booking Info */}
              <Paper elevation={0} sx={{ p: 2, bgcolor: "info.50", borderRadius: 2 }}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Ngày đặt lịch
                    </Typography>
                    <Typography variant="body1">
                      {selectedBooking.createdAt ? new Date(selectedBooking.createdAt).toLocaleString("vi-VN") : "N/A"}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Phương thức thanh toán
                    </Typography>
                    <Chip
                      label={selectedBooking.paymentMethod || "N/A"}
                      size="small"
                      variant="outlined"
                      color="default"
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Box>
          ) : (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                Không có thông tin phiên tập
              </Typography>
            </Box>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

export default BookedDetailModal
