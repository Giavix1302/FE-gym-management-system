import { toast } from "react-toastify"
import { axiosPublic, axiosInstance } from "./axiosConfig"

// ========================================
// ANONYMOUS CHATBOT APIs (No Authentication)
// ========================================

/**
 * Send message as anonymous user
 * @param {Object} data - { message: string, anonymousId?: string }
 * @returns {Promise<Object>} Response with bot reply and conversation data
 */
export const chatbotWithAnonymousAPI = async (data) => {
  try {
    const response = await axiosPublic.post("/chatbot/anonymous/message", data)
    return response.data
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || "Lỗi hệ thống"
    toast.error(errorMessage)
    throw err
  }
}

/**
 * Get conversation history for anonymous user
 * @param {string} anonymousId - Anonymous user identifier
 * @returns {Promise<Object>} Conversation history
 */
export const getAnonymousConversationAPI = async (anonymousId) => {
  try {
    const response = await axiosPublic.get(`/chatbot/anonymous/conversation/${anonymousId}`)
    return response.data
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || "Không thể tải lịch sử chat"
    toast.error(errorMessage)
    throw err
  }
}

/**
 * Get quick replies for anonymous users
 * @returns {Promise<Object>} Array of quick reply options
 */
export const getAnonymousQuickRepliesAPI = async () => {
  try {
    const response = await axiosPublic.get("/chatbot/anonymous/quick-replies")
    return response.data
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || "Không thể tải quick replies"
    toast.error(errorMessage)
    throw err
  }
}

/**
 * Check chatbot health status
 * @returns {Promise<Object>} Health status
 */
export const getChatbotHealthAPI = async () => {
  try {
    const response = await axiosPublic.get("/chatbot/health")
    return response.data
  } catch (err) {
    console.error("Chatbot health check failed:", err)
    throw err
  }
}

// ========================================
// AUTHENTICATED CHATBOT APIs (Require Login)
// ========================================

/**
 * Send message as authenticated user
 * @param {Object} data - { message: string }
 * @returns {Promise<Object>} Response with bot reply and conversation data
 */
export const chatbotWithAuthAPI = async (data) => {
  try {
    const response = await axiosInstance.post("/chatbot/message", data)
    return response.data
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || "Lỗi hệ thống"
    toast.error(errorMessage)
    throw err
  }
}

/**
 * Get conversation history for authenticated user
 * @returns {Promise<Object>} Conversation history
 */
export const getAuthConversationAPI = async () => {
  try {
    const response = await axiosInstance.get("/chatbot/conversation")
    return response.data
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || "Không thể tải lịch sử chat"
    toast.error(errorMessage)
    throw err
  }
}

/**
 * Get quick replies for authenticated users
 * @returns {Promise<Object>} Array of quick reply options
 */
export const getAuthQuickRepliesAPI = async () => {
  try {
    const response = await axiosInstance.get("/chatbot/quick-replies")
    return response.data
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || "Không thể tải quick replies"
    toast.error(errorMessage)
    throw err
  }
}

/**
 * Process quick reply action
 * @param {Object} data - { action: string, data?: Object }
 * @returns {Promise<Object>} Bot response
 */
export const processQuickReplyAPI = async (data) => {
  try {
    const response = await axiosInstance.post("/chatbot/quick-replies", data)
    return response.data
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || "Không thể xử lý quick reply"
    toast.error(errorMessage)
    throw err
  }
}

/**
 * Get user's conversations
 * @returns {Promise<Object>} List of user conversations
 */
export const getMyConversationsAPI = async () => {
  try {
    const response = await axiosInstance.get("/chatbot/my/conversations")
    return response.data
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || "Không thể tải danh sách conversations"
    toast.error(errorMessage)
    throw err
  }
}

/**
 * Get user's actions
 * @returns {Promise<Object>} List of user actions
 */
export const getMyActionsAPI = async () => {
  try {
    const response = await axiosInstance.get("/chatbot/my/actions")
    return response.data
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || "Không thể tải danh sách actions"
    toast.error(errorMessage)
    throw err
  }
}

// ========================================
// ADMIN CHATBOT APIs (Require Admin Role)
// ========================================

/**
 * Get all conversations (Admin only)
 * @param {Object} params - { page?, limit?, status? }
 * @returns {Promise<Object>} All conversations with pagination
 */
export const getAllConversationsAPI = async (params = {}) => {
  try {
    const response = await axiosInstance.get("/chatbot/admin/conversations", { params })
    return response.data
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || "Không thể tải conversations"
    toast.error(errorMessage)
    throw err
  }
}

/**
 * Get specific conversation by ID (Admin only)
 * @param {string} conversationId - Conversation ID
 * @returns {Promise<Object>} Conversation details
 */
export const getConversationByIdAPI = async (conversationId) => {
  try {
    const response = await axiosInstance.get(`/chatbot/admin/conversations/${conversationId}`)
    return response.data
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || "Không thể tải conversation"
    toast.error(errorMessage)
    throw err
  }
}

/**
 * Get user conversations (Admin only)
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User conversations
 */
export const getUserConversationsAPI = async (userId) => {
  try {
    const response = await axiosInstance.get(`/chatbot/admin/user/${userId}/conversations`)
    return response.data
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || "Không thể tải user conversations"
    toast.error(errorMessage)
    throw err
  }
}

/**
 * Get user actions (Admin only)
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User actions
 */
export const getUserActionsAPI = async (userId) => {
  try {
    const response = await axiosInstance.get(`/chatbot/admin/user/${userId}/actions`)
    return response.data
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || "Không thể tải user actions"
    toast.error(errorMessage)
    throw err
  }
}

/**
 * Get all actions (Admin only)
 * @param {Object} params - { actionType?, status? }
 * @returns {Promise<Object>} All actions
 */
export const getAllActionsAPI = async (params = {}) => {
  try {
    const response = await axiosInstance.get("/chatbot/admin/actions", { params })
    return response.data
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || "Không thể tải actions"
    toast.error(errorMessage)
    throw err
  }
}

// ========================================
// KNOWLEDGE BASE APIs (Admin only)
// ========================================

/**
 * Get all knowledge base entries (Admin only)
 * @returns {Promise<Object>} Knowledge base entries
 */
export const getAllKnowledgeAPI = async () => {
  try {
    const response = await axiosInstance.get("/chatbot/admin/knowledge")
    return response.data
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || "Không thể tải knowledge base"
    toast.error(errorMessage)
    throw err
  }
}

/**
 * Create knowledge base entry (Admin only)
 * @param {Object} data - Knowledge entry data
 * @returns {Promise<Object>} Created knowledge entry
 */
export const createKnowledgeAPI = async (data) => {
  try {
    const response = await axiosInstance.post("/chatbot/admin/knowledge", data)
    toast.success("Tạo knowledge thành công!")
    return response.data
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || "Không thể tạo knowledge"
    toast.error(errorMessage)
    throw err
  }
}

/**
 * Update knowledge base entry (Admin only)
 * @param {string} id - Knowledge entry ID
 * @param {Object} data - Updated knowledge data
 * @returns {Promise<Object>} Updated knowledge entry
 */
export const updateKnowledgeAPI = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/chatbot/admin/knowledge/${id}`, data)
    toast.success("Cập nhật knowledge thành công!")
    return response.data
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || "Không thể cập nhật knowledge"
    toast.error(errorMessage)
    throw err
  }
}

/**
 * Delete knowledge base entry (Admin only)
 * @param {string} id - Knowledge entry ID
 * @returns {Promise<Object>} Delete result
 */
export const deleteKnowledgeAPI = async (id) => {
  try {
    const response = await axiosInstance.delete(`/chatbot/admin/knowledge/${id}`)
    toast.success("Xóa knowledge thành công!")
    return response.data
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || "Không thể xóa knowledge"
    toast.error(errorMessage)
    throw err
  }
}

// ========================================
// GYM INFO APIs (Admin only)
// ========================================

/**
 * Get all gym info (Admin only)
 * @returns {Promise<Object>} Gym info entries
 */
export const getAllGymInfoAPI = async () => {
  try {
    const response = await axiosInstance.get("/chatbot/admin/gym-info")
    return response.data
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || "Không thể tải gym info"
    toast.error(errorMessage)
    throw err
  }
}

/**
 * Create gym info entry (Admin only)
 * @param {Object} data - Gym info data
 * @returns {Promise<Object>} Created gym info entry
 */
export const createGymInfoAPI = async (data) => {
  try {
    const response = await axiosInstance.post("/chatbot/admin/gym-info", data)
    toast.success("Tạo gym info thành công!")
    return response.data
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || "Không thể tạo gym info"
    toast.error(errorMessage)
    throw err
  }
}

/**
 * Update gym info entry (Admin only)
 * @param {string} id - Gym info entry ID
 * @param {Object} data - Updated gym info data
 * @returns {Promise<Object>} Updated gym info entry
 */
export const updateGymInfoAPI = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/chatbot/admin/gym-info/${id}`, data)
    toast.success("Cập nhật gym info thành công!")
    return response.data
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || "Không thể cập nhật gym info"
    toast.error(errorMessage)
    throw err
  }
}

/**
 * Delete gym info entry (Admin only)
 * @param {string} id - Gym info entry ID
 * @returns {Promise<Object>} Delete result
 */
export const deleteGymInfoAPI = async (id) => {
  try {
    const response = await axiosInstance.delete(`/chatbot/admin/gym-info/${id}`)
    toast.success("Xóa gym info thành công!")
    return response.data
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || "Không thể xóa gym info"
    toast.error(errorMessage)
    throw err
  }
}

// ========================================
// ANALYTICS APIs (Admin only)
// ========================================

/**
 * Get chatbot analytics (Admin only)
 * @returns {Promise<Object>} Analytics data
 */
export const getChatbotAnalyticsAPI = async () => {
  try {
    const response = await axiosInstance.get("/chatbot/admin/analytics")
    return response.data
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || "Không thể tải analytics"
    toast.error(errorMessage)
    throw err
  }
}

// ========================================
// DEVELOPMENT APIs (Development only)
// ========================================

/**
 * Test intent recognition (Dev only)
 * @param {Object} data - { message: string }
 * @returns {Promise<Object>} Intent classification result
 */
export const testIntentAPI = async (data) => {
  try {
    const response = await axiosInstance.post("/chatbot/dev/test-intent", data)
    return response.data
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || "Không thể test intent"
    toast.error(errorMessage)
    throw err
  }
}

/**
 * Seed test data (Dev only - dangerous operation)
 * @returns {Promise<Object>} Seed result
 */
export const seedTestDataAPI = async () => {
  try {
    const response = await axiosInstance.post("/chatbot/dev/seed-data")
    toast.success("Seed data thành công!")
    return response.data
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || "Không thể seed data"
    toast.error(errorMessage)
    throw err
  }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Handle chatbot response based on type
 * @param {Object} response - Chatbot response object
 * @returns {Object} Processed response with UI hints
 */
export const processChatbotResponse = (response) => {
  const { type, content, data } = response

  const processedResponse = {
    ...response,
    needsAuth: response.requiresAuth || false,
    hasActions: false,
    hasPaymentLink: false,
    hasConfirmation: false,
  }

  // Set UI flags based on response type
  switch (type) {
    case "login_required":
      processedResponse.needsAuth = true
      break

    case "membership_options":
    case "registration_form":
      processedResponse.hasActions = true
      break

    case "payment_link":
      processedResponse.hasPaymentLink = true
      processedResponse.paymentUrl = response.paymentUrl
      break

    case "membership_confirmation":
    case "registration_confirmation":
      processedResponse.hasConfirmation = true
      break

    case "error":
    case "action_failed":
      processedResponse.isError = true
      break
  }

  return processedResponse
}

/**
 * Generate anonymous ID for new users
 * @returns {string} Anonymous ID
 */
export const generateAnonymousId = () => {
  return `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Format chatbot message for display
 * @param {string} content - Message content
 * @returns {string} Formatted content
 */
export const formatChatbotMessage = (content) => {
  // Convert newlines to <br> for HTML display
  return content.replace(/\n/g, "<br>")
}

/**
 * Extract payment URL from response
 * @param {Object} response - Chatbot response
 * @returns {string|null} Payment URL if exists
 */
export const extractPaymentUrl = (response) => {
  if (response.type === "payment_link" && response.paymentUrl) {
    return response.paymentUrl
  }

  // Try to extract from content
  const urlMatch = response.content?.match(/(https?:\/\/[^\s]+)/g)
  return urlMatch ? urlMatch[0] : null
}

export const linkAnonymousConversationAPI = async (data) => {
  try {
    const response = await axiosInstance.post("/chatbot/link-anonymous", data)
    return response.data
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || "Không thể liên kết conversation"
    toast.error(errorMessage)
    throw err
  }
}

// Export all APIs
export default {
  // Anonymous APIs
  chatbotWithAnonymousAPI,
  getAnonymousConversationAPI,
  getAnonymousQuickRepliesAPI,
  getChatbotHealthAPI,

  // Authenticated APIs
  chatbotWithAuthAPI,
  getAuthConversationAPI,
  getAuthQuickRepliesAPI,
  processQuickReplyAPI,
  getMyConversationsAPI,
  getMyActionsAPI,

  // Admin APIs
  getAllConversationsAPI,
  getConversationByIdAPI,
  getUserConversationsAPI,
  getUserActionsAPI,
  getAllActionsAPI,

  // Knowledge Base APIs
  getAllKnowledgeAPI,
  createKnowledgeAPI,
  updateKnowledgeAPI,
  deleteKnowledgeAPI,

  // Gym Info APIs
  getAllGymInfoAPI,
  createGymInfoAPI,
  updateGymInfoAPI,
  deleteGymInfoAPI,

  // Analytics APIs
  getChatbotAnalyticsAPI,

  // Development APIs
  testIntentAPI,
  seedTestDataAPI,

  // Utility functions
  processChatbotResponse,
  generateAnonymousId,
  formatChatbotMessage,
  extractPaymentUrl,
}
