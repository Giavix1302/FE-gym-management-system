import React, { useState, useEffect } from "react"
import { Box, Grid, Paper, useMediaQuery, useTheme, Fab, Badge, Typography } from "@mui/material"
import { Chat as ChatIcon } from "@mui/icons-material"
import { toast } from "react-toastify"
import ChatList from "../../components/ChatList"
import ChatWindow from "../../components/ChatWindow"
import useChatStore from "../../stores/useChatStore"
import useSocket from "../../hooks/useSocket"
import { getUnreadCountAPI } from "../../apis/conversation"

const TrainerChatPage = () => {
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

  useEffect(() => {
    // Connect to Socket.IO when component mounts
    const token = localStorage.getItem("accessToken")
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
    // Setup Socket.IO event listeners for trainer-specific events
    const handleNewMessage = (message) => {
      // Update conversation last message
      updateConversationLastMessage(message.conversationId, message.content, message.timestamp)

      // Show toast if not in current conversation
      if (message.conversationId !== currentConversation?._id) {
        toast.info(`Tin nhắn mới từ ${message.senderType === "user" ? "học viên" : "PT"}`)
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
      toast.success(`Booking mới từ ${data.user?.fullName}`)
    }

    const handleBookingUpdated = (data) => {
      toast.info(data.message || "Booking đã được cập nhật")
    }

    const handleBookingCancelled = (data) => {
      toast.warning(`${data.user?.fullName} đã hủy booking`)
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

  // Mobile layout
  if (isMobile) {
    return (
      <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
        {showChatList ? (
          <Box>
            <Box p={2}>
              <Typography variant="h5" gutterBottom>
                Tin nhắn với học viên
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Quản lý cuộc hội thoại với các học viên đã booking
              </Typography>
            </Box>
            <ChatList onSelectConversation={handleSelectConversation} />
          </Box>
        ) : (
          <ChatWindow onBack={handleBackToList} />
        )}
      </Box>
    )
  }

  // Desktop layout
  return (
    <Box sx={{ height: "100vh", p: 2 }}>
      <Box mb={2}>
        <Typography variant="h4" gutterBottom>
          Tin nhắn với học viên
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Tư vấn và hỗ trợ học viên thông qua tin nhắn
        </Typography>
      </Box>

      <Grid container spacing={2} sx={{ height: "calc(100% - 100px)" }}>
        <Grid item xs={4}>
          <ChatList onSelectConversation={handleSelectConversation} />
        </Grid>
        <Grid item xs={8}>
          {currentConversation ? (
            <ChatWindow />
          ) : (
            <Paper
              elevation={1}
              sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <ChatIcon sx={{ fontSize: 64, color: "text.secondary" }} />
              <Typography variant="h6" color="text.secondary">
                Chọn một học viên để bắt đầu tư vấn
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Tất cả học viên đã booking với bạn sẽ xuất hiện ở danh sách bên trái
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>

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

export default TrainerChatPage
