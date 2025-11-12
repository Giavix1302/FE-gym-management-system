import React from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Avatar,
  Rating,
  Chip,
  Divider,
  Grid,
  Paper,
  ImageList,
  ImageListItem,
  IconButton,
  useMediaQuery,
} from "@mui/material"
import { Close, Email, School, WorkOutline, Star, Schedule, Add, CheckCircle } from "@mui/icons-material"
import { theme } from "~/theme"

function PTDetailModal({
  open,
  onClose,
  trainer,
  selectedDate,
  availableSchedules,
  bookingCart,
  onAddToCart,
  formatDate,
}) {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  if (!trainer) return null

  // Get physique images from trainer data, fallback to placeholder if none
  const physiqueImages =
    trainer.physiqueImages && trainer.physiqueImages.length > 0
      ? trainer.physiqueImages
      : [
          `https://ui-avatars.com/api/?name=${trainer.userId.fullName}&background=random&size=400`,
          // Fallback placeholder images if no real images
          "https://via.placeholder.com/400x600/f0f0f0/666666?text=No+Image",
          "https://via.placeholder.com/400x600/f0f0f0/666666?text=No+Image",
          "https://via.placeholder.com/400x600/f0f0f0/666666?text=No+Image",
        ]

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: isMobile ? 0 : 2,
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Typography variant="h5" color="primary" fontWeight={600}>
          Thông tin chi tiết PT
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 3 }}>
          {/* Header Section */}
          <Paper elevation={0} sx={{ p: 3, mb: 3, border: "1px solid", borderColor: "divider" }}>
            <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
              <Avatar
                src={
                  trainer.userId.avatar ||
                  `https://ui-avatars.com/api/?name=${trainer.userId.fullName}&background=random`
                }
                sx={{
                  width: { xs: 80, sm: 100 },
                  height: { xs: 80, sm: 100 },
                  border: "3px solid",
                  borderColor: "primary.main",
                }}
              />

              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" fontWeight={700} color="primary" gutterBottom>
                  {trainer.userId.fullName}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  <Rating value={trainer.rating} readOnly precision={0.1} />
                  <Typography variant="body1" fontWeight={600}>
                    {trainer.rating} ({trainer.totalBookings} đánh giá)
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                  {trainer.specialization.split(", ").map((spec, index) => (
                    <Chip key={index} label={spec} color="primary" variant="outlined" size="small" />
                  ))}
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <Email fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {trainer.userId.email}
                  </Typography>
                </Box>

                <Chip
                  label={`${trainer.pricePerHour.toLocaleString("vi-VN")}đ / giờ`}
                  color="warning"
                  sx={{ fontWeight: 600, fontSize: "1rem", py: 2 }}
                />
              </Box>
            </Box>
          </Paper>

          {/* Body Images Section */}
          {physiqueImages.length > 0 && (
            <Paper elevation={0} sx={{ p: 3, mb: 3, border: "1px solid", borderColor: "divider" }}>
              <Typography
                variant="h6"
                fontWeight={600}
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <Star color="primary" />
                Hình ảnh thể hình{" "}
                {trainer.physiqueImages && trainer.physiqueImages.length > 0 && `(${trainer.physiqueImages.length})`}
              </Typography>

              {trainer.physiqueImages && trainer.physiqueImages.length > 0 ? (
                <ImageList
                  sx={{ width: "100%", height: 300 }}
                  cols={isMobile ? 2 : Math.min(4, trainer.physiqueImages.length)}
                  rowHeight={200}
                  gap={8}
                >
                  {trainer.physiqueImages.map((image, index) => (
                    <ImageListItem key={index}>
                      <img
                        src={image}
                        alt={`${trainer.userId.fullName} thể hình ${index + 1}`}
                        loading="lazy"
                        style={{
                          borderRadius: "8px",
                          objectFit: "cover",
                          width: "100%",
                          height: "100%",
                          cursor: "pointer",
                          transition: "transform 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = "scale(1.05)"
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = "scale(1)"
                        }}
                        onError={(e) => {
                          // Handle broken images
                          e.target.src = `https://via.placeholder.com/400x600/f0f0f0/666666?text=${encodeURIComponent(trainer.userId.fullName)}`
                        }}
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              ) : (
                <Box
                  sx={{
                    textAlign: "center",
                    py: 4,
                    bgcolor: "grey.50",
                    borderRadius: 2,
                    border: "2px dashed",
                    borderColor: "grey.300",
                  }}
                >
                  <Typography variant="body1" color="text.secondary">
                    Chưa có hình ảnh thể hình
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Huấn luyện viên chưa cập nhật hình ảnh
                  </Typography>
                </Box>
              )}
            </Paper>
          )}

          {/* Detailed Information */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 3, height: "100%", border: "1px solid", borderColor: "divider" }}>
                <Typography
                  variant="h6"
                  fontWeight={600}
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <WorkOutline color="primary" />
                  Kinh nghiệm & Học vấn
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Kinh nghiệm:
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {trainer.experience}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Học vấn & Chứng chỉ:
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {trainer.education}
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 3, height: "100%", border: "1px solid", borderColor: "divider" }}>
                <Typography
                  variant="h6"
                  fontWeight={600}
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <School color="primary" />
                  Giới thiệu
                </Typography>

                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                  {trainer.bio}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Available Schedules */}
          <Paper elevation={0} sx={{ p: 3, border: "1px solid", borderColor: "divider" }}>
            <Typography
              variant="h6"
              fontWeight={600}
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Schedule color="primary" />
              Lịch trống ngày {formatDate(selectedDate)}
            </Typography>

            {availableSchedules.length > 0 ? (
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {availableSchedules.map((schedule, idx) => {
                  const isInCart = bookingCart.some(
                    (item) =>
                      item.trainer._id === trainer._id &&
                      item.schedule.startTime === schedule.startTime &&
                      item.schedule.endTime === schedule.endTime,
                  )

                  return (
                    <Grid item xs={6} sm={4} md={3} key={schedule._id || idx}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          textAlign: "center",
                          border: "2px solid",
                          borderColor: isInCart ? "success.main" : "divider",
                          bgcolor: isInCart ? "success.50" : "transparent",
                          borderRadius: 2,
                          transition: "all 0.3s ease",
                          "&:hover": {
                            borderColor: isInCart ? "success.main" : "primary.main",
                            transform: "translateY(-2px)",
                          },
                        }}
                      >
                        <Typography variant="body1" fontWeight={600} sx={{ mb: 1 }}>
                          {schedule.startTime}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          đến {schedule.endTime}
                        </Typography>

                        <Button
                          fullWidth
                          size="small"
                          variant={isInCart ? "outlined" : "contained"}
                          color={isInCart ? "success" : "primary"}
                          onClick={() => onAddToCart(trainer, schedule)}
                          disabled={isInCart}
                          startIcon={isInCart ? <CheckCircle /> : <Add />}
                        >
                          {isInCart ? "Đã thêm" : "Đặt lịch"}
                        </Button>
                      </Paper>
                    </Grid>
                  )
                })}
              </Grid>
            ) : (
              <Typography variant="body1" color="text.secondary" fontStyle="italic" sx={{ textAlign: "center", py: 3 }}>
                Không có lịch trống trong ngày này
              </Typography>
            )}
          </Paper>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose} variant="outlined" size="large" fullWidth={isMobile}>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default PTDetailModal
