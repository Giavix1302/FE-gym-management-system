import React, { useState, useMemo } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Tabs,
  Tab,
  Grid,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Stack,
  Divider,
  ImageList,
  ImageListItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material"
import {
  Close as CloseIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Group as GroupIcon,
  MeetingRoom as RoomIcon,
  FitnessCenter as EquipmentIcon,
  Image as ImageIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  QrCode as QrCodeIcon,
  Face as FaceIcon,
  EventNote as EventNoteIcon,
} from "@mui/icons-material"
import HomeWorkIcon from "@mui/icons-material/HomeWork"

import { formatCurrencyVND } from "~/utils/common"
import EquipmentDetailModal from "~/pages/staff/staffEquipment/EquipmentDetailModal"

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`location-tabpanel-${index}`}
      aria-labelledby={`location-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

export default function LocationDetailModal({ open, onClose, location, onEdit, onDelete }) {
  console.log("🚀 ~ LocationDetailModal ~ location:", location)

  const [tabValue, setTabValue] = useState(0)
  const [selectedEquipment, setSelectedEquipment] = useState(null)
  const [equipmentDetailOpen, setEquipmentDetailOpen] = useState(false)

  // Group attendances by date - MUST be before early return
  const groupedAttendances = useMemo(() => {
    if (!location || !location.attendances || location.attendances.length === 0) return []

    const groups = {}

    location.attendances.forEach((attendance) => {
      if (!attendance.checkinTime) return

      const date = new Date(attendance.checkinTime)
      const dateKey = date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })

      if (!groups[dateKey]) {
        groups[dateKey] = {
          date: dateKey,
          fullDate: date,
          dayOfWeek: date.toLocaleDateString("vi-VN", { weekday: "long" }),
          attendances: [],
        }
      }

      groups[dateKey].attendances.push(attendance)
    })

    // Convert to array and sort by date descending (newest first)
    return Object.values(groups).sort((a, b) => b.fullDate - a.fullDate)
  }, [location])

  // Early return AFTER all hooks
  if (!location) return null

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const formatAddress = (address) => {
    return `${address.street}, ${address.ward}, ${address.province}`
  }

  const getEquipmentStatusColor = (status) => {
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

  const getEquipmentStatusText = (status) => {
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

  const getEquipmentStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckIcon />
      case "maintenance":
        return <WarningIcon />
      case "broken":
        return <ErrorIcon />
      default:
        return <CheckIcon />
    }
  }

  const handleEquipmentClick = (equipment) => {
    setSelectedEquipment(equipment)
    setEquipmentDetailOpen(true)
  }

  // Format datetime to display format: 13:00 - 13:20 26/11/2025
  const formatAttendanceTime = (checkinTime, checkoutTime) => {
    if (!checkinTime || !checkoutTime) return "N/A"

    const checkin = new Date(checkinTime)
    const checkout = new Date(checkoutTime)

    const checkinTimeStr = checkin.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    const checkoutTimeStr = checkout.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    const dateStr = checkin.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })

    return `${checkinTimeStr} - ${checkoutTimeStr} ${dateStr}`
  }

  // Format method display
  const formatMethod = (method) => {
    if (method === "qrCode") {
      return {
        text: "QR Code",
        icon: <QrCodeIcon fontSize="small" />,
      }
    } else if (method === "face") {
      return {
        text: "Face Recognition",
        icon: <FaceIcon fontSize="small" />,
      }
    }
    return {
      text: method,
      icon: <QrCodeIcon fontSize="small" />,
    }
  }

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ m: 0, p: 2, display: "flex", alignItems: "center", gap: 1, backgroundColor: "primary" }}>
          <HomeWorkIcon color="primary" />
          <Typography variant="h6" fontWeight="bold" component="div" sx={{ flexGrow: 1 }}>
            {location.name}
          </Typography>
          <IconButton aria-label="close" onClick={onClose} sx={{ color: (theme) => theme.palette.grey[500] }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="location detail tabs">
            <Tab label="Thông tin cơ bản" icon={<HomeWorkIcon />} iconPosition="start" />
            <Tab label={`Thiết bị (${location.equipmentCount || 0})`} icon={<EquipmentIcon />} iconPosition="start" />
            <Tab
              label={`Lịch sử tập (${location.attendances?.length || 0})`}
              icon={<EventNoteIcon />}
              iconPosition="start"
            />
          </Tabs>
        </Box>

        <DialogContent dividers sx={{ p: 0, minHeight: 450 }}>
          {/* Tab 1: Basic Information */}
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ px: 3 }}>
              <Grid container spacing={3}>
                {/* Left Column - Basic Info */}
                <Grid item size={{ xs: 12 }}>
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    gutterBottom
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <LocationIcon color="primary" />
                    {location.name}
                  </Typography>

                  <Stack spacing={3}>
                    {/* Contact Info */}
                    <Box>
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        gutterBottom
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <PhoneIcon color="success" />
                        Thông tin liên hệ
                      </Typography>
                      <Box sx={{ pl: 4 }}>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          <strong>Số điện thoại:</strong> {location.phone}
                        </Typography>
                        <Typography variant="body1">
                          <strong>Địa chỉ:</strong> {formatAddress(location.address)}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider />

                    {/* Statistics */}
                    <Box>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Thống kê
                      </Typography>
                      <Stack direction="row" spacing={2} sx={{ pl: 2 }}>
                        <Chip
                          icon={<GroupIcon />}
                          label={`${location.staffCount || 0} nhân viên`}
                          color="primary"
                          variant="outlined"
                        />
                        <Chip
                          icon={<RoomIcon />}
                          label={`${location.roomCount || 0} phòng`}
                          color="secondary"
                          variant="outlined"
                        />
                        <Chip
                          icon={<EquipmentIcon />}
                          label={`${location.equipmentCount || 0} thiết bị`}
                          color="warning"
                          variant="outlined"
                        />
                      </Stack>
                    </Box>

                    <Divider />

                    {/* Location ID */}
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        <strong>ID Location:</strong> {location._id}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>

                {/* Right Column - Images */}
                <Grid item size={{ xs: 12 }}>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    gutterBottom
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <ImageIcon color="info" />
                    Hình ảnh Location ({location.images?.length || 0})
                  </Typography>

                  {location.images && location.images.length > 0 ? (
                    <ImageList sx={{ width: "100%", height: 180 }} cols={6} rowHeight={180}>
                      {location.images.map((image, index) => (
                        <ImageListItem key={index}>
                          <img
                            src={image}
                            alt={`${location.name} - ${index + 1}`}
                            loading="lazy"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: "8px",
                              cursor: "pointer",
                            }}
                            onClick={() => window.open(image, "_blank")}
                            onError={(e) => {
                              e.target.style.display = "none"
                            }}
                          />
                        </ImageListItem>
                      ))}
                    </ImageList>
                  ) : (
                    <Box
                      sx={{
                        textAlign: "center",
                        py: 6,
                        border: "1px dashed #e0e0e0",
                        borderRadius: 2,
                        backgroundColor: "#fafafa",
                      }}
                    >
                      <ImageIcon sx={{ fontSize: 48, color: "text.secondary", mb: 1 }} />
                      <Typography variant="body1" color="text.secondary">
                        Chưa có hình ảnh
                      </Typography>
                    </Box>
                  )}
                </Grid>
              </Grid>
            </Box>
          </TabPanel>

          {/* Tab 2: Equipment List */}
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ px: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Danh sách thiết bị tại {location.name}
              </Typography>

              {location.equipments && location.equipments.length > 0 ? (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Tên thiết bị</TableCell>
                        <TableCell>Thương hiệu</TableCell>
                        <TableCell align="center">Trạng thái</TableCell>
                        <TableCell align="right">Giá trị</TableCell>
                        <TableCell align="center">Nhóm cơ</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {location.equipments.map((equipment) => (
                        <TableRow
                          key={equipment._id}
                          hover
                          sx={{ cursor: "pointer" }}
                          onClick={() => handleEquipmentClick(equipment)}
                        >
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                              {equipment.image ? (
                                <Avatar src={equipment.image} alt={equipment.name} sx={{ width: 40, height: 40 }} />
                              ) : (
                                <Avatar sx={{ bgcolor: "warning.main", width: 40, height: 40 }}>
                                  <EquipmentIcon />
                                </Avatar>
                              )}
                              <Box>
                                <Typography variant="subtitle2" fontWeight="bold">
                                  {equipment.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  ID: {equipment._id}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{equipment.brand}</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={getEquipmentStatusText(equipment.status)}
                              color={getEquipmentStatusColor(equipment.status)}
                              icon={getEquipmentStatusIcon(equipment.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight="bold" color="success.main">
                              {formatCurrencyVND(equipment.price)}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" color="primary.main">
                              {equipment.muscleCategories?.length || 0} nhóm
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box
                  sx={{
                    textAlign: "center",
                    py: 6,
                    border: "1px dashed #e0e0e0",
                    borderRadius: 2,
                    backgroundColor: "#fafafa",
                  }}
                >
                  <EquipmentIcon sx={{ fontSize: 48, color: "text.secondary", mb: 1 }} />
                  <Typography variant="body1" color="text.secondary">
                    Chưa có thiết bị
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Location này chưa có thiết bị nào được thêm vào
                  </Typography>
                </Box>
              )}
            </Box>
          </TabPanel>

          {/* Tab 3: Attendance History */}
          <TabPanel value={tabValue} index={2}>
            <Box sx={{ px: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Lịch sử tập luyện 30 ngày gần nhất tại {location.name}
              </Typography>

              {groupedAttendances && groupedAttendances.length > 0 ? (
                <Box sx={{ mt: 2 }}>
                  {groupedAttendances.map((group, groupIndex) => (
                    <Accordion key={groupIndex} defaultExpanded={groupIndex === 0} sx={{ mb: 1 }}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`panel-${groupIndex}-content`}
                        id={`panel-${groupIndex}-header`}
                        sx={{
                          backgroundColor: "primary.dark",
                          color: "white",
                          borderRadius: "4px",
                          "&:hover": {
                            backgroundColor: "primary.dark",
                          },
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%" }}>
                          <EventNoteIcon />
                          <Typography variant="subtitle1" fontWeight="bold">
                            {group.dayOfWeek}, {group.date}
                          </Typography>
                          <Chip
                            label={`${group.attendances.length} lượt tập`}
                            size="small"
                            sx={{
                              ml: "auto",
                              backgroundColor: "white",
                              color: "primary.main",
                              fontWeight: "bold",
                            }}
                          />
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails sx={{ p: 0 }}>
                        <TableContainer>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell width="5%" align="center">
                                  <strong>STT</strong>
                                </TableCell>
                                <TableCell width="25%">
                                  <strong>Họ tên</strong>
                                </TableCell>
                                <TableCell width="15%">
                                  <strong>Số điện thoại</strong>
                                </TableCell>
                                <TableCell width="30%">
                                  <strong>Thời gian</strong>
                                </TableCell>
                                <TableCell width="10%" align="center">
                                  <strong>Thời lượng</strong>
                                </TableCell>
                                <TableCell width="15%" align="center">
                                  <strong>Phương thức</strong>
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {group.attendances.map((attendance, index) => {
                                const methodInfo = formatMethod(attendance.method)
                                return (
                                  <TableRow key={attendance._id} hover>
                                    <TableCell align="center">{index + 1}</TableCell>
                                    <TableCell>
                                      <Typography variant="body2" fontWeight="medium">
                                        {attendance.fullName || "N/A"}
                                      </Typography>
                                    </TableCell>
                                    <TableCell>
                                      <Typography variant="body2" color="text.secondary">
                                        {attendance.phone || "N/A"}
                                      </Typography>
                                    </TableCell>
                                    <TableCell>
                                      <Typography variant="body2">
                                        {formatAttendanceTime(attendance.checkinTime, attendance.checkoutTime)}
                                      </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                      <Chip
                                        label={`${attendance.hours.toFixed(2)} giờ`}
                                        size="small"
                                        color="success"
                                        variant="outlined"
                                      />
                                    </TableCell>
                                    <TableCell align="center">
                                      <Chip
                                        icon={methodInfo.icon}
                                        label={methodInfo.text}
                                        size="small"
                                        color="info"
                                        variant="outlined"
                                      />
                                    </TableCell>
                                  </TableRow>
                                )
                              })}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              ) : (
                <Box
                  sx={{
                    textAlign: "center",
                    py: 6,
                    border: "1px dashed #e0e0e0",
                    borderRadius: 2,
                    backgroundColor: "#fafafa",
                  }}
                >
                  <EventNoteIcon sx={{ fontSize: 48, color: "text.secondary", mb: 1 }} />
                  <Typography variant="body1" color="text.secondary">
                    Chưa có lịch sử tập luyện
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Không có dữ liệu attendance trong 30 ngày gần nhất
                  </Typography>
                </Box>
              )}
            </Box>
          </TabPanel>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button onClick={onClose} variant="outlined" sx={{ minWidth: 100 }}>
            Đóng
          </Button>
          <Button
            onClick={() => onEdit && onEdit(location)}
            variant="contained"
            color="warning"
            startIcon={<EditIcon />}
            sx={{ minWidth: 120 }}
          >
            Sửa Location
          </Button>
          <Button
            onClick={() => onDelete && onDelete(location)}
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            sx={{ minWidth: 120 }}
          >
            Xóa Location
          </Button>
        </DialogActions>
      </Dialog>

      {/* Equipment Detail Modal */}
      <EquipmentDetailModal
        open={equipmentDetailOpen}
        onClose={() => setEquipmentDetailOpen(false)}
        equipment={selectedEquipment}
        locationName={location.name}
      />
    </>
  )
}
