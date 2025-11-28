import { axiosInstance } from "./axiosConfig"

export const updateInfoUserAPI = async (userId, payload) => {
  console.log("🚀 ~ updateInfoUserAPI ~ payload:", payload)
  const res = await axiosInstance.put(`/users/${userId}`, payload)
  return res.data
}

export const updateAvatarAPI = async (userId, payload) => {
  console.log("🚀 ~ updateInfoUserAPI ~ payload:", payload)
  const res = await axiosInstance.put(`/users/${userId}/avatar`, payload)
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

// NEW: Lấy events của user trong 3 tháng
export const getUserEventsForThreeMonthsAPI = async (userId) => {
  const res = await axiosInstance.get(`/users/${userId}/events/three-months`)
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

// BONUS: Wrapper function với error handling cho getUserEventsForThreeMonthsAPI
export const getUserEventsForThreeMonthsWithErrorHandling = async (userId) => {
  try {
    const response = await getUserEventsForThreeMonthsAPI(userId)
    return {
      success: true,
      data: response,
    }
  } catch (error) {
    console.error("🚀 ~ getUserEventsForThreeMonthsWithErrorHandling ~ error:", error)

    // Xử lý các error code cụ thể
    const statusCode = error.response?.status
    const errorMessage = error.response?.data?.message || error.message

    let userFriendlyMessage = errorMessage

    switch (statusCode) {
      case 404:
        userFriendlyMessage = "Người dùng không tồn tại"
        break
      case 400:
        userFriendlyMessage = "ID người dùng không hợp lệ"
        break
      case 500:
        userFriendlyMessage = "Lỗi server khi lấy dữ liệu events"
        break
      default:
        userFriendlyMessage = "Có lỗi xảy ra khi lấy lịch trình của người dùng"
    }

    return {
      success: false,
      error: userFriendlyMessage,
      originalError: errorMessage,
      statusCode,
    }
  }
}

export const changePasswordAPI = async (userId, oldPassword, newPlainPassword) => {
  const res = await axiosInstance.put(`/users/${userId}/change-password`, {
    oldPassword,
    newPlainPassword,
  })
  return res.data
}

// ========================= USER STATISTICS APIs =========================

// Overview Statistics - 4 Cards
export const getTotalMembersAPI = async () => {
  console.log("🚀 ~ getTotalMembersAPI ~ called")
  const res = await axiosInstance.get(`/users/statistics/total-members`)
  return res.data
}

export const getActiveMembersAPI = async () => {
  console.log("🚀 ~ getActiveMembersAPI ~ called")
  const res = await axiosInstance.get(`/users/statistics/active-members`)
  return res.data
}

export const getNewMembers3DaysAPI = async () => {
  console.log("🚀 ~ getNewMembers3DaysAPI ~ called")
  const res = await axiosInstance.get(`/users/statistics/new-members-3days`)
  return res.data
}

export const getTotalRevenueFromMembersAPI = async () => {
  console.log("🚀 ~ getTotalRevenueFromMembersAPI ~ called")
  const res = await axiosInstance.get(`/users/statistics/total-revenue`)
  return res.data
}

// Chart Statistics - 4 Charts
export const getNewMembersByTimeAPI = async (startDate, endDate, groupBy = "month") => {
  console.log("🚀 ~ getNewMembersByTimeAPI ~ params:", { startDate, endDate, groupBy })
  const res = await axiosInstance.get(`/users/statistics/new-members-by-time`, {
    params: {
      startDate,
      endDate,
      groupBy,
    },
  })
  return res.data
}

export const getMembersByGenderAPI = async (startDate = null, endDate = null) => {
  console.log("🚀 ~ getMembersByGenderAPI ~ params:", { startDate, endDate })
  const params = {}
  if (startDate) params.startDate = startDate
  if (endDate) params.endDate = endDate

  const res = await axiosInstance.get(`/users/statistics/members-by-gender`, { params })
  return res.data
}

export const getCheckinTrendAPI = async (startDate, endDate, groupBy = "day") => {
  console.log("🚀 ~ getCheckinTrendAPI ~ params:", { startDate, endDate, groupBy })
  const res = await axiosInstance.get(`/users/statistics/checkin-trend`, {
    params: {
      startDate,
      endDate,
      groupBy,
    },
  })
  return res.data
}

export const getMembersByAgeAPI = async (startDate = null, endDate = null) => {
  console.log("🚀 ~ getMembersByAgeAPI ~ params:", { startDate, endDate })
  const params = {}
  if (startDate) params.startDate = startDate
  if (endDate) params.endDate = endDate

  const res = await axiosInstance.get(`/users/statistics/members-by-age`, { params })
  return res.data
}

// ========================= STATISTICS APIs WITH ERROR HANDLING =========================

// Overview Statistics với Error Handling
export const getTotalMembersWithErrorHandling = async () => {
  try {
    const response = await getTotalMembersAPI()
    return {
      success: true,
      data: response,
    }
  } catch (error) {
    console.error("🚀 ~ getTotalMembersWithErrorHandling ~ error:", error)
    return {
      success: false,
      error: error.response?.data?.message || "Không thể lấy tổng số hội viên",
    }
  }
}

export const getActiveMembersWithErrorHandling = async () => {
  try {
    const response = await getActiveMembersAPI()
    return {
      success: true,
      data: response,
    }
  } catch (error) {
    console.error("🚀 ~ getActiveMembersWithErrorHandling ~ error:", error)
    return {
      success: false,
      error: error.response?.data?.message || "Không thể lấy số hội viên hoạt động",
    }
  }
}

export const getNewMembers3DaysWithErrorHandling = async () => {
  try {
    const response = await getNewMembers3DaysAPI()
    return {
      success: true,
      data: response,
    }
  } catch (error) {
    console.error("🚀 ~ getNewMembers3DaysWithErrorHandling ~ error:", error)
    return {
      success: false,
      error: error.response?.data?.message || "Không thể lấy số hội viên mới",
    }
  }
}

export const getTotalRevenueWithErrorHandling = async () => {
  try {
    const response = await getTotalRevenueFromMembersAPI()
    return {
      success: true,
      data: response,
    }
  } catch (error) {
    console.error("🚀 ~ getTotalRevenueWithErrorHandling ~ error:", error)
    return {
      success: false,
      error: error.response?.data?.message || "Không thể lấy tổng doanh thu",
    }
  }
}

// Chart Statistics với Error Handling
export const getNewMembersByTimeWithErrorHandling = async (startDate, endDate, groupBy = "month") => {
  try {
    const response = await getNewMembersByTimeAPI(startDate, endDate, groupBy)
    return {
      success: true,
      data: response,
    }
  } catch (error) {
    console.error("🚀 ~ getNewMembersByTimeWithErrorHandling ~ error:", error)

    const statusCode = error.response?.status
    let userFriendlyMessage = "Không thể lấy dữ liệu hội viên mới theo thời gian"

    switch (statusCode) {
      case 400:
        userFriendlyMessage = "Tham số thời gian không hợp lệ. Vui lòng kiểm tra startDate, endDate và groupBy"
        break
    }

    return {
      success: false,
      error: userFriendlyMessage,
      originalError: error.response?.data?.message,
    }
  }
}

export const getMembersByGenderWithErrorHandling = async (startDate = null, endDate = null) => {
  try {
    const response = await getMembersByGenderAPI(startDate, endDate)
    return {
      success: true,
      data: response,
    }
  } catch (error) {
    console.error("🚀 ~ getMembersByGenderWithErrorHandling ~ error:", error)
    return {
      success: false,
      error: error.response?.data?.message || "Không thể lấy phân bố hội viên theo giới tính",
    }
  }
}

export const getCheckinTrendWithErrorHandling = async (startDate, endDate, groupBy = "day") => {
  try {
    const response = await getCheckinTrendAPI(startDate, endDate, groupBy)
    return {
      success: true,
      data: response,
    }
  } catch (error) {
    console.error("🚀 ~ getCheckinTrendWithErrorHandling ~ error:", error)

    const statusCode = error.response?.status
    let userFriendlyMessage = "Không thể lấy xu hướng check-in"

    switch (statusCode) {
      case 400:
        userFriendlyMessage = "Tham số thời gian không hợp lệ. Vui lòng kiểm tra startDate, endDate và groupBy"
        break
    }

    return {
      success: false,
      error: userFriendlyMessage,
      originalError: error.response?.data?.message,
    }
  }
}

export const getMembersByAgeWithErrorHandling = async (startDate = null, endDate = null) => {
  try {
    const response = await getMembersByAgeAPI(startDate, endDate)
    return {
      success: true,
      data: response,
    }
  } catch (error) {
    console.error("🚀 ~ getMembersByAgeWithErrorHandling ~ error:", error)
    return {
      success: false,
      error: error.response?.data?.message || "Không thể lấy phân bố hội viên theo độ tuổi",
    }
  }
}

// ========================= BULK STATISTICS FUNCTIONS =========================

/**
 * Lấy tất cả thống kê tổng quan cùng một lúc
 * @returns {Promise<Object>} { success: boolean, data: { totalMembers, activeMembers, newMembers3Days, totalRevenue }, errors?: Array }
 */
export const getAllOverviewStatsWithErrorHandling = async () => {
  try {
    const [totalMembers, activeMembers, newMembers3Days, totalRevenue] = await Promise.allSettled([
      getTotalMembersAPI(),
      getActiveMembersAPI(),
      getNewMembers3DaysAPI(),
      getTotalRevenueFromMembersAPI(),
    ])

    const result = {
      totalMembers: totalMembers.status === "fulfilled" ? totalMembers.value : null,
      activeMembers: activeMembers.status === "fulfilled" ? activeMembers.value : null,
      newMembers3Days: newMembers3Days.status === "fulfilled" ? newMembers3Days.value : null,
      totalRevenue: totalRevenue.status === "fulfilled" ? totalRevenue.value : null,
    }

    const errors = []
    if (totalMembers.status === "rejected") errors.push({ type: "totalMembers", error: totalMembers.reason })
    if (activeMembers.status === "rejected") errors.push({ type: "activeMembers", error: activeMembers.reason })
    if (newMembers3Days.status === "rejected") errors.push({ type: "newMembers3Days", error: newMembers3Days.reason })
    if (totalRevenue.status === "rejected") errors.push({ type: "totalRevenue", error: totalRevenue.reason })

    return {
      success: true,
      data: result,
      ...(errors.length > 0 && { errors }),
    }
  } catch (error) {
    console.error("🚀 ~ getAllOverviewStatsWithErrorHandling ~ error:", error)
    return {
      success: false,
      error: "Không thể lấy dữ liệu thống kê tổng quan",
    }
  }
}

/**
 * Lấy tất cả dữ liệu biểu đồ cùng một lúc
 * @param {string} startDate - ISO date string
 * @param {string} endDate - ISO date string
 * @param {string} timeGroupBy - 'day' | 'week' | 'month'
 * @param {string} checkinGroupBy - 'day' | 'week' | 'month'
 * @returns {Promise<Object>}
 */
export const getAllChartsDataWithErrorHandling = async (
  startDate,
  endDate,
  timeGroupBy = "month",
  checkinGroupBy = "day",
) => {
  try {
    const [newMembersByTime, membersByGender, checkinTrend, membersByAge] = await Promise.allSettled([
      getNewMembersByTimeAPI(startDate, endDate, timeGroupBy),
      getMembersByGenderAPI(startDate, endDate),
      getCheckinTrendAPI(startDate, endDate, checkinGroupBy),
      getMembersByAgeAPI(startDate, endDate),
    ])

    const result = {
      newMembersByTime: newMembersByTime.status === "fulfilled" ? newMembersByTime.value : null,
      membersByGender: membersByGender.status === "fulfilled" ? membersByGender.value : null,
      checkinTrend: checkinTrend.status === "fulfilled" ? checkinTrend.value : null,
      membersByAge: membersByAge.status === "fulfilled" ? membersByAge.value : null,
    }

    const errors = []
    if (newMembersByTime.status === "rejected")
      errors.push({ type: "newMembersByTime", error: newMembersByTime.reason })
    if (membersByGender.status === "rejected") errors.push({ type: "membersByGender", error: membersByGender.reason })
    if (checkinTrend.status === "rejected") errors.push({ type: "checkinTrend", error: checkinTrend.reason })
    if (membersByAge.status === "rejected") errors.push({ type: "membersByAge", error: membersByAge.reason })

    return {
      success: true,
      data: result,
      ...(errors.length > 0 && { errors }),
    }
  } catch (error) {
    console.error("🚀 ~ getAllChartsDataWithErrorHandling ~ error:", error)
    return {
      success: false,
      error: "Không thể lấy dữ liệu biểu đồ",
    }
  }
}
