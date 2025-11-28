/* eslint-disable no-case-declarations */
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

export const handleLogoutStaff = async (staffId) => {
  const rep = await axiosInstance.put("/staffs/" + staffId + "/logout")
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

// ==================== STAFF STATISTICS API FUNCTIONS ====================

// 1. Lấy tổng quan thống kê nhân viên (4 cards)
export const getStaffOverviewAPI = async (params = {}) => {
  const { startDate, endDate } = params

  const queryParams = new URLSearchParams()
  if (startDate) queryParams.append("startDate", startDate)
  if (endDate) queryParams.append("endDate", endDate)

  const queryString = queryParams.toString()
  const url = queryString ? `/staffs/statistics/overview?${queryString}` : `/staffs/statistics/overview`

  const rep = await axiosInstance.get(url)
  return rep.data
}

// 2. Lấy biểu đồ số giờ làm việc theo nhân viên
export const getWorkingHoursByStaffAPI = async (params = {}) => {
  const { startDate, endDate, limit = 10 } = params

  const queryParams = new URLSearchParams()
  if (startDate) queryParams.append("startDate", startDate)
  if (endDate) queryParams.append("endDate", endDate)
  queryParams.append("limit", limit.toString())

  const queryString = queryParams.toString()
  const url = `/staffs/statistics/working-hours-by-staff?${queryString}`

  const rep = await axiosInstance.get(url)
  return rep.data
}

// 3. Lấy xu hướng check-in theo thời gian
export const getCheckinTrendAPI = async (params = {}) => {
  const { startDate, endDate, groupBy = "day" } = params

  const queryParams = new URLSearchParams()
  if (startDate) queryParams.append("startDate", startDate)
  if (endDate) queryParams.append("endDate", endDate)
  queryParams.append("groupBy", groupBy)

  const queryString = queryParams.toString()
  const url = `/staffs/statistics/checkin-trend?${queryString}`

  const rep = await axiosInstance.get(url)
  return rep.data
}

// 4. Lấy top nhân viên làm việc nhiều nhất
export const getTopWorkingStaffAPI = async (params = {}) => {
  const { startDate, endDate, limit = 10 } = params

  const queryParams = new URLSearchParams()
  if (startDate) queryParams.append("startDate", startDate)
  if (endDate) queryParams.append("endDate", endDate)
  queryParams.append("limit", limit.toString())

  const queryString = queryParams.toString()
  const url = `/staffs/statistics/top-working-staff?${queryString}`

  const rep = await axiosInstance.get(url)
  return rep.data
}

// 5. Lấy chi phí lương theo location
export const getSalaryCostByLocationAPI = async (params = {}) => {
  const { startDate, endDate } = params

  const queryParams = new URLSearchParams()
  if (startDate) queryParams.append("startDate", startDate)
  if (endDate) queryParams.append("endDate", endDate)

  const queryString = queryParams.toString()
  const url = queryString
    ? `/staffs/statistics/salary-cost-by-location?${queryString}`
    : `/staffs/statistics/salary-cost-by-location`

  const rep = await axiosInstance.get(url)
  return rep.data
}

// ==================== HELPER FUNCTIONS FOR STATISTICS ====================

// Format date range cho API calls
export const formatDateRange = (startDate, endDate) => {
  const formatDate = (date) => {
    if (!date) return null
    if (typeof date === "string") return date
    return date.toISOString().split("T")[0] // Convert to YYYY-MM-DD format
  }

  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  }
}

// Lấy date range cho các khoảng thời gian phổ biến
export const getDateRanges = () => {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)

  const lastWeek = new Date(today)
  lastWeek.setDate(today.getDate() - 7)

  const lastMonth = new Date(today)
  lastMonth.setMonth(today.getMonth() - 1)

  const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1)

  const lastYear = new Date(today)
  lastYear.setFullYear(today.getFullYear() - 1)

  return {
    today: formatDateRange(today, today),
    yesterday: formatDateRange(yesterday, yesterday),
    last7Days: formatDateRange(lastWeek, today),
    last30Days: formatDateRange(lastMonth, today),
    thisMonth: formatDateRange(thisMonth, today),
    lastYear: formatDateRange(lastYear, today),
  }
}

// Tổng hợp tất cả statistics cho dashboard
export const getAllStaffStatisticsAPI = async (params = {}) => {
  try {
    const [overview, workingHours, checkinTrend, topStaff, salaryCost] = await Promise.all([
      getStaffOverviewAPI(params),
      getWorkingHoursByStaffAPI({ ...params, limit: 10 }),
      getCheckinTrendAPI({ ...params, groupBy: "day" }),
      getTopWorkingStaffAPI({ ...params, limit: 10 }),
      getSalaryCostByLocationAPI(params),
    ])

    return {
      success: true,
      message: "Get all staff statistics successfully",
      data: {
        overview: overview.data,
        workingHours: workingHours.data,
        checkinTrend: checkinTrend.data,
        topStaff: topStaff.data,
        salaryCost: salaryCost.data,
      },
    }
  } catch (error) {
    return {
      success: false,
      message: "Failed to fetch staff statistics",
      error: error.message,
    }
  }
}

// Validate parameters cho statistics APIs
export const validateStatisticsParams = (params) => {
  const errors = []

  // Validate dates if provided
  if (params.startDate && isNaN(Date.parse(params.startDate))) {
    errors.push("startDate must be a valid date string")
  }

  if (params.endDate && isNaN(Date.parse(params.endDate))) {
    errors.push("endDate must be a valid date string")
  }

  // Validate date range
  if (params.startDate && params.endDate && new Date(params.startDate) > new Date(params.endDate)) {
    errors.push("startDate must be before endDate")
  }

  // Validate limit
  if (params.limit && (isNaN(params.limit) || params.limit < 1 || params.limit > 100)) {
    errors.push("limit must be a number between 1 and 100")
  }

  // Validate groupBy
  if (params.groupBy && !["day", "week", "month"].includes(params.groupBy)) {
    errors.push("groupBy must be one of: day, week, month")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// ==================== PERSONAL STAFF STATISTICS API FUNCTIONS ====================

/**
 * Lấy thống kê tổng quan cá nhân (3 cards)
 * @param {string} staffId - ID của nhân viên
 * @param {Object} params - { startDate, endDate }
 * @returns {Promise} API response
 */
export const getMyStatisticsAPI = async (staffId, params = {}) => {
  const { startDate, endDate } = params

  const queryParams = new URLSearchParams()
  if (startDate) queryParams.append("startDate", startDate)
  if (endDate) queryParams.append("endDate", endDate)

  const queryString = queryParams.toString()
  const url = queryString
    ? `/staffs/${staffId}/my-statistics/overview?${queryString}`
    : `/staffs/${staffId}/my-statistics/overview`

  const rep = await axiosInstance.get(url)
  return rep.data
}

/**
 * Lấy biểu đồ giờ làm việc cá nhân
 * @param {string} staffId - ID của nhân viên
 * @param {Object} params - { startDate, endDate, groupBy }
 * @returns {Promise} API response
 */
export const getMyWorkingHoursChartAPI = async (staffId, params = {}) => {
  const { startDate, endDate, groupBy = "week" } = params

  const queryParams = new URLSearchParams()
  if (startDate) queryParams.append("startDate", startDate)
  if (endDate) queryParams.append("endDate", endDate)
  queryParams.append("groupBy", groupBy)

  const queryString = queryParams.toString()
  const url = `/staffs/${staffId}/my-statistics/working-hours?${queryString}`

  const rep = await axiosInstance.get(url)
  return rep.data
}

/**
 * Lấy biểu đồ thu nhập cá nhân
 * @param {string} staffId - ID của nhân viên
 * @param {Object} params - { startDate, endDate, groupBy }
 * @returns {Promise} API response
 */
export const getMyIncomeChartAPI = async (staffId, params = {}) => {
  const { startDate, endDate, groupBy = "week" } = params

  const queryParams = new URLSearchParams()
  if (startDate) queryParams.append("startDate", startDate)
  if (endDate) queryParams.append("endDate", endDate)
  queryParams.append("groupBy", groupBy)

  const queryString = queryParams.toString()
  const url = `/staffs/${staffId}/my-statistics/income?${queryString}`

  const rep = await axiosInstance.get(url)
  return rep.data
}

/**
 * Lấy tất cả thống kê cá nhân (gọi song song tất cả APIs)
 * @param {string} staffId - ID của nhân viên
 * @param {Object} params - { startDate, endDate, groupBy }
 * @returns {Promise} Tổng hợp tất cả data
 */
export const getAllMyStatisticsAPI = async (staffId, params = {}) => {
  try {
    const [overview, workingHours, income] = await Promise.all([
      getMyStatisticsAPI(staffId, params),
      getMyWorkingHoursChartAPI(staffId, params),
      getMyIncomeChartAPI(staffId, params),
    ])

    return {
      success: true,
      message: "Get all my statistics successfully",
      data: {
        overview: overview.data,
        workingHoursChart: workingHours.data,
        incomeChart: income.data,
      },
    }
  } catch (error) {
    return {
      success: false,
      message: "Failed to fetch my statistics",
      error: error.message,
    }
  }
}

// ==================== HELPER FUNCTIONS FOR PERSONAL STATISTICS ====================

/**
 * Lấy date range mặc định cho tháng hiện tại
 * @returns {Object} { startDate, endDate }
 */
export const getCurrentMonthRange = () => {
  const today = new Date()
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)

  return formatDateRange(firstDay, lastDay)
}

/**
 * Lấy các khoảng thời gian phổ biến cho filter
 * @returns {Object} Object chứa các time ranges
 */
export const getPersonalTimeRanges = () => {
  const today = new Date()

  // Tuần này (bắt đầu từ thứ 2)
  const currentDay = today.getDay()
  const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay
  const thisWeekStart = new Date(today)
  thisWeekStart.setDate(today.getDate() + diffToMonday)
  thisWeekStart.setHours(0, 0, 0, 0)

  // Tuần trước
  const lastWeekStart = new Date(thisWeekStart)
  lastWeekStart.setDate(thisWeekStart.getDate() - 7)
  const lastWeekEnd = new Date(thisWeekStart)
  lastWeekEnd.setDate(thisWeekStart.getDate() - 1)

  // Tháng này
  const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1)

  // Tháng trước
  const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1)
  const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0)

  // 3 tháng gần nhất
  const last3MonthsStart = new Date(today.getFullYear(), today.getMonth() - 2, 1)

  return {
    today: formatDateRange(today, today),
    thisWeek: formatDateRange(thisWeekStart, today),
    lastWeek: formatDateRange(lastWeekStart, lastWeekEnd),
    thisMonth: formatDateRange(thisMonthStart, today),
    lastMonth: formatDateRange(lastMonthStart, lastMonthEnd),
    last3Months: formatDateRange(last3MonthsStart, today),
  }
}

/**
 * Format số tiền theo định dạng VNĐ - FIXED VERSION
 * @param {number} amount - Số tiền
 * @returns {string} Số tiền đã format (VD: 5.000.000 VNĐ)
 */
export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return "0 VNĐ"

  // Convert to number if string
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount

  // Format with Vietnamese locale
  const formatted = new Intl.NumberFormat("vi-VN").format(numAmount)

  return `${formatted} VNĐ`
}

/**
 * Format số giờ làm việc
 * @param {number} hours - Số giờ
 * @returns {string} Số giờ đã format (VD: 160.5 giờ)
 */
export const formatHours = (hours) => {
  if (!hours && hours !== 0) return "0 giờ"

  // Convert to number if string
  const numHours = typeof hours === "string" ? parseFloat(hours) : hours

  return `${numHours.toFixed(1)} giờ`
}

/**
 * Format period label cho biểu đồ
 * @param {string} period - Period string (VD: "2024-W01", "2024-01", "2024-01-15")
 * @param {string} groupBy - 'day' | 'week' | 'month'
 * @returns {string} Label đã format
 */
export const formatPeriodLabel = (period, groupBy) => {
  if (!period) return ""

  switch (groupBy) {
    case "day":
      // Format: 2024-01-15 -> 15/01
      const [year, month, day] = period.split("-")
      return `${day}/${month}`

    case "week":
      // Format: 2024-W01 -> Tuần 1
      const weekNum = period.split("-W")[1]
      return `Tuần ${weekNum}`

    case "month":
      // Format: 2024-01 -> Tháng 1
      const monthNum = period.split("-")[1]
      return `Tháng ${parseInt(monthNum)}`

    default:
      return period
  }
}

/**
 * Validate staffId
 * @param {string} staffId - ID của nhân viên
 * @returns {Object} { isValid, error }
 */
export const validateStaffId = (staffId) => {
  if (!staffId) {
    return {
      isValid: false,
      error: "Staff ID is required",
    }
  }

  // MongoDB ObjectId format check (24 hex characters)
  const objectIdRegex = /^[0-9a-fA-F]{24}$/
  if (!objectIdRegex.test(staffId)) {
    return {
      isValid: false,
      error: "Invalid Staff ID format",
    }
  }

  return {
    isValid: true,
    error: null,
  }
}

/**
 * Validate personal statistics params
 * @param {Object} params - { startDate, endDate, groupBy }
 * @returns {Object} { isValid, errors }
 */
export const validatePersonalStatisticsParams = (params) => {
  const errors = []

  // Validate dates
  if (params.startDate && isNaN(Date.parse(params.startDate))) {
    errors.push("startDate must be a valid date string")
  }

  if (params.endDate && isNaN(Date.parse(params.endDate))) {
    errors.push("endDate must be a valid date string")
  }

  // Validate date range
  if (params.startDate && params.endDate && new Date(params.startDate) > new Date(params.endDate)) {
    errors.push("startDate must be before endDate")
  }

  // Validate groupBy
  if (params.groupBy && !["day", "week", "month"].includes(params.groupBy)) {
    errors.push("groupBy must be one of: day, week, month")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Tạo options cho select time range
 * @returns {Array} Array of time range options
 */
export const getTimeRangeOptions = () => {
  return [
    { value: "today", label: "Hôm nay" },
    { value: "thisWeek", label: "Tuần này" },
    { value: "lastWeek", label: "Tuần trước" },
    { value: "thisMonth", label: "Tháng này" },
    { value: "lastMonth", label: "Tháng trước" },
    { value: "last3Months", label: "3 tháng gần nhất" },
    { value: "custom", label: "Tùy chỉnh" },
  ]
}

/**
 * Lấy date range từ time range option
 * @param {string} timeRange - Time range option value
 * @returns {Object} { startDate, endDate }
 */
export const getDateRangeFromOption = (timeRange) => {
  const ranges = getPersonalTimeRanges()

  switch (timeRange) {
    case "today":
      return ranges.today
    case "thisWeek":
      return ranges.thisWeek
    case "lastWeek":
      return ranges.lastWeek
    case "thisMonth":
      return ranges.thisMonth
    case "lastMonth":
      return ranges.lastMonth
    case "last3Months":
      return ranges.last3Months
    default:
      return getCurrentMonthRange() // Default: tháng hiện tại
  }
}
