import React, { useState, useEffect, useRef } from "react"
import {
  Box,
  Grid,
  Paper,
  useMediaQuery,
  useTheme,
  Typography,
  List,
  ListItem,
  ListItemText,
  TextField,
  IconButton,
  Avatar,
  Divider,
  Chip,
  Alert,
} from "@mui/material"
import { Send as SendIcon, ArrowBack as ArrowBackIcon } from "@mui/icons-material"
import { toast } from "react-toastify"
import useSocket from "../../hooks/useSocket"
import useUserStore from "../../stores/useUserStore"
import {
  getConversationsAPI,
  getMessagesAPI,
  sendMessageAPI,
  markMessagesAsReadAPI,
  getUnreadCountAPI,
} from "../../apis/conversation"

const UserChatPage = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  // ✅ Local state instead of store
  const [conversations, setConversations] = useState([])
  const [currentConversation, setCurrentConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  const [showChatList, setShowChatList] = useState(!isMobile)
  const [messageInput, setMessageInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)

  const { isConnected, connect, disconnect, joinConversation, on, off } = useSocket()
  const { user } = useUserStore()

  const messagesEndRef = useRef(null)
  const currentUserId = user?._id

  useEffect(() => {
    // Connect to Socket.IO when component mounts
    const token = localStorage.getItem("accessToken")

    if (token && currentUserId) {
      connect(token)
      loadConversations()
      loadUnreadCount()
    }

    return () => {
      disconnect()
    }
  }, [currentUserId, connect, disconnect])

  useEffect(() => {
    // Socket event listeners
    if (!isConnected) return

    const handleNewMessage = (message) => {
      // ✅ CHECK: Validate message object
      if (!message || !message.conversationId) {
        console.warn("⚠️ Received invalid message:", message)
        return
      }

      // Add to messages if it's for current conversation
      if (message.conversationId === currentConversation?._id) {
        // ✅ FIX: Remove optimistic message if this is from current user
        if (message.senderId === currentUserId) {
          setMessages((prev) => {
            const withoutOptimistic = prev.filter(
              (msg) => !(msg.isOptimistic && msg.content === message.content && msg.senderId === currentUserId),
            )
            return [...withoutOptimistic, message]
          })
        } else {
          setMessages((prev) => [...prev, message])
        }
        scrollToBottom()
      }

      // Update conversation last message
      setConversations((prev) =>
        prev.map((conv) =>
          conv._id === message.conversationId
            ? { ...conv, lastMessage: message.content, lastMessageAt: message.timestamp }
            : conv,
        ),
      )

      // Show toast if not in current conversation
      if (message.conversationId !== currentConversation?._id) {
        toast.info(`Tin nhắn mới từ ${message.senderType === "trainer" ? "PT" : "User"}`)
        loadUnreadCount()
      }
    }

    const handleMessagesRead = (data) => {
      if (data.conversationId === currentConversation?._id) {
        setMessages((prev) => prev.map((msg) => (data.messageIds.includes(msg._id) ? { ...msg, isRead: true } : msg)))
      }
    }

    const handleJoinedConversation = (data) => {
      console.log("🚪 Joined conversation:", data)
    }

    on("new_message", handleNewMessage)
    on("messages_read", handleMessagesRead)
    on("joined_conversation", handleJoinedConversation)

    return () => {
      off("new_message", handleNewMessage)
      off("messages_read", handleMessagesRead)
      off("joined_conversation", handleJoinedConversation)
    }
  }, [isConnected, currentConversation, on, off])

  // Auto scroll to bottom
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const loadConversations = async () => {
    try {
      setIsLoading(true)
      const userRole = user.role === "pt" ? "pt" : "user"
      const response = await getConversationsAPI(currentUserId, 1, 20, userRole)

      if (response.success) {
        setConversations(response.data)
        console.log("✅ Conversations loaded:", response.data.length)
      }
    } catch (error) {
      console.error("Error loading conversations:", error)
      toast.error("Không thể tải danh sách hội thoại")
    } finally {
      setIsLoading(false)
    }
  }

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

  const loadMessages = async (conversationId) => {
    try {
      setIsLoading(true)
      setMessages([]) // ✅ Clear messages for clean loading state

      const userRole = user.role === "pt" ? "pt" : "user"
      const response = await getMessagesAPI(conversationId, 1, 50, userRole)

      if (response.success) {
        const loadedMessages = response.data.messages || []
        setMessages(loadedMessages)

        // Mark messages as read
        const unreadMessages = loadedMessages.filter((msg) => !msg.isRead && msg.senderId !== currentUserId)

        if (unreadMessages.length > 0) {
          const unreadIds = unreadMessages.map((msg) => msg._id)
          try {
            await markMessagesAsReadAPI(conversationId, unreadIds, userRole)
          } catch (error) {
            console.error("Failed to mark messages as read:", error)
          }
        }
      }
    } catch (error) {
      console.error("Error loading messages:", error)
      toast.error("Không thể tải tin nhắn")
    } finally {
      setIsLoading(false)
      // ✅ Scroll after loading complete
      setTimeout(() => {
        scrollToBottom()
      }, 50)
    }
  }

  const handleSelectConversation = (conversation) => {
    setCurrentConversation(conversation)
    joinConversation(conversation._id)
    loadMessages(conversation._id)

    if (isMobile) {
      setShowChatList(false)
    }
  }

  const handleBackToList = () => {
    setShowChatList(true)
    setCurrentConversation(null)
    setMessages([])
  }

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !currentConversation || isSending) return

    const content = messageInput.trim()
    setMessageInput("")
    setIsSending(true)

    // Optimistic UI update
    const tempMessage = {
      _id: Date.now().toString(),
      conversationId: currentConversation._id,
      senderId: currentUserId,
      senderType: user.role === "pt" ? "trainer" : "user",
      content: content,
      isRead: false,
      timestamp: new Date().toISOString(),
      isOptimistic: true,
    }

    setMessages((prev) => [...prev, tempMessage])
    scrollToBottom()

    try {
      const userRole = user.role === "pt" ? "pt" : "user"
      const response = await sendMessageAPI(currentConversation._id, content, userRole)

      if (response.success) {
        const realMessage = response.data
        setMessages((prev) =>
          prev.map((msg) => (msg._id === tempMessage._id ? { ...realMessage, isOptimistic: false } : msg)),
        )
      }
    } catch (error) {
      console.error("Failed to send message:", error)
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === tempMessage._id ? { ...msg, isError: true, content: content + " (Gửi thất bại)" } : msg,
        ),
      )
      setMessageInput(content)
      toast.error("Gửi tin nhắn thất bại")
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Helper function to get participant info
  const getParticipant = (conversation) => {
    if (!conversation?.userInfo || !conversation?.trainerInfo) return null

    if (user.role === "user") {
      return conversation.trainerInfo
    } else {
      return conversation.userInfo
    }
  }

  const isMyMessage = (message) => {
    return message.senderId === currentUserId
  }

  const formatTime = (timestamp) => {
    try {
      const date = new Date(timestamp)
      return date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return "--:--"
    }
  }

  // Chat List Component
  const ChatList = () => (
    <Paper sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ p: 2, borderBottom: "1px solid #e0e0e0" }}>
        <Typography variant="h6">Tin nhắn ({conversations.length})</Typography>
        {unreadCount > 0 && <Chip label={`${unreadCount} tin nhắn mới`} size="small" color="error" />}
      </Box>

      <Box sx={{ flex: 1, overflow: "auto" }}>
        {isLoading ? (
          <Box sx={{ p: 2 }}>
            <Typography color="text.secondary">Đang tải...</Typography>
          </Box>
        ) : conversations.length === 0 ? (
          <Box sx={{ p: 2, textAlign: "center" }}>
            <Typography color="text.secondary">Chưa có cuộc trò chuyện nào</Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {conversations.map((conv) => {
              const participant = getParticipant(conv)
              return (
                <ListItem
                  key={conv._id}
                  button
                  selected={currentConversation?._id === conv._id}
                  onClick={() => handleSelectConversation(conv)}
                  sx={{
                    borderBottom: "1px solid #f0f0f0",
                    "&:hover": { bgcolor: "grey.50" },
                  }}
                >
                  <Avatar src={participant?.avatar} sx={{ mr: 2 }}>
                    {participant?.fullName?.charAt(0)}
                  </Avatar>
                  <ListItemText
                    primary={participant?.fullName || "Unknown"}
                    secondary={
                      <>
                        {conv.lastMessage?.substring(0, 30)}...
                        <br />
                        <small>{conv._id.substring(0, 8)}...</small>
                      </>
                    }
                  />
                  {conv.unreadCount > 0 && <Chip label="Mới" size="small" color="secondary" />}
                </ListItem>
              )
            })}
          </List>
        )}
      </Box>
    </Paper>
  )

  // Chat Window Component
  const ChatWindow = () => (
    <Paper sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {currentConversation ? (
        <>
          {/* Header */}
          <Box sx={{ p: 2, borderBottom: "1px solid #e0e0e0", display: "flex", alignItems: "center" }}>
            {isMobile && (
              <IconButton onClick={handleBackToList} sx={{ mr: 1 }}>
                <ArrowBackIcon />
              </IconButton>
            )}
            <Avatar src={getParticipant(currentConversation)?.avatar} sx={{ mr: 2 }}>
              {getParticipant(currentConversation)?.fullName?.charAt(0)}
            </Avatar>
            <Typography variant="h6">{getParticipant(currentConversation)?.fullName || "Unknown"}</Typography>
          </Box>

          {/* Messages */}
          <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
            {/* ✅ LOADING INDICATOR */}
            {isLoading && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  py: 4,
                }}
              >
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Đang tải tin nhắn...
                </Typography>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    border: "2px solid #e0e0e0",
                    borderTop: "2px solid #1976d2",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                    "@keyframes spin": {
                      "0%": { transform: "rotate(0deg)" },
                      "100%": { transform: "rotate(360deg)" },
                    },
                  }}
                />
              </Box>
            )}

            {!isLoading &&
              messages.map((message) => (
                <Box
                  key={message._id}
                  sx={{
                    display: "flex",
                    flexDirection: isMyMessage(message) ? "row-reverse" : "row",
                    mb: 1,
                    alignItems: "flex-start",
                  }}
                >
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
                    <Typography variant="caption" sx={{ opacity: 0.7, display: "block", mt: 0.5 }}>
                      {formatTime(message.timestamp)}
                      {isMyMessage(message) && (message.isRead ? " • ✓✓" : " • ✓")}
                    </Typography>
                  </Box>
                </Box>
              ))}
            <div ref={messagesEndRef} />
          </Box>

          <Divider />

          {/* Input */}
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Nhập tin nhắn..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={!isConnected || isSending}
                multiline
                maxRows={3}
              />
              <IconButton
                color="primary"
                onClick={handleSendMessage}
                disabled={!messageInput.trim() || !isConnected || isSending}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </Box>
        </>
      ) : (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
          <Typography color="text.secondary">
            {isMobile ? "← Chọn cuộc trò chuyện" : "← Chọn cuộc trò chuyện để bắt đầu"}
          </Typography>
        </Box>
      )}
    </Paper>
  )

  // Connection status
  if (!isConnected) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="warning">Đang kết nối lại... Socket: {isConnected ? "Connected" : "Disconnected"}</Alert>
      </Box>
    )
  }

  // Mobile layout
  if (isMobile) {
    return (
      <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
        {showChatList ? <ChatList /> : <ChatWindow />}
      </Box>
    )
  }

  // Desktop layout
  return (
    <Box sx={{ height: "100vh", p: 2 }}>
      <Grid container spacing={2} sx={{ height: "100%" }}>
        <Grid item xs={4}>
          <ChatList />
        </Grid>
        <Grid item xs={8}>
          <ChatWindow />
        </Grid>
      </Grid>
    </Box>
  )
}

export default UserChatPage
