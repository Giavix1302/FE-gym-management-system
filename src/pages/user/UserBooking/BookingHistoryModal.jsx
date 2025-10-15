import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Avatar,
  Rating,
  TextField,
  Paper,
  Alert,
  Chip,
  Divider,
  Stack,
  IconButton,
  Skeleton,
  Fade,
} from "@mui/material"
import {
  Close,
  Star,
  Send,
  AutorenewOutlined,
  Schedule,
  LocationOn,
  Person,
  Comment,
  ThumbUp,
  Info,
  CheckCircle,
  RateReview,
  Lightbulb,
} from "@mui/icons-material"

const BookingHistoryModal = ({ open, onClose, selectedBooking, onSubmitReview, loading = false }) => {
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Reset form when modal opens/closes or booking changes
  useEffect(() => {
    if (open && selectedBooking) {
      // If booking already has a review, populate the form
      if (selectedBooking.review && selectedBooking.review.rating) {
        setReviewRating(selectedBooking.review.rating)
        setReviewComment(selectedBooking.review.comment || "")
      } else {
        // Reset to defaults for new review
        setReviewRating(5)
        setReviewComment("")
      }
    }
  }, [open, selectedBooking])

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "Invalid Date"
    try {
      return new Date(dateString).toLocaleDateString("vi-VN", {
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

  // Format time helper
  const formatTime = (dateString) => {
    if (!dateString) return "Invalid Time"
    try {
      return new Date(dateString).toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (error) {
      console.error("Error formatting time:", error)
      return "Invalid Time"
    }
  }

  // Format address helper
  const formatAddress = (addressObj) => {
    if (!addressObj) return ""
    if (typeof addressObj === "string") return addressObj

    const { street, ward, province } = addressObj
    return [street, ward, province].filter(Boolean).join(", ")
  }

  const handleSubmitReview = async () => {
    if (!reviewComment.trim()) {
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmitReview({
        bookingId: selectedBooking.bookingId || selectedBooking._id,
        rating: reviewRating,
        comment: reviewComment.trim(),
      })
      // Don't close modal here - let parent handle it
    } catch (error) {
      console.error("Error submitting review:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!selectedBooking) {
    return null
  }

  const { trainer, session, review, status, price, note, trainerAdvice } = selectedBooking
  const trainerInfo = trainer?.userInfo || {}
  const trainerName = trainerInfo?.fullName || "Unknown Trainer"
  const trainerAvatar = trainerInfo?.avatar || ""
  const hasExistingReview = review && Object.keys(review).length > 0 && review.rating
  const hasTrainerAdvice = trainerAdvice && Array.isArray(trainerAdvice) && trainerAdvice.length > 0

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: "600px" },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <RateReview color="primary" />
            <Typography variant="h6">Chi tiết buổi tập</Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {loading ? (
          <Stack spacing={2}>
            <Skeleton variant="rectangular" height={100} />
            <Skeleton variant="rectangular" height={150} />
            <Skeleton variant="rectangular" height={200} />
          </Stack>
        ) : (
          <Stack spacing={3}>
            {/* Trainer Information */}
            <Paper sx={{ p: 3, bgcolor: "grey.50" }}>
              <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Person color="primary" />
                Thông tin Huấn luyện viên
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar src={trainerAvatar} sx={{ width: 60, height: 60 }}>
                  {trainerName.charAt(0)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" fontWeight={600} color="primary">
                    {trainerName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {trainer?.specialization || "Chưa xác định"}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                    <Rating value={trainer?.rating || 0} readOnly size="small" />
                    <Typography variant="caption">({trainer?.rating || 0}/5)</Typography>
                  </Box>
                </Box>
                <Chip
                  label={`${(price || 0).toLocaleString("vi-VN")}₫`}
                  color="success"
                  variant="outlined"
                  size="large"
                />
              </Box>
            </Paper>

            {/* Session Details */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Schedule color="primary" />
                Thông tin buổi tập
              </Typography>

              <Stack spacing={2}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Typography variant="body1" fontWeight={600}>
                    📅 {formatDate(session?.startTime)}
                  </Typography>
                  <Chip
                    label={status === "completed" ? "Đã hoàn thành" : "Đã hủy"}
                    color={status === "completed" ? "success" : "error"}
                    size="small"
                    variant="outlined"
                  />
                </Box>

                <Typography variant="body1">
                  ⏰ {formatTime(session?.startTime)} - {formatTime(session?.endTime)}
                </Typography>

                <Box>
                  <Typography variant="body1" fontWeight={600}>
                    📍 {session?.location?.name || "Unknown Location"}
                  </Typography>
                  {session?.location?.address && (
                    <Typography variant="body2" color="text.secondary">
                      {formatAddress(session.location.address)}
                    </Typography>
                  )}
                </Box>

                {note && (
                  <Box sx={{ bgcolor: "info.50", p: 2, borderRadius: 1 }}>
                    <Typography variant="body2" color="info.main">
                      💬 <strong>Ghi chú:</strong> {note}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Paper>

            {/* Trainer Advice Section */}
            {hasTrainerAdvice && (
              <Paper sx={{ p: 3, bgcolor: "warning.50", border: "1px solid", borderColor: "warning.main" }}>
                <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Lightbulb color="warning" />
                  Lời khuyên từ Huấn luyện viên
                </Typography>

                <Stack spacing={2}>
                  {trainerAdvice.map((advice, index) => (
                    <Box key={index}>
                      <Typography variant="subtitle2" fontWeight={600} color="warning.dark">
                        {advice.title}
                      </Typography>
                      {Array.isArray(advice.content) ? (
                        <Stack component="ul" spacing={0.5} sx={{ pl: 2, mt: 1 }}>
                          {advice.content.map((item, idx) => (
                            <Typography component="li" variant="body2" key={idx}>
                              {item}
                            </Typography>
                          ))}
                        </Stack>
                      ) : (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {advice.content}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Stack>
              </Paper>
            )}

            {/* Review Section */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Star color="primary" />
                {hasExistingReview ? "Đánh giá của bạn" : "Đánh giá buổi tập"}
              </Typography>

              {hasExistingReview ? (
                <Fade in>
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                      <Rating value={review.rating} readOnly size="large" />
                      <Typography variant="h6" color="primary">
                        {review.rating}/5 sao
                      </Typography>
                      <Chip
                        icon={<CheckCircle />}
                        label="Đã đánh giá"
                        color="success"
                        size="small"
                        variant="outlined"
                      />
                    </Box>

                    <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                      <Typography variant="body1">"{review.comment}"</Typography>
                      {review.createdAt && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                          Đánh giá vào: {formatDate(review.createdAt)}
                        </Typography>
                      )}
                    </Paper>
                  </Box>
                </Fade>
              ) : (
                <Box>
                  <Alert severity="info" sx={{ mb: 3 }}>
                    Chia sẻ trải nghiệm của bạn để giúp cải thiện chất lượng dịch vụ và hỗ trợ các thành viên khác.
                  </Alert>

                  {/* Rating Selection */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Đánh giá chất lượng buổi tập *
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Rating
                        value={reviewRating}
                        onChange={(event, newValue) => setReviewRating(newValue || 1)}
                        size="large"
                        precision={1}
                      />
                      <Typography variant="body1" color="text.secondary">
                        ({reviewRating}/5 sao)
                      </Typography>
                    </Box>
                  </Box>

                  {/* Comment Section */}
                  <Box>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Nhận xét về buổi tập *"
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Chia sẻ trải nghiệm của bạn về buổi tập này..."
                      error={!reviewComment.trim()}
                      helperText={
                        !reviewComment.trim() ? "Vui lòng nhập nhận xét" : `${reviewComment.length}/500 ký tự`
                      }
                      inputProps={{ maxLength: 500 }}
                    />
                  </Box>
                </Box>
              )}
            </Paper>
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button onClick={onClose} color="inherit" variant="outlined">
          {hasExistingReview ? "Đóng" : "Hủy"}
        </Button>

        {!hasExistingReview && (
          <Button
            onClick={handleSubmitReview}
            color="primary"
            variant="contained"
            disabled={isSubmitting || !reviewComment.trim()}
            startIcon={isSubmitting ? <AutorenewOutlined sx={{ animation: "spin 1s linear infinite" }} /> : <Send />}
          >
            {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default BookingHistoryModal
