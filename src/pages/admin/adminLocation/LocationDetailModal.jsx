import React, { useState } from "react"
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
} from "@mui/material"
import {
  Close as CloseIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  Group as GroupIcon,
  MeetingRoom as RoomIcon,
  FitnessCenter as EquipmentIcon,
  Image as ImageIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material"

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
  const [tabValue, setTabValue] = useState(0)
  const [selectedEquipment, setSelectedEquipment] = useState(null)
  const [equipmentDetailOpen, setEquipmentDetailOpen] = useState(false)

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

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ m: 0, p: 2, display: "flex", alignItems: "center", gap: 1 }}>
          <BusinessIcon color="primary" />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Chi tiết Location: {location.name}
          </Typography>
          <IconButton aria-label="close" onClick={onClose} sx={{ color: (theme) => theme.palette.grey[500] }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="location detail tabs">
            <Tab label="Thông tin cơ bản" icon={<BusinessIcon />} iconPosition="start" />
            <Tab label={`Thiết bị (${location.equipmentCount || 0})`} icon={<EquipmentIcon />} iconPosition="start" />
          </Tabs>
        </Box>

        <DialogContent dividers sx={{ p: 0, minHeight: 500 }}>
          {/* Tab 1: Basic Information */}
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ px: 3 }}>
              <Grid container spacing={3}>
                {/* Left Column - Basic Info */}
                <Grid item xs={12} md={6}>
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
                <Grid item xs={12} md={6}>
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
                    <ImageList sx={{ width: "100%", height: 400 }} cols={2} rowHeight={180}>
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
