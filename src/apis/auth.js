import axios from "axios"
import { toast } from "react-toastify"
import { formatPhoneNumber } from "~/utils"
import { API_ROOT } from "~/utils/constants"

export const loginAPI = async (phone, password) => {
  try {
    const response = await axios.post(API_ROOT + "/auths/login", {
      phone,
      password,
    })
    return response.data
  } catch (err) {
    console.log("🚀 ~ loginAPI ~ err:", err.response.data)
    toast.error(err.response.data.message)
  }
}

export const signupAPI = async (data) => {
  try {
    const response = await axios.post(API_ROOT + "/auths/signup", data)
    return response.data
  } catch (err) {
    toast.error(err.response.data.message)
  }
}

export const verifyOtpAPI = async (phone, code) => {
  try {
    const response = await axios.post(API_ROOT + "/auths/verify", {
      phone: formatPhoneNumber(phone),
      code,
    })
    return response.data
  } catch (err) {
    toast.error(err.response.data.message)
  }
}
