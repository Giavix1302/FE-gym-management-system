import { create } from "zustand"
import useUserStore from "./useUserStore"

const useChatStore = create((set, get) => ({
  // State
  conversations: [],
  currentConversation: null,
  messages: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  typingUsers: [], // Users currently typing
  onlineUsers: [],

  // Actions
  setConversations: (conversations) => set({ conversations }),

  setCurrentConversation: (conversation) =>
    set({
      currentConversation: conversation,
      messages: [], // Clear messages when switching conversation
    }),

  setMessages: (messages) => set({ messages }),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  updateMessage: (messageId, updates) =>
    set((state) => ({
      messages: state.messages.map((msg) => (msg._id === messageId ? { ...msg, ...updates } : msg)),
    })),

  markMessagesAsRead: (messageIds) =>
    set((state) => ({
      messages: state.messages.map((msg) => (messageIds.includes(msg._id) ? { ...msg, isRead: true } : msg)),
    })),

  setUnreadCount: (count) => set({ unreadCount: count }),

  updateConversationLastMessage: (conversationId, lastMessage, lastMessageAt) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv._id === conversationId ? { ...conv, lastMessage, lastMessageAt } : conv,
      ),
    })),

  addConversation: (conversation) =>
    set((state) => ({
      conversations: [conversation, ...state.conversations],
    })),

  updateConversationUnreadCount: (conversationId, count) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv._id === conversationId ? { ...conv, unreadCount: count } : conv,
      ),
    })),

  setTypingUsers: (users) => set({ typingUsers: users }),

  addTypingUser: (user) =>
    set((state) => ({
      typingUsers: [...state.typingUsers.filter((u) => u.userId !== user.userId), user],
    })),

  removeTypingUser: (userId) =>
    set((state) => ({
      typingUsers: state.typingUsers.filter((u) => u.userId !== userId),
    })),

  setOnlineUsers: (users) => set({ onlineUsers: users }),

  // ✅ SỬA: Cập nhật để xử lý cấu trúc conversation mới
  updateUserOnlineStatus: (userId, isOnline) =>
    set((state) => {
      return {
        conversations: state.conversations.map((conv) => {
          // Cập nhật online status cho userInfo
          if (conv.userInfo && conv.userInfo.userId === userId) {
            return {
              ...conv,
              userInfo: { ...conv.userInfo, isOnline },
            }
          }
          // Cập nhật online status cho trainerInfo
          if (conv.trainerInfo && conv.trainerInfo.trainerId === userId) {
            return {
              ...conv,
              trainerInfo: { ...conv.trainerInfo, isOnline },
            }
          }
          return conv
        }),
        onlineUsers: isOnline
          ? [...state.onlineUsers.filter((id) => id !== userId), userId]
          : state.onlineUsers.filter((id) => id !== userId),
      }
    }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  reset: () =>
    set({
      conversations: [],
      currentConversation: null,
      messages: [],
      unreadCount: 0,
      isLoading: false,
      error: null,
      typingUsers: [],
      onlineUsers: [],
    }),

  // Computed getters
  getCurrentConversationMessages: () => {
    const state = get()
    return state.messages
  },

  // ✅ SỬA: Cập nhật để xử lý cấu trúc conversation mới
  getUnreadMessagesInCurrentConversation: () => {
    const state = get()
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    const currentUserId = user._id
    return state.messages.filter((msg) => !msg.isRead && msg.senderId !== currentUserId)
  },

  isUserOnline: (userId) => {
    const state = get()
    return state.onlineUsers.includes(userId)
  },

  getTypingUsersInCurrentConversation: () => {
    const state = get()
    if (!state.currentConversation) return []
    return state.typingUsers.filter((user) => user.conversationId === state.currentConversation._id)
  },

  // ✅ THÊM: Helper function để lấy participant từ conversation
  getParticipant: (conversation) => {
    if (!conversation || !conversation.userInfo || !conversation.trainerInfo) return null
    const role = useUserStore.getState().user.role

    if (role === "user") {
      return {
        _id: conversation.trainerInfo.trainerId,
        fullName: conversation.trainerInfo.fullName,
        avatar: conversation.trainerInfo.avatar,
        isOnline: conversation.trainerInfo.isOnline,
      }
    } else {
      return {
        _id: conversation.userInfo.userId,
        fullName: conversation.userInfo.fullName,
        avatar: conversation.userInfo.avatar,
        isOnline: conversation.userInfo.isOnline,
      }
    }
  },
}))

export default useChatStore
