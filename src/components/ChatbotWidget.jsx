import React, { useState, useEffect, useRef } from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Chip,
  Collapse,
  Divider,
  Button,
  Alert,
  LinearProgress,
} from "@mui/material"
import {
  SmartToy as SmartToyIcon,
  Close as CloseIcon,
  Send as SendIcon,
  Minimize as MinimizeIcon,
  Maximize as MaximizeIcon,
  Login as LoginIcon,
  Launch as LaunchIcon,
} from "@mui/icons-material"

import useChatbotStore from "~/stores/useChatbotStore"
import useUserStore from "~/stores/useUserStore"

const ChatbotWidget = ({ onClose, lowPosition = false }) => {
  const {
    messages,
    isLoading,
    quickReplies,
    error,
    lastResponseType,
    awaitingConfirmation,
    sendMessage,
    processQuickReply,
    loadConversationHistory,
    loadQuickReplies,
    switchToAuthenticatedMode,
    clearError,
    initializeChatbot,
    getLastBotMessage,
  } = useChatbotStore()

  const { user } = useUserStore()

  const [isOpen, setIsOpen] = useState(true) // Start open when controlled by SpeedDial
  const [isMinimized, setIsMinimized] = useState(false)
  const [messageInput, setMessageInput] = useState("")
  const [isSending, setIsSending] = useState(false)

  const messagesEndRef = useRef(null)
  const isAuthenticated = !!user

  // Initialize chatbot when component mounts
  useEffect(() => {
    initializeChatbot()
  }, [])

  // Handle authentication state change
  useEffect(() => {
    if (isAuthenticated) {
      switchToAuthenticatedMode()
    }
  }, [isAuthenticated])

  // Load data when widget opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      loadConversationHistory()
      loadQuickReplies()
    }
  }, [isOpen, isMinimized])

  // Auto scroll to bottom when new messages
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleClose = () => {
    setIsOpen(false)
    if (onClose) {
      onClose()
    }
  }

  const handleSendMessage = async () => {
    if (!messageInput.trim() || isSending) return

    const content = messageInput.trim()
    setMessageInput("")
    setIsSending(true)

    try {
      await sendMessage(content)
    } catch (error) {
      console.error("Send message error:", error)
    } finally {
      setIsSending(false)
    }
  }

  const handleQuickReply = async (quickReply) => {
    setIsSending(true)
    try {
      await processQuickReply(quickReply)
    } catch (error) {
      console.error("Quick reply error:", error)
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

  const handleLoginRedirect = () => {
    window.location.href = "/login"
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

  const formatContent = (content) => {
    return content.replace(/\n/g, "<br>")
  }

  const renderMessage = (message, index) => {
    const isUser = message.type === "user"
    const isBot = message.type === "bot"

    return (
      <Box
        key={message.id || index}
        sx={{
          display: "flex",
          flexDirection: isUser ? "row-reverse" : "row",
          mb: 2,
          alignItems: "flex-start",
        }}
      >
        {isBot && (
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: "secondary.main",
              color: "white",
              mt: 0.5,
            }}
          >
            <SmartToyIcon fontSize="small" />
          </Avatar>
        )}

        <Box
          sx={{
            maxWidth: "80%",
            bgcolor: isUser ? "primary.main" : "grey.100",
            color: isUser ? "white" : "text.primary",
            borderRadius: 2,
            px: 2,
            py: 1.5,
            mx: 1,
            position: "relative",
          }}
        >
          <Typography variant="body2" dangerouslySetInnerHTML={{ __html: formatContent(message.content) }} />

          {isBot && message.responseType && (
            <Box sx={{ mt: 1 }}>
              {message.responseType === "login_required" && (
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<LoginIcon />}
                  onClick={handleLoginRedirect}
                  sx={{ mt: 1 }}
                >
                  Đăng nhập
                </Button>
              )}

              {message.responseType === "payment_link" && message.responseData?.paymentUrl && (
                <Button
                  size="small"
                  variant="contained"
                  color="success"
                  startIcon={<LaunchIcon />}
                  onClick={() => window.open(message.responseData.paymentUrl, "_blank")}
                  sx={{ mt: 1 }}
                >
                  Thanh toán
                </Button>
              )}

              {(message.responseType === "membership_confirmation" ||
                message.responseType === "registration_confirmation") && (
                <Box sx={{ mt: 1 }}>
                  <Button size="small" variant="contained" onClick={() => sendMessage("Xác nhận")} sx={{ mr: 1 }}>
                    Xác nhận
                  </Button>
                  <Button size="small" variant="outlined" onClick={() => sendMessage("Hủy")}>
                    Hủy
                  </Button>
                </Box>
              )}
            </Box>
          )}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: isUser ? "flex-end" : "flex-start",
              mt: 0.5,
            }}
          >
            <Typography variant="caption" sx={{ opacity: 0.7, fontSize: "0.625rem" }}>
              {formatTime(message.timestamp)}
            </Typography>
          </Box>
        </Box>
      </Box>
    )
  }

  // ✅ FIXED: Quick replies with horizontal scroll
  const renderQuickReplies = () => {
    if (!quickReplies.length || awaitingConfirmation) return null

    return (
      <Box sx={{ p: 2, borderTop: "1px solid #e0e0e0" }}>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
          Gợi ý câu hỏi:
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 1,
            overflowX: "auto",
            scrollbarWidth: "thin",
            "&::-webkit-scrollbar": {
              height: "6px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#f1f1f1",
              borderRadius: "3px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#c1c1c1",
              borderRadius: "3px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: "#a8a8a8",
            },
            pb: 1,
          }}
        >
          {quickReplies.slice(0, 8).map((reply, index) => (
            <Chip
              key={index}
              label={reply.text}
              onClick={() => handleQuickReply(reply)}
              size="small"
              variant="outlined"
              clickable
              disabled={isSending || isLoading}
              sx={{
                flexShrink: 0,
                whiteSpace: "nowrap",
              }}
            />
          ))}
        </Box>
      </Box>
    )
  }

  const renderChatContent = () => (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Messages Area */}
      <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
        {/* Header Info - Now inside scrollable area */}
        <Box sx={{ p: 2, textAlign: "center", mb: 2 }}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              bgcolor: "secondary.main",
              color: "white",
              mx: "auto",
              mb: 1,
            }}
          >
            <SmartToyIcon />
          </Avatar>
          <Typography variant="body2" color="text.secondary">
            Trợ lý AI Elite Fitness
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {isAuthenticated ? `Xin chào ${user.fullName}!` : "Chat ẩn danh"}
          </Typography>
        </Box>

        {messages.length === 0 && (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Xin chào! Tôi có thể giúp bạn:
            </Typography>
            <Typography variant="caption" color="text.secondary" component="div">
              • Thông tin về gym
              <br />
              • Các gói membership
              <br />
              • Đặt lịch tập
              <br />• Hỗ trợ khác
            </Typography>
          </Box>
        )}

        {error && (
          <Alert severity="error" onClose={clearError} sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {messages.map((message, index) => renderMessage(message, index))}

        {isLoading && (
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: "secondary.main", mr: 1 }}>
              <SmartToyIcon fontSize="small" />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Đang trả lời...
              </Typography>
              <LinearProgress size="small" sx={{ mt: 0.5 }} />
            </Box>
          </Box>
        )}

        <div ref={messagesEndRef} />
      </Box>

      {renderQuickReplies()}

      <Divider />

      {/* Input Area */}
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Nhập câu hỏi..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isSending || isLoading}
            size="small"
            multiline
            maxRows={3}
          />
          <IconButton
            color="primary"
            onClick={handleSendMessage}
            disabled={!messageInput.trim() || isSending || isLoading}
          >
            <SendIcon />
          </IconButton>
        </Box>

        {!isAuthenticated && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
            Đăng nhập để sử dụng đầy đủ tính năng
          </Typography>
        )}
      </Box>
    </Box>
  )

  return (
    <Collapse in={isOpen}>
      <Card
        sx={{
          position: "fixed",
          bottom: lowPosition ? 20 : 160, // Move down when SpeedDial is hidden
          right: 20,
          width: 450,
          height: isMinimized ? 60 : 600,
          zIndex: 999,
          display: "flex",
          flexDirection: "column",
          boxShadow: 3,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            bgcolor: "secondary.main",
            color: "white",
            p: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <SmartToyIcon sx={{ mr: 1 }} />
            <Typography variant="h6">Trợ lý AI</Typography>
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
            {renderChatContent()}
          </CardContent>
        )}
      </Card>
    </Collapse>
  )
}

export default ChatbotWidget
