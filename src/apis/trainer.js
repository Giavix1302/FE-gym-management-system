import { axiosInstance } from "./axiosConfig"

// for pt
export const updateInfoTrainerByUserIdAPI = async (userId, payload) => {
  console.log("🚀 ~ updateInfoTrainerByUserIdAPI ~ payload:", payload)
  console.log("🚀 ~ updateInfoTrainerByUserIdAPI ~ userId:", userId)
  for (const [key, value] of payload.entries()) {
    console.log(key, value)
  }
  const res = await axiosInstance.put(`/trainers/${userId}`, payload)
  console.log("🚀 ~ updateInfoTrainerByUserIdAPI ~ res:", res)
  return res.data
}

export const updateIsApprovedAPI = async (trainerId, payload) => {
  const res = await axiosInstance.put(`/trainers/is-approved/${trainerId}`, payload)
  return res.data
}

// for user
export const getListTrainerForUserAPI = async () => {
  const res = await axiosInstance.get(`/trainers/user`)
  console.log("🚀 ~ getListTrainerForUserAPI ~ res:", res)
  return res.data
}

//
export const getListTrainerForAdminAPI = async () => {
  const res = await axiosInstance.get(`/trainers/admin`)
  return res.data
}

// Lấy danh sách booking completed của trainer
export const getListBookingByTrainerIdAPI = async (userId, page = 1, limit = 10) => {
  console.log("🚀 ~ getListBookingByTrainerIdAPI ~ userId:", userId)
  const res = await axiosInstance.get(`/trainers/${userId}/bookings`, {
    params: {
      page,
      limit,
    },
  })
  console.log("🚀 ~ getListBookingByTrainerIdAPI ~ res:", res)
  return res.data
}

// Hoặc có thể viết với options object để linh hoạt hơn
export const getTrainerBookingsAPI = async (userId, options = {}) => {
  const { page = 1, limit = 10 } = options

  const res = await axiosInstance.get(`/trainers/${userId}/bookings`, {
    params: {
      page,
      limit,
    },
  })
  return res.data
}

export const getTrainerDashboardStatsAPI = async (userId) => {
  const res = await axiosInstance.get(`/trainers/${userId}/dashboard-stats`)
  console.log("🚀 ~ getTrainerDashboardStatsAPI ~ res:", res)
  return res.data
}

export const getTrainerEventsForThreeMonthsAPI = async (userId) => {
  const res = await axiosInstance.get(`/trainers/${userId}/events`)
  console.log("🚀 ~ getTrainerEventsForThreeMonthsAPI ~ res:", res)
  return res.data
}

// ========================= TRAINER STATISTICS APIs =========================

// Overview Statistics - 4 Cards
export const getTotalTrainersAPI = async () => {
  console.log("🚀 ~ getTotalTrainersAPI ~ called")
  const res = await axiosInstance.get(`/trainers/statistics/total-trainers`)
  return res.data
}

export const getActiveTrainersAPI = async () => {
  console.log("🚀 ~ getActiveTrainersAPI ~ called")
  const res = await axiosInstance.get(`/trainers/statistics/active-trainers`)
  return res.data
}

export const getPendingTrainersAPI = async () => {
  console.log("🚀 ~ getPendingTrainersAPI ~ called")
  const res = await axiosInstance.get(`/trainers/statistics/pending-trainers`)
  return res.data
}

export const getTotalTrainerRevenueAPI = async () => {
  console.log("🚀 ~ getTotalTrainerRevenueAPI ~ called")
  const res = await axiosInstance.get(`/trainers/statistics/total-revenue`)
  return res.data
}

// Chart Statistics - 4 Charts
export const getTrainerRevenueByTimeAPI = async (startDate, endDate, groupBy = "month") => {
  console.log("🚀 ~ getTrainerRevenueByTimeAPI ~ params:", { startDate, endDate, groupBy })
  const res = await axiosInstance.get(`/trainers/statistics/revenue-by-time`, {
    params: {
      startDate,
      endDate,
      groupBy,
    },
  })
  return res.data
}

export const getTrainersBySpecializationAPI = async () => {
  console.log("🚀 ~ getTrainersBySpecializationAPI ~ called")
  const res = await axiosInstance.get(`/trainers/statistics/trainers-by-specialization`)
  return res.data
}

export const getTrainingSessionsByTimeAPI = async (startDate, endDate, groupBy = "day") => {
  console.log("🚀 ~ getTrainingSessionsByTimeAPI ~ params:", { startDate, endDate, groupBy })
  const res = await axiosInstance.get(`/trainers/statistics/sessions-by-time`, {
    params: {
      startDate,
      endDate,
      groupBy,
    },
  })
  return res.data
}

export const getTopTrainersByRevenueAPI = async (limit = 10) => {
  console.log("🚀 ~ getTopTrainersByRevenueAPI ~ limit:", limit)
  const res = await axiosInstance.get(`/trainers/statistics/top-trainers-by-revenue`, {
    params: {
      limit,
    },
  })
  return res.data
}

// ========================= TRAINER STATISTICS APIs WITH ERROR HANDLING =========================

// Overview Statistics với Error Handling
export const getTotalTrainersWithErrorHandling = async () => {
  try {
    const response = await getTotalTrainersAPI()
    return {
      success: true,
      data: response,
    }
  } catch (error) {
    console.error("🚀 ~ getTotalTrainersWithErrorHandling ~ error:", error)
    return {
      success: false,
      error: error.response?.data?.message || "Không thể lấy tổng số huấn luyện viên",
    }
  }
}

export const getActiveTrainersWithErrorHandling = async () => {
  try {
    const response = await getActiveTrainersAPI()
    return {
      success: true,
      data: response,
    }
  } catch (error) {
    console.error("🚀 ~ getActiveTrainersWithErrorHandling ~ error:", error)
    return {
      success: false,
      error: error.response?.data?.message || "Không thể lấy số huấn luyện viên hoạt động",
    }
  }
}

export const getPendingTrainersWithErrorHandling = async () => {
  try {
    const response = await getPendingTrainersAPI()
    return {
      success: true,
      data: response,
    }
  } catch (error) {
    console.error("🚀 ~ getPendingTrainersWithErrorHandling ~ error:", error)
    return {
      success: false,
      error: error.response?.data?.message || "Không thể lấy số huấn luyện viên chờ duyệt",
    }
  }
}

export const getTotalTrainerRevenueWithErrorHandling = async () => {
  try {
    const response = await getTotalTrainerRevenueAPI()
    return {
      success: true,
      data: response,
    }
  } catch (error) {
    console.error("🚀 ~ getTotalTrainerRevenueWithErrorHandling ~ error:", error)
    return {
      success: false,
      error: error.response?.data?.message || "Không thể lấy tổng doanh thu huấn luyện viên",
    }
  }
}

// Chart Statistics với Error Handling
export const getTrainerRevenueByTimeWithErrorHandling = async (startDate, endDate, groupBy = "month") => {
  try {
    const response = await getTrainerRevenueByTimeAPI(startDate, endDate, groupBy)
    return {
      success: true,
      data: response,
    }
  } catch (error) {
    console.error("🚀 ~ getTrainerRevenueByTimeWithErrorHandling ~ error:", error)

    const statusCode = error.response?.status
    let userFriendlyMessage = "Không thể lấy dữ liệu doanh thu huấn luyện viên theo thời gian"

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

export const getTrainersBySpecializationWithErrorHandling = async () => {
  try {
    const response = await getTrainersBySpecializationAPI()
    return {
      success: true,
      data: response,
    }
  } catch (error) {
    console.error("🚀 ~ getTrainersBySpecializationWithErrorHandling ~ error:", error)
    return {
      success: false,
      error: error.response?.data?.message || "Không thể lấy phân bố huấn luyện viên theo chuyên môn",
    }
  }
}

export const getTrainingSessionsByTimeWithErrorHandling = async (startDate, endDate, groupBy = "day") => {
  try {
    const response = await getTrainingSessionsByTimeAPI(startDate, endDate, groupBy)
    return {
      success: true,
      data: response,
    }
  } catch (error) {
    console.error("🚀 ~ getTrainingSessionsByTimeWithErrorHandling ~ error:", error)

    const statusCode = error.response?.status
    let userFriendlyMessage = "Không thể lấy xu hướng buổi tập"

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

export const getTopTrainersByRevenueWithErrorHandling = async (limit = 10) => {
  try {
    const response = await getTopTrainersByRevenueAPI(limit)
    return {
      success: true,
      data: response,
    }
  } catch (error) {
    console.error("🚀 ~ getTopTrainersByRevenueWithErrorHandling ~ error:", error)

    const statusCode = error.response?.status
    let userFriendlyMessage = "Không thể lấy top huấn luyện viên theo doanh thu"

    switch (statusCode) {
      case 400:
        userFriendlyMessage = "Giới hạn không hợp lệ. Limit phải từ 1 đến 50"
        break
    }

    return {
      success: false,
      error: userFriendlyMessage,
      originalError: error.response?.data?.message,
    }
  }
}

// ========================= BULK TRAINER STATISTICS FUNCTIONS =========================

/**
 * Lấy tất cả thống kê tổng quan cho trainer cùng một lúc
 * @returns {Promise<Object>} { success: boolean, data: { totalTrainers, activeTrainers, pendingTrainers, totalRevenue }, errors?: Array }
 */
export const getAllTrainerOverviewStatsWithErrorHandling = async () => {
  try {
    const [totalTrainers, activeTrainers, pendingTrainers, totalRevenue] = await Promise.allSettled([
      getTotalTrainersAPI(),
      getActiveTrainersAPI(),
      getPendingTrainersAPI(),
      getTotalTrainerRevenueAPI(),
    ])

    const result = {
      totalTrainers: totalTrainers.status === "fulfilled" ? totalTrainers.value : null,
      activeTrainers: activeTrainers.status === "fulfilled" ? activeTrainers.value : null,
      pendingTrainers: pendingTrainers.status === "fulfilled" ? pendingTrainers.value : null,
      totalRevenue: totalRevenue.status === "fulfilled" ? totalRevenue.value : null,
    }

    const errors = []
    if (totalTrainers.status === "rejected") errors.push({ type: "totalTrainers", error: totalTrainers.reason })
    if (activeTrainers.status === "rejected") errors.push({ type: "activeTrainers", error: activeTrainers.reason })
    if (pendingTrainers.status === "rejected") errors.push({ type: "pendingTrainers", error: pendingTrainers.reason })
    if (totalRevenue.status === "rejected") errors.push({ type: "totalRevenue", error: totalRevenue.reason })

    return {
      success: true,
      data: result,
      ...(errors.length > 0 && { errors }),
    }
  } catch (error) {
    console.error("🚀 ~ getAllTrainerOverviewStatsWithErrorHandling ~ error:", error)
    return {
      success: false,
      error: "Không thể lấy dữ liệu thống kê tổng quan huấn luyện viên",
    }
  }
}

/**
 * Lấy tất cả dữ liệu biểu đồ cho trainer cùng một lúc
 * @param {string} startDate - ISO date string
 * @param {string} endDate - ISO date string
 * @param {string} revenueGroupBy - 'day' | 'week' | 'month'
 * @param {string} sessionGroupBy - 'day' | 'week' | 'month'
 * @param {number} topLimit - Number of top trainers to fetch
 * @returns {Promise<Object>}
 */
export const getAllTrainerChartsDataWithErrorHandling = async (
  startDate,
  endDate,
  revenueGroupBy = "month",
  sessionGroupBy = "day",
  topLimit = 10,
) => {
  try {
    const [revenueByTime, trainersBySpecialization, sessionsByTime, topTrainers] = await Promise.allSettled([
      getTrainerRevenueByTimeAPI(startDate, endDate, revenueGroupBy),
      getTrainersBySpecializationAPI(),
      getTrainingSessionsByTimeAPI(startDate, endDate, sessionGroupBy),
      getTopTrainersByRevenueAPI(topLimit),
    ])

    const result = {
      revenueByTime: revenueByTime.status === "fulfilled" ? revenueByTime.value : null,
      trainersBySpecialization: trainersBySpecialization.status === "fulfilled" ? trainersBySpecialization.value : null,
      sessionsByTime: sessionsByTime.status === "fulfilled" ? sessionsByTime.value : null,
      topTrainers: topTrainers.status === "fulfilled" ? topTrainers.value : null,
    }

    const errors = []
    if (revenueByTime.status === "rejected") errors.push({ type: "revenueByTime", error: revenueByTime.reason })
    if (trainersBySpecialization.status === "rejected")
      errors.push({ type: "trainersBySpecialization", error: trainersBySpecialization.reason })
    if (sessionsByTime.status === "rejected") errors.push({ type: "sessionsByTime", error: sessionsByTime.reason })
    if (topTrainers.status === "rejected") errors.push({ type: "topTrainers", error: topTrainers.reason })

    return {
      success: true,
      data: result,
      ...(errors.length > 0 && { errors }),
    }
  } catch (error) {
    console.error("🚀 ~ getAllTrainerChartsDataWithErrorHandling ~ error:", error)
    return {
      success: false,
      error: "Không thể lấy dữ liệu biểu đồ huấn luyện viên",
    }
  }
}
