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

import useSocket from "~/hooks/useSocket"
import useUserStore from "~/stores/useUserStore"
import {
  getConversationsAPI,
  getMessagesAPI,
  sendMessageAPI,
  markMessagesAsReadAPI,
  getUnreadCountAPI,
} from "~/apis/conversation"

const FloatingChatWidget = ({ onClose, lowPosition = false }) => {
  // ✅ Local state instead of store
  const [conversations, setConversations] = useState([])
  const [currentConversation, setCurrentConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  const { isConnected, connect, disconnect, joinConversation, on, off } = useSocket()
  const { user } = useUserStore()

  const [isOpen, setIsOpen] = useState(true)
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
      connect(token)
    }

    return () => {
      disconnect()
    }
  }, [currentUserId, connect, disconnect])

  // Load initial data
  useEffect(() => {
    if (isOpen && !isMinimized && showConversationList) {
      loadConversations()
      loadUnreadCount()
    }
  }, [isOpen, isMinimized, showConversationList])

  // Socket event listeners
  useEffect(() => {
    if (!isConnected) return

    const handleNewMessage = (message) => {
      // ✅ CHECK: Validate message object
      if (!message || !message.conversationId) {
        return
      }

      // Add to messages if it's for current conversation
      if (message.conversationId === currentConversation?._id) {
        // ✅ FIX: Remove optimistic message if this is from current user
        if (message.senderId === currentUserId) {
          setMessages((prev) => {
            // Remove any optimistic message with same content
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

      // Update unread count if widget is closed or minimized
      if (!isOpen || isMinimized || message.conversationId !== currentConversation?._id) {
        setUnreadCount((prev) => prev + 1)
      }

      // Update conversation last message
      setConversations((prev) =>
        prev.map((conv) =>
          conv._id === message.conversationId
            ? { ...conv, lastMessage: message.content, lastMessageAt: message.timestamp }
            : conv,
        ),
      )
    }

    const handleMessagesRead = (data) => {
      if (data.conversationId === currentConversation?._id) {
        setMessages((prev) => prev.map((msg) => (data.messageIds.includes(msg._id) ? { ...msg, isRead: true } : msg)))
      }
    }

    const handleJoinedConversation = (data) => {}

    on("new_message", handleNewMessage)
    on("messages_read", handleMessagesRead)
    on("joined_conversation", handleJoinedConversation)

    return () => {
      off("new_message", handleNewMessage)
      off("messages_read", handleMessagesRead)
      off("joined_conversation", handleJoinedConversation)
    }
  }, [isConnected, isOpen, isMinimized, currentConversation, on, off])

  // ✅ Load conversations from API
  const loadConversations = async () => {
    try {
      setIsLoading(true)
      const userRole = user.role === "pt" ? "pt" : "user"
      const response = await getConversationsAPI(currentUserId, 1, 20, userRole)

      if (response.success) {
        setConversations(response.data)
      }
    } catch (error) {
      console.error("Error loading conversations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ Load unread count from API
  const loadUnreadCount = async () => {
    try {
      const response = await getUnreadCountAPI()
      if (response.success) {
        setUnreadCount(response.data.totalUnread)
      }
    } catch (error) {
      console.error("Error loading unread count:", error)
    }
  }

  const loadMessages = async (conversationId) => {
    try {
      setIsLoading(true)
      setMessages([]) // ✅ Clear messages immediately for clean loading state

      const userRole = user.role === "pt" ? "pt" : "user"
      const response = await getMessagesAPI(conversationId, 1, 50, userRole)

      if (response.success) {
        const loadedMessages = response.data.messages || []
        setMessages(loadedMessages)

        const unreadMessages = loadedMessages.filter((msg) => !msg.isRead && msg.senderId !== currentUserId)

        if (unreadMessages.length > 0) {
          const unreadIds = unreadMessages.map((msg) => msg._id)
          try {
            await markMessagesAsReadAPI(conversationId, unreadIds, userRole)
            setMessages((prev) => prev.map((msg) => (unreadIds.includes(msg._id) ? { ...msg, isRead: true } : msg)))
          } catch (error) {
            console.error("Failed to mark messages as read:", error)
          }
        }
      }
    } catch (error) {
      console.error("Error loading messages:", error)
    } finally {
      setIsLoading(false)
      // ✅ Scroll after loading is complete and state is updated
      setTimeout(() => {
        scrollToBottom()
      }, 50)
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

  const handleClose = () => {
    setIsOpen(false)
    if (onClose) {
      onClose()
    }
  }

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !currentConversation || isSending) return

    const content = messageInput.trim()
    setMessageInput("")
    setIsSending(true)

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
    } finally {
      setIsSending(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const formatTime = (timestamp) => {
    try {
      if (!timestamp) return "--:--"

      let date
      if (typeof timestamp === "number") {
        date = timestamp > 1000000000000 ? new Date(timestamp) : new Date(timestamp * 1000)
      } else if (typeof timestamp === "string") {
        date = new Date(timestamp)
      } else {
        date = new Date()
      }

      if (isNaN(date.getTime())) {
        return "--:--"
      }

      return date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (error) {
      console.error("Error formatting time:", error)
      return "--:--"
    }
  }

  const isMyMessage = (message) => {
    return message.senderId === currentUserId
  }

  // ✅ Helper function to get participant (moved from store)
  const getParticipant = (conversation) => {
    if (!conversation || !conversation.userInfo || !conversation.trainerInfo) return null

    if (user.role === "user") {
      return {
        _id: conversation.trainerInfo.trainerId,
        fullName: conversation.trainerInfo.fullName,
        avatar: conversation.trainerInfo.avatar,
      }
    } else {
      return {
        _id: conversation.userInfo.userId,
        fullName: conversation.userInfo.fullName,
        avatar: conversation.userInfo.avatar,
      }
    }
  }

  const renderConversationList = () => (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ flex: 1, overflow: "auto" }}>
        {isLoading ? (
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Đang tải...
            </Typography>
          </Box>
        ) : conversations.length === 0 ? (
          <Box sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Chưa có cuộc trò chuyện nào
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {conversations.map((conversation) => {
              const participant = getParticipant(conversation)
              return (
                <ListItem
                  key={conversation._id}
                  onClick={() => handleSelectConversation(conversation)}
                  sx={{
                    cursor: "pointer",
                    "&:hover": { bgcolor: "grey.50" },
                    borderBottom: "1px solid #f0f0f0",
                  }}
                >
                  <Avatar src={participant?.avatar} sx={{ mr: 2 }}>
                    {participant?.fullName?.charAt(0)}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body1" noWrap>
                      {participant?.fullName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {conversation.lastMessage || "Chưa có tin nhắn"}
                    </Typography>
                  </Box>
                  {conversation.unreadCount > 0 && <Chip label="Mới" size="small" color="secondary" />}
                </ListItem>
              )
            })}
          </List>
        )}
      </Box>
    </Box>
  )

  const renderChatView = () => (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ flex: 1, overflow: "auto", p: 1 }}>
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
              🔒 Tin nhắn được bảo mật an toàn
            </Typography>
            {messages.length === 0 && (
              <Typography variant="caption" color="text.secondary">
                Bắt đầu cuộc trò chuyện...
              </Typography>
            )}
          </Box>
        )}

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
                  {formatTime(message.timestamp || message.createdAt)}
                </Typography>

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

      <Box sx={{ p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Nhập tin nhắn..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
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
    <Collapse in={isOpen}>
      <Card
        sx={{
          position: "fixed",
          bottom: lowPosition ? 20 : 90,
          right: 20,
          width: 350,
          height: isMinimized ? 60 : 500,
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
        }}
      >
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
            {!showConversationList && (
              <IconButton size="small" sx={{ color: "white", mr: 1 }} onClick={handleBackToList}>
                <ArrowBackIcon />
              </IconButton>
            )}

            <Typography variant="h6">
              {currentConversation ? getParticipant(currentConversation)?.fullName || "Tin nhắn" : "Tin nhắn"}
            </Typography>
          </Box>

          <Box>
            <IconButton size="small" sx={{ color: "white" }} onClick={() => setIsMinimized(!isMinimized)}>
              {isMinimized ? <MaximizeIcon /> : <MinimizeIcon />}
            </IconButton>
            <IconButton size="small" sx={{ color: "white" }} onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

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
  )
}

export default FloatingChatWidget
