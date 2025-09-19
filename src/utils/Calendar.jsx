/* eslint-disable no-case-declarations */
import React, { useState } from "react"
import {
  Box,
  Button,
  ButtonGroup,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  Paper,
  Tooltip,
  Avatar,
  Divider,
} from "@mui/material"
import {
  Close as CloseIcon,
  Today as TodayIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  Description as DescriptionIcon,
  FitnessCenter as FitnessCenterIcon,
} from "@mui/icons-material"

// Tự định nghĩa các functions cần thiết thay cho date-fns
const format = (date, formatStr) => {
  const d = new Date(date)
  switch (formatStr) {
    case "dd":
      return d.getDate().toString().padStart(2, "0")
    case "EEEE, dd/MM":
      const days = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"]
      return `${days[d.getDay()]}, ${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}`
    case "MMMM yyyy":
      const months = [
        "Tháng 1",
        "Tháng 2",
        "Tháng 3",
        "Tháng 4",
        "Tháng 5",
        "Tháng 6",
        "Tháng 7",
        "Tháng 8",
        "Tháng 9",
        "Tháng 10",
        "Tháng 11",
        "Tháng 12",
      ]
      return `${months[d.getMonth()]} ${d.getFullYear()}`
    case "EEE":
      const shortDays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]
      return shortDays[d.getDay()]
    default:
      return d.toLocaleDateString("vi-VN")
  }
}

const parse = (str, formatStr, baseDate) => {
  return new Date(str)
}

const startOfWeek = (date, options = {}) => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (options.weekStartsOn === 1 ? (day === 0 ? -6 : 1) : 0)
  return new Date(d.setDate(diff))
}

const getDay = (date) => new Date(date).getDay()

// Component CustomEvent với MUI
function CustomEvent({ event, onClick }) {
  return (
    <Tooltip title="Click để xem chi tiết" arrow placement="top">
      <Chip
        label={event.title}
        onClick={() => onClick(event)}
        sx={{
          backgroundColor: "primary.main",
          color: "white",
          fontSize: "11px",
          height: "20px",
          width: "100%",
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "primary.dark",
            transform: "scale(1.02)",
          },
          transition: "all 0.2s ease",
          "& .MuiChip-label": {
            padding: "0 4px",
            fontWeight: "bold",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          },
        }}
      />
    </Tooltip>
  )
}

// Simplified Calendar component với MUI
function SimpleCalendar({ events, view, onView, date, onNavigate, onEventClick }) {
  const today = new Date()
  const currentHour = today.getHours()

  // Hàm format thời gian
  const formatTime = (date) => {
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }

  // Hàm xác định buổi dựa trên giờ
  const getTimeSlot = (hour) => {
    if (hour >= 8 && hour < 13) return "morning"
    if (hour >= 13 && hour < 17) return "afternoon"
    if (hour >= 17 && hour < 21) return "evening"
    return null
  }

  const renderWeekView = () => {
    const startDate = startOfWeek(date, { weekStartsOn: 1 })
    const days = []

    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(startDate)
      currentDay.setDate(startDate.getDate() + i)
      days.push(currentDay)
    }

    // Định nghĩa các buổi trong ngày với thời gian cụ thể
    const timeSlots = [
      { key: "morning", label: "Sáng", subLabel: "8h - 13h", startHour: 8, endHour: 13, totalMinutes: 300 },
      { key: "afternoon", label: "Chiều", subLabel: "13h - 17h", startHour: 13, endHour: 17, totalMinutes: 240 },
      { key: "evening", label: "Tối", subLabel: "17h - 21h", startHour: 17, endHour: 21, totalMinutes: 240 },
    ]

    // Hàm tính toán vị trí và chiều cao của event
    const calculateEventStyle = (event, timeSlot) => {
      const eventStart = new Date(event.start)
      const eventEnd = new Date(event.end)

      const eventStartHour = eventStart.getHours()
      const eventStartMinute = eventStart.getMinutes()
      const eventEndHour = eventEnd.getHours()
      const eventEndMinute = eventEnd.getMinutes()

      // Tính toán thời gian bắt đầu từ đầu buổi (phút)
      const startFromSlot = (eventStartHour - timeSlot.startHour) * 60 + eventStartMinute
      const endFromSlot = Math.min((eventEndHour - timeSlot.startHour) * 60 + eventEndMinute, timeSlot.totalMinutes)

      // Tính phần trăm vị trí và chiều cao
      const topPercent = (startFromSlot / timeSlot.totalMinutes) * 100
      const heightPercent = ((endFromSlot - startFromSlot) / timeSlot.totalMinutes) * 100

      return {
        position: "absolute",
        top: `${topPercent}%`,
        height: `${Math.max(heightPercent, 8)}%`, // Tối thiểu 8% để hiển thị
        left: "4px",
        right: "4px",
        zIndex: 1,
      }
    }

    // Hàm kiểm tra event có trong buổi không
    const isEventInTimeSlot = (event, timeSlot) => {
      const eventStart = new Date(event.start)
      const eventHour = eventStart.getHours()
      return eventHour >= timeSlot.startHour && eventHour < timeSlot.endHour
    }

    return (
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Header */}
        <Paper elevation={1}>
          <Box sx={{ display: "flex", borderBottom: "1px solid", borderColor: "divider" }}>
            <Box sx={{ width: 120, p: 1, borderRight: "1px solid", borderColor: "divider", bgcolor: "grey.50" }}>
              <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                Thời gian
              </Typography>
            </Box>
            {days.map((day, index) => (
              <Box
                key={index}
                sx={{
                  flex: 1,
                  p: 1,
                  borderRight: index < 6 ? "1px solid" : "none",
                  borderColor: "divider",
                  textAlign: "center",
                  bgcolor: "grey.50",
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                  {format(day, "EEEE, dd/MM")}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>

        {/* Time slots - Không có thanh cuốn */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {timeSlots.map((timeSlot) => (
            <Box
              key={timeSlot.key}
              sx={{
                display: "flex",
                flex: timeSlot.totalMinutes / 240, // Chia tỷ lệ theo thời gian thực
                minHeight: 150,
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <Box
                sx={{
                  width: 120,
                  p: 2,
                  borderRight: "1px solid",
                  borderColor: "divider",
                  bgcolor: "grey.50",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "primary.main" }}>
                  {timeSlot.label}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {timeSlot.subLabel}
                </Typography>
              </Box>
              {days.map((day, dayIndex) => {
                // Lấy tất cả events trong buổi này của ngày này và sắp xếp theo thời gian
                const dayEvents = events
                  .filter((event) => {
                    const eventDate = new Date(event.start)
                    return eventDate.toDateString() === day.toDateString() && isEventInTimeSlot(event, timeSlot)
                  })
                  .sort((a, b) => new Date(a.start) - new Date(b.start)) // Sắp xếp theo thời gian

                return (
                  <Box
                    key={dayIndex}
                    sx={{
                      flex: 1,
                      borderRight: dayIndex < 6 ? "1px solid" : "none",
                      borderColor: "divider",
                      "&:hover": { bgcolor: "grey.50" },
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {dayEvents.map((event, eventIndex) => (
                      <Box
                        key={eventIndex}
                        sx={{
                          ...calculateEventStyle(event, timeSlot),
                          display: "flex",
                          alignItems: "center",
                          px: 0.5,
                        }}
                      >
                        <Tooltip
                          title={`${event.title} - ${formatTime(event.start)} đến ${formatTime(event.end)}`}
                          arrow
                          placement="top"
                        >
                          <Chip
                            label={event.title}
                            onClick={() => onEventClick(event)}
                            size="small"
                            sx={{
                              backgroundColor: "primary.main",
                              color: "white",
                              fontSize: "10px",
                              height: "auto",
                              minHeight: "20px",
                              width: "100%",
                              cursor: "pointer",
                              "&:hover": {
                                backgroundColor: "primary.dark",
                                transform: "scale(1.02)",
                              },
                              transition: "all 0.2s ease",
                              "& .MuiChip-label": {
                                padding: "2px 4px",
                                fontWeight: "bold",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                lineHeight: 1.2,
                              },
                            }}
                          />
                        </Tooltip>
                      </Box>
                    ))}

                    {/* Hiển thị các đường kẻ giờ nhỏ để dễ nhìn */}
                    {Array.from({ length: timeSlot.endHour - timeSlot.startHour }, (_, i) => (
                      <Box
                        key={i}
                        sx={{
                          position: "absolute",
                          top: `${(i / (timeSlot.endHour - timeSlot.startHour)) * 100}%`,
                          left: 0,
                          right: 0,
                          height: "1px",
                          bgcolor: "divider",
                          opacity: 0.3,
                          zIndex: 0,
                        }}
                      />
                    ))}
                  </Box>
                )
              })}
            </Box>
          ))}
        </Box>
      </Box>
    )
  }

  const renderDayView = () => {
    const hours = Array.from({ length: 12 }, (_, i) => i + 8)
    const dayEvents = events.filter((event) => {
      const eventDate = new Date(event.start)
      return eventDate.toDateString() === date.toDateString()
    })

    return (
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Paper elevation={1} sx={{ p: 2, textAlign: "center", bgcolor: "primary.main", color: "white" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {format(date, "EEEE, dd/MM")}
          </Typography>
        </Paper>
        <Box sx={{ flex: 1, overflow: "auto" }}>
          {hours.map((hour) => {
            const hourEvents = dayEvents.filter((event) => {
              const eventDate = new Date(event.start)
              return eventDate.getHours() === hour
            })

            return (
              <Box
                key={hour}
                sx={{ display: "flex", minHeight: 60, borderBottom: "1px solid", borderColor: "divider" }}
              >
                <Box
                  sx={{
                    width: 100,
                    p: 1,
                    borderRight: "1px solid",
                    borderColor: "divider",
                    bgcolor: "grey.50",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {hour}:00
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, p: 1 }}>
                  {hourEvents.map((event, eventIndex) => (
                    <CustomEvent key={eventIndex} event={event} onClick={onEventClick} />
                  ))}
                </Box>
              </Box>
            )
          })}
        </Box>
      </Box>
    )
  }

  const renderMonthView = () => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = startOfWeek(firstDay, { weekStartsOn: 1 })
    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + 41)

    const days = []
    const current = new Date(startDate)
    while (current <= endDate) {
      days.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }

    return (
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Paper elevation={1} sx={{ p: 2, textAlign: "center", bgcolor: "primary.main", color: "white" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {format(date, "MMMM yyyy")}
          </Typography>
        </Paper>

        {/* Days header */}
        <Paper elevation={1}>
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
            {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day) => (
              <Box
                key={day}
                sx={{
                  textAlign: "center",
                  p: 1,
                  bgcolor: "grey.100",
                  borderRight: "1px solid",
                  borderColor: "divider",
                  "&:last-child": { borderRight: "none" },
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  {day}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>

        {/* Calendar grid */}
        <Box
          sx={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gridTemplateRows: "repeat(6, 1fr)",
            border: "1px solid",
            borderColor: "divider",
            borderTop: "none",
            minHeight: 480,
          }}
        >
          {days.slice(0, 42).map((day, index) => {
            const isCurrentMonth = day.getMonth() === month
            const dayEvents = events.filter((event) => {
              const eventDate = new Date(event.start)
              return eventDate.toDateString() === day.toDateString()
            })

            return (
              <Box
                key={index}
                sx={{
                  minHeight: 80,
                  height: "100%",
                  borderRight: (index + 1) % 7 !== 0 ? "1px solid" : "none",
                  borderBottom: index < 35 ? "1px solid" : "none",
                  borderColor: "divider",
                  bgcolor: isCurrentMonth ? "background.paper" : "grey.50",
                  opacity: isCurrentMonth ? 1 : 0.6,
                  "&:hover": { bgcolor: isCurrentMonth ? "grey.50" : "grey.100" },
                  p: 0.5,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: "bold", display: "block", mb: 0.5, flexShrink: 0 }}>
                  {day.getDate()}
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25, flex: 1, overflow: "hidden" }}>
                  {dayEvents.map((event, eventIndex) => (
                    <CustomEvent key={eventIndex} event={event} onClick={onEventClick} />
                  ))}
                </Box>
              </Box>
            )
          })}
        </Box>
      </Box>
    )
  }

  return (
    <Paper elevation={2} sx={{ height: "100%", overflow: "hidden" }}>
      {view === "week" && renderWeekView()}
      {view === "day" && renderDayView()}
      {view === "month" && renderMonthView()}
    </Paper>
  )
}

export default function GymCalendar() {
  const [currentView, setCurrentView] = useState("week")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const events = [
    {
      title: "Yoga Class",
      start: new Date(2025, 8, 22, 9, 0),
      end: new Date(2025, 8, 22, 10, 30), // Kéo dài 1.5 tiếng
      coach: "Nguyễn Thị A",
      room: "Phòng 101",
      description: "Lớp yoga cho người mới bắt đầu, tập trung vào các tư thế cơ bản và hơi thở",
    },
    {
      title: "Gym Training",
      start: new Date(2025, 8, 23, 14, 0),
      end: new Date(2025, 8, 23, 15, 30), // 1.5 tiếng
      coach: "Trần Văn B",
      room: "Phòng tập",
      description: "Luyện tập gym cơ bản với trọng lượng, phù hợp cho người mới",
    },
    {
      title: "Aerobic",
      start: new Date(2025, 8, 24, 18, 0),
      end: new Date(2025, 8, 24, 19, 0), // 1 tiếng
      coach: "Lê Thị C",
      room: "Phòng nhảy",
      description: "Lớp aerobic giảm cân, tăng cường sức khỏe tim mạch",
    },
    {
      title: "Swimming",
      start: new Date(2025, 8, 19, 16, 0),
      end: new Date(2025, 8, 19, 17, 0), // 1 tiếng
      coach: "Phạm Văn D",
      room: "Hồ bơi",
      description: "Lớp bơi cơ bản, dạy các kỹ thuật bơi lội cho người mới",
    },
    {
      title: "Cardio",
      start: new Date(2025, 8, 22, 8, 30),
      end: new Date(2025, 8, 22, 9, 15), // 45 phút, trước Yoga
      coach: "Hoàng Văn E",
      room: "Phòng cardio",
      description: "Luyện tập cardio cường độ cao",
    },
    {
      title: "Pilates",
      start: new Date(2025, 8, 22, 11, 0),
      end: new Date(2025, 8, 22, 12, 15), // 1 tiếng 15 phút
      coach: "Mai Thị F",
      room: "Phòng 102",
      description: "Lớp pilates tăng cường sức mạnh cốt lõi",
    },
  ]

  const handleNavigate = (action) => {
    const newDate = new Date(currentDate)

    switch (currentView) {
      case "day":
        newDate.setDate(currentDate.getDate() + (action === "next" ? 1 : -1))
        break
      case "week":
        newDate.setDate(currentDate.getDate() + (action === "next" ? 7 : -7))
        break
      case "month":
        newDate.setMonth(currentDate.getMonth() + (action === "next" ? 1 : -1))
        break
    }

    setCurrentDate(newDate)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const handleEventClick = (event) => {
    setSelectedEvent(event)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedEvent(null)
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Box sx={{ height: 800, p: 3 }}>
      {/* Navigation */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, bgcolor: "grey.50" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton onClick={() => handleNavigate("prev")} color="primary" sx={{ bgcolor: "background.paper" }}>
              <ChevronLeftIcon />
            </IconButton>

            <Button variant="contained" startIcon={<TodayIcon />} onClick={goToToday} sx={{ mx: 1 }}>
              Hôm nay
            </Button>

            <IconButton onClick={() => handleNavigate("next")} color="primary" sx={{ bgcolor: "background.paper" }}>
              <ChevronRightIcon />
            </IconButton>
          </Box>

          <ButtonGroup variant="contained" size="small">
            <Button onClick={() => setCurrentView("day")} variant={currentView === "day" ? "contained" : "outlined"}>
              Ngày
            </Button>
            <Button onClick={() => setCurrentView("week")} variant={currentView === "week" ? "contained" : "outlined"}>
              Tuần
            </Button>
            <Button
              onClick={() => setCurrentView("month")}
              variant={currentView === "month" ? "contained" : "outlined"}
            >
              Tháng
            </Button>
          </ButtonGroup>
        </Box>
      </Paper>

      {/* Calendar */}
      <Box sx={{ height: "calc(100% - 120px)" }}>
        <SimpleCalendar
          events={events}
          view={currentView}
          onView={setCurrentView}
          date={currentDate}
          onNavigate={setCurrentDate}
          onEventClick={handleEventClick}
        />
      </Box>

      {/* Modal with MUI Dialog */}
      <Dialog
        open={isModalOpen}
        onClose={closeModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box>
              <Typography variant="h5" component="div" sx={{ fontWeight: "bold", mb: 0.5 }}>
                {selectedEvent?.title}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                {selectedEvent && formatDate(selectedEvent.start)}
              </Typography>
            </Box>
            <IconButton onClick={closeModal} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ pt: 3 }}>
          {selectedEvent && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Time */}
              <Card variant="outlined">
                <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, "&:last-child": { pb: 2 } }}>
                  <Avatar sx={{ bgcolor: "primary.light" }}>
                    <ScheduleIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 0.5 }}>
                      Thời gian
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatTime(selectedEvent.start)} - {formatTime(selectedEvent.end)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              {/* Coach */}
              <Card variant="outlined">
                <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, "&:last-child": { pb: 2 } }}>
                  <Avatar sx={{ bgcolor: "success.light" }}>
                    <PersonIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 0.5 }}>
                      Huấn luyện viên
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedEvent.coach}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              {/* Room */}
              <Card variant="outlined">
                <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, "&:last-child": { pb: 2 } }}>
                  <Avatar sx={{ bgcolor: "warning.light" }}>
                    <LocationIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 0.5 }}>
                      Địa điểm
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedEvent.room}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              {/* Description */}
              <Card variant="outlined">
                <CardContent sx={{ "&:last-child": { pb: 2 } }}>
                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                    <Avatar sx={{ bgcolor: "info.light", mt: 0.5 }}>
                      <DescriptionIcon />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                        Mô tả
                      </Typography>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 2,
                          bgcolor: "grey.50",
                          borderStyle: "dashed",
                        }}
                      >
                        <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                          {selectedEvent.description}
                        </Typography>
                      </Paper>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          )}
        </DialogContent>

        <Divider />

        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button onClick={closeModal} variant="outlined" color="inherit">
            Đóng
          </Button>
          <Button variant="contained" startIcon={<FitnessCenterIcon />} sx={{ ml: 1 }}>
            Tham gia lớp học
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
