import React, { useState, useEffect, useRef } from "react"
import {
  Box,
  Fab,
  Card,
  CardContent,
  Typography,
  TextField,
  IconButton,
  Avatar,
  List,
  ListItem,
  Chip,
  Badge,
  Collapse,
  Divider,
} from "@mui/material"
import {
  Chat as ChatIcon,
  Close as CloseIcon,
  Send as SendIcon,
  Minimize as MinimizeIcon,
  Maximize as MaximizeIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material"

import useChatStore from "~/stores/useChatStore"
import useSocket from "~/hooks/useSocket"
import useUserStore from "~/stores/useUserStore"
import { getConversationsAPI, getMessagesAPI, sendMessageAPI, markMessagesAsReadAPI } from "~/apis/conversation"

const FloatingChatWidget = () => {
  const {
    conversations,
    setConversations,
    currentConversation,
    setCurrentConversation,
    messages,
    setMessages,
    addMessage,
    updateMessage,
    markMessagesAsRead,
    unreadCount,
    setUnreadCount,
    isUserOnline,
    getTypingUsersInCurrentConversation,
    getParticipant,
  } = useChatStore()
  console.log("🚀 ~ FloatingChatWidget ~ messages:", messages)

  const { isConnected, connect, disconnect, sendMessage, setTyping, markAsRead, joinConversation, on, off } =
    useSocket()

  const { user } = useUserStore()

  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [showConversationList, setShowConversationList] = useState(true)
  const [messageInput, setMessageInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [typingTimeout, setTypingTimeout] = useState(null)

  const messagesEndRef = useRef(null)
  const currentUserId = user?._id

  // Don't render if user is not eligible
  if (!user?._id || (user.role !== "user" && user.role !== "pt")) {
    return null
  }

  // Connect Socket.IO when widget mounts
  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (token && currentUserId) {
      console.log("🔌 Connecting Socket.IO for user:", currentUserId)
      connect(token)
    }

    return () => {
      disconnect()
    }
  }, [currentUserId])

  // Load conversations when opened
  useEffect(() => {
    if (isOpen && !isMinimized && showConversationList) {
      loadConversations()
    }
  }, [isOpen, isMinimized, showConversationList])

  // Socket event listeners
  useEffect(() => {
    const handleNewMessage = (message) => {
      console.log("📩 New message received:", message)
      addMessage(message)
      scrollToBottom()

      if (!isOpen || isMinimized || message.conversationId !== currentConversation?._id) {
        setUnreadCount((prev) => prev + 1)
      }
    }

    if (isConnected) {
      on("newMessage", handleNewMessage)
    }

    return () => {
      off("newMessage", handleNewMessage)
    }
  }, [isConnected, isOpen, isMinimized, currentConversation])

  const loadConversations = async () => {
    try {
      setIsLoading(true)
      console.log("📄 Loading conversations...")
      const response = await getConversationsAPI(currentUserId, 1, 20, user?.role)

      if (response.success) {
        // Debug log để xem conversation structure
        console.log("🔍 Conversation structure:", response.data[0])
        setConversations(response.data)
        console.log("✅ Conversations loaded:", response.data.length)
      }
    } catch (error) {
      console.error("Error loading conversations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadMessages = async (conversationId) => {
    try {
      setIsLoading(true)
      const response = await getMessagesAPI(conversationId, 1, 50, user?.role)

      if (response.success) {
        // ✅ THÊM: Debug log để xem message structure
        console.log("🔍 Message structure:", response.data.messages?.[0])
        setMessages(response.data.messages || [])
        console.log("✅ Messages loaded:", response.data.messages?.length || 0)

        // Auto mark all messages as read khi vào conversation
        const unreadMessages =
          response.data.messages?.filter((msg) => !msg.isRead && msg.senderId !== currentUserId) || []

        if (unreadMessages.length > 0) {
          const unreadIds = unreadMessages.map((msg) => msg._id)
          try {
            await markMessagesAsReadAPI(conversationId, unreadIds, user?.role)
            console.log("✅ Marked", unreadIds.length, "messages as read")

            // Update local state
            markMessagesAsRead(unreadIds)
          } catch (error) {
            console.error("Failed to mark messages as read:", error)
          }
        }

        setTimeout(scrollToBottom, 100)
      }
    } catch (error) {
      console.error("Error loading messages:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectConversation = (conversation) => {
    setCurrentConversation(conversation)
    setShowConversationList(false)
    joinConversation(conversation._id)
    loadMessages(conversation._id)
  }

  const handleBackToList = () => {
    setShowConversationList(true)
    setCurrentConversation(null)
    setMessages([])
  }

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !currentConversation || isSending) return

    const content = messageInput.trim()
    setMessageInput("")
    setIsSending(true)

    // Optimistic update - hiển thị tin nhắn ngay lập tức
    const tempMessage = {
      _id: Date.now().toString(),
      conversationId: currentConversation._id,
      senderId: currentUserId,
      senderType: user.role === "pt" ? "trainer" : "user",
      content: content,
      isRead: false,
      createdAt: new Date().toISOString(), // ✅ SỬA: Dùng ISO string thay vì Date object
      isOptimistic: true,
    }

    // Thêm tin nhắn vào UI ngay lập tức
    addMessage(tempMessage)
    scrollToBottom()

    try {
      // Gửi qua socket (real-time)
      sendMessage(currentConversation._id, content)

      // Gửi qua API (persistent storage)
      const response = await sendMessageAPI(currentConversation._id, content, user?.role)

      if (response.success) {
        // Thay thế tin nhắn tạm bằng tin nhắn thật từ server
        const realMessage = response.data
        updateMessage(tempMessage._id, {
          ...realMessage,
          isOptimistic: false,
        })

        console.log("✅ Message sent successfully:", realMessage)
      }
    } catch (error) {
      console.error("Failed to send message:", error)

      // Xóa tin nhắn tạm nếu gửi thất bại
      updateMessage(tempMessage._id, {
        isError: true,
        content: content + " (Gửi thất bại)",
      })

      setMessageInput(content)
    } finally {
      setIsSending(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // ✅ SỬA: formatTime function để handle Invalid Date
  const formatTime = (timestamp) => {
    console.log("🚀 ~ formatTime ~ timestamp:", timestamp)
    try {
      if (!timestamp) {
        return "--:--"
      }

      // Handle different timestamp formats
      let date
      if (typeof timestamp === "number") {
        // Unix timestamp (milliseconds hoặc seconds)
        date = timestamp > 1000000000000 ? new Date(timestamp) : new Date(timestamp * 1000)
      } else if (typeof timestamp === "string") {
        // ISO string hoặc date string
        date = new Date(timestamp)
      } else if (timestamp instanceof Date) {
        // Date object
        date = timestamp
      } else {
        console.warn("Invalid timestamp format:", timestamp)
        return "--:--"
      }

      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn("Invalid Date created from timestamp:", timestamp)
        return "--:--"
      }

      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (error) {
      console.error("Error formatting time:", error, "timestamp:", timestamp)
      return "--:--"
    }
  }

  const isMyMessage = (message) => {
    return message.senderId === currentUserId
  }

  const handleTyping = (value) => {
    setMessageInput(value)

    if (currentConversation && value.trim()) {
      setTyping(currentConversation._id, true)

      // Clear previous timeout
      if (typingTimeout) {
        clearTimeout(typingTimeout)
      }

      // Set new timeout to stop typing
      const timeout = setTimeout(() => {
        setTyping(currentConversation._id, false)
      }, 1000)

      setTypingTimeout(timeout)
    }
  }

  // ✅ THÊM: Helper functions để format tin nhắn trong conversation list
  const formatConversationMessage = (conversation) => {
    if (!conversation.lastMessage || conversation.lastMessage === "Bắt đầu cuộc hội thoại...") {
      return "Bắt đầu cuộc hội thoại..."
    }

    let messageText = conversation.lastMessage

    // ✅ SỬA: Logic backup để detect tin nhắn của mình
    let isMyLastMessage = false

    if (conversation.lastSenderId) {
      // Nếu có lastSenderId từ backend (sau khi fix backend)
      isMyLastMessage = conversation.lastSenderId.toString() === currentUserId?.toString()
    } else {
      // ✅ WORKAROUND: Dùng messages local để check nếu có
      if (currentConversation && currentConversation._id === conversation._id && messages.length > 0) {
        const lastMessage = messages[messages.length - 1]
        isMyLastMessage = lastMessage.senderId === currentUserId
      }
    }

    if (isMyLastMessage) {
      messageText = `Bạn: ${conversation.lastMessage}`
    }

    // ✅ THÊM: Truncate text nếu quá dài (giới hạn 40 ký tự)
    if (messageText.length > 35) {
      messageText = messageText.substring(0, 32) + "..."
    }

    return messageText
  }

  const isConversationUnread = (conversation) => {
    // Kiểm tra conversation có tin nhắn chưa đọc không
    return conversation.unreadCount > 0
  }

  const renderConversationList = () => (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {isLoading ? (
        <Box sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            Đang tải...
          </Typography>
        </Box>
      ) : conversations.length === 0 ? (
        <Box sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            Chưa có cuộc hội thoại nào
          </Typography>
        </Box>
      ) : (
        <Box sx={{ flex: 1, overflow: "auto" }}>
          <List sx={{ p: 0 }}>
            {conversations.map((conversation) => {
              const participant = getParticipant(conversation)
              const messageText = formatConversationMessage(conversation)
              const isUnread = isConversationUnread(conversation)

              return (
                <ListItem
                  key={conversation._id}
                  component="div"
                  onClick={() => handleSelectConversation(conversation)}
                  sx={{
                    borderBottom: "1px solid #f0f0f0",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                >
                  <Avatar src={participant?.avatar} sx={{ mr: 1.5 }}>
                    {participant?.fullName?.charAt(0)}
                  </Avatar>

                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: "bold" }} variant="subtitle1">
                      {participant?.fullName || "Bắt đầu cuộc hội thoại..."}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      noWrap
                      sx={{
                        fontWeight: isUnread ? "bold" : "normal", // ✅ In đậm nếu chưa đọc
                        color: isUnread ? "text.primary" : "text.secondary", // ✅ Màu đậm hơn nếu chưa đọc
                      }}
                    >
                      {messageText}
                    </Typography>
                  </Box>

                  {/* Badge hiển thị số tin nhắn chưa đọc */}
                  {isUnread && (
                    <Chip
                      label={conversation.unreadCount}
                      size="small"
                      color="primary"
                      sx={{ minWidth: 24, height: 24 }}
                    />
                  )}

                  {/* Badge hiển thị "Mới" nếu chưa có tin nhắn */}
                  {(!conversation.lastMessage || conversation.lastMessage === "Bắt đầu cuộc hội thoại...") && (
                    <Chip label="Mới" size="small" color="secondary" />
                  )}
                </ListItem>
              )
            })}
          </List>
        </Box>
      )}
    </Box>
  )

  const renderChatView = () => (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Messages Area */}
      <Box sx={{ flex: 1, overflow: "auto", p: 1 }}>
        {/* Timestamp ở đầu - luôn hiển thị */}
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              bgcolor: "grey.100",
              px: 2,
              py: 0.5,
              borderRadius: 2,
              fontSize: "0.75rem",
            }}
          >
            {new Date().toLocaleDateString("vi-VN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Typography>
        </Box>

        {/* Welcome Screen - luôn hiển thị khi vào conversation */}
        {currentConversation && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              p: 3,
              mb: 2,
              borderBottom: messages.length > 0 ? "1px solid #e0e0e0" : "none",
            }}
          >
            <Avatar src={getParticipant(currentConversation)?.avatar} sx={{ width: 80, height: 80, mb: 2 }}>
              {getParticipant(currentConversation)?.fullName?.charAt(0)}
            </Avatar>
            <Typography variant="h6" gutterBottom>
              {getParticipant(currentConversation)?.fullName}
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 2 }}>
              🔒 Tin nhắn và cuộc gọi được bảo mật bằng mã hóa đầu cuối. Chỉ những người tham gia đoạn chat này mới có
              thể đọc, nghe hoặc chia sẻ.{" "}
              <Typography component="span" color="primary" sx={{ cursor: "pointer" }}>
                Tìm hiểu thêm
              </Typography>
            </Typography>
            {messages.length === 0 && (
              <Typography variant="caption" color="text.secondary">
                Bắt đầu cuộc trò chuyện của bạn...
              </Typography>
            )}
          </Box>
        )}

        {/* Messages */}
        {messages.map((message, index) => (
          <Box
            key={message._id}
            sx={{
              display: "flex",
              flexDirection: isMyMessage(message) ? "row-reverse" : "row",
              mb: 1,
              alignItems: "flex-start",
            }}
          >
            {/* Avatar cho tin nhắn của người khác */}
            {!isMyMessage(message) && (
              <Avatar src={getParticipant(currentConversation)?.avatar} sx={{ width: 32, height: 32, mt: 0.5 }}>
                {getParticipant(currentConversation)?.fullName?.charAt(0)}
              </Avatar>
            )}

            <Box
              sx={{
                maxWidth: "70%",
                bgcolor: isMyMessage(message) ? "primary.main" : "grey.100",
                color: isMyMessage(message) ? "white" : "text.primary",
                borderRadius: 2,
                px: 2,
                py: 1,
                mx: 1,
                opacity: message.isOptimistic ? 0.7 : 1,
              }}
            >
              <Typography variant="body2">
                {message.content}
                {message.isError && " ❌"}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: isMyMessage(message) ? "flex-end" : "flex-start",
                  mt: 0.5,
                }}
              >
                <Typography variant="caption" sx={{ opacity: 0.7, fontSize: "0.625rem" }}>
                  {formatTime(message.timestamp)}
                </Typography>

                {/* Read status indicator cho tin nhắn của mình */}
                {isMyMessage(message) && (
                  <Typography variant="caption" sx={{ opacity: 0.7, fontSize: "0.625rem", ml: 1 }}>
                    {message.isRead ? "✓✓" : "✓"}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        ))}

        <div ref={messagesEndRef} />
      </Box>

      <Divider />

      {/* Input Area */}
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Nhập tin nhắn..."
            value={messageInput}
            onChange={(e) => handleTyping(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            disabled={isSending}
            size="small"
            multiline
            maxRows={3}
          />
          <IconButton color="primary" onClick={handleSendMessage} disabled={!messageInput.trim() || isSending}>
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  )

  return (
    <>
      {/* Floating Action Button */}
      <Fab
        color="primary"
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 1000,
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Badge badgeContent={unreadCount} color="error">
          <ChatIcon />
        </Badge>
      </Fab>

      {/* Chat Widget */}
      <Collapse in={isOpen}>
        <Card
          sx={{
            position: "fixed",
            bottom: 90,
            right: 20,
            width: 350,
            height: isMinimized ? 60 : 500,
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              bgcolor: "primary.main",
              color: "white",
              p: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
              {/* Back button - chỉ hiển thị khi đang trong chat */}
              {!showConversationList && (
                <IconButton size="small" sx={{ color: "white", mr: 1 }} onClick={handleBackToList}>
                  <ArrowBackIcon />
                </IconButton>
              )}

              <Typography
                variant="h6"
                sx={{
                  pl: !currentConversation || !getParticipant(currentConversation)?.fullName ? 1 : 0,
                }}
              >
                {currentConversation ? getParticipant(currentConversation)?.fullName || "Tin nhắn" : "Tin nhắn"}
              </Typography>
            </Box>

            <Box>
              <IconButton size="small" sx={{ color: "white" }} onClick={() => setIsMinimized(!isMinimized)}>
                {isMinimized ? <MaximizeIcon /> : <MinimizeIcon />}
              </IconButton>
              <IconButton size="small" sx={{ color: "white" }} onClick={() => setIsOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Content */}
          {!isMinimized && (
            <CardContent
              sx={{
                p: 0,
                flex: 1,
                overflow: "hidden",
                "&:last-child": {
                  pb: 0,
                },
              }}
            >
              {showConversationList ? renderConversationList() : renderChatView()}
            </CardContent>
          )}
        </Card>
      </Collapse>
    </>
  )
}

export default FloatingChatWidget
