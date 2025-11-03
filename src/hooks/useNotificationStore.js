import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getUserNotificationsAPI,
  getUnreadNotificationCountAPI,
  markNotificationAsReadAPI,
  markAllNotificationsAsReadAPI,
  deleteNotificationAPI,
  formatTimeAgo,
  getNavigationPath,
} from "../apis/notification"
import useUserStore from "~/stores/useUserStore"

// Hook để lấy danh sách notifications
export const useNotifications = (params = {}) => {
  const { user } = useUserStore()
  const userId = user?._id

  return useQuery({
    queryKey: ["notifications", userId, params],
    queryFn: () => getUserNotificationsAPI(userId, params),
    enabled: !!userId, // Chỉ chạy khi có userId
    refetchInterval: 30000, // Refresh mỗi 30 giây
    staleTime: 10000, // Data cũ sau 10 giây
    select: (data) => {
      // Transform data để add thêm properties cho UI
      return {
        ...data,
        notifications:
          data.notifications?.map((notification) => ({
            ...notification,
            timeAgo: formatTimeAgo(notification.createdAt),
            navigationPath: getNavigationPath(notification.referenceType, notification.referenceId),
          })) || [],
      }
    },
  })
}

// Hook để lấy unread count
export const useUnreadNotificationCount = () => {
  const { user } = useUserStore()
  const userId = user?._id

  return useQuery({
    queryKey: ["notifications", "unread", userId],
    queryFn: () => getUnreadNotificationCountAPI(userId),
    enabled: !!userId,
    refetchInterval: 30000, // Refresh mỗi 30 giây để update badge
    staleTime: 10000,
    select: (data) => data?.count || 0,
  })
}

// Hook để mark notification as read
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient()
  const { user } = useUserStore()
  const userId = user?._id

  return useMutation({
    mutationFn: markNotificationAsReadAPI,
    onSuccess: () => {
      // Invalidate và refetch notifications
      queryClient.invalidateQueries(["notifications", userId])
      queryClient.invalidateQueries(["notifications", "unread", userId])
    },
    onError: (error) => {
      console.error("Failed to mark notification as read:", error)
    },
  })
}

// Hook để mark all notifications as read
export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient()
  const { user } = useUserStore()
  const userId = user?._id

  return useMutation({
    mutationFn: () => markAllNotificationsAsReadAPI(userId),
    onSuccess: () => {
      // Invalidate và refetch notifications
      queryClient.invalidateQueries(["notifications", userId])
      queryClient.invalidateQueries(["notifications", "unread", userId])
    },
    onError: (error) => {
      console.error("Failed to mark all notifications as read:", error)
    },
  })
}

// Hook để delete notification
export const useDeleteNotification = () => {
  const queryClient = useQueryClient()
  const { user } = useUserStore()
  const userId = user?._id

  return useMutation({
    mutationFn: deleteNotificationAPI,
    onSuccess: () => {
      // Invalidate và refetch notifications
      queryClient.invalidateQueries(["notifications", userId])
      queryClient.invalidateQueries(["notifications", "unread", userId])
    },
    onError: (error) => {
      console.error("Failed to delete notification:", error)
    },
  })
}

// Hook để prefetch notifications (có thể dùng khi hover vào notification icon)
export const usePrefetchNotifications = () => {
  const queryClient = useQueryClient()
  const { user } = useUserStore()
  const userId = user?._id

  const prefetchNotifications = (params = {}) => {
    if (!userId) return

    queryClient.prefetchQuery({
      queryKey: ["notifications", userId, params],
      queryFn: () => getUserNotificationsAPI(userId, params),
      staleTime: 10000,
    })
  }

  return { prefetchNotifications }
}

// Hook để get cached unread count (không trigger network request)
export const useCachedUnreadCount = () => {
  const queryClient = useQueryClient()
  const { user } = useUserStore()
  const userId = user?._id

  const getCachedCount = () => {
    const cached = queryClient.getQueryData(["notifications", "unread", userId])
    return cached?.count || 0
  }

  return { getCachedCount }
}
