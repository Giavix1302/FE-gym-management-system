import React, { useState } from "react"
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
  Paper,
  IconButton,
  Chip,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Avatar,
  Stack,
} from "@mui/material"
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FileDownload as ExportIcon,
  FileUpload as ImportIcon,
  FitnessCenter as GymIcon,
  AccessTime as TimeIcon,
  AttachMoney as MoneyIcon,
  People as PeopleIcon,
  Image as ImageIcon,
  LocalOffer as OfferIcon,
} from "@mui/icons-material"

// Import modal component
import AddMembershipModal from "./AddMembershipModal"

import { formatCurrencyVND } from "~/utils"

// Mock data with real structure
const mockPackages = [
  {
    _id: "68a59a123125465f70fde8350",
    name: "Trọn gói tập gym 1 tháng",
    durationMonth: 1,
    price: 300000,
    discount: 0,
    description: "Trọn gói tập gym 1 tháng",
    type: "gym",
    bannerURL:
      "https://res.cloudinary.com/djw2dyvbc/image/upload/v1741135860/samples/landscapes/architecture-signs.jpg",
    createdAt: 1755683355772,
    updatedAt: null,
    _destroy: false,
    totalUsers: 1,
  },
  {
    _id: "68a59a1bc25465f70fse8350",
    name: "Trọn gói tập gym 1 tháng",
    durationMonth: 1,
    price: 300000,
    discount: 0,
    description: "Trọn gói tập gym 1 tháng",
    type: "gym",
    bannerURL:
      "https://res.cloudinary.com/djw2dyvbc/image/upload/v1741135860/samples/landscapes/architecture-signs.jpg",
    createdAt: 1755683355772,
    updatedAt: null,
    _destroy: false,
    totalUsers: 1,
  },
  {
    _id: "68a59a1bc25465f70fde8350",
    name: "Trọn gói tập gym 1 tháng",
    durationMonth: 1,
    price: 300000,
    discount: 0,
    description: "Trọn gói tập gym 1 tháng",
    type: "gym",
    bannerURL:
      "https://res.cloudinary.com/djw2dyvbc/image/upload/v1741135860/samples/landscapes/architecture-signs.jpg",
    createdAt: 1755683355772,
    updatedAt: null,
    _destroy: false,
    totalUsers: 1,
  },
  {
    _id: "68a59a1bc25465f70fde8351",
    name: "Gói tập gym 3 tháng Premium",
    durationMonth: 3,
    price: 800000,
    discount: 50000,
    description: "Gói tập gym 3 tháng bao gồm PT và lớp học nhóm",
    type: "gym",
    bannerURL:
      "https://res.cloudinary.com/djw2dyvbc/image/upload/v1741135860/samples/landscapes/architecture-signs.jpg",
    createdAt: 1755683355000,
    updatedAt: 1755683400000,
    _destroy: false,
    totalUsers: 15,
  },
  {
    _id: "68a59a1bc25465f70fde8352",
    name: "Gói VIP 6 tháng",
    durationMonth: 6,
    price: 1500000,
    discount: 150000,
    description: "Gói VIP 6 tháng với đầy đủ tiện ích cao cấp",
    type: "vip",
    bannerURL: "https://res.cloudinary.com/djw2dyvbc/image/upload/v1741135860/samples/animals/three-dogs.jpg",
    createdAt: 1755683300000,
    updatedAt: null,
    _destroy: false,
    totalUsers: 8,
  },
  {
    _id: "68a59a1bc25465f70fde8353",
    name: "Gói sinh viên 1 tháng",
    durationMonth: 1,
    price: 200000,
    discount: 30000,
    description: "Gói ưu đãi dành cho sinh viên",
    type: "student",
    bannerURL: "https://res.cloudinary.com/djw2dyvbc/image/upload/v1741135861/samples/ecommerce/accessories-bag.jpg",
    createdAt: 1755683200000,
    updatedAt: null,
    _destroy: true,
    totalUsers: 5,
  },
  {
    _id: "68a59a1bc25465f70fde8354",
    name: "Gói tập gym 12 tháng",
    durationMonth: 12,
    price: 2500000,
    discount: 500000,
    description: "Gói tập gym cả năm với ưu đãi lớn",
    type: "gym",
    bannerURL: "https://res.cloudinary.com/djw2dyvbc/image/upload/v1741135861/samples/people/bicycle.jpg",
    createdAt: 1755683100000,
    updatedAt: 1755683450000,
    _destroy: false,
    totalUsers: 25,
  },
]

export default function AdminMembershipPage() {
  const [packages, setPackages] = useState(mockPackages)
  const [selectedPackage, setSelectedPackage] = useState(packages[0])
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [priceFilter, setPriceFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleSavePackage = async (packageData) => {
    try {
      // Generate new ID (in real app, this would be done by backend)
      const newId = Date.now().toString()
      const newPackage = {
        ...packageData,
        _id: newId,
      }

      // Add to packages list
      setPackages((prev) => [newPackage, ...prev])

      // Set as selected package
      setSelectedPackage(newPackage)

      // Show success message
      setSnackbar({
        open: true,
        message: "Thêm gói tập thành công!",
        severity: "success",
      })

      console.log("New package added:", newPackage)
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Có lỗi xảy ra khi thêm gói tập!",
        severity: "error",
      })
      console.error("Error adding package:", error)
      throw error
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }))
  }

  // Filter packages based on search and filters
  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch =
      pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || pkg.type === typeFilter
    const matchesPrice =
      priceFilter === "all" ||
      (priceFilter === "low" && pkg.price < 500000) ||
      (priceFilter === "medium" && pkg.price >= 500000 && pkg.price < 1500000) ||
      (priceFilter === "high" && pkg.price >= 1500000)
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && !pkg._destroy) ||
      (statusFilter === "inactive" && pkg._destroy)

    return matchesSearch && matchesType && matchesPrice && matchesStatus
  })

  const handleRowClick = (pkg) => {
    setSelectedPackage(pkg)
  }

  const getStatusColor = (isDestroyed) => {
    return !isDestroyed ? "success" : "error"
  }

  const getStatusText = (isDestroyed) => {
    return !isDestroyed ? "Đang hoạt động" : "Đã xóa"
  }

  const getTypeColor = (type) => {
    switch (type) {
      case "gym":
        return "primary"
      case "vip":
        return "warning"
      case "student":
        return "info"
      default:
        return "default"
    }
  }

  const getTypeText = (type) => {
    switch (type) {
      case "gym":
        return "Gym"
      case "vip":
        return "VIP"
      case "student":
        return "Sinh viên"
      default:
        return type
    }
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A"
    return new Date(timestamp).toLocaleDateString("vi-VN")
  }

  const calculateFinalPrice = (price, discount) => {
    return price - (discount || 0)
  }

  return (
    <Box sx={{ p: 1, Height: "100%" }}>
      {/* Header Row */}
      <Card sx={{ mb: 1 }}>
        <CardContent
          sx={{
            "&:last-child": {
              pb: 2,
            },
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <GymIcon sx={{ fontSize: 32, color: "primary.main" }} />
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                Quản lý gói tập
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button variant="outlined" startIcon={<ImportIcon />} sx={{ textTransform: "none" }}>
                Import
              </Button>
              <Button variant="outlined" startIcon={<ExportIcon />} sx={{ textTransform: "none" }}>
                Export
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Grid container spacing={1}>
        {/* Left Column */}
        <Grid item size={{ xs: 12, lg: 8 }}>
          {/* Filters and Add Button Row */}
          <Card sx={{ mb: 1 }}>
            <CardContent
              sx={{
                "&:last-child": {
                  pb: 2,
                },
              }}
            >
              <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
                <TextField
                  placeholder="Tìm kiếm gói tập..."
                  variant="outlined"
                  size="small"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{ width: 150 }}
                />

                <FormControl size="small" sx={{ minWidth: 100 }}>
                  <InputLabel>Loại gói</InputLabel>
                  <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} label="Loại gói">
                    <MenuItem value="all">Tất cả</MenuItem>
                    <MenuItem value="gym">Gym</MenuItem>
                    <MenuItem value="vip">VIP</MenuItem>
                    <MenuItem value="student">Sinh viên</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 100 }}>
                  <InputLabel>Trạng thái</InputLabel>
                  <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Trạng thái">
                    <MenuItem value="all">Tất cả</MenuItem>
                    <MenuItem value="active">Hoạt động</MenuItem>
                    <MenuItem value="inactive">Đã xóa</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 100 }}>
                  <InputLabel>Mức giá</InputLabel>
                  <Select value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)} label="Mức giá">
                    <MenuItem value="all">Tất cả</MenuItem>
                    <MenuItem value="low"> 500K</MenuItem>
                    <MenuItem value="medium">500K - 1.5M</MenuItem>
                    <MenuItem value="high"> 1.5M</MenuItem>
                  </Select>
                </FormControl>

                <Box sx={{ ml: "auto" }}>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenModal}
                    sx={{ textTransform: "none", fontWeight: "bold" }}
                  >
                    Thêm gói tập
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Data Table */}
          <Card>
            <CardContent sx={{ p: 0 }}>
              <Typography variant="h6" sx={{ p: 2, pb: 1, fontWeight: "bold", color: "primary.main" }}>
                Bảng dữ liệu ({filteredPackages.length} gói tập)
              </Typography>

              <TableContainer sx={{ maxHeight: "58vh", overflowY: "auto" }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "grey.50" }}>
                      <TableCell sx={{ fontWeight: "bold", py: 1 }}>Tên gói</TableCell>
                      <TableCell sx={{ fontWeight: "bold", py: 1 }}>Loại</TableCell>
                      <TableCell sx={{ fontWeight: "bold", py: 1 }}>Giá</TableCell>
                      <TableCell sx={{ fontWeight: "bold", py: 1 }}>Thời hạn</TableCell>
                      <TableCell sx={{ fontWeight: "bold", py: 1 }}>Người dùng</TableCell>
                      <TableCell sx={{ fontWeight: "bold", py: 1 }}>Trạng thái</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {filteredPackages.map((pkg) => (
                      <TableRow
                        key={pkg._id}
                        hover
                        onClick={() => handleRowClick(pkg)}
                        sx={{
                          cursor: "pointer",
                          bgcolor: selectedPackage?._id === pkg._id ? "primary.50" : "transparent",
                        }}
                      >
                        <TableCell>
                          <Typography fontWeight="medium">{pkg.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {pkg.description.substring(0, 40)}...
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Chip
                            label={getTypeText(pkg.type)}
                            color={getTypeColor(pkg.type)}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>

                        <TableCell>
                          <Box>
                            {pkg.discount > 0 && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ textDecoration: "line-through" }}
                              >
                                {formatCurrencyVND(pkg.price)}
                              </Typography>
                            )}
                            <Typography fontWeight="bold" color="success.main">
                              {formatCurrencyVND(calculateFinalPrice(pkg.price, pkg.discount))}
                            </Typography>
                          </Box>
                        </TableCell>

                        <TableCell>{pkg.durationMonth} tháng</TableCell>

                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <PeopleIcon fontSize="small" color="action" />
                            {pkg.totalUsers}
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Chip label={getStatusText(pkg._destroy)} color={getStatusColor(pkg._destroy)} size="small" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Package Details */}
        <Grid item size={{ xs: 12, lg: 4 }}>
          <Card
            sx={{
              height: "79vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardContent
              sx={{
                overflowY: "auto",
                flex: 1,
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", color: "primary.main" }}>
                Thông tin chi tiết gói tập
              </Typography>

              {selectedPackage && (
                <>
                  {/* Package Header */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                      {selectedPackage.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {selectedPackage.description}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                      <Chip
                        label={getTypeText(selectedPackage.type)}
                        color={getTypeColor(selectedPackage.type)}
                        size="small"
                      />
                      <Chip
                        label={getStatusText(selectedPackage._destroy)}
                        color={getStatusColor(selectedPackage._destroy)}
                        size="small"
                      />
                    </Box>
                  </Box>

                  {/* Banner Image */}
                  {selectedPackage.bannerURL && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                        Banner:
                      </Typography>
                      <img
                        src={selectedPackage.bannerURL}
                        alt={selectedPackage.name}
                        style={{
                          width: "100%",
                          height: "150px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          border: "1px solid #e0e0e0",
                        }}
                        onError={(e) => {
                          e.target.style.display = "none"
                        }}
                      />
                    </Box>
                  )}

                  <Divider sx={{ my: 2 }} />

                  {/* Package Info */}
                  <Stack spacing={2} sx={{ mb: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <MoneyIcon color="success" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Giá gói
                        </Typography>
                        {selectedPackage.discount > 0 ? (
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ textDecoration: "line-through" }}
                            >
                              {formatCurrencyVND(selectedPackage.price)}
                            </Typography>
                            <Typography variant="h6" fontWeight="bold" color="success.main">
                              {formatCurrencyVND(calculateFinalPrice(selectedPackage.price, selectedPackage.discount))}
                            </Typography>
                          </Box>
                        ) : (
                          <Typography variant="h6" fontWeight="bold" color="success.main">
                            {formatCurrencyVND(selectedPackage.price)}
                          </Typography>
                        )}
                      </Box>
                    </Box>

                    {selectedPackage.discount > 0 && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <OfferIcon color="error" />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Giảm giá
                          </Typography>
                          <Typography variant="body1" fontWeight="medium" color="error.main">
                            -{formatCurrencyVND(selectedPackage.discount)}
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <TimeIcon color="primary" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Thời hạn
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {selectedPackage.durationMonth} tháng
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <PeopleIcon color="info" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Người đang sử dụng
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {selectedPackage.totalUsers} người
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>

                  <Divider sx={{ my: 2 }} />

                  {/* Timestamps */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                      Thông tin thời gian:
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Ngày tạo: {formatDate(selectedPackage.createdAt)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Ngày cập nhật: {formatDate(selectedPackage.updatedAt)}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Action Buttons */}
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button variant="contained" startIcon={<EditIcon />} fullWidth sx={{ textTransform: "none" }}>
                      Chỉnh sửa
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      fullWidth
                      sx={{ textTransform: "none" }}
                      disabled={selectedPackage._destroy}
                    >
                      {selectedPackage._destroy ? "Đã xóa" : "Xóa"}
                    </Button>
                  </Box>

                  <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: "block" }}>
                    ID: {selectedPackage._id}
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <AddMembershipModal open={isModalOpen} onClose={handleCloseModal} onSave={handleSavePackage} />
    </Box>
  )
}
