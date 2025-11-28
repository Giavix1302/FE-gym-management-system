import { axiosInstance } from "./axiosConfig"
// import { formatPhoneNumber } from "~/utils/common"

export const createLinkVnpayAPI = async (subId) => {
  const rep = await axiosInstance.post("/payments/vnpay/subscription/" + subId)
  return rep.data
}

export const createLinkVnpayBookingPaymentAPI = async (data) => {
  console.log("🚀 ~ createLinkVnpayBookingPaymentAPI ~ data:", data)
  const rep = await axiosInstance.post("/payments/vnpay/booking", data)
  return rep.data
}

export const createLinkVnpayClassPaymentAPI = async (data) => {
  const rep = await axiosInstance.post("/payments/vnpay/class", data)
  return rep.data
}

// Lấy danh sách payment theo userId
export const getPaymentsByUserIdAPI = async (userId, page = 1, limit = 10) => {
  const rep = await axiosInstance.get(`/payments/user/${userId}?page=${page}&limit=${limit}`)
  return rep.data
}

// Lấy danh sách tất cả payment cho admin
export const getAllPaymentsForAdminAPI = async (page = 1, limit = 10) => {
  const rep = await axiosInstance.get(`/payments/admin/all?page=${page}&limit=${limit}`)
  return rep.data
}

/**
 * ============================================
 * PAYMENT STATISTICS APIs
 * ============================================
 */

/**
 * Lấy TẤT CẢ thống kê payments cùng lúc (4 cards + 4 charts)
 * @param {Object} params - { startDate, endDate, groupBy }
 * @returns {Promise} { success, data: { overview, charts } }
 */
export const getAllPaymentStatisticsAPI = async (params = {}) => {
  const { startDate, endDate, groupBy = "day" } = params

  const queryParams = new URLSearchParams()
  if (startDate) queryParams.append("startDate", startDate)
  if (endDate) queryParams.append("endDate", endDate)
  queryParams.append("groupBy", groupBy)

  const rep = await axiosInstance.get(`/payments/statistics/all?${queryParams.toString()}`)
  return rep.data
}

/**
 * Lấy 4 cards tổng quan
 * @param {Object} params - { startDate, endDate }
 * @returns {Promise} { success, data: { totalRevenue, successfulTransactions, averageTransactionAmount, totalRefunded } }
 */
export const getPaymentOverviewStatsAPI = async (params = {}) => {
  const { startDate, endDate } = params

  const queryParams = new URLSearchParams()
  if (startDate) queryParams.append("startDate", startDate)
  if (endDate) queryParams.append("endDate", endDate)

  const rep = await axiosInstance.get(`/payments/statistics/overview?${queryParams.toString()}`)
  return rep.data
}

/**
 * Chart 1: Lấy doanh thu theo loại thanh toán (membership/booking/class)
 * @param {Object} params - { startDate, endDate }
 * @returns {Promise} { success, data: [{ paymentType, paymentTypeName, totalRevenue, transactionCount, averageAmount }] }
 */
export const getPaymentRevenueByTypeAPI = async (params = {}) => {
  const { startDate, endDate } = params

  const queryParams = new URLSearchParams()
  if (startDate) queryParams.append("startDate", startDate)
  if (endDate) queryParams.append("endDate", endDate)

  const rep = await axiosInstance.get(`/payments/statistics/revenue-by-type?${queryParams.toString()}`)
  return rep.data
}

/**
 * Chart 2: Lấy xu hướng doanh thu theo thời gian
 * @param {Object} params - { startDate, endDate, groupBy }
 * @returns {Promise} { success, data: [{ label, totalRevenue, transactionCount, averageAmount }] }
 */
export const getPaymentRevenueTrendAPI = async (params = {}) => {
  const { startDate, endDate, groupBy = "day" } = params

  const queryParams = new URLSearchParams()
  if (startDate) queryParams.append("startDate", startDate)
  if (endDate) queryParams.append("endDate", endDate)
  queryParams.append("groupBy", groupBy)

  const rep = await axiosInstance.get(`/payments/statistics/revenue-trend?${queryParams.toString()}`)
  return rep.data
}

/**
 * Chart 3: Lấy phân bố phương thức thanh toán (cash/bank/momo/vnpay)
 * @param {Object} params - { startDate, endDate }
 * @returns {Promise} { success, data: [{ paymentMethod, paymentMethodName, totalAmount, transactionCount, percentageByAmount, percentageByCount }] }
 */
export const getPaymentMethodDistributionAPI = async (params = {}) => {
  const { startDate, endDate } = params

  const queryParams = new URLSearchParams()
  if (startDate) queryParams.append("startDate", startDate)
  if (endDate) queryParams.append("endDate", endDate)

  const rep = await axiosInstance.get(`/payments/statistics/payment-methods?${queryParams.toString()}`)
  return rep.data
}

/**
 * Chart 4: Lấy trạng thái thanh toán theo thời gian (paid/unpaid/refunded)
 * @param {Object} params - { startDate, endDate, groupBy }
 * @returns {Promise} { success, data: [{ label, paid, unpaid, refunded, total, paidAmount, refundedAmount }] }
 */
export const getPaymentStatusOverTimeAPI = async (params = {}) => {
  const { startDate, endDate, groupBy = "day" } = params

  const queryParams = new URLSearchParams()
  if (startDate) queryParams.append("startDate", startDate)
  if (endDate) queryParams.append("endDate", endDate)
  queryParams.append("groupBy", groupBy)

  const rep = await axiosInstance.get(`/payments/statistics/status-over-time?${queryParams.toString()}`)
  return rep.data
}

/**
 * Bonus: Lấy top khách hàng chi tiêu nhiều nhất
 * @param {Object} params - { startDate, endDate, limit }
 * @returns {Promise} { success, data: [{ userName, userEmail, totalSpent, transactionCount, averageAmount }] }
 */
export const getTopSpendingCustomersAPI = async (params = {}) => {
  const { startDate, endDate, limit = 10 } = params

  const queryParams = new URLSearchParams()
  if (startDate) queryParams.append("startDate", startDate)
  if (endDate) queryParams.append("endDate", endDate)
  queryParams.append("limit", limit)

  const rep = await axiosInstance.get(`/payments/statistics/top-customers?${queryParams.toString()}`)
  return rep.data
}
