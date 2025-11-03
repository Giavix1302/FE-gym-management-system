import React, { useState } from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Chip,
  IconButton,
  Dialog,
  DialogContent,
  Stack,
  Paper,
} from "@mui/material"
import {
  Update as UpdateIcon,
  CheckCircle as CheckCircleIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  AccessTime as TimeIcon,
  FitnessCenter as GymIcon,
  Close as CloseIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  CalendarToday as CalendarIcon,
  Business as BusinessIcon,
  ZoomIn as ZoomInIcon,
} from "@mui/icons-material"
import useCurrentLocation from "~/stores/useCurrentLocationStore"

function StaffLocationInfoPage() {
  const { currentLocation } = useCurrentLocation()
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0)

  if (!currentLocation) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Typography variant="h6" color="text.secondary">
          Đang tải thông tin cơ sở...
        </Typography>
      </Box>
    )
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A"
    return new Date(timestamp).toLocaleDateString("vi-VN")
  }

  const formatDateTime = (timestamp) => {
    if (!timestamp) return "N/A"
    return new Date(timestamp).toLocaleString("vi-VN")
  }

  const handleImageClick = (index = currentCarouselIndex) => {
    setSelectedImageIndex(index)
    setIsGalleryOpen(true)
  }

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? currentLocation.images.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev === currentLocation.images.length - 1 ? 0 : prev + 1))
  }

  const handleCarouselPrev = () => {
    setCurrentCarouselIndex((prev) => (prev === 0 ? currentLocation.images.length - 1 : prev - 1))
  }

  const handleCarouselNext = () => {
    setCurrentCarouselIndex((prev) => (prev === currentLocation.images.length - 1 ? 0 : prev + 1))
  }

  const handleCallPhone = () => {
    window.open(`tel:${currentLocation.phone}`, "_self")
  }

  return (
    <Box
      sx={{
        height: "100vh",
        overflow: "auto",
        background: currentLocation.images?.[0]
          ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${currentLocation.images[0]})`
          : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "",
      }}
    >
      {/* Hero Section - Full Screen */}
      <Box
        sx={{
          position: "relative",
          height: "35vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "primary.main",
        }}
      >
        <Box sx={{ textAlign: "center", zIndex: 1 }}>
          <Avatar
            sx={{
              width: 60,
              height: 60,
              backgroundColor: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(10px)",
              margin: "0 auto 12px",
            }}
          >
            <GymIcon sx={{ fontSize: "2rem" }} />
          </Avatar>
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            sx={{
              mb: 2,
              textShadow: 2,
            }}
          >
            {currentLocation.name}
          </Typography>
          <Chip
            label="Cơ sở làm việc"
            color="primary"
            sx={{
              fontWeight: "bold",
              // color: "primary.main",
            }}
          />
        </Box>
      </Box>

      {/* Content Section */}
      <Box sx={{ p: 2, mt: -4, position: "relative", zIndex: 2 }}>
        <Grid container spacing={2}>
          {/* Contact Information Card */}
          <Grid item size={{ xs: 12, md: 4 }}>
            <Card
              sx={{
                height: "100%",
                boxShadow: 3,
                borderRadius: 2,
                backdropFilter: "blur(10px)",
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <BusinessIcon color="primary" sx={{ fontSize: 24, mr: 1.5 }} />
                  <Typography variant="h6" fontWeight="bold" color="primary.main">
                    Thông tin liên hệ
                  </Typography>
                </Box>

                <Stack spacing={2.5}>
                  {/* Phone */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ backgroundColor: "success.light", width: 40, height: 40 }}>
                      <PhoneIcon sx={{ color: "success.main", fontSize: 20 }} />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Số điện thoại
                      </Typography>
                      <Typography
                        variant="h6"
                        fontWeight="medium"
                        sx={{
                          cursor: "pointer",
                          "&:hover": { color: "primary.main" },
                        }}
                        onClick={handleCallPhone}
                      >
                        {currentLocation.phone}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Address */}
                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                    <Avatar sx={{ backgroundColor: "warning.light", width: 40, height: 40 }}>
                      <LocationIcon sx={{ color: "warning.main", fontSize: 20 }} />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Địa chỉ
                      </Typography>
                      <Typography variant="body1" fontWeight="medium" lineHeight={1.6}>
                        {currentLocation.address.street}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {currentLocation.address.ward}, {currentLocation.address.province}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Working Hours */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ backgroundColor: "info.light", width: 40, height: 40 }}>
                      <TimeIcon sx={{ color: "info.main", fontSize: 20 }} />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Giờ hoạt động
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        06:00 - 22:00 (Thứ 2 - Chủ nhật)
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* System Information Card */}
          <Grid item size={{ xs: 12, md: 4 }}>
            <Card
              sx={{
                height: "100%",
                boxShadow: 3,
                borderRadius: 2,
                backdropFilter: "blur(10px)",
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <CalendarIcon color="secondary" sx={{ fontSize: 24, mr: 1.5 }} />
                  <Typography variant="h6" fontWeight="bold" color="secondary.main">
                    Thông tin hệ thống
                  </Typography>
                </Box>

                <Stack spacing={2.5}>
                  {/* Created Date */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ backgroundColor: "secondary.light", width: 40, height: 40 }}>
                      <CalendarIcon sx={{ color: "secondary.main", fontSize: 20 }} />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Ngày thành lập
                      </Typography>
                      <Typography variant="h6" fontWeight="medium">
                        {formatDate(currentLocation.createdAt)}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Last Updated */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ backgroundColor: "info.light", width: 40, height: 40 }}>
                      <UpdateIcon sx={{ color: "info.main", fontSize: 20 }} />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Cập nhật lần cuối
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {formatDateTime(currentLocation.updatedAt)}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Status */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ backgroundColor: "success.light", width: 40, height: 40 }}>
                      <CheckCircleIcon sx={{ color: "success.main", fontSize: 20 }} />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Trạng thái hoạt động
                      </Typography>
                      <Chip
                        label={currentLocation._destroy ? "Ngưng hoạt động" : "Đang hoạt động"}
                        color={currentLocation._destroy ? "error" : "success"}
                        variant="outlined"
                        sx={{ fontWeight: "bold" }}
                      />
                    </Box>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Image Carousel Card */}
          <Grid item size={{ xs: 12, md: 4 }}>
            <Card
              sx={{
                boxShadow: 3,
                borderRadius: 2,
                backdropFilter: "blur(10px)",
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="h6" fontWeight="bold" color="primary.main" gutterBottom>
                  Hình ảnh cơ sở
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {currentLocation.images?.length || 0} hình ảnh
                </Typography>

                {currentLocation.images && currentLocation.images.length > 0 ? (
                  <Box sx={{ position: "relative" }}>
                    <Paper
                      sx={{
                        position: "relative",
                        borderRadius: 2,
                        overflow: "hidden",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.02)",
                          boxShadow: 6,
                        },
                      }}
                      onClick={() => handleImageClick()}
                    >
                      <img
                        src={currentLocation.images[currentCarouselIndex]}
                        alt={`${currentLocation.name} - Hình ${currentCarouselIndex + 1}`}
                        style={{
                          width: "100%",
                          height: "250px",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          e.target.style.display = "none"
                        }}
                      />

                      {/* Zoom Icon Overlay */}
                      <Box
                        sx={{
                          position: "absolute",
                          top: 12,
                          right: 12,
                          backgroundColor: "rgba(0,0,0,0.6)",
                          borderRadius: "50%",
                          p: 1,
                          color: "white",
                        }}
                      >
                        <ZoomInIcon />
                      </Box>

                      {/* Image Counter Overlay */}
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
                          color: "white",
                          p: 1.5,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="body1" fontWeight="bold">
                          Hình {currentCarouselIndex + 1} / {currentLocation.images.length}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                          Click để xem chi tiết
                        </Typography>
                      </Box>
                    </Paper>

                    {/* Carousel Navigation */}
                    {currentLocation.images.length > 1 && (
                      <>
                        <IconButton
                          onClick={handleCarouselPrev}
                          sx={{
                            position: "absolute",
                            left: 12,
                            top: "50%",
                            transform: "translateY(-50%)",
                            backgroundColor: "rgba(255,255,255,0.9)",
                            color: "primary.main",
                            boxShadow: 2,
                            "&:hover": {
                              backgroundColor: "white",
                              boxShadow: 4,
                            },
                          }}
                        >
                          <ChevronLeftIcon />
                        </IconButton>

                        <IconButton
                          onClick={handleCarouselNext}
                          sx={{
                            position: "absolute",
                            right: 12,
                            top: "50%",
                            transform: "translateY(-50%)",
                            backgroundColor: "rgba(255,255,255,0.9)",
                            color: "primary.main",
                            boxShadow: 2,
                            "&:hover": {
                              backgroundColor: "white",
                              boxShadow: 4,
                            },
                          }}
                        >
                          <ChevronRightIcon />
                        </IconButton>
                      </>
                    )}

                    {/* Dots Indicator */}
                    {currentLocation.images.length > 1 && (
                      <Box sx={{ display: "flex", justifyContent: "center", mt: 2, gap: 1 }}>
                        {currentLocation.images.map((_, index) => (
                          <Box
                            key={index}
                            onClick={() => setCurrentCarouselIndex(index)}
                            sx={{
                              width: 10,
                              height: 10,
                              borderRadius: "50%",
                              backgroundColor: index === currentCarouselIndex ? "primary.main" : "grey.300",
                              cursor: "pointer",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                backgroundColor: index === currentCarouselIndex ? "primary.dark" : "grey.400",
                              },
                            }}
                          />
                        ))}
                      </Box>
                    )}
                  </Box>
                ) : (
                  <Box
                    sx={{
                      textAlign: "center",
                      py: 4,
                      border: "2px dashed #e0e0e0",
                      borderRadius: 2,
                      backgroundColor: "#fafafa",
                    }}
                  >
                    <GymIcon sx={{ fontSize: 48, color: "text.secondary", mb: 1 }} />
                    <Typography variant="h6" color="text.secondary">
                      Chưa có hình ảnh
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Image Gallery Modal */}
      <Dialog
        open={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { backgroundColor: "rgba(0,0,0,0.9)" },
        }}
      >
        <DialogContent sx={{ p: 0, position: "relative" }}>
          <IconButton
            onClick={() => setIsGalleryOpen(false)}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              color: "white",
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 10,
              "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
            }}
          >
            <CloseIcon />
          </IconButton>

          {currentLocation.images && currentLocation.images.length > 0 && (
            <Box sx={{ position: "relative", textAlign: "center" }}>
              <img
                src={currentLocation.images[selectedImageIndex]}
                alt={`${currentLocation.name} - Hình ${selectedImageIndex + 1}`}
                style={{
                  maxWidth: "100%",
                  maxHeight: "80vh",
                  objectFit: "contain",
                }}
              />

              {/* Navigation Buttons */}
              {currentLocation.images.length > 1 && (
                <>
                  <IconButton
                    onClick={handlePrevImage}
                    sx={{
                      position: "absolute",
                      left: 16,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "white",
                      backgroundColor: "rgba(0,0,0,0.5)",
                      "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
                    }}
                  >
                    <ChevronLeftIcon sx={{ fontSize: 32 }} />
                  </IconButton>

                  <IconButton
                    onClick={handleNextImage}
                    sx={{
                      position: "absolute",
                      right: 16,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "white",
                      backgroundColor: "rgba(0,0,0,0.5)",
                      "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
                    }}
                  >
                    <ChevronRightIcon sx={{ fontSize: 32 }} />
                  </IconButton>
                </>
              )}

              {/* Image Counter */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 16,
                  left: "50%",
                  transform: "translateX(-50%)",
                  backgroundColor: "rgba(0,0,0,0.7)",
                  color: "white",
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                }}
              >
                <Typography variant="body2">
                  {selectedImageIndex + 1} / {currentLocation.images.length}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  )
}

export default StaffLocationInfoPage
