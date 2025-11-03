import React, { useState } from "react"
import { Box, SpeedDial, SpeedDialIcon, SpeedDialAction, Badge } from "@mui/material"
import { Chat as ChatIcon, SmartToy as SmartToyIcon, Close as CloseIcon } from "@mui/icons-material"

import FloatingChatWidget from "./FloatingChatWidget"
import ChatbotWidget from "./ChatbotWidget"
import useChatStore from "~/stores/useChatStore"
import useChatbotStore from "~/stores/useChatbotStore"
import useUserStore from "~/stores/useUserStore"

const ChatSpeedDial = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeChat, setActiveChat] = useState(null) // 'human' | 'bot' | null

  const { unreadCount } = useChatStore()
  const { user } = useUserStore()

  // Don't render if user is not eligible for human chat
  const canUseHumanChat = user?._id && (user.role === "user" || user.role === "pt")

  const actions = [
    ...(canUseHumanChat
      ? [
          {
            icon: <ChatIcon />,
            name: "Nhắn tin",
            key: "human",
            badge: unreadCount,
          },
        ]
      : []),
    {
      icon: <SmartToyIcon />,
      name: "AI Chatbot",
      key: "bot",
      badge: 0, // Can add chatbot unread count later
    },
  ]

  const handleActionClick = (actionKey) => {
    setActiveChat(actionKey)
    setIsOpen(false) // Close SpeedDial
  }

  const handleCloseChat = () => {
    setActiveChat(null)
    setIsOpen(false)
  }

  // If a chat is active, don't show SpeedDial and move chat down
  if (activeChat === "human") {
    return <FloatingChatWidget onClose={handleCloseChat} lowPosition={true} />
  }

  if (activeChat === "bot") {
    return <ChatbotWidget onClose={handleCloseChat} lowPosition={true} />
  }

  // Calculate total badge count
  const totalBadgeCount = actions.reduce((sum, action) => sum + (action.badge || 0), 0)

  return (
    <Box sx={{ position: "fixed", bottom: 16, right: 16, zIndex: 1000 }}>
      <SpeedDial
        ariaLabel="Chat options"
        sx={{ position: "static" }}
        icon={
          <Badge badgeContent={totalBadgeCount} color="error">
            <SpeedDialIcon icon={<ChatIcon />} openIcon={<CloseIcon />} />
          </Badge>
        }
        open={isOpen}
        onOpen={() => setIsOpen(true)}
        onClose={() => setIsOpen(false)}
        direction="up"
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.key}
            icon={
              action.badge > 0 ? (
                <Badge badgeContent={action.badge} color="error">
                  {action.icon}
                </Badge>
              ) : (
                action.icon
              )
            }
            tooltipTitle={action.name}
            onClick={() => handleActionClick(action.key)}
          />
        ))}
      </SpeedDial>
    </Box>
  )
}

export default ChatSpeedDial
