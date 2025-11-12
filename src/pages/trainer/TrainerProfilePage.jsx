import React, { useState, useCallback, useMemo } from "react"
import PropTypes from "prop-types"
import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  TextField,
  Button,
  Grid,
  IconButton,
  Chip,
  Alert,
  Card,
  CardContent,
  Stack,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useMediaQuery,
  useTheme,
  Tabs,
  Tab,
  Badge,
  InputAdornment,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Modal,
} from "@mui/material"
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PhotoCamera as PhotoCameraIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  FitnessCenter as FitnessIcon,
  Send as SendIcon,
  CheckCircle as CheckIcon,
  Pending as PendingIcon,
  Info as InfoIcon,
  CalendarMonth as CalendarIcon,
  Badge as BadgeIcon,
  Groups as GroupsIcon,
  Star as StarIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material"
import AddIcon from "@mui/icons-material/Add"
import CloseIcon from "@mui/icons-material/Close"
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"
// Import stores
import useTrainerInfoStore from "~/stores/useTrainerInfoStore"
import useUserStore from "~/stores/useUserStore"
import { buildFormData, convertISOToVNTime, formatToLeadingZero, splitUserTrainerData, toISODate } from "~/utils/common"
import { updateInfoTrainerByUserIdAPI } from "~/apis/trainer"
import { updateInfoUserAPI } from "~/apis/user"
import MyBackdrop from "~/components/MyBackdrop"

// CustomTabPanel theo cách chính thức của MUI
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  }
}

// Helper function to format price display (add commas)
const formatPriceDisplay = (price) => {
  if (!price) return ""
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

// Helper function to parse price input (remove commas)
const parsePriceInput = (input) => {
  if (!input) return ""
  return input.replace(/,/g, "")
}

// Component chính
export default function TrainerProfilePage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  // backdrop
  const [openBackdrop, setOpenBackdrop] = useState(false)
  const handleCloseBackdrop = () => setOpenBackdrop(false)

  // States - bỏ bớt schedule-related states
  const [isEditing, setIsEditing] = useState(false)
  const [tabValue, setTabValue] = useState(0)
  const [editData, setEditData] = useState({})
  const [errors, setErrors] = useState({})
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("success")
  const [openSubmitDialog, setOpenSubmitDialog] = useState(false)
  const [openImageDialog, setOpenImageDialog] = useState(false)
  const [selectedImage, setSelectedImage] = useState("")
  const [newPhysiqueImages, setNewPhysiqueImages] = useState([])

  // Stores
  const { user, updateUser } = useUserStore()
  const { trainerInfo, updateTrainerInfo } = useTrainerInfoStore()

  // Dữ liệu PT - bỏ các field schedule-related
  const ptData = useMemo(
    () => ({
      id: trainerInfo._id || "",
      fullName: user.fullName || "Chưa có tên",
      email: user.email || "",
      phone: formatToLeadingZero(user.phone) || "",
      avatar: user.avatar || "",
      gender: user.gender || "",
      dateOfBirth: user.dateOfBirth ? convertISOToVNTime(user.dateOfBirth) : "",
      address: user.address || "",
      status: trainerInfo.isApproved || "",
      pricePerHour: trainerInfo.pricePerHour || 0,

      // Thông tin chuyên môn
      specialization: trainerInfo.specialization || "",
      experience: trainerInfo.experience || "",
      education: trainerInfo.education || "",

      // Hình ảnh cơ thể
      physiqueImages: [...(trainerInfo.physiqueImages || [])],

      // Giới thiệu bản thân
      bio: trainerInfo.bio || "",
    }),
    [user, trainerInfo],
  )

  // Stable functions
  const getCurrentValue = useCallback(
    (field) => {
      if (!isEditing) {
        // Special handling for price display
        if (field === "pricePerHour") {
          return formatPriceDisplay(ptData[field] || "")
        }
        return ptData[field] || ""
      }

      // In editing mode
      if (field === "pricePerHour") {
        const value = editData[field] !== undefined ? editData[field] : ptData[field] || ""
        return formatPriceDisplay(value)
      }

      return editData[field] !== undefined ? editData[field] : ptData[field] || ""
    },
    [isEditing, editData, ptData],
  )

  // Handlers
  const handleFieldChange = (field, value) => {
    console.log(`🔄 handleFieldChange - Field: ${field}, Raw Value: "${value}"`)

    // Special handling for pricePerHour
    if (field === "pricePerHour") {
      // Remove commas and non-digit characters except for existing digits
      const cleanValue = value.replace(/,/g, "").replace(/\D/g, "")
      console.log(`💰 Price field - Clean Value: "${cleanValue}"`)

      setEditData((prev) => {
        const newData = {
          ...prev,
          [field]: cleanValue,
        }
        console.log(`📊 Updated editData.pricePerHour:`, cleanValue)
        return newData
      })
    } else {
      setEditData((prev) => ({
        ...prev,
        [field]: value,
      }))
    }

    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  // Image handlers
  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl)
    setOpenImageDialog(true)
  }

  const handleDeleteImage = (imageIndex, isNewImage = false) => {
    if (isNewImage) {
      // Tính toán index của ảnh mới trong mảng newPhysiqueImages
      const oldImagesCount =
        editData.physiqueImages?.filter((img) => typeof img === "string" && !img.startsWith("blob:")).length || 0
      const newImageIndexInArray = imageIndex - oldImagesCount

      // Xóa file khỏi newPhysiqueImages
      const updatedNewImages = newPhysiqueImages.filter((_, index) => index !== newImageIndexInArray)
      setNewPhysiqueImages(updatedNewImages)

      // Revoke URL để tránh memory leak
      const currentImages = editData.physiqueImages || ptData.physiqueImages
      const imageToRevoke = currentImages[imageIndex]
      if (imageToRevoke && imageToRevoke.startsWith("blob:")) {
        URL.revokeObjectURL(imageToRevoke)
      }

      // Xóa khỏi editData.physiqueImages
      const updatedPhysiqueImages = currentImages.filter((_, index) => index !== imageIndex)
      setEditData((prev) => ({
        ...prev,
        physiqueImages: updatedPhysiqueImages,
      }))
    } else {
      // Xóa ảnh cũ
      const currentImages = editData.physiqueImages || ptData.physiqueImages
      const newImages = currentImages.filter((_, index) => index !== imageIndex)
      setEditData((prev) => ({
        ...prev,
        physiqueImages: newImages,
      }))
    }
    showSnackbar("Đã xóa hình ảnh!", "success")
  }

  const handleAddImagesFromDevice = (event) => {
    const files = Array.from(event.target.files)
    const currentImages = editData.physiqueImages || ptData.physiqueImages || []

    const currentTotalImages = currentImages.length
    const maxNewImages = 6 - currentTotalImages

    if (maxNewImages <= 0) {
      showSnackbar("Đã đạt giới hạn tối đa 6 hình ảnh!", "warning")
      return
    }

    const filesToAdd = files.slice(0, maxNewImages)

    if (files.length > maxNewImages) {
      showSnackbar(
        `Chỉ có thể thêm ${maxNewImages} hình ảnh nữa. Đã thêm ${filesToAdd.length} hình đầu tiên.`,
        "warning",
      )
    }

    // Tạo preview URLs và thêm vào editData
    const newPreviewUrls = filesToAdd.map((file) => URL.createObjectURL(file))

    setEditData((prev) => ({
      ...prev,
      physiqueImages: [...currentImages, ...newPreviewUrls],
    }))

    // Lưu files mới vào state riêng
    setNewPhysiqueImages([...newPhysiqueImages, ...filesToAdd])

    showSnackbar(`Đã thêm ${filesToAdd.length} hình ảnh mới!`, "success")

    // Reset input
    event.target.value = ""
  }

  const handleAddImage = () => {
    // Mở file picker
    document.getElementById("physique-image-upload")?.click()
  }

  // Validation
  const validateForm = () => {
    console.log("🔍 validateForm - Current editData:", editData)

    const newErrors = {}
    const currentName = editData.fullName !== undefined ? editData.fullName : ptData.fullName
    const currentEmail = editData.email !== undefined ? editData.email : ptData.email
    const currentPhone = editData.phone !== undefined ? editData.phone : ptData.phone
    const currentAddress = editData.address !== undefined ? editData.address : ptData.address
    const currentGender = editData.gender !== undefined ? editData.gender : ptData.gender
    const currentDateOfBirth = editData.dateOfBirth !== undefined ? editData.dateOfBirth : ptData.dateOfBirth
    const currentExperience = editData.experience !== undefined ? editData.experience : ptData.experience
    const currentEducation = editData.education !== undefined ? editData.education : ptData.education
    const currentPricePerHour = editData.pricePerHour !== undefined ? editData.pricePerHour : ptData.pricePerHour

    console.log(`💰 validateForm - currentPricePerHour: "${currentPricePerHour}" (type: ${typeof currentPricePerHour})`)

    if (!currentName || currentName === "") newErrors.fullName = "Vui lòng nhập họ tên"
    if (!currentEmail) newErrors.email = "Vui lòng nhập email"
    else if (!/\S+@\S+\.\S+/.test(currentEmail)) newErrors.email = "Email không hợp lệ"
    if (!currentPhone) newErrors.phone = "Vui lòng nhập số điện thoại"
    else if (!/^[0-9]{10}$/.test(currentPhone)) newErrors.phone = "Số điện thoại không hợp lệ"
    if (!currentAddress) newErrors.address = "Vui lòng nhập địa chỉ"
    if (!currentGender) newErrors.gender = "Vui lòng chọn giới tính"
    if (!currentDateOfBirth) newErrors.dateOfBirth = "Vui lòng nhập ngày sinh"
    if (!currentExperience) newErrors.experience = "Vui lòng nhập kinh nghiệm"
    if (!currentEducation) newErrors.education = "Vui lòng nhập học vấn"

    // Price validation - improved
    if (!currentPricePerHour || currentPricePerHour === "" || currentPricePerHour === "0") {
      newErrors.pricePerHour = "Vui lòng nhập giá tiền mỗi giờ"
    } else {
      const priceNumber = parseInt(currentPricePerHour)
      console.log(`💰 validateForm - priceNumber: ${priceNumber}`)

      if (isNaN(priceNumber) || priceNumber <= 0) {
        newErrors.pricePerHour = "Giá tiền phải là số dương"
      } else if (priceNumber < 50000) {
        newErrors.pricePerHour = "Giá tiền tối thiểu là 50,000 VNĐ"
      } else if (priceNumber > 5000000) {
        newErrors.pricePerHour = "Giá tiền tối đa là 5,000,000 VNĐ"
      }
    }

    console.log("❌ Validation errors:", newErrors)
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleEdit = () => {
    setIsEditing(true)
    setErrors({})
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditData({})
    setErrors({})
    // Reset new images và revoke URLs để tránh memory leak
    editData.physiqueImages &&
      editData.physiqueImages.forEach((img) => {
        if (typeof img === "string" && img.startsWith("blob:")) {
          URL.revokeObjectURL(img)
        }
      })
    setNewPhysiqueImages([])
  }

  // Hàm helper để lọc bỏ blob URLs (ảnh mới)
  function removeBlobUrls(arr) {
    return arr.filter((item) => !item.startsWith("blob:"))
  }

  const handleSave = async () => {
    console.log("💾 handleSave - Starting save process...")
    console.log("📊 Current editData before validation:", editData)

    if (!validateForm()) {
      showSnackbar("Vui lòng kiểm tra lại thông tin!", "error")
      return
    }

    setIsEditing(false)
    setOpenBackdrop(true)

    try {
      console.log("🔄 Splitting user and trainer data...")
      const { userData, trainerData } = splitUserTrainerData(editData)

      console.log("👤 userData to update:", userData)
      console.log("🏋️ trainerData to update:", trainerData)

      // Special logging for pricePerHour
      if (trainerData.pricePerHour !== undefined) {
        console.log(
          `💰 PRICE DEBUG - trainerData.pricePerHour: "${trainerData.pricePerHour}" (type: ${typeof trainerData.pricePerHour})`,
        )
      }

      // Cập nhật user info (nếu cần)
      if (Object.keys(userData).length > 0) {
        let dataUserToUpdate = {}
        if ("dateOfBirth" in userData) {
          dataUserToUpdate = {
            ...userData,
            dateOfBirth: toISODate(userData.dateOfBirth),
          }
        } else {
          dataUserToUpdate = userData
        }

        console.log("📤 Sending user data to API:", dataUserToUpdate)
        const updatedUser = await updateInfoUserAPI(user._id, dataUserToUpdate)
        updateUser(updatedUser.user)
        console.log("✅ User update successful")
      }

      // Chuẩn bị FormData cho trainer info
      if (Object.keys(trainerData).length > 0 || newPhysiqueImages.length > 0 || "physiqueImages" in editData) {
        let formData = buildFormData(trainerData)

        console.log("🖼️ Processing physique images...")
        // Xử lý physiqueImages
        if ("physiqueImages" in editData) {
          console.log("User có thay đổi về hình ảnh")
          const physiqueImagesToKeep = removeBlobUrls(editData.physiqueImages)
          physiqueImagesToKeep.forEach((imageUrl) => {
            formData.append("physiqueImages", imageUrl)
          })
        } else {
          console.log("User không thay đổi hình ảnh - gửi tất cả ảnh hiện tại để giữ nguyên")
          const currentImages = ptData.physiqueImages || []
          currentImages.forEach((imageUrl) => {
            formData.append("physiqueImages", imageUrl)
          })
        }

        // Gửi các file ảnh mới (nếu có)
        if (newPhysiqueImages.length > 0) {
          console.log("📤 Adding new physique images:", newPhysiqueImages)
          newPhysiqueImages.forEach((file) => {
            formData.append("physiqueImagesNew", file)
          })
        }

        // Debug FormData content
        console.log("=== 📋 FormData Content Debug ===")
        for (let [key, value] of formData.entries()) {
          if (key === "physiqueImagesNew") {
            console.log(`${key}: [File] ${value.name} (${value.size} bytes)`)
          } else if (key === "pricePerHour") {
            console.log(`💰 ${key}: "${value}" (type: ${typeof value})`)
          } else {
            console.log(`${key}: "${value}"`)
          }
        }

        console.log("📤 Sending trainer data to API...")
        // Gửi request lên BE
        const updatedTrainerInfo = await updateInfoTrainerByUserIdAPI(user._id, formData)

        console.log("✅ Trainer update response:", updatedTrainerInfo)
        // Cập nhật store
        updateTrainerInfo(updatedTrainerInfo.trainer)
      }

      // Reset các state liên quan
      setNewPhysiqueImages([])
      setEditData({}) // Clear edit data sau khi save thành công

      showSnackbar("Cập nhật thông tin thành công!", "success")
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật thông tin:", error)
      showSnackbar("Có lỗi xảy ra khi cập nhật thông tin!", "error")
    } finally {
      handleCloseBackdrop()
    }
  }

  const handleSubmitForApproval = () => {
    if (!validateForm()) {
      showSnackbar("Vui lòng hoàn thiện thông tin trước khi gửi!", "error")
      return
    }
    setOpenSubmitDialog(false)
    showSnackbar("Đã gửi yêu cầu phê duyệt cho Admin!", "success")
  }

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message)
    setSnackbarSeverity(severity)
    setOpenSnackbar(true)
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 3,
          background: `linear-gradient(135deg, #16697A 0%, #489FB5 100%)`,
          color: "white",
          borderRadius: 2,
        }}
      >
        <Stack direction={isMobile ? "column" : "row"} spacing={3} alignItems={isMobile ? "center" : "flex-start"}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            badgeContent={
              <IconButton
                size="small"
                sx={{
                  bgcolor: "white",
                  "&:hover": { bgcolor: "grey.100" },
                }}
                disabled={!isEditing}
              >
                <PhotoCameraIcon fontSize="small" color="primary" />
              </IconButton>
            }
          >
            <Avatar
              sx={{
                width: 120,
                height: 120,
                border: "4px solid white",
                bgcolor: "#FFA62B",
              }}
            >
              {ptData.fullName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </Avatar>
          </Badge>

          <Box flex={1} textAlign={isMobile ? "center" : "left"}>
            <Stack direction="row" spacing={2} alignItems="center" justifyContent={isMobile ? "center" : "flex-start"}>
              <Typography variant="h4" fontWeight="bold">
                {ptData.fullName}
              </Typography>
              <Chip
                label={
                  ptData.status === "approved" ? "Đã duyệt" : ptData.status === "pending" ? "Chờ duyệt" : "Chưa gửi"
                }
                color={ptData.status === "approved" ? "success" : ptData.status === "pending" ? "warning" : "default"}
                icon={
                  ptData.status === "approved" ? (
                    <CheckIcon />
                  ) : ptData.status === "pending" ? (
                    <PendingIcon />
                  ) : (
                    <InfoIcon />
                  )
                }
                size="small"
                sx={{ fontWeight: "bold" }}
              />
            </Stack>

            <Typography variant="h6" sx={{ mt: 1, opacity: 0.9 }}>
              Personal Trainer
            </Typography>

            <Stack direction="row" spacing={2} sx={{ mt: 2 }} justifyContent={isMobile ? "center" : "flex-start"}>
              <Chip icon={<StarIcon />} label="5 / 5" sx={{ bgcolor: "white", color: "primary.main" }} />
              <Chip icon={<GroupsIcon />} label="10 / 15 khách" sx={{ bgcolor: "white", color: "primary.main" }} />
            </Stack>
          </Box>

          {!isMobile && (
            <Stack direction="row" spacing={2}>
              {!isEditing ? (
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={handleEdit}
                  sx={{
                    bgcolor: "white",
                    color: "primary.main",
                    "&:hover": { bgcolor: "grey.100" },
                  }}
                >
                  Chỉnh sửa
                </Button>
              ) : (
                <>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    sx={{
                      bgcolor: "#FFA62B",
                      "&:hover": { bgcolor: "#FF9500" },
                    }}
                  >
                    Lưu
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={handleCancel}
                    sx={{
                      color: "white",
                      borderColor: "white",
                      "&:hover": {
                        borderColor: "white",
                        bgcolor: "rgba(255,255,255,0.1)",
                      },
                    }}
                  >
                    Hủy
                  </Button>
                </>
              )}
            </Stack>
          )}
        </Stack>

        {isMobile && (
          <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: "center" }}>
            {!isEditing ? (
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={handleEdit}
                sx={{
                  bgcolor: "white",
                  color: "primary.main",
                  "&:hover": { bgcolor: "grey.100" },
                }}
              >
                Chỉnh sửa
              </Button>
            ) : (
              <>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  sx={{
                    bgcolor: "#FFA62B",
                    "&:hover": { bgcolor: "#FF9500" },
                  }}
                >
                  Lưu
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={handleCancel}
                  sx={{
                    color: "white",
                    borderColor: "white",
                  }}
                >
                  Hủy
                </Button>
              </>
            )}
          </Stack>
        )}
      </Paper>

      {/* Alert for pending status */}
      {ptData.status === "pending" && (
        <Alert severity="info" sx={{ mb: 3 }} icon={<PendingIcon />}>
          Hồ sơ của bạn đang được Admin xem xét. Thời gian duyệt thường trong vòng 24-48 giờ.
        </Alert>
      )}

      {/* Main Content - CHỈ CÒN 2 TABS */}
      <Paper elevation={1} sx={{ borderRadius: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={(event, newValue) => setTabValue(newValue)} aria-label="profile tabs">
            <Tab label="Thông tin cá nhân" icon={<PersonIcon />} iconPosition="start" {...a11yProps(0)} />
            <Tab label="Chuyên môn" icon={<SchoolIcon />} iconPosition="start" {...a11yProps(1)} />
          </Tabs>
        </Box>

        {/* Tab 1: Thông tin cá nhân */}
        <CustomTabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Họ và tên"
                value={getCurrentValue("fullName")}
                onChange={(e) => handleFieldChange("fullName", e.target.value)}
                disabled={!isEditing}
                error={!!errors.fullName}
                helperText={errors.fullName}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Email"
                value={getCurrentValue("email")}
                onChange={(e) => handleFieldChange("email", e.target.value)}
                disabled={!isEditing}
                error={!!errors.email}
                helperText={errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Số điện thoại"
                value={getCurrentValue("phone")}
                onChange={(e) => handleFieldChange("phone", e.target.value)}
                disabled={!isEditing}
                error={!!errors.phone}
                helperText={errors.phone}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth disabled={!isEditing} error={!!errors.gender}>
                <InputLabel>Giới tính</InputLabel>
                <Select
                  value={getCurrentValue("gender")}
                  onChange={(e) => handleFieldChange("gender", e.target.value)}
                  label="Giới tính"
                >
                  <MenuItem value="male">Nam</MenuItem>
                  <MenuItem value="female">Nữ</MenuItem>
                  <MenuItem value="other">Khác</MenuItem>
                </Select>
                {errors.gender && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                    {errors.gender}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Ngày sinh"
                placeholder="dd/mm/yyyy"
                value={getCurrentValue("dateOfBirth")}
                onChange={(e) => handleFieldChange("dateOfBirth", e.target.value)}
                disabled={!isEditing}
                error={!!errors.dateOfBirth}
                helperText={errors.dateOfBirth}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Mã PT"
                value={ptData.id}
                disabled
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* FIXED PRICE FIELD */}
            <Grid item size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Giá mỗi giờ (VNĐ)"
                value={getCurrentValue("pricePerHour")}
                onChange={(e) => handleFieldChange("pricePerHour", e.target.value)}
                disabled={!isEditing}
                error={!!errors.pricePerHour}
                helperText={errors.pricePerHour || "Nhập số tiền, ví dụ: 50000"}
                placeholder="Ví dụ: 50000"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoneyIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Địa chỉ"
                value={getCurrentValue("address")}
                onChange={(e) => handleFieldChange("address", e.target.value)}
                disabled={!isEditing}
                error={!!errors.address}
                helperText={errors.address}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Giới thiệu bản thân"
                value={getCurrentValue("bio")}
                onChange={(e) => handleFieldChange("bio", e.target.value)}
                disabled={!isEditing}
                multiline
                rows={4}
              />
            </Grid>
          </Grid>
        </CustomTabPanel>

        {/* Tab 2: Chuyên môn */}
        <CustomTabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Kinh nghiệm"
                value={getCurrentValue("experience")}
                onChange={(e) => handleFieldChange("experience", e.target.value)}
                disabled={!isEditing}
                error={!!errors.experience}
                helperText={errors.experience}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <WorkIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Học vấn"
                value={getCurrentValue("education")}
                onChange={(e) => handleFieldChange("education", e.target.value)}
                disabled={!isEditing}
                error={!!errors.education}
                helperText={errors.education}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SchoolIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item size={{ xs: 12 }}>
              <FormControl fullWidth disabled={!isEditing}>
                <InputLabel>Chuyên môn</InputLabel>
                <Select
                  value={getCurrentValue("specialization")}
                  onChange={(e) => handleFieldChange("specialization", e.target.value)}
                  label="Chuyên môn"
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      <Chip key={selected} label={selected} size="small" />
                    </Box>
                  )}
                >
                  <MenuItem value="yoga">Yoga</MenuItem>
                  <MenuItem value="gym">Gym</MenuItem>
                  <MenuItem value="dance">Dance</MenuItem>
                  <MenuItem value="boxing">Boxing</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Physique Images Gallery */}
            <Grid item size={{ xs: 12 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <FitnessIcon color="primary" />
                  Hình ảnh cơ thể (
                  {(isEditing ? editData.physiqueImages || ptData.physiqueImages : ptData.physiqueImages).length}/6)
                </Typography>
                {isEditing &&
                  (isEditing ? editData.physiqueImages || ptData.physiqueImages : ptData.physiqueImages).length < 6 && (
                    <>
                      <Button variant="outlined" size="small" startIcon={<AddIcon />} onClick={handleAddImage}>
                        Thêm ảnh
                      </Button>
                      <input
                        id="physique-image-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleAddImagesFromDevice}
                      />
                    </>
                  )}
              </Stack>

              <ImageList
                cols={isMobile ? 3 : 6}
                gap={8}
                sx={{
                  maxHeight: 400,
                  overflow: "hidden",
                }}
              >
                {(isEditing ? editData.physiqueImages || ptData.physiqueImages : ptData.physiqueImages).map(
                  (image, index) => {
                    // Kiểm tra xem đây có phải ảnh mới (blob URL) không
                    const isNewImage = typeof image === "string" && image.startsWith("blob:")

                    return (
                      <ImageListItem key={`${index}-${image}`} sx={{ position: "relative" }}>
                        <img
                          src={isNewImage ? image : `${image}?w=300&h=300&fit=crop`}
                          alt={`Physique ${index + 1}`}
                          loading="lazy"
                          style={{
                            cursor: "pointer",
                            aspectRatio: "1/1",
                            objectFit: "cover",
                          }}
                          onClick={() => handleImageClick(image)}
                        />

                        {/* Badge cho ảnh mới */}
                        {isNewImage && (
                          <Box
                            sx={{
                              position: "absolute",
                              top: 8,
                              left: 8,
                              bgcolor: "#FFA62B",
                              color: "white",
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              fontSize: "0.75rem",
                              fontWeight: "bold",
                            }}
                          >
                            Mới
                          </Box>
                        )}

                        <ImageListItemBar
                          sx={{
                            background:
                              "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
                          }}
                          position="top"
                          actionIcon={
                            <Stack direction="row" spacing={1}>
                              <IconButton
                                sx={{ color: "white" }}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleImageClick(image)
                                }}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                              {isEditing && (
                                <IconButton
                                  sx={{ color: "white" }}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDeleteImage(index, isNewImage)
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              )}
                            </Stack>
                          }
                          actionPosition="right"
                        />
                      </ImageListItem>
                    )
                  },
                )}
              </ImageList>

              {(isEditing ? editData.physiqueImages || ptData.physiqueImages : ptData.physiqueImages).length === 0 && (
                <Box
                  sx={{
                    border: "2px dashed",
                    borderColor: "grey.300",
                    borderRadius: 2,
                    p: 4,
                    textAlign: "center",
                    color: "grey.500",
                  }}
                >
                  <FitnessIcon sx={{ fontSize: 48, mb: 2 }} />
                  <Typography variant="body1">
                    {isEditing ? "Nhấn 'Thêm ảnh' để thêm hình ảnh cơ thể" : "Chưa có hình ảnh cơ thể"}
                  </Typography>
                </Box>
              )}

              {/* Hiển thị thông tin về giới hạn */}
              {isEditing && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    * Tối đa 6 hình ảnh. Hỗ trợ định dạng: JPG, PNG, GIF
                  </Typography>
                  {newPhysiqueImages.length > 0 && (
                    <Typography variant="caption" color="primary" sx={{ display: "block", mt: 0.5 }}>
                      Có {newPhysiqueImages.length} hình ảnh mới sẽ được tải lên khi lưu
                    </Typography>
                  )}
                </Box>
              )}
            </Grid>
          </Grid>
        </CustomTabPanel>
      </Paper>

      {/* Image Preview Dialog */}
      <Modal
        open={openImageDialog}
        onClose={() => setOpenImageDialog(false)}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box
          sx={{
            outline: "none",
            bgcolor: "background.paper",
            borderRadius: 2,
            p: 2,
            maxWidth: "90vw",
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
          }}
        >
          <Box
            component="img"
            src={selectedImage}
            alt="Preview"
            style={{
              maxWidth: "100%",
              maxHeight: "80vh",
              objectFit: "contain",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              right: 16,
              top: 16,
              cursor: "pointer",
              bgcolor: "rgba(0,0,0,0.5)",
              borderRadius: "50%",
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => setOpenImageDialog(false)}
          >
            <CloseIcon sx={{ color: "white" }} />
          </Box>
        </Box>
      </Modal>

      {/* Submit for Approval Button */}
      {ptData.status !== "approved" && (
        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<SendIcon />}
            onClick={() => setOpenSubmitDialog(true)}
            disabled={ptData.status === "pending"}
            sx={{
              bgcolor: "#FFA62B",
              "&:hover": { bgcolor: "#FF9500" },
              px: 4,
              py: 1.5,
            }}
          >
            {ptData.status === "pending" ? "Đang chờ Admin duyệt..." : "Gửi yêu cầu trở thành PT chính thức"}
          </Button>
        </Box>
      )}

      {/* Submit Dialog */}
      <Dialog open={openSubmitDialog} onClose={() => setOpenSubmitDialog(false)}>
        <DialogTitle>Xác nhận gửi hồ sơ</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn gửi hồ sơ để Admin phê duyệt? Hãy đảm bảo rằng tất cả thông tin đã được điền đầy đủ và
            chính xác.
          </Typography>

          <Alert severity="info" sx={{ mt: 2 }}>
            Admin sẽ xem xét hồ sơ trong vòng 24-48 giờ làm việc.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSubmitDialog(false)}>Hủy</Button>
          <Button
            onClick={handleSubmitForApproval}
            variant="contained"
            sx={{ bgcolor: "#FFA62B", "&:hover": { bgcolor: "#FF9500" } }}
          >
            Gửi hồ sơ
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <MyBackdrop open={openBackdrop} handleClose={handleCloseBackdrop} />
    </Container>
  )
}
