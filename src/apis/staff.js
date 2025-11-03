import { axiosInstance } from "./axiosConfig"

// 1. Đăng ký nhân viên mới (Bước 1 - Gửi OTP)
export const createStaffSignupAPI = async (phone) => {
  const rep = await axiosInstance.post("/staffs/create/signup", { phone })
  return rep.data
}

// 2. Xác thực OTP và tạo nhân viên (Bước 2 - Hoàn tất đăng ký)
export const verifyStaffOTPAPI = async (staffData) => {
  const rep = await axiosInstance.post("/staffs/create/verify", staffData)
  return rep.data
}

// 3. Lấy thông tin chi tiết nhân viên theo User ID
export const getStaffByIdAPI = async (userId) => {
  const rep = await axiosInstance.get("/staffs/" + userId)
  return rep.data
}

// 4. Lấy danh sách tất cả nhân viên (function bổ sung - có thể cần thiết)
export const getAllStaffsAPI = async () => {
  const rep = await axiosInstance.get("/staffs")
  return rep.data
}

// 5. Cập nhật thông tin nhân viên
export const updateStaffAPI = async (staffId, updateData) => {
  const rep = await axiosInstance.put("/staffs/" + staffId, updateData)
  return rep.data
}

// 6. Xóa mềm nhân viên (Soft Delete)
export const softDeleteStaffAPI = async (staffId) => {
  const rep = await axiosInstance.delete("/staffs/" + staffId)
  return rep.data
}

// 7. Xóa cứng nhân viên (Hard Delete)
export const hardDeleteStaffAPI = async (staffId) => {
  const rep = await axiosInstance.delete("/staffs/" + staffId + "/hard-delete")
  return rep.data
}

// Helper function để format dữ liệu khi tạo nhân viên mới
export const formatStaffData = (formData) => {
  return {
    phone: formData.phone,
    code: formData.code,
    fullName: formData.fullName,
    email: formData.email,
    password: formData.password,
    age: parseInt(formData.age),
    dateOfBirth: formData.dateOfBirth,
    address: formData.address,
    gender: formData.gender,
    locationId: formData.locationId,
    citizenId: formData.citizenId,
    positionName: formData.positionName, // "RECEPTIONIST" hoặc "CLEANER"
    hourlyRate: parseFloat(formData.hourlyRate),
    hoursWorked: formData.hoursWorked ? parseFloat(formData.hoursWorked) : 0,
  }
}

// Helper function để format dữ liệu khi cập nhật nhân viên
export const formatUpdateStaffData = (userInfo = {}, staffInfo = {}) => {
  const updateData = {}

  if (Object.keys(userInfo).length > 0) {
    updateData.userInfo = {}
    if (userInfo.fullName) updateData.userInfo.fullName = userInfo.fullName
    if (userInfo.email) updateData.userInfo.email = userInfo.email
    if (userInfo.phone) updateData.userInfo.phone = userInfo.phone
    if (userInfo.password) updateData.userInfo.password = userInfo.password
    if (userInfo.age) updateData.userInfo.age = parseInt(userInfo.age)
    if (userInfo.dateOfBirth) updateData.userInfo.dateOfBirth = userInfo.dateOfBirth
    if (userInfo.address) updateData.userInfo.address = userInfo.address
    if (userInfo.gender) updateData.userInfo.gender = userInfo.gender
  }

  if (Object.keys(staffInfo).length > 0) {
    updateData.staffInfo = {}
    if (staffInfo.locationId) updateData.staffInfo.locationId = staffInfo.locationId
    if (staffInfo.citizenId) updateData.staffInfo.citizenId = staffInfo.citizenId
    if (staffInfo.positionName) updateData.staffInfo.positionName = staffInfo.positionName
    if (staffInfo.hourlyRate) updateData.staffInfo.hourlyRate = parseFloat(staffInfo.hourlyRate)
    if (staffInfo.hoursWorked !== undefined) updateData.staffInfo.hoursWorked = parseFloat(staffInfo.hoursWorked)
  }

  return updateData
}
