import { axiosInstance } from "./axiosConfig"

// POST /progress - Tạo mới progress record
export const createProgressAPI = async (data) => {
  const rep = await axiosInstance.post("/progress", data)
  return rep.data
}

// GET /progress/:userId - Lấy tất cả progress records của user
export const getAllProgressByUserIdAPI = async (userId, options = {}) => {
  const { sortBy, sortOrder, limit, skip } = options
  const params = new URLSearchParams()

  if (sortBy) params.append("sortBy", sortBy)
  if (sortOrder) params.append("sortOrder", sortOrder)
  if (limit) params.append("limit", limit)
  if (skip) params.append("skip", skip)

  const queryString = params.toString()
  const url = queryString ? `/progress/${userId}?${queryString}` : `/progress/${userId}`

  const rep = await axiosInstance.get(url)
  return rep.data
}

// GET /progress/detail/:id - Lấy chi tiết một progress record
export const getProgressDetailAPI = async (progressId) => {
  const rep = await axiosInstance.get(`/progress/detail/${progressId}`)
  return rep.data
}

// PUT /progress/:id - Cập nhật progress record
export const updateProgressAPI = async (progressId, data) => {
  const rep = await axiosInstance.put(`/progress/${progressId}`, data)
  return rep.data
}

// DELETE /progress/:id - Xóa progress record
export const deleteProgressAPI = async (progressId) => {
  console.log("🚀 ~ deleteProgressAPI ~ progressId:", progressId)
  const rep = await axiosInstance.delete(`/progress/${progressId}`)
  return rep.data
}

// GET /progress/latest/:userId - Lấy progress record mới nhất
export const getLatestProgressAPI = async (userId) => {
  const rep = await axiosInstance.get(`/progress/latest/${userId}`)
  return rep.data
}

// GET /progress/trend/:userId - Lấy dữ liệu xu hướng thay đổi
export const getTrendDataAPI = async (userId, timeRange = 30) => {
  const rep = await axiosInstance.get(`/progress/trend/${userId}?timeRange=${timeRange}`)
  return rep.data
}

// GET /progress/comparison/:userId - So sánh với lần đo trước
export const getComparisonDataAPI = async (userId) => {
  const rep = await axiosInstance.get(`/progress/comparison/${userId}`)
  return rep.data
}

// GET /progress/statistics/:userId - Thống kê tổng quan
export const getStatisticsAPI = async (userId) => {
  const rep = await axiosInstance.get(`/progress/statistics/${userId}`)
  return rep.data
}

// GET /progress/dashboard/:userId - Lấy tất cả dữ liệu cho dashboard
export const getDashboardDataAPI = async (userId) => {
  const rep = await axiosInstance.get(`/progress/dashboard/${userId}`)
  return rep.data
}

// Helper functions để sử dụng dễ dàng hơn

// Lấy progress với pagination
export const getProgressWithPaginationAPI = async (
  userId,
  page = 1,
  pageSize = 10,
  sortBy = "measurementDate",
  sortOrder = "desc",
) => {
  const skip = (page - 1) * pageSize
  return getAllProgressByUserIdAPI(userId, {
    sortBy,
    sortOrder,
    limit: pageSize,
    skip,
  })
}

// Lấy progress trong khoảng thời gian
export const getProgressInRangeAPI = async (userId, days = 30) => {
  return getTrendDataAPI(userId, days)
}
