import * as React from "react"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { TimePicker } from "@mui/x-date-pickers/TimePicker"

export default function TimeField({ label, value, setValue }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimePicker label={label} value={value} onChange={(newValue) => setValue(newValue)} />
    </LocalizationProvider>
  )
}
