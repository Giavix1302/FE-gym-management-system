import { useEffect, useState, useRef, useCallback } from "react"
import { io } from "socket.io-client"

const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState([])
  const socketRef = useRef(null)
  const callbacksRef = useRef({})

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect()
      socketRef.current = null
      setIsConnected(false)
      setOnlineUsers([])
    }
  }, [])

  const connect = useCallback(
    (token) => {
      if (socketRef.current) {
        disconnect()
      }

      const cleanToken = token.replace(/^"|"$/g, "")
      console.log("🚀 ~ connect ~ cleanToken:", cleanToken.substring(0, 50) + "...")

      const serverUrl = import.meta.env.VITE_API_URL_BE || "http://localhost:3000"
      console.log("🚀 ~ connect ~ serverUrl:", serverUrl)

      socketRef.current = io(serverUrl, {
        auth: { token: cleanToken },
        transports: ["polling", "websocket"],
      })
      setupEventListeners()
    },
    [disconnect],
  )

  const setupEventListeners = () => {
    const socket = socketRef.current

    socket.on("connect", () => {
      console.log("✅ Connected to server, Socket ID:", socket.id)
      setIsConnected(true)
      emit("connected")
    })

    socket.on("disconnect", () => {
      console.log("❌ Disconnected from server")
      setIsConnected(false)
      emit("disconnected")
    })

    socket.on("error", (error) => {
      console.error("Socket error:", error)
      emit("error", error)
    })

    // Chat events
    socket.on("new_message", (message) => {
      console.log("📩 New message:", message)
      emit("new_message", message)
    })

    socket.on("messages_read", (data) => {
      console.log("👀 Messages read:", data)
      emit("messages_read", data)
    })

    socket.on("user_typing", (data) => {
      console.log("⌨️ User typing:", data)
      emit("user_typing", data)
    })

    socket.on("user_status", (data) => {
      console.log("👤 User status:", data)
      if (data.isOnline) {
        setOnlineUsers((prev) => [...prev.filter((id) => id !== data.userId), data.userId])
      } else {
        setOnlineUsers((prev) => prev.filter((id) => id !== data.userId))
      }
      emit("userStatus", data)
    })

    // Conversation events
    socket.on("new_conversation", (data) => {
      console.log("💬 New conversation:", data)
      emit("new_conversation", data)
    })

    socket.on("joined_conversation", (data) => {
      console.log("🚪 Joined conversation:", data)
      emit("joined_conversation", data)
    })

    // Booking events
    socket.on("new_booking", (data) => {
      console.log("📅 New booking:", data)
      emit("new_booking", data)
    })

    socket.on("booking_updated", (data) => {
      console.log("📝 Booking updated:", data)
      emit("booking_updated", data)
    })

    socket.on("booking_cancelled", (data) => {
      console.log("❌ Booking cancelled:", data)
      emit("booking_cancelled", data)
    })
  }

  // ✅ FIX: Emit conversationId as STRING, not OBJECT
  const joinConversation = (conversationId) => {
    console.log("🚪 joinConversation called with:", conversationId, "Type:", typeof conversationId)
    if (socketRef.current && isConnected) {
      console.log("✅ Emitting join_conversation to backend...")
      socketRef.current.emit("join_conversation", conversationId) // ✅ STRING
      console.log("✅ Emitted join_conversation:", conversationId)
    } else {
      console.log("❌ Cannot join - Socket:", !!socketRef.current, "Connected:", isConnected)
    }
  }

  // ✅ FIX: Emit conversationId as STRING, not OBJECT
  const leaveConversation = (conversationId) => {
    console.log("👋 leaveConversation called with:", conversationId)
    if (socketRef.current && isConnected) {
      socketRef.current.emit("leave_conversation", conversationId) // ✅ STRING
      console.log("✅ Emitted leave_conversation:", conversationId)
    }
  }

  const sendMessage = (conversationId, content) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit("send_message", {
        conversationId,
        content,
      })
    }
  }

  // ✅ CORRECT: Backend expects OBJECT { conversationId, isTyping }
  const setTyping = (conversationId, isTyping) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit("typing", {
        conversationId,
        isTyping,
      })
    }
  }

  const markAsRead = (conversationId, messageIds) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit("mark_read", {
        conversationId,
        messageIds,
      })
    }
  }

  const on = (event, callback) => {
    if (!callbacksRef.current[event]) {
      callbacksRef.current[event] = []
    }
    callbacksRef.current[event].push(callback)
  }

  const off = (event, callback) => {
    if (callbacksRef.current[event]) {
      callbacksRef.current[event] = callbacksRef.current[event].filter((cb) => cb !== callback)
    }
  }

  const emit = (event, data) => {
    if (callbacksRef.current[event]) {
      callbacksRef.current[event].forEach((callback) => callback(data))
    }
  }

  const isUserOnline = (userId) => {
    return onlineUsers.includes(userId)
  }

  useEffect(() => {
    return () => {
      disconnect()
    }
  }, [disconnect])

  // ✅ Expose socket to window for debugging
  useEffect(() => {
    if (socketRef.current) {
      window.__socket = socketRef.current
      console.log("🔍 Socket exposed to window.__socket")
    }
  }, [socketRef.current?.connected])

  return {
    socket: socketRef.current,
    isConnected,
    connect,
    disconnect,
    joinConversation,
    leaveConversation,
    sendTyping: setTyping, // ✅ Export setTyping as sendTyping
    on,
    off,
    isUserOnline,
  }
}

export default useSocket
