import React from "react"
import ChatSpeedDial from "./ChatSpeedDial"
import useUserStore from "../stores/useUserStore"

const ChatbotProvider = ({ children }) => {
  const { user } = useUserStore()

  // Show chat options for all users (authenticated and anonymous)
  // Hide for admin role if needed
  const shouldShowChat = !user || (user.role !== "admin" && user.role !== "staff")

  return (
    <>
      {children}
      {shouldShowChat && <ChatSpeedDial />}
    </>
  )
}

export default ChatbotProvider
