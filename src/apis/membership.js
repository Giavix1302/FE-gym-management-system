import { axiosInstance } from "./axiosConfig"
import dayjs from "dayjs"
// import { formatPhoneNumber } from "~/utils/common"

// =================================================================================
// MEMBERSHIP CRUD APIs
// =================================================================================
export const getListMembershipAPI = async () => {
  const rep = await axiosInstance.get("/memberships")
  console.log("🚀 ~ getListMembershipAPI ~ rep:", rep)
  return rep.data
}

export const addMembershipAPI = async (formData) => {
  const rep = await axiosInstance.post("/memberships", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return rep.data
}

export const updateMembershipAPI = async (id, formData) => {
  const rep = await axiosInstance.put("/memberships/" + id, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return rep.data
}

export const deleteMembershipAPI = async (id) => {
  const rep = await axiosInstance.delete("/memberships/" + id)
  return rep.data
}

// =================================================================================
// MEMBERSHIP ANALYTICS/STATISTICS APIs
// =================================================================================

/**
 * Lấy tổng quan membership (4 cards)
 * @param {object} params - { startDate?, endDate? }
 * @returns {Promise} { totalRevenue, totalActive, newMemberships, renewalRate }
 */
export const getMembershipOverviewAPI = async (params = {}) => {
  const { startDate, endDate } = params

  const queryParams = new URLSearchParams()
  if (startDate) queryParams.append("startDate", startDate)
  if (endDate) queryParams.append("endDate", endDate)

  const queryString = queryParams.toString()
  const url = `/memberships/analytics/overview${queryString ? `?${queryString}` : ""}`

  const rep = await axiosInstance.get(url)
  return rep.data
}

/**
 * Lấy dữ liệu biểu đồ doanh thu membership
 * @param {object} params - { startDate, endDate, groupBy? }
 * @returns {Promise} [{ period, revenue, count }]
 */
export const getMembershipRevenueChartAPI = async (params) => {
  const { startDate, endDate, groupBy = "day" } = params

  if (!startDate || !endDate) {
    throw new Error("startDate and endDate are required")
  }

  const queryParams = new URLSearchParams({
    startDate,
    endDate,
    groupBy,
  })

  const rep = await axiosInstance.get(`/memberships/analytics/revenue-chart?${queryParams.toString()}`)
  return rep.data
}

/**
 * Lấy dữ liệu biểu đồ xu hướng membership
 * @param {object} params - { startDate, endDate, groupBy? }
 * @returns {Promise} [{ period, newSubscriptions, expiredSubscriptions }]
 */
export const getMembershipTrendsChartAPI = async (params) => {
  const { startDate, endDate, groupBy = "day" } = params

  if (!startDate || !endDate) {
    throw new Error("startDate and endDate are required")
  }

  const queryParams = new URLSearchParams({
    startDate,
    endDate,
    groupBy,
  })

  const rep = await axiosInstance.get(`/memberships/analytics/trends-chart?${queryParams.toString()}`)
  return rep.data
}

/**
 * Lấy tất cả dữ liệu analytics membership (overview + charts)
 * @param {object} params - { startDate, endDate, groupBy? }
 * @returns {Promise} { overview: {...}, charts: { revenue: [...], trends: [...] } }
 */
export const getMembershipAnalyticsAPI = async (params) => {
  const { startDate, endDate, groupBy = "day" } = params

  if (!startDate || !endDate) {
    throw new Error("startDate and endDate are required")
  }

  const queryParams = new URLSearchParams({
    startDate,
    endDate,
    groupBy,
  })

  const rep = await axiosInstance.get(`/memberships/analytics/all?${queryParams.toString()}`)
  return rep.data
}

// =================================================================================
// HELPER FUNCTIONS FOR FRONTEND
// =================================================================================

/**
 * Format thời gian cho API call từ Date object
 * @param {Date} date
 * @returns {string} ISO date string
 */
export const formatDateForAPI = (date) => {
  if (!date) return null
  return date.toISOString()
}

/**
 * Helper function cho việc gọi analytics với date range từ frontend
 * @param {object} params - { timeRange, startDate?, endDate?, groupBy? }
 * @returns {object} Formatted params cho API
 */
export const formatAnalyticsParams = (params) => {
  const { timeRange, startDate, endDate, groupBy = "day" } = params

  let formattedStartDate, formattedEndDate

  // Nếu có custom date range
  if (timeRange === "custom" && startDate && endDate) {
    // Convert to dayjs if not already
    const start = dayjs(startDate)
    const end = dayjs(endDate)
    formattedStartDate = start.startOf("day").toISOString()
    formattedEndDate = end.endOf("day").toISOString()
  } else {
    // Xử lý các preset time ranges - sử dụng 2025 dates
    const currentDate = dayjs("2025-11-24")

    switch (timeRange) {
      case "today":
        formattedStartDate = currentDate.startOf("day").toISOString()
        formattedEndDate = currentDate.endOf("day").toISOString()
        break
      case "7days":
        formattedStartDate = currentDate.subtract(6, "day").startOf("day").toISOString()
        formattedEndDate = currentDate.endOf("day").toISOString()
        break
      case "30days":
        formattedStartDate = currentDate.subtract(29, "day").startOf("day").toISOString()
        formattedEndDate = currentDate.endOf("day").toISOString()
        break
      case "3months":
        formattedStartDate = currentDate.subtract(3, "month").startOf("day").toISOString()
        formattedEndDate = currentDate.endOf("day").toISOString()
        break
      case "6months":
        formattedStartDate = currentDate.subtract(6, "month").startOf("day").toISOString()
        formattedEndDate = currentDate.endOf("day").toISOString()
        break
      default:
        // Mặc định 30 ngày
        formattedStartDate = currentDate.subtract(29, "day").startOf("day").toISOString()
        formattedEndDate = currentDate.endOf("day").toISOString()
    }
  }

  return {
    startDate: formattedStartDate,
    endDate: formattedEndDate,
    groupBy,
  }
}
