// Updated chatbot API functions - Modified to work with userId in params for ALL authenticated endpoints

import { toast } from "react-toastify"
import { axiosPublic, axiosInstance } from "./axiosConfig"

// ========================================
// AUTHENTICATED CHATBOT APIs (Require userId in params) - ✅ UPDATED
// ========================================

/**
 * Get conversation history for authenticated user by userId
 * @param {string} userId - User ID to get conversation for
 * @param {string} conversationId - Optional specific conversation ID
 * @returns {Promise<Object>} Conversation history
 */
export const getAuthConversationAPI = async (userId, conversationId = null) => {
  try {
    let url = `/chatbot/conversation/${userId}`
    if (conversationId) {
      url = `/chatbot/conversation/${userId}/${conversationId}`
    }

    const response = await axiosInstance.get(url)
    return response.data
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || "Không thể tải lịch sử chat"
    toast.error(errorMessage)
    throw err
  }
}

/**
 * Get conversation history by userId (alternative function name for clarity)
 * @param {string} userId - User ID to get conversation for
 * @param {string} conversationId - Optional specific conversation ID
 * @returns {Promise<Object>} Conversation history
 */
export const getConversationByUserIdAPI = async (userId, conversationId = null) => {
  try {
    let url = `/chatbot/conversation/${userId}`
    if (conversationId) {
      url = `/chatbot/conversation/${userId}/${conversationId}`
    }

    const response = await axiosInstance.get(url)
    return response.data
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || "Không thể tải lịch sử chat"
    toast.error(errorMessage)
    throw err
  }
}

/**
 * Send message as authenticated user - ✅ UPDATED to use userId in params
 * @param {string} userId - User ID to send message for
 * @param {Object} data - { message: string }
 * @returns {Promise<Object>} Response with bot reply and conversation data
 */
export const chatbotWithAuthAPI = async (userId, data) => {
  try {
    const response = await axiosInstance.post(`/chatbot/message/${userId}`, data)
    return response.data
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || "Lỗi hệ thống"
    toast.error(errorMessage)
    throw err
  }
}

/**
 * Get quick replies for authenticated users - ✅ UPDATED to use userId in params
 * @param {string} userId - User ID to get quick replies for
 * @returns {Promise<Object>} Array of quick reply options
 */
export const getAuthQuickRepliesAPI = async (userId) => {
  try {
    const response = await axiosInstance.get(`/chatbot/quick-replies/${userId}`)
    return response.data
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || "Không thể tải quick replies"
    toast.error(errorMessage)
    throw err
  }
}

/**
 * Process quick reply action - ✅ UPDATED to use userId in params
 * @param {string} userId - User ID to process quick reply for
 * @param {Object} data - { value: string }
 * @returns {Promise<Object>} Bot response
 */
export const processQuickReplyAPI = async (userId, data) => {
  try {
    const response = await axiosInstance.post(`/chatbot/quick-replies/${userId}`, data)
    return response.data
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || "Không thể xử lý quick reply"
    toast.error(errorMessage)
    throw err
  }
}

/**
 * Link anonymous conversation to authenticated user - ✅ UPDATED to use userId in params
 * @param {string} userId - User ID to link conversation to
 * @param {Object} data - { anonymousId: string }
 * @returns {Promise<Object>} Link result
 */
export const linkAnonymousConversationAPI = async (userId, data) => {
  try {
    const response = await axiosInstance.post(`/chatbot/link-anonymous/${userId}`, data)
    return response.data
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || "Không thể liên kết conversation"
    toast.error(errorMessage)
    throw err
  }
}

/**
 * Get user's conversations - ✅ UPDATED to use userId in params
 * @param {string} userId - User ID to get conversations for
 * @returns {Promise<Object>} List of user conversations
 */
export const getMyConversationsAPI = async (userId) => {
  try {
    const response = await axiosInstance.get(`/chatbot/my/conversations/${userId}`)
    return response.data
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || "Không thể tải danh sách conversations"
    toast.error(errorMessage)
    throw err
  }
}

// ========================================
// ANONYMOUS CHATBOT APIs (No Changes)
// ========================================

/**
 * Send message as anonymous user
 * @param {Object} data - { message: string, anonymousId?: string }
 * @returns {Promise<Object>} Response with bot reply and conversation data
 */
export const chatbotWithAnonymousAPI = async (data) => {
  console.log("🐛 API Call Data:", data)
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
// UTILITY FUNCTIONS (UNCHANGED)
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
    hasPersonalInfo: false,
    isError: false,
  }

  // Set UI flags based on response type
  switch (type) {
    case "login_required":
      processedResponse.needsAuth = true
      break

    case "membership_info":
    case "schedule_info":
    case "my_membership":
    case "my_schedule":
      processedResponse.hasPersonalInfo = true
      break

    case "no_membership":
    case "no_active_membership":
      processedResponse.needsAuth = true
      processedResponse.hasPersonalInfo = true
      break

    case "faq_response":
    case "locations_info":
    case "memberships_info":
    case "classes_info":
    case "trainers_info":
    case "equipment_info":
    case "basic_info":
    case "hours_info":
    case "contact_info":
      processedResponse.isFAQ = true
      break

    case "greeting_response":
    case "thanks_response":
    case "time_response":
    case "general_response":
      processedResponse.isGeneral = true
      break

    case "error":
    case "system_error":
    case "validation_error":
    case "membership_error":
    case "schedule_error":
    case "locations_error":
    case "memberships_error":
    case "classes_error":
    case "trainers_error":
      processedResponse.isError = true
      break

    case "unknown_intent":
    case "unknown":
      processedResponse.isUnknown = true
      break

    default:
      processedResponse.isGeneral = true
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
 * Check if response indicates user needs to login
 * @param {Object} response - Chatbot response
 * @returns {boolean} True if login required
 */
export const isLoginRequired = (response) => {
  return response.type === "login_required" || response.needsAuth || response.requiresAuth
}

/**
 * Check if response contains personal information
 * @param {Object} response - Chatbot response
 * @returns {boolean} True if contains personal info
 */
export const hasPersonalInfo = (response) => {
  const personalTypes = [
    "membership_info",
    "schedule_info",
    "my_membership",
    "my_schedule",
    "no_membership",
    "no_active_membership",
  ]
  return personalTypes.includes(response.type)
}

/**
 * Check if response is an error
 * @param {Object} response - Chatbot response
 * @returns {boolean} True if error response
 */
export const isErrorResponse = (response) => {
  const errorTypes = [
    "error",
    "system_error",
    "validation_error",
    "membership_error",
    "schedule_error",
    "user_not_found",
  ]
  return errorTypes.includes(response.type) || response.isError
}

/**
 * Check if response contains FAQ information
 * @param {Object} response - Chatbot response
 * @returns {boolean} True if FAQ response
 */
export const isFAQResponse = (response) => {
  const faqTypes = [
    "faq_response",
    "locations_info",
    "memberships_info",
    "classes_info",
    "trainers_info",
    "equipment_info",
    "basic_info",
    "hours_info",
    "contact_info",
  ]
  return faqTypes.includes(response.type)
}

/**
 * Get response category for styling/handling
 * @param {Object} response - Chatbot response
 * @returns {string} Response category
 */
export const getResponseCategory = (response) => {
  if (isErrorResponse(response)) return "error"
  if (isLoginRequired(response)) return "auth_required"
  if (hasPersonalInfo(response)) return "personal"
  if (isFAQResponse(response)) return "faq"
  return "general"
}

/**
 * Extract data from chatbot response for UI components
 * @param {Object} response - Chatbot response
 * @returns {Object} Extracted data
 */
export const extractResponseData = (response) => {
  const category = getResponseCategory(response)

  return {
    category,
    type: response.type,
    content: response.content,
    data: response.data || null,
    metadata: response.metadata || {},
    needsAuth: isLoginRequired(response),
    isError: isErrorResponse(response),
    hasPersonalInfo: hasPersonalInfo(response),
    isFAQ: isFAQResponse(response),
    timestamp: response.timestamp || new Date().toISOString(),
  }
}

// Export main APIs - ✅ UPDATED to include userId in all authenticated endpoints
export default {
  // Anonymous APIs (No changes)
  chatbotWithAnonymousAPI,
  getAnonymousConversationAPI,
  getAnonymousQuickRepliesAPI,
  getChatbotHealthAPI,

  // Authenticated APIs - ✅ UPDATED: All now require userId parameter
  chatbotWithAuthAPI,
  getAuthConversationAPI, // Now requires userId parameter
  getConversationByUserIdAPI, // Alternative function name
  getAuthQuickRepliesAPI, // Now requires userId parameter
  processQuickReplyAPI, // Now requires userId parameter
  getMyConversationsAPI, // Now requires userId parameter
  linkAnonymousConversationAPI, // Now requires userId parameter

  // Utility functions
  processChatbotResponse,
  generateAnonymousId,
  formatChatbotMessage,
  isLoginRequired,
  hasPersonalInfo,
  isErrorResponse,
  isFAQResponse,
  getResponseCategory,
  extractResponseData,
}
