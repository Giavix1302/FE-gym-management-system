import {
  Box,
  Container,
  Grid,
  TextField,
  MenuItem,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  IconButton,
  Modal,
  Divider,
  Chip,
} from "@mui/material"
import { useEffect, useState } from "react"
import { getListLocation } from "~/apis/homeUnsigned"
import SearchIcon from "@mui/icons-material/Search"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import PhoneIcon from "@mui/icons-material/Phone"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import CloseIcon from "@mui/icons-material/Close"
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import GymIcon from "@mui/icons-material/FitnessCenter"
import LocalPhoneIcon from "@mui/icons-material/LocalPhone"

function ListLocationPage() {
  const [locations, setLocations] = useState([])
  const [filteredLocations, setFilteredLocations] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProvince, setSelectedProvince] = useState("")
  const [selectedWard, setSelectedWard] = useState("")
  const [provinces, setProvinces] = useState([])
  const [wards, setWards] = useState([])
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [openModal, setOpenModal] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const init = async () => {
      const resp = await getListLocation()
      setLocations(resp.locations)
      setFilteredLocations(resp.locations)

      // Extract unique provinces
      const uniqueProvinces = [...new Set(resp.locations.map((loc) => loc.address.province))]
      setProvinces(uniqueProvinces)
    }
    init()
  }, [])

  // Update wards when province changes
  useEffect(() => {
    if (selectedProvince) {
      const wardsInProvince = [
        ...new Set(locations.filter((loc) => loc.address.province === selectedProvince).map((loc) => loc.address.ward)),
      ]
      setWards(wardsInProvince)
    } else {
      setWards([])
      setSelectedWard("")
    }
  }, [selectedProvince, locations])

  // Filter locations
  useEffect(() => {
    let filtered = locations

    if (searchTerm) {
      filtered = filtered.filter((loc) => loc.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    if (selectedProvince) {
      filtered = filtered.filter((loc) => loc.address.province === selectedProvince)
    }

    if (selectedWard) {
      filtered = filtered.filter((loc) => loc.address.ward === selectedWard)
    }

    setFilteredLocations(filtered)
  }, [searchTerm, selectedProvince, selectedWard, locations])

  const handleOpenModal = (location) => {
    setSelectedLocation(location)
    setCurrentImageIndex(0)
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
    setSelectedLocation(null)
    setCurrentImageIndex(0)
  }

  const handleNextImage = () => {
    if (selectedLocation) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedLocation.images.length)
    }
  }

  const handlePrevImage = () => {
    if (selectedLocation) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedLocation.images.length) % selectedLocation.images.length)
    }
  }

  const handleContact = (phone) => {
    window.location.href = `tel:${phone}`
  }

  return (
    <Container sx={{ bgcolor: "background.default", minHeight: "100vh", py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, alignSelf: "center" }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "primary.main",
            mb: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            gap: 1,
          }}
        >
          Hệ Thống Phòng Tập
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary", justifyContent: "center", textAlign: "center" }}>
          Tìm kiếm và khám phá các phòng tập gần bạn
        </Typography>
      </Box>

      {/* Filters */}
      <Box
        sx={{
          mb: 4,
          p: 3,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              placeholder="Tìm kiếm theo tên phòng tập..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: <SearchIcon sx={{ color: "text.secondary", mr: 1, ml: -0.5 }} />,
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              select
              fullWidth
              label="Tỉnh/Thành phố"
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
            >
              <MenuItem value="">Tất cả</MenuItem>
              {provinces.map((province) => (
                <MenuItem key={province} value={province}>
                  {province}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              select
              fullWidth
              label="Phường/Xã"
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              disabled={!selectedProvince}
            >
              <MenuItem value="">Tất cả</MenuItem>
              {wards.map((ward) => (
                <MenuItem key={ward} value={ward}>
                  {ward}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Box>

      {/* Location Grid */}
      {filteredLocations.length > 0 ? (
        <Grid container spacing={3}>
          {filteredLocations.map((location) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={location._id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 8px 24px rgba(22, 105, 122, 0.2)",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={location.images[0]}
                  alt={location.name}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: "primary.main",
                      mb: 2,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {location.name}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1.5 }}>
                    <LocationOnIcon
                      sx={{
                        fontSize: 20,
                        color: "secondary.main",
                        mr: 1,
                        mt: 0.2,
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {location.address.street}, {location.address.ward}, {location.address.province}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <AccessTimeIcon sx={{ fontSize: 20, color: "info.main", mr: 1 }} />
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      Mở cửa: 6:00 - 22:00
                    </Typography>
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => handleOpenModal(location)}
                    sx={{
                      bgcolor: "secondary.main",
                      "&:hover": { bgcolor: "primary.main" },
                    }}
                  >
                    Xem chi tiết
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 10,
            bgcolor: "background.paper",
            borderRadius: 2,
          }}
        >
          <GymIcon sx={{ fontSize: 80, color: "info.main", mb: 2 }} />
          <Typography variant="h6" sx={{ color: "text.secondary" }}>
            Không tìm thấy phòng tập phù hợp
          </Typography>
        </Box>
      )}

      {/* Detail Modal */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: { xs: "95%", sm: "90%", md: "80%", lg: "70%" },
            maxWidth: 1200,

            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: 24,
            overflow: "auto",
          }}
        >
          {selectedLocation && (
            <>
              {/* Close Button */}
              <IconButton
                onClick={handleCloseModal}
                sx={{
                  position: "absolute",
                  right: 16,
                  top: 16,
                  bgcolor: "rgba(255, 255, 255, 0.9)",
                  zIndex: 10,
                  "&:hover": { bgcolor: "rgba(255, 255, 255, 1)" },
                }}
              >
                <CloseIcon />
              </IconButton>

              <Grid container>
                {/* Information */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ p: 4 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: "text.primary", mb: 1 }}>
                      Cơ sở
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: "secondary.main", mb: 3 }}>
                      {selectedLocation.name}
                    </Typography>

                    <Divider sx={{ mb: 3 }} />

                    <Box sx={{ mb: 3 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 2,
                        }}
                      >
                        <FitnessCenterIcon sx={{ color: "primary.main", mr: 2 }} />
                        <Typography variant="body1" sx={{ color: "text.primary" }}>
                          {selectedLocation.name}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 2,
                        }}
                      >
                        <LocationOnIcon sx={{ color: "secondary.main", mr: 2 }} />
                        <Typography variant="body1" sx={{ color: "text.primary" }}>
                          {selectedLocation.address.street}, {selectedLocation.address.ward},{" "}
                          {selectedLocation.address.province}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 2,
                        }}
                      >
                        <LocalPhoneIcon sx={{ color: "secondary.main", mr: 2 }} />
                        <Typography variant="body1" sx={{ color: "text.primary" }}>
                          {selectedLocation.phone}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 2,
                        }}
                      >
                        <AccessTimeIcon sx={{ color: "info.main", mr: 2 }} />
                        <Typography variant="body1" sx={{ color: "text.primary" }}>
                          24 giờ/ 7 ngày trong tuần
                        </Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    <Box sx={{ mb: 3 }}>
                      <Chip
                        label="Xem map"
                        icon={<LocationOnIcon />}
                        clickable
                        sx={{
                          bgcolor: "info.main",
                          color: "white",
                          mr: 1,
                          mb: 1,
                        }}
                      />
                      <Chip
                        label="Lịch lớp học"
                        clickable
                        sx={{
                          bgcolor: "background.default",
                          mr: 1,
                          mb: 1,
                        }}
                      />
                      <Chip
                        label="Đánh giá"
                        clickable
                        sx={{
                          bgcolor: "background.default",
                          mb: 1,
                        }}
                      />
                    </Box>

                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      startIcon={<PhoneIcon />}
                      onClick={() => handleContact(selectedLocation.phone)}
                      sx={{
                        bgcolor: "secondary.main",
                        py: 1.5,
                        fontSize: "1rem",
                        fontWeight: 600,
                        "&:hover": { bgcolor: "primary.main" },
                      }}
                    >
                      Liên hệ ngay
                    </Button>
                  </Box>
                </Grid>

                {/* Image Gallery */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ position: "relative", height: "100%", pr: 4 }}>
                    <Box
                      component="img"
                      src={selectedLocation.images[currentImageIndex]}
                      alt={selectedLocation.name}
                      sx={{
                        // width: "100%",
                        // height: { xs: 300, md: "100%" },
                        // minHeight: { md: 500 },
                        position: "absolute",
                        top: "50%",
                        transform: "translateY(-50%)",
                        height: "100%",
                        width: "100%",
                        objectFit: "cover",
                      }}
                    />

                    {/* Navigation Arrows */}
                    {selectedLocation.images.length > 1 && (
                      <>
                        <IconButton
                          onClick={handlePrevImage}
                          sx={{
                            position: "absolute",
                            left: 16,
                            top: "50%",
                            transform: "translateY(-50%)",
                            bgcolor: "rgba(255, 255, 255, 0.9)",
                            "&:hover": { bgcolor: "rgba(255, 255, 255, 1)" },
                          }}
                        >
                          <ChevronLeftIcon />
                        </IconButton>
                        <IconButton
                          onClick={handleNextImage}
                          sx={{
                            position: "absolute",
                            right: 16,
                            top: "50%",
                            transform: "translateY(-50%)",
                            bgcolor: "rgba(255, 255, 255, 0.9)",
                            "&:hover": { bgcolor: "rgba(255, 255, 255, 1)" },
                          }}
                        >
                          <ChevronRightIcon />
                        </IconButton>
                      </>
                    )}

                    {/* Thumbnail Navigation */}
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 16,
                        left: "50%",
                        transform: "translateX(-50%)",
                        display: "flex",
                        gap: 1,
                        bgcolor: "rgba(0, 0, 0, 0.5)",
                        borderRadius: 2,
                        p: 1,
                      }}
                    >
                      {selectedLocation.images.map((img, index) => (
                        <Box
                          key={index}
                          component="img"
                          src={img}
                          onClick={() => setCurrentImageIndex(index)}
                          sx={{
                            width: 60,
                            height: 60,
                            objectFit: "cover",
                            borderRadius: 1,
                            cursor: "pointer",
                            border: currentImageIndex === index ? "3px solid" : "3px solid transparent",
                            borderColor: "secondary.main",
                            opacity: currentImageIndex === index ? 1 : 0.6,
                            transition: "all 0.3s ease",
                            "&:hover": { opacity: 1 },
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </>
          )}
        </Box>
      </Modal>
    </Container>
  )
}

export default ListLocationPage
