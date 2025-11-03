import React, { useState } from "react"
import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
  CircularProgress,
  Alert,
  Button,
  Chip,
} from "@mui/material"
import {
  Notifications as NotificationsIcon,
  MarkEmailRead as MarkReadIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import { Tooltip } from "@mui/material"
import {
  useNotifications,
  useUnreadNotificationCount,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
  useDeleteNotification,
} from "../hooks/useNotificationStore"

const NotificationPanel = () => {
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState(null)
  const [page, setPage] = useState(1)
  const open = Boolean(anchorEl)

  // React Query hooks
  const {
    data: notificationsData,
    isLoading,
    error,
    refetch,
  } = useNotifications({
    page,
    limit: 10,
  })

  const unreadCount = useUnreadNotificationCount()
  const markAsRead = useMarkNotificationAsRead()
  const markAllAsRead = useMarkAllNotificationsAsRead()
  const deleteNotification = useDeleteNotification()

  const notifications = notificationsData?.notifications || []

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleNotificationClick = async (notification) => {
    // Mark as read if not already read
    if (!notification.isRead) {
      await markAsRead.mutateAsync(notification._id)
    }

    // Navigate to relevant page
    if (notification.navigationPath) {
      navigate(notification.navigationPath)
    }

    handleClose()
  }

  const handleMarkAllAsRead = async () => {
    await markAllAsRead.mutateAsync()
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case "USER_MEMBERSHIP_EXPIRING":
        return "📅"
      case "USER_UPCOMING_BOOKING":
        return "💪"
      case "USER_UPCOMING_CLASS_SESSION":
        return "🏃‍♂️"
      case "TRAINER_UPCOMING_BOOKING":
        return "👨‍🏫"
      case "TRAINER_UPCOMING_CLASS_SESSION":
        return "🎯"
      default:
        return "🔔"
    }
  }

  return (
    <>
      {/* Notification Icon - giữ nguyên style như Header cũ */}
      <Tooltip title="Thông báo">
        <IconButton
          onClick={handleClick}
          sx={{
            color: "#EDE7E3",
            "&:hover": { color: "#FFA62B" },
          }}
        >
          <Badge badgeContent={unreadCount.data} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      {/* Notification Menu - style match với Header cũ */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              width: 450,
              maxHeight: 500,
            },
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            px: 2,
            py: 1.5,
            borderBottom: "1px solid #e0e0e0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Thông báo
          </Typography>
          {unreadCount.data > 0 && (
            <Button
              size="small"
              onClick={handleMarkAllAsRead}
              disabled={markAllAsRead.isPending}
              sx={{ fontSize: "0.75rem" }}
            >
              Đọc tất cả
            </Button>
          )}
        </Box>

        {/* Content */}
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <MenuItem disabled>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Không thể tải thông báo
            </Typography>
          </MenuItem>
        ) : notifications.length > 0 ? (
          notifications.map((notification) => (
            <MenuItem
              key={notification._id}
              onClick={() => handleNotificationClick(notification)}
              sx={{
                display: "block",
                py: 1.5,
                px: 2,
                backgroundColor: !notification.isRead ? "#f5f5f5" : "transparent",
                "&:hover": {
                  backgroundColor: !notification.isRead ? "#eeeeee" : "#f9f9f9",
                },
                position: "relative",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                {/* Icon */}
                <Box sx={{ fontSize: "1.2rem", mt: 0.5, minWidth: "24px" }}>
                  {getNotificationIcon(notification.type)}
                </Box>

                {/* Content */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: !notification.isRead ? "bold" : "normal",
                        flex: 1,
                      }}
                    >
                      {notification.title}
                    </Typography>
                    {!notification.isRead && (
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: "error.main",
                          flexShrink: 0,
                        }}
                      />
                    )}
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      mb: 0.5,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {notification.message}
                  </Typography>

                  <Typography variant="caption" sx={{ color: "text.disabled" }}>
                    {notification.timeAgo}
                  </Typography>
                </Box>

                {/* Actions - hiện khi hover */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.5,
                    opacity: 0,
                    transition: "opacity 0.2s",
                    ".MuiMenuItem-root:hover &": {
                      opacity: 1,
                    },
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {!notification.isRead && (
                    <IconButton
                      size="small"
                      onClick={async (e) => {
                        e.stopPropagation()
                        await markAsRead.mutateAsync(notification._id)
                      }}
                      disabled={markAsRead.isPending}
                      sx={{ p: 0.5 }}
                    >
                      <MarkReadIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              </Box>
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Không có thông báo mới
            </Typography>
          </MenuItem>
        )}

        {/* Footer */}
        <Divider />
        <MenuItem
          onClick={handleClose}
          sx={{
            justifyContent: "center",
            color: "primary.main",
            fontWeight: "bold",
          }}
        >
          Xem tất cả thông báo
        </MenuItem>
      </Menu>
    </>
  )
}

export default NotificationPanel
