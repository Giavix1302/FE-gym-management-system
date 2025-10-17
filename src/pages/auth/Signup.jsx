import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  TextField,
  Typography,
  Link,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"

import { useNavigate } from "react-router-dom"
import { useState, Fragment } from "react"

// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
// import { DatePicker } from "@mui/x-date-pickers/DatePicker"

import OtpModal from "./OtpModal"
import { toast } from "react-toastify"
import { formatPhoneNumber, isValidPhone, removeFromLocalStorage, saveToLocalStorage } from "~/utils/common"
import { signupAPI, verifyOtpAPI } from "~/apis/auth"

//store
import useUserStore from "~/stores/useUserStore"

function Signup() {
  useUserStore.subscribe((state) => {
    console.log("Store changed:", state)
  })
  // store
  const { setUser, resetUser } = useUserStore()

  // state
  const [fullName, setFullName] = useState("")
  const [isFullNameError, setIsFullNameError] = useState(false)

  const [role, setRole] = useState("user")

  const [phone, setPhone] = useState("")
  const [isPhoneError, setIsPhoneError] = useState(false)

  const [password, setPassword] = useState("")
  const [isPasswordError, setIsPasswordError] = useState(false)

  const [confirmPassword, setConfirmPassword] = useState("")
  const [isConfirmPasswordError, setIsConfirmPasswordError] = useState(false)

  const handleSignup = async () => {
    // reset
    setIsFullNameError(false)
    setIsPhoneError(false)
    setIsPasswordError(false)
    setIsConfirmPasswordError(false)

    // check empty
    if (fullName === "") {
      toast.error("Vui lòng nhập họ và tên")
      setIsFullNameError(true)
      return
    }
    if (phone === "") {
      toast.error("Vui lòng nhập số điện thoại")
      setIsPhoneError(true)
      return
    }
    if (password === "") {
      toast.error("Vui lòng nhập mật khẩu")
      setIsPasswordError(true)
      return
    }
    if (confirmPassword === "") {
      toast.error("Vui lòng nhập lại mật khẩu")
      setIsConfirmPasswordError(true)
      return
    }
    // check value
    if (phone !== "" && !isValidPhone(phone)) {
      toast.error("Số điện thoại gồm 10 số và số 0 đầu tiên")
      setIsPhoneError(true)
      return
    }
    // check confirm password
    if (password !== confirmPassword) {
      toast.error("Nhập lại mật khẩu không khớp")
      setIsConfirmPasswordError(true)
      return
    }
    const formatPhone = formatPhoneNumber(phone)
    const dataToSend = {
      phone: formatPhone,
      password,
      fullName,
      role,
    }
    // call API
    const data = await signupAPI(dataToSend)
    if (data === undefined) return
    if (data.success) toast.success(data.message)
    // open modal OTP
    setOpenModalOTP(true)
  }

  // modal OTP
  const [openModalOTP, setOpenModalOTP] = useState(false)

  const handleVerify = async (otp) => {
    console.log("OTP nhập vào:", otp)
    // gọi API verify OTP ở đây
    const data = await verifyOtpAPI(phone, otp)
    console.log("🚀 ~ handleVerify ~ data:", data)
    if (data === undefined) {
      setOpenModalOTP(false)
      console.log("🚀 ~ handleVerify ~ data kkk:", data)

      return
    }
    if (data.success) {
      // thông báo thành công
      toast.success(data.message)
      // trả ra accesstoken và lưu refreshtoken vào cookie
      removeFromLocalStorage("accessToken")
      saveToLocalStorage("accessToken", data.accessToken)

      // điều hướng về trang chủ
      if (data.user.role === "user") {
        navigate("/user/home")
      } else {
        navigate("/pt/home")
      }
      // lưu dữu liệu về store
      resetUser()
      setUser(data.user)
      // tắt modal
      setOpenModalOTP(false)
    }
  }

  const navigate = useNavigate()

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 4, md: 3, lg: 5 },
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        zIndex: 999,
        bgcolor: "rgba(255, 255, 255, 0.9)",
      }}
    >
      <Box sx={{ mb: 1 }}>
        <Button onClick={() => navigate("/")} startIcon={<ArrowBackIcon />}>
          Quay lại
        </Button>
      </Box>
      {/* Header */}
      <Typography variant="h4" fontWeight="bold" color="primary" sx={{ fontSize: { xs: "1.75rem", sm: "2.125rem" } }}>
        Wellcome to THE GYM
      </Typography>
      <Typography variant="caption" color="text.secondary">
        <Typography variant="caption" color="primary.main" sx={{ fontWeight: "bold", fontSize: "1rem" }}>
          Đăng kí{" "}
        </Typography>
        để có những trải nghiệm tốt nhất!
      </Typography>

      <Box sx={{ width: "100%", mt: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ width: "70%" }}>
            <Typography variant="subtitle1" align="left" sx={{ fontWeight: "bold", color: "text.secondary" }}>
              Họ và tên
            </Typography>
            <TextField
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              error={isFullNameError}
              size="small"
              fullWidth
              placeholder="Nhập họ và tên"
              type="tel"
            />
          </Box>
          <Box sx={{ width: "40%" }}>
            <Typography variant="subtitle1" align="left" sx={{ fontWeight: "bold", color: "text.secondary" }}>
              Vai trò
            </Typography>
            <FormControl fullWidth>
              <Select
                sx={{ textAlign: "left" }}
                size="small"
                labelId="role-select-label"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <MenuItem value="user">Hội viên</MenuItem>
                <MenuItem value="pt">Huấn luyện viên</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Typography variant="subtitle1" align="left" sx={{ fontWeight: "bold", color: "text.secondary", mt: 1 }}>
          Số điện thoại
        </Typography>
        <TextField
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          error={isPhoneError}
          size="small"
          fullWidth
          placeholder="Nhập số điện thoại"
          type="tel"
        />

        {/* Mật khẩu */}
        <Typography variant="subtitle1" align="left" sx={{ fontWeight: "bold", color: "text.secondary", mt: 1 }}>
          Mật khẩu
        </Typography>
        <TextField
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={isPasswordError}
          size="small"
          fullWidth
          placeholder="Nhập mật khẩu"
          type="password"
        />

        {/* Nhap lai Mật khẩu */}
        <Typography variant="subtitle1" align="left" sx={{ fontWeight: "bold", color: "text.secondary", mt: 1 }}>
          Nhập lại mật khẩu
        </Typography>
        <TextField
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={isConfirmPasswordError}
          size="small"
          fullWidth
          placeholder="Nhập lại mật khẩu"
          type="password"
        />

        {/* Lưu mật khẩu */}
        <FormControlLabel
          control={<Checkbox color="primary" size="small" />}
          label="Lưu mật khẩu"
          sx={{ mt: 0, width: "100%", justifyContent: "flex-end", mr: 0 }}
        />
      </Box>

      {/* Nút đăng nhập */}
      <Button
        onClick={() => handleSignup()}
        fullWidth
        variant="contained"
        color="primary"
        sx={{ mt: 1, py: 1, borderRadius: 2 }}
      >
        Đăng kí
      </Button>

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mt: 2, width: "100%" }}>
        <Typography variant="body2" align="center" sx={{ color: "text.secondary" }}>
          Bạn đã có tài khoản?
        </Typography>
        <Button onClick={() => navigate("/login")} underline="hover" color="secondary">
          Đăng nhập
        </Button>
      </Box>
      <OtpModal open={openModalOTP} handleClose={() => setOpenModalOTP(false)} handleVerify={handleVerify} />
    </Box>
  )
}

export default Signup

// const [email, setEmail] = useState("")
// const [isEmailError, setIsEmailError] = useState(false)

// const [birthOfDate, setBirthOfDate] = useState({ day: "", month: "", year: "" })
// <Typography variant="subtitle1" align="left" sx={{ fontWeight: "bold", color: "text.secondary", mt: 1 }}>
//                 Ngày tháng năm sinh
//               </Typography>
//               <LocalizationProvider dateAdapter={AdapterDayjs}>
//                 <DatePicker
//                   slotProps={{
//                     textField: {
//                       size: "small",
//                       onKeyDown: (e) => e.preventDefault(),
//                     },
//                   }}
//                   onError={(error) => {
//                     toast.error(error)
//                   }}
//                   onChange={(values) => {
//                     return setBirthOfDate((prev) => ({
//                       ...prev,
//                       day: values?.$D || 0,
//                       month: values?.$M + 1 || 0,
//                       year: values?.$y || 0,
//                     }))
//                   }}
//                   sx={{
//                     p: 0,
//                     width: "100%",
//                     "& .MuiPickersSectionList-root": {
//                       py: 1,
//                     },
//                   }}
//                 />
//               </LocalizationProvider>

// const updateUserInfo = async () => {
//   // reset
//   setIsFullNameError(false)
//   setIsEmailError(false)

//   // check empty
//   if (fullName === "") {
//     toast.error("Vui lòng điền họ và tên")
//     setIsFullNameError(true)
//     return
//   }
//   if (email === "") {
//     toast.error("Vui lòng điền email")
//     setIsEmailError(true)
//     return
//   }
//   if (!isValidEmail(email)) {
//     toast.error("Vui lòng điền đúng định dạng email")
//     setIsEmailError(true)
//     return
//   }
//   if (birthOfDate.day === "" || birthOfDate.month === "" || birthOfDate.year === "") {
//     toast.error("Vui lòng chọn ngày tháng năm sinh")
//     return
//   }
//   if (!isOver12(birthOfDate)) {
//     toast.error("Bạn phải trên 12 tuổi mới được đăng ký.")
//     return
//   }

//   const data = {
//     fullName,
//     email,
//     dateOfBirth: convertToISODateTime({ day: birthOfDate.day, month: birthOfDate.month, year: birthOfDate.year }),
//     role,
//   }
//   // call api
//   updateInfoUserAPI(user._id, data)
//   // chuyển hướng về trang chủ theo role

//   // handleNext("Finish")
// }
