import React, { useEffect, useState } from "react"
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
  CheckCircle,
} from "@mui/icons-material"

// Import modal component với tên mới
import AddEditMembershipModal from "./AddEditMembershipModal"

import { formatCurrencyVND } from "~/utils/common"
import { deleteMembershipAPI, getListMembershipAPI } from "~/apis/membership"

import useMembershipStore from "~/stores/useMembershipStore"
import ConfirmDialog from "~/components/ConfirmDialog"
import { toast } from "react-toastify"

export default function AdminMembershipPage() {
  // store
  const { listMembership, updatePackage, setPackages, removePackage } = useMembershipStore()

  const [selectedPackage, setSelectedPackage] = useState(listMembership[0])
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [priceFilter, setPriceFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // const [isUpdatedSuccess, setIsUpdatedSuccess] = useState(false)

  useEffect(() => {
    const getList = async () => {
      const data = await getListMembershipAPI()
      setPackages(data.memberships)
    }
    getList()
  }, []) // chỉ chạy 1 lần

  // Modal state - cập nhật để xử lý cả add và edit
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPackage, setEditingPackage] = useState(null) // Package đang được edit

  const handleOpenAddModal = () => {
    setEditingPackage(null) // Reset edit package
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (pkg) => {
    setEditingPackage(pkg) // Set package to edit
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingPackage(null) // Reset edit package
  }

  const handleUpdateSuccess = (id, dataUpdated) => {
    // Cập nhật selectedPackage trực tiếp từ object mới
    setSelectedPackage(dataUpdated)

    // Đồng bộ luôn store (nếu chưa làm trong modal)
    updatePackage(id, dataUpdated)
  }

  const [openDialogConfirm, setOpenDialogConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleOpenDialogConfirm = () => setOpenDialogConfirm(true)

  const handleCloseDialogConfirm = () => {
    if (!deleting) setOpenDialogConfirm(false)
  }

  const handleClickDelete = async () => {
    try {
      setDeleting(true)
      console.log("🚀 ~ handleClickDelete ~ id:", selectedPackage._id)

      // call api
      const result = await deleteMembershipAPI(selectedPackage._id)
      console.log("🚀 ~ handleClickDelete ~ result:", result)

      if (result.success) {
        // hien thi thong bao xoa thanh cong
        toast.success("Đã xóa thành công gói tập ")
        // xóa trong store
        removePackage(selectedPackage._id)
        // đổi cái select
        const updatedList = useMembershipStore.getState().listMembership
        console.log("🚀 ~ handleClickDelete ~ listMembership:", listMembership)
        setSelectedPackage(updatedList[0])
      }
      // eslint-disable-next-line no-unused-vars
    } catch (e) {
      toast.error("Xóa thất bại")
    } finally {
      setDeleting(false)
      setOpenDialogConfirm(false)
    }

    // xác nhận xóa
  }

  // Filter packages based on search and filters
  const filteredPackages = listMembership.filter((pkg) => {
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
      case "boxing":
        return "warning"
      case "student":
        return "info"
      case "vip":
        return "secondary"
      default:
        return "default"
    }
  }

  const getTypeText = (type) => {
    switch (type) {
      case "gym":
        return "Gym"
      case "boxing":
        return "Boxing"
      case "student":
        return "Sinh viên"
      case "vip":
        return "VIP"
      default:
        return type
    }
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A"
    return new Date(timestamp).toLocaleDateString("vi-VN")
  }

  const calculateFinalPrice = (price, discount) => {
    return price - (price * discount) / 100
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
                    <MenuItem value="boxing">Boxing</MenuItem>
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
                    onClick={handleOpenAddModal}
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
                        src={`${selectedPackage.bannerURL}`}
                        alt={selectedPackage.name}
                        style={{
                          width: "100%",
                          height: "180px",
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
                            -{selectedPackage.discount}%
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

                  {/* Features */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                      Các quyền lợi người dùng:
                    </Typography>
                    {selectedPackage?.features.map((text) => (
                      <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                        <CheckCircle fontSize="small" color="success" />
                        <Typography variant="body2" color="text.secondary">
                          {text}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

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
                    <Button
                      variant="contained"
                      startIcon={<EditIcon />}
                      fullWidth
                      sx={{ textTransform: "none" }}
                      onClick={() => handleOpenEditModal(selectedPackage)}
                    >
                      Chỉnh sửa
                    </Button>
                    <Button
                      onClick={() => handleOpenDialogConfirm()}
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

      {/* Modal với chức năng Add/Edit */}
      <AddEditMembershipModal
        open={isModalOpen}
        onClose={handleCloseModal}
        editPackage={editingPackage} // null cho add mode, object cho edit mode
        handleUpdateSuccess={handleUpdateSuccess}
      />
      <ConfirmDialog
        open={openDialogConfirm}
        title="Xác nhận xóa"
        description={`Bạn có chắc muốn xóa gói "${selectedPackage?.name}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        loading={deleting}
        onCancel={handleCloseDialogConfirm}
        onConfirm={handleClickDelete}
      />
    </Box>
  )
}
