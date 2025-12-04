import { create } from "zustand"
import useUserStore from "./useUserStore"

const useChatbotStore = create((set, get) => ({
  // ========================================
  // STATE
  // ========================================
  messages: [],
  anonymousId: null,
  conversationId: null,
  isLoading: false,
  isOpen: false,
  quickReplies: [],
  error: null,
  lastResponseType: null, // For handling special response types
  awaitingConfirmation: false, // For confirmation dialogs
  pendingAction: null, // Store action while waiting for confirmation

  // ========================================
  // CORE ACTIONS
  // ========================================

  /**
   * Initialize chatbot - get or create anonymous ID
   */
  initializeChatbot: () => {
    const state = get()
    if (state.anonymousId) return

    // Get from localStorage or create new
    let anonymousId = localStorage.getItem("chatbot_anonymousId")
    if (!anonymousId) {
      anonymousId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem("chatbot_anonymousId", anonymousId)
    }

    console.log("🛠 Frontend - Initialized with anonymousId:", anonymousId)
    set({ anonymousId })
  },

  /**
   * Toggle chatbot widget open/close
   */
  toggleWidget: () => {
    set((state) => {
      const newIsOpen = !state.isOpen

      // Initialize chatbot when first opened
      if (newIsOpen && !state.anonymousId) {
        get().initializeChatbot()
      }

      return { isOpen: newIsOpen }
    })
  },

  /**
   * Add message to conversation
   */
  addMessage: (message) => {
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date(),
          ...message,
        },
      ],
    }))
  },

  /**
   * Clear all messages
   */
  clearMessages: () => {
    set({ messages: [] })
  },

  /**
   * Set loading state
   */
  setLoading: (isLoading) => {
    set({ isLoading })
  },

  /**
   * Set error state
   */
  setError: (error) => {
    set({ error })
  },

  /**
   * Clear error
   */
  clearError: () => {
    set({ error: null })
  },

  /**
   * Set quick replies
   */
  setQuickReplies: (quickReplies) => {
    set({ quickReplies })
  },

  /**
   * Set conversation ID
   */
  setConversationId: (conversationId) => {
    set({ conversationId })
  },

  /**
   * Set response type and handle special cases
   */
  setLastResponseType: (responseType) => {
    set({
      lastResponseType: responseType,
      awaitingConfirmation: ["membership_confirmation", "registration_confirmation"].includes(responseType),
    })
  },

  /**
   * Set pending action for confirmation
   */
  setPendingAction: (action) => {
    set({ pendingAction: action })
  },

  /**
   * Clear pending action
   */
  clearPendingAction: () => {
    set({ pendingAction: null, awaitingConfirmation: false })
  },

  // ========================================
  // API INTEGRATION ACTIONS
  // ========================================

  /**
   * Send message to chatbot - FIXED COMPLETE FUNCTION
   */
  sendMessage: async (messageText) => {
    const state = get()
    const user = useUserStore.getState().user
    const isAuthenticated = !!user

    try {
      set({ isLoading: true, error: null })

      // Add user message immediately
      get().addMessage({
        type: "user",
        content: messageText,
      })

      // Import API functions dynamically to avoid circular dependency
      const { chatbotWithAnonymousAPI, chatbotWithAuthAPI } = await import("../apis/chatbot")

      let response
      if (isAuthenticated) {
        response = await chatbotWithAuthAPI(user._id, { message: messageText })
      } else {
        if (!state.anonymousId) {
          get().initializeChatbot()
        }
        response = await chatbotWithAnonymousAPI({
          message: messageText,
          anonymousId: state.anonymousId,
        })
      }

      console.log("🛠 Frontend - API Response:", response)

      if (response.success) {
        // Add bot response
        get().addMessage({
          type: "bot",
          content: response.response.content,
          responseType: response.response.type,
          responseData: response.response.data || null,
        })

        // Update conversation and anonymous ID
        if (response.conversationId) {
          set({ conversationId: response.conversationId })
        }
        if (response.anonymousId && response.anonymousId !== state.anonymousId) {
          set({ anonymousId: response.anonymousId })
          localStorage.setItem("chatbot_anonymousId", response.anonymousId)
        }

        // Handle special response types
        get().setLastResponseType(response.response.type)

        // Load quick replies after successful message
        get().loadQuickReplies()

        console.log("🛠 Frontend - Messages after add:", get().messages)
      } else {
        throw new Error(response.message || "Failed to send message")
      }
    } catch (error) {
      console.error("Chatbot send message error:", error)

      // Add error message
      get().addMessage({
        type: "bot",
        content: "Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.",
        responseType: "error",
      })

      set({ error: error.message })
    } finally {
      set({ isLoading: false })
    }
  },

  /**
   * Process quick reply - ✅ FIXED: Send correct payload with userId
   */
  processQuickReply: async (quickReply) => {
    const user = useUserStore.getState().user
    const isAuthenticated = !!user

    try {
      set({ isLoading: true })

      if (isAuthenticated) {
        const { processQuickReplyAPI } = await import("../apis/chatbot")
        // ✅ FIXED: Pass userId as first parameter and send correct payload
        const response = await processQuickReplyAPI(user._id, {
          value: quickReply.value || quickReply.action || quickReply.text,
        })

        if (response.success) {
          // Add quick reply as user message
          get().addMessage({
            type: "user",
            content: quickReply.text,
          })

          // Add bot response
          get().addMessage({
            type: "bot",
            content: response.response.content,
            responseType: response.response.type,
            responseData: response.response.data || null,
          })

          get().setLastResponseType(response.response.type)
        }
      } else {
        // For anonymous users, send as regular message
        await get().sendMessage(quickReply.text)
      }
    } catch (error) {
      console.error("Quick reply error:", error)
      set({ error: error.message })
    } finally {
      set({ isLoading: false })
    }
  },

  /**
   * Load conversation history - ✅ FIXED: Load for both authenticated and anonymous users
   */
  loadConversationHistory: async () => {
    const state = get()
    const user = useUserStore.getState().user
    console.log("🚀 ~ user:", user)
    const isAuthenticated = !!user

    try {
      set({ isLoading: true, error: null })

      if (isAuthenticated) {
        // ✅ Load authenticated user conversation
        const { getAuthConversationAPI } = await import("../apis/chatbot")
        const response = await getAuthConversationAPI(user._id)

        if (response.success && response.conversation) {
          const conversation = response.conversation

          // Parse messages from conversation
          const messages =
            conversation.messages
              ?.map((msg, index) => {
                // Parse userMessage if it's in object format (bug from BE)
                let userContent = msg.userMessage || msg.content
                if (typeof userContent === "object" && userContent !== null) {
                  userContent = Object.values(userContent).join("")
                }

                // Handle different message formats
                if (msg.type) {
                  // New format: individual messages
                  return {
                    id: `${msg.type}_${index}`,
                    type: msg.type,
                    content: userContent || msg.content,
                    timestamp: new Date(msg.timestamp),
                    responseType: msg.responseType,
                  }
                } else {
                  // Old format: user-bot pairs
                  return [
                    {
                      id: `user_${index}`,
                      type: "user",
                      content: userContent,
                      timestamp: new Date(msg.timestamp),
                    },
                    {
                      id: `bot_${index}`,
                      type: "bot",
                      content: msg.botResponse?.content || "",
                      responseType: msg.botResponse?.type,
                      responseData: msg.botResponse?.data || null,
                      timestamp: new Date(msg.timestamp),
                    },
                  ]
                }
              })
              .flat()
              .filter((msg) => msg && msg.content) || []

          set({
            messages,
            conversationId: conversation._id,
          })

          console.log("🛠 Frontend - Loaded authenticated conversation:", conversation._id)
        }
      } else {
        // ✅ FIXED: Load anonymous user conversation if anonymousId exists
        if (state.anonymousId) {
          console.log("🛠 Frontend - Loading anonymous conversation for:", state.anonymousId)

          const { getAnonymousConversationAPI } = await import("../apis/chatbot")
          const response = await getAnonymousConversationAPI(state.anonymousId)

          if (response.success && response.conversation) {
            const conversation = response.conversation

            // Parse messages from conversation
            const messages =
              conversation.messages
                ?.map((msg, index) => {
                  // Handle different message formats
                  if (msg.type) {
                    // New format: individual messages
                    return {
                      id: `${msg.type}_${index}`,
                      type: msg.type,
                      content: msg.content,
                      timestamp: new Date(msg.timestamp),
                      responseType: msg.responseType,
                    }
                  } else {
                    // Old format: user-bot pairs
                    let userContent = msg.userMessage || msg.content
                    if (typeof userContent === "object" && userContent !== null) {
                      userContent = Object.values(userContent).join("")
                    }

                    return [
                      {
                        id: `user_${index}`,
                        type: "user",
                        content: userContent,
                        timestamp: new Date(msg.timestamp),
                      },
                      {
                        id: `bot_${index}`,
                        type: "bot",
                        content: msg.botResponse?.content || "",
                        responseType: msg.botResponse?.type,
                        responseData: msg.botResponse?.data || null,
                        timestamp: new Date(msg.timestamp),
                      },
                    ]
                  }
                })
                .flat()
                .filter((msg) => msg && msg.content) || []

            set({
              messages,
              conversationId: conversation._id,
            })

            console.log(
              "🛠 Frontend - Loaded anonymous conversation:",
              conversation._id,
              "with",
              messages.length,
              "messages",
            )
          } else {
            console.log("🛠 Frontend - No anonymous conversation found")
          }
        } else {
          console.log("🛠 Frontend - No anonymousId available")
        }
      }
    } catch (error) {
      console.error("Load conversation error:", error)
      // Don't show error to user for history loading failure
      set({ error: null })
    } finally {
      set({ isLoading: false })
    }
  },

  /**
   * Load quick replies - ✅ FIXED: Pass userId for authenticated users
   */
  loadQuickReplies: async () => {
    const user = useUserStore.getState().user
    const isAuthenticated = !!user

    try {
      const { getAuthQuickRepliesAPI, getAnonymousQuickRepliesAPI } = await import("../apis/chatbot")

      let response
      if (isAuthenticated) {
        // ✅ FIXED: Pass userId for authenticated quick replies
        response = await getAuthQuickRepliesAPI(user._id)
      } else {
        response = await getAnonymousQuickRepliesAPI()
      }

      if (response.success) {
        set({ quickReplies: response.quickReplies || [] })
      }
    } catch (error) {
      console.error("Load quick replies error:", error)
      // Don't set error for quick replies failure - just use empty array
      set({ quickReplies: [] })
    }
  },

  /**
   * Switch to authenticated mode after user login - ✅ FIXED: Pass userId
   */
  switchToAuthenticatedMode: async () => {
    const state = get()
    const user = useUserStore.getState().user

    if (!user) {
      console.error("No user available for switch to authenticated mode")
      return
    }

    try {
      // Link anonymous conversation if exists
      if (state.anonymousId && state.conversationId) {
        const { linkAnonymousConversationAPI } = await import("../apis/chatbot")

        try {
          await linkAnonymousConversationAPI(user._id, { anonymousId: state.anonymousId })
        } catch (error) {
          console.warn("Failed to link anonymous conversation:", error)
          // Continue anyway, don't block the switch
        }
      }

      // Load authenticated conversation history
      await get().loadConversationHistory()

      // Load authenticated quick replies
      await get().loadQuickReplies()
    } catch (error) {
      console.error("Switch to authenticated mode error:", error)
      set({ error: error.message })
    }
  },

  /**
   * Reset chatbot state (for logout)
   */
  reset: () => {
    set({
      messages: [],
      conversationId: null,
      isLoading: false,
      isOpen: false,
      quickReplies: [],
      error: null,
      lastResponseType: null,
      awaitingConfirmation: false,
      pendingAction: null,
    })
    // Keep anonymousId for potential re-use
  },

  // ========================================
  // COMPUTED GETTERS
  // ========================================

  /**
   * Get current user type
   */
  getCurrentUserType: () => {
    const user = useUserStore.getState().user
    return user ? "authenticated" : "anonymous"
  },

  /**
   * Check if needs authentication for action
   */
  needsAuthentication: (responseType) => {
    const authRequiredTypes = [
      "login_required",
      "membership_confirmation",
      "payment_link",
      "check_membership",
      "check_schedule",
      "book_trainer",
    ]
    return authRequiredTypes.includes(responseType)
  },

  /**
   * Get last bot message
   */
  getLastBotMessage: () => {
    const state = get()
    const botMessages = state.messages.filter((msg) => msg.type === "bot")
    return botMessages[botMessages.length - 1] || null
  },

  /**
   * Check if widget has unread messages (for badge)
   */
  hasUnreadMessages: () => {
    const state = get()
    // Simple check: if widget is closed and has messages
    return !state.isOpen && state.messages.length > 0
  },
}))

export default useChatbotStore
