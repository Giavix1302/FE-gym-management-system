/**
 * CHATBOT API v2.0 - Gemini AI Function Calling
 * ==============================================
 *
 * MAJOR CHANGES FROM v1.0:
 * ------------------------
 * ✨ AI thông minh thật sự - không còn pattern matching cứng
 * ✨ Context-aware - nhớ 10 messages gần nhất
 * ✨ Real-time data từ database
 * ✨ Cá nhân hóa với authentication
 * ✨ Trả lời mọi câu hỏi và lái về gym tự nhiên
 *
 * BREAKING CHANGES:
 * -----------------
 * 1. Response format changed:
 *    - OLD: response.type, response.data, response.metadata
 *    - NEW: response.response.content, response.response.type
 *
 * 2. Quick Replies are now OPTIONAL:
 *    - AI understands natural language
 *    - Users can type anything freely
 *    - Quick replies are just UI suggestions
 *
 * 3. No more hardcoded response types:
 *    - AI generates responses dynamically
 *    - Check for keywords like "đăng nhập" or "🔐" instead of type === "login_required"
 *
 * MIGRATION GUIDE:
 * ----------------
 * - Update message handling to use response.response.content
 * - Allow free-form text input (not just quick replies)
 * - Handle longer, multi-line responses with formatting
 * - Check content for login hints instead of type field
 *
 * See full documentation: /docs/chatbot-api-v2.md
 */

import { toast } from "react-toastify"
import { axiosPublic, axiosInstance } from "./axiosConfig"

// ========================================
// CORE CHATBOT APIs - v2.0
// ========================================

/**
 * Health Check - Check chatbot service status
 * GET /api/chatbot/health
 * @returns {Promise<Object>} Health status with AI connection info
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
// AUTHENTICATED CHATBOT APIs (User logged in)
// ========================================

/**
 * Send message as authenticated user (user logged in)
 * POST /api/chatbot/message/:userId
 * AI can answer personalized questions about user's membership, schedule, etc.
 * @param {string} userId - User ID to send message for
 * @param {Object} data - { message: string }
 * @returns {Promise<Object>} Response with AI reply, conversation data, and rate limit info
 * @example
 * // User asks: "Gói tập của tôi còn bao nhiêu ngày?"
 * // AI responds with personalized info about their membership
 */
export const chatbotWithAuthAPI = async (userId, data) => {
  try {
    const response = await axiosInstance.post(`/chatbot/message/${userId}`, data)

    // Extract rate limit info from headers
    const rateLimitInfo = {
      limit: parseInt(response.headers['x-ratelimit-limit'] || '0'),
      remaining: parseInt(response.headers['x-ratelimit-remaining'] || '0'),
      reset: parseInt(response.headers['x-ratelimit-reset'] || '0'),
      type: response.headers['x-ratelimit-type'] || 'authenticated'
    }

    return {
      ...response.data,
      rateLimitInfo
    }
  } catch (err) {
    // Handle rate limit error (429)
    if (err.response?.status === 429) {
      const errorData = err.response.data
      return {
        success: false,
        isRateLimited: true,
        rateLimitError: errorData.error,
        message: errorData.message,
        suggestion: errorData.suggestion
      }
    }

    const errorMessage = err.response?.data?.message || err.message || "Lỗi hệ thống"
    toast.error(errorMessage)
    throw err
  }
}

/**
 * Get conversation history for authenticated user
 * GET /api/chatbot/conversation/:userId
 * GET /api/chatbot/conversation/:userId/:conversationId
 * @param {string} userId - User ID to get conversation for
 * @param {string} conversationId - Optional specific conversation ID
 * @returns {Promise<Object>} Conversation history with all messages
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
 * Get user's all conversations (for history list)
 * GET /api/chatbot/my/conversations/:userId
 * @param {string} userId - User ID to get conversations for
 * @returns {Promise<Object>} List of all user conversations
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

/**
 * Link anonymous conversation to user account after login
 * POST /api/chatbot/link-anonymous/:userId
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

// ========================================
// DEPRECATED: Quick Replies APIs (Still work but NOT needed)
// AI now handles everything naturally - no need for hardcoded quick replies
// Keep these for backward compatibility, but FE should allow free-form input
// ========================================

/**
 * @deprecated AI v2.0 understands natural language - quick replies are optional
 * Get quick replies for authenticated users
 * @param {string} userId - User ID to get quick replies for
 * @returns {Promise<Object>} Array of quick reply suggestions
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
 * @deprecated Just send the message text directly via chatbotWithAuthAPI
 * Process quick reply action
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

// ========================================
// ANONYMOUS CHATBOT APIs (User not logged in)
// ========================================

/**
 * Send message as anonymous user (user not logged in)
 * POST /api/chatbot/anonymous/message
 * AI answers general questions about gym. For personal questions, prompts user to login.
 * @param {Object} data - { message: string, anonymousId?: string }
 * @returns {Promise<Object>} Response with AI reply, conversation data, and rate limit info
 * @example
 * // User asks: "Gym có những gói membership nào?"
 * // AI responds with membership info
 *
 * // User asks: "Gói tập của tôi còn bao nhiêu ngày?"
 * // AI responds: "Để xem gói tập của bạn, bạn cần đăng nhập nhé! 🔐"
 */
export const chatbotWithAnonymousAPI = async (data) => {
  console.log("🐛 API Call Data:", data)
  try {
    const response = await axiosPublic.post("/chatbot/anonymous/message", data)

    // Extract rate limit info from headers
    const rateLimitInfo = {
      limit: parseInt(response.headers['x-ratelimit-limit'] || '0'),
      remaining: parseInt(response.headers['x-ratelimit-remaining'] || '0'),
      reset: parseInt(response.headers['x-ratelimit-reset'] || '0'),
      type: response.headers['x-ratelimit-type'] || 'anonymous'
    }

    return {
      ...response.data,
      rateLimitInfo
    }
  } catch (err) {
    // Handle rate limit error (429)
    if (err.response?.status === 429) {
      const errorData = err.response.data
      return {
        success: false,
        isRateLimited: true,
        rateLimitError: errorData.error,
        message: errorData.message,
        suggestion: errorData.suggestion
      }
    }

    const errorMessage = err.response?.data?.message || err.message || "Lỗi hệ thống"
    toast.error(errorMessage)
    throw err
  }
}

/**
 * Get conversation history for anonymous user
 * GET /api/chatbot/anonymous/conversation/:anonymousId
 * @param {string} anonymousId - Anonymous user identifier
 * @returns {Promise<Object>} Conversation history with all messages
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
 * @deprecated AI v2.0 understands natural language - quick replies are optional
 * Get quick replies for anonymous users
 * @returns {Promise<Object>} Array of quick reply suggestions
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

// ========================================
// UTILITY FUNCTIONS for v2.0 AI Responses
// ========================================

/**
 * Generate anonymous ID for new users
 * Format: anon_{timestamp}_{random}
 * @returns {string} Anonymous ID
 */
export const generateAnonymousId = () => {
  return `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Format chatbot message for display (preserves line breaks and formatting)
 * AI responses in v2.0 contain emojis, bullet points, and multi-line content
 * @param {string} content - Message content from AI
 * @returns {Array<string>} Array of lines for rendering
 */
export const formatChatbotMessage = (content) => {
  // Split by newlines to preserve AI formatting
  return content.split('\n')
}

/**
 * Check if response indicates user needs to login
 * v2.0: AI mentions "đăng nhập" or 🔐 emoji when login is needed
 * @param {string} content - Message content from AI
 * @returns {boolean} True if login required
 */
export const isLoginRequired = (content) => {
  if (typeof content === 'string') {
    return content.includes('đăng nhập') || content.includes('🔐')
  }
  return false
}

/**
 * Check if response is an error from the system
 * v2.0: Check response.success field
 * @param {Object} apiResponse - Full API response
 * @returns {boolean} True if error response
 */
export const isErrorResponse = (apiResponse) => {
  return apiResponse && apiResponse.success === false
}

// ========================================
// EXPORTS - Chatbot API v2.0
// ========================================

export default {
  // Core API
  getChatbotHealthAPI,

  // Anonymous APIs (user not logged in)
  chatbotWithAnonymousAPI,
  getAnonymousConversationAPI,
  getAnonymousQuickRepliesAPI, // DEPRECATED but kept for compatibility

  // Authenticated APIs (user logged in) - All require userId
  chatbotWithAuthAPI,
  getAuthConversationAPI,
  getMyConversationsAPI,
  linkAnonymousConversationAPI,
  getAuthQuickRepliesAPI, // DEPRECATED but kept for compatibility
  processQuickReplyAPI, // DEPRECATED but kept for compatibility

  // Utility functions for v2.0
  generateAnonymousId,
  formatChatbotMessage,
  isLoginRequired,
  isErrorResponse,
}
