import React, { useEffect } from "react"
import FloatingChatWidget from "./FloatingChatWidget"
import useChatStore from "../stores/useChatStore"
import useSocket from "../hooks/useSocket"
import { toast } from "react-toastify"
import { getUnreadCountAPI } from "../apis/conversation"

const ChatProvider = ({ children }) => {
  const { updateConversationLastMessage, updateUserOnlineStatus, addConversation, setUnreadCount } = useChatStore()

  const { isConnected, connect, disconnect, on, off } = useSocket()

  useEffect(() => {
    // Auto-connect when component mounts
    const token = localStorage.getItem("accessToken")
    const user = JSON.parse(localStorage.getItem("user") || "{}")

    if (token && user.id && (user.role === "user" || user.role === "pt")) {
      connect(token)
      loadUnreadCount()
    }

    return () => {
      disconnect()
    }
  }, [])

  useEffect(() => {
    // Setup global Socket.IO event listeners
    const handleNewMessage = (message) => {
      updateConversationLastMessage(message.conversationId, message.content, message.timestamp)

      // Show toast notification
      const user = JSON.parse(localStorage.getItem("user") || "{}")
      const fromType = user.role === "user" ? "PT" : "học viên"
      toast.info(`Tin nhắn mới từ ${fromType}`)

      loadUnreadCount()
    }

    const handleNewConversation = (data) => {
      addConversation(data.conversation)
      toast.success(data.message || "Cuộc hội thoại mới được tạo")
    }

    const handleUserStatus = (data) => {
      updateUserOnlineStatus(data.userId, data.isOnline)
    }

    const handleNewBooking = (data) => {
      const user = JSON.parse(localStorage.getItem("user") || "{}")
      if (user.role === "pt") {
        toast.success(`Booking mới từ ${data.user?.fullName}`)
      }
    }

    const handleBookingUpdated = (data) => {
      toast.info(data.message || "Booking đã được cập nhật")
    }

    const handleBookingCancelled = (data) => {
      const user = JSON.parse(localStorage.getItem("user") || "{}")
      if (user.role === "pt") {
        toast.warning(`${data.user?.fullName} đã hủy booking`)
      } else {
        toast.warning(data.message || "Booking đã bị hủy")
      }
    }

    if (isConnected) {
      on("newMessage", handleNewMessage)
      on("newConversation", handleNewConversation)
      on("userStatus", handleUserStatus)
      on("newBooking", handleNewBooking)
      on("bookingUpdated", handleBookingUpdated)
      on("bookingCancelled", handleBookingCancelled)
    }

    return () => {
      off("newMessage", handleNewMessage)
      off("newConversation", handleNewConversation)
      off("userStatus", handleUserStatus)
      off("newBooking", handleNewBooking)
      off("bookingUpdated", handleBookingUpdated)
      off("bookingCancelled", handleBookingCancelled)
    }
  }, [isConnected])

  const loadUnreadCount = async () => {
    try {
      const response = await getUnreadCountAPI()
      if (response.success) {
        setUnreadCount(response.data.totalUnread)
      }
    } catch (error) {
      console.error("Failed to load unread count:", error)
    }
  }

  return (
    <>
      {children}
      <FloatingChatWidget />
    </>
  )
}

export default ChatProvider
