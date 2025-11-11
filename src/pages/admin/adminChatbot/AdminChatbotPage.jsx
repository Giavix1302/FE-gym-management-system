import React, { useState, useEffect } from "react"
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Grid,
  Tooltip,
  Switch,
  FormControlLabel,
} from "@mui/material"
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material"
import { toast } from "react-toastify"
import { getAllGymInfoAPI, createGymInfoAPI, updateGymInfoAPI, deleteGymInfoAPI } from "~/apis/chatbot"

// Gym Info Form Component
function GymInfoForm({ open, onClose, gymInfo, onSave }) {
  const [formData, setFormData] = useState({
    key: "",
    value: "",
    category: "basic_info",
    displayFormat: "text",
    isActive: true,
  })
  const [loading, setLoading] = useState(false)

  const categories = [
    { value: "basic_info", label: "Thông tin cơ bản" },
    { value: "contact", label: "Liên hệ" },
    { value: "policies", label: "Chính sách" },
    { value: "pricing", label: "Giá cả" },
  ]

  const displayFormats = [
    { value: "text", label: "Text" },
    { value: "html", label: "HTML" },
    { value: "json", label: "JSON" },
  ]

  useEffect(() => {
    if (gymInfo) {
      setFormData({
        key: gymInfo.key || "",
        value: gymInfo.value || "",
        category: gymInfo.category || "basic_info",
        displayFormat: gymInfo.displayFormat || "text",
        isActive: gymInfo.isActive !== false,
      })
    } else {
      setFormData({
        key: "",
        value: "",
        category: "basic_info",
        displayFormat: "text",
        isActive: true,
      })
    }
  }, [gymInfo])

  const handleSubmit = async () => {
    if (!formData.key.trim() || !formData.value.trim()) {
      toast.error("Vui lòng điền đầy đủ key và value")
      return
    }

    console.log("📝 Form Data being submitted:", formData) // DEBUG LOG

    setLoading(true)
    try {
      let response
      if (gymInfo?._id) {
        console.log("🔄 Updating gym info with ID:", gymInfo._id) // DEBUG LOG
        response = await updateGymInfoAPI(gymInfo._id, formData)
        toast.success("Cập nhật gym info thành công!")
      } else {
        console.log("➕ Creating new gym info") // DEBUG LOG
        response = await createGymInfoAPI(formData)
        toast.success("Thêm gym info thành công!")
      }
      console.log("✅ API Response:", response) // DEBUG LOG
      onSave()
      onClose()
    } catch (error) {
      console.error("❌ Save gym info error:", error)
      toast.error("Có lỗi xảy ra!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{gymInfo ? "Sửa Gym Info" : "Thêm Gym Info Mới"}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
          <TextField
            label="Key"
            value={formData.key}
            onChange={(e) => setFormData({ ...formData, key: e.target.value })}
            fullWidth
            required
            disabled={!!gymInfo}
            helperText="Key không được thay đổi sau khi tạo"
          />

          <TextField
            label="Value"
            multiline
            rows={4}
            value={formData.value}
            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
            fullWidth
            required
          />

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Danh mục</InputLabel>
                <Select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  label="Danh mục"
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Định dạng</InputLabel>
                <Select
                  value={formData.displayFormat}
                  onChange={(e) => setFormData({ ...formData, displayFormat: e.target.value })}
                  label="Định dạng"
                >
                  {displayFormats.map((format) => (
                    <MenuItem key={format.value} value={format.value}>
                      {format.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <FormControlLabel
            control={
              <Switch
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
            }
            label="Kích hoạt"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={20} /> : "Lưu"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

// Main Admin Component
function AdminChatbotPage() {
  const [loading, setLoading] = useState(false)

  // Gym Info State
  const [gymInfoData, setGymInfoData] = useState([])
  const [gymInfoPage, setGymInfoPage] = useState(0)
  const [gymInfoRowsPerPage, setGymInfoRowsPerPage] = useState(10)
  const [gymInfoDialog, setGymInfoDialog] = useState(false)
  const [selectedGymInfo, setSelectedGymInfo] = useState(null)
  const [gymInfoSearch, setGymInfoSearch] = useState("")

  // Load Gym Info Data
  const loadGymInfoData = async () => {
    console.log("🔄 Loading gym info data...") // DEBUG LOG
    setLoading(true)
    try {
      const response = await getAllGymInfoAPI()
      console.log("📡 API Response:", response) // DEBUG LOG
      console.log("📊 Response success:", response?.success) // DEBUG LOG
      console.log("📦 Response data:", response?.data) // DEBUG LOG
      console.log("📏 Data length:", response?.data?.length) // DEBUG LOG

      if (response.success) {
        setGymInfoData(response.gymInfo || [])
        console.log("✅ Gym info data set successfully") // DEBUG LOG
      } else {
        console.log("❌ API response success = false") // DEBUG LOG
      }
    } catch (error) {
      console.error("❌ Load gym info error:", error)
      toast.error("Không thể tải dữ liệu!")
    } finally {
      setLoading(false)
      console.log("🏁 Loading finished") // DEBUG LOG
    }
  }

  // Initial Load
  useEffect(() => {
    console.log("🚀 Component mounted, loading gym info data...") // DEBUG LOG
    loadGymInfoData()
  }, [])

  // Debug state changes
  useEffect(() => {
    console.log("🔄 gymInfoData state changed:", gymInfoData)
    console.log("📊 Current gymInfoData length:", gymInfoData.length)
  }, [gymInfoData])

  // Handle Gym Info Actions
  const handleGymInfoEdit = (gymInfo) => {
    console.log("✏️ Editing gym info:", gymInfo) // DEBUG LOG
    setSelectedGymInfo(gymInfo)
    setGymInfoDialog(true)
  }

  const handleGymInfoDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa gym info này?")) {
      console.log("🗑️ Deleting gym info ID:", id) // DEBUG LOG
      try {
        const response = await deleteGymInfoAPI(id)
        console.log("✅ Delete response:", response) // DEBUG LOG
        toast.success("Xóa gym info thành công!")
        loadGymInfoData()
      } catch (error) {
        console.error("❌ Delete gym info error:", error)
        toast.error("Có lỗi khi xóa!")
      }
    }
  }

  // Filter Data
  const filteredGymInfoData = gymInfoData.filter(
    (item) =>
      item.key.toLowerCase().includes(gymInfoSearch.toLowerCase()) ||
      item.value.toLowerCase().includes(gymInfoSearch.toLowerCase()) ||
      item.category.toLowerCase().includes(gymInfoSearch.toLowerCase()),
  )

  console.log("🔍 Filtered gym info data:", filteredGymInfoData) // DEBUG LOG
  console.log("🔍 Filtered data length:", filteredGymInfoData.length) // DEBUG LOG
  console.log("🔍 Search term:", gymInfoSearch) // DEBUG LOG

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Quản lý Chatbot
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Quản lý thông tin gym cho chatbot trả lời
        </Typography>
      </Box>

      {/* Gym Info Management */}
      <Paper sx={{ width: "100%", p: 3 }}>
        <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6">Gym Information</Typography>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <TextField
              size="small"
              placeholder="Tìm kiếm gym info..."
              value={gymInfoSearch}
              onChange={(e) => setGymInfoSearch(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: "action.active", mr: 1 }} />,
              }}
            />
            <Button onClick={loadGymInfoData} startIcon={<RefreshIcon />} variant="outlined">
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                console.log("➕ Opening add gym info dialog") // DEBUG LOG
                setSelectedGymInfo(null)
                setGymInfoDialog(true)
              }}
            >
              Thêm Gym Info
            </Button>
          </Box>
        </Box>

        {/* DEBUG INFO */}
        <Box sx={{ mb: 2, p: 1, bgcolor: "grey.100", borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Debug Info: Total Data: {gymInfoData.length} | Filtered: {filteredGymInfoData.length} | Loading:{" "}
            {loading.toString()}
          </Typography>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Key</TableCell>
                <TableCell>Value</TableCell>
                <TableCell>Danh mục</TableCell>
                <TableCell>Định dạng</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredGymInfoData.length === 0 && !loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">Không có dữ liệu</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredGymInfoData
                  .slice(gymInfoPage * gymInfoRowsPerPage, gymInfoPage * gymInfoRowsPerPage + gymInfoRowsPerPage)
                  .map((item, index) => {
                    console.log(`🏗️ Rendering row ${index}:`, item) // DEBUG LOG
                    return (
                      <TableRow key={item._id}>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {item.key}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ maxWidth: 400 }}>
                          <Typography variant="body2" noWrap>
                            {item.value}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={item.category} size="small" />
                        </TableCell>
                        <TableCell>
                          <Chip label={item.displayFormat} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={item.isActive ? "Active" : "Inactive"}
                            color={item.isActive ? "success" : "default"}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Sửa">
                            <IconButton onClick={() => handleGymInfoEdit(item)} size="small">
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Xóa">
                            <IconButton onClick={() => handleGymInfoDelete(item._id)} size="small" color="error">
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    )
                  })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredGymInfoData.length > 0 && (
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={filteredGymInfoData.length}
            rowsPerPage={gymInfoRowsPerPage}
            page={gymInfoPage}
            onPageChange={(e, newPage) => setGymInfoPage(newPage)}
            onRowsPerPageChange={(e) => {
              setGymInfoRowsPerPage(parseInt(e.target.value, 10))
              setGymInfoPage(0)
            }}
            labelRowsPerPage="Số dòng mỗi trang:"
          />
        )}
      </Paper>

      {/* Gym Info Form Dialog */}
      <GymInfoForm
        open={gymInfoDialog}
        onClose={() => {
          console.log("❌ Closing gym info dialog") // DEBUG LOG
          setGymInfoDialog(false)
          setSelectedGymInfo(null)
        }}
        gymInfo={selectedGymInfo}
        onSave={loadGymInfoData}
      />

      {loading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 9999,
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Container>
  )
}

export default AdminChatbotPage
