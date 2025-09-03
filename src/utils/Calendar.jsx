import React, { useState } from "react"
import { Calendar, dateFnsLocalizer } from "react-big-calendar"
import { format, parse, startOfWeek, getDay } from "date-fns"
import { vi } from "date-fns/locale"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { Box } from "@mui/material"

// Cấu hình localizer cho date-fns
const locales = {
  vi: vi,
}
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }), // tuần bắt đầu từ thứ 2
  getDay,
  locales,
})

export default function GymCalendar({ events }) {
  return (
    <Box sx={{ height: 600 }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView="week" // hiển thị dạng tuần
        views={["day", "week", "month"]}
        step={60} // slot 30 phút
        timeslots={2}
        style={{ height: "100%" }}
        components={{
          event: CustomEvent,
        }}
        messages={{
          week: "Tuần",
          day: "Ngày",
          month: "Tháng",
          today: "Hôm nay",
          previous: "Trước",
          next: "Tiếp",
        }}
      />
    </Box>
  )
}

import Tooltip from "@mui/material/Tooltip"

function CustomEvent({ event }) {
  return (
    <Tooltip
      title={
        <div>
          <div>
            <strong>{event.title}</strong>
          </div>
          <div>👤 HLV: {event.coach}</div>
          <div>📍 Phòng: {event.room}</div>
          <div>📝 Ghi chú: {event.description}</div>
        </div>
      }
      arrow
      placement="top"
    >
      <div>
        <strong>{event.title}</strong>
      </div>
    </Tooltip>
  )
}
