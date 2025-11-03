import { axiosInstance } from "./axiosConfig"

// Lấy danh sách notifications của user với pagination và filtering
export const getUserNotificationsAPI = async (userId, params = {}) => {
  const queryParams = new URLSearchParams({
    page: params.page || 1,
    limit: params.limit || 20,
    ...(params.isRead !== undefined && { isRead: params.isRead }),
  }).toString()

  const rep = await axiosInstance.get(`/notifications/user/${userId}?${queryParams}`)
  return rep.data
}

// Lấy số lượng notifications chưa đọc
export const getUnreadNotificationCountAPI = async (userId) => {
  const rep = await axiosInstance.get(`/notifications/user/${userId}/unread-count`)
  return rep.data
}

// Đánh dấu notification là đã đọc
export const markNotificationAsReadAPI = async (notificationId) => {
  const rep = await axiosInstance.patch(`/notifications/${notificationId}/read`)
  return rep.data
}

// Đánh dấu tất cả notifications là đã đọc
export const markAllNotificationsAsReadAPI = async (userId) => {
  const rep = await axiosInstance.patch(`/notifications/user/${userId}/mark-all-read`)
  return rep.data
}

// Xóa notification
export const deleteNotificationAPI = async (notificationId) => {
  const rep = await axiosInstance.delete(`/notifications/${notificationId}`)
  return rep.data
}

// Tạo notification (admin only - ít khi dùng từ FE)
export const createNotificationAPI = async (data) => {
  const rep = await axiosInstance.post("/notifications", data)
  return rep.data
}

// Helper function để format notification data cho UI
export const formatNotificationForUI = (notification) => {
  return {
    ...notification,
    // Format time relative (có thể dùng thư viện như dayjs)
    timeAgo: formatTimeAgo(notification.createdAt),
    // Determine navigation path based on reference
    navigationPath: getNavigationPath(notification.referenceType, notification.referenceId),
  }
}

// Helper function để get navigation path
export const getNavigationPath = (referenceType, referenceId) => {
  switch (referenceType) {
    case "BOOKING":
      return `/bookings/${referenceId}`
    case "MEMBERSHIP":
      return "/subscription"
    case "CLASS":
      return `/classes/sessions/${referenceId}`
    default:
      return "/notifications"
  }
}

// Helper function để format time ago (có thể customize)
export const formatTimeAgo = (timestamp) => {
  const now = Date.now()
  const diff = now - timestamp
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 1) return "Vừa xong"
  if (minutes < 60) return `${minutes} phút trước`
  if (hours < 24) return `${hours} giờ trước`
  if (days < 7) return `${days} ngày trước`

  // Format as date for older notifications
  return new Date(timestamp).toLocaleDateString("vi-VN")
}

// Batch operations
export const batchMarkNotificationsAsReadAPI = async (notificationIds) => {
  const rep = await axiosInstance.patch("/notifications/batch/mark-read", {
    notificationIds,
  })
  return rep.data
}

export const batchDeleteNotificationsAPI = async (notificationIds) => {
  const rep = await axiosInstance.delete("/notifications/batch", {
    data: { notificationIds },
  })
  return rep.data
}
