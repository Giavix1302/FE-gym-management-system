import { useEffect, useState, useRef } from "react"
import { io } from "socket.io-client"

const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState([])
  const socketRef = useRef(null)
  const callbacksRef = useRef({})

  const connect = (token) => {
    if (socketRef.current) {
      disconnect()
    }

    const serverUrl = import.meta.env.VITE_API_URL_BE || "http://localhost:3000"

    socketRef.current = io(serverUrl, {
      auth: { token },
      transports: ["polling", "websocket"],
    })
    setupEventListeners()
  }

  const setupEventListeners = () => {
    const socket = socketRef.current

    socket.on("connect", () => {
      console.log("✅ Connected to server")
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
      emit("newMessage", message)
    })

    socket.on("messages_read", (data) => {
      console.log("👀 Messages read:", data)
      emit("messagesRead", data)
    })

    socket.on("user_typing", (data) => {
      console.log("⌨️ User typing:", data)
      emit("userTyping", data)
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
      emit("newConversation", data)
    })

    socket.on("joined_conversation", (data) => {
      console.log("🚪 Joined conversation:", data)
      emit("joinedConversation", data)
    })

    // Booking events
    socket.on("new_booking", (data) => {
      console.log("📅 New booking:", data)
      emit("newBooking", data)
    })

    socket.on("booking_updated", (data) => {
      console.log("📝 Booking updated:", data)
      emit("bookingUpdated", data)
    })

    socket.on("booking_cancelled", (data) => {
      console.log("❌ Booking cancelled:", data)
      emit("bookingCancelled", data)
    })
  }

  const joinConversation = (conversationId) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit("join_conversation", { conversationId })
    }
  }

  const leaveConversation = (conversationId) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit("leave_conversation", { conversationId })
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

  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.disconnect()
      socketRef.current = null
      setIsConnected(false)
      setOnlineUsers([])
    }
  }

  const isUserOnline = (userId) => {
    return onlineUsers.includes(userId)
  }

  useEffect(() => {
    return () => {
      disconnect()
    }
  }, [])

  return {
    isConnected,
    onlineUsers,
    connect,
    disconnect,
    joinConversation,
    leaveConversation,
    sendMessage,
    setTyping,
    markAsRead,
    on,
    off,
    isUserOnline,
  }
}

export default useSocket
