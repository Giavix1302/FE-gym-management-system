import { create } from "zustand"
import { persist } from "zustand/middleware"

const useListUserForAdminStore = create(
  persist(
    (set, get) => ({
      listUsers: [],
      loading: false,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalUsers: 0,
        limit: 20,
        hasNext: false,
        hasPrev: false,
      },

      // Set danh sách users
      setListUsers: (users) =>
        set(() => ({
          listUsers: users,
        })),

      // Set thông tin pagination
      setPagination: (pagination) =>
        set(() => ({
          pagination,
        })),

      // Set loading state
      setLoading: (loading) =>
        set(() => ({
          loading,
        })),

      // Thêm user mới vào đầu danh sách
      addUser: (user) =>
        set((state) => ({
          listUsers: [user, ...state.listUsers],
          pagination: {
            ...state.pagination,
            totalUsers: state.pagination.totalUsers + 1,
          },
        })),

      // Cập nhật thông tin user
      updateUser: (id, fields) =>
        set((state) => ({
          listUsers: state.listUsers.map((user) =>
            user._id === id
              ? {
                  ...user,
                  // Merge deep cho subscriptions nếu có
                  subscriptions: fields.subscriptions || user.subscriptions,
                  // Merge deep cho attendances nếu có
                  attendances: fields.attendances || user.attendances,
                  // Merge deep cho booking nếu có
                  booking: fields.booking || user.booking,
                  // Merge các field khác
                  ...fields,
                }
              : user,
          ),
        })),

      // Soft delete user (đánh dấu isDeleted = true)
      softDeleteUser: (id) =>
        set((state) => ({
          listUsers: state.listUsers.map((user) =>
            user._id === id
              ? {
                  ...user,
                  isDeleted: true,
                  status: "deleted",
                }
              : user,
          ),
        })),

      // Khôi phục user đã xóa
      restoreUser: (id) =>
        set((state) => ({
          listUsers: state.listUsers.map((user) =>
            user._id === id
              ? {
                  ...user,
                  isDeleted: false,
                  status: "active",
                }
              : user,
          ),
        })),

      // Xóa user khỏi danh sách (hard delete - chỉ dùng trong trường hợp cần thiết)
      removeUser: (id) =>
        set((state) => ({
          listUsers: state.listUsers.filter((user) => user._id !== id),
          pagination: {
            ...state.pagination,
            totalUsers: Math.max(0, state.pagination.totalUsers - 1),
          },
        })),

      // Thêm subscription cho user
      addUserSubscription: (userId, subscription) =>
        set((state) => ({
          listUsers: state.listUsers.map((user) =>
            user._id === userId
              ? {
                  ...user,
                  subscriptions: [...(user.subscriptions || []), subscription],
                }
              : user,
          ),
        })),

      // Cập nhật subscription của user
      updateUserSubscription: (userId, subscriptionId, fields) =>
        set((state) => ({
          listUsers: state.listUsers.map((user) =>
            user._id === userId
              ? {
                  ...user,
                  subscriptions: (user.subscriptions || []).map((sub) =>
                    sub._id === subscriptionId ? { ...sub, ...fields } : sub,
                  ),
                }
              : user,
          ),
        })),

      // Thêm attendance cho user
      addUserAttendance: (userId, attendance) =>
        set((state) => ({
          listUsers: state.listUsers.map((user) =>
            user._id === userId
              ? {
                  ...user,
                  attendances: [...(user.attendances || []), attendance],
                }
              : user,
          ),
        })),

      // Thêm booking cho user
      addUserBooking: (userId, booking) =>
        set((state) => ({
          listUsers: state.listUsers.map((user) =>
            user._id === userId
              ? {
                  ...user,
                  booking: [...(user.booking || []), booking],
                }
              : user,
          ),
        })),

      // Cập nhật booking của user
      updateUserBooking: (userId, bookingId, fields) =>
        set((state) => ({
          listUsers: state.listUsers.map((user) =>
            user._id === userId
              ? {
                  ...user,
                  booking: (user.booking || []).map((book) => (book._id === bookingId ? { ...book, ...fields } : book)),
                }
              : user,
          ),
        })),

      // Tìm user theo ID
      getUserById: (id) => {
        const state = get()
        return state.listUsers.find((user) => user._id === id)
      },

      // Lấy users active (chưa bị xóa)
      getActiveUsers: () => {
        const state = get()
        return state.listUsers.filter((user) => !user.isDeleted)
      },

      // Lấy users đã bị xóa
      getDeletedUsers: () => {
        const state = get()
        return state.listUsers.filter((user) => user.isDeleted)
      },

      // Lấy users có subscription active
      getUsersWithActiveSubscription: () => {
        const state = get()
        const now = new Date()
        return state.listUsers.filter((user) => {
          if (!user.subscriptions || user.subscriptions.length === 0) return false
          return user.subscriptions.some((sub) => {
            const endDate = new Date(sub.endDate)
            return sub.status === "active" && endDate > now
          })
        })
      },

      // Reset toàn bộ store
      resetListUsers: () =>
        set({
          listUsers: [],
          loading: false,
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalUsers: 0,
            limit: 20,
            hasNext: false,
            hasPrev: false,
          },
        }),
    }),
    {
      name: "list-user-for-admin-storage", // key in localStorage
      // Chỉ persist danh sách users, không persist loading state
      partialize: (state) => ({
        listUsers: state.listUsers,
        pagination: state.pagination,
      }),
    },
  ),
)

export default useListUserForAdminStore
