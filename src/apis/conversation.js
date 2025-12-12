import { axiosInstance } from "./axiosConfig"

// Get all conversations for current user
export const getConversationsAPI = async (userId, page = 1, limit = 20, role) => {
  console.log("🚀 ~ getConversationsAPI ~ userId:", userId)
  console.log("🚀 ~ getConversationsAPI ~ role:", role)
  try {
    const response = await axiosInstance.get(`/conversations/${userId}?page=${page}&limit=${limit}&role=${role}`)
    console.log("🚀 ~ getConversationsAPI ~ response:", response)
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

//
// Create or get conversation
export const createOrGetConversationAPI = async (data) => {
  try {
    const response = await axiosInstance.post("/conversations", data)
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

export const getMessagesAPI = async (conversationId, page = 1, limit = 50, role) => {
  console.log(
    "🚀 ~ getMessagesAPI ~ conversationId, page = 1, limit = 50, role:",
    conversationId,
    (page = 1),
    (limit = 50),
    role,
  )
  try {
    const response = await axiosInstance.get(
      `/conversations/${conversationId}/messages?page=${page}&limit=${limit}&role=${role}`,
    )
    console.log("🚀 ~ getMessagesAPI ~ response:", response)
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

// Send message - ✅ THÊM role vào query parameter
export const sendMessageAPI = async (conversationId, content, role) => {
  console.log("🚀 ~ sendMessageAPI ~ conversationId, content, role:", conversationId, content, role)
  try {
    const response = await axiosInstance.post(`/conversations/${conversationId}/messages?role=${role}`, { content })
    console.log("🚀 ~ sendMessageAPI ~ response:", response)
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

// Mark messages as read - ✅ THÊM role vào query parameter
export const markMessagesAsReadAPI = async (conversationId, messageIds, role) => {
  try {
    const response = await axiosInstance.put(`/conversations/${conversationId}/messages/read?role=${role}`, {
      messageIds,
    })
    console.log("🚀 ~ markMessagesAsReadAPI ~ response:", response)
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

// Get unread count
export const getUnreadCountAPI = async () => {
  try {
    const response = await axiosInstance.get("/conversations/unread-count")
    console.log("🚀 ~ getUnreadCountAPI ~ response:", response)
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}
