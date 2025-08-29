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
import Stepper from "@mui/material/Stepper"
import Step from "@mui/material/Step"
import StepLabel from "@mui/material/StepLabel"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"

import { useNavigate } from "react-router-dom"
import { useState, Fragment } from "react"

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"

import OtpModal from "./OtpModal"
import { toast } from "react-toastify"
import { convertToISODateTime, formatPhoneNumber, isOver12, isValidEmail, isValidPhone } from "~/utils"
import { signupAPI, verifyOtpAPI } from "~/apis/authAPI"
import { updateInfoUserAPI } from "~/apis/userAPI"

//store
import useUserStore from "~/stores/useUserStore"

const steps = ["Xác thực tài khoản", "Bổ sung thông tin"]

function Signup() {
  useUserStore.subscribe((state) => {
    console.log("Store changed:", state)
  })
  // store
  const { user, updateUser } = useUserStore()

  // state
  const [phone, setPhone] = useState("")
  const [isPhoneError, setIsPhoneError] = useState(false)

  const [password, setPassword] = useState("")
  const [isPasswordError, setIsPasswordError] = useState(false)

  const [confirmPassword, setConfirmPassword] = useState("")
  const [isConfirmPasswordError, setIsConfirmPasswordError] = useState(false)

  const [fullName, setFullName] = useState("")
  const [isFullNameError, setIsFullNameError] = useState(false)

  const [email, setEmail] = useState("")
  const [isEmailError, setIsEmailError] = useState(false)

  const [birthOfDate, setBirthOfDate] = useState({ day: "", month: "", year: "" })
  console.log("🚀 ~ Signup ~ birthOfDate:", birthOfDate)
  const [role, setRole] = useState("user")

  const handleSignup = async () => {
    // reset
    setIsPhoneError(false)
    setIsPasswordError(false)
    setIsConfirmPasswordError(false)

    // check empty
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
    // call API
    const data = await signupAPI(formatPhone, password)
    if (data === undefined) return
    if (data.success) toast.success(data.message)
    // open modal OTP
    setOpenModalOTP(true)
  }

  const updateUserInfo = async () => {
    // reset
    setIsFullNameError(false)
    setIsEmailError(false)

    // check empty
    if (fullName === "") {
      toast.error("Vui lòng điền họ và tên")
      setIsFullNameError(true)
      return
    }
    if (email === "") {
      toast.error("Vui lòng điền email")
      setIsEmailError(true)
      return
    }
    if (!isValidEmail(email)) {
      toast.error("Vui lòng điền đúng định dạng email")
      setIsEmailError(true)
      return
    }
    if (birthOfDate.day === "" || birthOfDate.month === "" || birthOfDate.year === "") {
      toast.error("Vui lòng chọn ngày tháng năm sinh")
      return
    }
    if (!isOver12(birthOfDate)) {
      toast.error("Bạn phải trên 12 tuổi mới được đăng ký.")
      return
    }

    const data = {
      fullName,
      email,
      dateOfBirth: convertToISODateTime({ day: birthOfDate.day, month: birthOfDate.month, year: birthOfDate.year }),
      role,
    }
    // call api
    updateInfoUserAPI(user._id, data)
    // chuyển hướng về trang chủ theo role

    // handleNext("Finish")
  }

  // modal OTP
  const [openModalOTP, setOpenModalOTP] = useState(false)
  const handleVerify = async (otp) => {
    console.log("OTP nhập vào:", otp)
    // gọi API verify OTP ở đây
    const data = await verifyOtpAPI(phone, otp)
    if (data === undefined) {
      setOpenModalOTP(false)
      return
    }
    if (data.success) {
      toast.success(data.message)
      updateUser({ ...data.user })
      setOpenModalOTP(false)
      handleNext("Next")
    }
  }

  const navigate = useNavigate()

  // set up HorizontalLinearStepper
  const [activeStep, setActiveStep] = useState(0)
  const [skipped, setSkipped] = useState(new Set())

  const isStepOptional = (step) => {
    return step === 1
  }

  const isStepSkipped = (step) => {
    return skipped.has(step)
  }

  const handleNext = (state) => {
    if (state === "Finish") {
      console.log("🚀 ~ handleNext ~ Finish:")
    }

    if (state === "Next") {
      console.log("🚀 ~ handleNext ~ Next:")
    }

    let newSkipped = skipped
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values())
      newSkipped.delete(activeStep)
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1)
    setSkipped(newSkipped)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleReset = () => {
    setActiveStep(0)
  }

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

      <Stepper sx={{ width: "100%", mt: 3, mb: 0.5 }} activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {}
          const labelProps = {}
          if (isStepOptional(index)) {
            labelProps.optional = false
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false
          }
          return (
            <Step sx={{ p: 0 }} key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          )
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <Fragment>
          {/* finally */}
          <Typography sx={{ mt: 2, mb: 1 }}>All steps completed - you&apos;re finished</Typography>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </Fragment>
      ) : (
        <Fragment>
          {activeStep + 1 === 1 && (
            <Box sx={{ width: "100%", mt: 2 }}>
              {/* <Typography align="left" sx={{ mt: 2, mb: 1 }}>
                Bước 1: Xác thưc tài khoản
              </Typography> */}

              <Typography variant="subtitle1" align="left" sx={{ fontWeight: "bold", color: "text.secondary" }}>
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
              <Typography variant="subtitle1" align="left" sx={{ fontWeight: "bold", color: "text.secondary", mt: 2 }}>
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
              <Typography variant="subtitle1" align="left" sx={{ fontWeight: "bold", color: "text.secondary", mt: 2 }}>
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
          )}

          {activeStep + 1 === 2 && (
            // bổ sung thông tin
            <Box sx={{ width: "100%", my: 2 }}>
              <Typography variant="subtitle1" align="left" sx={{ fontWeight: "bold", color: "text.secondary" }}>
                Họ và tên
              </Typography>
              <TextField
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                error={isFullNameError}
                size="small"
                fullWidth
                placeholder="Nhập số điện thoại"
                type="tel"
              />

              {/* Email */}
              <Typography variant="subtitle1" align="left" sx={{ fontWeight: "bold", color: "text.secondary", mt: 1 }}>
                Email
              </Typography>
              <TextField
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={isEmailError}
                size="small"
                fullWidth
                placeholder="Nhập mật khẩu"
                type="email"
              />

              {/* Mật khẩu */}
              <Typography variant="subtitle1" align="left" sx={{ fontWeight: "bold", color: "text.secondary", mt: 1 }}>
                Ngày tháng năm sinh
              </Typography>
              {/* <TextField size="small" fullWidth placeholder="Nhập lại mật khẩu" type="password" /> */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  slotProps={{
                    textField: {
                      size: "small",
                      onKeyDown: (e) => e.preventDefault(), // 🚫 chặn nhập bàn phím
                    },
                  }}
                  onError={(error) => {
                    toast.error(error)
                  }}
                  onChange={(values) => {
                    return setBirthOfDate((prev) => ({
                      ...prev,
                      day: values?.$D || 0,
                      month: values?.$M + 1 || 0,
                      year: values?.$y || 0,
                    }))
                  }}
                  sx={{
                    p: 0,
                    width: "100%",
                    "& .MuiPickersSectionList-root": {
                      py: 1,
                    },
                  }}
                />
              </LocalizationProvider>

              <Typography variant="subtitle1" align="left" sx={{ fontWeight: "bold", color: "text.secondary", mt: 1 }}>
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
          )}

          <Box sx={{ width: "100%", display: "flex", flexDirection: "row", gap: 2 }}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 1, py: 1, borderRadius: 2 }}
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Back
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 1, py: 1, borderRadius: 2 }}
                onClick={() => updateUserInfo()}
              >
                Finish
              </Button>
            ) : (
              <Button
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 1, py: 1, borderRadius: 2 }}
                onClick={() => handleSignup()}
              >
                Next
              </Button>
            )}
          </Box>
        </Fragment>
      )}
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
