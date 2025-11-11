import { axiosInstance } from "./axiosConfig"

export const updateInfoUserAPI = async (userId, payload) => {
  console.log("🚀 ~ updateInfoUserAPI ~ payload:", payload)
  const res = await axiosInstance.put(`/users/${userId}`, payload)
  return res.data
}

// NEW: Lấy danh sách user cho staff với phân trang
export const getListUserForStaffAPI = async (page = 1, limit = 20) => {
  console.log("🚀 ~ getListUserForStaffAPI ~ page:", page, "limit:", limit)
  const res = await axiosInstance.get(`/users/staff/list`, {
    params: {
      page,
      limit,
    },
  })
  return res.data
}

export const getListUserForAdminAPI = async (page = 1, limit = 20) => {
  console.log("🚀 ~ getListUserForStaffAPI ~ page:", page, "limit:", limit)
  const res = await axiosInstance.get(`/users/admin/list`, {
    params: {
      page,
      limit,
    },
  })
  return res.data
}

// NEW: Lấy chi tiết 1 user
export const getUserDetailAPI = async (userId) => {
  console.log("🚀 ~ getUserDetailAPI ~ userId:", userId)
  const res = await axiosInstance.get(`/users/${userId}`)
  return res.data
}

// NEW: Tạo user mới
export const createNewUserAPI = async (payload) => {
  console.log("🚀 ~ createNewUserAPI ~ payload:", payload)
  const res = await axiosInstance.post(`/users`, payload)
  return res.data
}

// NEW: Xóa mềm user
export const softDeleteUserAPI = async (userId) => {
  console.log("🚀 ~ softDeleteUserAPI ~ userId:", userId)
  const res = await axiosInstance.delete(`/users/${userId}/soft-delete`)
  return res.data
}

// BONUS: Wrapper function với error handling cho getListUserForStaffAPI
export const getListUserForStaffWithErrorHandling = async (page = 1, limit = 20) => {
  try {
    const response = await getListUserForStaffAPI(page, limit)
    return {
      success: true,
      data: response,
    }
  } catch (error) {
    console.error("🚀 ~ getListUserForStaffWithErrorHandling ~ error:", error)
    return {
      success: false,
      error: error.response?.data?.message || error.message || "Unknown error occurred",
    }
  }
}

// BONUS: Wrapper function với error handling cho softDeleteUserAPI
export const softDeleteUserWithErrorHandling = async (userId) => {
  try {
    const response = await softDeleteUserAPI(userId)
    return {
      success: true,
      data: response,
    }
  } catch (error) {
    console.error("🚀 ~ softDeleteUserWithErrorHandling ~ error:", error)

    // Xử lý các error code cụ thể
    const statusCode = error.response?.status
    const errorMessage = error.response?.data?.message || error.message

    let userFriendlyMessage = errorMessage

    switch (statusCode) {
      case 404:
        userFriendlyMessage = "Người dùng không tồn tại hoặc đã bị xóa"
        break
      case 409:
        if (errorMessage.includes("active subscription")) {
          userFriendlyMessage = "Không thể xóa người dùng đang có gói tập active. Vui lòng hết hạn gói tập trước."
        } else if (errorMessage.includes("checked in")) {
          userFriendlyMessage = "Không thể xóa người dùng đang check-in. Vui lòng checkout trước."
        }
        break
      case 400:
        userFriendlyMessage = "Dữ liệu không hợp lệ"
        break
      default:
        userFriendlyMessage = "Có lỗi xảy ra khi xóa người dùng"
    }

    return {
      success: false,
      error: userFriendlyMessage,
      originalError: errorMessage,
      statusCode,
    }
  }
}
