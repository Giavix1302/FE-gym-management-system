import { Box, Button, Checkbox, Divider, FormControlLabel, TextField, Typography, Link } from "@mui/material"
import { Google } from "@mui/icons-material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { loginAPI } from "~/apis/auth"

import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { formatPhoneNumber, isValidPhone, saveToLocalStorage } from "~/utils/common"
import { toast } from "react-toastify"
// store
import useUserStore from "~/stores/useUserStore"
import useMyMembershipStore from "~/stores/useMyMembershipStore"
import useTrainerInfoStore from "~/stores/useTrainerInfoStore"
import useLocationStore from "~/stores/useLocationStore"
import { getListLocationAPI } from "~/apis/location"
import { getListRoomAPI } from "~/apis/room"
import useRoomsStore from "~/stores/useRoomsStore"
import { getListTrainerForAdminAPI } from "~/apis/trainer"
import useListTrainerInfoForAdmin from "~/stores/useListTrainerInfoForAdmin"
import useListScheduleForPTStore from "~/stores/useListScheduleForPTStore"
import { getListScheduleByTrainerIdAPI } from "~/apis/schedule"

function Login() {
  // store
  const { updateUser } = useUserStore()
  const { updateMyMembership } = useMyMembershipStore()
  const { updateTrainerInfo, resetTrainerInfo } = useTrainerInfoStore()
  const { setLocations } = useLocationStore()
  const { setRooms } = useRoomsStore()
  const { setListTrainerInfo } = useListTrainerInfoForAdmin()
  const { setListSchedule } = useListScheduleForPTStore()

  //state
  const [phone, setPhone] = useState("")
  const [isPhoneError, setIsPhoneError] = useState(false)
  const [password, setPassword] = useState("")
  const [isPasswordError, setIsPasswordError] = useState(false)

  const navigate = useNavigate()

  //
  const handleLogin = async () => {
    // reset
    setIsPhoneError(false)
    setIsPasswordError(false)
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
    // check value
    if (phone !== "" && !isValidPhone(phone)) {
      toast.error("Số điện thoại gồm 10 số và số 0 đầu tiên")
      setIsPhoneError(true)
      return
    }
    const formatPhone = formatPhoneNumber(phone)
    const data = await loginAPI(formatPhone, password)
    console.log("🚀 ~ handleLogin ~ data:", data)
    // kiem tra login thành cong
    if (data.success) {
      // lưu token
      saveToLocalStorage("accessToken", data.accessToken)
      //
      const locationData = await getListLocationAPI()
      setLocations(locationData.locations)
      if (data.user.role === "admin") {
        //get list room
        const resultRoom = await getListRoomAPI()
        if (resultRoom.success) setRooms(resultRoom.rooms)
        // get list trainer info
        const response = await getListTrainerForAdminAPI()
        if (response.success && response.listTrainerInfo) {
          setListTrainerInfo(response.listTrainerInfo)
        }
        // navigate
        navigate("/admin/dashboard")
      } else if (data.user.role === "user") {
        updateUser(data.user)
        updateMyMembership(data.myMembership)
        navigate("/user/home")
      } else if (data.user.role === "pt") {
        updateUser(data.user)
        if (Object.keys(data.trainer).length > 0) {
          console.log(" vô đây")
          updateTrainerInfo(data.trainer)
          const result = await getListScheduleByTrainerIdAPI(data.trainer._id)
          setListSchedule(result.listSchedule)
        } else {
          resetTrainerInfo()
        }

        navigate("/pt/home")
      }
      toast.success("đăng nhập thành công")
    }

    // saveToLocalStorage("accessToken", )
    console.log("🚀 ~ handleLogin ~ data:", data)
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
          Đăng nhập{" "}
        </Typography>
        để có những trải nghiệm tốt nhất!
      </Typography>

      {/* Form */}
      <Box sx={{ mt: 3, width: "100%" }}>
        {/* Số điện thoại */}
        <Typography variant="subtitle1" align="left" sx={{ fontWeight: "bold", color: "text.secondary" }}>
          Số điện thoại
        </Typography>
        <TextField
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          size="small"
          fullWidth
          placeholder="Nhập số điện thoại"
          type="tel"
          error={isPhoneError}
        />

        {/* Mật khẩu */}
        <Typography variant="subtitle1" align="left" sx={{ fontWeight: "bold", color: "text.secondary", mt: 2 }}>
          Mật khẩu
        </Typography>
        <TextField
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          size="small"
          fullWidth
          placeholder="Nhập mật khẩu"
          type="password"
          error={isPasswordError}
        />

        {/* Lưu mật khẩu */}
        <FormControlLabel
          control={<Checkbox color="primary" size="small" />}
          label="Lưu mật khẩu"
          sx={{ mt: 0, width: "100%", justifyContent: "flex-end", mr: 0 }}
        />

        {/* Nút đăng nhập */}
        <Button
          onClick={() => handleLogin()}
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 1, py: 1, borderRadius: 2 }}
        >
          Đăng nhập
        </Button>

        {/* Divider */}
        <Divider sx={{ my: 3 }}>or</Divider>

        {/* Đăng nhập với Google */}
        <Button fullWidth variant="outlined" startIcon={<Google />} sx={{ py: 1, borderRadius: 2 }}>
          Đăng nhập với Google
        </Button>

        {/* Chưa có tài khoản */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mt: 2 }}>
          <Typography variant="body2" align="center" sx={{ color: "text.secondary" }}>
            Bạn chưa có tài khoản?
          </Typography>
          <Button onClick={() => navigate("/signup")} underline="hover" color="secondary">
            Đăng ký
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default Login
