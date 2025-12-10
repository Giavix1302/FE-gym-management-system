import React, { useState, useEffect, useRef } from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Collapse,
  Divider,
  Button,
  Alert,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from "@mui/material"
import {
  SmartToy as SmartToyIcon,
  Close as CloseIcon,
  Send as SendIcon,
  Minimize as MinimizeIcon,
  Maximize as MaximizeIcon,
  Login as LoginIcon,
  Launch as LaunchIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Warning as WarningIcon,
} from "@mui/icons-material"

import useChatbotStore from "~/stores/useChatbotStore"
import useUserStore from "~/stores/useUserStore"

const ChatbotWidget = ({ onClose, lowPosition = false }) => {
  const {
    messages,
    isLoading,
    error,
    rateLimitInfo,
    isRateLimited,
    rateLimitError,
    sendMessage,
    loadConversationHistory,
    switchToAuthenticatedMode,
    clearError,
    initializeChatbot,
  } = useChatbotStore()

  const { user } = useUserStore()

  const [isOpen, setIsOpen] = useState(true) // Start open when controlled by SpeedDial
  const [isMinimized, setIsMinimized] = useState(false)
  const [messageInput, setMessageInput] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [showRateLimitDialog, setShowRateLimitDialog] = useState(false)
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [isFirstLoad, setIsFirstLoad] = useState(true)

  const messagesEndRef = useRef(null)
  const isAuthenticated = !!user

  // Initialize chatbot when component mounts
  useEffect(() => {
    initializeChatbot()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Handle authentication state change
  useEffect(() => {
    if (isAuthenticated) {
      switchToAuthenticatedMode()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  // Load data when widget opens
  useEffect(() => {
    const loadHistory = async () => {
      if (isOpen && !isMinimized) {
        setIsLoadingHistory(true)
        await loadConversationHistory()
        setIsLoadingHistory(false)
        setIsFirstLoad(false)
      }
    }
    loadHistory()
  }, [isOpen, isMinimized, loadConversationHistory])

  // Auto scroll to bottom when new messages or after loading history
  useEffect(() => {
    if (!isLoadingHistory) {
      // Scroll immediately to bottom after loading (instant for first load, smooth for new messages)
      scrollToBottom(isFirstLoad)
    }
  }, [messages, isLoadingHistory, isFirstLoad])

  const scrollToBottom = (instant = false) => {
    messagesEndRef.current?.scrollIntoView({ behavior: instant ? "instant" : "smooth" })
  }

  const handleClose = () => {
    setIsOpen(false)
    if (onClose) {
      onClose()
    }
  }

  const handleSendMessage = async () => {
    if (!messageInput.trim() || isSending || isRateLimited) return

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

  // Show warning when running low on messages
  useEffect(() => {
    if (rateLimitInfo && rateLimitInfo.remaining > 0) {
      const percentRemaining = (rateLimitInfo.remaining / rateLimitInfo.limit) * 100

      if (percentRemaining <= 20 && percentRemaining > 0) {
        const message =
          rateLimitInfo.type === "anonymous"
            ? `⚠️ Còn ${rateLimitInfo.remaining}/${rateLimitInfo.limit} lượt hỏi. Đăng nhập để được 100 lượt!`
            : `⚠️ Còn ${rateLimitInfo.remaining}/${rateLimitInfo.limit} lượt hỏi hôm nay.`

        console.warn(message)
      }
    }
  }, [rateLimitInfo])

  // Show dialog when rate limited
  useEffect(() => {
    if (isRateLimited && rateLimitError) {
      setShowRateLimitDialog(true)
    }
  }, [isRateLimited, rateLimitError])

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
    // Parse markdown-style images: ![alt](url)
    let formatted = content.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_match, alt, url) => {
      return `<img src="${url}" alt="${alt}" style="max-width: 100%; border-radius: 8px; margin: 8px 0; display: block;" />`
    })

    // Replace newlines with <br>
    formatted = formatted.replace(/\n/g, "<br>")

    return formatted
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

  const renderRateLimitDialog = () => {
    if (!rateLimitError) return null

    const { requiresLogin, resetAt } = rateLimitError
    const resetTime = resetAt ? new Date(resetAt).toLocaleString("vi-VN") : ""

    return (
      <Dialog open={showRateLimitDialog} onClose={() => setShowRateLimitDialog(false)}>
        <DialogTitle>{requiresLogin ? "🔐 Đăng nhập để tiếp tục" : "⏰ Đã hết lượt hỏi hôm nay"}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" gutterBottom>
            {requiresLogin
              ? "Bạn đã hết lượt hỏi miễn phí (15/ngày). Vui lòng đăng nhập để tiếp tục!"
              : "Bạn đã vượt quá giới hạn 100 tin nhắn/ngày. Vui lòng thử lại vào ngày mai!"}
          </Typography>
          {resetTime && (
            <Typography variant="caption" color="text.secondary">
              Reset vào lúc: {resetTime}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          {requiresLogin ? (
            <>
              <Button onClick={() => setShowRateLimitDialog(false)}>Đóng</Button>
              <Button variant="contained" onClick={handleLoginRedirect} startIcon={<LoginIcon />}>
                Đăng nhập
              </Button>
            </>
          ) : (
            <Button onClick={() => setShowRateLimitDialog(false)}>Đã hiểu</Button>
          )}
        </DialogActions>
      </Dialog>
    )
  }

  const renderChatContent = () => (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Rate Limit Badge */}
      {rateLimitInfo && !isLoadingHistory && (
        <Box sx={{ px: 2, pt: 2, pb: 1 }}>
          <Chip
            icon={
              rateLimitInfo.remaining / rateLimitInfo.limit <= 0.2 ? <WarningIcon /> : <HourglassEmptyIcon />
            }
            label={`${rateLimitInfo.remaining}/${rateLimitInfo.limit} lượt hỏi còn lại`}
            color={rateLimitInfo.remaining / rateLimitInfo.limit <= 0.2 ? "warning" : "default"}
            size="small"
            sx={{ width: "100%" }}
          />
          {rateLimitInfo.type === "anonymous" && !isAuthenticated && (
            <Button
              size="small"
              variant="text"
              startIcon={<LoginIcon />}
              onClick={handleLoginRedirect}
              sx={{ mt: 1, width: "100%", fontSize: "0.75rem" }}
            >
              Đăng nhập để được 100 lượt
            </Button>
          )}
        </Box>
      )}

      {/* Messages Area */}
      <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
        {/* Loading History State */}
        {isLoadingHistory && (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: "secondary.main",
                color: "white",
                mb: 2,
              }}
            >
              <SmartToyIcon fontSize="large" />
            </Avatar>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Đang tải lịch sử chat...
            </Typography>
            <LinearProgress sx={{ width: 200, mt: 2 }} />
          </Box>
        )}

        {/* Chat Content - Only show when not loading */}
        {!isLoadingHistory && (
          <>
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
                Trợ lý AI THE GYM
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
          </>
        )}
      </Box>

      <Divider />

      {/* Input Area */}
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder={isRateLimited ? "Đã hết lượt hỏi hôm nay" : "Nhập câu hỏi..."}
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isSending || isLoading || isRateLimited}
            size="small"
            multiline
            maxRows={3}
          />
          <IconButton
            color="primary"
            onClick={handleSendMessage}
            disabled={!messageInput.trim() || isSending || isLoading || isRateLimited}
          >
            <SendIcon />
          </IconButton>
        </Box>

        {!isAuthenticated && !isRateLimited && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
            Đăng nhập để sử dụng đầy đủ tính năng
          </Typography>
        )}

        {isRateLimited && (
          <Alert severity="error" sx={{ mt: 1 }}>
            Bạn đã hết lượt hỏi hôm nay. Vui lòng thử lại sau.
          </Alert>
        )}
      </Box>
    </Box>
  )

  return (
    <>
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

      {/* Rate Limit Dialog */}
      {renderRateLimitDialog()}
    </>
  )
}

export default ChatbotWidget
