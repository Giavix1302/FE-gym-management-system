import React, { useState, useEffect } from "react"
import { Box, Grid, Paper, useMediaQuery, useTheme, Fab, Badge } from "@mui/material"
import { Chat as ChatIcon } from "@mui/icons-material"
import { toast } from "react-toastify"
import ChatList from "../../components/ChatList"
import ChatWindow from "../../components/ChatWindow"
import useChatStore from "../../stores/useChatStore"
import useSocket from "../../hooks/useSocket"
import { getUnreadCountAPI } from "../../apis/conversation"

const UserChatPage = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const {
    currentConversation,
    setCurrentConversation,
    unreadCount,
    setUnreadCount,
    updateConversationLastMessage,
    updateUserOnlineStatus,
    addConversation,
    reset,
  } = useChatStore()

  const { isConnected, connect, disconnect, on, off } = useSocket()

  const [showChatList, setShowChatList] = useState(!isMobile)
  const [showFloatingButton, setShowFloatingButton] = useState(false)

  useEffect(() => {
    // Connect to Socket.IO when component mounts
    const token = localStorage.getItem("token")
    const user = JSON.parse(localStorage.getItem("user") || "{}")

    if (token && user.id) {
      connect(token)
      loadUnreadCount()
    }

    return () => {
      disconnect()
      reset()
    }
  }, [])

  useEffect(() => {
    // Setup Socket.IO event listeners
    const handleNewMessage = (message) => {
      // Update conversation last message
      updateConversationLastMessage(message.conversationId, message.content, message.timestamp)

      // Show toast if not in current conversation
      if (message.conversationId !== currentConversation?._id) {
        toast.info(`Tin nhắn mới từ ${message.senderType === "trainer" ? "PT" : "User"}`)
        loadUnreadCount()
      }
    }

    const handleNewConversation = (data) => {
      addConversation(data.conversation)
      toast.success(data.message || "Cuộc hội thoại mới được tạo")
    }

    const handleUserStatus = (data) => {
      updateUserOnlineStatus(data.userId, data.isOnline)
    }

    const handleNewBooking = (data) => {
      toast.info(data.message || "Bạn có booking mới")
    }

    const handleBookingUpdated = (data) => {
      toast.info(data.message || "Booking đã được cập nhật")
    }

    const handleBookingCancelled = (data) => {
      toast.warning(data.message || "Booking đã bị hủy")
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
  }, [isConnected, currentConversation])

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

  const handleSelectConversation = (conversation) => {
    setCurrentConversation(conversation)
    if (isMobile) {
      setShowChatList(false)
    }
  }

  const handleBackToList = () => {
    setShowChatList(true)
    setCurrentConversation(null)
  }

  const toggleFloatingChat = () => {
    setShowFloatingButton(!showFloatingButton)
  }

  // Mobile layout
  if (isMobile) {
    return (
      <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
        {showChatList ? (
          <ChatList onSelectConversation={handleSelectConversation} />
        ) : (
          <ChatWindow onBack={handleBackToList} />
        )}
      </Box>
    )
  }

  // Desktop layout
  return (
    <Box sx={{ height: "100vh", p: 2 }}>
      <Grid container spacing={2} sx={{ height: "100%" }}>
        <Grid item xs={4}>
          <ChatList onSelectConversation={handleSelectConversation} />
        </Grid>
        <Grid item xs={8}>
          <ChatWindow />
        </Grid>
      </Grid>

      {/* Floating Chat Button */}
      <Fab
        color="primary"
        aria-label="chat"
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          display: { xs: "none", md: "flex" },
        }}
        onClick={toggleFloatingChat}
      >
        <Badge badgeContent={unreadCount} color="error">
          <ChatIcon />
        </Badge>
      </Fab>

      {!isConnected && (
        <Paper
          elevation={3}
          sx={{
            position: "fixed",
            top: 16,
            right: 16,
            p: 2,
            backgroundColor: "warning.light",
            color: "warning.contrastText",
          }}
        >
          Đang kết nối lại...
        </Paper>
      )}
    </Box>
  )
}

export default UserChatPage
